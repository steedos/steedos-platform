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
  "odata-v4-service-document": "^0.0.3",
  cookies: "^0.6.1"
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
  app = express();
  app.use('/api/odata/v4', MeteorODataRouter);
  MeteorODataAPIV4Router = require('@steedos/core').MeteorODataAPIV4Router;

  if (MeteorODataAPIV4Router) {
    app.use('/api/v4', MeteorODataAPIV4Router);
  }

  WebApp.connectHandlers.use(app);
  return _.each(Creator.steedosSchema.getDataSources(), function (datasource, name) {
    var otherApp;

    if (name !== 'default') {
      otherApp = express();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL29iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21pZGRsZXdhcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWlkZGxld2FyZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsImNvb2tpZXMiLCJnZXRVc2VyUXVlcnlTZWxlY3RvciIsInVzZXJWYWxpZGF0b3IiLCJBdXRoIiwiTWF0Y2giLCJXaGVyZSIsInVzZXIiLCJjaGVjayIsImlkIiwiT3B0aW9uYWwiLCJTdHJpbmciLCJ1c2VybmFtZSIsImVtYWlsIiwiXyIsImtleXMiLCJsZW5ndGgiLCJFcnJvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicGFzc3dvcmQiLCJhdXRoVG9rZW4iLCJhdXRoZW50aWNhdGluZ1VzZXIiLCJhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciIsImhhc2hlZFRva2VuIiwicGFzc3dvcmRWZXJpZmljYXRpb24iLCJyZWYiLCJzcGFjZV91c2VycyIsInNwYWNlcyIsIk1ldGVvciIsInVzZXJzIiwiZmluZE9uZSIsInNlcnZpY2VzIiwiQWNjb3VudHMiLCJfY2hlY2tQYXNzd29yZCIsImVycm9yIiwiX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4iLCJfaGFzaFN0YW1wZWRUb2tlbiIsIl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIiwiX2lkIiwiZGIiLCJmaW5kIiwiZmV0Y2giLCJlYWNoIiwic3UiLCJzcGFjZSIsImluZGV4T2YiLCJhZG1pbnMiLCJwdXNoIiwibmFtZSIsInRva2VuIiwidXNlcklkIiwiYWRtaW5TcGFjZXMiLCJlbnYiLCJwcm9jZXNzIiwiTk9ERV9FTlYiLCJpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSIsImVyciIsInJlcSIsInJlcyIsInN0YXR1c0NvZGUiLCJzdGF0dXMiLCJtc2ciLCJzdGFjayIsInRvU3RyaW5nIiwiY29uc29sZSIsImhlYWRlcnNTZW50Iiwic29ja2V0IiwiZGVzdHJveSIsInNldEhlYWRlciIsIkJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJtZXRob2QiLCJlbmQiLCJzaGFyZSIsIlJvdXRlIiwiYXBpIiwicGF0aCIsIm9wdGlvbnMiLCJlbmRwb2ludHMxIiwiZW5kcG9pbnRzIiwicHJvdG90eXBlIiwiYWRkVG9BcGkiLCJhdmFpbGFibGVNZXRob2RzIiwiYWxsb3dlZE1ldGhvZHMiLCJmdWxsUGF0aCIsInJlamVjdGVkTWV0aG9kcyIsInNlbGYiLCJjb250YWlucyIsIl9jb25maWciLCJwYXRocyIsImV4dGVuZCIsImRlZmF1bHRPcHRpb25zRW5kcG9pbnQiLCJfcmVzb2x2ZUVuZHBvaW50cyIsIl9jb25maWd1cmVFbmRwb2ludHMiLCJmaWx0ZXIiLCJyZWplY3QiLCJhcGlQYXRoIiwiZW5kcG9pbnQiLCJKc29uUm91dGVzIiwiYWRkIiwiZG9uZUZ1bmMiLCJlbmRwb2ludENvbnRleHQiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZUluaXRpYXRlZCIsInVybFBhcmFtcyIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicXVlcnkiLCJib2R5UGFyYW1zIiwiYm9keSIsInJlcXVlc3QiLCJyZXNwb25zZSIsImRvbmUiLCJfY2FsbEVuZHBvaW50IiwiZXJyb3IxIiwiaGVhZGVycyIsIl9yZXNwb25kIiwibWVzc2FnZSIsImpvaW4iLCJ0b1VwcGVyQ2FzZSIsImlzRnVuY3Rpb24iLCJhY3Rpb24iLCJyZWYxIiwicmVmMiIsInJvbGVSZXF1aXJlZCIsInVuaW9uIiwiaXNFbXB0eSIsImF1dGhSZXF1aXJlZCIsInNwYWNlUmVxdWlyZWQiLCJpbnZvY2F0aW9uIiwiX2F1dGhBY2NlcHRlZCIsIl9yb2xlQWNjZXB0ZWQiLCJfc3BhY2VBY2NlcHRlZCIsIkREUENvbW1vbiIsIk1ldGhvZEludm9jYXRpb24iLCJpc1NpbXVsYXRpb24iLCJjb25uZWN0aW9uIiwicmFuZG9tU2VlZCIsIm1ha2VScGNTZWVkIiwiRERQIiwiX0N1cnJlbnRJbnZvY2F0aW9uIiwid2l0aFZhbHVlIiwiY2FsbCIsIl9hdXRoZW50aWNhdGUiLCJhdXRoIiwidXNlclNlbGVjdG9yIiwic3BhY2VfdXNlcnNfY291bnQiLCJzcGFjZUlkIiwiY291bnQiLCJpbnRlcnNlY3Rpb24iLCJyb2xlcyIsImRlZmF1bHRIZWFkZXJzIiwiZGVsYXlJbk1pbGxpc2Vjb25kcyIsIm1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzIiwicmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28iLCJzZW5kUmVzcG9uc2UiLCJfbG93ZXJDYXNlS2V5cyIsIm1hdGNoIiwicHJldHR5SnNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3cml0ZUhlYWQiLCJ3cml0ZSIsIk1hdGgiLCJyYW5kb20iLCJzZXRUaW1lb3V0Iiwib2JqZWN0IiwiY2hhaW4iLCJwYWlycyIsIm1hcCIsImF0dHIiLCJ0b0xvd2VyQ2FzZSIsInZhbHVlIiwiQ29va2llcyIsIk9kYXRhUmVzdGl2dXMiLCJiYXNpY0F1dGgiLCJpdGVtIiwiaSIsImwiLCJjb3JzSGVhZGVycyIsIl9yb3V0ZXMiLCJ1c2VEZWZhdWx0QXV0aCIsInZlcnNpb24iLCJfdXNlciIsImdldCIsIl9oYXNoTG9naW5Ub2tlbiIsImVuYWJsZUNvcnMiLCJzbGljZSIsImxhc3QiLCJfaW5pdEF1dGgiLCJ1c2VBdXRoIiwid2FybiIsImFkZFJvdXRlIiwicm91dGUiLCJhZGRDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FbmRwb2ludHMiLCJjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMiLCJlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24iLCJlbnRpdHlSb3V0ZUVuZHBvaW50cyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwibWV0aG9kcyIsIm1ldGhvZHNPbkNvbGxlY3Rpb24iLCJyb3V0ZU9wdGlvbnMiLCJfdXNlckNvbGxlY3Rpb25FbmRwb2ludHMiLCJfY29sbGVjdGlvbkVuZHBvaW50cyIsIl9uYW1lIiwiY29uZmlndXJlZEVuZHBvaW50IiwiZW5kcG9pbnRPcHRpb25zIiwibWV0aG9kVHlwZSIsImNsb25lIiwiZW50aXR5Iiwic2VsZWN0b3IiLCJkYXRhIiwicHV0IiwiZW50aXR5SXNVcGRhdGVkIiwidXBkYXRlIiwiJHNldCIsInJlbW92ZSIsInBvc3QiLCJlbnRpdHlJZCIsImluc2VydCIsImdldEFsbCIsImVudGl0aWVzIiwiZmllbGRzIiwicHJvZmlsZSIsImNyZWF0ZVVzZXIiLCJsb2dvdXQiLCJlIiwiZXh0cmFEYXRhIiwic2VhcmNoUXVlcnkiLCJyZWFzb24iLCJvbkxvZ2dlZEluIiwiZXh0cmEiLCJpbmRleCIsInRva2VuRmllbGROYW1lIiwidG9rZW5Mb2NhdGlvbiIsInRva2VuUGF0aCIsInRva2VuUmVtb3ZhbFF1ZXJ5IiwidG9rZW5Ub1JlbW92ZSIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwiJHB1bGwiLCJvbkxvZ2dlZE91dCIsInN0YXJ0dXAiLCJnZXRPYmplY3QiLCJnZXRPYmplY3RzIiwib2JqZWN0X25hbWVzIiwic3BsaXQiLCJmb3JFYWNoIiwib2JqZWN0X25hbWUiLCJvYmplY3RfcGVybWlzc2lvbnMiLCJwc2V0cyIsInBzZXRzQWRtaW4iLCJwc2V0c0N1cnJlbnQiLCJwc2V0c1VzZXIiLCJDcmVhdG9yIiwiT2JqZWN0cyIsImdldE9iamVjdE5hbWUiLCJnZXRDb2xsZWN0aW9uIiwiYXNzaWduZWRfYXBwcyIsImdldE9iamVjdFBlcm1pc3Npb25zIiwiYmluZCIsImxpc3Rfdmlld3MiLCJwZXJtaXNzaW9uX3NldCIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwiYWxsb3dDcmVhdGUiLCJtb2RpZnlBbGxSZWNvcmRzIiwiZmllbGQiLCJrZXkiLCJfZmllbGQiLCJ1bmVkaXRhYmxlX2ZpZWxkcyIsInJlYWRvbmx5IiwidW5yZWFkYWJsZV9maWVsZHMiLCJTdGVlZG9zT0RhdGEiLCJBUElfUEFUSCIsIm5leHQiLCJfb2JqIiwiU3RlZWRvcyIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJzZW5kUmVzdWx0IiwiY29kZSIsImVycm9ycyIsIk1ldGVvck9EYXRhQVBJVjRSb3V0ZXIiLCJNZXRlb3JPRGF0YVJvdXRlciIsIk9EYXRhUm91dGVyIiwiYXBwIiwiZXhwcmVzcyIsInVzZSIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInN0ZWVkb3NTY2hlbWEiLCJnZXREYXRhU291cmNlcyIsImRhdGFzb3VyY2UiLCJvdGhlckFwcCIsIkZpYmVyIiwiYXV0aG9yaXphdGlvbkNhY2hlIiwiTWlkZGxld2FyZSIsImFwcF9pZCIsImFwcF9sb2dpbl90b2tlbiIsImNsaWVudF9pZCIsImlzQXV0aGVkIiwibG9naW5Ub2tlbnMiLCJyZXN1bHQiLCJhY2Nlc3NfdG9rZW4iLCJsb2ciLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJwYXJzZSIsInBhc3MiLCJyZXN1bWUiLCJ0IiwicnVuIiwiU2VydmljZURvY3VtZW50IiwiU2VydmljZU1ldGFkYXRhIiwiX0JPT0xFQU5fVFlQRVMiLCJfREFURVRJTUVfT0ZGU0VUX1RZUEVTIiwiX05BTUVTUEFDRSIsIl9OVU1CRVJfVFlQRVMiLCJnZXRPYmplY3RzT2RhdGFTY2hlbWEiLCJjb250YWluZXJfc2NoZW1hIiwiZW50aXRpZXNfc2NoZW1hIiwic2NoZW1hIiwiVkVSU0lPTiIsImRhdGFTZXJ2aWNlcyIsIm5hbWVzcGFjZSIsImVudGl0eVR5cGUiLCJhbm5vdGF0aW9ucyIsIkNvbGxlY3Rpb25zIiwibGlzdCIsIl9vYmplY3QiLCJlbnRpdGllIiwibmF2aWdhdGlvblByb3BlcnR5IiwicHJvcGVydHkiLCJlbmFibGVfYXBpIiwicHJvcGVydHlSZWYiLCJjb21wdXRlZEtleSIsIl9rZXkiLCJ0YXJnZXQiLCJhbm5vdGF0aW9uIiwidHlwZSIsIm51bGxhYmxlIiwiZmllbGRfbmFtZSIsIl9wcm9wZXJ0eSIsInJlZmVyZW5jZV90byIsInByZWNpc2lvbiIsInJlcXVpcmVkIiwiaXNBcnJheSIsInIiLCJyZWZlcmVuY2Vfb2JqIiwiRVhQQU5EX0ZJRUxEX1NVRkZJWCIsInBhcnRuZXIiLCJfcmVfbmFtZSIsInJlZmVyZW50aWFsQ29uc3RyYWludCIsInJlZmVyZW5jZWRQcm9wZXJ0eSIsImVudGl0eUNvbnRhaW5lciIsImVudGl0eVNldCIsIl9ldCIsImsiLCJTdGVlZG9zT2RhdGFBUEkiLCJBVVRIUkVRVUlSRUQiLCJjb250ZXh0Iiwic2VydmljZURvY3VtZW50IiwiZ2V0TWV0YURhdGFQYXRoIiwicHJvY2Vzc01ldGFkYXRhSnNvbiIsImRvY3VtZW50IiwiTUVUQURBVEFfUEFUSCIsInNlcnZpY2VNZXRhZGF0YSIsImdldFJvb3RQYXRoIiwiYWJzb2x1dGVVcmwiLCJnZXRPRGF0YVBhdGgiLCJpc1NlcnZlciIsImdldE9EYXRhQ29udGV4dFBhdGgiLCJnZXRPRGF0YU5leHRMaW5rUGF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7O0FBQXJCO0FBQ0FDLE9BQU8sQ0FBQyx5QkFBRCxDQUFQOztBQUdBSixnQkFBZ0IsQ0FBQztBQUNoQixnQkFBYyxRQURFO0FBRWhCLCtCQUE2QixRQUZiO0FBR2hCLCtCQUE2QixRQUhiO0FBSWhCSyxTQUFPLEVBQUU7QUFKTyxDQUFELEVBS2IsZUFMYSxDQUFoQixDOzs7Ozs7Ozs7Ozs7QUNKQSxJQUFBQyxvQkFBQSxFQUFBQyxhQUFBO0FBQUEsS0FBQ0MsSUFBRCxVQUFDQSxJQUFELEdBQVUsRUFBVixFLENBRUE7OztBQUdBRCxnQkFBZ0JFLE1BQU1DLEtBQU4sQ0FBWSxVQUFDQyxJQUFEO0FBQzNCQyxRQUFNRCxJQUFOLEVBQ0M7QUFBQUUsUUFBSUosTUFBTUssUUFBTixDQUFlQyxNQUFmLENBQUo7QUFDQUMsY0FBVVAsTUFBTUssUUFBTixD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QUFhNkYsV0FBYixDQUF5QjlOLE9BQXpCLEtBQW9DLE1BQUl1RyxXQUF4QyxDQUFQO0FBRDJCLENBQTVCOztBQUdBLElBQUc5TixPQUFPd1YsUUFBVjtBQUNDaEcsZUFBYXdGLGVBQWIsR0FBK0IsVUFBQ3pOLE9BQUQ7QUFDOUIsV0FBT2lJLGFBQWE2RixXQUFiLENBQXlCOU4sT0FBekIsS0FBb0MsTUFBSWlJLGFBQWEyRixhQUFyRCxDQUFQO0FBRDhCLEdBQS9COztBQUdBM0YsZUFBYWlHLG1CQUFiLEdBQW1DLFVBQUNsTyxPQUFELEVBQVV1RyxXQUFWO0FBQ2xDLFdBQU8wQixhQUFhd0YsZUFBYixDQUE2QnpOLE9BQTdCLEtBQXdDLE1BQUl1RyxXQUE1QyxDQUFQO0FBRGtDLEdBQW5DOztBQUVBMEIsZUFBYWtHLG9CQUFiLEdBQW9DLFVBQUNuTyxPQUFELEVBQVN1RyxXQUFUO0FBQ25DLFdBQU8wQixhQUFhNkYsV0FBYixDQUF5QjlOLE9BQXpCLEtBQW9DLE1BQUl1RyxXQUF4QyxDQUFQO0FBRG1DLEdBQXBDOztBQUlBLE9BQUM4RyxlQUFELEdBQW1CLElBQUkxTCxhQUFKLENBQ2xCO0FBQUE5RSxhQUFTb0wsYUFBYUMsUUFBdEI7QUFDQWhHLG9CQUFnQixJQURoQjtBQUVBdkIsZ0JBQVksSUFGWjtBQUdBNEIsZ0JBQVksSUFIWjtBQUlBbkMsb0JBQ0M7QUFBQSxzQkFBZ0I7QUFBaEI7QUFMRCxHQURrQixDQUFuQjtBQ2lCQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZml4IHdhcm5pbmc6IHh4eCBub3QgaW5zdGFsbGVkXG5yZXF1aXJlKFwiYmFzaWMtYXV0aC9wYWNrYWdlLmpzb25cIik7XG5cbmltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHQnYmFzaWMtYXV0aCc6ICdeMi4wLjEnLFxuXHQnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YSc6IFwiXjAuMS42XCIsXG5cdFwib2RhdGEtdjQtc2VydmljZS1kb2N1bWVudFwiOiBcIl4wLjAuM1wiLFxuXHRjb29raWVzOiBcIl4wLjYuMVwiLFxufSwgJ3N0ZWVkb3M6b2RhdGEnKTtcbiIsIkBBdXRoIG9yPSB7fVxuXG4jIyNcblx0QSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuIyMjXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUgKHVzZXIpIC0+XG5cdGNoZWNrIHVzZXIsXG5cdFx0aWQ6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuXHRcdHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcblx0XHRlbWFpbDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG5cblx0aWYgXy5rZXlzKHVzZXIpLmxlbmd0aCBpcyBub3QgMVxuXHRcdHRocm93IG5ldyBNYXRjaC5FcnJvciAnVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCdcblxuXHRyZXR1cm4gdHJ1ZVxuXG5cbiMjI1xuXHRSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4jIyNcbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gKHVzZXIpIC0+XG5cdGlmIHVzZXIuaWRcblx0XHRyZXR1cm4geydfaWQnOiB1c2VyLmlkfVxuXHRlbHNlIGlmIHVzZXIudXNlcm5hbWVcblx0XHRyZXR1cm4geyd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWV9XG5cdGVsc2UgaWYgdXNlci5lbWFpbFxuXHRcdHJldHVybiB7J2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbH1cblxuXHQjIFdlIHNob3VsZG4ndCBiZSBoZXJlIGlmIHRoZSB1c2VyIG9iamVjdCB3YXMgcHJvcGVybHkgdmFsaWRhdGVkXG5cdHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcidcblxuXG4jIyNcblx0TG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXG4jIyNcbkBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gKHVzZXIsIHBhc3N3b3JkKSAtPlxuXHRpZiBub3QgdXNlciBvciBub3QgcGFzc3dvcmRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHQjIFZhbGlkYXRlIHRoZSBsb2dpbiBpbnB1dCB0eXBlc1xuXHRjaGVjayB1c2VyLCB1c2VyVmFsaWRhdG9yXG5cdGNoZWNrIHBhc3N3b3JkLCBTdHJpbmdcblxuXHQjIFJldHJpZXZlIHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG5cdGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcilcblx0YXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpXG5cblx0aWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXHRpZiBub3QgYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzPy5wYXNzd29yZFxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdCMgQXV0aGVudGljYXRlIHRoZSB1c2VyJ3MgcGFzc3dvcmRcblx0cGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCBhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkXG5cdGlmIHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0IyBBZGQgYSBuZXcgYXV0aCB0b2tlbiB0byB0aGUgdXNlcidzIGFjY291bnRcblx0YXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKVxuXHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxuXHRBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlblxuXG5cdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZH0pLmZldGNoKClcblx0c3BhY2VzID0gW11cblx0Xy5lYWNoIHNwYWNlX3VzZXJzLCAoc3UpLT5cblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKVxuXHRcdCMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xuXHRcdGlmIHNwYWNlICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpPj0wXG5cdFx0XHRzcGFjZXMucHVzaFxuXHRcdFx0XHRfaWQ6IHNwYWNlLl9pZFxuXHRcdFx0XHRuYW1lOiBzcGFjZS5uYW1lXG5cdHJldHVybiB7YXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgYWRtaW5TcGFjZXM6IHNwYWNlc31cbiIsInZhciBnZXRVc2VyUXVlcnlTZWxlY3RvciwgdXNlclZhbGlkYXRvcjtcblxudGhpcy5BdXRoIHx8ICh0aGlzLkF1dGggPSB7fSk7XG5cblxuLypcblx0QSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuICovXG5cbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbih1c2VyKSB7XG4gIGNoZWNrKHVzZXIsIHtcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKVxuICB9KTtcbiAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggPT09ICExKSB7XG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKCdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuXG4vKlxuXHRSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4gKi9cblxuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSBmdW5jdGlvbih1c2VyKSB7XG4gIGlmICh1c2VyLmlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdfaWQnOiB1c2VyLmlkXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWVcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIuZW1haWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJyk7XG59O1xuXG5cbi8qXG5cdExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuICovXG5cbnRoaXMuQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3N3b3JkKSB7XG4gIHZhciBhdXRoVG9rZW4sIGF1dGhlbnRpY2F0aW5nVXNlciwgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IsIGhhc2hlZFRva2VuLCBwYXNzd29yZFZlcmlmaWNhdGlvbiwgcmVmLCBzcGFjZV91c2Vycywgc3BhY2VzO1xuICBpZiAoIXVzZXIgfHwgIXBhc3N3b3JkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBjaGVjayh1c2VyLCB1c2VyVmFsaWRhdG9yKTtcbiAgY2hlY2socGFzc3dvcmQsIFN0cmluZyk7XG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcik7XG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKTtcbiAgaWYgKCFhdXRoZW50aWNhdGluZ1VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGlmICghKChyZWYgPSBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXMpICE9IG51bGwgPyByZWYucGFzc3dvcmQgOiB2b2lkIDApKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmQpO1xuICBpZiAocGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4oYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW4pO1xuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWRcbiAgfSkuZmV0Y2goKTtcbiAgc3BhY2VzID0gW107XG4gIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24oc3UpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSk7XG4gICAgaWYgKHNwYWNlICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpID49IDApIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh7XG4gICAgICAgIF9pZDogc3BhY2UuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGF1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLFxuICAgIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCxcbiAgICBhZG1pblNwYWNlczogc3BhY2VzXG4gIH07XG59O1xuIiwiLy8gV2UgbmVlZCBhIGZ1bmN0aW9uIHRoYXQgdHJlYXRzIHRocm93biBlcnJvcnMgZXhhY3RseSBsaWtlIElyb24gUm91dGVyIHdvdWxkLlxuLy8gVGhpcyBmaWxlIGlzIHdyaXR0ZW4gaW4gSmF2YVNjcmlwdCB0byBlbmFibGUgY29weS1wYXN0aW5nIElyb24gUm91dGVyIGNvZGUuXG5cbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDNcbnZhciBlbnYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnO1xuXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0w0N1xuaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UgPSBmdW5jdGlvbihlcnIsIHJlcSwgcmVzKSB7XG5cdGlmIChyZXMuc3RhdHVzQ29kZSA8IDQwMClcblx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcblxuXHRpZiAoZXJyLnN0YXR1cylcblx0XHRyZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XG5cblx0aWYgKGVudiA9PT0gJ2RldmVsb3BtZW50Jylcblx0XHRtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xuXHRlbHNlXG5cdC8vWFhYIGdldCB0aGlzIGZyb20gc3RhbmRhcmQgZGljdCBvZiBlcnJvciBtZXNzYWdlcz9cblx0XHRtc2cgPSAnU2VydmVyIGVycm9yLic7XG5cblx0Y29uc29sZS5lcnJvcihlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpO1xuXG5cdGlmIChyZXMuaGVhZGVyc1NlbnQpXG5cdFx0cmV0dXJuIHJlcS5zb2NrZXQuZGVzdHJveSgpO1xuXG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L2h0bWwnKTtcblx0cmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBCdWZmZXIuYnl0ZUxlbmd0aChtc2cpKTtcblx0aWYgKHJlcS5tZXRob2QgPT09ICdIRUFEJylcblx0XHRyZXR1cm4gcmVzLmVuZCgpO1xuXHRyZXMuZW5kKG1zZyk7XG5cdHJldHVybjtcbn1cbiIsImNsYXNzIHNoYXJlLlJvdXRlXG5cblx0Y29uc3RydWN0b3I6IChAYXBpLCBAcGF0aCwgQG9wdGlvbnMsIEBlbmRwb2ludHMpIC0+XG5cdFx0IyBDaGVjayBpZiBvcHRpb25zIHdlcmUgcHJvdmlkZWRcblx0XHRpZiBub3QgQGVuZHBvaW50c1xuXHRcdFx0QGVuZHBvaW50cyA9IEBvcHRpb25zXG5cdFx0XHRAb3B0aW9ucyA9IHt9XG5cblxuXHRhZGRUb0FwaTogZG8gLT5cblx0XHRhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXVxuXG5cdFx0cmV0dXJuIC0+XG5cdFx0XHRzZWxmID0gdGhpc1xuXG5cdFx0XHQjIFRocm93IGFuIGVycm9yIGlmIGEgcm91dGUgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCBhdCB0aGlzIHBhdGhcblx0XHRcdCMgVE9ETzogQ2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aCBwYXRocyB0aGF0IGZvbGxvdyBzYW1lIHBhdHRlcm4gd2l0aCBkaWZmZXJlbnQgcGFyYW1ldGVyIG5hbWVzXG5cdFx0XHRpZiBfLmNvbnRhaW5zIEBhcGkuX2NvbmZpZy5wYXRocywgQHBhdGhcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6ICN7QHBhdGh9XCJcblxuXHRcdFx0IyBPdmVycmlkZSB0aGUgZGVmYXVsdCBPUFRJT05TIGVuZHBvaW50IHdpdGggb3VyIG93blxuXHRcdFx0QGVuZHBvaW50cyA9IF8uZXh0ZW5kIG9wdGlvbnM6IEBhcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50LCBAZW5kcG9pbnRzXG5cblx0XHRcdCMgQ29uZmlndXJlIGVhY2ggZW5kcG9pbnQgb24gdGhpcyByb3V0ZVxuXHRcdFx0QF9yZXNvbHZlRW5kcG9pbnRzKClcblx0XHRcdEBfY29uZmlndXJlRW5kcG9pbnRzKClcblxuXHRcdFx0IyBBZGQgdG8gb3VyIGxpc3Qgb2YgZXhpc3RpbmcgcGF0aHNcblx0XHRcdEBhcGkuX2NvbmZpZy5wYXRocy5wdXNoIEBwYXRoXG5cblx0XHRcdGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cblx0XHRcdFx0Xy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXG5cdFx0XHRyZWplY3RlZE1ldGhvZHMgPSBfLnJlamVjdCBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHRfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcblxuXHRcdFx0IyBTZXR1cCBlbmRwb2ludHMgb24gcm91dGVcblx0XHRcdGZ1bGxQYXRoID0gQGFwaS5fY29uZmlnLmFwaVBhdGggKyBAcGF0aFxuXHRcdFx0Xy5lYWNoIGFsbG93ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHRlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF1cblx0XHRcdFx0SnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxuXHRcdFx0XHRcdCMgQWRkIGZ1bmN0aW9uIHRvIGVuZHBvaW50IGNvbnRleHQgZm9yIGluZGljYXRpbmcgYSByZXNwb25zZSBoYXMgYmVlbiBpbml0aWF0ZWQgbWFudWFsbHlcblx0XHRcdFx0XHRyZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0ZG9uZUZ1bmMgPSAtPlxuXHRcdFx0XHRcdFx0cmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlXG5cblx0XHRcdFx0XHRlbmRwb2ludENvbnRleHQgPVxuXHRcdFx0XHRcdFx0dXJsUGFyYW1zOiByZXEucGFyYW1zXG5cdFx0XHRcdFx0XHRxdWVyeVBhcmFtczogcmVxLnF1ZXJ5XG5cdFx0XHRcdFx0XHRib2R5UGFyYW1zOiByZXEuYm9keVxuXHRcdFx0XHRcdFx0cmVxdWVzdDogcmVxXG5cdFx0XHRcdFx0XHRyZXNwb25zZTogcmVzXG5cdFx0XHRcdFx0XHRkb25lOiBkb25lRnVuY1xuXHRcdFx0XHRcdCMgQWRkIGVuZHBvaW50IGNvbmZpZyBvcHRpb25zIHRvIGNvbnRleHRcblx0XHRcdFx0XHRfLmV4dGVuZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cblx0XHRcdFx0XHQjIFJ1biB0aGUgcmVxdWVzdGVkIGVuZHBvaW50XG5cdFx0XHRcdFx0cmVzcG9uc2VEYXRhID0gbnVsbFxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0cmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50IGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0IyBEbyBleGFjdGx5IHdoYXQgSXJvbiBSb3V0ZXIgd291bGQgaGF2ZSBkb25lLCB0byBhdm9pZCBjaGFuZ2luZyB0aGUgQVBJXG5cdFx0XHRcdFx0XHRpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdFx0XHRpZiByZXNwb25zZUluaXRpYXRlZFxuXHRcdFx0XHRcdFx0IyBFbnN1cmUgdGhlIHJlc3BvbnNlIGlzIHByb3Blcmx5IGNvbXBsZXRlZFxuXHRcdFx0XHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiByZXMuaGVhZGVyc1NlbnRcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxuXHRcdFx0XHRcdFx0ZWxzZSBpZiByZXNwb25zZURhdGEgaXMgbnVsbCBvciByZXNwb25zZURhdGEgaXMgdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcblxuXHRcdFx0XHRcdCMgR2VuZXJhdGUgYW5kIHJldHVybiB0aGUgaHR0cCByZXNwb25zZSwgaGFuZGxpbmcgdGhlIGRpZmZlcmVudCBlbmRwb2ludCByZXNwb25zZSB0eXBlc1xuXHRcdFx0XHRcdGlmIHJlc3BvbnNlRGF0YS5ib2R5IGFuZCAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgb3IgcmVzcG9uc2VEYXRhLmhlYWRlcnMpXG5cdFx0XHRcdFx0XHRzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVyc1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGFcblxuXHRcdFx0Xy5lYWNoIHJlamVjdGVkTWV0aG9kcywgKG1ldGhvZCkgLT5cblx0XHRcdFx0SnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxuXHRcdFx0XHRcdHJlc3BvbnNlRGF0YSA9IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcblx0XHRcdFx0XHRoZWFkZXJzID0gJ0FsbG93JzogYWxsb3dlZE1ldGhvZHMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdFx0c2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzXG5cblxuXHQjIyNcblx0XHRDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcblx0XHRmdW5jdGlvblxuXG5cdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG5cdCMjI1xuXHRfcmVzb2x2ZUVuZHBvaW50czogLT5cblx0XHRfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykgLT5cblx0XHRcdGlmIF8uaXNGdW5jdGlvbihlbmRwb2ludClcblx0XHRcdFx0ZW5kcG9pbnRzW21ldGhvZF0gPSB7YWN0aW9uOiBlbmRwb2ludH1cblx0XHRyZXR1cm5cblxuXG5cdCMjI1xuXHRcdENvbmZpZ3VyZSB0aGUgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnQgb24gYWxsIGVuZHBvaW50cyAoZXhjZXB0IE9QVElPTlMsIHdoaWNoIG11c3Rcblx0XHRiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcblxuXHRcdEF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3IgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuXG5cdFx0ZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcblx0XHRvdmVycmlkZSB0aGUgZGVmYXVsdC5cblxuXHRcdEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuXHRcdGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG5cdFx0cmVzcGVjdGl2ZWx5LlxuXG5cdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG5cdFx0QHBhcmFtIHtFbmRwb2ludH0gZW5kcG9pbnQgVGhlIGVuZHBvaW50IHRvIGNvbmZpZ3VyZVxuXHQjIyNcblx0X2NvbmZpZ3VyZUVuZHBvaW50czogLT5cblx0XHRfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QpIC0+XG5cdFx0XHRpZiBtZXRob2QgaXNudCAnb3B0aW9ucydcblx0XHRcdFx0IyBDb25maWd1cmUgYWNjZXB0YWJsZSByb2xlc1xuXHRcdFx0XHRpZiBub3QgQG9wdGlvbnM/LnJvbGVSZXF1aXJlZFxuXHRcdFx0XHRcdEBvcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdXG5cdFx0XHRcdGlmIG5vdCBlbmRwb2ludC5yb2xlUmVxdWlyZWRcblx0XHRcdFx0XHRlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBbXVxuXHRcdFx0XHRlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBfLnVuaW9uIGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgQG9wdGlvbnMucm9sZVJlcXVpcmVkXG5cdFx0XHRcdCMgTWFrZSBpdCBlYXNpZXIgdG8gY2hlY2sgaWYgbm8gcm9sZXMgYXJlIHJlcXVpcmVkXG5cdFx0XHRcdGlmIF8uaXNFbXB0eSBlbmRwb2ludC5yb2xlUmVxdWlyZWRcblx0XHRcdFx0XHRlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZVxuXG5cdFx0XHRcdCMgQ29uZmlndXJlIGF1dGggcmVxdWlyZW1lbnRcblx0XHRcdFx0aWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkIGlzIHVuZGVmaW5lZFxuXHRcdFx0XHRcdGlmIEBvcHRpb25zPy5hdXRoUmVxdWlyZWQgb3IgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG5cdFx0XHRcdFx0XHRlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSB0cnVlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0ZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2VcblxuXHRcdFx0XHRpZiBAb3B0aW9ucz8uc3BhY2VSZXF1aXJlZFxuXHRcdFx0XHRcdGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSBAb3B0aW9ucy5zcGFjZVJlcXVpcmVkXG5cdFx0XHRcdHJldHVyblxuXHRcdCwgdGhpc1xuXHRcdHJldHVyblxuXG5cblx0IyMjXG5cdFx0QXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuXG5cdFx0QHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXG5cdCMjI1xuXHRfY2FsbEVuZHBvaW50OiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cblx0XHQjIENhbGwgdGhlIGVuZHBvaW50IGlmIGF1dGhlbnRpY2F0aW9uIGRvZXNuJ3QgZmFpbFxuXHRcdGlmIEBfYXV0aEFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblx0XHRcdGlmIEBfcm9sZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblx0XHRcdFx0aWYgQF9zcGFjZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblx0XHRcdFx0XHQjZW5kcG9pbnQuYWN0aW9uLmNhbGwgZW5kcG9pbnRDb250ZXh0XG5cdFx0XHRcdFx0aW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvblxuXHRcdFx0XHRcdFx0aXNTaW11bGF0aW9uOiB0cnVlLFxuXHRcdFx0XHRcdFx0dXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuXHRcdFx0XHRcdFx0Y29ubmVjdGlvbjogbnVsbCxcblx0XHRcdFx0XHRcdHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG5cblx0XHRcdFx0XHRyZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUgaW52b2NhdGlvbiwgLT5cblx0XHRcdFx0XHRcdHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG5cdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuXHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxuXHRcdGVsc2Vcblx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuXHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XG5cblxuXHQjIyNcblx0XHRBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG5cblx0XHRPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG5cdFx0aW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG5cdFx0aW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cblx0XHRAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG5cdCMjI1xuXHRfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cblx0XHRpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWRcblx0XHRcdEBfYXV0aGVudGljYXRlIGVuZHBvaW50Q29udGV4dFxuXHRcdGVsc2UgdHJ1ZVxuXG5cblx0IyMjXG5cdFx0VmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcblxuXHRcdElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cblxuXHRcdEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuXHQjIyNcblx0X2F1dGhlbnRpY2F0ZTogKGVuZHBvaW50Q29udGV4dCkgLT5cblx0XHQjIEdldCBhdXRoIGluZm9cblx0XHRhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcblxuXHRcdCMgR2V0IHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG5cdFx0aWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcblx0XHRcdHVzZXJTZWxlY3RvciA9IHt9XG5cdFx0XHR1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWRcblx0XHRcdHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXG5cdFx0XHRhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSB1c2VyU2VsZWN0b3JcblxuXHRcdCMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcblx0XHRpZiBhdXRoPy51c2VyXG5cdFx0XHRlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcblx0XHRcdHRydWVcblx0XHRlbHNlIGZhbHNlXG5cblx0IyMjXG5cdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG5cdFx0XHRcdFx0XHQgZW5kcG9pbnRcblx0IyMjXG5cdF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cblx0XHRpZiBlbmRwb2ludC5zcGFjZVJlcXVpcmVkXG5cdFx0XHRhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcblx0XHRcdGlmIGF1dGg/LnNwYWNlSWRcblx0XHRcdFx0c3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoLnVzZXJJZCwgc3BhY2U6YXV0aC5zcGFjZUlkfSkuY291bnQoKVxuXHRcdFx0XHRpZiBzcGFjZV91c2Vyc19jb3VudFxuXHRcdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxuXHRcdFx0XHRcdCMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xuXHRcdFx0XHRcdGlmIHNwYWNlICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKT49MFxuXHRcdFx0XHRcdFx0ZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWRcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCJcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHJldHVybiB0cnVlXG5cblx0IyMjXG5cdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG5cdFx0XHRcdFx0XHQgZW5kcG9pbnRcblx0IyMjXG5cdF9yb2xlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuXHRcdGlmIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuXHRcdFx0aWYgXy5pc0VtcHR5IF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHRydWVcblxuXG5cdCMjI1xuXHRcdFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG5cdCMjI1xuXHRfcmVzcG9uZDogKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlPTIwMCwgaGVhZGVycz17fSkgLT5cblx0XHQjIE92ZXJyaWRlIGFueSBkZWZhdWx0IGhlYWRlcnMgdGhhdCBoYXZlIGJlZW4gcHJvdmlkZWQgKGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gYmUgY2FzZSBpbnNlbnNpdGl2ZSlcblx0XHQjIFRPRE86IENvbnNpZGVyIG9ubHkgbG93ZXJjYXNpbmcgdGhlIGhlYWRlciBrZXlzIHdlIG5lZWQgbm9ybWFsaXplZCwgbGlrZSBDb250ZW50LVR5cGVcblx0XHRkZWZhdWx0SGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBAYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnNcblx0XHRoZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIGhlYWRlcnNcblx0XHRoZWFkZXJzID0gXy5leHRlbmQgZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnNcblxuXHRcdCMgUHJlcGFyZSBKU09OIGJvZHkgZm9yIHJlc3BvbnNlIHdoZW4gQ29udGVudC1UeXBlIGluZGljYXRlcyBKU09OIHR5cGVcblx0XHRpZiBoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgaXNudCBudWxsXG5cdFx0XHRpZiBAYXBpLl9jb25maWcucHJldHR5SnNvblxuXHRcdFx0XHRib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keSwgdW5kZWZpbmVkLCAyXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5XG5cblx0XHQjIFNlbmQgcmVzcG9uc2Vcblx0XHRzZW5kUmVzcG9uc2UgPSAtPlxuXHRcdFx0cmVzcG9uc2Uud3JpdGVIZWFkIHN0YXR1c0NvZGUsIGhlYWRlcnNcblx0XHRcdHJlc3BvbnNlLndyaXRlIGJvZHlcblx0XHRcdHJlc3BvbnNlLmVuZCgpXG5cdFx0aWYgc3RhdHVzQ29kZSBpbiBbNDAxLCA0MDNdXG5cdFx0XHQjIEhhY2tlcnMgY2FuIG1lYXN1cmUgdGhlIHJlc3BvbnNlIHRpbWUgdG8gZGV0ZXJtaW5lIHRoaW5ncyBsaWtlIHdoZXRoZXIgdGhlIDQwMSByZXNwb25zZSB3YXNcblx0XHRcdCMgY2F1c2VkIGJ5IGJhZCB1c2VyIGlkIHZzIGJhZCBwYXNzd29yZC5cblx0XHRcdCMgSW4gZG9pbmcgc28sIHRoZXkgY2FuIGZpcnN0IHNjYW4gZm9yIHZhbGlkIHVzZXIgaWRzIHJlZ2FyZGxlc3Mgb2YgdmFsaWQgcGFzc3dvcmRzLlxuXHRcdFx0IyBEZWxheSBieSBhIHJhbmRvbSBhbW91bnQgdG8gcmVkdWNlIHRoZSBhYmlsaXR5IGZvciBhIGhhY2tlciB0byBkZXRlcm1pbmUgdGhlIHJlc3BvbnNlIHRpbWUuXG5cdFx0XHQjIFNlZSBodHRwczovL3d3dy5vd2FzcC5vcmcvaW5kZXgucGhwL0Jsb2NraW5nX0JydXRlX0ZvcmNlX0F0dGFja3MjRmluZGluZ19PdGhlcl9Db3VudGVybWVhc3VyZXNcblx0XHRcdCMgU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RpbWluZ19hdHRhY2tcblx0XHRcdG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzID0gNTAwXG5cdFx0XHRyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpXG5cdFx0XHRkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3b1xuXHRcdFx0TWV0ZW9yLnNldFRpbWVvdXQgc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzXG5cdFx0ZWxzZVxuXHRcdFx0c2VuZFJlc3BvbnNlKClcblxuXHQjIyNcblx0XHRSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG5cdCMjI1xuXHRfbG93ZXJDYXNlS2V5czogKG9iamVjdCkgLT5cblx0XHRfLmNoYWluIG9iamVjdFxuXHRcdC5wYWlycygpXG5cdFx0Lm1hcCAoYXR0cikgLT5cblx0XHRcdFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dXG5cdFx0Lm9iamVjdCgpXG5cdFx0LnZhbHVlKClcbiIsInNoYXJlLlJvdXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSb3V0ZShhcGksIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50czEpIHtcbiAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5lbmRwb2ludHMgPSBlbmRwb2ludHMxO1xuICAgIGlmICghdGhpcy5lbmRwb2ludHMpIHtcbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gdGhpcy5vcHRpb25zO1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgfVxuICB9XG5cbiAgUm91dGUucHJvdG90eXBlLmFkZFRvQXBpID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdmFpbGFibGVNZXRob2RzO1xuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhbGxvd2VkTWV0aG9kcywgZnVsbFBhdGgsIHJlamVjdGVkTWV0aG9kcywgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKF8uY29udGFpbnModGhpcy5hcGkuX2NvbmZpZy5wYXRocywgdGhpcy5wYXRoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogXCIgKyB0aGlzLnBhdGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5lbmRwb2ludHMgPSBfLmV4dGVuZCh7XG4gICAgICAgIG9wdGlvbnM6IHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuICAgICAgfSwgdGhpcy5lbmRwb2ludHMpO1xuICAgICAgdGhpcy5fcmVzb2x2ZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5fY29uZmlndXJlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLmFwaS5fY29uZmlnLnBhdGhzLnB1c2godGhpcy5wYXRoKTtcbiAgICAgIGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0KGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICBmdWxsUGF0aCA9IHRoaXMuYXBpLl9jb25maWcuYXBpUGF0aCArIHRoaXMucGF0aDtcbiAgICAgIF8uZWFjaChhbGxvd2VkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBlbmRwb2ludDtcbiAgICAgICAgZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdO1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgZG9uZUZ1bmMsIGVuZHBvaW50Q29udGV4dCwgZXJyb3IsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VJbml0aWF0ZWQ7XG4gICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBkb25lRnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9IHtcbiAgICAgICAgICAgIHVybFBhcmFtczogcmVxLnBhcmFtcyxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnksXG4gICAgICAgICAgICBib2R5UGFyYW1zOiByZXEuYm9keSxcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcSxcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXMsXG4gICAgICAgICAgICBkb25lOiBkb25lRnVuY1xuICAgICAgICAgIH07XG4gICAgICAgICAgXy5leHRlbmQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gbnVsbDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50KGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICBpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VJbml0aWF0ZWQpIHtcbiAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlRGF0YSA9PT0gbnVsbCB8fCByZXNwb25zZURhdGEgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZURhdGEuYm9keSAmJiAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgfHwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWplY3RlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgaGVhZGVycywgcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXG4gICAgICAgICAgfTtcbiAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgJ0FsbG93JzogYWxsb3dlZE1ldGhvZHMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KSgpO1xuXG5cbiAgLypcbiAgXHRcdENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICBcdFx0ZnVuY3Rpb25cbiAgXG4gIFx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNvbHZlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oZW5kcG9pbnQpKSB7XG4gICAgICAgIHJldHVybiBlbmRwb2ludHNbbWV0aG9kXSA9IHtcbiAgICAgICAgICBhY3Rpb246IGVuZHBvaW50XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cblxuICAvKlxuICBcdFx0Q29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICBcdFx0YmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG4gIFxuICBcdFx0QXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cbiAgXHRcdGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gIFx0XHRvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gIFx0XHRBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcbiAgXHRcdGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gIFx0XHRyZXNwZWN0aXZlbHkuXG4gIFxuICBcdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gIFx0XHRAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY29uZmlndXJlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kKSB7XG4gICAgICB2YXIgcmVmLCByZWYxLCByZWYyO1xuICAgICAgaWYgKG1ldGhvZCAhPT0gJ29wdGlvbnMnKSB7XG4gICAgICAgIGlmICghKChyZWYgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYucm9sZVJlcXVpcmVkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkKTtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludC5yb2xlUmVxdWlyZWQpKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKCgocmVmMSA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjEuYXV0aFJlcXVpcmVkIDogdm9pZCAwKSB8fCBlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHJlZjIgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYyLnNwYWNlUmVxdWlyZWQgOiB2b2lkIDApIHtcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gdGhpcy5vcHRpb25zLnNwYWNlUmVxdWlyZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG4gIFxuICBcdFx0QHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY2FsbEVuZHBvaW50ID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBpbnZvY2F0aW9uO1xuICAgIGlmICh0aGlzLl9hdXRoQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgIGlmICh0aGlzLl9yb2xlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NwYWNlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uKHtcbiAgICAgICAgICAgIGlzU2ltdWxhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcbiAgICAgICAgICAgIGNvbm5lY3Rpb246IG51bGwsXG4gICAgICAgICAgICByYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZShpbnZvY2F0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXNDb2RlOiA0MDEsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLidcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0QXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuICBcbiAgXHRcdE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcbiAgXHRcdGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxuICBcdFx0aW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICBcdFx0QHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlKGVuZHBvaW50Q29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxuICBcbiAgXHRcdElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cbiAgXG4gIFx0XHRAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQpIHtcbiAgICB2YXIgYXV0aCwgdXNlclNlbGVjdG9yO1xuICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgaWYgKChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXJJZCA6IHZvaWQgMCkgJiYgKGF1dGggIT0gbnVsbCA/IGF1dGgudG9rZW4gOiB2b2lkIDApICYmICEoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSkge1xuICAgICAgdXNlclNlbGVjdG9yID0ge307XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWQ7XG4gICAgICB1c2VyU2VsZWN0b3JbdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW47XG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VyU2VsZWN0b3IpO1xuICAgIH1cbiAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSB7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlcjtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gIFx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICBcdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgXHRcdFx0XHRcdFx0IGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fc3BhY2VBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgYXV0aCwgc3BhY2UsIHNwYWNlX3VzZXJzX2NvdW50O1xuICAgIGlmIChlbmRwb2ludC5zcGFjZVJlcXVpcmVkKSB7XG4gICAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGguc3BhY2VJZCA6IHZvaWQgMCkge1xuICAgICAgICBzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHVzZXI6IGF1dGgudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBhdXRoLnNwYWNlSWRcbiAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXJzX2NvdW50KSB7XG4gICAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpO1xuICAgICAgICAgIGlmIChzcGFjZSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCkgPj0gMCkge1xuICAgICAgICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWQ7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICBcdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gIFx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICBcdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgXHRcdFx0XHRcdFx0IGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcm9sZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgIGlmIChfLmlzRW1wdHkoXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcykpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICBcdFx0UmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNwb25kID0gZnVuY3Rpb24ocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGUsIGhlYWRlcnMpIHtcbiAgICB2YXIgZGVmYXVsdEhlYWRlcnMsIGRlbGF5SW5NaWxsaXNlY29uZHMsIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzLCByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bywgc2VuZFJlc3BvbnNlO1xuICAgIGlmIChzdGF0dXNDb2RlID09IG51bGwpIHtcbiAgICAgIHN0YXR1c0NvZGUgPSAyMDA7XG4gICAgfVxuICAgIGlmIChoZWFkZXJzID09IG51bGwpIHtcbiAgICAgIGhlYWRlcnMgPSB7fTtcbiAgICB9XG4gICAgZGVmYXVsdEhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKGhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSBfLmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG4gICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYXBpLl9jb25maWcucHJldHR5SnNvbikge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSwgdm9pZCAwLCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNwb25zZS53cml0ZUhlYWQoc3RhdHVzQ29kZSwgaGVhZGVycyk7XG4gICAgICByZXNwb25zZS53cml0ZShib2R5KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5lbmQoKTtcbiAgICB9O1xuICAgIGlmIChzdGF0dXNDb2RlID09PSA0MDEgfHwgc3RhdHVzQ29kZSA9PT0gNDAzKSB7XG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMDtcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICBkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bztcbiAgICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dChzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VuZFJlc3BvbnNlKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9sb3dlckNhc2VLZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIF8uY2hhaW4ob2JqZWN0KS5wYWlycygpLm1hcChmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV07XG4gICAgfSkub2JqZWN0KCkudmFsdWUoKTtcbiAgfTtcblxuICByZXR1cm4gUm91dGU7XG5cbn0pKCk7XG4iLCJiYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJylcbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuXG5jbGFzcyBAT2RhdGFSZXN0aXZ1c1xuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRAX3JvdXRlcyA9IFtdXG5cdFx0QF9jb25maWcgPVxuXHRcdFx0cGF0aHM6IFtdXG5cdFx0XHR1c2VEZWZhdWx0QXV0aDogZmFsc2Vcblx0XHRcdGFwaVBhdGg6ICdhcGkvJ1xuXHRcdFx0dmVyc2lvbjogbnVsbFxuXHRcdFx0cHJldHR5SnNvbjogZmFsc2Vcblx0XHRcdGF1dGg6XG5cdFx0XHRcdHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJ1xuXHRcdFx0XHR1c2VyOiAtPlxuXHRcdFx0XHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyggQHJlcXVlc3QsIEByZXNwb25zZSApXG5cdFx0XHRcdFx0dXNlcklkID0gQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0XHRcdFx0XHRhdXRoVG9rZW4gPSBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXHRcdFx0XHRcdHNwYWNlSWQgPSBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgQHVybFBhcmFtc1snc3BhY2VJZCddXG5cdFx0XHRcdFx0aWYgYXV0aFRva2VuXG5cdFx0XHRcdFx0XHR0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cblx0XHRcdFx0XHRpZiBAcmVxdWVzdC51c2VySWRcblx0XHRcdFx0XHRcdF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBAcmVxdWVzdC51c2VySWR9KVxuXHRcdFx0XHRcdFx0dXNlcjogX3VzZXJcblx0XHRcdFx0XHRcdHVzZXJJZDogdXNlcklkXG5cdFx0XHRcdFx0XHRzcGFjZUlkOiBzcGFjZUlkXG5cdFx0XHRcdFx0XHR0b2tlbjogdG9rZW5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR1c2VySWQ6IHVzZXJJZFxuXHRcdFx0XHRcdFx0c3BhY2VJZDogc3BhY2VJZFxuXHRcdFx0XHRcdFx0dG9rZW46IHRva2VuXG5cdFx0XHRkZWZhdWx0SGVhZGVyczpcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHRcdFx0ZW5hYmxlQ29yczogdHJ1ZVxuXG5cdFx0IyBDb25maWd1cmUgQVBJIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcblx0XHRfLmV4dGVuZCBAX2NvbmZpZywgb3B0aW9uc1xuXG5cdFx0aWYgQF9jb25maWcuZW5hYmxlQ29yc1xuXHRcdFx0Y29yc0hlYWRlcnMgPVxuXHRcdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXG5cdFx0XHRcdCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQsIE9EYXRhLVZlcnNpb24nXG5cblx0XHRcdGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG5cdFx0XHRcdGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4sIFgtU3BhY2UtSWQnXG5cblx0XHRcdCMgU2V0IGRlZmF1bHQgaGVhZGVyIHRvIGVuYWJsZSBDT1JTIGlmIGNvbmZpZ3VyZWRcblx0XHRcdF8uZXh0ZW5kIEBfY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVyc1xuXG5cdFx0XHRpZiBub3QgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuXHRcdFx0XHRAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gLT5cblx0XHRcdFx0XHRAcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgY29yc0hlYWRlcnNcblx0XHRcdFx0XHRAZG9uZSgpXG5cblx0XHQjIE5vcm1hbGl6ZSB0aGUgQVBJIHBhdGhcblx0XHRpZiBAX2NvbmZpZy5hcGlQYXRoWzBdIGlzICcvJ1xuXHRcdFx0QF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGguc2xpY2UgMVxuXHRcdGlmIF8ubGFzdChAX2NvbmZpZy5hcGlQYXRoKSBpc250ICcvJ1xuXHRcdFx0QF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGggKyAnLydcblxuXHRcdCMgVVJMIHBhdGggdmVyc2lvbmluZyBpcyB0aGUgb25seSB0eXBlIG9mIEFQSSB2ZXJzaW9uaW5nIGN1cnJlbnRseSBhdmFpbGFibGUsIHNvIGlmIGEgdmVyc2lvbiBpc1xuXHRcdCMgcHJvdmlkZWQsIGFwcGVuZCBpdCB0byB0aGUgYmFzZSBwYXRoIG9mIHRoZSBBUElcblx0XHRpZiBAX2NvbmZpZy52ZXJzaW9uXG5cdFx0XHRAX2NvbmZpZy5hcGlQYXRoICs9IEBfY29uZmlnLnZlcnNpb24gKyAnLydcblxuXHRcdCMgQWRkIGRlZmF1bHQgbG9naW4gYW5kIGxvZ291dCBlbmRwb2ludHMgaWYgYXV0aCBpcyBjb25maWd1cmVkXG5cdFx0aWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcblx0XHRcdEBfaW5pdEF1dGgoKVxuXHRcdGVsc2UgaWYgQF9jb25maWcudXNlQXV0aFxuXHRcdFx0QF9pbml0QXV0aCgpXG5cdFx0XHRjb25zb2xlLndhcm4gJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArXG5cdFx0XHRcdFx0J1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJ1xuXG5cdFx0cmV0dXJuIHRoaXNcblxuXG5cdCMjIypcblx0XHRBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG5cblx0XHRAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG5cdFx0QHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG5cdFx0QHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuXHRcdEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuXHRcdEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcblx0XHRAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG5cdFx0XHRcdGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcblx0XHRcdFx0YW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuXHQjIyNcblx0YWRkUm91dGU6IChwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIC0+XG5cdFx0IyBDcmVhdGUgYSBuZXcgcm91dGUgYW5kIGFkZCBpdCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyByb3V0ZXNcblx0XHRyb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpXG5cdFx0QF9yb3V0ZXMucHVzaChyb3V0ZSlcblxuXHRcdHJvdXRlLmFkZFRvQXBpKClcblxuXHRcdHJldHVybiB0aGlzXG5cblxuXHQjIyMqXG5cdFx0R2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuXHQjIyNcblx0YWRkQ29sbGVjdGlvbjogKGNvbGxlY3Rpb24sIG9wdGlvbnM9e30pIC0+XG5cdFx0bWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXVxuXHRcdG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ11cblxuXHRcdCMgR3JhYiB0aGUgc2V0IG9mIGVuZHBvaW50c1xuXHRcdGlmIGNvbGxlY3Rpb24gaXMgTWV0ZW9yLnVzZXJzXG5cdFx0XHRjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF91c2VyQ29sbGVjdGlvbkVuZHBvaW50c1xuXHRcdGVsc2Vcblx0XHRcdGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX2NvbGxlY3Rpb25FbmRwb2ludHNcblxuXHRcdCMgRmxhdHRlbiB0aGUgb3B0aW9ucyBhbmQgc2V0IGRlZmF1bHRzIGlmIG5lY2Vzc2FyeVxuXHRcdGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIG9yIHt9XG5cdFx0cm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgb3Ige31cblx0XHRleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgb3IgW11cblx0XHQjIFVzZSBjb2xsZWN0aW9uIG5hbWUgYXMgZGVmYXVsdCBwYXRoXG5cdFx0cGF0aCA9IG9wdGlvbnMucGF0aCBvciBjb2xsZWN0aW9uLl9uYW1lXG5cblx0XHQjIFNlcGFyYXRlIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRzIGJ5IHRoZSByb3V0ZSB0aGV5IGJlbG9uZyB0byAob25lIGZvciBvcGVyYXRpbmcgb24gdGhlIGVudGlyZVxuXHRcdCMgY29sbGVjdGlvbiBhbmQgb25lIGZvciBvcGVyYXRpbmcgb24gYSBzaW5nbGUgZW50aXR5IHdpdGhpbiB0aGUgY29sbGVjdGlvbilcblx0XHRjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fVxuXHRcdGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge31cblx0XHRpZiBfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSBhbmQgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKVxuXHRcdFx0IyBHZW5lcmF0ZSBhbGwgZW5kcG9pbnRzIG9uIHRoaXMgY29sbGVjdGlvblxuXHRcdFx0Xy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdCMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuXHRcdFx0XHRpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxuXHRcdFx0XHRcdF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcblx0XHRcdFx0ZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQsIHRoaXNcblx0XHRlbHNlXG5cdFx0XHQjIEdlbmVyYXRlIGFueSBlbmRwb2ludHMgdGhhdCBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBleGNsdWRlZFxuXHRcdFx0Xy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdGlmIG1ldGhvZCBub3QgaW4gZXhjbHVkZWRFbmRwb2ludHMgYW5kIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdIGlzbnQgZmFsc2Vcblx0XHRcdFx0XHQjIENvbmZpZ3VyZSBlbmRwb2ludCBhbmQgbWFwIHRvIGl0J3MgaHR0cCBtZXRob2Rcblx0XHRcdFx0XHQjIFRPRE86IENvbnNpZGVyIHByZWRlZmluaW5nIGEgbWFwIG9mIG1ldGhvZHMgdG8gdGhlaXIgaHR0cCBtZXRob2QgdHlwZSAoZS5nLiwgZ2V0QWxsOiBnZXQpXG5cdFx0XHRcdFx0ZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF1cblx0XHRcdFx0XHRjb25maWd1cmVkRW5kcG9pbnQgPSB7fVxuXHRcdFx0XHRcdF8uZWFjaCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgKGFjdGlvbiwgbWV0aG9kVHlwZSkgLT5cblx0XHRcdFx0XHRcdGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9XG5cdFx0XHRcdFx0XHRcdF8uY2hhaW4gYWN0aW9uXG5cdFx0XHRcdFx0XHRcdC5jbG9uZSgpXG5cdFx0XHRcdFx0XHRcdC5leHRlbmQgZW5kcG9pbnRPcHRpb25zXG5cdFx0XHRcdFx0XHRcdC52YWx1ZSgpXG5cdFx0XHRcdFx0IyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXG5cdFx0XHRcdFx0aWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cblx0XHRcdFx0XHRcdF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG5cdFx0XHRcdFx0ZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHQsIHRoaXNcblxuXHRcdCMgQWRkIHRoZSByb3V0ZXMgdG8gdGhlIEFQSVxuXHRcdEBhZGRSb3V0ZSBwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50c1xuXHRcdEBhZGRSb3V0ZSBcIiN7cGF0aH0vOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHNcblxuXHRcdHJldHVybiB0aGlzXG5cblxuXHQjIyMqXG5cdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG5cdCMjI1xuXHRfY29sbGVjdGlvbkVuZHBvaW50czpcblx0XHRnZXQ6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0Z2V0OlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgc2VsZWN0b3Jcblx0XHRcdFx0XHRpZiBlbnRpdHlcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuXHRcdHB1dDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRwdXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCAkc2V0OiBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxuXHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuXHRcdGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRkZWxldGU6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuXHRcdHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0cG9zdDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXG5cdFx0XHRcdFx0aWYgZW50aXR5XG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCd9XG5cdFx0Z2V0QWxsOiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdHNlbGVjdG9yID0ge31cblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRcdHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0ZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKClcblx0XHRcdFx0XHRpZiBlbnRpdGllc1xuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nfVxuXG5cblx0IyMjKlxuXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcblx0IyMjXG5cdF91c2VyQ29sbGVjdGlvbkVuZHBvaW50czpcblx0XHRnZXQ6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0Z2V0OlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuXHRcdFx0XHRcdGlmIGVudGl0eVxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XG5cdFx0cHV0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdHB1dDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIEB1cmxQYXJhbXMuaWQsICRzZXQ6IHByb2ZpbGU6IEBib2R5UGFyYW1zXG5cdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXG5cdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuXHRcdGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRkZWxldGU6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBAdXJsUGFyYW1zLmlkXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnfVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuXHRcdHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0cG9zdDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdCMgQ3JlYXRlIGEgbmV3IHVzZXIgYWNjb3VudFxuXHRcdFx0XHRcdGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlciBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZCwgZmllbGRzOiBwcm9maWxlOiAxXG5cdFx0XHRcdFx0aWYgZW50aXR5XG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCd9XG5cdFx0Z2V0QWxsOiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCBmaWVsZHM6IHByb2ZpbGU6IDEpLmZldGNoKClcblx0XHRcdFx0XHRpZiBlbnRpdGllc1xuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2Vycyd9XG5cblxuXHQjIyNcblx0XHRBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG5cdCMjI1xuXHRfaW5pdEF1dGg6IC0+XG5cdFx0c2VsZiA9IHRoaXNcblx0XHQjIyNcblx0XHRcdEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcblxuXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3Jcblx0XHRcdGFkZGluZyBob29rKS5cblx0XHQjIyNcblx0XHRAYWRkUm91dGUgJ2xvZ2luJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LFxuXHRcdFx0cG9zdDogLT5cblx0XHRcdFx0IyBHcmFiIHRoZSB1c2VybmFtZSBvciBlbWFpbCB0aGF0IHRoZSB1c2VyIGlzIGxvZ2dpbmcgaW4gd2l0aFxuXHRcdFx0XHR1c2VyID0ge31cblx0XHRcdFx0aWYgQGJvZHlQYXJhbXMudXNlclxuXHRcdFx0XHRcdGlmIEBib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpIGlzIC0xXG5cdFx0XHRcdFx0XHR1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlclxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy51c2VyXG5cdFx0XHRcdGVsc2UgaWYgQGJvZHlQYXJhbXMudXNlcm5hbWVcblx0XHRcdFx0XHR1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlcm5hbWVcblx0XHRcdFx0ZWxzZSBpZiBAYm9keVBhcmFtcy5lbWFpbFxuXHRcdFx0XHRcdHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy5lbWFpbFxuXG5cdFx0XHRcdCMgVHJ5IHRvIGxvZyB0aGUgdXNlciBpbnRvIHRoZSB1c2VyJ3MgYWNjb3VudCAoaWYgc3VjY2Vzc2Z1bCB3ZSdsbCBnZXQgYW4gYXV0aCB0b2tlbiBiYWNrKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCB1c2VyLCBAYm9keVBhcmFtcy5wYXNzd29yZFxuXHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlXG5cdFx0XHRcdFx0cmV0dXJuIHt9ID1cblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IGUuZXJyb3Jcblx0XHRcdFx0XHRcdGJvZHk6IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5yZWFzb25cblxuXHRcdFx0XHQjIEdldCB0aGUgYXV0aGVudGljYXRlZCB1c2VyXG5cdFx0XHRcdCMgVE9ETzogQ29uc2lkZXIgcmV0dXJuaW5nIHRoZSB1c2VyIGluIEF1dGgubG9naW5XaXRoUGFzc3dvcmQoKSwgaW5zdGVhZCBvZiBmZXRjaGluZyBpdCBhZ2FpbiBoZXJlXG5cdFx0XHRcdGlmIGF1dGgudXNlcklkIGFuZCBhdXRoLmF1dGhUb2tlblxuXHRcdFx0XHRcdHNlYXJjaFF1ZXJ5ID0ge31cblx0XHRcdFx0XHRzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aC5hdXRoVG9rZW5cblx0XHRcdFx0XHRAdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRcdFx0XHQnX2lkJzogYXV0aC51c2VySWRcblx0XHRcdFx0XHRcdHNlYXJjaFF1ZXJ5XG5cdFx0XHRcdFx0QHVzZXJJZCA9IEB1c2VyPy5faWRcblxuXHRcdFx0XHRyZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogYXV0aH1cblxuXHRcdFx0XHQjIENhbGwgdGhlIGxvZ2luIGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG5cdFx0XHRcdGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluPy5jYWxsKHRoaXMpXG5cdFx0XHRcdGlmIGV4dHJhRGF0YT9cblx0XHRcdFx0XHRfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXG5cblx0XHRcdFx0cmVzcG9uc2VcblxuXHRcdGxvZ291dCA9IC0+XG5cdFx0XHQjIFJlbW92ZSB0aGUgZ2l2ZW4gYXV0aCB0b2tlbiBmcm9tIHRoZSB1c2VyJ3MgYWNjb3VudFxuXHRcdFx0YXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxuXHRcdFx0dG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuXG5cdFx0XHRpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YgJy4nXG5cdFx0XHR0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyAwLCBpbmRleFxuXHRcdFx0dG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyBpbmRleCArIDFcblx0XHRcdHRva2VuVG9SZW1vdmUgPSB7fVxuXHRcdFx0dG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlblxuXHRcdFx0dG9rZW5SZW1vdmFsUXVlcnkgPSB7fVxuXHRcdFx0dG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmVcblx0XHRcdE1ldGVvci51c2Vycy51cGRhdGUgQHVzZXIuX2lkLCB7JHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5fVxuXG5cdFx0XHRyZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ319XG5cblx0XHRcdCMgQ2FsbCB0aGUgbG9nb3V0IGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG5cdFx0XHRleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQ/LmNhbGwodGhpcylcblx0XHRcdGlmIGV4dHJhRGF0YT9cblx0XHRcdFx0Xy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG5cdFx0XHRyZXNwb25zZVxuXG5cdFx0IyMjXG5cdFx0XHRBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuXG5cdFx0XHRBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG5cdFx0XHRhZGRpbmcgaG9vaykuXG5cdFx0IyMjXG5cdFx0QGFkZFJvdXRlICdsb2dvdXQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSxcblx0XHRcdGdldDogLT5cblx0XHRcdFx0Y29uc29sZS53YXJuIFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIlxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCJcblx0XHRcdFx0cmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpXG5cdFx0XHRwb3N0OiBsb2dvdXRcblxuT2RhdGFSZXN0aXZ1cyA9IEBPZGF0YVJlc3RpdnVzXG4iLCJ2YXIgQ29va2llcywgT2RhdGFSZXN0aXZ1cywgYmFzaWNBdXRoLFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbmJhc2ljQXV0aCA9IHJlcXVpcmUoJ2Jhc2ljLWF1dGgnKTtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG50aGlzLk9kYXRhUmVzdGl2dXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE9kYXRhUmVzdGl2dXMob3B0aW9ucykge1xuICAgIHZhciBjb3JzSGVhZGVycztcbiAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcbiAgICB0aGlzLl9jb25maWcgPSB7XG4gICAgICBwYXRoczogW10sXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXG4gICAgICBhcGlQYXRoOiAnYXBpLycsXG4gICAgICB2ZXJzaW9uOiBudWxsLFxuICAgICAgcHJldHR5SnNvbjogZmFsc2UsXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJyxcbiAgICAgICAgdXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF91c2VyLCBhdXRoVG9rZW4sIGNvb2tpZXMsIHNwYWNlSWQsIHRva2VuLCB1c2VySWQ7XG4gICAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKHRoaXMucmVxdWVzdCwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgdXNlcklkID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgICAgIGF1dGhUb2tlbiA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICAgICAgICBzcGFjZUlkID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCB0aGlzLnVybFBhcmFtc1snc3BhY2VJZCddO1xuICAgICAgICAgIGlmIChhdXRoVG9rZW4pIHtcbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QudXNlcklkKSB7XG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMucmVxdWVzdC51c2VySWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcjogX3VzZXIsXG4gICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgICBzcGFjZUlkOiBzcGFjZUlkLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgICBzcGFjZUlkOiBzcGFjZUlkLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcbiAgICB9O1xuICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZywgb3B0aW9ucyk7XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5lbmFibGVDb3JzKSB7XG4gICAgICBjb3JzSGVhZGVycyA9IHtcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCwgT0RhdGEtVmVyc2lvbidcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4sIFgtU3BhY2UtSWQnO1xuICAgICAgfVxuICAgICAgXy5leHRlbmQodGhpcy5fY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVycyk7XG4gICAgICBpZiAoIXRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50KSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZS53cml0ZUhlYWQoMjAwLCBjb3JzSGVhZGVycyk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLmFwaVBhdGhbMF0gPT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aC5zbGljZSgxKTtcbiAgICB9XG4gICAgaWYgKF8ubGFzdCh0aGlzLl9jb25maWcuYXBpUGF0aCkgIT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aCArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy52ZXJzaW9uKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCArPSB0aGlzLl9jb25maWcudmVyc2lvbiArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbmZpZy51c2VBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgKyAnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICBcdFx0QWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuICBcbiAgXHRcdEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcbiAgXHRcdEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICBcdFx0QHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICBcdFx0QHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gIFx0XHRAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gIFx0XHRAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG4gIFx0XHRcdFx0Y29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxuICBcdFx0XHRcdGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuYWRkUm91dGUgPSBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIHtcbiAgICB2YXIgcm91dGU7XG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKTtcbiAgICB0aGlzLl9yb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgcm91dGUuYWRkVG9BcGkoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICBcdFx0R2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5hZGRDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgb3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uRW5kcG9pbnRzLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiwgZW50aXR5Um91dGVFbmRwb2ludHMsIGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2RzLCBtZXRob2RzT25Db2xsZWN0aW9uLCBwYXRoLCByb3V0ZU9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddO1xuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ107XG4gICAgaWYgKGNvbGxlY3Rpb24gPT09IE1ldGVvci51c2Vycykge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fY29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9XG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgfHwge307XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgfHwge307XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIHx8IFtdO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGggfHwgY29sbGVjdGlvbi5fbmFtZTtcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSAmJiBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpKSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGNvbmZpZ3VyZWRFbmRwb2ludCwgZW5kcG9pbnRPcHRpb25zO1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2QpIDwgMCAmJiBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXTtcbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fTtcbiAgICAgICAgICBfLmVhY2goY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIGZ1bmN0aW9uKGFjdGlvbiwgbWV0aG9kVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9IF8uY2hhaW4oYWN0aW9uKS5jbG9uZSgpLmV4dGVuZChlbmRwb2ludE9wdGlvbnMpLnZhbHVlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyk7XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoICsgXCIvOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gIFx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuX2NvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZCwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xuICAgICAgICAgICAgICAkc2V0OiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICBcdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZDtcbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZSh0aGlzLnVybFBhcmFtcy5pZCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgZW50aXR5SWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAoe1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCdcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXM7XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuX2luaXRBdXRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvZ291dCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcblxuICAgIC8qXG4gICAgXHRcdFx0QWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgIFx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgXHRcdFx0YWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHRoaXMuYWRkUm91dGUoJ2xvZ2luJywge1xuICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXV0aCwgZSwgZXh0cmFEYXRhLCByZWYsIHJlZjEsIHJlc3BvbnNlLCBzZWFyY2hRdWVyeSwgdXNlcjtcbiAgICAgICAgdXNlciA9IHt9O1xuICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpID09PSAtMSkge1xuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VybmFtZSkge1xuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLmVtYWlsKSB7XG4gICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy5lbWFpbDtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKHVzZXIsIHRoaXMuYm9keVBhcmFtcy5wYXNzd29yZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3IsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZS5yZWFzb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdXRoLnVzZXJJZCAmJiBhdXRoLmF1dGhUb2tlbikge1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGguYXV0aFRva2VuKTtcbiAgICAgICAgICB0aGlzLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICB9LCBzZWFyY2hRdWVyeSk7XG4gICAgICAgICAgdGhpcy51c2VySWQgPSAocmVmID0gdGhpcy51c2VyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICBkYXRhOiBhdXRoXG4gICAgICAgIH07XG4gICAgICAgIGV4dHJhRGF0YSA9IChyZWYxID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4pICE9IG51bGwgPyByZWYxLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aFRva2VuLCBleHRyYURhdGEsIGhhc2hlZFRva2VuLCBpbmRleCwgcmVmLCByZXNwb25zZSwgdG9rZW5GaWVsZE5hbWUsIHRva2VuTG9jYXRpb24sIHRva2VuUGF0aCwgdG9rZW5SZW1vdmFsUXVlcnksIHRva2VuVG9SZW1vdmU7XG4gICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ107XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuO1xuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKGluZGV4ICsgMSk7XG4gICAgICB0b2tlblRvUmVtb3ZlID0ge307XG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuO1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fTtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlO1xuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh0aGlzLnVzZXIuX2lkLCB7XG4gICAgICAgICRwdWxsOiB0b2tlblJlbW92YWxRdWVyeVxuICAgICAgfSk7XG4gICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGV4dHJhRGF0YSA9IChyZWYgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQpICE9IG51bGwgPyByZWYuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLypcbiAgICBcdFx0XHRBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgIFx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBvdXQsIHRoZSBvbkxvZ2dlZE91dCBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICBcdFx0XHRhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMuYWRkUm91dGUoJ2xvZ291dCcsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCIpO1xuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcyk7XG4gICAgICB9LFxuICAgICAgcG9zdDogbG9nb3V0XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIE9kYXRhUmVzdGl2dXM7XG5cbn0pKCk7XG5cbk9kYXRhUmVzdGl2dXMgPSB0aGlzLk9kYXRhUmVzdGl2dXM7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXG5cdGdldE9iamVjdHMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZXMpLT5cblx0XHRkYXRhID0ge31cblx0XHRvYmplY3RfbmFtZXMuc3BsaXQoJywnKS5mb3JFYWNoIChvYmplY3RfbmFtZSktPlxuXHRcdFx0b2JqZWN0ID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0XHRkYXRhW29iamVjdC5uYW1lXSA9IG9iamVjdFxuXHRcdHJldHVybiBkYXRhO1xuXG5cdGdldE9iamVjdCA9IChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKS0+XG5cdFx0ZGF0YSA9IF8uY2xvbmUoQ3JlYXRvci5PYmplY3RzW0NyZWF0b3IuZ2V0T2JqZWN0TmFtZShDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpXSlcblx0XHRpZiAhZGF0YVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5peg5pWI55qEaWQgI3tvYmplY3RfbmFtZX1cIilcblxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KS5mZXRjaCgpXG5cdFx0cHNldHMgPSB7IHBzZXRzQWRtaW4sIHBzZXRzVXNlciwgcHNldHNDdXJyZW50IH1cblxuXHRcdG9iamVjdF9wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblxuXHRcdGRlbGV0ZSBkYXRhLmxpc3Rfdmlld3Ncblx0XHRkZWxldGUgZGF0YS5wZXJtaXNzaW9uX3NldFxuXG5cdFx0aWYgb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93UmVhZFxuXHRcdFx0ZGF0YS5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0XHRkYXRhLmFsbG93RWRpdCA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0VkaXRcblx0XHRcdGRhdGEuYWxsb3dEZWxldGUgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcblx0XHRcdGRhdGEuYWxsb3dDcmVhdGUgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcblx0XHRcdGRhdGEubW9kaWZ5QWxsUmVjb3JkcyA9IG9iamVjdF9wZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXG5cblx0XHRcdGZpZWxkcyA9IHt9XG5cdFx0XHRfLmZvckVhY2ggZGF0YS5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cdFx0XHRcdF9maWVsZCA9IF8uY2xvbmUoZmllbGQpXG5cblx0XHRcdFx0aWYgIV9maWVsZC5uYW1lXG5cdFx0XHRcdFx0X2ZpZWxkLm5hbWUgPSBrZXlcblxuXHRcdFx0XHQj5bCG5LiN5Y+v57yW6L6R55qE5a2X5q616K6+572u5Li6cmVhZG9ubHkgPSB0cnVlXG5cdFx0XHRcdGlmIChfLmluZGV4T2Yob2JqZWN0X3Blcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBfZmllbGQubmFtZSkgPiAtMSlcblx0XHRcdFx0XHRfZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cblx0XHRcdFx0I+S4jei/lOWbnuS4jeWPr+ingeWtl+autVxuXHRcdFx0XHRpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpIDwgMClcblx0XHRcdFx0XHRmaWVsZHNba2V5XSA9IF9maWVsZFxuXG5cdFx0XHRkYXRhLmZpZWxkcyA9IGZpZWxkc1xuXG5cdFx0ZWxzZVxuXHRcdFx0ZGF0YS5hbGxvd1JlYWQgPSBmYWxzZVxuXG5cdFx0cmV0dXJuIGRhdGFcblxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgU3RlZWRvc09EYXRhLkFQSV9QQVRIICsgJy9vYmplY3RzLzppZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0XHR0cnlcblx0XHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG5cdFx0XHRpZiAhdXNlcklkXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIilcblxuXHRcdFx0c3BhY2VJZCA9IHJlcS5wYXJhbXM/LnNwYWNlSWRcblx0XHRcdGlmICFzcGFjZUlkXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3Mgc3BhY2VJZFwiKVxuXG5cdFx0XHRvYmplY3RfbmFtZSA9IHJlcS5wYXJhbXM/LmlkXG5cdFx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTWlzcyBpZFwiKVxuXG5cdFx0XHRfb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kT25lKHtfaWQ6IG9iamVjdF9uYW1lfSlcblxuXHRcdFx0aWYgX29iaiAmJiBfb2JqLm5hbWVcblx0XHRcdFx0b2JqZWN0X25hbWUgPSBfb2JqLm5hbWVcblxuXHRcdFx0aWYgb2JqZWN0X25hbWUuc3BsaXQoJywnKS5sZW5ndGggPiAxXG5cdFx0XHRcdGRhdGEgPSBnZXRPYmplY3RzKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRhdGEgPSBnZXRPYmplY3Qoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0XHRjb2RlOiAyMDAsXG5cdFx0XHRcdGRhdGE6IGRhdGEgfHwge31cblx0XHRcdH1cblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogZS5lcnJvciB8fCA1MDBcblx0XHRcdFx0ZGF0YToge2Vycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlfVxuXHRcdFx0fSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgZ2V0T2JqZWN0LCBnZXRPYmplY3RzO1xuICBnZXRPYmplY3RzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZXMpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0ge307XG4gICAgb2JqZWN0X25hbWVzLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIG9iamVjdCA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIHJldHVybiBkYXRhW29iamVjdC5uYW1lXSA9IG9iamVjdDtcbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbiAgZ2V0T2JqZWN0ID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBkYXRhLCBmaWVsZHMsIG9iamVjdF9wZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VycmVudCwgcHNldHNVc2VyO1xuICAgIGRhdGEgPSBfLmNsb25lKENyZWF0b3IuT2JqZWN0c1tDcmVhdG9yLmdldE9iamVjdE5hbWUoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKV0pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5peg5pWI55qEaWQgXCIgKyBvYmplY3RfbmFtZSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudFxuICAgIH07XG4gICAgb2JqZWN0X3Blcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICBkZWxldGUgZGF0YS5saXN0X3ZpZXdzO1xuICAgIGRlbGV0ZSBkYXRhLnBlcm1pc3Npb25fc2V0O1xuICAgIGlmIChvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgICBkYXRhLmFsbG93UmVhZCA9IHRydWU7XG4gICAgICBkYXRhLmFsbG93RWRpdCA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0VkaXQ7XG4gICAgICBkYXRhLmFsbG93RGVsZXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93RGVsZXRlO1xuICAgICAgZGF0YS5hbGxvd0NyZWF0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZTtcbiAgICAgIGRhdGEubW9kaWZ5QWxsUmVjb3JkcyA9IG9iamVjdF9wZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgZmllbGRzID0ge307XG4gICAgICBfLmZvckVhY2goZGF0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgICAgdmFyIF9maWVsZDtcbiAgICAgICAgX2ZpZWxkID0gXy5jbG9uZShmaWVsZCk7XG4gICAgICAgIGlmICghX2ZpZWxkLm5hbWUpIHtcbiAgICAgICAgICBfZmllbGQubmFtZSA9IGtleTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpID4gLTEpIHtcbiAgICAgICAgICBfZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmluZGV4T2Yob2JqZWN0X3Blcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBfZmllbGQubmFtZSkgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkc1trZXldID0gX2ZpZWxkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRhdGEuZmllbGRzID0gZmllbGRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCBTdGVlZG9zT0RhdGEuQVBJX1BBVEggKyAnL29iamVjdHMvOmlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgX29iaiwgZGF0YSwgZSwgb2JqZWN0X25hbWUsIHJlZiwgcmVmMSwgc3BhY2VJZCwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICAgIH1cbiAgICAgIHNwYWNlSWQgPSAocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwO1xuICAgICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3Mgc3BhY2VJZFwiKTtcbiAgICAgIH1cbiAgICAgIG9iamVjdF9uYW1lID0gKHJlZjEgPSByZXEucGFyYW1zKSAhPSBudWxsID8gcmVmMS5pZCA6IHZvaWQgMDtcbiAgICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTWlzcyBpZFwiKTtcbiAgICAgIH1cbiAgICAgIF9vYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG9iamVjdF9uYW1lXG4gICAgICB9KTtcbiAgICAgIGlmIChfb2JqICYmIF9vYmoubmFtZSkge1xuICAgICAgICBvYmplY3RfbmFtZSA9IF9vYmoubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmplY3RfbmFtZS5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZGF0YSA9IGdldE9iamVjdHMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiBkYXRhIHx8IHt9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWV0ZW9yT0RhdGFSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuTWV0ZW9yT0RhdGFSb3V0ZXI7XG5cdE9EYXRhUm91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk9EYXRhUm91dGVyXG5cdGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5cdGFwcCA9IGV4cHJlc3MoKTtcblx0YXBwLnVzZSgnL2FwaS9vZGF0YS92NCcsIE1ldGVvck9EYXRhUm91dGVyKTtcblx0TWV0ZW9yT0RhdGFBUElWNFJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5NZXRlb3JPRGF0YUFQSVY0Um91dGVyO1xuXHRpZiBNZXRlb3JPRGF0YUFQSVY0Um91dGVyXG5cdFx0YXBwLnVzZSgnL2FwaS92NCcsIE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIpXG5cdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKGFwcCk7XG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpLT5cblx0XHRpZihuYW1lICE9ICdkZWZhdWx0Jylcblx0XHRcdG90aGVyQXBwID0gZXhwcmVzcygpO1xuXHRcdFx0b3RoZXJBcHAudXNlKFwiL2FwaS9vZGF0YS8je25hbWV9XCIsIE9EYXRhUm91dGVyKTtcblx0XHRcdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKG90aGVyQXBwKTtcblxuIyBcdG9kYXRhVjRNb25nb2RiID0gcmVxdWlyZSAnb2RhdGEtdjQtbW9uZ29kYidcbiMgXHRxdWVyeXN0cmluZyA9IHJlcXVpcmUgJ3F1ZXJ5c3RyaW5nJ1xuXG4jIFx0aGFuZGxlRXJyb3IgPSAoZSktPlxuIyBcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG4jIFx0XHRib2R5ID0ge31cbiMgXHRcdGVycm9yID0ge31cbiMgXHRcdGVycm9yWydtZXNzYWdlJ10gPSBlLm1lc3NhZ2VcbiMgXHRcdHN0YXR1c0NvZGUgPSA1MDBcbiMgXHRcdGlmIGUuZXJyb3IgYW5kIF8uaXNOdW1iZXIoZS5lcnJvcilcbiMgXHRcdFx0c3RhdHVzQ29kZSA9IGUuZXJyb3JcbiMgXHRcdGVycm9yWydjb2RlJ10gPSBzdGF0dXNDb2RlXG4jIFx0XHRlcnJvclsnZXJyb3InXSA9IHN0YXR1c0NvZGVcbiMgXHRcdGVycm9yWydkZXRhaWxzJ10gPSBlLmRldGFpbHNcbiMgXHRcdGVycm9yWydyZWFzb24nXSA9IGUucmVhc29uXG4jIFx0XHRib2R5WydlcnJvciddID0gZXJyb3JcbiMgXHRcdHJldHVybiB7XG4jIFx0XHRcdHN0YXR1c0NvZGU6IHN0YXR1c0NvZGVcbiMgXHRcdFx0Ym9keTpib2R5XG4jIFx0XHR9XG5cbiMgXHR2aXNpdG9yUGFyc2VyID0gKHZpc2l0b3IpLT5cbiMgXHRcdHBhcnNlZE9wdCA9IHt9XG4jIFx0XHRpZiB2aXNpdG9yLnByb2plY3Rpb25cbiMgXHRcdFx0cGFyc2VkT3B0LmZpZWxkcyA9IHZpc2l0b3IucHJvamVjdGlvblxuIyBcdFx0aWYgdmlzaXRvci5oYXNPd25Qcm9wZXJ0eSgnbGltaXQnKVxuIyBcdFx0XHRwYXJzZWRPcHQubGltaXQgPSB2aXNpdG9yLmxpbWl0XG5cbiMgXHRcdGlmIHZpc2l0b3IuaGFzT3duUHJvcGVydHkoJ3NraXAnKVxuIyBcdFx0XHRwYXJzZWRPcHQuc2tpcCA9IHZpc2l0b3Iuc2tpcFxuXG4jIFx0XHRpZiB2aXNpdG9yLnNvcnRcbiMgXHRcdFx0cGFyc2VkT3B0LnNvcnQgPSB2aXNpdG9yLnNvcnRcblxuIyBcdFx0cGFyc2VkT3B0XG4jIFx0ZGVhbFdpdGhFeHBhbmQgPSAoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIHNwYWNlSWQpLT5cbiMgXHRcdGlmIF8uaXNFbXB0eSBjcmVhdGVRdWVyeS5pbmNsdWRlc1xuIyBcdFx0XHRyZXR1cm5cblxuIyBcdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKVxuIyBcdFx0Xy5lYWNoIGNyZWF0ZVF1ZXJ5LmluY2x1ZGVzLCAoaW5jbHVkZSktPlxuIyBcdFx0XHQjIGNvbnNvbGUubG9nICdpbmNsdWRlOiAnLCBpbmNsdWRlXG4jIFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eSA9IGluY2x1ZGUubmF2aWdhdGlvblByb3BlcnR5XG4jIFx0XHRcdCMgY29uc29sZS5sb2cgJ25hdmlnYXRpb25Qcm9wZXJ0eTogJywgbmF2aWdhdGlvblByb3BlcnR5XG4jIFx0XHRcdGZpZWxkID0gb2JqLmZpZWxkc1tuYXZpZ2F0aW9uUHJvcGVydHldXG4jIFx0XHRcdGlmIGZpZWxkIGFuZCAoZmllbGQudHlwZSBpcyAnbG9va3VwJyBvciBmaWVsZC50eXBlIGlzICdtYXN0ZXJfZGV0YWlsJylcbiMgXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKVxuIyBcdFx0XHRcdFx0ZmllbGQucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcbiMgXHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG9cbiMgXHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucyA9IHZpc2l0b3JQYXJzZXIoaW5jbHVkZSlcbiMgXHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcgZmllbGQucmVmZXJlbmNlX3RvXG4jIFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdF9yb19OQU1FX0ZJRUxEX0tFWSA9IENyZWF0b3IuZ2V0T2JqZWN0KGZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCk/Lk5BTUVfRklFTERfS0VZXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCBlbnRpdGllcywgKGVudGl0eSwgaWR4KS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV1cbiMgXHRcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRGF0YSA9IF8uY2xvbmUoZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0pXG4jIFx0XHRcdFx0XHRcdFx0XHRcdG11bHRpUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiB7JGluOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XX19LCBpbmNsdWRlLnF1ZXJ5XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kKG11bHRpUXVlcnksIHF1ZXJ5T3B0aW9ucykuZmV0Y2goKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiAhZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldLmxlbmd0aFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IG9yaWdpbmFsRGF0YVxuIyBcdFx0XHRcdFx0XHRcdFx0XHQj5o6S5bqPXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IENyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzKGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSwgb3JpZ2luYWxEYXRhKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBfLm1hcCBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0sIChvKS0+XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0b1sncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5fbyddID0gZmllbGQucmVmZXJlbmNlX3RvXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0b1snX05BTUVfRklFTERfVkFMVUUnXSA9IG9bX3JvX05BTUVfRklFTERfS0VZXVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvXG4jIFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNpbmdsZVF1ZXJ5ID0gXy5leHRlbmQge19pZDogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV19LCBpbmNsdWRlLnF1ZXJ5XG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0IyDnibnmrorlpITnkIblnKjnm7jlhbPooajkuK3msqHmnInmib7liLDmlbDmja7nmoTmg4XlhrXvvIzov5Tlm57ljp/mlbDmja5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLmZpbmRPbmUoc2luZ2xlUXVlcnksIHF1ZXJ5T3B0aW9ucykgfHwgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLl9vJ10gPSBmaWVsZC5yZWZlcmVuY2VfdG9cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bX3JvX05BTUVfRklFTERfS0VZXVxuIyBcdFx0XHRcdFx0aWYgXy5pc0FycmF5IGZpZWxkLnJlZmVyZW5jZV90b1xuIyBcdFx0XHRcdFx0XHRfLmVhY2ggZW50aXRpZXMsIChlbnRpdHksIGlkeCktPlxuIyBcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldPy5pZHNcbiMgXHRcdFx0XHRcdFx0XHRcdF9vID0gZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0ub1xuIyBcdFx0XHRcdFx0XHRcdFx0X3JvX05BTUVfRklFTERfS0VZID0gQ3JlYXRvci5nZXRPYmplY3QoX28sIHNwYWNlSWQpPy5OQU1FX0ZJRUxEX0tFWVxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgcXVlcnlPcHRpb25zPy5maWVsZHMgJiYgX3JvX05BTUVfRklFTERfS0VZXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucy5maWVsZHNbX3JvX05BTUVfRklFTERfS0VZXSA9IDFcbiMgXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5vLCBzcGFjZUlkKVxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlVG9Db2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0X2lkcyA9IF8uY2xvbmUoZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0uaWRzKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG11bHRpUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiB7JGluOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5pZHN9fSwgaW5jbHVkZS5xdWVyeVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IF8ubWFwIHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kKG11bHRpUXVlcnksIHF1ZXJ5T3B0aW9ucykuZmV0Y2goKSwgKG8pLT5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5fbyddID0gX29cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBvW19yb19OQU1FX0ZJRUxEX0tFWV1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0I+aOkuW6j1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IENyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzKGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSwgX2lkcylcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHNpbmdsZVF1ZXJ5ID0gXy5leHRlbmQge19pZDogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0uaWRzWzBdfSwgaW5jbHVkZS5xdWVyeVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kT25lKHNpbmdsZVF1ZXJ5LCBxdWVyeU9wdGlvbnMpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLl9vJ10gPSBfb1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydfTkFNRV9GSUVMRF9WQUxVRSddID0gZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldW19yb19OQU1FX0ZJRUxEX0tFWV1cblxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHQjIFRPRE9cblxuXG4jIFx0XHRyZXR1cm5cblxuIyBcdHNldE9kYXRhUHJvcGVydHk9KGVudGl0aWVzLHNwYWNlLGtleSktPlxuIyBcdFx0ZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzID0gW11cbiMgXHRcdF8uZWFjaCBlbnRpdGllcywgKGVudGl0eSwgaWR4KS0+XG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSB7fVxuIyBcdFx0XHRpZCA9IGVudGl0aWVzW2lkeF1bXCJfaWRcIl1cbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmlkJ10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGgoc3BhY2Usa2V5KSsgJyhcXCcnICsgXCIje2lkfVwiICsgJ1xcJyknXG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXNbJ0BvZGF0YS5ldGFnJ10gPSBcIlcvXFxcIjA4RDU4OTcyMEJCQjNEQjFcXFwiXCJcbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmVkaXRMaW5rJ10gPSBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWydAb2RhdGEuaWQnXVxuIyBcdFx0XHRfLmV4dGVuZCBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzLGVudGl0eVxuIyBcdFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMucHVzaCBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzXG4jIFx0XHRyZXR1cm4gZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzXG5cbiMgXHRzZXRFcnJvck1lc3NhZ2UgPSAoc3RhdHVzQ29kZSxjb2xsZWN0aW9uLGtleSxhY3Rpb24pLT5cbiMgXHRcdGJvZHkgPSB7fVxuIyBcdFx0ZXJyb3IgPSB7fVxuIyBcdFx0aW5uZXJlcnJvciA9IHt9XG4jIFx0XHRpZiBzdGF0dXNDb2RlID09IDQwNFxuIyBcdFx0XHRpZiBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0aWYgYWN0aW9uID09ICdwb3N0J1xuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfcG9zdF9mYWlsXCIpXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcbiMgXHRcdFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDRcbiMgXHRcdFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfcG9zdF9mYWlsXCJcbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9yZWNvcmRfcXVlcnlfZmFpbFwiKVxuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXG4jIFx0XHRcdFx0XHRlcnJvclsnY29kZSddID0gNDA0XG4jIFx0XHRcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX3JlY29yZF9xdWVyeV9mYWlsXCJcbiMgXHRcdFx0ZWxzZVxuIyBcdFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX2NvbGxlY3Rpb25fcXVlcnlfZmFpbFwiKSsga2V5XG4jIFx0XHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXG4jIFx0XHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwNFxuIyBcdFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfY29sbGVjdGlvbl9xdWVyeV9mYWlsXCJcbiMgXHRcdGlmICBzdGF0dXNDb2RlID09IDQwMVxuIyBcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9hdXRoZW50aWNhdGlvbl9yZXF1aXJlZFwiKVxuIyBcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcbiMgXHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwMVxuIyBcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX2F1dGhlbnRpY2F0aW9uX3JlcXVpcmVkXCJcbiMgXHRcdGlmIHN0YXR1c0NvZGUgPT0gNDAzXG4jIFx0XHRcdHN3aXRjaCBhY3Rpb25cbiMgXHRcdFx0XHR3aGVuICdnZXQnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9hY2Nlc3NfZmFpbFwiKVxuIyBcdFx0XHRcdHdoZW4gJ3Bvc3QnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9jcmVhdGVfZmFpbFwiKVxuIyBcdFx0XHRcdHdoZW4gJ3B1dCcgdGhlbiBpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX3VwZGF0ZV9mYWlsXCIpXG4jIFx0XHRcdFx0d2hlbiAnZGVsZXRlJyB0aGVuIGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfcmVtb3ZlX2ZhaWxcIilcbiMgXHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9hY2Nlc3NfZmFpbFwiKVxuIyBcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcbiMgXHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwM1xuIyBcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX3VzZXJfYWNjZXNzX2ZhaWxcIlxuIyBcdFx0ZXJyb3JbJ2lubmVyZXJyb3InXSA9IGlubmVyZXJyb3JcbiMgXHRcdGJvZHlbJ2Vycm9yJ10gPSBlcnJvclxuIyBcdFx0cmV0dXJuIGJvZHlcblxuIyBcdHJlbW92ZUludmFsaWRNZXRob2QgPSAocXVlcnlQYXJhbXMpLT5cbiMgXHRcdGlmIHF1ZXJ5UGFyYW1zLiRmaWx0ZXIgJiYgcXVlcnlQYXJhbXMuJGZpbHRlci5pbmRleE9mKCd0b2xvd2VyKCcpID4gLTFcbiMgXHRcdFx0cmVtb3ZlTWV0aG9kID0gKCQxKS0+XG4jIFx0XHRcdFx0cmV0dXJuICQxLnJlcGxhY2UoJ3RvbG93ZXIoJywgJycpLnJlcGxhY2UoJyknLCAnJylcbiMgXHRcdFx0cXVlcnlQYXJhbXMuJGZpbHRlciA9IHF1ZXJ5UGFyYW1zLiRmaWx0ZXIucmVwbGFjZSgvdG9sb3dlclxcKChbXlxcKV0rKVxcKS9nLCByZW1vdmVNZXRob2QpXG5cbiMgXHRpc1NhbWVDb21wYW55ID0gKHNwYWNlSWQsIHVzZXJJZCwgY29tcGFueUlkLCBxdWVyeSktPlxuIyBcdFx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMSB9IH0pXG4jIFx0XHRpZiAhY29tcGFueUlkICYmIHF1ZXJ5XG4jIFx0XHRcdGNvbXBhbnlJZCA9IHN1LmNvbXBhbnlfaWRcbiMgXHRcdFx0cXVlcnkuY29tcGFueV9pZCA9IHsgJGluOiBzdS5jb21wYW55X2lkcyB9XG4jIFx0XHRyZXR1cm4gc3UuY29tcGFueV9pZHMuaW5jbHVkZXMoY29tcGFueUlkKVxuXG4jIFx0IyDkuI3ov5Tlm57lt7LlgYfliKDpmaTnmoTmlbDmja5cbiMgXHRleGNsdWRlRGVsZXRlZCA9IChxdWVyeSktPlxuIyBcdFx0cXVlcnkuaXNfZGVsZXRlZCA9IHsgJG5lOiB0cnVlIH1cblxuIyBcdCMg5L+u5pS544CB5Yig6Zmk5pe277yM5aaC5p6cIGRvYy5zcGFjZSA9IFwiZ2xvYmFsXCLvvIzmiqXplJlcbiMgXHRjaGVja0dsb2JhbFJlY29yZCA9IChjb2xsZWN0aW9uLCBpZCwgb2JqZWN0KS0+XG4jIFx0XHRpZiBvYmplY3QuZW5hYmxlX3NwYWNlX2dsb2JhbCAmJiBjb2xsZWN0aW9uLmZpbmQoeyBfaWQ6IGlkLCBzcGFjZTogJ2dsb2JhbCd9KS5jb3VudCgpXG4jIFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuS4jeiDveS/ruaUueaIluiAheWIoOmZpOagh+WHhuWvueixoVwiKVxuXG5cbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZScsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xuIyBcdFx0Z2V0OiAoKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIHNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG5cbiMgXHRcdFx0XHRyZW1vdmVJbnZhbGlkTWV0aG9kKEBxdWVyeVBhcmFtcylcbiMgXHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcbiMgXHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyAmJiBpc1NhbWVDb21wYW55KHNwYWNlSWQsIEB1c2VySWQsIGNyZWF0ZVF1ZXJ5LnF1ZXJ5LmNvbXBhbnlfaWQsIGNyZWF0ZVF1ZXJ5LnF1ZXJ5KSkgb3IgKHBlcm1pc3Npb25zLmFsbG93UmVhZCBhbmQgQHVzZXJJZClcblxuIyBcdFx0XHRcdFx0aWYga2V5IGlzICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBzcGFjZUlkXG4jIFx0XHRcdFx0XHRlbHNlIGlmIGtleSBpcyAnc3BhY2VzJ1xuIyBcdFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzbnQgJ2d1ZXN0J1xuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9IHNwYWNlSWRcbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0aWYgc3BhY2VJZCBpc250ICdndWVzdCcgYW5kIGtleSAhPSBcInVzZXJzXCIgYW5kIGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlIGlzbnQgJ2dsb2JhbCdcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IHNwYWNlSWRcblxuIyBcdFx0XHRcdFx0aWYgQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdGlmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIEB1c2VySWQpXG4jIFx0XHRcdFx0XHRcdFx0aWYga2V5IGlzICdzcGFjZXMnXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgY3JlYXRlUXVlcnkucXVlcnkuX2lkXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlXG4jIFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHR1c2VyX3NwYWNlcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmQoe3VzZXI6IEB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxuIyBcdFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnc3BhY2VzJ1xuIyBcdFx0XHRcdFx0XHRcdFx0IyBzcGFjZSDlr7nmiYDmnInnlKjmiLforrDlvZXkuLrlj6ror7tcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5faWRcbiMgXHRcdFx0XHRcdFx0XHRcdCMgY3JlYXRlUXVlcnkucXVlcnkuX2lkID0geyRpbjogXy5wbHVjayh1c2VyX3NwYWNlcywgJ3NwYWNlJyl9XG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSB7JGluOiBfLnBsdWNrKHVzZXJfc3BhY2VzLCAnc3BhY2UnKX1cblxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnNvcnQgb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5zb3J0KVxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5zb3J0ID0geyBtb2RpZmllZDogLTEgfVxuIyBcdFx0XHRcdFx0aXNfZW50ZXJwcmlzZSA9IFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oc3BhY2VJZCxcIndvcmtmbG93LmVudGVycHJpc2VcIilcbiMgXHRcdFx0XHRcdGlzX3Byb2Zlc3Npb25hbCA9IFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oc3BhY2VJZCxcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiKVxuIyBcdFx0XHRcdFx0aXNfc3RhbmRhcmQgPSBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlSWQsXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkubGltaXRcbiMgXHRcdFx0XHRcdFx0bGltaXQgPSBjcmVhdGVRdWVyeS5saW1pdFxuIyBcdFx0XHRcdFx0XHRpZiBpc19lbnRlcnByaXNlIGFuZCBsaW1pdD4xMDAwMDBcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDAwMFxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3Byb2Zlc3Npb25hbCBhbmQgbGltaXQ+MTAwMDAgYW5kICFpc19lbnRlcnByaXNlXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMFxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3N0YW5kYXJkIGFuZCBsaW1pdD4xMDAwIGFuZCAhaXNfcHJvZmVzc2lvbmFsIGFuZCAhaXNfZW50ZXJwcmlzZVxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMFxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRpZiBpc19lbnRlcnByaXNlXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMDBcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBpc19wcm9mZXNzaW9uYWwgYW5kICFpc19lbnRlcnByaXNlXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMFxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3N0YW5kYXJkIGFuZCAhaXNfZW50ZXJwcmlzZSBhbmQgIWlzX3Byb2Zlc3Npb25hbFxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMFxuIyBcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkucHJvamVjdGlvblxuIyBcdFx0XHRcdFx0XHRwcm9qZWN0aW9uID0ge31cbiMgXHRcdFx0XHRcdFx0Xy5rZXlzKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pLmZvckVhY2ggKGtleSktPlxuIyBcdFx0XHRcdFx0XHRcdGlmIF8uaW5kZXhPZih1bnJlYWRhYmxlX2ZpZWxkcywga2V5KSA8IDBcbiMgXHRcdFx0XHRcdFx0XHRcdCNpZiBub3QgKChmaWVsZHNba2V5XT8udHlwZSA9PSAnbG9va3VwJyBvciBmaWVsZHNba2V5XT8udHlwZSA9PSAnbWFzdGVyX2RldGFpbCcpIGFuZCBmaWVsZHNba2V5XS5tdWx0aXBsZSlcbiMgXHRcdFx0XHRcdFx0XHRcdHByb2plY3Rpb25ba2V5XSA9IDFcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbiA9IHByb2plY3Rpb25cbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uIG9yICFfLnNpemUoY3JlYXRlUXVlcnkucHJvamVjdGlvbilcbiMgXHRcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoa2V5LCBzcGFjZUlkLCBAdXNlcklkKVxuIyBcdFx0XHRcdFx0XHRmaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpLmZpZWxkc1xuIyBcdFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZmllbGQpLT5cbiMgXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pbmRleE9mKCckJykgPCAwXG4jIFx0XHRcdFx0XHRcdFx0XHQjaWYgZmllbGRzW2ZpZWxkXT8ubXVsdGlwbGUhPSB0cnVlXG4jIFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uW2ZpZWxkXSA9IDFcbiMgXHRcdFx0XHRcdGlmIG5vdCBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG4jIFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfc2hhcmVcbiMgXHRcdFx0XHRcdFx0XHQjIOa7oei2s+WFseS6q+inhOWImeS4reeahOiusOW9leS5n+imgeaQnOe0ouWHuuadpVxuIyBcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5vd25lclxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcyA9IFtdXG4jIFx0XHRcdFx0XHRcdFx0b3JncyA9IFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMoc3BhY2VJZCwgQHVzZXJJZCwgdHJ1ZSlcbiMgXHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7XCJvd25lclwiOiBAdXNlcklkfVxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHsgXCJzaGFyaW5nLnVcIjogQHVzZXJJZCB9XG4jIFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcub1wiOiB7ICRpbjogb3JncyB9IH1cbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVtcIiRvclwiXSA9IHNoYXJlc1xuIyBcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkub3duZXIgPSBAdXNlcklkXG4jIFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXG5cbiMgXHRcdFx0XHRcdGV4Y2x1ZGVEZWxldGVkKGNyZWF0ZVF1ZXJ5LnF1ZXJ5KVxuXG4jIFx0XHRcdFx0XHRpZiBAcXVlcnlQYXJhbXMuJHRvcCBpc250ICcwJ1xuIyBcdFx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSwgdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpLmZldGNoKClcbiMgXHRcdFx0XHRcdHNjYW5uZWRDb3VudCA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSx7ZmllbGRzOntfaWQ6IDF9fSkuY291bnQoKVxuIyBcdFx0XHRcdFx0aWYgZW50aXRpZXNcbiMgXHRcdFx0XHRcdFx0ZGVhbFdpdGhFeHBhbmQoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIHNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdCNzY2FubmVkQ291bnQgPSBlbnRpdGllcy5sZW5ndGhcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0I1x0Ym9keVsnQG9kYXRhLm5leHRMaW5rJ10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGgoc3BhY2VJZCxrZXkpK1wiPyUyNHNraXA9XCIrIDEwXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb3VudCddID0gc2Nhbm5lZENvdW50XG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzX09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LFwiZ2V0XCIpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuXG4jIFx0XHRwb3N0OiAoKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZCk/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0fVxuXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIHNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxuIyBcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSBzcGFjZUlkXG4jIFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCdcbiMgXHRcdFx0XHRcdFx0ZGVsZXRlIEBib2R5UGFyYW1zLnNwYWNlXG4jIFx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG4jIFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcbiMgXHRcdFx0XHRcdGVudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdGlmIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzLnB1c2ggZW50aXR5XG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xuIyBcdFx0XHRcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncG9zdCcpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuXG4jIFx0fSlcbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZS9yZWNlbnQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcbiMgXHRcdGdldDooKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X2NvbGxlY3Rpb24gPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wib2JqZWN0X3JlY2VudF92aWV3ZWRcIl1cbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3NlbGVjdG9yID0ge1wicmVjb3JkLm9cIjprZXksY3JlYXRlZF9ieTpAdXNlcklkfVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfb3B0aW9ucyA9IHt9XG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19vcHRpb25zLnNvcnQgPSB7Y3JlYXRlZDogLTF9XG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19vcHRpb25zLmZpZWxkcyA9IHtyZWNvcmQ6MX1cbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHMgPSByZWNlbnRfdmlld19jb2xsZWN0aW9uLmZpbmQocmVjZW50X3ZpZXdfc2VsZWN0b3IscmVjZW50X3ZpZXdfb3B0aW9ucykuZmV0Y2goKVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSBfLnBsdWNrKHJlY2VudF92aWV3X3JlY29yZHMsJ3JlY29yZCcpXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IHJlY2VudF92aWV3X3JlY29yZHNfaWRzLmdldFByb3BlcnR5KFwiaWRzXCIpXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IF8uZmxhdHRlbihyZWNlbnRfdmlld19yZWNvcmRzX2lkcylcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy51bmlxKHJlY2VudF92aWV3X3JlY29yZHNfaWRzKVxuIyBcdFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXG4jIFx0XHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcbiMgXHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5ID0gaWYgcXMgdGhlbiBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeShxcykgZWxzZSBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeSgpXG4jIFx0XHRcdFx0XHRpZiBrZXkgaXMgJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVsnbWV0YWRhdGEuc3BhY2UnXSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LmxpbWl0XG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5saW1pdCBhbmQgcmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMubGVuZ3RoPmNyZWF0ZVF1ZXJ5LmxpbWl0XG4jIFx0XHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy5maXJzdChyZWNlbnRfdmlld19yZWNvcmRzX2lkcyxjcmVhdGVRdWVyeS5saW1pdClcbiMgXHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9IHskaW46cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHN9XG4jIFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uXG4jIFx0XHRcdFx0XHRcdHByb2plY3Rpb24gPSB7fVxuIyBcdFx0XHRcdFx0XHRfLmtleXMoY3JlYXRlUXVlcnkucHJvamVjdGlvbikuZm9yRWFjaCAoa2V5KS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHVucmVhZGFibGVfZmllbGRzLCBrZXkpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdFx0IyBpZiBub3QgKChmaWVsZHNba2V5XT8udHlwZSA9PSAnbG9va3VwJyBvciBmaWVsZHNba2V5XT8udHlwZSA9PSAnbWFzdGVyX2RldGFpbCcpIGFuZCBmaWVsZHNba2V5XS5tdWx0aXBsZSlcbiMgXHRcdFx0XHRcdFx0XHRcdHByb2plY3Rpb25ba2V5XSA9IDFcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbiA9IHByb2plY3Rpb25cbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uIG9yICFfLnNpemUoY3JlYXRlUXVlcnkucHJvamVjdGlvbilcbiMgXHRcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQpXG4jIFx0XHRcdFx0XHRcdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKS5maWVsZHNcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGZpZWxkKS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaW5kZXhPZignJCcpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdFx0I2lmIGZpZWxkc1tmaWVsZF0/Lm11bHRpcGxlIT0gdHJ1ZVxuIyBcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbltmaWVsZF0gPSAxXG5cbiMgXHRcdFx0XHRcdGV4Y2x1ZGVEZWxldGVkKGNyZWF0ZVF1ZXJ5LnF1ZXJ5KVxuXG4jIFx0XHRcdFx0XHRpZiBAcXVlcnlQYXJhbXMuJHRvcCBpc250ICcwJ1xuIyBcdFx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSwgdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpLmZldGNoKClcbiMgXHRcdFx0XHRcdGVudGl0aWVzX2luZGV4ID0gW11cbiMgXHRcdFx0XHRcdGVudGl0aWVzX2lkcyA9IF8ucGx1Y2soZW50aXRpZXMsJ19pZCcpXG4jIFx0XHRcdFx0XHRzb3J0X2VudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5zb3J0IG9yICFfLnNpemUoY3JlYXRlUXVlcnkuc29ydClcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY2VudF92aWV3X3JlY29yZHNfaWRzICwocmVjZW50X3ZpZXdfcmVjb3Jkc19pZCktPlxuIyBcdFx0XHRcdFx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGVudGl0aWVzX2lkcyxyZWNlbnRfdmlld19yZWNvcmRzX2lkKVxuIyBcdFx0XHRcdFx0XHRcdGlmIGluZGV4Pi0xXG4jIFx0XHRcdFx0XHRcdFx0XHRzb3J0X2VudGl0aWVzLnB1c2ggZW50aXRpZXNbaW5kZXhdXG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdHNvcnRfZW50aXRpZXMgPSBlbnRpdGllc1xuIyBcdFx0XHRcdFx0aWYgc29ydF9lbnRpdGllc1xuIyBcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgc29ydF9lbnRpdGllcywga2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0I1x0Ym9keVsnQG9kYXRhLm5leHRMaW5rJ10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGgoQHVybFBhcmFtcy5zcGFjZUlkLGtleSkrXCI/JTI0c2tpcD1cIisgMTBcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvdW50J10gPSBzb3J0X2VudGl0aWVzLmxlbmd0aFxuIyBcdFx0XHRcdFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KHNvcnRfZW50aXRpZXMsQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdGllc19PZGF0YVByb3BlcnRpZXNcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSwnZ2V0JylcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ2dldCcpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuIyB9KVxuXG4jIFx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCc6b2JqZWN0X25hbWUvOl9pZCcsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xuIyBcdFx0cG9zdDogKCktPlxuIyBcdFx0XHR0cnlcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKT8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxuIyBcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcbiMgXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuIyBcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxuIyBcdFx0XHRcdFx0aWYgZW50aXR5XG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMucHVzaCBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcbiMgXHRcdFx0XHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncG9zdCcpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuIyBcdFx0Z2V0OigpLT5cbiMgXHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRpZiBrZXkuaW5kZXhPZihcIihcIikgPiAtMVxuIyBcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdGNvbGxlY3Rpb25JbmZvID0ga2V5XG4jIFx0XHRcdFx0ZmllbGROYW1lID0gQHVybFBhcmFtcy5faWQuc3BsaXQoJ19leHBhbmQnKVswXVxuIyBcdFx0XHRcdGNvbGxlY3Rpb25JbmZvU3BsaXQgPSBjb2xsZWN0aW9uSW5mby5zcGxpdCgnKCcpXG4jIFx0XHRcdFx0Y29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uSW5mb1NwbGl0WzBdXG4jIFx0XHRcdFx0aWQgPSBjb2xsZWN0aW9uSW5mb1NwbGl0WzFdLnNwbGl0KCdcXCcnKVsxXVxuXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGZpZWxkc09wdGlvbnMgPSB7fVxuIyBcdFx0XHRcdGZpZWxkc09wdGlvbnNbZmllbGROYW1lXSA9IDFcbiMgXHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogaWR9LCB7ZmllbGRzOiBmaWVsZHNPcHRpb25zfSlcblxuIyBcdFx0XHRcdGZpZWxkVmFsdWUgPSBudWxsXG4jIFx0XHRcdFx0aWYgZW50aXR5XG4jIFx0XHRcdFx0XHRmaWVsZFZhbHVlID0gZW50aXR5W2ZpZWxkTmFtZV1cblxuIyBcdFx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KGNvbGxlY3Rpb25OYW1lLCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0ZmllbGQgPSBvYmouZmllbGRzW2ZpZWxkTmFtZV1cblxuIyBcdFx0XHRcdGlmIGZpZWxkIGFuZCBmaWVsZFZhbHVlIGFuZCAoZmllbGQudHlwZSBpcyAnbG9va3VwJyBvciBmaWVsZC50eXBlIGlzICdtYXN0ZXJfZGV0YWlsJylcbiMgXHRcdFx0XHRcdGxvb2t1cENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvLCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0XHRxdWVyeU9wdGlvbnMgPSB7ZmllbGRzOiB7fX1cbiMgXHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGZpZWxkLnJlZmVyZW5jZV90bywgQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkKVxuIyBcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGYpLT5cbiMgXHRcdFx0XHRcdFx0aWYgZi5pbmRleE9mKCckJykgPCAwXG4jIFx0XHRcdFx0XHRcdFx0cXVlcnlPcHRpb25zLmZpZWxkc1tmXSA9IDFcblxuIyBcdFx0XHRcdFx0aWYgZmllbGQubXVsdGlwbGVcbiMgXHRcdFx0XHRcdFx0dmFsdWVzID0gW11cbiMgXHRcdFx0XHRcdFx0bG9va3VwQ29sbGVjdGlvbi5maW5kKHtfaWQ6IHskaW46IGZpZWxkVmFsdWV9fSwgcXVlcnlPcHRpb25zKS5mb3JFYWNoIChvYmopLT5cbiMgXHRcdFx0XHRcdFx0XHRfLmVhY2ggb2JqLCAodiwgayktPlxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHYpIHx8IChfLmlzT2JqZWN0KHYpICYmICFfLmlzRGF0ZSh2KSlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0b2JqW2tdID0gSlNPTi5zdHJpbmdpZnkodilcbiMgXHRcdFx0XHRcdFx0XHR2YWx1ZXMucHVzaChvYmopXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSB2YWx1ZXNcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoQHVybFBhcmFtcy5zcGFjZUlkKSArIFwiIyN7Y29sbGVjdGlvbkluZm99LyN7QHVybFBhcmFtcy5faWR9XCJcbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IGxvb2t1cENvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiBmaWVsZFZhbHVlfSwgcXVlcnlPcHRpb25zKSB8fCB7fVxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggYm9keSwgKHYsIGspLT5cbiMgXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkodikgfHwgKF8uaXNPYmplY3QodikgJiYgIV8uaXNEYXRlKHYpKVxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keVtrXSA9IEpTT04uc3RyaW5naWZ5KHYpXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCkgKyBcIiMje2ZpZWxkLnJlZmVyZW5jZV90b30vJGVudGl0eVwiXG5cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zLnNwYWNlSWQpICsgXCIjI3tjb2xsZWN0aW9uSW5mb30vI3tAdXJsUGFyYW1zLl9pZH1cIlxuIyBcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGZpZWxkVmFsdWVcblxuIyBcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG5cbiMgXHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0ZWxzZVxuIyBcdFx0XHRcdHRyeVxuIyBcdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0XHR9XG5cbiMgXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuIyBcdFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXG4jIFx0XHRcdFx0XHRcdHJlbW92ZUludmFsaWRNZXRob2QoQHF1ZXJ5UGFyYW1zKVxuIyBcdFx0XHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkgPSBpZiBxcyB0aGVuIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KHFzKSBlbHNlIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KClcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuX2lkID0gIEB1cmxQYXJhbXMuX2lkXG4jIFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBrZXkgIT0gJ3NwYWNlcydcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9ICBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxuIyBcdFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0cHJvamVjdGlvbiA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0Xy5rZXlzKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pLmZvckVhY2ggKGtleSktPlxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHVucmVhZGFibGVfZmllbGRzLCBrZXkpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdFx0XHQjIGlmIG5vdCAoKGZpZWxkc1trZXldPy50eXBlID09ICdsb29rdXAnIG9yIGZpZWxkc1trZXldPy50eXBlID09ICdtYXN0ZXJfZGV0YWlsJykgYW5kIGZpZWxkc1trZXldLm11bHRpcGxlKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0aW9uW2tleV0gPSAxXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbiA9IHByb2plY3Rpb25cbiMgXHRcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKVxuIyBcdFx0XHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkKVxuIyBcdFx0XHRcdFx0XHRcdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcbiMgXHRcdFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZmllbGQpIC0+XG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pbmRleE9mKCckJykgPCAwXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25bZmllbGRdID0gMVxuIyBcdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoY3JlYXRlUXVlcnkucXVlcnksdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdFx0aWYgZW50aXR5XG4jIFx0XHRcdFx0XHRcdFx0aXNBbGxvd2VkID0gZW50aXR5Lm93bmVyID09IEB1c2VySWQgb3IgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyAmJiBpc1NhbWVDb21wYW55KEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwgZW50aXR5LmNvbXBhbnlfaWQpKVxuIyBcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfc2hhcmUgYW5kICFpc0FsbG93ZWRcbiMgXHRcdFx0XHRcdFx0XHRcdHNoYXJlcyA9IFtdXG4jIFx0XHRcdFx0XHRcdFx0XHRvcmdzID0gU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIHRydWUpXG4jIFx0XHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7IFwic2hhcmluZy51XCI6IEB1c2VySWQgfVxuIyBcdFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcub1wiOiB7ICRpbjogb3JncyB9IH1cbiMgXHRcdFx0XHRcdFx0XHRcdGlzQWxsb3dlZCA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogQHVybFBhcmFtcy5faWQsIFwiJG9yXCI6IHNoYXJlcyB9LCB7IGZpZWxkczogeyBfaWQ6IDEgfSB9KVxuIyBcdFx0XHRcdFx0XHRcdGlmIGlzQWxsb3dlZFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzLnB1c2ggZW50aXR5XG4jIFx0XHRcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgZW50aXRpZXMsIGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcbiMgXHRcdFx0XHRcdFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdFx0Xy5leHRlbmQgYm9keSxlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWzBdXG4jIFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxuIyBcdFx0XHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxuIyBcdFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ2dldCcpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRjYXRjaCBlXG4jIFx0XHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuXG4jIFx0XHRwdXQ6KCktPlxuIyBcdFx0XHR0cnlcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdH1cblxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0aWYga2V5ID09IFwidXNlcnNcIlxuIyBcdFx0XHRcdFx0cmVjb3JkX293bmVyID0gQHVybFBhcmFtcy5faWRcbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZWNvcmRfb3duZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IEB1cmxQYXJhbXMuX2lkIH0sIHsgZmllbGRzOiB7IG93bmVyOiAxIH0gfSk/Lm93bmVyXG5cbiMgXHRcdFx0XHRjb21wYW55SWQgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IEB1cmxQYXJhbXMuX2lkIH0sIHsgZmllbGRzOiB7IGNvbXBhbnlfaWQ6IDEgfSB9KT8uY29tcGFueV9pZFxuXG4jIFx0XHRcdFx0aXNBbGxvd2VkID0gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBvciAocGVybWlzc2lvbnMuYWxsb3dFZGl0IGFuZCByZWNvcmRfb3duZXIgPT0gQHVzZXJJZCApIG9yIChwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyAmJiBpc1NhbWVDb21wYW55KHNwYWNlSWQsIEB1c2VySWQsIGNvbXBhbnlJZCkpXG4jIFx0XHRcdFx0aWYgaXNBbGxvd2VkXG4jIFx0XHRcdFx0XHRjaGVja0dsb2JhbFJlY29yZChjb2xsZWN0aW9uLCBAdXJsUGFyYW1zLl9pZCwgb2JqZWN0KVxuIyBcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLl9pZCwgc3BhY2U6IHNwYWNlSWR9XG4jIFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCcgb3Igc3BhY2VJZCBpcyAnY29tbW9uJyBvciBrZXkgPT0gXCJ1c2Vyc1wiXG4jIFx0XHRcdFx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxuIyBcdFx0XHRcdFx0ZmllbGRzX2VkaXRhYmxlID0gdHJ1ZVxuIyBcdFx0XHRcdFx0Xy5rZXlzKEBib2R5UGFyYW1zLiRzZXQpLmZvckVhY2ggKGtleSktPlxuIyBcdFx0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIGtleSkgPiAtMVxuIyBcdFx0XHRcdFx0XHRcdGZpZWxkc19lZGl0YWJsZSA9IGZhbHNlXG4jIFx0XHRcdFx0XHRpZiBmaWVsZHNfZWRpdGFibGVcbiMgXHRcdFx0XHRcdFx0aWYga2V5IGlzICdzcGFjZXMnXG4jIFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXG4jIFx0XHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCBAYm9keVBhcmFtc1xuIyBcdFx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcbiMgXHRcdFx0XHRcdFx0XHQjc3RhdHVzQ29kZTogMjAxXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5faWRcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdFx0XHQjIGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXRpZXMucHVzaCBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0XHQjIGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdCMgXy5leHRlbmQgYm9keSxlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWzBdXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0XHR7aGVhZGVyczogaGVhZGVycyxib2R5OmJvZHl9XG4jIFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncHV0JylcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ3B1dCcpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuIyBcdFx0ZGVsZXRlOigpLT5cbiMgXHRcdFx0dHJ5XG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHRcdH1cblxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRyZWNvcmREYXRhID0gY29sbGVjdGlvbi5maW5kT25lKHtfaWQ6IEB1cmxQYXJhbXMuX2lkfSwgeyBmaWVsZHM6IHsgb3duZXI6IDEsIGNvbXBhbnlfaWQ6IDEgfSB9KVxuIyBcdFx0XHRcdHJlY29yZF9vd25lciA9IHJlY29yZERhdGE/Lm93bmVyXG4jIFx0XHRcdFx0Y29tcGFueUlkID0gcmVjb3JkRGF0YT8uY29tcGFueV9pZFxuIyBcdFx0XHRcdGlzQWxsb3dlZCA9IChwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSkgb3IgKHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSBhbmQgaXNTYW1lQ29tcGFueShzcGFjZUlkLCBAdXNlcklkLCBjb21wYW55SWQpKSBvciAocGVybWlzc2lvbnMuYWxsb3dEZWxldGUgYW5kIHJlY29yZF9vd25lcj09QHVzZXJJZCApXG4jIFx0XHRcdFx0aWYgaXNBbGxvd2VkXG4jIFx0XHRcdFx0XHRjaGVja0dsb2JhbFJlY29yZChjb2xsZWN0aW9uLCBAdXJsUGFyYW1zLl9pZCwgb2JqZWN0KVxuIyBcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLl9pZCwgc3BhY2U6IHNwYWNlSWR9XG4jIFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCdcbiMgXHRcdFx0XHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXG5cbiMgXHRcdFx0XHRcdGlmIG9iamVjdD8uZW5hYmxlX3RyYXNoXG4jIFx0XHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCB7XG4jIFx0XHRcdFx0XHRcdFx0JHNldDoge1xuIyBcdFx0XHRcdFx0XHRcdFx0aXNfZGVsZXRlZDogdHJ1ZSxcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZWQ6IG5ldyBEYXRlKCksXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGVkX2J5OiBAdXNlcklkXG4jIFx0XHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0XHR9KVxuIyBcdFx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHRcdHtoZWFkZXJzOiBoZWFkZXJzLGJvZHk6Ym9keX1cbiMgXHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdGllcy5wdXNoIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRcdCMgYm9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKHNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0IyBfLmV4dGVuZCBib2R5LGVudGl0eV9PZGF0YVByb3BlcnRpZXNbMF1cbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHRcdHtoZWFkZXJzOiBoZWFkZXJzLGJvZHk6Ym9keX1cbiMgXHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuIyBcdH0pXG5cbiMgXHQjIF9pZOWPr+S8oGFsbFxuIyBcdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnOm9iamVjdF9uYW1lLzpfaWQvOm1ldGhvZE5hbWUnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcbiMgXHRcdHBvc3Q6ICgpLT5cbiMgXHRcdFx0dHJ5XG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRcdGlmIG5vdCBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCk/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cblxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcbiMgXHRcdFx0XHRcdG1ldGhvZE5hbWUgPSBAdXJsUGFyYW1zLm1ldGhvZE5hbWVcbiMgXHRcdFx0XHRcdG1ldGhvZHMgPSBDcmVhdG9yLk9iamVjdHNba2V5XT8ubWV0aG9kcyB8fCB7fVxuIyBcdFx0XHRcdFx0aWYgbWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShtZXRob2ROYW1lKVxuIyBcdFx0XHRcdFx0XHR0aGlzT2JqID0ge1xuIyBcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBrZXlcbiMgXHRcdFx0XHRcdFx0XHRyZWNvcmRfaWQ6IEB1cmxQYXJhbXMuX2lkXG4jIFx0XHRcdFx0XHRcdFx0c3BhY2VfaWQ6IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0XHRcdHVzZXJfaWQ6IEB1c2VySWRcbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9uczogcGVybWlzc2lvbnNcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0XHRyZXR1cm4gbWV0aG9kc1ttZXRob2ROYW1lXS5hcHBseSh0aGlzT2JqLCBbQGJvZHlQYXJhbXNdKSB8fCB7fVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0Y2F0Y2ggZVxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXG5cbiMgXHR9KVxuXG4jIFx0I1RPRE8gcmVtb3ZlXG4jIFx0Xy5lYWNoIFtdLCAodmFsdWUsIGtleSwgbGlzdCktPiAjQ3JlYXRvci5Db2xsZWN0aW9uc1xuIyBcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSk/LmVuYWJsZV9hcGlcbiMgXHRcdFx0cmV0dXJuXG5cbiMgXHRcdGlmIFN0ZWVkb3NPZGF0YUFQSVxuXG4jIFx0XHRcdFN0ZWVkb3NPZGF0YUFQSS5hZGRDb2xsZWN0aW9uIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpLFxuIyBcdFx0XHRcdGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXVxuIyBcdFx0XHRcdHJvdXRlT3B0aW9uczpcbiMgXHRcdFx0XHRcdGF1dGhSZXF1aXJlZDogdHJ1ZVxuIyBcdFx0XHRcdFx0c3BhY2VSZXF1aXJlZDogZmFsc2VcbiMgXHRcdFx0XHRlbmRwb2ludHM6XG4jIFx0XHRcdFx0XHRnZXRBbGw6XG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XG5cbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLmFsbG93UmVhZCBhbmQgQHVzZXJJZClcbiMgXHRcdFx0XHRcdFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShAcXVlcnlQYXJhbXMpKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxuXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0gQHVybFBhcmFtcy5zcGFjZUlkXG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgbm90IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkub3duZXIgPSBAdXNlcklkXG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBAcXVlcnlQYXJhbXMuJHRvcCBpc250ICcwJ1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LCB2aXNpdG9yUGFyc2VyKGNyZWF0ZVF1ZXJ5KSkuZmV0Y2goKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzY2FubmVkQ291bnQgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnkpLmNvdW50KClcblxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdGllc1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGRlYWxXaXRoRXhwYW5kKGNyZWF0ZVF1ZXJ5LCBlbnRpdGllcywga2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvdW50J10gPSBzY2FubmVkQ291bnRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXRpZXNcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbid9XG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XG4jIFx0XHRcdFx0XHRwb3N0OlxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxuXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSBAc3BhY2VJZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIHZhbHVlOiBlbnRpdHl9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cbiMgXHRcdFx0XHRcdGdldDpcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cblxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWQsIHNwYWNlOiBAc3BhY2VJZH1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgdmFsdWU6IGVudGl0eX1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cbiMgXHRcdFx0XHRcdHB1dDpcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cblxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93RWRpdFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWQsIHNwYWNlOiBAc3BhY2VJZH1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsICRzZXQ6IEBib2R5UGFyYW1zXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCB2YWx1ZTogZW50aXR5fVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxuIyBcdFx0XHRcdFx0ZGVsZXRlOlxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxuXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkLCBzcGFjZTogQHNwYWNlSWR9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgTWV0ZW9yT0RhdGFBUElWNFJvdXRlciwgTWV0ZW9yT0RhdGFSb3V0ZXIsIE9EYXRhUm91dGVyLCBhcHAsIGV4cHJlc3M7XG4gIE1ldGVvck9EYXRhUm91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk1ldGVvck9EYXRhUm91dGVyO1xuICBPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5PRGF0YVJvdXRlcjtcbiAgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbiAgYXBwID0gZXhwcmVzcygpO1xuICBhcHAudXNlKCcvYXBpL29kYXRhL3Y0JywgTWV0ZW9yT0RhdGFSb3V0ZXIpO1xuICBNZXRlb3JPRGF0YUFQSVY0Um91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk1ldGVvck9EYXRhQVBJVjRSb3V0ZXI7XG4gIGlmIChNZXRlb3JPRGF0YUFQSVY0Um91dGVyKSB7XG4gICAgYXBwLnVzZSgnL2FwaS92NCcsIE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIpO1xuICB9XG4gIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKGFwcCk7XG4gIHJldHVybiBfLmVhY2goQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIGZ1bmN0aW9uKGRhdGFzb3VyY2UsIG5hbWUpIHtcbiAgICB2YXIgb3RoZXJBcHA7XG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgb3RoZXJBcHAgPSBleHByZXNzKCk7XG4gICAgICBvdGhlckFwcC51c2UoXCIvYXBpL29kYXRhL1wiICsgbmFtZSwgT0RhdGFSb3V0ZXIpO1xuICAgICAgcmV0dXJuIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKG90aGVyQXBwKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpXG5cbmJhc2ljQXV0aCA9IHJlcXVpcmUoJ2Jhc2ljLWF1dGgnKVxuXG5hdXRob3JpemF0aW9uQ2FjaGUgPSB7fVxuXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUudXNlICcvYXBpL29kYXRhL3Y0LycsIChyZXEsIHJlcywgbmV4dCktPlxuXG5cdEZpYmVyKCgpLT5cblx0XHRpZiAhcmVxLnVzZXJJZFxuXHRcdFx0aXNBdXRoZWQgPSBmYWxzZVxuXHRcdFx0IyBvYXV0aDLpqozor4Fcblx0XHRcdGlmIHJlcT8ucXVlcnk/LmFjY2Vzc190b2tlblxuXHRcdFx0XHRjb25zb2xlLmxvZyAnT0F1dGgyOiAnLCByZXEucXVlcnkuYWNjZXNzX3Rva2VuXG5cdFx0XHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4pXG5cdFx0XHRcdGlmIHVzZXJJZFxuXHRcdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXHRcdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRcdGlzQXV0aGVkID0gdHJ1ZVxuXHRcdFx0IyBiYXNpY+mqjOivgVxuXHRcdFx0aWYgcmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXVxuXHRcdFx0XHRhdXRoID0gYmFzaWNBdXRoLnBhcnNlKHJlcS5oZWFkZXJzWydhdXRob3JpemF0aW9uJ10pXG5cdFx0XHRcdGlmIGF1dGhcblx0XHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe3VzZXJuYW1lOiBhdXRoLm5hbWV9LCB7IGZpZWxkczogeyAnc2VydmljZXMnOiAxIH0gfSlcblx0XHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0XHRpZiBhdXRob3JpemF0aW9uQ2FjaGVbYXV0aC5uYW1lXSA9PSBhdXRoLnBhc3Ncblx0XHRcdFx0XHRcdFx0aXNBdXRoZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIGF1dGgucGFzc1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0aWYgIXJlc3VsdC5lcnJvclxuXHRcdFx0XHRcdFx0XHRcdGlzQXV0aGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdGlmIF8ua2V5cyhhdXRob3JpemF0aW9uQ2FjaGUpLmxlbmd0aCA+IDEwMFxuXHRcdFx0XHRcdFx0XHRcdFx0YXV0aG9yaXphdGlvbkNhY2hlID0ge31cblx0XHRcdFx0XHRcdFx0XHRhdXRob3JpemF0aW9uQ2FjaGVbYXV0aC5uYW1lXSA9IGF1dGgucGFzc1xuXHRcdFx0aWYgaXNBdXRoZWRcblx0XHRcdFx0cmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddID0gdXNlci5faWRcblx0XHRcdFx0dG9rZW4gPSBudWxsXG5cdFx0XHRcdGFwcF9pZCA9IFwiY3JlYXRvclwiXG5cdFx0XHRcdGNsaWVudF9pZCA9IFwicGNcIlxuXHRcdFx0XHRsb2dpblRva2VucyA9IHVzZXIuc2VydmljZXM/LnJlc3VtZT8ubG9naW5Ub2tlbnNcblx0XHRcdFx0aWYgbG9naW5Ub2tlbnNcblx0XHRcdFx0XHRhcHBfbG9naW5fdG9rZW4gPSBfLmZpbmQobG9naW5Ub2tlbnMsICh0KS0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gdC5hcHBfaWQgaXMgYXBwX2lkIGFuZCB0LmNsaWVudF9pZCBpcyBjbGllbnRfaWRcblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0dG9rZW4gPSBhcHBfbG9naW5fdG9rZW4udG9rZW4gaWYgYXBwX2xvZ2luX3Rva2VuXG5cblx0XHRcdFx0aWYgbm90IHRva2VuXG5cdFx0XHRcdFx0YXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKVxuXHRcdFx0XHRcdHRva2VuID0gYXV0aFRva2VuLnRva2VuXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cblx0XHRcdFx0XHRoYXNoZWRUb2tlbi5hcHBfaWQgPSBhcHBfaWRcblx0XHRcdFx0XHRoYXNoZWRUb2tlbi5jbGllbnRfaWQgPSBjbGllbnRfaWRcblx0XHRcdFx0XHRoYXNoZWRUb2tlbi50b2tlbiA9IHRva2VuXG5cdFx0XHRcdFx0QWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4gdXNlci5faWQsIGhhc2hlZFRva2VuXG5cblx0XHRcdFx0aWYgdG9rZW5cblx0XHRcdFx0XHRyZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gPSB0b2tlblxuXHRcdG5leHQoKVxuXHQpLnJ1bigpXG4iLCJ2YXIgRmliZXIsIGF1dGhvcml6YXRpb25DYWNoZSwgYmFzaWNBdXRoO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5iYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJyk7XG5cbmF1dGhvcml6YXRpb25DYWNoZSA9IHt9O1xuXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKCcvYXBpL29kYXRhL3Y0LycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICB2YXIgYXBwX2lkLCBhcHBfbG9naW5fdG9rZW4sIGF1dGgsIGF1dGhUb2tlbiwgY2xpZW50X2lkLCBoYXNoZWRUb2tlbiwgaXNBdXRoZWQsIGxvZ2luVG9rZW5zLCByZWYsIHJlZjEsIHJlZjIsIHJlc3VsdCwgdG9rZW4sIHVzZXIsIHVzZXJJZDtcbiAgICBpZiAoIXJlcS51c2VySWQpIHtcbiAgICAgIGlzQXV0aGVkID0gZmFsc2U7XG4gICAgICBpZiAocmVxICE9IG51bGwgPyAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmFjY2Vzc190b2tlbiA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnT0F1dGgyOiAnLCByZXEucXVlcnkuYWNjZXNzX3Rva2VuKTtcbiAgICAgICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4ocmVxLnF1ZXJ5LmFjY2Vzc190b2tlbik7XG4gICAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgaXNBdXRoZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlcS5oZWFkZXJzWydhdXRob3JpemF0aW9uJ10pIHtcbiAgICAgICAgYXV0aCA9IGJhc2ljQXV0aC5wYXJzZShyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKTtcbiAgICAgICAgaWYgKGF1dGgpIHtcbiAgICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgdXNlcm5hbWU6IGF1dGgubmFtZVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAnc2VydmljZXMnOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgIGlmIChhdXRob3JpemF0aW9uQ2FjaGVbYXV0aC5uYW1lXSA9PT0gYXV0aC5wYXNzKSB7XG4gICAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKHVzZXIsIGF1dGgucGFzcyk7XG4gICAgICAgICAgICAgIGlmICghcmVzdWx0LmVycm9yKSB7XG4gICAgICAgICAgICAgICAgaXNBdXRoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChfLmtleXMoYXV0aG9yaXphdGlvbkNhY2hlKS5sZW5ndGggPiAxMDApIHtcbiAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb25DYWNoZSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uQ2FjaGVbYXV0aC5uYW1lXSA9IGF1dGgucGFzcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzQXV0aGVkKSB7XG4gICAgICAgIHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSA9IHVzZXIuX2lkO1xuICAgICAgICB0b2tlbiA9IG51bGw7XG4gICAgICAgIGFwcF9pZCA9IFwiY3JlYXRvclwiO1xuICAgICAgICBjbGllbnRfaWQgPSBcInBjXCI7XG4gICAgICAgIGxvZ2luVG9rZW5zID0gKHJlZjEgPSB1c2VyLnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnJlc3VtZSkgIT0gbnVsbCA/IHJlZjIubG9naW5Ub2tlbnMgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIGlmIChsb2dpblRva2Vucykge1xuICAgICAgICAgIGFwcF9sb2dpbl90b2tlbiA9IF8uZmluZChsb2dpblRva2VucywgZnVuY3Rpb24odCkge1xuICAgICAgICAgICAgcmV0dXJuIHQuYXBwX2lkID09PSBhcHBfaWQgJiYgdC5jbGllbnRfaWQgPT09IGNsaWVudF9pZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoYXBwX2xvZ2luX3Rva2VuKSB7XG4gICAgICAgICAgICB0b2tlbiA9IGFwcF9sb2dpbl90b2tlbi50b2tlbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICAgIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gICAgICAgICAgdG9rZW4gPSBhdXRoVG9rZW4udG9rZW47XG4gICAgICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbihhdXRoVG9rZW4pO1xuICAgICAgICAgIGhhc2hlZFRva2VuLmFwcF9pZCA9IGFwcF9pZDtcbiAgICAgICAgICBoYXNoZWRUb2tlbi5jbGllbnRfaWQgPSBjbGllbnRfaWQ7XG4gICAgICAgICAgaGFzaGVkVG9rZW4udG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbih1c2VyLl9pZCwgaGFzaGVkVG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgIHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSA9IHRva2VuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXh0KCk7XG4gIH0pLnJ1bigpO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRTZXJ2aWNlTWV0YWRhdGEgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLW1ldGFkYXRhJykuU2VydmljZU1ldGFkYXRhO1xuXHRTZXJ2aWNlRG9jdW1lbnQgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLWRvY3VtZW50JykuU2VydmljZURvY3VtZW50O1xuXHRfTlVNQkVSX1RZUEVTID0gW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIl1cblxuXHRfQk9PTEVBTl9UWVBFUyA9IFtcImJvb2xlYW5cIl1cblxuXHRfREFURVRJTUVfT0ZGU0VUX1RZUEVTID0gWydkYXRldGltZSddXG5cblx0X05BTUVTUEFDRSA9IFwiQ3JlYXRvckVudGl0aWVzXCJcblxuXHRnZXRPYmplY3RzT2RhdGFTY2hlbWEgPSAoc3BhY2VJZCktPlxuXHRcdHNjaGVtYSA9IHt2ZXJzaW9uOiBTdGVlZG9zT0RhdGEuVkVSU0lPTiwgZGF0YVNlcnZpY2VzOiB7c2NoZW1hOiBbXX19XG5cblx0XHRlbnRpdGllc19zY2hlbWEgPSB7fVxuXG5cdFx0ZW50aXRpZXNfc2NoZW1hLm5hbWVzcGFjZSA9IF9OQU1FU1BBQ0VcblxuXHRcdGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlID0gW11cblxuXHRcdGVudGl0aWVzX3NjaGVtYS5hbm5vdGF0aW9ucyA9IFtdXG5cblx0XHRfLmVhY2ggQ3JlYXRvci5Db2xsZWN0aW9ucywgKHZhbHVlLCBrZXksIGxpc3QpLT5cblx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpXG5cdFx0XHRpZiBub3QgX29iamVjdD8uZW5hYmxlX2FwaVxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0IyDkuLvplK5cblx0XHRcdGtleXMgPSBbe3Byb3BlcnR5UmVmOiB7bmFtZTogXCJfaWRcIiwgY29tcHV0ZWRLZXk6IHRydWV9fV1cblxuXHRcdFx0ZW50aXRpZSA9IHtcblx0XHRcdFx0bmFtZTogX29iamVjdC5uYW1lXG5cdFx0XHRcdGtleTprZXlzXG5cdFx0XHR9XG5cblx0XHRcdGtleXMuZm9yRWFjaCAoX2tleSktPlxuXHRcdFx0XHRlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMucHVzaCB7XG5cdFx0XHRcdFx0dGFyZ2V0OiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfb2JqZWN0Lm5hbWUgKyBcIi9cIiArIF9rZXkucHJvcGVydHlSZWYubmFtZSxcblx0XHRcdFx0XHRhbm5vdGF0aW9uOiBbe1xuXHRcdFx0XHRcdFx0XCJ0ZXJtXCI6IFwiT3JnLk9EYXRhLkNvcmUuVjEuQ29tcHV0ZWRcIixcblx0XHRcdFx0XHRcdFwiYm9vbFwiOiBcInRydWVcIlxuXHRcdFx0XHRcdH1dXG5cdFx0XHRcdH1cblxuXHRcdFx0IyBFbnRpdHlUeXBlXG5cdFx0XHRwcm9wZXJ0eSA9IFtdXG5cdFx0XHRwcm9wZXJ0eS5wdXNoIHtuYW1lOiBcIl9pZFwiLCB0eXBlOiBcIkVkbS5TdHJpbmdcIiwgbnVsbGFibGU6IGZhbHNlfVxuXG5cdFx0XHRuYXZpZ2F0aW9uUHJvcGVydHkgPSBbXVxuXG5cdFx0XHRfLmZvckVhY2ggX29iamVjdC5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXG5cdFx0XHRcdF9wcm9wZXJ0eSA9IHtuYW1lOiBmaWVsZF9uYW1lLCB0eXBlOiBcIkVkbS5TdHJpbmdcIn1cblxuXHRcdFx0XHRpZiBfLmNvbnRhaW5zIF9OVU1CRVJfVFlQRVMsIGZpZWxkLnR5cGVcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRvdWJsZVwiXG5cdFx0XHRcdGVsc2UgaWYgXy5jb250YWlucyBfQk9PTEVBTl9UWVBFUywgZmllbGQudHlwZVxuXHRcdFx0XHRcdF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uQm9vbGVhblwiXG5cdFx0XHRcdGVsc2UgaWYgXy5jb250YWlucyBfREFURVRJTUVfT0ZGU0VUX1RZUEVTLCBmaWVsZC50eXBlXG5cdFx0XHRcdFx0X3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5EYXRlVGltZU9mZnNldFwiXG5cdFx0XHRcdFx0X3Byb3BlcnR5LnByZWNpc2lvbiA9IFwiOFwiXG5cblx0XHRcdFx0aWYgZmllbGQucmVxdWlyZWRcblx0XHRcdFx0XHRfcHJvcGVydHkubnVsbGFibGUgPSBmYWxzZVxuXG5cdFx0XHRcdHByb3BlcnR5LnB1c2ggX3Byb3BlcnR5XG5cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvXG5cdFx0XHRcdFx0aWYgIV8uaXNBcnJheShyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBbcmVmZXJlbmNlX3RvXVxuXG5cdFx0XHRcdFx0cmVmZXJlbmNlX3RvLmZvckVhY2ggKHIpLT5cblx0XHRcdFx0XHRcdHJlZmVyZW5jZV9vYmogPSBDcmVhdG9yLmdldE9iamVjdChyLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlX29ialxuXHRcdFx0XHRcdFx0XHRfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWFxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoZmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdF9uYW1lID0gZmllbGRfbmFtZSArIFN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWVcblx0XHRcdFx0XHRcdFx0bmF2aWdhdGlvblByb3BlcnR5LnB1c2gge1xuXHRcdFx0XHRcdFx0XHRcdG5hbWU6IF9uYW1lLFxuXHQjXHRcdFx0XHRcdFx0XHR0eXBlOiBcIkNvbGxlY3Rpb24oXCIgKyBfTkFNRVNQQUNFICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWUgKyBcIilcIixcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBfTkFNRVNQQUNFICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWVcblx0XHRcdFx0XHRcdFx0XHRwYXJ0bmVyOiBfb2JqZWN0Lm5hbWUgI1RPRE9cblx0XHRcdFx0XHRcdFx0XHRfcmVfbmFtZTogcmVmZXJlbmNlX29iai5uYW1lXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbnRpYWxDb25zdHJhaW50OiBbXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5OiBmaWVsZF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VkUHJvcGVydHk6IFwiX2lkXCJcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuIFwicmVmZXJlbmNlIHRvICcje3J9JyBpbnZhbGlkLlwiXG5cblx0XHRcdGVudGl0aWUucHJvcGVydHkgPSBwcm9wZXJ0eVxuXHRcdFx0ZW50aXRpZS5uYXZpZ2F0aW9uUHJvcGVydHkgPSBuYXZpZ2F0aW9uUHJvcGVydHlcblxuXHRcdFx0ZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUucHVzaCBlbnRpdGllXG5cblx0XHRzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoIGVudGl0aWVzX3NjaGVtYVxuXG5cblx0XHRjb250YWluZXJfc2NoZW1hID0ge31cblx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lciA9IHtuYW1lOiBcImNvbnRhaW5lclwifVxuXHRcdGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldCA9IFtdXG5cblx0XHRfLmZvckVhY2ggZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUsIChfZXQsIGspLT5cblx0XHRcdGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldC5wdXNoIHtcblx0XHRcdFx0XCJuYW1lXCI6IF9ldC5uYW1lLFxuXHRcdFx0XHRcImVudGl0eVR5cGVcIjogX05BTUVTUEFDRSArIFwiLlwiICsgX2V0Lm5hbWUsXG5cdFx0XHRcdFwibmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiOiBbXVxuXHRcdFx0fVxuXG5cdFx0IyBUT0RPIFNlcnZpY2VNZXRhZGF0YeS4jeaUr+aMgW5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmflsZ7mgKdcbiNcdFx0Xy5mb3JFYWNoIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLCAoX2V0LCBrKS0+XG4jXHRcdFx0Xy5mb3JFYWNoIF9ldC5uYXZpZ2F0aW9uUHJvcGVydHksIChfZXRfbnAsIG5wX2spLT5cbiNcdFx0XHRcdF9lcyA9IF8uZmluZCBjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQsIChfZXMpLT5cbiNcdFx0XHRcdFx0XHRcdHJldHVybiBfZXMubmFtZSA9PSBfZXRfbnAucGFydG5lclxuI1xuI1x0XHRcdFx0X2VzPy5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLnB1c2gge1wicGF0aFwiOiBfZXRfbnAuX3JlX25hbWUsIFwidGFyZ2V0XCI6IF9ldF9ucC5fcmVfbmFtZX1cbiNcdFx0XHRcdGNvbnNvbGUubG9nKFwiX2VzXCIsIF9lcylcbiNcbiNcdFx0Y29uc29sZS5sb2coXCJjb250YWluZXJfc2NoZW1hXCIsIEpTT04uc3RyaW5naWZ5KGNvbnRhaW5lcl9zY2hlbWEpKVxuXG5cdFx0c2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaCBjb250YWluZXJfc2NoZW1hXG5cblx0XHRyZXR1cm4gc2NoZW1hXG5cblx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCcnLCB7YXV0aFJlcXVpcmVkOiBTdGVlZG9zT0RhdGEuQVVUSFJFUVVJUkVEfSwge1xuXHRcdGdldDogKCktPlxuXHRcdFx0Y29udGV4dCA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoQHVybFBhcmFtcz8uc3BhY2VJZClcblx0XHRcdHNlcnZpY2VEb2N1bWVudCAgPSBTZXJ2aWNlRG9jdW1lbnQucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoQHVybFBhcmFtcz8uc3BhY2VJZCksIHtjb250ZXh0OiBjb250ZXh0fSk7XG5cdFx0XHRib2R5ID0gc2VydmljZURvY3VtZW50LmRvY3VtZW50KClcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuXHRcdFx0XHRcdCdPRGF0YS1WZXJzaW9uJzogU3RlZWRvc09EYXRhLlZFUlNJT05cblx0XHRcdFx0fSxcblx0XHRcdFx0Ym9keTogc2VydmljZURvY3VtZW50LmRvY3VtZW50KClcblx0XHRcdH07XG5cdH0pXG5cblx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKFN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRILCB7YXV0aFJlcXVpcmVkOiBTdGVlZG9zT0RhdGEuQVVUSFJFUVVJUkVEfSwge1xuXHRcdGdldDogKCktPlxuXHRcdFx0c2VydmljZU1ldGFkYXRhID0gU2VydmljZU1ldGFkYXRhLnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKEB1cmxQYXJhbXM/LnNwYWNlSWQpKVxuXHRcdFx0Ym9keSA9IHNlcnZpY2VNZXRhZGF0YS5kb2N1bWVudCgpXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWw7IGNoYXJzZXQ9dXRmLTgnLFxuXHRcdFx0XHRcdCdPRGF0YS1WZXJzaW9uJzogU3RlZWRvc09EYXRhLlZFUlNJT05cblx0XHRcdFx0fSxcblx0XHRcdFx0Ym9keTogYm9keVxuXHRcdFx0fTtcblx0fSkiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIFNlcnZpY2VEb2N1bWVudCwgU2VydmljZU1ldGFkYXRhLCBfQk9PTEVBTl9UWVBFUywgX0RBVEVUSU1FX09GRlNFVF9UWVBFUywgX05BTUVTUEFDRSwgX05VTUJFUl9UWVBFUywgZ2V0T2JqZWN0c09kYXRhU2NoZW1hO1xuICBTZXJ2aWNlTWV0YWRhdGEgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLW1ldGFkYXRhJykuU2VydmljZU1ldGFkYXRhO1xuICBTZXJ2aWNlRG9jdW1lbnQgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLWRvY3VtZW50JykuU2VydmljZURvY3VtZW50O1xuICBfTlVNQkVSX1RZUEVTID0gW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIl07XG4gIF9CT09MRUFOX1RZUEVTID0gW1wiYm9vbGVhblwiXTtcbiAgX0RBVEVUSU1FX09GRlNFVF9UWVBFUyA9IFsnZGF0ZXRpbWUnXTtcbiAgX05BTUVTUEFDRSA9IFwiQ3JlYXRvckVudGl0aWVzXCI7XG4gIGdldE9iamVjdHNPZGF0YVNjaGVtYSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgY29udGFpbmVyX3NjaGVtYSwgZW50aXRpZXNfc2NoZW1hLCBzY2hlbWE7XG4gICAgc2NoZW1hID0ge1xuICAgICAgdmVyc2lvbjogU3RlZWRvc09EYXRhLlZFUlNJT04sXG4gICAgICBkYXRhU2VydmljZXM6IHtcbiAgICAgICAgc2NoZW1hOiBbXVxuICAgICAgfVxuICAgIH07XG4gICAgZW50aXRpZXNfc2NoZW1hID0ge307XG4gICAgZW50aXRpZXNfc2NoZW1hLm5hbWVzcGFjZSA9IF9OQU1FU1BBQ0U7XG4gICAgZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUgPSBbXTtcbiAgICBlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMgPSBbXTtcbiAgICBfLmVhY2goQ3JlYXRvci5Db2xsZWN0aW9ucywgZnVuY3Rpb24odmFsdWUsIGtleSwgbGlzdCkge1xuICAgICAgdmFyIF9vYmplY3QsIGVudGl0aWUsIGtleXMsIG5hdmlnYXRpb25Qcm9wZXJ0eSwgcHJvcGVydHk7XG4gICAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKTtcbiAgICAgIGlmICghKF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZW5hYmxlX2FwaSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAga2V5cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3BlcnR5UmVmOiB7XG4gICAgICAgICAgICBuYW1lOiBcIl9pZFwiLFxuICAgICAgICAgICAgY29tcHV0ZWRLZXk6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBlbnRpdGllID0ge1xuICAgICAgICBuYW1lOiBfb2JqZWN0Lm5hbWUsXG4gICAgICAgIGtleToga2V5c1xuICAgICAgfTtcbiAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihfa2V5KSB7XG4gICAgICAgIHJldHVybiBlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMucHVzaCh7XG4gICAgICAgICAgdGFyZ2V0OiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfb2JqZWN0Lm5hbWUgKyBcIi9cIiArIF9rZXkucHJvcGVydHlSZWYubmFtZSxcbiAgICAgICAgICBhbm5vdGF0aW9uOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGVybVwiOiBcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbXB1dGVkXCIsXG4gICAgICAgICAgICAgIFwiYm9vbFwiOiBcInRydWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHByb3BlcnR5ID0gW107XG4gICAgICBwcm9wZXJ0eS5wdXNoKHtcbiAgICAgICAgbmFtZTogXCJfaWRcIixcbiAgICAgICAgdHlwZTogXCJFZG0uU3RyaW5nXCIsXG4gICAgICAgIG51bGxhYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBuYXZpZ2F0aW9uUHJvcGVydHkgPSBbXTtcbiAgICAgIF8uZm9yRWFjaChfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgICAgdmFyIF9wcm9wZXJ0eSwgcmVmZXJlbmNlX3RvO1xuICAgICAgICBfcHJvcGVydHkgPSB7XG4gICAgICAgICAgbmFtZTogZmllbGRfbmFtZSxcbiAgICAgICAgICB0eXBlOiBcIkVkbS5TdHJpbmdcIlxuICAgICAgICB9O1xuICAgICAgICBpZiAoXy5jb250YWlucyhfTlVNQkVSX1RZUEVTLCBmaWVsZC50eXBlKSkge1xuICAgICAgICAgIF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRG91YmxlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5jb250YWlucyhfQk9PTEVBTl9UWVBFUywgZmllbGQudHlwZSkpIHtcbiAgICAgICAgICBfcHJvcGVydHkudHlwZSA9IFwiRWRtLkJvb2xlYW5cIjtcbiAgICAgICAgfSBlbHNlIGlmIChfLmNvbnRhaW5zKF9EQVRFVElNRV9PRkZTRVRfVFlQRVMsIGZpZWxkLnR5cGUpKSB7XG4gICAgICAgICAgX3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5EYXRlVGltZU9mZnNldFwiO1xuICAgICAgICAgIF9wcm9wZXJ0eS5wcmVjaXNpb24gPSBcIjhcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVxdWlyZWQpIHtcbiAgICAgICAgICBfcHJvcGVydHkubnVsbGFibGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9wZXJ0eS5wdXNoKF9wcm9wZXJ0eSk7XG4gICAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgaWYgKHJlZmVyZW5jZV90bykge1xuICAgICAgICAgIGlmICghXy5pc0FycmF5KHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IFtyZWZlcmVuY2VfdG9dO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlX3RvLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgdmFyIF9uYW1lLCByZWZlcmVuY2Vfb2JqO1xuICAgICAgICAgICAgcmVmZXJlbmNlX29iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHIsIHNwYWNlSWQpO1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZV9vYmopIHtcbiAgICAgICAgICAgICAgX25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVg7XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9uYW1lID0gZmllbGRfbmFtZSArIFN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRpb25Qcm9wZXJ0eS5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBfbmFtZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBfTkFNRVNQQUNFICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWUsXG4gICAgICAgICAgICAgICAgcGFydG5lcjogX29iamVjdC5uYW1lLFxuICAgICAgICAgICAgICAgIF9yZV9uYW1lOiByZWZlcmVuY2Vfb2JqLm5hbWUsXG4gICAgICAgICAgICAgICAgcmVmZXJlbnRpYWxDb25zdHJhaW50OiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBmaWVsZF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2VkUHJvcGVydHk6IFwiX2lkXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihcInJlZmVyZW5jZSB0byAnXCIgKyByICsgXCInIGludmFsaWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGVudGl0aWUucHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgICAgIGVudGl0aWUubmF2aWdhdGlvblByb3BlcnR5ID0gbmF2aWdhdGlvblByb3BlcnR5O1xuICAgICAgcmV0dXJuIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLnB1c2goZW50aXRpZSk7XG4gICAgfSk7XG4gICAgc2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaChlbnRpdGllc19zY2hlbWEpO1xuICAgIGNvbnRhaW5lcl9zY2hlbWEgPSB7fTtcbiAgICBjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lciA9IHtcbiAgICAgIG5hbWU6IFwiY29udGFpbmVyXCJcbiAgICB9O1xuICAgIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldCA9IFtdO1xuICAgIF8uZm9yRWFjaChlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgZnVuY3Rpb24oX2V0LCBrKSB7XG4gICAgICByZXR1cm4gY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LnB1c2goe1xuICAgICAgICBcIm5hbWVcIjogX2V0Lm5hbWUsXG4gICAgICAgIFwiZW50aXR5VHlwZVwiOiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfZXQubmFtZSxcbiAgICAgICAgXCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nXCI6IFtdXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoKGNvbnRhaW5lcl9zY2hlbWEpO1xuICAgIHJldHVybiBzY2hlbWE7XG4gIH07XG4gIFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnJywge1xuICAgIGF1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRFxuICB9LCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib2R5LCBjb250ZXh0LCByZWYsIHJlZjEsIHNlcnZpY2VEb2N1bWVudDtcbiAgICAgIGNvbnRleHQgPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKChyZWYgPSB0aGlzLnVybFBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwKTtcbiAgICAgIHNlcnZpY2VEb2N1bWVudCA9IFNlcnZpY2VEb2N1bWVudC5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYSgocmVmMSA9IHRoaXMudXJsUGFyYW1zKSAhPSBudWxsID8gcmVmMS5zcGFjZUlkIDogdm9pZCAwKSwge1xuICAgICAgICBjb250ZXh0OiBjb250ZXh0XG4gICAgICB9KTtcbiAgICAgIGJvZHkgPSBzZXJ2aWNlRG9jdW1lbnQuZG9jdW1lbnQoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICdPRGF0YS1WZXJzaW9uJzogU3RlZWRvc09EYXRhLlZFUlNJT05cbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogc2VydmljZURvY3VtZW50LmRvY3VtZW50KClcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZShTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCwge1xuICAgIGF1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRFxuICB9LCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib2R5LCByZWYsIHNlcnZpY2VNZXRhZGF0YTtcbiAgICAgIHNlcnZpY2VNZXRhZGF0YSA9IFNlcnZpY2VNZXRhZGF0YS5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYSgocmVmID0gdGhpcy51cmxQYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgICAgYm9keSA9IHNlcnZpY2VNZXRhZGF0YS5kb2N1bWVudCgpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IGJvZHlcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiQFN0ZWVkb3NPRGF0YSA9IHt9XG5TdGVlZG9zT0RhdGEuVkVSU0lPTiA9ICc0LjAnXG5TdGVlZG9zT0RhdGEuQVVUSFJFUVVJUkVEID0gdHJ1ZVxuU3RlZWRvc09EYXRhLkFQSV9QQVRIID0gJy9hcGkvb2RhdGEvdjQvOnNwYWNlSWQnXG5TdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCA9ICckbWV0YWRhdGEnXG5TdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCA9IFwiX2V4cGFuZFwiXG5TdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGggPSAoc3BhY2VJZCktPlxuXHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKCdhcGkvb2RhdGEvdjQvJyArIHNwYWNlSWQpXG5cblN0ZWVkb3NPRGF0YS5nZXRPRGF0YVBhdGggPSAoc3BhY2VJZCxvYmplY3RfbmFtZSktPlxuXHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgXCIvI3tvYmplY3RfbmFtZX1cIlxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0U3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aCA9IChzcGFjZUlkKS0+XG5cdFx0cmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIFwiLyN7U3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEh9XCJcblxuXHRTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aCA9IChzcGFjZUlkLCBvYmplY3RfbmFtZSktPlxuXHRcdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKHNwYWNlSWQpICsgXCIjI3tvYmplY3RfbmFtZX1cIlxuXHRTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGggPSAoc3BhY2VJZCxvYmplY3RfbmFtZSktPlxuXHRcdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je29iamVjdF9uYW1lfVwiXG5cblxuXHRAU3RlZWRvc09kYXRhQVBJID0gbmV3IE9kYXRhUmVzdGl2dXNcblx0XHRhcGlQYXRoOiBTdGVlZG9zT0RhdGEuQVBJX1BBVEgsXG5cdFx0dXNlRGVmYXVsdEF1dGg6IHRydWVcblx0XHRwcmV0dHlKc29uOiB0cnVlXG5cdFx0ZW5hYmxlQ29yczogdHJ1ZVxuXHRcdGRlZmF1bHRIZWFkZXJzOlxuXHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuIiwidGhpcy5TdGVlZG9zT0RhdGEgPSB7fTtcblxuU3RlZWRvc09EYXRhLlZFUlNJT04gPSAnNC4wJztcblxuU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRCA9IHRydWU7XG5cblN0ZWVkb3NPRGF0YS5BUElfUEFUSCA9ICcvYXBpL29kYXRhL3Y0LzpzcGFjZUlkJztcblxuU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEggPSAnJG1ldGFkYXRhJztcblxuU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVggPSBcIl9leHBhbmRcIjtcblxuU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKCdhcGkvb2RhdGEvdjQvJyArIHNwYWNlSWQpO1xufTtcblxuU3RlZWRvc09EYXRhLmdldE9EYXRhUGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQsIG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyAoXCIvXCIgKyBvYmplY3RfbmFtZSk7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGggPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIChcIi9cIiArIFN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIKTtcbiAgfTtcbiAgU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGggPSBmdW5jdGlvbihzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKHNwYWNlSWQpICsgKFwiI1wiICsgb2JqZWN0X25hbWUpO1xuICB9O1xuICBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGggPSBmdW5jdGlvbihzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyAoXCIvXCIgKyBvYmplY3RfbmFtZSk7XG4gIH07XG4gIHRoaXMuU3RlZWRvc09kYXRhQVBJID0gbmV3IE9kYXRhUmVzdGl2dXMoe1xuICAgIGFwaVBhdGg6IFN0ZWVkb3NPRGF0YS5BUElfUEFUSCxcbiAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgICBwcmV0dHlKc29uOiB0cnVlLFxuICAgIGVuYWJsZUNvcnM6IHRydWUsXG4gICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9XG4gIH0pO1xufVxuIl19
