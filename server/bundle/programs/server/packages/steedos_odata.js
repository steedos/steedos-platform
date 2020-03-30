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
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var Accounts = Package['accounts-base'].Accounts;

/* Package-scope variables */
var __coffeescriptShare, ironRouterSendErrorToResponse, msg;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:odata":{"checkNpm.js":function(require,exports,module){

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
  'odata-v4-mongodb': "^0.1.12",
  cookies: "^0.6.1"
}, 'steedos:odata');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"restivus":{"auth.coffee":function(){

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

},"route.coffee":function(){

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

},"restivus.coffee":function(require){

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

}}},"server":{"objects.coffee":function(){

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

},"odata.coffee":function(require){

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

},"middleware.coffee":function(require){

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

},"metadata.coffee":function(require){

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

}},"core.coffee":function(){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL29iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21pZGRsZXdhcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWlkZGxld2FyZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsImNvb2tpZXMiLCJnZXRVc2VyUXVlcnlTZWxlY3RvciIsInVzZXJWYWxpZGF0b3IiLCJBdXRoIiwiTWF0Y2giLCJXaGVyZSIsInVzZXIiLCJjaGVjayIsImlkIiwiT3B0aW9uYWwiLCJTdHJpbmciLCJ1c2VybmFtZSIsImVtYWlsIiwiXyIsImtleXMiLCJsZW5ndGgiLCJFcnJvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicGFzc3dvcmQiLCJhdXRoVG9rZW4iLCJhdXRoZW50aWNhdGluZ1VzZXIiLCJhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciIsImhhc2hlZFRva2VuIiwicGFzc3dvcmRWZXJpZmljYXRpb24iLCJyZWYiLCJzcGFjZV91c2VycyIsInNwYWNlcyIsIk1ldGVvciIsInVzZXJzIiwiZmluZE9uZSIsInNlcnZpY2VzIiwiQWNjb3VudHMiLCJfY2hlY2tQYXNzd29yZCIsImVycm9yIiwiX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4iLCJfaGFzaFN0YW1wZWRUb2tlbiIsIl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIiwiX2lkIiwiZGIiLCJmaW5kIiwiZmV0Y2giLCJlYWNoIiwic3UiLCJzcGFjZSIsImlzX3BhaWQiLCJpbmRleE9mIiwiYWRtaW5zIiwicHVzaCIsIm5hbWUiLCJ0b2tlbiIsInVzZXJJZCIsImFkbWluU3BhY2VzIiwiZW52IiwicHJvY2VzcyIsIk5PREVfRU5WIiwiaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UiLCJlcnIiLCJyZXEiLCJyZXMiLCJzdGF0dXNDb2RlIiwic3RhdHVzIiwibXNnIiwic3RhY2siLCJ0b1N0cmluZyIsImNvbnNvbGUiLCJoZWFkZXJzU2VudCIsInNvY2tldCIsImRlc3Ryb3kiLCJzZXRIZWFkZXIiLCJCdWZmZXIiLCJieXRlTGVuZ3RoIiwibWV0aG9kIiwiZW5kIiwic2hhcmUiLCJSb3V0ZSIsImFwaSIsInBhdGgiLCJvcHRpb25zIiwiZW5kcG9pbnRzMSIsImVuZHBvaW50cyIsInByb3RvdHlwZSIsImFkZFRvQXBpIiwiYXZhaWxhYmxlTWV0aG9kcyIsImFsbG93ZWRNZXRob2RzIiwiZnVsbFBhdGgiLCJyZWplY3RlZE1ldGhvZHMiLCJzZWxmIiwiY29udGFpbnMiLCJfY29uZmlnIiwicGF0aHMiLCJleHRlbmQiLCJkZWZhdWx0T3B0aW9uc0VuZHBvaW50IiwiX3Jlc29sdmVFbmRwb2ludHMiLCJfY29uZmlndXJlRW5kcG9pbnRzIiwiZmlsdGVyIiwicmVqZWN0IiwiYXBpUGF0aCIsImVuZHBvaW50IiwiSnNvblJvdXRlcyIsImFkZCIsImRvbmVGdW5jIiwiZW5kcG9pbnRDb250ZXh0IiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VJbml0aWF0ZWQiLCJ1cmxQYXJhbXMiLCJwYXJhbXMiLCJxdWVyeVBhcmFtcyIsInF1ZXJ5IiwiYm9keVBhcmFtcyIsImJvZHkiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJkb25lIiwiX2NhbGxFbmRwb2ludCIsImVycm9yMSIsImhlYWRlcnMiLCJfcmVzcG9uZCIsIm1lc3NhZ2UiLCJqb2luIiwidG9VcHBlckNhc2UiLCJpc0Z1bmN0aW9uIiwiYWN0aW9uIiwicmVmMSIsInJlZjIiLCJyb2xlUmVxdWlyZWQiLCJ1bmlvbiIsImlzRW1wdHkiLCJhdXRoUmVxdWlyZWQiLCJzcGFjZVJlcXVpcmVkIiwiaW52b2NhdGlvbiIsIl9hdXRoQWNjZXB0ZWQiLCJfcm9sZUFjY2VwdGVkIiwiX3NwYWNlQWNjZXB0ZWQiLCJERFBDb21tb24iLCJNZXRob2RJbnZvY2F0aW9uIiwiaXNTaW11bGF0aW9uIiwiY29ubmVjdGlvbiIsInJhbmRvbVNlZWQiLCJtYWtlUnBjU2VlZCIsIkREUCIsIl9DdXJyZW50SW52b2NhdGlvbiIsIndpdGhWYWx1ZSIsImNhbGwiLCJfYXV0aGVudGljYXRlIiwiYXV0aCIsInVzZXJTZWxlY3RvciIsInNwYWNlX3VzZXJzX2NvdW50Iiwic3BhY2VJZCIsImNvdW50IiwiaW50ZXJzZWN0aW9uIiwicm9sZXMiLCJkZWZhdWx0SGVhZGVycyIsImRlbGF5SW5NaWxsaXNlY29uZHMiLCJtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyIsInJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvIiwic2VuZFJlc3BvbnNlIiwiX2xvd2VyQ2FzZUtleXMiLCJtYXRjaCIsInByZXR0eUpzb24iLCJKU09OIiwic3RyaW5naWZ5Iiwid3JpdGVIZWFkIiwid3JpdGUiLCJNYXRoIiwicmFuZG9tIiwic2V0VGltZW91dCIsIm9iamVjdCIsImNoYWluIiwicGFpcnMiLCJtYXAiLCJhdHRyIiwidG9Mb3dlckNhc2UiLCJ2YWx1ZSIsIkNvb2tpZXMiLCJPZGF0YVJlc3RpdnVzIiwiYmFzaWNBdXRoIiwiaXRlbSIsImkiLCJsIiwiY29yc0hlYWRlcnMiLCJfcm91dGVzIiwidXNlRGVmYXVsdEF1dGgiLCJ2ZXJzaW9uIiwiX3VzZXIiLCJnZXQiLCJfaGFzaExvZ2luVG9rZW4iLCJlbmFibGVDb3JzIiwic2xpY2UiLCJsYXN0IiwiX2luaXRBdXRoIiwidXNlQXV0aCIsIndhcm4iLCJhZGRSb3V0ZSIsInJvdXRlIiwiYWRkQ29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJjb2xsZWN0aW9uRW5kcG9pbnRzIiwiY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzIiwiZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uIiwiZW50aXR5Um91dGVFbmRwb2ludHMiLCJleGNsdWRlZEVuZHBvaW50cyIsIm1ldGhvZHMiLCJtZXRob2RzT25Db2xsZWN0aW9uIiwicm91dGVPcHRpb25zIiwiX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzIiwiX2NvbGxlY3Rpb25FbmRwb2ludHMiLCJfbmFtZSIsImNvbmZpZ3VyZWRFbmRwb2ludCIsImVuZHBvaW50T3B0aW9ucyIsIm1ldGhvZFR5cGUiLCJjbG9uZSIsImVudGl0eSIsInNlbGVjdG9yIiwiZGF0YSIsInB1dCIsImVudGl0eUlzVXBkYXRlZCIsInVwZGF0ZSIsIiRzZXQiLCJyZW1vdmUiLCJwb3N0IiwiZW50aXR5SWQiLCJpbnNlcnQiLCJnZXRBbGwiLCJlbnRpdGllcyIsImZpZWxkcyIsInByb2ZpbGUiLCJjcmVhdGVVc2VyIiwibG9nb3V0IiwiZSIsImV4dHJhRGF0YSIsInNlYXJjaFF1ZXJ5IiwicmVhc29uIiwib25Mb2dnZWRJbiIsImV4dHJhIiwiaW5kZXgiLCJ0b2tlbkZpZWxkTmFtZSIsInRva2VuTG9jYXRpb24iLCJ0b2tlblBhdGgiLCJ0b2tlblJlbW92YWxRdWVyeSIsInRva2VuVG9SZW1vdmUiLCJsYXN0SW5kZXhPZiIsInN1YnN0cmluZyIsIiRwdWxsIiwib25Mb2dnZWRPdXQiLCJzdGFydHVwIiwiZ2V0T2JqZWN0IiwiZ2V0T2JqZWN0cyIsIm9iamVjdF9uYW1lcyIsInNwbGl0IiwiZm9yRWFjaCIsIm9iamVjdF9uYW1lIiwib2JqZWN0X3Blcm1pc3Npb25zIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNDdXJyZW50IiwicHNldHNVc2VyIiwiQ3JlYXRvciIsIk9iamVjdHMiLCJnZXRPYmplY3ROYW1lIiwiZ2V0Q29sbGVjdGlvbiIsImFzc2lnbmVkX2FwcHMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImJpbmQiLCJsaXN0X3ZpZXdzIiwicGVybWlzc2lvbl9zZXQiLCJhbGxvd1JlYWQiLCJhbGxvd0VkaXQiLCJhbGxvd0RlbGV0ZSIsImFsbG93Q3JlYXRlIiwibW9kaWZ5QWxsUmVjb3JkcyIsImZpZWxkIiwia2V5IiwiX2ZpZWxkIiwidW5lZGl0YWJsZV9maWVsZHMiLCJyZWFkb25seSIsInVucmVhZGFibGVfZmllbGRzIiwiU3RlZWRvc09EYXRhIiwiQVBJX1BBVEgiLCJuZXh0IiwiX29iaiIsIlN0ZWVkb3MiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJNZXRlb3JPRGF0YUFQSVY0Um91dGVyIiwiTWV0ZW9yT0RhdGFSb3V0ZXIiLCJPRGF0YVJvdXRlciIsImFwcCIsImV4cHJlc3MiLCJ1c2UiLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJzdGVlZG9zU2NoZW1hIiwiZ2V0RGF0YVNvdXJjZXMiLCJkYXRhc291cmNlIiwib3RoZXJBcHAiLCJGaWJlciIsImF1dGhvcml6YXRpb25DYWNoZSIsIk1pZGRsZXdhcmUiLCJhcHBfaWQiLCJhcHBfbG9naW5fdG9rZW4iLCJjbGllbnRfaWQiLCJpc0F1dGhlZCIsImxvZ2luVG9rZW5zIiwicmVzdWx0IiwiYWNjZXNzX3Rva2VuIiwibG9nIiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwicGFyc2UiLCJwYXNzIiwicmVzdW1lIiwidCIsInJ1biIsIlNlcnZpY2VEb2N1bWVudCIsIlNlcnZpY2VNZXRhZGF0YSIsIl9CT09MRUFOX1RZUEVTIiwiX0RBVEVUSU1FX09GRlNFVF9UWVBFUyIsIl9OQU1FU1BBQ0UiLCJfTlVNQkVSX1RZUEVTIiwiZ2V0T2JqZWN0c09kYXRhU2NoZW1hIiwiY29udGFpbmVyX3NjaGVtYSIsImVudGl0aWVzX3NjaGVtYSIsInNjaGVtYSIsIlZFUlNJT04iLCJkYXRhU2VydmljZXMiLCJuYW1lc3BhY2UiLCJlbnRpdHlUeXBlIiwiYW5ub3RhdGlvbnMiLCJDb2xsZWN0aW9ucyIsImxpc3QiLCJfb2JqZWN0IiwiZW50aXRpZSIsIm5hdmlnYXRpb25Qcm9wZXJ0eSIsInByb3BlcnR5IiwiZW5hYmxlX2FwaSIsInByb3BlcnR5UmVmIiwiY29tcHV0ZWRLZXkiLCJfa2V5IiwidGFyZ2V0IiwiYW5ub3RhdGlvbiIsInR5cGUiLCJudWxsYWJsZSIsImZpZWxkX25hbWUiLCJfcHJvcGVydHkiLCJyZWZlcmVuY2VfdG8iLCJwcmVjaXNpb24iLCJyZXF1aXJlZCIsImlzQXJyYXkiLCJyIiwicmVmZXJlbmNlX29iaiIsIkVYUEFORF9GSUVMRF9TVUZGSVgiLCJwYXJ0bmVyIiwiX3JlX25hbWUiLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCJyZWZlcmVuY2VkUHJvcGVydHkiLCJlbnRpdHlDb250YWluZXIiLCJlbnRpdHlTZXQiLCJfZXQiLCJrIiwiU3RlZWRvc09kYXRhQVBJIiwiQVVUSFJFUVVJUkVEIiwiY29udGV4dCIsInNlcnZpY2VEb2N1bWVudCIsImdldE1ldGFEYXRhUGF0aCIsInByb2Nlc3NNZXRhZGF0YUpzb24iLCJkb2N1bWVudCIsIk1FVEFEQVRBX1BBVEgiLCJzZXJ2aWNlTWV0YWRhdGEiLCJnZXRSb290UGF0aCIsImFic29sdXRlVXJsIiwiZ2V0T0RhdGFQYXRoIiwiaXNTZXJ2ZXIiLCJnZXRPRGF0YUNvbnRleHRQYXRoIiwiZ2V0T0RhdGFOZXh0TGlua1BhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjs7QUFBckI7QUFDQUMsT0FBTyxDQUFDLHlCQUFELENBQVA7O0FBR0FKLGdCQUFnQixDQUFDO0FBQ2hCLGdCQUFjLFFBREU7QUFFaEIsK0JBQTZCLFFBRmI7QUFHaEIsK0JBQTZCLFFBSGI7QUFJaEIsc0JBQW9CLFNBSko7QUFLaEJLLFNBQU8sRUFBRTtBQUxPLENBQUQsRUFNYixlQU5hLENBQWhCLEM7Ozs7Ozs7Ozs7OztBQ0pBLElBQUFDLG9CQUFBLEVBQUFDLGFBQUE7QUFBQSxLQUFDQyxJQUFELFVBQUNBLElBQUQsR0FBVSxFQUFWLEUsQ0FFQTs7O0FBR0FELGdCQUFnQkUsTUFBTUMsS0FBTixDQUFZLFVBQUNDLElBQUQ7QUFDM0JDLFFBQU1ELElBQU4sRUFDQztBQUFBRSxRQUFJSixNQUFNSyxRQUFOLENBQWVDLE1BQWYs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QkFBa0IvTixPQUFyQyxDQUFQO0FBRDBCLENBQTNCOztBQUdBaUksYUFBYStGLFlBQWIsR0FBNEIsVUFBQ2hPLE9BQUQsRUFBU3VHLFdBQVQ7QUFDM0IsU0FBTzBCLGFBQWE2RixXQUFiLENBQXlCOU4sT0FBekIsS0FBb0MsTUFBSXVHLFdBQXhDLENBQVA7QUFEMkIsQ0FBNUI7O0FBR0EsSUFBRy9OLE9BQU95VixRQUFWO0FBQ0NoRyxlQUFhd0YsZUFBYixHQUErQixVQUFDek4sT0FBRDtBQUM5QixXQUFPaUksYUFBYTZGLFdBQWIsQ0FBeUI5TixPQUF6QixLQUFvQyxNQUFJaUksYUFBYTJGLGFBQXJELENBQVA7QUFEOEIsR0FBL0I7O0FBR0EzRixlQUFhaUcsbUJBQWIsR0FBbUMsVUFBQ2xPLE9BQUQsRUFBVXVHLFdBQVY7QUFDbEMsV0FBTzBCLGFBQWF3RixlQUFiLENBQTZCek4sT0FBN0IsS0FBd0MsTUFBSXVHLFdBQTVDLENBQVA7QUFEa0MsR0FBbkM7O0FBRUEwQixlQUFha0csb0JBQWIsR0FBb0MsVUFBQ25PLE9BQUQsRUFBU3VHLFdBQVQ7QUFDbkMsV0FBTzBCLGFBQWE2RixXQUFiLENBQXlCOU4sT0FBekIsS0FBb0MsTUFBSXVHLFdBQXhDLENBQVA7QUFEbUMsR0FBcEM7O0FBSUEsT0FBQzhHLGVBQUQsR0FBbUIsSUFBSTFMLGFBQUosQ0FDbEI7QUFBQTlFLGFBQVNvTCxhQUFhQyxRQUF0QjtBQUNBaEcsb0JBQWdCLElBRGhCO0FBRUF2QixnQkFBWSxJQUZaO0FBR0E0QixnQkFBWSxJQUhaO0FBSUFuQyxvQkFDQztBQUFBLHNCQUFnQjtBQUFoQjtBQUxELEdBRGtCLENBQW5CO0FDaUJBLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmaXggd2FybmluZzogeHh4IG5vdCBpbnN0YWxsZWRcclxucmVxdWlyZShcImJhc2ljLWF1dGgvcGFja2FnZS5qc29uXCIpO1xyXG5cclxuaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHQnYmFzaWMtYXV0aCc6ICdeMi4wLjEnLFxyXG5cdCdvZGF0YS12NC1zZXJ2aWNlLW1ldGFkYXRhJzogXCJeMC4xLjZcIixcclxuXHRcIm9kYXRhLXY0LXNlcnZpY2UtZG9jdW1lbnRcIjogXCJeMC4wLjNcIixcclxuXHQnb2RhdGEtdjQtbW9uZ29kYic6IFwiXjAuMS4xMlwiLFxyXG5cdGNvb2tpZXM6IFwiXjAuNi4xXCIsXHJcbn0sICdzdGVlZG9zOm9kYXRhJyk7XHJcbiIsIkBBdXRoIG9yPSB7fVxyXG5cclxuIyMjXHJcblx0QSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxyXG4jIyNcclxudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlICh1c2VyKSAtPlxyXG5cdGNoZWNrIHVzZXIsXHJcblx0XHRpZDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXHJcblx0XHR1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXHJcblx0XHRlbWFpbDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXHJcblxyXG5cdGlmIF8ua2V5cyh1c2VyKS5sZW5ndGggaXMgbm90IDFcclxuXHRcdHRocm93IG5ldyBNYXRjaC5FcnJvciAnVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCdcclxuXHJcblx0cmV0dXJuIHRydWVcclxuXHJcblxyXG4jIyNcclxuXHRSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXHJcbiMjI1xyXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9ICh1c2VyKSAtPlxyXG5cdGlmIHVzZXIuaWRcclxuXHRcdHJldHVybiB7J19pZCc6IHVzZXIuaWR9XHJcblx0ZWxzZSBpZiB1c2VyLnVzZXJuYW1lXHJcblx0XHRyZXR1cm4geyd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWV9XHJcblx0ZWxzZSBpZiB1c2VyLmVtYWlsXHJcblx0XHRyZXR1cm4geydlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWx9XHJcblxyXG5cdCMgV2Ugc2hvdWxkbid0IGJlIGhlcmUgaWYgdGhlIHVzZXIgb2JqZWN0IHdhcyBwcm9wZXJseSB2YWxpZGF0ZWRcclxuXHR0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInXHJcblxyXG5cclxuIyMjXHJcblx0TG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXHJcbiMjI1xyXG5AQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9ICh1c2VyLCBwYXNzd29yZCkgLT5cclxuXHRpZiBub3QgdXNlciBvciBub3QgcGFzc3dvcmRcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuXHQjIFZhbGlkYXRlIHRoZSBsb2dpbiBpbnB1dCB0eXBlc1xyXG5cdGNoZWNrIHVzZXIsIHVzZXJWYWxpZGF0b3JcclxuXHRjaGVjayBwYXNzd29yZCwgU3RyaW5nXHJcblxyXG5cdCMgUmV0cmlldmUgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcclxuXHRhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpXHJcblx0YXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpXHJcblxyXG5cdGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXJcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cdGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXM/LnBhc3N3b3JkXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcblx0IyBBdXRoZW50aWNhdGUgdGhlIHVzZXIncyBwYXNzd29yZFxyXG5cdHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZFxyXG5cdGlmIHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcblx0IyBBZGQgYSBuZXcgYXV0aCB0b2tlbiB0byB0aGUgdXNlcidzIGFjY291bnRcclxuXHRhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpXHJcblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cclxuXHRBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlblxyXG5cclxuXHRzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWR9KS5mZXRjaCgpXHJcblx0c3BhY2VzID0gW11cclxuXHRfLmVhY2ggc3BhY2VfdXNlcnMsIChzdSktPlxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSlcclxuXHRcdCMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xyXG5cdFx0aWYgc3BhY2U/LmlzX3BhaWQgYW5kIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpPj0wXHJcblx0XHRcdHNwYWNlcy5wdXNoXHJcblx0XHRcdFx0X2lkOiBzcGFjZS5faWRcclxuXHRcdFx0XHRuYW1lOiBzcGFjZS5uYW1lXHJcblx0cmV0dXJuIHthdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbiwgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBhZG1pblNwYWNlczogc3BhY2VzfVxyXG4iLCJ2YXIgZ2V0VXNlclF1ZXJ5U2VsZWN0b3IsIHVzZXJWYWxpZGF0b3I7XG5cbnRoaXMuQXV0aCB8fCAodGhpcy5BdXRoID0ge30pO1xuXG5cbi8qXG5cdEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiAqL1xuXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24odXNlcikge1xuICBjaGVjayh1c2VyLCB7XG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgZW1haWw6IE1hdGNoLk9wdGlvbmFsKFN0cmluZylcbiAgfSk7XG4gIGlmIChfLmtleXModXNlcikubGVuZ3RoID09PSAhMSkge1xuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvcignVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCcpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cblxuLypcblx0UmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuICovXG5cbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gZnVuY3Rpb24odXNlcikge1xuICBpZiAodXNlci5pZCkge1xuICAgIHJldHVybiB7XG4gICAgICAnX2lkJzogdXNlci5pZFxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci51c2VybmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICAndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLmVtYWlsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWxcbiAgICB9O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcicpO1xufTtcblxuXG4vKlxuXHRMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiAqL1xuXG50aGlzLkF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbih1c2VyLCBwYXNzd29yZCkge1xuICB2YXIgYXV0aFRva2VuLCBhdXRoZW50aWNhdGluZ1VzZXIsIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yLCBoYXNoZWRUb2tlbiwgcGFzc3dvcmRWZXJpZmljYXRpb24sIHJlZiwgc3BhY2VfdXNlcnMsIHNwYWNlcztcbiAgaWYgKCF1c2VyIHx8ICFwYXNzd29yZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgY2hlY2sodXNlciwgdXNlclZhbGlkYXRvcik7XG4gIGNoZWNrKHBhc3N3b3JkLCBTdHJpbmcpO1xuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpO1xuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3Rvcik7XG4gIGlmICghYXV0aGVudGljYXRpbmdVc2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBpZiAoISgocmVmID0gYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzKSAhPSBudWxsID8gcmVmLnBhc3N3b3JkIDogdm9pZCAwKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZChhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkKTtcbiAgaWYgKHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuKGF1dGhUb2tlbik7XG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuKGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkXG4gIH0pLmZldGNoKCk7XG4gIHNwYWNlcyA9IFtdO1xuICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHN1KSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpO1xuICAgIGlmICgoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmlzX3BhaWQgOiB2b2lkIDApICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpID49IDApIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh7XG4gICAgICAgIF9pZDogc3BhY2UuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGF1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLFxuICAgIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCxcbiAgICBhZG1pblNwYWNlczogc3BhY2VzXG4gIH07XG59O1xuIiwiLy8gV2UgbmVlZCBhIGZ1bmN0aW9uIHRoYXQgdHJlYXRzIHRocm93biBlcnJvcnMgZXhhY3RseSBsaWtlIElyb24gUm91dGVyIHdvdWxkLlxyXG4vLyBUaGlzIGZpbGUgaXMgd3JpdHRlbiBpbiBKYXZhU2NyaXB0IHRvIGVuYWJsZSBjb3B5LXBhc3RpbmcgSXJvbiBSb3V0ZXIgY29kZS5cclxuXHJcbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDNcclxudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XHJcblxyXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0w0N1xyXG5pcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSA9IGZ1bmN0aW9uKGVyciwgcmVxLCByZXMpIHtcclxuXHRpZiAocmVzLnN0YXR1c0NvZGUgPCA0MDApXHJcblx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcclxuXHJcblx0aWYgKGVyci5zdGF0dXMpXHJcblx0XHRyZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XHJcblxyXG5cdGlmIChlbnYgPT09ICdkZXZlbG9wbWVudCcpXHJcblx0XHRtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xyXG5cdGVsc2VcclxuXHQvL1hYWCBnZXQgdGhpcyBmcm9tIHN0YW5kYXJkIGRpY3Qgb2YgZXJyb3IgbWVzc2FnZXM/XHJcblx0XHRtc2cgPSAnU2VydmVyIGVycm9yLic7XHJcblxyXG5cdGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKTtcclxuXHJcblx0aWYgKHJlcy5oZWFkZXJzU2VudClcclxuXHRcdHJldHVybiByZXEuc29ja2V0LmRlc3Ryb3koKTtcclxuXHJcblx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xyXG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgQnVmZmVyLmJ5dGVMZW5ndGgobXNnKSk7XHJcblx0aWYgKHJlcS5tZXRob2QgPT09ICdIRUFEJylcclxuXHRcdHJldHVybiByZXMuZW5kKCk7XHJcblx0cmVzLmVuZChtc2cpO1xyXG5cdHJldHVybjtcclxufVxyXG4iLCJjbGFzcyBzaGFyZS5Sb3V0ZVxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKEBhcGksIEBwYXRoLCBAb3B0aW9ucywgQGVuZHBvaW50cykgLT5cclxuXHRcdCMgQ2hlY2sgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkXHJcblx0XHRpZiBub3QgQGVuZHBvaW50c1xyXG5cdFx0XHRAZW5kcG9pbnRzID0gQG9wdGlvbnNcclxuXHRcdFx0QG9wdGlvbnMgPSB7fVxyXG5cclxuXHJcblx0YWRkVG9BcGk6IGRvIC0+XHJcblx0XHRhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXVxyXG5cclxuXHRcdHJldHVybiAtPlxyXG5cdFx0XHRzZWxmID0gdGhpc1xyXG5cclxuXHRcdFx0IyBUaHJvdyBhbiBlcnJvciBpZiBhIHJvdXRlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgYXQgdGhpcyBwYXRoXHJcblx0XHRcdCMgVE9ETzogQ2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aCBwYXRocyB0aGF0IGZvbGxvdyBzYW1lIHBhdHRlcm4gd2l0aCBkaWZmZXJlbnQgcGFyYW1ldGVyIG5hbWVzXHJcblx0XHRcdGlmIF8uY29udGFpbnMgQGFwaS5fY29uZmlnLnBhdGhzLCBAcGF0aFxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiAje0BwYXRofVwiXHJcblxyXG5cdFx0XHQjIE92ZXJyaWRlIHRoZSBkZWZhdWx0IE9QVElPTlMgZW5kcG9pbnQgd2l0aCBvdXIgb3duXHJcblx0XHRcdEBlbmRwb2ludHMgPSBfLmV4dGVuZCBvcHRpb25zOiBAYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCwgQGVuZHBvaW50c1xyXG5cclxuXHRcdFx0IyBDb25maWd1cmUgZWFjaCBlbmRwb2ludCBvbiB0aGlzIHJvdXRlXHJcblx0XHRcdEBfcmVzb2x2ZUVuZHBvaW50cygpXHJcblx0XHRcdEBfY29uZmlndXJlRW5kcG9pbnRzKClcclxuXHJcblx0XHRcdCMgQWRkIHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHBhdGhzXHJcblx0XHRcdEBhcGkuX2NvbmZpZy5wYXRocy5wdXNoIEBwYXRoXHJcblxyXG5cdFx0XHRhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyIGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XHJcblx0XHRcdFx0Xy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXHJcblx0XHRcdHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0IGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XHJcblx0XHRcdFx0Xy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXHJcblxyXG5cdFx0XHQjIFNldHVwIGVuZHBvaW50cyBvbiByb3V0ZVxyXG5cdFx0XHRmdWxsUGF0aCA9IEBhcGkuX2NvbmZpZy5hcGlQYXRoICsgQHBhdGhcclxuXHRcdFx0Xy5lYWNoIGFsbG93ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxyXG5cdFx0XHRcdGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXVxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cclxuXHRcdFx0XHRcdCMgQWRkIGZ1bmN0aW9uIHRvIGVuZHBvaW50IGNvbnRleHQgZm9yIGluZGljYXRpbmcgYSByZXNwb25zZSBoYXMgYmVlbiBpbml0aWF0ZWQgbWFudWFsbHlcclxuXHRcdFx0XHRcdHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2VcclxuXHRcdFx0XHRcdGRvbmVGdW5jID0gLT5cclxuXHRcdFx0XHRcdFx0cmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlXHJcblxyXG5cdFx0XHRcdFx0ZW5kcG9pbnRDb250ZXh0ID1cclxuXHRcdFx0XHRcdFx0dXJsUGFyYW1zOiByZXEucGFyYW1zXHJcblx0XHRcdFx0XHRcdHF1ZXJ5UGFyYW1zOiByZXEucXVlcnlcclxuXHRcdFx0XHRcdFx0Ym9keVBhcmFtczogcmVxLmJvZHlcclxuXHRcdFx0XHRcdFx0cmVxdWVzdDogcmVxXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlOiByZXNcclxuXHRcdFx0XHRcdFx0ZG9uZTogZG9uZUZ1bmNcclxuXHRcdFx0XHRcdCMgQWRkIGVuZHBvaW50IGNvbmZpZyBvcHRpb25zIHRvIGNvbnRleHRcclxuXHRcdFx0XHRcdF8uZXh0ZW5kIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuXHJcblx0XHRcdFx0XHQjIFJ1biB0aGUgcmVxdWVzdGVkIGVuZHBvaW50XHJcblx0XHRcdFx0XHRyZXNwb25zZURhdGEgPSBudWxsXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50IGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdCMgRG8gZXhhY3RseSB3aGF0IElyb24gUm91dGVyIHdvdWxkIGhhdmUgZG9uZSwgdG8gYXZvaWQgY2hhbmdpbmcgdGhlIEFQSVxyXG5cdFx0XHRcdFx0XHRpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdFx0XHRpZiByZXNwb25zZUluaXRpYXRlZFxyXG5cdFx0XHRcdFx0XHQjIEVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgcHJvcGVybHkgY29tcGxldGVkXHJcblx0XHRcdFx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aWYgcmVzLmhlYWRlcnNTZW50XHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIHJlc3BvbnNlRGF0YSBpcyBudWxsIG9yIHJlc3BvbnNlRGF0YSBpcyB1bmRlZmluZWRcclxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXHJcblxyXG5cdFx0XHRcdFx0IyBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBodHRwIHJlc3BvbnNlLCBoYW5kbGluZyB0aGUgZGlmZmVyZW50IGVuZHBvaW50IHJlc3BvbnNlIHR5cGVzXHJcblx0XHRcdFx0XHRpZiByZXNwb25zZURhdGEuYm9keSBhbmQgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIG9yIHJlc3BvbnNlRGF0YS5oZWFkZXJzKVxyXG5cdFx0XHRcdFx0XHRzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVyc1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhXHJcblxyXG5cdFx0XHRfLmVhY2ggcmVqZWN0ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cclxuXHRcdFx0XHRcdHJlc3BvbnNlRGF0YSA9IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcclxuXHRcdFx0XHRcdGhlYWRlcnMgPSAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcclxuXHRcdFx0XHRcdHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVyc1xyXG5cclxuXHJcblx0IyMjXHJcblx0XHRDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcclxuXHRcdGZ1bmN0aW9uXHJcblxyXG5cdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXHJcblx0IyMjXHJcblx0X3Jlc29sdmVFbmRwb2ludHM6IC0+XHJcblx0XHRfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykgLT5cclxuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGVuZHBvaW50KVxyXG5cdFx0XHRcdGVuZHBvaW50c1ttZXRob2RdID0ge2FjdGlvbjogZW5kcG9pbnR9XHJcblx0XHRyZXR1cm5cclxuXHJcblxyXG5cdCMjI1xyXG5cdFx0Q29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxyXG5cdFx0YmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXHJcblxyXG5cdFx0QXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cclxuXHRcdGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXHJcblx0XHRvdmVycmlkZSB0aGUgZGVmYXVsdC5cclxuXHJcblx0XHRBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcclxuXHRcdGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXHJcblx0XHRyZXNwZWN0aXZlbHkuXHJcblxyXG5cdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXHJcblx0XHRAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXHJcblx0IyMjXHJcblx0X2NvbmZpZ3VyZUVuZHBvaW50czogLT5cclxuXHRcdF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCkgLT5cclxuXHRcdFx0aWYgbWV0aG9kIGlzbnQgJ29wdGlvbnMnXHJcblx0XHRcdFx0IyBDb25maWd1cmUgYWNjZXB0YWJsZSByb2xlc1xyXG5cdFx0XHRcdGlmIG5vdCBAb3B0aW9ucz8ucm9sZVJlcXVpcmVkXHJcblx0XHRcdFx0XHRAb3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXVxyXG5cdFx0XHRcdGlmIG5vdCBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuXHRcdFx0XHRcdGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdXHJcblx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbiBlbmRwb2ludC5yb2xlUmVxdWlyZWQsIEBvcHRpb25zLnJvbGVSZXF1aXJlZFxyXG5cdFx0XHRcdCMgTWFrZSBpdCBlYXNpZXIgdG8gY2hlY2sgaWYgbm8gcm9sZXMgYXJlIHJlcXVpcmVkXHJcblx0XHRcdFx0aWYgXy5pc0VtcHR5IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG5cdFx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2VcclxuXHJcblx0XHRcdFx0IyBDb25maWd1cmUgYXV0aCByZXF1aXJlbWVudFxyXG5cdFx0XHRcdGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZCBpcyB1bmRlZmluZWRcclxuXHRcdFx0XHRcdGlmIEBvcHRpb25zPy5hdXRoUmVxdWlyZWQgb3IgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcblx0XHRcdFx0XHRcdGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWVcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0ZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2VcclxuXHJcblx0XHRcdFx0aWYgQG9wdGlvbnM/LnNwYWNlUmVxdWlyZWRcclxuXHRcdFx0XHRcdGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSBAb3B0aW9ucy5zcGFjZVJlcXVpcmVkXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHQsIHRoaXNcclxuXHRcdHJldHVyblxyXG5cclxuXHJcblx0IyMjXHJcblx0XHRBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XHJcblxyXG5cdFx0QHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXHJcblx0IyMjXHJcblx0X2NhbGxFbmRwb2ludDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcblx0XHQjIENhbGwgdGhlIGVuZHBvaW50IGlmIGF1dGhlbnRpY2F0aW9uIGRvZXNuJ3QgZmFpbFxyXG5cdFx0aWYgQF9hdXRoQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG5cdFx0XHRpZiBAX3JvbGVBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcblx0XHRcdFx0aWYgQF9zcGFjZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuXHRcdFx0XHRcdCNlbmRwb2ludC5hY3Rpb24uY2FsbCBlbmRwb2ludENvbnRleHRcclxuXHRcdFx0XHRcdGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cclxuXHRcdFx0XHRcdFx0aXNTaW11bGF0aW9uOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHR1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXHJcblx0XHRcdFx0XHRcdGNvbm5lY3Rpb246IG51bGwsXHJcblx0XHRcdFx0XHRcdHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlIGludm9jYXRpb24sIC0+XHJcblx0XHRcdFx0XHRcdHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG5cdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuXHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuXHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XHJcblxyXG5cclxuXHQjIyNcclxuXHRcdEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcclxuXHJcblx0XHRPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXHJcblx0XHRpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcclxuXHRcdGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxyXG5cclxuXHRcdEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcclxuXHQjIyNcclxuXHRfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuXHRcdGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZFxyXG5cdFx0XHRAX2F1dGhlbnRpY2F0ZSBlbmRwb2ludENvbnRleHRcclxuXHRcdGVsc2UgdHJ1ZVxyXG5cclxuXHJcblx0IyMjXHJcblx0XHRWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxyXG5cclxuXHRcdElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cclxuXHJcblx0XHRAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuXHQjIyNcclxuXHRfYXV0aGVudGljYXRlOiAoZW5kcG9pbnRDb250ZXh0KSAtPlxyXG5cdFx0IyBHZXQgYXV0aCBpbmZvXHJcblx0XHRhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcclxuXHJcblx0XHQjIEdldCB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxyXG5cdFx0aWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcclxuXHRcdFx0dXNlclNlbGVjdG9yID0ge31cclxuXHRcdFx0dXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkXHJcblx0XHRcdHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXHJcblx0XHRcdGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lIHVzZXJTZWxlY3RvclxyXG5cclxuXHRcdCMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuXHRcdGlmIGF1dGg/LnVzZXJcclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXJcclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcclxuXHRcdFx0dHJ1ZVxyXG5cdFx0ZWxzZSBmYWxzZVxyXG5cclxuXHQjIyNcclxuXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXHJcblxyXG5cdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxyXG5cclxuXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXHJcblx0XHRcdFx0XHRcdCBlbmRwb2ludFxyXG5cdCMjI1xyXG5cdF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuXHRcdGlmIGVuZHBvaW50LnNwYWNlUmVxdWlyZWRcclxuXHRcdFx0YXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXHJcblx0XHRcdGlmIGF1dGg/LnNwYWNlSWRcclxuXHRcdFx0XHRzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGgudXNlcklkLCBzcGFjZTphdXRoLnNwYWNlSWR9KS5jb3VudCgpXHJcblx0XHRcdFx0aWYgc3BhY2VfdXNlcnNfY291bnRcclxuXHRcdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxyXG5cdFx0XHRcdFx0IyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXHJcblx0XHRcdFx0XHRpZiBzcGFjZT8uaXNfcGFpZCBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpPj0wXHJcblx0XHRcdFx0XHRcdGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkXHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIlxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHJldHVybiB0cnVlXHJcblxyXG5cdCMjI1xyXG5cdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcclxuXHJcblx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXHJcblxyXG5cdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcclxuXHRcdFx0XHRcdFx0IGVuZHBvaW50XHJcblx0IyMjXHJcblx0X3JvbGVBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcblx0XHRpZiBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuXHRcdFx0aWYgXy5pc0VtcHR5IF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR0cnVlXHJcblxyXG5cclxuXHQjIyNcclxuXHRcdFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XHJcblx0IyMjXHJcblx0X3Jlc3BvbmQ6IChyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZT0yMDAsIGhlYWRlcnM9e30pIC0+XHJcblx0XHQjIE92ZXJyaWRlIGFueSBkZWZhdWx0IGhlYWRlcnMgdGhhdCBoYXZlIGJlZW4gcHJvdmlkZWQgKGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gYmUgY2FzZSBpbnNlbnNpdGl2ZSlcclxuXHRcdCMgVE9ETzogQ29uc2lkZXIgb25seSBsb3dlcmNhc2luZyB0aGUgaGVhZGVyIGtleXMgd2UgbmVlZCBub3JtYWxpemVkLCBsaWtlIENvbnRlbnQtVHlwZVxyXG5cdFx0ZGVmYXVsdEhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgQGFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzXHJcblx0XHRoZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIGhlYWRlcnNcclxuXHRcdGhlYWRlcnMgPSBfLmV4dGVuZCBkZWZhdWx0SGVhZGVycywgaGVhZGVyc1xyXG5cclxuXHRcdCMgUHJlcGFyZSBKU09OIGJvZHkgZm9yIHJlc3BvbnNlIHdoZW4gQ29udGVudC1UeXBlIGluZGljYXRlcyBKU09OIHR5cGVcclxuXHRcdGlmIGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSBpc250IG51bGxcclxuXHRcdFx0aWYgQGFwaS5fY29uZmlnLnByZXR0eUpzb25cclxuXHRcdFx0XHRib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keSwgdW5kZWZpbmVkLCAyXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keVxyXG5cclxuXHRcdCMgU2VuZCByZXNwb25zZVxyXG5cdFx0c2VuZFJlc3BvbnNlID0gLT5cclxuXHRcdFx0cmVzcG9uc2Uud3JpdGVIZWFkIHN0YXR1c0NvZGUsIGhlYWRlcnNcclxuXHRcdFx0cmVzcG9uc2Uud3JpdGUgYm9keVxyXG5cdFx0XHRyZXNwb25zZS5lbmQoKVxyXG5cdFx0aWYgc3RhdHVzQ29kZSBpbiBbNDAxLCA0MDNdXHJcblx0XHRcdCMgSGFja2VycyBjYW4gbWVhc3VyZSB0aGUgcmVzcG9uc2UgdGltZSB0byBkZXRlcm1pbmUgdGhpbmdzIGxpa2Ugd2hldGhlciB0aGUgNDAxIHJlc3BvbnNlIHdhc1xyXG5cdFx0XHQjIGNhdXNlZCBieSBiYWQgdXNlciBpZCB2cyBiYWQgcGFzc3dvcmQuXHJcblx0XHRcdCMgSW4gZG9pbmcgc28sIHRoZXkgY2FuIGZpcnN0IHNjYW4gZm9yIHZhbGlkIHVzZXIgaWRzIHJlZ2FyZGxlc3Mgb2YgdmFsaWQgcGFzc3dvcmRzLlxyXG5cdFx0XHQjIERlbGF5IGJ5IGEgcmFuZG9tIGFtb3VudCB0byByZWR1Y2UgdGhlIGFiaWxpdHkgZm9yIGEgaGFja2VyIHRvIGRldGVybWluZSB0aGUgcmVzcG9uc2UgdGltZS5cclxuXHRcdFx0IyBTZWUgaHR0cHM6Ly93d3cub3dhc3Aub3JnL2luZGV4LnBocC9CbG9ja2luZ19CcnV0ZV9Gb3JjZV9BdHRhY2tzI0ZpbmRpbmdfT3RoZXJfQ291bnRlcm1lYXN1cmVzXHJcblx0XHRcdCMgU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RpbWluZ19hdHRhY2tcclxuXHRcdFx0bWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDBcclxuXHRcdFx0cmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28gPSAxICsgTWF0aC5yYW5kb20oKVxyXG5cdFx0XHRkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3b1xyXG5cdFx0XHRNZXRlb3Iuc2V0VGltZW91dCBzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHNcclxuXHRcdGVsc2VcclxuXHRcdFx0c2VuZFJlc3BvbnNlKClcclxuXHJcblx0IyMjXHJcblx0XHRSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXHJcblx0IyMjXHJcblx0X2xvd2VyQ2FzZUtleXM6IChvYmplY3QpIC0+XHJcblx0XHRfLmNoYWluIG9iamVjdFxyXG5cdFx0LnBhaXJzKClcclxuXHRcdC5tYXAgKGF0dHIpIC0+XHJcblx0XHRcdFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dXHJcblx0XHQub2JqZWN0KClcclxuXHRcdC52YWx1ZSgpXHJcbiIsInNoYXJlLlJvdXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSb3V0ZShhcGksIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50czEpIHtcbiAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5lbmRwb2ludHMgPSBlbmRwb2ludHMxO1xuICAgIGlmICghdGhpcy5lbmRwb2ludHMpIHtcbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gdGhpcy5vcHRpb25zO1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgfVxuICB9XG5cbiAgUm91dGUucHJvdG90eXBlLmFkZFRvQXBpID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdmFpbGFibGVNZXRob2RzO1xuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhbGxvd2VkTWV0aG9kcywgZnVsbFBhdGgsIHJlamVjdGVkTWV0aG9kcywgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKF8uY29udGFpbnModGhpcy5hcGkuX2NvbmZpZy5wYXRocywgdGhpcy5wYXRoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogXCIgKyB0aGlzLnBhdGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5lbmRwb2ludHMgPSBfLmV4dGVuZCh7XG4gICAgICAgIG9wdGlvbnM6IHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuICAgICAgfSwgdGhpcy5lbmRwb2ludHMpO1xuICAgICAgdGhpcy5fcmVzb2x2ZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5fY29uZmlndXJlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLmFwaS5fY29uZmlnLnBhdGhzLnB1c2godGhpcy5wYXRoKTtcbiAgICAgIGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0KGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICBmdWxsUGF0aCA9IHRoaXMuYXBpLl9jb25maWcuYXBpUGF0aCArIHRoaXMucGF0aDtcbiAgICAgIF8uZWFjaChhbGxvd2VkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBlbmRwb2ludDtcbiAgICAgICAgZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdO1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgZG9uZUZ1bmMsIGVuZHBvaW50Q29udGV4dCwgZXJyb3IsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VJbml0aWF0ZWQ7XG4gICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBkb25lRnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9IHtcbiAgICAgICAgICAgIHVybFBhcmFtczogcmVxLnBhcmFtcyxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnksXG4gICAgICAgICAgICBib2R5UGFyYW1zOiByZXEuYm9keSxcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcSxcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXMsXG4gICAgICAgICAgICBkb25lOiBkb25lRnVuY1xuICAgICAgICAgIH07XG4gICAgICAgICAgXy5leHRlbmQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gbnVsbDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50KGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICBpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VJbml0aWF0ZWQpIHtcbiAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlRGF0YSA9PT0gbnVsbCB8fCByZXNwb25zZURhdGEgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZURhdGEuYm9keSAmJiAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgfHwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWplY3RlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgaGVhZGVycywgcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXG4gICAgICAgICAgfTtcbiAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgJ0FsbG93JzogYWxsb3dlZE1ldGhvZHMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KSgpO1xuXG5cbiAgLypcbiAgXHRcdENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICBcdFx0ZnVuY3Rpb25cbiAgXG4gIFx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNvbHZlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oZW5kcG9pbnQpKSB7XG4gICAgICAgIHJldHVybiBlbmRwb2ludHNbbWV0aG9kXSA9IHtcbiAgICAgICAgICBhY3Rpb246IGVuZHBvaW50XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cblxuICAvKlxuICBcdFx0Q29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICBcdFx0YmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG4gIFxuICBcdFx0QXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cbiAgXHRcdGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gIFx0XHRvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gIFx0XHRBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcbiAgXHRcdGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gIFx0XHRyZXNwZWN0aXZlbHkuXG4gIFxuICBcdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gIFx0XHRAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY29uZmlndXJlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kKSB7XG4gICAgICB2YXIgcmVmLCByZWYxLCByZWYyO1xuICAgICAgaWYgKG1ldGhvZCAhPT0gJ29wdGlvbnMnKSB7XG4gICAgICAgIGlmICghKChyZWYgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYucm9sZVJlcXVpcmVkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkKTtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludC5yb2xlUmVxdWlyZWQpKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKCgocmVmMSA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjEuYXV0aFJlcXVpcmVkIDogdm9pZCAwKSB8fCBlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHJlZjIgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYyLnNwYWNlUmVxdWlyZWQgOiB2b2lkIDApIHtcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gdGhpcy5vcHRpb25zLnNwYWNlUmVxdWlyZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG4gIFxuICBcdFx0QHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY2FsbEVuZHBvaW50ID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBpbnZvY2F0aW9uO1xuICAgIGlmICh0aGlzLl9hdXRoQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgIGlmICh0aGlzLl9yb2xlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NwYWNlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uKHtcbiAgICAgICAgICAgIGlzU2ltdWxhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcbiAgICAgICAgICAgIGNvbm5lY3Rpb246IG51bGwsXG4gICAgICAgICAgICByYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZShpbnZvY2F0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXNDb2RlOiA0MDEsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLidcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0QXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuICBcbiAgXHRcdE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcbiAgXHRcdGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxuICBcdFx0aW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICBcdFx0QHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlKGVuZHBvaW50Q29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxuICBcbiAgXHRcdElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cbiAgXG4gIFx0XHRAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQpIHtcbiAgICB2YXIgYXV0aCwgdXNlclNlbGVjdG9yO1xuICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgaWYgKChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXJJZCA6IHZvaWQgMCkgJiYgKGF1dGggIT0gbnVsbCA/IGF1dGgudG9rZW4gOiB2b2lkIDApICYmICEoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSkge1xuICAgICAgdXNlclNlbGVjdG9yID0ge307XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWQ7XG4gICAgICB1c2VyU2VsZWN0b3JbdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW47XG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VyU2VsZWN0b3IpO1xuICAgIH1cbiAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSB7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlcjtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gIFx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICBcdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgXHRcdFx0XHRcdFx0IGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fc3BhY2VBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgYXV0aCwgc3BhY2UsIHNwYWNlX3VzZXJzX2NvdW50O1xuICAgIGlmIChlbmRwb2ludC5zcGFjZVJlcXVpcmVkKSB7XG4gICAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGguc3BhY2VJZCA6IHZvaWQgMCkge1xuICAgICAgICBzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHVzZXI6IGF1dGgudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBhdXRoLnNwYWNlSWRcbiAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXJzX2NvdW50KSB7XG4gICAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpO1xuICAgICAgICAgIGlmICgoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmlzX3BhaWQgOiB2b2lkIDApICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKSA+PSAwKSB7XG4gICAgICAgICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gIFx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICBcdFx0XHRcdFx0XHQgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yb2xlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgaWYgKF8uaXNFbXB0eShfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc3BvbmQgPSBmdW5jdGlvbihyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZSwgaGVhZGVycykge1xuICAgIHZhciBkZWZhdWx0SGVhZGVycywgZGVsYXlJbk1pbGxpc2Vjb25kcywgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMsIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvLCBzZW5kUmVzcG9uc2U7XG4gICAgaWYgKHN0YXR1c0NvZGUgPT0gbnVsbCkge1xuICAgICAgc3RhdHVzQ29kZSA9IDIwMDtcbiAgICB9XG4gICAgaWYgKGhlYWRlcnMgPT0gbnVsbCkge1xuICAgICAgaGVhZGVycyA9IHt9O1xuICAgIH1cbiAgICBkZWZhdWx0SGVhZGVycyA9IHRoaXMuX2xvd2VyQ2FzZUtleXModGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0SGVhZGVycyk7XG4gICAgaGVhZGVycyA9IHRoaXMuX2xvd2VyQ2FzZUtleXMoaGVhZGVycyk7XG4gICAgaGVhZGVycyA9IF8uZXh0ZW5kKGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzKTtcbiAgICBpZiAoaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hcGkuX2NvbmZpZy5wcmV0dHlKc29uKSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5LCB2b2lkIDAsIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICAgICAgfVxuICAgIH1cbiAgICBzZW5kUmVzcG9uc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZChzdGF0dXNDb2RlLCBoZWFkZXJzKTtcbiAgICAgIHJlc3BvbnNlLndyaXRlKGJvZHkpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmVuZCgpO1xuICAgIH07XG4gICAgaWYgKHN0YXR1c0NvZGUgPT09IDQwMSB8fCBzdGF0dXNDb2RlID09PSA0MDMpIHtcbiAgICAgIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzID0gNTAwO1xuICAgICAgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28gPSAxICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvO1xuICAgICAgcmV0dXJuIE1ldGVvci5zZXRUaW1lb3V0KHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZW5kUmVzcG9uc2UoKTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0UmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2xvd2VyQ2FzZUtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gXy5jaGFpbihvYmplY3QpLnBhaXJzKCkubWFwKGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiBbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXTtcbiAgICB9KS5vYmplY3QoKS52YWx1ZSgpO1xuICB9O1xuXG4gIHJldHVybiBSb3V0ZTtcblxufSkoKTtcbiIsImJhc2ljQXV0aCA9IHJlcXVpcmUoJ2Jhc2ljLWF1dGgnKVxyXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuXHJcbmNsYXNzIEBPZGF0YVJlc3RpdnVzXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cclxuXHRcdEBfcm91dGVzID0gW11cclxuXHRcdEBfY29uZmlnID1cclxuXHRcdFx0cGF0aHM6IFtdXHJcblx0XHRcdHVzZURlZmF1bHRBdXRoOiBmYWxzZVxyXG5cdFx0XHRhcGlQYXRoOiAnYXBpLydcclxuXHRcdFx0dmVyc2lvbjogbnVsbFxyXG5cdFx0XHRwcmV0dHlKc29uOiBmYWxzZVxyXG5cdFx0XHRhdXRoOlxyXG5cdFx0XHRcdHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJ1xyXG5cdFx0XHRcdHVzZXI6IC0+XHJcblx0XHRcdFx0XHRjb29raWVzID0gbmV3IENvb2tpZXMoIEByZXF1ZXN0LCBAcmVzcG9uc2UgKVxyXG5cdFx0XHRcdFx0dXNlcklkID0gQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHRcdFx0XHRcdGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblx0XHRcdFx0XHRzcGFjZUlkID0gQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IEB1cmxQYXJhbXNbJ3NwYWNlSWQnXVxyXG5cdFx0XHRcdFx0aWYgYXV0aFRva2VuXHJcblx0XHRcdFx0XHRcdHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxyXG5cdFx0XHRcdFx0aWYgQHJlcXVlc3QudXNlcklkXHJcblx0XHRcdFx0XHRcdF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBAcmVxdWVzdC51c2VySWR9KVxyXG5cdFx0XHRcdFx0XHR1c2VyOiBfdXNlclxyXG5cdFx0XHRcdFx0XHR1c2VySWQ6IHVzZXJJZFxyXG5cdFx0XHRcdFx0XHRzcGFjZUlkOiBzcGFjZUlkXHJcblx0XHRcdFx0XHRcdHRva2VuOiB0b2tlblxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR1c2VySWQ6IHVzZXJJZFxyXG5cdFx0XHRcdFx0XHRzcGFjZUlkOiBzcGFjZUlkXHJcblx0XHRcdFx0XHRcdHRva2VuOiB0b2tlblxyXG5cdFx0XHRkZWZhdWx0SGVhZGVyczpcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcblx0XHRcdGVuYWJsZUNvcnM6IHRydWVcclxuXHJcblx0XHQjIENvbmZpZ3VyZSBBUEkgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xyXG5cdFx0Xy5leHRlbmQgQF9jb25maWcsIG9wdGlvbnNcclxuXHJcblx0XHRpZiBAX2NvbmZpZy5lbmFibGVDb3JzXHJcblx0XHRcdGNvcnNIZWFkZXJzID1cclxuXHRcdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXHJcblx0XHRcdFx0J0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCwgT0RhdGEtVmVyc2lvbidcclxuXHJcblx0XHRcdGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXHJcblx0XHRcdFx0Y29yc0hlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSArPSAnLCBYLVVzZXItSWQsIFgtQXV0aC1Ub2tlbiwgWC1TcGFjZS1JZCdcclxuXHJcblx0XHRcdCMgU2V0IGRlZmF1bHQgaGVhZGVyIHRvIGVuYWJsZSBDT1JTIGlmIGNvbmZpZ3VyZWRcclxuXHRcdFx0Xy5leHRlbmQgQF9jb25maWcuZGVmYXVsdEhlYWRlcnMsIGNvcnNIZWFkZXJzXHJcblxyXG5cdFx0XHRpZiBub3QgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxyXG5cdFx0XHRcdEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQgPSAtPlxyXG5cdFx0XHRcdFx0QHJlc3BvbnNlLndyaXRlSGVhZCAyMDAsIGNvcnNIZWFkZXJzXHJcblx0XHRcdFx0XHRAZG9uZSgpXHJcblxyXG5cdFx0IyBOb3JtYWxpemUgdGhlIEFQSSBwYXRoXHJcblx0XHRpZiBAX2NvbmZpZy5hcGlQYXRoWzBdIGlzICcvJ1xyXG5cdFx0XHRAX2NvbmZpZy5hcGlQYXRoID0gQF9jb25maWcuYXBpUGF0aC5zbGljZSAxXHJcblx0XHRpZiBfLmxhc3QoQF9jb25maWcuYXBpUGF0aCkgaXNudCAnLydcclxuXHRcdFx0QF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGggKyAnLydcclxuXHJcblx0XHQjIFVSTCBwYXRoIHZlcnNpb25pbmcgaXMgdGhlIG9ubHkgdHlwZSBvZiBBUEkgdmVyc2lvbmluZyBjdXJyZW50bHkgYXZhaWxhYmxlLCBzbyBpZiBhIHZlcnNpb24gaXNcclxuXHRcdCMgcHJvdmlkZWQsIGFwcGVuZCBpdCB0byB0aGUgYmFzZSBwYXRoIG9mIHRoZSBBUElcclxuXHRcdGlmIEBfY29uZmlnLnZlcnNpb25cclxuXHRcdFx0QF9jb25maWcuYXBpUGF0aCArPSBAX2NvbmZpZy52ZXJzaW9uICsgJy8nXHJcblxyXG5cdFx0IyBBZGQgZGVmYXVsdCBsb2dpbiBhbmQgbG9nb3V0IGVuZHBvaW50cyBpZiBhdXRoIGlzIGNvbmZpZ3VyZWRcclxuXHRcdGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXHJcblx0XHRcdEBfaW5pdEF1dGgoKVxyXG5cdFx0ZWxzZSBpZiBAX2NvbmZpZy51c2VBdXRoXHJcblx0XHRcdEBfaW5pdEF1dGgoKVxyXG5cdFx0XHRjb25zb2xlLndhcm4gJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArXHJcblx0XHRcdFx0XHQnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnXHJcblxyXG5cdFx0cmV0dXJuIHRoaXNcclxuXHJcblxyXG5cdCMjIypcclxuXHRcdEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcclxuXHJcblx0XHRAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXHJcblx0XHRAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcclxuXHRcdEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcclxuXHRcdEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxyXG5cdFx0QHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxyXG5cdFx0QHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxyXG5cdFx0XHRcdGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcclxuXHRcdFx0XHRhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXHJcblx0IyMjXHJcblx0YWRkUm91dGU6IChwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIC0+XHJcblx0XHQjIENyZWF0ZSBhIG5ldyByb3V0ZSBhbmQgYWRkIGl0IHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHJvdXRlc1xyXG5cdFx0cm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKVxyXG5cdFx0QF9yb3V0ZXMucHVzaChyb3V0ZSlcclxuXHJcblx0XHRyb3V0ZS5hZGRUb0FwaSgpXHJcblxyXG5cdFx0cmV0dXJuIHRoaXNcclxuXHJcblxyXG5cdCMjIypcclxuXHRcdEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcclxuXHQjIyNcclxuXHRhZGRDb2xsZWN0aW9uOiAoY29sbGVjdGlvbiwgb3B0aW9ucz17fSkgLT5cclxuXHRcdG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ11cclxuXHRcdG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ11cclxuXHJcblx0XHQjIEdyYWIgdGhlIHNldCBvZiBlbmRwb2ludHNcclxuXHRcdGlmIGNvbGxlY3Rpb24gaXMgTWV0ZW9yLnVzZXJzXHJcblx0XHRcdGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzXHJcblx0XHRlbHNlXHJcblx0XHRcdGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX2NvbGxlY3Rpb25FbmRwb2ludHNcclxuXHJcblx0XHQjIEZsYXR0ZW4gdGhlIG9wdGlvbnMgYW5kIHNldCBkZWZhdWx0cyBpZiBuZWNlc3NhcnlcclxuXHRcdGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIG9yIHt9XHJcblx0XHRyb3V0ZU9wdGlvbnMgPSBvcHRpb25zLnJvdXRlT3B0aW9ucyBvciB7fVxyXG5cdFx0ZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIG9yIFtdXHJcblx0XHQjIFVzZSBjb2xsZWN0aW9uIG5hbWUgYXMgZGVmYXVsdCBwYXRoXHJcblx0XHRwYXRoID0gb3B0aW9ucy5wYXRoIG9yIGNvbGxlY3Rpb24uX25hbWVcclxuXHJcblx0XHQjIFNlcGFyYXRlIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRzIGJ5IHRoZSByb3V0ZSB0aGV5IGJlbG9uZyB0byAob25lIGZvciBvcGVyYXRpbmcgb24gdGhlIGVudGlyZVxyXG5cdFx0IyBjb2xsZWN0aW9uIGFuZCBvbmUgZm9yIG9wZXJhdGluZyBvbiBhIHNpbmdsZSBlbnRpdHkgd2l0aGluIHRoZSBjb2xsZWN0aW9uKVxyXG5cdFx0Y29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge31cclxuXHRcdGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge31cclxuXHRcdGlmIF8uaXNFbXB0eShlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24pIGFuZCBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpXHJcblx0XHRcdCMgR2VuZXJhdGUgYWxsIGVuZHBvaW50cyBvbiB0aGlzIGNvbGxlY3Rpb25cclxuXHRcdFx0Xy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XHJcblx0XHRcdFx0IyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXHJcblx0XHRcdFx0aWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cclxuXHRcdFx0XHRcdF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcclxuXHRcdFx0XHRlbHNlIF8uZXh0ZW5kIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHQsIHRoaXNcclxuXHRcdGVsc2VcclxuXHRcdFx0IyBHZW5lcmF0ZSBhbnkgZW5kcG9pbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZXhjbHVkZWRcclxuXHRcdFx0Xy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XHJcblx0XHRcdFx0aWYgbWV0aG9kIG5vdCBpbiBleGNsdWRlZEVuZHBvaW50cyBhbmQgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gaXNudCBmYWxzZVxyXG5cdFx0XHRcdFx0IyBDb25maWd1cmUgZW5kcG9pbnQgYW5kIG1hcCB0byBpdCdzIGh0dHAgbWV0aG9kXHJcblx0XHRcdFx0XHQjIFRPRE86IENvbnNpZGVyIHByZWRlZmluaW5nIGEgbWFwIG9mIG1ldGhvZHMgdG8gdGhlaXIgaHR0cCBtZXRob2QgdHlwZSAoZS5nLiwgZ2V0QWxsOiBnZXQpXHJcblx0XHRcdFx0XHRlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXVxyXG5cdFx0XHRcdFx0Y29uZmlndXJlZEVuZHBvaW50ID0ge31cclxuXHRcdFx0XHRcdF8uZWFjaCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgKGFjdGlvbiwgbWV0aG9kVHlwZSkgLT5cclxuXHRcdFx0XHRcdFx0Y29uZmlndXJlZEVuZHBvaW50W21ldGhvZFR5cGVdID1cclxuXHRcdFx0XHRcdFx0XHRfLmNoYWluIGFjdGlvblxyXG5cdFx0XHRcdFx0XHRcdC5jbG9uZSgpXHJcblx0XHRcdFx0XHRcdFx0LmV4dGVuZCBlbmRwb2ludE9wdGlvbnNcclxuXHRcdFx0XHRcdFx0XHQudmFsdWUoKVxyXG5cdFx0XHRcdFx0IyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXHJcblx0XHRcdFx0XHRpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxyXG5cdFx0XHRcdFx0XHRfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxyXG5cdFx0XHRcdFx0ZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0LCB0aGlzXHJcblxyXG5cdFx0IyBBZGQgdGhlIHJvdXRlcyB0byB0aGUgQVBJXHJcblx0XHRAYWRkUm91dGUgcGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHNcclxuXHRcdEBhZGRSb3V0ZSBcIiN7cGF0aH0vOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHNcclxuXHJcblx0XHRyZXR1cm4gdGhpc1xyXG5cclxuXHJcblx0IyMjKlxyXG5cdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXHJcblx0IyMjXHJcblx0X2NvbGxlY3Rpb25FbmRwb2ludHM6XHJcblx0XHRnZXQ6IChjb2xsZWN0aW9uKSAtPlxyXG5cdFx0XHRnZXQ6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxyXG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRcdHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgc2VsZWN0b3JcclxuXHRcdFx0XHRcdGlmIGVudGl0eVxyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cclxuXHRcdHB1dDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdHB1dDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XHJcblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCAkc2V0OiBAYm9keVBhcmFtc1xyXG5cdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXHJcblx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXHJcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG5cdFx0ZGVsZXRlOiAoY29sbGVjdGlvbikgLT5cclxuXHRcdFx0ZGVsZXRlOlxyXG5cdFx0XHRcdGFjdGlvbjogLT5cclxuXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cclxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxyXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG5cdFx0XHRcdFx0aWYgY29sbGVjdGlvbi5yZW1vdmUgc2VsZWN0b3JcclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cclxuXHRcdHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxyXG5cdFx0XHRwb3N0OlxyXG5cdFx0XHRcdGFjdGlvbjogLT5cclxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxyXG5cdFx0XHRcdFx0XHRAYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG5cdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xyXG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXHJcblx0XHRcdFx0XHRpZiBlbnRpdHlcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCd9XHJcblx0XHRnZXRBbGw6IChjb2xsZWN0aW9uKSAtPlxyXG5cdFx0XHRnZXQ6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRcdHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChzZWxlY3RvcikuZmV0Y2goKVxyXG5cdFx0XHRcdFx0aWYgZW50aXRpZXNcclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nfVxyXG5cclxuXHJcblx0IyMjKlxyXG5cdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxyXG5cdCMjI1xyXG5cdF91c2VyQ29sbGVjdGlvbkVuZHBvaW50czpcclxuXHRcdGdldDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdGdldDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXHJcblx0XHRcdFx0XHRpZiBlbnRpdHlcclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XHJcblx0XHRwdXQ6IChjb2xsZWN0aW9uKSAtPlxyXG5cdFx0XHRwdXQ6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgQHVybFBhcmFtcy5pZCwgJHNldDogcHJvZmlsZTogQGJvZHlQYXJhbXNcclxuXHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxyXG5cdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXHJcblx0XHRcdFx0XHRcdHtzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBlbnRpdHl9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XHJcblx0XHRkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxyXG5cdFx0XHRkZWxldGU6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0aWYgY29sbGVjdGlvbi5yZW1vdmUgQHVybFBhcmFtcy5pZFxyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnfVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxyXG5cdFx0cG9zdDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdHBvc3Q6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0IyBDcmVhdGUgYSBuZXcgdXNlciBhY2NvdW50XHJcblx0XHRcdFx0XHRlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIgQGJvZHlQYXJhbXNcclxuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZCwgZmllbGRzOiBwcm9maWxlOiAxXHJcblx0XHRcdFx0XHRpZiBlbnRpdHlcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCd9XHJcblx0XHRnZXRBbGw6IChjb2xsZWN0aW9uKSAtPlxyXG5cdFx0XHRnZXQ6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0ZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIGZpZWxkczogcHJvZmlsZTogMSkuZmV0Y2goKVxyXG5cdFx0XHRcdFx0aWYgZW50aXRpZXNcclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2Vycyd9XHJcblxyXG5cclxuXHQjIyNcclxuXHRcdEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcclxuXHQjIyNcclxuXHRfaW5pdEF1dGg6IC0+XHJcblx0XHRzZWxmID0gdGhpc1xyXG5cdFx0IyMjXHJcblx0XHRcdEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcclxuXHJcblx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXHJcblx0XHRcdGFkZGluZyBob29rKS5cclxuXHRcdCMjI1xyXG5cdFx0QGFkZFJvdXRlICdsb2dpbicsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSxcclxuXHRcdFx0cG9zdDogLT5cclxuXHRcdFx0XHQjIEdyYWIgdGhlIHVzZXJuYW1lIG9yIGVtYWlsIHRoYXQgdGhlIHVzZXIgaXMgbG9nZ2luZyBpbiB3aXRoXHJcblx0XHRcdFx0dXNlciA9IHt9XHJcblx0XHRcdFx0aWYgQGJvZHlQYXJhbXMudXNlclxyXG5cdFx0XHRcdFx0aWYgQGJvZHlQYXJhbXMudXNlci5pbmRleE9mKCdAJykgaXMgLTFcclxuXHRcdFx0XHRcdFx0dXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0dXNlci5lbWFpbCA9IEBib2R5UGFyYW1zLnVzZXJcclxuXHRcdFx0XHRlbHNlIGlmIEBib2R5UGFyYW1zLnVzZXJuYW1lXHJcblx0XHRcdFx0XHR1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlcm5hbWVcclxuXHRcdFx0XHRlbHNlIGlmIEBib2R5UGFyYW1zLmVtYWlsXHJcblx0XHRcdFx0XHR1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMuZW1haWxcclxuXHJcblx0XHRcdFx0IyBUcnkgdG8gbG9nIHRoZSB1c2VyIGludG8gdGhlIHVzZXIncyBhY2NvdW50IChpZiBzdWNjZXNzZnVsIHdlJ2xsIGdldCBhbiBhdXRoIHRva2VuIGJhY2spXHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCB1c2VyLCBAYm9keVBhcmFtcy5wYXNzd29yZFxyXG5cdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZVxyXG5cdFx0XHRcdFx0cmV0dXJuIHt9ID1cclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogZS5lcnJvclxyXG5cdFx0XHRcdFx0XHRib2R5OiBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6IGUucmVhc29uXHJcblxyXG5cdFx0XHRcdCMgR2V0IHRoZSBhdXRoZW50aWNhdGVkIHVzZXJcclxuXHRcdFx0XHQjIFRPRE86IENvbnNpZGVyIHJldHVybmluZyB0aGUgdXNlciBpbiBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKCksIGluc3RlYWQgb2YgZmV0Y2hpbmcgaXQgYWdhaW4gaGVyZVxyXG5cdFx0XHRcdGlmIGF1dGgudXNlcklkIGFuZCBhdXRoLmF1dGhUb2tlblxyXG5cdFx0XHRcdFx0c2VhcmNoUXVlcnkgPSB7fVxyXG5cdFx0XHRcdFx0c2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGguYXV0aFRva2VuXHJcblx0XHRcdFx0XHRAdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRcdFx0XHRcdCdfaWQnOiBhdXRoLnVzZXJJZFxyXG5cdFx0XHRcdFx0XHRzZWFyY2hRdWVyeVxyXG5cdFx0XHRcdFx0QHVzZXJJZCA9IEB1c2VyPy5faWRcclxuXHJcblx0XHRcdFx0cmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGF1dGh9XHJcblxyXG5cdFx0XHRcdCMgQ2FsbCB0aGUgbG9naW4gaG9vayB3aXRoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYXR0YWNoZWRcclxuXHRcdFx0XHRleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbj8uY2FsbCh0aGlzKVxyXG5cdFx0XHRcdGlmIGV4dHJhRGF0YT9cclxuXHRcdFx0XHRcdF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcclxuXHJcblx0XHRcdFx0cmVzcG9uc2VcclxuXHJcblx0XHRsb2dvdXQgPSAtPlxyXG5cdFx0XHQjIFJlbW92ZSB0aGUgZ2l2ZW4gYXV0aCB0b2tlbiBmcm9tIHRoZSB1c2VyJ3MgYWNjb3VudFxyXG5cdFx0XHRhdXRoVG9rZW4gPSBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxyXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cclxuXHRcdFx0dG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuXHJcblx0XHRcdGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZiAnLidcclxuXHRcdFx0dG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgMCwgaW5kZXhcclxuXHRcdFx0dG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyBpbmRleCArIDFcclxuXHRcdFx0dG9rZW5Ub1JlbW92ZSA9IHt9XHJcblx0XHRcdHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW5cclxuXHRcdFx0dG9rZW5SZW1vdmFsUXVlcnkgPSB7fVxyXG5cdFx0XHR0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZVxyXG5cdFx0XHRNZXRlb3IudXNlcnMudXBkYXRlIEB1c2VyLl9pZCwgeyRwdWxsOiB0b2tlblJlbW92YWxRdWVyeX1cclxuXHJcblx0XHRcdHJlc3BvbnNlID0ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7bWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnfX1cclxuXHJcblx0XHRcdCMgQ2FsbCB0aGUgbG9nb3V0IGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXHJcblx0XHRcdGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZE91dD8uY2FsbCh0aGlzKVxyXG5cdFx0XHRpZiBleHRyYURhdGE/XHJcblx0XHRcdFx0Xy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxyXG5cclxuXHRcdFx0cmVzcG9uc2VcclxuXHJcblx0XHQjIyNcclxuXHRcdFx0QWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcclxuXHJcblx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBvdXQsIHRoZSBvbkxvZ2dlZE91dCBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcclxuXHRcdFx0YWRkaW5nIGhvb2spLlxyXG5cdFx0IyMjXHJcblx0XHRAYWRkUm91dGUgJ2xvZ291dCcsIHthdXRoUmVxdWlyZWQ6IHRydWV9LFxyXG5cdFx0XHRnZXQ6IC0+XHJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIlxyXG5cdFx0XHRcdGNvbnNvbGUud2FybiBcIiAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzL2lzc3Vlcy8xMDBcIlxyXG5cdFx0XHRcdHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKVxyXG5cdFx0XHRwb3N0OiBsb2dvdXRcclxuXHJcbk9kYXRhUmVzdGl2dXMgPSBAT2RhdGFSZXN0aXZ1c1xyXG4iLCJ2YXIgQ29va2llcywgT2RhdGFSZXN0aXZ1cywgYmFzaWNBdXRoLFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbmJhc2ljQXV0aCA9IHJlcXVpcmUoJ2Jhc2ljLWF1dGgnKTtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG50aGlzLk9kYXRhUmVzdGl2dXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE9kYXRhUmVzdGl2dXMob3B0aW9ucykge1xuICAgIHZhciBjb3JzSGVhZGVycztcbiAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcbiAgICB0aGlzLl9jb25maWcgPSB7XG4gICAgICBwYXRoczogW10sXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXG4gICAgICBhcGlQYXRoOiAnYXBpLycsXG4gICAgICB2ZXJzaW9uOiBudWxsLFxuICAgICAgcHJldHR5SnNvbjogZmFsc2UsXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJyxcbiAgICAgICAgdXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF91c2VyLCBhdXRoVG9rZW4sIGNvb2tpZXMsIHNwYWNlSWQsIHRva2VuLCB1c2VySWQ7XG4gICAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKHRoaXMucmVxdWVzdCwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgdXNlcklkID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgICAgIGF1dGhUb2tlbiA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICAgICAgICBzcGFjZUlkID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCB0aGlzLnVybFBhcmFtc1snc3BhY2VJZCddO1xuICAgICAgICAgIGlmIChhdXRoVG9rZW4pIHtcbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QudXNlcklkKSB7XG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMucmVxdWVzdC51c2VySWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcjogX3VzZXIsXG4gICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgICBzcGFjZUlkOiBzcGFjZUlkLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgICBzcGFjZUlkOiBzcGFjZUlkLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcbiAgICB9O1xuICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZywgb3B0aW9ucyk7XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5lbmFibGVDb3JzKSB7XG4gICAgICBjb3JzSGVhZGVycyA9IHtcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCwgT0RhdGEtVmVyc2lvbidcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4sIFgtU3BhY2UtSWQnO1xuICAgICAgfVxuICAgICAgXy5leHRlbmQodGhpcy5fY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVycyk7XG4gICAgICBpZiAoIXRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50KSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZS53cml0ZUhlYWQoMjAwLCBjb3JzSGVhZGVycyk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLmFwaVBhdGhbMF0gPT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aC5zbGljZSgxKTtcbiAgICB9XG4gICAgaWYgKF8ubGFzdCh0aGlzLl9jb25maWcuYXBpUGF0aCkgIT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aCArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy52ZXJzaW9uKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCArPSB0aGlzLl9jb25maWcudmVyc2lvbiArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbmZpZy51c2VBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgKyAnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICBcdFx0QWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuICBcbiAgXHRcdEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcbiAgXHRcdEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICBcdFx0QHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICBcdFx0QHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gIFx0XHRAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gIFx0XHRAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG4gIFx0XHRcdFx0Y29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxuICBcdFx0XHRcdGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuYWRkUm91dGUgPSBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIHtcbiAgICB2YXIgcm91dGU7XG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKTtcbiAgICB0aGlzLl9yb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgcm91dGUuYWRkVG9BcGkoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICBcdFx0R2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5hZGRDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgb3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uRW5kcG9pbnRzLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiwgZW50aXR5Um91dGVFbmRwb2ludHMsIGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2RzLCBtZXRob2RzT25Db2xsZWN0aW9uLCBwYXRoLCByb3V0ZU9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddO1xuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ107XG4gICAgaWYgKGNvbGxlY3Rpb24gPT09IE1ldGVvci51c2Vycykge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fY29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9XG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgfHwge307XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgfHwge307XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIHx8IFtdO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGggfHwgY29sbGVjdGlvbi5fbmFtZTtcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSAmJiBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpKSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGNvbmZpZ3VyZWRFbmRwb2ludCwgZW5kcG9pbnRPcHRpb25zO1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2QpIDwgMCAmJiBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXTtcbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fTtcbiAgICAgICAgICBfLmVhY2goY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIGZ1bmN0aW9uKGFjdGlvbiwgbWV0aG9kVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9IF8uY2hhaW4oYWN0aW9uKS5jbG9uZSgpLmV4dGVuZChlbmRwb2ludE9wdGlvbnMpLnZhbHVlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyk7XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoICsgXCIvOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gIFx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuX2NvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZCwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xuICAgICAgICAgICAgICAkc2V0OiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICBcdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZDtcbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZSh0aGlzLnVybFBhcmFtcy5pZCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgZW50aXR5SWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAoe1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCdcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXM7XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuX2luaXRBdXRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvZ291dCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcblxuICAgIC8qXG4gICAgXHRcdFx0QWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgIFx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgXHRcdFx0YWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHRoaXMuYWRkUm91dGUoJ2xvZ2luJywge1xuICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXV0aCwgZSwgZXh0cmFEYXRhLCByZWYsIHJlZjEsIHJlc3BvbnNlLCBzZWFyY2hRdWVyeSwgdXNlcjtcbiAgICAgICAgdXNlciA9IHt9O1xuICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpID09PSAtMSkge1xuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VybmFtZSkge1xuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLmVtYWlsKSB7XG4gICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy5lbWFpbDtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKHVzZXIsIHRoaXMuYm9keVBhcmFtcy5wYXNzd29yZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3IsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZS5yZWFzb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdXRoLnVzZXJJZCAmJiBhdXRoLmF1dGhUb2tlbikge1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGguYXV0aFRva2VuKTtcbiAgICAgICAgICB0aGlzLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICB9LCBzZWFyY2hRdWVyeSk7XG4gICAgICAgICAgdGhpcy51c2VySWQgPSAocmVmID0gdGhpcy51c2VyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICBkYXRhOiBhdXRoXG4gICAgICAgIH07XG4gICAgICAgIGV4dHJhRGF0YSA9IChyZWYxID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4pICE9IG51bGwgPyByZWYxLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aFRva2VuLCBleHRyYURhdGEsIGhhc2hlZFRva2VuLCBpbmRleCwgcmVmLCByZXNwb25zZSwgdG9rZW5GaWVsZE5hbWUsIHRva2VuTG9jYXRpb24sIHRva2VuUGF0aCwgdG9rZW5SZW1vdmFsUXVlcnksIHRva2VuVG9SZW1vdmU7XG4gICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ107XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuO1xuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKGluZGV4ICsgMSk7XG4gICAgICB0b2tlblRvUmVtb3ZlID0ge307XG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuO1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fTtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlO1xuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh0aGlzLnVzZXIuX2lkLCB7XG4gICAgICAgICRwdWxsOiB0b2tlblJlbW92YWxRdWVyeVxuICAgICAgfSk7XG4gICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGV4dHJhRGF0YSA9IChyZWYgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQpICE9IG51bGwgPyByZWYuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLypcbiAgICBcdFx0XHRBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgIFx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBvdXQsIHRoZSBvbkxvZ2dlZE91dCBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICBcdFx0XHRhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMuYWRkUm91dGUoJ2xvZ291dCcsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCIpO1xuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcyk7XG4gICAgICB9LFxuICAgICAgcG9zdDogbG9nb3V0XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIE9kYXRhUmVzdGl2dXM7XG5cbn0pKCk7XG5cbk9kYXRhUmVzdGl2dXMgPSB0aGlzLk9kYXRhUmVzdGl2dXM7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cclxuXHRnZXRPYmplY3RzID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWVzKS0+XHJcblx0XHRkYXRhID0ge31cclxuXHRcdG9iamVjdF9uYW1lcy5zcGxpdCgnLCcpLmZvckVhY2ggKG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdG9iamVjdCA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0XHRkYXRhW29iamVjdC5uYW1lXSA9IG9iamVjdFxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblxyXG5cdGdldE9iamVjdCA9IChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKS0+XHJcblx0XHRkYXRhID0gXy5jbG9uZShDcmVhdG9yLk9iamVjdHNbQ3JlYXRvci5nZXRPYmplY3ROYW1lKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSldKVxyXG5cdFx0aWYgIWRhdGFcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5peg5pWI55qEaWQgI3tvYmplY3RfbmFtZX1cIilcclxuXHJcblx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pLmZldGNoKClcclxuXHRcdHBzZXRzID0geyBwc2V0c0FkbWluLCBwc2V0c1VzZXIsIHBzZXRzQ3VycmVudCB9XHJcblxyXG5cdFx0b2JqZWN0X3Blcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cclxuXHRcdGRlbGV0ZSBkYXRhLmxpc3Rfdmlld3NcclxuXHRcdGRlbGV0ZSBkYXRhLnBlcm1pc3Npb25fc2V0XHJcblxyXG5cdFx0aWYgb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93UmVhZFxyXG5cdFx0XHRkYXRhLmFsbG93UmVhZCA9IHRydWVcclxuXHRcdFx0ZGF0YS5hbGxvd0VkaXQgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dFZGl0XHJcblx0XHRcdGRhdGEuYWxsb3dEZWxldGUgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcclxuXHRcdFx0ZGF0YS5hbGxvd0NyZWF0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRkYXRhLm1vZGlmeUFsbFJlY29yZHMgPSBvYmplY3RfcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cclxuXHRcdFx0ZmllbGRzID0ge31cclxuXHRcdFx0Xy5mb3JFYWNoIGRhdGEuZmllbGRzLCAoZmllbGQsIGtleSktPlxyXG5cdFx0XHRcdF9maWVsZCA9IF8uY2xvbmUoZmllbGQpXHJcblxyXG5cdFx0XHRcdGlmICFfZmllbGQubmFtZVxyXG5cdFx0XHRcdFx0X2ZpZWxkLm5hbWUgPSBrZXlcclxuXHJcblx0XHRcdFx0I+WwhuS4jeWPr+e8lui+keeahOWtl+auteiuvue9ruS4unJlYWRvbmx5ID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIChfLmluZGV4T2Yob2JqZWN0X3Blcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBfZmllbGQubmFtZSkgPiAtMSlcclxuXHRcdFx0XHRcdF9maWVsZC5yZWFkb25seSA9IHRydWVcclxuXHJcblx0XHRcdFx0I+S4jei/lOWbnuS4jeWPr+ingeWtl+autVxyXG5cdFx0XHRcdGlmIChfLmluZGV4T2Yob2JqZWN0X3Blcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBfZmllbGQubmFtZSkgPCAwKVxyXG5cdFx0XHRcdFx0ZmllbGRzW2tleV0gPSBfZmllbGRcclxuXHJcblx0XHRcdGRhdGEuZmllbGRzID0gZmllbGRzXHJcblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRkYXRhLmFsbG93UmVhZCA9IGZhbHNlXHJcblxyXG5cdFx0cmV0dXJuIGRhdGFcclxuXHJcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsIFN0ZWVkb3NPRGF0YS5BUElfUEFUSCArICcvb2JqZWN0cy86aWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0XHR0cnlcclxuXHRcdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcclxuXHRcdFx0aWYgIXVzZXJJZFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIilcclxuXHJcblx0XHRcdHNwYWNlSWQgPSByZXEucGFyYW1zPy5zcGFjZUlkXHJcblx0XHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTWlzcyBzcGFjZUlkXCIpXHJcblxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IHJlcS5wYXJhbXM/LmlkXHJcblx0XHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3MgaWRcIilcclxuXHJcblx0XHRcdF9vYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmRPbmUoe19pZDogb2JqZWN0X25hbWV9KVxyXG5cclxuXHRcdFx0aWYgX29iaiAmJiBfb2JqLm5hbWVcclxuXHRcdFx0XHRvYmplY3RfbmFtZSA9IF9vYmoubmFtZVxyXG5cclxuXHRcdFx0aWYgb2JqZWN0X25hbWUuc3BsaXQoJywnKS5sZW5ndGggPiAxXHJcblx0XHRcdFx0ZGF0YSA9IGdldE9iamVjdHMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGRhdGEgPSBnZXRPYmplY3Qoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0XHRjb2RlOiAyMDAsXHJcblx0XHRcdFx0ZGF0YTogZGF0YSB8fCB7fVxyXG5cdFx0XHR9XHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdFx0Y29kZTogZS5lcnJvciB8fCA1MDBcclxuXHRcdFx0XHRkYXRhOiB7ZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2V9XHJcblx0XHRcdH0iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGdldE9iamVjdCwgZ2V0T2JqZWN0cztcbiAgZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWVzKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHt9O1xuICAgIG9iamVjdF9uYW1lcy5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBvYmplY3Q7XG4gICAgICBvYmplY3QgPSBnZXRPYmplY3Qoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICByZXR1cm4gZGF0YVtvYmplY3QubmFtZV0gPSBvYmplY3Q7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG4gIGdldE9iamVjdCA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgZGF0YSwgZmllbGRzLCBvYmplY3RfcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1cnJlbnQsIHBzZXRzVXNlcjtcbiAgICBkYXRhID0gXy5jbG9uZShDcmVhdG9yLk9iamVjdHNbQ3JlYXRvci5nZXRPYmplY3ROYW1lKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSldKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuaXoOaViOeahGlkIFwiICsgb2JqZWN0X25hbWUpO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnRcbiAgICB9O1xuICAgIG9iamVjdF9wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgZGVsZXRlIGRhdGEubGlzdF92aWV3cztcbiAgICBkZWxldGUgZGF0YS5wZXJtaXNzaW9uX3NldDtcbiAgICBpZiAob2JqZWN0X3Blcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgICAgZGF0YS5hbGxvd1JlYWQgPSB0cnVlO1xuICAgICAgZGF0YS5hbGxvd0VkaXQgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dFZGl0O1xuICAgICAgZGF0YS5hbGxvd0RlbGV0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZTtcbiAgICAgIGRhdGEuYWxsb3dDcmVhdGUgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dDcmVhdGU7XG4gICAgICBkYXRhLm1vZGlmeUFsbFJlY29yZHMgPSBvYmplY3RfcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgIGZpZWxkcyA9IHt9O1xuICAgICAgXy5mb3JFYWNoKGRhdGEuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgICAgIHZhciBfZmllbGQ7XG4gICAgICAgIF9maWVsZCA9IF8uY2xvbmUoZmllbGQpO1xuICAgICAgICBpZiAoIV9maWVsZC5uYW1lKSB7XG4gICAgICAgICAgX2ZpZWxkLm5hbWUgPSBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA+IC0xKSB7XG4gICAgICAgICAgX2ZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpIDwgMCkge1xuICAgICAgICAgIHJldHVybiBmaWVsZHNba2V5XSA9IF9maWVsZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYXRhLmZpZWxkcyA9IGZpZWxkcztcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgU3RlZWRvc09EYXRhLkFQSV9QQVRIICsgJy9vYmplY3RzLzppZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIF9vYmosIGRhdGEsIGUsIG9iamVjdF9uYW1lLCByZWYsIHJlZjEsIHNwYWNlSWQsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgICB9XG4gICAgICBzcGFjZUlkID0gKHJlZiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMDtcbiAgICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJNaXNzIHNwYWNlSWRcIik7XG4gICAgICB9XG4gICAgICBvYmplY3RfbmFtZSA9IChyZWYxID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZjEuaWQgOiB2b2lkIDA7XG4gICAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3MgaWRcIik7XG4gICAgICB9XG4gICAgICBfb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgICAgX2lkOiBvYmplY3RfbmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoX29iaiAmJiBfb2JqLm5hbWUpIHtcbiAgICAgICAgb2JqZWN0X25hbWUgPSBfb2JqLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAob2JqZWN0X25hbWUuc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XG4gICAgICAgIGRhdGEgPSBnZXRPYmplY3RzKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YSA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YTogZGF0YSB8fCB7fVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiBlLmVycm9yIHx8IDUwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0TWV0ZW9yT0RhdGFSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuTWV0ZW9yT0RhdGFSb3V0ZXI7XHJcblx0T0RhdGFSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuT0RhdGFSb3V0ZXJcclxuXHRleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG5cdGFwcCA9IGV4cHJlc3MoKTtcclxuXHRhcHAudXNlKCcvYXBpL29kYXRhL3Y0JywgTWV0ZW9yT0RhdGFSb3V0ZXIpO1xyXG5cdE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuTWV0ZW9yT0RhdGFBUElWNFJvdXRlcjtcclxuXHRpZiBNZXRlb3JPRGF0YUFQSVY0Um91dGVyXHJcblx0XHRhcHAudXNlKCcvYXBpL3Y0JywgTWV0ZW9yT0RhdGFBUElWNFJvdXRlcilcclxuXHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShhcHApO1xyXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpLT5cclxuXHRcdGlmKG5hbWUgIT0gJ2RlZmF1bHQnKVxyXG5cdFx0XHRvdGhlckFwcCA9IGV4cHJlc3MoKTtcclxuXHRcdFx0b3RoZXJBcHAudXNlKFwiL2FwaS9vZGF0YS8je25hbWV9XCIsIE9EYXRhUm91dGVyKTtcclxuXHRcdFx0V2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2Uob3RoZXJBcHApO1xyXG5cclxuIyBcdG9kYXRhVjRNb25nb2RiID0gcmVxdWlyZSAnb2RhdGEtdjQtbW9uZ29kYidcclxuIyBcdHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSAncXVlcnlzdHJpbmcnXHJcblxyXG4jIFx0aGFuZGxlRXJyb3IgPSAoZSktPlxyXG4jIFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuIyBcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdGVycm9yID0ge31cclxuIyBcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IGUubWVzc2FnZVxyXG4jIFx0XHRzdGF0dXNDb2RlID0gNTAwXHJcbiMgXHRcdGlmIGUuZXJyb3IgYW5kIF8uaXNOdW1iZXIoZS5lcnJvcilcclxuIyBcdFx0XHRzdGF0dXNDb2RlID0gZS5lcnJvclxyXG4jIFx0XHRlcnJvclsnY29kZSddID0gc3RhdHVzQ29kZVxyXG4jIFx0XHRlcnJvclsnZXJyb3InXSA9IHN0YXR1c0NvZGVcclxuIyBcdFx0ZXJyb3JbJ2RldGFpbHMnXSA9IGUuZGV0YWlsc1xyXG4jIFx0XHRlcnJvclsncmVhc29uJ10gPSBlLnJlYXNvblxyXG4jIFx0XHRib2R5WydlcnJvciddID0gZXJyb3JcclxuIyBcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRzdGF0dXNDb2RlOiBzdGF0dXNDb2RlXHJcbiMgXHRcdFx0Ym9keTpib2R5XHJcbiMgXHRcdH1cclxuXHJcbiMgXHR2aXNpdG9yUGFyc2VyID0gKHZpc2l0b3IpLT5cclxuIyBcdFx0cGFyc2VkT3B0ID0ge31cclxuIyBcdFx0aWYgdmlzaXRvci5wcm9qZWN0aW9uXHJcbiMgXHRcdFx0cGFyc2VkT3B0LmZpZWxkcyA9IHZpc2l0b3IucHJvamVjdGlvblxyXG4jIFx0XHRpZiB2aXNpdG9yLmhhc093blByb3BlcnR5KCdsaW1pdCcpXHJcbiMgXHRcdFx0cGFyc2VkT3B0LmxpbWl0ID0gdmlzaXRvci5saW1pdFxyXG5cclxuIyBcdFx0aWYgdmlzaXRvci5oYXNPd25Qcm9wZXJ0eSgnc2tpcCcpXHJcbiMgXHRcdFx0cGFyc2VkT3B0LnNraXAgPSB2aXNpdG9yLnNraXBcclxuXHJcbiMgXHRcdGlmIHZpc2l0b3Iuc29ydFxyXG4jIFx0XHRcdHBhcnNlZE9wdC5zb3J0ID0gdmlzaXRvci5zb3J0XHJcblxyXG4jIFx0XHRwYXJzZWRPcHRcclxuIyBcdGRlYWxXaXRoRXhwYW5kID0gKGNyZWF0ZVF1ZXJ5LCBlbnRpdGllcywga2V5LCBzcGFjZUlkKS0+XHJcbiMgXHRcdGlmIF8uaXNFbXB0eSBjcmVhdGVRdWVyeS5pbmNsdWRlc1xyXG4jIFx0XHRcdHJldHVyblxyXG5cclxuIyBcdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKVxyXG4jIFx0XHRfLmVhY2ggY3JlYXRlUXVlcnkuaW5jbHVkZXMsIChpbmNsdWRlKS0+XHJcbiMgXHRcdFx0IyBjb25zb2xlLmxvZyAnaW5jbHVkZTogJywgaW5jbHVkZVxyXG4jIFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eSA9IGluY2x1ZGUubmF2aWdhdGlvblByb3BlcnR5XHJcbiMgXHRcdFx0IyBjb25zb2xlLmxvZyAnbmF2aWdhdGlvblByb3BlcnR5OiAnLCBuYXZpZ2F0aW9uUHJvcGVydHlcclxuIyBcdFx0XHRmaWVsZCA9IG9iai5maWVsZHNbbmF2aWdhdGlvblByb3BlcnR5XVxyXG4jIFx0XHRcdGlmIGZpZWxkIGFuZCAoZmllbGQudHlwZSBpcyAnbG9va3VwJyBvciBmaWVsZC50eXBlIGlzICdtYXN0ZXJfZGV0YWlsJylcclxuIyBcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pXHJcbiMgXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpXHJcbiMgXHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG9cclxuIyBcdFx0XHRcdFx0cXVlcnlPcHRpb25zID0gdmlzaXRvclBhcnNlcihpbmNsdWRlKVxyXG4jIFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nIGZpZWxkLnJlZmVyZW5jZV90b1xyXG4jIFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcbiMgXHRcdFx0XHRcdFx0X3JvX05BTUVfRklFTERfS0VZID0gQ3JlYXRvci5nZXRPYmplY3QoZmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKT8uTkFNRV9GSUVMRF9LRVlcclxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggZW50aXRpZXMsIChlbnRpdHksIGlkeCktPlxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV1cclxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbERhdGEgPSBfLmNsb25lKGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdG11bHRpUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiB7JGluOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XX19LCBpbmNsdWRlLnF1ZXJ5XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLmZpbmQobXVsdGlRdWVyeSwgcXVlcnlPcHRpb25zKS5mZXRjaCgpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgIWVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XS5sZW5ndGhcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IG9yaWdpbmFsRGF0YVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdCPmjpLluo9cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBDcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyhlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0sIG9yaWdpbmFsRGF0YSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBfLm1hcCBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0sIChvKS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRvWydyZWZlcmVuY2VfdG8ubyddID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLl9uYW1lXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRvWydyZWZlcmVuY2VfdG8uX28nXSA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0b1snX05BTUVfRklFTERfVkFMVUUnXSA9IG9bX3JvX05BTUVfRklFTERfS0VZXVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9cclxuIyBcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNpbmdsZVF1ZXJ5ID0gXy5leHRlbmQge19pZDogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV19LCBpbmNsdWRlLnF1ZXJ5XHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdCMg54m55q6K5aSE55CG5Zyo55u45YWz6KGo5Lit5rKh5pyJ5om+5Yiw5pWw5o2u55qE5oOF5Ya177yM6L+U5Zue5Y6f5pWw5o2uXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLmZpbmRPbmUoc2luZ2xlUXVlcnksIHF1ZXJ5T3B0aW9ucykgfHwgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLl9vJ10gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsnX05BTUVfRklFTERfVkFMVUUnXSA9IGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVtfcm9fTkFNRV9GSUVMRF9LRVldXHJcbiMgXHRcdFx0XHRcdGlmIF8uaXNBcnJheSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggZW50aXRpZXMsIChlbnRpdHksIGlkeCktPlxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0/Lmlkc1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRfbyA9IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLm9cclxuIyBcdFx0XHRcdFx0XHRcdFx0X3JvX05BTUVfRklFTERfS0VZID0gQ3JlYXRvci5nZXRPYmplY3QoX28sIHNwYWNlSWQpPy5OQU1FX0ZJRUxEX0tFWVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBxdWVyeU9wdGlvbnM/LmZpZWxkcyAmJiBfcm9fTkFNRV9GSUVMRF9LRVlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRxdWVyeU9wdGlvbnMuZmllbGRzW19yb19OQU1FX0ZJRUxEX0tFWV0gPSAxXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5vLCBzcGFjZUlkKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRpZiByZWZlcmVuY2VUb0NvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0X2lkcyA9IF8uY2xvbmUoZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0uaWRzKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0bXVsdGlRdWVyeSA9IF8uZXh0ZW5kIHtfaWQ6IHskaW46IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLmlkc319LCBpbmNsdWRlLnF1ZXJ5XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBfLm1hcCByZWZlcmVuY2VUb0NvbGxlY3Rpb24uZmluZChtdWx0aVF1ZXJ5LCBxdWVyeU9wdGlvbnMpLmZldGNoKCksIChvKS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1sncmVmZXJlbmNlX3RvLl9vJ10gPSBfb1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvWydfTkFNRV9GSUVMRF9WQUxVRSddID0gb1tfcm9fTkFNRV9GSUVMRF9LRVldXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHQj5o6S5bqPXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBDcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyhlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0sIF9pZHMpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c2luZ2xlUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5pZHNbMF19LCBpbmNsdWRlLnF1ZXJ5XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uZmluZE9uZShzaW5nbGVRdWVyeSwgcXVlcnlPcHRpb25zKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ3JlZmVyZW5jZV90by5fbyddID0gX29cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydfTkFNRV9GSUVMRF9WQUxVRSddID0gZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldW19yb19OQU1FX0ZJRUxEX0tFWV1cclxuXHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHQjIFRPRE9cclxuXHJcblxyXG4jIFx0XHRyZXR1cm5cclxuXHJcbiMgXHRzZXRPZGF0YVByb3BlcnR5PShlbnRpdGllcyxzcGFjZSxrZXkpLT5cclxuIyBcdFx0ZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzID0gW11cclxuIyBcdFx0Xy5lYWNoIGVudGl0aWVzLCAoZW50aXR5LCBpZHgpLT5cclxuIyBcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0ge31cclxuIyBcdFx0XHRpZCA9IGVudGl0aWVzW2lkeF1bXCJfaWRcIl1cclxuIyBcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWydAb2RhdGEuaWQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YU5leHRMaW5rUGF0aChzcGFjZSxrZXkpKyAnKFxcJycgKyBcIiN7aWR9XCIgKyAnXFwnKSdcclxuIyBcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWydAb2RhdGEuZXRhZyddID0gXCJXL1xcXCIwOEQ1ODk3MjBCQkIzREIxXFxcIlwiXHJcbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmVkaXRMaW5rJ10gPSBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWydAb2RhdGEuaWQnXVxyXG4jIFx0XHRcdF8uZXh0ZW5kIGVudGl0eV9PZGF0YVByb3BlcnRpZXMsZW50aXR5XHJcbiMgXHRcdFx0ZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzLnB1c2ggZW50aXR5X09kYXRhUHJvcGVydGllc1xyXG4jIFx0XHRyZXR1cm4gZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzXHJcblxyXG4jIFx0c2V0RXJyb3JNZXNzYWdlID0gKHN0YXR1c0NvZGUsY29sbGVjdGlvbixrZXksYWN0aW9uKS0+XHJcbiMgXHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRlcnJvciA9IHt9XHJcbiMgXHRcdGlubmVyZXJyb3IgPSB7fVxyXG4jIFx0XHRpZiBzdGF0dXNDb2RlID09IDQwNFxyXG4jIFx0XHRcdGlmIGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdGlmIGFjdGlvbiA9PSAncG9zdCdcclxuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfcG9zdF9mYWlsXCIpXHJcbiMgXHRcdFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xyXG4jIFx0XHRcdFx0XHRlcnJvclsnY29kZSddID0gNDA0XHJcbiMgXHRcdFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfcG9zdF9mYWlsXCJcclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfcmVjb3JkX3F1ZXJ5X2ZhaWxcIilcclxuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXHJcbiMgXHRcdFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDRcclxuIyBcdFx0XHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV9yZWNvcmRfcXVlcnlfZmFpbFwiXHJcbiMgXHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfY29sbGVjdGlvbl9xdWVyeV9mYWlsXCIpKyBrZXlcclxuIyBcdFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xyXG4jIFx0XHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwNFxyXG4jIFx0XHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV9jb2xsZWN0aW9uX3F1ZXJ5X2ZhaWxcIlxyXG4jIFx0XHRpZiAgc3RhdHVzQ29kZSA9PSA0MDFcclxuIyBcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9hdXRoZW50aWNhdGlvbl9yZXF1aXJlZFwiKVxyXG4jIFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xyXG4jIFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDFcclxuIyBcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX2F1dGhlbnRpY2F0aW9uX3JlcXVpcmVkXCJcclxuIyBcdFx0aWYgc3RhdHVzQ29kZSA9PSA0MDNcclxuIyBcdFx0XHRzd2l0Y2ggYWN0aW9uXHJcbiMgXHRcdFx0XHR3aGVuICdnZXQnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9hY2Nlc3NfZmFpbFwiKVxyXG4jIFx0XHRcdFx0d2hlbiAncG9zdCcgdGhlbiBpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX2NyZWF0ZV9mYWlsXCIpXHJcbiMgXHRcdFx0XHR3aGVuICdwdXQnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl91cGRhdGVfZmFpbFwiKVxyXG4jIFx0XHRcdFx0d2hlbiAnZGVsZXRlJyB0aGVuIGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfcmVtb3ZlX2ZhaWxcIilcclxuIyBcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX2FjY2Vzc19mYWlsXCIpXHJcbiMgXHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXHJcbiMgXHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwM1xyXG4jIFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfdXNlcl9hY2Nlc3NfZmFpbFwiXHJcbiMgXHRcdGVycm9yWydpbm5lcmVycm9yJ10gPSBpbm5lcmVycm9yXHJcbiMgXHRcdGJvZHlbJ2Vycm9yJ10gPSBlcnJvclxyXG4jIFx0XHRyZXR1cm4gYm9keVxyXG5cclxuIyBcdHJlbW92ZUludmFsaWRNZXRob2QgPSAocXVlcnlQYXJhbXMpLT5cclxuIyBcdFx0aWYgcXVlcnlQYXJhbXMuJGZpbHRlciAmJiBxdWVyeVBhcmFtcy4kZmlsdGVyLmluZGV4T2YoJ3RvbG93ZXIoJykgPiAtMVxyXG4jIFx0XHRcdHJlbW92ZU1ldGhvZCA9ICgkMSktPlxyXG4jIFx0XHRcdFx0cmV0dXJuICQxLnJlcGxhY2UoJ3RvbG93ZXIoJywgJycpLnJlcGxhY2UoJyknLCAnJylcclxuIyBcdFx0XHRxdWVyeVBhcmFtcy4kZmlsdGVyID0gcXVlcnlQYXJhbXMuJGZpbHRlci5yZXBsYWNlKC90b2xvd2VyXFwoKFteXFwpXSspXFwpL2csIHJlbW92ZU1ldGhvZClcclxuXHJcbiMgXHRpc1NhbWVDb21wYW55ID0gKHNwYWNlSWQsIHVzZXJJZCwgY29tcGFueUlkLCBxdWVyeSktPlxyXG4jIFx0XHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IGNvbXBhbnlfaWQ6IDEsIGNvbXBhbnlfaWRzOiAxIH0gfSlcclxuIyBcdFx0aWYgIWNvbXBhbnlJZCAmJiBxdWVyeVxyXG4jIFx0XHRcdGNvbXBhbnlJZCA9IHN1LmNvbXBhbnlfaWRcclxuIyBcdFx0XHRxdWVyeS5jb21wYW55X2lkID0geyAkaW46IHN1LmNvbXBhbnlfaWRzIH1cclxuIyBcdFx0cmV0dXJuIHN1LmNvbXBhbnlfaWRzLmluY2x1ZGVzKGNvbXBhbnlJZClcclxuXHJcbiMgXHQjIOS4jei/lOWbnuW3suWBh+WIoOmZpOeahOaVsOaNrlxyXG4jIFx0ZXhjbHVkZURlbGV0ZWQgPSAocXVlcnkpLT5cclxuIyBcdFx0cXVlcnkuaXNfZGVsZXRlZCA9IHsgJG5lOiB0cnVlIH1cclxuXHJcbiMgXHQjIOS/ruaUueOAgeWIoOmZpOaXtu+8jOWmguaenCBkb2Muc3BhY2UgPSBcImdsb2JhbFwi77yM5oql6ZSZXHJcbiMgXHRjaGVja0dsb2JhbFJlY29yZCA9IChjb2xsZWN0aW9uLCBpZCwgb2JqZWN0KS0+XHJcbiMgXHRcdGlmIG9iamVjdC5lbmFibGVfc3BhY2VfZ2xvYmFsICYmIGNvbGxlY3Rpb24uZmluZCh7IF9pZDogaWQsIHNwYWNlOiAnZ2xvYmFsJ30pLmNvdW50KClcclxuIyBcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLkuI3og73kv67mlLnmiJbogIXliKDpmaTmoIflh4blr7nosaFcIilcclxuXHJcblxyXG4jIFx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCc6b2JqZWN0X25hbWUnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcclxuIyBcdFx0Z2V0OiAoKS0+XHJcbiMgXHRcdFx0dHJ5XHJcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXHJcbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXHJcbiMgXHRcdFx0XHRcdHJldHVybiB7XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTpzZXRFcnJvck1lc3NhZ2UoNDAxKVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdHJldHVybiB7XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0Ym9keTpzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHR9XHJcblxyXG4jIFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXHJcbiMgXHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcclxuIyBcdFx0XHRcdGNyZWF0ZVF1ZXJ5ID0gaWYgcXMgdGhlbiBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeShxcykgZWxzZSBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeSgpXHJcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyAmJiBpc1NhbWVDb21wYW55KHNwYWNlSWQsIEB1c2VySWQsIGNyZWF0ZVF1ZXJ5LnF1ZXJ5LmNvbXBhbnlfaWQsIGNyZWF0ZVF1ZXJ5LnF1ZXJ5KSkgb3IgKHBlcm1pc3Npb25zLmFsbG93UmVhZCBhbmQgQHVzZXJJZClcclxuXHJcbiMgXHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXHJcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBzcGFjZUlkXHJcbiMgXHRcdFx0XHRcdGVsc2UgaWYga2V5IGlzICdzcGFjZXMnXHJcbiMgXHRcdFx0XHRcdFx0aWYgc3BhY2VJZCBpc250ICdndWVzdCdcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9IHNwYWNlSWRcclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdGlmIHNwYWNlSWQgaXNudCAnZ3Vlc3QnIGFuZCBrZXkgIT0gXCJ1c2Vyc1wiIGFuZCBjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSBpc250ICdnbG9iYWwnXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IHNwYWNlSWRcclxuXHJcbiMgXHRcdFx0XHRcdGlmIENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZUlkKVxyXG4jIFx0XHRcdFx0XHRcdGlmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIEB1c2VySWQpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ3NwYWNlcydcclxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZFxyXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgY3JlYXRlUXVlcnkucXVlcnkuc3BhY2VcclxuIyBcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHR1c2VyX3NwYWNlcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmQoe3VzZXI6IEB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYga2V5IGlzICdzcGFjZXMnXHJcbiMgXHRcdFx0XHRcdFx0XHRcdCMgc3BhY2Ug5a+55omA5pyJ55So5oi36K6w5b2V5Li65Y+q6K+7XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5faWRcclxuIyBcdFx0XHRcdFx0XHRcdFx0IyBjcmVhdGVRdWVyeS5xdWVyeS5faWQgPSB7JGluOiBfLnBsdWNrKHVzZXJfc3BhY2VzLCAnc3BhY2UnKX1cclxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSB7JGluOiBfLnBsdWNrKHVzZXJfc3BhY2VzLCAnc3BhY2UnKX1cclxuXHJcbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5zb3J0IG9yICFfLnNpemUoY3JlYXRlUXVlcnkuc29ydClcclxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5zb3J0ID0geyBtb2RpZmllZDogLTEgfVxyXG4jIFx0XHRcdFx0XHRpc19lbnRlcnByaXNlID0gU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihzcGFjZUlkLFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiKVxyXG4jIFx0XHRcdFx0XHRpc19wcm9mZXNzaW9uYWwgPSBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlSWQsXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIilcclxuIyBcdFx0XHRcdFx0aXNfc3RhbmRhcmQgPSBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlSWQsXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxyXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5saW1pdFxyXG4jIFx0XHRcdFx0XHRcdGxpbWl0ID0gY3JlYXRlUXVlcnkubGltaXRcclxuIyBcdFx0XHRcdFx0XHRpZiBpc19lbnRlcnByaXNlIGFuZCBsaW1pdD4xMDAwMDBcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMDAwXHJcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBpc19wcm9mZXNzaW9uYWwgYW5kIGxpbWl0PjEwMDAwIGFuZCAhaXNfZW50ZXJwcmlzZVxyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMFxyXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYgaXNfc3RhbmRhcmQgYW5kIGxpbWl0PjEwMDAgYW5kICFpc19wcm9mZXNzaW9uYWwgYW5kICFpc19lbnRlcnByaXNlXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDBcclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdGlmIGlzX2VudGVycHJpc2VcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMDAwXHJcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBpc19wcm9mZXNzaW9uYWwgYW5kICFpc19lbnRlcnByaXNlXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDAwXHJcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBpc19zdGFuZGFyZCBhbmQgIWlzX2VudGVycHJpc2UgYW5kICFpc19wcm9mZXNzaW9uYWxcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMFxyXG4jIFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXHJcbiMgXHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRwcm9qZWN0aW9uID0ge31cclxuIyBcdFx0XHRcdFx0XHRfLmtleXMoY3JlYXRlUXVlcnkucHJvamVjdGlvbikuZm9yRWFjaCAoa2V5KS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBfLmluZGV4T2YodW5yZWFkYWJsZV9maWVsZHMsIGtleSkgPCAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdCNpZiBub3QgKChmaWVsZHNba2V5XT8udHlwZSA9PSAnbG9va3VwJyBvciBmaWVsZHNba2V5XT8udHlwZSA9PSAnbWFzdGVyX2RldGFpbCcpIGFuZCBmaWVsZHNba2V5XS5tdWx0aXBsZSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0cHJvamVjdGlvbltrZXldID0gMVxyXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gPSBwcm9qZWN0aW9uXHJcbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uIG9yICFfLnNpemUoY3JlYXRlUXVlcnkucHJvamVjdGlvbilcclxuIyBcdFx0XHRcdFx0XHRyZWFkYWJsZV9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhrZXksIHNwYWNlSWQsIEB1c2VySWQpXHJcbiMgXHRcdFx0XHRcdFx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKS5maWVsZHNcclxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZmllbGQpLT5cclxuIyBcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmluZGV4T2YoJyQnKSA8IDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0I2lmIGZpZWxkc1tmaWVsZF0/Lm11bHRpcGxlIT0gdHJ1ZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uW2ZpZWxkXSA9IDFcclxuIyBcdFx0XHRcdFx0aWYgbm90IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcclxuIyBcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3NoYXJlXHJcbiMgXHRcdFx0XHRcdFx0XHQjIOa7oei2s+WFseS6q+inhOWImeS4reeahOiusOW9leS5n+imgeaQnOe0ouWHuuadpVxyXG4jIFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGNyZWF0ZVF1ZXJ5LnF1ZXJ5Lm93bmVyXHJcbiMgXHRcdFx0XHRcdFx0XHRzaGFyZXMgPSBbXVxyXG4jIFx0XHRcdFx0XHRcdFx0b3JncyA9IFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMoc3BhY2VJZCwgQHVzZXJJZCwgdHJ1ZSlcclxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHtcIm93bmVyXCI6IEB1c2VySWR9XHJcbiMgXHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7IFwic2hhcmluZy51XCI6IEB1c2VySWQgfVxyXG4jIFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcub1wiOiB7ICRpbjogb3JncyB9IH1cclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5W1wiJG9yXCJdID0gc2hhcmVzXHJcbiMgXHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkub3duZXIgPSBAdXNlcklkXHJcbiMgXHRcdFx0XHRcdGVudGl0aWVzID0gW11cclxuXHJcbiMgXHRcdFx0XHRcdGV4Y2x1ZGVEZWxldGVkKGNyZWF0ZVF1ZXJ5LnF1ZXJ5KVxyXG5cclxuIyBcdFx0XHRcdFx0aWYgQHF1ZXJ5UGFyYW1zLiR0b3AgaXNudCAnMCdcclxuIyBcdFx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSwgdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpLmZldGNoKClcclxuIyBcdFx0XHRcdFx0c2Nhbm5lZENvdW50ID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LHtmaWVsZHM6e19pZDogMX19KS5jb3VudCgpXHJcbiMgXHRcdFx0XHRcdGlmIGVudGl0aWVzXHJcbiMgXHRcdFx0XHRcdFx0ZGVhbFdpdGhFeHBhbmQoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIHNwYWNlSWQpXHJcbiMgXHRcdFx0XHRcdFx0I3NjYW5uZWRDb3VudCA9IGVudGl0aWVzLmxlbmd0aFxyXG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdCNcdGJvZHlbJ0BvZGF0YS5uZXh0TGluayddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoKHNwYWNlSWQsa2V5KStcIj8lMjRza2lwPVwiKyAxMFxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb3VudCddID0gc2Nhbm5lZENvdW50XHJcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0aWVzX09kYXRhUHJvcGVydGllc1xyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcbiMgXHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSxcImdldFwiKVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0Y2F0Y2ggZVxyXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcclxuXHJcbiMgXHRcdHBvc3Q6ICgpLT5cclxuIyBcdFx0XHR0cnlcclxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcclxuIyBcdFx0XHRcdHNwYWNlSWQgPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdGlmIG5vdCBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpPy5lbmFibGVfYXBpXHJcbiMgXHRcdFx0XHRcdHJldHVybiB7XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTpzZXRFcnJvck1lc3NhZ2UoNDAxKVxyXG4jIFx0XHRcdFx0fVxyXG5cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBzcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxyXG4jIFx0XHRcdFx0XHRAYm9keVBhcmFtcy5zcGFjZSA9IHNwYWNlSWRcclxuIyBcdFx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnXHJcbiMgXHRcdFx0XHRcdFx0ZGVsZXRlIEBib2R5UGFyYW1zLnNwYWNlXHJcbiMgXHRcdFx0XHRcdGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcclxuIyBcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXHJcbiMgXHRcdFx0XHRcdGVudGl0aWVzID0gW11cclxuIyBcdFx0XHRcdFx0aWYgZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMucHVzaCBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcclxuIyBcdFx0XHRcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0eV9PZGF0YVByb3BlcnRpZXNcclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG4jIFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5LCdwb3N0JylcclxuIyBcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdwb3N0JylcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdGNhdGNoIGVcclxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXHJcblxyXG4jIFx0fSlcclxuIyBcdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnOm9iamVjdF9uYW1lL3JlY2VudCcsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xyXG4jIFx0XHRnZXQ6KCktPlxyXG4jIFx0XHRcdHRyeVxyXG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxyXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfY29sbGVjdGlvbiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJvYmplY3RfcmVjZW50X3ZpZXdlZFwiXVxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19zZWxlY3RvciA9IHtcInJlY29yZC5vXCI6a2V5LGNyZWF0ZWRfYnk6QHVzZXJJZH1cclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfb3B0aW9ucyA9IHt9XHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X29wdGlvbnMuc29ydCA9IHtjcmVhdGVkOiAtMX1cclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfb3B0aW9ucy5maWVsZHMgPSB7cmVjb3JkOjF9XHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHMgPSByZWNlbnRfdmlld19jb2xsZWN0aW9uLmZpbmQocmVjZW50X3ZpZXdfc2VsZWN0b3IscmVjZW50X3ZpZXdfb3B0aW9ucykuZmV0Y2goKVxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IF8ucGx1Y2socmVjZW50X3ZpZXdfcmVjb3JkcywncmVjb3JkJylcclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSByZWNlbnRfdmlld19yZWNvcmRzX2lkcy5nZXRQcm9wZXJ0eShcImlkc1wiKVxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IF8uZmxhdHRlbihyZWNlbnRfdmlld19yZWNvcmRzX2lkcylcclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSBfLnVuaXEocmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMpXHJcbiMgXHRcdFx0XHRcdHJlbW92ZUludmFsaWRNZXRob2QoQHF1ZXJ5UGFyYW1zKVxyXG4jIFx0XHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcclxuIyBcdFx0XHRcdFx0Y3JlYXRlUXVlcnkgPSBpZiBxcyB0aGVuIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KHFzKSBlbHNlIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KClcclxuIyBcdFx0XHRcdFx0aWYga2V5IGlzICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcclxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVsnbWV0YWRhdGEuc3BhY2UnXSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LmxpbWl0XHJcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDBcclxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkubGltaXQgYW5kIHJlY2VudF92aWV3X3JlY29yZHNfaWRzLmxlbmd0aD5jcmVhdGVRdWVyeS5saW1pdFxyXG4jIFx0XHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy5maXJzdChyZWNlbnRfdmlld19yZWNvcmRzX2lkcyxjcmVhdGVRdWVyeS5saW1pdClcclxuIyBcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuX2lkID0geyRpbjpyZWNlbnRfdmlld19yZWNvcmRzX2lkc31cclxuIyBcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxyXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0cHJvamVjdGlvbiA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0Xy5rZXlzKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pLmZvckVhY2ggKGtleSktPlxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHVucmVhZGFibGVfZmllbGRzLCBrZXkpIDwgMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHQjIGlmIG5vdCAoKGZpZWxkc1trZXldPy50eXBlID09ICdsb29rdXAnIG9yIGZpZWxkc1trZXldPy50eXBlID09ICdtYXN0ZXJfZGV0YWlsJykgYW5kIGZpZWxkc1trZXldLm11bHRpcGxlKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0aW9uW2tleV0gPSAxXHJcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbiA9IHByb2plY3Rpb25cclxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKVxyXG4jIFx0XHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkKVxyXG4jIFx0XHRcdFx0XHRcdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKS5maWVsZHNcclxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZmllbGQpLT5cclxuIyBcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmluZGV4T2YoJyQnKSA8IDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0I2lmIGZpZWxkc1tmaWVsZF0/Lm11bHRpcGxlIT0gdHJ1ZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uW2ZpZWxkXSA9IDFcclxuXHJcbiMgXHRcdFx0XHRcdGV4Y2x1ZGVEZWxldGVkKGNyZWF0ZVF1ZXJ5LnF1ZXJ5KVxyXG5cclxuIyBcdFx0XHRcdFx0aWYgQHF1ZXJ5UGFyYW1zLiR0b3AgaXNudCAnMCdcclxuIyBcdFx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSwgdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpLmZldGNoKClcclxuIyBcdFx0XHRcdFx0ZW50aXRpZXNfaW5kZXggPSBbXVxyXG4jIFx0XHRcdFx0XHRlbnRpdGllc19pZHMgPSBfLnBsdWNrKGVudGl0aWVzLCdfaWQnKVxyXG4jIFx0XHRcdFx0XHRzb3J0X2VudGl0aWVzID0gW11cclxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnNvcnQgb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5zb3J0KVxyXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCByZWNlbnRfdmlld19yZWNvcmRzX2lkcyAsKHJlY2VudF92aWV3X3JlY29yZHNfaWQpLT5cclxuIyBcdFx0XHRcdFx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGVudGl0aWVzX2lkcyxyZWNlbnRfdmlld19yZWNvcmRzX2lkKVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgaW5kZXg+LTFcclxuIyBcdFx0XHRcdFx0XHRcdFx0c29ydF9lbnRpdGllcy5wdXNoIGVudGl0aWVzW2luZGV4XVxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0c29ydF9lbnRpdGllcyA9IGVudGl0aWVzXHJcbiMgXHRcdFx0XHRcdGlmIHNvcnRfZW50aXRpZXNcclxuIyBcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgc29ydF9lbnRpdGllcywga2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHQjXHRib2R5WydAb2RhdGEubmV4dExpbmsnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YU5leHRMaW5rUGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsa2V5KStcIj8lMjRza2lwPVwiKyAxMFxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb3VudCddID0gc29ydF9lbnRpdGllcy5sZW5ndGhcclxuIyBcdFx0XHRcdFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KHNvcnRfZW50aXRpZXMsQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0aWVzX09kYXRhUHJvcGVydGllc1xyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcbiMgXHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ2dldCcpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwnZ2V0JylcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdGNhdGNoIGVcclxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXHJcbiMgfSlcclxuXHJcbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZS86X2lkJywge2F1dGhSZXF1aXJlZDogdHJ1ZSwgc3BhY2VSZXF1aXJlZDogZmFsc2V9LCB7XHJcbiMgXHRcdHBvc3Q6ICgpLT5cclxuIyBcdFx0XHR0cnlcclxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcclxuIyBcdFx0XHRcdGlmIG5vdCBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCk/LmVuYWJsZV9hcGlcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcclxuIyBcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xyXG4jIFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcclxuIyBcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxyXG4jIFx0XHRcdFx0XHRpZiBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdFx0XHRlbnRpdGllcy5wdXNoIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXHJcbiMgXHRcdFx0XHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0eV9PZGF0YVByb3BlcnRpZXNcclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG4jIFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5LCdwb3N0JylcclxuIyBcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdwb3N0JylcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdGNhdGNoIGVcclxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXHJcbiMgXHRcdGdldDooKS0+XHJcbiMgXHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxyXG4jIFx0XHRcdGlmIGtleS5pbmRleE9mKFwiKFwiKSA+IC0xXHJcbiMgXHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbkluZm8gPSBrZXlcclxuIyBcdFx0XHRcdGZpZWxkTmFtZSA9IEB1cmxQYXJhbXMuX2lkLnNwbGl0KCdfZXhwYW5kJylbMF1cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb25JbmZvU3BsaXQgPSBjb2xsZWN0aW9uSW5mby5zcGxpdCgnKCcpXHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb25JbmZvU3BsaXRbMF1cclxuIyBcdFx0XHRcdGlkID0gY29sbGVjdGlvbkluZm9TcGxpdFsxXS5zcGxpdCgnXFwnJylbMV1cclxuXHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lLCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRmaWVsZHNPcHRpb25zID0ge31cclxuIyBcdFx0XHRcdGZpZWxkc09wdGlvbnNbZmllbGROYW1lXSA9IDFcclxuIyBcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiBpZH0sIHtmaWVsZHM6IGZpZWxkc09wdGlvbnN9KVxyXG5cclxuIyBcdFx0XHRcdGZpZWxkVmFsdWUgPSBudWxsXHJcbiMgXHRcdFx0XHRpZiBlbnRpdHlcclxuIyBcdFx0XHRcdFx0ZmllbGRWYWx1ZSA9IGVudGl0eVtmaWVsZE5hbWVdXHJcblxyXG4jIFx0XHRcdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3QoY29sbGVjdGlvbk5hbWUsIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGZpZWxkID0gb2JqLmZpZWxkc1tmaWVsZE5hbWVdXHJcblxyXG4jIFx0XHRcdFx0aWYgZmllbGQgYW5kIGZpZWxkVmFsdWUgYW5kIChmaWVsZC50eXBlIGlzICdsb29rdXAnIG9yIGZpZWxkLnR5cGUgaXMgJ21hc3Rlcl9kZXRhaWwnKVxyXG4jIFx0XHRcdFx0XHRsb29rdXBDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bywgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0XHRxdWVyeU9wdGlvbnMgPSB7ZmllbGRzOiB7fX1cclxuIyBcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoZmllbGQucmVmZXJlbmNlX3RvLCBAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQpXHJcbiMgXHRcdFx0XHRcdF8uZWFjaCByZWFkYWJsZV9maWVsZHMsIChmKS0+XHJcbiMgXHRcdFx0XHRcdFx0aWYgZi5pbmRleE9mKCckJykgPCAwXHJcbiMgXHRcdFx0XHRcdFx0XHRxdWVyeU9wdGlvbnMuZmllbGRzW2ZdID0gMVxyXG5cclxuIyBcdFx0XHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuIyBcdFx0XHRcdFx0XHR2YWx1ZXMgPSBbXVxyXG4jIFx0XHRcdFx0XHRcdGxvb2t1cENvbGxlY3Rpb24uZmluZCh7X2lkOiB7JGluOiBmaWVsZFZhbHVlfX0sIHF1ZXJ5T3B0aW9ucykuZm9yRWFjaCAob2JqKS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRfLmVhY2ggb2JqLCAodiwgayktPlxyXG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkodikgfHwgKF8uaXNPYmplY3QodikgJiYgIV8uaXNEYXRlKHYpKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdG9ialtrXSA9IEpTT04uc3RyaW5naWZ5KHYpXHJcbiMgXHRcdFx0XHRcdFx0XHR2YWx1ZXMucHVzaChvYmopXHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IHZhbHVlc1xyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCkgKyBcIiMje2NvbGxlY3Rpb25JbmZvfS8je0B1cmxQYXJhbXMuX2lkfVwiXHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRib2R5ID0gbG9va3VwQ29sbGVjdGlvbi5maW5kT25lKHtfaWQ6IGZpZWxkVmFsdWV9LCBxdWVyeU9wdGlvbnMpIHx8IHt9XHJcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIGJvZHksICh2LCBrKS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkodikgfHwgKF8uaXNPYmplY3QodikgJiYgIV8uaXNEYXRlKHYpKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5W2tdID0gSlNPTi5zdHJpbmdpZnkodilcclxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zLnNwYWNlSWQpICsgXCIjI3tmaWVsZC5yZWZlcmVuY2VfdG99LyRlbnRpdHlcIlxyXG5cclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoQHVybFBhcmFtcy5zcGFjZUlkKSArIFwiIyN7Y29sbGVjdGlvbkluZm99LyN7QHVybFBhcmFtcy5faWR9XCJcclxuIyBcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGZpZWxkVmFsdWVcclxuXHJcbiMgXHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcblxyXG4jIFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XHJcbiMgXHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0dHJ5XHJcbiMgXHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcclxuIyBcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuXHJcbiMgXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dSZWFkXHJcbiMgXHRcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxyXG4jIFx0XHRcdFx0XHRcdHJlbW92ZUludmFsaWRNZXRob2QoQHF1ZXJ5UGFyYW1zKVxyXG4jIFx0XHRcdFx0XHRcdHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShAcXVlcnlQYXJhbXMpKVxyXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5ID0gaWYgcXMgdGhlbiBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeShxcykgZWxzZSBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeSgpXHJcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuX2lkID0gIEB1cmxQYXJhbXMuX2lkXHJcbiMgXHRcdFx0XHRcdFx0aWYga2V5IGlzICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5WydtZXRhZGF0YS5zcGFjZSddID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBrZXkgIT0gJ3NwYWNlcydcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0gIEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRcdHVucmVhZGFibGVfZmllbGRzID0gcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgfHwgW11cclxuIyBcdFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0XHRwcm9qZWN0aW9uID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdF8ua2V5cyhjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKS5mb3JFYWNoIChrZXkpLT5cclxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHVucmVhZGFibGVfZmllbGRzLCBrZXkpIDwgMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdCMgaWYgbm90ICgoZmllbGRzW2tleV0/LnR5cGUgPT0gJ2xvb2t1cCcgb3IgZmllbGRzW2tleV0/LnR5cGUgPT0gJ21hc3Rlcl9kZXRhaWwnKSBhbmQgZmllbGRzW2tleV0ubXVsdGlwbGUpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdGlvbltrZXldID0gMVxyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbiA9IHByb2plY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkucHJvamVjdGlvbiBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pXHJcbiMgXHRcdFx0XHRcdFx0XHRyZWFkYWJsZV9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZClcclxuIyBcdFx0XHRcdFx0XHRcdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcclxuIyBcdFx0XHRcdFx0XHRcdF8uZWFjaCByZWFkYWJsZV9maWVsZHMsIChmaWVsZCkgLT5cclxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaW5kZXhPZignJCcpIDwgMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25bZmllbGRdID0gMVxyXG4jIFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShjcmVhdGVRdWVyeS5xdWVyeSx2aXNpdG9yUGFyc2VyKGNyZWF0ZVF1ZXJ5KSlcclxuIyBcdFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXHJcbiMgXHRcdFx0XHRcdFx0aWYgZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0XHRpc0FsbG93ZWQgPSBlbnRpdHkub3duZXIgPT0gQHVzZXJJZCBvciBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBvciAocGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzICYmIGlzU2FtZUNvbXBhbnkoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBlbnRpdHkuY29tcGFueV9pZCkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3NoYXJlIGFuZCAhaXNBbGxvd2VkXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHNoYXJlcyA9IFtdXHJcbiMgXHRcdFx0XHRcdFx0XHRcdG9yZ3MgPSBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwgdHJ1ZSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcudVwiOiBAdXNlcklkIH1cclxuIyBcdFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcub1wiOiB7ICRpbjogb3JncyB9IH1cclxuIyBcdFx0XHRcdFx0XHRcdFx0aXNBbGxvd2VkID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiBAdXJsUGFyYW1zLl9pZCwgXCIkb3JcIjogc2hhcmVzIH0sIHsgZmllbGRzOiB7IF9pZDogMSB9IH0pXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBpc0FsbG93ZWRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllcy5wdXNoIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgZW50aXRpZXMsIGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0Xy5leHRlbmQgYm9keSxlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWzBdXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG4jIFx0XHRcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cclxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ2dldCcpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxyXG4jIFx0XHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGNhdGNoIGVcclxuIyBcdFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcclxuXHJcbiMgXHRcdHB1dDooKS0+XHJcbiMgXHRcdFx0dHJ5XHJcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXHJcbiMgXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXHJcbiMgXHRcdFx0XHRcdH1cclxuXHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdHNwYWNlSWQgPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRpZiBrZXkgPT0gXCJ1c2Vyc1wiXHJcbiMgXHRcdFx0XHRcdHJlY29yZF9vd25lciA9IEB1cmxQYXJhbXMuX2lkXHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdHJlY29yZF9vd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogQHVybFBhcmFtcy5faWQgfSwgeyBmaWVsZHM6IHsgb3duZXI6IDEgfSB9KT8ub3duZXJcclxuXHJcbiMgXHRcdFx0XHRjb21wYW55SWQgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IEB1cmxQYXJhbXMuX2lkIH0sIHsgZmllbGRzOiB7IGNvbXBhbnlfaWQ6IDEgfSB9KT8uY29tcGFueV9pZFxyXG5cclxuIyBcdFx0XHRcdGlzQWxsb3dlZCA9IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLmFsbG93RWRpdCBhbmQgcmVjb3JkX293bmVyID09IEB1c2VySWQgKSBvciAocGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgJiYgaXNTYW1lQ29tcGFueShzcGFjZUlkLCBAdXNlcklkLCBjb21wYW55SWQpKVxyXG4jIFx0XHRcdFx0aWYgaXNBbGxvd2VkXHJcbiMgXHRcdFx0XHRcdGNoZWNrR2xvYmFsUmVjb3JkKGNvbGxlY3Rpb24sIEB1cmxQYXJhbXMuX2lkLCBvYmplY3QpXHJcbiMgXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5faWQsIHNwYWNlOiBzcGFjZUlkfVxyXG4jIFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCcgb3Igc3BhY2VJZCBpcyAnY29tbW9uJyBvciBrZXkgPT0gXCJ1c2Vyc1wiXHJcbiMgXHRcdFx0XHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXHJcbiMgXHRcdFx0XHRcdGZpZWxkc19lZGl0YWJsZSA9IHRydWVcclxuIyBcdFx0XHRcdFx0Xy5rZXlzKEBib2R5UGFyYW1zLiRzZXQpLmZvckVhY2ggKGtleSktPlxyXG4jIFx0XHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywga2V5KSA+IC0xXHJcbiMgXHRcdFx0XHRcdFx0XHRmaWVsZHNfZWRpdGFibGUgPSBmYWxzZVxyXG4jIFx0XHRcdFx0XHRpZiBmaWVsZHNfZWRpdGFibGVcclxuIyBcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ3NwYWNlcydcclxuIyBcdFx0XHRcdFx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxyXG4jIFx0XHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCBAYm9keVBhcmFtc1xyXG4jIFx0XHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxyXG4jIFx0XHRcdFx0XHRcdFx0I3N0YXR1c0NvZGU6IDIwMVxyXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5faWRcclxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXRpZXMgPSBbXVxyXG4jIFx0XHRcdFx0XHRcdFx0IyBib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0aWVzLnB1c2ggZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0XHQjIGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xyXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHQjIF8uZXh0ZW5kIGJvZHksZW50aXR5X09kYXRhUHJvcGVydGllc1swXVxyXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG4jIFx0XHRcdFx0XHRcdFx0e2hlYWRlcnM6IGhlYWRlcnMsYm9keTpib2R5fVxyXG4jIFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ3B1dCcpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncHV0JylcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdGNhdGNoIGVcclxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXHJcbiMgXHRcdGRlbGV0ZTooKS0+XHJcbiMgXHRcdFx0dHJ5XHJcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXHJcbiMgXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG5cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0cmVjb3JkRGF0YSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiBAdXJsUGFyYW1zLl9pZH0sIHsgZmllbGRzOiB7IG93bmVyOiAxLCBjb21wYW55X2lkOiAxIH0gfSlcclxuIyBcdFx0XHRcdHJlY29yZF9vd25lciA9IHJlY29yZERhdGE/Lm93bmVyXHJcbiMgXHRcdFx0XHRjb21wYW55SWQgPSByZWNvcmREYXRhPy5jb21wYW55X2lkXHJcbiMgXHRcdFx0XHRpc0FsbG93ZWQgPSAocGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUpIG9yIChwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgYW5kIGlzU2FtZUNvbXBhbnkoc3BhY2VJZCwgQHVzZXJJZCwgY29tcGFueUlkKSkgb3IgKHBlcm1pc3Npb25zLmFsbG93RGVsZXRlIGFuZCByZWNvcmRfb3duZXI9PUB1c2VySWQgKVxyXG4jIFx0XHRcdFx0aWYgaXNBbGxvd2VkXHJcbiMgXHRcdFx0XHRcdGNoZWNrR2xvYmFsUmVjb3JkKGNvbGxlY3Rpb24sIEB1cmxQYXJhbXMuX2lkLCBvYmplY3QpXHJcbiMgXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5faWQsIHNwYWNlOiBzcGFjZUlkfVxyXG4jIFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCdcclxuIyBcdFx0XHRcdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcclxuXHJcbiMgXHRcdFx0XHRcdGlmIG9iamVjdD8uZW5hYmxlX3RyYXNoXHJcbiMgXHRcdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIHtcclxuIyBcdFx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuIyBcdFx0XHRcdFx0XHRcdFx0aXNfZGVsZXRlZDogdHJ1ZSxcclxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlZDogbmV3IERhdGUoKSxcclxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlZF9ieTogQHVzZXJJZFxyXG4jIFx0XHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0XHRcdH0pXHJcbiMgXHRcdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXHJcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG4jIFx0XHRcdFx0XHRcdFx0e2hlYWRlcnM6IGhlYWRlcnMsYm9keTpib2R5fVxyXG4jIFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxyXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXRpZXMucHVzaCBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRcdCMgYm9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKHNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXHJcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLHNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdCMgXy5leHRlbmQgYm9keSxlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWzBdXHJcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcbiMgXHRcdFx0XHRcdFx0XHR7aGVhZGVyczogaGVhZGVycyxib2R5OmJvZHl9XHJcbiMgXHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0Y2F0Y2ggZVxyXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcclxuIyBcdH0pXHJcblxyXG4jIFx0IyBfaWTlj6/kvKBhbGxcclxuIyBcdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnOm9iamVjdF9uYW1lLzpfaWQvOm1ldGhvZE5hbWUnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcclxuIyBcdFx0cG9zdDogKCktPlxyXG4jIFx0XHRcdHRyeVxyXG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxyXG4jIFx0XHRcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKT8uZW5hYmxlX2FwaVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHR9XHJcblxyXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dSZWFkXHJcbiMgXHRcdFx0XHRcdG1ldGhvZE5hbWUgPSBAdXJsUGFyYW1zLm1ldGhvZE5hbWVcclxuIyBcdFx0XHRcdFx0bWV0aG9kcyA9IENyZWF0b3IuT2JqZWN0c1trZXldPy5tZXRob2RzIHx8IHt9XHJcbiMgXHRcdFx0XHRcdGlmIG1ldGhvZHMuaGFzT3duUHJvcGVydHkobWV0aG9kTmFtZSlcclxuIyBcdFx0XHRcdFx0XHR0aGlzT2JqID0ge1xyXG4jIFx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IGtleVxyXG4jIFx0XHRcdFx0XHRcdFx0cmVjb3JkX2lkOiBAdXJsUGFyYW1zLl9pZFxyXG4jIFx0XHRcdFx0XHRcdFx0c3BhY2VfaWQ6IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRcdFx0dXNlcl9pZDogQHVzZXJJZFxyXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnM6IHBlcm1pc3Npb25zXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0XHRcdHJldHVybiBtZXRob2RzW21ldGhvZE5hbWVdLmFwcGx5KHRoaXNPYmosIFtAYm9keVBhcmFtc10pIHx8IHt9XHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0Y2F0Y2ggZVxyXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcclxuXHJcbiMgXHR9KVxyXG5cclxuIyBcdCNUT0RPIHJlbW92ZVxyXG4jIFx0Xy5lYWNoIFtdLCAodmFsdWUsIGtleSwgbGlzdCktPiAjQ3JlYXRvci5Db2xsZWN0aW9uc1xyXG4jIFx0XHRpZiBub3QgQ3JlYXRvci5nZXRPYmplY3Qoa2V5KT8uZW5hYmxlX2FwaVxyXG4jIFx0XHRcdHJldHVyblxyXG5cclxuIyBcdFx0aWYgU3RlZWRvc09kYXRhQVBJXHJcblxyXG4jIFx0XHRcdFN0ZWVkb3NPZGF0YUFQSS5hZGRDb2xsZWN0aW9uIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpLFxyXG4jIFx0XHRcdFx0ZXhjbHVkZWRFbmRwb2ludHM6IFtdXHJcbiMgXHRcdFx0XHRyb3V0ZU9wdGlvbnM6XHJcbiMgXHRcdFx0XHRcdGF1dGhSZXF1aXJlZDogdHJ1ZVxyXG4jIFx0XHRcdFx0XHRzcGFjZVJlcXVpcmVkOiBmYWxzZVxyXG4jIFx0XHRcdFx0ZW5kcG9pbnRzOlxyXG4jIFx0XHRcdFx0XHRnZXRBbGw6XHJcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxyXG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIG9yIChwZXJtaXNzaW9ucy5hbGxvd1JlYWQgYW5kIEB1c2VySWQpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0cXMgPSBkZWNvZGVVUklDb21wb25lbnQocXVlcnlzdHJpbmcuc3RyaW5naWZ5KEBxdWVyeVBhcmFtcykpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkgPSBpZiBxcyB0aGVuIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KHFzKSBlbHNlIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KClcclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYga2V5IGlzICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5WydtZXRhZGF0YS5zcGFjZSddID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgbm90IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5vd25lciA9IEB1c2VySWRcclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIEBxdWVyeVBhcmFtcy4kdG9wIGlzbnQgJzAnXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSwgdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpLmZldGNoKClcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzY2FubmVkQ291bnQgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnkpLmNvdW50KClcclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXRpZXNcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGRlYWxXaXRoRXhwYW5kKGNyZWF0ZVF1ZXJ5LCBlbnRpdGllcywga2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb3VudCddID0gc2Nhbm5lZENvdW50XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXRpZXNcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbid9XHJcbiMgXHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XHJcbiMgXHRcdFx0XHRcdHBvc3Q6XHJcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxyXG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRAYm9keVBhcmFtcy5zcGFjZSA9IEBzcGFjZUlkXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIHZhbHVlOiBlbnRpdHl9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ31cclxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cclxuIyBcdFx0XHRcdFx0Z2V0OlxyXG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cclxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZCwgc3BhY2U6IEBzcGFjZUlkfVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBzZWxlY3RvclxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCB2YWx1ZTogZW50aXR5fVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxyXG4jIFx0XHRcdFx0XHRwdXQ6XHJcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxyXG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dFZGl0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkLCBzcGFjZTogQHNwYWNlSWR9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsICRzZXQ6IEBib2R5UGFyYW1zXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCB2YWx1ZTogZW50aXR5fVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxyXG4jIFx0XHRcdFx0XHRkZWxldGU6XHJcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxyXG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWQsIHNwYWNlOiBAc3BhY2VJZH1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cclxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBNZXRlb3JPRGF0YUFQSVY0Um91dGVyLCBNZXRlb3JPRGF0YVJvdXRlciwgT0RhdGFSb3V0ZXIsIGFwcCwgZXhwcmVzcztcbiAgTWV0ZW9yT0RhdGFSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuTWV0ZW9yT0RhdGFSb3V0ZXI7XG4gIE9EYXRhUm91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk9EYXRhUm91dGVyO1xuICBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuICBhcHAgPSBleHByZXNzKCk7XG4gIGFwcC51c2UoJy9hcGkvb2RhdGEvdjQnLCBNZXRlb3JPRGF0YVJvdXRlcik7XG4gIE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuTWV0ZW9yT0RhdGFBUElWNFJvdXRlcjtcbiAgaWYgKE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIpIHtcbiAgICBhcHAudXNlKCcvYXBpL3Y0JywgTWV0ZW9yT0RhdGFBUElWNFJvdXRlcik7XG4gIH1cbiAgV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoYXBwKTtcbiAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHZhciBvdGhlckFwcDtcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBvdGhlckFwcCA9IGV4cHJlc3MoKTtcbiAgICAgIG90aGVyQXBwLnVzZShcIi9hcGkvb2RhdGEvXCIgKyBuYW1lLCBPRGF0YVJvdXRlcik7XG4gICAgICByZXR1cm4gV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2Uob3RoZXJBcHApO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJylcclxuXHJcbmJhc2ljQXV0aCA9IHJlcXVpcmUoJ2Jhc2ljLWF1dGgnKVxyXG5cclxuYXV0aG9yaXphdGlvbkNhY2hlID0ge31cclxuXHJcbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UgJy9hcGkvb2RhdGEvdjQvJywgKHJlcSwgcmVzLCBuZXh0KS0+XHJcblxyXG5cdEZpYmVyKCgpLT5cclxuXHRcdGlmICFyZXEudXNlcklkXHJcblx0XHRcdGlzQXV0aGVkID0gZmFsc2VcclxuXHRcdFx0IyBvYXV0aDLpqozor4FcclxuXHRcdFx0aWYgcmVxPy5xdWVyeT8uYWNjZXNzX3Rva2VuXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ09BdXRoMjogJywgcmVxLnF1ZXJ5LmFjY2Vzc190b2tlblxyXG5cdFx0XHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4pXHJcblx0XHRcdFx0aWYgdXNlcklkXHJcblx0XHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHRcdFx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRcdFx0aXNBdXRoZWQgPSB0cnVlXHJcblx0XHRcdCMgYmFzaWPpqozor4FcclxuXHRcdFx0aWYgcmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXVxyXG5cdFx0XHRcdGF1dGggPSBiYXNpY0F1dGgucGFyc2UocmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSlcclxuXHRcdFx0XHRpZiBhdXRoXHJcblx0XHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe3VzZXJuYW1lOiBhdXRoLm5hbWV9LCB7IGZpZWxkczogeyAnc2VydmljZXMnOiAxIH0gfSlcclxuXHRcdFx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRcdFx0aWYgYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPT0gYXV0aC5wYXNzXHJcblx0XHRcdFx0XHRcdFx0aXNBdXRoZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRyZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCB1c2VyLCBhdXRoLnBhc3NcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRpZiAhcmVzdWx0LmVycm9yXHJcblx0XHRcdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdGlmIF8ua2V5cyhhdXRob3JpemF0aW9uQ2FjaGUpLmxlbmd0aCA+IDEwMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRhdXRob3JpemF0aW9uQ2FjaGUgPSB7fVxyXG5cdFx0XHRcdFx0XHRcdFx0YXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPSBhdXRoLnBhc3NcclxuXHRcdFx0aWYgaXNBdXRoZWRcclxuXHRcdFx0XHRyZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gPSB1c2VyLl9pZFxyXG5cdFx0XHRcdHRva2VuID0gbnVsbFxyXG5cdFx0XHRcdGFwcF9pZCA9IFwiY3JlYXRvclwiXHJcblx0XHRcdFx0Y2xpZW50X2lkID0gXCJwY1wiXHJcblx0XHRcdFx0bG9naW5Ub2tlbnMgPSB1c2VyLnNlcnZpY2VzPy5yZXN1bWU/LmxvZ2luVG9rZW5zXHJcblx0XHRcdFx0aWYgbG9naW5Ub2tlbnNcclxuXHRcdFx0XHRcdGFwcF9sb2dpbl90b2tlbiA9IF8uZmluZChsb2dpblRva2VucywgKHQpLT5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIHQuYXBwX2lkIGlzIGFwcF9pZCBhbmQgdC5jbGllbnRfaWQgaXMgY2xpZW50X2lkXHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHR0b2tlbiA9IGFwcF9sb2dpbl90b2tlbi50b2tlbiBpZiBhcHBfbG9naW5fdG9rZW5cclxuXHJcblx0XHRcdFx0aWYgbm90IHRva2VuXHJcblx0XHRcdFx0XHRhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpXHJcblx0XHRcdFx0XHR0b2tlbiA9IGF1dGhUb2tlbi50b2tlblxyXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cclxuXHRcdFx0XHRcdGhhc2hlZFRva2VuLmFwcF9pZCA9IGFwcF9pZFxyXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4uY2xpZW50X2lkID0gY2xpZW50X2lkXHJcblx0XHRcdFx0XHRoYXNoZWRUb2tlbi50b2tlbiA9IHRva2VuXHJcblx0XHRcdFx0XHRBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiB1c2VyLl9pZCwgaGFzaGVkVG9rZW5cclxuXHJcblx0XHRcdFx0aWYgdG9rZW5cclxuXHRcdFx0XHRcdHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSA9IHRva2VuXHJcblx0XHRuZXh0KClcclxuXHQpLnJ1bigpXHJcbiIsInZhciBGaWJlciwgYXV0aG9yaXphdGlvbkNhY2hlLCBiYXNpY0F1dGg7XG5cbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbmJhc2ljQXV0aCA9IHJlcXVpcmUoJ2Jhc2ljLWF1dGgnKTtcblxuYXV0aG9yaXphdGlvbkNhY2hlID0ge307XG5cbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoJy9hcGkvb2RhdGEvdjQvJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcHBfaWQsIGFwcF9sb2dpbl90b2tlbiwgYXV0aCwgYXV0aFRva2VuLCBjbGllbnRfaWQsIGhhc2hlZFRva2VuLCBpc0F1dGhlZCwgbG9naW5Ub2tlbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVzdWx0LCB0b2tlbiwgdXNlciwgdXNlcklkO1xuICAgIGlmICghcmVxLnVzZXJJZCkge1xuICAgICAgaXNBdXRoZWQgPSBmYWxzZTtcbiAgICAgIGlmIChyZXEgIT0gbnVsbCA/IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPQXV0aDI6ICcsIHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihyZXEucXVlcnkuYWNjZXNzX3Rva2VuKTtcbiAgICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICBpc0F1dGhlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSkge1xuICAgICAgICBhdXRoID0gYmFzaWNBdXRoLnBhcnNlKHJlcS5oZWFkZXJzWydhdXRob3JpemF0aW9uJ10pO1xuICAgICAgICBpZiAoYXV0aCkge1xuICAgICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICB1c2VybmFtZTogYXV0aC5uYW1lXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICdzZXJ2aWNlcyc6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgaWYgKGF1dGhvcml6YXRpb25DYWNoZVthdXRoLm5hbWVdID09PSBhdXRoLnBhc3MpIHtcbiAgICAgICAgICAgICAgaXNBdXRoZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQodXNlciwgYXV0aC5wYXNzKTtcbiAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpc0F1dGhlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKF8ua2V5cyhhdXRob3JpemF0aW9uQ2FjaGUpLmxlbmd0aCA+IDEwMCkge1xuICAgICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbkNhY2hlID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb25DYWNoZVthdXRoLm5hbWVdID0gYXV0aC5wYXNzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBdXRoZWQpIHtcbiAgICAgICAgcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddID0gdXNlci5faWQ7XG4gICAgICAgIHRva2VuID0gbnVsbDtcbiAgICAgICAgYXBwX2lkID0gXCJjcmVhdG9yXCI7XG4gICAgICAgIGNsaWVudF9pZCA9IFwicGNcIjtcbiAgICAgICAgbG9naW5Ub2tlbnMgPSAocmVmMSA9IHVzZXIuc2VydmljZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucmVzdW1lKSAhPSBudWxsID8gcmVmMi5sb2dpblRva2VucyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKGxvZ2luVG9rZW5zKSB7XG4gICAgICAgICAgYXBwX2xvZ2luX3Rva2VuID0gXy5maW5kKGxvZ2luVG9rZW5zLCBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC5hcHBfaWQgPT09IGFwcF9pZCAmJiB0LmNsaWVudF9pZCA9PT0gY2xpZW50X2lkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChhcHBfbG9naW5fdG9rZW4pIHtcbiAgICAgICAgICAgIHRva2VuID0gYXBwX2xvZ2luX3Rva2VuLnRva2VuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKTtcbiAgICAgICAgICB0b2tlbiA9IGF1dGhUb2tlbi50b2tlbjtcbiAgICAgICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgICAgaGFzaGVkVG9rZW4uYXBwX2lkID0gYXBwX2lkO1xuICAgICAgICAgIGhhc2hlZFRva2VuLmNsaWVudF9pZCA9IGNsaWVudF9pZDtcbiAgICAgICAgICBoYXNoZWRUb2tlbi50b2tlbiA9IHRva2VuO1xuICAgICAgICAgIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuKHVzZXIuX2lkLCBoYXNoZWRUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddID0gdG9rZW47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfSkucnVuKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0U2VydmljZU1ldGFkYXRhID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YScpLlNlcnZpY2VNZXRhZGF0YTtcclxuXHRTZXJ2aWNlRG9jdW1lbnQgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLWRvY3VtZW50JykuU2VydmljZURvY3VtZW50O1xyXG5cdF9OVU1CRVJfVFlQRVMgPSBbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiXVxyXG5cclxuXHRfQk9PTEVBTl9UWVBFUyA9IFtcImJvb2xlYW5cIl1cclxuXHJcblx0X0RBVEVUSU1FX09GRlNFVF9UWVBFUyA9IFsnZGF0ZXRpbWUnXVxyXG5cclxuXHRfTkFNRVNQQUNFID0gXCJDcmVhdG9yRW50aXRpZXNcIlxyXG5cclxuXHRnZXRPYmplY3RzT2RhdGFTY2hlbWEgPSAoc3BhY2VJZCktPlxyXG5cdFx0c2NoZW1hID0ge3ZlcnNpb246IFN0ZWVkb3NPRGF0YS5WRVJTSU9OLCBkYXRhU2VydmljZXM6IHtzY2hlbWE6IFtdfX1cclxuXHJcblx0XHRlbnRpdGllc19zY2hlbWEgPSB7fVxyXG5cclxuXHRcdGVudGl0aWVzX3NjaGVtYS5uYW1lc3BhY2UgPSBfTkFNRVNQQUNFXHJcblxyXG5cdFx0ZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUgPSBbXVxyXG5cclxuXHRcdGVudGl0aWVzX3NjaGVtYS5hbm5vdGF0aW9ucyA9IFtdXHJcblxyXG5cdFx0Xy5lYWNoIENyZWF0b3IuQ29sbGVjdGlvbnMsICh2YWx1ZSwga2V5LCBsaXN0KS0+XHJcblx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpXHJcblx0XHRcdGlmIG5vdCBfb2JqZWN0Py5lbmFibGVfYXBpXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHQjIOS4u+mUrlxyXG5cdFx0XHRrZXlzID0gW3twcm9wZXJ0eVJlZjoge25hbWU6IFwiX2lkXCIsIGNvbXB1dGVkS2V5OiB0cnVlfX1dXHJcblxyXG5cdFx0XHRlbnRpdGllID0ge1xyXG5cdFx0XHRcdG5hbWU6IF9vYmplY3QubmFtZVxyXG5cdFx0XHRcdGtleTprZXlzXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGtleXMuZm9yRWFjaCAoX2tleSktPlxyXG5cdFx0XHRcdGVudGl0aWVzX3NjaGVtYS5hbm5vdGF0aW9ucy5wdXNoIHtcclxuXHRcdFx0XHRcdHRhcmdldDogX05BTUVTUEFDRSArIFwiLlwiICsgX29iamVjdC5uYW1lICsgXCIvXCIgKyBfa2V5LnByb3BlcnR5UmVmLm5hbWUsXHJcblx0XHRcdFx0XHRhbm5vdGF0aW9uOiBbe1xyXG5cdFx0XHRcdFx0XHRcInRlcm1cIjogXCJPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZFwiLFxyXG5cdFx0XHRcdFx0XHRcImJvb2xcIjogXCJ0cnVlXCJcclxuXHRcdFx0XHRcdH1dXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0IyBFbnRpdHlUeXBlXHJcblx0XHRcdHByb3BlcnR5ID0gW11cclxuXHRcdFx0cHJvcGVydHkucHVzaCB7bmFtZTogXCJfaWRcIiwgdHlwZTogXCJFZG0uU3RyaW5nXCIsIG51bGxhYmxlOiBmYWxzZX1cclxuXHJcblx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eSA9IFtdXHJcblxyXG5cdFx0XHRfLmZvckVhY2ggX29iamVjdC5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cclxuXHRcdFx0XHRfcHJvcGVydHkgPSB7bmFtZTogZmllbGRfbmFtZSwgdHlwZTogXCJFZG0uU3RyaW5nXCJ9XHJcblxyXG5cdFx0XHRcdGlmIF8uY29udGFpbnMgX05VTUJFUl9UWVBFUywgZmllbGQudHlwZVxyXG5cdFx0XHRcdFx0X3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Eb3VibGVcIlxyXG5cdFx0XHRcdGVsc2UgaWYgXy5jb250YWlucyBfQk9PTEVBTl9UWVBFUywgZmllbGQudHlwZVxyXG5cdFx0XHRcdFx0X3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Cb29sZWFuXCJcclxuXHRcdFx0XHRlbHNlIGlmIF8uY29udGFpbnMgX0RBVEVUSU1FX09GRlNFVF9UWVBFUywgZmllbGQudHlwZVxyXG5cdFx0XHRcdFx0X3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5EYXRlVGltZU9mZnNldFwiXHJcblx0XHRcdFx0XHRfcHJvcGVydHkucHJlY2lzaW9uID0gXCI4XCJcclxuXHJcblx0XHRcdFx0aWYgZmllbGQucmVxdWlyZWRcclxuXHRcdFx0XHRcdF9wcm9wZXJ0eS5udWxsYWJsZSA9IGZhbHNlXHJcblxyXG5cdFx0XHRcdHByb3BlcnR5LnB1c2ggX3Byb3BlcnR5XHJcblxyXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRcdGlmICFfLmlzQXJyYXkocmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBbcmVmZXJlbmNlX3RvXVxyXG5cclxuXHRcdFx0XHRcdHJlZmVyZW5jZV90by5mb3JFYWNoIChyKS0+XHJcblx0XHRcdFx0XHRcdHJlZmVyZW5jZV9vYmogPSBDcmVhdG9yLmdldE9iamVjdChyLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRpZiByZWZlcmVuY2Vfb2JqXHJcblx0XHRcdFx0XHRcdFx0X25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVhcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoZmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0X25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVggKyBcIi5cIiArIHJlZmVyZW5jZV9vYmoubmFtZVxyXG5cdFx0XHRcdFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eS5wdXNoIHtcclxuXHRcdFx0XHRcdFx0XHRcdG5hbWU6IF9uYW1lLFxyXG5cdCNcdFx0XHRcdFx0XHRcdHR5cGU6IFwiQ29sbGVjdGlvbihcIiArIF9OQU1FU1BBQ0UgKyBcIi5cIiArIHJlZmVyZW5jZV9vYmoubmFtZSArIFwiKVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHRwYXJ0bmVyOiBfb2JqZWN0Lm5hbWUgI1RPRE9cclxuXHRcdFx0XHRcdFx0XHRcdF9yZV9uYW1lOiByZWZlcmVuY2Vfb2JqLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludDogW1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvcGVydHk6IGZpZWxkX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlZFByb3BlcnR5OiBcIl9pZFwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdF1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4gXCJyZWZlcmVuY2UgdG8gJyN7cn0nIGludmFsaWQuXCJcclxuXHJcblx0XHRcdGVudGl0aWUucHJvcGVydHkgPSBwcm9wZXJ0eVxyXG5cdFx0XHRlbnRpdGllLm5hdmlnYXRpb25Qcm9wZXJ0eSA9IG5hdmlnYXRpb25Qcm9wZXJ0eVxyXG5cclxuXHRcdFx0ZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUucHVzaCBlbnRpdGllXHJcblxyXG5cdFx0c2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaCBlbnRpdGllc19zY2hlbWFcclxuXHJcblxyXG5cdFx0Y29udGFpbmVyX3NjaGVtYSA9IHt9XHJcblx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lciA9IHtuYW1lOiBcImNvbnRhaW5lclwifVxyXG5cdFx0Y29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0ID0gW11cclxuXHJcblx0XHRfLmZvckVhY2ggZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUsIChfZXQsIGspLT5cclxuXHRcdFx0Y29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LnB1c2gge1xyXG5cdFx0XHRcdFwibmFtZVwiOiBfZXQubmFtZSxcclxuXHRcdFx0XHRcImVudGl0eVR5cGVcIjogX05BTUVTUEFDRSArIFwiLlwiICsgX2V0Lm5hbWUsXHJcblx0XHRcdFx0XCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nXCI6IFtdXHJcblx0XHRcdH1cclxuXHJcblx0XHQjIFRPRE8gU2VydmljZU1ldGFkYXRh5LiN5pSv5oyBbmF2aWdhdGlvblByb3BlcnR5QmluZGluZ+WxnuaAp1xyXG4jXHRcdF8uZm9yRWFjaCBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgKF9ldCwgayktPlxyXG4jXHRcdFx0Xy5mb3JFYWNoIF9ldC5uYXZpZ2F0aW9uUHJvcGVydHksIChfZXRfbnAsIG5wX2spLT5cclxuI1x0XHRcdFx0X2VzID0gXy5maW5kIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldCwgKF9lcyktPlxyXG4jXHRcdFx0XHRcdFx0XHRyZXR1cm4gX2VzLm5hbWUgPT0gX2V0X25wLnBhcnRuZXJcclxuI1xyXG4jXHRcdFx0XHRfZXM/Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcucHVzaCB7XCJwYXRoXCI6IF9ldF9ucC5fcmVfbmFtZSwgXCJ0YXJnZXRcIjogX2V0X25wLl9yZV9uYW1lfVxyXG4jXHRcdFx0XHRjb25zb2xlLmxvZyhcIl9lc1wiLCBfZXMpXHJcbiNcclxuI1x0XHRjb25zb2xlLmxvZyhcImNvbnRhaW5lcl9zY2hlbWFcIiwgSlNPTi5zdHJpbmdpZnkoY29udGFpbmVyX3NjaGVtYSkpXHJcblxyXG5cdFx0c2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaCBjb250YWluZXJfc2NoZW1hXHJcblxyXG5cdFx0cmV0dXJuIHNjaGVtYVxyXG5cclxuXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJycsIHthdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUR9LCB7XHJcblx0XHRnZXQ6ICgpLT5cclxuXHRcdFx0Y29udGV4dCA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoQHVybFBhcmFtcz8uc3BhY2VJZClcclxuXHRcdFx0c2VydmljZURvY3VtZW50ICA9IFNlcnZpY2VEb2N1bWVudC5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYShAdXJsUGFyYW1zPy5zcGFjZUlkKSwge2NvbnRleHQ6IGNvbnRleHR9KTtcclxuXHRcdFx0Ym9keSA9IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuXHRcdFx0XHRcdCdPRGF0YS1WZXJzaW9uJzogU3RlZWRvc09EYXRhLlZFUlNJT05cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGJvZHk6IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXHJcblx0XHRcdH07XHJcblx0fSlcclxuXHJcblx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKFN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRILCB7YXV0aFJlcXVpcmVkOiBTdGVlZG9zT0RhdGEuQVVUSFJFUVVJUkVEfSwge1xyXG5cdFx0Z2V0OiAoKS0+XHJcblx0XHRcdHNlcnZpY2VNZXRhZGF0YSA9IFNlcnZpY2VNZXRhZGF0YS5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYShAdXJsUGFyYW1zPy5zcGFjZUlkKSlcclxuXHRcdFx0Ym9keSA9IHNlcnZpY2VNZXRhZGF0YS5kb2N1bWVudCgpXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWw7IGNoYXJzZXQ9dXRmLTgnLFxyXG5cdFx0XHRcdFx0J09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Ym9keTogYm9keVxyXG5cdFx0XHR9O1xyXG5cdH0pIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBTZXJ2aWNlRG9jdW1lbnQsIFNlcnZpY2VNZXRhZGF0YSwgX0JPT0xFQU5fVFlQRVMsIF9EQVRFVElNRV9PRkZTRVRfVFlQRVMsIF9OQU1FU1BBQ0UsIF9OVU1CRVJfVFlQRVMsIGdldE9iamVjdHNPZGF0YVNjaGVtYTtcbiAgU2VydmljZU1ldGFkYXRhID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YScpLlNlcnZpY2VNZXRhZGF0YTtcbiAgU2VydmljZURvY3VtZW50ID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1kb2N1bWVudCcpLlNlcnZpY2VEb2N1bWVudDtcbiAgX05VTUJFUl9UWVBFUyA9IFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCJdO1xuICBfQk9PTEVBTl9UWVBFUyA9IFtcImJvb2xlYW5cIl07XG4gIF9EQVRFVElNRV9PRkZTRVRfVFlQRVMgPSBbJ2RhdGV0aW1lJ107XG4gIF9OQU1FU1BBQ0UgPSBcIkNyZWF0b3JFbnRpdGllc1wiO1xuICBnZXRPYmplY3RzT2RhdGFTY2hlbWEgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGNvbnRhaW5lcl9zY2hlbWEsIGVudGl0aWVzX3NjaGVtYSwgc2NoZW1hO1xuICAgIHNjaGVtYSA9IHtcbiAgICAgIHZlcnNpb246IFN0ZWVkb3NPRGF0YS5WRVJTSU9OLFxuICAgICAgZGF0YVNlcnZpY2VzOiB7XG4gICAgICAgIHNjaGVtYTogW11cbiAgICAgIH1cbiAgICB9O1xuICAgIGVudGl0aWVzX3NjaGVtYSA9IHt9O1xuICAgIGVudGl0aWVzX3NjaGVtYS5uYW1lc3BhY2UgPSBfTkFNRVNQQUNFO1xuICAgIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlID0gW107XG4gICAgZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zID0gW107XG4gICAgXy5lYWNoKENyZWF0b3IuQ29sbGVjdGlvbnMsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGxpc3QpIHtcbiAgICAgIHZhciBfb2JqZWN0LCBlbnRpdGllLCBrZXlzLCBuYXZpZ2F0aW9uUHJvcGVydHksIHByb3BlcnR5O1xuICAgICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZCk7XG4gICAgICBpZiAoIShfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmVuYWJsZV9hcGkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGtleXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm9wZXJ0eVJlZjoge1xuICAgICAgICAgICAgbmFtZTogXCJfaWRcIixcbiAgICAgICAgICAgIGNvbXB1dGVkS2V5OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgZW50aXRpZSA9IHtcbiAgICAgICAgbmFtZTogX29iamVjdC5uYW1lLFxuICAgICAgICBrZXk6IGtleXNcbiAgICAgIH07XG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oX2tleSkge1xuICAgICAgICByZXR1cm4gZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zLnB1c2goe1xuICAgICAgICAgIHRhcmdldDogX05BTUVTUEFDRSArIFwiLlwiICsgX29iamVjdC5uYW1lICsgXCIvXCIgKyBfa2V5LnByb3BlcnR5UmVmLm5hbWUsXG4gICAgICAgICAgYW5ub3RhdGlvbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRlcm1cIjogXCJPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZFwiLFxuICAgICAgICAgICAgICBcImJvb2xcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBwcm9wZXJ0eSA9IFtdO1xuICAgICAgcHJvcGVydHkucHVzaCh7XG4gICAgICAgIG5hbWU6IFwiX2lkXCIsXG4gICAgICAgIHR5cGU6IFwiRWRtLlN0cmluZ1wiLFxuICAgICAgICBudWxsYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgbmF2aWdhdGlvblByb3BlcnR5ID0gW107XG4gICAgICBfLmZvckVhY2goX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIHZhciBfcHJvcGVydHksIHJlZmVyZW5jZV90bztcbiAgICAgICAgX3Byb3BlcnR5ID0ge1xuICAgICAgICAgIG5hbWU6IGZpZWxkX25hbWUsXG4gICAgICAgICAgdHlwZTogXCJFZG0uU3RyaW5nXCJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKF8uY29udGFpbnMoX05VTUJFUl9UWVBFUywgZmllbGQudHlwZSkpIHtcbiAgICAgICAgICBfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRvdWJsZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKF8uY29udGFpbnMoX0JPT0xFQU5fVFlQRVMsIGZpZWxkLnR5cGUpKSB7XG4gICAgICAgICAgX3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Cb29sZWFuXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5jb250YWlucyhfREFURVRJTUVfT0ZGU0VUX1RZUEVTLCBmaWVsZC50eXBlKSkge1xuICAgICAgICAgIF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjtcbiAgICAgICAgICBfcHJvcGVydHkucHJlY2lzaW9uID0gXCI4XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICAgICAgX3Byb3BlcnR5Lm51bGxhYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcHJvcGVydHkucHVzaChfcHJvcGVydHkpO1xuICAgICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgIGlmIChyZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoIV8uaXNBcnJheShyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICByZWZlcmVuY2VfdG8gPSBbcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIHZhciBfbmFtZSwgcmVmZXJlbmNlX29iajtcbiAgICAgICAgICAgIHJlZmVyZW5jZV9vYmogPSBDcmVhdG9yLmdldE9iamVjdChyLCBzcGFjZUlkKTtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2Vfb2JqKSB7XG4gICAgICAgICAgICAgIF9uYW1lID0gZmllbGRfbmFtZSArIFN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYO1xuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBuYXZpZ2F0aW9uUHJvcGVydHkucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogX25hbWUsXG4gICAgICAgICAgICAgICAgdHlwZTogX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lLFxuICAgICAgICAgICAgICAgIHBhcnRuZXI6IF9vYmplY3QubmFtZSxcbiAgICAgICAgICAgICAgICBfcmVfbmFtZTogcmVmZXJlbmNlX29iai5uYW1lLFxuICAgICAgICAgICAgICAgIHJlZmVyZW50aWFsQ29uc3RyYWludDogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogZmllbGRfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlZFByb3BlcnR5OiBcIl9pZFwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oXCJyZWZlcmVuY2UgdG8gJ1wiICsgciArIFwiJyBpbnZhbGlkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBlbnRpdGllLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgICBlbnRpdGllLm5hdmlnYXRpb25Qcm9wZXJ0eSA9IG5hdmlnYXRpb25Qcm9wZXJ0eTtcbiAgICAgIHJldHVybiBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZS5wdXNoKGVudGl0aWUpO1xuICAgIH0pO1xuICAgIHNjaGVtYS5kYXRhU2VydmljZXMuc2NoZW1hLnB1c2goZW50aXRpZXNfc2NoZW1hKTtcbiAgICBjb250YWluZXJfc2NoZW1hID0ge307XG4gICAgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIgPSB7XG4gICAgICBuYW1lOiBcImNvbnRhaW5lclwiXG4gICAgfTtcbiAgICBjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQgPSBbXTtcbiAgICBfLmZvckVhY2goZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUsIGZ1bmN0aW9uKF9ldCwgaykge1xuICAgICAgcmV0dXJuIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldC5wdXNoKHtcbiAgICAgICAgXCJuYW1lXCI6IF9ldC5uYW1lLFxuICAgICAgICBcImVudGl0eVR5cGVcIjogX05BTUVTUEFDRSArIFwiLlwiICsgX2V0Lm5hbWUsXG4gICAgICAgIFwibmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiOiBbXVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgc2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaChjb250YWluZXJfc2NoZW1hKTtcbiAgICByZXR1cm4gc2NoZW1hO1xuICB9O1xuICBTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJycsIHtcbiAgICBhdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRURcbiAgfSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm9keSwgY29udGV4dCwgcmVmLCByZWYxLCBzZXJ2aWNlRG9jdW1lbnQ7XG4gICAgICBjb250ZXh0ID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aCgocmVmID0gdGhpcy51cmxQYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgICBzZXJ2aWNlRG9jdW1lbnQgPSBTZXJ2aWNlRG9jdW1lbnQucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoKHJlZjEgPSB0aGlzLnVybFBhcmFtcykgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCksIHtcbiAgICAgICAgY29udGV4dDogY29udGV4dFxuICAgICAgfSk7XG4gICAgICBib2R5ID0gc2VydmljZURvY3VtZW50LmRvY3VtZW50KCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEgsIHtcbiAgICBhdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRURcbiAgfSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm9keSwgcmVmLCBzZXJ2aWNlTWV0YWRhdGE7XG4gICAgICBzZXJ2aWNlTWV0YWRhdGEgPSBTZXJ2aWNlTWV0YWRhdGEucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoKHJlZiA9IHRoaXMudXJsUGFyYW1zKSAhPSBudWxsID8gcmVmLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICAgIGJvZHkgPSBzZXJ2aWNlTWV0YWRhdGEuZG9jdW1lbnQoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbDsgY2hhcnNldD11dGYtOCcsXG4gICAgICAgICAgJ09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBib2R5XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIkBTdGVlZG9zT0RhdGEgPSB7fVxyXG5TdGVlZG9zT0RhdGEuVkVSU0lPTiA9ICc0LjAnXHJcblN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUQgPSB0cnVlXHJcblN0ZWVkb3NPRGF0YS5BUElfUEFUSCA9ICcvYXBpL29kYXRhL3Y0LzpzcGFjZUlkJ1xyXG5TdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCA9ICckbWV0YWRhdGEnXHJcblN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYID0gXCJfZXhwYW5kXCJcclxuU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoID0gKHNwYWNlSWQpLT5cclxuXHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKCdhcGkvb2RhdGEvdjQvJyArIHNwYWNlSWQpXHJcblxyXG5TdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoID0gKHNwYWNlSWQsb2JqZWN0X25hbWUpLT5cclxuXHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgXCIvI3tvYmplY3RfbmFtZX1cIlxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0U3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aCA9IChzcGFjZUlkKS0+XHJcblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgXCIvI3tTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSH1cIlxyXG5cclxuXHRTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aCA9IChzcGFjZUlkLCBvYmplY3RfbmFtZSktPlxyXG5cdFx0cmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoc3BhY2VJZCkgKyBcIiMje29iamVjdF9uYW1lfVwiXHJcblx0U3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoID0gKHNwYWNlSWQsb2JqZWN0X25hbWUpLT5cclxuXHRcdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je29iamVjdF9uYW1lfVwiXHJcblxyXG5cclxuXHRAU3RlZWRvc09kYXRhQVBJID0gbmV3IE9kYXRhUmVzdGl2dXNcclxuXHRcdGFwaVBhdGg6IFN0ZWVkb3NPRGF0YS5BUElfUEFUSCxcclxuXHRcdHVzZURlZmF1bHRBdXRoOiB0cnVlXHJcblx0XHRwcmV0dHlKc29uOiB0cnVlXHJcblx0XHRlbmFibGVDb3JzOiB0cnVlXHJcblx0XHRkZWZhdWx0SGVhZGVyczpcclxuXHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4iLCJ0aGlzLlN0ZWVkb3NPRGF0YSA9IHt9O1xuXG5TdGVlZG9zT0RhdGEuVkVSU0lPTiA9ICc0LjAnO1xuXG5TdGVlZG9zT0RhdGEuQVVUSFJFUVVJUkVEID0gdHJ1ZTtcblxuU3RlZWRvc09EYXRhLkFQSV9QQVRIID0gJy9hcGkvb2RhdGEvdjQvOnNwYWNlSWQnO1xuXG5TdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCA9ICckbWV0YWRhdGEnO1xuXG5TdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCA9IFwiX2V4cGFuZFwiO1xuXG5TdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGggPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwoJ2FwaS9vZGF0YS92NC8nICsgc3BhY2VJZCk7XG59O1xuXG5TdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIChcIi9cIiArIG9iamVjdF9uYW1lKTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEgpO1xuICB9O1xuICBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQsIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoc3BhY2VJZCkgKyAoXCIjXCIgKyBvYmplY3RfbmFtZSk7XG4gIH07XG4gIFN0ZWVkb3NPRGF0YS5nZXRPRGF0YU5leHRMaW5rUGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQsIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIChcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgfTtcbiAgdGhpcy5TdGVlZG9zT2RhdGFBUEkgPSBuZXcgT2RhdGFSZXN0aXZ1cyh7XG4gICAgYXBpUGF0aDogU3RlZWRvc09EYXRhLkFQSV9QQVRILFxuICAgIHVzZURlZmF1bHRBdXRoOiB0cnVlLFxuICAgIHByZXR0eUpzb246IHRydWUsXG4gICAgZW5hYmxlQ29yczogdHJ1ZSxcbiAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
