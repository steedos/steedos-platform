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
  var MeteorODataRouter, ODataRouter, app, express;
  MeteorODataRouter = require('@steedos/core').MeteorODataRouter;
  ODataRouter = require('@steedos/core').ODataRouter;
  express = require('express');
  app = express();
  app.use('/api/odata/v4', MeteorODataRouter);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL29iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21pZGRsZXdhcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWlkZGxld2FyZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsImNvb2tpZXMiLCJnZXRVc2VyUXVlcnlTZWxlY3RvciIsInVzZXJWYWxpZGF0b3IiLCJBdXRoIiwiTWF0Y2giLCJXaGVyZSIsInVzZXIiLCJjaGVjayIsImlkIiwiT3B0aW9uYWwiLCJTdHJpbmciLCJ1c2VybmFtZSIsImVtYWlsIiwiXyIsImtleXMiLCJsZW5ndGgiLCJFcnJvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicGFzc3dvcmQiLCJhdXRoVG9rZW4iLCJhdXRoZW50aWNhdGluZ1VzZXIiLCJhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciIsImhhc2hlZFRva2VuIiwicGFzc3dvcmRWZXJpZmljYXRpb24iLCJyZWYiLCJzcGFjZV91c2VycyIsInNwYWNlcyIsIk1ldGVvciIsInVzZXJzIiwiZmluZE9uZSIsInNlcnZpY2VzIiwiQWNjb3VudHMiLCJfY2hlY2tQYXNzd29yZCIsImVycm9yIiwiX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4iLCJfaGFzaFN0YW1wZWRUb2tlbiIsIl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIiwiX2lkIiwiZGIiLCJmaW5kIiwiZmV0Y2giLCJlYWNoIiwic3UiLCJzcGFjZSIsImlzX3BhaWQiLCJpbmRleE9mIiwiYWRtaW5zIiwicHVzaCIsIm5hbWUiLCJ0b2tlbiIsInVzZXJJZCIsImFkbWluU3BhY2VzIiwiZW52IiwicHJvY2VzcyIsIk5PREVfRU5WIiwiaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UiLCJlcnIiLCJyZXEiLCJyZXMiLCJzdGF0dXNDb2RlIiwic3RhdHVzIiwibXNnIiwic3RhY2siLCJ0b1N0cmluZyIsImNvbnNvbGUiLCJoZWFkZXJzU2VudCIsInNvY2tldCIsImRlc3Ryb3kiLCJzZXRIZWFkZXIiLCJCdWZmZXIiLCJieXRlTGVuZ3RoIiwibWV0aG9kIiwiZW5kIiwic2hhcmUiLCJSb3V0ZSIsImFwaSIsInBhdGgiLCJvcHRpb25zIiwiZW5kcG9pbnRzMSIsImVuZHBvaW50cyIsInByb3RvdHlwZSIsImFkZFRvQXBpIiwiYXZhaWxhYmxlTWV0aG9kcyIsImFsbG93ZWRNZXRob2RzIiwiZnVsbFBhdGgiLCJyZWplY3RlZE1ldGhvZHMiLCJzZWxmIiwiY29udGFpbnMiLCJfY29uZmlnIiwicGF0aHMiLCJleHRlbmQiLCJkZWZhdWx0T3B0aW9uc0VuZHBvaW50IiwiX3Jlc29sdmVFbmRwb2ludHMiLCJfY29uZmlndXJlRW5kcG9pbnRzIiwiZmlsdGVyIiwicmVqZWN0IiwiYXBpUGF0aCIsImVuZHBvaW50IiwiSnNvblJvdXRlcyIsImFkZCIsImRvbmVGdW5jIiwiZW5kcG9pbnRDb250ZXh0IiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VJbml0aWF0ZWQiLCJ1cmxQYXJhbXMiLCJwYXJhbXMiLCJxdWVyeVBhcmFtcyIsInF1ZXJ5IiwiYm9keVBhcmFtcyIsImJvZHkiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJkb25lIiwiX2NhbGxFbmRwb2ludCIsImVycm9yMSIsImhlYWRlcnMiLCJfcmVzcG9uZCIsIm1lc3NhZ2UiLCJqb2luIiwidG9VcHBlckNhc2UiLCJpc0Z1bmN0aW9uIiwiYWN0aW9uIiwicmVmMSIsInJlZjIiLCJyb2xlUmVxdWlyZWQiLCJ1bmlvbiIsImlzRW1wdHkiLCJhdXRoUmVxdWlyZWQiLCJzcGFjZVJlcXVpcmVkIiwiaW52b2NhdGlvbiIsIl9hdXRoQWNjZXB0ZWQiLCJfcm9sZUFjY2VwdGVkIiwiX3NwYWNlQWNjZXB0ZWQiLCJERFBDb21tb24iLCJNZXRob2RJbnZvY2F0aW9uIiwiaXNTaW11bGF0aW9uIiwiY29ubmVjdGlvbiIsInJhbmRvbVNlZWQiLCJtYWtlUnBjU2VlZCIsIkREUCIsIl9DdXJyZW50SW52b2NhdGlvbiIsIndpdGhWYWx1ZSIsImNhbGwiLCJfYXV0aGVudGljYXRlIiwiYXV0aCIsInVzZXJTZWxlY3RvciIsInNwYWNlX3VzZXJzX2NvdW50Iiwic3BhY2VJZCIsImNvdW50IiwiaW50ZXJzZWN0aW9uIiwicm9sZXMiLCJkZWZhdWx0SGVhZGVycyIsImRlbGF5SW5NaWxsaXNlY29uZHMiLCJtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyIsInJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvIiwic2VuZFJlc3BvbnNlIiwiX2xvd2VyQ2FzZUtleXMiLCJtYXRjaCIsInByZXR0eUpzb24iLCJKU09OIiwic3RyaW5naWZ5Iiwid3JpdGVIZWFkIiwid3JpdGUiLCJNYXRoIiwicmFuZG9tIiwic2V0VGltZW91dCIsIm9iamVjdCIsImNoYWluIiwicGFpcnMiLCJtYXAiLCJhdHRyIiwidG9Mb3dlckNhc2UiLCJ2YWx1ZSIsIkNvb2tpZXMiLCJPZGF0YVJlc3RpdnVzIiwiYmFzaWNBdXRoIiwiaXRlbSIsImkiLCJsIiwiY29yc0hlYWRlcnMiLCJfcm91dGVzIiwidXNlRGVmYXVsdEF1dGgiLCJ2ZXJzaW9uIiwiX3VzZXIiLCJnZXQiLCJfaGFzaExvZ2luVG9rZW4iLCJlbmFibGVDb3JzIiwic2xpY2UiLCJsYXN0IiwiX2luaXRBdXRoIiwidXNlQXV0aCIsIndhcm4iLCJhZGRSb3V0ZSIsInJvdXRlIiwiYWRkQ29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJjb2xsZWN0aW9uRW5kcG9pbnRzIiwiY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzIiwiZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uIiwiZW50aXR5Um91dGVFbmRwb2ludHMiLCJleGNsdWRlZEVuZHBvaW50cyIsIm1ldGhvZHMiLCJtZXRob2RzT25Db2xsZWN0aW9uIiwicm91dGVPcHRpb25zIiwiX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzIiwiX2NvbGxlY3Rpb25FbmRwb2ludHMiLCJfbmFtZSIsImNvbmZpZ3VyZWRFbmRwb2ludCIsImVuZHBvaW50T3B0aW9ucyIsIm1ldGhvZFR5cGUiLCJjbG9uZSIsImVudGl0eSIsInNlbGVjdG9yIiwiZGF0YSIsInB1dCIsImVudGl0eUlzVXBkYXRlZCIsInVwZGF0ZSIsIiRzZXQiLCJyZW1vdmUiLCJwb3N0IiwiZW50aXR5SWQiLCJpbnNlcnQiLCJnZXRBbGwiLCJlbnRpdGllcyIsImZpZWxkcyIsInByb2ZpbGUiLCJjcmVhdGVVc2VyIiwibG9nb3V0IiwiZSIsImV4dHJhRGF0YSIsInNlYXJjaFF1ZXJ5IiwicmVhc29uIiwib25Mb2dnZWRJbiIsImV4dHJhIiwiaW5kZXgiLCJ0b2tlbkZpZWxkTmFtZSIsInRva2VuTG9jYXRpb24iLCJ0b2tlblBhdGgiLCJ0b2tlblJlbW92YWxRdWVyeSIsInRva2VuVG9SZW1vdmUiLCJsYXN0SW5kZXhPZiIsInN1YnN0cmluZyIsIiRwdWxsIiwib25Mb2dnZWRPdXQiLCJzdGFydHVwIiwiZ2V0T2JqZWN0IiwiZ2V0T2JqZWN0cyIsIm9iamVjdF9uYW1lcyIsInNwbGl0IiwiZm9yRWFjaCIsIm9iamVjdF9uYW1lIiwib2JqZWN0X3Blcm1pc3Npb25zIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNDdXJyZW50IiwicHNldHNVc2VyIiwiQ3JlYXRvciIsIk9iamVjdHMiLCJnZXRPYmplY3ROYW1lIiwiZ2V0Q29sbGVjdGlvbiIsImFzc2lnbmVkX2FwcHMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImJpbmQiLCJsaXN0X3ZpZXdzIiwicGVybWlzc2lvbl9zZXQiLCJhbGxvd1JlYWQiLCJhbGxvd0VkaXQiLCJhbGxvd0RlbGV0ZSIsImFsbG93Q3JlYXRlIiwibW9kaWZ5QWxsUmVjb3JkcyIsImZpZWxkIiwia2V5IiwiX2ZpZWxkIiwidW5lZGl0YWJsZV9maWVsZHMiLCJyZWFkb25seSIsInVucmVhZGFibGVfZmllbGRzIiwiU3RlZWRvc09EYXRhIiwiQVBJX1BBVEgiLCJuZXh0IiwiX29iaiIsIlN0ZWVkb3MiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJNZXRlb3JPRGF0YVJvdXRlciIsIk9EYXRhUm91dGVyIiwiYXBwIiwiZXhwcmVzcyIsInVzZSIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInN0ZWVkb3NTY2hlbWEiLCJnZXREYXRhU291cmNlcyIsImRhdGFzb3VyY2UiLCJvdGhlckFwcCIsIkZpYmVyIiwiYXV0aG9yaXphdGlvbkNhY2hlIiwiTWlkZGxld2FyZSIsImFwcF9pZCIsImFwcF9sb2dpbl90b2tlbiIsImNsaWVudF9pZCIsImlzQXV0aGVkIiwibG9naW5Ub2tlbnMiLCJyZXN1bHQiLCJhY2Nlc3NfdG9rZW4iLCJsb2ciLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJwYXJzZSIsInBhc3MiLCJyZXN1bWUiLCJ0IiwicnVuIiwiU2VydmljZURvY3VtZW50IiwiU2VydmljZU1ldGFkYXRhIiwiX0JPT0xFQU5fVFlQRVMiLCJfREFURVRJTUVfT0ZGU0VUX1RZUEVTIiwiX05BTUVTUEFDRSIsIl9OVU1CRVJfVFlQRVMiLCJnZXRPYmplY3RzT2RhdGFTY2hlbWEiLCJjb250YWluZXJfc2NoZW1hIiwiZW50aXRpZXNfc2NoZW1hIiwic2NoZW1hIiwiVkVSU0lPTiIsImRhdGFTZXJ2aWNlcyIsIm5hbWVzcGFjZSIsImVudGl0eVR5cGUiLCJhbm5vdGF0aW9ucyIsIkNvbGxlY3Rpb25zIiwibGlzdCIsIl9vYmplY3QiLCJlbnRpdGllIiwibmF2aWdhdGlvblByb3BlcnR5IiwicHJvcGVydHkiLCJlbmFibGVfYXBpIiwicHJvcGVydHlSZWYiLCJjb21wdXRlZEtleSIsIl9rZXkiLCJ0YXJnZXQiLCJhbm5vdGF0aW9uIiwidHlwZSIsIm51bGxhYmxlIiwiZmllbGRfbmFtZSIsIl9wcm9wZXJ0eSIsInJlZmVyZW5jZV90byIsInByZWNpc2lvbiIsInJlcXVpcmVkIiwiaXNBcnJheSIsInIiLCJyZWZlcmVuY2Vfb2JqIiwiRVhQQU5EX0ZJRUxEX1NVRkZJWCIsInBhcnRuZXIiLCJfcmVfbmFtZSIsInJlZmVyZW50aWFsQ29uc3RyYWludCIsInJlZmVyZW5jZWRQcm9wZXJ0eSIsImVudGl0eUNvbnRhaW5lciIsImVudGl0eVNldCIsIl9ldCIsImsiLCJTdGVlZG9zT2RhdGFBUEkiLCJBVVRIUkVRVUlSRUQiLCJjb250ZXh0Iiwic2VydmljZURvY3VtZW50IiwiZ2V0TWV0YURhdGFQYXRoIiwicHJvY2Vzc01ldGFkYXRhSnNvbiIsImRvY3VtZW50IiwiTUVUQURBVEFfUEFUSCIsInNlcnZpY2VNZXRhZGF0YSIsImdldFJvb3RQYXRoIiwiYWJzb2x1dGVVcmwiLCJnZXRPRGF0YVBhdGgiLCJpc1NlcnZlciIsImdldE9EYXRhQ29udGV4dFBhdGgiLCJnZXRPRGF0YU5leHRMaW5rUGF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUFyQjtBQUNBQyxPQUFPLENBQUMseUJBQUQsQ0FBUDs7QUFHQUosZ0JBQWdCLENBQUM7QUFDaEIsZ0JBQWMsUUFERTtBQUVoQiwrQkFBNkIsUUFGYjtBQUdoQiwrQkFBNkIsUUFIYjtBQUloQixzQkFBb0IsU0FKSjtBQUtoQkssU0FBTyxFQUFFO0FBTE8sQ0FBRCxFQU1iLGVBTmEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7O0FDSkEsSUFBQUMsb0JBQUEsRUFBQUMsYUFBQTtBQUFBLEtBQUNDLElBQUQsVUFBQ0EsSUFBRCxHQUFVLEVBQVYsRSxDQUVBOzs7QUFHQUQsZ0JBQWdCRSxNQUFNQyxLQUFOLENBQVksVUFBQ0MsSUFBRDtBQUMzQkMsUUFBTUQsSUFBTixFQUNDO0FBQUFFLFFBQUlKLE1BQU1LLFFBQU4sQ0FBZUMsTUFBZixDQUFKO0FBQ0FDLGNBQVVQLE1BQU1LLFFBQU4sQ0FBZUMsTUFBZixDQURWO0FBRUFFLFdBQU9SLE1BQU1LLFFBQU4sQ0FBZUMsTUFBZjtBQUZQLEdBREQ7O0FBS0EsTUFBR0csRUFBRUMsSUFBRixDQUFPUixJQUFQLEVBQWFTLE1BQWIsS0FBdUIsQ0FBSSxDQUE5QjtBQUNDLFVBQU0sSUFBSVgsTUFBTVksS0FBVixDQUFnQiw2Q0FBaEIsQ0FBTjtBQ0tDOztBREhGLFNBQU8sSUFBUDtBQVRlLEVBQWhCLEMsQ0FZQTs7OztBQUdBZix1QkFBdUIsVUFBQ0ssSUFBRDtBQUN0QixNQUFHQSxLQUFLRSxFQUFSO0FBQ0MsV0FBTztBQUFDLGFBQU9GLEtBQUtFO0FBQWIsS0FBUDtBQURELFNBRUssSUFBR0YsS0FBS0ssUUFBUjtBQUNKLFdBQU87QUFBQyxrQkFBWUwsS0FBS0s7QUFBbEIsS0FBUDtBQURJLFNBRUEsSUFBR0wsS0FBS00sS0FBUjtBQUNKLFdBQU87QUFBQyx3QkFBa0JOLEtBQUtNO0FBQXhCLEtBQVA7QUNhQzs7QURWRixRQUFNLElBQUlJLEtBQUosQ0FBVSwwQ0FBVixDQUFOO0FBVHNCLENBQXZCLEMsQ0FZQTs7OztBQUdBLEtBQUNiLElBQUQsQ0FBTWMsaUJBQU4sR0FBMEIsVUFBQ1gsSUFBRCxFQUFPWSxRQUFQO0FBQ3pCLE1BQUFDLFNBQUEsRUFBQUMsa0JBQUEsRUFBQUMsMEJBQUEsRUFBQUMsV0FBQSxFQUFBQyxvQkFBQSxFQUFBQyxHQUFBLEVBQUFDLFdBQUEsRUFBQUMsTUFBQTs7QUFBQSxNQUFHLENBQUlwQixJQUFKLElBQVksQ0FBSVksUUFBbkI7QUFDQyxVQUFNLElBQUlTLE9BQU9YLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsY0FBdEIsQ0FBTjtBQ2VDOztBRFpGVCxRQUFNRCxJQUFOLEVBQVlKLGFBQVo7QUFDQUssUUFBTVcsUUFBTixFQUFnQlIsTUFBaEI7QUFHQVcsK0JBQTZCcEIscUJBQXFCSyxJQUFyQixDQUE3QjtBQUNBYyx1QkFBcUJPLE9BQU9DLEtBQVAsQ0FBYUMsT0FBYixDQUFxQlIsMEJBQXJCLENBQXJCOztBQUVBLE1BQUcsQ0FBSUQsa0JBQVA7QUFDQyxVQUFNLElBQUlPLE9BQU9YLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsY0FBdEIsQ0FBTjtBQ1dDOztBRFZGLE1BQUcsR0FBQVEsTUFBQUosbUJBQUFVLFFBQUEsWUFBQU4sSUFBaUNOLFFBQWpDLEdBQWlDLE1BQWpDLENBQUg7QUFDQyxVQUFNLElBQUlTLE9BQU9YLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsY0FBdEIsQ0FBTjtBQ1lDOztBRFRGTyx5QkFBdUJRLFNBQVNDLGNBQVQsQ0FBd0JaLGtCQUF4QixFQUE0Q0YsUUFBNUMsQ0FBdkI7O0FBQ0EsTUFBR0sscUJBQXFCVSxLQUF4QjtBQUNDLFVBQU0sSUFBSU4sT0FBT1gsS0FBWCxDQUFpQixHQUFqQixFQUFzQixjQUF0QixDQUFOO0FDV0M7O0FEUkZHLGNBQVlZLFNBQVNHLDBCQUFULEVBQVo7QUFDQVosZ0JBQWNTLFNBQVNJLGlCQUFULENBQTJCaEIsU0FBM0IsQ0FBZDs7QUFDQVksV0FBU0ssdUJBQVQsQ0FBaUNoQixtQkFBbUJpQixHQUFwRCxFQUF5RGYsV0FBekQ7O0FBRUFHLGdCQUFjYSxHQUFHYixXQUFILENBQWVjLElBQWYsQ0FBb0I7QUFBQ2pDLFVBQU1jLG1CQUFtQmlCO0FBQTFCLEdBQXBCLEVBQW9ERyxLQUFwRCxFQUFkO0FBQ0FkLFdBQVMsRUFBVDs7QUFDQWIsSUFBRTRCLElBQUYsQ0FBT2hCLFdBQVAsRUFBb0IsVUFBQ2lCLEVBQUQ7QUFDbkIsUUFBQUMsS0FBQTtBQUFBQSxZQUFRTCxHQUFHWixNQUFILENBQVVHLE9BQVYsQ0FBa0JhLEdBQUdDLEtBQXJCLENBQVI7O0FBRUEsU0FBQUEsU0FBQSxPQUFHQSxNQUFPQyxPQUFWLEdBQVUsTUFBVixLQUFzQi9CLEVBQUVnQyxPQUFGLENBQVVGLE1BQU1HLE1BQWhCLEVBQXdCSixHQUFHcEMsSUFBM0IsS0FBa0MsQ0FBeEQ7QUNXSSxhRFZIb0IsT0FBT3FCLElBQVAsQ0FDQztBQUFBVixhQUFLTSxNQUFNTixHQUFYO0FBQ0FXLGNBQU1MLE1BQU1LO0FBRFosT0FERCxDQ1VHO0FBSUQ7QURsQko7O0FBT0EsU0FBTztBQUFDN0IsZUFBV0EsVUFBVThCLEtBQXRCO0FBQTZCQyxZQUFROUIsbUJBQW1CaUIsR0FBeEQ7QUFBNkRjLGlCQUFhekI7QUFBMUUsR0FBUDtBQXBDeUIsQ0FBMUIsQzs7Ozs7Ozs7Ozs7QUVuQ0E7QUFDQTtBQUVBO0FBQ0EsSUFBSTBCLEdBQUcsR0FBR0MsT0FBTyxDQUFDRCxHQUFSLENBQVlFLFFBQVosSUFBd0IsYUFBbEMsQyxDQUVBOztBQUNBQyw2QkFBNkIsR0FBRyxVQUFTQyxHQUFULEVBQWNDLEdBQWQsRUFBbUJDLEdBQW5CLEVBQXdCO0FBQ3ZELE1BQUlBLEdBQUcsQ0FBQ0MsVUFBSixHQUFpQixHQUFyQixFQUNDRCxHQUFHLENBQUNDLFVBQUosR0FBaUIsR0FBakI7QUFFRCxNQUFJSCxHQUFHLENBQUNJLE1BQVIsRUFDQ0YsR0FBRyxDQUFDQyxVQUFKLEdBQWlCSCxHQUFHLENBQUNJLE1BQXJCO0FBRUQsTUFBSVIsR0FBRyxLQUFLLGFBQVosRUFDQ1MsR0FBRyxHQUFHLENBQUNMLEdBQUcsQ0FBQ00sS0FBSixJQUFhTixHQUFHLENBQUNPLFFBQUosRUFBZCxJQUFnQyxJQUF0QyxDQURELEtBR0E7QUFDQ0YsT0FBRyxHQUFHLGVBQU47QUFFREcsU0FBTyxDQUFDL0IsS0FBUixDQUFjdUIsR0FBRyxDQUFDTSxLQUFKLElBQWFOLEdBQUcsQ0FBQ08sUUFBSixFQUEzQjtBQUVBLE1BQUlMLEdBQUcsQ0FBQ08sV0FBUixFQUNDLE9BQU9SLEdBQUcsQ0FBQ1MsTUFBSixDQUFXQyxPQUFYLEVBQVA7QUFFRFQsS0FBRyxDQUFDVSxTQUFKLENBQWMsY0FBZCxFQUE4QixXQUE5QjtBQUNBVixLQUFHLENBQUNVLFNBQUosQ0FBYyxnQkFBZCxFQUFnQ0MsTUFBTSxDQUFDQyxVQUFQLENBQWtCVCxHQUFsQixDQUFoQztBQUNBLE1BQUlKLEdBQUcsQ0FBQ2MsTUFBSixLQUFlLE1BQW5CLEVBQ0MsT0FBT2IsR0FBRyxDQUFDYyxHQUFKLEVBQVA7QUFDRGQsS0FBRyxDQUFDYyxHQUFKLENBQVFYLEdBQVI7QUFDQTtBQUNBLENBeEJELEM7Ozs7Ozs7Ozs7OztBQ1BNWSxNQUFNQyxLQUFOLEdBQU07QUFFRSxXQUFBQSxLQUFBLENBQUNDLEdBQUQsRUFBT0MsSUFBUCxFQUFjQyxPQUFkLEVBQXdCQyxVQUF4QjtBQUFDLFNBQUNILEdBQUQsR0FBQUEsR0FBQTtBQUFNLFNBQUNDLElBQUQsR0FBQUEsSUFBQTtBQUFPLFNBQUNDLE9BQUQsR0FBQUEsT0FBQTtBQUFVLFNBQUNFLFNBQUQsR0FBQUQsVUFBQTs7QUFFcEMsUUFBRyxDQUFJLEtBQUNDLFNBQVI7QUFDQyxXQUFDQSxTQUFELEdBQWEsS0FBQ0YsT0FBZDtBQUNBLFdBQUNBLE9BQUQsR0FBVyxFQUFYO0FDR0U7QURQUzs7QUNVWkgsUUFBTU0sU0FBTixDREhEQyxRQ0dDLEdESFk7QUFDWixRQUFBQyxnQkFBQTtBQUFBQSx1QkFBbUIsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixLQUFoQixFQUF1QixPQUF2QixFQUFnQyxRQUFoQyxFQUEwQyxTQUExQyxDQUFuQjtBQUVBLFdBQU87QUFDTixVQUFBQyxjQUFBLEVBQUFDLFFBQUEsRUFBQUMsZUFBQSxFQUFBQyxJQUFBO0FBQUFBLGFBQU8sSUFBUDs7QUFJQSxVQUFHekUsRUFBRTBFLFFBQUYsQ0FBVyxLQUFDWixHQUFELENBQUthLE9BQUwsQ0FBYUMsS0FBeEIsRUFBK0IsS0FBQ2IsSUFBaEMsQ0FBSDtBQUNDLGNBQU0sSUFBSTVELEtBQUosQ0FBVSw2Q0FBMkMsS0FBQzRELElBQXRELENBQU47QUNFRzs7QURDSixXQUFDRyxTQUFELEdBQWFsRSxFQUFFNkUsTUFBRixDQUFTO0FBQUFiLGlCQUFTLEtBQUNGLEdBQUQsQ0FBS2EsT0FBTCxDQUFhRztBQUF0QixPQUFULEVBQXVELEtBQUNaLFNBQXhELENBQWI7O0FBR0EsV0FBQ2EsaUJBQUQ7O0FBQ0EsV0FBQ0MsbUJBQUQ7O0FBR0EsV0FBQ2xCLEdBQUQsQ0FBS2EsT0FBTCxDQUFhQyxLQUFiLENBQW1CMUMsSUFBbkIsQ0FBd0IsS0FBQzZCLElBQXpCOztBQUVBTyx1QkFBaUJ0RSxFQUFFaUYsTUFBRixDQUFTWixnQkFBVCxFQUEyQixVQUFDWCxNQUFEO0FDRnZDLGVER0oxRCxFQUFFMEUsUUFBRixDQUFXMUUsRUFBRUMsSUFBRixDQUFPd0UsS0FBS1AsU0FBWixDQUFYLEVBQW1DUixNQUFuQyxDQ0hJO0FERVksUUFBakI7QUFFQWMsd0JBQWtCeEUsRUFBRWtGLE1BQUYsQ0FBU2IsZ0JBQVQsRUFBMkIsVUFBQ1gsTUFBRDtBQ0R4QyxlREVKMUQsRUFBRTBFLFFBQUYsQ0FBVzFFLEVBQUVDLElBQUYsQ0FBT3dFLEtBQUtQLFNBQVosQ0FBWCxFQUFtQ1IsTUFBbkMsQ0NGSTtBRENhLFFBQWxCO0FBSUFhLGlCQUFXLEtBQUNULEdBQUQsQ0FBS2EsT0FBTCxDQUFhUSxPQUFiLEdBQXVCLEtBQUNwQixJQUFuQzs7QUFDQS9ELFFBQUU0QixJQUFGLENBQU8wQyxjQUFQLEVBQXVCLFVBQUNaLE1BQUQ7QUFDdEIsWUFBQTBCLFFBQUE7QUFBQUEsbUJBQVdYLEtBQUtQLFNBQUwsQ0FBZVIsTUFBZixDQUFYO0FDREksZURFSjJCLFdBQVdDLEdBQVgsQ0FBZTVCLE1BQWYsRUFBdUJhLFFBQXZCLEVBQWlDLFVBQUMzQixHQUFELEVBQU1DLEdBQU47QUFFaEMsY0FBQTBDLFFBQUEsRUFBQUMsZUFBQSxFQUFBcEUsS0FBQSxFQUFBcUUsWUFBQSxFQUFBQyxpQkFBQTtBQUFBQSw4QkFBb0IsS0FBcEI7O0FBQ0FILHFCQUFXO0FDREosbUJERU5HLG9CQUFvQixJQ0ZkO0FEQ0ksV0FBWDs7QUFHQUYsNEJBQ0M7QUFBQUcsdUJBQVcvQyxJQUFJZ0QsTUFBZjtBQUNBQyx5QkFBYWpELElBQUlrRCxLQURqQjtBQUVBQyx3QkFBWW5ELElBQUlvRCxJQUZoQjtBQUdBQyxxQkFBU3JELEdBSFQ7QUFJQXNELHNCQUFVckQsR0FKVjtBQUtBc0Qsa0JBQU1aO0FBTE4sV0FERDs7QUFRQXZGLFlBQUU2RSxNQUFGLENBQVNXLGVBQVQsRUFBMEJKLFFBQTFCOztBQUdBSyx5QkFBZSxJQUFmOztBQUNBO0FBQ0NBLDJCQUFlaEIsS0FBSzJCLGFBQUwsQ0FBbUJaLGVBQW5CLEVBQW9DSixRQUFwQyxDQUFmO0FBREQsbUJBQUFpQixNQUFBO0FBRU1qRixvQkFBQWlGLE1BQUE7QUFFTDNELDBDQUE4QnRCLEtBQTlCLEVBQXFDd0IsR0FBckMsRUFBMENDLEdBQTFDO0FBQ0E7QUNISzs7QURLTixjQUFHNkMsaUJBQUg7QUFFQzdDLGdCQUFJYyxHQUFKO0FBQ0E7QUFIRDtBQUtDLGdCQUFHZCxJQUFJTyxXQUFQO0FBQ0Msb0JBQU0sSUFBSWpELEtBQUosQ0FBVSxzRUFBb0V1RCxNQUFwRSxHQUEyRSxHQUEzRSxHQUE4RWEsUUFBeEYsQ0FBTjtBQURELG1CQUVLLElBQUdrQixpQkFBZ0IsSUFBaEIsSUFBd0JBLGlCQUFnQixNQUEzQztBQUNKLG9CQUFNLElBQUl0RixLQUFKLENBQVUsdURBQXFEdUQsTUFBckQsR0FBNEQsR0FBNUQsR0FBK0RhLFFBQXpFLENBQU47QUFSRjtBQ0tNOztBRE1OLGNBQUdrQixhQUFhTyxJQUFiLEtBQXVCUCxhQUFhM0MsVUFBYixJQUEyQjJDLGFBQWFhLE9BQS9ELENBQUg7QUNKTyxtQkRLTjdCLEtBQUs4QixRQUFMLENBQWMxRCxHQUFkLEVBQW1CNEMsYUFBYU8sSUFBaEMsRUFBc0NQLGFBQWEzQyxVQUFuRCxFQUErRDJDLGFBQWFhLE9BQTVFLENDTE07QURJUDtBQ0ZPLG1CREtON0IsS0FBSzhCLFFBQUwsQ0FBYzFELEdBQWQsRUFBbUI0QyxZQUFuQixDQ0xNO0FBQ0Q7QURuQ1AsVUNGSTtBREFMOztBQ3dDRyxhREdIekYsRUFBRTRCLElBQUYsQ0FBTzRDLGVBQVAsRUFBd0IsVUFBQ2QsTUFBRDtBQ0ZuQixlREdKMkIsV0FBV0MsR0FBWCxDQUFlNUIsTUFBZixFQUF1QmEsUUFBdkIsRUFBaUMsVUFBQzNCLEdBQUQsRUFBTUMsR0FBTjtBQUNoQyxjQUFBeUQsT0FBQSxFQUFBYixZQUFBO0FBQUFBLHlCQUFlO0FBQUExQyxvQkFBUSxPQUFSO0FBQWlCeUQscUJBQVM7QUFBMUIsV0FBZjtBQUNBRixvQkFBVTtBQUFBLHFCQUFTaEMsZUFBZW1DLElBQWYsQ0FBb0IsSUFBcEIsRUFBMEJDLFdBQTFCO0FBQVQsV0FBVjtBQ0lLLGlCREhMakMsS0FBSzhCLFFBQUwsQ0FBYzFELEdBQWQsRUFBbUI0QyxZQUFuQixFQUFpQyxHQUFqQyxFQUFzQ2EsT0FBdEMsQ0NHSztBRE5OLFVDSEk7QURFTCxRQ0hHO0FEakVHLEtBQVA7QUFIWSxLQ0daLENEWlUsQ0F1Rlg7Ozs7Ozs7QUNjQ3pDLFFBQU1NLFNBQU4sQ0RSRFksaUJDUUMsR0RSa0I7QUFDbEIvRSxNQUFFNEIsSUFBRixDQUFPLEtBQUNzQyxTQUFSLEVBQW1CLFVBQUNrQixRQUFELEVBQVcxQixNQUFYLEVBQW1CUSxTQUFuQjtBQUNsQixVQUFHbEUsRUFBRTJHLFVBQUYsQ0FBYXZCLFFBQWIsQ0FBSDtBQ1NLLGVEUkpsQixVQUFVUixNQUFWLElBQW9CO0FBQUNrRCxrQkFBUXhCO0FBQVQsU0NRaEI7QUFHRDtBRGJMO0FBRGtCLEdDUWxCLENEckdVLENBb0dYOzs7Ozs7Ozs7Ozs7Ozs7O0FDNEJDdkIsUUFBTU0sU0FBTixDRGJEYSxtQkNhQyxHRGJvQjtBQUNwQmhGLE1BQUU0QixJQUFGLENBQU8sS0FBQ3NDLFNBQVIsRUFBbUIsVUFBQ2tCLFFBQUQsRUFBVzFCLE1BQVg7QUFDbEIsVUFBQS9DLEdBQUEsRUFBQWtHLElBQUEsRUFBQUMsSUFBQTs7QUFBQSxVQUFHcEQsV0FBWSxTQUFmO0FBRUMsWUFBRyxHQUFBL0MsTUFBQSxLQUFBcUQsT0FBQSxZQUFBckQsSUFBY29HLFlBQWQsR0FBYyxNQUFkLENBQUg7QUFDQyxlQUFDL0MsT0FBRCxDQUFTK0MsWUFBVCxHQUF3QixFQUF4QjtBQ2NJOztBRGJMLFlBQUcsQ0FBSTNCLFNBQVMyQixZQUFoQjtBQUNDM0IsbUJBQVMyQixZQUFULEdBQXdCLEVBQXhCO0FDZUk7O0FEZEwzQixpQkFBUzJCLFlBQVQsR0FBd0IvRyxFQUFFZ0gsS0FBRixDQUFRNUIsU0FBUzJCLFlBQWpCLEVBQStCLEtBQUMvQyxPQUFELENBQVMrQyxZQUF4QyxDQUF4Qjs7QUFFQSxZQUFHL0csRUFBRWlILE9BQUYsQ0FBVTdCLFNBQVMyQixZQUFuQixDQUFIO0FBQ0MzQixtQkFBUzJCLFlBQVQsR0FBd0IsS0FBeEI7QUNlSTs7QURaTCxZQUFHM0IsU0FBUzhCLFlBQVQsS0FBeUIsTUFBNUI7QUFDQyxnQkFBQUwsT0FBQSxLQUFBN0MsT0FBQSxZQUFBNkMsS0FBYUssWUFBYixHQUFhLE1BQWIsS0FBNkI5QixTQUFTMkIsWUFBdEM7QUFDQzNCLHFCQUFTOEIsWUFBVCxHQUF3QixJQUF4QjtBQUREO0FBR0M5QixxQkFBUzhCLFlBQVQsR0FBd0IsS0FBeEI7QUFKRjtBQ21CSzs7QURiTCxhQUFBSixPQUFBLEtBQUE5QyxPQUFBLFlBQUE4QyxLQUFhSyxhQUFiLEdBQWEsTUFBYjtBQUNDL0IsbUJBQVMrQixhQUFULEdBQXlCLEtBQUNuRCxPQUFELENBQVNtRCxhQUFsQztBQW5CRjtBQ21DSTtBRHBDTCxPQXNCRSxJQXRCRjtBQURvQixHQ2FwQixDRGhJVSxDQThJWDs7Ozs7O0FDcUJDdEQsUUFBTU0sU0FBTixDRGhCRGlDLGFDZ0JDLEdEaEJjLFVBQUNaLGVBQUQsRUFBa0JKLFFBQWxCO0FBRWQsUUFBQWdDLFVBQUE7O0FBQUEsUUFBRyxLQUFDQyxhQUFELENBQWU3QixlQUFmLEVBQWdDSixRQUFoQyxDQUFIO0FBQ0MsVUFBRyxLQUFDa0MsYUFBRCxDQUFlOUIsZUFBZixFQUFnQ0osUUFBaEMsQ0FBSDtBQUNDLFlBQUcsS0FBQ21DLGNBQUQsQ0FBZ0IvQixlQUFoQixFQUFpQ0osUUFBakMsQ0FBSDtBQUVDZ0MsdUJBQWEsSUFBSUksVUFBVUMsZ0JBQWQsQ0FDWjtBQUFBQywwQkFBYyxJQUFkO0FBQ0FyRixvQkFBUW1ELGdCQUFnQm5ELE1BRHhCO0FBRUFzRix3QkFBWSxJQUZaO0FBR0FDLHdCQUFZSixVQUFVSyxXQUFWO0FBSFosV0FEWSxDQUFiO0FBTUEsaUJBQU9DLElBQUlDLGtCQUFKLENBQXVCQyxTQUF2QixDQUFpQ1osVUFBakMsRUFBNkM7QUFDbkQsbUJBQU9oQyxTQUFTd0IsTUFBVCxDQUFnQnFCLElBQWhCLENBQXFCekMsZUFBckIsQ0FBUDtBQURNLFlBQVA7QUFSRDtBQzJCTSxpQkRoQkw7QUFBQTFDLHdCQUFZLEdBQVo7QUFDQWtELGtCQUFNO0FBQUNqRCxzQkFBUSxPQUFUO0FBQWtCeUQsdUJBQVM7QUFBM0I7QUFETixXQ2dCSztBRDVCUDtBQUFBO0FDcUNLLGVEdEJKO0FBQUExRCxzQkFBWSxHQUFaO0FBQ0FrRCxnQkFBTTtBQUFDakQsb0JBQVEsT0FBVDtBQUFrQnlELHFCQUFTO0FBQTNCO0FBRE4sU0NzQkk7QUR0Q047QUFBQTtBQytDSSxhRDVCSDtBQUFBMUQsb0JBQVksR0FBWjtBQUNBa0QsY0FBTTtBQUFDakQsa0JBQVEsT0FBVDtBQUFrQnlELG1CQUFTO0FBQTNCO0FBRE4sT0M0Qkc7QUFPRDtBRHhEVyxHQ2dCZCxDRG5LVSxDQTRLWDs7Ozs7Ozs7OztBQzZDQzNDLFFBQU1NLFNBQU4sQ0RwQ0RrRCxhQ29DQyxHRHBDYyxVQUFDN0IsZUFBRCxFQUFrQkosUUFBbEI7QUFDZCxRQUFHQSxTQUFTOEIsWUFBWjtBQ3FDSSxhRHBDSCxLQUFDZ0IsYUFBRCxDQUFlMUMsZUFBZixDQ29DRztBRHJDSjtBQ3VDSSxhRHJDQyxJQ3FDRDtBQUNEO0FEekNXLEdDb0NkLENEek5VLENBMkxYOzs7Ozs7OztBQytDQzNCLFFBQU1NLFNBQU4sQ0R4Q0QrRCxhQ3dDQyxHRHhDYyxVQUFDMUMsZUFBRDtBQUVkLFFBQUEyQyxJQUFBLEVBQUFDLFlBQUE7QUFBQUQsV0FBTyxLQUFDckUsR0FBRCxDQUFLYSxPQUFMLENBQWF3RCxJQUFiLENBQWtCMUksSUFBbEIsQ0FBdUJ3SSxJQUF2QixDQUE0QnpDLGVBQTVCLENBQVA7O0FBR0EsU0FBQTJDLFFBQUEsT0FBR0EsS0FBTTlGLE1BQVQsR0FBUyxNQUFULE1BQUc4RixRQUFBLE9BQWlCQSxLQUFNL0YsS0FBdkIsR0FBdUIsTUFBMUIsS0FBb0MsRUFBQStGLFFBQUEsT0FBSUEsS0FBTTFJLElBQVYsR0FBVSxNQUFWLENBQXBDO0FBQ0MySSxxQkFBZSxFQUFmO0FBQ0FBLG1CQUFhNUcsR0FBYixHQUFtQjJHLEtBQUs5RixNQUF4QjtBQUNBK0YsbUJBQWEsS0FBQ3RFLEdBQUQsQ0FBS2EsT0FBTCxDQUFhd0QsSUFBYixDQUFrQi9GLEtBQS9CLElBQXdDK0YsS0FBSy9GLEtBQTdDO0FBQ0ErRixXQUFLMUksSUFBTCxHQUFZcUIsT0FBT0MsS0FBUCxDQUFhQyxPQUFiLENBQXFCb0gsWUFBckIsQ0FBWjtBQ3VDRTs7QURwQ0gsUUFBQUQsUUFBQSxPQUFHQSxLQUFNMUksSUFBVCxHQUFTLE1BQVQ7QUFDQytGLHNCQUFnQi9GLElBQWhCLEdBQXVCMEksS0FBSzFJLElBQTVCO0FBQ0ErRixzQkFBZ0JuRCxNQUFoQixHQUF5QjhGLEtBQUsxSSxJQUFMLENBQVUrQixHQUFuQztBQ3NDRyxhRHJDSCxJQ3FDRztBRHhDSjtBQzBDSSxhRHRDQyxLQ3NDRDtBQUNEO0FEdkRXLEdDd0NkLENEMU9VLENBb05YOzs7Ozs7Ozs7QUNrRENxQyxRQUFNTSxTQUFOLENEMUNEb0QsY0MwQ0MsR0QxQ2UsVUFBQy9CLGVBQUQsRUFBa0JKLFFBQWxCO0FBQ2YsUUFBQStDLElBQUEsRUFBQXJHLEtBQUEsRUFBQXVHLGlCQUFBOztBQUFBLFFBQUdqRCxTQUFTK0IsYUFBWjtBQUNDZ0IsYUFBTyxLQUFDckUsR0FBRCxDQUFLYSxPQUFMLENBQWF3RCxJQUFiLENBQWtCMUksSUFBbEIsQ0FBdUJ3SSxJQUF2QixDQUE0QnpDLGVBQTVCLENBQVA7O0FBQ0EsVUFBQTJDLFFBQUEsT0FBR0EsS0FBTUcsT0FBVCxHQUFTLE1BQVQ7QUFDQ0QsNEJBQW9CNUcsR0FBR2IsV0FBSCxDQUFlYyxJQUFmLENBQW9CO0FBQUNqQyxnQkFBTTBJLEtBQUs5RixNQUFaO0FBQW9CUCxpQkFBTXFHLEtBQUtHO0FBQS9CLFNBQXBCLEVBQTZEQyxLQUE3RCxFQUFwQjs7QUFDQSxZQUFHRixpQkFBSDtBQUNDdkcsa0JBQVFMLEdBQUdaLE1BQUgsQ0FBVUcsT0FBVixDQUFrQm1ILEtBQUtHLE9BQXZCLENBQVI7O0FBRUEsZUFBQXhHLFNBQUEsT0FBR0EsTUFBT0MsT0FBVixHQUFVLE1BQVYsS0FBc0IvQixFQUFFZ0MsT0FBRixDQUFVRixNQUFNRyxNQUFoQixFQUF3QmtHLEtBQUs5RixNQUE3QixLQUFzQyxDQUE1RDtBQUNDbUQsNEJBQWdCOEMsT0FBaEIsR0FBMEJILEtBQUtHLE9BQS9CO0FBQ0EsbUJBQU8sSUFBUDtBQUxGO0FBRkQ7QUN1REk7O0FEL0NKOUMsc0JBQWdCOEMsT0FBaEIsR0FBMEIsS0FBMUI7QUFDQSxhQUFPLEtBQVA7QUNpREU7O0FEaERILFdBQU8sSUFBUDtBQWJlLEdDMENmLENEdFFVLENBMk9YOzs7Ozs7Ozs7QUM0REN6RSxRQUFNTSxTQUFOLENEcEREbUQsYUNvREMsR0RwRGMsVUFBQzlCLGVBQUQsRUFBa0JKLFFBQWxCO0FBQ2QsUUFBR0EsU0FBUzJCLFlBQVo7QUFDQyxVQUFHL0csRUFBRWlILE9BQUYsQ0FBVWpILEVBQUV3SSxZQUFGLENBQWVwRCxTQUFTMkIsWUFBeEIsRUFBc0N2QixnQkFBZ0IvRixJQUFoQixDQUFxQmdKLEtBQTNELENBQVYsQ0FBSDtBQUNDLGVBQU8sS0FBUDtBQUZGO0FDd0RHOztBQUNELFdEdERGLElDc0RFO0FEMURZLEdDb0RkLENEdlNVLENBMFBYOzs7O0FDMkRDNUUsUUFBTU0sU0FBTixDRHhERG9DLFFDd0RDLEdEeERTLFVBQUNMLFFBQUQsRUFBV0YsSUFBWCxFQUFpQmxELFVBQWpCLEVBQWlDd0QsT0FBakM7QUFHVCxRQUFBb0MsY0FBQSxFQUFBQyxtQkFBQSxFQUFBQywwQkFBQSxFQUFBQyxnQ0FBQSxFQUFBQyxZQUFBOztBQ3VERSxRQUFJaEcsY0FBYyxJQUFsQixFQUF3QjtBRDFEQUEsbUJBQVcsR0FBWDtBQzREdkI7O0FBQ0QsUUFBSXdELFdBQVcsSUFBZixFQUFxQjtBRDdEbUJBLGdCQUFRLEVBQVI7QUMrRHZDOztBRDVESG9DLHFCQUFpQixLQUFDSyxjQUFELENBQWdCLEtBQUNqRixHQUFELENBQUthLE9BQUwsQ0FBYStELGNBQTdCLENBQWpCO0FBQ0FwQyxjQUFVLEtBQUN5QyxjQUFELENBQWdCekMsT0FBaEIsQ0FBVjtBQUNBQSxjQUFVdEcsRUFBRTZFLE1BQUYsQ0FBUzZELGNBQVQsRUFBeUJwQyxPQUF6QixDQUFWOztBQUdBLFFBQUdBLFFBQVEsY0FBUixFQUF3QjBDLEtBQXhCLENBQThCLGlCQUE5QixNQUFzRCxJQUF6RDtBQUNDLFVBQUcsS0FBQ2xGLEdBQUQsQ0FBS2EsT0FBTCxDQUFhc0UsVUFBaEI7QUFDQ2pELGVBQU9rRCxLQUFLQyxTQUFMLENBQWVuRCxJQUFmLEVBQXFCLE1BQXJCLEVBQWdDLENBQWhDLENBQVA7QUFERDtBQUdDQSxlQUFPa0QsS0FBS0MsU0FBTCxDQUFlbkQsSUFBZixDQUFQO0FBSkY7QUNpRUc7O0FEMURIOEMsbUJBQWU7QUFDZDVDLGVBQVNrRCxTQUFULENBQW1CdEcsVUFBbkIsRUFBK0J3RCxPQUEvQjtBQUNBSixlQUFTbUQsS0FBVCxDQUFlckQsSUFBZjtBQzRERyxhRDNESEUsU0FBU3ZDLEdBQVQsRUMyREc7QUQ5RFcsS0FBZjs7QUFJQSxRQUFHYixlQUFlLEdBQWYsSUFBQUEsZUFBb0IsR0FBdkI7QUFPQzhGLG1DQUE2QixHQUE3QjtBQUNBQyx5Q0FBbUMsSUFBSVMsS0FBS0MsTUFBTCxFQUF2QztBQUNBWiw0QkFBc0JDLDZCQUE2QkMsZ0NBQW5EO0FDdURHLGFEdERIL0gsT0FBTzBJLFVBQVAsQ0FBa0JWLFlBQWxCLEVBQWdDSCxtQkFBaEMsQ0NzREc7QURoRUo7QUNrRUksYUR0REhHLGNDc0RHO0FBQ0Q7QUR0Rk0sR0N3RFQsQ0RyVFUsQ0E4Ulg7Ozs7QUM2RENqRixRQUFNTSxTQUFOLENEMURENEUsY0MwREMsR0QxRGUsVUFBQ1UsTUFBRDtBQzJEYixXRDFERnpKLEVBQUUwSixLQUFGLENBQVFELE1BQVIsRUFDQ0UsS0FERCxHQUVDQyxHQUZELENBRUssVUFBQ0MsSUFBRDtBQ3lERCxhRHhESCxDQUFDQSxLQUFLLENBQUwsRUFBUUMsV0FBUixFQUFELEVBQXdCRCxLQUFLLENBQUwsQ0FBeEIsQ0N3REc7QUQzREosT0FJQ0osTUFKRCxHQUtDTSxLQUxELEVDMERFO0FEM0RhLEdDMERmOztBQU1BLFNBQU9sRyxLQUFQO0FBRUQsQ0RuV1csRUFBTixDOzs7Ozs7Ozs7Ozs7QUVBTixJQUFBbUcsT0FBQTtBQUFBLElBQUFDLGFBQUE7QUFBQSxJQUFBQyxTQUFBO0FBQUEsSUFBQWxJLFVBQUEsR0FBQUEsT0FBQSxjQUFBbUksSUFBQTtBQUFBLFdBQUFDLElBQUEsR0FBQUMsSUFBQSxLQUFBbkssTUFBQSxFQUFBa0ssSUFBQUMsQ0FBQSxFQUFBRCxHQUFBO0FBQUEsUUFBQUEsS0FBQSxhQUFBQSxDQUFBLE1BQUFELElBQUEsU0FBQUMsQ0FBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUFGLFlBQVloTCxRQUFRLFlBQVIsQ0FBWjtBQUNBOEssVUFBVTlLLFFBQVEsU0FBUixDQUFWOztBQUVNLEtBQUMrSyxhQUFELEdBQUM7QUFFTyxXQUFBQSxhQUFBLENBQUNqRyxPQUFEO0FBQ1osUUFBQXNHLFdBQUE7QUFBQSxTQUFDQyxPQUFELEdBQVcsRUFBWDtBQUNBLFNBQUM1RixPQUFELEdBQ0M7QUFBQUMsYUFBTyxFQUFQO0FBQ0E0RixzQkFBZ0IsS0FEaEI7QUFFQXJGLGVBQVMsTUFGVDtBQUdBc0YsZUFBUyxJQUhUO0FBSUF4QixrQkFBWSxLQUpaO0FBS0FkLFlBQ0M7QUFBQS9GLGVBQU8seUNBQVA7QUFDQTNDLGNBQU07QUFDTCxjQUFBaUwsS0FBQSxFQUFBcEssU0FBQSxFQUFBbkIsT0FBQSxFQUFBbUosT0FBQSxFQUFBbEcsS0FBQSxFQUFBQyxNQUFBOztBQUFBbEQsb0JBQVUsSUFBSTZLLE9BQUosQ0FBYSxLQUFDL0QsT0FBZCxFQUF1QixLQUFDQyxRQUF4QixDQUFWO0FBQ0E3RCxtQkFBUyxLQUFDNEQsT0FBRCxDQUFTSyxPQUFULENBQWlCLFdBQWpCLEtBQWlDbkgsUUFBUXdMLEdBQVIsQ0FBWSxXQUFaLENBQTFDO0FBQ0FySyxzQkFBWSxLQUFDMkYsT0FBRCxDQUFTSyxPQUFULENBQWlCLGNBQWpCLEtBQW9DbkgsUUFBUXdMLEdBQVIsQ0FBWSxjQUFaLENBQWhEO0FBQ0FyQyxvQkFBVSxLQUFDckMsT0FBRCxDQUFTSyxPQUFULENBQWlCLFlBQWpCLEtBQWtDLEtBQUNYLFNBQUQsQ0FBVyxTQUFYLENBQTVDOztBQUNBLGNBQUdyRixTQUFIO0FBQ0M4QixvQkFBUWxCLFNBQVMwSixlQUFULENBQXlCdEssU0FBekIsQ0FBUjtBQ01LOztBRExOLGNBQUcsS0FBQzJGLE9BQUQsQ0FBUzVELE1BQVo7QUFDQ3FJLG9CQUFRakosR0FBR1YsS0FBSCxDQUFTQyxPQUFULENBQWlCO0FBQUNRLG1CQUFLLEtBQUN5RSxPQUFELENBQVM1RDtBQUFmLGFBQWpCLENBQVI7QUNTTSxtQkRSTjtBQUFBNUMsb0JBQU1pTCxLQUFOO0FBQ0FySSxzQkFBUUEsTUFEUjtBQUVBaUcsdUJBQVNBLE9BRlQ7QUFHQWxHLHFCQUFPQTtBQUhQLGFDUU07QURWUDtBQ2lCTyxtQkRWTjtBQUFBQyxzQkFBUUEsTUFBUjtBQUNBaUcsdUJBQVNBLE9BRFQ7QUFFQWxHLHFCQUFPQTtBQUZQLGFDVU07QUFLRDtBRDlCUDtBQUFBLE9BTkQ7QUF3QkFzRyxzQkFDQztBQUFBLHdCQUFnQjtBQUFoQixPQXpCRDtBQTBCQW1DLGtCQUFZO0FBMUJaLEtBREQ7O0FBOEJBN0ssTUFBRTZFLE1BQUYsQ0FBUyxLQUFDRixPQUFWLEVBQW1CWCxPQUFuQjs7QUFFQSxRQUFHLEtBQUNXLE9BQUQsQ0FBU2tHLFVBQVo7QUFDQ1Asb0JBQ0M7QUFBQSx1Q0FBK0IsR0FBL0I7QUFDQSx3Q0FBZ0M7QUFEaEMsT0FERDs7QUFJQSxVQUFHLEtBQUMzRixPQUFELENBQVM2RixjQUFaO0FBQ0NGLG9CQUFZLDhCQUFaLEtBQStDLHVDQUEvQztBQ2VHOztBRFpKdEssUUFBRTZFLE1BQUYsQ0FBUyxLQUFDRixPQUFELENBQVMrRCxjQUFsQixFQUFrQzRCLFdBQWxDOztBQUVBLFVBQUcsQ0FBSSxLQUFDM0YsT0FBRCxDQUFTRyxzQkFBaEI7QUFDQyxhQUFDSCxPQUFELENBQVNHLHNCQUFULEdBQWtDO0FBQ2pDLGVBQUNvQixRQUFELENBQVVrRCxTQUFWLENBQW9CLEdBQXBCLEVBQXlCa0IsV0FBekI7QUNhSyxpQkRaTCxLQUFDbkUsSUFBRCxFQ1lLO0FEZDRCLFNBQWxDO0FBWkY7QUM2Qkc7O0FEWkgsUUFBRyxLQUFDeEIsT0FBRCxDQUFTUSxPQUFULENBQWlCLENBQWpCLE1BQXVCLEdBQTFCO0FBQ0MsV0FBQ1IsT0FBRCxDQUFTUSxPQUFULEdBQW1CLEtBQUNSLE9BQUQsQ0FBU1EsT0FBVCxDQUFpQjJGLEtBQWpCLENBQXVCLENBQXZCLENBQW5CO0FDY0U7O0FEYkgsUUFBRzlLLEVBQUUrSyxJQUFGLENBQU8sS0FBQ3BHLE9BQUQsQ0FBU1EsT0FBaEIsTUFBOEIsR0FBakM7QUFDQyxXQUFDUixPQUFELENBQVNRLE9BQVQsR0FBbUIsS0FBQ1IsT0FBRCxDQUFTUSxPQUFULEdBQW1CLEdBQXRDO0FDZUU7O0FEWEgsUUFBRyxLQUFDUixPQUFELENBQVM4RixPQUFaO0FBQ0MsV0FBQzlGLE9BQUQsQ0FBU1EsT0FBVCxJQUFvQixLQUFDUixPQUFELENBQVM4RixPQUFULEdBQW1CLEdBQXZDO0FDYUU7O0FEVkgsUUFBRyxLQUFDOUYsT0FBRCxDQUFTNkYsY0FBWjtBQUNDLFdBQUNRLFNBQUQ7QUFERCxXQUVLLElBQUcsS0FBQ3JHLE9BQUQsQ0FBU3NHLE9BQVo7QUFDSixXQUFDRCxTQUFEOztBQUNBN0gsY0FBUStILElBQVIsQ0FBYSx5RUFDWCw2Q0FERjtBQ1lFOztBRFRILFdBQU8sSUFBUDtBQXJFWSxHQUZQLENBMEVOOzs7Ozs7Ozs7Ozs7O0FDd0JDakIsZ0JBQWM5RixTQUFkLENEWkRnSCxRQ1lDLEdEWlMsVUFBQ3BILElBQUQsRUFBT0MsT0FBUCxFQUFnQkUsU0FBaEI7QUFFVCxRQUFBa0gsS0FBQTtBQUFBQSxZQUFRLElBQUl4SCxNQUFNQyxLQUFWLENBQWdCLElBQWhCLEVBQXNCRSxJQUF0QixFQUE0QkMsT0FBNUIsRUFBcUNFLFNBQXJDLENBQVI7O0FBQ0EsU0FBQ3FHLE9BQUQsQ0FBU3JJLElBQVQsQ0FBY2tKLEtBQWQ7O0FBRUFBLFVBQU1oSCxRQUFOO0FBRUEsV0FBTyxJQUFQO0FBUFMsR0NZVCxDRGxHSyxDQWdHTjs7OztBQ2VDNkYsZ0JBQWM5RixTQUFkLENEWkRrSCxhQ1lDLEdEWmMsVUFBQ0MsVUFBRCxFQUFhdEgsT0FBYjtBQUNkLFFBQUF1SCxtQkFBQSxFQUFBQyx3QkFBQSxFQUFBQyw4QkFBQSxFQUFBQyxvQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxPQUFBLEVBQUFDLG1CQUFBLEVBQUE5SCxJQUFBLEVBQUErSCxZQUFBOztBQ2FFLFFBQUk5SCxXQUFXLElBQWYsRUFBcUI7QURkSUEsZ0JBQVEsRUFBUjtBQ2dCeEI7O0FEZkg0SCxjQUFVLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsS0FBaEIsRUFBdUIsUUFBdkIsRUFBaUMsUUFBakMsQ0FBVjtBQUNBQywwQkFBc0IsQ0FBQyxNQUFELEVBQVMsUUFBVCxDQUF0Qjs7QUFHQSxRQUFHUCxlQUFjeEssT0FBT0MsS0FBeEI7QUFDQ3dLLDRCQUFzQixLQUFDUSx3QkFBdkI7QUFERDtBQUdDUiw0QkFBc0IsS0FBQ1Msb0JBQXZCO0FDZUU7O0FEWkhQLHFDQUFpQ3pILFFBQVFFLFNBQVIsSUFBcUIsRUFBdEQ7QUFDQTRILG1CQUFlOUgsUUFBUThILFlBQVIsSUFBd0IsRUFBdkM7QUFDQUgsd0JBQW9CM0gsUUFBUTJILGlCQUFSLElBQTZCLEVBQWpEO0FBRUE1SCxXQUFPQyxRQUFRRCxJQUFSLElBQWdCdUgsV0FBV1csS0FBbEM7QUFJQVQsK0JBQTJCLEVBQTNCO0FBQ0FFLDJCQUF1QixFQUF2Qjs7QUFDQSxRQUFHMUwsRUFBRWlILE9BQUYsQ0FBVXdFLDhCQUFWLEtBQThDekwsRUFBRWlILE9BQUYsQ0FBVTBFLGlCQUFWLENBQWpEO0FBRUMzTCxRQUFFNEIsSUFBRixDQUFPZ0ssT0FBUCxFQUFnQixVQUFDbEksTUFBRDtBQUVmLFlBQUcxQixRQUFBaUcsSUFBQSxDQUFVNEQsbUJBQVYsRUFBQW5JLE1BQUEsTUFBSDtBQUNDMUQsWUFBRTZFLE1BQUYsQ0FBUzJHLHdCQUFULEVBQW1DRCxvQkFBb0I3SCxNQUFwQixFQUE0QnVFLElBQTVCLENBQWlDLElBQWpDLEVBQXVDcUQsVUFBdkMsQ0FBbkM7QUFERDtBQUVLdEwsWUFBRTZFLE1BQUYsQ0FBUzZHLG9CQUFULEVBQStCSCxvQkFBb0I3SCxNQUFwQixFQUE0QnVFLElBQTVCLENBQWlDLElBQWpDLEVBQXVDcUQsVUFBdkMsQ0FBL0I7QUNTQTtBRGJOLFNBTUUsSUFORjtBQUZEO0FBV0N0TCxRQUFFNEIsSUFBRixDQUFPZ0ssT0FBUCxFQUFnQixVQUFDbEksTUFBRDtBQUNmLFlBQUF3SSxrQkFBQSxFQUFBQyxlQUFBOztBQUFBLFlBQUduSyxRQUFBaUcsSUFBQSxDQUFjMEQsaUJBQWQsRUFBQWpJLE1BQUEsU0FBb0MrSCwrQkFBK0IvSCxNQUEvQixNQUE0QyxLQUFuRjtBQUdDeUksNEJBQWtCViwrQkFBK0IvSCxNQUEvQixDQUFsQjtBQUNBd0ksK0JBQXFCLEVBQXJCOztBQUNBbE0sWUFBRTRCLElBQUYsQ0FBTzJKLG9CQUFvQjdILE1BQXBCLEVBQTRCdUUsSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUNxRCxVQUF2QyxDQUFQLEVBQTJELFVBQUMxRSxNQUFELEVBQVN3RixVQUFUO0FDT3BELG1CRE5ORixtQkFBbUJFLFVBQW5CLElBQ0NwTSxFQUFFMEosS0FBRixDQUFROUMsTUFBUixFQUNDeUYsS0FERCxHQUVDeEgsTUFGRCxDQUVRc0gsZUFGUixFQUdDcEMsS0FIRCxFQ0tLO0FEUFA7O0FBT0EsY0FBRy9ILFFBQUFpRyxJQUFBLENBQVU0RCxtQkFBVixFQUFBbkksTUFBQSxNQUFIO0FBQ0MxRCxjQUFFNkUsTUFBRixDQUFTMkcsd0JBQVQsRUFBbUNVLGtCQUFuQztBQUREO0FBRUtsTSxjQUFFNkUsTUFBRixDQUFTNkcsb0JBQVQsRUFBK0JRLGtCQUEvQjtBQWROO0FDbUJLO0FEcEJOLFNBaUJFLElBakJGO0FDc0JFOztBREZILFNBQUNmLFFBQUQsQ0FBVXBILElBQVYsRUFBZ0IrSCxZQUFoQixFQUE4Qk4sd0JBQTlCO0FBQ0EsU0FBQ0wsUUFBRCxDQUFhcEgsT0FBSyxNQUFsQixFQUF5QitILFlBQXpCLEVBQXVDSixvQkFBdkM7QUFFQSxXQUFPLElBQVA7QUF2RGMsR0NZZCxDRC9HSyxDQTZKTjs7OztBQ09DekIsZ0JBQWM5RixTQUFkLENESkQ2SCxvQkNJQyxHREhBO0FBQUFyQixTQUFLLFVBQUNXLFVBQUQ7QUNLRCxhREpIO0FBQUFYLGFBQ0M7QUFBQS9ELGtCQUFRO0FBQ1AsZ0JBQUEwRixNQUFBLEVBQUFDLFFBQUE7QUFBQUEsdUJBQVc7QUFBQy9LLG1CQUFLLEtBQUNtRSxTQUFELENBQVdoRztBQUFqQixhQUFYOztBQUNBLGdCQUFHLEtBQUsySSxPQUFSO0FBQ0NpRSx1QkFBU3pLLEtBQVQsR0FBaUIsS0FBS3dHLE9BQXRCO0FDU087O0FEUlJnRSxxQkFBU2hCLFdBQVd0SyxPQUFYLENBQW1CdUwsUUFBbkIsQ0FBVDs7QUFDQSxnQkFBR0QsTUFBSDtBQ1VTLHFCRFRSO0FBQUN2Six3QkFBUSxTQUFUO0FBQW9CeUosc0JBQU1GO0FBQTFCLGVDU1E7QURWVDtBQ2VTLHFCRFpSO0FBQUF4Siw0QkFBWSxHQUFaO0FBQ0FrRCxzQkFBTTtBQUFDakQsMEJBQVEsTUFBVDtBQUFpQnlELDJCQUFTO0FBQTFCO0FBRE4sZUNZUTtBQU9EO0FEM0JUO0FBQUE7QUFERCxPQ0lHO0FETEo7QUFZQWlHLFNBQUssVUFBQ25CLFVBQUQ7QUN1QkQsYUR0Qkg7QUFBQW1CLGFBQ0M7QUFBQTdGLGtCQUFRO0FBQ1AsZ0JBQUEwRixNQUFBLEVBQUFJLGVBQUEsRUFBQUgsUUFBQTtBQUFBQSx1QkFBVztBQUFDL0ssbUJBQUssS0FBQ21FLFNBQUQsQ0FBV2hHO0FBQWpCLGFBQVg7O0FBQ0EsZ0JBQUcsS0FBSzJJLE9BQVI7QUFDQ2lFLHVCQUFTekssS0FBVCxHQUFpQixLQUFLd0csT0FBdEI7QUMyQk87O0FEMUJSb0UsOEJBQWtCcEIsV0FBV3FCLE1BQVgsQ0FBa0JKLFFBQWxCLEVBQTRCO0FBQUFLLG9CQUFNLEtBQUM3RztBQUFQLGFBQTVCLENBQWxCOztBQUNBLGdCQUFHMkcsZUFBSDtBQUNDSix1QkFBU2hCLFdBQVd0SyxPQUFYLENBQW1CLEtBQUMyRSxTQUFELENBQVdoRyxFQUE5QixDQUFUO0FDOEJRLHFCRDdCUjtBQUFDb0Qsd0JBQVEsU0FBVDtBQUFvQnlKLHNCQUFNRjtBQUExQixlQzZCUTtBRC9CVDtBQ29DUyxxQkRoQ1I7QUFBQXhKLDRCQUFZLEdBQVo7QUFDQWtELHNCQUFNO0FBQUNqRCwwQkFBUSxNQUFUO0FBQWlCeUQsMkJBQVM7QUFBMUI7QUFETixlQ2dDUTtBQU9EO0FEaERUO0FBQUE7QUFERCxPQ3NCRztBRG5DSjtBQXlCQSxjQUFRLFVBQUM4RSxVQUFEO0FDMkNKLGFEMUNIO0FBQUEsa0JBQ0M7QUFBQTFFLGtCQUFRO0FBQ1AsZ0JBQUEyRixRQUFBO0FBQUFBLHVCQUFXO0FBQUMvSyxtQkFBSyxLQUFDbUUsU0FBRCxDQUFXaEc7QUFBakIsYUFBWDs7QUFDQSxnQkFBRyxLQUFLMkksT0FBUjtBQUNDaUUsdUJBQVN6SyxLQUFULEdBQWlCLEtBQUt3RyxPQUF0QjtBQytDTzs7QUQ5Q1IsZ0JBQUdnRCxXQUFXdUIsTUFBWCxDQUFrQk4sUUFBbEIsQ0FBSDtBQ2dEUyxxQkQvQ1I7QUFBQ3hKLHdCQUFRLFNBQVQ7QUFBb0J5SixzQkFBTTtBQUFBaEcsMkJBQVM7QUFBVDtBQUExQixlQytDUTtBRGhEVDtBQ3VEUyxxQkRwRFI7QUFBQTFELDRCQUFZLEdBQVo7QUFDQWtELHNCQUFNO0FBQUNqRCwwQkFBUSxNQUFUO0FBQWlCeUQsMkJBQVM7QUFBMUI7QUFETixlQ29EUTtBQU9EO0FEbEVUO0FBQUE7QUFERCxPQzBDRztBRHBFSjtBQW9DQXNHLFVBQU0sVUFBQ3hCLFVBQUQ7QUMrREYsYUQ5REg7QUFBQXdCLGNBQ0M7QUFBQWxHLGtCQUFRO0FBQ1AsZ0JBQUEwRixNQUFBLEVBQUFTLFFBQUE7O0FBQUEsZ0JBQUcsS0FBS3pFLE9BQVI7QUFDQyxtQkFBQ3ZDLFVBQUQsQ0FBWWpFLEtBQVosR0FBb0IsS0FBS3dHLE9BQXpCO0FDaUVPOztBRGhFUnlFLHVCQUFXekIsV0FBVzBCLE1BQVgsQ0FBa0IsS0FBQ2pILFVBQW5CLENBQVg7QUFDQXVHLHFCQUFTaEIsV0FBV3RLLE9BQVgsQ0FBbUIrTCxRQUFuQixDQUFUOztBQUNBLGdCQUFHVCxNQUFIO0FDa0VTLHFCRGpFUjtBQUFBeEosNEJBQVksR0FBWjtBQUNBa0Qsc0JBQU07QUFBQ2pELDBCQUFRLFNBQVQ7QUFBb0J5Six3QkFBTUY7QUFBMUI7QUFETixlQ2lFUTtBRGxFVDtBQzBFUyxxQkR0RVI7QUFBQXhKLDRCQUFZLEdBQVo7QUFDQWtELHNCQUFNO0FBQUNqRCwwQkFBUSxNQUFUO0FBQWlCeUQsMkJBQVM7QUFBMUI7QUFETixlQ3NFUTtBQU9EO0FEdEZUO0FBQUE7QUFERCxPQzhERztBRG5HSjtBQWlEQXlHLFlBQVEsVUFBQzNCLFVBQUQ7QUNpRkosYURoRkg7QUFBQVgsYUFDQztBQUFBL0Qsa0JBQVE7QUFDUCxnQkFBQXNHLFFBQUEsRUFBQVgsUUFBQTtBQUFBQSx1QkFBVyxFQUFYOztBQUNBLGdCQUFHLEtBQUtqRSxPQUFSO0FBQ0NpRSx1QkFBU3pLLEtBQVQsR0FBaUIsS0FBS3dHLE9BQXRCO0FDbUZPOztBRGxGUjRFLHVCQUFXNUIsV0FBVzVKLElBQVgsQ0FBZ0I2SyxRQUFoQixFQUEwQjVLLEtBQTFCLEVBQVg7O0FBQ0EsZ0JBQUd1TCxRQUFIO0FDb0ZTLHFCRG5GUjtBQUFDbkssd0JBQVEsU0FBVDtBQUFvQnlKLHNCQUFNVTtBQUExQixlQ21GUTtBRHBGVDtBQ3lGUyxxQkR0RlI7QUFBQXBLLDRCQUFZLEdBQVo7QUFDQWtELHNCQUFNO0FBQUNqRCwwQkFBUSxNQUFUO0FBQWlCeUQsMkJBQVM7QUFBMUI7QUFETixlQ3NGUTtBQU9EO0FEckdUO0FBQUE7QUFERCxPQ2dGRztBRGxJSjtBQUFBLEdDR0EsQ0RwS0ssQ0FnT047OztBQ3FHQ3lELGdCQUFjOUYsU0FBZCxDRGxHRDRILHdCQ2tHQyxHRGpHQTtBQUFBcEIsU0FBSyxVQUFDVyxVQUFEO0FDbUdELGFEbEdIO0FBQUFYLGFBQ0M7QUFBQS9ELGtCQUFRO0FBQ1AsZ0JBQUEwRixNQUFBO0FBQUFBLHFCQUFTaEIsV0FBV3RLLE9BQVgsQ0FBbUIsS0FBQzJFLFNBQUQsQ0FBV2hHLEVBQTlCLEVBQWtDO0FBQUF3TixzQkFBUTtBQUFBQyx5QkFBUztBQUFUO0FBQVIsYUFBbEMsQ0FBVDs7QUFDQSxnQkFBR2QsTUFBSDtBQ3lHUyxxQkR4R1I7QUFBQ3ZKLHdCQUFRLFNBQVQ7QUFBb0J5SixzQkFBTUY7QUFBMUIsZUN3R1E7QUR6R1Q7QUM4R1MscUJEM0dSO0FBQUF4Siw0QkFBWSxHQUFaO0FBQ0FrRCxzQkFBTTtBQUFDakQsMEJBQVEsTUFBVDtBQUFpQnlELDJCQUFTO0FBQTFCO0FBRE4sZUMyR1E7QUFPRDtBRHZIVDtBQUFBO0FBREQsT0NrR0c7QURuR0o7QUFTQWlHLFNBQUssVUFBQ25CLFVBQUQ7QUNzSEQsYURySEg7QUFBQW1CLGFBQ0M7QUFBQTdGLGtCQUFRO0FBQ1AsZ0JBQUEwRixNQUFBLEVBQUFJLGVBQUE7QUFBQUEsOEJBQWtCcEIsV0FBV3FCLE1BQVgsQ0FBa0IsS0FBQ2hILFNBQUQsQ0FBV2hHLEVBQTdCLEVBQWlDO0FBQUFpTixvQkFBTTtBQUFBUSx5QkFBUyxLQUFDckg7QUFBVjtBQUFOLGFBQWpDLENBQWxCOztBQUNBLGdCQUFHMkcsZUFBSDtBQUNDSix1QkFBU2hCLFdBQVd0SyxPQUFYLENBQW1CLEtBQUMyRSxTQUFELENBQVdoRyxFQUE5QixFQUFrQztBQUFBd04sd0JBQVE7QUFBQUMsMkJBQVM7QUFBVDtBQUFSLGVBQWxDLENBQVQ7QUNnSVEscUJEL0hSO0FBQUNySyx3QkFBUSxTQUFUO0FBQW9CeUosc0JBQU1GO0FBQTFCLGVDK0hRO0FEaklUO0FDc0lTLHFCRGxJUjtBQUFBeEosNEJBQVksR0FBWjtBQUNBa0Qsc0JBQU07QUFBQ2pELDBCQUFRLE1BQVQ7QUFBaUJ5RCwyQkFBUztBQUExQjtBQUROLGVDa0lRO0FBT0Q7QUQvSVQ7QUFBQTtBQURELE9DcUhHO0FEL0hKO0FBbUJBLGNBQVEsVUFBQzhFLFVBQUQ7QUM2SUosYUQ1SUg7QUFBQSxrQkFDQztBQUFBMUUsa0JBQVE7QUFDUCxnQkFBRzBFLFdBQVd1QixNQUFYLENBQWtCLEtBQUNsSCxTQUFELENBQVdoRyxFQUE3QixDQUFIO0FDOElTLHFCRDdJUjtBQUFDb0Qsd0JBQVEsU0FBVDtBQUFvQnlKLHNCQUFNO0FBQUFoRywyQkFBUztBQUFUO0FBQTFCLGVDNklRO0FEOUlUO0FDcUpTLHFCRGxKUjtBQUFBMUQsNEJBQVksR0FBWjtBQUNBa0Qsc0JBQU07QUFBQ2pELDBCQUFRLE1BQVQ7QUFBaUJ5RCwyQkFBUztBQUExQjtBQUROLGVDa0pRO0FBT0Q7QUQ3SlQ7QUFBQTtBQURELE9DNElHO0FEaEtKO0FBMkJBc0csVUFBTSxVQUFDeEIsVUFBRDtBQzZKRixhRDVKSDtBQUFBd0IsY0FDQztBQUFBbEcsa0JBQVE7QUFFUCxnQkFBQTBGLE1BQUEsRUFBQVMsUUFBQTtBQUFBQSx1QkFBVzdMLFNBQVNtTSxVQUFULENBQW9CLEtBQUN0SCxVQUFyQixDQUFYO0FBQ0F1RyxxQkFBU2hCLFdBQVd0SyxPQUFYLENBQW1CK0wsUUFBbkIsRUFBNkI7QUFBQUksc0JBQVE7QUFBQUMseUJBQVM7QUFBVDtBQUFSLGFBQTdCLENBQVQ7O0FBQ0EsZ0JBQUdkLE1BQUg7QUNrS1MscUJEaktSO0FBQUF4Siw0QkFBWSxHQUFaO0FBQ0FrRCxzQkFBTTtBQUFDakQsMEJBQVEsU0FBVDtBQUFvQnlKLHdCQUFNRjtBQUExQjtBQUROLGVDaUtRO0FEbEtUO0FBSUM7QUFBQXhKLDRCQUFZO0FBQVo7QUN5S1EscUJEeEtSO0FBQUNDLHdCQUFRLE1BQVQ7QUFBaUJ5RCx5QkFBUztBQUExQixlQ3dLUTtBQUlEO0FEckxUO0FBQUE7QUFERCxPQzRKRztBRHhMSjtBQXVDQXlHLFlBQVEsVUFBQzNCLFVBQUQ7QUNpTEosYURoTEg7QUFBQVgsYUFDQztBQUFBL0Qsa0JBQVE7QUFDUCxnQkFBQXNHLFFBQUE7QUFBQUEsdUJBQVc1QixXQUFXNUosSUFBWCxDQUFnQixFQUFoQixFQUFvQjtBQUFBeUwsc0JBQVE7QUFBQUMseUJBQVM7QUFBVDtBQUFSLGFBQXBCLEVBQXdDekwsS0FBeEMsRUFBWDs7QUFDQSxnQkFBR3VMLFFBQUg7QUN1TFMscUJEdExSO0FBQUNuSyx3QkFBUSxTQUFUO0FBQW9CeUosc0JBQU1VO0FBQTFCLGVDc0xRO0FEdkxUO0FDNExTLHFCRHpMUjtBQUFBcEssNEJBQVksR0FBWjtBQUNBa0Qsc0JBQU07QUFBQ2pELDBCQUFRLE1BQVQ7QUFBaUJ5RCwyQkFBUztBQUExQjtBQUROLGVDeUxRO0FBT0Q7QURyTVQ7QUFBQTtBQURELE9DZ0xHO0FEeE5KO0FBQUEsR0NpR0EsQ0RyVUssQ0FzUk47Ozs7QUN3TUN5RCxnQkFBYzlGLFNBQWQsQ0RyTUQ2RyxTQ3FNQyxHRHJNVTtBQUNWLFFBQUFzQyxNQUFBLEVBQUE3SSxJQUFBO0FBQUFBLFdBQU8sSUFBUCxDQURVLENBRVY7Ozs7OztBQU1BLFNBQUMwRyxRQUFELENBQVUsT0FBVixFQUFtQjtBQUFDakUsb0JBQWM7QUFBZixLQUFuQixFQUNDO0FBQUE0RixZQUFNO0FBRUwsWUFBQTNFLElBQUEsRUFBQW9GLENBQUEsRUFBQUMsU0FBQSxFQUFBN00sR0FBQSxFQUFBa0csSUFBQSxFQUFBWCxRQUFBLEVBQUF1SCxXQUFBLEVBQUFoTyxJQUFBO0FBQUFBLGVBQU8sRUFBUDs7QUFDQSxZQUFHLEtBQUNzRyxVQUFELENBQVl0RyxJQUFmO0FBQ0MsY0FBRyxLQUFDc0csVUFBRCxDQUFZdEcsSUFBWixDQUFpQnVDLE9BQWpCLENBQXlCLEdBQXpCLE1BQWlDLENBQUMsQ0FBckM7QUFDQ3ZDLGlCQUFLSyxRQUFMLEdBQWdCLEtBQUNpRyxVQUFELENBQVl0RyxJQUE1QjtBQUREO0FBR0NBLGlCQUFLTSxLQUFMLEdBQWEsS0FBQ2dHLFVBQUQsQ0FBWXRHLElBQXpCO0FBSkY7QUFBQSxlQUtLLElBQUcsS0FBQ3NHLFVBQUQsQ0FBWWpHLFFBQWY7QUFDSkwsZUFBS0ssUUFBTCxHQUFnQixLQUFDaUcsVUFBRCxDQUFZakcsUUFBNUI7QUFESSxlQUVBLElBQUcsS0FBQ2lHLFVBQUQsQ0FBWWhHLEtBQWY7QUFDSk4sZUFBS00sS0FBTCxHQUFhLEtBQUNnRyxVQUFELENBQVloRyxLQUF6QjtBQzJNSTs7QUR4TUw7QUFDQ29JLGlCQUFPN0ksS0FBS2MsaUJBQUwsQ0FBdUJYLElBQXZCLEVBQTZCLEtBQUNzRyxVQUFELENBQVkxRixRQUF6QyxDQUFQO0FBREQsaUJBQUFlLEtBQUE7QUFFTW1NLGNBQUFuTSxLQUFBO0FBQ0wrQixrQkFBUS9CLEtBQVIsQ0FBY21NLENBQWQ7QUFDQSxpQkFDQztBQUFBekssd0JBQVl5SyxFQUFFbk0sS0FBZDtBQUNBNEUsa0JBQU07QUFBQWpELHNCQUFRLE9BQVI7QUFBaUJ5RCx1QkFBUytHLEVBQUVHO0FBQTVCO0FBRE4sV0FERDtBQ2lOSTs7QUQzTUwsWUFBR3ZGLEtBQUs5RixNQUFMLElBQWdCOEYsS0FBSzdILFNBQXhCO0FBQ0NtTix3QkFBYyxFQUFkO0FBQ0FBLHNCQUFZaEosS0FBS0UsT0FBTCxDQUFhd0QsSUFBYixDQUFrQi9GLEtBQTlCLElBQXVDbEIsU0FBUzBKLGVBQVQsQ0FBeUJ6QyxLQUFLN0gsU0FBOUIsQ0FBdkM7QUFDQSxlQUFDYixJQUFELEdBQVFxQixPQUFPQyxLQUFQLENBQWFDLE9BQWIsQ0FDUDtBQUFBLG1CQUFPbUgsS0FBSzlGO0FBQVosV0FETyxFQUVQb0wsV0FGTyxDQUFSO0FBR0EsZUFBQ3BMLE1BQUQsSUFBQTFCLE1BQUEsS0FBQWxCLElBQUEsWUFBQWtCLElBQWlCYSxHQUFqQixHQUFpQixNQUFqQjtBQzZNSTs7QUQzTUwwRSxtQkFBVztBQUFDbkQsa0JBQVEsU0FBVDtBQUFvQnlKLGdCQUFNckU7QUFBMUIsU0FBWDtBQUdBcUYsb0JBQUEsQ0FBQTNHLE9BQUFwQyxLQUFBRSxPQUFBLENBQUFnSixVQUFBLFlBQUE5RyxLQUFxQ29CLElBQXJDLENBQTBDLElBQTFDLElBQVksTUFBWjs7QUFDQSxZQUFHdUYsYUFBQSxJQUFIO0FBQ0N4TixZQUFFNkUsTUFBRixDQUFTcUIsU0FBU3NHLElBQWxCLEVBQXdCO0FBQUNvQixtQkFBT0o7QUFBUixXQUF4QjtBQ2dOSTs7QUFDRCxlRC9NSnRILFFDK01JO0FEdFBMO0FBQUEsS0FERDs7QUEwQ0FvSCxhQUFTO0FBRVIsVUFBQWhOLFNBQUEsRUFBQWtOLFNBQUEsRUFBQS9NLFdBQUEsRUFBQW9OLEtBQUEsRUFBQWxOLEdBQUEsRUFBQXVGLFFBQUEsRUFBQTRILGNBQUEsRUFBQUMsYUFBQSxFQUFBQyxTQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGFBQUE7QUFBQTVOLGtCQUFZLEtBQUMyRixPQUFELENBQVNLLE9BQVQsQ0FBaUIsY0FBakIsQ0FBWjtBQUNBN0Ysb0JBQWNTLFNBQVMwSixlQUFULENBQXlCdEssU0FBekIsQ0FBZDtBQUNBeU4sc0JBQWdCdEosS0FBS0UsT0FBTCxDQUFhd0QsSUFBYixDQUFrQi9GLEtBQWxDO0FBQ0F5TCxjQUFRRSxjQUFjSSxXQUFkLENBQTBCLEdBQTFCLENBQVI7QUFDQUgsa0JBQVlELGNBQWNLLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMkJQLEtBQTNCLENBQVo7QUFDQUMsdUJBQWlCQyxjQUFjSyxTQUFkLENBQXdCUCxRQUFRLENBQWhDLENBQWpCO0FBQ0FLLHNCQUFnQixFQUFoQjtBQUNBQSxvQkFBY0osY0FBZCxJQUFnQ3JOLFdBQWhDO0FBQ0F3TiwwQkFBb0IsRUFBcEI7QUFDQUEsd0JBQWtCRCxTQUFsQixJQUErQkUsYUFBL0I7QUFDQXBOLGFBQU9DLEtBQVAsQ0FBYTRMLE1BQWIsQ0FBb0IsS0FBQ2xOLElBQUQsQ0FBTStCLEdBQTFCLEVBQStCO0FBQUM2TSxlQUFPSjtBQUFSLE9BQS9CO0FBRUEvSCxpQkFBVztBQUFDbkQsZ0JBQVEsU0FBVDtBQUFvQnlKLGNBQU07QUFBQ2hHLG1CQUFTO0FBQVY7QUFBMUIsT0FBWDtBQUdBZ0gsa0JBQUEsQ0FBQTdNLE1BQUE4RCxLQUFBRSxPQUFBLENBQUEySixXQUFBLFlBQUEzTixJQUFzQ3NILElBQXRDLENBQTJDLElBQTNDLElBQVksTUFBWjs7QUFDQSxVQUFHdUYsYUFBQSxJQUFIO0FBQ0N4TixVQUFFNkUsTUFBRixDQUFTcUIsU0FBU3NHLElBQWxCLEVBQXdCO0FBQUNvQixpQkFBT0o7QUFBUixTQUF4QjtBQ3VORzs7QUFDRCxhRHROSHRILFFDc05HO0FEM09LLEtBQVQsQ0FsRFUsQ0F5RVY7Ozs7Ozs7QUM2TkUsV0R2TkYsS0FBQ2lGLFFBQUQsQ0FBVSxRQUFWLEVBQW9CO0FBQUNqRSxvQkFBYztBQUFmLEtBQXBCLEVBQ0M7QUFBQXlELFdBQUs7QUFDSnhILGdCQUFRK0gsSUFBUixDQUFhLHFGQUFiO0FBQ0EvSCxnQkFBUStILElBQVIsQ0FBYSwrREFBYjtBQUNBLGVBQU9vQyxPQUFPckYsSUFBUCxDQUFZLElBQVosQ0FBUDtBQUhEO0FBSUE2RSxZQUFNUTtBQUpOLEtBREQsQ0N1TkU7QUR0U1EsR0NxTVY7O0FBNkdBLFNBQU9yRCxhQUFQO0FBRUQsQ0Q3a0JNLEVBQUQ7O0FBK1dOQSxnQkFBZ0IsS0FBQ0EsYUFBakIsQzs7Ozs7Ozs7Ozs7O0FFbFhBbkosT0FBT3lOLE9BQVAsQ0FBZTtBQUVkLE1BQUFDLFNBQUEsRUFBQUMsVUFBQTs7QUFBQUEsZUFBYSxVQUFDbkcsT0FBRCxFQUFVakcsTUFBVixFQUFrQnFNLFlBQWxCO0FBQ1osUUFBQWxDLElBQUE7QUFBQUEsV0FBTyxFQUFQO0FBQ0FrQyxpQkFBYUMsS0FBYixDQUFtQixHQUFuQixFQUF3QkMsT0FBeEIsQ0FBZ0MsVUFBQ0MsV0FBRDtBQUMvQixVQUFBcEYsTUFBQTtBQUFBQSxlQUFTK0UsVUFBVWxHLE9BQVYsRUFBbUJqRyxNQUFuQixFQUEyQndNLFdBQTNCLENBQVQ7QUNHRyxhREZIckMsS0FBSy9DLE9BQU90SCxJQUFaLElBQW9Cc0gsTUNFakI7QURKSjtBQUdBLFdBQU8rQyxJQUFQO0FBTFksR0FBYjs7QUFPQWdDLGNBQVksVUFBQ2xHLE9BQUQsRUFBVWpHLE1BQVYsRUFBa0J3TSxXQUFsQjtBQUNYLFFBQUFyQyxJQUFBLEVBQUFXLE1BQUEsRUFBQTJCLGtCQUFBLEVBQUFDLEtBQUEsRUFBQUMsVUFBQSxFQUFBQyxZQUFBLEVBQUFDLFNBQUE7QUFBQTFDLFdBQU94TSxFQUFFcU0sS0FBRixDQUFROEMsUUFBUUMsT0FBUixDQUFnQkQsUUFBUUUsYUFBUixDQUFzQkYsUUFBUVgsU0FBUixDQUFrQkssV0FBbEIsRUFBK0J2RyxPQUEvQixDQUF0QixDQUFoQixDQUFSLENBQVA7O0FBQ0EsUUFBRyxDQUFDa0UsSUFBSjtBQUNDLFlBQU0sSUFBSTFMLE9BQU9YLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsV0FBUzBPLFdBQS9CLENBQU47QUNLRTs7QURISEcsaUJBQWFHLFFBQVFHLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDdE8sT0FBeEMsQ0FBZ0Q7QUFBQ2MsYUFBT3dHLE9BQVI7QUFBaUJuRyxZQUFNO0FBQXZCLEtBQWhELEVBQWlGO0FBQUNnTCxjQUFPO0FBQUMzTCxhQUFJLENBQUw7QUFBUStOLHVCQUFjO0FBQXRCO0FBQVIsS0FBakYsQ0FBYjtBQUNBTCxnQkFBWUMsUUFBUUcsYUFBUixDQUFzQixnQkFBdEIsRUFBd0N0TyxPQUF4QyxDQUFnRDtBQUFDYyxhQUFPd0csT0FBUjtBQUFpQm5HLFlBQU07QUFBdkIsS0FBaEQsRUFBZ0Y7QUFBQ2dMLGNBQU87QUFBQzNMLGFBQUksQ0FBTDtBQUFRK04sdUJBQWM7QUFBdEI7QUFBUixLQUFoRixDQUFaO0FBQ0FOLG1CQUFlRSxRQUFRRyxhQUFSLENBQXNCLGdCQUF0QixFQUF3QzVOLElBQXhDLENBQTZDO0FBQUNYLGFBQU9zQixNQUFSO0FBQWdCUCxhQUFPd0c7QUFBdkIsS0FBN0MsRUFBOEU7QUFBQzZFLGNBQU87QUFBQzNMLGFBQUksQ0FBTDtBQUFRK04sdUJBQWM7QUFBdEI7QUFBUixLQUE5RSxFQUFpSDVOLEtBQWpILEVBQWY7QUFDQW9OLFlBQVE7QUFBRUMsNEJBQUY7QUFBY0UsMEJBQWQ7QUFBeUJEO0FBQXpCLEtBQVI7QUFFQUgseUJBQXFCSyxRQUFRSyxvQkFBUixDQUE2QkMsSUFBN0IsQ0FBa0NWLEtBQWxDLEVBQXlDekcsT0FBekMsRUFBa0RqRyxNQUFsRCxFQUEwRHdNLFdBQTFELENBQXJCO0FBRUEsV0FBT3JDLEtBQUtrRCxVQUFaO0FBQ0EsV0FBT2xELEtBQUttRCxjQUFaOztBQUVBLFFBQUdiLG1CQUFtQmMsU0FBdEI7QUFDQ3BELFdBQUtvRCxTQUFMLEdBQWlCLElBQWpCO0FBQ0FwRCxXQUFLcUQsU0FBTCxHQUFpQmYsbUJBQW1CZSxTQUFwQztBQUNBckQsV0FBS3NELFdBQUwsR0FBbUJoQixtQkFBbUJnQixXQUF0QztBQUNBdEQsV0FBS3VELFdBQUwsR0FBbUJqQixtQkFBbUJpQixXQUF0QztBQUNBdkQsV0FBS3dELGdCQUFMLEdBQXdCbEIsbUJBQW1Ca0IsZ0JBQTNDO0FBRUE3QyxlQUFTLEVBQVQ7O0FBQ0FuTixRQUFFNE8sT0FBRixDQUFVcEMsS0FBS1csTUFBZixFQUF1QixVQUFDOEMsS0FBRCxFQUFRQyxHQUFSO0FBQ3RCLFlBQUFDLE1BQUE7O0FBQUFBLGlCQUFTblEsRUFBRXFNLEtBQUYsQ0FBUTRELEtBQVIsQ0FBVDs7QUFFQSxZQUFHLENBQUNFLE9BQU9oTyxJQUFYO0FBQ0NnTyxpQkFBT2hPLElBQVAsR0FBYytOLEdBQWQ7QUM2Qkk7O0FEMUJMLFlBQUlsUSxFQUFFZ0MsT0FBRixDQUFVOE0sbUJBQW1Cc0IsaUJBQTdCLEVBQWdERCxPQUFPaE8sSUFBdkQsSUFBK0QsQ0FBQyxDQUFwRTtBQUNDZ08saUJBQU9FLFFBQVAsR0FBa0IsSUFBbEI7QUM0Qkk7O0FEekJMLFlBQUlyUSxFQUFFZ0MsT0FBRixDQUFVOE0sbUJBQW1Cd0IsaUJBQTdCLEVBQWdESCxPQUFPaE8sSUFBdkQsSUFBK0QsQ0FBbkU7QUMyQk0saUJEMUJMZ0wsT0FBTytDLEdBQVAsSUFBY0MsTUMwQlQ7QUFDRDtBRHZDTjs7QUFjQTNELFdBQUtXLE1BQUwsR0FBY0EsTUFBZDtBQXRCRDtBQXlCQ1gsV0FBS29ELFNBQUwsR0FBaUIsS0FBakI7QUMyQkU7O0FEekJILFdBQU9wRCxJQUFQO0FBMUNXLEdBQVo7O0FDc0VDLFNEMUJEbkgsV0FBV0MsR0FBWCxDQUFlLEtBQWYsRUFBc0JpTCxhQUFhQyxRQUFiLEdBQXdCLGNBQTlDLEVBQThELFVBQUM1TixHQUFELEVBQU1DLEdBQU4sRUFBVzROLElBQVg7QUFDN0QsUUFBQUMsSUFBQSxFQUFBbEUsSUFBQSxFQUFBZSxDQUFBLEVBQUFzQixXQUFBLEVBQUFsTyxHQUFBLEVBQUFrRyxJQUFBLEVBQUF5QixPQUFBLEVBQUFqRyxNQUFBOztBQUFBO0FBQ0NBLGVBQVNzTyxRQUFRQyxzQkFBUixDQUErQmhPLEdBQS9CLEVBQW9DQyxHQUFwQyxDQUFUOztBQUNBLFVBQUcsQ0FBQ1IsTUFBSjtBQUNDLGNBQU0sSUFBSXZCLE9BQU9YLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsZUFBdEIsQ0FBTjtBQzRCRzs7QUQxQkptSSxnQkFBQSxDQUFBM0gsTUFBQWlDLElBQUFnRCxNQUFBLFlBQUFqRixJQUFzQjJILE9BQXRCLEdBQXNCLE1BQXRCOztBQUNBLFVBQUcsQ0FBQ0EsT0FBSjtBQUNDLGNBQU0sSUFBSXhILE9BQU9YLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsY0FBdEIsQ0FBTjtBQzRCRzs7QUQxQkowTyxvQkFBQSxDQUFBaEksT0FBQWpFLElBQUFnRCxNQUFBLFlBQUFpQixLQUEwQmxILEVBQTFCLEdBQTBCLE1BQTFCOztBQUNBLFVBQUcsQ0FBQ2tQLFdBQUo7QUFDQyxjQUFNLElBQUkvTixPQUFPWCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLFNBQXRCLENBQU47QUM0Qkc7O0FEMUJKdVEsYUFBT3ZCLFFBQVFHLGFBQVIsQ0FBc0IsU0FBdEIsRUFBaUN0TyxPQUFqQyxDQUF5QztBQUFDUSxhQUFLcU47QUFBTixPQUF6QyxDQUFQOztBQUVBLFVBQUc2QixRQUFRQSxLQUFLdk8sSUFBaEI7QUFDQzBNLHNCQUFjNkIsS0FBS3ZPLElBQW5CO0FDNkJHOztBRDNCSixVQUFHME0sWUFBWUYsS0FBWixDQUFrQixHQUFsQixFQUF1QnpPLE1BQXZCLEdBQWdDLENBQW5DO0FBQ0NzTSxlQUFPaUMsV0FBV25HLE9BQVgsRUFBb0JqRyxNQUFwQixFQUE0QndNLFdBQTVCLENBQVA7QUFERDtBQUdDckMsZUFBT2dDLFVBQVVsRyxPQUFWLEVBQW1CakcsTUFBbkIsRUFBMkJ3TSxXQUEzQixDQUFQO0FDNkJHOztBQUNELGFENUJIeEosV0FBV3dMLFVBQVgsQ0FBc0JoTyxHQUF0QixFQUEyQjtBQUMxQmlPLGNBQU0sR0FEb0I7QUFFMUJ0RSxjQUFNQSxRQUFRO0FBRlksT0FBM0IsQ0M0Qkc7QURuREosYUFBQXBMLEtBQUE7QUEyQk1tTSxVQUFBbk0sS0FBQTtBQUNMK0IsY0FBUS9CLEtBQVIsQ0FBY21NLEVBQUV0SyxLQUFoQjtBQzhCRyxhRDdCSG9DLFdBQVd3TCxVQUFYLENBQXNCaE8sR0FBdEIsRUFBMkI7QUFDMUJpTyxjQUFNdkQsRUFBRW5NLEtBQUYsSUFBVyxHQURTO0FBRTFCb0wsY0FBTTtBQUFDdUUsa0JBQVF4RCxFQUFFRyxNQUFGLElBQVlILEVBQUUvRztBQUF2QjtBQUZvQixPQUEzQixDQzZCRztBQU1EO0FEakVKLElDMEJDO0FEL0VGLEc7Ozs7Ozs7Ozs7OztBRUFBMUYsT0FBT3lOLE9BQVAsQ0FBZTtBQUNkLE1BQUF5QyxpQkFBQSxFQUFBQyxXQUFBLEVBQUFDLEdBQUEsRUFBQUMsT0FBQTtBQUFBSCxzQkFBb0I5UixRQUFRLGVBQVIsRUFBeUI4UixpQkFBN0M7QUFDQUMsZ0JBQWMvUixRQUFRLGVBQVIsRUFBeUIrUixXQUF2QztBQUNBRSxZQUFValMsUUFBUSxTQUFSLENBQVY7QUFDQWdTLFFBQU1DLFNBQU47QUFDQUQsTUFBSUUsR0FBSixDQUFRLGVBQVIsRUFBeUJKLGlCQUF6QjtBQUNBSyxTQUFPQyxlQUFQLENBQXVCRixHQUF2QixDQUEyQkYsR0FBM0I7QUNFQyxTREREbFIsRUFBRTRCLElBQUYsQ0FBT3VOLFFBQVFvQyxhQUFSLENBQXNCQyxjQUF0QixFQUFQLEVBQStDLFVBQUNDLFVBQUQsRUFBYXRQLElBQWI7QUFDOUMsUUFBQXVQLFFBQUE7O0FBQUEsUUFBR3ZQLFNBQVEsU0FBWDtBQUNDdVAsaUJBQVdQLFNBQVg7QUFDQU8sZUFBU04sR0FBVCxDQUFhLGdCQUFjalAsSUFBM0IsRUFBbUM4TyxXQUFuQztBQ0dHLGFERkhJLE9BQU9DLGVBQVAsQ0FBdUJGLEdBQXZCLENBQTJCTSxRQUEzQixDQ0VHO0FBQ0Q7QURQSixJQ0NDO0FEUkYsRzs7Ozs7Ozs7Ozs7O0FFQUEsSUFBQUMsS0FBQSxFQUFBQyxrQkFBQSxFQUFBMUgsU0FBQTtBQUFBeUgsUUFBUXpTLFFBQVEsUUFBUixDQUFSO0FBRUFnTCxZQUFZaEwsUUFBUSxZQUFSLENBQVo7QUFFQTBTLHFCQUFxQixFQUFyQjtBQUVBdk0sV0FBV3dNLFVBQVgsQ0FBc0JULEdBQXRCLENBQTBCLGdCQUExQixFQUE0QyxVQUFDeE8sR0FBRCxFQUFNQyxHQUFOLEVBQVc0TixJQUFYO0FDRzFDLFNERERrQixNQUFNO0FBQ0wsUUFBQUcsTUFBQSxFQUFBQyxlQUFBLEVBQUE1SixJQUFBLEVBQUE3SCxTQUFBLEVBQUEwUixTQUFBLEVBQUF2UixXQUFBLEVBQUF3UixRQUFBLEVBQUFDLFdBQUEsRUFBQXZSLEdBQUEsRUFBQWtHLElBQUEsRUFBQUMsSUFBQSxFQUFBcUwsTUFBQSxFQUFBL1AsS0FBQSxFQUFBM0MsSUFBQSxFQUFBNEMsTUFBQTs7QUFBQSxRQUFHLENBQUNPLElBQUlQLE1BQVI7QUFDQzRQLGlCQUFXLEtBQVg7O0FBRUEsVUFBQXJQLE9BQUEsUUFBQWpDLE1BQUFpQyxJQUFBa0QsS0FBQSxZQUFBbkYsSUFBZXlSLFlBQWYsR0FBZSxNQUFmLEdBQWUsTUFBZjtBQUNDalAsZ0JBQVFrUCxHQUFSLENBQVksVUFBWixFQUF3QnpQLElBQUlrRCxLQUFKLENBQVVzTSxZQUFsQztBQUNBL1AsaUJBQVNzTyxRQUFRMkIsd0JBQVIsQ0FBaUMxUCxJQUFJa0QsS0FBSixDQUFVc00sWUFBM0MsQ0FBVDs7QUFDQSxZQUFHL1AsTUFBSDtBQUNDNUMsaUJBQU9xQixPQUFPQyxLQUFQLENBQWFDLE9BQWIsQ0FBcUI7QUFBQ1EsaUJBQUthO0FBQU4sV0FBckIsQ0FBUDs7QUFDQSxjQUFHNUMsSUFBSDtBQUNDd1MsdUJBQVcsSUFBWDtBQUhGO0FBSEQ7QUNZSTs7QURKSixVQUFHclAsSUFBSTBELE9BQUosQ0FBWSxlQUFaLENBQUg7QUFDQzZCLGVBQU8rQixVQUFVcUksS0FBVixDQUFnQjNQLElBQUkwRCxPQUFKLENBQVksZUFBWixDQUFoQixDQUFQOztBQUNBLFlBQUc2QixJQUFIO0FBQ0MxSSxpQkFBT3FCLE9BQU9DLEtBQVAsQ0FBYUMsT0FBYixDQUFxQjtBQUFDbEIsc0JBQVVxSSxLQUFLaEc7QUFBaEIsV0FBckIsRUFBNEM7QUFBRWdMLG9CQUFRO0FBQUUsMEJBQVk7QUFBZDtBQUFWLFdBQTVDLENBQVA7O0FBQ0EsY0FBRzFOLElBQUg7QUFDQyxnQkFBR21TLG1CQUFtQnpKLEtBQUtoRyxJQUF4QixNQUFpQ2dHLEtBQUtxSyxJQUF6QztBQUNDUCx5QkFBVyxJQUFYO0FBREQ7QUFHQ0UsdUJBQVNqUixTQUFTQyxjQUFULENBQXdCMUIsSUFBeEIsRUFBOEIwSSxLQUFLcUssSUFBbkMsQ0FBVDs7QUFFQSxrQkFBRyxDQUFDTCxPQUFPL1EsS0FBWDtBQUNDNlEsMkJBQVcsSUFBWDs7QUFDQSxvQkFBR2pTLEVBQUVDLElBQUYsQ0FBTzJSLGtCQUFQLEVBQTJCMVIsTUFBM0IsR0FBb0MsR0FBdkM7QUFDQzBSLHVDQUFxQixFQUFyQjtBQ1dROztBRFZUQSxtQ0FBbUJ6SixLQUFLaEcsSUFBeEIsSUFBZ0NnRyxLQUFLcUssSUFBckM7QUFURjtBQUREO0FBRkQ7QUFGRDtBQzhCSTs7QURmSixVQUFHUCxRQUFIO0FBQ0NyUCxZQUFJMEQsT0FBSixDQUFZLFdBQVosSUFBMkI3RyxLQUFLK0IsR0FBaEM7QUFDQVksZ0JBQVEsSUFBUjtBQUNBMFAsaUJBQVMsU0FBVDtBQUNBRSxvQkFBWSxJQUFaO0FBQ0FFLHNCQUFBLENBQUFyTCxPQUFBcEgsS0FBQXdCLFFBQUEsYUFBQTZGLE9BQUFELEtBQUE0TCxNQUFBLFlBQUEzTCxLQUFxQ29MLFdBQXJDLEdBQXFDLE1BQXJDLEdBQXFDLE1BQXJDOztBQUNBLFlBQUdBLFdBQUg7QUFDQ0gsNEJBQWtCL1IsRUFBRTBCLElBQUYsQ0FBT3dRLFdBQVAsRUFBb0IsVUFBQ1EsQ0FBRDtBQUNyQyxtQkFBT0EsRUFBRVosTUFBRixLQUFZQSxNQUFaLElBQXVCWSxFQUFFVixTQUFGLEtBQWVBLFNBQTdDO0FBRGlCLFlBQWxCOztBQUdBLGNBQWlDRCxlQUFqQztBQUFBM1Asb0JBQVEyUCxnQkFBZ0IzUCxLQUF4QjtBQUpEO0FDdUJLOztBRGpCTCxZQUFHLENBQUlBLEtBQVA7QUFDQzlCLHNCQUFZWSxTQUFTRywwQkFBVCxFQUFaO0FBQ0FlLGtCQUFROUIsVUFBVThCLEtBQWxCO0FBQ0EzQix3QkFBY1MsU0FBU0ksaUJBQVQsQ0FBMkJoQixTQUEzQixDQUFkO0FBQ0FHLHNCQUFZcVIsTUFBWixHQUFxQkEsTUFBckI7QUFDQXJSLHNCQUFZdVIsU0FBWixHQUF3QkEsU0FBeEI7QUFDQXZSLHNCQUFZMkIsS0FBWixHQUFvQkEsS0FBcEI7O0FBQ0FsQixtQkFBU0ssdUJBQVQsQ0FBaUM5QixLQUFLK0IsR0FBdEMsRUFBMkNmLFdBQTNDO0FDbUJJOztBRGpCTCxZQUFHMkIsS0FBSDtBQUNDUSxjQUFJMEQsT0FBSixDQUFZLGNBQVosSUFBOEJsRSxLQUE5QjtBQXRCRjtBQTFCRDtBQ3FFRzs7QUFDRCxXRHJCRnFPLE1DcUJFO0FEdkVILEtBbURFa0MsR0FuREYsRUNDQztBREhGLEc7Ozs7Ozs7Ozs7OztBRU5BN1IsT0FBT3lOLE9BQVAsQ0FBZTtBQUNkLE1BQUFxRSxlQUFBLEVBQUFDLGVBQUEsRUFBQUMsY0FBQSxFQUFBQyxzQkFBQSxFQUFBQyxVQUFBLEVBQUFDLGFBQUEsRUFBQUMscUJBQUE7O0FBQUFMLG9CQUFrQjNULFFBQVEsMkJBQVIsRUFBcUMyVCxlQUF2RDtBQUNBRCxvQkFBa0IxVCxRQUFRLDJCQUFSLEVBQXFDMFQsZUFBdkQ7QUFDQUssa0JBQWdCLENBQUMsUUFBRCxFQUFXLFVBQVgsQ0FBaEI7QUFFQUgsbUJBQWlCLENBQUMsU0FBRCxDQUFqQjtBQUVBQywyQkFBeUIsQ0FBQyxVQUFELENBQXpCO0FBRUFDLGVBQWEsaUJBQWI7O0FBRUFFLDBCQUF3QixVQUFDNUssT0FBRDtBQUN2QixRQUFBNkssZ0JBQUEsRUFBQUMsZUFBQSxFQUFBQyxNQUFBO0FBQUFBLGFBQVM7QUFBQzVJLGVBQVM4RixhQUFhK0MsT0FBdkI7QUFBZ0NDLG9CQUFjO0FBQUNGLGdCQUFRO0FBQVQ7QUFBOUMsS0FBVDtBQUVBRCxzQkFBa0IsRUFBbEI7QUFFQUEsb0JBQWdCSSxTQUFoQixHQUE0QlIsVUFBNUI7QUFFQUksb0JBQWdCSyxVQUFoQixHQUE2QixFQUE3QjtBQUVBTCxvQkFBZ0JNLFdBQWhCLEdBQThCLEVBQTlCOztBQUVBMVQsTUFBRTRCLElBQUYsQ0FBT3VOLFFBQVF3RSxXQUFmLEVBQTRCLFVBQUM1SixLQUFELEVBQVFtRyxHQUFSLEVBQWEwRCxJQUFiO0FBQzNCLFVBQUFDLE9BQUEsRUFBQUMsT0FBQSxFQUFBN1QsSUFBQSxFQUFBOFQsa0JBQUEsRUFBQUMsUUFBQTs7QUFBQUgsZ0JBQVUxRSxRQUFRWCxTQUFSLENBQWtCMEIsR0FBbEIsRUFBdUI1SCxPQUF2QixDQUFWOztBQUNBLFVBQUcsRUFBQXVMLFdBQUEsT0FBSUEsUUFBU0ksVUFBYixHQUFhLE1BQWIsQ0FBSDtBQUNDO0FDQUc7O0FER0poVSxhQUFPLENBQUM7QUFBQ2lVLHFCQUFhO0FBQUMvUixnQkFBTSxLQUFQO0FBQWNnUyx1QkFBYTtBQUEzQjtBQUFkLE9BQUQsQ0FBUDtBQUVBTCxnQkFBVTtBQUNUM1IsY0FBTTBSLFFBQVExUixJQURMO0FBRVQrTixhQUFJalE7QUFGSyxPQUFWO0FBS0FBLFdBQUsyTyxPQUFMLENBQWEsVUFBQ3dGLElBQUQ7QUNJUixlREhKaEIsZ0JBQWdCTSxXQUFoQixDQUE0QnhSLElBQTVCLENBQWlDO0FBQ2hDbVMsa0JBQVFyQixhQUFhLEdBQWIsR0FBbUJhLFFBQVExUixJQUEzQixHQUFrQyxHQUFsQyxHQUF3Q2lTLEtBQUtGLFdBQUwsQ0FBaUIvUixJQURqQztBQUVoQ21TLHNCQUFZLENBQUM7QUFDWixvQkFBUSw0QkFESTtBQUVaLG9CQUFRO0FBRkksV0FBRDtBQUZvQixTQUFqQyxDQ0dJO0FESkw7QUFVQU4saUJBQVcsRUFBWDtBQUNBQSxlQUFTOVIsSUFBVCxDQUFjO0FBQUNDLGNBQU0sS0FBUDtBQUFjb1MsY0FBTSxZQUFwQjtBQUFrQ0Msa0JBQVU7QUFBNUMsT0FBZDtBQUVBVCwyQkFBcUIsRUFBckI7O0FBRUEvVCxRQUFFNE8sT0FBRixDQUFVaUYsUUFBUTFHLE1BQWxCLEVBQTBCLFVBQUM4QyxLQUFELEVBQVF3RSxVQUFSO0FBRXpCLFlBQUFDLFNBQUEsRUFBQUMsWUFBQTs7QUFBQUQsb0JBQVk7QUFBQ3ZTLGdCQUFNc1MsVUFBUDtBQUFtQkYsZ0JBQU07QUFBekIsU0FBWjs7QUFFQSxZQUFHdlUsRUFBRTBFLFFBQUYsQ0FBV3VPLGFBQVgsRUFBMEJoRCxNQUFNc0UsSUFBaEMsQ0FBSDtBQUNDRyxvQkFBVUgsSUFBVixHQUFpQixZQUFqQjtBQURELGVBRUssSUFBR3ZVLEVBQUUwRSxRQUFGLENBQVdvTyxjQUFYLEVBQTJCN0MsTUFBTXNFLElBQWpDLENBQUg7QUFDSkcsb0JBQVVILElBQVYsR0FBaUIsYUFBakI7QUFESSxlQUVBLElBQUd2VSxFQUFFMEUsUUFBRixDQUFXcU8sc0JBQVgsRUFBbUM5QyxNQUFNc0UsSUFBekMsQ0FBSDtBQUNKRyxvQkFBVUgsSUFBVixHQUFpQixvQkFBakI7QUFDQUcsb0JBQVVFLFNBQVYsR0FBc0IsR0FBdEI7QUNTSTs7QURQTCxZQUFHM0UsTUFBTTRFLFFBQVQ7QUFDQ0gsb0JBQVVGLFFBQVYsR0FBcUIsS0FBckI7QUNTSTs7QURQTFIsaUJBQVM5UixJQUFULENBQWN3UyxTQUFkO0FBRUFDLHVCQUFlMUUsTUFBTTBFLFlBQXJCOztBQUVBLFlBQUdBLFlBQUg7QUFDQyxjQUFHLENBQUMzVSxFQUFFOFUsT0FBRixDQUFVSCxZQUFWLENBQUo7QUFDQ0EsMkJBQWUsQ0FBQ0EsWUFBRCxDQUFmO0FDT0s7O0FBQ0QsaUJETkxBLGFBQWEvRixPQUFiLENBQXFCLFVBQUNtRyxDQUFEO0FBQ3BCLGdCQUFBOUksS0FBQSxFQUFBK0ksYUFBQTs7QUFBQUEsNEJBQWdCN0YsUUFBUVgsU0FBUixDQUFrQnVHLENBQWxCLEVBQXFCek0sT0FBckIsQ0FBaEI7O0FBQ0EsZ0JBQUcwTSxhQUFIO0FBQ0MvSSxzQkFBUXdJLGFBQWFsRSxhQUFhMEUsbUJBQWxDOztBQUNBLGtCQUFHalYsRUFBRThVLE9BQUYsQ0FBVTdFLE1BQU0wRSxZQUFoQixDQUFIO0FBQ0MxSSx3QkFBUXdJLGFBQWFsRSxhQUFhMEUsbUJBQTFCLEdBQWdELEdBQWhELEdBQXNERCxjQUFjN1MsSUFBNUU7QUNRTzs7QUFDRCxxQkRSUDRSLG1CQUFtQjdSLElBQW5CLENBQXdCO0FBQ3ZCQyxzQkFBTThKLEtBRGlCO0FBR3ZCc0ksc0JBQU12QixhQUFhLEdBQWIsR0FBbUJnQyxjQUFjN1MsSUFIaEI7QUFJdkIrUyx5QkFBU3JCLFFBQVExUixJQUpNO0FBS3ZCZ1QsMEJBQVVILGNBQWM3UyxJQUxEO0FBTXZCaVQsdUNBQXVCLENBQ3RCO0FBQ0NwQiw0QkFBVVMsVUFEWDtBQUVDWSxzQ0FBb0I7QUFGckIsaUJBRHNCO0FBTkEsZUFBeEIsQ0NRTztBRFpSO0FDeUJRLHFCRFBQbFMsUUFBUStILElBQVIsQ0FBYSxtQkFBaUI2SixDQUFqQixHQUFtQixZQUFoQyxDQ09PO0FBQ0Q7QUQ1QlIsWUNNSztBQXdCRDtBRHJETjs7QUE2Q0FqQixjQUFRRSxRQUFSLEdBQW1CQSxRQUFuQjtBQUNBRixjQUFRQyxrQkFBUixHQUE2QkEsa0JBQTdCO0FDV0csYURUSFgsZ0JBQWdCSyxVQUFoQixDQUEyQnZSLElBQTNCLENBQWdDNFIsT0FBaEMsQ0NTRztBRHJGSjs7QUE4RUFULFdBQU9FLFlBQVAsQ0FBb0JGLE1BQXBCLENBQTJCblIsSUFBM0IsQ0FBZ0NrUixlQUFoQztBQUdBRCx1QkFBbUIsRUFBbkI7QUFDQUEscUJBQWlCbUMsZUFBakIsR0FBbUM7QUFBQ25ULFlBQU07QUFBUCxLQUFuQztBQUNBZ1IscUJBQWlCbUMsZUFBakIsQ0FBaUNDLFNBQWpDLEdBQTZDLEVBQTdDOztBQUVBdlYsTUFBRTRPLE9BQUYsQ0FBVXdFLGdCQUFnQkssVUFBMUIsRUFBc0MsVUFBQytCLEdBQUQsRUFBTUMsQ0FBTjtBQ1NsQyxhRFJIdEMsaUJBQWlCbUMsZUFBakIsQ0FBaUNDLFNBQWpDLENBQTJDclQsSUFBM0MsQ0FBZ0Q7QUFDL0MsZ0JBQVFzVCxJQUFJclQsSUFEbUM7QUFFL0Msc0JBQWM2USxhQUFhLEdBQWIsR0FBbUJ3QyxJQUFJclQsSUFGVTtBQUcvQyxxQ0FBNkI7QUFIa0IsT0FBaEQsQ0NRRztBRFRKOztBQWtCQWtSLFdBQU9FLFlBQVAsQ0FBb0JGLE1BQXBCLENBQTJCblIsSUFBM0IsQ0FBZ0NpUixnQkFBaEM7QUFFQSxXQUFPRSxNQUFQO0FBcEh1QixHQUF4Qjs7QUFzSEFxQyxrQkFBZ0J2SyxRQUFoQixDQUF5QixFQUF6QixFQUE2QjtBQUFDakUsa0JBQWNxSixhQUFhb0Y7QUFBNUIsR0FBN0IsRUFBd0U7QUFDdkVoTCxTQUFLO0FBQ0osVUFBQTNFLElBQUEsRUFBQTRQLE9BQUEsRUFBQWpWLEdBQUEsRUFBQWtHLElBQUEsRUFBQWdQLGVBQUE7QUFBQUQsZ0JBQVVyRixhQUFhdUYsZUFBYixFQUFBblYsTUFBQSxLQUFBZ0YsU0FBQSxZQUFBaEYsSUFBeUMySCxPQUF6QyxHQUF5QyxNQUF6QyxDQUFWO0FBQ0F1Tix3QkFBbUJqRCxnQkFBZ0JtRCxtQkFBaEIsQ0FBb0M3QyxzQkFBQSxDQUFBck0sT0FBQSxLQUFBbEIsU0FBQSxZQUFBa0IsS0FBa0N5QixPQUFsQyxHQUFrQyxNQUFsQyxDQUFwQyxFQUFnRjtBQUFDc04saUJBQVNBO0FBQVYsT0FBaEYsQ0FBbkI7QUFDQTVQLGFBQU82UCxnQkFBZ0JHLFFBQWhCLEVBQVA7QUFDQSxhQUFPO0FBQ04xUCxpQkFBUztBQUNSLDBCQUFnQixpQ0FEUjtBQUVSLDJCQUFpQmlLLGFBQWErQztBQUZ0QixTQURIO0FBS050TixjQUFNNlAsZ0JBQWdCRyxRQUFoQjtBQUxBLE9BQVA7QUFMc0U7QUFBQSxHQUF4RTtBQ2VDLFNEREROLGdCQUFnQnZLLFFBQWhCLENBQXlCb0YsYUFBYTBGLGFBQXRDLEVBQXFEO0FBQUMvTyxrQkFBY3FKLGFBQWFvRjtBQUE1QixHQUFyRCxFQUFnRztBQUMvRmhMLFNBQUs7QUFDSixVQUFBM0UsSUFBQSxFQUFBckYsR0FBQSxFQUFBdVYsZUFBQTtBQUFBQSx3QkFBa0JyRCxnQkFBZ0JrRCxtQkFBaEIsQ0FBb0M3QyxzQkFBQSxDQUFBdlMsTUFBQSxLQUFBZ0YsU0FBQSxZQUFBaEYsSUFBa0MySCxPQUFsQyxHQUFrQyxNQUFsQyxDQUFwQyxDQUFsQjtBQUNBdEMsYUFBT2tRLGdCQUFnQkYsUUFBaEIsRUFBUDtBQUNBLGFBQU87QUFDTjFQLGlCQUFTO0FBQ1IsMEJBQWdCLGdDQURSO0FBRVIsMkJBQWlCaUssYUFBYStDO0FBRnRCLFNBREg7QUFLTnROLGNBQU1BO0FBTEEsT0FBUDtBQUo4RjtBQUFBLEdBQWhHLENDQ0M7QURoSkYsRzs7Ozs7Ozs7Ozs7O0FFQUEsS0FBQ3VLLFlBQUQsR0FBZ0IsRUFBaEI7QUFDQUEsYUFBYStDLE9BQWIsR0FBdUIsS0FBdkI7QUFDQS9DLGFBQWFvRixZQUFiLEdBQTRCLElBQTVCO0FBQ0FwRixhQUFhQyxRQUFiLEdBQXdCLHdCQUF4QjtBQUNBRCxhQUFhMEYsYUFBYixHQUE2QixXQUE3QjtBQUNBMUYsYUFBYTBFLG1CQUFiLEdBQW1DLFNBQW5DOztBQUNBMUUsYUFBYTRGLFdBQWIsR0FBMkIsVUFBQzdOLE9BQUQ7QUFDMUIsU0FBT3hILE9BQU9zVixXQUFQLENBQW1CLGtCQUFrQjlOLE9BQXJDLENBQVA7QUFEMEIsQ0FBM0I7O0FBR0FpSSxhQUFhOEYsWUFBYixHQUE0QixVQUFDL04sT0FBRCxFQUFTdUcsV0FBVDtBQUMzQixTQUFPMEIsYUFBYTRGLFdBQWIsQ0FBeUI3TixPQUF6QixLQUFvQyxNQUFJdUcsV0FBeEMsQ0FBUDtBQUQyQixDQUE1Qjs7QUFHQSxJQUFHL04sT0FBT3dWLFFBQVY7QUFDQy9GLGVBQWF1RixlQUFiLEdBQStCLFVBQUN4TixPQUFEO0FBQzlCLFdBQU9pSSxhQUFhNEYsV0FBYixDQUF5QjdOLE9BQXpCLEtBQW9DLE1BQUlpSSxhQUFhMEYsYUFBckQsQ0FBUDtBQUQ4QixHQUEvQjs7QUFHQTFGLGVBQWFnRyxtQkFBYixHQUFtQyxVQUFDak8sT0FBRCxFQUFVdUcsV0FBVjtBQUNsQyxXQUFPMEIsYUFBYXVGLGVBQWIsQ0FBNkJ4TixPQUE3QixLQUF3QyxNQUFJdUcsV0FBNUMsQ0FBUDtBQURrQyxHQUFuQzs7QUFFQTBCLGVBQWFpRyxvQkFBYixHQUFvQyxVQUFDbE8sT0FBRCxFQUFTdUcsV0FBVDtBQUNuQyxXQUFPMEIsYUFBYTRGLFdBQWIsQ0FBeUI3TixPQUF6QixLQUFvQyxNQUFJdUcsV0FBeEMsQ0FBUDtBQURtQyxHQUFwQzs7QUFJQSxPQUFDNkcsZUFBRCxHQUFtQixJQUFJekwsYUFBSixDQUNsQjtBQUFBOUUsYUFBU29MLGFBQWFDLFFBQXRCO0FBQ0FoRyxvQkFBZ0IsSUFEaEI7QUFFQXZCLGdCQUFZLElBRlo7QUFHQTRCLGdCQUFZLElBSFo7QUFJQW5DLG9CQUNDO0FBQUEsc0JBQWdCO0FBQWhCO0FBTEQsR0FEa0IsQ0FBbkI7QUNpQkEsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGZpeCB3YXJuaW5nOiB4eHggbm90IGluc3RhbGxlZFxucmVxdWlyZShcImJhc2ljLWF1dGgvcGFja2FnZS5qc29uXCIpO1xuXG5pbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0J2Jhc2ljLWF1dGgnOiAnXjIuMC4xJyxcblx0J29kYXRhLXY0LXNlcnZpY2UtbWV0YWRhdGEnOiBcIl4wLjEuNlwiLFxuXHRcIm9kYXRhLXY0LXNlcnZpY2UtZG9jdW1lbnRcIjogXCJeMC4wLjNcIixcblx0J29kYXRhLXY0LW1vbmdvZGInOiBcIl4wLjEuMTJcIixcblx0Y29va2llczogXCJeMC42LjFcIixcbn0sICdzdGVlZG9zOm9kYXRhJyk7XG4iLCJAQXV0aCBvcj0ge31cblxuIyMjXG5cdEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiMjI1xudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlICh1c2VyKSAtPlxuXHRjaGVjayB1c2VyLFxuXHRcdGlkOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcblx0XHR1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG5cdFx0ZW1haWw6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuXG5cdGlmIF8ua2V5cyh1c2VyKS5sZW5ndGggaXMgbm90IDFcblx0XHR0aHJvdyBuZXcgTWF0Y2guRXJyb3IgJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnXG5cblx0cmV0dXJuIHRydWVcblxuXG4jIyNcblx0UmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuIyMjXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9ICh1c2VyKSAtPlxuXHRpZiB1c2VyLmlkXG5cdFx0cmV0dXJuIHsnX2lkJzogdXNlci5pZH1cblx0ZWxzZSBpZiB1c2VyLnVzZXJuYW1lXG5cdFx0cmV0dXJuIHsndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lfVxuXHRlbHNlIGlmIHVzZXIuZW1haWxcblx0XHRyZXR1cm4geydlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWx9XG5cblx0IyBXZSBzaG91bGRuJ3QgYmUgaGVyZSBpZiB0aGUgdXNlciBvYmplY3Qgd2FzIHByb3Blcmx5IHZhbGlkYXRlZFxuXHR0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInXG5cblxuIyMjXG5cdExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuIyMjXG5AQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9ICh1c2VyLCBwYXNzd29yZCkgLT5cblx0aWYgbm90IHVzZXIgb3Igbm90IHBhc3N3b3JkXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0IyBWYWxpZGF0ZSB0aGUgbG9naW4gaW5wdXQgdHlwZXNcblx0Y2hlY2sgdXNlciwgdXNlclZhbGlkYXRvclxuXHRjaGVjayBwYXNzd29yZCwgU3RyaW5nXG5cblx0IyBSZXRyaWV2ZSB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxuXHRhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpXG5cdGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKVxuXG5cdGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblx0aWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcz8ucGFzc3dvcmRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHQjIEF1dGhlbnRpY2F0ZSB0aGUgdXNlcidzIHBhc3N3b3JkXG5cdHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZFxuXHRpZiBwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdCMgQWRkIGEgbmV3IGF1dGggdG9rZW4gdG8gdGhlIHVzZXIncyBhY2NvdW50XG5cdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cblx0QWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4gYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW5cblxuXHRzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWR9KS5mZXRjaCgpXG5cdHNwYWNlcyA9IFtdXG5cdF8uZWFjaCBzcGFjZV91c2VycywgKHN1KS0+XG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSlcblx0XHQjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcblx0XHRpZiBzcGFjZT8uaXNfcGFpZCBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcik+PTBcblx0XHRcdHNwYWNlcy5wdXNoXG5cdFx0XHRcdF9pZDogc3BhY2UuX2lkXG5cdFx0XHRcdG5hbWU6IHNwYWNlLm5hbWVcblx0cmV0dXJuIHthdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbiwgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBhZG1pblNwYWNlczogc3BhY2VzfVxuIiwidmFyIGdldFVzZXJRdWVyeVNlbGVjdG9yLCB1c2VyVmFsaWRhdG9yO1xuXG50aGlzLkF1dGggfHwgKHRoaXMuQXV0aCA9IHt9KTtcblxuXG4vKlxuXHRBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4gKi9cblxudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlKGZ1bmN0aW9uKHVzZXIpIHtcbiAgY2hlY2sodXNlciwge1xuICAgIGlkOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpXG4gIH0pO1xuICBpZiAoXy5rZXlzKHVzZXIpLmxlbmd0aCA9PT0gITEpIHtcbiAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IoJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5cbi8qXG5cdFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiAqL1xuXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgaWYgKHVzZXIuaWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ19pZCc6IHVzZXIuaWRcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3VzZXJuYW1lJzogdXNlci51c2VybmFtZVxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci5lbWFpbCkge1xuICAgIHJldHVybiB7XG4gICAgICAnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsXG4gICAgfTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInKTtcbn07XG5cblxuLypcblx0TG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXG4gKi9cblxudGhpcy5BdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gZnVuY3Rpb24odXNlciwgcGFzc3dvcmQpIHtcbiAgdmFyIGF1dGhUb2tlbiwgYXV0aGVudGljYXRpbmdVc2VyLCBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciwgaGFzaGVkVG9rZW4sIHBhc3N3b3JkVmVyaWZpY2F0aW9uLCByZWYsIHNwYWNlX3VzZXJzLCBzcGFjZXM7XG4gIGlmICghdXNlciB8fCAhcGFzc3dvcmQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGNoZWNrKHVzZXIsIHVzZXJWYWxpZGF0b3IpO1xuICBjaGVjayhwYXNzd29yZCwgU3RyaW5nKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpO1xuICBpZiAoIWF1dGhlbnRpY2F0aW5nVXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaWYgKCEoKHJlZiA9IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IHJlZi5wYXNzd29yZCA6IHZvaWQgMCkpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZCk7XG4gIGlmIChwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKTtcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbihhdXRoVG9rZW4pO1xuICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbihhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlbik7XG4gIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZFxuICB9KS5mZXRjaCgpO1xuICBzcGFjZXMgPSBbXTtcbiAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbihzdSkge1xuICAgIHZhciBzcGFjZTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKTtcbiAgICBpZiAoKHNwYWNlICE9IG51bGwgPyBzcGFjZS5pc19wYWlkIDogdm9pZCAwKSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBzdS51c2VyKSA+PSAwKSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2goe1xuICAgICAgICBfaWQ6IHNwYWNlLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2UubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBhdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbixcbiAgICB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsXG4gICAgYWRtaW5TcGFjZXM6IHNwYWNlc1xuICB9O1xufTtcbiIsIi8vIFdlIG5lZWQgYSBmdW5jdGlvbiB0aGF0IHRyZWF0cyB0aHJvd24gZXJyb3JzIGV4YWN0bHkgbGlrZSBJcm9uIFJvdXRlciB3b3VsZC5cbi8vIFRoaXMgZmlsZSBpcyB3cml0dGVuIGluIEphdmFTY3JpcHQgdG8gZW5hYmxlIGNvcHktcGFzdGluZyBJcm9uIFJvdXRlciBjb2RlLlxuXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0wzXG52YXIgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMNDdcbmlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlID0gZnVuY3Rpb24oZXJyLCByZXEsIHJlcykge1xuXHRpZiAocmVzLnN0YXR1c0NvZGUgPCA0MDApXG5cdFx0cmVzLnN0YXR1c0NvZGUgPSA1MDA7XG5cblx0aWYgKGVyci5zdGF0dXMpXG5cdFx0cmVzLnN0YXR1c0NvZGUgPSBlcnIuc3RhdHVzO1xuXG5cdGlmIChlbnYgPT09ICdkZXZlbG9wbWVudCcpXG5cdFx0bXNnID0gKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSkgKyAnXFxuJztcblx0ZWxzZVxuXHQvL1hYWCBnZXQgdGhpcyBmcm9tIHN0YW5kYXJkIGRpY3Qgb2YgZXJyb3IgbWVzc2FnZXM/XG5cdFx0bXNnID0gJ1NlcnZlciBlcnJvci4nO1xuXG5cdGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKTtcblxuXHRpZiAocmVzLmhlYWRlcnNTZW50KVxuXHRcdHJldHVybiByZXEuc29ja2V0LmRlc3Ryb3koKTtcblxuXHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgQnVmZmVyLmJ5dGVMZW5ndGgobXNnKSk7XG5cdGlmIChyZXEubWV0aG9kID09PSAnSEVBRCcpXG5cdFx0cmV0dXJuIHJlcy5lbmQoKTtcblx0cmVzLmVuZChtc2cpO1xuXHRyZXR1cm47XG59XG4iLCJjbGFzcyBzaGFyZS5Sb3V0ZVxuXG5cdGNvbnN0cnVjdG9yOiAoQGFwaSwgQHBhdGgsIEBvcHRpb25zLCBAZW5kcG9pbnRzKSAtPlxuXHRcdCMgQ2hlY2sgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkXG5cdFx0aWYgbm90IEBlbmRwb2ludHNcblx0XHRcdEBlbmRwb2ludHMgPSBAb3B0aW9uc1xuXHRcdFx0QG9wdGlvbnMgPSB7fVxuXG5cblx0YWRkVG9BcGk6IGRvIC0+XG5cdFx0YXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ11cblxuXHRcdHJldHVybiAtPlxuXHRcdFx0c2VsZiA9IHRoaXNcblxuXHRcdFx0IyBUaHJvdyBhbiBlcnJvciBpZiBhIHJvdXRlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgYXQgdGhpcyBwYXRoXG5cdFx0XHQjIFRPRE86IENoZWNrIGZvciBjb2xsaXNpb25zIHdpdGggcGF0aHMgdGhhdCBmb2xsb3cgc2FtZSBwYXR0ZXJuIHdpdGggZGlmZmVyZW50IHBhcmFtZXRlciBuYW1lc1xuXHRcdFx0aWYgXy5jb250YWlucyBAYXBpLl9jb25maWcucGF0aHMsIEBwYXRoXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiAje0BwYXRofVwiXG5cblx0XHRcdCMgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgT1BUSU9OUyBlbmRwb2ludCB3aXRoIG91ciBvd25cblx0XHRcdEBlbmRwb2ludHMgPSBfLmV4dGVuZCBvcHRpb25zOiBAYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCwgQGVuZHBvaW50c1xuXG5cdFx0XHQjIENvbmZpZ3VyZSBlYWNoIGVuZHBvaW50IG9uIHRoaXMgcm91dGVcblx0XHRcdEBfcmVzb2x2ZUVuZHBvaW50cygpXG5cdFx0XHRAX2NvbmZpZ3VyZUVuZHBvaW50cygpXG5cblx0XHRcdCMgQWRkIHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHBhdGhzXG5cdFx0XHRAYXBpLl9jb25maWcucGF0aHMucHVzaCBAcGF0aFxuXG5cdFx0XHRhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyIGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxuXHRcdFx0cmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cblx0XHRcdFx0Xy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXG5cblx0XHRcdCMgU2V0dXAgZW5kcG9pbnRzIG9uIHJvdXRlXG5cdFx0XHRmdWxsUGF0aCA9IEBhcGkuX2NvbmZpZy5hcGlQYXRoICsgQHBhdGhcblx0XHRcdF8uZWFjaCBhbGxvd2VkTWV0aG9kcywgKG1ldGhvZCkgLT5cblx0XHRcdFx0ZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdXG5cdFx0XHRcdEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cblx0XHRcdFx0XHQjIEFkZCBmdW5jdGlvbiB0byBlbmRwb2ludCBjb250ZXh0IGZvciBpbmRpY2F0aW5nIGEgcmVzcG9uc2UgaGFzIGJlZW4gaW5pdGlhdGVkIG1hbnVhbGx5XG5cdFx0XHRcdFx0cmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdGRvbmVGdW5jID0gLT5cblx0XHRcdFx0XHRcdHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZVxuXG5cdFx0XHRcdFx0ZW5kcG9pbnRDb250ZXh0ID1cblx0XHRcdFx0XHRcdHVybFBhcmFtczogcmVxLnBhcmFtc1xuXHRcdFx0XHRcdFx0cXVlcnlQYXJhbXM6IHJlcS5xdWVyeVxuXHRcdFx0XHRcdFx0Ym9keVBhcmFtczogcmVxLmJvZHlcblx0XHRcdFx0XHRcdHJlcXVlc3Q6IHJlcVxuXHRcdFx0XHRcdFx0cmVzcG9uc2U6IHJlc1xuXHRcdFx0XHRcdFx0ZG9uZTogZG9uZUZ1bmNcblx0XHRcdFx0XHQjIEFkZCBlbmRwb2ludCBjb25maWcgb3B0aW9ucyB0byBjb250ZXh0XG5cdFx0XHRcdFx0Xy5leHRlbmQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuXG5cdFx0XHRcdFx0IyBSdW4gdGhlIHJlcXVlc3RlZCBlbmRwb2ludFxuXHRcdFx0XHRcdHJlc3BvbnNlRGF0YSA9IG51bGxcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdCMgRG8gZXhhY3RseSB3aGF0IElyb24gUm91dGVyIHdvdWxkIGhhdmUgZG9uZSwgdG8gYXZvaWQgY2hhbmdpbmcgdGhlIEFQSVxuXHRcdFx0XHRcdFx0aXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcblx0XHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcdFx0aWYgcmVzcG9uc2VJbml0aWF0ZWRcblx0XHRcdFx0XHRcdCMgRW5zdXJlIHRoZSByZXNwb25zZSBpcyBwcm9wZXJseSBjb21wbGV0ZWRcblx0XHRcdFx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgcmVzLmhlYWRlcnNTZW50XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcblx0XHRcdFx0XHRcdGVsc2UgaWYgcmVzcG9uc2VEYXRhIGlzIG51bGwgb3IgcmVzcG9uc2VEYXRhIGlzIHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXG5cblx0XHRcdFx0XHQjIEdlbmVyYXRlIGFuZCByZXR1cm4gdGhlIGh0dHAgcmVzcG9uc2UsIGhhbmRsaW5nIHRoZSBkaWZmZXJlbnQgZW5kcG9pbnQgcmVzcG9uc2UgdHlwZXNcblx0XHRcdFx0XHRpZiByZXNwb25zZURhdGEuYm9keSBhbmQgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIG9yIHJlc3BvbnNlRGF0YS5oZWFkZXJzKVxuXHRcdFx0XHRcdFx0c2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnNcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhXG5cblx0XHRcdF8uZWFjaCByZWplY3RlZE1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cblx0XHRcdFx0XHRyZXNwb25zZURhdGEgPSBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXG5cdFx0XHRcdFx0aGVhZGVycyA9ICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxuXHRcdFx0XHRcdHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVyc1xuXG5cblx0IyMjXG5cdFx0Q29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG5cdFx0ZnVuY3Rpb25cblxuXHRcdEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuXHQjIyNcblx0X3Jlc29sdmVFbmRwb2ludHM6IC0+XG5cdFx0Xy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIC0+XG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24oZW5kcG9pbnQpXG5cdFx0XHRcdGVuZHBvaW50c1ttZXRob2RdID0ge2FjdGlvbjogZW5kcG9pbnR9XG5cdFx0cmV0dXJuXG5cblxuXHQjIyNcblx0XHRDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG5cdFx0YmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG5cblx0XHRBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuXHRcdGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG5cdFx0b3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cblx0XHRBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcblx0XHRhY2Nlc3NlZCBhdCA8Y29kZT5lbmRwb2ludC5hdXRoUmVxdWlyZWQ8L2NvZGU+IGFuZCA8Y29kZT5lbmRwb2ludC5yb2xlUmVxdWlyZWQ8L2NvZGU+LFxuXHRcdHJlc3BlY3RpdmVseS5cblxuXHRcdEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuXHRcdEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcblx0IyMjXG5cdF9jb25maWd1cmVFbmRwb2ludHM6IC0+XG5cdFx0Xy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kKSAtPlxuXHRcdFx0aWYgbWV0aG9kIGlzbnQgJ29wdGlvbnMnXG5cdFx0XHRcdCMgQ29uZmlndXJlIGFjY2VwdGFibGUgcm9sZXNcblx0XHRcdFx0aWYgbm90IEBvcHRpb25zPy5yb2xlUmVxdWlyZWRcblx0XHRcdFx0XHRAb3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXVxuXHRcdFx0XHRpZiBub3QgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG5cdFx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW11cblx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbiBlbmRwb2ludC5yb2xlUmVxdWlyZWQsIEBvcHRpb25zLnJvbGVSZXF1aXJlZFxuXHRcdFx0XHQjIE1ha2UgaXQgZWFzaWVyIHRvIGNoZWNrIGlmIG5vIHJvbGVzIGFyZSByZXF1aXJlZFxuXHRcdFx0XHRpZiBfLmlzRW1wdHkgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG5cdFx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2VcblxuXHRcdFx0XHQjIENvbmZpZ3VyZSBhdXRoIHJlcXVpcmVtZW50XG5cdFx0XHRcdGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZCBpcyB1bmRlZmluZWRcblx0XHRcdFx0XHRpZiBAb3B0aW9ucz8uYXV0aFJlcXVpcmVkIG9yIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuXHRcdFx0XHRcdFx0ZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlXG5cblx0XHRcdFx0aWYgQG9wdGlvbnM/LnNwYWNlUmVxdWlyZWRcblx0XHRcdFx0XHRlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gQG9wdGlvbnMuc3BhY2VSZXF1aXJlZFxuXHRcdFx0XHRyZXR1cm5cblx0XHQsIHRoaXNcblx0XHRyZXR1cm5cblxuXG5cdCMjI1xuXHRcdEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcblxuXHRcdEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xuXHQjIyNcblx0X2NhbGxFbmRwb2ludDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG5cdFx0IyBDYWxsIHRoZSBlbmRwb2ludCBpZiBhdXRoZW50aWNhdGlvbiBkb2Vzbid0IGZhaWxcblx0XHRpZiBAX2F1dGhBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cdFx0XHRpZiBAX3JvbGVBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cdFx0XHRcdGlmIEBfc3BhY2VBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cdFx0XHRcdFx0I2VuZHBvaW50LmFjdGlvbi5jYWxsIGVuZHBvaW50Q29udGV4dFxuXHRcdFx0XHRcdGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cblx0XHRcdFx0XHRcdGlzU2ltdWxhdGlvbjogdHJ1ZSxcblx0XHRcdFx0XHRcdHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcblx0XHRcdFx0XHRcdGNvbm5lY3Rpb246IG51bGwsXG5cdFx0XHRcdFx0XHRyYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxuXG5cdFx0XHRcdFx0cmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlIGludm9jYXRpb24sIC0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuXHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcblx0XHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ31cblx0XHRlbHNlXG5cdFx0XHRzdGF0dXNDb2RlOiA0MDFcblx0XHRcdGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nfVxuXG5cblx0IyMjXG5cdFx0QXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuXG5cdFx0T25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxuXHRcdGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxuXHRcdGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuXG5cdFx0QHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuXHQjIyNcblx0X2F1dGhBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG5cdFx0aWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkXG5cdFx0XHRAX2F1dGhlbnRpY2F0ZSBlbmRwb2ludENvbnRleHRcblx0XHRlbHNlIHRydWVcblxuXG5cdCMjI1xuXHRcdFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG5cblx0XHRJZiB2ZXJpZmllZCwgYXR0YWNoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgdG8gdGhlIGNvbnRleHQuXG5cblx0XHRAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcblx0IyMjXG5cdF9hdXRoZW50aWNhdGU6IChlbmRwb2ludENvbnRleHQpIC0+XG5cdFx0IyBHZXQgYXV0aCBpbmZvXG5cdFx0YXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXG5cblx0XHQjIEdldCB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxuXHRcdGlmIGF1dGg/LnVzZXJJZCBhbmQgYXV0aD8udG9rZW4gYW5kIG5vdCBhdXRoPy51c2VyXG5cdFx0XHR1c2VyU2VsZWN0b3IgPSB7fVxuXHRcdFx0dXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkXG5cdFx0XHR1c2VyU2VsZWN0b3JbQGFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlblxuXHRcdFx0YXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUgdXNlclNlbGVjdG9yXG5cblx0XHQjIEF0dGFjaCB0aGUgdXNlciBhbmQgdGhlaXIgSUQgdG8gdGhlIGNvbnRleHQgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG5cdFx0aWYgYXV0aD8udXNlclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXJcblx0XHRcdGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkXG5cdFx0XHR0cnVlXG5cdFx0ZWxzZSBmYWxzZVxuXG5cdCMjI1xuXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG5cblx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG5cblx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuXHRcdFx0XHRcdFx0IGVuZHBvaW50XG5cdCMjI1xuXHRfc3BhY2VBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG5cdFx0aWYgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZFxuXHRcdFx0YXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXG5cdFx0XHRpZiBhdXRoPy5zcGFjZUlkXG5cdFx0XHRcdHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aC51c2VySWQsIHNwYWNlOmF1dGguc3BhY2VJZH0pLmNvdW50KClcblx0XHRcdFx0aWYgc3BhY2VfdXNlcnNfY291bnRcblx0XHRcdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZClcblx0XHRcdFx0XHQjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcblx0XHRcdFx0XHRpZiBzcGFjZT8uaXNfcGFpZCBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpPj0wXG5cdFx0XHRcdFx0XHRlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZFxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIlxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0cmV0dXJuIHRydWVcblxuXHQjIyNcblx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuXG5cdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuXG5cdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcblx0XHRcdFx0XHRcdCBlbmRwb2ludFxuXHQjIyNcblx0X3JvbGVBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG5cdFx0aWYgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG5cdFx0XHRpZiBfLmlzRW1wdHkgXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcylcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0dHJ1ZVxuXG5cblx0IyMjXG5cdFx0UmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3Rcblx0IyMjXG5cdF9yZXNwb25kOiAocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGU9MjAwLCBoZWFkZXJzPXt9KSAtPlxuXHRcdCMgT3ZlcnJpZGUgYW55IGRlZmF1bHQgaGVhZGVycyB0aGF0IGhhdmUgYmVlbiBwcm92aWRlZCAoa2V5cyBhcmUgbm9ybWFsaXplZCB0byBiZSBjYXNlIGluc2Vuc2l0aXZlKVxuXHRcdCMgVE9ETzogQ29uc2lkZXIgb25seSBsb3dlcmNhc2luZyB0aGUgaGVhZGVyIGtleXMgd2UgbmVlZCBub3JtYWxpemVkLCBsaWtlIENvbnRlbnQtVHlwZVxuXHRcdGRlZmF1bHRIZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIEBhcGkuX2NvbmZpZy5kZWZhdWx0SGVhZGVyc1xuXHRcdGhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgaGVhZGVyc1xuXHRcdGhlYWRlcnMgPSBfLmV4dGVuZCBkZWZhdWx0SGVhZGVycywgaGVhZGVyc1xuXG5cdFx0IyBQcmVwYXJlIEpTT04gYm9keSBmb3IgcmVzcG9uc2Ugd2hlbiBDb250ZW50LVR5cGUgaW5kaWNhdGVzIEpTT04gdHlwZVxuXHRcdGlmIGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSBpc250IG51bGxcblx0XHRcdGlmIEBhcGkuX2NvbmZpZy5wcmV0dHlKc29uXG5cdFx0XHRcdGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5LCB1bmRlZmluZWQsIDJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Ym9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHlcblxuXHRcdCMgU2VuZCByZXNwb25zZVxuXHRcdHNlbmRSZXNwb25zZSA9IC0+XG5cdFx0XHRyZXNwb25zZS53cml0ZUhlYWQgc3RhdHVzQ29kZSwgaGVhZGVyc1xuXHRcdFx0cmVzcG9uc2Uud3JpdGUgYm9keVxuXHRcdFx0cmVzcG9uc2UuZW5kKClcblx0XHRpZiBzdGF0dXNDb2RlIGluIFs0MDEsIDQwM11cblx0XHRcdCMgSGFja2VycyBjYW4gbWVhc3VyZSB0aGUgcmVzcG9uc2UgdGltZSB0byBkZXRlcm1pbmUgdGhpbmdzIGxpa2Ugd2hldGhlciB0aGUgNDAxIHJlc3BvbnNlIHdhc1xuXHRcdFx0IyBjYXVzZWQgYnkgYmFkIHVzZXIgaWQgdnMgYmFkIHBhc3N3b3JkLlxuXHRcdFx0IyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXG5cdFx0XHQjIERlbGF5IGJ5IGEgcmFuZG9tIGFtb3VudCB0byByZWR1Y2UgdGhlIGFiaWxpdHkgZm9yIGEgaGFja2VyIHRvIGRldGVybWluZSB0aGUgcmVzcG9uc2UgdGltZS5cblx0XHRcdCMgU2VlIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvQmxvY2tpbmdfQnJ1dGVfRm9yY2VfQXR0YWNrcyNGaW5kaW5nX090aGVyX0NvdW50ZXJtZWFzdXJlc1xuXHRcdFx0IyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xuXHRcdFx0bWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDBcblx0XHRcdHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKClcblx0XHRcdGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXG5cdFx0XHRNZXRlb3Iuc2V0VGltZW91dCBzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHNcblx0XHRlbHNlXG5cdFx0XHRzZW5kUmVzcG9uc2UoKVxuXG5cdCMjI1xuXHRcdFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2Vcblx0IyMjXG5cdF9sb3dlckNhc2VLZXlzOiAob2JqZWN0KSAtPlxuXHRcdF8uY2hhaW4gb2JqZWN0XG5cdFx0LnBhaXJzKClcblx0XHQubWFwIChhdHRyKSAtPlxuXHRcdFx0W2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cblx0XHQub2JqZWN0KClcblx0XHQudmFsdWUoKVxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICBcdFx0Q29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gIFx0XHRmdW5jdGlvblxuICBcbiAgXHRcdEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gIFx0XHRiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcbiAgXG4gIFx0XHRBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICBcdFx0ZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcbiAgXHRcdG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuICBcbiAgXHRcdEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICBcdFx0YWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgXHRcdHJlc3BlY3RpdmVseS5cbiAgXG4gIFx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgXHRcdEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jb25maWd1cmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAobWV0aG9kICE9PSAnb3B0aW9ucycpIHtcbiAgICAgICAgaWYgKCEoKHJlZiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZi5yb2xlUmVxdWlyZWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQpO1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50LnJvbGVSZXF1aXJlZCkpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAoKChyZWYxID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMS5hdXRoUmVxdWlyZWQgOiB2b2lkIDApIHx8IGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgocmVmMiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjIuc3BhY2VSZXF1aXJlZCA6IHZvaWQgMCkge1xuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSB0aGlzLm9wdGlvbnMuc3BhY2VSZXF1aXJlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcbiAgXG4gIFx0XHRAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0T25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxuICBcdFx0aW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gIFx0XHRpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gIFx0XHRAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aEFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5hdXRoUmVxdWlyZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGUoZW5kcG9pbnRDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICBcdFx0SWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuICBcbiAgXHRcdEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCkge1xuICAgIHZhciBhdXRoLCB1c2VyU2VsZWN0b3I7XG4gICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICBpZiAoKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlcklkIDogdm9pZCAwKSAmJiAoYXV0aCAhPSBudWxsID8gYXV0aC50b2tlbiA6IHZvaWQgMCkgJiYgIShhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgICB1c2VyU2VsZWN0b3IgPSB7fTtcbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZDtcbiAgICAgIHVzZXJTZWxlY3Rvclt0aGlzLmFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlbjtcbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJTZWxlY3Rvcik7XG4gICAgfVxuICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApIHtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyO1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gIFx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICBcdFx0XHRcdFx0XHQgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gIFx0XHRcdFx0XHRcdCBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3JvbGVBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICBpZiAoXy5pc0VtcHR5KF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzcG9uZCA9IGZ1bmN0aW9uKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzLCBkZWxheUluTWlsbGlzZWNvbmRzLCBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcywgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28sIHNlbmRSZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PSBudWxsKSB7XG4gICAgICBzdGF0dXNDb2RlID0gMjAwO1xuICAgIH1cbiAgICBpZiAoaGVhZGVycyA9PSBudWxsKSB7XG4gICAgICBoZWFkZXJzID0ge307XG4gICAgfVxuICAgIGRlZmF1bHRIZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyh0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyhoZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gXy5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuICAgIGlmIChoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFwaS5fY29uZmlnLnByZXR0eUpzb24pIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHksIHZvaWQgMCwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoYm9keSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZW5kKCk7XG4gICAgfTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxIHx8IHN0YXR1c0NvZGUgPT09IDQwMykge1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDA7XG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd287XG4gICAgICByZXR1cm4gTWV0ZW9yLnNldFRpbWVvdXQoc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblxuY2xhc3MgQE9kYXRhUmVzdGl2dXNcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0QF9yb3V0ZXMgPSBbXVxuXHRcdEBfY29uZmlnID1cblx0XHRcdHBhdGhzOiBbXVxuXHRcdFx0dXNlRGVmYXVsdEF1dGg6IGZhbHNlXG5cdFx0XHRhcGlQYXRoOiAnYXBpLydcblx0XHRcdHZlcnNpb246IG51bGxcblx0XHRcdHByZXR0eUpzb246IGZhbHNlXG5cdFx0XHRhdXRoOlxuXHRcdFx0XHR0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbidcblx0XHRcdFx0dXNlcjogLT5cblx0XHRcdFx0XHRjb29raWVzID0gbmV3IENvb2tpZXMoIEByZXF1ZXN0LCBAcmVzcG9uc2UgKVxuXHRcdFx0XHRcdHVzZXJJZCA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRcdFx0YXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblx0XHRcdFx0XHRzcGFjZUlkID0gQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IEB1cmxQYXJhbXNbJ3NwYWNlSWQnXVxuXHRcdFx0XHRcdGlmIGF1dGhUb2tlblxuXHRcdFx0XHRcdFx0dG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aFRva2VuXG5cdFx0XHRcdFx0aWYgQHJlcXVlc3QudXNlcklkXG5cdFx0XHRcdFx0XHRfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogQHJlcXVlc3QudXNlcklkfSlcblx0XHRcdFx0XHRcdHVzZXI6IF91c2VyXG5cdFx0XHRcdFx0XHR1c2VySWQ6IHVzZXJJZFxuXHRcdFx0XHRcdFx0c3BhY2VJZDogc3BhY2VJZFxuXHRcdFx0XHRcdFx0dG9rZW46IHRva2VuXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dXNlcklkOiB1c2VySWRcblx0XHRcdFx0XHRcdHNwYWNlSWQ6IHNwYWNlSWRcblx0XHRcdFx0XHRcdHRva2VuOiB0b2tlblxuXHRcdFx0ZGVmYXVsdEhlYWRlcnM6XG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdGVuYWJsZUNvcnM6IHRydWVcblxuXHRcdCMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXG5cdFx0Xy5leHRlbmQgQF9jb25maWcsIG9wdGlvbnNcblxuXHRcdGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcblx0XHRcdGNvcnNIZWFkZXJzID1cblx0XHRcdFx0J0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xuXHRcdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0LCBPRGF0YS1WZXJzaW9uJ1xuXG5cdFx0XHRpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxuXHRcdFx0XHRjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuLCBYLVNwYWNlLUlkJ1xuXG5cdFx0XHQjIFNldCBkZWZhdWx0IGhlYWRlciB0byBlbmFibGUgQ09SUyBpZiBjb25maWd1cmVkXG5cdFx0XHRfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcblxuXHRcdFx0aWYgbm90IEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcblx0XHRcdFx0QF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XG5cdFx0XHRcdFx0QHJlc3BvbnNlLndyaXRlSGVhZCAyMDAsIGNvcnNIZWFkZXJzXG5cdFx0XHRcdFx0QGRvbmUoKVxuXG5cdFx0IyBOb3JtYWxpemUgdGhlIEFQSSBwYXRoXG5cdFx0aWYgQF9jb25maWcuYXBpUGF0aFswXSBpcyAnLydcblx0XHRcdEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcblx0XHRpZiBfLmxhc3QoQF9jb25maWcuYXBpUGF0aCkgaXNudCAnLydcblx0XHRcdEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoICsgJy8nXG5cblx0XHQjIFVSTCBwYXRoIHZlcnNpb25pbmcgaXMgdGhlIG9ubHkgdHlwZSBvZiBBUEkgdmVyc2lvbmluZyBjdXJyZW50bHkgYXZhaWxhYmxlLCBzbyBpZiBhIHZlcnNpb24gaXNcblx0XHQjIHByb3ZpZGVkLCBhcHBlbmQgaXQgdG8gdGhlIGJhc2UgcGF0aCBvZiB0aGUgQVBJXG5cdFx0aWYgQF9jb25maWcudmVyc2lvblxuXHRcdFx0QF9jb25maWcuYXBpUGF0aCArPSBAX2NvbmZpZy52ZXJzaW9uICsgJy8nXG5cblx0XHQjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxuXHRcdGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG5cdFx0XHRAX2luaXRBdXRoKClcblx0XHRlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcblx0XHRcdEBfaW5pdEF1dGgoKVxuXHRcdFx0Y29uc29sZS53YXJuICdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgK1xuXHRcdFx0XHRcdCdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcblxuXHRcdHJldHVybiB0aGlzXG5cblxuXHQjIyMqXG5cdFx0QWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuXG5cdFx0QHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuXHRcdEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuXHRcdEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcblx0XHRAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcblx0XHRAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG5cdFx0QHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuXHRcdFx0XHRjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG5cdFx0XHRcdGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cblx0IyMjXG5cdGFkZFJvdXRlOiAocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSAtPlxuXHRcdCMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXG5cdFx0cm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKVxuXHRcdEBfcm91dGVzLnB1c2gocm91dGUpXG5cblx0XHRyb3V0ZS5hZGRUb0FwaSgpXG5cblx0XHRyZXR1cm4gdGhpc1xuXG5cblx0IyMjKlxuXHRcdEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcblx0IyMjXG5cdGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxuXHRcdG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ11cblx0XHRtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddXG5cblx0XHQjIEdyYWIgdGhlIHNldCBvZiBlbmRwb2ludHNcblx0XHRpZiBjb2xsZWN0aW9uIGlzIE1ldGVvci51c2Vyc1xuXHRcdFx0Y29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcblx0XHRlbHNlXG5cdFx0XHRjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF9jb2xsZWN0aW9uRW5kcG9pbnRzXG5cblx0XHQjIEZsYXR0ZW4gdGhlIG9wdGlvbnMgYW5kIHNldCBkZWZhdWx0cyBpZiBuZWNlc3Nhcnlcblx0XHRlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyBvciB7fVxuXHRcdHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XG5cdFx0ZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIG9yIFtdXG5cdFx0IyBVc2UgY29sbGVjdGlvbiBuYW1lIGFzIGRlZmF1bHQgcGF0aFxuXHRcdHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxuXG5cdFx0IyBTZXBhcmF0ZSB0aGUgcmVxdWVzdGVkIGVuZHBvaW50cyBieSB0aGUgcm91dGUgdGhleSBiZWxvbmcgdG8gKG9uZSBmb3Igb3BlcmF0aW5nIG9uIHRoZSBlbnRpcmVcblx0XHQjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXG5cdFx0Y29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge31cblx0XHRlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9XG5cdFx0aWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcblx0XHRcdCMgR2VuZXJhdGUgYWxsIGVuZHBvaW50cyBvbiB0aGlzIGNvbGxlY3Rpb25cblx0XHRcdF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHQjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcblx0XHRcdFx0aWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cblx0XHRcdFx0XHRfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG5cdFx0XHRcdGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0LCB0aGlzXG5cdFx0ZWxzZVxuXHRcdFx0IyBHZW5lcmF0ZSBhbnkgZW5kcG9pbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZXhjbHVkZWRcblx0XHRcdF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHRpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXG5cdFx0XHRcdFx0IyBDb25maWd1cmUgZW5kcG9pbnQgYW5kIG1hcCB0byBpdCdzIGh0dHAgbWV0aG9kXG5cdFx0XHRcdFx0IyBUT0RPOiBDb25zaWRlciBwcmVkZWZpbmluZyBhIG1hcCBvZiBtZXRob2RzIHRvIHRoZWlyIGh0dHAgbWV0aG9kIHR5cGUgKGUuZy4sIGdldEFsbDogZ2V0KVxuXHRcdFx0XHRcdGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXG5cdFx0XHRcdFx0Y29uZmlndXJlZEVuZHBvaW50ID0ge31cblx0XHRcdFx0XHRfLmVhY2ggY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIChhY3Rpb24sIG1ldGhvZFR5cGUpIC0+XG5cdFx0XHRcdFx0XHRjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxuXHRcdFx0XHRcdFx0XHRfLmNoYWluIGFjdGlvblxuXHRcdFx0XHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHRcdFx0XHQuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xuXHRcdFx0XHRcdFx0XHQudmFsdWUoKVxuXHRcdFx0XHRcdCMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuXHRcdFx0XHRcdGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXG5cdFx0XHRcdFx0XHRfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuXHRcdFx0XHRcdGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0LCB0aGlzXG5cblx0XHQjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcblx0XHRAYWRkUm91dGUgcGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHNcblx0XHRAYWRkUm91dGUgXCIje3BhdGh9LzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzXG5cblx0XHRyZXR1cm4gdGhpc1xuXG5cblx0IyMjKlxuXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuXHQjIyNcblx0X2NvbGxlY3Rpb25FbmRwb2ludHM6XG5cdFx0Z2V0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRcdHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXG5cdFx0XHRcdFx0aWYgZW50aXR5XG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cblx0XHRwdXQ6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0cHV0OlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcblx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcblx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cblx0XHRkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0ZGVsZXRlOlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cblx0XHRwb3N0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdHBvc3Q6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuXHRcdFx0XHRcdGlmIGVudGl0eVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRnZXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRzZWxlY3RvciA9IHt9XG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXG5cdFx0XHRcdFx0aWYgZW50aXRpZXNcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cblxuXG5cdCMjIypcblx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG5cdCMjI1xuXHRfdXNlckNvbGxlY3Rpb25FbmRwb2ludHM6XG5cdFx0Z2V0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcblx0XHRcdFx0XHRpZiBlbnRpdHlcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuXHRcdHB1dDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRwdXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxuXHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuXHRcdFx0XHRcdFx0e3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cblx0XHRkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0ZGVsZXRlOlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0aWYgY29sbGVjdGlvbi5yZW1vdmUgQHVybFBhcmFtcy5pZFxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cblx0XHRwb3N0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdHBvc3Q6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHQjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcblx0XHRcdFx0XHRlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIgQGJvZHlQYXJhbXNcblx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWQsIGZpZWxkczogcHJvZmlsZTogMVxuXHRcdFx0XHRcdGlmIGVudGl0eVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnfVxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRnZXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXG5cdFx0XHRcdFx0aWYgZW50aXRpZXNcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnfVxuXG5cblx0IyMjXG5cdFx0QWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuXHQjIyNcblx0X2luaXRBdXRoOiAtPlxuXHRcdHNlbGYgPSB0aGlzXG5cdFx0IyMjXG5cdFx0XHRBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG5cblx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG5cdFx0XHRhZGRpbmcgaG9vaykuXG5cdFx0IyMjXG5cdFx0QGFkZFJvdXRlICdsb2dpbicsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSxcblx0XHRcdHBvc3Q6IC0+XG5cdFx0XHRcdCMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcblx0XHRcdFx0dXNlciA9IHt9XG5cdFx0XHRcdGlmIEBib2R5UGFyYW1zLnVzZXJcblx0XHRcdFx0XHRpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxuXHRcdFx0XHRcdFx0dXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxuXHRcdFx0XHRlbHNlIGlmIEBib2R5UGFyYW1zLnVzZXJuYW1lXG5cdFx0XHRcdFx0dXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJuYW1lXG5cdFx0XHRcdGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcblx0XHRcdFx0XHR1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMuZW1haWxcblxuXHRcdFx0XHQjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0YXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQgdXNlciwgQGJvZHlQYXJhbXMucGFzc3dvcmRcblx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZVxuXHRcdFx0XHRcdHJldHVybiB7fSA9XG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiBlLmVycm9yXG5cdFx0XHRcdFx0XHRib2R5OiBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6IGUucmVhc29uXG5cblx0XHRcdFx0IyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxuXHRcdFx0XHQjIFRPRE86IENvbnNpZGVyIHJldHVybmluZyB0aGUgdXNlciBpbiBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKCksIGluc3RlYWQgb2YgZmV0Y2hpbmcgaXQgYWdhaW4gaGVyZVxuXHRcdFx0XHRpZiBhdXRoLnVzZXJJZCBhbmQgYXV0aC5hdXRoVG9rZW5cblx0XHRcdFx0XHRzZWFyY2hRdWVyeSA9IHt9XG5cdFx0XHRcdFx0c2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGguYXV0aFRva2VuXG5cdFx0XHRcdFx0QHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRcdFx0J19pZCc6IGF1dGgudXNlcklkXG5cdFx0XHRcdFx0XHRzZWFyY2hRdWVyeVxuXHRcdFx0XHRcdEB1c2VySWQgPSBAdXNlcj8uX2lkXG5cblx0XHRcdFx0cmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGF1dGh9XG5cblx0XHRcdFx0IyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuXHRcdFx0XHRleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbj8uY2FsbCh0aGlzKVxuXHRcdFx0XHRpZiBleHRyYURhdGE/XG5cdFx0XHRcdFx0Xy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG5cdFx0XHRcdHJlc3BvbnNlXG5cblx0XHRsb2dvdXQgPSAtPlxuXHRcdFx0IyBSZW1vdmUgdGhlIGdpdmVuIGF1dGggdG9rZW4gZnJvbSB0aGUgdXNlcidzIGFjY291bnRcblx0XHRcdGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cblx0XHRcdHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlblxuXHRcdFx0aW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xuXHRcdFx0dG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgMCwgaW5kZXhcblx0XHRcdHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgaW5kZXggKyAxXG5cdFx0XHR0b2tlblRvUmVtb3ZlID0ge31cblx0XHRcdHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW5cblx0XHRcdHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge31cblx0XHRcdHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXG5cdFx0XHRNZXRlb3IudXNlcnMudXBkYXRlIEB1c2VyLl9pZCwgeyRwdWxsOiB0b2tlblJlbW92YWxRdWVyeX1cblxuXHRcdFx0cmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxuXG5cdFx0XHQjIENhbGwgdGhlIGxvZ291dCBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuXHRcdFx0ZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXG5cdFx0XHRpZiBleHRyYURhdGE/XG5cdFx0XHRcdF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcblxuXHRcdFx0cmVzcG9uc2VcblxuXHRcdCMjI1xuXHRcdFx0QWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcblxuXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuXHRcdFx0YWRkaW5nIGhvb2spLlxuXHRcdCMjI1xuXHRcdEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXG5cdFx0XHRnZXQ6IC0+XG5cdFx0XHRcdGNvbnNvbGUud2FybiBcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXG5cdFx0XHRcdHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKVxuXHRcdFx0cG9zdDogbG9nb3V0XG5cbk9kYXRhUmVzdGl2dXMgPSBAT2RhdGFSZXN0aXZ1c1xuIiwidmFyIENvb2tpZXMsIE9kYXRhUmVzdGl2dXMsIGJhc2ljQXV0aCxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG5iYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxudGhpcy5PZGF0YVJlc3RpdnVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBPZGF0YVJlc3RpdnVzKG9wdGlvbnMpIHtcbiAgICB2YXIgY29yc0hlYWRlcnM7XG4gICAgdGhpcy5fcm91dGVzID0gW107XG4gICAgdGhpcy5fY29uZmlnID0ge1xuICAgICAgcGF0aHM6IFtdLFxuICAgICAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlLFxuICAgICAgYXBpUGF0aDogJ2FwaS8nLFxuICAgICAgdmVyc2lvbjogbnVsbCxcbiAgICAgIHByZXR0eUpzb246IGZhbHNlLFxuICAgICAgYXV0aDoge1xuICAgICAgICB0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbicsXG4gICAgICAgIHVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfdXNlciwgYXV0aFRva2VuLCBjb29raWVzLCBzcGFjZUlkLCB0b2tlbiwgdXNlcklkO1xuICAgICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyh0aGlzLnJlcXVlc3QsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIHVzZXJJZCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgICAgICAgc3BhY2VJZCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgdGhpcy51cmxQYXJhbXNbJ3NwYWNlSWQnXTtcbiAgICAgICAgICBpZiAoYXV0aFRva2VuKSB7XG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnVzZXJJZCkge1xuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXI6IF91c2VyLFxuICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgc3BhY2VJZDogc3BhY2VJZCxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgc3BhY2VJZDogc3BhY2VJZCxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXG4gICAgfTtcbiAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcsIG9wdGlvbnMpO1xuICAgIGlmICh0aGlzLl9jb25maWcuZW5hYmxlQ29ycykge1xuICAgICAgY29yc0hlYWRlcnMgPSB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQsIE9EYXRhLVZlcnNpb24nXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuLCBYLVNwYWNlLUlkJztcbiAgICAgIH1cbiAgICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnMpO1xuICAgICAgaWYgKCF0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgY29yc0hlYWRlcnMpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hcGlQYXRoWzBdID09PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGguc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChfLmxhc3QodGhpcy5fY29uZmlnLmFwaVBhdGgpICE9PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGggKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmVyc2lvbikge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggKz0gdGhpcy5fY29uZmlnLnZlcnNpb24gKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jb25maWcudXNlQXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICsgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgXHRcdEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcbiAgXG4gIFx0XHRAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG4gIFx0XHRAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgXHRcdEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgXHRcdEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICBcdFx0QHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxuICBcdFx0QHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICBcdFx0XHRcdGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcbiAgXHRcdFx0XHRhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLmFkZFJvdXRlID0gZnVuY3Rpb24ocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSB7XG4gICAgdmFyIHJvdXRlO1xuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cyk7XG4gICAgdGhpcy5fcm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJvdXRlLmFkZFRvQXBpKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgXHRcdEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuYWRkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbkVuZHBvaW50cywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24sIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kcywgbWV0aG9kc09uQ29sbGVjdGlvbiwgcGF0aCwgcm91dGVPcHRpb25zO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXTtcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddO1xuICAgIGlmIChjb2xsZWN0aW9uID09PSBNZXRlb3IudXNlcnMpIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX2NvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIHx8IHt9O1xuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIHx8IHt9O1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyB8fCBbXTtcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIHx8IGNvbGxlY3Rpb24uX25hbWU7XG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgJiYgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKSkge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBjb25maWd1cmVkRW5kcG9pbnQsIGVuZHBvaW50T3B0aW9ucztcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kKSA8IDAgJiYgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF07XG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge307XG4gICAgICAgICAgXy5lYWNoKGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCBmdW5jdGlvbihhY3Rpb24sIG1ldGhvZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPSBfLmNoYWluKGFjdGlvbikuY2xvbmUoKS5leHRlbmQoZW5kcG9pbnRPcHRpb25zKS52YWx1ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIHRoaXMuYWRkUm91dGUocGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMpO1xuICAgIHRoaXMuYWRkUm91dGUocGF0aCArIFwiLzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICBcdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLl9jb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIHtcbiAgICAgICAgICAgICAgJHNldDogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZShzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICB0aGlzLmJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0KHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcywgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQ7XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUodGhpcy51cmxQYXJhbXMuaWQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzO1xuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2VycydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLl9pbml0QXV0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dvdXQsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAvKlxuICAgIFx0XHRcdEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICBcdFx0XHRBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgIFx0XHRcdGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICB0aGlzLmFkZFJvdXRlKCdsb2dpbicsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBwb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF1dGgsIGUsIGV4dHJhRGF0YSwgcmVmLCByZWYxLCByZXNwb25zZSwgc2VhcmNoUXVlcnksIHVzZXI7XG4gICAgICAgIHVzZXIgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWUpIHtcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy5lbWFpbCkge1xuICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMuZW1haWw7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCh1c2VyLCB0aGlzLmJvZHlQYXJhbXMucGFzc3dvcmQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGUucmVhc29uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXV0aC51c2VySWQgJiYgYXV0aC5hdXRoVG9rZW4pIHtcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoLmF1dGhUb2tlbik7XG4gICAgICAgICAgdGhpcy51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgfSwgc2VhcmNoUXVlcnkpO1xuICAgICAgICAgIHRoaXMudXNlcklkID0gKHJlZiA9IHRoaXMudXNlcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgZGF0YTogYXV0aFxuICAgICAgICB9O1xuICAgICAgICBleHRyYURhdGEgPSAocmVmMSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluKSAhPSBudWxsID8gcmVmMS5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhUb2tlbiwgZXh0cmFEYXRhLCBoYXNoZWRUb2tlbiwgaW5kZXgsIHJlZiwgcmVzcG9uc2UsIHRva2VuRmllbGROYW1lLCB0b2tlbkxvY2F0aW9uLCB0b2tlblBhdGgsIHRva2VuUmVtb3ZhbFF1ZXJ5LCB0b2tlblRvUmVtb3ZlO1xuICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddO1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlbjtcbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9O1xuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlbjtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge307XG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZTtcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodGhpcy51c2VyLl9pZCwge1xuICAgICAgICAkcHVsbDogdG9rZW5SZW1vdmFsUXVlcnlcbiAgICAgIH0pO1xuICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBleHRyYURhdGEgPSAocmVmID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0KSAhPSBudWxsID8gcmVmLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdFx0QWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICBcdFx0XHRBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgXHRcdFx0YWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLmFkZFJvdXRlKCdsb2dvdXQnLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWVcbiAgICB9LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiKTtcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHBvc3Q6IGxvZ291dFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBPZGF0YVJlc3RpdnVzO1xuXG59KSgpO1xuXG5PZGF0YVJlc3RpdnVzID0gdGhpcy5PZGF0YVJlc3RpdnVzO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblxuXHRnZXRPYmplY3RzID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWVzKS0+XG5cdFx0ZGF0YSA9IHt9XG5cdFx0b2JqZWN0X25hbWVzLnNwbGl0KCcsJykuZm9yRWFjaCAob2JqZWN0X25hbWUpLT5cblx0XHRcdG9iamVjdCA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdFx0ZGF0YVtvYmplY3QubmFtZV0gPSBvYmplY3Rcblx0XHRyZXR1cm4gZGF0YTtcblxuXHRnZXRPYmplY3QgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxuXHRcdGRhdGEgPSBfLmNsb25lKENyZWF0b3IuT2JqZWN0c1tDcmVhdG9yLmdldE9iamVjdE5hbWUoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKV0pXG5cdFx0aWYgIWRhdGFcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuaXoOaViOeahGlkICN7b2JqZWN0X25hbWV9XCIpXG5cblx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkuZmV0Y2goKVxuXHRcdHBzZXRzID0geyBwc2V0c0FkbWluLCBwc2V0c1VzZXIsIHBzZXRzQ3VycmVudCB9XG5cblx0XHRvYmplY3RfcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cblx0XHRkZWxldGUgZGF0YS5saXN0X3ZpZXdzXG5cdFx0ZGVsZXRlIGRhdGEucGVybWlzc2lvbl9zZXRcblxuXHRcdGlmIG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd1JlYWRcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdFx0ZGF0YS5hbGxvd0VkaXQgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dFZGl0XG5cdFx0XHRkYXRhLmFsbG93RGVsZXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93RGVsZXRlXG5cdFx0XHRkYXRhLmFsbG93Q3JlYXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0XHRkYXRhLm1vZGlmeUFsbFJlY29yZHMgPSBvYmplY3RfcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xuXG5cdFx0XHRmaWVsZHMgPSB7fVxuXHRcdFx0Xy5mb3JFYWNoIGRhdGEuZmllbGRzLCAoZmllbGQsIGtleSktPlxuXHRcdFx0XHRfZmllbGQgPSBfLmNsb25lKGZpZWxkKVxuXG5cdFx0XHRcdGlmICFfZmllbGQubmFtZVxuXHRcdFx0XHRcdF9maWVsZC5uYW1lID0ga2V5XG5cblx0XHRcdFx0I+WwhuS4jeWPr+e8lui+keeahOWtl+auteiuvue9ruS4unJlYWRvbmx5ID0gdHJ1ZVxuXHRcdFx0XHRpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpID4gLTEpXG5cdFx0XHRcdFx0X2ZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0XHRcdCPkuI3ov5Tlm57kuI3lj6/op4HlrZfmrrVcblx0XHRcdFx0aWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA8IDApXG5cdFx0XHRcdFx0ZmllbGRzW2tleV0gPSBfZmllbGRcblxuXHRcdFx0ZGF0YS5maWVsZHMgPSBmaWVsZHNcblxuXHRcdGVsc2Vcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gZmFsc2VcblxuXHRcdHJldHVybiBkYXRhXG5cblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsIFN0ZWVkb3NPRGF0YS5BUElfUEFUSCArICcvb2JqZWN0cy86aWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdFx0dHJ5XG5cdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuXHRcdFx0aWYgIXVzZXJJZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXG5cblx0XHRcdHNwYWNlSWQgPSByZXEucGFyYW1zPy5zcGFjZUlkXG5cdFx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJNaXNzIHNwYWNlSWRcIilcblxuXHRcdFx0b2JqZWN0X25hbWUgPSByZXEucGFyYW1zPy5pZFxuXHRcdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3MgaWRcIilcblxuXHRcdFx0X29iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZE9uZSh7X2lkOiBvYmplY3RfbmFtZX0pXG5cblx0XHRcdGlmIF9vYmogJiYgX29iai5uYW1lXG5cdFx0XHRcdG9iamVjdF9uYW1lID0gX29iai5uYW1lXG5cblx0XHRcdGlmIG9iamVjdF9uYW1lLnNwbGl0KCcsJykubGVuZ3RoID4gMVxuXHRcdFx0XHRkYXRhID0gZ2V0T2JqZWN0cyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkYXRhID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogMjAwLFxuXHRcdFx0XHRkYXRhOiBkYXRhIHx8IHt9XG5cdFx0XHR9XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cblx0XHRcdH0iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGdldE9iamVjdCwgZ2V0T2JqZWN0cztcbiAgZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWVzKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHt9O1xuICAgIG9iamVjdF9uYW1lcy5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBvYmplY3Q7XG4gICAgICBvYmplY3QgPSBnZXRPYmplY3Qoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICByZXR1cm4gZGF0YVtvYmplY3QubmFtZV0gPSBvYmplY3Q7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG4gIGdldE9iamVjdCA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgZGF0YSwgZmllbGRzLCBvYmplY3RfcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1cnJlbnQsIHBzZXRzVXNlcjtcbiAgICBkYXRhID0gXy5jbG9uZShDcmVhdG9yLk9iamVjdHNbQ3JlYXRvci5nZXRPYmplY3ROYW1lKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSldKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuaXoOaViOeahGlkIFwiICsgb2JqZWN0X25hbWUpO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnRcbiAgICB9O1xuICAgIG9iamVjdF9wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgZGVsZXRlIGRhdGEubGlzdF92aWV3cztcbiAgICBkZWxldGUgZGF0YS5wZXJtaXNzaW9uX3NldDtcbiAgICBpZiAob2JqZWN0X3Blcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgICAgZGF0YS5hbGxvd1JlYWQgPSB0cnVlO1xuICAgICAgZGF0YS5hbGxvd0VkaXQgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dFZGl0O1xuICAgICAgZGF0YS5hbGxvd0RlbGV0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZTtcbiAgICAgIGRhdGEuYWxsb3dDcmVhdGUgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dDcmVhdGU7XG4gICAgICBkYXRhLm1vZGlmeUFsbFJlY29yZHMgPSBvYmplY3RfcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgIGZpZWxkcyA9IHt9O1xuICAgICAgXy5mb3JFYWNoKGRhdGEuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgICAgIHZhciBfZmllbGQ7XG4gICAgICAgIF9maWVsZCA9IF8uY2xvbmUoZmllbGQpO1xuICAgICAgICBpZiAoIV9maWVsZC5uYW1lKSB7XG4gICAgICAgICAgX2ZpZWxkLm5hbWUgPSBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA+IC0xKSB7XG4gICAgICAgICAgX2ZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpIDwgMCkge1xuICAgICAgICAgIHJldHVybiBmaWVsZHNba2V5XSA9IF9maWVsZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYXRhLmZpZWxkcyA9IGZpZWxkcztcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgU3RlZWRvc09EYXRhLkFQSV9QQVRIICsgJy9vYmplY3RzLzppZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIF9vYmosIGRhdGEsIGUsIG9iamVjdF9uYW1lLCByZWYsIHJlZjEsIHNwYWNlSWQsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgICB9XG4gICAgICBzcGFjZUlkID0gKHJlZiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMDtcbiAgICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJNaXNzIHNwYWNlSWRcIik7XG4gICAgICB9XG4gICAgICBvYmplY3RfbmFtZSA9IChyZWYxID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZjEuaWQgOiB2b2lkIDA7XG4gICAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3MgaWRcIik7XG4gICAgICB9XG4gICAgICBfb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgICAgX2lkOiBvYmplY3RfbmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoX29iaiAmJiBfb2JqLm5hbWUpIHtcbiAgICAgICAgb2JqZWN0X25hbWUgPSBfb2JqLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAob2JqZWN0X25hbWUuc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XG4gICAgICAgIGRhdGEgPSBnZXRPYmplY3RzKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YSA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YTogZGF0YSB8fCB7fVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiBlLmVycm9yIHx8IDUwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1ldGVvck9EYXRhUm91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk1ldGVvck9EYXRhUm91dGVyO1xuXHRPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5PRGF0YVJvdXRlclxuXHRleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuXHRhcHAgPSBleHByZXNzKCk7XG5cdGFwcC51c2UoJy9hcGkvb2RhdGEvdjQnLCBNZXRlb3JPRGF0YVJvdXRlcik7XG5cdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKGFwcCk7XG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpLT5cblx0XHRpZihuYW1lICE9ICdkZWZhdWx0Jylcblx0XHRcdG90aGVyQXBwID0gZXhwcmVzcygpO1xuXHRcdFx0b3RoZXJBcHAudXNlKFwiL2FwaS9vZGF0YS8je25hbWV9XCIsIE9EYXRhUm91dGVyKTtcblx0XHRcdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKG90aGVyQXBwKTtcblxuIyBcdG9kYXRhVjRNb25nb2RiID0gcmVxdWlyZSAnb2RhdGEtdjQtbW9uZ29kYidcbiMgXHRxdWVyeXN0cmluZyA9IHJlcXVpcmUgJ3F1ZXJ5c3RyaW5nJ1xuXG4jIFx0aGFuZGxlRXJyb3IgPSAoZSktPlxuIyBcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG4jIFx0XHRib2R5ID0ge31cbiMgXHRcdGVycm9yID0ge31cbiMgXHRcdGVycm9yWydtZXNzYWdlJ10gPSBlLm1lc3NhZ2VcbiMgXHRcdHN0YXR1c0NvZGUgPSA1MDBcbiMgXHRcdGlmIGUuZXJyb3IgYW5kIF8uaXNOdW1iZXIoZS5lcnJvcilcbiMgXHRcdFx0c3RhdHVzQ29kZSA9IGUuZXJyb3JcbiMgXHRcdGVycm9yWydjb2RlJ10gPSBzdGF0dXNDb2RlXG4jIFx0XHRlcnJvclsnZXJyb3InXSA9IHN0YXR1c0NvZGVcbiMgXHRcdGVycm9yWydkZXRhaWxzJ10gPSBlLmRldGFpbHNcbiMgXHRcdGVycm9yWydyZWFzb24nXSA9IGUucmVhc29uXG4jIFx0XHRib2R5WydlcnJvciddID0gZXJyb3JcbiMgXHRcdHJldHVybiB7XG4jIFx0XHRcdHN0YXR1c0NvZGU6IHN0YXR1c0NvZGVcbiMgXHRcdFx0Ym9keTpib2R5XG4jIFx0XHR9XG5cbiMgXHR2aXNpdG9yUGFyc2VyID0gKHZpc2l0b3IpLT5cbiMgXHRcdHBhcnNlZE9wdCA9IHt9XG4jIFx0XHRpZiB2aXNpdG9yLnByb2plY3Rpb25cbiMgXHRcdFx0cGFyc2VkT3B0LmZpZWxkcyA9IHZpc2l0b3IucHJvamVjdGlvblxuIyBcdFx0aWYgdmlzaXRvci5oYXNPd25Qcm9wZXJ0eSgnbGltaXQnKVxuIyBcdFx0XHRwYXJzZWRPcHQubGltaXQgPSB2aXNpdG9yLmxpbWl0XG5cbiMgXHRcdGlmIHZpc2l0b3IuaGFzT3duUHJvcGVydHkoJ3NraXAnKVxuIyBcdFx0XHRwYXJzZWRPcHQuc2tpcCA9IHZpc2l0b3Iuc2tpcFxuXG4jIFx0XHRpZiB2aXNpdG9yLnNvcnRcbiMgXHRcdFx0cGFyc2VkT3B0LnNvcnQgPSB2aXNpdG9yLnNvcnRcblxuIyBcdFx0cGFyc2VkT3B0XG4jIFx0ZGVhbFdpdGhFeHBhbmQgPSAoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIHNwYWNlSWQpLT5cbiMgXHRcdGlmIF8uaXNFbXB0eSBjcmVhdGVRdWVyeS5pbmNsdWRlc1xuIyBcdFx0XHRyZXR1cm5cblxuIyBcdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKVxuIyBcdFx0Xy5lYWNoIGNyZWF0ZVF1ZXJ5LmluY2x1ZGVzLCAoaW5jbHVkZSktPlxuIyBcdFx0XHQjIGNvbnNvbGUubG9nICdpbmNsdWRlOiAnLCBpbmNsdWRlXG4jIFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eSA9IGluY2x1ZGUubmF2aWdhdGlvblByb3BlcnR5XG4jIFx0XHRcdCMgY29uc29sZS5sb2cgJ25hdmlnYXRpb25Qcm9wZXJ0eTogJywgbmF2aWdhdGlvblByb3BlcnR5XG4jIFx0XHRcdGZpZWxkID0gb2JqLmZpZWxkc1tuYXZpZ2F0aW9uUHJvcGVydHldXG4jIFx0XHRcdGlmIGZpZWxkIGFuZCAoZmllbGQudHlwZSBpcyAnbG9va3VwJyBvciBmaWVsZC50eXBlIGlzICdtYXN0ZXJfZGV0YWlsJylcbiMgXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKVxuIyBcdFx0XHRcdFx0ZmllbGQucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcbiMgXHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG9cbiMgXHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucyA9IHZpc2l0b3JQYXJzZXIoaW5jbHVkZSlcbiMgXHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcgZmllbGQucmVmZXJlbmNlX3RvXG4jIFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdF9yb19OQU1FX0ZJRUxEX0tFWSA9IENyZWF0b3IuZ2V0T2JqZWN0KGZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCk/Lk5BTUVfRklFTERfS0VZXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCBlbnRpdGllcywgKGVudGl0eSwgaWR4KS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV1cbiMgXHRcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRGF0YSA9IF8uY2xvbmUoZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0pXG4jIFx0XHRcdFx0XHRcdFx0XHRcdG11bHRpUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiB7JGluOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XX19LCBpbmNsdWRlLnF1ZXJ5XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kKG11bHRpUXVlcnksIHF1ZXJ5T3B0aW9ucykuZmV0Y2goKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiAhZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldLmxlbmd0aFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IG9yaWdpbmFsRGF0YVxuIyBcdFx0XHRcdFx0XHRcdFx0XHQj5o6S5bqPXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IENyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzKGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSwgb3JpZ2luYWxEYXRhKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBfLm1hcCBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0sIChvKS0+XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0b1sncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5fbyddID0gZmllbGQucmVmZXJlbmNlX3RvXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0b1snX05BTUVfRklFTERfVkFMVUUnXSA9IG9bX3JvX05BTUVfRklFTERfS0VZXVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvXG4jIFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNpbmdsZVF1ZXJ5ID0gXy5leHRlbmQge19pZDogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV19LCBpbmNsdWRlLnF1ZXJ5XG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0IyDnibnmrorlpITnkIblnKjnm7jlhbPooajkuK3msqHmnInmib7liLDmlbDmja7nmoTmg4XlhrXvvIzov5Tlm57ljp/mlbDmja5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLmZpbmRPbmUoc2luZ2xlUXVlcnksIHF1ZXJ5T3B0aW9ucykgfHwgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLl9vJ10gPSBmaWVsZC5yZWZlcmVuY2VfdG9cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bX3JvX05BTUVfRklFTERfS0VZXVxuIyBcdFx0XHRcdFx0aWYgXy5pc0FycmF5IGZpZWxkLnJlZmVyZW5jZV90b1xuIyBcdFx0XHRcdFx0XHRfLmVhY2ggZW50aXRpZXMsIChlbnRpdHksIGlkeCktPlxuIyBcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldPy5pZHNcbiMgXHRcdFx0XHRcdFx0XHRcdF9vID0gZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0ub1xuIyBcdFx0XHRcdFx0XHRcdFx0X3JvX05BTUVfRklFTERfS0VZID0gQ3JlYXRvci5nZXRPYmplY3QoX28sIHNwYWNlSWQpPy5OQU1FX0ZJRUxEX0tFWVxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgcXVlcnlPcHRpb25zPy5maWVsZHMgJiYgX3JvX05BTUVfRklFTERfS0VZXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucy5maWVsZHNbX3JvX05BTUVfRklFTERfS0VZXSA9IDFcbiMgXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZVRvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5vLCBzcGFjZUlkKVxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlVG9Db2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0X2lkcyA9IF8uY2xvbmUoZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0uaWRzKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG11bHRpUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiB7JGluOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5pZHN9fSwgaW5jbHVkZS5xdWVyeVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IF8ubWFwIHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kKG11bHRpUXVlcnksIHF1ZXJ5T3B0aW9ucykuZmV0Y2goKSwgKG8pLT5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5fbyddID0gX29cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBvW19yb19OQU1FX0ZJRUxEX0tFWV1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0I+aOkuW6j1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IENyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzKGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSwgX2lkcylcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHNpbmdsZVF1ZXJ5ID0gXy5leHRlbmQge19pZDogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0uaWRzWzBdfSwgaW5jbHVkZS5xdWVyeVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kT25lKHNpbmdsZVF1ZXJ5LCBxdWVyeU9wdGlvbnMpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsncmVmZXJlbmNlX3RvLl9vJ10gPSBfb1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydfTkFNRV9GSUVMRF9WQUxVRSddID0gZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldW19yb19OQU1FX0ZJRUxEX0tFWV1cblxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHQjIFRPRE9cblxuXG4jIFx0XHRyZXR1cm5cblxuIyBcdHNldE9kYXRhUHJvcGVydHk9KGVudGl0aWVzLHNwYWNlLGtleSktPlxuIyBcdFx0ZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzID0gW11cbiMgXHRcdF8uZWFjaCBlbnRpdGllcywgKGVudGl0eSwgaWR4KS0+XG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSB7fVxuIyBcdFx0XHRpZCA9IGVudGl0aWVzW2lkeF1bXCJfaWRcIl1cbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmlkJ10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGgoc3BhY2Usa2V5KSsgJyhcXCcnICsgXCIje2lkfVwiICsgJ1xcJyknXG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXNbJ0BvZGF0YS5ldGFnJ10gPSBcIlcvXFxcIjA4RDU4OTcyMEJCQjNEQjFcXFwiXCJcbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmVkaXRMaW5rJ10gPSBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWydAb2RhdGEuaWQnXVxuIyBcdFx0XHRfLmV4dGVuZCBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzLGVudGl0eVxuIyBcdFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMucHVzaCBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzXG4jIFx0XHRyZXR1cm4gZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzXG5cbiMgXHRzZXRFcnJvck1lc3NhZ2UgPSAoc3RhdHVzQ29kZSxjb2xsZWN0aW9uLGtleSxhY3Rpb24pLT5cbiMgXHRcdGJvZHkgPSB7fVxuIyBcdFx0ZXJyb3IgPSB7fVxuIyBcdFx0aW5uZXJlcnJvciA9IHt9XG4jIFx0XHRpZiBzdGF0dXNDb2RlID09IDQwNFxuIyBcdFx0XHRpZiBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0aWYgYWN0aW9uID09ICdwb3N0J1xuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfcG9zdF9mYWlsXCIpXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcbiMgXHRcdFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDRcbiMgXHRcdFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfcG9zdF9mYWlsXCJcbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9yZWNvcmRfcXVlcnlfZmFpbFwiKVxuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXG4jIFx0XHRcdFx0XHRlcnJvclsnY29kZSddID0gNDA0XG4jIFx0XHRcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX3JlY29yZF9xdWVyeV9mYWlsXCJcbiMgXHRcdFx0ZWxzZVxuIyBcdFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX2NvbGxlY3Rpb25fcXVlcnlfZmFpbFwiKSsga2V5XG4jIFx0XHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXG4jIFx0XHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwNFxuIyBcdFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfY29sbGVjdGlvbl9xdWVyeV9mYWlsXCJcbiMgXHRcdGlmICBzdGF0dXNDb2RlID09IDQwMVxuIyBcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9hdXRoZW50aWNhdGlvbl9yZXF1aXJlZFwiKVxuIyBcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcbiMgXHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwMVxuIyBcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX2F1dGhlbnRpY2F0aW9uX3JlcXVpcmVkXCJcbiMgXHRcdGlmIHN0YXR1c0NvZGUgPT0gNDAzXG4jIFx0XHRcdHN3aXRjaCBhY3Rpb25cbiMgXHRcdFx0XHR3aGVuICdnZXQnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9hY2Nlc3NfZmFpbFwiKVxuIyBcdFx0XHRcdHdoZW4gJ3Bvc3QnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9jcmVhdGVfZmFpbFwiKVxuIyBcdFx0XHRcdHdoZW4gJ3B1dCcgdGhlbiBpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX3VwZGF0ZV9mYWlsXCIpXG4jIFx0XHRcdFx0d2hlbiAnZGVsZXRlJyB0aGVuIGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfcmVtb3ZlX2ZhaWxcIilcbiMgXHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9hY2Nlc3NfZmFpbFwiKVxuIyBcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcbiMgXHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwM1xuIyBcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX3VzZXJfYWNjZXNzX2ZhaWxcIlxuIyBcdFx0ZXJyb3JbJ2lubmVyZXJyb3InXSA9IGlubmVyZXJyb3JcbiMgXHRcdGJvZHlbJ2Vycm9yJ10gPSBlcnJvclxuIyBcdFx0cmV0dXJuIGJvZHlcblxuIyBcdHJlbW92ZUludmFsaWRNZXRob2QgPSAocXVlcnlQYXJhbXMpLT5cbiMgXHRcdGlmIHF1ZXJ5UGFyYW1zLiRmaWx0ZXIgJiYgcXVlcnlQYXJhbXMuJGZpbHRlci5pbmRleE9mKCd0b2xvd2VyKCcpID4gLTFcbiMgXHRcdFx0cmVtb3ZlTWV0aG9kID0gKCQxKS0+XG4jIFx0XHRcdFx0cmV0dXJuICQxLnJlcGxhY2UoJ3RvbG93ZXIoJywgJycpLnJlcGxhY2UoJyknLCAnJylcbiMgXHRcdFx0cXVlcnlQYXJhbXMuJGZpbHRlciA9IHF1ZXJ5UGFyYW1zLiRmaWx0ZXIucmVwbGFjZSgvdG9sb3dlclxcKChbXlxcKV0rKVxcKS9nLCByZW1vdmVNZXRob2QpXG5cbiMgXHRpc1NhbWVDb21wYW55ID0gKHNwYWNlSWQsIHVzZXJJZCwgY29tcGFueUlkLCBxdWVyeSktPlxuIyBcdFx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMSB9IH0pXG4jIFx0XHRpZiAhY29tcGFueUlkICYmIHF1ZXJ5XG4jIFx0XHRcdGNvbXBhbnlJZCA9IHN1LmNvbXBhbnlfaWRcbiMgXHRcdFx0cXVlcnkuY29tcGFueV9pZCA9IHsgJGluOiBzdS5jb21wYW55X2lkcyB9XG4jIFx0XHRyZXR1cm4gc3UuY29tcGFueV9pZHMuaW5jbHVkZXMoY29tcGFueUlkKVxuXG4jIFx0IyDkuI3ov5Tlm57lt7LlgYfliKDpmaTnmoTmlbDmja5cbiMgXHRleGNsdWRlRGVsZXRlZCA9IChxdWVyeSktPlxuIyBcdFx0cXVlcnkuaXNfZGVsZXRlZCA9IHsgJG5lOiB0cnVlIH1cblxuIyBcdCMg5L+u5pS544CB5Yig6Zmk5pe277yM5aaC5p6cIGRvYy5zcGFjZSA9IFwiZ2xvYmFsXCLvvIzmiqXplJlcbiMgXHRjaGVja0dsb2JhbFJlY29yZCA9IChjb2xsZWN0aW9uLCBpZCwgb2JqZWN0KS0+XG4jIFx0XHRpZiBvYmplY3QuZW5hYmxlX3NwYWNlX2dsb2JhbCAmJiBjb2xsZWN0aW9uLmZpbmQoeyBfaWQ6IGlkLCBzcGFjZTogJ2dsb2JhbCd9KS5jb3VudCgpXG4jIFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuS4jeiDveS/ruaUueaIluiAheWIoOmZpOagh+WHhuWvueixoVwiKVxuXG5cbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZScsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xuIyBcdFx0Z2V0OiAoKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIHNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG5cbiMgXHRcdFx0XHRyZW1vdmVJbnZhbGlkTWV0aG9kKEBxdWVyeVBhcmFtcylcbiMgXHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcbiMgXHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyAmJiBpc1NhbWVDb21wYW55KHNwYWNlSWQsIEB1c2VySWQsIGNyZWF0ZVF1ZXJ5LnF1ZXJ5LmNvbXBhbnlfaWQsIGNyZWF0ZVF1ZXJ5LnF1ZXJ5KSkgb3IgKHBlcm1pc3Npb25zLmFsbG93UmVhZCBhbmQgQHVzZXJJZClcblxuIyBcdFx0XHRcdFx0aWYga2V5IGlzICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBzcGFjZUlkXG4jIFx0XHRcdFx0XHRlbHNlIGlmIGtleSBpcyAnc3BhY2VzJ1xuIyBcdFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzbnQgJ2d1ZXN0J1xuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9IHNwYWNlSWRcbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0aWYgc3BhY2VJZCBpc250ICdndWVzdCcgYW5kIGtleSAhPSBcInVzZXJzXCIgYW5kIGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlIGlzbnQgJ2dsb2JhbCdcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IHNwYWNlSWRcblxuIyBcdFx0XHRcdFx0aWYgQ3JlYXRvci5pc0NvbW1vblNwYWNlKHNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdGlmIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIEB1c2VySWQpXG4jIFx0XHRcdFx0XHRcdFx0aWYga2V5IGlzICdzcGFjZXMnXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgY3JlYXRlUXVlcnkucXVlcnkuX2lkXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlXG4jIFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHR1c2VyX3NwYWNlcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmQoe3VzZXI6IEB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxuIyBcdFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnc3BhY2VzJ1xuIyBcdFx0XHRcdFx0XHRcdFx0IyBzcGFjZSDlr7nmiYDmnInnlKjmiLforrDlvZXkuLrlj6ror7tcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5faWRcbiMgXHRcdFx0XHRcdFx0XHRcdCMgY3JlYXRlUXVlcnkucXVlcnkuX2lkID0geyRpbjogXy5wbHVjayh1c2VyX3NwYWNlcywgJ3NwYWNlJyl9XG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSB7JGluOiBfLnBsdWNrKHVzZXJfc3BhY2VzLCAnc3BhY2UnKX1cblxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnNvcnQgb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5zb3J0KVxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5zb3J0ID0geyBtb2RpZmllZDogLTEgfVxuIyBcdFx0XHRcdFx0aXNfZW50ZXJwcmlzZSA9IFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oc3BhY2VJZCxcIndvcmtmbG93LmVudGVycHJpc2VcIilcbiMgXHRcdFx0XHRcdGlzX3Byb2Zlc3Npb25hbCA9IFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oc3BhY2VJZCxcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiKVxuIyBcdFx0XHRcdFx0aXNfc3RhbmRhcmQgPSBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlSWQsXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkubGltaXRcbiMgXHRcdFx0XHRcdFx0bGltaXQgPSBjcmVhdGVRdWVyeS5saW1pdFxuIyBcdFx0XHRcdFx0XHRpZiBpc19lbnRlcnByaXNlIGFuZCBsaW1pdD4xMDAwMDBcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDAwMFxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3Byb2Zlc3Npb25hbCBhbmQgbGltaXQ+MTAwMDAgYW5kICFpc19lbnRlcnByaXNlXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMFxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3N0YW5kYXJkIGFuZCBsaW1pdD4xMDAwIGFuZCAhaXNfcHJvZmVzc2lvbmFsIGFuZCAhaXNfZW50ZXJwcmlzZVxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMFxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRpZiBpc19lbnRlcnByaXNlXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMDBcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBpc19wcm9mZXNzaW9uYWwgYW5kICFpc19lbnRlcnByaXNlXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMFxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3N0YW5kYXJkIGFuZCAhaXNfZW50ZXJwcmlzZSBhbmQgIWlzX3Byb2Zlc3Npb25hbFxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMFxuIyBcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkucHJvamVjdGlvblxuIyBcdFx0XHRcdFx0XHRwcm9qZWN0aW9uID0ge31cbiMgXHRcdFx0XHRcdFx0Xy5rZXlzKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pLmZvckVhY2ggKGtleSktPlxuIyBcdFx0XHRcdFx0XHRcdGlmIF8uaW5kZXhPZih1bnJlYWRhYmxlX2ZpZWxkcywga2V5KSA8IDBcbiMgXHRcdFx0XHRcdFx0XHRcdCNpZiBub3QgKChmaWVsZHNba2V5XT8udHlwZSA9PSAnbG9va3VwJyBvciBmaWVsZHNba2V5XT8udHlwZSA9PSAnbWFzdGVyX2RldGFpbCcpIGFuZCBmaWVsZHNba2V5XS5tdWx0aXBsZSlcbiMgXHRcdFx0XHRcdFx0XHRcdHByb2plY3Rpb25ba2V5XSA9IDFcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbiA9IHByb2plY3Rpb25cbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uIG9yICFfLnNpemUoY3JlYXRlUXVlcnkucHJvamVjdGlvbilcbiMgXHRcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoa2V5LCBzcGFjZUlkLCBAdXNlcklkKVxuIyBcdFx0XHRcdFx0XHRmaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpLmZpZWxkc1xuIyBcdFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZmllbGQpLT5cbiMgXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pbmRleE9mKCckJykgPCAwXG4jIFx0XHRcdFx0XHRcdFx0XHQjaWYgZmllbGRzW2ZpZWxkXT8ubXVsdGlwbGUhPSB0cnVlXG4jIFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uW2ZpZWxkXSA9IDFcbiMgXHRcdFx0XHRcdGlmIG5vdCBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG4jIFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfc2hhcmVcbiMgXHRcdFx0XHRcdFx0XHQjIOa7oei2s+WFseS6q+inhOWImeS4reeahOiusOW9leS5n+imgeaQnOe0ouWHuuadpVxuIyBcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5vd25lclxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcyA9IFtdXG4jIFx0XHRcdFx0XHRcdFx0b3JncyA9IFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMoc3BhY2VJZCwgQHVzZXJJZCwgdHJ1ZSlcbiMgXHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7XCJvd25lclwiOiBAdXNlcklkfVxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHsgXCJzaGFyaW5nLnVcIjogQHVzZXJJZCB9XG4jIFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcub1wiOiB7ICRpbjogb3JncyB9IH1cbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVtcIiRvclwiXSA9IHNoYXJlc1xuIyBcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkub3duZXIgPSBAdXNlcklkXG4jIFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXG5cbiMgXHRcdFx0XHRcdGV4Y2x1ZGVEZWxldGVkKGNyZWF0ZVF1ZXJ5LnF1ZXJ5KVxuXG4jIFx0XHRcdFx0XHRpZiBAcXVlcnlQYXJhbXMuJHRvcCBpc250ICcwJ1xuIyBcdFx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSwgdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpLmZldGNoKClcbiMgXHRcdFx0XHRcdHNjYW5uZWRDb3VudCA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSx7ZmllbGRzOntfaWQ6IDF9fSkuY291bnQoKVxuIyBcdFx0XHRcdFx0aWYgZW50aXRpZXNcbiMgXHRcdFx0XHRcdFx0ZGVhbFdpdGhFeHBhbmQoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIHNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdCNzY2FubmVkQ291bnQgPSBlbnRpdGllcy5sZW5ndGhcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0I1x0Ym9keVsnQG9kYXRhLm5leHRMaW5rJ10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGgoc3BhY2VJZCxrZXkpK1wiPyUyNHNraXA9XCIrIDEwXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb3VudCddID0gc2Nhbm5lZENvdW50XG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzX09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LFwiZ2V0XCIpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuXG4jIFx0XHRwb3N0OiAoKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZCk/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0fVxuXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIHNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OnNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxuIyBcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSBzcGFjZUlkXG4jIFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCdcbiMgXHRcdFx0XHRcdFx0ZGVsZXRlIEBib2R5UGFyYW1zLnNwYWNlXG4jIFx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG4jIFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcbiMgXHRcdFx0XHRcdGVudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdGlmIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzLnB1c2ggZW50aXR5XG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xuIyBcdFx0XHRcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncG9zdCcpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuXG4jIFx0fSlcbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZS9yZWNlbnQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcbiMgXHRcdGdldDooKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X2NvbGxlY3Rpb24gPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wib2JqZWN0X3JlY2VudF92aWV3ZWRcIl1cbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3NlbGVjdG9yID0ge1wicmVjb3JkLm9cIjprZXksY3JlYXRlZF9ieTpAdXNlcklkfVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfb3B0aW9ucyA9IHt9XG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19vcHRpb25zLnNvcnQgPSB7Y3JlYXRlZDogLTF9XG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19vcHRpb25zLmZpZWxkcyA9IHtyZWNvcmQ6MX1cbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHMgPSByZWNlbnRfdmlld19jb2xsZWN0aW9uLmZpbmQocmVjZW50X3ZpZXdfc2VsZWN0b3IscmVjZW50X3ZpZXdfb3B0aW9ucykuZmV0Y2goKVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSBfLnBsdWNrKHJlY2VudF92aWV3X3JlY29yZHMsJ3JlY29yZCcpXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IHJlY2VudF92aWV3X3JlY29yZHNfaWRzLmdldFByb3BlcnR5KFwiaWRzXCIpXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IF8uZmxhdHRlbihyZWNlbnRfdmlld19yZWNvcmRzX2lkcylcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy51bmlxKHJlY2VudF92aWV3X3JlY29yZHNfaWRzKVxuIyBcdFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXG4jIFx0XHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcbiMgXHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5ID0gaWYgcXMgdGhlbiBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeShxcykgZWxzZSBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeSgpXG4jIFx0XHRcdFx0XHRpZiBrZXkgaXMgJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVsnbWV0YWRhdGEuc3BhY2UnXSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LmxpbWl0XG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5saW1pdCBhbmQgcmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMubGVuZ3RoPmNyZWF0ZVF1ZXJ5LmxpbWl0XG4jIFx0XHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy5maXJzdChyZWNlbnRfdmlld19yZWNvcmRzX2lkcyxjcmVhdGVRdWVyeS5saW1pdClcbiMgXHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9IHskaW46cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHN9XG4jIFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uXG4jIFx0XHRcdFx0XHRcdHByb2plY3Rpb24gPSB7fVxuIyBcdFx0XHRcdFx0XHRfLmtleXMoY3JlYXRlUXVlcnkucHJvamVjdGlvbikuZm9yRWFjaCAoa2V5KS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHVucmVhZGFibGVfZmllbGRzLCBrZXkpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdFx0IyBpZiBub3QgKChmaWVsZHNba2V5XT8udHlwZSA9PSAnbG9va3VwJyBvciBmaWVsZHNba2V5XT8udHlwZSA9PSAnbWFzdGVyX2RldGFpbCcpIGFuZCBmaWVsZHNba2V5XS5tdWx0aXBsZSlcbiMgXHRcdFx0XHRcdFx0XHRcdHByb2plY3Rpb25ba2V5XSA9IDFcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbiA9IHByb2plY3Rpb25cbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uIG9yICFfLnNpemUoY3JlYXRlUXVlcnkucHJvamVjdGlvbilcbiMgXHRcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQpXG4jIFx0XHRcdFx0XHRcdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKS5maWVsZHNcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGZpZWxkKS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaW5kZXhPZignJCcpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdFx0I2lmIGZpZWxkc1tmaWVsZF0/Lm11bHRpcGxlIT0gdHJ1ZVxuIyBcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbltmaWVsZF0gPSAxXG5cbiMgXHRcdFx0XHRcdGV4Y2x1ZGVEZWxldGVkKGNyZWF0ZVF1ZXJ5LnF1ZXJ5KVxuXG4jIFx0XHRcdFx0XHRpZiBAcXVlcnlQYXJhbXMuJHRvcCBpc250ICcwJ1xuIyBcdFx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSwgdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpLmZldGNoKClcbiMgXHRcdFx0XHRcdGVudGl0aWVzX2luZGV4ID0gW11cbiMgXHRcdFx0XHRcdGVudGl0aWVzX2lkcyA9IF8ucGx1Y2soZW50aXRpZXMsJ19pZCcpXG4jIFx0XHRcdFx0XHRzb3J0X2VudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5zb3J0IG9yICFfLnNpemUoY3JlYXRlUXVlcnkuc29ydClcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY2VudF92aWV3X3JlY29yZHNfaWRzICwocmVjZW50X3ZpZXdfcmVjb3Jkc19pZCktPlxuIyBcdFx0XHRcdFx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGVudGl0aWVzX2lkcyxyZWNlbnRfdmlld19yZWNvcmRzX2lkKVxuIyBcdFx0XHRcdFx0XHRcdGlmIGluZGV4Pi0xXG4jIFx0XHRcdFx0XHRcdFx0XHRzb3J0X2VudGl0aWVzLnB1c2ggZW50aXRpZXNbaW5kZXhdXG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdHNvcnRfZW50aXRpZXMgPSBlbnRpdGllc1xuIyBcdFx0XHRcdFx0aWYgc29ydF9lbnRpdGllc1xuIyBcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgc29ydF9lbnRpdGllcywga2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0I1x0Ym9keVsnQG9kYXRhLm5leHRMaW5rJ10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGgoQHVybFBhcmFtcy5zcGFjZUlkLGtleSkrXCI/JTI0c2tpcD1cIisgMTBcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvdW50J10gPSBzb3J0X2VudGl0aWVzLmxlbmd0aFxuIyBcdFx0XHRcdFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KHNvcnRfZW50aXRpZXMsQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdGllc19PZGF0YVByb3BlcnRpZXNcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSwnZ2V0JylcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ2dldCcpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuIyB9KVxuXG4jIFx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCc6b2JqZWN0X25hbWUvOl9pZCcsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xuIyBcdFx0cG9zdDogKCktPlxuIyBcdFx0XHR0cnlcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKT8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxuIyBcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcbiMgXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuIyBcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxuIyBcdFx0XHRcdFx0aWYgZW50aXR5XG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMucHVzaCBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcbiMgXHRcdFx0XHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncG9zdCcpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuIyBcdFx0Z2V0OigpLT5cbiMgXHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRpZiBrZXkuaW5kZXhPZihcIihcIikgPiAtMVxuIyBcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdGNvbGxlY3Rpb25JbmZvID0ga2V5XG4jIFx0XHRcdFx0ZmllbGROYW1lID0gQHVybFBhcmFtcy5faWQuc3BsaXQoJ19leHBhbmQnKVswXVxuIyBcdFx0XHRcdGNvbGxlY3Rpb25JbmZvU3BsaXQgPSBjb2xsZWN0aW9uSW5mby5zcGxpdCgnKCcpXG4jIFx0XHRcdFx0Y29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uSW5mb1NwbGl0WzBdXG4jIFx0XHRcdFx0aWQgPSBjb2xsZWN0aW9uSW5mb1NwbGl0WzFdLnNwbGl0KCdcXCcnKVsxXVxuXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGZpZWxkc09wdGlvbnMgPSB7fVxuIyBcdFx0XHRcdGZpZWxkc09wdGlvbnNbZmllbGROYW1lXSA9IDFcbiMgXHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogaWR9LCB7ZmllbGRzOiBmaWVsZHNPcHRpb25zfSlcblxuIyBcdFx0XHRcdGZpZWxkVmFsdWUgPSBudWxsXG4jIFx0XHRcdFx0aWYgZW50aXR5XG4jIFx0XHRcdFx0XHRmaWVsZFZhbHVlID0gZW50aXR5W2ZpZWxkTmFtZV1cblxuIyBcdFx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KGNvbGxlY3Rpb25OYW1lLCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0ZmllbGQgPSBvYmouZmllbGRzW2ZpZWxkTmFtZV1cblxuIyBcdFx0XHRcdGlmIGZpZWxkIGFuZCBmaWVsZFZhbHVlIGFuZCAoZmllbGQudHlwZSBpcyAnbG9va3VwJyBvciBmaWVsZC50eXBlIGlzICdtYXN0ZXJfZGV0YWlsJylcbiMgXHRcdFx0XHRcdGxvb2t1cENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvLCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0XHRxdWVyeU9wdGlvbnMgPSB7ZmllbGRzOiB7fX1cbiMgXHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGZpZWxkLnJlZmVyZW5jZV90bywgQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkKVxuIyBcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGYpLT5cbiMgXHRcdFx0XHRcdFx0aWYgZi5pbmRleE9mKCckJykgPCAwXG4jIFx0XHRcdFx0XHRcdFx0cXVlcnlPcHRpb25zLmZpZWxkc1tmXSA9IDFcblxuIyBcdFx0XHRcdFx0aWYgZmllbGQubXVsdGlwbGVcbiMgXHRcdFx0XHRcdFx0dmFsdWVzID0gW11cbiMgXHRcdFx0XHRcdFx0bG9va3VwQ29sbGVjdGlvbi5maW5kKHtfaWQ6IHskaW46IGZpZWxkVmFsdWV9fSwgcXVlcnlPcHRpb25zKS5mb3JFYWNoIChvYmopLT5cbiMgXHRcdFx0XHRcdFx0XHRfLmVhY2ggb2JqLCAodiwgayktPlxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHYpIHx8IChfLmlzT2JqZWN0KHYpICYmICFfLmlzRGF0ZSh2KSlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0b2JqW2tdID0gSlNPTi5zdHJpbmdpZnkodilcbiMgXHRcdFx0XHRcdFx0XHR2YWx1ZXMucHVzaChvYmopXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSB2YWx1ZXNcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoQHVybFBhcmFtcy5zcGFjZUlkKSArIFwiIyN7Y29sbGVjdGlvbkluZm99LyN7QHVybFBhcmFtcy5faWR9XCJcbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IGxvb2t1cENvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiBmaWVsZFZhbHVlfSwgcXVlcnlPcHRpb25zKSB8fCB7fVxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggYm9keSwgKHYsIGspLT5cbiMgXHRcdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkodikgfHwgKF8uaXNPYmplY3QodikgJiYgIV8uaXNEYXRlKHYpKVxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keVtrXSA9IEpTT04uc3RyaW5naWZ5KHYpXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCkgKyBcIiMje2ZpZWxkLnJlZmVyZW5jZV90b30vJGVudGl0eVwiXG5cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zLnNwYWNlSWQpICsgXCIjI3tjb2xsZWN0aW9uSW5mb30vI3tAdXJsUGFyYW1zLl9pZH1cIlxuIyBcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGZpZWxkVmFsdWVcblxuIyBcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG5cbiMgXHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0ZWxzZVxuIyBcdFx0XHRcdHRyeVxuIyBcdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0XHR9XG5cbiMgXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuIyBcdFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXG4jIFx0XHRcdFx0XHRcdHJlbW92ZUludmFsaWRNZXRob2QoQHF1ZXJ5UGFyYW1zKVxuIyBcdFx0XHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkgPSBpZiBxcyB0aGVuIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KHFzKSBlbHNlIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KClcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuX2lkID0gIEB1cmxQYXJhbXMuX2lkXG4jIFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBrZXkgIT0gJ3NwYWNlcydcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9ICBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxuIyBcdFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0cHJvamVjdGlvbiA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0Xy5rZXlzKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pLmZvckVhY2ggKGtleSktPlxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHVucmVhZGFibGVfZmllbGRzLCBrZXkpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdFx0XHQjIGlmIG5vdCAoKGZpZWxkc1trZXldPy50eXBlID09ICdsb29rdXAnIG9yIGZpZWxkc1trZXldPy50eXBlID09ICdtYXN0ZXJfZGV0YWlsJykgYW5kIGZpZWxkc1trZXldLm11bHRpcGxlKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0aW9uW2tleV0gPSAxXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbiA9IHByb2plY3Rpb25cbiMgXHRcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKVxuIyBcdFx0XHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkKVxuIyBcdFx0XHRcdFx0XHRcdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcbiMgXHRcdFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZmllbGQpIC0+XG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pbmRleE9mKCckJykgPCAwXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25bZmllbGRdID0gMVxuIyBcdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoY3JlYXRlUXVlcnkucXVlcnksdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdFx0aWYgZW50aXR5XG4jIFx0XHRcdFx0XHRcdFx0aXNBbGxvd2VkID0gZW50aXR5Lm93bmVyID09IEB1c2VySWQgb3IgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyAmJiBpc1NhbWVDb21wYW55KEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwgZW50aXR5LmNvbXBhbnlfaWQpKVxuIyBcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfc2hhcmUgYW5kICFpc0FsbG93ZWRcbiMgXHRcdFx0XHRcdFx0XHRcdHNoYXJlcyA9IFtdXG4jIFx0XHRcdFx0XHRcdFx0XHRvcmdzID0gU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIHRydWUpXG4jIFx0XHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7IFwic2hhcmluZy51XCI6IEB1c2VySWQgfVxuIyBcdFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcub1wiOiB7ICRpbjogb3JncyB9IH1cbiMgXHRcdFx0XHRcdFx0XHRcdGlzQWxsb3dlZCA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogQHVybFBhcmFtcy5faWQsIFwiJG9yXCI6IHNoYXJlcyB9LCB7IGZpZWxkczogeyBfaWQ6IDEgfSB9KVxuIyBcdFx0XHRcdFx0XHRcdGlmIGlzQWxsb3dlZFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzLnB1c2ggZW50aXR5XG4jIFx0XHRcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgZW50aXRpZXMsIGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcbiMgXHRcdFx0XHRcdFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdFx0Xy5leHRlbmQgYm9keSxlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWzBdXG4jIFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxuIyBcdFx0XHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxuIyBcdFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ2dldCcpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRjYXRjaCBlXG4jIFx0XHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuXG4jIFx0XHRwdXQ6KCktPlxuIyBcdFx0XHR0cnlcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdH1cblxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0aWYga2V5ID09IFwidXNlcnNcIlxuIyBcdFx0XHRcdFx0cmVjb3JkX293bmVyID0gQHVybFBhcmFtcy5faWRcbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZWNvcmRfb3duZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IEB1cmxQYXJhbXMuX2lkIH0sIHsgZmllbGRzOiB7IG93bmVyOiAxIH0gfSk/Lm93bmVyXG5cbiMgXHRcdFx0XHRjb21wYW55SWQgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IEB1cmxQYXJhbXMuX2lkIH0sIHsgZmllbGRzOiB7IGNvbXBhbnlfaWQ6IDEgfSB9KT8uY29tcGFueV9pZFxuXG4jIFx0XHRcdFx0aXNBbGxvd2VkID0gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBvciAocGVybWlzc2lvbnMuYWxsb3dFZGl0IGFuZCByZWNvcmRfb3duZXIgPT0gQHVzZXJJZCApIG9yIChwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyAmJiBpc1NhbWVDb21wYW55KHNwYWNlSWQsIEB1c2VySWQsIGNvbXBhbnlJZCkpXG4jIFx0XHRcdFx0aWYgaXNBbGxvd2VkXG4jIFx0XHRcdFx0XHRjaGVja0dsb2JhbFJlY29yZChjb2xsZWN0aW9uLCBAdXJsUGFyYW1zLl9pZCwgb2JqZWN0KVxuIyBcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLl9pZCwgc3BhY2U6IHNwYWNlSWR9XG4jIFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCcgb3Igc3BhY2VJZCBpcyAnY29tbW9uJyBvciBrZXkgPT0gXCJ1c2Vyc1wiXG4jIFx0XHRcdFx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxuIyBcdFx0XHRcdFx0ZmllbGRzX2VkaXRhYmxlID0gdHJ1ZVxuIyBcdFx0XHRcdFx0Xy5rZXlzKEBib2R5UGFyYW1zLiRzZXQpLmZvckVhY2ggKGtleSktPlxuIyBcdFx0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIGtleSkgPiAtMVxuIyBcdFx0XHRcdFx0XHRcdGZpZWxkc19lZGl0YWJsZSA9IGZhbHNlXG4jIFx0XHRcdFx0XHRpZiBmaWVsZHNfZWRpdGFibGVcbiMgXHRcdFx0XHRcdFx0aWYga2V5IGlzICdzcGFjZXMnXG4jIFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXG4jIFx0XHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCBAYm9keVBhcmFtc1xuIyBcdFx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcbiMgXHRcdFx0XHRcdFx0XHQjc3RhdHVzQ29kZTogMjAxXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5faWRcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdFx0XHQjIGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXRpZXMucHVzaCBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0XHQjIGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdCMgXy5leHRlbmQgYm9keSxlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWzBdXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0XHR7aGVhZGVyczogaGVhZGVycyxib2R5OmJvZHl9XG4jIFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncHV0JylcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ3B1dCcpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuIyBcdFx0ZGVsZXRlOigpLT5cbiMgXHRcdFx0dHJ5XG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHRcdH1cblxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRyZWNvcmREYXRhID0gY29sbGVjdGlvbi5maW5kT25lKHtfaWQ6IEB1cmxQYXJhbXMuX2lkfSwgeyBmaWVsZHM6IHsgb3duZXI6IDEsIGNvbXBhbnlfaWQ6IDEgfSB9KVxuIyBcdFx0XHRcdHJlY29yZF9vd25lciA9IHJlY29yZERhdGE/Lm93bmVyXG4jIFx0XHRcdFx0Y29tcGFueUlkID0gcmVjb3JkRGF0YT8uY29tcGFueV9pZFxuIyBcdFx0XHRcdGlzQWxsb3dlZCA9IChwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSkgb3IgKHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSBhbmQgaXNTYW1lQ29tcGFueShzcGFjZUlkLCBAdXNlcklkLCBjb21wYW55SWQpKSBvciAocGVybWlzc2lvbnMuYWxsb3dEZWxldGUgYW5kIHJlY29yZF9vd25lcj09QHVzZXJJZCApXG4jIFx0XHRcdFx0aWYgaXNBbGxvd2VkXG4jIFx0XHRcdFx0XHRjaGVja0dsb2JhbFJlY29yZChjb2xsZWN0aW9uLCBAdXJsUGFyYW1zLl9pZCwgb2JqZWN0KVxuIyBcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLl9pZCwgc3BhY2U6IHNwYWNlSWR9XG4jIFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCdcbiMgXHRcdFx0XHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXG5cbiMgXHRcdFx0XHRcdGlmIG9iamVjdD8uZW5hYmxlX3RyYXNoXG4jIFx0XHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCB7XG4jIFx0XHRcdFx0XHRcdFx0JHNldDoge1xuIyBcdFx0XHRcdFx0XHRcdFx0aXNfZGVsZXRlZDogdHJ1ZSxcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZWQ6IG5ldyBEYXRlKCksXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGVkX2J5OiBAdXNlcklkXG4jIFx0XHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0XHR9KVxuIyBcdFx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHRcdHtoZWFkZXJzOiBoZWFkZXJzLGJvZHk6Ym9keX1cbiMgXHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdGllcy5wdXNoIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRcdCMgYm9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKHNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0IyBfLmV4dGVuZCBib2R5LGVudGl0eV9PZGF0YVByb3BlcnRpZXNbMF1cbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHRcdHtoZWFkZXJzOiBoZWFkZXJzLGJvZHk6Ym9keX1cbiMgXHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuIyBcdH0pXG5cbiMgXHQjIF9pZOWPr+S8oGFsbFxuIyBcdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnOm9iamVjdF9uYW1lLzpfaWQvOm1ldGhvZE5hbWUnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcbiMgXHRcdHBvc3Q6ICgpLT5cbiMgXHRcdFx0dHJ5XG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRcdGlmIG5vdCBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCk/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cblxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcbiMgXHRcdFx0XHRcdG1ldGhvZE5hbWUgPSBAdXJsUGFyYW1zLm1ldGhvZE5hbWVcbiMgXHRcdFx0XHRcdG1ldGhvZHMgPSBDcmVhdG9yLk9iamVjdHNba2V5XT8ubWV0aG9kcyB8fCB7fVxuIyBcdFx0XHRcdFx0aWYgbWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShtZXRob2ROYW1lKVxuIyBcdFx0XHRcdFx0XHR0aGlzT2JqID0ge1xuIyBcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBrZXlcbiMgXHRcdFx0XHRcdFx0XHRyZWNvcmRfaWQ6IEB1cmxQYXJhbXMuX2lkXG4jIFx0XHRcdFx0XHRcdFx0c3BhY2VfaWQ6IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdFx0XHRcdHVzZXJfaWQ6IEB1c2VySWRcbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9uczogcGVybWlzc2lvbnNcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0XHRyZXR1cm4gbWV0aG9kc1ttZXRob2ROYW1lXS5hcHBseSh0aGlzT2JqLCBbQGJvZHlQYXJhbXNdKSB8fCB7fVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0Y2F0Y2ggZVxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXG5cbiMgXHR9KVxuXG4jIFx0I1RPRE8gcmVtb3ZlXG4jIFx0Xy5lYWNoIFtdLCAodmFsdWUsIGtleSwgbGlzdCktPiAjQ3JlYXRvci5Db2xsZWN0aW9uc1xuIyBcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSk/LmVuYWJsZV9hcGlcbiMgXHRcdFx0cmV0dXJuXG5cbiMgXHRcdGlmIFN0ZWVkb3NPZGF0YUFQSVxuXG4jIFx0XHRcdFN0ZWVkb3NPZGF0YUFQSS5hZGRDb2xsZWN0aW9uIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpLFxuIyBcdFx0XHRcdGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXVxuIyBcdFx0XHRcdHJvdXRlT3B0aW9uczpcbiMgXHRcdFx0XHRcdGF1dGhSZXF1aXJlZDogdHJ1ZVxuIyBcdFx0XHRcdFx0c3BhY2VSZXF1aXJlZDogZmFsc2VcbiMgXHRcdFx0XHRlbmRwb2ludHM6XG4jIFx0XHRcdFx0XHRnZXRBbGw6XG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XG5cbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLmFsbG93UmVhZCBhbmQgQHVzZXJJZClcbiMgXHRcdFx0XHRcdFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShAcXVlcnlQYXJhbXMpKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxuXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0gQHVybFBhcmFtcy5zcGFjZUlkXG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgbm90IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkub3duZXIgPSBAdXNlcklkXG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBAcXVlcnlQYXJhbXMuJHRvcCBpc250ICcwJ1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LCB2aXNpdG9yUGFyc2VyKGNyZWF0ZVF1ZXJ5KSkuZmV0Y2goKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzY2FubmVkQ291bnQgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnkpLmNvdW50KClcblxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdGllc1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGRlYWxXaXRoRXhwYW5kKGNyZWF0ZVF1ZXJ5LCBlbnRpdGllcywga2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvdW50J10gPSBzY2FubmVkQ291bnRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXRpZXNcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbid9XG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XG4jIFx0XHRcdFx0XHRwb3N0OlxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxuXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSBAc3BhY2VJZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIHZhbHVlOiBlbnRpdHl9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cbiMgXHRcdFx0XHRcdGdldDpcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cblxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWQsIHNwYWNlOiBAc3BhY2VJZH1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgdmFsdWU6IGVudGl0eX1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cbiMgXHRcdFx0XHRcdHB1dDpcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cblxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93RWRpdFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWQsIHNwYWNlOiBAc3BhY2VJZH1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsICRzZXQ6IEBib2R5UGFyYW1zXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCB2YWx1ZTogZW50aXR5fVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxuIyBcdFx0XHRcdFx0ZGVsZXRlOlxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxuXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkLCBzcGFjZTogQHNwYWNlSWR9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgTWV0ZW9yT0RhdGFSb3V0ZXIsIE9EYXRhUm91dGVyLCBhcHAsIGV4cHJlc3M7XG4gIE1ldGVvck9EYXRhUm91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk1ldGVvck9EYXRhUm91dGVyO1xuICBPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5PRGF0YVJvdXRlcjtcbiAgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbiAgYXBwID0gZXhwcmVzcygpO1xuICBhcHAudXNlKCcvYXBpL29kYXRhL3Y0JywgTWV0ZW9yT0RhdGFSb3V0ZXIpO1xuICBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShhcHApO1xuICByZXR1cm4gXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgdmFyIG90aGVyQXBwO1xuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIG90aGVyQXBwID0gZXhwcmVzcygpO1xuICAgICAgb3RoZXJBcHAudXNlKFwiL2FwaS9vZGF0YS9cIiArIG5hbWUsIE9EYXRhUm91dGVyKTtcbiAgICAgIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShvdGhlckFwcCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXG5iYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJylcblxuYXV0aG9yaXphdGlvbkNhY2hlID0ge31cblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSAnL2FwaS9vZGF0YS92NC8nLCAocmVxLCByZXMsIG5leHQpLT5cblxuXHRGaWJlcigoKS0+XG5cdFx0aWYgIXJlcS51c2VySWRcblx0XHRcdGlzQXV0aGVkID0gZmFsc2Vcblx0XHRcdCMgb2F1dGgy6aqM6K+BXG5cdFx0XHRpZiByZXE/LnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cblx0XHRcdFx0Y29uc29sZS5sb2cgJ09BdXRoMjogJywgcmVxLnF1ZXJ5LmFjY2Vzc190b2tlblxuXHRcdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihyZXEucXVlcnkuYWNjZXNzX3Rva2VuKVxuXHRcdFx0XHRpZiB1c2VySWRcblx0XHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblx0XHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcblx0XHRcdCMgYmFzaWPpqozor4Fcblx0XHRcdGlmIHJlcS5oZWFkZXJzWydhdXRob3JpemF0aW9uJ11cblx0XHRcdFx0YXV0aCA9IGJhc2ljQXV0aC5wYXJzZShyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKVxuXHRcdFx0XHRpZiBhdXRoXG5cdFx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHt1c2VybmFtZTogYXV0aC5uYW1lfSwgeyBmaWVsZHM6IHsgJ3NlcnZpY2VzJzogMSB9IH0pXG5cdFx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdFx0aWYgYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPT0gYXV0aC5wYXNzXG5cdFx0XHRcdFx0XHRcdGlzQXV0aGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCB1c2VyLCBhdXRoLnBhc3Ncblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGlmICFyZXN1bHQuZXJyb3Jcblx0XHRcdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRpZiBfLmtleXMoYXV0aG9yaXphdGlvbkNhY2hlKS5sZW5ndGggPiAxMDBcblx0XHRcdFx0XHRcdFx0XHRcdGF1dGhvcml6YXRpb25DYWNoZSA9IHt9XG5cdFx0XHRcdFx0XHRcdFx0YXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPSBhdXRoLnBhc3Ncblx0XHRcdGlmIGlzQXV0aGVkXG5cdFx0XHRcdHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSA9IHVzZXIuX2lkXG5cdFx0XHRcdHRva2VuID0gbnVsbFxuXHRcdFx0XHRhcHBfaWQgPSBcImNyZWF0b3JcIlxuXHRcdFx0XHRjbGllbnRfaWQgPSBcInBjXCJcblx0XHRcdFx0bG9naW5Ub2tlbnMgPSB1c2VyLnNlcnZpY2VzPy5yZXN1bWU/LmxvZ2luVG9rZW5zXG5cdFx0XHRcdGlmIGxvZ2luVG9rZW5zXG5cdFx0XHRcdFx0YXBwX2xvZ2luX3Rva2VuID0gXy5maW5kKGxvZ2luVG9rZW5zLCAodCktPlxuXHRcdFx0XHRcdFx0cmV0dXJuIHQuYXBwX2lkIGlzIGFwcF9pZCBhbmQgdC5jbGllbnRfaWQgaXMgY2xpZW50X2lkXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdHRva2VuID0gYXBwX2xvZ2luX3Rva2VuLnRva2VuIGlmIGFwcF9sb2dpbl90b2tlblxuXG5cdFx0XHRcdGlmIG5vdCB0b2tlblxuXHRcdFx0XHRcdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcblx0XHRcdFx0XHR0b2tlbiA9IGF1dGhUb2tlbi50b2tlblxuXHRcdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4gYXV0aFRva2VuXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4uYXBwX2lkID0gYXBwX2lkXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4uY2xpZW50X2lkID0gY2xpZW50X2lkXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4udG9rZW4gPSB0b2tlblxuXHRcdFx0XHRcdEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIHVzZXIuX2lkLCBoYXNoZWRUb2tlblxuXG5cdFx0XHRcdGlmIHRva2VuXG5cdFx0XHRcdFx0cmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddID0gdG9rZW5cblx0XHRuZXh0KClcblx0KS5ydW4oKVxuIiwidmFyIEZpYmVyLCBhdXRob3JpemF0aW9uQ2FjaGUsIGJhc2ljQXV0aDtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpO1xuXG5hdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL2FwaS9vZGF0YS92NC8nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFwcF9pZCwgYXBwX2xvZ2luX3Rva2VuLCBhdXRoLCBhdXRoVG9rZW4sIGNsaWVudF9pZCwgaGFzaGVkVG9rZW4sIGlzQXV0aGVkLCBsb2dpblRva2VucywgcmVmLCByZWYxLCByZWYyLCByZXN1bHQsIHRva2VuLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFyZXEudXNlcklkKSB7XG4gICAgICBpc0F1dGhlZCA9IGZhbHNlO1xuICAgICAgaWYgKHJlcSAhPSBudWxsID8gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ09BdXRoMjogJywgcmVxLnF1ZXJ5LmFjY2Vzc190b2tlbik7XG4gICAgICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIF9pZDogdXNlcklkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKSB7XG4gICAgICAgIGF1dGggPSBiYXNpY0F1dGgucGFyc2UocmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSk7XG4gICAgICAgIGlmIChhdXRoKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoLm5hbWVcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgJ3NlcnZpY2VzJzogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICBpZiAoYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPT09IGF1dGgucGFzcykge1xuICAgICAgICAgICAgICBpc0F1dGhlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBhdXRoLnBhc3MpO1xuICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5lcnJvcikge1xuICAgICAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoXy5rZXlzKGF1dGhvcml6YXRpb25DYWNoZSkubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPSBhdXRoLnBhc3M7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0F1dGhlZCkge1xuICAgICAgICByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gPSB1c2VyLl9pZDtcbiAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICBhcHBfaWQgPSBcImNyZWF0b3JcIjtcbiAgICAgICAgY2xpZW50X2lkID0gXCJwY1wiO1xuICAgICAgICBsb2dpblRva2VucyA9IChyZWYxID0gdXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5yZXN1bWUpICE9IG51bGwgPyByZWYyLmxvZ2luVG9rZW5zIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICBpZiAobG9naW5Ub2tlbnMpIHtcbiAgICAgICAgICBhcHBfbG9naW5fdG9rZW4gPSBfLmZpbmQobG9naW5Ub2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LmFwcF9pZCA9PT0gYXBwX2lkICYmIHQuY2xpZW50X2lkID09PSBjbGllbnRfaWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGFwcF9sb2dpbl90b2tlbikge1xuICAgICAgICAgICAgdG9rZW4gPSBhcHBfbG9naW5fdG9rZW4udG9rZW47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICAgICAgICAgIHRva2VuID0gYXV0aFRva2VuLnRva2VuO1xuICAgICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgICBoYXNoZWRUb2tlbi5hcHBfaWQgPSBhcHBfaWQ7XG4gICAgICAgICAgaGFzaGVkVG9rZW4uY2xpZW50X2lkID0gY2xpZW50X2lkO1xuICAgICAgICAgIGhhc2hlZFRva2VuLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4odXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV4dCgpO1xuICB9KS5ydW4oKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0U2VydmljZU1ldGFkYXRhID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YScpLlNlcnZpY2VNZXRhZGF0YTtcblx0U2VydmljZURvY3VtZW50ID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1kb2N1bWVudCcpLlNlcnZpY2VEb2N1bWVudDtcblx0X05VTUJFUl9UWVBFUyA9IFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCJdXG5cblx0X0JPT0xFQU5fVFlQRVMgPSBbXCJib29sZWFuXCJdXG5cblx0X0RBVEVUSU1FX09GRlNFVF9UWVBFUyA9IFsnZGF0ZXRpbWUnXVxuXG5cdF9OQU1FU1BBQ0UgPSBcIkNyZWF0b3JFbnRpdGllc1wiXG5cblx0Z2V0T2JqZWN0c09kYXRhU2NoZW1hID0gKHNwYWNlSWQpLT5cblx0XHRzY2hlbWEgPSB7dmVyc2lvbjogU3RlZWRvc09EYXRhLlZFUlNJT04sIGRhdGFTZXJ2aWNlczoge3NjaGVtYTogW119fVxuXG5cdFx0ZW50aXRpZXNfc2NoZW1hID0ge31cblxuXHRcdGVudGl0aWVzX3NjaGVtYS5uYW1lc3BhY2UgPSBfTkFNRVNQQUNFXG5cblx0XHRlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSA9IFtdXG5cblx0XHRlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMgPSBbXVxuXG5cdFx0Xy5lYWNoIENyZWF0b3IuQ29sbGVjdGlvbnMsICh2YWx1ZSwga2V5LCBsaXN0KS0+XG5cdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKVxuXHRcdFx0aWYgbm90IF9vYmplY3Q/LmVuYWJsZV9hcGlcblx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdCMg5Li76ZSuXG5cdFx0XHRrZXlzID0gW3twcm9wZXJ0eVJlZjoge25hbWU6IFwiX2lkXCIsIGNvbXB1dGVkS2V5OiB0cnVlfX1dXG5cblx0XHRcdGVudGl0aWUgPSB7XG5cdFx0XHRcdG5hbWU6IF9vYmplY3QubmFtZVxuXHRcdFx0XHRrZXk6a2V5c1xuXHRcdFx0fVxuXG5cdFx0XHRrZXlzLmZvckVhY2ggKF9rZXkpLT5cblx0XHRcdFx0ZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zLnB1c2gge1xuXHRcdFx0XHRcdHRhcmdldDogX05BTUVTUEFDRSArIFwiLlwiICsgX29iamVjdC5uYW1lICsgXCIvXCIgKyBfa2V5LnByb3BlcnR5UmVmLm5hbWUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbjogW3tcblx0XHRcdFx0XHRcdFwidGVybVwiOiBcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbXB1dGVkXCIsXG5cdFx0XHRcdFx0XHRcImJvb2xcIjogXCJ0cnVlXCJcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9XG5cblx0XHRcdCMgRW50aXR5VHlwZVxuXHRcdFx0cHJvcGVydHkgPSBbXVxuXHRcdFx0cHJvcGVydHkucHVzaCB7bmFtZTogXCJfaWRcIiwgdHlwZTogXCJFZG0uU3RyaW5nXCIsIG51bGxhYmxlOiBmYWxzZX1cblxuXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5ID0gW11cblxuXHRcdFx0Xy5mb3JFYWNoIF9vYmplY3QuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblxuXHRcdFx0XHRfcHJvcGVydHkgPSB7bmFtZTogZmllbGRfbmFtZSwgdHlwZTogXCJFZG0uU3RyaW5nXCJ9XG5cblx0XHRcdFx0aWYgXy5jb250YWlucyBfTlVNQkVSX1RZUEVTLCBmaWVsZC50eXBlXG5cdFx0XHRcdFx0X3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Eb3VibGVcIlxuXHRcdFx0XHRlbHNlIGlmIF8uY29udGFpbnMgX0JPT0xFQU5fVFlQRVMsIGZpZWxkLnR5cGVcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkJvb2xlYW5cIlxuXHRcdFx0XHRlbHNlIGlmIF8uY29udGFpbnMgX0RBVEVUSU1FX09GRlNFVF9UWVBFUywgZmllbGQudHlwZVxuXHRcdFx0XHRcdF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIlxuXHRcdFx0XHRcdF9wcm9wZXJ0eS5wcmVjaXNpb24gPSBcIjhcIlxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlcXVpcmVkXG5cdFx0XHRcdFx0X3Byb3BlcnR5Lm51bGxhYmxlID0gZmFsc2VcblxuXHRcdFx0XHRwcm9wZXJ0eS5wdXNoIF9wcm9wZXJ0eVxuXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdGlmICFfLmlzQXJyYXkocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gW3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdHJlZmVyZW5jZV90by5mb3JFYWNoIChyKS0+XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2Vfb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qociwgc3BhY2VJZClcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZV9vYmpcblx0XHRcdFx0XHRcdFx0X25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVhcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lXG5cdFx0XHRcdFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eS5wdXNoIHtcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBfbmFtZSxcblx0I1x0XHRcdFx0XHRcdFx0dHlwZTogXCJDb2xsZWN0aW9uKFwiICsgX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lICsgXCIpXCIsXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lXG5cdFx0XHRcdFx0XHRcdFx0cGFydG5lcjogX29iamVjdC5uYW1lICNUT0RPXG5cdFx0XHRcdFx0XHRcdFx0X3JlX25hbWU6IHJlZmVyZW5jZV9vYmoubmFtZVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludDogW1xuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eTogZmllbGRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlZFByb3BlcnR5OiBcIl9pZFwiXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybiBcInJlZmVyZW5jZSB0byAnI3tyfScgaW52YWxpZC5cIlxuXG5cdFx0XHRlbnRpdGllLnByb3BlcnR5ID0gcHJvcGVydHlcblx0XHRcdGVudGl0aWUubmF2aWdhdGlvblByb3BlcnR5ID0gbmF2aWdhdGlvblByb3BlcnR5XG5cblx0XHRcdGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLnB1c2ggZW50aXRpZVxuXG5cdFx0c2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaCBlbnRpdGllc19zY2hlbWFcblxuXG5cdFx0Y29udGFpbmVyX3NjaGVtYSA9IHt9XG5cdFx0Y29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIgPSB7bmFtZTogXCJjb250YWluZXJcIn1cblx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQgPSBbXVxuXG5cdFx0Xy5mb3JFYWNoIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLCAoX2V0LCBrKS0+XG5cdFx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQucHVzaCB7XG5cdFx0XHRcdFwibmFtZVwiOiBfZXQubmFtZSxcblx0XHRcdFx0XCJlbnRpdHlUeXBlXCI6IF9OQU1FU1BBQ0UgKyBcIi5cIiArIF9ldC5uYW1lLFxuXHRcdFx0XHRcIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIjogW11cblx0XHRcdH1cblxuXHRcdCMgVE9ETyBTZXJ2aWNlTWV0YWRhdGHkuI3mlK/mjIFuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5n5bGe5oCnXG4jXHRcdF8uZm9yRWFjaCBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgKF9ldCwgayktPlxuI1x0XHRcdF8uZm9yRWFjaCBfZXQubmF2aWdhdGlvblByb3BlcnR5LCAoX2V0X25wLCBucF9rKS0+XG4jXHRcdFx0XHRfZXMgPSBfLmZpbmQgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LCAoX2VzKS0+XG4jXHRcdFx0XHRcdFx0XHRyZXR1cm4gX2VzLm5hbWUgPT0gX2V0X25wLnBhcnRuZXJcbiNcbiNcdFx0XHRcdF9lcz8ubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5wdXNoIHtcInBhdGhcIjogX2V0X25wLl9yZV9uYW1lLCBcInRhcmdldFwiOiBfZXRfbnAuX3JlX25hbWV9XG4jXHRcdFx0XHRjb25zb2xlLmxvZyhcIl9lc1wiLCBfZXMpXG4jXG4jXHRcdGNvbnNvbGUubG9nKFwiY29udGFpbmVyX3NjaGVtYVwiLCBKU09OLnN0cmluZ2lmeShjb250YWluZXJfc2NoZW1hKSlcblxuXHRcdHNjaGVtYS5kYXRhU2VydmljZXMuc2NoZW1hLnB1c2ggY29udGFpbmVyX3NjaGVtYVxuXG5cdFx0cmV0dXJuIHNjaGVtYVxuXG5cdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnJywge2F1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRH0sIHtcblx0XHRnZXQ6ICgpLT5cblx0XHRcdGNvbnRleHQgPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXM/LnNwYWNlSWQpXG5cdFx0XHRzZXJ2aWNlRG9jdW1lbnQgID0gU2VydmljZURvY3VtZW50LnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKEB1cmxQYXJhbXM/LnNwYWNlSWQpLCB7Y29udGV4dDogY29udGV4dH0pO1xuXHRcdFx0Ym9keSA9IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyxcblx0XHRcdFx0XHQnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJvZHk6IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG5cdFx0XHR9O1xuXHR9KVxuXG5cdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZShTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCwge2F1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRH0sIHtcblx0XHRnZXQ6ICgpLT5cblx0XHRcdHNlcnZpY2VNZXRhZGF0YSA9IFNlcnZpY2VNZXRhZGF0YS5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYShAdXJsUGFyYW1zPy5zcGFjZUlkKSlcblx0XHRcdGJvZHkgPSBzZXJ2aWNlTWV0YWRhdGEuZG9jdW1lbnQoKVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sOyBjaGFyc2V0PXV0Zi04Jyxcblx0XHRcdFx0XHQnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJvZHk6IGJvZHlcblx0XHRcdH07XG5cdH0pIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBTZXJ2aWNlRG9jdW1lbnQsIFNlcnZpY2VNZXRhZGF0YSwgX0JPT0xFQU5fVFlQRVMsIF9EQVRFVElNRV9PRkZTRVRfVFlQRVMsIF9OQU1FU1BBQ0UsIF9OVU1CRVJfVFlQRVMsIGdldE9iamVjdHNPZGF0YVNjaGVtYTtcbiAgU2VydmljZU1ldGFkYXRhID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YScpLlNlcnZpY2VNZXRhZGF0YTtcbiAgU2VydmljZURvY3VtZW50ID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1kb2N1bWVudCcpLlNlcnZpY2VEb2N1bWVudDtcbiAgX05VTUJFUl9UWVBFUyA9IFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCJdO1xuICBfQk9PTEVBTl9UWVBFUyA9IFtcImJvb2xlYW5cIl07XG4gIF9EQVRFVElNRV9PRkZTRVRfVFlQRVMgPSBbJ2RhdGV0aW1lJ107XG4gIF9OQU1FU1BBQ0UgPSBcIkNyZWF0b3JFbnRpdGllc1wiO1xuICBnZXRPYmplY3RzT2RhdGFTY2hlbWEgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGNvbnRhaW5lcl9zY2hlbWEsIGVudGl0aWVzX3NjaGVtYSwgc2NoZW1hO1xuICAgIHNjaGVtYSA9IHtcbiAgICAgIHZlcnNpb246IFN0ZWVkb3NPRGF0YS5WRVJTSU9OLFxuICAgICAgZGF0YVNlcnZpY2VzOiB7XG4gICAgICAgIHNjaGVtYTogW11cbiAgICAgIH1cbiAgICB9O1xuICAgIGVudGl0aWVzX3NjaGVtYSA9IHt9O1xuICAgIGVudGl0aWVzX3NjaGVtYS5uYW1lc3BhY2UgPSBfTkFNRVNQQUNFO1xuICAgIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlID0gW107XG4gICAgZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zID0gW107XG4gICAgXy5lYWNoKENyZWF0b3IuQ29sbGVjdGlvbnMsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGxpc3QpIHtcbiAgICAgIHZhciBfb2JqZWN0LCBlbnRpdGllLCBrZXlzLCBuYXZpZ2F0aW9uUHJvcGVydHksIHByb3BlcnR5O1xuICAgICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZCk7XG4gICAgICBpZiAoIShfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmVuYWJsZV9hcGkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGtleXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm9wZXJ0eVJlZjoge1xuICAgICAgICAgICAgbmFtZTogXCJfaWRcIixcbiAgICAgICAgICAgIGNvbXB1dGVkS2V5OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgZW50aXRpZSA9IHtcbiAgICAgICAgbmFtZTogX29iamVjdC5uYW1lLFxuICAgICAgICBrZXk6IGtleXNcbiAgICAgIH07XG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oX2tleSkge1xuICAgICAgICByZXR1cm4gZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zLnB1c2goe1xuICAgICAgICAgIHRhcmdldDogX05BTUVTUEFDRSArIFwiLlwiICsgX29iamVjdC5uYW1lICsgXCIvXCIgKyBfa2V5LnByb3BlcnR5UmVmLm5hbWUsXG4gICAgICAgICAgYW5ub3RhdGlvbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRlcm1cIjogXCJPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZFwiLFxuICAgICAgICAgICAgICBcImJvb2xcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBwcm9wZXJ0eSA9IFtdO1xuICAgICAgcHJvcGVydHkucHVzaCh7XG4gICAgICAgIG5hbWU6IFwiX2lkXCIsXG4gICAgICAgIHR5cGU6IFwiRWRtLlN0cmluZ1wiLFxuICAgICAgICBudWxsYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgbmF2aWdhdGlvblByb3BlcnR5ID0gW107XG4gICAgICBfLmZvckVhY2goX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIHZhciBfcHJvcGVydHksIHJlZmVyZW5jZV90bztcbiAgICAgICAgX3Byb3BlcnR5ID0ge1xuICAgICAgICAgIG5hbWU6IGZpZWxkX25hbWUsXG4gICAgICAgICAgdHlwZTogXCJFZG0uU3RyaW5nXCJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKF8uY29udGFpbnMoX05VTUJFUl9UWVBFUywgZmllbGQudHlwZSkpIHtcbiAgICAgICAgICBfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRvdWJsZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKF8uY29udGFpbnMoX0JPT0xFQU5fVFlQRVMsIGZpZWxkLnR5cGUpKSB7XG4gICAgICAgICAgX3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Cb29sZWFuXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5jb250YWlucyhfREFURVRJTUVfT0ZGU0VUX1RZUEVTLCBmaWVsZC50eXBlKSkge1xuICAgICAgICAgIF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjtcbiAgICAgICAgICBfcHJvcGVydHkucHJlY2lzaW9uID0gXCI4XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICAgICAgX3Byb3BlcnR5Lm51bGxhYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcHJvcGVydHkucHVzaChfcHJvcGVydHkpO1xuICAgICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgIGlmIChyZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoIV8uaXNBcnJheShyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICByZWZlcmVuY2VfdG8gPSBbcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIHZhciBfbmFtZSwgcmVmZXJlbmNlX29iajtcbiAgICAgICAgICAgIHJlZmVyZW5jZV9vYmogPSBDcmVhdG9yLmdldE9iamVjdChyLCBzcGFjZUlkKTtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2Vfb2JqKSB7XG4gICAgICAgICAgICAgIF9uYW1lID0gZmllbGRfbmFtZSArIFN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYO1xuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBuYXZpZ2F0aW9uUHJvcGVydHkucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogX25hbWUsXG4gICAgICAgICAgICAgICAgdHlwZTogX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lLFxuICAgICAgICAgICAgICAgIHBhcnRuZXI6IF9vYmplY3QubmFtZSxcbiAgICAgICAgICAgICAgICBfcmVfbmFtZTogcmVmZXJlbmNlX29iai5uYW1lLFxuICAgICAgICAgICAgICAgIHJlZmVyZW50aWFsQ29uc3RyYWludDogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogZmllbGRfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlZFByb3BlcnR5OiBcIl9pZFwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oXCJyZWZlcmVuY2UgdG8gJ1wiICsgciArIFwiJyBpbnZhbGlkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBlbnRpdGllLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgICBlbnRpdGllLm5hdmlnYXRpb25Qcm9wZXJ0eSA9IG5hdmlnYXRpb25Qcm9wZXJ0eTtcbiAgICAgIHJldHVybiBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZS5wdXNoKGVudGl0aWUpO1xuICAgIH0pO1xuICAgIHNjaGVtYS5kYXRhU2VydmljZXMuc2NoZW1hLnB1c2goZW50aXRpZXNfc2NoZW1hKTtcbiAgICBjb250YWluZXJfc2NoZW1hID0ge307XG4gICAgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIgPSB7XG4gICAgICBuYW1lOiBcImNvbnRhaW5lclwiXG4gICAgfTtcbiAgICBjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQgPSBbXTtcbiAgICBfLmZvckVhY2goZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUsIGZ1bmN0aW9uKF9ldCwgaykge1xuICAgICAgcmV0dXJuIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldC5wdXNoKHtcbiAgICAgICAgXCJuYW1lXCI6IF9ldC5uYW1lLFxuICAgICAgICBcImVudGl0eVR5cGVcIjogX05BTUVTUEFDRSArIFwiLlwiICsgX2V0Lm5hbWUsXG4gICAgICAgIFwibmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiOiBbXVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgc2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaChjb250YWluZXJfc2NoZW1hKTtcbiAgICByZXR1cm4gc2NoZW1hO1xuICB9O1xuICBTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJycsIHtcbiAgICBhdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRURcbiAgfSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm9keSwgY29udGV4dCwgcmVmLCByZWYxLCBzZXJ2aWNlRG9jdW1lbnQ7XG4gICAgICBjb250ZXh0ID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aCgocmVmID0gdGhpcy51cmxQYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgICBzZXJ2aWNlRG9jdW1lbnQgPSBTZXJ2aWNlRG9jdW1lbnQucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoKHJlZjEgPSB0aGlzLnVybFBhcmFtcykgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCksIHtcbiAgICAgICAgY29udGV4dDogY29udGV4dFxuICAgICAgfSk7XG4gICAgICBib2R5ID0gc2VydmljZURvY3VtZW50LmRvY3VtZW50KCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEgsIHtcbiAgICBhdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRURcbiAgfSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm9keSwgcmVmLCBzZXJ2aWNlTWV0YWRhdGE7XG4gICAgICBzZXJ2aWNlTWV0YWRhdGEgPSBTZXJ2aWNlTWV0YWRhdGEucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoKHJlZiA9IHRoaXMudXJsUGFyYW1zKSAhPSBudWxsID8gcmVmLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICAgIGJvZHkgPSBzZXJ2aWNlTWV0YWRhdGEuZG9jdW1lbnQoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbDsgY2hhcnNldD11dGYtOCcsXG4gICAgICAgICAgJ09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBib2R5XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIkBTdGVlZG9zT0RhdGEgPSB7fVxuU3RlZWRvc09EYXRhLlZFUlNJT04gPSAnNC4wJ1xuU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRCA9IHRydWVcblN0ZWVkb3NPRGF0YS5BUElfUEFUSCA9ICcvYXBpL29kYXRhL3Y0LzpzcGFjZUlkJ1xuU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEggPSAnJG1ldGFkYXRhJ1xuU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVggPSBcIl9leHBhbmRcIlxuU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoID0gKHNwYWNlSWQpLT5cblx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgnYXBpL29kYXRhL3Y0LycgKyBzcGFjZUlkKVxuXG5TdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoID0gKHNwYWNlSWQsb2JqZWN0X25hbWUpLT5cblx0cmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIFwiLyN7b2JqZWN0X25hbWV9XCJcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGggPSAoc3BhY2VJZCktPlxuXHRcdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je1N0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIfVwiXG5cblx0U3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGggPSAoc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIFwiIyN7b2JqZWN0X25hbWV9XCJcblx0U3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoID0gKHNwYWNlSWQsb2JqZWN0X25hbWUpLT5cblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgXCIvI3tvYmplY3RfbmFtZX1cIlxuXG5cblx0QFN0ZWVkb3NPZGF0YUFQSSA9IG5ldyBPZGF0YVJlc3RpdnVzXG5cdFx0YXBpUGF0aDogU3RlZWRvc09EYXRhLkFQSV9QQVRILFxuXHRcdHVzZURlZmF1bHRBdXRoOiB0cnVlXG5cdFx0cHJldHR5SnNvbjogdHJ1ZVxuXHRcdGVuYWJsZUNvcnM6IHRydWVcblx0XHRkZWZhdWx0SGVhZGVyczpcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiIsInRoaXMuU3RlZWRvc09EYXRhID0ge307XG5cblN0ZWVkb3NPRGF0YS5WRVJTSU9OID0gJzQuMCc7XG5cblN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUQgPSB0cnVlO1xuXG5TdGVlZG9zT0RhdGEuQVBJX1BBVEggPSAnL2FwaS9vZGF0YS92NC86c3BhY2VJZCc7XG5cblN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIID0gJyRtZXRhZGF0YSc7XG5cblN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYID0gXCJfZXhwYW5kXCI7XG5cblN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgnYXBpL29kYXRhL3Y0LycgKyBzcGFjZUlkKTtcbn07XG5cblN0ZWVkb3NPRGF0YS5nZXRPRGF0YVBhdGggPSBmdW5jdGlvbihzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyAoXCIvXCIgKyBTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCk7XG4gIH07XG4gIFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIChcIiNcIiArIG9iamVjdF9uYW1lKTtcbiAgfTtcbiAgU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICB9O1xuICB0aGlzLlN0ZWVkb3NPZGF0YUFQSSA9IG5ldyBPZGF0YVJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiBTdGVlZG9zT0RhdGEuQVBJX1BBVEgsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiB0cnVlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
