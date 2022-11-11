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

},"odata.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_odata/server/odata.coffee                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  var MeteorODataAPIV4Router, MeteorODataRouter, ODataRouter, app, express;
  MeteorODataRouter = require('@steedos/core').MeteorODataRouter;
  ODataRouter = require('@steedos/core').ODataRouter;
  express = require('express');
  app = express.Router();
  app.use('/api/odata/v4', MeteorODataRouter);
  MeteorODataAPIV4Router = require('@steedos/core').MeteorODataAPIV4Router;

  if (MeteorODataAPIV4Router) {
    app.use('/api/v4', MeteorODataAPIV4Router);
  }

  WebApp.connectHandlers.use(app);
  return _.each(Creator.steedosSchema.getDataSources(), function (datasource, name) {
    var otherApp;

    if (name !== 'default') {
      otherApp = express.Router();
      otherApp.use("/api/odata/" + name, ODataRouter);
      return WebApp.connectHandlers.use(otherApp);
    }
  });
});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL29iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21pZGRsZXdhcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWlkZGxld2FyZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsImdldFVzZXJRdWVyeVNlbGVjdG9yIiwidXNlclZhbGlkYXRvciIsIkF1dGgiLCJNYXRjaCIsIldoZXJlIiwidXNlciIsImNoZWNrIiwiaWQiLCJPcHRpb25hbCIsIlN0cmluZyIsInVzZXJuYW1lIiwiZW1haWwiLCJfIiwia2V5cyIsImxlbmd0aCIsIkVycm9yIiwibG9naW5XaXRoUGFzc3dvcmQiLCJwYXNzd29yZCIsImF1dGhUb2tlbiIsImF1dGhlbnRpY2F0aW5nVXNlciIsImF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yIiwiaGFzaGVkVG9rZW4iLCJwYXNzd29yZFZlcmlmaWNhdGlvbiIsInJlZiIsInNwYWNlX3VzZXJzIiwic3BhY2VzIiwiTWV0ZW9yIiwidXNlcnMiLCJmaW5kT25lIiwic2VydmljZXMiLCJBY2NvdW50cyIsIl9jaGVja1Bhc3N3b3JkIiwiZXJyb3IiLCJfZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbiIsIl9oYXNoU3RhbXBlZFRva2VuIiwiX2luc2VydEhhc2hlZExvZ2luVG9rZW4iLCJfaWQiLCJkYiIsImZpbmQiLCJmZXRjaCIsImVhY2giLCJzdSIsInNwYWNlIiwiaW5kZXhPZiIsImFkbWlucyIsInB1c2giLCJuYW1lIiwidG9rZW4iLCJ1c2VySWQiLCJhZG1pblNwYWNlcyIsImVudiIsInByb2Nlc3MiLCJOT0RFX0VOViIsImlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlIiwiZXJyIiwicmVxIiwicmVzIiwic3RhdHVzQ29kZSIsInN0YXR1cyIsIm1zZyIsInN0YWNrIiwidG9TdHJpbmciLCJjb25zb2xlIiwiaGVhZGVyc1NlbnQiLCJzb2NrZXQiLCJkZXN0cm95Iiwic2V0SGVhZGVyIiwiQnVmZmVyIiwiYnl0ZUxlbmd0aCIsIm1ldGhvZCIsImVuZCIsInNoYXJlIiwiUm91dGUiLCJhcGkiLCJwYXRoIiwib3B0aW9ucyIsImVuZHBvaW50czEiLCJlbmRwb2ludHMiLCJwcm90b3R5cGUiLCJhZGRUb0FwaSIsImF2YWlsYWJsZU1ldGhvZHMiLCJhbGxvd2VkTWV0aG9kcyIsImZ1bGxQYXRoIiwicmVqZWN0ZWRNZXRob2RzIiwic2VsZiIsImNvbnRhaW5zIiwiX2NvbmZpZyIsInBhdGhzIiwiZXh0ZW5kIiwiZGVmYXVsdE9wdGlvbnNFbmRwb2ludCIsIl9yZXNvbHZlRW5kcG9pbnRzIiwiX2NvbmZpZ3VyZUVuZHBvaW50cyIsImZpbHRlciIsInJlamVjdCIsImFwaVBhdGgiLCJlbmRwb2ludCIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJkb25lRnVuYyIsImVuZHBvaW50Q29udGV4dCIsInJlc3BvbnNlRGF0YSIsInJlc3BvbnNlSW5pdGlhdGVkIiwidXJsUGFyYW1zIiwicGFyYW1zIiwicXVlcnlQYXJhbXMiLCJxdWVyeSIsImJvZHlQYXJhbXMiLCJib2R5IiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZG9uZSIsIl9jYWxsRW5kcG9pbnQiLCJlcnJvcjEiLCJoZWFkZXJzIiwiX3Jlc3BvbmQiLCJtZXNzYWdlIiwiam9pbiIsInRvVXBwZXJDYXNlIiwiaXNGdW5jdGlvbiIsImFjdGlvbiIsInJlZjEiLCJyZWYyIiwicm9sZVJlcXVpcmVkIiwidW5pb24iLCJpc0VtcHR5IiwiYXV0aFJlcXVpcmVkIiwic3BhY2VSZXF1aXJlZCIsImludm9jYXRpb24iLCJfYXV0aEFjY2VwdGVkIiwiX3JvbGVBY2NlcHRlZCIsIl9zcGFjZUFjY2VwdGVkIiwiRERQQ29tbW9uIiwiTWV0aG9kSW52b2NhdGlvbiIsImlzU2ltdWxhdGlvbiIsImNvbm5lY3Rpb24iLCJyYW5kb21TZWVkIiwibWFrZVJwY1NlZWQiLCJERFAiLCJfQ3VycmVudEludm9jYXRpb24iLCJ3aXRoVmFsdWUiLCJjYWxsIiwiX2F1dGhlbnRpY2F0ZSIsImF1dGgiLCJ1c2VyU2VsZWN0b3IiLCJzcGFjZV91c2Vyc19jb3VudCIsInNwYWNlSWQiLCJjb3VudCIsImludGVyc2VjdGlvbiIsInJvbGVzIiwiZGVmYXVsdEhlYWRlcnMiLCJkZWxheUluTWlsbGlzZWNvbmRzIiwibWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMiLCJyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byIsInNlbmRSZXNwb25zZSIsIl9sb3dlckNhc2VLZXlzIiwibWF0Y2giLCJwcmV0dHlKc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlSGVhZCIsIndyaXRlIiwiTWF0aCIsInJhbmRvbSIsInNldFRpbWVvdXQiLCJvYmplY3QiLCJjaGFpbiIsInBhaXJzIiwibWFwIiwiYXR0ciIsInRvTG93ZXJDYXNlIiwidmFsdWUiLCJDb29raWVzIiwiT2RhdGFSZXN0aXZ1cyIsImJhc2ljQXV0aCIsIml0ZW0iLCJpIiwibCIsImNvcnNIZWFkZXJzIiwiX3JvdXRlcyIsInVzZURlZmF1bHRBdXRoIiwidmVyc2lvbiIsIl91c2VyIiwiY29va2llcyIsImdldCIsIl9oYXNoTG9naW5Ub2tlbiIsImVuYWJsZUNvcnMiLCJzbGljZSIsImxhc3QiLCJfaW5pdEF1dGgiLCJ1c2VBdXRoIiwid2FybiIsImFkZFJvdXRlIiwicm91dGUiLCJhZGRDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FbmRwb2ludHMiLCJjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMiLCJlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24iLCJlbnRpdHlSb3V0ZUVuZHBvaW50cyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwibWV0aG9kcyIsIm1ldGhvZHNPbkNvbGxlY3Rpb24iLCJyb3V0ZU9wdGlvbnMiLCJfdXNlckNvbGxlY3Rpb25FbmRwb2ludHMiLCJfY29sbGVjdGlvbkVuZHBvaW50cyIsIl9uYW1lIiwiY29uZmlndXJlZEVuZHBvaW50IiwiZW5kcG9pbnRPcHRpb25zIiwibWV0aG9kVHlwZSIsImNsb25lIiwiZW50aXR5Iiwic2VsZWN0b3IiLCJkYXRhIiwicHV0IiwiZW50aXR5SXNVcGRhdGVkIiwidXBkYXRlIiwiJHNldCIsInJlbW92ZSIsInBvc3QiLCJlbnRpdHlJZCIsImluc2VydCIsImdldEFsbCIsImVudGl0aWVzIiwiZmllbGRzIiwicHJvZmlsZSIsImNyZWF0ZVVzZXIiLCJsb2dvdXQiLCJlIiwiZXh0cmFEYXRhIiwic2VhcmNoUXVlcnkiLCJyZWFzb24iLCJvbkxvZ2dlZEluIiwiZXh0cmEiLCJpbmRleCIsInRva2VuRmllbGROYW1lIiwidG9rZW5Mb2NhdGlvbiIsInRva2VuUGF0aCIsInRva2VuUmVtb3ZhbFF1ZXJ5IiwidG9rZW5Ub1JlbW92ZSIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwiJHB1bGwiLCJvbkxvZ2dlZE91dCIsInN0YXJ0dXAiLCJnZXRPYmplY3QiLCJnZXRPYmplY3RzIiwib2JqZWN0X25hbWVzIiwic3BsaXQiLCJmb3JFYWNoIiwib2JqZWN0X25hbWUiLCJvYmplY3RfcGVybWlzc2lvbnMiLCJwc2V0cyIsInBzZXRzQWRtaW4iLCJwc2V0c0N1cnJlbnQiLCJwc2V0c1VzZXIiLCJDcmVhdG9yIiwiT2JqZWN0cyIsImdldE9iamVjdE5hbWUiLCJnZXRDb2xsZWN0aW9uIiwiYXNzaWduZWRfYXBwcyIsImdldE9iamVjdFBlcm1pc3Npb25zIiwiYmluZCIsImxpc3Rfdmlld3MiLCJwZXJtaXNzaW9uX3NldCIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwiYWxsb3dDcmVhdGUiLCJtb2RpZnlBbGxSZWNvcmRzIiwiZmllbGQiLCJrZXkiLCJfZmllbGQiLCJ1bmVkaXRhYmxlX2ZpZWxkcyIsInJlYWRvbmx5IiwidW5yZWFkYWJsZV9maWVsZHMiLCJTdGVlZG9zT0RhdGEiLCJBUElfUEFUSCIsIm5leHQiLCJfb2JqIiwiU3RlZWRvcyIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJzZW5kUmVzdWx0IiwiY29kZSIsImVycm9ycyIsIk1ldGVvck9EYXRhQVBJVjRSb3V0ZXIiLCJNZXRlb3JPRGF0YVJvdXRlciIsIk9EYXRhUm91dGVyIiwiYXBwIiwiZXhwcmVzcyIsIlJvdXRlciIsInVzZSIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInN0ZWVkb3NTY2hlbWEiLCJnZXREYXRhU291cmNlcyIsImRhdGFzb3VyY2UiLCJvdGhlckFwcCIsIkZpYmVyIiwiYXV0aG9yaXphdGlvbkNhY2hlIiwiTWlkZGxld2FyZSIsImFwcF9pZCIsImFwcF9sb2dpbl90b2tlbiIsImNsaWVudF9pZCIsImlzQXV0aGVkIiwibG9naW5Ub2tlbnMiLCJyZXN1bHQiLCJhY2Nlc3NfdG9rZW4iLCJsb2ciLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJwYXJzZSIsInBhc3MiLCJyZXN1bWUiLCJ0IiwicnVuIiwiU2VydmljZURvY3VtZW50IiwiU2VydmljZU1ldGFkYXRhIiwiX0JPT0xFQU5fVFlQRVMiLCJfREFURVRJTUVfT0ZGU0VUX1RZUEVTIiwiX05BTUVTUEFDRSIsIl9OVU1CRVJfVFlQRVMiLCJnZXRPYmplY3RzT2RhdGFTY2hlbWEiLCJjb250YWluZXJfc2NoZW1hIiwiZW50aXRpZXNfc2NoZW1hIiwic2NoZW1hIiwiVkVSU0lPTiIsImRhdGFTZXJ2aWNlcyIsIm5hbWVzcGFjZSIsImVudGl0eVR5cGUiLCJhbm5vdGF0aW9ucyIsIkNvbGxlY3Rpb25zIiwibGlzdCIsIl9vYmplY3QiLCJlbnRpdGllIiwibmF2aWdhdGlvblByb3BlcnR5IiwicHJvcGVydHkiLCJlbmFibGVfYXBpIiwicHJvcGVydHlSZWYiLCJjb21wdXRlZEtleSIsIl9rZXkiLCJ0YXJnZXQiLCJhbm5vdGF0aW9uIiwidHlwZSIsIm51bGxhYmxlIiwiZmllbGRfbmFtZSIsIl9wcm9wZXJ0eSIsInJlZmVyZW5jZV90byIsInByZWNpc2lvbiIsInJlcXVpcmVkIiwiaXNBcnJheSIsInIiLCJyZWZlcmVuY2Vfb2JqIiwiRVhQQU5EX0ZJRUxEX1NVRkZJWCIsInBhcnRuZXIiLCJfcmVfbmFtZSIsInJlZmVyZW50aWFsQ29uc3RyYWludCIsInJlZmVyZW5jZWRQcm9wZXJ0eSIsImVudGl0eUNvbnRhaW5lciIsImVudGl0eVNldCIsIl9ldCIsImsiLCJTdGVlZG9zT2RhdGFBUEkiLCJBVVRIUkVRVUlSRUQiLCJjb250ZXh0Iiwic2VydmljZURvY3VtZW50IiwiZ2V0TWV0YURhdGFQYXRoIiwicHJvY2Vzc01ldGFkYXRhSnNvbiIsImRvY3VtZW50IiwiTUVUQURBVEFfUEFUSCIsInNlcnZpY2VNZXRhZGF0YSIsImdldFJvb3RQYXRoIiwiYWJzb2x1dGVVcmwiLCJnZXRPRGF0YVBhdGgiLCJpc1NlcnZlciIsImdldE9EYXRhQ29udGV4dFBhdGgiLCJnZXRPRGF0YU5leHRMaW5rUGF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7O0FBQXJCO0FBQ0FDLE9BQU8sQ0FBQyx5QkFBRCxDQUFQOztBQUdBSixnQkFBZ0IsQ0FBQztBQUNoQixnQkFBYyxRQURFO0FBRWhCLCtCQUE2QixRQUZiO0FBR2hCLCtCQUE2QjtBQUhiLENBQUQsRUFJYixlQUphLENBQWhCLEM7Ozs7Ozs7Ozs7OztBQ0pBLElBQUFLLG9CQUFBLEVBQUFDLGFBQUE7QUFBQSxLQUFDQyxJQUFELFVBQUNBLElBQUQsR0FBVSxFQUFWLEUsQ0FFQTs7O0FBR0FELGdCQUFnQkUsTUFBTUMsS0FBTixDQUFZLFVBQUNDLElBQUQ7QUFDM0JDLFFBQU1ELElBQU4sRUFDQztBQUFBRSxRQUFJSixNQUFNSyxRQUFOLENBQWVDLE1BQWYsQ0FBSjtBQUNBQyxjQUFVUCxNQUFNSyxRQUFOLENBQWVDLE1BQWYsQ0FE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QU8wQixhQUFhOEYsV0FBYixDQUF5QmhPLE9BQXpCLEtBQW9DLE1BQUl3RyxXQUF4QyxDQUFQO0FBRDJCLENBQTVCOztBQUdBLElBQUcvTixPQUFPMFYsUUFBVjtBQUNDakcsZUFBYXlGLGVBQWIsR0FBK0IsVUFBQzNOLE9BQUQ7QUFDOUIsV0FBT2tJLGFBQWE4RixXQUFiLENBQXlCaE8sT0FBekIsS0FBb0MsTUFBSWtJLGFBQWE0RixhQUFyRCxDQUFQO0FBRDhCLEdBQS9COztBQUdBNUYsZUFBYWtHLG1CQUFiLEdBQW1DLFVBQUNwTyxPQUFELEVBQVV3RyxXQUFWO0FBQ2xDLFdBQU8wQixhQUFheUYsZUFBYixDQUE2QjNOLE9BQTdCLEtBQXdDLE1BQUl3RyxXQUE1QyxDQUFQO0FBRGtDLEdBQW5DOztBQUVBMEIsZUFBYW1HLG9CQUFiLEdBQW9DLFVBQUNyTyxPQUFELEVBQVN3RyxXQUFUO0FBQ25DLFdBQU8wQixhQUFhOEYsV0FBYixDQUF5QmhPLE9BQXpCLEtBQW9DLE1BQUl3RyxXQUF4QyxDQUFQO0FBRG1DLEdBQXBDOztBQUlBLE9BQUMrRyxlQUFELEdBQW1CLElBQUk1TCxhQUFKLENBQ2xCO0FBQUE5RSxhQUFTcUwsYUFBYUMsUUFBdEI7QUFDQWpHLG9CQUFnQixJQURoQjtBQUVBdkIsZ0JBQVksSUFGWjtBQUdBNkIsZ0JBQVksSUFIWjtBQUlBcEMsb0JBQ0M7QUFBQSxzQkFBZ0I7QUFBaEI7QUFMRCxHQURrQixDQUFuQjtBQ2lCQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZml4IHdhcm5pbmc6IHh4eCBub3QgaW5zdGFsbGVkXG5yZXF1aXJlKFwiYmFzaWMtYXV0aC9wYWNrYWdlLmpzb25cIik7XG5cbmltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHQnYmFzaWMtYXV0aCc6ICdeMi4wLjEnLFxuXHQnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YSc6IFwiXjAuMS42XCIsXG5cdFwib2RhdGEtdjQtc2VydmljZS1kb2N1bWVudFwiOiBcIl4wLjAuM1wiLFxufSwgJ3N0ZWVkb3M6b2RhdGEnKTtcbiIsIkBBdXRoIG9yPSB7fVxuXG4jIyNcblx0QSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuIyMjXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUgKHVzZXIpIC0+XG5cdGNoZWNrIHVzZXIsXG5cdFx0aWQ6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuXHRcdHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcblx0XHRlbWFpbDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG5cblx0aWYgXy5rZXlzKHVzZXIpLmxlbmd0aCBpcyBub3QgMVxuXHRcdHRocm93IG5ldyBNYXRjaC5FcnJvciAnVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCdcblxuXHRyZXR1cm4gdHJ1ZVxuXG5cbiMjI1xuXHRSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4jIyNcbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gKHVzZXIpIC0+XG5cdGlmIHVzZXIuaWRcblx0XHRyZXR1cm4geydfaWQnOiB1c2VyLmlkfVxuXHRlbHNlIGlmIHVzZXIudXNlcm5hbWVcblx0XHRyZXR1cm4geyd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWV9XG5cdGVsc2UgaWYgdXNlci5lbWFpbFxuXHRcdHJldHVybiB7J2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbH1cblxuXHQjIFdlIHNob3VsZG4ndCBiZSBoZXJlIGlmIHRoZSB1c2VyIG9iamVjdCB3YXMgcHJvcGVybHkgdmFsaWRhdGVkXG5cdHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcidcblxuXG4jIyNcblx0TG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXG4jIyNcbkBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gKHVzZXIsIHBhc3N3b3JkKSAtPlxuXHRpZiBub3QgdXNlciBvciBub3QgcGFzc3dvcmRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHQjIFZhbGlkYXRlIHRoZSBsb2dpbiBpbnB1dCB0eXBlc1xuXHRjaGVjayB1c2VyLCB1c2VyVmFsaWRhdG9yXG5cdGNoZWNrIHBhc3N3b3JkLCBTdHJpbmdcblxuXHQjIFJldHJpZXZlIHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG5cdGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcilcblx0YXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpXG5cblx0aWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXHRpZiBub3QgYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzPy5wYXNzd29yZFxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdCMgQXV0aGVudGljYXRlIHRoZSB1c2VyJ3MgcGFzc3dvcmRcblx0cGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCBhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkXG5cdGlmIHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0IyBBZGQgYSBuZXcgYXV0aCB0b2tlbiB0byB0aGUgdXNlcidzIGFjY291bnRcblx0YXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKVxuXHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxuXHRBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlblxuXG5cdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZH0pLmZldGNoKClcblx0c3BhY2VzID0gW11cblx0Xy5lYWNoIHNwYWNlX3VzZXJzLCAoc3UpLT5cblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKVxuXHRcdCMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xuXHRcdGlmIHNwYWNlICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpPj0wXG5cdFx0XHRzcGFjZXMucHVzaFxuXHRcdFx0XHRfaWQ6IHNwYWNlLl9pZFxuXHRcdFx0XHRuYW1lOiBzcGFjZS5uYW1lXG5cdHJldHVybiB7YXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgYWRtaW5TcGFjZXM6IHNwYWNlc31cbiIsInZhciBnZXRVc2VyUXVlcnlTZWxlY3RvciwgdXNlclZhbGlkYXRvcjtcblxudGhpcy5BdXRoIHx8ICh0aGlzLkF1dGggPSB7fSk7XG5cblxuLypcblx0QSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuICovXG5cbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbih1c2VyKSB7XG4gIGNoZWNrKHVzZXIsIHtcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKVxuICB9KTtcbiAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggPT09ICExKSB7XG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKCdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuXG4vKlxuXHRSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4gKi9cblxuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSBmdW5jdGlvbih1c2VyKSB7XG4gIGlmICh1c2VyLmlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdfaWQnOiB1c2VyLmlkXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWVcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIuZW1haWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJyk7XG59O1xuXG5cbi8qXG5cdExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuICovXG5cbnRoaXMuQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3N3b3JkKSB7XG4gIHZhciBhdXRoVG9rZW4sIGF1dGhlbnRpY2F0aW5nVXNlciwgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IsIGhhc2hlZFRva2VuLCBwYXNzd29yZFZlcmlmaWNhdGlvbiwgcmVmLCBzcGFjZV91c2Vycywgc3BhY2VzO1xuICBpZiAoIXVzZXIgfHwgIXBhc3N3b3JkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBjaGVjayh1c2VyLCB1c2VyVmFsaWRhdG9yKTtcbiAgY2hlY2socGFzc3dvcmQsIFN0cmluZyk7XG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcik7XG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKTtcbiAgaWYgKCFhdXRoZW50aWNhdGluZ1VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGlmICghKChyZWYgPSBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXMpICE9IG51bGwgPyByZWYucGFzc3dvcmQgOiB2b2lkIDApKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmQpO1xuICBpZiAocGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4oYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW4pO1xuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWRcbiAgfSkuZmV0Y2goKTtcbiAgc3BhY2VzID0gW107XG4gIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24oc3UpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSk7XG4gICAgaWYgKHNwYWNlICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpID49IDApIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh7XG4gICAgICAgIF9pZDogc3BhY2UuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGF1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLFxuICAgIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCxcbiAgICBhZG1pblNwYWNlczogc3BhY2VzXG4gIH07XG59O1xuIiwiLy8gV2UgbmVlZCBhIGZ1bmN0aW9uIHRoYXQgdHJlYXRzIHRocm93biBlcnJvcnMgZXhhY3RseSBsaWtlIElyb24gUm91dGVyIHdvdWxkLlxuLy8gVGhpcyBmaWxlIGlzIHdyaXR0ZW4gaW4gSmF2YVNjcmlwdCB0byBlbmFibGUgY29weS1wYXN0aW5nIElyb24gUm91dGVyIGNvZGUuXG5cbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDNcbnZhciBlbnYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnO1xuXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0w0N1xuaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UgPSBmdW5jdGlvbihlcnIsIHJlcSwgcmVzKSB7XG5cdGlmIChyZXMuc3RhdHVzQ29kZSA8IDQwMClcblx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcblxuXHRpZiAoZXJyLnN0YXR1cylcblx0XHRyZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XG5cblx0aWYgKGVudiA9PT0gJ2RldmVsb3BtZW50Jylcblx0XHRtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xuXHRlbHNlXG5cdC8vWFhYIGdldCB0aGlzIGZyb20gc3RhbmRhcmQgZGljdCBvZiBlcnJvciBtZXNzYWdlcz9cblx0XHRtc2cgPSAnU2VydmVyIGVycm9yLic7XG5cblx0Y29uc29sZS5lcnJvcihlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpO1xuXG5cdGlmIChyZXMuaGVhZGVyc1NlbnQpXG5cdFx0cmV0dXJuIHJlcS5zb2NrZXQuZGVzdHJveSgpO1xuXG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L2h0bWwnKTtcblx0cmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBCdWZmZXIuYnl0ZUxlbmd0aChtc2cpKTtcblx0aWYgKHJlcS5tZXRob2QgPT09ICdIRUFEJylcblx0XHRyZXR1cm4gcmVzLmVuZCgpO1xuXHRyZXMuZW5kKG1zZyk7XG5cdHJldHVybjtcbn1cbiIsImNsYXNzIHNoYXJlLlJvdXRlXG5cblx0Y29uc3RydWN0b3I6IChAYXBpLCBAcGF0aCwgQG9wdGlvbnMsIEBlbmRwb2ludHMpIC0+XG5cdFx0IyBDaGVjayBpZiBvcHRpb25zIHdlcmUgcHJvdmlkZWRcblx0XHRpZiBub3QgQGVuZHBvaW50c1xuXHRcdFx0QGVuZHBvaW50cyA9IEBvcHRpb25zXG5cdFx0XHRAb3B0aW9ucyA9IHt9XG5cblxuXHRhZGRUb0FwaTogZG8gLT5cblx0XHRhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXVxuXG5cdFx0cmV0dXJuIC0+XG5cdFx0XHRzZWxmID0gdGhpc1xuXG5cdFx0XHQjIFRocm93IGFuIGVycm9yIGlmIGEgcm91dGUgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCBhdCB0aGlzIHBhdGhcblx0XHRcdCMgVE9ETzogQ2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aCBwYXRocyB0aGF0IGZvbGxvdyBzYW1lIHBhdHRlcm4gd2l0aCBkaWZmZXJlbnQgcGFyYW1ldGVyIG5hbWVzXG5cdFx0XHRpZiBfLmNvbnRhaW5zIEBhcGkuX2NvbmZpZy5wYXRocywgQHBhdGhcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6ICN7QHBhdGh9XCJcblxuXHRcdFx0IyBPdmVycmlkZSB0aGUgZGVmYXVsdCBPUFRJT05TIGVuZHBvaW50IHdpdGggb3VyIG93blxuXHRcdFx0QGVuZHBvaW50cyA9IF8uZXh0ZW5kIG9wdGlvbnM6IEBhcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50LCBAZW5kcG9pbnRzXG5cblx0XHRcdCMgQ29uZmlndXJlIGVhY2ggZW5kcG9pbnQgb24gdGhpcyByb3V0ZVxuXHRcdFx0QF9yZXNvbHZlRW5kcG9pbnRzKClcblx0XHRcdEBfY29uZmlndXJlRW5kcG9pbnRzKClcblxuXHRcdFx0IyBBZGQgdG8gb3VyIGxpc3Qgb2YgZXhpc3RpbmcgcGF0aHNcblx0XHRcdEBhcGkuX2NvbmZpZy5wYXRocy5wdXNoIEBwYXRoXG5cblx0XHRcdGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cblx0XHRcdFx0Xy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXG5cdFx0XHRyZWplY3RlZE1ldGhvZHMgPSBfLnJlamVjdCBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHRfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcblxuXHRcdFx0IyBTZXR1cCBlbmRwb2ludHMgb24gcm91dGVcblx0XHRcdGZ1bGxQYXRoID0gQGFwaS5fY29uZmlnLmFwaVBhdGggKyBAcGF0aFxuXHRcdFx0Xy5lYWNoIGFsbG93ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHRlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF1cblx0XHRcdFx0SnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxuXHRcdFx0XHRcdCMgQWRkIGZ1bmN0aW9uIHRvIGVuZHBvaW50IGNvbnRleHQgZm9yIGluZGljYXRpbmcgYSByZXNwb25zZSBoYXMgYmVlbiBpbml0aWF0ZWQgbWFudWFsbHlcblx0XHRcdFx0XHRyZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0ZG9uZUZ1bmMgPSAtPlxuXHRcdFx0XHRcdFx0cmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlXG5cblx0XHRcdFx0XHRlbmRwb2ludENvbnRleHQgPVxuXHRcdFx0XHRcdFx0dXJsUGFyYW1zOiByZXEucGFyYW1zXG5cdFx0XHRcdFx0XHRxdWVyeVBhcmFtczogcmVxLnF1ZXJ5XG5cdFx0XHRcdFx0XHRib2R5UGFyYW1zOiByZXEuYm9keVxuXHRcdFx0XHRcdFx0cmVxdWVzdDogcmVxXG5cdFx0XHRcdFx0XHRyZXNwb25zZTogcmVzXG5cdFx0XHRcdFx0XHRkb25lOiBkb25lRnVuY1xuXHRcdFx0XHRcdCMgQWRkIGVuZHBvaW50IGNvbmZpZyBvcHRpb25zIHRvIGNvbnRleHRcblx0XHRcdFx0XHRfLmV4dGVuZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cblx0XHRcdFx0XHQjIFJ1biB0aGUgcmVxdWVzdGVkIGVuZHBvaW50XG5cdFx0XHRcdFx0cmVzcG9uc2VEYXRhID0gbnVsbFxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0cmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50IGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0IyBEbyBleGFjdGx5IHdoYXQgSXJvbiBSb3V0ZXIgd291bGQgaGF2ZSBkb25lLCB0byBhdm9pZCBjaGFuZ2luZyB0aGUgQVBJXG5cdFx0XHRcdFx0XHRpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdFx0XHRpZiByZXNwb25zZUluaXRpYXRlZFxuXHRcdFx0XHRcdFx0IyBFbnN1cmUgdGhlIHJlc3BvbnNlIGlzIHByb3Blcmx5IGNvbXBsZXRlZFxuXHRcdFx0XHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiByZXMuaGVhZGVyc1NlbnRcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxuXHRcdFx0XHRcdFx0ZWxzZSBpZiByZXNwb25zZURhdGEgaXMgbnVsbCBvciByZXNwb25zZURhdGEgaXMgdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcblxuXHRcdFx0XHRcdCMgR2VuZXJhdGUgYW5kIHJldHVybiB0aGUgaHR0cCByZXNwb25zZSwgaGFuZGxpbmcgdGhlIGRpZmZlcmVudCBlbmRwb2ludCByZXNwb25zZSB0eXBlc1xuXHRcdFx0XHRcdGlmIHJlc3BvbnNlRGF0YS5ib2R5IGFuZCAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgb3IgcmVzcG9uc2VEYXRhLmhlYWRlcnMpXG5cdFx0XHRcdFx0XHRzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVyc1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGFcblxuXHRcdFx0Xy5lYWNoIHJlamVjdGVkTWV0aG9kcywgKG1ldGhvZCkgLT5cblx0XHRcdFx0SnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxuXHRcdFx0XHRcdHJlc3BvbnNlRGF0YSA9IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcblx0XHRcdFx0XHRoZWFkZXJzID0gJ0FsbG93JzogYWxsb3dlZE1ldGhvZHMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdFx0c2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzXG5cblxuXHQjIyNcblx0XHRDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcblx0XHRmdW5jdGlvblxuXG5cdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG5cdCMjI1xuXHRfcmVzb2x2ZUVuZHBvaW50czogLT5cblx0XHRfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykgLT5cblx0XHRcdGlmIF8uaXNGdW5jdGlvbihlbmRwb2ludClcblx0XHRcdFx0ZW5kcG9pbnRzW21ldGhvZF0gPSB7YWN0aW9uOiBlbmRwb2ludH1cblx0XHRyZXR1cm5cblxuXG5cdCMjI1xuXHRcdENvbmZpZ3VyZSB0aGUgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnQgb24gYWxsIGVuZHBvaW50cyAoZXhjZXB0IE9QVElPTlMsIHdoaWNoIG11c3Rcblx0XHRiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcblxuXHRcdEF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3IgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuXG5cdFx0ZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcblx0XHRvdmVycmlkZSB0aGUgZGVmYXVsdC5cblxuXHRcdEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuXHRcdGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG5cdFx0cmVzcGVjdGl2ZWx5LlxuXG5cdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG5cdFx0QHBhcmFtIHtFbmRwb2ludH0gZW5kcG9pbnQgVGhlIGVuZHBvaW50IHRvIGNvbmZpZ3VyZVxuXHQjIyNcblx0X2NvbmZpZ3VyZUVuZHBvaW50czogLT5cblx0XHRfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QpIC0+XG5cdFx0XHRpZiBtZXRob2QgaXNudCAnb3B0aW9ucydcblx0XHRcdFx0IyBDb25maWd1cmUgYWNjZXB0YWJsZSByb2xlc1xuXHRcdFx0XHRpZiBub3QgQG9wdGlvbnM/LnJvbGVSZXF1aXJlZFxuXHRcdFx0XHRcdEBvcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdXG5cdFx0XHRcdGlmIG5vdCBlbmRwb2ludC5yb2xlUmVxdWlyZWRcblx0XHRcdFx0XHRlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBbXVxuXHRcdFx0XHRlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBfLnVuaW9uIGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgQG9wdGlvbnMucm9sZVJlcXVpcmVkXG5cdFx0XHRcdCMgTWFrZSBpdCBlYXNpZXIgdG8gY2hlY2sgaWYgbm8gcm9sZXMgYXJlIHJlcXVpcmVkXG5cdFx0XHRcdGlmIF8uaXNFbXB0eSBlbmRwb2ludC5yb2xlUmVxdWlyZWRcblx0XHRcdFx0XHRlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZVxuXG5cdFx0XHRcdCMgQ29uZmlndXJlIGF1dGggcmVxdWlyZW1lbnRcblx0XHRcdFx0aWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkIGlzIHVuZGVmaW5lZFxuXHRcdFx0XHRcdGlmIEBvcHRpb25zPy5hdXRoUmVxdWlyZWQgb3IgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG5cdFx0XHRcdFx0XHRlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSB0cnVlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0ZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2VcblxuXHRcdFx0XHRpZiBAb3B0aW9ucz8uc3BhY2VSZXF1aXJlZFxuXHRcdFx0XHRcdGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSBAb3B0aW9ucy5zcGFjZVJlcXVpcmVkXG5cdFx0XHRcdHJldHVyblxuXHRcdCwgdGhpc1xuXHRcdHJldHVyblxuXG5cblx0IyMjXG5cdFx0QXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuXG5cdFx0QHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXG5cdCMjI1xuXHRfY2FsbEVuZHBvaW50OiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cblx0XHQjIENhbGwgdGhlIGVuZHBvaW50IGlmIGF1dGhlbnRpY2F0aW9uIGRvZXNuJ3QgZmFpbFxuXHRcdGlmIEBfYXV0aEFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblx0XHRcdGlmIEBfcm9sZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblx0XHRcdFx0aWYgQF9zcGFjZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblx0XHRcdFx0XHQjZW5kcG9pbnQuYWN0aW9uLmNhbGwgZW5kcG9pbnRDb250ZXh0XG5cdFx0XHRcdFx0aW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvblxuXHRcdFx0XHRcdFx0aXNTaW11bGF0aW9uOiB0cnVlLFxuXHRcdFx0XHRcdFx0dXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuXHRcdFx0XHRcdFx0Y29ubmVjdGlvbjogbnVsbCxcblx0XHRcdFx0XHRcdHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG5cblx0XHRcdFx0XHRyZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUgaW52b2NhdGlvbiwgLT5cblx0XHRcdFx0XHRcdHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG5cdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuXHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxuXHRcdGVsc2Vcblx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuXHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XG5cblxuXHQjIyNcblx0XHRBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG5cblx0XHRPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG5cdFx0aW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG5cdFx0aW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cblx0XHRAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG5cdCMjI1xuXHRfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cblx0XHRpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWRcblx0XHRcdEBfYXV0aGVudGljYXRlIGVuZHBvaW50Q29udGV4dFxuXHRcdGVsc2UgdHJ1ZVxuXG5cblx0IyMjXG5cdFx0VmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcblxuXHRcdElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cblxuXHRcdEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuXHQjIyNcblx0X2F1dGhlbnRpY2F0ZTogKGVuZHBvaW50Q29udGV4dCkgLT5cblx0XHQjIEdldCBhdXRoIGluZm9cblx0XHRhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcblxuXHRcdCMgR2V0IHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG5cdFx0aWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcblx0XHRcdHVzZXJTZWxlY3RvciA9IHt9XG5cdFx0XHR1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWRcblx0XHRcdHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXG5cdFx0XHRhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSB1c2VyU2VsZWN0b3JcblxuXHRcdCMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcblx0XHRpZiBhdXRoPy51c2VyXG5cdFx0XHRlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcblx0XHRcdHRydWVcblx0XHRlbHNlIGZhbHNlXG5cblx0IyMjXG5cdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG5cdFx0XHRcdFx0XHQgZW5kcG9pbnRcblx0IyMjXG5cdF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cblx0XHRpZiBlbmRwb2ludC5zcGFjZVJlcXVpcmVkXG5cdFx0XHRhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcblx0XHRcdGlmIGF1dGg/LnNwYWNlSWRcblx0XHRcdFx0c3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoLnVzZXJJZCwgc3BhY2U6YXV0aC5zcGFjZUlkfSkuY291bnQoKVxuXHRcdFx0XHRpZiBzcGFjZV91c2Vyc19jb3VudFxuXHRcdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxuXHRcdFx0XHRcdCMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xuXHRcdFx0XHRcdGlmIHNwYWNlICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKT49MFxuXHRcdFx0XHRcdFx0ZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWRcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCJcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHJldHVybiB0cnVlXG5cblx0IyMjXG5cdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG5cdFx0XHRcdFx0XHQgZW5kcG9pbnRcblx0IyMjXG5cdF9yb2xlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuXHRcdGlmIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuXHRcdFx0aWYgXy5pc0VtcHR5IF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHRydWVcblxuXG5cdCMjI1xuXHRcdFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG5cdCMjI1xuXHRfcmVzcG9uZDogKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlPTIwMCwgaGVhZGVycz17fSkgLT5cblx0XHQjIE92ZXJyaWRlIGFueSBkZWZhdWx0IGhlYWRlcnMgdGhhdCBoYXZlIGJlZW4gcHJvdmlkZWQgKGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gYmUgY2FzZSBpbnNlbnNpdGl2ZSlcblx0XHQjIFRPRE86IENvbnNpZGVyIG9ubHkgbG93ZXJjYXNpbmcgdGhlIGhlYWRlciBrZXlzIHdlIG5lZWQgbm9ybWFsaXplZCwgbGlrZSBDb250ZW50LVR5cGVcblx0XHRkZWZhdWx0SGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBAYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnNcblx0XHRoZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIGhlYWRlcnNcblx0XHRoZWFkZXJzID0gXy5leHRlbmQgZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnNcblxuXHRcdCMgUHJlcGFyZSBKU09OIGJvZHkgZm9yIHJlc3BvbnNlIHdoZW4gQ29udGVudC1UeXBlIGluZGljYXRlcyBKU09OIHR5cGVcblx0XHRpZiBoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgaXNudCBudWxsXG5cdFx0XHRpZiBAYXBpLl9jb25maWcucHJldHR5SnNvblxuXHRcdFx0XHRib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keSwgdW5kZWZpbmVkLCAyXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5XG5cblx0XHQjIFNlbmQgcmVzcG9uc2Vcblx0XHRzZW5kUmVzcG9uc2UgPSAtPlxuXHRcdFx0cmVzcG9uc2Uud3JpdGVIZWFkIHN0YXR1c0NvZGUsIGhlYWRlcnNcblx0XHRcdHJlc3BvbnNlLndyaXRlIGJvZHlcblx0XHRcdHJlc3BvbnNlLmVuZCgpXG5cdFx0aWYgc3RhdHVzQ29kZSBpbiBbNDAxLCA0MDNdXG5cdFx0XHQjIEhhY2tlcnMgY2FuIG1lYXN1cmUgdGhlIHJlc3BvbnNlIHRpbWUgdG8gZGV0ZXJtaW5lIHRoaW5ncyBsaWtlIHdoZXRoZXIgdGhlIDQwMSByZXNwb25zZSB3YXNcblx0XHRcdCMgY2F1c2VkIGJ5IGJhZCB1c2VyIGlkIHZzIGJhZCBwYXNzd29yZC5cblx0XHRcdCMgSW4gZG9pbmcgc28sIHRoZXkgY2FuIGZpcnN0IHNjYW4gZm9yIHZhbGlkIHVzZXIgaWRzIHJlZ2FyZGxlc3Mgb2YgdmFsaWQgcGFzc3dvcmRzLlxuXHRcdFx0IyBEZWxheSBieSBhIHJhbmRvbSBhbW91bnQgdG8gcmVkdWNlIHRoZSBhYmlsaXR5IGZvciBhIGhhY2tlciB0byBkZXRlcm1pbmUgdGhlIHJlc3BvbnNlIHRpbWUuXG5cdFx0XHQjIFNlZSBodHRwczovL3d3dy5vd2FzcC5vcmcvaW5kZXgucGhwL0Jsb2NraW5nX0JydXRlX0ZvcmNlX0F0dGFja3MjRmluZGluZ19PdGhlcl9Db3VudGVybWVhc3VyZXNcblx0XHRcdCMgU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RpbWluZ19hdHRhY2tcblx0XHRcdG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzID0gNTAwXG5cdFx0XHRyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpXG5cdFx0XHRkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3b1xuXHRcdFx0TWV0ZW9yLnNldFRpbWVvdXQgc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzXG5cdFx0ZWxzZVxuXHRcdFx0c2VuZFJlc3BvbnNlKClcblxuXHQjIyNcblx0XHRSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG5cdCMjI1xuXHRfbG93ZXJDYXNlS2V5czogKG9iamVjdCkgLT5cblx0XHRfLmNoYWluIG9iamVjdFxuXHRcdC5wYWlycygpXG5cdFx0Lm1hcCAoYXR0cikgLT5cblx0XHRcdFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dXG5cdFx0Lm9iamVjdCgpXG5cdFx0LnZhbHVlKClcbiIsInNoYXJlLlJvdXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSb3V0ZShhcGksIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50czEpIHtcbiAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5lbmRwb2ludHMgPSBlbmRwb2ludHMxO1xuICAgIGlmICghdGhpcy5lbmRwb2ludHMpIHtcbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gdGhpcy5vcHRpb25zO1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgfVxuICB9XG5cbiAgUm91dGUucHJvdG90eXBlLmFkZFRvQXBpID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdmFpbGFibGVNZXRob2RzO1xuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhbGxvd2VkTWV0aG9kcywgZnVsbFBhdGgsIHJlamVjdGVkTWV0aG9kcywgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKF8uY29udGFpbnModGhpcy5hcGkuX2NvbmZpZy5wYXRocywgdGhpcy5wYXRoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogXCIgKyB0aGlzLnBhdGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5lbmRwb2ludHMgPSBfLmV4dGVuZCh7XG4gICAgICAgIG9wdGlvbnM6IHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuICAgICAgfSwgdGhpcy5lbmRwb2ludHMpO1xuICAgICAgdGhpcy5fcmVzb2x2ZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5fY29uZmlndXJlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLmFwaS5fY29uZmlnLnBhdGhzLnB1c2godGhpcy5wYXRoKTtcbiAgICAgIGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0KGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICBmdWxsUGF0aCA9IHRoaXMuYXBpLl9jb25maWcuYXBpUGF0aCArIHRoaXMucGF0aDtcbiAgICAgIF8uZWFjaChhbGxvd2VkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBlbmRwb2ludDtcbiAgICAgICAgZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdO1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgZG9uZUZ1bmMsIGVuZHBvaW50Q29udGV4dCwgZXJyb3IsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VJbml0aWF0ZWQ7XG4gICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBkb25lRnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9IHtcbiAgICAgICAgICAgIHVybFBhcmFtczogcmVxLnBhcmFtcyxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnksXG4gICAgICAgICAgICBib2R5UGFyYW1zOiByZXEuYm9keSxcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcSxcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXMsXG4gICAgICAgICAgICBkb25lOiBkb25lRnVuY1xuICAgICAgICAgIH07XG4gICAgICAgICAgXy5leHRlbmQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gbnVsbDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50KGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICBpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VJbml0aWF0ZWQpIHtcbiAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlRGF0YSA9PT0gbnVsbCB8fCByZXNwb25zZURhdGEgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZURhdGEuYm9keSAmJiAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgfHwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWplY3RlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgaGVhZGVycywgcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXG4gICAgICAgICAgfTtcbiAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgJ0FsbG93JzogYWxsb3dlZE1ldGhvZHMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KSgpO1xuXG5cbiAgLypcbiAgXHRcdENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICBcdFx0ZnVuY3Rpb25cbiAgXG4gIFx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNvbHZlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oZW5kcG9pbnQpKSB7XG4gICAgICAgIHJldHVybiBlbmRwb2ludHNbbWV0aG9kXSA9IHtcbiAgICAgICAgICBhY3Rpb246IGVuZHBvaW50XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cblxuICAvKlxuICBcdFx0Q29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICBcdFx0YmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG4gIFxuICBcdFx0QXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cbiAgXHRcdGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gIFx0XHRvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gIFx0XHRBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcbiAgXHRcdGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gIFx0XHRyZXNwZWN0aXZlbHkuXG4gIFxuICBcdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gIFx0XHRAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY29uZmlndXJlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kKSB7XG4gICAgICB2YXIgcmVmLCByZWYxLCByZWYyO1xuICAgICAgaWYgKG1ldGhvZCAhPT0gJ29wdGlvbnMnKSB7XG4gICAgICAgIGlmICghKChyZWYgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYucm9sZVJlcXVpcmVkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkKTtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludC5yb2xlUmVxdWlyZWQpKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKCgocmVmMSA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjEuYXV0aFJlcXVpcmVkIDogdm9pZCAwKSB8fCBlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHJlZjIgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYyLnNwYWNlUmVxdWlyZWQgOiB2b2lkIDApIHtcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gdGhpcy5vcHRpb25zLnNwYWNlUmVxdWlyZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG4gIFxuICBcdFx0QHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY2FsbEVuZHBvaW50ID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBpbnZvY2F0aW9uO1xuICAgIGlmICh0aGlzLl9hdXRoQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgIGlmICh0aGlzLl9yb2xlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NwYWNlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uKHtcbiAgICAgICAgICAgIGlzU2ltdWxhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcbiAgICAgICAgICAgIGNvbm5lY3Rpb246IG51bGwsXG4gICAgICAgICAgICByYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZShpbnZvY2F0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXNDb2RlOiA0MDEsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLidcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0QXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuICBcbiAgXHRcdE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcbiAgXHRcdGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxuICBcdFx0aW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICBcdFx0QHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlKGVuZHBvaW50Q29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxuICBcbiAgXHRcdElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cbiAgXG4gIFx0XHRAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQpIHtcbiAgICB2YXIgYXV0aCwgdXNlclNlbGVjdG9yO1xuICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgaWYgKChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXJJZCA6IHZvaWQgMCkgJiYgKGF1dGggIT0gbnVsbCA/IGF1dGgudG9rZW4gOiB2b2lkIDApICYmICEoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSkge1xuICAgICAgdXNlclNlbGVjdG9yID0ge307XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWQ7XG4gICAgICB1c2VyU2VsZWN0b3JbdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW47XG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VyU2VsZWN0b3IpO1xuICAgIH1cbiAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSB7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlcjtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gIFx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICBcdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgXHRcdFx0XHRcdFx0IGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fc3BhY2VBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgYXV0aCwgc3BhY2UsIHNwYWNlX3VzZXJzX2NvdW50O1xuICAgIGlmIChlbmRwb2ludC5zcGFjZVJlcXVpcmVkKSB7XG4gICAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGguc3BhY2VJZCA6IHZvaWQgMCkge1xuICAgICAgICBzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHVzZXI6IGF1dGgudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBhdXRoLnNwYWNlSWRcbiAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXJzX2NvdW50KSB7XG4gICAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpO1xuICAgICAgICAgIGlmIChzcGFjZSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCkgPj0gMCkge1xuICAgICAgICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWQ7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICBcdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gIFx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICBcdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgXHRcdFx0XHRcdFx0IGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcm9sZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgIGlmIChfLmlzRW1wdHkoXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcykpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICBcdFx0UmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNwb25kID0gZnVuY3Rpb24ocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGUsIGhlYWRlcnMpIHtcbiAgICB2YXIgZGVmYXVsdEhlYWRlcnMsIGRlbGF5SW5NaWxsaXNlY29uZHMsIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzLCByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bywgc2VuZFJlc3BvbnNlO1xuICAgIGlmIChzdGF0dXNDb2RlID09IG51bGwpIHtcbiAgICAgIHN0YXR1c0NvZGUgPSAyMDA7XG4gICAgfVxuICAgIGlmIChoZWFkZXJzID09IG51bGwpIHtcbiAgICAgIGhlYWRlcnMgPSB7fTtcbiAgICB9XG4gICAgZGVmYXVsdEhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKGhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSBfLmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG4gICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYXBpLl9jb25maWcucHJldHR5SnNvbikge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSwgdm9pZCAwLCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNwb25zZS53cml0ZUhlYWQoc3RhdHVzQ29kZSwgaGVhZGVycyk7XG4gICAgICByZXNwb25zZS53cml0ZShib2R5KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5lbmQoKTtcbiAgICB9O1xuICAgIGlmIChzdGF0dXNDb2RlID09PSA0MDEgfHwgc3RhdHVzQ29kZSA9PT0gNDAzKSB7XG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMDtcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICBkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bztcbiAgICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dChzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VuZFJlc3BvbnNlKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9sb3dlckNhc2VLZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIF8uY2hhaW4ob2JqZWN0KS5wYWlycygpLm1hcChmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV07XG4gICAgfSkub2JqZWN0KCkudmFsdWUoKTtcbiAgfTtcblxuICByZXR1cm4gUm91dGU7XG5cbn0pKCk7XG4iLCJiYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJylcbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuXG5jbGFzcyBAT2RhdGFSZXN0aXZ1c1xuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRAX3JvdXRlcyA9IFtdXG5cdFx0QF9jb25maWcgPVxuXHRcdFx0cGF0aHM6IFtdXG5cdFx0XHR1c2VEZWZhdWx0QXV0aDogZmFsc2Vcblx0XHRcdGFwaVBhdGg6ICdhcGkvJ1xuXHRcdFx0dmVyc2lvbjogbnVsbFxuXHRcdFx0cHJldHR5SnNvbjogZmFsc2Vcblx0XHRcdGF1dGg6XG5cdFx0XHRcdHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJ1xuXHRcdFx0XHR1c2VyOiAtPlxuXHRcdFx0XHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyggQHJlcXVlc3QsIEByZXNwb25zZSApXG5cdFx0XHRcdFx0dXNlcklkID0gQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0XHRcdFx0XHRhdXRoVG9rZW4gPSBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXHRcdFx0XHRcdHNwYWNlSWQgPSBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgQHVybFBhcmFtc1snc3BhY2VJZCddXG5cdFx0XHRcdFx0aWYgYXV0aFRva2VuXG5cdFx0XHRcdFx0XHR0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cblx0XHRcdFx0XHRpZiBAcmVxdWVzdC51c2VySWRcblx0XHRcdFx0XHRcdF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBAcmVxdWVzdC51c2VySWR9KVxuXHRcdFx0XHRcdFx0dXNlcjogX3VzZXJcblx0XHRcdFx0XHRcdHVzZXJJZDogdXNlcklkXG5cdFx0XHRcdFx0XHRzcGFjZUlkOiBzcGFjZUlkXG5cdFx0XHRcdFx0XHR0b2tlbjogdG9rZW5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR1c2VySWQ6IHVzZXJJZFxuXHRcdFx0XHRcdFx0c3BhY2VJZDogc3BhY2VJZFxuXHRcdFx0XHRcdFx0dG9rZW46IHRva2VuXG5cdFx0XHRkZWZhdWx0SGVhZGVyczpcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHRcdFx0ZW5hYmxlQ29yczogdHJ1ZVxuXG5cdFx0IyBDb25maWd1cmUgQVBJIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcblx0XHRfLmV4dGVuZCBAX2NvbmZpZywgb3B0aW9uc1xuXG5cdFx0aWYgQF9jb25maWcuZW5hYmxlQ29yc1xuXHRcdFx0Y29yc0hlYWRlcnMgPVxuXHRcdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXG5cdFx0XHRcdCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQsIE9EYXRhLVZlcnNpb24nXG5cblx0XHRcdGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG5cdFx0XHRcdGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4sIFgtU3BhY2UtSWQnXG5cblx0XHRcdCMgU2V0IGRlZmF1bHQgaGVhZGVyIHRvIGVuYWJsZSBDT1JTIGlmIGNvbmZpZ3VyZWRcblx0XHRcdF8uZXh0ZW5kIEBfY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVyc1xuXG5cdFx0XHRpZiBub3QgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuXHRcdFx0XHRAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gLT5cblx0XHRcdFx0XHRAcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgY29yc0hlYWRlcnNcblx0XHRcdFx0XHRAZG9uZSgpXG5cblx0XHQjIE5vcm1hbGl6ZSB0aGUgQVBJIHBhdGhcblx0XHRpZiBAX2NvbmZpZy5hcGlQYXRoWzBdIGlzICcvJ1xuXHRcdFx0QF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGguc2xpY2UgMVxuXHRcdGlmIF8ubGFzdChAX2NvbmZpZy5hcGlQYXRoKSBpc250ICcvJ1xuXHRcdFx0QF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGggKyAnLydcblxuXHRcdCMgVVJMIHBhdGggdmVyc2lvbmluZyBpcyB0aGUgb25seSB0eXBlIG9mIEFQSSB2ZXJzaW9uaW5nIGN1cnJlbnRseSBhdmFpbGFibGUsIHNvIGlmIGEgdmVyc2lvbiBpc1xuXHRcdCMgcHJvdmlkZWQsIGFwcGVuZCBpdCB0byB0aGUgYmFzZSBwYXRoIG9mIHRoZSBBUElcblx0XHRpZiBAX2NvbmZpZy52ZXJzaW9uXG5cdFx0XHRAX2NvbmZpZy5hcGlQYXRoICs9IEBfY29uZmlnLnZlcnNpb24gKyAnLydcblxuXHRcdCMgQWRkIGRlZmF1bHQgbG9naW4gYW5kIGxvZ291dCBlbmRwb2ludHMgaWYgYXV0aCBpcyBjb25maWd1cmVkXG5cdFx0aWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcblx0XHRcdEBfaW5pdEF1dGgoKVxuXHRcdGVsc2UgaWYgQF9jb25maWcudXNlQXV0aFxuXHRcdFx0QF9pbml0QXV0aCgpXG5cdFx0XHRjb25zb2xlLndhcm4gJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArXG5cdFx0XHRcdFx0J1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJ1xuXG5cdFx0cmV0dXJuIHRoaXNcblxuXG5cdCMjIypcblx0XHRBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG5cblx0XHRAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG5cdFx0QHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG5cdFx0QHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuXHRcdEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuXHRcdEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcblx0XHRAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG5cdFx0XHRcdGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcblx0XHRcdFx0YW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuXHQjIyNcblx0YWRkUm91dGU6IChwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIC0+XG5cdFx0IyBDcmVhdGUgYSBuZXcgcm91dGUgYW5kIGFkZCBpdCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyByb3V0ZXNcblx0XHRyb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpXG5cdFx0QF9yb3V0ZXMucHVzaChyb3V0ZSlcblxuXHRcdHJvdXRlLmFkZFRvQXBpKClcblxuXHRcdHJldHVybiB0aGlzXG5cblxuXHQjIyMqXG5cdFx0R2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuXHQjIyNcblx0YWRkQ29sbGVjdGlvbjogKGNvbGxlY3Rpb24sIG9wdGlvbnM9e30pIC0+XG5cdFx0bWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXVxuXHRcdG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ11cblxuXHRcdCMgR3JhYiB0aGUgc2V0IG9mIGVuZHBvaW50c1xuXHRcdGlmIGNvbGxlY3Rpb24gaXMgTWV0ZW9yLnVzZXJzXG5cdFx0XHRjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF91c2VyQ29sbGVjdGlvbkVuZHBvaW50c1xuXHRcdGVsc2Vcblx0XHRcdGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX2NvbGxlY3Rpb25FbmRwb2ludHNcblxuXHRcdCMgRmxhdHRlbiB0aGUgb3B0aW9ucyBhbmQgc2V0IGRlZmF1bHRzIGlmIG5lY2Vzc2FyeVxuXHRcdGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIG9yIHt9XG5cdFx0cm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgb3Ige31cblx0XHRleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgb3IgW11cblx0XHQjIFVzZSBjb2xsZWN0aW9uIG5hbWUgYXMgZGVmYXVsdCBwYXRoXG5cdFx0cGF0aCA9IG9wdGlvbnMucGF0aCBvciBjb2xsZWN0aW9uLl9uYW1lXG5cblx0XHQjIFNlcGFyYXRlIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRzIGJ5IHRoZSByb3V0ZSB0aGV5IGJlbG9uZyB0byAob25lIGZvciBvcGVyYXRpbmcgb24gdGhlIGVudGlyZVxuXHRcdCMgY29sbGVjdGlvbiBhbmQgb25lIGZvciBvcGVyYXRpbmcgb24gYSBzaW5nbGUgZW50aXR5IHdpdGhpbiB0aGUgY29sbGVjdGlvbilcblx0XHRjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fVxuXHRcdGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge31cblx0XHRpZiBfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSBhbmQgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKVxuXHRcdFx0IyBHZW5lcmF0ZSBhbGwgZW5kcG9pbnRzIG9uIHRoaXMgY29sbGVjdGlvblxuXHRcdFx0Xy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdCMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuXHRcdFx0XHRpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxuXHRcdFx0XHRcdF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcblx0XHRcdFx0ZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQsIHRoaXNcblx0XHRlbHNlXG5cdFx0XHQjIEdlbmVyYXRlIGFueSBlbmRwb2ludHMgdGhhdCBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBleGNsdWRlZFxuXHRcdFx0Xy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdGlmIG1ldGhvZCBub3QgaW4gZXhjbHVkZWRFbmRwb2ludHMgYW5kIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdIGlzbnQgZmFsc2Vcblx0XHRcdFx0XHQjIENvbmZpZ3VyZSBlbmRwb2ludCBhbmQgbWFwIHRvIGl0J3MgaHR0cCBtZXRob2Rcblx0XHRcdFx0XHQjIFRPRE86IENvbnNpZGVyIHByZWRlZmluaW5nIGEgbWFwIG9mIG1ldGhvZHMgdG8gdGhlaXIgaHR0cCBtZXRob2QgdHlwZSAoZS5nLiwgZ2V0QWxsOiBnZXQpXG5cdFx0XHRcdFx0ZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF1cblx0XHRcdFx0XHRjb25maWd1cmVkRW5kcG9pbnQgPSB7fVxuXHRcdFx0XHRcdF8uZWFjaCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgKGFjdGlvbiwgbWV0aG9kVHlwZSkgLT5cblx0XHRcdFx0XHRcdGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9XG5cdFx0XHRcdFx0XHRcdF8uY2hhaW4gYWN0aW9uXG5cdFx0XHRcdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdFx0XHRcdC5leHRlbmQgZW5kcG9pbnRPcHRpb25zXG5cdFx0XHRcdFx0XHRcdC52YWx1ZSgpXG5cdFx0XHRcdFx0IyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXG5cdFx0XHRcdFx0aWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cblx0XHRcdFx0XHRcdF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG5cdFx0XHRcdFx0ZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHQsIHRoaXNcblxuXHRcdCMgQWRkIHRoZSByb3V0ZXMgdG8gdGhlIEFQSVxuXHRcdEBhZGRSb3V0ZSBwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50c1xuXHRcdEBhZGRSb3V0ZSBcIiN7cGF0aH0vOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHNcblxuXHRcdHJldHVybiB0aGlzXG5cblxuXHQjIyMqXG5cdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG5cdCMjI1xuXHRfY29sbGVjdGlvbkVuZHBvaW50czpcblx0XHRnZXQ6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0Z2V0OlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgc2VsZWN0b3Jcblx0XHRcdFx0XHRpZiBlbnRpdHlcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuXHRcdHB1dDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRwdXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCAkc2V0OiBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxuXHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuXHRcdGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRkZWxldGU6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuXHRcdHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0cG9zdDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXG5cdFx0XHRcdFx0aWYgZW50aXR5XG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCd9XG5cdFx0Z2V0QWxsOiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdHNlbGVjdG9yID0ge31cblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRcdHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0ZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKClcblx0XHRcdFx0XHRpZiBlbnRpdGllc1xuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nfVxuXG5cblx0IyMjKlxuXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcblx0IyMjXG5cdF91c2VyQ29sbGVjdGlvbkVuZHBvaW50czpcblx0XHRnZXQ6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0Z2V0OlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuXHRcdFx0XHRcdGlmIGVudGl0eVxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XG5cdFx0cHV0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdHB1dDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIEB1cmxQYXJhbXMuaWQsICRzZXQ6IHByb2ZpbGU6IEBib2R5UGFyYW1zXG5cdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXG5cdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuXHRcdGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRkZWxldGU6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBAdXJsUGFyYW1zLmlkXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnfVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuXHRcdHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0cG9zdDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdCMgQ3JlYXRlIGEgbmV3IHVzZXIgYWNjb3VudFxuXHRcdFx0XHRcdGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlciBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZCwgZmllbGRzOiBwcm9maWxlOiAxXG5cdFx0XHRcdFx0aWYgZW50aXR5XG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCd9XG5cdFx0Z2V0QWxsOiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCBmaWVsZHM6IHByb2ZpbGU6IDEpLmZldGNoKClcblx0XHRcdFx0XHRpZiBlbnRpdGllc1xuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2Vycyd9XG5cblxuXHQjIyNcblx0XHRBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG5cdCMjI1xuXHRfaW5pdEF1dGg6IC0+XG5cdFx0c2VsZiA9IHRoaXNcblx0XHQjIyNcblx0XHRcdEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcblxuXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3Jcblx0XHRcdGFkZGluZyBob29rKS5cblx0XHQjIyNcblx0XHRAYWRkUm91dGUgJ2xvZ2luJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LFxuXHRcdFx0cG9zdDogLT5cblx0XHRcdFx0IyBHcmFiIHRoZSB1c2VybmFtZSBvciBlbWFpbCB0aGF0IHRoZSB1c2VyIGlzIGxvZ2dpbmcgaW4gd2l0aFxuXHRcdFx0XHR1c2VyID0ge31cblx0XHRcdFx0aWYgQGJvZHlQYXJhbXMudXNlclxuXHRcdFx0XHRcdGlmIEBib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpIGlzIC0xXG5cdFx0XHRcdFx0XHR1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlclxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy51c2VyXG5cdFx0XHRcdGVsc2UgaWYgQGJvZHlQYXJhbXMudXNlcm5hbWVcblx0XHRcdFx0XHR1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlcm5hbWVcblx0XHRcdFx0ZWxzZSBpZiBAYm9keVBhcmFtcy5lbWFpbFxuXHRcdFx0XHRcdHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy5lbWFpbFxuXG5cdFx0XHRcdCMgVHJ5IHRvIGxvZyB0aGUgdXNlciBpbnRvIHRoZSB1c2VyJ3MgYWNjb3VudCAoaWYgc3VjY2Vzc2Z1bCB3ZSdsbCBnZXQgYW4gYXV0aCB0b2tlbiBiYWNrKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCB1c2VyLCBAYm9keVBhcmFtcy5wYXNzd29yZFxuXHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlXG5cdFx0XHRcdFx0cmV0dXJuIHt9ID1cblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IGUuZXJyb3Jcblx0XHRcdFx0XHRcdGJvZHk6IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5yZWFzb25cblxuXHRcdFx0XHQjIEdldCB0aGUgYXV0aGVudGljYXRlZCB1c2VyXG5cdFx0XHRcdCMgVE9ETzogQ29uc2lkZXIgcmV0dXJuaW5nIHRoZSB1c2VyIGluIEF1dGgubG9naW5XaXRoUGFzc3dvcmQoKSwgaW5zdGVhZCBvZiBmZXRjaGluZyBpdCBhZ2FpbiBoZXJlXG5cdFx0XHRcdGlmIGF1dGgudXNlcklkIGFuZCBhdXRoLmF1dGhUb2tlblxuXHRcdFx0XHRcdHNlYXJjaFF1ZXJ5ID0ge31cblx0XHRcdFx0XHRzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aC5hdXRoVG9rZW5cblx0XHRcdFx0XHRAdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRcdFx0XHQnX2lkJzogYXV0aC51c2VySWRcblx0XHRcdFx0XHRcdHNlYXJjaFF1ZXJ5XG5cdFx0XHRcdFx0QHVzZXJJZCA9IEB1c2VyPy5faWRcblxuXHRcdFx0XHRyZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogYXV0aH1cblxuXHRcdFx0XHQjIENhbGwgdGhlIGxvZ2luIGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG5cdFx0XHRcdGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluPy5jYWxsKHRoaXMpXG5cdFx0XHRcdGlmIGV4dHJhRGF0YT9cblx0XHRcdFx0XHRfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXG5cblx0XHRcdFx0cmVzcG9uc2VcblxuXHRcdGxvZ291dCA9IC0+XG5cdFx0XHQjIFJlbW92ZSB0aGUgZ2l2ZW4gYXV0aCB0b2tlbiBmcm9tIHRoZSB1c2VyJ3MgYWNjb3VudFxuXHRcdFx0YXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxuXHRcdFx0dG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuXG5cdFx0XHRpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YgJy4nXG5cdFx0XHR0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyAwLCBpbmRleFxuXHRcdFx0dG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyBpbmRleCArIDFcblx0XHRcdHRva2VuVG9SZW1vdmUgPSB7fVxuXHRcdFx0dG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlblxuXHRcdFx0dG9rZW5SZW1vdmFsUXVlcnkgPSB7fVxuXHRcdFx0dG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmVcblx0XHRcdE1ldGVvci51c2Vycy51cGRhdGUgQHVzZXIuX2lkLCB7JHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5fVxuXG5cdFx0XHRyZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ319XG5cblx0XHRcdCMgQ2FsbCB0aGUgbG9nb3V0IGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG5cdFx0XHRleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQ/LmNhbGwodGhpcylcblx0XHRcdGlmIGV4dHJhRGF0YT9cblx0XHRcdFx0Xy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG5cdFx0XHRyZXNwb25zZVxuXG5cdFx0IyMjXG5cdFx0XHRBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuXG5cdFx0XHRBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG5cdFx0XHRhZGRpbmcgaG9vaykuXG5cdFx0IyMjXG5cdFx0QGFkZFJvdXRlICdsb2dvdXQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSxcblx0XHRcdGdldDogLT5cblx0XHRcdFx0Y29uc29sZS53YXJuIFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIlxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCJcblx0XHRcdFx0cmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpXG5cdFx0XHRwb3N0OiBsb2dvdXRcblxuT2RhdGFSZXN0aXZ1cyA9IEBPZGF0YVJlc3RpdnVzXG4iLCJ2YXIgQ29va2llcywgT2RhdGFSZXN0aXZ1cywgYmFzaWNBdXRoLFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbmJhc2ljQXV0aCA9IHJlcXVpcmUoJ2Jhc2ljLWF1dGgnKTtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG50aGlzLk9kYXRhUmVzdGl2dXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE9kYXRhUmVzdGl2dXMob3B0aW9ucykge1xuICAgIHZhciBjb3JzSGVhZGVycztcbiAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcbiAgICB0aGlzLl9jb25maWcgPSB7XG4gICAgICBwYXRoczogW10sXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXG4gICAgICBhcGlQYXRoOiAnYXBpLycsXG4gICAgICB2ZXJzaW9uOiBudWxsLFxuICAgICAgcHJldHR5SnNvbjogZmFsc2UsXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJyxcbiAgICAgICAgdXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF91c2VyLCBhdXRoVG9rZW4sIGNvb2tpZXMsIHNwYWNlSWQsIHRva2VuLCB1c2VySWQ7XG4gICAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKHRoaXMucmVxdWVzdCwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgdXNlcklkID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgICAgIGF1dGhUb2tlbiA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICAgICAgICBzcGFjZUlkID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCB0aGlzLnVybFBhcmFtc1snc3BhY2VJZCddO1xuICAgICAgICAgIGlmIChhdXRoVG9rZW4pIHtcbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QudXNlcklkKSB7XG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMucmVxdWVzdC51c2VySWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcjogX3VzZXIsXG4gICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgICBzcGFjZUlkOiBzcGFjZUlkLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgICBzcGFjZUlkOiBzcGFjZUlkLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcbiAgICB9O1xuICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZywgb3B0aW9ucyk7XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5lbmFibGVDb3JzKSB7XG4gICAgICBjb3JzSGVhZGVycyA9IHtcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCwgT0RhdGEtVmVyc2lvbidcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4sIFgtU3BhY2UtSWQnO1xuICAgICAgfVxuICAgICAgXy5leHRlbmQodGhpcy5fY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVycyk7XG4gICAgICBpZiAoIXRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50KSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZS53cml0ZUhlYWQoMjAwLCBjb3JzSGVhZGVycyk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLmFwaVBhdGhbMF0gPT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aC5zbGljZSgxKTtcbiAgICB9XG4gICAgaWYgKF8ubGFzdCh0aGlzLl9jb25maWcuYXBpUGF0aCkgIT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aCArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy52ZXJzaW9uKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCArPSB0aGlzLl9jb25maWcudmVyc2lvbiArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbmZpZy51c2VBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgKyAnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICBcdFx0QWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuICBcbiAgXHRcdEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcbiAgXHRcdEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICBcdFx0QHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICBcdFx0QHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gIFx0XHRAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gIFx0XHRAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG4gIFx0XHRcdFx0Y29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxuICBcdFx0XHRcdGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuYWRkUm91dGUgPSBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIHtcbiAgICB2YXIgcm91dGU7XG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKTtcbiAgICB0aGlzLl9yb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgcm91dGUuYWRkVG9BcGkoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICBcdFx0R2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5hZGRDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgb3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uRW5kcG9pbnRzLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiwgZW50aXR5Um91dGVFbmRwb2ludHMsIGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2RzLCBtZXRob2RzT25Db2xsZWN0aW9uLCBwYXRoLCByb3V0ZU9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddO1xuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ107XG4gICAgaWYgKGNvbGxlY3Rpb24gPT09IE1ldGVvci51c2Vycykge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fY29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9XG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgfHwge307XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgfHwge307XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIHx8IFtdO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGggfHwgY29sbGVjdGlvbi5fbmFtZTtcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSAmJiBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpKSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGNvbmZpZ3VyZWRFbmRwb2ludCwgZW5kcG9pbnRPcHRpb25zO1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2QpIDwgMCAmJiBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXTtcbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fTtcbiAgICAgICAgICBfLmVhY2goY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIGZ1bmN0aW9uKGFjdGlvbiwgbWV0aG9kVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9IF8uY2hhaW4oYWN0aW9uKS5jbG9uZSgpLmV4dGVuZChlbmRwb2ludE9wdGlvbnMpLnZhbHVlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyk7XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoICsgXCIvOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gIFx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuX2NvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZCwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xuICAgICAgICAgICAgICAkc2V0OiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICBcdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZDtcbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZSh0aGlzLnVybFBhcmFtcy5pZCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgZW50aXR5SWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAoe1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCdcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXM7XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuX2luaXRBdXRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvZ291dCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcblxuICAgIC8qXG4gICAgXHRcdFx0QWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgIFx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgXHRcdFx0YWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHRoaXMuYWRkUm91dGUoJ2xvZ2luJywge1xuICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXV0aCwgZSwgZXh0cmFEYXRhLCByZWYsIHJlZjEsIHJlc3BvbnNlLCBzZWFyY2hRdWVyeSwgdXNlcjtcbiAgICAgICAgdXNlciA9IHt9O1xuICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpID09PSAtMSkge1xuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VybmFtZSkge1xuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLmVtYWlsKSB7XG4gICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy5lbWFpbDtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKHVzZXIsIHRoaXMuYm9keVBhcmFtcy5wYXNzd29yZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3IsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZS5yZWFzb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdXRoLnVzZXJJZCAmJiBhdXRoLmF1dGhUb2tlbikge1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGguYXV0aFRva2VuKTtcbiAgICAgICAgICB0aGlzLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICB9LCBzZWFyY2hRdWVyeSk7XG4gICAgICAgICAgdGhpcy51c2VySWQgPSAocmVmID0gdGhpcy51c2VyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICBkYXRhOiBhdXRoXG4gICAgICAgIH07XG4gICAgICAgIGV4dHJhRGF0YSA9IChyZWYxID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4pICE9IG51bGwgPyByZWYxLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aFRva2VuLCBleHRyYURhdGEsIGhhc2hlZFRva2VuLCBpbmRleCwgcmVmLCByZXNwb25zZSwgdG9rZW5GaWVsZE5hbWUsIHRva2VuTG9jYXRpb24sIHRva2VuUGF0aCwgdG9rZW5SZW1vdmFsUXVlcnksIHRva2VuVG9SZW1vdmU7XG4gICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ107XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuO1xuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKGluZGV4ICsgMSk7XG4gICAgICB0b2tlblRvUmVtb3ZlID0ge307XG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuO1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fTtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlO1xuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh0aGlzLnVzZXIuX2lkLCB7XG4gICAgICAgICRwdWxsOiB0b2tlblJlbW92YWxRdWVyeVxuICAgICAgfSk7XG4gICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGV4dHJhRGF0YSA9IChyZWYgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQpICE9IG51bGwgPyByZWYuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLypcbiAgICBcdFx0XHRBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgIFx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBvdXQsIHRoZSBvbkxvZ2dlZE91dCBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICBcdFx0XHRhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMuYWRkUm91dGUoJ2xvZ291dCcsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCIpO1xuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcyk7XG4gICAgICB9LFxuICAgICAgcG9zdDogbG9nb3V0XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIE9kYXRhUmVzdGl2dXM7XG5cbn0pKCk7XG5cbk9kYXRhUmVzdGl2dXMgPSB0aGlzLk9kYXRhUmVzdGl2dXM7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXG5cdGdldE9iamVjdHMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZXMpLT5cblx0XHRkYXRhID0ge31cblx0XHRvYmplY3RfbmFtZXMuc3BsaXQoJywnKS5mb3JFYWNoIChvYmplY3RfbmFtZSktPlxuXHRcdFx0b2JqZWN0ID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0XHRkYXRhW29iamVjdC5uYW1lXSA9IG9iamVjdFxuXHRcdHJldHVybiBkYXRhO1xuXG5cdGdldE9iamVjdCA9IChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKS0+XG5cdFx0ZGF0YSA9IF8uY2xvbmUoQ3JlYXRvci5PYmplY3RzW0NyZWF0b3IuZ2V0T2JqZWN0TmFtZShDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpXSlcblx0XHRpZiAhZGF0YVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5peg5pWI55qEaWQgI3tvYmplY3RfbmFtZX1cIilcblxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KS5mZXRjaCgpXG5cdFx0cHNldHMgPSB7IHBzZXRzQWRtaW4sIHBzZXRzVXNlciwgcHNldHNDdXJyZW50IH1cblxuXHRcdG9iamVjdF9wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblxuXHRcdGRlbGV0ZSBkYXRhLmxpc3Rfdmlld3Ncblx0XHRkZWxldGUgZGF0YS5wZXJtaXNzaW9uX3NldFxuXG5cdFx0aWYgb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93UmVhZFxuXHRcdFx0ZGF0YS5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0XHRkYXRhLmFsbG93RWRpdCA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0VkaXRcblx0XHRcdGRhdGEuYWxsb3dEZWxldGUgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcblx0XHRcdGRhdGEuYWxsb3dDcmVhdGUgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcblx0XHRcdGRhdGEubW9kaWZ5QWxsUmVjb3JkcyA9IG9iamVjdF9wZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXG5cblx0XHRcdGZpZWxkcyA9IHt9XG5cdFx0XHRfLmZvckVhY2ggZGF0YS5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cdFx0XHRcdF9maWVsZCA9IF8uY2xvbmUoZmllbGQpXG5cblx0XHRcdFx0aWYgIV9maWVsZC5uYW1lXG5cdFx0XHRcdFx0X2ZpZWxkLm5hbWUgPSBrZXlcblxuXHRcdFx0XHQj5bCG5LiN5Y+v57yW6L6R55qE5a2X5q616K6+572u5Li6cmVhZG9ubHkgPSB0cnVlXG5cdFx0XHRcdGlmIChfLmluZGV4T2Yob2JqZWN0X3Blcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBfZmllbGQubmFtZSkgPiAtMSlcblx0XHRcdFx0XHRfZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cblx0XHRcdFx0I+S4jei/lOWbnuS4jeWPr+ingeWtl+autVxuXHRcdFx0XHRpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpIDwgMClcblx0XHRcdFx0XHRmaWVsZHNba2V5XSA9IF9maWVsZFxuXG5cdFx0XHRkYXRhLmZpZWxkcyA9IGZpZWxkc1xuXG5cdFx0ZWxzZVxuXHRcdFx0ZGF0YS5hbGxvd1JlYWQgPSBmYWxzZVxuXG5cdFx0cmV0dXJuIGRhdGFcblxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgU3RlZWRvc09EYXRhLkFQSV9QQVRIICsgJy9vYmplY3RzLzppZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0XHR0cnlcblx0XHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG5cdFx0XHRpZiAhdXNlcklkXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIilcblxuXHRcdFx0c3BhY2VJZCA9IHJlcS5wYXJhbXM/LnNwYWNlSWRcblx0XHRcdGlmICFzcGFjZUlkXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3Mgc3BhY2VJZFwiKVxuXG5cdFx0XHRvYmplY3RfbmFtZSA9IHJlcS5wYXJhbXM/LmlkXG5cdFx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTWlzcyBpZFwiKVxuXG5cdFx0XHRfb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kT25lKHtfaWQ6IG9iamVjdF9uYW1lfSlcblxuXHRcdFx0aWYgX29iaiAmJiBfb2JqLm5hbWVcblx0XHRcdFx0b2JqZWN0X25hbWUgPSBfb2JqLm5hbWVcblxuXHRcdFx0aWYgb2JqZWN0X25hbWUuc3BsaXQoJywnKS5sZW5ndGggPiAxXG5cdFx0XHRcdGRhdGEgPSBnZXRPYmplY3RzKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRhdGEgPSBnZXRPYmplY3Qoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0XHRjb2RlOiAyMDAsXG5cdFx0XHRcdGRhdGE6IGRhdGEgfHwge31cblx0XHRcdH1cblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogZS5lcnJvciB8fCA1MDBcblx0XHRcdFx0ZGF0YToge2Vycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlfVxuXHRcdFx0fSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgZ2V0T2JqZWN0LCBnZXRPYmplY3RzO1xuICBnZXRPYmplY3RzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZXMpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0ge307XG4gICAgb2JqZWN0X25hbWVzLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIG9iamVjdCA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIHJldHVybiBkYXRhW29iamVjdC5uYW1lXSA9IG9iamVjdDtcbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbiAgZ2V0T2JqZWN0ID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBkYXRhLCBmaWVsZHMsIG9iamVjdF9wZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VycmVudCwgcHNldHNVc2VyO1xuICAgIGRhdGEgPSBfLmNsb25lKENyZWF0b3IuT2JqZWN0c1tDcmVhdG9yLmdldE9iamVjdE5hbWUoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKV0pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5peg5pWI55qEaWQgXCIgKyBvYmplY3RfbmFtZSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudFxuICAgIH07XG4gICAgb2JqZWN0X3Blcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICBkZWxldGUgZGF0YS5saXN0X3ZpZXdzO1xuICAgIGRlbGV0ZSBkYXRhLnBlcm1pc3Npb25fc2V0O1xuICAgIGlmIChvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgICBkYXRhLmFsbG93UmVhZCA9IHRydWU7XG4gICAgICBkYXRhLmFsbG93RWRpdCA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0VkaXQ7XG4gICAgICBkYXRhLmFsbG93RGVsZXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93RGVsZXRlO1xuICAgICAgZGF0YS5hbGxvd0NyZWF0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZTtcbiAgICAgIGRhdGEubW9kaWZ5QWxsUmVjb3JkcyA9IG9iamVjdF9wZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgZmllbGRzID0ge307XG4gICAgICBfLmZvckVhY2goZGF0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgICAgdmFyIF9maWVsZDtcbiAgICAgICAgX2ZpZWxkID0gXy5jbG9uZShmaWVsZCk7XG4gICAgICAgIGlmICghX2ZpZWxkLm5hbWUpIHtcbiAgICAgICAgICBfZmllbGQubmFtZSA9IGtleTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpID4gLTEpIHtcbiAgICAgICAgICBfZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmluZGV4T2Yob2JqZWN0X3Blcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBfZmllbGQubmFtZSkgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkc1trZXldID0gX2ZpZWxkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRhdGEuZmllbGRzID0gZmllbGRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCBTdGVlZG9zT0RhdGEuQVBJX1BBVEggKyAnL29iamVjdHMvOmlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgX29iaiwgZGF0YSwgZSwgb2JqZWN0X25hbWUsIHJlZiwgcmVmMSwgc3BhY2VJZCwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICAgIH1cbiAgICAgIHNwYWNlSWQgPSAocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwO1xuICAgICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3Mgc3BhY2VJZFwiKTtcbiAgICAgIH1cbiAgICAgIG9iamVjdF9uYW1lID0gKHJlZjEgPSByZXEucGFyYW1zKSAhPSBudWxsID8gcmVmMS5pZCA6IHZvaWQgMDtcbiAgICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTWlzcyBpZFwiKTtcbiAgICAgIH1cbiAgICAgIF9vYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG9iamVjdF9uYW1lXG4gICAgICB9KTtcbiAgICAgIGlmIChfb2JqICYmIF9vYmoubmFtZSkge1xuICAgICAgICBvYmplY3RfbmFtZSA9IF9vYmoubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmplY3RfbmFtZS5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZGF0YSA9IGdldE9iamVjdHMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiBkYXRhIHx8IHt9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWV0ZW9yT0RhdGFSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuTWV0ZW9yT0RhdGFSb3V0ZXI7XG5cdE9EYXRhUm91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk9EYXRhUm91dGVyXG5cdGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5cdGFwcCA9IGV4cHJlc3MuUm91dGVyKCk7XG5cdGFwcC51c2UoJy9hcGkvb2RhdGEvdjQnLCBNZXRlb3JPRGF0YVJvdXRlcik7XG5cdE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuTWV0ZW9yT0RhdGFBUElWNFJvdXRlcjtcblx0aWYgTWV0ZW9yT0RhdGFBUElWNFJvdXRlclxuXHRcdGFwcC51c2UoJy9hcGkvdjQnLCBNZXRlb3JPRGF0YUFQSVY0Um91dGVyKVxuXHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShhcHApO1xuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKS0+XG5cdFx0aWYobmFtZSAhPSAnZGVmYXVsdCcpXG5cdFx0XHRvdGhlckFwcCA9IGV4cHJlc3MuUm91dGVyKCk7XG5cdFx0XHRvdGhlckFwcC51c2UoXCIvYXBpL29kYXRhLyN7bmFtZX1cIiwgT0RhdGFSb3V0ZXIpO1xuXHRcdFx0V2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2Uob3RoZXJBcHApO1xuXG4jIFx0b2RhdGFWNE1vbmdvZGIgPSByZXF1aXJlICdAc3RlZWRvcy9vZGF0YS12NC1tb25nb2RiJ1xuIyBcdHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSAncXVlcnlzdHJpbmcnXG5cbiMgXHRoYW5kbGVFcnJvciA9IChlKS0+XG4jIFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcbiMgXHRcdGJvZHkgPSB7fVxuIyBcdFx0ZXJyb3IgPSB7fVxuIyBcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IGUubWVzc2FnZVxuIyBcdFx0c3RhdHVzQ29kZSA9IDUwMFxuIyBcdFx0aWYgZS5lcnJvciBhbmQgXy5pc051bWJlcihlLmVycm9yKVxuIyBcdFx0XHRzdGF0dXNDb2RlID0gZS5lcnJvclxuIyBcdFx0ZXJyb3JbJ2NvZGUnXSA9IHN0YXR1c0NvZGVcbiMgXHRcdGVycm9yWydlcnJvciddID0gc3RhdHVzQ29kZVxuIyBcdFx0ZXJyb3JbJ2RldGFpbHMnXSA9IGUuZGV0YWlsc1xuIyBcdFx0ZXJyb3JbJ3JlYXNvbiddID0gZS5yZWFzb25cbiMgXHRcdGJvZHlbJ2Vycm9yJ10gPSBlcnJvclxuIyBcdFx0cmV0dXJuIHtcbiMgXHRcdFx0c3RhdHVzQ29kZTogc3RhdHVzQ29kZVxuIyBcdFx0XHRib2R5OmJvZHlcbiMgXHRcdH1cblxuIyBcdHZpc2l0b3JQYXJzZXIgPSAodmlzaXRvciktPlxuIyBcdFx0cGFyc2VkT3B0ID0ge31cbiMgXHRcdGlmIHZpc2l0b3IucHJvamVjdGlvblxuIyBcdFx0XHRwYXJzZWRPcHQuZmllbGRzID0gdmlzaXRvci5wcm9qZWN0aW9uXG4jIFx0XHRpZiB2aXNpdG9yLmhhc093blByb3BlcnR5KCdsaW1pdCcpXG4jIFx0XHRcdHBhcnNlZE9wdC5saW1pdCA9IHZpc2l0b3IubGltaXRcblxuIyBcdFx0aWYgdmlzaXRvci5oYXNPd25Qcm9wZXJ0eSgnc2tpcCcpXG4jIFx0XHRcdHBhcnNlZE9wdC5za2lwID0gdmlzaXRvci5za2lwXG5cbiMgXHRcdGlmIHZpc2l0b3Iuc29ydFxuIyBcdFx0XHRwYXJzZWRPcHQuc29ydCA9IHZpc2l0b3Iuc29ydFxuXG4jIFx0XHRwYXJzZWRPcHRcbiMgXHRkZWFsV2l0aEV4cGFuZCA9IChjcmVhdGVRdWVyeSwgZW50aXRpZXMsIGtleSwgc3BhY2VJZCktPlxuIyBcdFx0aWYgXy5pc0VtcHR5IGNyZWF0ZVF1ZXJ5LmluY2x1ZGVzXG4jIFx0XHRcdHJldHVyblxuXG4jIFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpXG4jIFx0XHRfLmVhY2ggY3JlYXRlUXVlcnkuaW5jbHVkZXMsIChpbmNsdWRlKS0+XG4jIFx0XHRcdCMgY29uc29sZS5sb2cgJ2luY2x1ZGU6ICcsIGluY2x1ZGVcbiMgXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5ID0gaW5jbHVkZS5uYXZpZ2F0aW9uUHJvcGVydHlcbiMgXHRcdFx0IyBjb25zb2xlLmxvZyAnbmF2aWdhdGlvblByb3BlcnR5OiAnLCBuYXZpZ2F0aW9uUHJvcGVydHlcbiMgXHRcdFx0ZmllbGQgPSBvYmouZmllbGRzW25hdmlnYXRpb25Qcm9wZXJ0eV1cbiMgXHRcdFx0aWYgZmllbGQgYW5kIChmaWVsZC50eXBlIGlzICdsb29rdXAnIG9yIGZpZWxkLnR5cGUgaXMgJ21hc3Rlcl9kZXRhaWwnKVxuIyBcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pXG4jIFx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxuIyBcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xuIyBcdFx0XHRcdFx0cXVlcnlPcHRpb25zID0gdmlzaXRvclBhcnNlcihpbmNsdWRlKVxuIyBcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyBmaWVsZC5yZWZlcmVuY2VfdG9cbiMgXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcbiMgXHRcdFx0XHRcdFx0X3JvX05BTUVfRklFTERfS0VZID0gQ3JlYXRvci5nZXRPYmplY3QoZmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKT8uTkFNRV9GSUVMRF9LRVlcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIGVudGl0aWVzLCAoZW50aXR5LCBpZHgpLT5cbiMgXHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XVxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgZmllbGQubXVsdGlwbGVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxEYXRhID0gXy5jbG9uZShlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XSlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0bXVsdGlRdWVyeSA9IF8uZXh0ZW5kIHtfaWQ6IHskaW46IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldfX0sIGluY2x1ZGUucXVlcnlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLmZpbmQobXVsdGlRdWVyeSwgcXVlcnlPcHRpb25zKS5mZXRjaCgpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmICFlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0ubGVuZ3RoXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gb3JpZ2luYWxEYXRhXG4jIFx0XHRcdFx0XHRcdFx0XHRcdCPmjpLluo9cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMoZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldLCBvcmlnaW5hbERhdGEpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IF8ubWFwIGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSwgKG8pLT5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRvWydyZWZlcmVuY2VfdG8ubyddID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLl9uYW1lXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0b1sncmVmZXJlbmNlX3RvLl9vJ10gPSBmaWVsZC5yZWZlcmVuY2VfdG9cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRvWydfTkFNRV9GSUVMRF9WQUxVRSddID0gb1tfcm9fTkFNRV9GSUVMRF9LRVldXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9cbiMgXHRcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2luZ2xlUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XX0sIGluY2x1ZGUucXVlcnlcblxuIyBcdFx0XHRcdFx0XHRcdFx0XHQjIOeJueauiuWkhOeQhuWcqOebuOWFs+ihqOS4reayoeacieaJvuWIsOaVsOaNrueahOaDheWGte+8jOi/lOWbnuWOn+aVsOaNrlxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uZmluZE9uZShzaW5nbGVRdWVyeSwgcXVlcnlPcHRpb25zKSB8fCBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydyZWZlcmVuY2VfdG8ubyddID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLl9uYW1lXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydyZWZlcmVuY2VfdG8uX28nXSA9IGZpZWxkLnJlZmVyZW5jZV90b1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsnX05BTUVfRklFTERfVkFMVUUnXSA9IGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVtfcm9fTkFNRV9GSUVMRF9LRVldXG4jIFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkgZmllbGQucmVmZXJlbmNlX3RvXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCBlbnRpdGllcywgKGVudGl0eSwgaWR4KS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0/Lmlkc1xuIyBcdFx0XHRcdFx0XHRcdFx0X28gPSBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5vXG4jIFx0XHRcdFx0XHRcdFx0XHRfcm9fTkFNRV9GSUVMRF9LRVkgPSBDcmVhdG9yLmdldE9iamVjdChfbywgc3BhY2VJZCk/Lk5BTUVfRklFTERfS0VZXG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBxdWVyeU9wdGlvbnM/LmZpZWxkcyAmJiBfcm9fTkFNRV9GSUVMRF9LRVlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0cXVlcnlPcHRpb25zLmZpZWxkc1tfcm9fTkFNRV9GSUVMRF9LRVldID0gMVxuIyBcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLm8sIHNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdFx0XHRpZiByZWZlcmVuY2VUb0NvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZmllbGQubXVsdGlwbGVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRfaWRzID0gXy5jbG9uZShlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5pZHMpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0bXVsdGlRdWVyeSA9IF8uZXh0ZW5kIHtfaWQ6IHskaW46IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLmlkc319LCBpbmNsdWRlLnF1ZXJ5XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gXy5tYXAgcmVmZXJlbmNlVG9Db2xsZWN0aW9uLmZpbmQobXVsdGlRdWVyeSwgcXVlcnlPcHRpb25zKS5mZXRjaCgpLCAobyktPlxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1sncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1sncmVmZXJlbmNlX3RvLl9vJ10gPSBfb1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1snX05BTUVfRklFTERfVkFMVUUnXSA9IG9bX3JvX05BTUVfRklFTERfS0VZXVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHQj5o6S5bqPXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMoZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldLCBfaWRzKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c2luZ2xlUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5pZHNbMF19LCBpbmNsdWRlLnF1ZXJ5XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLmZpbmRPbmUoc2luZ2xlUXVlcnksIHF1ZXJ5T3B0aW9ucylcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydyZWZlcmVuY2VfdG8uX28nXSA9IF9vXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bX3JvX05BTUVfRklFTERfS0VZXVxuXG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdCMgVE9ET1xuXG5cbiMgXHRcdHJldHVyblxuXG4jIFx0c2V0T2RhdGFQcm9wZXJ0eT0oZW50aXRpZXMsc3BhY2Usa2V5KS0+XG4jIFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMgPSBbXVxuIyBcdFx0Xy5lYWNoIGVudGl0aWVzLCAoZW50aXR5LCBpZHgpLT5cbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHt9XG4jIFx0XHRcdGlkID0gZW50aXRpZXNbaWR4XVtcIl9pZFwiXVxuIyBcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWydAb2RhdGEuaWQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YU5leHRMaW5rUGF0aChzcGFjZSxrZXkpKyAnKFxcJycgKyBcIiN7aWR9XCIgKyAnXFwnKSdcbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmV0YWcnXSA9IFwiVy9cXFwiMDhENTg5NzIwQkJCM0RCMVxcXCJcIlxuIyBcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWydAb2RhdGEuZWRpdExpbmsnXSA9IGVudGl0eV9PZGF0YVByb3BlcnRpZXNbJ0BvZGF0YS5pZCddXG4jIFx0XHRcdF8uZXh0ZW5kIGVudGl0eV9PZGF0YVByb3BlcnRpZXMsZW50aXR5XG4jIFx0XHRcdGVudGl0aWVzX09kYXRhUHJvcGVydGllcy5wdXNoIGVudGl0eV9PZGF0YVByb3BlcnRpZXNcbiMgXHRcdHJldHVybiBlbnRpdGllc19PZGF0YVByb3BlcnRpZXNcblxuIyBcdHNldEVycm9yTWVzc2FnZSA9IChzdGF0dXNDb2RlLGNvbGxlY3Rpb24sa2V5LGFjdGlvbiktPlxuIyBcdFx0Ym9keSA9IHt9XG4jIFx0XHRlcnJvciA9IHt9XG4jIFx0XHRpbm5lcmVycm9yID0ge31cbiMgXHRcdGlmIHN0YXR1c0NvZGUgPT0gNDA0XG4jIFx0XHRcdGlmIGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRpZiBhY3Rpb24gPT0gJ3Bvc3QnXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9wb3N0X2ZhaWxcIilcbiMgXHRcdFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xuIyBcdFx0XHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwNFxuIyBcdFx0XHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV9wb3N0X2ZhaWxcIlxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3JlY29yZF9xdWVyeV9mYWlsXCIpXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcbiMgXHRcdFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDRcbiMgXHRcdFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfcmVjb3JkX3F1ZXJ5X2ZhaWxcIlxuIyBcdFx0XHRlbHNlXG4jIFx0XHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfY29sbGVjdGlvbl9xdWVyeV9mYWlsXCIpKyBrZXlcbiMgXHRcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcbiMgXHRcdFx0XHRlcnJvclsnY29kZSddID0gNDA0XG4jIFx0XHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV9jb2xsZWN0aW9uX3F1ZXJ5X2ZhaWxcIlxuIyBcdFx0aWYgIHN0YXR1c0NvZGUgPT0gNDAxXG4jIFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX2F1dGhlbnRpY2F0aW9uX3JlcXVpcmVkXCIpXG4jIFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xuIyBcdFx0XHRlcnJvclsnY29kZSddID0gNDAxXG4jIFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfYXV0aGVudGljYXRpb25fcmVxdWlyZWRcIlxuIyBcdFx0aWYgc3RhdHVzQ29kZSA9PSA0MDNcbiMgXHRcdFx0c3dpdGNoIGFjdGlvblxuIyBcdFx0XHRcdHdoZW4gJ2dldCcgdGhlbiBpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX2FjY2Vzc19mYWlsXCIpXG4jIFx0XHRcdFx0d2hlbiAncG9zdCcgdGhlbiBpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX2NyZWF0ZV9mYWlsXCIpXG4jIFx0XHRcdFx0d2hlbiAncHV0JyB0aGVuIGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfdXBkYXRlX2ZhaWxcIilcbiMgXHRcdFx0XHR3aGVuICdkZWxldGUnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9yZW1vdmVfZmFpbFwiKVxuIyBcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX2FjY2Vzc19mYWlsXCIpXG4jIFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xuIyBcdFx0XHRlcnJvclsnY29kZSddID0gNDAzXG4jIFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfdXNlcl9hY2Nlc3NfZmFpbFwiXG4jIFx0XHRlcnJvclsnaW5uZXJlcnJvciddID0gaW5uZXJlcnJvclxuIyBcdFx0Ym9keVsnZXJyb3InXSA9IGVycm9yXG4jIFx0XHRyZXR1cm4gYm9keVxuXG4jIFx0cmVtb3ZlSW52YWxpZE1ldGhvZCA9IChxdWVyeVBhcmFtcyktPlxuIyBcdFx0aWYgcXVlcnlQYXJhbXMuJGZpbHRlciAmJiBxdWVyeVBhcmFtcy4kZmlsdGVyLmluZGV4T2YoJ3RvbG93ZXIoJykgPiAtMVxuIyBcdFx0XHRyZW1vdmVNZXRob2QgPSAoJDEpLT5cbiMgXHRcdFx0XHRyZXR1cm4gJDEucmVwbGFjZSgndG9sb3dlcignLCAnJykucmVwbGFjZSgnKScsICcnKVxuIyBcdFx0XHRxdWVyeVBhcmFtcy4kZmlsdGVyID0gcXVlcnlQYXJhbXMuJGZpbHRlci5yZXBsYWNlKC90b2xvd2VyXFwoKFteXFwpXSspXFwpL2csIHJlbW92ZU1ldGhvZClcblxuIyBcdGlzU2FtZUNvbXBhbnkgPSAoc3BhY2VJZCwgdXNlcklkLCBjb21wYW55SWQsIHF1ZXJ5KS0+XG4jIFx0XHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IGNvbXBhbnlfaWQ6IDEsIGNvbXBhbnlfaWRzOiAxIH0gfSlcbiMgXHRcdGlmICFjb21wYW55SWQgJiYgcXVlcnlcbiMgXHRcdFx0Y29tcGFueUlkID0gc3UuY29tcGFueV9pZFxuIyBcdFx0XHRxdWVyeS5jb21wYW55X2lkID0geyAkaW46IHN1LmNvbXBhbnlfaWRzIH1cbiMgXHRcdHJldHVybiBzdS5jb21wYW55X2lkcy5pbmNsdWRlcyhjb21wYW55SWQpXG5cbiMgXHQjIOS4jei/lOWbnuW3suWBh+WIoOmZpOeahOaVsOaNrlxuIyBcdGV4Y2x1ZGVEZWxldGVkID0gKHF1ZXJ5KS0+XG4jIFx0XHRxdWVyeS5pc19kZWxldGVkID0geyAkbmU6IHRydWUgfVxuXG4jIFx0IyDkv67mlLnjgIHliKDpmaTml7bvvIzlpoLmnpwgZG9jLnNwYWNlID0gXCJnbG9iYWxcIu+8jOaKpemUmVxuIyBcdGNoZWNrR2xvYmFsUmVjb3JkID0gKGNvbGxlY3Rpb24sIGlkLCBvYmplY3QpLT5cbiMgXHRcdGlmIG9iamVjdC5lbmFibGVfc3BhY2VfZ2xvYmFsICYmIGNvbGxlY3Rpb24uZmluZCh7IF9pZDogaWQsIHNwYWNlOiAnZ2xvYmFsJ30pLmNvdW50KClcbiMgXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5LiN6IO95L+u5pS55oiW6ICF5Yig6Zmk5qCH5YeG5a+56LGhXCIpXG5cblxuIyBcdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnOm9iamVjdF9uYW1lJywge2F1dGhSZXF1aXJlZDogdHJ1ZSwgc3BhY2VSZXF1aXJlZDogZmFsc2V9LCB7XG4jIFx0XHRnZXQ6ICgpLT5cbiMgXHRcdFx0dHJ5XG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRcdHNwYWNlSWQgPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdGJvZHk6c2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdGJvZHk6c2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cblxuIyBcdFx0XHRcdHJlbW92ZUludmFsaWRNZXRob2QoQHF1ZXJ5UGFyYW1zKVxuIyBcdFx0XHRcdHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShAcXVlcnlQYXJhbXMpKVxuIyBcdFx0XHRcdGNyZWF0ZVF1ZXJ5ID0gaWYgcXMgdGhlbiBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeShxcykgZWxzZSBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeSgpXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBvciAocGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzICYmIGlzU2FtZUNvbXBhbnkoc3BhY2VJZCwgQHVzZXJJZCwgY3JlYXRlUXVlcnkucXVlcnkuY29tcGFueV9pZCwgY3JlYXRlUXVlcnkucXVlcnkpKSBvciAocGVybWlzc2lvbnMuYWxsb3dSZWFkIGFuZCBAdXNlcklkKVxuXG4jIFx0XHRcdFx0XHRpZiBrZXkgaXMgJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVsnbWV0YWRhdGEuc3BhY2UnXSA9IHNwYWNlSWRcbiMgXHRcdFx0XHRcdGVsc2UgaWYga2V5IGlzICdzcGFjZXMnXG4jIFx0XHRcdFx0XHRcdGlmIHNwYWNlSWQgaXNudCAnZ3Vlc3QnXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuX2lkID0gc3BhY2VJZFxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzbnQgJ2d1ZXN0JyBhbmQga2V5ICE9IFwidXNlcnNcIiBhbmQgY3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgaXNudCAnZ2xvYmFsJ1xuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0gc3BhY2VJZFxuXG4jIFx0XHRcdFx0XHRpZiBDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2VJZClcbiMgXHRcdFx0XHRcdFx0aWYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgQHVzZXJJZClcbiMgXHRcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ3NwYWNlcydcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5faWRcbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgY3JlYXRlUXVlcnkucXVlcnkuc3BhY2VcbiMgXHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdHVzZXJfc3BhY2VzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZCh7dXNlcjogQHVzZXJJZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KS5mZXRjaCgpXG4jIFx0XHRcdFx0XHRcdFx0aWYga2V5IGlzICdzcGFjZXMnXG4jIFx0XHRcdFx0XHRcdFx0XHQjIHNwYWNlIOWvueaJgOacieeUqOaIt+iusOW9leS4uuWPquivu1xuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZFxuIyBcdFx0XHRcdFx0XHRcdFx0IyBjcmVhdGVRdWVyeS5xdWVyeS5faWQgPSB7JGluOiBfLnBsdWNrKHVzZXJfc3BhY2VzLCAnc3BhY2UnKX1cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IHskaW46IF8ucGx1Y2sodXNlcl9zcGFjZXMsICdzcGFjZScpfVxuXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkuc29ydCBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnNvcnQpXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnNvcnQgPSB7IG1vZGlmaWVkOiAtMSB9XG4jIFx0XHRcdFx0XHRpc19lbnRlcnByaXNlID0gU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihzcGFjZUlkLFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiKVxuIyBcdFx0XHRcdFx0aXNfcHJvZmVzc2lvbmFsID0gU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihzcGFjZUlkLFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIpXG4jIFx0XHRcdFx0XHRpc19zdGFuZGFyZCA9IFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oc3BhY2VJZCxcIndvcmtmbG93LnN0YW5kYXJkXCIpXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5saW1pdFxuIyBcdFx0XHRcdFx0XHRsaW1pdCA9IGNyZWF0ZVF1ZXJ5LmxpbWl0XG4jIFx0XHRcdFx0XHRcdGlmIGlzX2VudGVycHJpc2UgYW5kIGxpbWl0PjEwMDAwMFxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMDAwXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYgaXNfcHJvZmVzc2lvbmFsIGFuZCBsaW1pdD4xMDAwMCBhbmQgIWlzX2VudGVycHJpc2VcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDAwXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYgaXNfc3RhbmRhcmQgYW5kIGxpbWl0PjEwMDAgYW5kICFpc19wcm9mZXNzaW9uYWwgYW5kICFpc19lbnRlcnByaXNlXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwXG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdGlmIGlzX2VudGVycHJpc2VcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDAwMFxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3Byb2Zlc3Npb25hbCBhbmQgIWlzX2VudGVycHJpc2VcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDAwXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYgaXNfc3RhbmRhcmQgYW5kICFpc19lbnRlcnByaXNlIGFuZCAhaXNfcHJvZmVzc2lvbmFsXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwXG4jIFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uXG4jIFx0XHRcdFx0XHRcdHByb2plY3Rpb24gPSB7fVxuIyBcdFx0XHRcdFx0XHRfLmtleXMoY3JlYXRlUXVlcnkucHJvamVjdGlvbikuZm9yRWFjaCAoa2V5KS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHVucmVhZGFibGVfZmllbGRzLCBrZXkpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdFx0I2lmIG5vdCAoKGZpZWxkc1trZXldPy50eXBlID09ICdsb29rdXAnIG9yIGZpZWxkc1trZXldPy50eXBlID09ICdtYXN0ZXJfZGV0YWlsJykgYW5kIGZpZWxkc1trZXldLm11bHRpcGxlKVxuIyBcdFx0XHRcdFx0XHRcdFx0cHJvamVjdGlvbltrZXldID0gMVxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uID0gcHJvamVjdGlvblxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKVxuIyBcdFx0XHRcdFx0XHRyZWFkYWJsZV9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhrZXksIHNwYWNlSWQsIEB1c2VySWQpXG4jIFx0XHRcdFx0XHRcdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZCkuZmllbGRzXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCByZWFkYWJsZV9maWVsZHMsIChmaWVsZCktPlxuIyBcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmluZGV4T2YoJyQnKSA8IDBcbiMgXHRcdFx0XHRcdFx0XHRcdCNpZiBmaWVsZHNbZmllbGRdPy5tdWx0aXBsZSE9IHRydWVcbiMgXHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25bZmllbGRdID0gMVxuIyBcdFx0XHRcdFx0aWYgbm90IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcbiMgXHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV9zaGFyZVxuIyBcdFx0XHRcdFx0XHRcdCMg5ruh6Laz5YWx5Lqr6KeE5YiZ5Lit55qE6K6w5b2V5Lmf6KaB5pCc57Si5Ye65p2lXG4jIFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGNyZWF0ZVF1ZXJ5LnF1ZXJ5Lm93bmVyXG4jIFx0XHRcdFx0XHRcdFx0c2hhcmVzID0gW11cbiMgXHRcdFx0XHRcdFx0XHRvcmdzID0gU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyhzcGFjZUlkLCBAdXNlcklkLCB0cnVlKVxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHtcIm93bmVyXCI6IEB1c2VySWR9XG4jIFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcudVwiOiBAdXNlcklkIH1cbiMgXHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7IFwic2hhcmluZy5vXCI6IHsgJGluOiBvcmdzIH0gfVxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5W1wiJG9yXCJdID0gc2hhcmVzXG4jIFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5vd25lciA9IEB1c2VySWRcbiMgXHRcdFx0XHRcdGVudGl0aWVzID0gW11cblxuIyBcdFx0XHRcdFx0ZXhjbHVkZURlbGV0ZWQoY3JlYXRlUXVlcnkucXVlcnkpXG5cbiMgXHRcdFx0XHRcdGlmIEBxdWVyeVBhcmFtcy4kdG9wIGlzbnQgJzAnXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LCB2aXNpdG9yUGFyc2VyKGNyZWF0ZVF1ZXJ5KSkuZmV0Y2goKVxuIyBcdFx0XHRcdFx0c2Nhbm5lZENvdW50ID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LHtmaWVsZHM6e19pZDogMX19KS5jb3VudCgpXG4jIFx0XHRcdFx0XHRpZiBlbnRpdGllc1xuIyBcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgZW50aXRpZXMsIGtleSwgc3BhY2VJZClcbiMgXHRcdFx0XHRcdFx0I3NjYW5uZWRDb3VudCA9IGVudGl0aWVzLmxlbmd0aFxuIyBcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHQjXHRib2R5WydAb2RhdGEubmV4dExpbmsnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YU5leHRMaW5rUGF0aChzcGFjZUlkLGtleSkrXCI/JTI0c2tpcD1cIisgMTBcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvdW50J10gPSBzY2FubmVkQ291bnRcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdGllc19PZGF0YVByb3BlcnRpZXNcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksXCJnZXRcIilcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0Y2F0Y2ggZVxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXG5cbiMgXHRcdHBvc3Q6ICgpLT5cbiMgXHRcdFx0dHJ5XG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRcdHNwYWNlSWQgPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRpZiBub3QgQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKT8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdGJvZHk6c2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHR9XG5cbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdGJvZHk6c2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG4jIFx0XHRcdFx0XHRAYm9keVBhcmFtcy5zcGFjZSA9IHNwYWNlSWRcbiMgXHRcdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0J1xuIyBcdFx0XHRcdFx0XHRkZWxldGUgQGJvZHlQYXJhbXMuc3BhY2VcbiMgXHRcdFx0XHRcdGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcbiMgXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuIyBcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxuIyBcdFx0XHRcdFx0aWYgZW50aXR5XG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMucHVzaCBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKHNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXG4jIFx0XHRcdFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLHNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0eV9PZGF0YVByb3BlcnRpZXNcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSwncG9zdCcpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdwb3N0JylcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0Y2F0Y2ggZVxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXG5cbiMgXHR9KVxuIyBcdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnOm9iamVjdF9uYW1lL3JlY2VudCcsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xuIyBcdFx0Z2V0OigpLT5cbiMgXHRcdFx0dHJ5XG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfY29sbGVjdGlvbiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiXVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfc2VsZWN0b3IgPSB7XCJyZWNvcmQub1wiOmtleSxjcmVhdGVkX2J5OkB1c2VySWR9XG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19vcHRpb25zID0ge31cbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X29wdGlvbnMuc29ydCA9IHtjcmVhdGVkOiAtMX1cbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X29wdGlvbnMuZmllbGRzID0ge3JlY29yZDoxfVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3JkcyA9IHJlY2VudF92aWV3X2NvbGxlY3Rpb24uZmluZChyZWNlbnRfdmlld19zZWxlY3RvcixyZWNlbnRfdmlld19vcHRpb25zKS5mZXRjaCgpXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IF8ucGx1Y2socmVjZW50X3ZpZXdfcmVjb3JkcywncmVjb3JkJylcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gcmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMuZ2V0UHJvcGVydHkoXCJpZHNcIilcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy5mbGF0dGVuKHJlY2VudF92aWV3X3JlY29yZHNfaWRzKVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSBfLnVuaXEocmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMpXG4jIFx0XHRcdFx0XHRyZW1vdmVJbnZhbGlkTWV0aG9kKEBxdWVyeVBhcmFtcylcbiMgXHRcdFx0XHRcdHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShAcXVlcnlQYXJhbXMpKVxuIyBcdFx0XHRcdFx0Y3JlYXRlUXVlcnkgPSBpZiBxcyB0aGVuIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KHFzKSBlbHNlIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KClcbiMgXHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5WydtZXRhZGF0YS5zcGFjZSddID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkubGltaXRcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDBcbiMgXHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LmxpbWl0IGFuZCByZWNlbnRfdmlld19yZWNvcmRzX2lkcy5sZW5ndGg+Y3JlYXRlUXVlcnkubGltaXRcbiMgXHRcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSBfLmZpcnN0KHJlY2VudF92aWV3X3JlY29yZHNfaWRzLGNyZWF0ZVF1ZXJ5LmxpbWl0KVxuIyBcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuX2lkID0geyRpbjpyZWNlbnRfdmlld19yZWNvcmRzX2lkc31cbiMgXHRcdFx0XHRcdHVucmVhZGFibGVfZmllbGRzID0gcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgfHwgW11cbiMgXHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25cbiMgXHRcdFx0XHRcdFx0cHJvamVjdGlvbiA9IHt9XG4jIFx0XHRcdFx0XHRcdF8ua2V5cyhjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKS5mb3JFYWNoIChrZXkpLT5cbiMgXHRcdFx0XHRcdFx0XHRpZiBfLmluZGV4T2YodW5yZWFkYWJsZV9maWVsZHMsIGtleSkgPCAwXG4jIFx0XHRcdFx0XHRcdFx0XHQjIGlmIG5vdCAoKGZpZWxkc1trZXldPy50eXBlID09ICdsb29rdXAnIG9yIGZpZWxkc1trZXldPy50eXBlID09ICdtYXN0ZXJfZGV0YWlsJykgYW5kIGZpZWxkc1trZXldLm11bHRpcGxlKVxuIyBcdFx0XHRcdFx0XHRcdFx0cHJvamVjdGlvbltrZXldID0gMVxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uID0gcHJvamVjdGlvblxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKVxuIyBcdFx0XHRcdFx0XHRyZWFkYWJsZV9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZClcbiMgXHRcdFx0XHRcdFx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpLmZpZWxkc1xuIyBcdFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZmllbGQpLT5cbiMgXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pbmRleE9mKCckJykgPCAwXG4jIFx0XHRcdFx0XHRcdFx0XHQjaWYgZmllbGRzW2ZpZWxkXT8ubXVsdGlwbGUhPSB0cnVlXG4jIFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uW2ZpZWxkXSA9IDFcblxuIyBcdFx0XHRcdFx0ZXhjbHVkZURlbGV0ZWQoY3JlYXRlUXVlcnkucXVlcnkpXG5cbiMgXHRcdFx0XHRcdGlmIEBxdWVyeVBhcmFtcy4kdG9wIGlzbnQgJzAnXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LCB2aXNpdG9yUGFyc2VyKGNyZWF0ZVF1ZXJ5KSkuZmV0Y2goKVxuIyBcdFx0XHRcdFx0ZW50aXRpZXNfaW5kZXggPSBbXVxuIyBcdFx0XHRcdFx0ZW50aXRpZXNfaWRzID0gXy5wbHVjayhlbnRpdGllcywnX2lkJylcbiMgXHRcdFx0XHRcdHNvcnRfZW50aXRpZXMgPSBbXVxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnNvcnQgb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5zb3J0KVxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggcmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgLChyZWNlbnRfdmlld19yZWNvcmRzX2lkKS0+XG4jIFx0XHRcdFx0XHRcdFx0aW5kZXggPSBfLmluZGV4T2YoZW50aXRpZXNfaWRzLHJlY2VudF92aWV3X3JlY29yZHNfaWQpXG4jIFx0XHRcdFx0XHRcdFx0aWYgaW5kZXg+LTFcbiMgXHRcdFx0XHRcdFx0XHRcdHNvcnRfZW50aXRpZXMucHVzaCBlbnRpdGllc1tpbmRleF1cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0c29ydF9lbnRpdGllcyA9IGVudGl0aWVzXG4jIFx0XHRcdFx0XHRpZiBzb3J0X2VudGl0aWVzXG4jIFx0XHRcdFx0XHRcdGRlYWxXaXRoRXhwYW5kKGNyZWF0ZVF1ZXJ5LCBzb3J0X2VudGl0aWVzLCBrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHQjXHRib2R5WydAb2RhdGEubmV4dExpbmsnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YU5leHRMaW5rUGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsa2V5KStcIj8lMjRza2lwPVwiKyAxMFxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY291bnQnXSA9IHNvcnRfZW50aXRpZXMubGVuZ3RoXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzX09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoc29ydF9lbnRpdGllcyxAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0aWVzX09kYXRhUHJvcGVydGllc1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwnZ2V0JylcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0Y2F0Y2ggZVxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXG4jIH0pXG5cbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZS86X2lkJywge2F1dGhSZXF1aXJlZDogdHJ1ZSwgc3BhY2VSZXF1aXJlZDogZmFsc2V9LCB7XG4jIFx0XHRwb3N0OiAoKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRpZiBub3QgQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpPy5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG4jIFx0XHRcdFx0XHRAYm9keVBhcmFtcy5zcGFjZSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xuIyBcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXG4jIFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXG4jIFx0XHRcdFx0XHRpZiBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRlbnRpdGllcy5wdXNoIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xuIyBcdFx0XHRcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0eV9PZGF0YVByb3BlcnRpZXNcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSwncG9zdCcpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdwb3N0JylcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0Y2F0Y2ggZVxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXG4jIFx0XHRnZXQ6KCktPlxuIyBcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdGlmIGtleS5pbmRleE9mKFwiKFwiKSA+IC0xXG4jIFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0Y29sbGVjdGlvbkluZm8gPSBrZXlcbiMgXHRcdFx0XHRmaWVsZE5hbWUgPSBAdXJsUGFyYW1zLl9pZC5zcGxpdCgnX2V4cGFuZCcpWzBdXG4jIFx0XHRcdFx0Y29sbGVjdGlvbkluZm9TcGxpdCA9IGNvbGxlY3Rpb25JbmZvLnNwbGl0KCcoJylcbiMgXHRcdFx0XHRjb2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb25JbmZvU3BsaXRbMF1cbiMgXHRcdFx0XHRpZCA9IGNvbGxlY3Rpb25JbmZvU3BsaXRbMV0uc3BsaXQoJ1xcJycpWzFdXG5cbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lLCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0ZmllbGRzT3B0aW9ucyA9IHt9XG4jIFx0XHRcdFx0ZmllbGRzT3B0aW9uc1tmaWVsZE5hbWVdID0gMVxuIyBcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiBpZH0sIHtmaWVsZHM6IGZpZWxkc09wdGlvbnN9KVxuXG4jIFx0XHRcdFx0ZmllbGRWYWx1ZSA9IG51bGxcbiMgXHRcdFx0XHRpZiBlbnRpdHlcbiMgXHRcdFx0XHRcdGZpZWxkVmFsdWUgPSBlbnRpdHlbZmllbGROYW1lXVxuXG4jIFx0XHRcdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3QoY29sbGVjdGlvbk5hbWUsIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRmaWVsZCA9IG9iai5maWVsZHNbZmllbGROYW1lXVxuXG4jIFx0XHRcdFx0aWYgZmllbGQgYW5kIGZpZWxkVmFsdWUgYW5kIChmaWVsZC50eXBlIGlzICdsb29rdXAnIG9yIGZpZWxkLnR5cGUgaXMgJ21hc3Rlcl9kZXRhaWwnKVxuIyBcdFx0XHRcdFx0bG9va3VwQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8sIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucyA9IHtmaWVsZHM6IHt9fVxuIyBcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoZmllbGQucmVmZXJlbmNlX3RvLCBAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQpXG4jIFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZiktPlxuIyBcdFx0XHRcdFx0XHRpZiBmLmluZGV4T2YoJyQnKSA8IDBcbiMgXHRcdFx0XHRcdFx0XHRxdWVyeU9wdGlvbnMuZmllbGRzW2ZdID0gMVxuXG4jIFx0XHRcdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuIyBcdFx0XHRcdFx0XHR2YWx1ZXMgPSBbXVxuIyBcdFx0XHRcdFx0XHRsb29rdXBDb2xsZWN0aW9uLmZpbmQoe19pZDogeyRpbjogZmllbGRWYWx1ZX19LCBxdWVyeU9wdGlvbnMpLmZvckVhY2ggKG9iaiktPlxuIyBcdFx0XHRcdFx0XHRcdF8uZWFjaCBvYmosICh2LCBrKS0+XG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkodikgfHwgKF8uaXNPYmplY3QodikgJiYgIV8uaXNEYXRlKHYpKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRvYmpba10gPSBKU09OLnN0cmluZ2lmeSh2KVxuIyBcdFx0XHRcdFx0XHRcdHZhbHVlcy5wdXNoKG9iailcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IHZhbHVlc1xuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zLnNwYWNlSWQpICsgXCIjI3tjb2xsZWN0aW9uSW5mb30vI3tAdXJsUGFyYW1zLl9pZH1cIlxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRib2R5ID0gbG9va3VwQ29sbGVjdGlvbi5maW5kT25lKHtfaWQ6IGZpZWxkVmFsdWV9LCBxdWVyeU9wdGlvbnMpIHx8IHt9XG4jIFx0XHRcdFx0XHRcdF8uZWFjaCBib2R5LCAodiwgayktPlxuIyBcdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheSh2KSB8fCAoXy5pc09iamVjdCh2KSAmJiAhXy5pc0RhdGUodikpXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5W2tdID0gSlNPTi5zdHJpbmdpZnkodilcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoQHVybFBhcmFtcy5zcGFjZUlkKSArIFwiIyN7ZmllbGQucmVmZXJlbmNlX3RvfS8kZW50aXR5XCJcblxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCkgKyBcIiMje2NvbGxlY3Rpb25JbmZvfS8je0B1cmxQYXJhbXMuX2lkfVwiXG4jIFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZmllbGRWYWx1ZVxuXG4jIFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cblxuIyBcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxuIyBcdFx0XHRlbHNlXG4jIFx0XHRcdFx0dHJ5XG4jIFx0XHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHRcdH1cblxuIyBcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG4jIFx0XHRcdFx0XHRcdHVucmVhZGFibGVfZmllbGRzID0gcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgfHwgW11cbiMgXHRcdFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXG4jIFx0XHRcdFx0XHRcdHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShAcXVlcnlQYXJhbXMpKVxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5faWQgPSAgQHVybFBhcmFtcy5faWRcbiMgXHRcdFx0XHRcdFx0aWYga2V5IGlzICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVsnbWV0YWRhdGEuc3BhY2UnXSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGtleSAhPSAnc3BhY2VzJ1xuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0gIEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXG4jIFx0XHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25cbiMgXHRcdFx0XHRcdFx0XHRwcm9qZWN0aW9uID0ge31cbiMgXHRcdFx0XHRcdFx0XHRfLmtleXMoY3JlYXRlUXVlcnkucHJvamVjdGlvbikuZm9yRWFjaCAoa2V5KS0+XG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluZGV4T2YodW5yZWFkYWJsZV9maWVsZHMsIGtleSkgPCAwXG4jIFx0XHRcdFx0XHRcdFx0XHRcdCMgaWYgbm90ICgoZmllbGRzW2tleV0/LnR5cGUgPT0gJ2xvb2t1cCcgb3IgZmllbGRzW2tleV0/LnR5cGUgPT0gJ21hc3Rlcl9kZXRhaWwnKSBhbmQgZmllbGRzW2tleV0ubXVsdGlwbGUpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3Rpb25ba2V5XSA9IDFcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uID0gcHJvamVjdGlvblxuIyBcdFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkucHJvamVjdGlvbiBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pXG4jIFx0XHRcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQpXG4jIFx0XHRcdFx0XHRcdFx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xuIyBcdFx0XHRcdFx0XHRcdF8uZWFjaCByZWFkYWJsZV9maWVsZHMsIChmaWVsZCkgLT5cbiMgXHRcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmluZGV4T2YoJyQnKSA8IDBcbiMgXHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbltmaWVsZF0gPSAxXG4jIFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShjcmVhdGVRdWVyeS5xdWVyeSx2aXNpdG9yUGFyc2VyKGNyZWF0ZVF1ZXJ5KSlcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxuIyBcdFx0XHRcdFx0XHRpZiBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0XHRpc0FsbG93ZWQgPSBlbnRpdHkub3duZXIgPT0gQHVzZXJJZCBvciBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBvciAocGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzICYmIGlzU2FtZUNvbXBhbnkoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBlbnRpdHkuY29tcGFueV9pZCkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV9zaGFyZSBhbmQgIWlzQWxsb3dlZFxuIyBcdFx0XHRcdFx0XHRcdFx0c2hhcmVzID0gW11cbiMgXHRcdFx0XHRcdFx0XHRcdG9yZ3MgPSBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwgdHJ1ZSlcbiMgXHRcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHsgXCJzaGFyaW5nLnVcIjogQHVzZXJJZCB9XG4jIFx0XHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7IFwic2hhcmluZy5vXCI6IHsgJGluOiBvcmdzIH0gfVxuIyBcdFx0XHRcdFx0XHRcdFx0aXNBbGxvd2VkID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiBAdXJsUGFyYW1zLl9pZCwgXCIkb3JcIjogc2hhcmVzIH0sIHsgZmllbGRzOiB7IF9pZDogMSB9IH0pXG4jIFx0XHRcdFx0XHRcdFx0aWYgaXNBbGxvd2VkXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXMucHVzaCBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0XHRcdGRlYWxXaXRoRXhwYW5kKGNyZWF0ZVF1ZXJ5LCBlbnRpdGllcywga2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xuIyBcdFx0XHRcdFx0XHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0XHRfLmV4dGVuZCBib2R5LGVudGl0eV9PZGF0YVByb3BlcnRpZXNbMF1cbiMgXHRcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ2dldCcpXG4jIFx0XHRcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ2dldCcpXG4jIFx0XHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwnZ2V0JylcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXG5cbiMgXHRcdHB1dDooKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxuIyBcdFx0XHRcdFx0fVxuXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBrZXkgPT0gXCJ1c2Vyc1wiXG4jIFx0XHRcdFx0XHRyZWNvcmRfb3duZXIgPSBAdXJsUGFyYW1zLl9pZFxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJlY29yZF9vd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogQHVybFBhcmFtcy5faWQgfSwgeyBmaWVsZHM6IHsgb3duZXI6IDEgfSB9KT8ub3duZXJcblxuIyBcdFx0XHRcdGNvbXBhbnlJZCA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogQHVybFBhcmFtcy5faWQgfSwgeyBmaWVsZHM6IHsgY29tcGFueV9pZDogMSB9IH0pPy5jb21wYW55X2lkXG5cbiMgXHRcdFx0XHRpc0FsbG93ZWQgPSBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIG9yIChwZXJtaXNzaW9ucy5hbGxvd0VkaXQgYW5kIHJlY29yZF9vd25lciA9PSBAdXNlcklkICkgb3IgKHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzICYmIGlzU2FtZUNvbXBhbnkoc3BhY2VJZCwgQHVzZXJJZCwgY29tcGFueUlkKSlcbiMgXHRcdFx0XHRpZiBpc0FsbG93ZWRcbiMgXHRcdFx0XHRcdGNoZWNrR2xvYmFsUmVjb3JkKGNvbGxlY3Rpb24sIEB1cmxQYXJhbXMuX2lkLCBvYmplY3QpXG4jIFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuX2lkLCBzcGFjZTogc3BhY2VJZH1cbiMgXHRcdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0JyBvciBzcGFjZUlkIGlzICdjb21tb24nIG9yIGtleSA9PSBcInVzZXJzXCJcbiMgXHRcdFx0XHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXG4jIFx0XHRcdFx0XHRmaWVsZHNfZWRpdGFibGUgPSB0cnVlXG4jIFx0XHRcdFx0XHRfLmtleXMoQGJvZHlQYXJhbXMuJHNldCkuZm9yRWFjaCAoa2V5KS0+XG4jIFx0XHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywga2V5KSA+IC0xXG4jIFx0XHRcdFx0XHRcdFx0ZmllbGRzX2VkaXRhYmxlID0gZmFsc2VcbiMgXHRcdFx0XHRcdGlmIGZpZWxkc19lZGl0YWJsZVxuIyBcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ3NwYWNlcydcbiMgXHRcdFx0XHRcdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcbiMgXHRcdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsIEBib2R5UGFyYW1zXG4jIFx0XHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxuIyBcdFx0XHRcdFx0XHRcdCNzdGF0dXNDb2RlOiAyMDFcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLl9pZFxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXRpZXMgPSBbXVxuIyBcdFx0XHRcdFx0XHRcdCMgYm9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdGllcy5wdXNoIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRcdCMgYm9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKHNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0IyBfLmV4dGVuZCBib2R5LGVudGl0eV9PZGF0YVByb3BlcnRpZXNbMF1cbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHRcdHtoZWFkZXJzOiBoZWFkZXJzLGJvZHk6Ym9keX1cbiMgXHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdwdXQnKVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncHV0JylcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0Y2F0Y2ggZVxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXG4jIFx0XHRkZWxldGU6KCktPlxuIyBcdFx0XHR0cnlcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdFx0fVxuXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdHJlY29yZERhdGEgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogQHVybFBhcmFtcy5faWR9LCB7IGZpZWxkczogeyBvd25lcjogMSwgY29tcGFueV9pZDogMSB9IH0pXG4jIFx0XHRcdFx0cmVjb3JkX293bmVyID0gcmVjb3JkRGF0YT8ub3duZXJcbiMgXHRcdFx0XHRjb21wYW55SWQgPSByZWNvcmREYXRhPy5jb21wYW55X2lkXG4jIFx0XHRcdFx0aXNBbGxvd2VkID0gKHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlKSBvciAocGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlIGFuZCBpc1NhbWVDb21wYW55KHNwYWNlSWQsIEB1c2VySWQsIGNvbXBhbnlJZCkpIG9yIChwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSBhbmQgcmVjb3JkX293bmVyPT1AdXNlcklkIClcbiMgXHRcdFx0XHRpZiBpc0FsbG93ZWRcbiMgXHRcdFx0XHRcdGNoZWNrR2xvYmFsUmVjb3JkKGNvbGxlY3Rpb24sIEB1cmxQYXJhbXMuX2lkLCBvYmplY3QpXG4jIFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuX2lkLCBzcGFjZTogc3BhY2VJZH1cbiMgXHRcdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0J1xuIyBcdFx0XHRcdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcblxuIyBcdFx0XHRcdFx0aWYgb2JqZWN0Py5lbmFibGVfdHJhc2hcbiMgXHRcdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIHtcbiMgXHRcdFx0XHRcdFx0XHQkc2V0OiB7XG4jIFx0XHRcdFx0XHRcdFx0XHRpc19kZWxldGVkOiB0cnVlLFxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlZDogbmV3IERhdGUoKSxcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZWRfYnk6IEB1c2VySWRcbiMgXHRcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0XHRcdH0pXG4jIFx0XHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdFx0e2hlYWRlcnM6IGhlYWRlcnMsYm9keTpib2R5fVxuIyBcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0aWYgY29sbGVjdGlvbi5yZW1vdmUgc2VsZWN0b3JcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0aWVzLnB1c2ggZW50aXR5XG4jIFx0XHRcdFx0XHRcdFx0IyBib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLHNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0XHQjIF8uZXh0ZW5kIGJvZHksZW50aXR5X09kYXRhUHJvcGVydGllc1swXVxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdFx0e2hlYWRlcnM6IGhlYWRlcnMsYm9keTpib2R5fVxuIyBcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0Y2F0Y2ggZVxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXG4jIFx0fSlcblxuIyBcdCMgX2lk5Y+v5LygYWxsXG4jIFx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCc6b2JqZWN0X25hbWUvOl9pZC86bWV0aG9kTmFtZScsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xuIyBcdFx0cG9zdDogKCktPlxuIyBcdFx0XHR0cnlcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKT8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuIyBcdFx0XHRcdFx0bWV0aG9kTmFtZSA9IEB1cmxQYXJhbXMubWV0aG9kTmFtZVxuIyBcdFx0XHRcdFx0bWV0aG9kcyA9IENyZWF0b3IuT2JqZWN0c1trZXldPy5tZXRob2RzIHx8IHt9XG4jIFx0XHRcdFx0XHRpZiBtZXRob2RzLmhhc093blByb3BlcnR5KG1ldGhvZE5hbWUpXG4jIFx0XHRcdFx0XHRcdHRoaXNPYmogPSB7XG4jIFx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IGtleVxuIyBcdFx0XHRcdFx0XHRcdHJlY29yZF9pZDogQHVybFBhcmFtcy5faWRcbiMgXHRcdFx0XHRcdFx0XHRzcGFjZV9pZDogQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0XHRcdFx0dXNlcl9pZDogQHVzZXJJZFxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zOiBwZXJtaXNzaW9uc1xuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0XHRcdHJldHVybiBtZXRob2RzW21ldGhvZE5hbWVdLmFwcGx5KHRoaXNPYmosIFtAYm9keVBhcmFtc10pIHx8IHt9XG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRjYXRjaCBlXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcblxuIyBcdH0pXG5cbiMgXHQjVE9ETyByZW1vdmVcbiMgXHRfLmVhY2ggW10sICh2YWx1ZSwga2V5LCBsaXN0KS0+ICNDcmVhdG9yLkNvbGxlY3Rpb25zXG4jIFx0XHRpZiBub3QgQ3JlYXRvci5nZXRPYmplY3Qoa2V5KT8uZW5hYmxlX2FwaVxuIyBcdFx0XHRyZXR1cm5cblxuIyBcdFx0aWYgU3RlZWRvc09kYXRhQVBJXG5cbiMgXHRcdFx0U3RlZWRvc09kYXRhQVBJLmFkZENvbGxlY3Rpb24gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSksXG4jIFx0XHRcdFx0ZXhjbHVkZWRFbmRwb2ludHM6IFtdXG4jIFx0XHRcdFx0cm91dGVPcHRpb25zOlxuIyBcdFx0XHRcdFx0YXV0aFJlcXVpcmVkOiB0cnVlXG4jIFx0XHRcdFx0XHRzcGFjZVJlcXVpcmVkOiBmYWxzZVxuIyBcdFx0XHRcdGVuZHBvaW50czpcbiMgXHRcdFx0XHRcdGdldEFsbDpcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cblxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBvciAocGVybWlzc2lvbnMuYWxsb3dSZWFkIGFuZCBAdXNlcklkKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRyZW1vdmVJbnZhbGlkTWV0aG9kKEBxdWVyeVBhcmFtcylcbiMgXHRcdFx0XHRcdFx0XHRcdFx0cXMgPSBkZWNvZGVVUklDb21wb25lbnQocXVlcnlzdHJpbmcuc3RyaW5naWZ5KEBxdWVyeVBhcmFtcykpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5ID0gaWYgcXMgdGhlbiBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeShxcykgZWxzZSBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeSgpXG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYga2V5IGlzICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVsnbWV0YWRhdGEuc3BhY2UnXSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSBAdXJsUGFyYW1zLnNwYWNlSWRcblxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBub3QgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHNcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5vd25lciA9IEB1c2VySWRcblxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIEBxdWVyeVBhcmFtcy4kdG9wIGlzbnQgJzAnXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnksIHZpc2l0b3JQYXJzZXIoY3JlYXRlUXVlcnkpKS5mZXRjaCgpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNjYW5uZWRDb3VudCA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSkuY291bnQoKVxuXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0aWVzXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVhbFdpdGhFeHBhbmQoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcblxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY291bnQnXSA9IHNjYW5uZWRDb3VudFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdGllc1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cbiMgXHRcdFx0XHRcdHBvc3Q6XG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XG5cbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRAYm9keVBhcmFtcy5zcGFjZSA9IEBzcGFjZUlkXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDIwMVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgdmFsdWU6IGVudGl0eX1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxuIyBcdFx0XHRcdFx0Z2V0OlxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxuXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZCwgc3BhY2U6IEBzcGFjZUlkfVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgc2VsZWN0b3JcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCB2YWx1ZTogZW50aXR5fVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxuIyBcdFx0XHRcdFx0cHV0OlxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxuXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dFZGl0XG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZCwgc3BhY2U6IEBzcGFjZUlkfVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIHZhbHVlOiBlbnRpdHl9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XG4jIFx0XHRcdFx0XHRkZWxldGU6XG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XG5cbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWQsIHNwYWNlOiBAc3BhY2VJZH1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgY29sbGVjdGlvbi5yZW1vdmUgc2VsZWN0b3JcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBNZXRlb3JPRGF0YUFQSVY0Um91dGVyLCBNZXRlb3JPRGF0YVJvdXRlciwgT0RhdGFSb3V0ZXIsIGFwcCwgZXhwcmVzcztcbiAgTWV0ZW9yT0RhdGFSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuTWV0ZW9yT0RhdGFSb3V0ZXI7XG4gIE9EYXRhUm91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk9EYXRhUm91dGVyO1xuICBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuICBhcHAgPSBleHByZXNzLlJvdXRlcigpO1xuICBhcHAudXNlKCcvYXBpL29kYXRhL3Y0JywgTWV0ZW9yT0RhdGFSb3V0ZXIpO1xuICBNZXRlb3JPRGF0YUFQSVY0Um91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk1ldGVvck9EYXRhQVBJVjRSb3V0ZXI7XG4gIGlmIChNZXRlb3JPRGF0YUFQSVY0Um91dGVyKSB7XG4gICAgYXBwLnVzZSgnL2FwaS92NCcsIE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIpO1xuICB9XG4gIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKGFwcCk7XG4gIHJldHVybiBfLmVhY2goQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIGZ1bmN0aW9uKGRhdGFzb3VyY2UsIG5hbWUpIHtcbiAgICB2YXIgb3RoZXJBcHA7XG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgb3RoZXJBcHAgPSBleHByZXNzLlJvdXRlcigpO1xuICAgICAgb3RoZXJBcHAudXNlKFwiL2FwaS9vZGF0YS9cIiArIG5hbWUsIE9EYXRhUm91dGVyKTtcbiAgICAgIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShvdGhlckFwcCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXG5iYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJylcblxuYXV0aG9yaXphdGlvbkNhY2hlID0ge31cblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSAnL2FwaS9vZGF0YS92NC8nLCAocmVxLCByZXMsIG5leHQpLT5cblxuXHRGaWJlcigoKS0+XG5cdFx0aWYgIXJlcS51c2VySWRcblx0XHRcdGlzQXV0aGVkID0gZmFsc2Vcblx0XHRcdCMgb2F1dGgy6aqM6K+BXG5cdFx0XHRpZiByZXE/LnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cblx0XHRcdFx0Y29uc29sZS5sb2cgJ09BdXRoMjogJywgcmVxLnF1ZXJ5LmFjY2Vzc190b2tlblxuXHRcdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihyZXEucXVlcnkuYWNjZXNzX3Rva2VuKVxuXHRcdFx0XHRpZiB1c2VySWRcblx0XHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblx0XHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcblx0XHRcdCMgYmFzaWPpqozor4Fcblx0XHRcdGlmIHJlcS5oZWFkZXJzWydhdXRob3JpemF0aW9uJ11cblx0XHRcdFx0YXV0aCA9IGJhc2ljQXV0aC5wYXJzZShyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKVxuXHRcdFx0XHRpZiBhdXRoXG5cdFx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHt1c2VybmFtZTogYXV0aC5uYW1lfSwgeyBmaWVsZHM6IHsgJ3NlcnZpY2VzJzogMSB9IH0pXG5cdFx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdFx0aWYgYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPT0gYXV0aC5wYXNzXG5cdFx0XHRcdFx0XHRcdGlzQXV0aGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCB1c2VyLCBhdXRoLnBhc3Ncblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGlmICFyZXN1bHQuZXJyb3Jcblx0XHRcdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRpZiBfLmtleXMoYXV0aG9yaXphdGlvbkNhY2hlKS5sZW5ndGggPiAxMDBcblx0XHRcdFx0XHRcdFx0XHRcdGF1dGhvcml6YXRpb25DYWNoZSA9IHt9XG5cdFx0XHRcdFx0XHRcdFx0YXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPSBhdXRoLnBhc3Ncblx0XHRcdGlmIGlzQXV0aGVkXG5cdFx0XHRcdHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSA9IHVzZXIuX2lkXG5cdFx0XHRcdHRva2VuID0gbnVsbFxuXHRcdFx0XHRhcHBfaWQgPSBcImNyZWF0b3JcIlxuXHRcdFx0XHRjbGllbnRfaWQgPSBcInBjXCJcblx0XHRcdFx0bG9naW5Ub2tlbnMgPSB1c2VyLnNlcnZpY2VzPy5yZXN1bWU/LmxvZ2luVG9rZW5zXG5cdFx0XHRcdGlmIGxvZ2luVG9rZW5zXG5cdFx0XHRcdFx0YXBwX2xvZ2luX3Rva2VuID0gXy5maW5kKGxvZ2luVG9rZW5zLCAodCktPlxuXHRcdFx0XHRcdFx0cmV0dXJuIHQuYXBwX2lkIGlzIGFwcF9pZCBhbmQgdC5jbGllbnRfaWQgaXMgY2xpZW50X2lkXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdHRva2VuID0gYXBwX2xvZ2luX3Rva2VuLnRva2VuIGlmIGFwcF9sb2dpbl90b2tlblxuXG5cdFx0XHRcdGlmIG5vdCB0b2tlblxuXHRcdFx0XHRcdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcblx0XHRcdFx0XHR0b2tlbiA9IGF1dGhUb2tlbi50b2tlblxuXHRcdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4gYXV0aFRva2VuXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4uYXBwX2lkID0gYXBwX2lkXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4uY2xpZW50X2lkID0gY2xpZW50X2lkXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4udG9rZW4gPSB0b2tlblxuXHRcdFx0XHRcdEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIHVzZXIuX2lkLCBoYXNoZWRUb2tlblxuXG5cdFx0XHRcdGlmIHRva2VuXG5cdFx0XHRcdFx0cmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddID0gdG9rZW5cblx0XHRuZXh0KClcblx0KS5ydW4oKVxuIiwidmFyIEZpYmVyLCBhdXRob3JpemF0aW9uQ2FjaGUsIGJhc2ljQXV0aDtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpO1xuXG5hdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL2FwaS9vZGF0YS92NC8nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFwcF9pZCwgYXBwX2xvZ2luX3Rva2VuLCBhdXRoLCBhdXRoVG9rZW4sIGNsaWVudF9pZCwgaGFzaGVkVG9rZW4sIGlzQXV0aGVkLCBsb2dpblRva2VucywgcmVmLCByZWYxLCByZWYyLCByZXN1bHQsIHRva2VuLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFyZXEudXNlcklkKSB7XG4gICAgICBpc0F1dGhlZCA9IGZhbHNlO1xuICAgICAgaWYgKHJlcSAhPSBudWxsID8gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ09BdXRoMjogJywgcmVxLnF1ZXJ5LmFjY2Vzc190b2tlbik7XG4gICAgICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIF9pZDogdXNlcklkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKSB7XG4gICAgICAgIGF1dGggPSBiYXNpY0F1dGgucGFyc2UocmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSk7XG4gICAgICAgIGlmIChhdXRoKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoLm5hbWVcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgJ3NlcnZpY2VzJzogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICBpZiAoYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPT09IGF1dGgucGFzcykge1xuICAgICAgICAgICAgICBpc0F1dGhlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBhdXRoLnBhc3MpO1xuICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5lcnJvcikge1xuICAgICAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoXy5rZXlzKGF1dGhvcml6YXRpb25DYWNoZSkubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPSBhdXRoLnBhc3M7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0F1dGhlZCkge1xuICAgICAgICByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gPSB1c2VyLl9pZDtcbiAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICBhcHBfaWQgPSBcImNyZWF0b3JcIjtcbiAgICAgICAgY2xpZW50X2lkID0gXCJwY1wiO1xuICAgICAgICBsb2dpblRva2VucyA9IChyZWYxID0gdXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5yZXN1bWUpICE9IG51bGwgPyByZWYyLmxvZ2luVG9rZW5zIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICBpZiAobG9naW5Ub2tlbnMpIHtcbiAgICAgICAgICBhcHBfbG9naW5fdG9rZW4gPSBfLmZpbmQobG9naW5Ub2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LmFwcF9pZCA9PT0gYXBwX2lkICYmIHQuY2xpZW50X2lkID09PSBjbGllbnRfaWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGFwcF9sb2dpbl90b2tlbikge1xuICAgICAgICAgICAgdG9rZW4gPSBhcHBfbG9naW5fdG9rZW4udG9rZW47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICAgICAgICAgIHRva2VuID0gYXV0aFRva2VuLnRva2VuO1xuICAgICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgICBoYXNoZWRUb2tlbi5hcHBfaWQgPSBhcHBfaWQ7XG4gICAgICAgICAgaGFzaGVkVG9rZW4uY2xpZW50X2lkID0gY2xpZW50X2lkO1xuICAgICAgICAgIGhhc2hlZFRva2VuLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4odXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV4dCgpO1xuICB9KS5ydW4oKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0U2VydmljZU1ldGFkYXRhID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YScpLlNlcnZpY2VNZXRhZGF0YTtcblx0U2VydmljZURvY3VtZW50ID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1kb2N1bWVudCcpLlNlcnZpY2VEb2N1bWVudDtcblx0X05VTUJFUl9UWVBFUyA9IFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCJdXG5cblx0X0JPT0xFQU5fVFlQRVMgPSBbXCJib29sZWFuXCJdXG5cblx0X0RBVEVUSU1FX09GRlNFVF9UWVBFUyA9IFsnZGF0ZXRpbWUnXVxuXG5cdF9OQU1FU1BBQ0UgPSBcIkNyZWF0b3JFbnRpdGllc1wiXG5cblx0Z2V0T2JqZWN0c09kYXRhU2NoZW1hID0gKHNwYWNlSWQpLT5cblx0XHRzY2hlbWEgPSB7dmVyc2lvbjogU3RlZWRvc09EYXRhLlZFUlNJT04sIGRhdGFTZXJ2aWNlczoge3NjaGVtYTogW119fVxuXG5cdFx0ZW50aXRpZXNfc2NoZW1hID0ge31cblxuXHRcdGVudGl0aWVzX3NjaGVtYS5uYW1lc3BhY2UgPSBfTkFNRVNQQUNFXG5cblx0XHRlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSA9IFtdXG5cblx0XHRlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMgPSBbXVxuXG5cdFx0Xy5lYWNoIENyZWF0b3IuQ29sbGVjdGlvbnMsICh2YWx1ZSwga2V5LCBsaXN0KS0+XG5cdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKVxuXHRcdFx0aWYgbm90IF9vYmplY3Q/LmVuYWJsZV9hcGlcblx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdCMg5Li76ZSuXG5cdFx0XHRrZXlzID0gW3twcm9wZXJ0eVJlZjoge25hbWU6IFwiX2lkXCIsIGNvbXB1dGVkS2V5OiB0cnVlfX1dXG5cblx0XHRcdGVudGl0aWUgPSB7XG5cdFx0XHRcdG5hbWU6IF9vYmplY3QubmFtZVxuXHRcdFx0XHRrZXk6a2V5c1xuXHRcdFx0fVxuXG5cdFx0XHRrZXlzLmZvckVhY2ggKF9rZXkpLT5cblx0XHRcdFx0ZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zLnB1c2gge1xuXHRcdFx0XHRcdHRhcmdldDogX05BTUVTUEFDRSArIFwiLlwiICsgX29iamVjdC5uYW1lICsgXCIvXCIgKyBfa2V5LnByb3BlcnR5UmVmLm5hbWUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbjogW3tcblx0XHRcdFx0XHRcdFwidGVybVwiOiBcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbXB1dGVkXCIsXG5cdFx0XHRcdFx0XHRcImJvb2xcIjogXCJ0cnVlXCJcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9XG5cblx0XHRcdCMgRW50aXR5VHlwZVxuXHRcdFx0cHJvcGVydHkgPSBbXVxuXHRcdFx0cHJvcGVydHkucHVzaCB7bmFtZTogXCJfaWRcIiwgdHlwZTogXCJFZG0uU3RyaW5nXCIsIG51bGxhYmxlOiBmYWxzZX1cblxuXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5ID0gW11cblxuXHRcdFx0Xy5mb3JFYWNoIF9vYmplY3QuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblxuXHRcdFx0XHRfcHJvcGVydHkgPSB7bmFtZTogZmllbGRfbmFtZSwgdHlwZTogXCJFZG0uU3RyaW5nXCJ9XG5cblx0XHRcdFx0aWYgXy5jb250YWlucyBfTlVNQkVSX1RZUEVTLCBmaWVsZC50eXBlXG5cdFx0XHRcdFx0X3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Eb3VibGVcIlxuXHRcdFx0XHRlbHNlIGlmIF8uY29udGFpbnMgX0JPT0xFQU5fVFlQRVMsIGZpZWxkLnR5cGVcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkJvb2xlYW5cIlxuXHRcdFx0XHRlbHNlIGlmIF8uY29udGFpbnMgX0RBVEVUSU1FX09GRlNFVF9UWVBFUywgZmllbGQudHlwZVxuXHRcdFx0XHRcdF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIlxuXHRcdFx0XHRcdF9wcm9wZXJ0eS5wcmVjaXNpb24gPSBcIjhcIlxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlcXVpcmVkXG5cdFx0XHRcdFx0X3Byb3BlcnR5Lm51bGxhYmxlID0gZmFsc2VcblxuXHRcdFx0XHRwcm9wZXJ0eS5wdXNoIF9wcm9wZXJ0eVxuXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdGlmICFfLmlzQXJyYXkocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gW3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdHJlZmVyZW5jZV90by5mb3JFYWNoIChyKS0+XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2Vfb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qociwgc3BhY2VJZClcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZV9vYmpcblx0XHRcdFx0XHRcdFx0X25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVhcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lXG5cdFx0XHRcdFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eS5wdXNoIHtcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBfbmFtZSxcblx0I1x0XHRcdFx0XHRcdFx0dHlwZTogXCJDb2xsZWN0aW9uKFwiICsgX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lICsgXCIpXCIsXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lXG5cdFx0XHRcdFx0XHRcdFx0cGFydG5lcjogX29iamVjdC5uYW1lICNUT0RPXG5cdFx0XHRcdFx0XHRcdFx0X3JlX25hbWU6IHJlZmVyZW5jZV9vYmoubmFtZVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludDogW1xuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eTogZmllbGRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlZFByb3BlcnR5OiBcIl9pZFwiXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybiBcInJlZmVyZW5jZSB0byAnI3tyfScgaW52YWxpZC5cIlxuXG5cdFx0XHRlbnRpdGllLnByb3BlcnR5ID0gcHJvcGVydHlcblx0XHRcdGVudGl0aWUubmF2aWdhdGlvblByb3BlcnR5ID0gbmF2aWdhdGlvblByb3BlcnR5XG5cblx0XHRcdGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLnB1c2ggZW50aXRpZVxuXG5cdFx0c2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaCBlbnRpdGllc19zY2hlbWFcblxuXG5cdFx0Y29udGFpbmVyX3NjaGVtYSA9IHt9XG5cdFx0Y29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIgPSB7bmFtZTogXCJjb250YWluZXJcIn1cblx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQgPSBbXVxuXG5cdFx0Xy5mb3JFYWNoIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLCAoX2V0LCBrKS0+XG5cdFx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQucHVzaCB7XG5cdFx0XHRcdFwibmFtZVwiOiBfZXQubmFtZSxcblx0XHRcdFx0XCJlbnRpdHlUeXBlXCI6IF9OQU1FU1BBQ0UgKyBcIi5cIiArIF9ldC5uYW1lLFxuXHRcdFx0XHRcIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIjogW11cblx0XHRcdH1cblxuXHRcdCMgVE9ETyBTZXJ2aWNlTWV0YWRhdGHkuI3mlK/mjIFuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5n5bGe5oCnXG4jXHRcdF8uZm9yRWFjaCBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgKF9ldCwgayktPlxuI1x0XHRcdF8uZm9yRWFjaCBfZXQubmF2aWdhdGlvblByb3BlcnR5LCAoX2V0X25wLCBucF9rKS0+XG4jXHRcdFx0XHRfZXMgPSBfLmZpbmQgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LCAoX2VzKS0+XG4jXHRcdFx0XHRcdFx0XHRyZXR1cm4gX2VzLm5hbWUgPT0gX2V0X25wLnBhcnRuZXJcbiNcbiNcdFx0XHRcdF9lcz8ubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5wdXNoIHtcInBhdGhcIjogX2V0X25wLl9yZV9uYW1lLCBcInRhcmdldFwiOiBfZXRfbnAuX3JlX25hbWV9XG4jXHRcdFx0XHRjb25zb2xlLmxvZyhcIl9lc1wiLCBfZXMpXG4jXG4jXHRcdGNvbnNvbGUubG9nKFwiY29udGFpbmVyX3NjaGVtYVwiLCBKU09OLnN0cmluZ2lmeShjb250YWluZXJfc2NoZW1hKSlcblxuXHRcdHNjaGVtYS5kYXRhU2VydmljZXMuc2NoZW1hLnB1c2ggY29udGFpbmVyX3NjaGVtYVxuXG5cdFx0cmV0dXJuIHNjaGVtYVxuXG5cdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnJywge2F1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRH0sIHtcblx0XHRnZXQ6ICgpLT5cblx0XHRcdGNvbnRleHQgPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXM/LnNwYWNlSWQpXG5cdFx0XHRzZXJ2aWNlRG9jdW1lbnQgID0gU2VydmljZURvY3VtZW50LnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKEB1cmxQYXJhbXM/LnNwYWNlSWQpLCB7Y29udGV4dDogY29udGV4dH0pO1xuXHRcdFx0Ym9keSA9IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyxcblx0XHRcdFx0XHQnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJvZHk6IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG5cdFx0XHR9O1xuXHR9KVxuXG5cdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZShTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCwge2F1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRH0sIHtcblx0XHRnZXQ6ICgpLT5cblx0XHRcdHNlcnZpY2VNZXRhZGF0YSA9IFNlcnZpY2VNZXRhZGF0YS5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYShAdXJsUGFyYW1zPy5zcGFjZUlkKSlcblx0XHRcdGJvZHkgPSBzZXJ2aWNlTWV0YWRhdGEuZG9jdW1lbnQoKVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sOyBjaGFyc2V0PXV0Zi04Jyxcblx0XHRcdFx0XHQnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJvZHk6IGJvZHlcblx0XHRcdH07XG5cdH0pIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBTZXJ2aWNlRG9jdW1lbnQsIFNlcnZpY2VNZXRhZGF0YSwgX0JPT0xFQU5fVFlQRVMsIF9EQVRFVElNRV9PRkZTRVRfVFlQRVMsIF9OQU1FU1BBQ0UsIF9OVU1CRVJfVFlQRVMsIGdldE9iamVjdHNPZGF0YVNjaGVtYTtcbiAgU2VydmljZU1ldGFkYXRhID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YScpLlNlcnZpY2VNZXRhZGF0YTtcbiAgU2VydmljZURvY3VtZW50ID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1kb2N1bWVudCcpLlNlcnZpY2VEb2N1bWVudDtcbiAgX05VTUJFUl9UWVBFUyA9IFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCJdO1xuICBfQk9PTEVBTl9UWVBFUyA9IFtcImJvb2xlYW5cIl07XG4gIF9EQVRFVElNRV9PRkZTRVRfVFlQRVMgPSBbJ2RhdGV0aW1lJ107XG4gIF9OQU1FU1BBQ0UgPSBcIkNyZWF0b3JFbnRpdGllc1wiO1xuICBnZXRPYmplY3RzT2RhdGFTY2hlbWEgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGNvbnRhaW5lcl9zY2hlbWEsIGVudGl0aWVzX3NjaGVtYSwgc2NoZW1hO1xuICAgIHNjaGVtYSA9IHtcbiAgICAgIHZlcnNpb246IFN0ZWVkb3NPRGF0YS5WRVJTSU9OLFxuICAgICAgZGF0YVNlcnZpY2VzOiB7XG4gICAgICAgIHNjaGVtYTogW11cbiAgICAgIH1cbiAgICB9O1xuICAgIGVudGl0aWVzX3NjaGVtYSA9IHt9O1xuICAgIGVudGl0aWVzX3NjaGVtYS5uYW1lc3BhY2UgPSBfTkFNRVNQQUNFO1xuICAgIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlID0gW107XG4gICAgZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zID0gW107XG4gICAgXy5lYWNoKENyZWF0b3IuQ29sbGVjdGlvbnMsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGxpc3QpIHtcbiAgICAgIHZhciBfb2JqZWN0LCBlbnRpdGllLCBrZXlzLCBuYXZpZ2F0aW9uUHJvcGVydHksIHByb3BlcnR5O1xuICAgICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZCk7XG4gICAgICBpZiAoIShfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmVuYWJsZV9hcGkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGtleXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm9wZXJ0eVJlZjoge1xuICAgICAgICAgICAgbmFtZTogXCJfaWRcIixcbiAgICAgICAgICAgIGNvbXB1dGVkS2V5OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgZW50aXRpZSA9IHtcbiAgICAgICAgbmFtZTogX29iamVjdC5uYW1lLFxuICAgICAgICBrZXk6IGtleXNcbiAgICAgIH07XG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oX2tleSkge1xuICAgICAgICByZXR1cm4gZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zLnB1c2goe1xuICAgICAgICAgIHRhcmdldDogX05BTUVTUEFDRSArIFwiLlwiICsgX29iamVjdC5uYW1lICsgXCIvXCIgKyBfa2V5LnByb3BlcnR5UmVmLm5hbWUsXG4gICAgICAgICAgYW5ub3RhdGlvbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRlcm1cIjogXCJPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZFwiLFxuICAgICAgICAgICAgICBcImJvb2xcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBwcm9wZXJ0eSA9IFtdO1xuICAgICAgcHJvcGVydHkucHVzaCh7XG4gICAgICAgIG5hbWU6IFwiX2lkXCIsXG4gICAgICAgIHR5cGU6IFwiRWRtLlN0cmluZ1wiLFxuICAgICAgICBudWxsYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgbmF2aWdhdGlvblByb3BlcnR5ID0gW107XG4gICAgICBfLmZvckVhY2goX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIHZhciBfcHJvcGVydHksIHJlZmVyZW5jZV90bztcbiAgICAgICAgX3Byb3BlcnR5ID0ge1xuICAgICAgICAgIG5hbWU6IGZpZWxkX25hbWUsXG4gICAgICAgICAgdHlwZTogXCJFZG0uU3RyaW5nXCJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKF8uY29udGFpbnMoX05VTUJFUl9UWVBFUywgZmllbGQudHlwZSkpIHtcbiAgICAgICAgICBfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRvdWJsZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKF8uY29udGFpbnMoX0JPT0xFQU5fVFlQRVMsIGZpZWxkLnR5cGUpKSB7XG4gICAgICAgICAgX3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Cb29sZWFuXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5jb250YWlucyhfREFURVRJTUVfT0ZGU0VUX1RZUEVTLCBmaWVsZC50eXBlKSkge1xuICAgICAgICAgIF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjtcbiAgICAgICAgICBfcHJvcGVydHkucHJlY2lzaW9uID0gXCI4XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICAgICAgX3Byb3BlcnR5Lm51bGxhYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcHJvcGVydHkucHVzaChfcHJvcGVydHkpO1xuICAgICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgIGlmIChyZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoIV8uaXNBcnJheShyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICByZWZlcmVuY2VfdG8gPSBbcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIHZhciBfbmFtZSwgcmVmZXJlbmNlX29iajtcbiAgICAgICAgICAgIHJlZmVyZW5jZV9vYmogPSBDcmVhdG9yLmdldE9iamVjdChyLCBzcGFjZUlkKTtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2Vfb2JqKSB7XG4gICAgICAgICAgICAgIF9uYW1lID0gZmllbGRfbmFtZSArIFN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYO1xuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBuYXZpZ2F0aW9uUHJvcGVydHkucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogX25hbWUsXG4gICAgICAgICAgICAgICAgdHlwZTogX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lLFxuICAgICAgICAgICAgICAgIHBhcnRuZXI6IF9vYmplY3QubmFtZSxcbiAgICAgICAgICAgICAgICBfcmVfbmFtZTogcmVmZXJlbmNlX29iai5uYW1lLFxuICAgICAgICAgICAgICAgIHJlZmVyZW50aWFsQ29uc3RyYWludDogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogZmllbGRfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlZFByb3BlcnR5OiBcIl9pZFwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oXCJyZWZlcmVuY2UgdG8gJ1wiICsgciArIFwiJyBpbnZhbGlkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBlbnRpdGllLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgICBlbnRpdGllLm5hdmlnYXRpb25Qcm9wZXJ0eSA9IG5hdmlnYXRpb25Qcm9wZXJ0eTtcbiAgICAgIHJldHVybiBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZS5wdXNoKGVudGl0aWUpO1xuICAgIH0pO1xuICAgIHNjaGVtYS5kYXRhU2VydmljZXMuc2NoZW1hLnB1c2goZW50aXRpZXNfc2NoZW1hKTtcbiAgICBjb250YWluZXJfc2NoZW1hID0ge307XG4gICAgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIgPSB7XG4gICAgICBuYW1lOiBcImNvbnRhaW5lclwiXG4gICAgfTtcbiAgICBjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQgPSBbXTtcbiAgICBfLmZvckVhY2goZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUsIGZ1bmN0aW9uKF9ldCwgaykge1xuICAgICAgcmV0dXJuIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldC5wdXNoKHtcbiAgICAgICAgXCJuYW1lXCI6IF9ldC5uYW1lLFxuICAgICAgICBcImVudGl0eVR5cGVcIjogX05BTUVTUEFDRSArIFwiLlwiICsgX2V0Lm5hbWUsXG4gICAgICAgIFwibmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiOiBbXVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgc2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaChjb250YWluZXJfc2NoZW1hKTtcbiAgICByZXR1cm4gc2NoZW1hO1xuICB9O1xuICBTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJycsIHtcbiAgICBhdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRURcbiAgfSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm9keSwgY29udGV4dCwgcmVmLCByZWYxLCBzZXJ2aWNlRG9jdW1lbnQ7XG4gICAgICBjb250ZXh0ID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aCgocmVmID0gdGhpcy51cmxQYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgICBzZXJ2aWNlRG9jdW1lbnQgPSBTZXJ2aWNlRG9jdW1lbnQucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoKHJlZjEgPSB0aGlzLnVybFBhcmFtcykgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCksIHtcbiAgICAgICAgY29udGV4dDogY29udGV4dFxuICAgICAgfSk7XG4gICAgICBib2R5ID0gc2VydmljZURvY3VtZW50LmRvY3VtZW50KCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEgsIHtcbiAgICBhdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRURcbiAgfSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm9keSwgcmVmLCBzZXJ2aWNlTWV0YWRhdGE7XG4gICAgICBzZXJ2aWNlTWV0YWRhdGEgPSBTZXJ2aWNlTWV0YWRhdGEucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoKHJlZiA9IHRoaXMudXJsUGFyYW1zKSAhPSBudWxsID8gcmVmLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICAgIGJvZHkgPSBzZXJ2aWNlTWV0YWRhdGEuZG9jdW1lbnQoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbDsgY2hhcnNldD11dGYtOCcsXG4gICAgICAgICAgJ09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBib2R5XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIkBTdGVlZG9zT0RhdGEgPSB7fVxuU3RlZWRvc09EYXRhLlZFUlNJT04gPSAnNC4wJ1xuU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRCA9IHRydWVcblN0ZWVkb3NPRGF0YS5BUElfUEFUSCA9ICcvYXBpL29kYXRhL3Y0LzpzcGFjZUlkJ1xuU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEggPSAnJG1ldGFkYXRhJ1xuU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVggPSBcIl9leHBhbmRcIlxuU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoID0gKHNwYWNlSWQpLT5cblx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgnYXBpL29kYXRhL3Y0LycgKyBzcGFjZUlkKVxuXG5TdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoID0gKHNwYWNlSWQsb2JqZWN0X25hbWUpLT5cblx0cmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIFwiLyN7b2JqZWN0X25hbWV9XCJcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGggPSAoc3BhY2VJZCktPlxuXHRcdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je1N0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIfVwiXG5cblx0U3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGggPSAoc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIFwiIyN7b2JqZWN0X25hbWV9XCJcblx0U3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoID0gKHNwYWNlSWQsb2JqZWN0X25hbWUpLT5cblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgXCIvI3tvYmplY3RfbmFtZX1cIlxuXG5cblx0QFN0ZWVkb3NPZGF0YUFQSSA9IG5ldyBPZGF0YVJlc3RpdnVzXG5cdFx0YXBpUGF0aDogU3RlZWRvc09EYXRhLkFQSV9QQVRILFxuXHRcdHVzZURlZmF1bHRBdXRoOiB0cnVlXG5cdFx0cHJldHR5SnNvbjogdHJ1ZVxuXHRcdGVuYWJsZUNvcnM6IHRydWVcblx0XHRkZWZhdWx0SGVhZGVyczpcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiIsInRoaXMuU3RlZWRvc09EYXRhID0ge307XG5cblN0ZWVkb3NPRGF0YS5WRVJTSU9OID0gJzQuMCc7XG5cblN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUQgPSB0cnVlO1xuXG5TdGVlZG9zT0RhdGEuQVBJX1BBVEggPSAnL2FwaS9vZGF0YS92NC86c3BhY2VJZCc7XG5cblN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIID0gJyRtZXRhZGF0YSc7XG5cblN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYID0gXCJfZXhwYW5kXCI7XG5cblN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgnYXBpL29kYXRhL3Y0LycgKyBzcGFjZUlkKTtcbn07XG5cblN0ZWVkb3NPRGF0YS5nZXRPRGF0YVBhdGggPSBmdW5jdGlvbihzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyAoXCIvXCIgKyBTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCk7XG4gIH07XG4gIFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIChcIiNcIiArIG9iamVjdF9uYW1lKTtcbiAgfTtcbiAgU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICB9O1xuICB0aGlzLlN0ZWVkb3NPZGF0YUFQSSA9IG5ldyBPZGF0YVJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiBTdGVlZG9zT0RhdGEuQVBJX1BBVEgsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiB0cnVlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
