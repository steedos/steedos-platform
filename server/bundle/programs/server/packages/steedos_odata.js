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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL29iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21pZGRsZXdhcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWlkZGxld2FyZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsImNvb2tpZXMiLCJnZXRVc2VyUXVlcnlTZWxlY3RvciIsInVzZXJWYWxpZGF0b3IiLCJBdXRoIiwiTWF0Y2giLCJXaGVyZSIsInVzZXIiLCJjaGVjayIsImlkIiwiT3B0aW9uYWwiLCJTdHJpbmciLCJ1c2VybmFtZSIsImVtYWlsIiwiXyIsImtleXMiLCJsZW5ndGgiLCJFcnJvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicGFzc3dvcmQiLCJhdXRoVG9rZW4iLCJhdXRoZW50aWNhdGluZ1VzZXIiLCJhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciIsImhhc2hlZFRva2VuIiwicGFzc3dvcmRWZXJpZmljYXRpb24iLCJyZWYiLCJzcGFjZV91c2VycyIsInNwYWNlcyIsIk1ldGVvciIsInVzZXJzIiwiZmluZE9uZSIsInNlcnZpY2VzIiwiQWNjb3VudHMiLCJfY2hlY2tQYXNzd29yZCIsImVycm9yIiwiX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4iLCJfaGFzaFN0YW1wZWRUb2tlbiIsIl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIiwiX2lkIiwiZGIiLCJmaW5kIiwiZmV0Y2giLCJlYWNoIiwic3UiLCJzcGFjZSIsImlzX3BhaWQiLCJpbmRleE9mIiwiYWRtaW5zIiwicHVzaCIsIm5hbWUiLCJ0b2tlbiIsInVzZXJJZCIsImFkbWluU3BhY2VzIiwiZW52IiwicHJvY2VzcyIsIk5PREVfRU5WIiwiaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UiLCJlcnIiLCJyZXEiLCJyZXMiLCJzdGF0dXNDb2RlIiwic3RhdHVzIiwibXNnIiwic3RhY2siLCJ0b1N0cmluZyIsImNvbnNvbGUiLCJoZWFkZXJzU2VudCIsInNvY2tldCIsImRlc3Ryb3kiLCJzZXRIZWFkZXIiLCJCdWZmZXIiLCJieXRlTGVuZ3RoIiwibWV0aG9kIiwiZW5kIiwic2hhcmUiLCJSb3V0ZSIsImFwaSIsInBhdGgiLCJvcHRpb25zIiwiZW5kcG9pbnRzMSIsImVuZHBvaW50cyIsInByb3RvdHlwZSIsImFkZFRvQXBpIiwiYXZhaWxhYmxlTWV0aG9kcyIsImFsbG93ZWRNZXRob2RzIiwiZnVsbFBhdGgiLCJyZWplY3RlZE1ldGhvZHMiLCJzZWxmIiwiY29udGFpbnMiLCJfY29uZmlnIiwicGF0aHMiLCJleHRlbmQiLCJkZWZhdWx0T3B0aW9uc0VuZHBvaW50IiwiX3Jlc29sdmVFbmRwb2ludHMiLCJfY29uZmlndXJlRW5kcG9pbnRzIiwiZmlsdGVyIiwicmVqZWN0IiwiYXBpUGF0aCIsImVuZHBvaW50IiwiSnNvblJvdXRlcyIsImFkZCIsImRvbmVGdW5jIiwiZW5kcG9pbnRDb250ZXh0IiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VJbml0aWF0ZWQiLCJ1cmxQYXJhbXMiLCJwYXJhbXMiLCJxdWVyeVBhcmFtcyIsInF1ZXJ5IiwiYm9keVBhcmFtcyIsImJvZHkiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJkb25lIiwiX2NhbGxFbmRwb2ludCIsImVycm9yMSIsImhlYWRlcnMiLCJfcmVzcG9uZCIsIm1lc3NhZ2UiLCJqb2luIiwidG9VcHBlckNhc2UiLCJpc0Z1bmN0aW9uIiwiYWN0aW9uIiwicmVmMSIsInJlZjIiLCJyb2xlUmVxdWlyZWQiLCJ1bmlvbiIsImlzRW1wdHkiLCJhdXRoUmVxdWlyZWQiLCJzcGFjZVJlcXVpcmVkIiwiaW52b2NhdGlvbiIsIl9hdXRoQWNjZXB0ZWQiLCJfcm9sZUFjY2VwdGVkIiwiX3NwYWNlQWNjZXB0ZWQiLCJERFBDb21tb24iLCJNZXRob2RJbnZvY2F0aW9uIiwiaXNTaW11bGF0aW9uIiwiY29ubmVjdGlvbiIsInJhbmRvbVNlZWQiLCJtYWtlUnBjU2VlZCIsIkREUCIsIl9DdXJyZW50SW52b2NhdGlvbiIsIndpdGhWYWx1ZSIsImNhbGwiLCJfYXV0aGVudGljYXRlIiwiYXV0aCIsInVzZXJTZWxlY3RvciIsInNwYWNlX3VzZXJzX2NvdW50Iiwic3BhY2VJZCIsImNvdW50IiwiaW50ZXJzZWN0aW9uIiwicm9sZXMiLCJkZWZhdWx0SGVhZGVycyIsImRlbGF5SW5NaWxsaXNlY29uZHMiLCJtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyIsInJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvIiwic2VuZFJlc3BvbnNlIiwiX2xvd2VyQ2FzZUtleXMiLCJtYXRjaCIsInByZXR0eUpzb24iLCJKU09OIiwic3RyaW5naWZ5Iiwid3JpdGVIZWFkIiwid3JpdGUiLCJNYXRoIiwicmFuZG9tIiwic2V0VGltZW91dCIsIm9iamVjdCIsImNoYWluIiwicGFpcnMiLCJtYXAiLCJhdHRyIiwidG9Mb3dlckNhc2UiLCJ2YWx1ZSIsIkNvb2tpZXMiLCJPZGF0YVJlc3RpdnVzIiwiYmFzaWNBdXRoIiwiaXRlbSIsImkiLCJsIiwiY29yc0hlYWRlcnMiLCJfcm91dGVzIiwidXNlRGVmYXVsdEF1dGgiLCJ2ZXJzaW9uIiwiX3VzZXIiLCJnZXQiLCJfaGFzaExvZ2luVG9rZW4iLCJlbmFibGVDb3JzIiwic2xpY2UiLCJsYXN0IiwiX2luaXRBdXRoIiwidXNlQXV0aCIsIndhcm4iLCJhZGRSb3V0ZSIsInJvdXRlIiwiYWRkQ29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJjb2xsZWN0aW9uRW5kcG9pbnRzIiwiY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzIiwiZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uIiwiZW50aXR5Um91dGVFbmRwb2ludHMiLCJleGNsdWRlZEVuZHBvaW50cyIsIm1ldGhvZHMiLCJtZXRob2RzT25Db2xsZWN0aW9uIiwicm91dGVPcHRpb25zIiwiX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzIiwiX2NvbGxlY3Rpb25FbmRwb2ludHMiLCJfbmFtZSIsImNvbmZpZ3VyZWRFbmRwb2ludCIsImVuZHBvaW50T3B0aW9ucyIsIm1ldGhvZFR5cGUiLCJjbG9uZSIsImVudGl0eSIsInNlbGVjdG9yIiwiZGF0YSIsInB1dCIsImVudGl0eUlzVXBkYXRlZCIsInVwZGF0ZSIsIiRzZXQiLCJyZW1vdmUiLCJwb3N0IiwiZW50aXR5SWQiLCJpbnNlcnQiLCJnZXRBbGwiLCJlbnRpdGllcyIsImZpZWxkcyIsInByb2ZpbGUiLCJjcmVhdGVVc2VyIiwibG9nb3V0IiwiZSIsImV4dHJhRGF0YSIsInNlYXJjaFF1ZXJ5IiwicmVhc29uIiwib25Mb2dnZWRJbiIsImV4dHJhIiwiaW5kZXgiLCJ0b2tlbkZpZWxkTmFtZSIsInRva2VuTG9jYXRpb24iLCJ0b2tlblBhdGgiLCJ0b2tlblJlbW92YWxRdWVyeSIsInRva2VuVG9SZW1vdmUiLCJsYXN0SW5kZXhPZiIsInN1YnN0cmluZyIsIiRwdWxsIiwib25Mb2dnZWRPdXQiLCJzdGFydHVwIiwiZ2V0T2JqZWN0IiwiZ2V0T2JqZWN0cyIsIm9iamVjdF9uYW1lcyIsInNwbGl0IiwiZm9yRWFjaCIsIm9iamVjdF9uYW1lIiwib2JqZWN0X3Blcm1pc3Npb25zIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNDdXJyZW50IiwicHNldHNVc2VyIiwiQ3JlYXRvciIsIk9iamVjdHMiLCJnZXRPYmplY3ROYW1lIiwiZ2V0Q29sbGVjdGlvbiIsImFzc2lnbmVkX2FwcHMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImJpbmQiLCJsaXN0X3ZpZXdzIiwicGVybWlzc2lvbl9zZXQiLCJhbGxvd1JlYWQiLCJhbGxvd0VkaXQiLCJhbGxvd0RlbGV0ZSIsImFsbG93Q3JlYXRlIiwibW9kaWZ5QWxsUmVjb3JkcyIsImZpZWxkIiwia2V5IiwiX2ZpZWxkIiwidW5lZGl0YWJsZV9maWVsZHMiLCJyZWFkb25seSIsInVucmVhZGFibGVfZmllbGRzIiwiU3RlZWRvc09EYXRhIiwiQVBJX1BBVEgiLCJuZXh0IiwiX29iaiIsIlN0ZWVkb3MiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJNZXRlb3JPRGF0YVJvdXRlciIsIk9EYXRhUm91dGVyIiwiYXBwIiwiZXhwcmVzcyIsInVzZSIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInN0ZWVkb3NTY2hlbWEiLCJnZXREYXRhU291cmNlcyIsImRhdGFzb3VyY2UiLCJvdGhlckFwcCIsIkZpYmVyIiwiYXV0aG9yaXphdGlvbkNhY2hlIiwiTWlkZGxld2FyZSIsImFwcF9pZCIsImFwcF9sb2dpbl90b2tlbiIsImNsaWVudF9pZCIsImlzQXV0aGVkIiwibG9naW5Ub2tlbnMiLCJyZXN1bHQiLCJhY2Nlc3NfdG9rZW4iLCJsb2ciLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJwYXJzZSIsInBhc3MiLCJyZXN1bWUiLCJ0IiwicnVuIiwiU2VydmljZURvY3VtZW50IiwiU2VydmljZU1ldGFkYXRhIiwiX0JPT0xFQU5fVFlQRVMiLCJfREFURVRJTUVfT0ZGU0VUX1RZUEVTIiwiX05BTUVTUEFDRSIsIl9OVU1CRVJfVFlQRVMiLCJnZXRPYmplY3RzT2RhdGFTY2hlbWEiLCJjb250YWluZXJfc2NoZW1hIiwiZW50aXRpZXNfc2NoZW1hIiwic2NoZW1hIiwiVkVSU0lPTiIsImRhdGFTZXJ2aWNlcyIsIm5hbWVzcGFjZSIsImVudGl0eVR5cGUiLCJhbm5vdGF0aW9ucyIsIkNvbGxlY3Rpb25zIiwibGlzdCIsIl9vYmplY3QiLCJlbnRpdGllIiwibmF2aWdhdGlvblByb3BlcnR5IiwicHJvcGVydHkiLCJlbmFibGVfYXBpIiwicHJvcGVydHlSZWYiLCJjb21wdXRlZEtleSIsIl9rZXkiLCJ0YXJnZXQiLCJhbm5vdGF0aW9uIiwidHlwZSIsIm51bGxhYmxlIiwiZmllbGRfbmFtZSIsIl9wcm9wZXJ0eSIsInJlZmVyZW5jZV90byIsInByZWNpc2lvbiIsInJlcXVpcmVkIiwiaXNBcnJheSIsInIiLCJyZWZlcmVuY2Vfb2JqIiwiRVhQQU5EX0ZJRUxEX1NVRkZJWCIsInBhcnRuZXIiLCJfcmVfbmFtZSIsInJlZmVyZW50aWFsQ29uc3RyYWludCIsInJlZmVyZW5jZWRQcm9wZXJ0eSIsImVudGl0eUNvbnRhaW5lciIsImVudGl0eVNldCIsIl9ldCIsImsiLCJTdGVlZG9zT2RhdGFBUEkiLCJBVVRIUkVRVUlSRUQiLCJjb250ZXh0Iiwic2VydmljZURvY3VtZW50IiwiZ2V0TWV0YURhdGFQYXRoIiwicHJvY2Vzc01ldGFkYXRhSnNvbiIsImRvY3VtZW50IiwiTUVUQURBVEFfUEFUSCIsInNlcnZpY2VNZXRhZGF0YSIsImdldFJvb3RQYXRoIiwiYWJzb2x1dGVVcmwiLCJnZXRPRGF0YVBhdGgiLCJpc1NlcnZlciIsImdldE9EYXRhQ29udGV4dFBhdGgiLCJnZXRPRGF0YU5leHRMaW5rUGF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUFyQjtBQUNBQyxPQUFPLENBQUMseUJBQUQsQ0FBUDs7QUFHQUosZ0JBQWdCLENBQUM7QUFDaEIsZ0JBQWMsUUFERTtBQUVoQiwrQkFBNkIsUUFGYjtBQUdoQiwrQkFBNkIsUUFIYjtBQUloQixzQkFBb0IsU0FKSjtBQUtoQkssU0FBTyxFQUFFO0FBTE8sQ0FBRCxFQU1iLGVBTmEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7O0FDSkEsSUFBQUMsb0JBQUEsRUFBQUMsYUFBQTtBQUFBLEtBQUNDLElBQUQsVUFBQ0EsSUFBRCxHQUFVLEVBQVYsRSxDQUVBOzs7QUFHQUQsZ0JBQWdCRSxNQUFNQyxLQUFOLENBQVksVUFBQ0MsSUFBRDtBQUMzQkMsUUFBTUQsSUFBTixFQUNDO0FBQUFFLFFBQUlKLE1BQU1LLFFBQU4sQ0FBZUMsTUFBZixDQUFKO0FBQ0FDLGNBQVVQLE1BQU1LLFFB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UDtBQUQyQixDQUE1Qjs7QUFHQSxJQUFHL04sT0FBT3dWLFFBQVY7QUFDQy9GLGVBQWF1RixlQUFiLEdBQStCLFVBQUN4TixPQUFEO0FBQzlCLFdBQU9pSSxhQUFhNEYsV0FBYixDQUF5QjdOLE9BQXpCLEtBQW9DLE1BQUlpSSxhQUFhMEYsYUFBckQsQ0FBUDtBQUQ4QixHQUEvQjs7QUFHQTFGLGVBQWFnRyxtQkFBYixHQUFtQyxVQUFDak8sT0FBRCxFQUFVdUcsV0FBVjtBQUNsQyxXQUFPMEIsYUFBYXVGLGVBQWIsQ0FBNkJ4TixPQUE3QixLQUF3QyxNQUFJdUcsV0FBNUMsQ0FBUDtBQURrQyxHQUFuQzs7QUFFQTBCLGVBQWFpRyxvQkFBYixHQUFvQyxVQUFDbE8sT0FBRCxFQUFTdUcsV0FBVDtBQUNuQyxXQUFPMEIsYUFBYTRGLFdBQWIsQ0FBeUI3TixPQUF6QixLQUFvQyxNQUFJdUcsV0FBeEMsQ0FBUDtBQURtQyxHQUFwQzs7QUFJQSxPQUFDNkcsZUFBRCxHQUFtQixJQUFJekwsYUFBSixDQUNsQjtBQUFBOUUsYUFBU29MLGFBQWFDLFFBQXRCO0FBQ0FoRyxvQkFBZ0IsSUFEaEI7QUFFQXZCLGdCQUFZLElBRlo7QUFHQTRCLGdCQUFZLElBSFo7QUFJQW5DLG9CQUNDO0FBQUEsc0JBQWdCO0FBQWhCO0FBTEQsR0FEa0IsQ0FBbkI7QUNpQkEsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGZpeCB3YXJuaW5nOiB4eHggbm90IGluc3RhbGxlZFxyXG5yZXF1aXJlKFwiYmFzaWMtYXV0aC9wYWNrYWdlLmpzb25cIik7XHJcblxyXG5pbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdCdiYXNpYy1hdXRoJzogJ14yLjAuMScsXHJcblx0J29kYXRhLXY0LXNlcnZpY2UtbWV0YWRhdGEnOiBcIl4wLjEuNlwiLFxyXG5cdFwib2RhdGEtdjQtc2VydmljZS1kb2N1bWVudFwiOiBcIl4wLjAuM1wiLFxyXG5cdCdvZGF0YS12NC1tb25nb2RiJzogXCJeMC4xLjEyXCIsXHJcblx0Y29va2llczogXCJeMC42LjFcIixcclxufSwgJ3N0ZWVkb3M6b2RhdGEnKTtcclxuIiwiQEF1dGggb3I9IHt9XHJcblxyXG4jIyNcclxuXHRBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXHJcbiMjI1xyXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUgKHVzZXIpIC0+XHJcblx0Y2hlY2sgdXNlcixcclxuXHRcdGlkOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuXHRcdHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuXHRcdGVtYWlsOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuXHJcblx0aWYgXy5rZXlzKHVzZXIpLmxlbmd0aCBpcyBub3QgMVxyXG5cdFx0dGhyb3cgbmV3IE1hdGNoLkVycm9yICdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJ1xyXG5cclxuXHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHJcbiMjI1xyXG5cdFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcclxuIyMjXHJcbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gKHVzZXIpIC0+XHJcblx0aWYgdXNlci5pZFxyXG5cdFx0cmV0dXJuIHsnX2lkJzogdXNlci5pZH1cclxuXHRlbHNlIGlmIHVzZXIudXNlcm5hbWVcclxuXHRcdHJldHVybiB7J3VzZXJuYW1lJzogdXNlci51c2VybmFtZX1cclxuXHRlbHNlIGlmIHVzZXIuZW1haWxcclxuXHRcdHJldHVybiB7J2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbH1cclxuXHJcblx0IyBXZSBzaG91bGRuJ3QgYmUgaGVyZSBpZiB0aGUgdXNlciBvYmplY3Qgd2FzIHByb3Blcmx5IHZhbGlkYXRlZFxyXG5cdHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcidcclxuXHJcblxyXG4jIyNcclxuXHRMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcclxuIyMjXHJcbkBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gKHVzZXIsIHBhc3N3b3JkKSAtPlxyXG5cdGlmIG5vdCB1c2VyIG9yIG5vdCBwYXNzd29yZFxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG5cdCMgVmFsaWRhdGUgdGhlIGxvZ2luIGlucHV0IHR5cGVzXHJcblx0Y2hlY2sgdXNlciwgdXNlclZhbGlkYXRvclxyXG5cdGNoZWNrIHBhc3N3b3JkLCBTdHJpbmdcclxuXHJcblx0IyBSZXRyaWV2ZSB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxyXG5cdGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcilcclxuXHRhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvcilcclxuXHJcblx0aWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlclxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblx0aWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcz8ucGFzc3dvcmRcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuXHQjIEF1dGhlbnRpY2F0ZSB0aGUgdXNlcidzIHBhc3N3b3JkXHJcblx0cGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCBhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkXHJcblx0aWYgcGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3JcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuXHQjIEFkZCBhIG5ldyBhdXRoIHRva2VuIHRvIHRoZSB1c2VyJ3MgYWNjb3VudFxyXG5cdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcclxuXHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxyXG5cdEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuXHJcblxyXG5cdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZH0pLmZldGNoKClcclxuXHRzcGFjZXMgPSBbXVxyXG5cdF8uZWFjaCBzcGFjZV91c2VycywgKHN1KS0+XHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKVxyXG5cdFx0IyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXHJcblx0XHRpZiBzcGFjZT8uaXNfcGFpZCBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcik+PTBcclxuXHRcdFx0c3BhY2VzLnB1c2hcclxuXHRcdFx0XHRfaWQ6IHNwYWNlLl9pZFxyXG5cdFx0XHRcdG5hbWU6IHNwYWNlLm5hbWVcclxuXHRyZXR1cm4ge2F1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLCB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGFkbWluU3BhY2VzOiBzcGFjZXN9XHJcbiIsInZhciBnZXRVc2VyUXVlcnlTZWxlY3RvciwgdXNlclZhbGlkYXRvcjtcblxudGhpcy5BdXRoIHx8ICh0aGlzLkF1dGggPSB7fSk7XG5cblxuLypcblx0QSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuICovXG5cbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbih1c2VyKSB7XG4gIGNoZWNrKHVzZXIsIHtcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKVxuICB9KTtcbiAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggPT09ICExKSB7XG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKCdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuXG4vKlxuXHRSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4gKi9cblxuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSBmdW5jdGlvbih1c2VyKSB7XG4gIGlmICh1c2VyLmlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdfaWQnOiB1c2VyLmlkXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWVcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIuZW1haWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJyk7XG59O1xuXG5cbi8qXG5cdExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuICovXG5cbnRoaXMuQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3N3b3JkKSB7XG4gIHZhciBhdXRoVG9rZW4sIGF1dGhlbnRpY2F0aW5nVXNlciwgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IsIGhhc2hlZFRva2VuLCBwYXNzd29yZFZlcmlmaWNhdGlvbiwgcmVmLCBzcGFjZV91c2Vycywgc3BhY2VzO1xuICBpZiAoIXVzZXIgfHwgIXBhc3N3b3JkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBjaGVjayh1c2VyLCB1c2VyVmFsaWRhdG9yKTtcbiAgY2hlY2socGFzc3dvcmQsIFN0cmluZyk7XG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcik7XG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKTtcbiAgaWYgKCFhdXRoZW50aWNhdGluZ1VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGlmICghKChyZWYgPSBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXMpICE9IG51bGwgPyByZWYucGFzc3dvcmQgOiB2b2lkIDApKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmQpO1xuICBpZiAocGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4oYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW4pO1xuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWRcbiAgfSkuZmV0Y2goKTtcbiAgc3BhY2VzID0gW107XG4gIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24oc3UpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSk7XG4gICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcikgPj0gMCkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHtcbiAgICAgICAgX2lkOiBzcGFjZS5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgYXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sXG4gICAgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLFxuICAgIGFkbWluU3BhY2VzOiBzcGFjZXNcbiAgfTtcbn07XG4iLCIvLyBXZSBuZWVkIGEgZnVuY3Rpb24gdGhhdCB0cmVhdHMgdGhyb3duIGVycm9ycyBleGFjdGx5IGxpa2UgSXJvbiBSb3V0ZXIgd291bGQuXHJcbi8vIFRoaXMgZmlsZSBpcyB3cml0dGVuIGluIEphdmFTY3JpcHQgdG8gZW5hYmxlIGNvcHktcGFzdGluZyBJcm9uIFJvdXRlciBjb2RlLlxyXG5cclxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMM1xyXG52YXIgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcclxuXHJcbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDQ3XHJcbmlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlID0gZnVuY3Rpb24oZXJyLCByZXEsIHJlcykge1xyXG5cdGlmIChyZXMuc3RhdHVzQ29kZSA8IDQwMClcclxuXHRcdHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG5cclxuXHRpZiAoZXJyLnN0YXR1cylcclxuXHRcdHJlcy5zdGF0dXNDb2RlID0gZXJyLnN0YXR1cztcclxuXHJcblx0aWYgKGVudiA9PT0gJ2RldmVsb3BtZW50JylcclxuXHRcdG1zZyA9IChlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpICsgJ1xcbic7XHJcblx0ZWxzZVxyXG5cdC8vWFhYIGdldCB0aGlzIGZyb20gc3RhbmRhcmQgZGljdCBvZiBlcnJvciBtZXNzYWdlcz9cclxuXHRcdG1zZyA9ICdTZXJ2ZXIgZXJyb3IuJztcclxuXHJcblx0Y29uc29sZS5lcnJvcihlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpO1xyXG5cclxuXHRpZiAocmVzLmhlYWRlcnNTZW50KVxyXG5cdFx0cmV0dXJuIHJlcS5zb2NrZXQuZGVzdHJveSgpO1xyXG5cclxuXHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XHJcblx0cmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBCdWZmZXIuYnl0ZUxlbmd0aChtc2cpKTtcclxuXHRpZiAocmVxLm1ldGhvZCA9PT0gJ0hFQUQnKVxyXG5cdFx0cmV0dXJuIHJlcy5lbmQoKTtcclxuXHRyZXMuZW5kKG1zZyk7XHJcblx0cmV0dXJuO1xyXG59XHJcbiIsImNsYXNzIHNoYXJlLlJvdXRlXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoQGFwaSwgQHBhdGgsIEBvcHRpb25zLCBAZW5kcG9pbnRzKSAtPlxyXG5cdFx0IyBDaGVjayBpZiBvcHRpb25zIHdlcmUgcHJvdmlkZWRcclxuXHRcdGlmIG5vdCBAZW5kcG9pbnRzXHJcblx0XHRcdEBlbmRwb2ludHMgPSBAb3B0aW9uc1xyXG5cdFx0XHRAb3B0aW9ucyA9IHt9XHJcblxyXG5cclxuXHRhZGRUb0FwaTogZG8gLT5cclxuXHRcdGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddXHJcblxyXG5cdFx0cmV0dXJuIC0+XHJcblx0XHRcdHNlbGYgPSB0aGlzXHJcblxyXG5cdFx0XHQjIFRocm93IGFuIGVycm9yIGlmIGEgcm91dGUgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCBhdCB0aGlzIHBhdGhcclxuXHRcdFx0IyBUT0RPOiBDaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoIHBhdGhzIHRoYXQgZm9sbG93IHNhbWUgcGF0dGVybiB3aXRoIGRpZmZlcmVudCBwYXJhbWV0ZXIgbmFtZXNcclxuXHRcdFx0aWYgXy5jb250YWlucyBAYXBpLl9jb25maWcucGF0aHMsIEBwYXRoXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6ICN7QHBhdGh9XCJcclxuXHJcblx0XHRcdCMgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgT1BUSU9OUyBlbmRwb2ludCB3aXRoIG91ciBvd25cclxuXHRcdFx0QGVuZHBvaW50cyA9IF8uZXh0ZW5kIG9wdGlvbnM6IEBhcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50LCBAZW5kcG9pbnRzXHJcblxyXG5cdFx0XHQjIENvbmZpZ3VyZSBlYWNoIGVuZHBvaW50IG9uIHRoaXMgcm91dGVcclxuXHRcdFx0QF9yZXNvbHZlRW5kcG9pbnRzKClcclxuXHRcdFx0QF9jb25maWd1cmVFbmRwb2ludHMoKVxyXG5cclxuXHRcdFx0IyBBZGQgdG8gb3VyIGxpc3Qgb2YgZXhpc3RpbmcgcGF0aHNcclxuXHRcdFx0QGFwaS5fY29uZmlnLnBhdGhzLnB1c2ggQHBhdGhcclxuXHJcblx0XHRcdGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cclxuXHRcdFx0XHRfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcclxuXHRcdFx0cmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cclxuXHRcdFx0XHRfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcclxuXHJcblx0XHRcdCMgU2V0dXAgZW5kcG9pbnRzIG9uIHJvdXRlXHJcblx0XHRcdGZ1bGxQYXRoID0gQGFwaS5fY29uZmlnLmFwaVBhdGggKyBAcGF0aFxyXG5cdFx0XHRfLmVhY2ggYWxsb3dlZE1ldGhvZHMsIChtZXRob2QpIC0+XHJcblx0XHRcdFx0ZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdXHJcblx0XHRcdFx0SnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxyXG5cdFx0XHRcdFx0IyBBZGQgZnVuY3Rpb24gdG8gZW5kcG9pbnQgY29udGV4dCBmb3IgaW5kaWNhdGluZyBhIHJlc3BvbnNlIGhhcyBiZWVuIGluaXRpYXRlZCBtYW51YWxseVxyXG5cdFx0XHRcdFx0cmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0ZG9uZUZ1bmMgPSAtPlxyXG5cdFx0XHRcdFx0XHRyZXNwb25zZUluaXRpYXRlZCA9IHRydWVcclxuXHJcblx0XHRcdFx0XHRlbmRwb2ludENvbnRleHQgPVxyXG5cdFx0XHRcdFx0XHR1cmxQYXJhbXM6IHJlcS5wYXJhbXNcclxuXHRcdFx0XHRcdFx0cXVlcnlQYXJhbXM6IHJlcS5xdWVyeVxyXG5cdFx0XHRcdFx0XHRib2R5UGFyYW1zOiByZXEuYm9keVxyXG5cdFx0XHRcdFx0XHRyZXF1ZXN0OiByZXFcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2U6IHJlc1xyXG5cdFx0XHRcdFx0XHRkb25lOiBkb25lRnVuY1xyXG5cdFx0XHRcdFx0IyBBZGQgZW5kcG9pbnQgY29uZmlnIG9wdGlvbnMgdG8gY29udGV4dFxyXG5cdFx0XHRcdFx0Xy5leHRlbmQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG5cclxuXHRcdFx0XHRcdCMgUnVuIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRcclxuXHRcdFx0XHRcdHJlc3BvbnNlRGF0YSA9IG51bGxcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRyZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0IyBEbyBleGFjdGx5IHdoYXQgSXJvbiBSb3V0ZXIgd291bGQgaGF2ZSBkb25lLCB0byBhdm9pZCBjaGFuZ2luZyB0aGUgQVBJXHJcblx0XHRcdFx0XHRcdGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XHJcblx0XHRcdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0XHRcdGlmIHJlc3BvbnNlSW5pdGlhdGVkXHJcblx0XHRcdFx0XHRcdCMgRW5zdXJlIHRoZSByZXNwb25zZSBpcyBwcm9wZXJseSBjb21wbGV0ZWRcclxuXHRcdFx0XHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpZiByZXMuaGVhZGVyc1NlbnRcclxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgcmVzcG9uc2VEYXRhIGlzIG51bGwgb3IgcmVzcG9uc2VEYXRhIGlzIHVuZGVmaW5lZFxyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcclxuXHJcblx0XHRcdFx0XHQjIEdlbmVyYXRlIGFuZCByZXR1cm4gdGhlIGh0dHAgcmVzcG9uc2UsIGhhbmRsaW5nIHRoZSBkaWZmZXJlbnQgZW5kcG9pbnQgcmVzcG9uc2UgdHlwZXNcclxuXHRcdFx0XHRcdGlmIHJlc3BvbnNlRGF0YS5ib2R5IGFuZCAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgb3IgcmVzcG9uc2VEYXRhLmhlYWRlcnMpXHJcblx0XHRcdFx0XHRcdHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGFcclxuXHJcblx0XHRcdF8uZWFjaCByZWplY3RlZE1ldGhvZHMsIChtZXRob2QpIC0+XHJcblx0XHRcdFx0SnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxyXG5cdFx0XHRcdFx0cmVzcG9uc2VEYXRhID0gc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xyXG5cdFx0XHRcdFx0aGVhZGVycyA9ICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxyXG5cdFx0XHRcdFx0c2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzXHJcblxyXG5cclxuXHQjIyNcclxuXHRcdENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxyXG5cdFx0ZnVuY3Rpb25cclxuXHJcblx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cclxuXHQjIyNcclxuXHRfcmVzb2x2ZUVuZHBvaW50czogLT5cclxuXHRcdF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSAtPlxyXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24oZW5kcG9pbnQpXHJcblx0XHRcdFx0ZW5kcG9pbnRzW21ldGhvZF0gPSB7YWN0aW9uOiBlbmRwb2ludH1cclxuXHRcdHJldHVyblxyXG5cclxuXHJcblx0IyMjXHJcblx0XHRDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XHJcblx0XHRiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcclxuXHJcblx0XHRBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxyXG5cdFx0ZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcclxuXHRcdG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxyXG5cclxuXHRcdEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxyXG5cdFx0YWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcclxuXHRcdHJlc3BlY3RpdmVseS5cclxuXHJcblx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cclxuXHRcdEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcclxuXHQjIyNcclxuXHRfY29uZmlndXJlRW5kcG9pbnRzOiAtPlxyXG5cdFx0Xy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kKSAtPlxyXG5cdFx0XHRpZiBtZXRob2QgaXNudCAnb3B0aW9ucydcclxuXHRcdFx0XHQjIENvbmZpZ3VyZSBhY2NlcHRhYmxlIHJvbGVzXHJcblx0XHRcdFx0aWYgbm90IEBvcHRpb25zPy5yb2xlUmVxdWlyZWRcclxuXHRcdFx0XHRcdEBvcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdXHJcblx0XHRcdFx0aWYgbm90IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG5cdFx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW11cclxuXHRcdFx0XHRlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBfLnVuaW9uIGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgQG9wdGlvbnMucm9sZVJlcXVpcmVkXHJcblx0XHRcdFx0IyBNYWtlIGl0IGVhc2llciB0byBjaGVjayBpZiBubyByb2xlcyBhcmUgcmVxdWlyZWRcclxuXHRcdFx0XHRpZiBfLmlzRW1wdHkgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcblx0XHRcdFx0XHRlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZVxyXG5cclxuXHRcdFx0XHQjIENvbmZpZ3VyZSBhdXRoIHJlcXVpcmVtZW50XHJcblx0XHRcdFx0aWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkIGlzIHVuZGVmaW5lZFxyXG5cdFx0XHRcdFx0aWYgQG9wdGlvbnM/LmF1dGhSZXF1aXJlZCBvciBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuXHRcdFx0XHRcdFx0ZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZVxyXG5cclxuXHRcdFx0XHRpZiBAb3B0aW9ucz8uc3BhY2VSZXF1aXJlZFxyXG5cdFx0XHRcdFx0ZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IEBvcHRpb25zLnNwYWNlUmVxdWlyZWRcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdCwgdGhpc1xyXG5cdFx0cmV0dXJuXHJcblxyXG5cclxuXHQjIyNcclxuXHRcdEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcclxuXHJcblx0XHRAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcclxuXHQjIyNcclxuXHRfY2FsbEVuZHBvaW50OiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuXHRcdCMgQ2FsbCB0aGUgZW5kcG9pbnQgaWYgYXV0aGVudGljYXRpb24gZG9lc24ndCBmYWlsXHJcblx0XHRpZiBAX2F1dGhBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcblx0XHRcdGlmIEBfcm9sZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuXHRcdFx0XHRpZiBAX3NwYWNlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG5cdFx0XHRcdFx0I2VuZHBvaW50LmFjdGlvbi5jYWxsIGVuZHBvaW50Q29udGV4dFxyXG5cdFx0XHRcdFx0aW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvblxyXG5cdFx0XHRcdFx0XHRpc1NpbXVsYXRpb246IHRydWUsXHJcblx0XHRcdFx0XHRcdHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcclxuXHRcdFx0XHRcdFx0Y29ubmVjdGlvbjogbnVsbCxcclxuXHRcdFx0XHRcdFx0cmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUgaW52b2NhdGlvbiwgLT5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcblx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ31cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG5cdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLid9XHJcblx0XHRlbHNlXHJcblx0XHRcdHN0YXR1c0NvZGU6IDQwMVxyXG5cdFx0XHRib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ31cclxuXHJcblxyXG5cdCMjI1xyXG5cdFx0QXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxyXG5cclxuXHRcdE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcclxuXHRcdGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxyXG5cdFx0aW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXHJcblxyXG5cdFx0QHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxyXG5cdCMjI1xyXG5cdF9hdXRoQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxyXG5cdFx0aWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkXHJcblx0XHRcdEBfYXV0aGVudGljYXRlIGVuZHBvaW50Q29udGV4dFxyXG5cdFx0ZWxzZSB0cnVlXHJcblxyXG5cclxuXHQjIyNcclxuXHRcdFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXHJcblxyXG5cdFx0SWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxyXG5cclxuXHRcdEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG5cdCMjI1xyXG5cdF9hdXRoZW50aWNhdGU6IChlbmRwb2ludENvbnRleHQpIC0+XHJcblx0XHQjIEdldCBhdXRoIGluZm9cclxuXHRcdGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxyXG5cclxuXHRcdCMgR2V0IHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXHJcblx0XHRpZiBhdXRoPy51c2VySWQgYW5kIGF1dGg/LnRva2VuIGFuZCBub3QgYXV0aD8udXNlclxyXG5cdFx0XHR1c2VyU2VsZWN0b3IgPSB7fVxyXG5cdFx0XHR1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWRcclxuXHRcdFx0dXNlclNlbGVjdG9yW0BhcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW5cclxuXHRcdFx0YXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUgdXNlclNlbGVjdG9yXHJcblxyXG5cdFx0IyBBdHRhY2ggdGhlIHVzZXIgYW5kIHRoZWlyIElEIHRvIHRoZSBjb250ZXh0IGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG5cdFx0aWYgYXV0aD8udXNlclxyXG5cdFx0XHRlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlclxyXG5cdFx0XHRlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZFxyXG5cdFx0XHR0cnVlXHJcblx0XHRlbHNlIGZhbHNlXHJcblxyXG5cdCMjI1xyXG5cdFx0QXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcclxuXHJcblx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXHJcblxyXG5cdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcclxuXHRcdFx0XHRcdFx0IGVuZHBvaW50XHJcblx0IyMjXHJcblx0X3NwYWNlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxyXG5cdFx0aWYgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZFxyXG5cdFx0XHRhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcclxuXHRcdFx0aWYgYXV0aD8uc3BhY2VJZFxyXG5cdFx0XHRcdHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aC51c2VySWQsIHNwYWNlOmF1dGguc3BhY2VJZH0pLmNvdW50KClcclxuXHRcdFx0XHRpZiBzcGFjZV91c2Vyc19jb3VudFxyXG5cdFx0XHRcdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpXHJcblx0XHRcdFx0XHQjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcclxuXHRcdFx0XHRcdGlmIHNwYWNlPy5pc19wYWlkIGFuZCBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCk+PTBcclxuXHRcdFx0XHRcdFx0ZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWRcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHJcblx0IyMjXHJcblx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxyXG5cclxuXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cclxuXHJcblx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxyXG5cdFx0XHRcdFx0XHQgZW5kcG9pbnRcclxuXHQjIyNcclxuXHRfcm9sZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuXHRcdGlmIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG5cdFx0XHRpZiBfLmlzRW1wdHkgXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcylcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHRydWVcclxuXHJcblxyXG5cdCMjI1xyXG5cdFx0UmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcclxuXHQjIyNcclxuXHRfcmVzcG9uZDogKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlPTIwMCwgaGVhZGVycz17fSkgLT5cclxuXHRcdCMgT3ZlcnJpZGUgYW55IGRlZmF1bHQgaGVhZGVycyB0aGF0IGhhdmUgYmVlbiBwcm92aWRlZCAoa2V5cyBhcmUgbm9ybWFsaXplZCB0byBiZSBjYXNlIGluc2Vuc2l0aXZlKVxyXG5cdFx0IyBUT0RPOiBDb25zaWRlciBvbmx5IGxvd2VyY2FzaW5nIHRoZSBoZWFkZXIga2V5cyB3ZSBuZWVkIG5vcm1hbGl6ZWQsIGxpa2UgQ29udGVudC1UeXBlXHJcblx0XHRkZWZhdWx0SGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBAYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnNcclxuXHRcdGhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgaGVhZGVyc1xyXG5cdFx0aGVhZGVycyA9IF8uZXh0ZW5kIGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzXHJcblxyXG5cdFx0IyBQcmVwYXJlIEpTT04gYm9keSBmb3IgcmVzcG9uc2Ugd2hlbiBDb250ZW50LVR5cGUgaW5kaWNhdGVzIEpTT04gdHlwZVxyXG5cdFx0aWYgaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pIGlzbnQgbnVsbFxyXG5cdFx0XHRpZiBAYXBpLl9jb25maWcucHJldHR5SnNvblxyXG5cdFx0XHRcdGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5LCB1bmRlZmluZWQsIDJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5XHJcblxyXG5cdFx0IyBTZW5kIHJlc3BvbnNlXHJcblx0XHRzZW5kUmVzcG9uc2UgPSAtPlxyXG5cdFx0XHRyZXNwb25zZS53cml0ZUhlYWQgc3RhdHVzQ29kZSwgaGVhZGVyc1xyXG5cdFx0XHRyZXNwb25zZS53cml0ZSBib2R5XHJcblx0XHRcdHJlc3BvbnNlLmVuZCgpXHJcblx0XHRpZiBzdGF0dXNDb2RlIGluIFs0MDEsIDQwM11cclxuXHRcdFx0IyBIYWNrZXJzIGNhbiBtZWFzdXJlIHRoZSByZXNwb25zZSB0aW1lIHRvIGRldGVybWluZSB0aGluZ3MgbGlrZSB3aGV0aGVyIHRoZSA0MDEgcmVzcG9uc2Ugd2FzXHJcblx0XHRcdCMgY2F1c2VkIGJ5IGJhZCB1c2VyIGlkIHZzIGJhZCBwYXNzd29yZC5cclxuXHRcdFx0IyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXHJcblx0XHRcdCMgRGVsYXkgYnkgYSByYW5kb20gYW1vdW50IHRvIHJlZHVjZSB0aGUgYWJpbGl0eSBmb3IgYSBoYWNrZXIgdG8gZGV0ZXJtaW5lIHRoZSByZXNwb25zZSB0aW1lLlxyXG5cdFx0XHQjIFNlZSBodHRwczovL3d3dy5vd2FzcC5vcmcvaW5kZXgucGhwL0Jsb2NraW5nX0JydXRlX0ZvcmNlX0F0dGFja3MjRmluZGluZ19PdGhlcl9Db3VudGVybWVhc3VyZXNcclxuXHRcdFx0IyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xyXG5cdFx0XHRtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMFxyXG5cdFx0XHRyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpXHJcblx0XHRcdGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXHJcblx0XHRcdE1ldGVvci5zZXRUaW1lb3V0IHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kc1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzZW5kUmVzcG9uc2UoKVxyXG5cclxuXHQjIyNcclxuXHRcdFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcclxuXHQjIyNcclxuXHRfbG93ZXJDYXNlS2V5czogKG9iamVjdCkgLT5cclxuXHRcdF8uY2hhaW4gb2JqZWN0XHJcblx0XHQucGFpcnMoKVxyXG5cdFx0Lm1hcCAoYXR0cikgLT5cclxuXHRcdFx0W2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cclxuXHRcdC5vYmplY3QoKVxyXG5cdFx0LnZhbHVlKClcclxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICBcdFx0Q29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gIFx0XHRmdW5jdGlvblxuICBcbiAgXHRcdEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gIFx0XHRiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcbiAgXG4gIFx0XHRBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICBcdFx0ZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcbiAgXHRcdG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuICBcbiAgXHRcdEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICBcdFx0YWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgXHRcdHJlc3BlY3RpdmVseS5cbiAgXG4gIFx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgXHRcdEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jb25maWd1cmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAobWV0aG9kICE9PSAnb3B0aW9ucycpIHtcbiAgICAgICAgaWYgKCEoKHJlZiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZi5yb2xlUmVxdWlyZWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQpO1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50LnJvbGVSZXF1aXJlZCkpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAoKChyZWYxID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMS5hdXRoUmVxdWlyZWQgOiB2b2lkIDApIHx8IGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgocmVmMiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjIuc3BhY2VSZXF1aXJlZCA6IHZvaWQgMCkge1xuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSB0aGlzLm9wdGlvbnMuc3BhY2VSZXF1aXJlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcbiAgXG4gIFx0XHRAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0T25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxuICBcdFx0aW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gIFx0XHRpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gIFx0XHRAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aEFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5hdXRoUmVxdWlyZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGUoZW5kcG9pbnRDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICBcdFx0SWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuICBcbiAgXHRcdEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCkge1xuICAgIHZhciBhdXRoLCB1c2VyU2VsZWN0b3I7XG4gICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICBpZiAoKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlcklkIDogdm9pZCAwKSAmJiAoYXV0aCAhPSBudWxsID8gYXV0aC50b2tlbiA6IHZvaWQgMCkgJiYgIShhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgICB1c2VyU2VsZWN0b3IgPSB7fTtcbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZDtcbiAgICAgIHVzZXJTZWxlY3Rvclt0aGlzLmFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlbjtcbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJTZWxlY3Rvcik7XG4gICAgfVxuICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApIHtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyO1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gIFx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICBcdFx0XHRcdFx0XHQgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gIFx0XHRcdFx0XHRcdCBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3JvbGVBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICBpZiAoXy5pc0VtcHR5KF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzcG9uZCA9IGZ1bmN0aW9uKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzLCBkZWxheUluTWlsbGlzZWNvbmRzLCBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcywgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28sIHNlbmRSZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PSBudWxsKSB7XG4gICAgICBzdGF0dXNDb2RlID0gMjAwO1xuICAgIH1cbiAgICBpZiAoaGVhZGVycyA9PSBudWxsKSB7XG4gICAgICBoZWFkZXJzID0ge307XG4gICAgfVxuICAgIGRlZmF1bHRIZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyh0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyhoZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gXy5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuICAgIGlmIChoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFwaS5fY29uZmlnLnByZXR0eUpzb24pIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHksIHZvaWQgMCwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoYm9keSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZW5kKCk7XG4gICAgfTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxIHx8IHN0YXR1c0NvZGUgPT09IDQwMykge1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDA7XG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd287XG4gICAgICByZXR1cm4gTWV0ZW9yLnNldFRpbWVvdXQoc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpXHJcbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cclxuY2xhc3MgQE9kYXRhUmVzdGl2dXNcclxuXHJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxyXG5cdFx0QF9yb3V0ZXMgPSBbXVxyXG5cdFx0QF9jb25maWcgPVxyXG5cdFx0XHRwYXRoczogW11cclxuXHRcdFx0dXNlRGVmYXVsdEF1dGg6IGZhbHNlXHJcblx0XHRcdGFwaVBhdGg6ICdhcGkvJ1xyXG5cdFx0XHR2ZXJzaW9uOiBudWxsXHJcblx0XHRcdHByZXR0eUpzb246IGZhbHNlXHJcblx0XHRcdGF1dGg6XHJcblx0XHRcdFx0dG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nXHJcblx0XHRcdFx0dXNlcjogLT5cclxuXHRcdFx0XHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyggQHJlcXVlc3QsIEByZXNwb25zZSApXHJcblx0XHRcdFx0XHR1c2VySWQgPSBAcmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG5cdFx0XHRcdFx0YXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHRcdFx0XHRcdHNwYWNlSWQgPSBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgQHVybFBhcmFtc1snc3BhY2VJZCddXHJcblx0XHRcdFx0XHRpZiBhdXRoVG9rZW5cclxuXHRcdFx0XHRcdFx0dG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aFRva2VuXHJcblx0XHRcdFx0XHRpZiBAcmVxdWVzdC51c2VySWRcclxuXHRcdFx0XHRcdFx0X3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IEByZXF1ZXN0LnVzZXJJZH0pXHJcblx0XHRcdFx0XHRcdHVzZXI6IF91c2VyXHJcblx0XHRcdFx0XHRcdHVzZXJJZDogdXNlcklkXHJcblx0XHRcdFx0XHRcdHNwYWNlSWQ6IHNwYWNlSWRcclxuXHRcdFx0XHRcdFx0dG9rZW46IHRva2VuXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHVzZXJJZDogdXNlcklkXHJcblx0XHRcdFx0XHRcdHNwYWNlSWQ6IHNwYWNlSWRcclxuXHRcdFx0XHRcdFx0dG9rZW46IHRva2VuXHJcblx0XHRcdGRlZmF1bHRIZWFkZXJzOlxyXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuXHRcdFx0ZW5hYmxlQ29yczogdHJ1ZVxyXG5cclxuXHRcdCMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXHJcblx0XHRfLmV4dGVuZCBAX2NvbmZpZywgb3B0aW9uc1xyXG5cclxuXHRcdGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcclxuXHRcdFx0Y29yc0hlYWRlcnMgPVxyXG5cdFx0XHRcdCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKidcclxuXHRcdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0LCBPRGF0YS1WZXJzaW9uJ1xyXG5cclxuXHRcdFx0aWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcclxuXHRcdFx0XHRjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuLCBYLVNwYWNlLUlkJ1xyXG5cclxuXHRcdFx0IyBTZXQgZGVmYXVsdCBoZWFkZXIgdG8gZW5hYmxlIENPUlMgaWYgY29uZmlndXJlZFxyXG5cdFx0XHRfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcclxuXHJcblx0XHRcdGlmIG5vdCBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XHJcblx0XHRcdFx0QF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XHJcblx0XHRcdFx0XHRAcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgY29yc0hlYWRlcnNcclxuXHRcdFx0XHRcdEBkb25lKClcclxuXHJcblx0XHQjIE5vcm1hbGl6ZSB0aGUgQVBJIHBhdGhcclxuXHRcdGlmIEBfY29uZmlnLmFwaVBhdGhbMF0gaXMgJy8nXHJcblx0XHRcdEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcclxuXHRcdGlmIF8ubGFzdChAX2NvbmZpZy5hcGlQYXRoKSBpc250ICcvJ1xyXG5cdFx0XHRAX2NvbmZpZy5hcGlQYXRoID0gQF9jb25maWcuYXBpUGF0aCArICcvJ1xyXG5cclxuXHRcdCMgVVJMIHBhdGggdmVyc2lvbmluZyBpcyB0aGUgb25seSB0eXBlIG9mIEFQSSB2ZXJzaW9uaW5nIGN1cnJlbnRseSBhdmFpbGFibGUsIHNvIGlmIGEgdmVyc2lvbiBpc1xyXG5cdFx0IyBwcm92aWRlZCwgYXBwZW5kIGl0IHRvIHRoZSBiYXNlIHBhdGggb2YgdGhlIEFQSVxyXG5cdFx0aWYgQF9jb25maWcudmVyc2lvblxyXG5cdFx0XHRAX2NvbmZpZy5hcGlQYXRoICs9IEBfY29uZmlnLnZlcnNpb24gKyAnLydcclxuXHJcblx0XHQjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxyXG5cdFx0aWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcclxuXHRcdFx0QF9pbml0QXV0aCgpXHJcblx0XHRlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcclxuXHRcdFx0QF9pbml0QXV0aCgpXHJcblx0XHRcdGNvbnNvbGUud2FybiAnV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICtcclxuXHRcdFx0XHRcdCdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcclxuXHJcblx0XHRyZXR1cm4gdGhpc1xyXG5cclxuXHJcblx0IyMjKlxyXG5cdFx0QWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxyXG5cclxuXHRcdEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcclxuXHRcdEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xyXG5cdFx0QHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxyXG5cdFx0QHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXHJcblx0XHRAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXHJcblx0XHRAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXHJcblx0XHRcdFx0Y29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxyXG5cdFx0XHRcdGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cclxuXHQjIyNcclxuXHRhZGRSb3V0ZTogKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykgLT5cclxuXHRcdCMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXHJcblx0XHRyb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpXHJcblx0XHRAX3JvdXRlcy5wdXNoKHJvdXRlKVxyXG5cclxuXHRcdHJvdXRlLmFkZFRvQXBpKClcclxuXHJcblx0XHRyZXR1cm4gdGhpc1xyXG5cclxuXHJcblx0IyMjKlxyXG5cdFx0R2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxyXG5cdCMjI1xyXG5cdGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxyXG5cdFx0bWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXVxyXG5cdFx0bWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXVxyXG5cclxuXHRcdCMgR3JhYiB0aGUgc2V0IG9mIGVuZHBvaW50c1xyXG5cdFx0aWYgY29sbGVjdGlvbiBpcyBNZXRlb3IudXNlcnNcclxuXHRcdFx0Y29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcclxuXHRcdGVsc2VcclxuXHRcdFx0Y29sbGVjdGlvbkVuZHBvaW50cyA9IEBfY29sbGVjdGlvbkVuZHBvaW50c1xyXG5cclxuXHRcdCMgRmxhdHRlbiB0aGUgb3B0aW9ucyBhbmQgc2V0IGRlZmF1bHRzIGlmIG5lY2Vzc2FyeVxyXG5cdFx0ZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgb3Ige31cclxuXHRcdHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XHJcblx0XHRleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgb3IgW11cclxuXHRcdCMgVXNlIGNvbGxlY3Rpb24gbmFtZSBhcyBkZWZhdWx0IHBhdGhcclxuXHRcdHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxyXG5cclxuXHRcdCMgU2VwYXJhdGUgdGhlIHJlcXVlc3RlZCBlbmRwb2ludHMgYnkgdGhlIHJvdXRlIHRoZXkgYmVsb25nIHRvIChvbmUgZm9yIG9wZXJhdGluZyBvbiB0aGUgZW50aXJlXHJcblx0XHQjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXHJcblx0XHRjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fVxyXG5cdFx0ZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fVxyXG5cdFx0aWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcclxuXHRcdFx0IyBHZW5lcmF0ZSBhbGwgZW5kcG9pbnRzIG9uIHRoaXMgY29sbGVjdGlvblxyXG5cdFx0XHRfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cclxuXHRcdFx0XHQjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcclxuXHRcdFx0XHRpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxyXG5cdFx0XHRcdFx0Xy5leHRlbmQgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKVxyXG5cdFx0XHRcdGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdCwgdGhpc1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHQjIEdlbmVyYXRlIGFueSBlbmRwb2ludHMgdGhhdCBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBleGNsdWRlZFxyXG5cdFx0XHRfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cclxuXHRcdFx0XHRpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXHJcblx0XHRcdFx0XHQjIENvbmZpZ3VyZSBlbmRwb2ludCBhbmQgbWFwIHRvIGl0J3MgaHR0cCBtZXRob2RcclxuXHRcdFx0XHRcdCMgVE9ETzogQ29uc2lkZXIgcHJlZGVmaW5pbmcgYSBtYXAgb2YgbWV0aG9kcyB0byB0aGVpciBodHRwIG1ldGhvZCB0eXBlIChlLmcuLCBnZXRBbGw6IGdldClcclxuXHRcdFx0XHRcdGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXHJcblx0XHRcdFx0XHRjb25maWd1cmVkRW5kcG9pbnQgPSB7fVxyXG5cdFx0XHRcdFx0Xy5lYWNoIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCAoYWN0aW9uLCBtZXRob2RUeXBlKSAtPlxyXG5cdFx0XHRcdFx0XHRjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxyXG5cdFx0XHRcdFx0XHRcdF8uY2hhaW4gYWN0aW9uXHJcblx0XHRcdFx0XHRcdFx0LmNsb25lKClcclxuXHRcdFx0XHRcdFx0XHQuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xyXG5cdFx0XHRcdFx0XHRcdC52YWx1ZSgpXHJcblx0XHRcdFx0XHQjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcclxuXHRcdFx0XHRcdGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXHJcblx0XHRcdFx0XHRcdF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XHJcblx0XHRcdFx0XHRlbHNlIF8uZXh0ZW5kIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnRcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHQsIHRoaXNcclxuXHJcblx0XHQjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcclxuXHRcdEBhZGRSb3V0ZSBwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50c1xyXG5cdFx0QGFkZFJvdXRlIFwiI3twYXRofS86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50c1xyXG5cclxuXHRcdHJldHVybiB0aGlzXHJcblxyXG5cclxuXHQjIyMqXHJcblx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcclxuXHQjIyNcclxuXHRfY29sbGVjdGlvbkVuZHBvaW50czpcclxuXHRcdGdldDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdGdldDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XHJcblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBzZWxlY3RvclxyXG5cdFx0XHRcdFx0aWYgZW50aXR5XHJcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG5cdFx0cHV0OiAoY29sbGVjdGlvbikgLT5cclxuXHRcdFx0cHV0OlxyXG5cdFx0XHRcdGFjdGlvbjogLT5cclxuXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cclxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxyXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG5cdFx0XHRcdFx0ZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsICRzZXQ6IEBib2R5UGFyYW1zXHJcblx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcclxuXHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcblx0XHRkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxyXG5cdFx0XHRkZWxldGU6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxyXG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRcdHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG5cdFx0cG9zdDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdHBvc3Q6XHJcblx0XHRcdFx0YWN0aW9uOiAtPlxyXG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcblx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXHJcblx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcclxuXHRcdFx0XHRcdGlmIGVudGl0eVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxyXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ31cclxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdGdldDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRzZWxlY3RvciA9IHt9XHJcblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuXHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXHJcblx0XHRcdFx0XHRpZiBlbnRpdGllc1xyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbid9XHJcblxyXG5cclxuXHQjIyMqXHJcblx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXHJcblx0IyMjXHJcblx0X3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzOlxyXG5cdFx0Z2V0OiAoY29sbGVjdGlvbikgLT5cclxuXHRcdFx0Z2V0OlxyXG5cdFx0XHRcdGFjdGlvbjogLT5cclxuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuXHRcdFx0XHRcdGlmIGVudGl0eVxyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuXHRcdHB1dDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdHB1dDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xyXG5cdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXHJcblx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuXHRcdFx0XHRcdFx0e3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuXHRcdGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdGRlbGV0ZTpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBAdXJsUGFyYW1zLmlkXHJcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCd9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XHJcblx0XHRwb3N0OiAoY29sbGVjdGlvbikgLT5cclxuXHRcdFx0cG9zdDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHQjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcclxuXHRcdFx0XHRcdGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlciBAYm9keVBhcmFtc1xyXG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuXHRcdFx0XHRcdGlmIGVudGl0eVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiAyMDFcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ31cclxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XHJcblx0XHRcdGdldDpcclxuXHRcdFx0XHRhY3Rpb246IC0+XHJcblx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXHJcblx0XHRcdFx0XHRpZiBlbnRpdGllc1xyXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ31cclxuXHJcblxyXG5cdCMjI1xyXG5cdFx0QWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxyXG5cdCMjI1xyXG5cdF9pbml0QXV0aDogLT5cclxuXHRcdHNlbGYgPSB0aGlzXHJcblx0XHQjIyNcclxuXHRcdFx0QWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxyXG5cclxuXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcclxuXHRcdFx0YWRkaW5nIGhvb2spLlxyXG5cdFx0IyMjXHJcblx0XHRAYWRkUm91dGUgJ2xvZ2luJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LFxyXG5cdFx0XHRwb3N0OiAtPlxyXG5cdFx0XHRcdCMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcclxuXHRcdFx0XHR1c2VyID0ge31cclxuXHRcdFx0XHRpZiBAYm9keVBhcmFtcy51c2VyXHJcblx0XHRcdFx0XHRpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxyXG5cdFx0XHRcdFx0XHR1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlclxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxyXG5cdFx0XHRcdGVsc2UgaWYgQGJvZHlQYXJhbXMudXNlcm5hbWVcclxuXHRcdFx0XHRcdHVzZXIudXNlcm5hbWUgPSBAYm9keVBhcmFtcy51c2VybmFtZVxyXG5cdFx0XHRcdGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcclxuXHRcdFx0XHRcdHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy5lbWFpbFxyXG5cclxuXHRcdFx0XHQjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkIHVzZXIsIEBib2R5UGFyYW1zLnBhc3N3b3JkXHJcblx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlXHJcblx0XHRcdFx0XHRyZXR1cm4ge30gPVxyXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiBlLmVycm9yXHJcblx0XHRcdFx0XHRcdGJvZHk6IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5yZWFzb25cclxuXHJcblx0XHRcdFx0IyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxyXG5cdFx0XHRcdCMgVE9ETzogQ29uc2lkZXIgcmV0dXJuaW5nIHRoZSB1c2VyIGluIEF1dGgubG9naW5XaXRoUGFzc3dvcmQoKSwgaW5zdGVhZCBvZiBmZXRjaGluZyBpdCBhZ2FpbiBoZXJlXHJcblx0XHRcdFx0aWYgYXV0aC51c2VySWQgYW5kIGF1dGguYXV0aFRva2VuXHJcblx0XHRcdFx0XHRzZWFyY2hRdWVyeSA9IHt9XHJcblx0XHRcdFx0XHRzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aC5hdXRoVG9rZW5cclxuXHRcdFx0XHRcdEB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0XHRcdFx0J19pZCc6IGF1dGgudXNlcklkXHJcblx0XHRcdFx0XHRcdHNlYXJjaFF1ZXJ5XHJcblx0XHRcdFx0XHRAdXNlcklkID0gQHVzZXI/Ll9pZFxyXG5cclxuXHRcdFx0XHRyZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogYXV0aH1cclxuXHJcblx0XHRcdFx0IyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxyXG5cdFx0XHRcdGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluPy5jYWxsKHRoaXMpXHJcblx0XHRcdFx0aWYgZXh0cmFEYXRhP1xyXG5cdFx0XHRcdFx0Xy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxyXG5cclxuXHRcdFx0XHRyZXNwb25zZVxyXG5cclxuXHRcdGxvZ291dCA9IC0+XHJcblx0XHRcdCMgUmVtb3ZlIHRoZSBnaXZlbiBhdXRoIHRva2VuIGZyb20gdGhlIHVzZXIncyBhY2NvdW50XHJcblx0XHRcdGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXHJcblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxyXG5cdFx0XHR0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW5cclxuXHRcdFx0aW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xyXG5cdFx0XHR0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyAwLCBpbmRleFxyXG5cdFx0XHR0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nIGluZGV4ICsgMVxyXG5cdFx0XHR0b2tlblRvUmVtb3ZlID0ge31cclxuXHRcdFx0dG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlblxyXG5cdFx0XHR0b2tlblJlbW92YWxRdWVyeSA9IHt9XHJcblx0XHRcdHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXHJcblx0XHRcdE1ldGVvci51c2Vycy51cGRhdGUgQHVzZXIuX2lkLCB7JHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5fVxyXG5cclxuXHRcdFx0cmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxyXG5cclxuXHRcdFx0IyBDYWxsIHRoZSBsb2dvdXQgaG9vayB3aXRoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYXR0YWNoZWRcclxuXHRcdFx0ZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXHJcblx0XHRcdGlmIGV4dHJhRGF0YT9cclxuXHRcdFx0XHRfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXHJcblxyXG5cdFx0XHRyZXNwb25zZVxyXG5cclxuXHRcdCMjI1xyXG5cdFx0XHRBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxyXG5cclxuXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxyXG5cdFx0XHRhZGRpbmcgaG9vaykuXHJcblx0XHQjIyNcclxuXHRcdEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXHJcblx0XHRcdGdldDogLT5cclxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiXHJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXHJcblx0XHRcdFx0cmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpXHJcblx0XHRcdHBvc3Q6IGxvZ291dFxyXG5cclxuT2RhdGFSZXN0aXZ1cyA9IEBPZGF0YVJlc3RpdnVzXHJcbiIsInZhciBDb29raWVzLCBPZGF0YVJlc3RpdnVzLCBiYXNpY0F1dGgsXG4gIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbnRoaXMuT2RhdGFSZXN0aXZ1cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gT2RhdGFSZXN0aXZ1cyhvcHRpb25zKSB7XG4gICAgdmFyIGNvcnNIZWFkZXJzO1xuICAgIHRoaXMuX3JvdXRlcyA9IFtdO1xuICAgIHRoaXMuX2NvbmZpZyA9IHtcbiAgICAgIHBhdGhzOiBbXSxcbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZSxcbiAgICAgIGFwaVBhdGg6ICdhcGkvJyxcbiAgICAgIHZlcnNpb246IG51bGwsXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nLFxuICAgICAgICB1c2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3VzZXIsIGF1dGhUb2tlbiwgY29va2llcywgc3BhY2VJZCwgdG9rZW4sIHVzZXJJZDtcbiAgICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXModGhpcy5yZXF1ZXN0LCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB1c2VySWQgPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgICAgICAgIHNwYWNlSWQgPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHRoaXMudXJsUGFyYW1zWydzcGFjZUlkJ107XG4gICAgICAgICAgaWYgKGF1dGhUb2tlbikge1xuICAgICAgICAgICAgdG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC51c2VySWQpIHtcbiAgICAgICAgICAgIF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy5yZXF1ZXN0LnVzZXJJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VyOiBfdXNlcixcbiAgICAgICAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHNwYWNlSWQsXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHNwYWNlSWQsXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxuICAgIH07XG4gICAgXy5leHRlbmQodGhpcy5fY29uZmlnLCBvcHRpb25zKTtcbiAgICBpZiAodGhpcy5fY29uZmlnLmVuYWJsZUNvcnMpIHtcbiAgICAgIGNvcnNIZWFkZXJzID0ge1xuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0LCBPRGF0YS1WZXJzaW9uJ1xuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgICAgY29yc0hlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSArPSAnLCBYLVVzZXItSWQsIFgtQXV0aC1Ub2tlbiwgWC1TcGFjZS1JZCc7XG4gICAgICB9XG4gICAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcuZGVmYXVsdEhlYWRlcnMsIGNvcnNIZWFkZXJzKTtcbiAgICAgIGlmICghdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlLndyaXRlSGVhZCgyMDAsIGNvcnNIZWFkZXJzKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcuYXBpUGF0aFswXSA9PT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoLnNsaWNlKDEpO1xuICAgIH1cbiAgICBpZiAoXy5sYXN0KHRoaXMuX2NvbmZpZy5hcGlQYXRoKSAhPT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnZlcnNpb24pIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoICs9IHRoaXMuX2NvbmZpZy52ZXJzaW9uICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY29uZmlnLnVzZUF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgLyoqXG4gIFx0XHRBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG4gIFxuICBcdFx0QHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuICBcdFx0QHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gIFx0XHRAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gIFx0XHRAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgXHRcdEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcbiAgXHRcdEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcbiAgXHRcdFx0XHRjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG4gIFx0XHRcdFx0YW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5hZGRSb3V0ZSA9IGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykge1xuICAgIHZhciByb3V0ZTtcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpO1xuICAgIHRoaXMuX3JvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByb3V0ZS5hZGRUb0FwaSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gIFx0XHRHZW5lcmF0ZSByb3V0ZXMgZm9yIHRoZSBNZXRlb3IgQ29sbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLmFkZENvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25FbmRwb2ludHMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uLCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZHMsIG1ldGhvZHNPbkNvbGxlY3Rpb24sIHBhdGgsIHJvdXRlT3B0aW9ucztcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ107XG4gICAgbWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXTtcbiAgICBpZiAoY29sbGVjdGlvbiA9PT0gTWV0ZW9yLnVzZXJzKSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl9jb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH1cbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyB8fCB7fTtcbiAgICByb3V0ZU9wdGlvbnMgPSBvcHRpb25zLnJvdXRlT3B0aW9ucyB8fCB7fTtcbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgfHwgW107XG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCB8fCBjb2xsZWN0aW9uLl9uYW1lO1xuICAgIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24pICYmIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cykpIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgY29uZmlndXJlZEVuZHBvaW50LCBlbmRwb2ludE9wdGlvbnM7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwoZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZCkgPCAwICYmIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdO1xuICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludCA9IHt9O1xuICAgICAgICAgIF8uZWFjaChjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgZnVuY3Rpb24oYWN0aW9uLCBtZXRob2RUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlndXJlZEVuZHBvaW50W21ldGhvZFR5cGVdID0gXy5jaGFpbihhY3Rpb24pLmNsb25lKCkuZXh0ZW5kKGVuZHBvaW50T3B0aW9ucykudmFsdWUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLmFkZFJvdXRlKHBhdGgsIHJvdXRlT3B0aW9ucywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzKTtcbiAgICB0aGlzLmFkZFJvdXRlKHBhdGggKyBcIi86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5fY29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5ib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCh0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXMsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChzZWxlY3RvcikuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gIFx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5O1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkO1xuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHRoaXMudXJsUGFyYW1zLmlkKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcztcbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0QWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuICAgKi9cblxuICBPZGF0YVJlc3RpdnVzLnByb3RvdHlwZS5faW5pdEF1dGggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9nb3V0LCBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgLypcbiAgICBcdFx0XHRBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICBcdFx0XHRhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgdGhpcy5hZGRSb3V0ZSgnbG9naW4nLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlXG4gICAgfSwge1xuICAgICAgcG9zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdXRoLCBlLCBleHRyYURhdGEsIHJlZiwgcmVmMSwgcmVzcG9uc2UsIHNlYXJjaFF1ZXJ5LCB1c2VyO1xuICAgICAgICB1c2VyID0ge307XG4gICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcikge1xuICAgICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlci5pbmRleE9mKCdAJykgPT09IC0xKSB7XG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lKSB7XG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VybmFtZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMuZW1haWwpIHtcbiAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLmVtYWlsO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQodXNlciwgdGhpcy5ib2R5UGFyYW1zLnBhc3N3b3JkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogZS5lcnJvcixcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBlLnJlYXNvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF1dGgudXNlcklkICYmIGF1dGguYXV0aFRva2VuKSB7XG4gICAgICAgICAgc2VhcmNoUXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aC5hdXRoVG9rZW4pO1xuICAgICAgICAgIHRoaXMudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICdfaWQnOiBhdXRoLnVzZXJJZFxuICAgICAgICAgIH0sIHNlYXJjaFF1ZXJ5KTtcbiAgICAgICAgICB0aGlzLnVzZXJJZCA9IChyZWYgPSB0aGlzLnVzZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIGRhdGE6IGF1dGhcbiAgICAgICAgfTtcbiAgICAgICAgZXh0cmFEYXRhID0gKHJlZjEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbikgIT0gbnVsbCA/IHJlZjEuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhdXRoVG9rZW4sIGV4dHJhRGF0YSwgaGFzaGVkVG9rZW4sIGluZGV4LCByZWYsIHJlc3BvbnNlLCB0b2tlbkZpZWxkTmFtZSwgdG9rZW5Mb2NhdGlvbiwgdG9rZW5QYXRoLCB0b2tlblJlbW92YWxRdWVyeSwgdG9rZW5Ub1JlbW92ZTtcbiAgICAgIGF1dGhUb2tlbiA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXTtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW47XG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIHRva2VuUGF0aCA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoaW5kZXggKyAxKTtcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fTtcbiAgICAgIHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW47XG4gICAgICB0b2tlblJlbW92YWxRdWVyeSA9IHt9O1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmU7XG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlKHRoaXMudXNlci5faWQsIHtcbiAgICAgICAgJHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5XG4gICAgICB9KTtcbiAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZXh0cmFEYXRhID0gKHJlZiA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZE91dCkgIT0gbnVsbCA/IHJlZi5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG5cbiAgICAvKlxuICAgIFx0XHRcdEFkZCBhIGxvZ291dCBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgIFx0XHRcdGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5hZGRSb3V0ZSgnbG9nb3V0Jywge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlXG4gICAgfSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIik7XG4gICAgICAgIGNvbnNvbGUud2FybihcIiAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzL2lzc3Vlcy8xMDBcIik7XG4gICAgICAgIHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKTtcbiAgICAgIH0sXG4gICAgICBwb3N0OiBsb2dvdXRcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gT2RhdGFSZXN0aXZ1cztcblxufSkoKTtcblxuT2RhdGFSZXN0aXZ1cyA9IHRoaXMuT2RhdGFSZXN0aXZ1cztcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblxyXG5cdGdldE9iamVjdHMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZXMpLT5cclxuXHRcdGRhdGEgPSB7fVxyXG5cdFx0b2JqZWN0X25hbWVzLnNwbGl0KCcsJykuZm9yRWFjaCAob2JqZWN0X25hbWUpLT5cclxuXHRcdFx0b2JqZWN0ID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHRcdGRhdGFbb2JqZWN0Lm5hbWVdID0gb2JqZWN0XHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHJcblx0Z2V0T2JqZWN0ID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpLT5cclxuXHRcdGRhdGEgPSBfLmNsb25lKENyZWF0b3IuT2JqZWN0c1tDcmVhdG9yLmdldE9iamVjdE5hbWUoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKV0pXHJcblx0XHRpZiAhZGF0YVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLml6DmlYjnmoRpZCAje29iamVjdF9uYW1lfVwiKVxyXG5cclxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkuZmV0Y2goKVxyXG5cdFx0cHNldHMgPSB7IHBzZXRzQWRtaW4sIHBzZXRzVXNlciwgcHNldHNDdXJyZW50IH1cclxuXHJcblx0XHRvYmplY3RfcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblxyXG5cdFx0ZGVsZXRlIGRhdGEubGlzdF92aWV3c1xyXG5cdFx0ZGVsZXRlIGRhdGEucGVybWlzc2lvbl9zZXRcclxuXHJcblx0XHRpZiBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dSZWFkXHJcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdFx0XHRkYXRhLmFsbG93RWRpdCA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0VkaXRcclxuXHRcdFx0ZGF0YS5hbGxvd0RlbGV0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRkYXRhLmFsbG93Q3JlYXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93Q3JlYXRlXHJcblx0XHRcdGRhdGEubW9kaWZ5QWxsUmVjb3JkcyA9IG9iamVjdF9wZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXHJcblxyXG5cdFx0XHRmaWVsZHMgPSB7fVxyXG5cdFx0XHRfLmZvckVhY2ggZGF0YS5maWVsZHMsIChmaWVsZCwga2V5KS0+XHJcblx0XHRcdFx0X2ZpZWxkID0gXy5jbG9uZShmaWVsZClcclxuXHJcblx0XHRcdFx0aWYgIV9maWVsZC5uYW1lXHJcblx0XHRcdFx0XHRfZmllbGQubmFtZSA9IGtleVxyXG5cclxuXHRcdFx0XHQj5bCG5LiN5Y+v57yW6L6R55qE5a2X5q616K6+572u5Li6cmVhZG9ubHkgPSB0cnVlXHJcblx0XHRcdFx0aWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA+IC0xKVxyXG5cdFx0XHRcdFx0X2ZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHQj5LiN6L+U5Zue5LiN5Y+v6KeB5a2X5q61XHJcblx0XHRcdFx0aWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA8IDApXHJcblx0XHRcdFx0XHRmaWVsZHNba2V5XSA9IF9maWVsZFxyXG5cclxuXHRcdFx0ZGF0YS5maWVsZHMgPSBmaWVsZHNcclxuXHJcblx0XHRlbHNlXHJcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gZmFsc2VcclxuXHJcblx0XHRyZXR1cm4gZGF0YVxyXG5cclxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgU3RlZWRvc09EYXRhLkFQSV9QQVRIICsgJy9vYmplY3RzLzppZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHRcdHRyeVxyXG5cdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xyXG5cdFx0XHRpZiAhdXNlcklkXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKVxyXG5cclxuXHRcdFx0c3BhY2VJZCA9IHJlcS5wYXJhbXM/LnNwYWNlSWRcclxuXHRcdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJNaXNzIHNwYWNlSWRcIilcclxuXHJcblx0XHRcdG9iamVjdF9uYW1lID0gcmVxLnBhcmFtcz8uaWRcclxuXHRcdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTWlzcyBpZFwiKVxyXG5cclxuXHRcdFx0X29iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZE9uZSh7X2lkOiBvYmplY3RfbmFtZX0pXHJcblxyXG5cdFx0XHRpZiBfb2JqICYmIF9vYmoubmFtZVxyXG5cdFx0XHRcdG9iamVjdF9uYW1lID0gX29iai5uYW1lXHJcblxyXG5cdFx0XHRpZiBvYmplY3RfbmFtZS5zcGxpdCgnLCcpLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRkYXRhID0gZ2V0T2JqZWN0cyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZGF0YSA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRcdGNvZGU6IDIwMCxcclxuXHRcdFx0XHRkYXRhOiBkYXRhIHx8IHt9XHJcblx0XHRcdH1cclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0XHRjb2RlOiBlLmVycm9yIHx8IDUwMFxyXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cclxuXHRcdFx0fSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgZ2V0T2JqZWN0LCBnZXRPYmplY3RzO1xuICBnZXRPYmplY3RzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZXMpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0ge307XG4gICAgb2JqZWN0X25hbWVzLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIG9iamVjdCA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIHJldHVybiBkYXRhW29iamVjdC5uYW1lXSA9IG9iamVjdDtcbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbiAgZ2V0T2JqZWN0ID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBkYXRhLCBmaWVsZHMsIG9iamVjdF9wZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VycmVudCwgcHNldHNVc2VyO1xuICAgIGRhdGEgPSBfLmNsb25lKENyZWF0b3IuT2JqZWN0c1tDcmVhdG9yLmdldE9iamVjdE5hbWUoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKV0pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi5peg5pWI55qEaWQgXCIgKyBvYmplY3RfbmFtZSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudFxuICAgIH07XG4gICAgb2JqZWN0X3Blcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICBkZWxldGUgZGF0YS5saXN0X3ZpZXdzO1xuICAgIGRlbGV0ZSBkYXRhLnBlcm1pc3Npb25fc2V0O1xuICAgIGlmIChvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dSZWFkKSB7XG4gICAgICBkYXRhLmFsbG93UmVhZCA9IHRydWU7XG4gICAgICBkYXRhLmFsbG93RWRpdCA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0VkaXQ7XG4gICAgICBkYXRhLmFsbG93RGVsZXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93RGVsZXRlO1xuICAgICAgZGF0YS5hbGxvd0NyZWF0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZTtcbiAgICAgIGRhdGEubW9kaWZ5QWxsUmVjb3JkcyA9IG9iamVjdF9wZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgZmllbGRzID0ge307XG4gICAgICBfLmZvckVhY2goZGF0YS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgICAgdmFyIF9maWVsZDtcbiAgICAgICAgX2ZpZWxkID0gXy5jbG9uZShmaWVsZCk7XG4gICAgICAgIGlmICghX2ZpZWxkLm5hbWUpIHtcbiAgICAgICAgICBfZmllbGQubmFtZSA9IGtleTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpID4gLTEpIHtcbiAgICAgICAgICBfZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmluZGV4T2Yob2JqZWN0X3Blcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBfZmllbGQubmFtZSkgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkc1trZXldID0gX2ZpZWxkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRhdGEuZmllbGRzID0gZmllbGRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCBTdGVlZG9zT0RhdGEuQVBJX1BBVEggKyAnL29iamVjdHMvOmlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgX29iaiwgZGF0YSwgZSwgb2JqZWN0X25hbWUsIHJlZiwgcmVmMSwgc3BhY2VJZCwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICAgIH1cbiAgICAgIHNwYWNlSWQgPSAocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwO1xuICAgICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3Mgc3BhY2VJZFwiKTtcbiAgICAgIH1cbiAgICAgIG9iamVjdF9uYW1lID0gKHJlZjEgPSByZXEucGFyYW1zKSAhPSBudWxsID8gcmVmMS5pZCA6IHZvaWQgMDtcbiAgICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiTWlzcyBpZFwiKTtcbiAgICAgIH1cbiAgICAgIF9vYmogPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG9iamVjdF9uYW1lXG4gICAgICB9KTtcbiAgICAgIGlmIChfb2JqICYmIF9vYmoubmFtZSkge1xuICAgICAgICBvYmplY3RfbmFtZSA9IF9vYmoubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmplY3RfbmFtZS5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZGF0YSA9IGdldE9iamVjdHMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiBkYXRhIHx8IHt9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IGUuZXJyb3IgfHwgNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXJyb3JzOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRNZXRlb3JPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5NZXRlb3JPRGF0YVJvdXRlcjtcclxuXHRPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5PRGF0YVJvdXRlclxyXG5cdGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcblx0YXBwID0gZXhwcmVzcygpO1xyXG5cdGFwcC51c2UoJy9hcGkvb2RhdGEvdjQnLCBNZXRlb3JPRGF0YVJvdXRlcik7XHJcblx0V2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoYXBwKTtcclxuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKS0+XHJcblx0XHRpZihuYW1lICE9ICdkZWZhdWx0JylcclxuXHRcdFx0b3RoZXJBcHAgPSBleHByZXNzKCk7XHJcblx0XHRcdG90aGVyQXBwLnVzZShcIi9hcGkvb2RhdGEvI3tuYW1lfVwiLCBPRGF0YVJvdXRlcik7XHJcblx0XHRcdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKG90aGVyQXBwKTtcclxuXHJcbiMgXHRvZGF0YVY0TW9uZ29kYiA9IHJlcXVpcmUgJ29kYXRhLXY0LW1vbmdvZGInXHJcbiMgXHRxdWVyeXN0cmluZyA9IHJlcXVpcmUgJ3F1ZXJ5c3RyaW5nJ1xyXG5cclxuIyBcdGhhbmRsZUVycm9yID0gKGUpLT5cclxuIyBcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcbiMgXHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRlcnJvciA9IHt9XHJcbiMgXHRcdGVycm9yWydtZXNzYWdlJ10gPSBlLm1lc3NhZ2VcclxuIyBcdFx0c3RhdHVzQ29kZSA9IDUwMFxyXG4jIFx0XHRpZiBlLmVycm9yIGFuZCBfLmlzTnVtYmVyKGUuZXJyb3IpXHJcbiMgXHRcdFx0c3RhdHVzQ29kZSA9IGUuZXJyb3JcclxuIyBcdFx0ZXJyb3JbJ2NvZGUnXSA9IHN0YXR1c0NvZGVcclxuIyBcdFx0ZXJyb3JbJ2Vycm9yJ10gPSBzdGF0dXNDb2RlXHJcbiMgXHRcdGVycm9yWydkZXRhaWxzJ10gPSBlLmRldGFpbHNcclxuIyBcdFx0ZXJyb3JbJ3JlYXNvbiddID0gZS5yZWFzb25cclxuIyBcdFx0Ym9keVsnZXJyb3InXSA9IGVycm9yXHJcbiMgXHRcdHJldHVybiB7XHJcbiMgXHRcdFx0c3RhdHVzQ29kZTogc3RhdHVzQ29kZVxyXG4jIFx0XHRcdGJvZHk6Ym9keVxyXG4jIFx0XHR9XHJcblxyXG4jIFx0dmlzaXRvclBhcnNlciA9ICh2aXNpdG9yKS0+XHJcbiMgXHRcdHBhcnNlZE9wdCA9IHt9XHJcbiMgXHRcdGlmIHZpc2l0b3IucHJvamVjdGlvblxyXG4jIFx0XHRcdHBhcnNlZE9wdC5maWVsZHMgPSB2aXNpdG9yLnByb2plY3Rpb25cclxuIyBcdFx0aWYgdmlzaXRvci5oYXNPd25Qcm9wZXJ0eSgnbGltaXQnKVxyXG4jIFx0XHRcdHBhcnNlZE9wdC5saW1pdCA9IHZpc2l0b3IubGltaXRcclxuXHJcbiMgXHRcdGlmIHZpc2l0b3IuaGFzT3duUHJvcGVydHkoJ3NraXAnKVxyXG4jIFx0XHRcdHBhcnNlZE9wdC5za2lwID0gdmlzaXRvci5za2lwXHJcblxyXG4jIFx0XHRpZiB2aXNpdG9yLnNvcnRcclxuIyBcdFx0XHRwYXJzZWRPcHQuc29ydCA9IHZpc2l0b3Iuc29ydFxyXG5cclxuIyBcdFx0cGFyc2VkT3B0XHJcbiMgXHRkZWFsV2l0aEV4cGFuZCA9IChjcmVhdGVRdWVyeSwgZW50aXRpZXMsIGtleSwgc3BhY2VJZCktPlxyXG4jIFx0XHRpZiBfLmlzRW1wdHkgY3JlYXRlUXVlcnkuaW5jbHVkZXNcclxuIyBcdFx0XHRyZXR1cm5cclxuXHJcbiMgXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZClcclxuIyBcdFx0Xy5lYWNoIGNyZWF0ZVF1ZXJ5LmluY2x1ZGVzLCAoaW5jbHVkZSktPlxyXG4jIFx0XHRcdCMgY29uc29sZS5sb2cgJ2luY2x1ZGU6ICcsIGluY2x1ZGVcclxuIyBcdFx0XHRuYXZpZ2F0aW9uUHJvcGVydHkgPSBpbmNsdWRlLm5hdmlnYXRpb25Qcm9wZXJ0eVxyXG4jIFx0XHRcdCMgY29uc29sZS5sb2cgJ25hdmlnYXRpb25Qcm9wZXJ0eTogJywgbmF2aWdhdGlvblByb3BlcnR5XHJcbiMgXHRcdFx0ZmllbGQgPSBvYmouZmllbGRzW25hdmlnYXRpb25Qcm9wZXJ0eV1cclxuIyBcdFx0XHRpZiBmaWVsZCBhbmQgKGZpZWxkLnR5cGUgaXMgJ2xvb2t1cCcgb3IgZmllbGQudHlwZSBpcyAnbWFzdGVyX2RldGFpbCcpXHJcbiMgXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKVxyXG4jIFx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxyXG4jIFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXHJcbiMgXHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucyA9IHZpc2l0b3JQYXJzZXIoaW5jbHVkZSlcclxuIyBcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyBmaWVsZC5yZWZlcmVuY2VfdG9cclxuIyBcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG4jIFx0XHRcdFx0XHRcdF9yb19OQU1FX0ZJRUxEX0tFWSA9IENyZWF0b3IuZ2V0T2JqZWN0KGZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZCk/Lk5BTUVfRklFTERfS0VZXHJcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIGVudGl0aWVzLCAoZW50aXR5LCBpZHgpLT5cclxuIyBcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxEYXRhID0gXy5jbG9uZShlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRtdWx0aVF1ZXJ5ID0gXy5leHRlbmQge19pZDogeyRpbjogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV19fSwgaW5jbHVkZS5xdWVyeVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kKG11bHRpUXVlcnksIHF1ZXJ5T3B0aW9ucykuZmV0Y2goKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmICFlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0ubGVuZ3RoXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBvcmlnaW5hbERhdGFcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHQj5o6S5bqPXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMoZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldLCBvcmlnaW5hbERhdGEpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gXy5tYXAgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldLCAobyktPlxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0b1sncmVmZXJlbmNlX3RvLm8nXSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5fbmFtZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0b1sncmVmZXJlbmNlX3RvLl9vJ10gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBvW19yb19OQU1FX0ZJRUxEX0tFWV1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzaW5nbGVRdWVyeSA9IF8uZXh0ZW5kIHtfaWQ6IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldfSwgaW5jbHVkZS5xdWVyeVxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHQjIOeJueauiuWkhOeQhuWcqOebuOWFs+ihqOS4reayoeacieaJvuWIsOaVsOaNrueahOaDheWGte+8jOi/lOWbnuWOn+aVsOaNrlxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kT25lKHNpbmdsZVF1ZXJ5LCBxdWVyeU9wdGlvbnMpIHx8IGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydyZWZlcmVuY2VfdG8ubyddID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLl9uYW1lXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ3JlZmVyZW5jZV90by5fbyddID0gZmllbGQucmVmZXJlbmNlX3RvXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bX3JvX05BTUVfRklFTERfS0VZXVxyXG4jIFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkgZmllbGQucmVmZXJlbmNlX3RvXHJcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIGVudGl0aWVzLCAoZW50aXR5LCBpZHgpLT5cclxuIyBcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldPy5pZHNcclxuIyBcdFx0XHRcdFx0XHRcdFx0X28gPSBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5vXHJcbiMgXHRcdFx0XHRcdFx0XHRcdF9yb19OQU1FX0ZJRUxEX0tFWSA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vLCBzcGFjZUlkKT8uTkFNRV9GSUVMRF9LRVlcclxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgcXVlcnlPcHRpb25zPy5maWVsZHMgJiYgX3JvX05BTUVfRklFTERfS0VZXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0cXVlcnlPcHRpb25zLmZpZWxkc1tfcm9fTkFNRV9GSUVMRF9LRVldID0gMVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0ubywgc3BhY2VJZClcclxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgcmVmZXJlbmNlVG9Db2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdF9pZHMgPSBfLmNsb25lKGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLmlkcylcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG11bHRpUXVlcnkgPSBfLmV4dGVuZCB7X2lkOiB7JGluOiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XS5pZHN9fSwgaW5jbHVkZS5xdWVyeVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gXy5tYXAgcmVmZXJlbmNlVG9Db2xsZWN0aW9uLmZpbmQobXVsdGlRdWVyeSwgcXVlcnlPcHRpb25zKS5mZXRjaCgpLCAobyktPlxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvWydyZWZlcmVuY2VfdG8ubyddID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLl9uYW1lXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5fbyddID0gX29cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1snX05BTUVfRklFTERfVkFMVUUnXSA9IG9bX3JvX05BTUVfRklFTERfS0VZXVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0I+aOkuW6j1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMoZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldLCBfaWRzKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHNpbmdsZVF1ZXJ5ID0gXy5leHRlbmQge19pZDogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0uaWRzWzBdfSwgaW5jbHVkZS5xdWVyeVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLmZpbmRPbmUoc2luZ2xlUXVlcnksIHF1ZXJ5T3B0aW9ucylcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydyZWZlcmVuY2VfdG8uX28nXSA9IF9vXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsnX05BTUVfRklFTERfVkFMVUUnXSA9IGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVtfcm9fTkFNRV9GSUVMRF9LRVldXHJcblxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0IyBUT0RPXHJcblxyXG5cclxuIyBcdFx0cmV0dXJuXHJcblxyXG4jIFx0c2V0T2RhdGFQcm9wZXJ0eT0oZW50aXRpZXMsc3BhY2Usa2V5KS0+XHJcbiMgXHRcdGVudGl0aWVzX09kYXRhUHJvcGVydGllcyA9IFtdXHJcbiMgXHRcdF8uZWFjaCBlbnRpdGllcywgKGVudGl0eSwgaWR4KS0+XHJcbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHt9XHJcbiMgXHRcdFx0aWQgPSBlbnRpdGllc1tpZHhdW1wiX2lkXCJdXHJcbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmlkJ10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGgoc3BhY2Usa2V5KSsgJyhcXCcnICsgXCIje2lkfVwiICsgJ1xcJyknXHJcbiMgXHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmV0YWcnXSA9IFwiVy9cXFwiMDhENTg5NzIwQkJCM0RCMVxcXCJcIlxyXG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXNbJ0BvZGF0YS5lZGl0TGluayddID0gZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmlkJ11cclxuIyBcdFx0XHRfLmV4dGVuZCBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzLGVudGl0eVxyXG4jIFx0XHRcdGVudGl0aWVzX09kYXRhUHJvcGVydGllcy5wdXNoIGVudGl0eV9PZGF0YVByb3BlcnRpZXNcclxuIyBcdFx0cmV0dXJuIGVudGl0aWVzX09kYXRhUHJvcGVydGllc1xyXG5cclxuIyBcdHNldEVycm9yTWVzc2FnZSA9IChzdGF0dXNDb2RlLGNvbGxlY3Rpb24sa2V5LGFjdGlvbiktPlxyXG4jIFx0XHRib2R5ID0ge31cclxuIyBcdFx0ZXJyb3IgPSB7fVxyXG4jIFx0XHRpbm5lcmVycm9yID0ge31cclxuIyBcdFx0aWYgc3RhdHVzQ29kZSA9PSA0MDRcclxuIyBcdFx0XHRpZiBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRpZiBhY3Rpb24gPT0gJ3Bvc3QnXHJcbiMgXHRcdFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3Bvc3RfZmFpbFwiKVxyXG4jIFx0XHRcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcclxuIyBcdFx0XHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwNFxyXG4jIFx0XHRcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX3Bvc3RfZmFpbFwiXHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3JlY29yZF9xdWVyeV9mYWlsXCIpXHJcbiMgXHRcdFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xyXG4jIFx0XHRcdFx0XHRlcnJvclsnY29kZSddID0gNDA0XHJcbiMgXHRcdFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfcmVjb3JkX3F1ZXJ5X2ZhaWxcIlxyXG4jIFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX2NvbGxlY3Rpb25fcXVlcnlfZmFpbFwiKSsga2V5XHJcbiMgXHRcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcclxuIyBcdFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDRcclxuIyBcdFx0XHRcdGVycm9yWydtZXNzYWdlJ10gPSBcImNyZWF0b3Jfb2RhdGFfY29sbGVjdGlvbl9xdWVyeV9mYWlsXCJcclxuIyBcdFx0aWYgIHN0YXR1c0NvZGUgPT0gNDAxXHJcbiMgXHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfYXV0aGVudGljYXRpb25fcmVxdWlyZWRcIilcclxuIyBcdFx0XHRpbm5lcmVycm9yWyd0eXBlJ10gPSAnTWljcm9zb2Z0Lk9EYXRhLkNvcmUuVXJpUGFyc2VyLk9EYXRhVW5yZWNvZ25pemVkUGF0aEV4Y2VwdGlvbidcclxuIyBcdFx0XHRlcnJvclsnY29kZSddID0gNDAxXHJcbiMgXHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV9hdXRoZW50aWNhdGlvbl9yZXF1aXJlZFwiXHJcbiMgXHRcdGlmIHN0YXR1c0NvZGUgPT0gNDAzXHJcbiMgXHRcdFx0c3dpdGNoIGFjdGlvblxyXG4jIFx0XHRcdFx0d2hlbiAnZ2V0JyB0aGVuIGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfYWNjZXNzX2ZhaWxcIilcclxuIyBcdFx0XHRcdHdoZW4gJ3Bvc3QnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9jcmVhdGVfZmFpbFwiKVxyXG4jIFx0XHRcdFx0d2hlbiAncHV0JyB0aGVuIGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfdXBkYXRlX2ZhaWxcIilcclxuIyBcdFx0XHRcdHdoZW4gJ2RlbGV0ZScgdGhlbiBpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX3JlbW92ZV9mYWlsXCIpXHJcbiMgXHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl9hY2Nlc3NfZmFpbFwiKVxyXG4jIFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xyXG4jIFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDNcclxuIyBcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX3VzZXJfYWNjZXNzX2ZhaWxcIlxyXG4jIFx0XHRlcnJvclsnaW5uZXJlcnJvciddID0gaW5uZXJlcnJvclxyXG4jIFx0XHRib2R5WydlcnJvciddID0gZXJyb3JcclxuIyBcdFx0cmV0dXJuIGJvZHlcclxuXHJcbiMgXHRyZW1vdmVJbnZhbGlkTWV0aG9kID0gKHF1ZXJ5UGFyYW1zKS0+XHJcbiMgXHRcdGlmIHF1ZXJ5UGFyYW1zLiRmaWx0ZXIgJiYgcXVlcnlQYXJhbXMuJGZpbHRlci5pbmRleE9mKCd0b2xvd2VyKCcpID4gLTFcclxuIyBcdFx0XHRyZW1vdmVNZXRob2QgPSAoJDEpLT5cclxuIyBcdFx0XHRcdHJldHVybiAkMS5yZXBsYWNlKCd0b2xvd2VyKCcsICcnKS5yZXBsYWNlKCcpJywgJycpXHJcbiMgXHRcdFx0cXVlcnlQYXJhbXMuJGZpbHRlciA9IHF1ZXJ5UGFyYW1zLiRmaWx0ZXIucmVwbGFjZSgvdG9sb3dlclxcKChbXlxcKV0rKVxcKS9nLCByZW1vdmVNZXRob2QpXHJcblxyXG4jIFx0aXNTYW1lQ29tcGFueSA9IChzcGFjZUlkLCB1c2VySWQsIGNvbXBhbnlJZCwgcXVlcnkpLT5cclxuIyBcdFx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMSB9IH0pXHJcbiMgXHRcdGlmICFjb21wYW55SWQgJiYgcXVlcnlcclxuIyBcdFx0XHRjb21wYW55SWQgPSBzdS5jb21wYW55X2lkXHJcbiMgXHRcdFx0cXVlcnkuY29tcGFueV9pZCA9IHsgJGluOiBzdS5jb21wYW55X2lkcyB9XHJcbiMgXHRcdHJldHVybiBzdS5jb21wYW55X2lkcy5pbmNsdWRlcyhjb21wYW55SWQpXHJcblxyXG4jIFx0IyDkuI3ov5Tlm57lt7LlgYfliKDpmaTnmoTmlbDmja5cclxuIyBcdGV4Y2x1ZGVEZWxldGVkID0gKHF1ZXJ5KS0+XHJcbiMgXHRcdHF1ZXJ5LmlzX2RlbGV0ZWQgPSB7ICRuZTogdHJ1ZSB9XHJcblxyXG4jIFx0IyDkv67mlLnjgIHliKDpmaTml7bvvIzlpoLmnpwgZG9jLnNwYWNlID0gXCJnbG9iYWxcIu+8jOaKpemUmVxyXG4jIFx0Y2hlY2tHbG9iYWxSZWNvcmQgPSAoY29sbGVjdGlvbiwgaWQsIG9iamVjdCktPlxyXG4jIFx0XHRpZiBvYmplY3QuZW5hYmxlX3NwYWNlX2dsb2JhbCAmJiBjb2xsZWN0aW9uLmZpbmQoeyBfaWQ6IGlkLCBzcGFjZTogJ2dsb2JhbCd9KS5jb3VudCgpXHJcbiMgXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5LiN6IO95L+u5pS55oiW6ICF5Yig6Zmk5qCH5YeG5a+56LGhXCIpXHJcblxyXG5cclxuIyBcdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnOm9iamVjdF9uYW1lJywge2F1dGhSZXF1aXJlZDogdHJ1ZSwgc3BhY2VSZXF1aXJlZDogZmFsc2V9LCB7XHJcbiMgXHRcdGdldDogKCktPlxyXG4jIFx0XHRcdHRyeVxyXG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxyXG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxyXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6c2V0RXJyb3JNZXNzYWdlKDQwMSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIHNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6c2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0fVxyXG5cclxuIyBcdFx0XHRcdHJlbW92ZUludmFsaWRNZXRob2QoQHF1ZXJ5UGFyYW1zKVxyXG4jIFx0XHRcdFx0cXMgPSBkZWNvZGVVUklDb21wb25lbnQocXVlcnlzdHJpbmcuc3RyaW5naWZ5KEBxdWVyeVBhcmFtcykpXHJcbiMgXHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxyXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIG9yIChwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgJiYgaXNTYW1lQ29tcGFueShzcGFjZUlkLCBAdXNlcklkLCBjcmVhdGVRdWVyeS5xdWVyeS5jb21wYW55X2lkLCBjcmVhdGVRdWVyeS5xdWVyeSkpIG9yIChwZXJtaXNzaW9ucy5hbGxvd1JlYWQgYW5kIEB1c2VySWQpXHJcblxyXG4jIFx0XHRcdFx0XHRpZiBrZXkgaXMgJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xyXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5WydtZXRhZGF0YS5zcGFjZSddID0gc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRlbHNlIGlmIGtleSBpcyAnc3BhY2VzJ1xyXG4jIFx0XHRcdFx0XHRcdGlmIHNwYWNlSWQgaXNudCAnZ3Vlc3QnXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5faWQgPSBzcGFjZUlkXHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRpZiBzcGFjZUlkIGlzbnQgJ2d1ZXN0JyBhbmQga2V5ICE9IFwidXNlcnNcIiBhbmQgY3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgaXNudCAnZ2xvYmFsJ1xyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSBzcGFjZUlkXHJcblxyXG4jIFx0XHRcdFx0XHRpZiBDcmVhdG9yLmlzQ29tbW9uU3BhY2Uoc3BhY2VJZClcclxuIyBcdFx0XHRcdFx0XHRpZiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCBAdXNlcklkKVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYga2V5IGlzICdzcGFjZXMnXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5faWRcclxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlXHJcbiMgXHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0dXNlcl9zcGFjZXMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kKHt1c2VyOiBAdXNlcklkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pLmZldGNoKClcclxuIyBcdFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnc3BhY2VzJ1xyXG4jIFx0XHRcdFx0XHRcdFx0XHQjIHNwYWNlIOWvueaJgOacieeUqOaIt+iusOW9leS4uuWPquivu1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgY3JlYXRlUXVlcnkucXVlcnkuX2lkXHJcbiMgXHRcdFx0XHRcdFx0XHRcdCMgY3JlYXRlUXVlcnkucXVlcnkuX2lkID0geyRpbjogXy5wbHVjayh1c2VyX3NwYWNlcywgJ3NwYWNlJyl9XHJcbiMgXHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0geyRpbjogXy5wbHVjayh1c2VyX3NwYWNlcywgJ3NwYWNlJyl9XHJcblxyXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkuc29ydCBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnNvcnQpXHJcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkuc29ydCA9IHsgbW9kaWZpZWQ6IC0xIH1cclxuIyBcdFx0XHRcdFx0aXNfZW50ZXJwcmlzZSA9IFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24oc3BhY2VJZCxcIndvcmtmbG93LmVudGVycHJpc2VcIilcclxuIyBcdFx0XHRcdFx0aXNfcHJvZmVzc2lvbmFsID0gU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihzcGFjZUlkLFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIpXHJcbiMgXHRcdFx0XHRcdGlzX3N0YW5kYXJkID0gU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihzcGFjZUlkLFwid29ya2Zsb3cuc3RhbmRhcmRcIilcclxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkubGltaXRcclxuIyBcdFx0XHRcdFx0XHRsaW1pdCA9IGNyZWF0ZVF1ZXJ5LmxpbWl0XHJcbiMgXHRcdFx0XHRcdFx0aWYgaXNfZW50ZXJwcmlzZSBhbmQgbGltaXQ+MTAwMDAwXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDAwMFxyXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYgaXNfcHJvZmVzc2lvbmFsIGFuZCBsaW1pdD4xMDAwMCBhbmQgIWlzX2VudGVycHJpc2VcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMDBcclxuIyBcdFx0XHRcdFx0XHRlbHNlIGlmIGlzX3N0YW5kYXJkIGFuZCBsaW1pdD4xMDAwIGFuZCAhaXNfcHJvZmVzc2lvbmFsIGFuZCAhaXNfZW50ZXJwcmlzZVxyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwXHJcbiMgXHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRpZiBpc19lbnRlcnByaXNlXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDAwMFxyXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYgaXNfcHJvZmVzc2lvbmFsIGFuZCAhaXNfZW50ZXJwcmlzZVxyXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMFxyXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYgaXNfc3RhbmRhcmQgYW5kICFpc19lbnRlcnByaXNlIGFuZCAhaXNfcHJvZmVzc2lvbmFsXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDBcclxuIyBcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxyXG4jIFx0XHRcdFx0XHRpZiBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0cHJvamVjdGlvbiA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0Xy5rZXlzKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pLmZvckVhY2ggKGtleSktPlxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHVucmVhZGFibGVfZmllbGRzLCBrZXkpIDwgMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHQjaWYgbm90ICgoZmllbGRzW2tleV0/LnR5cGUgPT0gJ2xvb2t1cCcgb3IgZmllbGRzW2tleV0/LnR5cGUgPT0gJ21hc3Rlcl9kZXRhaWwnKSBhbmQgZmllbGRzW2tleV0ubXVsdGlwbGUpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHByb2plY3Rpb25ba2V5XSA9IDFcclxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uID0gcHJvamVjdGlvblxyXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkucHJvamVjdGlvbiBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pXHJcbiMgXHRcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoa2V5LCBzcGFjZUlkLCBAdXNlcklkKVxyXG4jIFx0XHRcdFx0XHRcdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZCkuZmllbGRzXHJcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGZpZWxkKS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pbmRleE9mKCckJykgPCAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdCNpZiBmaWVsZHNbZmllbGRdPy5tdWx0aXBsZSE9IHRydWVcclxuIyBcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbltmaWVsZF0gPSAxXHJcbiMgXHRcdFx0XHRcdGlmIG5vdCBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXHJcbiMgXHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV9zaGFyZVxyXG4jIFx0XHRcdFx0XHRcdFx0IyDmu6HotrPlhbHkuqvop4TliJnkuK3nmoTorrDlvZXkuZ/opoHmkJzntKLlh7rmnaVcclxuIyBcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5vd25lclxyXG4jIFx0XHRcdFx0XHRcdFx0c2hhcmVzID0gW11cclxuIyBcdFx0XHRcdFx0XHRcdG9yZ3MgPSBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zKHNwYWNlSWQsIEB1c2VySWQsIHRydWUpXHJcbiMgXHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7XCJvd25lclwiOiBAdXNlcklkfVxyXG4jIFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcudVwiOiBAdXNlcklkIH1cclxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHsgXCJzaGFyaW5nLm9cIjogeyAkaW46IG9yZ3MgfSB9XHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVtcIiRvclwiXSA9IHNoYXJlc1xyXG4jIFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Lm93bmVyID0gQHVzZXJJZFxyXG4jIFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXHJcblxyXG4jIFx0XHRcdFx0XHRleGNsdWRlRGVsZXRlZChjcmVhdGVRdWVyeS5xdWVyeSlcclxuXHJcbiMgXHRcdFx0XHRcdGlmIEBxdWVyeVBhcmFtcy4kdG9wIGlzbnQgJzAnXHJcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnksIHZpc2l0b3JQYXJzZXIoY3JlYXRlUXVlcnkpKS5mZXRjaCgpXHJcbiMgXHRcdFx0XHRcdHNjYW5uZWRDb3VudCA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSx7ZmllbGRzOntfaWQ6IDF9fSkuY291bnQoKVxyXG4jIFx0XHRcdFx0XHRpZiBlbnRpdGllc1xyXG4jIFx0XHRcdFx0XHRcdGRlYWxXaXRoRXhwYW5kKGNyZWF0ZVF1ZXJ5LCBlbnRpdGllcywga2V5LCBzcGFjZUlkKVxyXG4jIFx0XHRcdFx0XHRcdCNzY2FubmVkQ291bnQgPSBlbnRpdGllcy5sZW5ndGhcclxuIyBcdFx0XHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHQjXHRib2R5WydAb2RhdGEubmV4dExpbmsnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YU5leHRMaW5rUGF0aChzcGFjZUlkLGtleSkrXCI/JTI0c2tpcD1cIisgMTBcclxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY291bnQnXSA9IHNjYW5uZWRDb3VudFxyXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzX09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdGllc19PZGF0YVByb3BlcnRpZXNcclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG4jIFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksXCJnZXRcIilcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdGNhdGNoIGVcclxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXHJcblxyXG4jIFx0XHRwb3N0OiAoKS0+XHJcbiMgXHRcdFx0dHJ5XHJcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXHJcbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRpZiBub3QgQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKT8uZW5hYmxlX2FwaVxyXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6c2V0RXJyb3JNZXNzYWdlKDQwMSlcclxuIyBcdFx0XHRcdH1cclxuXHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdHJldHVybiB7XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0Ym9keTpzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcclxuIyBcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSBzcGFjZUlkXHJcbiMgXHRcdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0J1xyXG4jIFx0XHRcdFx0XHRcdGRlbGV0ZSBAYm9keVBhcmFtcy5zcGFjZVxyXG4jIFx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXHJcbiMgXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxyXG4jIFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXHJcbiMgXHRcdFx0XHRcdGlmIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzLnB1c2ggZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKHNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXHJcbiMgXHRcdFx0XHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzXHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSwncG9zdCcpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncG9zdCcpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRjYXRjaCBlXHJcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxyXG5cclxuIyBcdH0pXHJcbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZS9yZWNlbnQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcclxuIyBcdFx0Z2V0OigpLT5cclxuIyBcdFx0XHR0cnlcclxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcclxuIyBcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdHJldHVybiB7XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dSZWFkXHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X2NvbGxlY3Rpb24gPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wib2JqZWN0X3JlY2VudF92aWV3ZWRcIl1cclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfc2VsZWN0b3IgPSB7XCJyZWNvcmQub1wiOmtleSxjcmVhdGVkX2J5OkB1c2VySWR9XHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X29wdGlvbnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19vcHRpb25zLnNvcnQgPSB7Y3JlYXRlZDogLTF9XHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X29wdGlvbnMuZmllbGRzID0ge3JlY29yZDoxfVxyXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzID0gcmVjZW50X3ZpZXdfY29sbGVjdGlvbi5maW5kKHJlY2VudF92aWV3X3NlbGVjdG9yLHJlY2VudF92aWV3X29wdGlvbnMpLmZldGNoKClcclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSBfLnBsdWNrKHJlY2VudF92aWV3X3JlY29yZHMsJ3JlY29yZCcpXHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gcmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMuZ2V0UHJvcGVydHkoXCJpZHNcIilcclxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSBfLmZsYXR0ZW4ocmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMpXHJcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy51bmlxKHJlY2VudF92aWV3X3JlY29yZHNfaWRzKVxyXG4jIFx0XHRcdFx0XHRyZW1vdmVJbnZhbGlkTWV0aG9kKEBxdWVyeVBhcmFtcylcclxuIyBcdFx0XHRcdFx0cXMgPSBkZWNvZGVVUklDb21wb25lbnQocXVlcnlzdHJpbmcuc3RyaW5naWZ5KEBxdWVyeVBhcmFtcykpXHJcbiMgXHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5ID0gaWYgcXMgdGhlbiBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeShxcykgZWxzZSBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeSgpXHJcbiMgXHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXHJcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5saW1pdFxyXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwXHJcbiMgXHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LmxpbWl0IGFuZCByZWNlbnRfdmlld19yZWNvcmRzX2lkcy5sZW5ndGg+Y3JlYXRlUXVlcnkubGltaXRcclxuIyBcdFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IF8uZmlyc3QocmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMsY3JlYXRlUXVlcnkubGltaXQpXHJcbiMgXHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9IHskaW46cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHN9XHJcbiMgXHRcdFx0XHRcdHVucmVhZGFibGVfZmllbGRzID0gcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgfHwgW11cclxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkucHJvamVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdHByb2plY3Rpb24gPSB7fVxyXG4jIFx0XHRcdFx0XHRcdF8ua2V5cyhjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKS5mb3JFYWNoIChrZXkpLT5cclxuIyBcdFx0XHRcdFx0XHRcdGlmIF8uaW5kZXhPZih1bnJlYWRhYmxlX2ZpZWxkcywga2V5KSA8IDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0IyBpZiBub3QgKChmaWVsZHNba2V5XT8udHlwZSA9PSAnbG9va3VwJyBvciBmaWVsZHNba2V5XT8udHlwZSA9PSAnbWFzdGVyX2RldGFpbCcpIGFuZCBmaWVsZHNba2V5XS5tdWx0aXBsZSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0cHJvamVjdGlvbltrZXldID0gMVxyXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gPSBwcm9qZWN0aW9uXHJcbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uIG9yICFfLnNpemUoY3JlYXRlUXVlcnkucHJvamVjdGlvbilcclxuIyBcdFx0XHRcdFx0XHRyZWFkYWJsZV9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZClcclxuIyBcdFx0XHRcdFx0XHRmaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCkuZmllbGRzXHJcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGZpZWxkKS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pbmRleE9mKCckJykgPCAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdCNpZiBmaWVsZHNbZmllbGRdPy5tdWx0aXBsZSE9IHRydWVcclxuIyBcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbltmaWVsZF0gPSAxXHJcblxyXG4jIFx0XHRcdFx0XHRleGNsdWRlRGVsZXRlZChjcmVhdGVRdWVyeS5xdWVyeSlcclxuXHJcbiMgXHRcdFx0XHRcdGlmIEBxdWVyeVBhcmFtcy4kdG9wIGlzbnQgJzAnXHJcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnksIHZpc2l0b3JQYXJzZXIoY3JlYXRlUXVlcnkpKS5mZXRjaCgpXHJcbiMgXHRcdFx0XHRcdGVudGl0aWVzX2luZGV4ID0gW11cclxuIyBcdFx0XHRcdFx0ZW50aXRpZXNfaWRzID0gXy5wbHVjayhlbnRpdGllcywnX2lkJylcclxuIyBcdFx0XHRcdFx0c29ydF9lbnRpdGllcyA9IFtdXHJcbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5zb3J0IG9yICFfLnNpemUoY3JlYXRlUXVlcnkuc29ydClcclxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggcmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgLChyZWNlbnRfdmlld19yZWNvcmRzX2lkKS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRpbmRleCA9IF8uaW5kZXhPZihlbnRpdGllc19pZHMscmVjZW50X3ZpZXdfcmVjb3Jkc19pZClcclxuIyBcdFx0XHRcdFx0XHRcdGlmIGluZGV4Pi0xXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHNvcnRfZW50aXRpZXMucHVzaCBlbnRpdGllc1tpbmRleF1cclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdHNvcnRfZW50aXRpZXMgPSBlbnRpdGllc1xyXG4jIFx0XHRcdFx0XHRpZiBzb3J0X2VudGl0aWVzXHJcbiMgXHRcdFx0XHRcdFx0ZGVhbFdpdGhFeHBhbmQoY3JlYXRlUXVlcnksIHNvcnRfZW50aXRpZXMsIGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcclxuIyBcdFx0XHRcdFx0I1x0Ym9keVsnQG9kYXRhLm5leHRMaW5rJ10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGgoQHVybFBhcmFtcy5zcGFjZUlkLGtleSkrXCI/JTI0c2tpcD1cIisgMTBcclxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY291bnQnXSA9IHNvcnRfZW50aXRpZXMubGVuZ3RoXHJcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShzb3J0X2VudGl0aWVzLEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdGllc19PZGF0YVByb3BlcnRpZXNcclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG4jIFx0XHRcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ2dldCcpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRjYXRjaCBlXHJcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxyXG4jIH0pXHJcblxyXG4jIFx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCc6b2JqZWN0X25hbWUvOl9pZCcsIHthdXRoUmVxdWlyZWQ6IHRydWUsIHNwYWNlUmVxdWlyZWQ6IGZhbHNlfSwge1xyXG4jIFx0XHRwb3N0OiAoKS0+XHJcbiMgXHRcdFx0dHJ5XHJcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXHJcbiMgXHRcdFx0XHRpZiBub3QgQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpPy5lbmFibGVfYXBpXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXHJcbiMgXHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRcdGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcclxuIyBcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXHJcbiMgXHRcdFx0XHRcdGVudGl0aWVzID0gW11cclxuIyBcdFx0XHRcdFx0aWYgZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMucHVzaCBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xyXG4jIFx0XHRcdFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzXHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSwncG9zdCcpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwncG9zdCcpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRjYXRjaCBlXHJcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxyXG4jIFx0XHRnZXQ6KCktPlxyXG4jIFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcclxuIyBcdFx0XHRpZiBrZXkuaW5kZXhPZihcIihcIikgPiAtMVxyXG4jIFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb25JbmZvID0ga2V5XHJcbiMgXHRcdFx0XHRmaWVsZE5hbWUgPSBAdXJsUGFyYW1zLl9pZC5zcGxpdCgnX2V4cGFuZCcpWzBdXHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uSW5mb1NwbGl0ID0gY29sbGVjdGlvbkluZm8uc3BsaXQoJygnKVxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uSW5mb1NwbGl0WzBdXHJcbiMgXHRcdFx0XHRpZCA9IGNvbGxlY3Rpb25JbmZvU3BsaXRbMV0uc3BsaXQoJ1xcJycpWzFdXHJcblxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0ZmllbGRzT3B0aW9ucyA9IHt9XHJcbiMgXHRcdFx0XHRmaWVsZHNPcHRpb25zW2ZpZWxkTmFtZV0gPSAxXHJcbiMgXHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogaWR9LCB7ZmllbGRzOiBmaWVsZHNPcHRpb25zfSlcclxuXHJcbiMgXHRcdFx0XHRmaWVsZFZhbHVlID0gbnVsbFxyXG4jIFx0XHRcdFx0aWYgZW50aXR5XHJcbiMgXHRcdFx0XHRcdGZpZWxkVmFsdWUgPSBlbnRpdHlbZmllbGROYW1lXVxyXG5cclxuIyBcdFx0XHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KGNvbGxlY3Rpb25OYW1lLCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRmaWVsZCA9IG9iai5maWVsZHNbZmllbGROYW1lXVxyXG5cclxuIyBcdFx0XHRcdGlmIGZpZWxkIGFuZCBmaWVsZFZhbHVlIGFuZCAoZmllbGQudHlwZSBpcyAnbG9va3VwJyBvciBmaWVsZC50eXBlIGlzICdtYXN0ZXJfZGV0YWlsJylcclxuIyBcdFx0XHRcdFx0bG9va3VwQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8sIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdFx0cXVlcnlPcHRpb25zID0ge2ZpZWxkczoge319XHJcbiMgXHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGZpZWxkLnJlZmVyZW5jZV90bywgQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkKVxyXG4jIFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZiktPlxyXG4jIFx0XHRcdFx0XHRcdGlmIGYuaW5kZXhPZignJCcpIDwgMFxyXG4jIFx0XHRcdFx0XHRcdFx0cXVlcnlPcHRpb25zLmZpZWxkc1tmXSA9IDFcclxuXHJcbiMgXHRcdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcbiMgXHRcdFx0XHRcdFx0dmFsdWVzID0gW11cclxuIyBcdFx0XHRcdFx0XHRsb29rdXBDb2xsZWN0aW9uLmZpbmQoe19pZDogeyRpbjogZmllbGRWYWx1ZX19LCBxdWVyeU9wdGlvbnMpLmZvckVhY2ggKG9iaiktPlxyXG4jIFx0XHRcdFx0XHRcdFx0Xy5lYWNoIG9iaiwgKHYsIGspLT5cclxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHYpIHx8IChfLmlzT2JqZWN0KHYpICYmICFfLmlzRGF0ZSh2KSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRvYmpba10gPSBKU09OLnN0cmluZ2lmeSh2KVxyXG4jIFx0XHRcdFx0XHRcdFx0dmFsdWVzLnB1c2gob2JqKVxyXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSB2YWx1ZXNcclxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zLnNwYWNlSWQpICsgXCIjI3tjb2xsZWN0aW9uSW5mb30vI3tAdXJsUGFyYW1zLl9pZH1cIlxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IGxvb2t1cENvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiBmaWVsZFZhbHVlfSwgcXVlcnlPcHRpb25zKSB8fCB7fVxyXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCBib2R5LCAodiwgayktPlxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHYpIHx8IChfLmlzT2JqZWN0KHYpICYmICFfLmlzRGF0ZSh2KSlcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keVtrXSA9IEpTT04uc3RyaW5naWZ5KHYpXHJcbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoQHVybFBhcmFtcy5zcGFjZUlkKSArIFwiIyN7ZmllbGQucmVmZXJlbmNlX3RvfS8kZW50aXR5XCJcclxuXHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCkgKyBcIiMje2NvbGxlY3Rpb25JbmZvfS8je0B1cmxQYXJhbXMuX2lkfVwiXHJcbiMgXHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBmaWVsZFZhbHVlXHJcblxyXG4jIFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG5cclxuIyBcdFx0XHRcdHtib2R5OiBib2R5LCBoZWFkZXJzOiBoZWFkZXJzfVxyXG4jIFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdHRyeVxyXG4jIFx0XHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxyXG4jIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXHJcbiMgXHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0XHR9XHJcblxyXG4jIFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxyXG4jIFx0XHRcdFx0XHRcdHVucmVhZGFibGVfZmllbGRzID0gcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgfHwgW11cclxuIyBcdFx0XHRcdFx0XHRyZW1vdmVJbnZhbGlkTWV0aG9kKEBxdWVyeVBhcmFtcylcclxuIyBcdFx0XHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcclxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxyXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9ICBAdXJsUGFyYW1zLl9pZFxyXG4jIFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVsnbWV0YWRhdGEuc3BhY2UnXSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYga2V5ICE9ICdzcGFjZXMnXHJcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9ICBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdFx0XHR1bnJlYWRhYmxlX2ZpZWxkcyA9IHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzIHx8IFtdXHJcbiMgXHRcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkucHJvamVjdGlvblxyXG4jIFx0XHRcdFx0XHRcdFx0cHJvamVjdGlvbiA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRfLmtleXMoY3JlYXRlUXVlcnkucHJvamVjdGlvbikuZm9yRWFjaCAoa2V5KS0+XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5kZXhPZih1bnJlYWRhYmxlX2ZpZWxkcywga2V5KSA8IDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHQjIGlmIG5vdCAoKGZpZWxkc1trZXldPy50eXBlID09ICdsb29rdXAnIG9yIGZpZWxkc1trZXldPy50eXBlID09ICdtYXN0ZXJfZGV0YWlsJykgYW5kIGZpZWxkc1trZXldLm11bHRpcGxlKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3Rpb25ba2V5XSA9IDFcclxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gPSBwcm9qZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0aWYgbm90IGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gb3IgIV8uc2l6ZShjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKVxyXG4jIFx0XHRcdFx0XHRcdFx0cmVhZGFibGVfZmllbGRzID0gQ3JlYXRvci5nZXRGaWVsZHMoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQpXHJcbiMgXHRcdFx0XHRcdFx0XHRmaWVsZHMgPSBvYmplY3QuZmllbGRzXHJcbiMgXHRcdFx0XHRcdFx0XHRfLmVhY2ggcmVhZGFibGVfZmllbGRzLCAoZmllbGQpIC0+XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmluZGV4T2YoJyQnKSA8IDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uW2ZpZWxkXSA9IDFcclxuIyBcdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoY3JlYXRlUXVlcnkucXVlcnksdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpXHJcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxyXG4jIFx0XHRcdFx0XHRcdGlmIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdFx0aXNBbGxvd2VkID0gZW50aXR5Lm93bmVyID09IEB1c2VySWQgb3IgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyAmJiBpc1NhbWVDb21wYW55KEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwgZW50aXR5LmNvbXBhbnlfaWQpKVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV9zaGFyZSBhbmQgIWlzQWxsb3dlZFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzaGFyZXMgPSBbXVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRvcmdzID0gU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIHRydWUpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHsgXCJzaGFyaW5nLnVcIjogQHVzZXJJZCB9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHsgXCJzaGFyaW5nLm9cIjogeyAkaW46IG9yZ3MgfSB9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGlzQWxsb3dlZCA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogQHVybFBhcmFtcy5faWQsIFwiJG9yXCI6IHNoYXJlcyB9LCB7IGZpZWxkczogeyBfaWQ6IDEgfSB9KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgaXNBbGxvd2VkXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXMucHVzaCBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVhbFdpdGhFeHBhbmQoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcclxuIyBcdFx0XHRcdFx0XHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdF8uZXh0ZW5kIGJvZHksZW50aXR5X09kYXRhUHJvcGVydGllc1swXVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuIyBcdFx0XHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XHJcbiMgXHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSwnZ2V0JylcclxuIyBcdFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwnZ2V0JylcclxuIyBcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRjYXRjaCBlXHJcbiMgXHRcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXHJcblxyXG4jIFx0XHRwdXQ6KCktPlxyXG4jIFx0XHRcdHRyeVxyXG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxyXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxyXG4jIFx0XHRcdFx0XHR9XHJcblxyXG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcclxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRzcGFjZUlkID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxyXG4jIFx0XHRcdFx0aWYga2V5ID09IFwidXNlcnNcIlxyXG4jIFx0XHRcdFx0XHRyZWNvcmRfb3duZXIgPSBAdXJsUGFyYW1zLl9pZFxyXG4jIFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRyZWNvcmRfb3duZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IEB1cmxQYXJhbXMuX2lkIH0sIHsgZmllbGRzOiB7IG93bmVyOiAxIH0gfSk/Lm93bmVyXHJcblxyXG4jIFx0XHRcdFx0Y29tcGFueUlkID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiBAdXJsUGFyYW1zLl9pZCB9LCB7IGZpZWxkczogeyBjb21wYW55X2lkOiAxIH0gfSk/LmNvbXBhbnlfaWRcclxuXHJcbiMgXHRcdFx0XHRpc0FsbG93ZWQgPSBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIG9yIChwZXJtaXNzaW9ucy5hbGxvd0VkaXQgYW5kIHJlY29yZF9vd25lciA9PSBAdXNlcklkICkgb3IgKHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzICYmIGlzU2FtZUNvbXBhbnkoc3BhY2VJZCwgQHVzZXJJZCwgY29tcGFueUlkKSlcclxuIyBcdFx0XHRcdGlmIGlzQWxsb3dlZFxyXG4jIFx0XHRcdFx0XHRjaGVja0dsb2JhbFJlY29yZChjb2xsZWN0aW9uLCBAdXJsUGFyYW1zLl9pZCwgb2JqZWN0KVxyXG4jIFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuX2lkLCBzcGFjZTogc3BhY2VJZH1cclxuIyBcdFx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIG9yIHNwYWNlSWQgaXMgJ2NvbW1vbicgb3Iga2V5ID09IFwidXNlcnNcIlxyXG4jIFx0XHRcdFx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxyXG4jIFx0XHRcdFx0XHRmaWVsZHNfZWRpdGFibGUgPSB0cnVlXHJcbiMgXHRcdFx0XHRcdF8ua2V5cyhAYm9keVBhcmFtcy4kc2V0KS5mb3JFYWNoIChrZXkpLT5cclxuIyBcdFx0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIGtleSkgPiAtMVxyXG4jIFx0XHRcdFx0XHRcdFx0ZmllbGRzX2VkaXRhYmxlID0gZmFsc2VcclxuIyBcdFx0XHRcdFx0aWYgZmllbGRzX2VkaXRhYmxlXHJcbiMgXHRcdFx0XHRcdFx0aWYga2V5IGlzICdzcGFjZXMnXHJcbiMgXHRcdFx0XHRcdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcclxuIyBcdFx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgQGJvZHlQYXJhbXNcclxuIyBcdFx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcclxuIyBcdFx0XHRcdFx0XHRcdCNzdGF0dXNDb2RlOiAyMDFcclxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuX2lkXHJcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0aWVzID0gW11cclxuIyBcdFx0XHRcdFx0XHRcdCMgYm9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdGllcy5wdXNoIGVudGl0eVxyXG4jIFx0XHRcdFx0XHRcdFx0IyBib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcclxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0IyBfLmV4dGVuZCBib2R5LGVudGl0eV9PZGF0YVByb3BlcnRpZXNbMF1cclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuIyBcdFx0XHRcdFx0XHRcdHtoZWFkZXJzOiBoZWFkZXJzLGJvZHk6Ym9keX1cclxuIyBcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdwdXQnKVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ3B1dCcpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRjYXRjaCBlXHJcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxyXG4jIFx0XHRkZWxldGU6KCktPlxyXG4jIFx0XHRcdHRyeVxyXG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxyXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXHJcbiMgXHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcclxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxyXG4jIFx0XHRcdFx0XHRcdH1cclxuXHJcbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdHNwYWNlSWQgPSBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdHJlY29yZERhdGEgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogQHVybFBhcmFtcy5faWR9LCB7IGZpZWxkczogeyBvd25lcjogMSwgY29tcGFueV9pZDogMSB9IH0pXHJcbiMgXHRcdFx0XHRyZWNvcmRfb3duZXIgPSByZWNvcmREYXRhPy5vd25lclxyXG4jIFx0XHRcdFx0Y29tcGFueUlkID0gcmVjb3JkRGF0YT8uY29tcGFueV9pZFxyXG4jIFx0XHRcdFx0aXNBbGxvd2VkID0gKHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlKSBvciAocGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgYW5kIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlIGFuZCBpc1NhbWVDb21wYW55KHNwYWNlSWQsIEB1c2VySWQsIGNvbXBhbnlJZCkpIG9yIChwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSBhbmQgcmVjb3JkX293bmVyPT1AdXNlcklkIClcclxuIyBcdFx0XHRcdGlmIGlzQWxsb3dlZFxyXG4jIFx0XHRcdFx0XHRjaGVja0dsb2JhbFJlY29yZChjb2xsZWN0aW9uLCBAdXJsUGFyYW1zLl9pZCwgb2JqZWN0KVxyXG4jIFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuX2lkLCBzcGFjZTogc3BhY2VJZH1cclxuIyBcdFx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnXHJcbiMgXHRcdFx0XHRcdFx0ZGVsZXRlIHNlbGVjdG9yLnNwYWNlXHJcblxyXG4jIFx0XHRcdFx0XHRpZiBvYmplY3Q/LmVuYWJsZV90cmFzaFxyXG4jIFx0XHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCB7XHJcbiMgXHRcdFx0XHRcdFx0XHQkc2V0OiB7XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGlzX2RlbGV0ZWQ6IHRydWUsXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZWQ6IG5ldyBEYXRlKCksXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZWRfYnk6IEB1c2VySWRcclxuIyBcdFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdFx0XHR9KVxyXG4jIFx0XHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxyXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRib2R5ID0ge31cclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xyXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cclxuIyBcdFx0XHRcdFx0XHRcdHtoZWFkZXJzOiBoZWFkZXJzLGJvZHk6Ym9keX1cclxuIyBcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0aWYgY29sbGVjdGlvbi5yZW1vdmUgc2VsZWN0b3JcclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0aWVzLnB1c2ggZW50aXR5XHJcbiMgXHRcdFx0XHRcdFx0XHQjIGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xyXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxzcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHQjIF8uZXh0ZW5kIGJvZHksZW50aXR5X09kYXRhUHJvcGVydGllc1swXVxyXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXHJcbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG4jIFx0XHRcdFx0XHRcdFx0e2hlYWRlcnM6IGhlYWRlcnMsYm9keTpib2R5fVxyXG4jIFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdHJldHVybiB7XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdGNhdGNoIGVcclxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXHJcbiMgXHR9KVxyXG5cclxuIyBcdCMgX2lk5Y+v5LygYWxsXHJcbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZS86X2lkLzptZXRob2ROYW1lJywge2F1dGhSZXF1aXJlZDogdHJ1ZSwgc3BhY2VSZXF1aXJlZDogZmFsc2V9LCB7XHJcbiMgXHRcdHBvc3Q6ICgpLT5cclxuIyBcdFx0XHR0cnlcclxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcclxuIyBcdFx0XHRcdGlmIG5vdCBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCk/LmVuYWJsZV9hcGlcclxuIyBcdFx0XHRcdFx0cmV0dXJue1xyXG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxyXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXHJcbiMgXHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXHJcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxyXG4jIFx0XHRcdFx0XHRyZXR1cm57XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0fVxyXG5cclxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93UmVhZFxyXG4jIFx0XHRcdFx0XHRtZXRob2ROYW1lID0gQHVybFBhcmFtcy5tZXRob2ROYW1lXHJcbiMgXHRcdFx0XHRcdG1ldGhvZHMgPSBDcmVhdG9yLk9iamVjdHNba2V5XT8ubWV0aG9kcyB8fCB7fVxyXG4jIFx0XHRcdFx0XHRpZiBtZXRob2RzLmhhc093blByb3BlcnR5KG1ldGhvZE5hbWUpXHJcbiMgXHRcdFx0XHRcdFx0dGhpc09iaiA9IHtcclxuIyBcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBrZXlcclxuIyBcdFx0XHRcdFx0XHRcdHJlY29yZF9pZDogQHVybFBhcmFtcy5faWRcclxuIyBcdFx0XHRcdFx0XHRcdHNwYWNlX2lkOiBAdXJsUGFyYW1zLnNwYWNlSWRcclxuIyBcdFx0XHRcdFx0XHRcdHVzZXJfaWQ6IEB1c2VySWRcclxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zOiBwZXJtaXNzaW9uc1xyXG4jIFx0XHRcdFx0XHRcdH1cclxuIyBcdFx0XHRcdFx0XHRyZXR1cm4gbWV0aG9kc1ttZXRob2ROYW1lXS5hcHBseSh0aGlzT2JqLCBbQGJvZHlQYXJhbXNdKSB8fCB7fVxyXG4jIFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0XHR9XHJcbiMgXHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdHJldHVybiB7XHJcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXHJcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSlcclxuIyBcdFx0XHRcdFx0fVxyXG4jIFx0XHRcdGNhdGNoIGVcclxuIyBcdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvciBlXHJcblxyXG4jIFx0fSlcclxuXHJcbiMgXHQjVE9ETyByZW1vdmVcclxuIyBcdF8uZWFjaCBbXSwgKHZhbHVlLCBrZXksIGxpc3QpLT4gI0NyZWF0b3IuQ29sbGVjdGlvbnNcclxuIyBcdFx0aWYgbm90IENyZWF0b3IuZ2V0T2JqZWN0KGtleSk/LmVuYWJsZV9hcGlcclxuIyBcdFx0XHRyZXR1cm5cclxuXHJcbiMgXHRcdGlmIFN0ZWVkb3NPZGF0YUFQSVxyXG5cclxuIyBcdFx0XHRTdGVlZG9zT2RhdGFBUEkuYWRkQ29sbGVjdGlvbiBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KSxcclxuIyBcdFx0XHRcdGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXVxyXG4jIFx0XHRcdFx0cm91dGVPcHRpb25zOlxyXG4jIFx0XHRcdFx0XHRhdXRoUmVxdWlyZWQ6IHRydWVcclxuIyBcdFx0XHRcdFx0c3BhY2VSZXF1aXJlZDogZmFsc2VcclxuIyBcdFx0XHRcdGVuZHBvaW50czpcclxuIyBcdFx0XHRcdFx0Z2V0QWxsOlxyXG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cclxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBvciAocGVybWlzc2lvbnMuYWxsb3dSZWFkIGFuZCBAdXNlcklkKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHJlbW92ZUludmFsaWRNZXRob2QoQHF1ZXJ5UGFyYW1zKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHFzID0gZGVjb2RlVVJJQ29tcG9uZW50KHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShAcXVlcnlQYXJhbXMpKVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5ID0gaWYgcXMgdGhlbiBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeShxcykgZWxzZSBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeSgpXHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeVsnbWV0YWRhdGEuc3BhY2UnXSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0gQHVybFBhcmFtcy5zcGFjZUlkXHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIG5vdCBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3Jkc1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkub3duZXIgPSBAdXNlcklkXHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzID0gW11cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBAcXVlcnlQYXJhbXMuJHRvcCBpc250ICcwJ1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnksIHZpc2l0b3JQYXJzZXIoY3JlYXRlUXVlcnkpKS5mZXRjaCgpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2Nhbm5lZENvdW50ID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5KS5jb3VudCgpXHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0aWVzXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgZW50aXRpZXMsIGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxyXG5cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoQHVybFBhcmFtcy5zcGFjZUlkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY291bnQnXSA9IHNjYW5uZWRDb3VudFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0aWVzXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nfVxyXG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcclxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxyXG4jIFx0XHRcdFx0XHRwb3N0OlxyXG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cclxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0QGJvZHlQYXJhbXMuc3BhY2UgPSBAc3BhY2VJZFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDIwMVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCB2YWx1ZTogZW50aXR5fVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCd9XHJcbiMgXHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XHJcbiMgXHRcdFx0XHRcdGdldDpcclxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XHJcbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XHJcblxyXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEBzcGFjZUlkLCBAdXNlcklkLCBrZXkpXHJcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWQsIHNwYWNlOiBAc3BhY2VJZH1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgc2VsZWN0b3JcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgdmFsdWU6IGVudGl0eX1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cclxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cclxuIyBcdFx0XHRcdFx0cHV0OlxyXG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cclxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93RWRpdFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZCwgc3BhY2U6IEBzcGFjZUlkfVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCAkc2V0OiBAYm9keVBhcmFtc1xyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgdmFsdWU6IGVudGl0eX1cclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cclxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cclxuIyBcdFx0XHRcdFx0ZGVsZXRlOlxyXG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cclxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxyXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cclxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cclxuXHJcbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHNwYWNlSWQsIEB1c2VySWQsIGtleSlcclxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkLCBzcGFjZTogQHNwYWNlSWR9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgY29sbGVjdGlvbi5yZW1vdmUgc2VsZWN0b3JcclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCd9XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XHJcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcbiMgXHRcdFx0XHRcdFx0XHRlbHNlXHJcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxyXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgTWV0ZW9yT0RhdGFSb3V0ZXIsIE9EYXRhUm91dGVyLCBhcHAsIGV4cHJlc3M7XG4gIE1ldGVvck9EYXRhUm91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk1ldGVvck9EYXRhUm91dGVyO1xuICBPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5PRGF0YVJvdXRlcjtcbiAgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbiAgYXBwID0gZXhwcmVzcygpO1xuICBhcHAudXNlKCcvYXBpL29kYXRhL3Y0JywgTWV0ZW9yT0RhdGFSb3V0ZXIpO1xuICBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShhcHApO1xuICByZXR1cm4gXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgdmFyIG90aGVyQXBwO1xuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIG90aGVyQXBwID0gZXhwcmVzcygpO1xuICAgICAgb3RoZXJBcHAudXNlKFwiL2FwaS9vZGF0YS9cIiArIG5hbWUsIE9EYXRhUm91dGVyKTtcbiAgICAgIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShvdGhlckFwcCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxyXG5cclxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpXHJcblxyXG5hdXRob3JpemF0aW9uQ2FjaGUgPSB7fVxyXG5cclxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSAnL2FwaS9vZGF0YS92NC8nLCAocmVxLCByZXMsIG5leHQpLT5cclxuXHJcblx0RmliZXIoKCktPlxyXG5cdFx0aWYgIXJlcS51c2VySWRcclxuXHRcdFx0aXNBdXRoZWQgPSBmYWxzZVxyXG5cdFx0XHQjIG9hdXRoMumqjOivgVxyXG5cdFx0XHRpZiByZXE/LnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnT0F1dGgyOiAnLCByZXEucXVlcnkuYWNjZXNzX3Rva2VuXHJcblx0XHRcdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4ocmVxLnF1ZXJ5LmFjY2Vzc190b2tlbilcclxuXHRcdFx0XHRpZiB1c2VySWRcclxuXHRcdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cdFx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcclxuXHRcdFx0IyBiYXNpY+mqjOivgVxyXG5cdFx0XHRpZiByZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddXHJcblx0XHRcdFx0YXV0aCA9IGJhc2ljQXV0aC5wYXJzZShyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKVxyXG5cdFx0XHRcdGlmIGF1dGhcclxuXHRcdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7dXNlcm5hbWU6IGF1dGgubmFtZX0sIHsgZmllbGRzOiB7ICdzZXJ2aWNlcyc6IDEgfSB9KVxyXG5cdFx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0XHRpZiBhdXRob3JpemF0aW9uQ2FjaGVbYXV0aC5uYW1lXSA9PSBhdXRoLnBhc3NcclxuXHRcdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIGF1dGgucGFzc1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdGlmICFyZXN1bHQuZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRcdGlzQXV0aGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgXy5rZXlzKGF1dGhvcml6YXRpb25DYWNoZSkubGVuZ3RoID4gMTAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdGF1dGhvcml6YXRpb25DYWNoZSA9IHt9XHJcblx0XHRcdFx0XHRcdFx0XHRhdXRob3JpemF0aW9uQ2FjaGVbYXV0aC5uYW1lXSA9IGF1dGgucGFzc1xyXG5cdFx0XHRpZiBpc0F1dGhlZFxyXG5cdFx0XHRcdHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSA9IHVzZXIuX2lkXHJcblx0XHRcdFx0dG9rZW4gPSBudWxsXHJcblx0XHRcdFx0YXBwX2lkID0gXCJjcmVhdG9yXCJcclxuXHRcdFx0XHRjbGllbnRfaWQgPSBcInBjXCJcclxuXHRcdFx0XHRsb2dpblRva2VucyA9IHVzZXIuc2VydmljZXM/LnJlc3VtZT8ubG9naW5Ub2tlbnNcclxuXHRcdFx0XHRpZiBsb2dpblRva2Vuc1xyXG5cdFx0XHRcdFx0YXBwX2xvZ2luX3Rva2VuID0gXy5maW5kKGxvZ2luVG9rZW5zLCAodCktPlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdC5hcHBfaWQgaXMgYXBwX2lkIGFuZCB0LmNsaWVudF9pZCBpcyBjbGllbnRfaWRcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdHRva2VuID0gYXBwX2xvZ2luX3Rva2VuLnRva2VuIGlmIGFwcF9sb2dpbl90b2tlblxyXG5cclxuXHRcdFx0XHRpZiBub3QgdG9rZW5cclxuXHRcdFx0XHRcdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcclxuXHRcdFx0XHRcdHRva2VuID0gYXV0aFRva2VuLnRva2VuXHJcblx0XHRcdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxyXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4uYXBwX2lkID0gYXBwX2lkXHJcblx0XHRcdFx0XHRoYXNoZWRUb2tlbi5jbGllbnRfaWQgPSBjbGllbnRfaWRcclxuXHRcdFx0XHRcdGhhc2hlZFRva2VuLnRva2VuID0gdG9rZW5cclxuXHRcdFx0XHRcdEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIHVzZXIuX2lkLCBoYXNoZWRUb2tlblxyXG5cclxuXHRcdFx0XHRpZiB0b2tlblxyXG5cdFx0XHRcdFx0cmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddID0gdG9rZW5cclxuXHRcdG5leHQoKVxyXG5cdCkucnVuKClcclxuIiwidmFyIEZpYmVyLCBhdXRob3JpemF0aW9uQ2FjaGUsIGJhc2ljQXV0aDtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpO1xuXG5hdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL2FwaS9vZGF0YS92NC8nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFwcF9pZCwgYXBwX2xvZ2luX3Rva2VuLCBhdXRoLCBhdXRoVG9rZW4sIGNsaWVudF9pZCwgaGFzaGVkVG9rZW4sIGlzQXV0aGVkLCBsb2dpblRva2VucywgcmVmLCByZWYxLCByZWYyLCByZXN1bHQsIHRva2VuLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFyZXEudXNlcklkKSB7XG4gICAgICBpc0F1dGhlZCA9IGZhbHNlO1xuICAgICAgaWYgKHJlcSAhPSBudWxsID8gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ09BdXRoMjogJywgcmVxLnF1ZXJ5LmFjY2Vzc190b2tlbik7XG4gICAgICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIF9pZDogdXNlcklkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKSB7XG4gICAgICAgIGF1dGggPSBiYXNpY0F1dGgucGFyc2UocmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSk7XG4gICAgICAgIGlmIChhdXRoKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoLm5hbWVcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgJ3NlcnZpY2VzJzogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICBpZiAoYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPT09IGF1dGgucGFzcykge1xuICAgICAgICAgICAgICBpc0F1dGhlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBhdXRoLnBhc3MpO1xuICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5lcnJvcikge1xuICAgICAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoXy5rZXlzKGF1dGhvcml6YXRpb25DYWNoZSkubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPSBhdXRoLnBhc3M7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0F1dGhlZCkge1xuICAgICAgICByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gPSB1c2VyLl9pZDtcbiAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICBhcHBfaWQgPSBcImNyZWF0b3JcIjtcbiAgICAgICAgY2xpZW50X2lkID0gXCJwY1wiO1xuICAgICAgICBsb2dpblRva2VucyA9IChyZWYxID0gdXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5yZXN1bWUpICE9IG51bGwgPyByZWYyLmxvZ2luVG9rZW5zIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICBpZiAobG9naW5Ub2tlbnMpIHtcbiAgICAgICAgICBhcHBfbG9naW5fdG9rZW4gPSBfLmZpbmQobG9naW5Ub2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LmFwcF9pZCA9PT0gYXBwX2lkICYmIHQuY2xpZW50X2lkID09PSBjbGllbnRfaWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGFwcF9sb2dpbl90b2tlbikge1xuICAgICAgICAgICAgdG9rZW4gPSBhcHBfbG9naW5fdG9rZW4udG9rZW47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICAgICAgICAgIHRva2VuID0gYXV0aFRva2VuLnRva2VuO1xuICAgICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgICBoYXNoZWRUb2tlbi5hcHBfaWQgPSBhcHBfaWQ7XG4gICAgICAgICAgaGFzaGVkVG9rZW4uY2xpZW50X2lkID0gY2xpZW50X2lkO1xuICAgICAgICAgIGhhc2hlZFRva2VuLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4odXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV4dCgpO1xuICB9KS5ydW4oKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRTZXJ2aWNlTWV0YWRhdGEgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLW1ldGFkYXRhJykuU2VydmljZU1ldGFkYXRhO1xyXG5cdFNlcnZpY2VEb2N1bWVudCA9IHJlcXVpcmUoJ29kYXRhLXY0LXNlcnZpY2UtZG9jdW1lbnQnKS5TZXJ2aWNlRG9jdW1lbnQ7XHJcblx0X05VTUJFUl9UWVBFUyA9IFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCJdXHJcblxyXG5cdF9CT09MRUFOX1RZUEVTID0gW1wiYm9vbGVhblwiXVxyXG5cclxuXHRfREFURVRJTUVfT0ZGU0VUX1RZUEVTID0gWydkYXRldGltZSddXHJcblxyXG5cdF9OQU1FU1BBQ0UgPSBcIkNyZWF0b3JFbnRpdGllc1wiXHJcblxyXG5cdGdldE9iamVjdHNPZGF0YVNjaGVtYSA9IChzcGFjZUlkKS0+XHJcblx0XHRzY2hlbWEgPSB7dmVyc2lvbjogU3RlZWRvc09EYXRhLlZFUlNJT04sIGRhdGFTZXJ2aWNlczoge3NjaGVtYTogW119fVxyXG5cclxuXHRcdGVudGl0aWVzX3NjaGVtYSA9IHt9XHJcblxyXG5cdFx0ZW50aXRpZXNfc2NoZW1hLm5hbWVzcGFjZSA9IF9OQU1FU1BBQ0VcclxuXHJcblx0XHRlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSA9IFtdXHJcblxyXG5cdFx0ZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zID0gW11cclxuXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5Db2xsZWN0aW9ucywgKHZhbHVlLCBrZXksIGxpc3QpLT5cclxuXHRcdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZClcclxuXHRcdFx0aWYgbm90IF9vYmplY3Q/LmVuYWJsZV9hcGlcclxuXHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdCMg5Li76ZSuXHJcblx0XHRcdGtleXMgPSBbe3Byb3BlcnR5UmVmOiB7bmFtZTogXCJfaWRcIiwgY29tcHV0ZWRLZXk6IHRydWV9fV1cclxuXHJcblx0XHRcdGVudGl0aWUgPSB7XHJcblx0XHRcdFx0bmFtZTogX29iamVjdC5uYW1lXHJcblx0XHRcdFx0a2V5OmtleXNcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0a2V5cy5mb3JFYWNoIChfa2V5KS0+XHJcblx0XHRcdFx0ZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zLnB1c2gge1xyXG5cdFx0XHRcdFx0dGFyZ2V0OiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfb2JqZWN0Lm5hbWUgKyBcIi9cIiArIF9rZXkucHJvcGVydHlSZWYubmFtZSxcclxuXHRcdFx0XHRcdGFubm90YXRpb246IFt7XHJcblx0XHRcdFx0XHRcdFwidGVybVwiOiBcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbXB1dGVkXCIsXHJcblx0XHRcdFx0XHRcdFwiYm9vbFwiOiBcInRydWVcIlxyXG5cdFx0XHRcdFx0fV1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQjIEVudGl0eVR5cGVcclxuXHRcdFx0cHJvcGVydHkgPSBbXVxyXG5cdFx0XHRwcm9wZXJ0eS5wdXNoIHtuYW1lOiBcIl9pZFwiLCB0eXBlOiBcIkVkbS5TdHJpbmdcIiwgbnVsbGFibGU6IGZhbHNlfVxyXG5cclxuXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5ID0gW11cclxuXHJcblx0XHRcdF8uZm9yRWFjaCBfb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblxyXG5cdFx0XHRcdF9wcm9wZXJ0eSA9IHtuYW1lOiBmaWVsZF9uYW1lLCB0eXBlOiBcIkVkbS5TdHJpbmdcIn1cclxuXHJcblx0XHRcdFx0aWYgXy5jb250YWlucyBfTlVNQkVSX1RZUEVTLCBmaWVsZC50eXBlXHJcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRvdWJsZVwiXHJcblx0XHRcdFx0ZWxzZSBpZiBfLmNvbnRhaW5zIF9CT09MRUFOX1RZUEVTLCBmaWVsZC50eXBlXHJcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkJvb2xlYW5cIlxyXG5cdFx0XHRcdGVsc2UgaWYgXy5jb250YWlucyBfREFURVRJTUVfT0ZGU0VUX1RZUEVTLCBmaWVsZC50eXBlXHJcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCJcclxuXHRcdFx0XHRcdF9wcm9wZXJ0eS5wcmVjaXNpb24gPSBcIjhcIlxyXG5cclxuXHRcdFx0XHRpZiBmaWVsZC5yZXF1aXJlZFxyXG5cdFx0XHRcdFx0X3Byb3BlcnR5Lm51bGxhYmxlID0gZmFsc2VcclxuXHJcblx0XHRcdFx0cHJvcGVydHkucHVzaCBfcHJvcGVydHlcclxuXHJcblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdFx0aWYgIV8uaXNBcnJheShyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IFtyZWZlcmVuY2VfdG9dXHJcblxyXG5cdFx0XHRcdFx0cmVmZXJlbmNlX3RvLmZvckVhY2ggKHIpLT5cclxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX29iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHIsIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZV9vYmpcclxuXHRcdFx0XHRcdFx0XHRfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWFxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lXHJcblx0XHRcdFx0XHRcdFx0bmF2aWdhdGlvblByb3BlcnR5LnB1c2gge1xyXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogX25hbWUsXHJcblx0I1x0XHRcdFx0XHRcdFx0dHlwZTogXCJDb2xsZWN0aW9uKFwiICsgX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lICsgXCIpXCIsXHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBfTkFNRVNQQUNFICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdHBhcnRuZXI6IF9vYmplY3QubmFtZSAjVE9ET1xyXG5cdFx0XHRcdFx0XHRcdFx0X3JlX25hbWU6IHJlZmVyZW5jZV9vYmoubmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJlbnRpYWxDb25zdHJhaW50OiBbXHJcblx0XHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eTogZmllbGRfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VkUHJvcGVydHk6IFwiX2lkXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybiBcInJlZmVyZW5jZSB0byAnI3tyfScgaW52YWxpZC5cIlxyXG5cclxuXHRcdFx0ZW50aXRpZS5wcm9wZXJ0eSA9IHByb3BlcnR5XHJcblx0XHRcdGVudGl0aWUubmF2aWdhdGlvblByb3BlcnR5ID0gbmF2aWdhdGlvblByb3BlcnR5XHJcblxyXG5cdFx0XHRlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZS5wdXNoIGVudGl0aWVcclxuXHJcblx0XHRzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoIGVudGl0aWVzX3NjaGVtYVxyXG5cclxuXHJcblx0XHRjb250YWluZXJfc2NoZW1hID0ge31cclxuXHRcdGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyID0ge25hbWU6IFwiY29udGFpbmVyXCJ9XHJcblx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQgPSBbXVxyXG5cclxuXHRcdF8uZm9yRWFjaCBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgKF9ldCwgayktPlxyXG5cdFx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQucHVzaCB7XHJcblx0XHRcdFx0XCJuYW1lXCI6IF9ldC5uYW1lLFxyXG5cdFx0XHRcdFwiZW50aXR5VHlwZVwiOiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfZXQubmFtZSxcclxuXHRcdFx0XHRcIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIjogW11cclxuXHRcdFx0fVxyXG5cclxuXHRcdCMgVE9ETyBTZXJ2aWNlTWV0YWRhdGHkuI3mlK/mjIFuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5n5bGe5oCnXHJcbiNcdFx0Xy5mb3JFYWNoIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLCAoX2V0LCBrKS0+XHJcbiNcdFx0XHRfLmZvckVhY2ggX2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eSwgKF9ldF9ucCwgbnBfayktPlxyXG4jXHRcdFx0XHRfZXMgPSBfLmZpbmQgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LCAoX2VzKS0+XHJcbiNcdFx0XHRcdFx0XHRcdHJldHVybiBfZXMubmFtZSA9PSBfZXRfbnAucGFydG5lclxyXG4jXHJcbiNcdFx0XHRcdF9lcz8ubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5wdXNoIHtcInBhdGhcIjogX2V0X25wLl9yZV9uYW1lLCBcInRhcmdldFwiOiBfZXRfbnAuX3JlX25hbWV9XHJcbiNcdFx0XHRcdGNvbnNvbGUubG9nKFwiX2VzXCIsIF9lcylcclxuI1xyXG4jXHRcdGNvbnNvbGUubG9nKFwiY29udGFpbmVyX3NjaGVtYVwiLCBKU09OLnN0cmluZ2lmeShjb250YWluZXJfc2NoZW1hKSlcclxuXHJcblx0XHRzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoIGNvbnRhaW5lcl9zY2hlbWFcclxuXHJcblx0XHRyZXR1cm4gc2NoZW1hXHJcblxyXG5cdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnJywge2F1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRH0sIHtcclxuXHRcdGdldDogKCktPlxyXG5cdFx0XHRjb250ZXh0ID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zPy5zcGFjZUlkKVxyXG5cdFx0XHRzZXJ2aWNlRG9jdW1lbnQgID0gU2VydmljZURvY3VtZW50LnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKEB1cmxQYXJhbXM/LnNwYWNlSWQpLCB7Y29udGV4dDogY29udGV4dH0pO1xyXG5cdFx0XHRib2R5ID0gc2VydmljZURvY3VtZW50LmRvY3VtZW50KClcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG5cdFx0XHRcdFx0J09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Ym9keTogc2VydmljZURvY3VtZW50LmRvY3VtZW50KClcclxuXHRcdFx0fTtcclxuXHR9KVxyXG5cclxuXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEgsIHthdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUR9LCB7XHJcblx0XHRnZXQ6ICgpLT5cclxuXHRcdFx0c2VydmljZU1ldGFkYXRhID0gU2VydmljZU1ldGFkYXRhLnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKEB1cmxQYXJhbXM/LnNwYWNlSWQpKVxyXG5cdFx0XHRib2R5ID0gc2VydmljZU1ldGFkYXRhLmRvY3VtZW50KClcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbDsgY2hhcnNldD11dGYtOCcsXHJcblx0XHRcdFx0XHQnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRib2R5OiBib2R5XHJcblx0XHRcdH07XHJcblx0fSkiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIFNlcnZpY2VEb2N1bWVudCwgU2VydmljZU1ldGFkYXRhLCBfQk9PTEVBTl9UWVBFUywgX0RBVEVUSU1FX09GRlNFVF9UWVBFUywgX05BTUVTUEFDRSwgX05VTUJFUl9UWVBFUywgZ2V0T2JqZWN0c09kYXRhU2NoZW1hO1xuICBTZXJ2aWNlTWV0YWRhdGEgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLW1ldGFkYXRhJykuU2VydmljZU1ldGFkYXRhO1xuICBTZXJ2aWNlRG9jdW1lbnQgPSByZXF1aXJlKCdvZGF0YS12NC1zZXJ2aWNlLWRvY3VtZW50JykuU2VydmljZURvY3VtZW50O1xuICBfTlVNQkVSX1RZUEVTID0gW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIl07XG4gIF9CT09MRUFOX1RZUEVTID0gW1wiYm9vbGVhblwiXTtcbiAgX0RBVEVUSU1FX09GRlNFVF9UWVBFUyA9IFsnZGF0ZXRpbWUnXTtcbiAgX05BTUVTUEFDRSA9IFwiQ3JlYXRvckVudGl0aWVzXCI7XG4gIGdldE9iamVjdHNPZGF0YVNjaGVtYSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgY29udGFpbmVyX3NjaGVtYSwgZW50aXRpZXNfc2NoZW1hLCBzY2hlbWE7XG4gICAgc2NoZW1hID0ge1xuICAgICAgdmVyc2lvbjogU3RlZWRvc09EYXRhLlZFUlNJT04sXG4gICAgICBkYXRhU2VydmljZXM6IHtcbiAgICAgICAgc2NoZW1hOiBbXVxuICAgICAgfVxuICAgIH07XG4gICAgZW50aXRpZXNfc2NoZW1hID0ge307XG4gICAgZW50aXRpZXNfc2NoZW1hLm5hbWVzcGFjZSA9IF9OQU1FU1BBQ0U7XG4gICAgZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUgPSBbXTtcbiAgICBlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMgPSBbXTtcbiAgICBfLmVhY2goQ3JlYXRvci5Db2xsZWN0aW9ucywgZnVuY3Rpb24odmFsdWUsIGtleSwgbGlzdCkge1xuICAgICAgdmFyIF9vYmplY3QsIGVudGl0aWUsIGtleXMsIG5hdmlnYXRpb25Qcm9wZXJ0eSwgcHJvcGVydHk7XG4gICAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKTtcbiAgICAgIGlmICghKF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuZW5hYmxlX2FwaSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAga2V5cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3BlcnR5UmVmOiB7XG4gICAgICAgICAgICBuYW1lOiBcIl9pZFwiLFxuICAgICAgICAgICAgY29tcHV0ZWRLZXk6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBlbnRpdGllID0ge1xuICAgICAgICBuYW1lOiBfb2JqZWN0Lm5hbWUsXG4gICAgICAgIGtleToga2V5c1xuICAgICAgfTtcbiAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihfa2V5KSB7XG4gICAgICAgIHJldHVybiBlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMucHVzaCh7XG4gICAgICAgICAgdGFyZ2V0OiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfb2JqZWN0Lm5hbWUgKyBcIi9cIiArIF9rZXkucHJvcGVydHlSZWYubmFtZSxcbiAgICAgICAgICBhbm5vdGF0aW9uOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGVybVwiOiBcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbXB1dGVkXCIsXG4gICAgICAgICAgICAgIFwiYm9vbFwiOiBcInRydWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHByb3BlcnR5ID0gW107XG4gICAgICBwcm9wZXJ0eS5wdXNoKHtcbiAgICAgICAgbmFtZTogXCJfaWRcIixcbiAgICAgICAgdHlwZTogXCJFZG0uU3RyaW5nXCIsXG4gICAgICAgIG51bGxhYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBuYXZpZ2F0aW9uUHJvcGVydHkgPSBbXTtcbiAgICAgIF8uZm9yRWFjaChfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgICAgdmFyIF9wcm9wZXJ0eSwgcmVmZXJlbmNlX3RvO1xuICAgICAgICBfcHJvcGVydHkgPSB7XG4gICAgICAgICAgbmFtZTogZmllbGRfbmFtZSxcbiAgICAgICAgICB0eXBlOiBcIkVkbS5TdHJpbmdcIlxuICAgICAgICB9O1xuICAgICAgICBpZiAoXy5jb250YWlucyhfTlVNQkVSX1RZUEVTLCBmaWVsZC50eXBlKSkge1xuICAgICAgICAgIF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRG91YmxlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5jb250YWlucyhfQk9PTEVBTl9UWVBFUywgZmllbGQudHlwZSkpIHtcbiAgICAgICAgICBfcHJvcGVydHkudHlwZSA9IFwiRWRtLkJvb2xlYW5cIjtcbiAgICAgICAgfSBlbHNlIGlmIChfLmNvbnRhaW5zKF9EQVRFVElNRV9PRkZTRVRfVFlQRVMsIGZpZWxkLnR5cGUpKSB7XG4gICAgICAgICAgX3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5EYXRlVGltZU9mZnNldFwiO1xuICAgICAgICAgIF9wcm9wZXJ0eS5wcmVjaXNpb24gPSBcIjhcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVxdWlyZWQpIHtcbiAgICAgICAgICBfcHJvcGVydHkubnVsbGFibGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9wZXJ0eS5wdXNoKF9wcm9wZXJ0eSk7XG4gICAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgaWYgKHJlZmVyZW5jZV90bykge1xuICAgICAgICAgIGlmICghXy5pc0FycmF5KHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZV90byA9IFtyZWZlcmVuY2VfdG9dO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlX3RvLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgdmFyIF9uYW1lLCByZWZlcmVuY2Vfb2JqO1xuICAgICAgICAgICAgcmVmZXJlbmNlX29iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHIsIHNwYWNlSWQpO1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZV9vYmopIHtcbiAgICAgICAgICAgICAgX25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVg7XG4gICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9uYW1lID0gZmllbGRfbmFtZSArIFN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRpb25Qcm9wZXJ0eS5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBfbmFtZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBfTkFNRVNQQUNFICsgXCIuXCIgKyByZWZlcmVuY2Vfb2JqLm5hbWUsXG4gICAgICAgICAgICAgICAgcGFydG5lcjogX29iamVjdC5uYW1lLFxuICAgICAgICAgICAgICAgIF9yZV9uYW1lOiByZWZlcmVuY2Vfb2JqLm5hbWUsXG4gICAgICAgICAgICAgICAgcmVmZXJlbnRpYWxDb25zdHJhaW50OiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBmaWVsZF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2VkUHJvcGVydHk6IFwiX2lkXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihcInJlZmVyZW5jZSB0byAnXCIgKyByICsgXCInIGludmFsaWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGVudGl0aWUucHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgICAgIGVudGl0aWUubmF2aWdhdGlvblByb3BlcnR5ID0gbmF2aWdhdGlvblByb3BlcnR5O1xuICAgICAgcmV0dXJuIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLnB1c2goZW50aXRpZSk7XG4gICAgfSk7XG4gICAgc2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaChlbnRpdGllc19zY2hlbWEpO1xuICAgIGNvbnRhaW5lcl9zY2hlbWEgPSB7fTtcbiAgICBjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lciA9IHtcbiAgICAgIG5hbWU6IFwiY29udGFpbmVyXCJcbiAgICB9O1xuICAgIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldCA9IFtdO1xuICAgIF8uZm9yRWFjaChlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgZnVuY3Rpb24oX2V0LCBrKSB7XG4gICAgICByZXR1cm4gY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LnB1c2goe1xuICAgICAgICBcIm5hbWVcIjogX2V0Lm5hbWUsXG4gICAgICAgIFwiZW50aXR5VHlwZVwiOiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfZXQubmFtZSxcbiAgICAgICAgXCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nXCI6IFtdXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoKGNvbnRhaW5lcl9zY2hlbWEpO1xuICAgIHJldHVybiBzY2hlbWE7XG4gIH07XG4gIFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnJywge1xuICAgIGF1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRFxuICB9LCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib2R5LCBjb250ZXh0LCByZWYsIHJlZjEsIHNlcnZpY2VEb2N1bWVudDtcbiAgICAgIGNvbnRleHQgPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKChyZWYgPSB0aGlzLnVybFBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwKTtcbiAgICAgIHNlcnZpY2VEb2N1bWVudCA9IFNlcnZpY2VEb2N1bWVudC5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYSgocmVmMSA9IHRoaXMudXJsUGFyYW1zKSAhPSBudWxsID8gcmVmMS5zcGFjZUlkIDogdm9pZCAwKSwge1xuICAgICAgICBjb250ZXh0OiBjb250ZXh0XG4gICAgICB9KTtcbiAgICAgIGJvZHkgPSBzZXJ2aWNlRG9jdW1lbnQuZG9jdW1lbnQoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICdPRGF0YS1WZXJzaW9uJzogU3RlZWRvc09EYXRhLlZFUlNJT05cbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogc2VydmljZURvY3VtZW50LmRvY3VtZW50KClcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZShTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCwge1xuICAgIGF1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRFxuICB9LCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib2R5LCByZWYsIHNlcnZpY2VNZXRhZGF0YTtcbiAgICAgIHNlcnZpY2VNZXRhZGF0YSA9IFNlcnZpY2VNZXRhZGF0YS5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYSgocmVmID0gdGhpcy51cmxQYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgICAgYm9keSA9IHNlcnZpY2VNZXRhZGF0YS5kb2N1bWVudCgpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IGJvZHlcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiQFN0ZWVkb3NPRGF0YSA9IHt9XHJcblN0ZWVkb3NPRGF0YS5WRVJTSU9OID0gJzQuMCdcclxuU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRCA9IHRydWVcclxuU3RlZWRvc09EYXRhLkFQSV9QQVRIID0gJy9hcGkvb2RhdGEvdjQvOnNwYWNlSWQnXHJcblN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIID0gJyRtZXRhZGF0YSdcclxuU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVggPSBcIl9leHBhbmRcIlxyXG5TdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGggPSAoc3BhY2VJZCktPlxyXG5cdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwoJ2FwaS9vZGF0YS92NC8nICsgc3BhY2VJZClcclxuXHJcblN0ZWVkb3NPRGF0YS5nZXRPRGF0YVBhdGggPSAoc3BhY2VJZCxvYmplY3RfbmFtZSktPlxyXG5cdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je29iamVjdF9uYW1lfVwiXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoID0gKHNwYWNlSWQpLT5cclxuXHRcdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je1N0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIfVwiXHJcblxyXG5cdFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoID0gKHNwYWNlSWQsIG9iamVjdF9uYW1lKS0+XHJcblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIFwiIyN7b2JqZWN0X25hbWV9XCJcclxuXHRTdGVlZG9zT0RhdGEuZ2V0T0RhdGFOZXh0TGlua1BhdGggPSAoc3BhY2VJZCxvYmplY3RfbmFtZSktPlxyXG5cdFx0cmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIFwiLyN7b2JqZWN0X25hbWV9XCJcclxuXHJcblxyXG5cdEBTdGVlZG9zT2RhdGFBUEkgPSBuZXcgT2RhdGFSZXN0aXZ1c1xyXG5cdFx0YXBpUGF0aDogU3RlZWRvc09EYXRhLkFQSV9QQVRILFxyXG5cdFx0dXNlRGVmYXVsdEF1dGg6IHRydWVcclxuXHRcdHByZXR0eUpzb246IHRydWVcclxuXHRcdGVuYWJsZUNvcnM6IHRydWVcclxuXHRcdGRlZmF1bHRIZWFkZXJzOlxyXG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiIsInRoaXMuU3RlZWRvc09EYXRhID0ge307XG5cblN0ZWVkb3NPRGF0YS5WRVJTSU9OID0gJzQuMCc7XG5cblN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUQgPSB0cnVlO1xuXG5TdGVlZG9zT0RhdGEuQVBJX1BBVEggPSAnL2FwaS9vZGF0YS92NC86c3BhY2VJZCc7XG5cblN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIID0gJyRtZXRhZGF0YSc7XG5cblN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYID0gXCJfZXhwYW5kXCI7XG5cblN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgnYXBpL29kYXRhL3Y0LycgKyBzcGFjZUlkKTtcbn07XG5cblN0ZWVkb3NPRGF0YS5nZXRPRGF0YVBhdGggPSBmdW5jdGlvbihzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyAoXCIvXCIgKyBTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCk7XG4gIH07XG4gIFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIChcIiNcIiArIG9iamVjdF9uYW1lKTtcbiAgfTtcbiAgU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICB9O1xuICB0aGlzLlN0ZWVkb3NPZGF0YUFQSSA9IG5ldyBPZGF0YVJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiBTdGVlZG9zT0RhdGEuQVBJX1BBVEgsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiB0cnVlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
