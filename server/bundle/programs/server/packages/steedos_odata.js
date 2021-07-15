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

    if (space && Steedos.hasFeature('paid', space != null ? space._id : void 0) && _.indexOf(space.admins, su.user) >= 0) {
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

          if (space && Steedos.hasFeature('paid', space._id) && _.indexOf(space.admins, auth.userId) >= 0) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL29iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21pZGRsZXdhcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWlkZGxld2FyZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsImNvb2tpZXMiLCJnZXRVc2VyUXVlcnlTZWxlY3RvciIsInVzZXJWYWxpZGF0b3IiLCJBdXRoIiwiTWF0Y2giLCJXaGVyZSIsInVzZXIiLCJjaGVjayIsImlkIiwiT3B0aW9uYWwiLCJTdHJpbmciLCJ1c2VybmFtZSIsImVtYWlsIiwiXyIsImtleXMiLCJsZW5ndGgiLCJFcnJvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicGFzc3dvcmQiLCJhdXRoVG9rZW4iLCJhdXRoZW50aWNhdGluZ1VzZXIiLCJhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciIsImhhc2hlZFRva2VuIiwicGFzc3dvcmRWZXJpZmljYXRpb24iLCJyZWYiLCJzcGFjZV91c2VycyIsInNwYWNlcyIsIk1ldGVvciIsInVzZXJzIiwiZmluZE9uZSIsInNlcnZpY2VzIiwiQWNjb3VudHMiLCJfY2hlY2tQYXNzd29yZCIsImVycm9yIiwiX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4iLCJfaGFzaFN0YW1wZWRUb2tlbiIsIl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIiwiX2lkIiwiZGIiLCJmaW5kIiwiZmV0Y2giLCJlYWNoIiwic3UiLCJzcGFjZSIsIlN0ZWVkb3MiLCJoYXNGZWF0dXJlIiwiaW5kZXhPZiIsImFkbWlucyIsInB1c2giLCJuYW1lIiwidG9rZW4iLCJ1c2VySWQiLCJhZG1pblNwYWNlcyIsImVudiIsInByb2Nlc3MiLCJOT0RFX0VOViIsImlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlIiwiZXJyIiwicmVxIiwicmVzIiwic3RhdHVzQ29kZSIsInN0YXR1cyIsIm1zZyIsInN0YWNrIiwidG9TdHJpbmciLCJjb25zb2xlIiwiaGVhZGVyc1NlbnQiLCJzb2NrZXQiLCJkZXN0cm95Iiwic2V0SGVhZGVyIiwiQnVmZmVyIiwiYnl0ZUxlbmd0aCIsIm1ldGhvZCIsImVuZCIsInNoYXJlIiwiUm91dGUiLCJhcGkiLCJwYXRoIiwib3B0aW9ucyIsImVuZHBvaW50czEiLCJlbmRwb2ludHMiLCJwcm90b3R5cGUiLCJhZGRUb0FwaSIsImF2YWlsYWJsZU1ldGhvZHMiLCJhbGxvd2VkTWV0aG9kcyIsImZ1bGxQYXRoIiwicmVqZWN0ZWRNZXRob2RzIiwic2VsZiIsImNvbnRhaW5zIiwiX2NvbmZpZyIsInBhdGhzIiwiZXh0ZW5kIiwiZGVmYXVsdE9wdGlvbnNFbmRwb2ludCIsIl9yZXNvbHZlRW5kcG9pbnRzIiwiX2NvbmZpZ3VyZUVuZHBvaW50cyIsImZpbHRlciIsInJlamVjdCIsImFwaVBhdGgiLCJlbmRwb2ludCIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJkb25lRnVuYyIsImVuZHBvaW50Q29udGV4dCIsInJlc3BvbnNlRGF0YSIsInJlc3BvbnNlSW5pdGlhdGVkIiwidXJsUGFyYW1zIiwicGFyYW1zIiwicXVlcnlQYXJhbXMiLCJxdWVyeSIsImJvZHlQYXJhbXMiLCJib2R5IiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZG9uZSIsIl9jYWxsRW5kcG9pbnQiLCJlcnJvcjEiLCJoZWFkZXJzIiwiX3Jlc3BvbmQiLCJtZXNzYWdlIiwiam9pbiIsInRvVXBwZXJDYXNlIiwiaXNGdW5jdGlvbiIsImFjdGlvbiIsInJlZjEiLCJyZWYyIiwicm9sZVJlcXVpcmVkIiwidW5pb24iLCJpc0VtcHR5IiwiYXV0aFJlcXVpcmVkIiwic3BhY2VSZXF1aXJlZCIsImludm9jYXRpb24iLCJfYXV0aEFjY2VwdGVkIiwiX3JvbGVBY2NlcHRlZCIsIl9zcGFjZUFjY2VwdGVkIiwiRERQQ29tbW9uIiwiTWV0aG9kSW52b2NhdGlvbiIsImlzU2ltdWxhdGlvbiIsImNvbm5lY3Rpb24iLCJyYW5kb21TZWVkIiwibWFrZVJwY1NlZWQiLCJERFAiLCJfQ3VycmVudEludm9jYXRpb24iLCJ3aXRoVmFsdWUiLCJjYWxsIiwiX2F1dGhlbnRpY2F0ZSIsImF1dGgiLCJ1c2VyU2VsZWN0b3IiLCJzcGFjZV91c2Vyc19jb3VudCIsInNwYWNlSWQiLCJjb3VudCIsImludGVyc2VjdGlvbiIsInJvbGVzIiwiZGVmYXVsdEhlYWRlcnMiLCJkZWxheUluTWlsbGlzZWNvbmRzIiwibWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMiLCJyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byIsInNlbmRSZXNwb25zZSIsIl9sb3dlckNhc2VLZXlzIiwibWF0Y2giLCJwcmV0dHlKc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlSGVhZCIsIndyaXRlIiwiTWF0aCIsInJhbmRvbSIsInNldFRpbWVvdXQiLCJvYmplY3QiLCJjaGFpbiIsInBhaXJzIiwibWFwIiwiYXR0ciIsInRvTG93ZXJDYXNlIiwidmFsdWUiLCJDb29raWVzIiwiT2RhdGFSZXN0aXZ1cyIsImJhc2ljQXV0aCIsIml0ZW0iLCJpIiwibCIsImNvcnNIZWFkZXJzIiwiX3JvdXRlcyIsInVzZURlZmF1bHRBdXRoIiwidmVyc2lvbiIsIl91c2VyIiwiZ2V0IiwiX2hhc2hMb2dpblRva2VuIiwiZW5hYmxlQ29ycyIsInNsaWNlIiwibGFzdCIsIl9pbml0QXV0aCIsInVzZUF1dGgiLCJ3YXJuIiwiYWRkUm91dGUiLCJyb3V0ZSIsImFkZENvbGxlY3Rpb24iLCJjb2xsZWN0aW9uIiwiY29sbGVjdGlvbkVuZHBvaW50cyIsImNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyIsImVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiIsImVudGl0eVJvdXRlRW5kcG9pbnRzIiwiZXhjbHVkZWRFbmRwb2ludHMiLCJtZXRob2RzIiwibWV0aG9kc09uQ29sbGVjdGlvbiIsInJvdXRlT3B0aW9ucyIsIl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyIsIl9jb2xsZWN0aW9uRW5kcG9pbnRzIiwiX25hbWUiLCJjb25maWd1cmVkRW5kcG9pbnQiLCJlbmRwb2ludE9wdGlvbnMiLCJtZXRob2RUeXBlIiwiY2xvbmUiLCJlbnRpdHkiLCJzZWxlY3RvciIsImRhdGEiLCJwdXQiLCJlbnRpdHlJc1VwZGF0ZWQiLCJ1cGRhdGUiLCIkc2V0IiwicmVtb3ZlIiwicG9zdCIsImVudGl0eUlkIiwiaW5zZXJ0IiwiZ2V0QWxsIiwiZW50aXRpZXMiLCJmaWVsZHMiLCJwcm9maWxlIiwiY3JlYXRlVXNlciIsImxvZ291dCIsImUiLCJleHRyYURhdGEiLCJzZWFyY2hRdWVyeSIsInJlYXNvbiIsIm9uTG9nZ2VkSW4iLCJleHRyYSIsImluZGV4IiwidG9rZW5GaWVsZE5hbWUiLCJ0b2tlbkxvY2F0aW9uIiwidG9rZW5QYXRoIiwidG9rZW5SZW1vdmFsUXVlcnkiLCJ0b2tlblRvUmVtb3ZlIiwibGFzdEluZGV4T2YiLCJzdWJzdHJpbmciLCIkcHVsbCIsIm9uTG9nZ2VkT3V0Iiwic3RhcnR1cCIsImdldE9iamVjdCIsImdldE9iamVjdHMiLCJvYmplY3RfbmFtZXMiLCJzcGxpdCIsImZvckVhY2giLCJvYmplY3RfbmFtZSIsIm9iamVjdF9wZXJtaXNzaW9ucyIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQ3VycmVudCIsInBzZXRzVXNlciIsIkNyZWF0b3IiLCJPYmplY3RzIiwiZ2V0T2JqZWN0TmFtZSIsImdldENvbGxlY3Rpb24iLCJhc3NpZ25lZF9hcHBzIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJiaW5kIiwibGlzdF92aWV3cyIsInBlcm1pc3Npb25fc2V0IiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJhbGxvd0NyZWF0ZSIsIm1vZGlmeUFsbFJlY29yZHMiLCJmaWVsZCIsImtleSIsIl9maWVsZCIsInVuZWRpdGFibGVfZmllbGRzIiwicmVhZG9ubHkiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsIlN0ZWVkb3NPRGF0YSIsIkFQSV9QQVRIIiwibmV4dCIsIl9vYmoiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJNZXRlb3JPRGF0YUFQSVY0Um91dGVyIiwiTWV0ZW9yT0RhdGFSb3V0ZXIiLCJPRGF0YVJvdXRlciIsImFwcCIsImV4cHJlc3MiLCJ1c2UiLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJzdGVlZG9zU2NoZW1hIiwiZ2V0RGF0YVNvdXJjZXMiLCJkYXRhc291cmNlIiwib3RoZXJBcHAiLCJGaWJlciIsImF1dGhvcml6YXRpb25DYWNoZSIsIk1pZGRsZXdhcmUiLCJhcHBfaWQiLCJhcHBfbG9naW5fdG9rZW4iLCJjbGllbnRfaWQiLCJpc0F1dGhlZCIsImxvZ2luVG9rZW5zIiwicmVzdWx0IiwiYWNjZXNzX3Rva2VuIiwibG9nIiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwicGFyc2UiLCJwYXNzIiwicmVzdW1lIiwidCIsInJ1biIsIlNlcnZpY2VEb2N1bWVudCIsIlNlcnZpY2VNZXRhZGF0YSIsIl9CT09MRUFOX1RZUEVTIiwiX0RBVEVUSU1FX09GRlNFVF9UWVBFUyIsIl9OQU1FU1BBQ0UiLCJfTlVNQkVSX1RZUEVTIiwiZ2V0T2JqZWN0c09kYXRhU2NoZW1hIiwiY29udGFpbmVyX3NjaGVtYSIsImVudGl0aWVzX3NjaGVtYSIsInNjaGVtYSIsIlZFUlNJT04iLCJkYXRhU2VydmljZXMiLCJuYW1lc3BhY2UiLCJlbnRpdHlUeXBlIiwiYW5ub3RhdGlvbnMiLCJDb2xsZWN0aW9ucyIsImxpc3QiLCJfb2JqZWN0IiwiZW50aXRpZSIsIm5hdmlnYXRpb25Qcm9wZXJ0eSIsInByb3BlcnR5IiwiZW5hYmxlX2FwaSIsInByb3BlcnR5UmVmIiwiY29tcHV0ZWRLZXkiLCJfa2V5IiwidGFyZ2V0IiwiYW5ub3RhdGlvbiIsInR5cGUiLCJudWxsYWJsZSIsImZpZWxkX25hbWUiLCJfcHJvcGVydHkiLCJyZWZlcmVuY2VfdG8iLCJwcmVjaXNpb24iLCJyZXF1aXJlZCIsImlzQXJyYXkiLCJyIiwicmVmZXJlbmNlX29iaiIsIkVYUEFORF9GSUVMRF9TVUZGSVgiLCJwYXJ0bmVyIiwiX3JlX25hbWUiLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCJyZWZlcmVuY2VkUHJvcGVydHkiLCJlbnRpdHlDb250YWluZXIiLCJlbnRpdHlTZXQiLCJfZXQiLCJrIiwiU3RlZWRvc09kYXRhQVBJIiwiQVVUSFJFUVVJUkVEIiwiY29udGV4dCIsInNlcnZpY2VEb2N1bWVudCIsImdldE1ldGFEYXRhUGF0aCIsInByb2Nlc3NNZXRhZGF0YUpzb24iLCJkb2N1bWVudCIsIk1FVEFEQVRBX1BBVEgiLCJzZXJ2aWNlTWV0YWRhdGEiLCJnZXRSb290UGF0aCIsImFic29sdXRlVXJsIiwiZ2V0T0RhdGFQYXRoIiwiaXNTZXJ2ZXIiLCJnZXRPRGF0YUNvbnRleHRQYXRoIiwiZ2V0T0RhdGFOZXh0TGlua1BhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUFyQjtBQUNBQyxPQUFPLENBQUMseUJBQUQsQ0FBUDs7QUFHQUosZ0JBQWdCLENBQUM7QUFDaEIsZ0JBQWMsUUFERTtBQUVoQiwrQkFBNkIsUUFGYjtBQUdoQiwrQkFBNkIsUUFIYjtBQUloQkssU0FBTyxFQUFFO0FBSk8sQ0FBRCxFQUtiLGVBTGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7O0FDSkEsSUFBQUMsb0JBQUEsRUFBQUMsYUFBQTtBQUFBLEtBQUNDLElBQUQsVUFBQ0EsSUFBRCxHQUFVLEVBQVYsRSxDQUVBOzs7QUFHQUQsZ0JBQWdCRSxNQUFNQyxLQUFOLENBQVksVUFBQ0MsSUFBRDtBQUMzQkMsUUFBTUQsSUFBTixFQUNDO0FBQUFFLFFBQUlKLE1BQU1LLFFBQU4sQ0FBZUMsTUFBZixDQUFKO0FBQ0FDLGNBQVVQ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QUEyQixVQUFDN04sT0FBRDtBQUMxQixTQUFPekgsT0FBT3VWLFdBQVAsQ0FBbUIsa0JBQWtCOU4sT0FBckMsQ0FBUDtBQUQwQixDQUEzQjs7QUFHQWlJLGFBQWE4RixZQUFiLEdBQTRCLFVBQUMvTixPQUFELEVBQVN1RyxXQUFUO0FBQzNCLFNBQU8wQixhQUFhNEYsV0FBYixDQUF5QjdOLE9BQXpCLEtBQW9DLE1BQUl1RyxXQUF4QyxDQUFQO0FBRDJCLENBQTVCOztBQUdBLElBQUdoTyxPQUFPeVYsUUFBVjtBQUNDL0YsZUFBYXVGLGVBQWIsR0FBK0IsVUFBQ3hOLE9BQUQ7QUFDOUIsV0FBT2lJLGFBQWE0RixXQUFiLENBQXlCN04sT0FBekIsS0FBb0MsTUFBSWlJLGFBQWEwRixhQUFyRCxDQUFQO0FBRDhCLEdBQS9COztBQUdBMUYsZUFBYWdHLG1CQUFiLEdBQW1DLFVBQUNqTyxPQUFELEVBQVV1RyxXQUFWO0FBQ2xDLFdBQU8wQixhQUFhdUYsZUFBYixDQUE2QnhOLE9BQTdCLEtBQXdDLE1BQUl1RyxXQUE1QyxDQUFQO0FBRGtDLEdBQW5DOztBQUVBMEIsZUFBYWlHLG9CQUFiLEdBQW9DLFVBQUNsTyxPQUFELEVBQVN1RyxXQUFUO0FBQ25DLFdBQU8wQixhQUFhNEYsV0FBYixDQUF5QjdOLE9BQXpCLEtBQW9DLE1BQUl1RyxXQUF4QyxDQUFQO0FBRG1DLEdBQXBDOztBQUlBLE9BQUM2RyxlQUFELEdBQW1CLElBQUl6TCxhQUFKLENBQ2xCO0FBQUE5RSxhQUFTb0wsYUFBYUMsUUFBdEI7QUFDQWhHLG9CQUFnQixJQURoQjtBQUVBdkIsZ0JBQVksSUFGWjtBQUdBNEIsZ0JBQVksSUFIWjtBQUlBbkMsb0JBQ0M7QUFBQSxzQkFBZ0I7QUFBaEI7QUFMRCxHQURrQixDQUFuQjtBQ2lCQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZml4IHdhcm5pbmc6IHh4eCBub3QgaW5zdGFsbGVkXHJcbnJlcXVpcmUoXCJiYXNpYy1hdXRoL3BhY2thZ2UuanNvblwiKTtcclxuXHJcbmltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0J2Jhc2ljLWF1dGgnOiAnXjIuMC4xJyxcclxuXHQnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YSc6IFwiXjAuMS42XCIsXHJcblx0XCJvZGF0YS12NC1zZXJ2aWNlLWRvY3VtZW50XCI6IFwiXjAuMC4zXCIsXHJcblx0Y29va2llczogXCJeMC42LjFcIixcclxufSwgJ3N0ZWVkb3M6b2RhdGEnKTtcclxuIiwiQEF1dGggb3I9IHt9XHJcblxyXG4jIyNcclxuXHRBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXHJcbiMjI1xyXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUgKHVzZXIpIC0+XHJcblx0Y2hlY2sgdXNlcixcclxuXHRcdGlkOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuXHRcdHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuXHRcdGVtYWlsOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuXHJcblx0aWYgXy5rZXlzKHVzZXIpLmxlbmd0aCBpcyBub3QgMVxyXG5cdFx0dGhyb3cgbmV3IE1hdGNoLkVycm9yICdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJ1xyXG5cclxuXHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHJcbiMjI1xyXG5cdFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcclxuIyMjXHJcbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gKHVzZXIpIC0+XHJcblx0aWYgdXNlci5pZFxyXG5cdFx0cmV0dXJuIHsnX2lkJzogdXNlci5pZH1cclxuXHRlbHNlIGlmIHVzZXIudXNlcm5hbWVcclxuXHRcdHJldHVybiB7J3VzZXJuYW1lJzogdXNlci51c2VybmFtZX1cclxuXHRlbHNlIGlmIHVzZXIuZW1haWxcclxuXHRcdHJldHVybiB7J2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbH1cclxuXHJcblx0IyBXZSBzaG91bGRuJ3QgYmUgaGVyZSBpZiB0aGUgdXNlciBvYmplY3Qgd2FzIHByb3Blcmx5IHZhbGlkYXRlZFxyXG5cdHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcidcclxuXHJcblxyXG4jIyNcclxuXHRMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcclxuIyMjXHJcbkBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gKHVzZXIsIHBhc3N3b3JkKSAtPlxyXG5cdGlmIG5vdCB1c2VyIG9yIG5vdCBwYXNzd29yZFxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG5cdCMgVmFsaWRhdGUgdGhlIGxvZ2luIGlucHV0IHR5cGVzXHJcblx0Y2hlY2sgdXNlciwgdXNlclZhbGlkYXRvclxyXG5cdGNoZWNrIHBhc3N3b3JkLCBTdHJpbmdcclxuXHJcblx0IyBSZXRyaWV2ZSB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxyXG5cdGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcilcclxuXHRhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvcilcclxuXHJcblx0aWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlclxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblx0aWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcz8ucGFzc3dvcmRcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuXHQjIEF1dGhlbnRpY2F0ZSB0aGUgdXNlcidzIHBhc3N3b3JkXHJcblx0cGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCBhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkXHJcblx0aWYgcGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3JcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuXHQjIEFkZCBhIG5ldyBhdXRoIHRva2VuIHRvIHRoZSB1c2VyJ3MgYWNjb3VudFxyXG5cdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcclxuXHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxyXG5cdEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuXHJcblxyXG5cdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZH0pLmZldGNoKClcclxuXHRzcGFjZXMgPSBbXVxyXG5cdF8uZWFjaCBzcGFjZV91c2VycywgKHN1KS0+XHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKVxyXG5cdFx0IyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXHJcblx0XHRpZiBzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZT8uX2lkKSBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcik+PTBcclxuXHRcdFx0c3BhY2VzLnB1c2hcclxuXHRcdFx0XHRfaWQ6IHNwYWNlLl9pZFxyXG5cdFx0XHRcdG5hbWU6IHNwYWNlLm5hbWVcclxuXHRyZXR1cm4ge2F1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLCB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGFkbWluU3BhY2VzOiBzcGFjZXN9XHJcbiIsInZhciBnZXRVc2VyUXVlcnlTZWxlY3RvciwgdXNlclZhbGlkYXRvcjtcblxudGhpcy5BdXRoIHx8ICh0aGlzLkF1dGggPSB7fSk7XG5cblxuLypcblx0QSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuICovXG5cbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbih1c2VyKSB7XG4gIGNoZWNrKHVzZXIsIHtcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKVxuICB9KTtcbiAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggPT09ICExKSB7XG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKCdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuXG4vKlxuXHRSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4gKi9cblxuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSBmdW5jdGlvbih1c2VyKSB7XG4gIGlmICh1c2VyLmlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdfaWQnOiB1c2VyLmlkXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWVcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIuZW1haWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJyk7XG59O1xuXG5cbi8qXG5cdExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuICovXG5cbnRoaXMuQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3N3b3JkKSB7XG4gIHZhciBhdXRoVG9rZW4sIGF1dGhlbnRpY2F0aW5nVXNlciwgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IsIGhhc2hlZFRva2VuLCBwYXNzd29yZFZlcmlmaWNhdGlvbiwgcmVmLCBzcGFjZV91c2Vycywgc3BhY2VzO1xuICBpZiAoIXVzZXIgfHwgIXBhc3N3b3JkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBjaGVjayh1c2VyLCB1c2VyVmFsaWRhdG9yKTtcbiAgY2hlY2socGFzc3dvcmQsIFN0cmluZyk7XG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcik7XG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKTtcbiAgaWYgKCFhdXRoZW50aWNhdGluZ1VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGlmICghKChyZWYgPSBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXMpICE9IG51bGwgPyByZWYucGFzc3dvcmQgOiB2b2lkIDApKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmQpO1xuICBpZiAocGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4oYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW4pO1xuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWRcbiAgfSkuZmV0Y2goKTtcbiAgc3BhY2VzID0gW107XG4gIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24oc3UpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSk7XG4gICAgaWYgKHNwYWNlICYmIFN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlICE9IG51bGwgPyBzcGFjZS5faWQgOiB2b2lkIDApICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpID49IDApIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh7XG4gICAgICAgIF9pZDogc3BhY2UuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGF1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLFxuICAgIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCxcbiAgICBhZG1pblNwYWNlczogc3BhY2VzXG4gIH07XG59O1xuIiwiLy8gV2UgbmVlZCBhIGZ1bmN0aW9uIHRoYXQgdHJlYXRzIHRocm93biBlcnJvcnMgZXhhY3RseSBsaWtlIElyb24gUm91dGVyIHdvdWxkLlxyXG4vLyBUaGlzIGZpbGUgaXMgd3JpdHRlbiBpbiBKYXZhU2NyaXB0IHRvIGVuYWJsZSBjb3B5LXBhc3RpbmcgSXJvbiBSb3V0ZXIgY29kZS5cclxuXHJcbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDNcclxudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XHJcblxyXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0w0N1xyXG5pcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSA9IGZ1bmN0aW9uKGVyciwgcmVxLCByZXMpIHtcclxuXHRpZiAocmVzLnN0YXR1c0NvZGUgPCA0MDApXHJcblx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcclxuXHJcblx0aWYgKGVyci5zdGF0dXMpXHJcblx0XHRyZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XHJcblxyXG5cdGlmIChlbnYgPT09ICdkZXZlbG9wbWVudCcpXHJcblx0XHRtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xyXG5cdGVsc2VcclxuXHQvL1hYWCBnZXQgdGhpcyBmcm9tIHN0YW5kYXJkIGRpY3Qgb2YgZXJyb3IgbWVzc2FnZXM/XHJcblx0XHRtc2cgPSAnU2VydmVyIGVycm9yLic7XHJcblxyXG5cdGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKTtcclxuXHJcblx0aWYgKHJlcy5oZWFkZXJzU2VudClcclxuXHRcdHJldHVybiByZXEuc29ja2V0LmRlc3Ryb3koKTtcclxuXHJcblx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xyXG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgQnVmZmVyLmJ5dGVMZW5ndGgobXNnKSk7XHJcblx0aWYgKHJlcS5tZXRob2QgPT09ICdIRUFEJylcclxuXHRcdHJldHVybiByZXMuZW5kKCk7XHJcblx0cmVzLmVuZChtc2cpO1xyXG5cdHJldHVybjtcclxufVxyXG4iLCJjbGFzcyBzaGFyZS5Sb3V0ZVxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBhcGksIEBwYXRoLCBAb3B0aW9ucywgQGVuZHBvaW50cykgLT5cclxuXHRcdCMgQ2hlY2sgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkXHJcblx0XHRpZiBub3QgQGVuZHBvaW50c1xyXG5cdFx0XHRAZW5kcG9pbnRzID0gQG9wdGlvbnNcclxuXHRcdFx0QG9wdGlvbnMgPSB7fVxyXG5cclxuXHJcblx0YWRkVG9BcGk6IGRvIC0+XHJcblx0XHRhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXVxyXG5cclxuXHRcdHJldHVybiAtPlxyXG5cdFx0XHRzZWxmID0gdGhpc1xyXG5cclxuXHRcdFx0IyBUaHJvdyBhbiBlcnJvciBpZiBhIHJvdXRlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgYXQgdGhpcyBwYXRoXHJcblx0XHRcdCMgVE9ETzogQ2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aCBwYXRocyB0aGF0IGZvbGxvdyBzYW1lIHBhdHRlcm4gd2l0aCBkaWZmZXJlbnQgcGFyYW1ldGVyIG5hbWVzXHJcblx0XHRcdGlmIF8uY29udGFpbnMgQGFwaS5fY29uZmlnLnBhdGhzLCBAcGF0aFxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiAje0BwYXRofVwiXHJcblxyXG5cdFx0XHQjIE92ZXJyaWRlIHRoZSBkZWZhdWx0IE9QVElPTlMgZW5kcG9pbnQgd2l0aCBvdXIgb3duXHJcblx0XHRcdEBlbmRwb2ludHMgPSBfLmV4dGVuZCBvcHRpb25zOiBAYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCwgQGVuZHBvaW50c1xyXG5cclxuXHRcdFx0IyBDb25maWd1cmUgZWFjaCBlbmRwb2ludCBvbiB0aGlzIHJvdXRlXHJcblx0XHRcdEBfcmVzb2x2ZUVuZHBvaW50cygpXHJcblx0XHRcdEBfY29uZmlndXJlRW5kcG9pbnRzKClcclxuXHJcblx0XHRcdCMgQWRkIHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHBhdGhzXHJcblx0XHRcdEBhcGkuX2NvbmZpZy5wYXRocy5wdXNoIEBwYXRoXHJcblxyXG5cdFx0XHRhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyIGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XHJcblx0XHRcdFx0Xy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXHJcblx0XHRcdHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0IGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XHJcblx0XHRcdFx0Xy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXHJcblxyXG5cdFx0XHQjIFNldHVwIGVuZHBvaW50cyBvbiByb3V0ZVxyXG5cdFx0XHRmdWxsUGF0aCA9IEBhcGkuX2NvbmZpZy5hcGlQYXRoICsgQHBhdGhcclxuXHRcdFx0Xy5lYWNoIGFsbG93ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxyXG5cdFx0XHRcdGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXVxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cclxuXHRcdFx0XHRcdCMgQWRkIGZ1bmN0aW9uIHRvIGVuZHBvaW50IGNvbnRleHQgZm9yIGluZGljYXRpbmcgYSByZXNwb25zZSBoYXMgYmVlbiBpbml0aWF0ZWQgbWFudWFsbHlcclxuXHRcdFx0XHRcdHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2VcclxuXHRcdFx0XHRcdGRvbmVGdW5jID0gLT5cclxuXHRcdFx0XHRcdFx0cmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlXHJcblxyXG5cdFx0XHRcdFx0ZW5kcG9pbnRDb250ZXh0ID1cclxuXHRcdFx0XHRcdFx0dXJsUGFyYW1zOiByZXEucGFyYW1zXHJcblx0XHRcdFx0XHRcdHF1ZXJ5UGFyYW1zOiByZXEucXVlcnlcclxuXHRcdFx0XHRcdFx0Ym9keVBhcmFtczogcmVxLmJvZHlcclxuXHRcdFx0XHRcdFx0cmVxdWVzdDogcmVxXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlOiByZXNcclxuXHRcdFx0XHRcdFx0ZG9uZTogZG9uZUZ1bmNcclxuXHRcdFx0XHRcdCMgQWRkIGVuZHBvaW50IGNvbmZpZyBvcHRpb25zIHRvIGNvbnRleHRcclxuXHRcdFx0XHRcdF8uZXh0ZW5kIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuXHJcblx0XHRcdFx0XHQjIFJ1biB0aGUgcmVxdWVzdGVkIGVuZHBvaW50XHJcblx0XHRcdFx0XHRyZXNwb25zZURhdGEgPSBudWxsXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50IGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdCMgRG8gZXhhY3RseSB3aGF0IElyb24gUm91dGVyIHdvdWxkIGhhdmUgZG9uZSwgdG8gYXZvaWQgY2hhbmdpbmcgdGhlIEFQSVxyXG5cdFx0XHRcdFx0XHRpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdFx0XHRpZiByZXNwb25zZUluaXRpYXRlZFxyXG5cdFx0XHRcdFx0XHQjIEVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgcHJvcGVybHkgY29tcGxldGVkXHJcblx0XHRcdFx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aWYgcmVzLmhlYWRlcnNTZW50XHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIHJlc3BvbnNlRGF0YSBpcyBudWxsIG9yIHJlc3BvbnNlRGF0YSBpcyB1bmRlZmluZWRcclxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXHJcblxyXG5cdFx0XHRcdFx0IyBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBodHRwIHJlc3BvbnNlLCBoYW5kbGluZyB0aGUgZGlmZmVyZW50IGVuZHBvaW50IHJlc3BvbnNlIHR5cGVzXHJcblx0XHRcdFx0XHRpZiByZXNwb25zZURhdGEuYm9keSBhbmQgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIG9yIHJlc3BvbnNlRGF0YS5oZWFkZXJzKVxyXG5cdFx0XHRcdFx0XHRzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVyc1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhXHJcblxyXG5cdFx0XHRfLmVhY2ggcmVqZWN0ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cclxuXHRcdFx0XHRcdHJlc3BvbnNlRGF0YSA9IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcclxuXHRcdFx0XHRcdGhlYWRlcnMgPSAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcclxuXHRcdFx0XHRcdHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVyc1xyXG5cclxuXHJcblx0IyMjXHJcblx0XHRDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcclxuXHRcdGZ1bmN0aW9uXHJcblxyXG5cdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXHJcblx0IyMjXHJcblx0X3Jlc29sdmVFbmRwb2ludHM6IC0+XHJcblx0XHRfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykgLT5cclxuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGVuZHBvaW50KVxyXG5cdFx0XHRcdGVuZHBvaW50c1ttZXRob2RdID0ge2FjdGlvbjogZW5kcG9pbnR9XHJcblx0XHRyZXR1cm5cclxuXHJcblxyXG5cdCMjI1xyXG5cdFx0Q29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxyXG5cdFx0YmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXHJcblxyXG5cdFx0QXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cclxuXHRcdGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXHJcblx0XHRvdmVycmlkZSB0aGUgZGVmYXVsdC5cclxuXHJcblx0XHRBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcclxuXHRcdGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXHJcblx0XHRyZXNwZWN0aXZlbHkuXHJcblxyXG5cdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXHJcblx0XHRAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXHJcblx0IyMjXHJcblx0X2NvbmZpZ3VyZUVuZHBvaW50czogLT5cclxuXHRcdF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCkgLT5cclxuXHRcdFx0aWYgbWV0aG9kIGlzbnQgJ29wdGlvbnMnXHJcblx0XHRcdFx0IyBDb25maWd1cmUgYWNjZXB0YWJsZSByb2xlc1xyXG5cdFx0XHRcdGlmIG5vdCBAb3B0aW9ucz8ucm9sZVJlcXVpcmVkXHJcblx0XHRcdFx0XHRAb3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXVxyXG5cdFx0XHRcdGlmIG5vdCBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuXHRcdFx0XHRcdGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdXHJcblx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbiBlbmRwb2ludC5yb2xlUmVxdWlyZWQsIEBvcHRpb25zLnJvbGVSZXF1aXJlZFxyXG5cdFx0XHRcdCMgTWFrZSBpdCBlYXNpZXIgdG8gY2hlY2sgaWYgbm8gcm9sZXMgYXJlIHJlcXVpcmVkXHJcblx0XHRcdFx0aWYgXy5pc0VtcHR5IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG5cdFx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2VcclxuXHJcblx0XHRcdFx0IyBDb25maWd1cmUgYXV0aCByZXF1aXJlbWVudFxyXG5cdFx0XHRcdGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZCBpcyB1bmRlZmluZWRcclxuXHRcdFx0XHRcdGlmIEBvcHRpb25zPy5hdXRoUmVxdWlyZWQgb3IgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcblx0XHRcdFx0XHRcdGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWVcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0ZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2VcclxuXHJcblx0XHRcdFx0aWYgQG9wdGlvbnM/LnNwYWNlUmVxdWlyZWRcclxuXHRcdFx0XHRcdGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSBAb3B0aW9ucy5zcGFjZVJlcXVpcmVkXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHQsIHRoaXNcclxuXHRcdHJldHVyblxyXG5cclxuXHJcblx0IyMjXHJcblx0XHRBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XHJcblxyXG5cdFx0QHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXHJcblx0IyMjXHJcblx0X2NhbGxFbmRwb2ludDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcblx0XHQjIENhbGwgdGhlIGVuZHBvaW50IGlmIGF1dGhlbnRpY2F0aW9uIGRvZXNuJ3QgZmFpbFxyXG5cdFx0aWYgQF9hdXRoQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG5cdFx0XHRpZiBAX3JvbGVBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcblx0XHRcdFx0aWYgQF9zcGFjZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuXHRcdFx0XHRcdCNlbmRwb2ludC5hY3Rpb24uY2FsbCBlbmRwb2ludENvbnRleHRcclxuXHRcdFx0XHRcdGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cclxuXHRcdFx0XHRcdFx0aXNTaW11bGF0aW9uOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHR1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXHJcblx0XHRcdFx0XHRcdGNvbm5lY3Rpb246IG51bGwsXHJcblx0XHRcdFx0XHRcdHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlIGludm9jYXRpb24sIC0+XHJcblx0XHRcdFx0XHRcdHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG5cdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuXHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuXHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XHJcblxyXG5cclxuXHQjIyNcclxuXHRcdEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcclxuXHJcblx0XHRPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXHJcblx0XHRpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcclxuXHRcdGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxyXG5cclxuXHRcdEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcclxuXHQjIyNcclxuXHRfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuXHRcdGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZFxyXG5cdFx0XHRAX2F1dGhlbnRpY2F0ZSBlbmRwb2ludENvbnRleHRcclxuXHRcdGVsc2UgdHJ1ZVxyXG5cclxuXHJcblx0IyMjXHJcblx0XHRWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxyXG5cclxuXHRcdElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cclxuXHJcblx0XHRAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuXHQjIyNcclxuXHRfYXV0aGVudGljYXRlOiAoZW5kcG9pbnRDb250ZXh0KSAtPlxyXG5cdFx0IyBHZXQgYXV0aCBpbmZvXHJcblx0XHRhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcclxuXHJcblx0XHQjIEdldCB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxyXG5cdFx0aWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcclxuXHRcdFx0dXNlclNlbGVjdG9yID0ge31cclxuXHRcdFx0dXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkXHJcblx0XHRcdHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXHJcblx0XHRcdGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lIHVzZXJTZWxlY3RvclxyXG5cclxuXHRcdCMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuXHRcdGlmIGF1dGg/LnVzZXJcclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXJcclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcclxuXHRcdFx0dHJ1ZVxyXG5cdFx0ZWxzZSBmYWxzZVxyXG5cclxuXHQjIyNcclxuXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXHJcblxyXG5cdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxyXG5cclxuXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXHJcblx0XHRcdFx0XHRcdCBlbmRwb2ludFxyXG5cdCMjI1xyXG5cdF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuXHRcdGlmIGVuZHBvaW50LnNwYWNlUmVxdWlyZWRcclxuXHRcdFx0YXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXHJcblx0XHRcdGlmIGF1dGg/LnNwYWNlSWRcclxuXHRcdFx0XHRzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGgudXNlcklkLCBzcGFjZTphdXRoLnNwYWNlSWR9KS5jb3VudCgpXHJcblx0XHRcdFx0aWYgc3BhY2VfdXNlcnNfY291bnRcclxuXHRcdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxyXG5cdFx0XHRcdFx0IyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXHJcblx0XHRcdFx0XHRpZiBzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZS5faWQpIGFuZCBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCk+PTBcclxuXHRcdFx0XHRcdFx0ZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWRcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHJcblx0IyMjXHJcblx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxyXG5cclxuXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cclxuXHJcblx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxyXG5cdFx0XHRcdFx0XHQgZW5kcG9pbnRcclxuXHQjIyNcclxuXHRfcm9sZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuXHRcdGlmIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG5cdFx0XHRpZiBfLmlzRW1wdHkgXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcylcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHRydWVcclxuXHJcblxyXG5cdCMjI1xyXG5cdFx0UmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcclxuXHQjIyNcclxuXHRfcmVzcG9uZDogKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlPTIwMCwgaGVhZGVycz17fSkgLT5cclxuXHRcdCMgT3ZlcnJpZGUgYW55IGRlZmF1bHQgaGVhZGVycyB0aGF0IGhhdmUgYmVlbiBwcm92aWRlZCAoa2V5cyBhcmUgbm9ybWFsaXplZCB0byBiZSBjYXNlIGluc2Vuc2l0aXZlKVxyXG5cdFx0IyBUT0RPOiBDb25zaWRlciBvbmx5IGxvd2VyY2FzaW5nIHRoZSBoZWFkZXIga2V5cyB3ZSBuZWVkIG5vcm1hbGl6ZWQsIGxpa2UgQ29udGVudC1UeXBlXHJcblx0XHRkZWZhdWx0SGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBAYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnNcclxuXHRcdGhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgaGVhZGVyc1xyXG5cdFx0aGVhZGVycyA9IF8uZXh0ZW5kIGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzXHJcblxyXG5cdFx0IyBQcmVwYXJlIEpTT04gYm9keSBmb3IgcmVzcG9uc2Ugd2hlbiBDb250ZW50LVR5cGUgaW5kaWNhdGVzIEpTT04gdHlwZVxyXG5cdFx0aWYgaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pIGlzbnQgbnVsbFxyXG5cdFx0XHRpZiBAYXBpLl9jb25maWcucHJldHR5SnNvblxyXG5cdFx0XHRcdGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5LCB1bmRlZmluZWQsIDJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5XHJcblxyXG5cdFx0IyBTZW5kIHJlc3BvbnNlXHJcblx0XHRzZW5kUmVzcG9uc2UgPSAtPlxyXG5cdFx0XHRyZXNwb25zZS53cml0ZUhlYWQgc3RhdHVzQ29kZSwgaGVhZGVyc1xyXG5cdFx0XHRyZXNwb25zZS53cml0ZSBib2R5XHJcblx0XHRcdHJlc3BvbnNlLmVuZCgpXHJcblx0XHRpZiBzdGF0dXNDb2RlIGluIFs0MDEsIDQwM11cclxuXHRcdFx0IyBIYWNrZXJzIGNhbiBtZWFzdXJlIHRoZSByZXNwb25zZSB0aW1lIHRvIGRldGVybWluZSB0aGluZ3MgbGlrZSB3aGV0aGVyIHRoZSA0MDEgcmVzcG9uc2Ugd2FzXHJcblx0XHRcdCMgY2F1c2VkIGJ5IGJhZCB1c2VyIGlkIHZzIGJhZCBwYXNzd29yZC5cclxuXHRcdFx0IyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXHJcblx0XHRcdCMgRGVsYXkgYnkgYSByYW5kb20gYW1vdW50IHRvIHJlZHVjZSB0aGUgYWJpbGl0eSBmb3IgYSBoYWNrZXIgdG8gZGV0ZXJtaW5lIHRoZSByZXNwb25zZSB0aW1lLlxyXG5cdFx0XHQjIFNlZSBodHRwczovL3d3dy5vd2FzcC5vcmcvaW5kZXgucGhwL0Jsb2NraW5nX0JydXRlX0ZvcmNlX0F0dGFja3MjRmluZGluZ19PdGhlcl9Db3VudGVybWVhc3VyZXNcclxuXHRcdFx0IyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xyXG5cdFx0XHRtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMFxyXG5cdFx0XHRyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpXHJcblx0XHRcdGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXHJcblx0XHRcdE1ldGVvci5zZXRUaW1lb3V0IHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kc1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzZW5kUmVzcG9uc2UoKVxyXG5cclxuXHQjIyNcclxuXHRcdFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcclxuXHQjIyNcclxuXHRfbG93ZXJDYXNlS2V5czogKG9iamVjdCkgLT5cclxuXHRcdF8uY2hhaW4gb2JqZWN0XHJcblx0XHQucGFpcnMoKVxyXG5cdFx0Lm1hcCAoYXR0cikgLT5cclxuXHRcdFx0W2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cclxuXHRcdC5vYmplY3QoKVxyXG5cdFx0LnZhbHVlKClcclxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICBcdFx0Q29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gIFx0XHRmdW5jdGlvblxuICBcbiAgXHRcdEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gIFx0XHRiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcbiAgXG4gIFx0XHRBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICBcdFx0ZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcbiAgXHRcdG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuICBcbiAgXHRcdEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICBcdFx0YWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgXHRcdHJlc3BlY3RpdmVseS5cbiAgXG4gIFx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgXHRcdEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jb25maWd1cmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAobWV0aG9kICE9PSAnb3B0aW9ucycpIHtcbiAgICAgICAgaWYgKCEoKHJlZiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZi5yb2xlUmVxdWlyZWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQpO1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50LnJvbGVSZXF1aXJlZCkpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAoKChyZWYxID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMS5hdXRoUmVxdWlyZWQgOiB2b2lkIDApIHx8IGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgocmVmMiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjIuc3BhY2VSZXF1aXJlZCA6IHZvaWQgMCkge1xuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSB0aGlzLm9wdGlvbnMuc3BhY2VSZXF1aXJlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcbiAgXG4gIFx0XHRAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0T25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxuICBcdFx0aW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gIFx0XHRpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gIFx0XHRAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aEFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5hdXRoUmVxdWlyZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGUoZW5kcG9pbnRDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICBcdFx0SWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuICBcbiAgXHRcdEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCkge1xuICAgIHZhciBhdXRoLCB1c2VyU2VsZWN0b3I7XG4gICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICBpZiAoKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlcklkIDogdm9pZCAwKSAmJiAoYXV0aCAhPSBudWxsID8gYXV0aC50b2tlbiA6IHZvaWQgMCkgJiYgIShhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgICB1c2VyU2VsZWN0b3IgPSB7fTtcbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZDtcbiAgICAgIHVzZXJTZWxlY3Rvclt0aGlzLmFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlbjtcbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJTZWxlY3Rvcik7XG4gICAgfVxuICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApIHtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyO1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gIFx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICBcdFx0XHRcdFx0XHQgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKHNwYWNlICYmIFN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlLl9pZCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gIFx0XHRcdFx0XHRcdCBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3JvbGVBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICBpZiAoXy5pc0VtcHR5KF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzcG9uZCA9IGZ1bmN0aW9uKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzLCBkZWxheUluTWlsbGlzZWNvbmRzLCBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcywgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28sIHNlbmRSZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PSBudWxsKSB7XG4gICAgICBzdGF0dXNDb2RlID0gMjAwO1xuICAgIH1cbiAgICBpZiAoaGVhZGVycyA9PSBudWxsKSB7XG4gICAgICBoZWFkZXJzID0ge307XG4gICAgfVxuICAgIGRlZmF1bHRIZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyh0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyhoZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gXy5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuICAgIGlmIChoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFwaS5fY29uZmlnLnByZXR0eUpzb24pIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHksIHZvaWQgMCwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoYm9keSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZW5kKCk7XG4gICAgfTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxIHx8IHN0YXR1c0NvZGUgPT09IDQwMykge1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDA7XG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd287XG4gICAgICByZXR1cm4gTWV0ZW9yLnNldFRpbWVvdXQoc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpXHJcbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cclxuY2xhc3MgQE9kYXRhUmVzdGl2dXNcclxuXHJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxyXG5cdFx0QF9yb3V0ZXMgPSBbXVxyXG5cdFx0QF9jb25maWcgPVxyXG5cdFx0XHRwYXRoczogW11cclxuXHRcdFx0dXNlRGVmYXVsdEF1dGg6IGZhbHNlXHJcblx0XHRcdGFwaVBhdGg6ICdhcGkvJ1xyXG5cdFx0XHR2ZXJzaW9uOiBudWxsXHJcblx0XHRcdHByZXR0eUpzb246IGZhbHNlXHJcblx0XHRcdGF1dGg6XHJcblx0XHRcdFx0dG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nXHJcblx0XHRcdFx0dXNlcjogLT5cclxuXHRcdFx0XHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyggQHJlcXVlc3QsIEByZXNwb25zZSApXHJcblx0XHRcdFx0XHR1c2VySWQgPSBAcmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG5cdFx0XHRcdFx0YXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHRcdFx0XHRcdHNwYWNlSWQgPSBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgQHVybFBhcmFtc1snc3BhY2VJZCddXHJcblx0XHRcdFx0XHRpZiBhdXRoVG9rZW5cclxuXHRcdFx0XHRcdFx0dG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aFRva2VuXHJcblx0XHRcdFx0XHRpZiBAcmVxdWVzdC51c2VySWRcclxuXHRcdFx0XHRcdFx0X3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IEByZXF1ZXN0LnVzZXJJZH0pXHJcblx0XHRcdFx0XHRcdHVzZXI6IF91c2VyXHJcblx0XHRcdFx0XHRcdHVzZXJJZDogdXNlcklkXHJcblx0XHRcdFx0XHRcdHNwYWNlSWQ6IHNwYWNlSWRcclxuXHRcdFx0XHRcdFx0dG9rZW46IHRva2VuXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHVzZXJJZDogdXNlcklkXHJcblx0XHRcdFx0XHRcdHNwYWNlSWQ6IHNwYWNlSWRcclxuXHRcdFx0XHRcdFx0dG9rZW46IHRva2VuXHJcblx0XHRcdGRlZmF1bHRIZWFkZXJzOlxyXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuXHRcdFx0ZW5hYmxlQ29yczogdHJ1ZVxyXG5cclxuXHRcdCMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXHJcblx0XHRfLmV4dGVuZCBAX2NvbmZpZywgb3B0aW9uc1xyXG5cclxuXHRcdGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcclxuXHRcdFx0Y29yc0hlYWRlcnMgPVxyXG5cdFx0XHRcdCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKidcclxuXHRcdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0LCBPRGF0YS1WZXJzaW9uJ1xyXG5cclxuXHRcdFx0aWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcclxuXHRcdFx0XHRjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuLCBYLVNwYWNlLUlkJ1xyXG5cclxuXHRcdFx0IyBTZXQgZGVmYXVsdCBoZWFkZXIgdG8gZW5hYmxlIENPUlMgaWYgY29uZmlndXJlZFxyXG5cdFx0XHRfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcclxuXHJcblx0XHRcdGlmIG5vdCBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XHJcblx0XHRcdFx0QF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XHJcblx0XHRcdFx0XHRAcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgY29yc0hlYWRlcnNcclxuXHRcdFx0XHRcdEBkb25lKClcclxuXHJcblx0XHQjIE5vcm1hbGl6ZSB0aGUgQVBJIHBhdGhcclxuXHRcdGlmIEBfY29uZmlnLmFwaVBhdGhbMF0gaXMgJy8nXHJcblx0XHRcdEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcclxuXHRcdGlmIF8ubGFzdChAX2NvbmZpZy5hcGlQYXRoKSBpc250ICcvJ1xyXG5cdFx0XHRAX2NvbmZpZy5hcGlQYXRoID0gQF9jb25maWcuYXBpUGF0aCArICcvJ1xyXG5cclxuXHRcdCMgVVJMIHBhdGggdmVyc2lvbmluZyBpcyB0aGUgb25seSB0eXBlIG9mIEFQSSB2ZXJzaW9uaW5nIGN1cnJlbnRseSBhdmFpbGFibGUsIHNvIGlmIGEgdmVyc2lvbiBpc1xyXG5cdFx0IyBwcm92aWRlZCwgYXBwZW5kIGl0IHRvIHRoZSBiYXNlIHBhdGggb2YgdGhlIEFQSVxyXG5cdFx0aWYgQF9jb25maWcudmVyc2lvblxyXG5cdFx0XHRAX2NvbmZpZy5hcGlQYXRoICs9IEBfY29uZmlnLnZlcnNpb24gKyAnLydcclxuXHJcblx0XHQjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxyXG5cdFx0aWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcclxuXHRcdFx0QF9pbml0QXV0aCgpXHJcblx0XHRlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcclxuXHRcdFx0QF9pbml0QXV0aCgpXHJcblx0XHRcdGNvbnNvbGUud2FybiAnV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICtcclxuXHRcdFx0XHRcdCdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcclxuXHJcblx0XHRyZXR1cm4gdGhpc1xyXG5cclxuXHJcblx0IyMjKlxyXG5cdFx0QWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxyXG5cclxuXHRcdEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcclxuXHRcdEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xyXG5cdFx0QHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxyXG5cdFx0QHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXHJcblx0XHRAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXHJcblx0XHRAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXHJcblx0XHRcdFx0Y29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxyXG5cdFx0XHRcdGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cclxuXHQjIyNcclxuXHRhZGRSb3V0ZTogKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykgLT5cclxuXHRcdCMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXHJcblx0XHRyb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpXHJcblx0XHRAX3JvdXRlcy5wdXNoKHJvdXRlKVxyXG5cclxuXHRcdHJvdXRlLmFkZFRvQXBpKClcclxuXHJcblx0XHRyZXR1cm4gdGhpc1xyXG5cclxuXHJcblx0IyMjKlxyXG5cdFx0R2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxyXG5cdCMjI1xyXG5cdGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxyXG5cdFx0bWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXVxyXG5cdFx0bWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXVxyXG5cclxuXHRcdCMgR3JhYiB0aGUgc2V0IG9mIGVuZHBvaW50c1xyXG5cdFx0aWYgY29sbGVjdGlvbiBpcyBNZXRlb3IudXNlcnNcclxuXHRcdFx0Y29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcclxuXHRcdGVsc2VcclxuXHRcdFx0Y29sbGVjdGlvbkVuZHBvaW50cyA9IEBfY29sbGVjdGlvbkVuZHBvaW50c1xyXG5cclxuXHRcdCMgRmxhdHRlbiB0aGUgb3B0aW9ucyBhbmQgc2V0IGRlZmF1bHRzIGlmIG5lY2Vzc2FyeVxyXG5cdFx0ZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgb3Ige31cclxuXHRcdHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XHJcblx0XHRleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgb3IgW11cclxuXHRcdCMgVXNlIGNvbGxlY3Rpb24gbmFtZSBhcyBkZWZhdWx0IHBhdGhcclxuXHRcdHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxyXG5cclxuXHRcdCMgU2VwYXJhdGUgdGhlIHJlcXVlc3RlZCBlbmRwb2ludHMgYnkgdGhlIHJvdXRlIHRoZXkgYmVsb25nIHRvIChvbmUgZm9yIG9wZXJhdGluZyBvbiB0aGUgZW50aXJlXHJcblx0XHQjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXHJcblx0XHRjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fVxyXG5cdFx0ZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fVxyXG5cdFx0aWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcclxuXHRcdFx0IyBHZW5lcmF0ZSBhbGwgZW5kcG9pbnRzIG9uIHRoaXMgY29sbGVjdGlvblxyXG5cdFx0XHRfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cclxuXHRcdFx0XHQjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcclxuXHRcdFx0XHRpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxyXG5cdFx0XHRcdFx0Xy5leHRlbmQgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKVxyXG5cdFx0XHRcdGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdCwgdGhpc1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHQjIEdlbmVyYXRlIGFueSBlbmRwb2ludHMgdGhhdCBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBleGNsdWRlZFxyXG5cdFx0XHRfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cclxuXHRcdFx0XHRpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXHJcblx0XHRcdFx0XHQjIENvbmZpZ3VyZSBlbmRwb2ludCBhbmQgbWFwIHRvIGl0J3MgaHR0cCBtZXRob2RcclxuXHRcdFx0XHRcdCMgVE9ETzogQ29uc2lkZXIgcHJlZGVmaW5pbmcgYSBtYXAgb2YgbWV0aG9kcyB0byB0aGVpciBodHRwIG1ldGhvZCB0eXBlIChlLmcuLCBnZXRBbGw6IGdldClcclxuXHRcdFx0XHRcdGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXHJcblx0XHRcdFx0XHRjb25maWd1cmVkRW5kcG9pbnQgPSB7fVxyXG5cdFx0XHRcdFx0Xy5lYWNoIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCAoYWN0aW9uLCBtZXRob2RUeXBlKSAtPlxyXG5cdFx0XHRcdFx0XHRjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxyXG5cdFx0XHRcdFx0XHRcdF8uY2hhaW4gYWN0aW9uXHJcblx0XHRcdFx0XHRcdFx0LmNsb25lKClcclxuXHRcdFx0XHRcdFx0XHQuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xyXG5cdFx0XHRcdFx0XHRcdC52YWx1ZSgpXHJcblx0XHRcdFx0XHQjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcclxuXHRcdFx0XHRcdGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXHJcblx0XHRcdFx0XHRcdF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XHJcblx0XHRcdFx0XHRlbHNlIF8uZXh0ZW5kIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnRcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHQsIHRoaXNcclxuXHJcblx0XHQjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcclxuXHRcdEBhZGRSb3V0ZSBwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50c1xyXG5cdFx0QGFkZFJvdXRlIFwiI3twYXRofS86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50c1xyXG5cclxuXHRcdHJldHVybiB0aGlzXHJcblxyXG5cclxuXHQjIyMqXHJcblx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcclxuXHQjIyNcclxuXHRfY29sbGVjdGlvbkVuZHBvaW50czpcclxuXHRcdGdldDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdGdldDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XHJcblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBzZWxlY3RvclxyXG5cdFx0XHRcdFx0aWYgZW50aXR5XHJcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG5cdFx0cHV0OiAoY29sbGVjdGlvbikgLT5cclxuXHRcdFx0cHV0OlxyXG5cdFx0XHRcdGFjdGlvbjogLT5cclxuXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cclxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxyXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG5cdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsICRzZXQ6IEBib2R5UGFyYW1zXHJcblx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcclxuXHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcblx0XHRkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxyXG5cdFx0XHRkZWxldGU6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxyXG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRcdHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG5cdFx0cG9zdDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdHBvc3Q6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXHJcblx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcclxuXHRcdFx0XHRcdGlmIGVudGl0eVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxyXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ31cclxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdGdldDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRzZWxlY3RvciA9IHt9XHJcblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXHJcblx0XHRcdFx0XHRpZiBlbnRpdGllc1xyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbid9XHJcblxyXG5cclxuXHQjIyMqXHJcblx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXHJcblx0IyMjXHJcblx0X3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzOlxyXG5cdFx0Z2V0OiAoY29sbGVjdGlvbikgLT5cclxuXHRcdFx0Z2V0OlxyXG5cdFx0XHRcdGFjdGlvbjogLT5cclxuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuXHRcdFx0XHRcdGlmIGVudGl0eVxyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuXHRcdHB1dDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdHB1dDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xyXG5cdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXHJcblx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuXHRcdFx0XHRcdFx0e3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuXHRcdGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdGRlbGV0ZTpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBAdXJsUGFyYW1zLmlkXHJcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCd9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XHJcblx0XHRwb3N0OiAoY29sbGVjdGlvbikgLT5cclxuXHRcdFx0cG9zdDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHQjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcclxuXHRcdFx0XHRcdGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlciBAYm9keVBhcmFtc1xyXG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuXHRcdFx0XHRcdGlmIGVudGl0eVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ31cclxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdGdldDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXHJcblx0XHRcdFx0XHRpZiBlbnRpdGllc1xyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ31cclxuXHJcblxyXG5cdCMjI1xyXG5cdFx0QWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxyXG5cdCMjI1xyXG5cdF9pbml0QXV0aDogLT5cclxuXHRcdHNlbGYgPSB0aGlzXHJcblx0XHQjIyNcclxuXHRcdFx0QWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxyXG5cclxuXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcclxuXHRcdFx0YWRkaW5nIGhvb2spLlxyXG5cdFx0IyMjXHJcblx0XHRAYWRkUm91dGUgJ2xvZ2luJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LFxyXG5cdFx0XHRwb3N0OiAtPlxyXG5cdFx0XHRcdCMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcclxuXHRcdFx0XHR1c2VyID0ge31cclxuXHRcdFx0XHRpZiBAYm9keVBhcmFtcy51c2VyXHJcblx0XHRcdFx0XHRpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxyXG5cdFx0XHRcdFx0XHR1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlclxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxyXG5cdFx0XHRcdGVsc2UgaWYgQGJvZHlQYXJhbXMudXNlcm5hbWVcclxuXHRcdFx0XHRcdHVzZXIudXNlcm5hbWUgPSBAYm9keVBhcmFtcy51c2VybmFtZVxyXG5cdFx0XHRcdGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcclxuXHRcdFx0XHRcdHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy5lbWFpbFxyXG5cclxuXHRcdFx0XHQjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkIHVzZXIsIEBib2R5UGFyYW1zLnBhc3N3b3JkXHJcblx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlXHJcblx0XHRcdFx0XHRyZXR1cm4ge30gPVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiBlLmVycm9yXHJcblx0XHRcdFx0XHRcdGJvZHk6IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5yZWFzb25cclxuXHJcblx0XHRcdFx0IyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxyXG5cdFx0XHRcdCMgVE9ETzogQ29uc2lkZXIgcmV0dXJuaW5nIHRoZSB1c2VyIGluIEF1dGgubG9naW5XaXRoUGFzc3dvcmQoKSwgaW5zdGVhZCBvZiBmZXRjaGluZyBpdCBhZ2FpbiBoZXJlXHJcblx0XHRcdFx0aWYgYXV0aC51c2VySWQgYW5kIGF1dGguYXV0aFRva2VuXHJcblx0XHRcdFx0XHRzZWFyY2hRdWVyeSA9IHt9XHJcblx0XHRcdFx0XHRzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aC5hdXRoVG9rZW5cclxuXHRcdFx0XHRcdEB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0XHRcdFx0J19pZCc6IGF1dGgudXNlcklkXHJcblx0XHRcdFx0XHRcdHNlYXJjaFF1ZXJ5XHJcblx0XHRcdFx0XHRAdXNlcklkID0gQHVzZXI/Ll9pZFxyXG5cclxuXHRcdFx0XHRyZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogYXV0aH1cclxuXHJcblx0XHRcdFx0IyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxyXG5cdFx0XHRcdGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluPy5jYWxsKHRoaXMpXHJcblx0XHRcdFx0aWYgZXh0cmFEYXRhP1xyXG5cdFx0XHRcdFx0Xy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxyXG5cclxuXHRcdFx0XHRyZXNwb25zZVxyXG5cclxuXHRcdGxvZ291dCA9IC0+XHJcblx0XHRcdCMgUmVtb3ZlIHRoZSBnaXZlbiBhdXRoIHRva2VuIGZyb20gdGhlIHVzZXIncyBhY2NvdW50XHJcblx0XHRcdGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXHJcblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxyXG5cdFx0XHR0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW5cclxuXHRcdFx0aW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xyXG5cdFx0XHR0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyAwLCBpbmRleFxyXG5cdFx0XHR0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nIGluZGV4ICsgMVxyXG5cdFx0XHR0b2tlblRvUmVtb3ZlID0ge31cclxuXHRcdFx0dG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlblxyXG5cdFx0XHR0b2tlblJlbW92YWxRdWVyeSA9IHt9XHJcblx0XHRcdHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXHJcblx0XHRcdE1ldGVvci51c2Vycy51cGRhdGUgQHVzZXIuX2lkLCB7JHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5fVxyXG5cclxuXHRcdFx0cmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxyXG5cclxuXHRcdFx0IyBDYWxsIHRoZSBsb2dvdXQgaG9vayB3aXRoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYXR0YWNoZWRcclxuXHRcdFx0ZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXHJcblx0XHRcdGlmIGV4dHJhRGF0YT9cclxuXHRcdFx0XHRfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXHJcblxyXG5cdFx0XHRyZXNwb25zZVxyXG5cclxuXHRcdCMjI1xyXG5cdFx0XHRBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxyXG5cclxuXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxyXG5cdFx0XHRhZGRpbmcgaG9vaykuXHJcblx0XHQjIyNcclxuXHRcdEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXHJcblx0XHRcdGdldDogLT5cclxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiXHJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXHJcblx0XHRcdFx0cmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpXHJcblx0XHRcdHBvc3Q6IGxvZ291dFxyXG5cclxuT2RhdGFSZXN0aXZ1cyA9IEBPZGF0YVJlc3RpdnVzXHJcbiIsInZhciBDb29raWVzLCBPZGF0YVJlc3RpdnVzLCBiYXNpY0F1dGgsXG4gIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbnRoaXMuT2RhdGFSZXN0aXZ1cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gT2RhdGFSZXN0aXZ1cyhvcHRpb25zKSB7XG4gICAgdmFyIGNvcnNIZWFkZXJzO1xuICAgIHRoaXMuX3JvdXRlcyA9IFtdO1xuICAgIHRoaXMuX2NvbmZpZyA9IHtcbiAgICAgIHBhdGhzOiBbXSxcbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZSxcbiAgICAgIGFwaVBhdGg6ICdhcGkvJyxcbiAgICAgIHZlcnNpb246IG51bGwsXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nLFxuICAgICAgICB1c2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3VzZXIsIGF1dGhUb2tlbiwgY29va2llcywgc3BhY2VJZCwgdG9rZW4sIHVzZXJJZDtcbiAgICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXModGhpcy5yZXF1ZXN0LCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB1c2VySWQgPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgICAgICAgIHNwYWNlSWQgPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHRoaXMudXJsUGFyYW1zWydzcGFjZUlkJ107XG4gICAgICAgICAgaWYgKGF1dGhUb2tlbikge1xuICAgICAgICAgICAgdG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC51c2VySWQpIHtcbiAgICAgICAgICAgIF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy5yZXF1ZXN0LnVzZXJJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VyOiBfdXNlcixcbiAgICAgICAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHNwYWNlSWQsXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHNwYWNlSWQsXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxuICAgIH07XG4gICAgXy5leHRlbmQodGhpcy5fY29uZmlnLCBvcHRpb25zKTtcbiAgICBpZiAodGhpcy5fY29uZmlnLmVuYWJsZUNvcnMpIHtcbiAgICAgIGNvcnNIZWFkZXJzID0ge1xuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0LCBPRGF0YS1WZXJzaW9uJ1xuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgICAgY29yc0hlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSArPSAnLCBYLVVzZXItSWQsIFgtQXV0aC1Ub2tlbiwgWC1TcGFjZS1JZCc7XG4gICAgICB9XG4gICAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcuZGVmYXVsdEhlYWRlcnMsIGNvcnNIZWFkZXJzKTtcbiAgICAgIGlmICghdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlLndyaXRlSGVhZCgyMDAsIGNvcnNIZWFkZXJzKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcuYXBpUGF0aFswXSA9PT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoLnNsaWNlKDEpO1xuICAgIH1cbiAgICBpZiAoXy5sYXN0KHRoaXMuX2NvbmZpZy5hcGlQYXRoKSAhPT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnZlcnNpb24pIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoICs9IHRoaXMuX2NvbmZpZy52ZXJzaW9uICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY29uZmlnLnVzZUF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgLyoqXG4gIFx0XHRBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG4gIFxuICBcdFx0QHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuICBcdFx0QHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gIFx0XHRAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gIFx0XHRAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgXHRcdEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcbiAgXHRcdEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcbiAgXHRcdFx0XHRjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG4gIFx0XHRcdFx0YW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5hZGRSb3V0ZSA9IGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykge1xuICAgIHZhciByb3V0ZTtcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpO1xuICAgIHRoaXMuX3JvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByb3V0ZS5hZGRUb0FwaSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gIFx0XHRHZW5lcmF0ZSByb3V0ZXMgZm9yIHRoZSBNZXRlb3IgQ29sbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLmFkZENvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25FbmRwb2ludHMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uLCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZHMsIG1ldGhvZHNPbkNvbGxlY3Rpb24sIHBhdGgsIHJvdXRlT3B0aW9ucztcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ107XG4gICAgbWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXTtcbiAgICBpZiAoY29sbGVjdGlvbiA9PT0gTWV0ZW9yLnVzZXJzKSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl9jb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH1cbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyB8fCB7fTtcbiAgICByb3V0ZU9wdGlvbnMgPSBvcHRpb25zLnJvdXRlT3B0aW9ucyB8fCB7fTtcbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgfHwgW107XG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCB8fCBjb2xsZWN0aW9uLl9uYW1lO1xuICAgIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24pICYmIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cykpIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgY29uZmlndXJlZEVuZHBvaW50LCBlbmRwb2ludE9wdGlvbnM7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwoZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZCkgPCAwICYmIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdO1xuICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludCA9IHt9O1xuICAgICAgICAgIF8uZWFjaChjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgZnVuY3Rpb24oYWN0aW9uLCBtZXRob2RUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlndXJlZEVuZHBvaW50W21ldGhvZFR5cGVdID0gXy5jaGFpbihhY3Rpb24pLmNsb25lKCkuZXh0ZW5kKGVuZHBvaW50T3B0aW9ucykudmFsdWUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLmFkZFJvdXRlKHBhdGgsIHJvdXRlT3B0aW9ucywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzKTtcbiAgICB0aGlzLmFkZFJvdXRlKHBhdGggKyBcIi86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5fY29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5ib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCh0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXMsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChzZWxlY3RvcikuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gIFx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5O1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkO1xuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHRoaXMudXJsUGFyYW1zLmlkKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcztcbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0QWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5faW5pdEF1dGggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9nb3V0LCBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgLypcbiAgICBcdFx0XHRBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICBcdFx0XHRhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgdGhpcy5hZGRSb3V0ZSgnbG9naW4nLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlXG4gICAgfSwge1xuICAgICAgcG9zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdXRoLCBlLCBleHRyYURhdGEsIHJlZiwgcmVmMSwgcmVzcG9uc2UsIHNlYXJjaFF1ZXJ5LCB1c2VyO1xuICAgICAgICB1c2VyID0ge307XG4gICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcikge1xuICAgICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlci5pbmRleE9mKCdAJykgPT09IC0xKSB7XG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lKSB7XG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VybmFtZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMuZW1haWwpIHtcbiAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLmVtYWlsO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQodXNlciwgdGhpcy5ib2R5UGFyYW1zLnBhc3N3b3JkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogZS5lcnJvcixcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBlLnJlYXNvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF1dGgudXNlcklkICYmIGF1dGguYXV0aFRva2VuKSB7XG4gICAgICAgICAgc2VhcmNoUXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aC5hdXRoVG9rZW4pO1xuICAgICAgICAgIHRoaXMudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICdfaWQnOiBhdXRoLnVzZXJJZFxuICAgICAgICAgIH0sIHNlYXJjaFF1ZXJ5KTtcbiAgICAgICAgICB0aGlzLnVzZXJJZCA9IChyZWYgPSB0aGlzLnVzZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIGRhdGE6IGF1dGhcbiAgICAgICAgfTtcbiAgICAgICAgZXh0cmFEYXRhID0gKHJlZjEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbikgIT0gbnVsbCA/IHJlZjEuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhdXRoVG9rZW4sIGV4dHJhRGF0YSwgaGFzaGVkVG9rZW4sIGluZGV4LCByZWYsIHJlc3BvbnNlLCB0b2tlbkZpZWxkTmFtZSwgdG9rZW5Mb2NhdGlvbiwgdG9rZW5QYXRoLCB0b2tlblJlbW92YWxRdWVyeSwgdG9rZW5Ub1JlbW92ZTtcbiAgICAgIGF1dGhUb2tlbiA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXTtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW47XG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIHRva2VuUGF0aCA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoaW5kZXggKyAxKTtcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fTtcbiAgICAgIHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW47XG4gICAgICB0b2tlblJlbW92YWxRdWVyeSA9IHt9O1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmU7XG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlKHRoaXMudXNlci5faWQsIHtcbiAgICAgICAgJHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5XG4gICAgICB9KTtcbiAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZXh0cmFEYXRhID0gKHJlZiA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZE91dCkgIT0gbnVsbCA/IHJlZi5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG5cbiAgICAvKlxuICAgIFx0XHRcdEFkZCBhIGxvZ291dCBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgIFx0XHRcdGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5hZGRSb3V0ZSgnbG9nb3V0Jywge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlXG4gICAgfSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIik7XG4gICAgICAgIGNvbnNvbGUud2FybihcIiAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzL2lzc3Vlcy8xMDBcIik7XG4gICAgICAgIHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKTtcbiAgICAgIH0sXG4gICAgICBwb3N0OiBsb2dvdXRcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gT2RhdGFSZXN0aXZ1cztcblxufSkoKTtcblxuT2RhdGFSZXN0aXZ1cyA9IHRoaXMuT2RhdGFSZXN0aXZ1cztcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblxyXG5cdGdldE9iamVjdHMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZXMpLT5cclxuXHRcdGRhdGEgPSB7fVxyXG5cdFx0b2JqZWN0X25hbWVzLnNwbGl0KCcsJykuZm9yRWFjaCAob2JqZWN0X25hbWUpLT5cclxuXHRcdFx0b2JqZWN0ID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHRcdGRhdGFbb2JqZWN0Lm5hbWVdID0gb2JqZWN0XHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHJcblx0Z2V0T2JqZWN0ID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpLT5cclxuXHRcdGRhdGEgPSBfLmNsb25lKENyZWF0b3IuT2JqZWN0c1tDcmVhdG9yLmdldE9iamVjdE5hbWUoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKV0pXHJcblx0XHRpZiAhZGF0YVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLml6DmlYjnmoRpZCAje29iamVjdF9uYW1lfVwiKVxyXG5cclxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkuZmV0Y2goKVxyXG5cdFx0cHNldHMgPSB7IHBzZXRzQWRtaW4sIHBzZXRzVXNlciwgcHNldHNDdXJyZW50IH1cclxuXHJcblx0XHRvYmplY3RfcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblxyXG5cdFx0ZGVsZXRlIGRhdGEubGlzdF92aWV3c1xyXG5cdFx0ZGVsZXRlIGRhdGEucGVybWlzc2lvbl9zZXRcclxuXHJcblx0XHRpZiBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dSZWFkXHJcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdFx0XHRkYXRhLmFsbG93RWRpdCA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0VkaXRcclxuXHRcdFx0ZGF0YS5hbGxvd0RlbGV0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRkYXRhLmFsbG93Q3JlYXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93Q3JlYXRlXHJcblx0XHRcdGRhdGEubW9kaWZ5QWxsUmVjb3JkcyA9IG9iamVjdF9wZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXHJcblxyXG5cdFx0XHRmaWVsZHMgPSB7fVxyXG5cdFx0XHRfLmZvckVhY2ggZGF0YS5maWVsZHMsIChmaWVsZCwga2V5KS0+XHJcblx0XHRcdFx0X2ZpZWxkID0gXy5jbG9uZShmaWVsZClcclxuXHJcblx0XHRcdFx0aWYgIV9maWVsZC5uYW1lXHJcblx0XHRcdFx0XHRfZmllbGQubmFtZSA9IGtleVxyXG5cclxuXHRcdFx0XHQj5bCG5LiN5Y+v57yW6L6R55qE5a2X5q616K6+572u5Li6cmVhZG9ubHkgPSB0cnVlXHJcblx0XHRcdFx0aWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA+IC0xKVxyXG5cdFx0XHRcdFx0X2ZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHQj5LiN6L+U5Zue5LiN5Y+v6KeB5a2X5q61XHJcblx0XHRcdFx0aWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA8IDApXHJcblx0XHRcdFx0XHRmaWVsZHNba2V5XSA9IF9maWVsZFxyXG5cclxuXHRcdFx0ZGF0YS5maWVsZHMgPSBmaWVsZHNcclxuXHJcblx0XHRlbHNlXHJcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gZmFsc2VcclxuXHJcblx0XHRyZXR1cm4gZGF0YVxyXG5cclxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgU3RlZWRvc09EYXRhLkFQSV9QQVRIICsgJy9vYmplY3RzLzppZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHRcdHRyeVxyXG5cdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xyXG5cdFx0XHRpZiAhdXNlcklkXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxyXG5cclxuXHRcdFx0c3BhY2VJZCA9IHJlcS5wYXJhbXM/LnNwYWNlSWRcclxuXHRcdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJNaXNzIHNwYWNlSWRcIilcclxuXHJcblx0XHRcdG9iamVjdF9uYW1lID0gcmVxLnBhcmFtcz8uaWRcclxuXHRcdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTWlzcyBpZFwiKVxyXG5cclxuXHRcdFx0X29iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZE9uZSh7X2lkOiBvYmplY3RfbmFtZX0pXHJcblxyXG5cdFx0XHRpZiBfb2JqICYmIF9vYmoubmFtZVxyXG5cdFx0XHRcdG9iamVjdF9uYW1lID0gX29iai5uYW1lXHJcblxyXG5cdFx0XHRpZiBvYmplY3RfbmFtZS5zcGxpdCgnLCcpLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRkYXRhID0gZ2V0T2JqZWN0cyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZGF0YSA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRcdGNvZGU6IDIwMCxcclxuXHRcdFx0XHRkYXRhOiBkYXRhIHx8IHt9XHJcblx0XHRcdH1cclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0XHRjb2RlOiBlLmVycm9yIHx8IDUwMFxyXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cclxuXHRcdFx0fSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgZ2V0T2JqZWN0LCBnZXRPYmplY3RzO1xuICBnZXRPYmplY3RzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZXMpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0ge307XG4gICAgb2JqZWN0X25hbWVzLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIG9iamVjdCA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIHJldHVybiBkYXRhW29iamVjdC5uYW1lXSA9IG9iamVjdDtcbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbiAgZ2V0T2JqZWN0ID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBkYXRhLCBmaWVsZHMsIG9iamVjdF9wZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VycmVudCwgcHNldHNVc2VyO1xuICAgIGRhdGEgPSBfLmNsb25lKENyZWF0b3IuT2JqZWN0c1tDcmVhdG9yLmdldE9iamVjdE5hbWUoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKV0pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5peg5pWI55qEaWQgXCIgKyBvYmplY3RfbmFtZSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudFxuICAgIH07XG4gICAgb2JqZWN0X3Blcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICBkZWxldGUgZGF0YS5saXN0X3ZpZXdzO1xuICAgIGRlbGV0ZSBkYXRhLnBlcm1pc3Npb25fc2V0O1xuICAgIGlmIChvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgICBkYXRhLmFsbG93UmVhZCA9IHRydWU7XG4gICAgICBkYXRhLmFsbG93RWRpdCA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0VkaXQ7XG4gICAgICBkYXRhLmFsbG93RGVsZXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93RGVsZXRlO1xuICAgICAgZGF0YS5hbGxvd0NyZWF0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZTtcbiAgICAgIGRhdGEubW9kaWZ5QWxsUmVjb3JkcyA9IG9iamVjdF9wZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgZmllbGRzID0ge307XG4gICAgICBfLmZvckVhY2goZGF0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgICAgdmFyIF9maWVsZDtcbiAgICAgICAgX2ZpZWxkID0gXy5jbG9uZShmaWVsZCk7XG4gICAgICAgIGlmICghX2ZpZWxkLm5hbWUpIHtcbiAgICAgICAgICBfZmllbGQubmFtZSA9IGtleTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpID4gLTEpIHtcbiAgICAgICAgICBfZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmluZGV4T2Yob2JqZWN0X3Blcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBfZmllbGQubmFtZSkgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkc1trZXldID0gX2ZpZWxkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRhdGEuZmllbGRzID0gZmllbGRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCBTdGVlZG9zT0RhdGEuQVBJX1BBVEggKyAnL29iamVjdHMvOmlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgX29iaiwgZGF0YSwgZSwgb2JqZWN0X25hbWUsIHJlZiwgcmVmMSwgc3BhY2VJZCwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICAgIH1cbiAgICAgIHNwYWNlSWQgPSAocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwO1xuICAgICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3Mgc3BhY2VJZFwiKTtcbiAgICAgIH1cbiAgICAgIG9iamVjdF9uYW1lID0gKHJlZjEgPSByZXEucGFyYW1zKSAhPSBudWxsID8gcmVmMS5pZCA6IHZvaWQgMDtcbiAgICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTWlzcyBpZFwiKTtcbiAgICAgIH1cbiAgICAgIF9vYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG9iamVjdF9uYW1lXG4gICAgICB9KTtcbiAgICAgIGlmIChfb2JqICYmIF9vYmoubmFtZSkge1xuICAgICAgICBvYmplY3RfbmFtZSA9IF9vYmoubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmplY3RfbmFtZS5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZGF0YSA9IGdldE9iamVjdHMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiBkYXRhIHx8IHt9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRNZXRlb3JPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5NZXRlb3JPRGF0YVJvdXRlcjtcclxuXHRPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5PRGF0YVJvdXRlclxyXG5cdGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcblx0YXBwID0gZXhwcmVzcygpO1xyXG5cdGFwcC51c2UoJy9hcGkvb2RhdGEvdjQnLCBNZXRlb3JPRGF0YVJvdXRlcik7XHJcblx0TWV0ZW9yT0RhdGFBUElWNFJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5NZXRlb3JPRGF0YUFQSVY0Um91dGVyO1xyXG5cdGlmIE1ldGVvck9EYXRhQVBJVjRSb3V0ZXJcclxuXHRcdGFwcC51c2UoJy9hcGkvdjQnLCBNZXRlb3JPRGF0YUFQSVY0Um91dGVyKVxyXG5cdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKGFwcCk7XHJcblx0Xy5lYWNoIENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCAoZGF0YXNvdXJjZSwgbmFtZSktPlxyXG5cdFx0aWYobmFtZSAhPSAnZGVmYXVsdCcpXHJcblx0XHRcdG90aGVyQXBwID0gZXhwcmVzcygpO1xyXG5cdFx0XHRvdGhlckFwcC51c2UoXCIvYXBpL29kYXRhLyN7bmFtZX1cIiwgT0RhdGFSb3V0ZXIpO1xyXG5cdFx0XHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShvdGhlckFwcCk7XHJcblxyXG4jIFx0b2RhdGFWNE1vbmdvZGIgPSByZXF1aXJlICdvZGF0YS12NC1tb25nb2RiJ1xyXG4jIFx0cXVlcnlzdHJpbmcgPSByZXF1aXJlICdxdWVyeXN0cmluZydcclxuXHJcbiMgXHRoYW5kbGVFcnJvciA9IChlKS0+XHJcbiMgXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG4jIFx0XHRib2R5ID0ge31cclxuIyBcdFx0ZXJyb3IgPSB7fVxyXG4jIFx0XHRlcnJvclsnbWVzc2FnZSddID0gZS5tZXNzYWdlXHJcbiMgXHRcdHN0YXR1c0NvZGUgPSA1MDBcclxuIyBcdFx0aWYgZS5lcnJvciBhbmQgXy5pc051bWJlcihlLmVycm9yKVxyXG4jIFx0XHRcdHN0YXR1c0NvZGUgPSBlLmVycm9yXHJcbiMgXHRcdGVycm9yWydjb2RlJ10gPSBzdGF0dXNDb2RlXHJcbiMgXHRcdGVycm9yWydlcnJvciddID0gc3RhdHVzQ29kZVxyXG4jIFx0XHRlcnJvclsnZGV0YWlscyddID0gZS5kZXRhaWxzXHJcbiMgXHRcdGVycm9yWydyZWFzb24nXSA9IGUucmVhc29uXHJcbiMgXHRcdGJvZHlbJ2Vycm9yJ10gPSBlcnJvclxyXG4jIFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdHN0YXR1c0NvZGU6IHN0YXR1c0NvZGVcclxuIyBcdFx0XHRib2R5OmJvZHlcclxuIyBcdFx0fVxyXG5cclxuIyBcdHZpc2l0b3JQYXJzZXIgPSAodmlzaXRvciktPlxyXG4jIFx0XHRwYXJzZWRPcHQgPSB7fVxyXG4jIFx0XHRpZiB2aXNpdG9yLnByb2plY3Rpb25cclxuIyBcdFx0XHRwYXJzZWRPcHQuZmllbGRzID0gdmlzaXRvci5wcm9qZWN0aW9uXHJcbiMgXHRcdGlmIHZpc2l0b3IuaGFzT3duUHJvcGVydHkoJ2xpbWl0JylcclxuIyBcdFx0XHRwYXJzZWRPcHQubGltaXQgPSB2aXNpdG9yLmxpbWl0XHJcblxyXG4jIFx0XHRpZiB2aXNpdG9yLmhhc093blByb3BlcnR5KCdza2lwJylcclxuIyBcdFx0XHRwYXJzZWRPcHQuc2tpcCA9IHZpc2l0b3Iuc2tpcFxyXG5cclxuIyBcdFx0aWYgdmlzaXRvci5zb3J0XHJcbiMgXHRcdFx0cGFyc2VkT3B0LnNvcnQgPSB2aXNpdG9yLnNvcnRcclxuXHJcbiMgXHRcdHBhcnNlZE9wdFxyXG4jIFx0ZGVhbFdpdGhFeHBhbmQgPSAoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIHNwYWNlSWQpLT5cclxuIyBcdFx0aWYgXy5pc0VtcHR5IGNyZWF0ZVF1ZXJ5LmluY2x1ZGVzXHJcbiMgXHRcdFx0cmV0dXJuXHJcblxyXG4jIFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpXHJcbiMgXHRcdF8uZWFjaCBjcmVhdGVRdWVyeS5pbmNsdWRlcywgKGluY2x1ZGUpLT5cclxuIyBcdFx0XHQjIGNvbnNvbGUubG9nICdpbmNsdWRlOiAnLCBpbmNsdWRlXHJcbiMgXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5ID0gaW5jbHVkZS5uYXZpZ2F0aW9uUHJvcGVydHlcclxuIyBcdFx0XHQjIGNvbnNvbGUubG9nICduYXZpZ2F0aW9uUHJvcGVydHk6ICcsIG5hdmlnYXRpb25Qcm9wZXJ0eVxyXG4jIFx0XHRcdGZpZWxkID0gb2JqLmZpZWxkc1tuYXZpZ2F0aW9uUHJvcGVydHldXHJcbiMgXHRcdFx0aWYgZmllbGQgYW5kIChmaWVsZC50eXBlIGlzICdsb29rdXAnIG9yIGZpZWxkLnR5cGUgaXMgJ21hc3Rlcl9kZXRhaWwnKVxyXG4jIFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bylcclxuIyBcdFx0XHRcdFx0ZmllbGQucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcclxuIyBcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xyXG4jIFx0XHRcdFx0XHRxdWVyeU9wdGlvbnMgPSB2aXNpdG9yUGFyc2VyKGluY2x1ZGUpXHJcbiMgXHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcgZmllbGQucmVmZXJlbmNlX3RvXHJcbiMgXHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuIyBcdFx0XHRcdFx0XHRfcm9fTkFNRV9GSUVMRF9LRVkgPSBDcmVhdG9yLmdldE9iamVjdChmaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpPy5OQU1FX0ZJRUxEX0tFWVxyXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCBlbnRpdGllcywgKGVudGl0eSwgaWR4KS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRGF0YSA9IF8uY2xvbmUoZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0pXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0bXVsdGlRdWVyeSA9IF8uZXh0ZW5kIHtfaWQ6IHskaW46IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldfX0sIGluY2x1ZGUucXVlcnlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uZmluZChtdWx0aVF1ZXJ5LCBxdWVyeU9wdGlvbnMpLmZldGNoKClcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiAhZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldLmxlbmd0aFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gb3JpZ2luYWxEYXRhXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0I+aOkuW6j1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IENyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzKGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSwgb3JpZ2luYWxEYXRhKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IF8ubWFwIGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSwgKG8pLT5cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5fbyddID0gZmllbGQucmVmZXJlbmNlX3RvXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRvWydfTkFNRV9GSUVMRF9WQUxVRSddID0gb1tfcm9fTkFNRV9GSUVMRF9LRVldXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2luZ2xlUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XX0sIGluY2x1ZGUucXVlcnlcclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0IyDnibnmrorlpITnkIblnKjnm7jlhbPooajkuK3msqHmnInmib7liLDmlbDmja7nmoTmg4XlhrXvvIzov5Tlm57ljp/mlbDmja5cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uZmluZE9uZShzaW5nbGVRdWVyeSwgcXVlcnlPcHRpb25zKSB8fCBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydyZWZlcmVuY2VfdG8uX28nXSA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydfTkFNRV9GSUVMRF9WQUxVRSddID0gZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldW19yb19OQU1FX0ZJRUxEX0tFWV1cclxuIyBcdFx0XHRcdFx0aWYgXy5pc0FycmF5IGZpZWxkLnJlZmVyZW5jZV90b1xyXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCBlbnRpdGllcywgKGVudGl0eSwgaWR4KS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XT8uaWRzXHJcbiMgXHRcdFx0XHRcdFx0XHRcdF9vID0gZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0ub1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRfcm9fTkFNRV9GSUVMRF9LRVkgPSBDcmVhdG9yLmdldE9iamVjdChfbywgc3BhY2VJZCk/Lk5BTUVfRklFTERfS0VZXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGlmIHF1ZXJ5T3B0aW9ucz8uZmllbGRzICYmIF9yb19OQU1FX0ZJRUxEX0tFWVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucy5maWVsZHNbX3JvX05BTUVfRklFTERfS0VZXSA9IDFcclxuIyBcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlVG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLm8sIHNwYWNlSWQpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZVRvQ29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRfaWRzID0gXy5jbG9uZShlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5pZHMpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRtdWx0aVF1ZXJ5ID0gXy5leHRlbmQge19pZDogeyRpbjogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0uaWRzfX0sIGluY2x1ZGUucXVlcnlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IF8ubWFwIHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kKG11bHRpUXVlcnksIHF1ZXJ5T3B0aW9ucykuZmV0Y2goKSwgKG8pLT5cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1sncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvWydyZWZlcmVuY2VfdG8uX28nXSA9IF9vXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBvW19yb19OQU1FX0ZJRUxEX0tFWV1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdCPmjpLluo9cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IENyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzKGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSwgX2lkcylcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzaW5nbGVRdWVyeSA9IF8uZXh0ZW5kIHtfaWQ6IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLmlkc1swXX0sIGluY2x1ZGUucXVlcnlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kT25lKHNpbmdsZVF1ZXJ5LCBxdWVyeU9wdGlvbnMpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydyZWZlcmVuY2VfdG8ubyddID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLl9uYW1lXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLl9vJ10gPSBfb1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bX3JvX05BTUVfRklFTERfS0VZXVxyXG5cclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdCMgVE9ET1xyXG5cclxuXHJcbiMgXHRcdHJldHVyblxyXG5cclxuIyBcdHNldE9kYXRhUHJvcGVydHk9KGVudGl0aWVzLHNwYWNlLGtleSktPlxyXG4jIFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMgPSBbXVxyXG4jIFx0XHRfLmVhY2ggZW50aXRpZXMsIChlbnRpdHksIGlkeCktPlxyXG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSB7fVxyXG4jIFx0XHRcdGlkID0gZW50aXRpZXNbaWR4XVtcIl9pZFwiXVxyXG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXNbJ0BvZGF0YS5pZCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoKHNwYWNlLGtleSkrICcoXFwnJyArIFwiI3tpZH1cIiArICdcXCcpJ1xyXG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXNbJ0BvZGF0YS5ldGFnJ10gPSBcIlcvXFxcIjA4RDU4OTcyMEJCQjNEQjFcXFwiXCJcclxuIyBcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWydAb2RhdGEuZWRpdExpbmsnXSA9IGVudGl0eV9PZGF0YVByb3BlcnRpZXNbJ0BvZGF0YS5pZCddXHJcbiMgXHRcdFx0Xy5leHRlbmQgZW50aXR5X09kYXRhUHJvcGVydGllcyxlbnRpdHlcclxuIyBcdFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMucHVzaCBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzXHJcbiMgXHRcdHJldHVybiBlbnRpdGllc19PZGF0YVByb3BlcnRpZXNcclxuXHJcbiMgXHRzZXRFcnJvck1lc3NhZ2UgPSAoc3RhdHVzQ29kZSxjb2xsZWN0aW9uLGtleSxhY3Rpb24pLT5cclxuIyBcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdGVycm9yID0ge31cclxuIyBcdFx0aW5uZXJlcnJvciA9IHt9XHJcbiMgXHRcdGlmIHN0YXR1c0NvZGUgPT0gNDA0XHJcbiMgXHRcdFx0aWYgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0aWYgYWN0aW9uID09ICdwb3N0J1xyXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9wb3N0X2ZhaWxcIilcclxuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXHJcbiMgXHRcdFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDRcclxuIyBcdFx0XHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV9wb3N0X2ZhaWxcIlxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9yZWNvcmRfcXVlcnlfZmFpbFwiKVxyXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcclxuIyBcdFx0XHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwNFxyXG4jIFx0XHRcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX3JlY29yZF9xdWVyeV9mYWlsXCJcclxuIyBcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9jb2xsZWN0aW9uX3F1ZXJ5X2ZhaWxcIikrIGtleVxyXG4jIFx0XHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXHJcbiMgXHRcdFx0XHRlcnJvclsnY29kZSddID0gNDA0XHJcbiMgXHRcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX2NvbGxlY3Rpb25fcXVlcnlfZmFpbFwiXHJcbiMgXHRcdGlmICBzdGF0dXNDb2RlID09IDQwMVxyXG4jIFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX2F1dGhlbnRpY2F0aW9uX3JlcXVpcmVkXCIpXHJcbiMgXHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXHJcbiMgXHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwMVxyXG4jIFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfYXV0aGVudGljYXRpb25fcmVxdWlyZWRcIlxyXG4jIFx0XHRpZiBzdGF0dXNDb2RlID09IDQwM1xyXG4jIFx0XHRcdHN3aXRjaCBhY3Rpb25cclxuIyBcdFx0XHRcdHdoZW4gJ2dldCcgdGhlbiBpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX2FjY2Vzc19mYWlsXCIpXHJcbiMgXHRcdFx0XHR3aGVuICdwb3N0JyB0aGVuIGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfY3JlYXRlX2ZhaWxcIilcclxuIyBcdFx0XHRcdHdoZW4gJ3B1dCcgdGhlbiBpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX3VwZGF0ZV9mYWlsXCIpXHJcbiMgXHRcdFx0XHR3aGVuICdkZWxldGUnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9yZW1vdmVfZmFpbFwiKVxyXG4jIFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfYWNjZXNzX2ZhaWxcIilcclxuIyBcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcclxuIyBcdFx0XHRlcnJvclsnY29kZSddID0gNDAzXHJcbiMgXHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV91c2VyX2FjY2Vzc19mYWlsXCJcclxuIyBcdFx0ZXJyb3JbJ2lubmVyZXJyb3InXSA9IGlubmVyZXJyb3JcclxuIyBcdFx0Ym9keVsnZXJyb3InXSA9IGVycm9yXHJcbiMgXHRcdHJldHVybiBib2R5XHJcblxyXG4jIFx0cmVtb3ZlSW52YWxpZE1ldGhvZCA9IChxdWVyeVBhcmFtcyktPlxyXG4jIFx0XHRpZiBxdWVyeVBhcmFtcy4kZmlsdGVyICYmIHF1ZXJ5UGFyYW1zLiRmaWx0ZXIuaW5kZXhPZigndG9sb3dlcignKSA+IC0xXHJcbiMgXHRcdFx0cmVtb3ZlTWV0aG9kID0gKCQxKS0+XHJcbiMgXHRcdFx0XHRyZXR1cm4gJDEucmVwbGFjZSgndG9sb3dlcignLCAnJykucmVwbGFjZSgnKScsICcnKVxyXG4jIFx0XHRcdHF1ZXJ5UGFyYW1zLiRmaWx0ZXIgPSBxdWVyeVBhcmFtcy4kZmlsdGVyLnJlcGxhY2UoL3RvbG93ZXJcXCgoW15cXCldKylcXCkvZywgcmVtb3ZlTWV0aG9kKVxyXG5cclxuIyBcdGlzU2FtZUNvbXBhbnkgPSAoc3BhY2VJZCwgdXNlcklkLCBjb21wYW55SWQsIHF1ZXJ5KS0+XHJcbiMgXHRcdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgY29tcGFueV9pZDogMSwgY29tcGFueV9pZHM6IDEgfSB9KVxyXG4jIFx0XHRpZiAhY29tcGFueUlkICYmIHF1ZXJ5XHJcbiMgXHRcdFx0Y29tcGFueUlkID0gc3UuY29tcGFueV9pZFxyXG4jIFx0XHRcdHF1ZXJ5LmNvbXBhbnlfaWQgPSB7ICRpbjogc3UuY29tcGFueV9pZHMgfVxyXG4jIFx0XHRyZXR1cm4gc3UuY29tcGFueV9pZHMuaW5jbHVkZXMoY29tcGFueUlkKVxyXG5cclxuIyBcdCMg5LiN6L+U5Zue5bey5YGH5Yig6Zmk55qE5pWw5o2uXHJcbiMgXHRleGNsdWRlRGVsZXRlZCA9IChxdWVyeSktPlxyXG4jIFx0XHRxdWVyeS5pc19kZWxldGVkID0geyAkbmU6IHRydWUgfVxyXG5cclxuIyBcdCMg5L+u5pS544CB5Yig6Zmk5pe277yM5aaC5p6cIGRvYy5zcGFjZSA9IFwiZ2xvYmFsXCLvvIzmiqXplJlcclxuIyBcdGNoZWNrR2xvYmFsUmVjb3JkID0gKGNvbGxlY3Rpb24sIGlkLCBvYmplY3QpLT5cclxuIyBcdFx0aWYgb2JqZWN0LmVuYWJsZV9zcGFjZV9nbG9iYWwgJiYgY29sbGVjdGlvbi5maW5kKHsgX2lkOiBpZCwgc3BhY2U6ICdnbG9iYWwnfSkuY291bnQoKVxyXG4jIFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuS4jeiDveS/ruaUueaIluiAheWIoOmZpOagh+WHhuWvueixoVwiKVxyXG5cclxuXHJcbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZScsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xyXG4jIFx0XHRnZXQ6ICgpLT5cclxuIyBcdFx0XHR0cnlcclxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcclxuIyBcdFx0XHRcdHNwYWNlSWQgPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcclxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDEpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBzcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdH1cclxuXHJcbiMgXHRcdFx0XHRyZW1vdmVJbnZhbGlkTWV0aG9kKEBxdWVyeVBhcmFtcylcclxuIyBcdFx0XHRcdHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShAcXVlcnlQYXJhbXMpKVxyXG4jIFx0XHRcdFx0Y3JlYXRlUXVlcnkgPSBpZiBxcyB0aGVuIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KHFzKSBlbHNlIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KClcclxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBvciAocGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzICYmIGlzU2FtZUNvbXBhbnkoc3BhY2VJZCwgQHVzZXJJZCwgY3JlYXRlUXVlcnkucXVlcnkuY29tcGFueV9pZCwgY3JlYXRlUXVlcnkucXVlcnkpKSBvciAocGVybWlzc2lvbnMuYWxsb3dSZWFkIGFuZCBAdXNlcklkKVxyXG5cclxuIyBcdFx0XHRcdFx0aWYga2V5IGlzICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcclxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVsnbWV0YWRhdGEuc3BhY2UnXSA9IHNwYWNlSWRcclxuIyBcdFx0XHRcdFx0ZWxzZSBpZiBrZXkgaXMgJ3NwYWNlcydcclxuIyBcdFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzbnQgJ2d1ZXN0J1xyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuX2lkID0gc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0aWYgc3BhY2VJZCBpc250ICdndWVzdCcgYW5kIGtleSAhPSBcInVzZXJzXCIgYW5kIGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlIGlzbnQgJ2dsb2JhbCdcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0gc3BhY2VJZFxyXG5cclxuIyBcdFx0XHRcdFx0aWYgQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlSWQpXHJcbiMgXHRcdFx0XHRcdFx0aWYgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgQHVzZXJJZClcclxuIyBcdFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnc3BhY2VzJ1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgY3JlYXRlUXVlcnkucXVlcnkuX2lkXHJcbiMgXHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZVxyXG4jIFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdHVzZXJfc3BhY2VzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZCh7dXNlcjogQHVzZXJJZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KS5mZXRjaCgpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ3NwYWNlcydcclxuIyBcdFx0XHRcdFx0XHRcdFx0IyBzcGFjZSDlr7nmiYDmnInnlKjmiLforrDlvZXkuLrlj6ror7tcclxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZFxyXG4jIFx0XHRcdFx0XHRcdFx0XHQjIGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9IHskaW46IF8ucGx1Y2sodXNlcl9zcGFjZXMsICdzcGFjZScpfVxyXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IHskaW46IF8ucGx1Y2sodXNlcl9zcGFjZXMsICdzcGFjZScpfVxyXG5cclxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnNvcnQgb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5zb3J0KVxyXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnNvcnQgPSB7IG1vZGlmaWVkOiAtMSB9XHJcbiMgXHRcdFx0XHRcdGlzX2VudGVycHJpc2UgPSBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlSWQsXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIpXHJcbiMgXHRcdFx0XHRcdGlzX3Byb2Zlc3Npb25hbCA9IFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oc3BhY2VJZCxcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiKVxyXG4jIFx0XHRcdFx0XHRpc19zdGFuZGFyZCA9IFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oc3BhY2VJZCxcIndvcmtmbG93LnN0YW5kYXJkXCIpXHJcbiMgXHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LmxpbWl0XHJcbiMgXHRcdFx0XHRcdFx0bGltaXQgPSBjcmVhdGVRdWVyeS5saW1pdFxyXG4jIFx0XHRcdFx0XHRcdGlmIGlzX2VudGVycHJpc2UgYW5kIGxpbWl0PjEwMDAwMFxyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMDBcclxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3Byb2Zlc3Npb25hbCBhbmQgbGltaXQ+MTAwMDAgYW5kICFpc19lbnRlcnByaXNlXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDAwXHJcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBpc19zdGFuZGFyZCBhbmQgbGltaXQ+MTAwMCBhbmQgIWlzX3Byb2Zlc3Npb25hbCBhbmQgIWlzX2VudGVycHJpc2VcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMFxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0aWYgaXNfZW50ZXJwcmlzZVxyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMDBcclxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3Byb2Zlc3Npb25hbCBhbmQgIWlzX2VudGVycHJpc2VcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMDBcclxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3N0YW5kYXJkIGFuZCAhaXNfZW50ZXJwcmlzZSBhbmQgIWlzX3Byb2Zlc3Npb25hbFxyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwXHJcbiMgXHRcdFx0XHRcdHVucmVhZGFibGVfZmllbGRzID0gcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgfHwgW11cclxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkucHJvamVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdHByb2plY3Rpb24gPSB7fVxyXG4jIFx0XHRcdFx0XHRcdF8ua2V5cyhjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKS5mb3JFYWNoIChrZXkpLT5cclxuIyBcdFx0XHRcdFx0XHRcdGlmIF8uaW5kZXhPZih1bnJlYWRhYmxlX2ZpZWxkcywga2V5KSA8IDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0I2lmIG5vdCAoKGZpZWxkc1trZXldPy50eXBlID09ICdsb29rdXAnIG9yIGZpZWxkc1trZXldPy50eXBlID09ICdtYXN0ZXJfZGV0YWlsJykgYW5kIGZpZWxkc1trZXldLm11bHRpcGxlKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0aW9uW2tleV0gPSAxXHJcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbiA9IHByb2plY3Rpb25cclxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKVxyXG4jIFx0XHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGtleSwgc3BhY2VJZCwgQHVzZXJJZClcclxuIyBcdFx0XHRcdFx0XHRmaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpLmZpZWxkc1xyXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCByZWFkYWJsZV9maWVsZHMsIChmaWVsZCktPlxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaW5kZXhPZignJCcpIDwgMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHQjaWYgZmllbGRzW2ZpZWxkXT8ubXVsdGlwbGUhPSB0cnVlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25bZmllbGRdID0gMVxyXG4jIFx0XHRcdFx0XHRpZiBub3QgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xyXG4jIFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfc2hhcmVcclxuIyBcdFx0XHRcdFx0XHRcdCMg5ruh6Laz5YWx5Lqr6KeE5YiZ5Lit55qE6K6w5b2V5Lmf6KaB5pCc57Si5Ye65p2lXHJcbiMgXHRcdFx0XHRcdFx0XHRkZWxldGUgY3JlYXRlUXVlcnkucXVlcnkub3duZXJcclxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcyA9IFtdXHJcbiMgXHRcdFx0XHRcdFx0XHRvcmdzID0gU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyhzcGFjZUlkLCBAdXNlcklkLCB0cnVlKVxyXG4jIFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2gge1wib3duZXJcIjogQHVzZXJJZH1cclxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHsgXCJzaGFyaW5nLnVcIjogQHVzZXJJZCB9XHJcbiMgXHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7IFwic2hhcmluZy5vXCI6IHsgJGluOiBvcmdzIH0gfVxyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbXCIkb3JcIl0gPSBzaGFyZXNcclxuIyBcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5vd25lciA9IEB1c2VySWRcclxuIyBcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxyXG5cclxuIyBcdFx0XHRcdFx0ZXhjbHVkZURlbGV0ZWQoY3JlYXRlUXVlcnkucXVlcnkpXHJcblxyXG4jIFx0XHRcdFx0XHRpZiBAcXVlcnlQYXJhbXMuJHRvcCBpc250ICcwJ1xyXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LCB2aXNpdG9yUGFyc2VyKGNyZWF0ZVF1ZXJ5KSkuZmV0Y2goKVxyXG4jIFx0XHRcdFx0XHRzY2FubmVkQ291bnQgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnkse2ZpZWxkczp7X2lkOiAxfX0pLmNvdW50KClcclxuIyBcdFx0XHRcdFx0aWYgZW50aXRpZXNcclxuIyBcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgZW50aXRpZXMsIGtleSwgc3BhY2VJZClcclxuIyBcdFx0XHRcdFx0XHQjc2Nhbm5lZENvdW50ID0gZW50aXRpZXMubGVuZ3RoXHJcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKHNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0I1x0Ym9keVsnQG9kYXRhLm5leHRMaW5rJ10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGgoc3BhY2VJZCxrZXkpK1wiPyUyNHNraXA9XCIrIDEwXHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvdW50J10gPSBzY2FubmVkQ291bnRcclxuIyBcdFx0XHRcdFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLHNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzXHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LFwiZ2V0XCIpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRjYXRjaCBlXHJcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxyXG5cclxuIyBcdFx0cG9zdDogKCktPlxyXG4jIFx0XHRcdHRyeVxyXG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxyXG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZCk/LmVuYWJsZV9hcGlcclxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDEpXHJcbiMgXHRcdFx0XHR9XHJcblxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIHNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6c2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXHJcbiMgXHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCdcclxuIyBcdFx0XHRcdFx0XHRkZWxldGUgQGJvZHlQYXJhbXMuc3BhY2VcclxuIyBcdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xyXG4jIFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcclxuIyBcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxyXG4jIFx0XHRcdFx0XHRpZiBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdFx0XHRlbnRpdGllcy5wdXNoIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xyXG4jIFx0XHRcdFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLHNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXR5X09kYXRhUHJvcGVydGllc1xyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcbiMgXHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0Y2F0Y2ggZVxyXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcclxuXHJcbiMgXHR9KVxyXG4jIFx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCc6b2JqZWN0X25hbWUvcmVjZW50Jywge2F1dGhSZXF1aXJlZDogdHJ1ZSwgc3BhY2VSZXF1aXJlZDogZmFsc2V9LCB7XHJcbiMgXHRcdGdldDooKS0+XHJcbiMgXHRcdFx0dHJ5XHJcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXHJcbiMgXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19jb2xsZWN0aW9uID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcIm9iamVjdF9yZWNlbnRfdmlld2VkXCJdXHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3NlbGVjdG9yID0ge1wicmVjb3JkLm9cIjprZXksY3JlYXRlZF9ieTpAdXNlcklkfVxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19vcHRpb25zID0ge31cclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfb3B0aW9ucy5zb3J0ID0ge2NyZWF0ZWQ6IC0xfVxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19vcHRpb25zLmZpZWxkcyA9IHtyZWNvcmQ6MX1cclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3JkcyA9IHJlY2VudF92aWV3X2NvbGxlY3Rpb24uZmluZChyZWNlbnRfdmlld19zZWxlY3RvcixyZWNlbnRfdmlld19vcHRpb25zKS5mZXRjaCgpXHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy5wbHVjayhyZWNlbnRfdmlld19yZWNvcmRzLCdyZWNvcmQnKVxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IHJlY2VudF92aWV3X3JlY29yZHNfaWRzLmdldFByb3BlcnR5KFwiaWRzXCIpXHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy5mbGF0dGVuKHJlY2VudF92aWV3X3JlY29yZHNfaWRzKVxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IF8udW5pcShyZWNlbnRfdmlld19yZWNvcmRzX2lkcylcclxuIyBcdFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXHJcbiMgXHRcdFx0XHRcdHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShAcXVlcnlQYXJhbXMpKVxyXG4jIFx0XHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxyXG4jIFx0XHRcdFx0XHRpZiBrZXkgaXMgJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xyXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5WydtZXRhZGF0YS5zcGFjZSddID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkubGltaXRcclxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMFxyXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5saW1pdCBhbmQgcmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMubGVuZ3RoPmNyZWF0ZVF1ZXJ5LmxpbWl0XHJcbiMgXHRcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSBfLmZpcnN0KHJlY2VudF92aWV3X3JlY29yZHNfaWRzLGNyZWF0ZVF1ZXJ5LmxpbWl0KVxyXG4jIFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5faWQgPSB7JGluOnJlY2VudF92aWV3X3JlY29yZHNfaWRzfVxyXG4jIFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXHJcbiMgXHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRwcm9qZWN0aW9uID0ge31cclxuIyBcdFx0XHRcdFx0XHRfLmtleXMoY3JlYXRlUXVlcnkucHJvamVjdGlvbikuZm9yRWFjaCAoa2V5KS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBfLmluZGV4T2YodW5yZWFkYWJsZV9maWVsZHMsIGtleSkgPCAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdCMgaWYgbm90ICgoZmllbGRzW2tleV0/LnR5cGUgPT0gJ2xvb2t1cCcgb3IgZmllbGRzW2tleV0/LnR5cGUgPT0gJ21hc3Rlcl9kZXRhaWwnKSBhbmQgZmllbGRzW2tleV0ubXVsdGlwbGUpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHByb2plY3Rpb25ba2V5XSA9IDFcclxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uID0gcHJvamVjdGlvblxyXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkucHJvamVjdGlvbiBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pXHJcbiMgXHRcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQpXHJcbiMgXHRcdFx0XHRcdFx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpLmZpZWxkc1xyXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCByZWFkYWJsZV9maWVsZHMsIChmaWVsZCktPlxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaW5kZXhPZignJCcpIDwgMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHQjaWYgZmllbGRzW2ZpZWxkXT8ubXVsdGlwbGUhPSB0cnVlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25bZmllbGRdID0gMVxyXG5cclxuIyBcdFx0XHRcdFx0ZXhjbHVkZURlbGV0ZWQoY3JlYXRlUXVlcnkucXVlcnkpXHJcblxyXG4jIFx0XHRcdFx0XHRpZiBAcXVlcnlQYXJhbXMuJHRvcCBpc250ICcwJ1xyXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LCB2aXNpdG9yUGFyc2VyKGNyZWF0ZVF1ZXJ5KSkuZmV0Y2goKVxyXG4jIFx0XHRcdFx0XHRlbnRpdGllc19pbmRleCA9IFtdXHJcbiMgXHRcdFx0XHRcdGVudGl0aWVzX2lkcyA9IF8ucGx1Y2soZW50aXRpZXMsJ19pZCcpXHJcbiMgXHRcdFx0XHRcdHNvcnRfZW50aXRpZXMgPSBbXVxyXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkuc29ydCBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnNvcnQpXHJcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY2VudF92aWV3X3JlY29yZHNfaWRzICwocmVjZW50X3ZpZXdfcmVjb3Jkc19pZCktPlxyXG4jIFx0XHRcdFx0XHRcdFx0aW5kZXggPSBfLmluZGV4T2YoZW50aXRpZXNfaWRzLHJlY2VudF92aWV3X3JlY29yZHNfaWQpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBpbmRleD4tMVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzb3J0X2VudGl0aWVzLnB1c2ggZW50aXRpZXNbaW5kZXhdXHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRzb3J0X2VudGl0aWVzID0gZW50aXRpZXNcclxuIyBcdFx0XHRcdFx0aWYgc29ydF9lbnRpdGllc1xyXG4jIFx0XHRcdFx0XHRcdGRlYWxXaXRoRXhwYW5kKGNyZWF0ZVF1ZXJ5LCBzb3J0X2VudGl0aWVzLCBrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdCNcdGJvZHlbJ0BvZGF0YS5uZXh0TGluayddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCxrZXkpK1wiPyUyNHNraXA9XCIrIDEwXHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvdW50J10gPSBzb3J0X2VudGl0aWVzLmxlbmd0aFxyXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzX09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoc29ydF9lbnRpdGllcyxAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzXHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSwnZ2V0JylcclxuIyBcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0Y2F0Y2ggZVxyXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcclxuIyB9KVxyXG5cclxuIyBcdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnOm9iamVjdF9uYW1lLzpfaWQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcclxuIyBcdFx0cG9zdDogKCktPlxyXG4jIFx0XHRcdHRyeVxyXG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxyXG4jIFx0XHRcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKT8uZW5hYmxlX2FwaVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxyXG4jIFx0XHRcdFx0XHRAYm9keVBhcmFtcy5zcGFjZSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXHJcbiMgXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxyXG4jIFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXHJcbiMgXHRcdFx0XHRcdGlmIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzLnB1c2ggZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcclxuIyBcdFx0XHRcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXR5X09kYXRhUHJvcGVydGllc1xyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcbiMgXHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0Y2F0Y2ggZVxyXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcclxuIyBcdFx0Z2V0OigpLT5cclxuIyBcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXHJcbiMgXHRcdFx0aWYga2V5LmluZGV4T2YoXCIoXCIpID4gLTFcclxuIyBcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uSW5mbyA9IGtleVxyXG4jIFx0XHRcdFx0ZmllbGROYW1lID0gQHVybFBhcmFtcy5faWQuc3BsaXQoJ19leHBhbmQnKVswXVxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbkluZm9TcGxpdCA9IGNvbGxlY3Rpb25JbmZvLnNwbGl0KCcoJylcclxuIyBcdFx0XHRcdGNvbGxlY3Rpb25OYW1lID0gY29sbGVjdGlvbkluZm9TcGxpdFswXVxyXG4jIFx0XHRcdFx0aWQgPSBjb2xsZWN0aW9uSW5mb1NwbGl0WzFdLnNwbGl0KCdcXCcnKVsxXVxyXG5cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUsIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGZpZWxkc09wdGlvbnMgPSB7fVxyXG4jIFx0XHRcdFx0ZmllbGRzT3B0aW9uc1tmaWVsZE5hbWVdID0gMVxyXG4jIFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHtfaWQ6IGlkfSwge2ZpZWxkczogZmllbGRzT3B0aW9uc30pXHJcblxyXG4jIFx0XHRcdFx0ZmllbGRWYWx1ZSA9IG51bGxcclxuIyBcdFx0XHRcdGlmIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRmaWVsZFZhbHVlID0gZW50aXR5W2ZpZWxkTmFtZV1cclxuXHJcbiMgXHRcdFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChjb2xsZWN0aW9uTmFtZSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0ZmllbGQgPSBvYmouZmllbGRzW2ZpZWxkTmFtZV1cclxuXHJcbiMgXHRcdFx0XHRpZiBmaWVsZCBhbmQgZmllbGRWYWx1ZSBhbmQgKGZpZWxkLnR5cGUgaXMgJ2xvb2t1cCcgb3IgZmllbGQudHlwZSBpcyAnbWFzdGVyX2RldGFpbCcpXHJcbiMgXHRcdFx0XHRcdGxvb2t1cENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvLCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucyA9IHtmaWVsZHM6IHt9fVxyXG4jIFx0XHRcdFx0XHRyZWFkYWJsZV9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhmaWVsZC5yZWZlcmVuY2VfdG8sIEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZClcclxuIyBcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGYpLT5cclxuIyBcdFx0XHRcdFx0XHRpZiBmLmluZGV4T2YoJyQnKSA8IDBcclxuIyBcdFx0XHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucy5maWVsZHNbZl0gPSAxXHJcblxyXG4jIFx0XHRcdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG4jIFx0XHRcdFx0XHRcdHZhbHVlcyA9IFtdXHJcbiMgXHRcdFx0XHRcdFx0bG9va3VwQ29sbGVjdGlvbi5maW5kKHtfaWQ6IHskaW46IGZpZWxkVmFsdWV9fSwgcXVlcnlPcHRpb25zKS5mb3JFYWNoIChvYmopLT5cclxuIyBcdFx0XHRcdFx0XHRcdF8uZWFjaCBvYmosICh2LCBrKS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheSh2KSB8fCAoXy5pc09iamVjdCh2KSAmJiAhXy5pc0RhdGUodikpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0b2JqW2tdID0gSlNPTi5zdHJpbmdpZnkodilcclxuIyBcdFx0XHRcdFx0XHRcdHZhbHVlcy5wdXNoKG9iailcclxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gdmFsdWVzXHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoQHVybFBhcmFtcy5zcGFjZUlkKSArIFwiIyN7Y29sbGVjdGlvbkluZm99LyN7QHVybFBhcmFtcy5faWR9XCJcclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdGJvZHkgPSBsb29rdXBDb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogZmllbGRWYWx1ZX0sIHF1ZXJ5T3B0aW9ucykgfHwge31cclxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggYm9keSwgKHYsIGspLT5cclxuIyBcdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheSh2KSB8fCAoXy5pc09iamVjdCh2KSAmJiAhXy5pc0RhdGUodikpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHlba10gPSBKU09OLnN0cmluZ2lmeSh2KVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCkgKyBcIiMje2ZpZWxkLnJlZmVyZW5jZV90b30vJGVudGl0eVwiXHJcblxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zLnNwYWNlSWQpICsgXCIjI3tjb2xsZWN0aW9uSW5mb30vI3tAdXJsUGFyYW1zLl9pZH1cIlxyXG4jIFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZmllbGRWYWx1ZVxyXG5cclxuIyBcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuXHJcbiMgXHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cclxuIyBcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHR0cnlcclxuIyBcdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcclxuIyBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG5cclxuIyBcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcclxuIyBcdFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXHJcbiMgXHRcdFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXHJcbiMgXHRcdFx0XHRcdFx0cXMgPSBkZWNvZGVVUklDb21wb25lbnQocXVlcnlzdHJpbmcuc3RyaW5naWZ5KEBxdWVyeVBhcmFtcykpXHJcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkgPSBpZiBxcyB0aGVuIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KHFzKSBlbHNlIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KClcclxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5faWQgPSAgQHVybFBhcmFtcy5faWRcclxuIyBcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGtleSAhPSAnc3BhY2VzJ1xyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSAgQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxyXG4jIFx0XHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRcdHByb2plY3Rpb24gPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0Xy5rZXlzKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pLmZvckVhY2ggKGtleSktPlxyXG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluZGV4T2YodW5yZWFkYWJsZV9maWVsZHMsIGtleSkgPCAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0IyBpZiBub3QgKChmaWVsZHNba2V5XT8udHlwZSA9PSAnbG9va3VwJyBvciBmaWVsZHNba2V5XT8udHlwZSA9PSAnbWFzdGVyX2RldGFpbCcpIGFuZCBmaWVsZHNba2V5XS5tdWx0aXBsZSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0aW9uW2tleV0gPSAxXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uID0gcHJvamVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uIG9yICFfLnNpemUoY3JlYXRlUXVlcnkucHJvamVjdGlvbilcclxuIyBcdFx0XHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkKVxyXG4jIFx0XHRcdFx0XHRcdFx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xyXG4jIFx0XHRcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGZpZWxkKSAtPlxyXG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pbmRleE9mKCckJykgPCAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbltmaWVsZF0gPSAxXHJcbiMgXHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LHZpc2l0b3JQYXJzZXIoY3JlYXRlUXVlcnkpKVxyXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzID0gW11cclxuIyBcdFx0XHRcdFx0XHRpZiBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRcdGlzQWxsb3dlZCA9IGVudGl0eS5vd25lciA9PSBAdXNlcklkIG9yIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIG9yIChwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgJiYgaXNTYW1lQ29tcGFueShAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGVudGl0eS5jb21wYW55X2lkKSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfc2hhcmUgYW5kICFpc0FsbG93ZWRcclxuIyBcdFx0XHRcdFx0XHRcdFx0c2hhcmVzID0gW11cclxuIyBcdFx0XHRcdFx0XHRcdFx0b3JncyA9IFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCB0cnVlKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7IFwic2hhcmluZy51XCI6IEB1c2VySWQgfVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7IFwic2hhcmluZy5vXCI6IHsgJGluOiBvcmdzIH0gfVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRpc0FsbG93ZWQgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IEB1cmxQYXJhbXMuX2lkLCBcIiRvclwiOiBzaGFyZXMgfSwgeyBmaWVsZHM6IHsgX2lkOiAxIH0gfSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIGlzQWxsb3dlZFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzLnB1c2ggZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGRlYWxXaXRoRXhwYW5kKGNyZWF0ZVF1ZXJ5LCBlbnRpdGllcywga2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRfLmV4dGVuZCBib2R5LGVudGl0eV9PZGF0YVByb3BlcnRpZXNbMF1cclxuIyBcdFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxyXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwnZ2V0JylcclxuIyBcdFx0XHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ2dldCcpXHJcbiMgXHRcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ2dldCcpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0Y2F0Y2ggZVxyXG4jIFx0XHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxyXG5cclxuIyBcdFx0cHV0OigpLT5cclxuIyBcdFx0XHR0cnlcclxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcclxuIyBcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcclxuIyBcdFx0XHRcdFx0fVxyXG5cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdGlmIGtleSA9PSBcInVzZXJzXCJcclxuIyBcdFx0XHRcdFx0cmVjb3JkX293bmVyID0gQHVybFBhcmFtcy5faWRcclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0cmVjb3JkX293bmVyID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiBAdXJsUGFyYW1zLl9pZCB9LCB7IGZpZWxkczogeyBvd25lcjogMSB9IH0pPy5vd25lclxyXG5cclxuIyBcdFx0XHRcdGNvbXBhbnlJZCA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogQHVybFBhcmFtcy5faWQgfSwgeyBmaWVsZHM6IHsgY29tcGFueV9pZDogMSB9IH0pPy5jb21wYW55X2lkXHJcblxyXG4jIFx0XHRcdFx0aXNBbGxvd2VkID0gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBvciAocGVybWlzc2lvbnMuYWxsb3dFZGl0IGFuZCByZWNvcmRfb3duZXIgPT0gQHVzZXJJZCApIG9yIChwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyAmJiBpc1NhbWVDb21wYW55KHNwYWNlSWQsIEB1c2VySWQsIGNvbXBhbnlJZCkpXHJcbiMgXHRcdFx0XHRpZiBpc0FsbG93ZWRcclxuIyBcdFx0XHRcdFx0Y2hlY2tHbG9iYWxSZWNvcmQoY29sbGVjdGlvbiwgQHVybFBhcmFtcy5faWQsIG9iamVjdClcclxuIyBcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLl9pZCwgc3BhY2U6IHNwYWNlSWR9XHJcbiMgXHRcdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0JyBvciBzcGFjZUlkIGlzICdjb21tb24nIG9yIGtleSA9PSBcInVzZXJzXCJcclxuIyBcdFx0XHRcdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcclxuIyBcdFx0XHRcdFx0ZmllbGRzX2VkaXRhYmxlID0gdHJ1ZVxyXG4jIFx0XHRcdFx0XHRfLmtleXMoQGJvZHlQYXJhbXMuJHNldCkuZm9yRWFjaCAoa2V5KS0+XHJcbiMgXHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBrZXkpID4gLTFcclxuIyBcdFx0XHRcdFx0XHRcdGZpZWxkc19lZGl0YWJsZSA9IGZhbHNlXHJcbiMgXHRcdFx0XHRcdGlmIGZpZWxkc19lZGl0YWJsZVxyXG4jIFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnc3BhY2VzJ1xyXG4jIFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXHJcbiMgXHRcdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsIEBib2R5UGFyYW1zXHJcbiMgXHRcdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXHJcbiMgXHRcdFx0XHRcdFx0XHQjc3RhdHVzQ29kZTogMjAxXHJcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLl9pZFxyXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdGllcyA9IFtdXHJcbiMgXHRcdFx0XHRcdFx0XHQjIGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXRpZXMucHVzaCBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRcdCMgYm9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKHNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXHJcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLHNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdCMgXy5leHRlbmQgYm9keSxlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWzBdXHJcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcbiMgXHRcdFx0XHRcdFx0XHR7aGVhZGVyczogaGVhZGVycyxib2R5OmJvZHl9XHJcbiMgXHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncHV0JylcclxuIyBcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdwdXQnKVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0Y2F0Y2ggZVxyXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcclxuIyBcdFx0ZGVsZXRlOigpLT5cclxuIyBcdFx0XHR0cnlcclxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcclxuIyBcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcclxuIyBcdFx0XHRcdFx0XHR9XHJcblxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRyZWNvcmREYXRhID0gY29sbGVjdGlvbi5maW5kT25lKHtfaWQ6IEB1cmxQYXJhbXMuX2lkfSwgeyBmaWVsZHM6IHsgb3duZXI6IDEsIGNvbXBhbnlfaWQ6IDEgfSB9KVxyXG4jIFx0XHRcdFx0cmVjb3JkX293bmVyID0gcmVjb3JkRGF0YT8ub3duZXJcclxuIyBcdFx0XHRcdGNvbXBhbnlJZCA9IHJlY29yZERhdGE/LmNvbXBhbnlfaWRcclxuIyBcdFx0XHRcdGlzQWxsb3dlZCA9IChwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSkgb3IgKHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSBhbmQgaXNTYW1lQ29tcGFueShzcGFjZUlkLCBAdXNlcklkLCBjb21wYW55SWQpKSBvciAocGVybWlzc2lvbnMuYWxsb3dEZWxldGUgYW5kIHJlY29yZF9vd25lcj09QHVzZXJJZCApXHJcbiMgXHRcdFx0XHRpZiBpc0FsbG93ZWRcclxuIyBcdFx0XHRcdFx0Y2hlY2tHbG9iYWxSZWNvcmQoY29sbGVjdGlvbiwgQHVybFBhcmFtcy5faWQsIG9iamVjdClcclxuIyBcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLl9pZCwgc3BhY2U6IHNwYWNlSWR9XHJcbiMgXHRcdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0J1xyXG4jIFx0XHRcdFx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxyXG5cclxuIyBcdFx0XHRcdFx0aWYgb2JqZWN0Py5lbmFibGVfdHJhc2hcclxuIyBcdFx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xyXG4jIFx0XHRcdFx0XHRcdFx0JHNldDoge1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRpc19kZWxldGVkOiB0cnVlLFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGVkOiBuZXcgRGF0ZSgpLFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGVkX2J5OiBAdXNlcklkXHJcbiMgXHRcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRcdFx0fSlcclxuIyBcdFx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcbiMgXHRcdFx0XHRcdFx0XHR7aGVhZGVyczogaGVhZGVycyxib2R5OmJvZHl9XHJcbiMgXHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXHJcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdGllcy5wdXNoIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdFx0IyBib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcclxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0IyBfLmV4dGVuZCBib2R5LGVudGl0eV9PZGF0YVByb3BlcnRpZXNbMF1cclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuIyBcdFx0XHRcdFx0XHRcdHtoZWFkZXJzOiBoZWFkZXJzLGJvZHk6Ym9keX1cclxuIyBcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRjYXRjaCBlXHJcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxyXG4jIFx0fSlcclxuXHJcbiMgXHQjIF9pZOWPr+S8oGFsbFxyXG4jIFx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCc6b2JqZWN0X25hbWUvOl9pZC86bWV0aG9kTmFtZScsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xyXG4jIFx0XHRwb3N0OiAoKS0+XHJcbiMgXHRcdFx0dHJ5XHJcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXHJcbiMgXHRcdFx0XHRpZiBub3QgQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpPy5lbmFibGVfYXBpXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdH1cclxuXHJcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcclxuIyBcdFx0XHRcdFx0bWV0aG9kTmFtZSA9IEB1cmxQYXJhbXMubWV0aG9kTmFtZVxyXG4jIFx0XHRcdFx0XHRtZXRob2RzID0gQ3JlYXRvci5PYmplY3RzW2tleV0/Lm1ldGhvZHMgfHwge31cclxuIyBcdFx0XHRcdFx0aWYgbWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShtZXRob2ROYW1lKVxyXG4jIFx0XHRcdFx0XHRcdHRoaXNPYmogPSB7XHJcbiMgXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZToga2V5XHJcbiMgXHRcdFx0XHRcdFx0XHRyZWNvcmRfaWQ6IEB1cmxQYXJhbXMuX2lkXHJcbiMgXHRcdFx0XHRcdFx0XHRzcGFjZV9pZDogQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRcdFx0XHR1c2VyX2lkOiBAdXNlcklkXHJcbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9uczogcGVybWlzc2lvbnNcclxuIyBcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJuIG1ldGhvZHNbbWV0aG9kTmFtZV0uYXBwbHkodGhpc09iaiwgW0Bib2R5UGFyYW1zXSkgfHwge31cclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRjYXRjaCBlXHJcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxyXG5cclxuIyBcdH0pXHJcblxyXG4jIFx0I1RPRE8gcmVtb3ZlXHJcbiMgXHRfLmVhY2ggW10sICh2YWx1ZSwga2V5LCBsaXN0KS0+ICNDcmVhdG9yLkNvbGxlY3Rpb25zXHJcbiMgXHRcdGlmIG5vdCBDcmVhdG9yLmdldE9iamVjdChrZXkpPy5lbmFibGVfYXBpXHJcbiMgXHRcdFx0cmV0dXJuXHJcblxyXG4jIFx0XHRpZiBTdGVlZG9zT2RhdGFBUElcclxuXHJcbiMgXHRcdFx0U3RlZWRvc09kYXRhQVBJLmFkZENvbGxlY3Rpb24gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSksXHJcbiMgXHRcdFx0XHRleGNsdWRlZEVuZHBvaW50czogW11cclxuIyBcdFx0XHRcdHJvdXRlT3B0aW9uczpcclxuIyBcdFx0XHRcdFx0YXV0aFJlcXVpcmVkOiB0cnVlXHJcbiMgXHRcdFx0XHRcdHNwYWNlUmVxdWlyZWQ6IGZhbHNlXHJcbiMgXHRcdFx0XHRlbmRwb2ludHM6XHJcbiMgXHRcdFx0XHRcdGdldEFsbDpcclxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XHJcbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLmFsbG93UmVhZCBhbmQgQHVzZXJJZClcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRyZW1vdmVJbnZhbGlkTWV0aG9kKEBxdWVyeVBhcmFtcylcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBub3QgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHNcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Lm93bmVyID0gQHVzZXJJZFxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgQHF1ZXJ5UGFyYW1zLiR0b3AgaXNudCAnMCdcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LCB2aXNpdG9yUGFyc2VyKGNyZWF0ZVF1ZXJ5KSkuZmV0Y2goKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNjYW5uZWRDb3VudCA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSkuY291bnQoKVxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdGllc1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVhbFdpdGhFeHBhbmQoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvdW50J10gPSBzY2FubmVkQ291bnRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdGllc1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cclxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cclxuIyBcdFx0XHRcdFx0cG9zdDpcclxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XHJcbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gQHNwYWNlSWRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgdmFsdWU6IGVudGl0eX1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxyXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxyXG4jIFx0XHRcdFx0XHRnZXQ6XHJcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxyXG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dSZWFkXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkLCBzcGFjZTogQHNwYWNlSWR9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIHZhbHVlOiBlbnRpdHl9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcbiMgXHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XHJcbiMgXHRcdFx0XHRcdHB1dDpcclxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XHJcbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0VkaXRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWQsIHNwYWNlOiBAc3BhY2VJZH1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIHZhbHVlOiBlbnRpdHl9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcbiMgXHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XHJcbiMgXHRcdFx0XHRcdGRlbGV0ZTpcclxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XHJcbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZCwgc3BhY2U6IEBzcGFjZUlkfVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIsIE1ldGVvck9EYXRhUm91dGVyLCBPRGF0YVJvdXRlciwgYXBwLCBleHByZXNzO1xuICBNZXRlb3JPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5NZXRlb3JPRGF0YVJvdXRlcjtcbiAgT0RhdGFSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuT0RhdGFSb3V0ZXI7XG4gIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG4gIGFwcCA9IGV4cHJlc3MoKTtcbiAgYXBwLnVzZSgnL2FwaS9vZGF0YS92NCcsIE1ldGVvck9EYXRhUm91dGVyKTtcbiAgTWV0ZW9yT0RhdGFBUElWNFJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5NZXRlb3JPRGF0YUFQSVY0Um91dGVyO1xuICBpZiAoTWV0ZW9yT0RhdGFBUElWNFJvdXRlcikge1xuICAgIGFwcC51c2UoJy9hcGkvdjQnLCBNZXRlb3JPRGF0YUFQSVY0Um91dGVyKTtcbiAgfVxuICBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShhcHApO1xuICByZXR1cm4gXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgdmFyIG90aGVyQXBwO1xuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIG90aGVyQXBwID0gZXhwcmVzcygpO1xuICAgICAgb3RoZXJBcHAudXNlKFwiL2FwaS9vZGF0YS9cIiArIG5hbWUsIE9EYXRhUm91dGVyKTtcbiAgICAgIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShvdGhlckFwcCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxyXG5cclxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpXHJcblxyXG5hdXRob3JpemF0aW9uQ2FjaGUgPSB7fVxyXG5cclxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSAnL2FwaS9vZGF0YS92NC8nLCAocmVxLCByZXMsIG5leHQpLT5cclxuXHJcblx0RmliZXIoKCktPlxyXG5cdFx0aWYgIXJlcS51c2VySWRcclxuXHRcdFx0aXNBdXRoZWQgPSBmYWxzZVxyXG5cdFx0XHQjIG9hdXRoMumqjOivgVxyXG5cdFx0XHRpZiByZXE/LnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnT0F1dGgyOiAnLCByZXEucXVlcnkuYWNjZXNzX3Rva2VuXHJcblx0XHRcdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4ocmVxLnF1ZXJ5LmFjY2Vzc190b2tlbilcclxuXHRcdFx0XHRpZiB1c2VySWRcclxuXHRcdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cdFx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcclxuXHRcdFx0IyBiYXNpY+mqjOivgVxyXG5cdFx0XHRpZiByZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddXHJcblx0XHRcdFx0YXV0aCA9IGJhc2ljQXV0aC5wYXJzZShyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKVxyXG5cdFx0XHRcdGlmIGF1dGhcclxuXHRcdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7dXNlcm5hbWU6IGF1dGgubmFtZX0sIHsgZmllbGRzOiB7ICdzZXJ2aWNlcyc6IDEgfSB9KVxyXG5cdFx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0XHRpZiBhdXRob3JpemF0aW9uQ2FjaGVbYXV0aC5uYW1lXSA9PSBhdXRoLnBhc3NcclxuXHRcdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIGF1dGgucGFzc1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdGlmICFyZXN1bHQuZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRcdGlzQXV0aGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgXy5rZXlzKGF1dGhvcml6YXRpb25DYWNoZSkubGVuZ3RoID4gMTAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdGF1dGhvcml6YXRpb25DYWNoZSA9IHt9XHJcblx0XHRcdFx0XHRcdFx0XHRhdXRob3JpemF0aW9uQ2FjaGVbYXV0aC5uYW1lXSA9IGF1dGgucGFzc1xyXG5cdFx0XHRpZiBpc0F1dGhlZFxyXG5cdFx0XHRcdHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSA9IHVzZXIuX2lkXHJcblx0XHRcdFx0dG9rZW4gPSBudWxsXHJcblx0XHRcdFx0YXBwX2lkID0gXCJjcmVhdG9yXCJcclxuXHRcdFx0XHRjbGllbnRfaWQgPSBcInBjXCJcclxuXHRcdFx0XHRsb2dpblRva2VucyA9IHVzZXIuc2VydmljZXM/LnJlc3VtZT8ubG9naW5Ub2tlbnNcclxuXHRcdFx0XHRpZiBsb2dpblRva2Vuc1xyXG5cdFx0XHRcdFx0YXBwX2xvZ2luX3Rva2VuID0gXy5maW5kKGxvZ2luVG9rZW5zLCAodCktPlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdC5hcHBfaWQgaXMgYXBwX2lkIGFuZCB0LmNsaWVudF9pZCBpcyBjbGllbnRfaWRcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdHRva2VuID0gYXBwX2xvZ2luX3Rva2VuLnRva2VuIGlmIGFwcF9sb2dpbl90b2tlblxyXG5cclxuXHRcdFx0XHRpZiBub3QgdG9rZW5cclxuXHRcdFx0XHRcdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcclxuXHRcdFx0XHRcdHRva2VuID0gYXV0aFRva2VuLnRva2VuXHJcblx0XHRcdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxyXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4uYXBwX2lkID0gYXBwX2lkXHJcblx0XHRcdFx0XHRoYXNoZWRUb2tlbi5jbGllbnRfaWQgPSBjbGllbnRfaWRcclxuXHRcdFx0XHRcdGhhc2hlZFRva2VuLnRva2VuID0gdG9rZW5cclxuXHRcdFx0XHRcdEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIHVzZXIuX2lkLCBoYXNoZWRUb2tlblxyXG5cclxuXHRcdFx0XHRpZiB0b2tlblxyXG5cdFx0XHRcdFx0cmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddID0gdG9rZW5cclxuXHRcdG5leHQoKVxyXG5cdCkucnVuKClcclxuIiwidmFyIEZpYmVyLCBhdXRob3JpemF0aW9uQ2FjaGUsIGJhc2ljQXV0aDtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpO1xuXG5hdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL2FwaS9vZGF0YS92NC8nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFwcF9pZCwgYXBwX2xvZ2luX3Rva2VuLCBhdXRoLCBhdXRoVG9rZW4sIGNsaWVudF9pZCwgaGFzaGVkVG9rZW4sIGlzQXV0aGVkLCBsb2dpblRva2VucywgcmVmLCByZWYxLCByZWYyLCByZXN1bHQsIHRva2VuLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFyZXEudXNlcklkKSB7XG4gICAgICBpc0F1dGhlZCA9IGZhbHNlO1xuICAgICAgaWYgKHJlcSAhPSBudWxsID8gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ09BdXRoMjogJywgcmVxLnF1ZXJ5LmFjY2Vzc190b2tlbik7XG4gICAgICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIF9pZDogdXNlcklkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKSB7XG4gICAgICAgIGF1dGggPSBiYXNpY0F1dGgucGFyc2UocmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSk7XG4gICAgICAgIGlmIChhdXRoKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoLm5hbWVcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgJ3NlcnZpY2VzJzogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICBpZiAoYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPT09IGF1dGgucGFzcykge1xuICAgICAgICAgICAgICBpc0F1dGhlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBhdXRoLnBhc3MpO1xuICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5lcnJvcikge1xuICAgICAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoXy5rZXlzKGF1dGhvcml6YXRpb25DYWNoZSkubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPSBhdXRoLnBhc3M7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0F1dGhlZCkge1xuICAgICAgICByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gPSB1c2VyLl9pZDtcbiAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICBhcHBfaWQgPSBcImNyZWF0b3JcIjtcbiAgICAgICAgY2xpZW50X2lkID0gXCJwY1wiO1xuICAgICAgICBsb2dpblRva2VucyA9IChyZWYxID0gdXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5yZXN1bWUpICE9IG51bGwgPyByZWYyLmxvZ2luVG9rZW5zIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICBpZiAobG9naW5Ub2tlbnMpIHtcbiAgICAgICAgICBhcHBfbG9naW5fdG9rZW4gPSBfLmZpbmQobG9naW5Ub2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LmFwcF9pZCA9PT0gYXBwX2lkICYmIHQuY2xpZW50X2lkID09PSBjbGllbnRfaWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGFwcF9sb2dpbl90b2tlbikge1xuICAgICAgICAgICAgdG9rZW4gPSBhcHBfbG9naW5fdG9rZW4udG9rZW47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICAgICAgICAgIHRva2VuID0gYXV0aFRva2VuLnRva2VuO1xuICAgICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgICBoYXNoZWRUb2tlbi5hcHBfaWQgPSBhcHBfaWQ7XG4gICAgICAgICAgaGFzaGVkVG9rZW4uY2xpZW50X2lkID0gY2xpZW50X2lkO1xuICAgICAgICAgIGhhc2hlZFRva2VuLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4odXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV4dCgpO1xuICB9KS5ydW4oKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRTZXJ2aWNlTWV0YWRhdGEgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLW1ldGFkYXRhJykuU2VydmljZU1ldGFkYXRhO1xyXG5cdFNlcnZpY2VEb2N1bWVudCA9IHJlcXVpcmUoJ29kYXRhLXY0LXNlcnZpY2UtZG9jdW1lbnQnKS5TZXJ2aWNlRG9jdW1lbnQ7XHJcblx0X05VTUJFUl9UWVBFUyA9IFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCJdXHJcblxyXG5cdF9CT09MRUFOX1RZUEVTID0gW1wiYm9vbGVhblwiXVxyXG5cclxuXHRfREFURVRJTUVfT0ZGU0VUX1RZUEVTID0gWydkYXRldGltZSddXHJcblxyXG5cdF9OQU1FU1BBQ0UgPSBcIkNyZWF0b3JFbnRpdGllc1wiXHJcblxyXG5cdGdldE9iamVjdHNPZGF0YVNjaGVtYSA9IChzcGFjZUlkKS0+XHJcblx0XHRzY2hlbWEgPSB7dmVyc2lvbjogU3RlZWRvc09EYXRhLlZFUlNJT04sIGRhdGFTZXJ2aWNlczoge3NjaGVtYTogW119fVxyXG5cclxuXHRcdGVudGl0aWVzX3NjaGVtYSA9IHt9XHJcblxyXG5cdFx0ZW50aXRpZXNfc2NoZW1hLm5hbWVzcGFjZSA9IF9OQU1FU1BBQ0VcclxuXHJcblx0XHRlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSA9IFtdXHJcblxyXG5cdFx0ZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zID0gW11cclxuXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5Db2xsZWN0aW9ucywgKHZhbHVlLCBrZXksIGxpc3QpLT5cclxuXHRcdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZClcclxuXHRcdFx0aWYgbm90IF9vYmplY3Q/LmVuYWJsZV9hcGlcclxuXHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdCMg5Li76ZSuXHJcblx0XHRcdGtleXMgPSBbe3Byb3BlcnR5UmVmOiB7bmFtZTogXCJfaWRcIiwgY29tcHV0ZWRLZXk6IHRydWV9fV1cclxuXHJcblx0XHRcdGVudGl0aWUgPSB7XHJcblx0XHRcdFx0bmFtZTogX29iamVjdC5uYW1lXHJcblx0XHRcdFx0a2V5OmtleXNcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0a2V5cy5mb3JFYWNoIChfa2V5KS0+XHJcblx0XHRcdFx0ZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zLnB1c2gge1xyXG5cdFx0XHRcdFx0dGFyZ2V0OiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfb2JqZWN0Lm5hbWUgKyBcIi9cIiArIF9rZXkucHJvcGVydHlSZWYubmFtZSxcclxuXHRcdFx0XHRcdGFubm90YXRpb246IFt7XHJcblx0XHRcdFx0XHRcdFwidGVybVwiOiBcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbXB1dGVkXCIsXHJcblx0XHRcdFx0XHRcdFwiYm9vbFwiOiBcInRydWVcIlxyXG5cdFx0XHRcdFx0fV1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQjIEVudGl0eVR5cGVcclxuXHRcdFx0cHJvcGVydHkgPSBbXVxyXG5cdFx0XHRwcm9wZXJ0eS5wdXNoIHtuYW1lOiBcIl9pZFwiLCB0eXBlOiBcIkVkbS5TdHJpbmdcIiwgbnVsbGFibGU6IGZhbHNlfVxyXG5cclxuXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5ID0gW11cclxuXHJcblx0XHRcdF8uZm9yRWFjaCBfb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblxyXG5cdFx0XHRcdF9wcm9wZXJ0eSA9IHtuYW1lOiBmaWVsZF9uYW1lLCB0eXBlOiBcIkVkbS5TdHJpbmdcIn1cclxuXHJcblx0XHRcdFx0aWYgXy5jb250YWlucyBfTlVNQkVSX1RZUEVTLCBmaWVsZC50eXBlXHJcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRvdWJsZVwiXHJcblx0XHRcdFx0ZWxzZSBpZiBfLmNvbnRhaW5zIF9CT09MRUFOX1RZUEVTLCBmaWVsZC50eXBlXHJcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkJvb2xlYW5cIlxyXG5cdFx0XHRcdGVsc2UgaWYgXy5jb250YWlucyBfREFURVRJTUVfT0ZGU0VUX1RZUEVTLCBmaWVsZC50eXBlXHJcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCJcclxuXHRcdFx0XHRcdF9wcm9wZXJ0eS5wcmVjaXNpb24gPSBcIjhcIlxyXG5cclxuXHRcdFx0XHRpZiBmaWVsZC5yZXF1aXJlZFxyXG5cdFx0XHRcdFx0X3Byb3BlcnR5Lm51bGxhYmxlID0gZmFsc2VcclxuXHJcblx0XHRcdFx0cHJvcGVydHkucHVzaCBfcHJvcGVydHlcclxuXHJcblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdFx0aWYgIV8uaXNBcnJheShyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IFtyZWZlcmVuY2VfdG9dXHJcblxyXG5cdFx0XHRcdFx0cmVmZXJlbmNlX3RvLmZvckVhY2ggKHIpLT5cclxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX29iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHIsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZV9vYmpcclxuXHRcdFx0XHRcdFx0XHRfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWFxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lXHJcblx0XHRcdFx0XHRcdFx0bmF2aWdhdGlvblByb3BlcnR5LnB1c2gge1xyXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogX25hbWUsXHJcblx0I1x0XHRcdFx0XHRcdFx0dHlwZTogXCJDb2xsZWN0aW9uKFwiICsgX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lICsgXCIpXCIsXHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBfTkFNRVNQQUNFICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdHBhcnRuZXI6IF9vYmplY3QubmFtZSAjVE9ET1xyXG5cdFx0XHRcdFx0XHRcdFx0X3JlX25hbWU6IHJlZmVyZW5jZV9vYmoubmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbnRpYWxDb25zdHJhaW50OiBbXHJcblx0XHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eTogZmllbGRfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VkUHJvcGVydHk6IFwiX2lkXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybiBcInJlZmVyZW5jZSB0byAnI3tyfScgaW52YWxpZC5cIlxyXG5cclxuXHRcdFx0ZW50aXRpZS5wcm9wZXJ0eSA9IHByb3BlcnR5XHJcblx0XHRcdGVudGl0aWUubmF2aWdhdGlvblByb3BlcnR5ID0gbmF2aWdhdGlvblByb3BlcnR5XHJcblxyXG5cdFx0XHRlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZS5wdXNoIGVudGl0aWVcclxuXHJcblx0XHRzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoIGVudGl0aWVzX3NjaGVtYVxyXG5cclxuXHJcblx0XHRjb250YWluZXJfc2NoZW1hID0ge31cclxuXHRcdGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyID0ge25hbWU6IFwiY29udGFpbmVyXCJ9XHJcblx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQgPSBbXVxyXG5cclxuXHRcdF8uZm9yRWFjaCBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgKF9ldCwgayktPlxyXG5cdFx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQucHVzaCB7XHJcblx0XHRcdFx0XCJuYW1lXCI6IF9ldC5uYW1lLFxyXG5cdFx0XHRcdFwiZW50aXR5VHlwZVwiOiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfZXQubmFtZSxcclxuXHRcdFx0XHRcIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIjogW11cclxuXHRcdFx0fVxyXG5cclxuXHRcdCMgVE9ETyBTZXJ2aWNlTWV0YWRhdGHkuI3mlK/mjIFuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5n5bGe5oCnXHJcbiNcdFx0Xy5mb3JFYWNoIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLCAoX2V0LCBrKS0+XHJcbiNcdFx0XHRfLmZvckVhY2ggX2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eSwgKF9ldF9ucCwgbnBfayktPlxyXG4jXHRcdFx0XHRfZXMgPSBfLmZpbmQgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LCAoX2VzKS0+XHJcbiNcdFx0XHRcdFx0XHRcdHJldHVybiBfZXMubmFtZSA9PSBfZXRfbnAucGFydG5lclxyXG4jXHJcbiNcdFx0XHRcdF9lcz8ubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5wdXNoIHtcInBhdGhcIjogX2V0X25wLl9yZV9uYW1lLCBcInRhcmdldFwiOiBfZXRfbnAuX3JlX25hbWV9XHJcbiNcdFx0XHRcdGNvbnNvbGUubG9nKFwiX2VzXCIsIF9lcylcclxuI1xyXG4jXHRcdGNvbnNvbGUubG9nKFwiY29udGFpbmVyX3NjaGVtYVwiLCBKU09OLnN0cmluZ2lmeShjb250YWluZXJfc2NoZW1hKSlcclxuXHJcblx0XHRzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoIGNvbnRhaW5lcl9zY2hlbWFcclxuXHJcblx0XHRyZXR1cm4gc2NoZW1hXHJcblxyXG5cdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnJywge2F1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRH0sIHtcclxuXHRcdGdldDogKCktPlxyXG5cdFx0XHRjb250ZXh0ID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zPy5zcGFjZUlkKVxyXG5cdFx0XHRzZXJ2aWNlRG9jdW1lbnQgID0gU2VydmljZURvY3VtZW50LnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKEB1cmxQYXJhbXM/LnNwYWNlSWQpLCB7Y29udGV4dDogY29udGV4dH0pO1xyXG5cdFx0XHRib2R5ID0gc2VydmljZURvY3VtZW50LmRvY3VtZW50KClcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG5cdFx0XHRcdFx0J09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Ym9keTogc2VydmljZURvY3VtZW50LmRvY3VtZW50KClcclxuXHRcdFx0fTtcclxuXHR9KVxyXG5cclxuXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEgsIHthdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUR9LCB7XHJcblx0XHRnZXQ6ICgpLT5cclxuXHRcdFx0c2VydmljZU1ldGFkYXRhID0gU2VydmljZU1ldGFkYXRhLnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKEB1cmxQYXJhbXM/LnNwYWNlSWQpKVxyXG5cdFx0XHRib2R5ID0gc2VydmljZU1ldGFkYXRhLmRvY3VtZW50KClcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbDsgY2hhcnNldD11dGYtOCcsXHJcblx0XHRcdFx0XHQnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRib2R5OiBib2R5XHJcblx0XHRcdH07XHJcblx0fSkiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIFNlcnZpY2VEb2N1bWVudCwgU2VydmljZU1ldGFkYXRhLCBfQk9PTEVBTl9UWVBFUywgX0RBVEVUSU1FX09GRlNFVF9UWVBFUywgX05BTUVTUEFDRSwgX05VTUJFUl9UWVBFUywgZ2V0T2JqZWN0c09kYXRhU2NoZW1hO1xuICBTZXJ2aWNlTWV0YWRhdGEgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLW1ldGFkYXRhJykuU2VydmljZU1ldGFkYXRhO1xuICBTZXJ2aWNlRG9jdW1lbnQgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLWRvY3VtZW50JykuU2VydmljZURvY3VtZW50O1xuICBfTlVNQkVSX1RZUEVTID0gW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIl07XG4gIF9CT09MRUFOX1RZUEVTID0gW1wiYm9vbGVhblwiXTtcbiAgX0RBVEVUSU1FX09GRlNFVF9UWVBFUyA9IFsnZGF0ZXRpbWUnXTtcbiAgX05BTUVTUEFDRSA9IFwiQ3JlYXRvckVudGl0aWVzXCI7XG4gIGdldE9iamVjdHNPZGF0YVNjaGVtYSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgY29udGFpbmVyX3NjaGVtYSwgZW50aXRpZXNfc2NoZW1hLCBzY2hlbWE7XG4gICAgc2NoZW1hID0ge1xuICAgICAgdmVyc2lvbjogU3RlZWRvc09EYXRhLlZFUlNJT04sXG4gICAgICBkYXRhU2VydmljZXM6IHtcbiAgICAgICAgc2NoZW1hOiBbXVxuICAgICAgfVxuICAgIH07XG4gICAgZW50aXRpZXNfc2NoZW1hID0ge307XG4gICAgZW50aXRpZXNfc2NoZW1hLm5hbWVzcGFjZSA9IF9OQU1FU1BBQ0U7XG4gICAgZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUgPSBbXTtcbiAgICBlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMgPSBbXTtcbiAgICBfLmVhY2goQ3JlYXRvci5Db2xsZWN0aW9ucywgZnVuY3Rpb24odmFsdWUsIGtleSwgbGlzdCkge1xuICAgICAgdmFyIF9vYmplY3QsIGVudGl0aWUsIGtleXMsIG5hdmlnYXRpb25Qcm9wZXJ0eSwgcHJvcGVydHk7XG4gICAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKTtcbiAgICAgIGlmICghKF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZW5hYmxlX2FwaSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAga2V5cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3BlcnR5UmVmOiB7XG4gICAgICAgICAgICBuYW1lOiBcIl9pZFwiLFxuICAgICAgICAgICAgY29tcHV0ZWRLZXk6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBlbnRpdGllID0ge1xuICAgICAgICBuYW1lOiBfb2JqZWN0Lm5hbWUsXG4gICAgICAgIGtleToga2V5c1xuICAgICAgfTtcbiAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihfa2V5KSB7XG4gICAgICAgIHJldHVybiBlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMucHVzaCh7XG4gICAgICAgICAgdGFyZ2V0OiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfb2JqZWN0Lm5hbWUgKyBcIi9cIiArIF9rZXkucHJvcGVydHlSZWYubmFtZSxcbiAgICAgICAgICBhbm5vdGF0aW9uOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGVybVwiOiBcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbXB1dGVkXCIsXG4gICAgICAgICAgICAgIFwiYm9vbFwiOiBcInRydWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHByb3BlcnR5ID0gW107XG4gICAgICBwcm9wZXJ0eS5wdXNoKHtcbiAgICAgICAgbmFtZTogXCJfaWRcIixcbiAgICAgICAgdHlwZTogXCJFZG0uU3RyaW5nXCIsXG4gICAgICAgIG51bGxhYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBuYXZpZ2F0aW9uUHJvcGVydHkgPSBbXTtcbiAgICAgIF8uZm9yRWFjaChfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgICAgdmFyIF9wcm9wZXJ0eSwgcmVmZXJlbmNlX3RvO1xuICAgICAgICBfcHJvcGVydHkgPSB7XG4gICAgICAgICAgbmFtZTogZmllbGRfbmFtZSxcbiAgICAgICAgICB0eXBlOiBcIkVkbS5TdHJpbmdcIlxuICAgICAgICB9O1xuICAgICAgICBpZiAoXy5jb250YWlucyhfTlVNQkVSX1RZUEVTLCBmaWVsZC50eXBlKSkge1xuICAgICAgICAgIF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRG91YmxlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5jb250YWlucyhfQk9PTEVBTl9UWVBFUywgZmllbGQudHlwZSkpIHtcbiAgICAgICAgICBfcHJvcGVydHkudHlwZSA9IFwiRWRtLkJvb2xlYW5cIjtcbiAgICAgICAgfSBlbHNlIGlmIChfLmNvbnRhaW5zKF9EQVRFVElNRV9PRkZTRVRfVFlQRVMsIGZpZWxkLnR5cGUpKSB7XG4gICAgICAgICAgX3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5EYXRlVGltZU9mZnNldFwiO1xuICAgICAgICAgIF9wcm9wZXJ0eS5wcmVjaXNpb24gPSBcIjhcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVxdWlyZWQpIHtcbiAgICAgICAgICBfcHJvcGVydHkubnVsbGFibGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9wZXJ0eS5wdXNoKF9wcm9wZXJ0eSk7XG4gICAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgaWYgKHJlZmVyZW5jZV90bykge1xuICAgICAgICAgIGlmICghXy5pc0FycmF5KHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IFtyZWZlcmVuY2VfdG9dO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlX3RvLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgdmFyIF9uYW1lLCByZWZlcmVuY2Vfb2JqO1xuICAgICAgICAgICAgcmVmZXJlbmNlX29iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHIsIHNwYWNlSWQpO1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZV9vYmopIHtcbiAgICAgICAgICAgICAgX25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVg7XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9uYW1lID0gZmllbGRfbmFtZSArIFN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRpb25Qcm9wZXJ0eS5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBfbmFtZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBfTkFNRVNQQUNFICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWUsXG4gICAgICAgICAgICAgICAgcGFydG5lcjogX29iamVjdC5uYW1lLFxuICAgICAgICAgICAgICAgIF9yZV9uYW1lOiByZWZlcmVuY2Vfb2JqLm5hbWUsXG4gICAgICAgICAgICAgICAgcmVmZXJlbnRpYWxDb25zdHJhaW50OiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBmaWVsZF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2VkUHJvcGVydHk6IFwiX2lkXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihcInJlZmVyZW5jZSB0byAnXCIgKyByICsgXCInIGludmFsaWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGVudGl0aWUucHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgICAgIGVudGl0aWUubmF2aWdhdGlvblByb3BlcnR5ID0gbmF2aWdhdGlvblByb3BlcnR5O1xuICAgICAgcmV0dXJuIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLnB1c2goZW50aXRpZSk7XG4gICAgfSk7XG4gICAgc2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaChlbnRpdGllc19zY2hlbWEpO1xuICAgIGNvbnRhaW5lcl9zY2hlbWEgPSB7fTtcbiAgICBjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lciA9IHtcbiAgICAgIG5hbWU6IFwiY29udGFpbmVyXCJcbiAgICB9O1xuICAgIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldCA9IFtdO1xuICAgIF8uZm9yRWFjaChlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgZnVuY3Rpb24oX2V0LCBrKSB7XG4gICAgICByZXR1cm4gY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LnB1c2goe1xuICAgICAgICBcIm5hbWVcIjogX2V0Lm5hbWUsXG4gICAgICAgIFwiZW50aXR5VHlwZVwiOiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfZXQubmFtZSxcbiAgICAgICAgXCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nXCI6IFtdXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoKGNvbnRhaW5lcl9zY2hlbWEpO1xuICAgIHJldHVybiBzY2hlbWE7XG4gIH07XG4gIFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnJywge1xuICAgIGF1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRFxuICB9LCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib2R5LCBjb250ZXh0LCByZWYsIHJlZjEsIHNlcnZpY2VEb2N1bWVudDtcbiAgICAgIGNvbnRleHQgPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKChyZWYgPSB0aGlzLnVybFBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwKTtcbiAgICAgIHNlcnZpY2VEb2N1bWVudCA9IFNlcnZpY2VEb2N1bWVudC5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYSgocmVmMSA9IHRoaXMudXJsUGFyYW1zKSAhPSBudWxsID8gcmVmMS5zcGFjZUlkIDogdm9pZCAwKSwge1xuICAgICAgICBjb250ZXh0OiBjb250ZXh0XG4gICAgICB9KTtcbiAgICAgIGJvZHkgPSBzZXJ2aWNlRG9jdW1lbnQuZG9jdW1lbnQoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICdPRGF0YS1WZXJzaW9uJzogU3RlZWRvc09EYXRhLlZFUlNJT05cbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogc2VydmljZURvY3VtZW50LmRvY3VtZW50KClcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZShTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCwge1xuICAgIGF1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRFxuICB9LCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib2R5LCByZWYsIHNlcnZpY2VNZXRhZGF0YTtcbiAgICAgIHNlcnZpY2VNZXRhZGF0YSA9IFNlcnZpY2VNZXRhZGF0YS5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYSgocmVmID0gdGhpcy51cmxQYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgICAgYm9keSA9IHNlcnZpY2VNZXRhZGF0YS5kb2N1bWVudCgpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IGJvZHlcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiQFN0ZWVkb3NPRGF0YSA9IHt9XHJcblN0ZWVkb3NPRGF0YS5WRVJTSU9OID0gJzQuMCdcclxuU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRCA9IHRydWVcclxuU3RlZWRvc09EYXRhLkFQSV9QQVRIID0gJy9hcGkvb2RhdGEvdjQvOnNwYWNlSWQnXHJcblN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIID0gJyRtZXRhZGF0YSdcclxuU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVggPSBcIl9leHBhbmRcIlxyXG5TdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGggPSAoc3BhY2VJZCktPlxyXG5cdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwoJ2FwaS9vZGF0YS92NC8nICsgc3BhY2VJZClcclxuXHJcblN0ZWVkb3NPRGF0YS5nZXRPRGF0YVBhdGggPSAoc3BhY2VJZCxvYmplY3RfbmFtZSktPlxyXG5cdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je29iamVjdF9uYW1lfVwiXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoID0gKHNwYWNlSWQpLT5cclxuXHRcdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je1N0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIfVwiXHJcblxyXG5cdFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoID0gKHNwYWNlSWQsIG9iamVjdF9uYW1lKS0+XHJcblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIFwiIyN7b2JqZWN0X25hbWV9XCJcclxuXHRTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGggPSAoc3BhY2VJZCxvYmplY3RfbmFtZSktPlxyXG5cdFx0cmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIFwiLyN7b2JqZWN0X25hbWV9XCJcclxuXHJcblxyXG5cdEBTdGVlZG9zT2RhdGFBUEkgPSBuZXcgT2RhdGFSZXN0aXZ1c1xyXG5cdFx0YXBpUGF0aDogU3RlZWRvc09EYXRhLkFQSV9QQVRILFxyXG5cdFx0dXNlRGVmYXVsdEF1dGg6IHRydWVcclxuXHRcdHByZXR0eUpzb246IHRydWVcclxuXHRcdGVuYWJsZUNvcnM6IHRydWVcclxuXHRcdGRlZmF1bHRIZWFkZXJzOlxyXG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiIsInRoaXMuU3RlZWRvc09EYXRhID0ge307XG5cblN0ZWVkb3NPRGF0YS5WRVJTSU9OID0gJzQuMCc7XG5cblN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUQgPSB0cnVlO1xuXG5TdGVlZG9zT0RhdGEuQVBJX1BBVEggPSAnL2FwaS9vZGF0YS92NC86c3BhY2VJZCc7XG5cblN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIID0gJyRtZXRhZGF0YSc7XG5cblN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYID0gXCJfZXhwYW5kXCI7XG5cblN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgnYXBpL29kYXRhL3Y0LycgKyBzcGFjZUlkKTtcbn07XG5cblN0ZWVkb3NPRGF0YS5nZXRPRGF0YVBhdGggPSBmdW5jdGlvbihzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyAoXCIvXCIgKyBTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCk7XG4gIH07XG4gIFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIChcIiNcIiArIG9iamVjdF9uYW1lKTtcbiAgfTtcbiAgU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICB9O1xuICB0aGlzLlN0ZWVkb3NPZGF0YUFQSSA9IG5ldyBPZGF0YVJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiBTdGVlZG9zT0RhdGEuQVBJX1BBVEgsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiB0cnVlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
