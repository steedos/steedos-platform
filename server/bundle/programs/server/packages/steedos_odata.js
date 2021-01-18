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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL29iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9vZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21pZGRsZXdhcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWlkZGxld2FyZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGFkYXRhLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsImNvb2tpZXMiLCJnZXRVc2VyUXVlcnlTZWxlY3RvciIsInVzZXJWYWxpZGF0b3IiLCJBdXRoIiwiTWF0Y2giLCJXaGVyZSIsInVzZXIiLCJjaGVjayIsImlkIiwiT3B0aW9uYWwiLCJTdHJpbmciLCJ1c2VybmFtZSIsImVtYWlsIiwiXyIsImtleXMiLCJsZW5ndGgiLCJFcnJvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicGFzc3dvcmQiLCJhdXRoVG9rZW4iLCJhdXRoZW50aWNhdGluZ1VzZXIiLCJhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciIsImhhc2hlZFRva2VuIiwicGFzc3dvcmRWZXJpZmljYXRpb24iLCJyZWYiLCJzcGFjZV91c2VycyIsInNwYWNlcyIsIk1ldGVvciIsInVzZXJzIiwiZmluZE9uZSIsInNlcnZpY2VzIiwiQWNjb3VudHMiLCJfY2hlY2tQYXNzd29yZCIsImVycm9yIiwiX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4iLCJfaGFzaFN0YW1wZWRUb2tlbiIsIl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIiwiX2lkIiwiZGIiLCJmaW5kIiwiZmV0Y2giLCJlYWNoIiwic3UiLCJzcGFjZSIsIlN0ZWVkb3MiLCJoYXNGZWF0dXJlIiwiaW5kZXhPZiIsImFkbWlucyIsInB1c2giLCJuYW1lIiwidG9rZW4iLCJ1c2VySWQiLCJhZG1pblNwYWNlcyIsImVudiIsInByb2Nlc3MiLCJOT0RFX0VOViIsImlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlIiwiZXJyIiwicmVxIiwicmVzIiwic3RhdHVzQ29kZSIsInN0YXR1cyIsIm1zZyIsInN0YWNrIiwidG9TdHJpbmciLCJjb25zb2xlIiwiaGVhZGVyc1NlbnQiLCJzb2NrZXQiLCJkZXN0cm95Iiwic2V0SGVhZGVyIiwiQnVmZmVyIiwiYnl0ZUxlbmd0aCIsIm1ldGhvZCIsImVuZCIsInNoYXJlIiwiUm91dGUiLCJhcGkiLCJwYXRoIiwib3B0aW9ucyIsImVuZHBvaW50czEiLCJlbmRwb2ludHMiLCJwcm90b3R5cGUiLCJhZGRUb0FwaSIsImF2YWlsYWJsZU1ldGhvZHMiLCJhbGxvd2VkTWV0aG9kcyIsImZ1bGxQYXRoIiwicmVqZWN0ZWRNZXRob2RzIiwic2VsZiIsImNvbnRhaW5zIiwiX2NvbmZpZyIsInBhdGhzIiwiZXh0ZW5kIiwiZGVmYXVsdE9wdGlvbnNFbmRwb2ludCIsIl9yZXNvbHZlRW5kcG9pbnRzIiwiX2NvbmZpZ3VyZUVuZHBvaW50cyIsImZpbHRlciIsInJlamVjdCIsImFwaVBhdGgiLCJlbmRwb2ludCIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJkb25lRnVuYyIsImVuZHBvaW50Q29udGV4dCIsInJlc3BvbnNlRGF0YSIsInJlc3BvbnNlSW5pdGlhdGVkIiwidXJsUGFyYW1zIiwicGFyYW1zIiwicXVlcnlQYXJhbXMiLCJxdWVyeSIsImJvZHlQYXJhbXMiLCJib2R5IiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZG9uZSIsIl9jYWxsRW5kcG9pbnQiLCJlcnJvcjEiLCJoZWFkZXJzIiwiX3Jlc3BvbmQiLCJtZXNzYWdlIiwiam9pbiIsInRvVXBwZXJDYXNlIiwiaXNGdW5jdGlvbiIsImFjdGlvbiIsInJlZjEiLCJyZWYyIiwicm9sZVJlcXVpcmVkIiwidW5pb24iLCJpc0VtcHR5IiwiYXV0aFJlcXVpcmVkIiwic3BhY2VSZXF1aXJlZCIsImludm9jYXRpb24iLCJfYXV0aEFjY2VwdGVkIiwiX3JvbGVBY2NlcHRlZCIsIl9zcGFjZUFjY2VwdGVkIiwiRERQQ29tbW9uIiwiTWV0aG9kSW52b2NhdGlvbiIsImlzU2ltdWxhdGlvbiIsImNvbm5lY3Rpb24iLCJyYW5kb21TZWVkIiwibWFrZVJwY1NlZWQiLCJERFAiLCJfQ3VycmVudEludm9jYXRpb24iLCJ3aXRoVmFsdWUiLCJjYWxsIiwiX2F1dGhlbnRpY2F0ZSIsImF1dGgiLCJ1c2VyU2VsZWN0b3IiLCJzcGFjZV91c2Vyc19jb3VudCIsInNwYWNlSWQiLCJjb3VudCIsImludGVyc2VjdGlvbiIsInJvbGVzIiwiZGVmYXVsdEhlYWRlcnMiLCJkZWxheUluTWlsbGlzZWNvbmRzIiwibWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMiLCJyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byIsInNlbmRSZXNwb25zZSIsIl9sb3dlckNhc2VLZXlzIiwibWF0Y2giLCJwcmV0dHlKc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlSGVhZCIsIndyaXRlIiwiTWF0aCIsInJhbmRvbSIsInNldFRpbWVvdXQiLCJvYmplY3QiLCJjaGFpbiIsInBhaXJzIiwibWFwIiwiYXR0ciIsInRvTG93ZXJDYXNlIiwidmFsdWUiLCJDb29raWVzIiwiT2RhdGFSZXN0aXZ1cyIsImJhc2ljQXV0aCIsIml0ZW0iLCJpIiwibCIsImNvcnNIZWFkZXJzIiwiX3JvdXRlcyIsInVzZURlZmF1bHRBdXRoIiwidmVyc2lvbiIsIl91c2VyIiwiZ2V0IiwiX2hhc2hMb2dpblRva2VuIiwiZW5hYmxlQ29ycyIsInNsaWNlIiwibGFzdCIsIl9pbml0QXV0aCIsInVzZUF1dGgiLCJ3YXJuIiwiYWRkUm91dGUiLCJyb3V0ZSIsImFkZENvbGxlY3Rpb24iLCJjb2xsZWN0aW9uIiwiY29sbGVjdGlvbkVuZHBvaW50cyIsImNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyIsImVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiIsImVudGl0eVJvdXRlRW5kcG9pbnRzIiwiZXhjbHVkZWRFbmRwb2ludHMiLCJtZXRob2RzIiwibWV0aG9kc09uQ29sbGVjdGlvbiIsInJvdXRlT3B0aW9ucyIsIl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyIsIl9jb2xsZWN0aW9uRW5kcG9pbnRzIiwiX25hbWUiLCJjb25maWd1cmVkRW5kcG9pbnQiLCJlbmRwb2ludE9wdGlvbnMiLCJtZXRob2RUeXBlIiwiY2xvbmUiLCJlbnRpdHkiLCJzZWxlY3RvciIsImRhdGEiLCJwdXQiLCJlbnRpdHlJc1VwZGF0ZWQiLCJ1cGRhdGUiLCIkc2V0IiwicmVtb3ZlIiwicG9zdCIsImVudGl0eUlkIiwiaW5zZXJ0IiwiZ2V0QWxsIiwiZW50aXRpZXMiLCJmaWVsZHMiLCJwcm9maWxlIiwiY3JlYXRlVXNlciIsImxvZ291dCIsImUiLCJleHRyYURhdGEiLCJzZWFyY2hRdWVyeSIsInJlYXNvbiIsIm9uTG9nZ2VkSW4iLCJleHRyYSIsImluZGV4IiwidG9rZW5GaWVsZE5hbWUiLCJ0b2tlbkxvY2F0aW9uIiwidG9rZW5QYXRoIiwidG9rZW5SZW1vdmFsUXVlcnkiLCJ0b2tlblRvUmVtb3ZlIiwibGFzdEluZGV4T2YiLCJzdWJzdHJpbmciLCIkcHVsbCIsIm9uTG9nZ2VkT3V0Iiwic3RhcnR1cCIsImdldE9iamVjdCIsImdldE9iamVjdHMiLCJvYmplY3RfbmFtZXMiLCJzcGxpdCIsImZvckVhY2giLCJvYmplY3RfbmFtZSIsIm9iamVjdF9wZXJtaXNzaW9ucyIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQ3VycmVudCIsInBzZXRzVXNlciIsIkNyZWF0b3IiLCJPYmplY3RzIiwiZ2V0T2JqZWN0TmFtZSIsImdldENvbGxlY3Rpb24iLCJhc3NpZ25lZF9hcHBzIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJiaW5kIiwibGlzdF92aWV3cyIsInBlcm1pc3Npb25fc2V0IiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJhbGxvd0NyZWF0ZSIsIm1vZGlmeUFsbFJlY29yZHMiLCJmaWVsZCIsImtleSIsIl9maWVsZCIsInVuZWRpdGFibGVfZmllbGRzIiwicmVhZG9ubHkiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsIlN0ZWVkb3NPRGF0YSIsIkFQSV9QQVRIIiwibmV4dCIsIl9vYmoiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJNZXRlb3JPRGF0YUFQSVY0Um91dGVyIiwiTWV0ZW9yT0RhdGFSb3V0ZXIiLCJPRGF0YVJvdXRlciIsImFwcCIsImV4cHJlc3MiLCJ1c2UiLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJzdGVlZG9zU2NoZW1hIiwiZ2V0RGF0YVNvdXJjZXMiLCJkYXRhc291cmNlIiwib3RoZXJBcHAiLCJGaWJlciIsImF1dGhvcml6YXRpb25DYWNoZSIsIk1pZGRsZXdhcmUiLCJhcHBfaWQiLCJhcHBfbG9naW5fdG9rZW4iLCJjbGllbnRfaWQiLCJpc0F1dGhlZCIsImxvZ2luVG9rZW5zIiwicmVzdWx0IiwiYWNjZXNzX3Rva2VuIiwibG9nIiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwicGFyc2UiLCJwYXNzIiwicmVzdW1lIiwidCIsInJ1biIsIlNlcnZpY2VEb2N1bWVudCIsIlNlcnZpY2VNZXRhZGF0YSIsIl9CT09MRUFOX1RZUEVTIiwiX0RBVEVUSU1FX09GRlNFVF9UWVBFUyIsIl9OQU1FU1BBQ0UiLCJfTlVNQkVSX1RZUEVTIiwiZ2V0T2JqZWN0c09kYXRhU2NoZW1hIiwiY29udGFpbmVyX3NjaGVtYSIsImVudGl0aWVzX3NjaGVtYSIsInNjaGVtYSIsIlZFUlNJT04iLCJkYXRhU2VydmljZXMiLCJuYW1lc3BhY2UiLCJlbnRpdHlUeXBlIiwiYW5ub3RhdGlvbnMiLCJDb2xsZWN0aW9ucyIsImxpc3QiLCJfb2JqZWN0IiwiZW50aXRpZSIsIm5hdmlnYXRpb25Qcm9wZXJ0eSIsInByb3BlcnR5IiwiZW5hYmxlX2FwaSIsInByb3BlcnR5UmVmIiwiY29tcHV0ZWRLZXkiLCJfa2V5IiwidGFyZ2V0IiwiYW5ub3RhdGlvbiIsInR5cGUiLCJudWxsYWJsZSIsImZpZWxkX25hbWUiLCJfcHJvcGVydHkiLCJyZWZlcmVuY2VfdG8iLCJwcmVjaXNpb24iLCJyZXF1aXJlZCIsImlzQXJyYXkiLCJyIiwicmVmZXJlbmNlX29iaiIsIkVYUEFORF9GSUVMRF9TVUZGSVgiLCJwYXJ0bmVyIiwiX3JlX25hbWUiLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCJyZWZlcmVuY2VkUHJvcGVydHkiLCJlbnRpdHlDb250YWluZXIiLCJlbnRpdHlTZXQiLCJfZXQiLCJrIiwiU3RlZWRvc09kYXRhQVBJIiwiQVVUSFJFUVVJUkVEIiwiY29udGV4dCIsInNlcnZpY2VEb2N1bWVudCIsImdldE1ldGFEYXRhUGF0aCIsInByb2Nlc3NNZXRhZGF0YUpzb24iLCJkb2N1bWVudCIsIk1FVEFEQVRBX1BBVEgiLCJzZXJ2aWNlTWV0YWRhdGEiLCJnZXRSb290UGF0aCIsImFic29sdXRlVXJsIiwiZ2V0T0RhdGFQYXRoIiwiaXNTZXJ2ZXIiLCJnZXRPRGF0YUNvbnRleHRQYXRoIiwiZ2V0T0RhdGFOZXh0TGlua1BhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjs7QUFBckI7QUFDQUMsT0FBTyxDQUFDLHlCQUFELENBQVA7O0FBR0FKLGdCQUFnQixDQUFDO0FBQ2hCLGdCQUFjLFFBREU7QUFFaEIsK0JBQTZCLFFBRmI7QUFHaEIsK0JBQTZCLFFBSGI7QUFJaEJLLFNBQU8sRUFBRTtBQUpPLENBQUQsRUFLYixlQUxhLENBQWhCLEM7Ozs7Ozs7Ozs7OztBQ0pBLElBQUFDLG9CQUFBLEVBQUFDLGFBQUE7QUFBQSxLQUFDQyxJQUFELFVBQUNBLElBQUQsR0FBVSxFQUFWLEUsQ0FFQTs7O0FBR0FELGdCQUFnQkUsTUFBTUMsS0FBTixDQUFZLFVBQUNDLElBQUQ7QUFDM0JDLFFBQU1ELElBQU4sRUFDQztBQUFBRSxRQUFJSixNQUFNSyxRQUFOLENBQWVDLE1BQWYsQ0FBSjtBQUNBQyxjQUFV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R0FBMkIsVUFBQzdOLE9BQUQ7QUFDMUIsU0FBT3pILE9BQU91VixXQUFQLENBQW1CLGtCQUFrQjlOLE9BQXJDLENBQVA7QUFEMEIsQ0FBM0I7O0FBR0FpSSxhQUFhOEYsWUFBYixHQUE0QixVQUFDL04sT0FBRCxFQUFTdUcsV0FBVDtBQUMzQixTQUFPMEIsYUFBYTRGLFdBQWIsQ0FBeUI3TixPQUF6QixLQUFvQyxNQUFJdUcsV0FBeEMsQ0FBUDtBQUQyQixDQUE1Qjs7QUFHQSxJQUFHaE8sT0FBT3lWLFFBQVY7QUFDQy9GLGVBQWF1RixlQUFiLEdBQStCLFVBQUN4TixPQUFEO0FBQzlCLFdBQU9pSSxhQUFhNEYsV0FBYixDQUF5QjdOLE9BQXpCLEtBQW9DLE1BQUlpSSxhQUFhMEYsYUFBckQsQ0FBUDtBQUQ4QixHQUEvQjs7QUFHQTFGLGVBQWFnRyxtQkFBYixHQUFtQyxVQUFDak8sT0FBRCxFQUFVdUcsV0FBVjtBQUNsQyxXQUFPMEIsYUFBYXVGLGVBQWIsQ0FBNkJ4TixPQUE3QixLQUF3QyxNQUFJdUcsV0FBNUMsQ0FBUDtBQURrQyxHQUFuQzs7QUFFQTBCLGVBQWFpRyxvQkFBYixHQUFvQyxVQUFDbE8sT0FBRCxFQUFTdUcsV0FBVDtBQUNuQyxXQUFPMEIsYUFBYTRGLFdBQWIsQ0FBeUI3TixPQUF6QixLQUFvQyxNQUFJdUcsV0FBeEMsQ0FBUDtBQURtQyxHQUFwQzs7QUFJQSxPQUFDNkcsZUFBRCxHQUFtQixJQUFJekwsYUFBSixDQUNsQjtBQUFBOUUsYUFBU29MLGFBQWFDLFFBQXRCO0FBQ0FoRyxvQkFBZ0IsSUFEaEI7QUFFQXZCLGdCQUFZLElBRlo7QUFHQTRCLGdCQUFZLElBSFo7QUFJQW5DLG9CQUNDO0FBQUEsc0JBQWdCO0FBQWhCO0FBTEQsR0FEa0IsQ0FBbkI7QUNpQkEsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGZpeCB3YXJuaW5nOiB4eHggbm90IGluc3RhbGxlZFxucmVxdWlyZShcImJhc2ljLWF1dGgvcGFja2FnZS5qc29uXCIpO1xuXG5pbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0J2Jhc2ljLWF1dGgnOiAnXjIuMC4xJyxcblx0J29kYXRhLXY0LXNlcnZpY2UtbWV0YWRhdGEnOiBcIl4wLjEuNlwiLFxuXHRcIm9kYXRhLXY0LXNlcnZpY2UtZG9jdW1lbnRcIjogXCJeMC4wLjNcIixcblx0Y29va2llczogXCJeMC42LjFcIixcbn0sICdzdGVlZG9zOm9kYXRhJyk7XG4iLCJAQXV0aCBvcj0ge31cblxuIyMjXG5cdEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiMjI1xudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlICh1c2VyKSAtPlxuXHRjaGVjayB1c2VyLFxuXHRcdGlkOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcblx0XHR1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG5cdFx0ZW1haWw6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuXG5cdGlmIF8ua2V5cyh1c2VyKS5sZW5ndGggaXMgbm90IDFcblx0XHR0aHJvdyBuZXcgTWF0Y2guRXJyb3IgJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnXG5cblx0cmV0dXJuIHRydWVcblxuXG4jIyNcblx0UmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuIyMjXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9ICh1c2VyKSAtPlxuXHRpZiB1c2VyLmlkXG5cdFx0cmV0dXJuIHsnX2lkJzogdXNlci5pZH1cblx0ZWxzZSBpZiB1c2VyLnVzZXJuYW1lXG5cdFx0cmV0dXJuIHsndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lfVxuXHRlbHNlIGlmIHVzZXIuZW1haWxcblx0XHRyZXR1cm4geydlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWx9XG5cblx0IyBXZSBzaG91bGRuJ3QgYmUgaGVyZSBpZiB0aGUgdXNlciBvYmplY3Qgd2FzIHByb3Blcmx5IHZhbGlkYXRlZFxuXHR0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInXG5cblxuIyMjXG5cdExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuIyMjXG5AQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9ICh1c2VyLCBwYXNzd29yZCkgLT5cblx0aWYgbm90IHVzZXIgb3Igbm90IHBhc3N3b3JkXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0IyBWYWxpZGF0ZSB0aGUgbG9naW4gaW5wdXQgdHlwZXNcblx0Y2hlY2sgdXNlciwgdXNlclZhbGlkYXRvclxuXHRjaGVjayBwYXNzd29yZCwgU3RyaW5nXG5cblx0IyBSZXRyaWV2ZSB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxuXHRhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpXG5cdGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKVxuXG5cdGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblx0aWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcz8ucGFzc3dvcmRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHQjIEF1dGhlbnRpY2F0ZSB0aGUgdXNlcidzIHBhc3N3b3JkXG5cdHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZFxuXHRpZiBwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdCMgQWRkIGEgbmV3IGF1dGggdG9rZW4gdG8gdGhlIHVzZXIncyBhY2NvdW50XG5cdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cblx0QWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4gYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW5cblxuXHRzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWR9KS5mZXRjaCgpXG5cdHNwYWNlcyA9IFtdXG5cdF8uZWFjaCBzcGFjZV91c2VycywgKHN1KS0+XG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSlcblx0XHQjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcblx0XHRpZiBzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZT8uX2lkKSBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcik+PTBcblx0XHRcdHNwYWNlcy5wdXNoXG5cdFx0XHRcdF9pZDogc3BhY2UuX2lkXG5cdFx0XHRcdG5hbWU6IHNwYWNlLm5hbWVcblx0cmV0dXJuIHthdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbiwgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBhZG1pblNwYWNlczogc3BhY2VzfVxuIiwidmFyIGdldFVzZXJRdWVyeVNlbGVjdG9yLCB1c2VyVmFsaWRhdG9yO1xuXG50aGlzLkF1dGggfHwgKHRoaXMuQXV0aCA9IHt9KTtcblxuXG4vKlxuXHRBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4gKi9cblxudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlKGZ1bmN0aW9uKHVzZXIpIHtcbiAgY2hlY2sodXNlciwge1xuICAgIGlkOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpXG4gIH0pO1xuICBpZiAoXy5rZXlzKHVzZXIpLmxlbmd0aCA9PT0gITEpIHtcbiAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IoJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5cbi8qXG5cdFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiAqL1xuXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgaWYgKHVzZXIuaWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ19pZCc6IHVzZXIuaWRcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3VzZXJuYW1lJzogdXNlci51c2VybmFtZVxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci5lbWFpbCkge1xuICAgIHJldHVybiB7XG4gICAgICAnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsXG4gICAgfTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInKTtcbn07XG5cblxuLypcblx0TG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXG4gKi9cblxudGhpcy5BdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gZnVuY3Rpb24odXNlciwgcGFzc3dvcmQpIHtcbiAgdmFyIGF1dGhUb2tlbiwgYXV0aGVudGljYXRpbmdVc2VyLCBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciwgaGFzaGVkVG9rZW4sIHBhc3N3b3JkVmVyaWZpY2F0aW9uLCByZWYsIHNwYWNlX3VzZXJzLCBzcGFjZXM7XG4gIGlmICghdXNlciB8fCAhcGFzc3dvcmQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGNoZWNrKHVzZXIsIHVzZXJWYWxpZGF0b3IpO1xuICBjaGVjayhwYXNzd29yZCwgU3RyaW5nKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpO1xuICBpZiAoIWF1dGhlbnRpY2F0aW5nVXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaWYgKCEoKHJlZiA9IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IHJlZi5wYXNzd29yZCA6IHZvaWQgMCkpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZCk7XG4gIGlmIChwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKTtcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbihhdXRoVG9rZW4pO1xuICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbihhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlbik7XG4gIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZFxuICB9KS5mZXRjaCgpO1xuICBzcGFjZXMgPSBbXTtcbiAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbihzdSkge1xuICAgIHZhciBzcGFjZTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKTtcbiAgICBpZiAoc3BhY2UgJiYgU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3BhY2UgIT0gbnVsbCA/IHNwYWNlLl9pZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcikgPj0gMCkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHtcbiAgICAgICAgX2lkOiBzcGFjZS5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgYXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sXG4gICAgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLFxuICAgIGFkbWluU3BhY2VzOiBzcGFjZXNcbiAgfTtcbn07XG4iLCIvLyBXZSBuZWVkIGEgZnVuY3Rpb24gdGhhdCB0cmVhdHMgdGhyb3duIGVycm9ycyBleGFjdGx5IGxpa2UgSXJvbiBSb3V0ZXIgd291bGQuXG4vLyBUaGlzIGZpbGUgaXMgd3JpdHRlbiBpbiBKYXZhU2NyaXB0IHRvIGVuYWJsZSBjb3B5LXBhc3RpbmcgSXJvbiBSb3V0ZXIgY29kZS5cblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMM1xudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XG5cbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDQ3XG5pcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSA9IGZ1bmN0aW9uKGVyciwgcmVxLCByZXMpIHtcblx0aWYgKHJlcy5zdGF0dXNDb2RlIDwgNDAwKVxuXHRcdHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuXG5cdGlmIChlcnIuc3RhdHVzKVxuXHRcdHJlcy5zdGF0dXNDb2RlID0gZXJyLnN0YXR1cztcblxuXHRpZiAoZW52ID09PSAnZGV2ZWxvcG1lbnQnKVxuXHRcdG1zZyA9IChlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpICsgJ1xcbic7XG5cdGVsc2Vcblx0Ly9YWFggZ2V0IHRoaXMgZnJvbSBzdGFuZGFyZCBkaWN0IG9mIGVycm9yIG1lc3NhZ2VzP1xuXHRcdG1zZyA9ICdTZXJ2ZXIgZXJyb3IuJztcblxuXHRjb25zb2xlLmVycm9yKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSk7XG5cblx0aWYgKHJlcy5oZWFkZXJzU2VudClcblx0XHRyZXR1cm4gcmVxLnNvY2tldC5kZXN0cm95KCk7XG5cblx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xuXHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIEJ1ZmZlci5ieXRlTGVuZ3RoKG1zZykpO1xuXHRpZiAocmVxLm1ldGhvZCA9PT0gJ0hFQUQnKVxuXHRcdHJldHVybiByZXMuZW5kKCk7XG5cdHJlcy5lbmQobXNnKTtcblx0cmV0dXJuO1xufVxuIiwiY2xhc3Mgc2hhcmUuUm91dGVcblxuXHRjb25zdHJ1Y3RvcjogKEBhcGksIEBwYXRoLCBAb3B0aW9ucywgQGVuZHBvaW50cykgLT5cblx0XHQjIENoZWNrIGlmIG9wdGlvbnMgd2VyZSBwcm92aWRlZFxuXHRcdGlmIG5vdCBAZW5kcG9pbnRzXG5cdFx0XHRAZW5kcG9pbnRzID0gQG9wdGlvbnNcblx0XHRcdEBvcHRpb25zID0ge31cblxuXG5cdGFkZFRvQXBpOiBkbyAtPlxuXHRcdGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddXG5cblx0XHRyZXR1cm4gLT5cblx0XHRcdHNlbGYgPSB0aGlzXG5cblx0XHRcdCMgVGhyb3cgYW4gZXJyb3IgaWYgYSByb3V0ZSBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIGF0IHRoaXMgcGF0aFxuXHRcdFx0IyBUT0RPOiBDaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoIHBhdGhzIHRoYXQgZm9sbG93IHNhbWUgcGF0dGVybiB3aXRoIGRpZmZlcmVudCBwYXJhbWV0ZXIgbmFtZXNcblx0XHRcdGlmIF8uY29udGFpbnMgQGFwaS5fY29uZmlnLnBhdGhzLCBAcGF0aFxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogI3tAcGF0aH1cIlxuXG5cdFx0XHQjIE92ZXJyaWRlIHRoZSBkZWZhdWx0IE9QVElPTlMgZW5kcG9pbnQgd2l0aCBvdXIgb3duXG5cdFx0XHRAZW5kcG9pbnRzID0gXy5leHRlbmQgb3B0aW9uczogQGFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQsIEBlbmRwb2ludHNcblxuXHRcdFx0IyBDb25maWd1cmUgZWFjaCBlbmRwb2ludCBvbiB0aGlzIHJvdXRlXG5cdFx0XHRAX3Jlc29sdmVFbmRwb2ludHMoKVxuXHRcdFx0QF9jb25maWd1cmVFbmRwb2ludHMoKVxuXG5cdFx0XHQjIEFkZCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyBwYXRoc1xuXHRcdFx0QGFwaS5fY29uZmlnLnBhdGhzLnB1c2ggQHBhdGhcblxuXHRcdFx0YWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlciBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHRfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcblx0XHRcdHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0IGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxuXG5cdFx0XHQjIFNldHVwIGVuZHBvaW50cyBvbiByb3V0ZVxuXHRcdFx0ZnVsbFBhdGggPSBAYXBpLl9jb25maWcuYXBpUGF0aCArIEBwYXRoXG5cdFx0XHRfLmVhY2ggYWxsb3dlZE1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXVxuXHRcdFx0XHRKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG5cdFx0XHRcdFx0IyBBZGQgZnVuY3Rpb24gdG8gZW5kcG9pbnQgY29udGV4dCBmb3IgaW5kaWNhdGluZyBhIHJlc3BvbnNlIGhhcyBiZWVuIGluaXRpYXRlZCBtYW51YWxseVxuXHRcdFx0XHRcdHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRkb25lRnVuYyA9IC0+XG5cdFx0XHRcdFx0XHRyZXNwb25zZUluaXRpYXRlZCA9IHRydWVcblxuXHRcdFx0XHRcdGVuZHBvaW50Q29udGV4dCA9XG5cdFx0XHRcdFx0XHR1cmxQYXJhbXM6IHJlcS5wYXJhbXNcblx0XHRcdFx0XHRcdHF1ZXJ5UGFyYW1zOiByZXEucXVlcnlcblx0XHRcdFx0XHRcdGJvZHlQYXJhbXM6IHJlcS5ib2R5XG5cdFx0XHRcdFx0XHRyZXF1ZXN0OiByZXFcblx0XHRcdFx0XHRcdHJlc3BvbnNlOiByZXNcblx0XHRcdFx0XHRcdGRvbmU6IGRvbmVGdW5jXG5cdFx0XHRcdFx0IyBBZGQgZW5kcG9pbnQgY29uZmlnIG9wdGlvbnMgdG8gY29udGV4dFxuXHRcdFx0XHRcdF8uZXh0ZW5kIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblxuXHRcdFx0XHRcdCMgUnVuIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRcblx0XHRcdFx0XHRyZXNwb25zZURhdGEgPSBudWxsXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRyZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHQjIERvIGV4YWN0bHkgd2hhdCBJcm9uIFJvdXRlciB3b3VsZCBoYXZlIGRvbmUsIHRvIGF2b2lkIGNoYW5naW5nIHRoZSBBUElcblx0XHRcdFx0XHRcdGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0XHRcdGlmIHJlc3BvbnNlSW5pdGlhdGVkXG5cdFx0XHRcdFx0XHQjIEVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgcHJvcGVybHkgY29tcGxldGVkXG5cdFx0XHRcdFx0XHRyZXMuZW5kKClcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGlmIHJlcy5oZWFkZXJzU2VudFxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXG5cdFx0XHRcdFx0XHRlbHNlIGlmIHJlc3BvbnNlRGF0YSBpcyBudWxsIG9yIHJlc3BvbnNlRGF0YSBpcyB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxuXG5cdFx0XHRcdFx0IyBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBodHRwIHJlc3BvbnNlLCBoYW5kbGluZyB0aGUgZGlmZmVyZW50IGVuZHBvaW50IHJlc3BvbnNlIHR5cGVzXG5cdFx0XHRcdFx0aWYgcmVzcG9uc2VEYXRhLmJvZHkgYW5kIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSBvciByZXNwb25zZURhdGEuaGVhZGVycylcblx0XHRcdFx0XHRcdHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YVxuXG5cdFx0XHRfLmVhY2ggcmVqZWN0ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHRKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG5cdFx0XHRcdFx0cmVzcG9uc2VEYXRhID0gc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuXHRcdFx0XHRcdGhlYWRlcnMgPSAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcblx0XHRcdFx0XHRzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnNcblxuXG5cdCMjI1xuXHRcdENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuXHRcdGZ1bmN0aW9uXG5cblx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cblx0IyMjXG5cdF9yZXNvbHZlRW5kcG9pbnRzOiAtPlxuXHRcdF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSAtPlxuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGVuZHBvaW50KVxuXHRcdFx0XHRlbmRwb2ludHNbbWV0aG9kXSA9IHthY3Rpb246IGVuZHBvaW50fVxuXHRcdHJldHVyblxuXG5cblx0IyMjXG5cdFx0Q29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuXHRcdGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuXG5cdFx0QXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cblx0XHRlbnRpcmUgcm91dGUsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZCBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbFxuXHRcdG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuXG5cdFx0QWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG5cdFx0YWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcblx0XHRyZXNwZWN0aXZlbHkuXG5cblx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cblx0XHRAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG5cdCMjI1xuXHRfY29uZmlndXJlRW5kcG9pbnRzOiAtPlxuXHRcdF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCkgLT5cblx0XHRcdGlmIG1ldGhvZCBpc250ICdvcHRpb25zJ1xuXHRcdFx0XHQjIENvbmZpZ3VyZSBhY2NlcHRhYmxlIHJvbGVzXG5cdFx0XHRcdGlmIG5vdCBAb3B0aW9ucz8ucm9sZVJlcXVpcmVkXG5cdFx0XHRcdFx0QG9wdGlvbnMucm9sZVJlcXVpcmVkID0gW11cblx0XHRcdFx0aWYgbm90IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuXHRcdFx0XHRcdGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdXG5cdFx0XHRcdGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24gZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBAb3B0aW9ucy5yb2xlUmVxdWlyZWRcblx0XHRcdFx0IyBNYWtlIGl0IGVhc2llciB0byBjaGVjayBpZiBubyByb2xlcyBhcmUgcmVxdWlyZWRcblx0XHRcdFx0aWYgXy5pc0VtcHR5IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuXHRcdFx0XHRcdGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IGZhbHNlXG5cblx0XHRcdFx0IyBDb25maWd1cmUgYXV0aCByZXF1aXJlbWVudFxuXHRcdFx0XHRpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWQgaXMgdW5kZWZpbmVkXG5cdFx0XHRcdFx0aWYgQG9wdGlvbnM/LmF1dGhSZXF1aXJlZCBvciBlbmRwb2ludC5yb2xlUmVxdWlyZWRcblx0XHRcdFx0XHRcdGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZVxuXG5cdFx0XHRcdGlmIEBvcHRpb25zPy5zcGFjZVJlcXVpcmVkXG5cdFx0XHRcdFx0ZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IEBvcHRpb25zLnNwYWNlUmVxdWlyZWRcblx0XHRcdFx0cmV0dXJuXG5cdFx0LCB0aGlzXG5cdFx0cmV0dXJuXG5cblxuXHQjIyNcblx0XHRBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG5cblx0XHRAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcblx0IyMjXG5cdF9jYWxsRW5kcG9pbnQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuXHRcdCMgQ2FsbCB0aGUgZW5kcG9pbnQgaWYgYXV0aGVudGljYXRpb24gZG9lc24ndCBmYWlsXG5cdFx0aWYgQF9hdXRoQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuXHRcdFx0aWYgQF9yb2xlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuXHRcdFx0XHRpZiBAX3NwYWNlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuXHRcdFx0XHRcdCNlbmRwb2ludC5hY3Rpb24uY2FsbCBlbmRwb2ludENvbnRleHRcblx0XHRcdFx0XHRpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uXG5cdFx0XHRcdFx0XHRpc1NpbXVsYXRpb246IHRydWUsXG5cdFx0XHRcdFx0XHR1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG5cdFx0XHRcdFx0XHRjb25uZWN0aW9uOiBudWxsLFxuXHRcdFx0XHRcdFx0cmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcblxuXHRcdFx0XHRcdHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZSBpbnZvY2F0aW9uLCAtPlxuXHRcdFx0XHRcdFx0cmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcblx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ31cblx0XHRcdGVsc2Vcblx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG5cdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLid9XG5cdFx0ZWxzZVxuXHRcdFx0c3RhdHVzQ29kZTogNDAxXG5cdFx0XHRib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ31cblxuXG5cdCMjI1xuXHRcdEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcblxuXHRcdE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3Jcblx0XHRpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcblx0XHRpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cblxuXHRcdEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2Vcblx0IyMjXG5cdF9hdXRoQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuXHRcdGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZFxuXHRcdFx0QF9hdXRoZW50aWNhdGUgZW5kcG9pbnRDb250ZXh0XG5cdFx0ZWxzZSB0cnVlXG5cblxuXHQjIyNcblx0XHRWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxuXG5cdFx0SWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuXG5cdFx0QHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG5cdCMjI1xuXHRfYXV0aGVudGljYXRlOiAoZW5kcG9pbnRDb250ZXh0KSAtPlxuXHRcdCMgR2V0IGF1dGggaW5mb1xuXHRcdGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxuXG5cdFx0IyBHZXQgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2Vcblx0XHRpZiBhdXRoPy51c2VySWQgYW5kIGF1dGg/LnRva2VuIGFuZCBub3QgYXV0aD8udXNlclxuXHRcdFx0dXNlclNlbGVjdG9yID0ge31cblx0XHRcdHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZFxuXHRcdFx0dXNlclNlbGVjdG9yW0BhcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW5cblx0XHRcdGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lIHVzZXJTZWxlY3RvclxuXG5cdFx0IyBBdHRhY2ggdGhlIHVzZXIgYW5kIHRoZWlyIElEIHRvIHRoZSBjb250ZXh0IGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuXHRcdGlmIGF1dGg/LnVzZXJcblx0XHRcdGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyXG5cdFx0XHRlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZFxuXHRcdFx0dHJ1ZVxuXHRcdGVsc2UgZmFsc2VcblxuXHQjIyNcblx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuXG5cdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuXG5cdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcblx0XHRcdFx0XHRcdCBlbmRwb2ludFxuXHQjIyNcblx0X3NwYWNlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuXHRcdGlmIGVuZHBvaW50LnNwYWNlUmVxdWlyZWRcblx0XHRcdGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxuXHRcdFx0aWYgYXV0aD8uc3BhY2VJZFxuXHRcdFx0XHRzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGgudXNlcklkLCBzcGFjZTphdXRoLnNwYWNlSWR9KS5jb3VudCgpXG5cdFx0XHRcdGlmIHNwYWNlX3VzZXJzX2NvdW50XG5cdFx0XHRcdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpXG5cdFx0XHRcdFx0IyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXG5cdFx0XHRcdFx0aWYgc3BhY2UgJiYgU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3BhY2UuX2lkKSBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpPj0wXG5cdFx0XHRcdFx0XHRlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZFxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIlxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0cmV0dXJuIHRydWVcblxuXHQjIyNcblx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuXG5cdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuXG5cdFx0QHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcblx0XHRcdFx0XHRcdCBlbmRwb2ludFxuXHQjIyNcblx0X3JvbGVBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG5cdFx0aWYgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG5cdFx0XHRpZiBfLmlzRW1wdHkgXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcylcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0dHJ1ZVxuXG5cblx0IyMjXG5cdFx0UmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3Rcblx0IyMjXG5cdF9yZXNwb25kOiAocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGU9MjAwLCBoZWFkZXJzPXt9KSAtPlxuXHRcdCMgT3ZlcnJpZGUgYW55IGRlZmF1bHQgaGVhZGVycyB0aGF0IGhhdmUgYmVlbiBwcm92aWRlZCAoa2V5cyBhcmUgbm9ybWFsaXplZCB0byBiZSBjYXNlIGluc2Vuc2l0aXZlKVxuXHRcdCMgVE9ETzogQ29uc2lkZXIgb25seSBsb3dlcmNhc2luZyB0aGUgaGVhZGVyIGtleXMgd2UgbmVlZCBub3JtYWxpemVkLCBsaWtlIENvbnRlbnQtVHlwZVxuXHRcdGRlZmF1bHRIZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIEBhcGkuX2NvbmZpZy5kZWZhdWx0SGVhZGVyc1xuXHRcdGhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgaGVhZGVyc1xuXHRcdGhlYWRlcnMgPSBfLmV4dGVuZCBkZWZhdWx0SGVhZGVycywgaGVhZGVyc1xuXG5cdFx0IyBQcmVwYXJlIEpTT04gYm9keSBmb3IgcmVzcG9uc2Ugd2hlbiBDb250ZW50LVR5cGUgaW5kaWNhdGVzIEpTT04gdHlwZVxuXHRcdGlmIGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSBpc250IG51bGxcblx0XHRcdGlmIEBhcGkuX2NvbmZpZy5wcmV0dHlKc29uXG5cdFx0XHRcdGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5LCB1bmRlZmluZWQsIDJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Ym9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHlcblxuXHRcdCMgU2VuZCByZXNwb25zZVxuXHRcdHNlbmRSZXNwb25zZSA9IC0+XG5cdFx0XHRyZXNwb25zZS53cml0ZUhlYWQgc3RhdHVzQ29kZSwgaGVhZGVyc1xuXHRcdFx0cmVzcG9uc2Uud3JpdGUgYm9keVxuXHRcdFx0cmVzcG9uc2UuZW5kKClcblx0XHRpZiBzdGF0dXNDb2RlIGluIFs0MDEsIDQwM11cblx0XHRcdCMgSGFja2VycyBjYW4gbWVhc3VyZSB0aGUgcmVzcG9uc2UgdGltZSB0byBkZXRlcm1pbmUgdGhpbmdzIGxpa2Ugd2hldGhlciB0aGUgNDAxIHJlc3BvbnNlIHdhc1xuXHRcdFx0IyBjYXVzZWQgYnkgYmFkIHVzZXIgaWQgdnMgYmFkIHBhc3N3b3JkLlxuXHRcdFx0IyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXG5cdFx0XHQjIERlbGF5IGJ5IGEgcmFuZG9tIGFtb3VudCB0byByZWR1Y2UgdGhlIGFiaWxpdHkgZm9yIGEgaGFja2VyIHRvIGRldGVybWluZSB0aGUgcmVzcG9uc2UgdGltZS5cblx0XHRcdCMgU2VlIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvQmxvY2tpbmdfQnJ1dGVfRm9yY2VfQXR0YWNrcyNGaW5kaW5nX090aGVyX0NvdW50ZXJtZWFzdXJlc1xuXHRcdFx0IyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xuXHRcdFx0bWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDBcblx0XHRcdHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKClcblx0XHRcdGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXG5cdFx0XHRNZXRlb3Iuc2V0VGltZW91dCBzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHNcblx0XHRlbHNlXG5cdFx0XHRzZW5kUmVzcG9uc2UoKVxuXG5cdCMjI1xuXHRcdFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2Vcblx0IyMjXG5cdF9sb3dlckNhc2VLZXlzOiAob2JqZWN0KSAtPlxuXHRcdF8uY2hhaW4gb2JqZWN0XG5cdFx0LnBhaXJzKClcblx0XHQubWFwIChhdHRyKSAtPlxuXHRcdFx0W2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cblx0XHQub2JqZWN0KClcblx0XHQudmFsdWUoKVxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICBcdFx0Q29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gIFx0XHRmdW5jdGlvblxuICBcbiAgXHRcdEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gIFx0XHRiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcbiAgXG4gIFx0XHRBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICBcdFx0ZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcbiAgXHRcdG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuICBcbiAgXHRcdEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICBcdFx0YWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgXHRcdHJlc3BlY3RpdmVseS5cbiAgXG4gIFx0XHRAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgXHRcdEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jb25maWd1cmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAobWV0aG9kICE9PSAnb3B0aW9ucycpIHtcbiAgICAgICAgaWYgKCEoKHJlZiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZi5yb2xlUmVxdWlyZWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQpO1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50LnJvbGVSZXF1aXJlZCkpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAoKChyZWYxID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMS5hdXRoUmVxdWlyZWQgOiB2b2lkIDApIHx8IGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgocmVmMiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjIuc3BhY2VSZXF1aXJlZCA6IHZvaWQgMCkge1xuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSB0aGlzLm9wdGlvbnMuc3BhY2VSZXF1aXJlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcbiAgXG4gIFx0XHRAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0T25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxuICBcdFx0aW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gIFx0XHRpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gIFx0XHRAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aEFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5hdXRoUmVxdWlyZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGUoZW5kcG9pbnRDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICBcdFx0SWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuICBcbiAgXHRcdEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCkge1xuICAgIHZhciBhdXRoLCB1c2VyU2VsZWN0b3I7XG4gICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICBpZiAoKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlcklkIDogdm9pZCAwKSAmJiAoYXV0aCAhPSBudWxsID8gYXV0aC50b2tlbiA6IHZvaWQgMCkgJiYgIShhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgICB1c2VyU2VsZWN0b3IgPSB7fTtcbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZDtcbiAgICAgIHVzZXJTZWxlY3Rvclt0aGlzLmFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlbjtcbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJTZWxlY3Rvcik7XG4gICAgfVxuICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApIHtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyO1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgXHRcdE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gIFx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICBcdFx0XHRcdFx0XHQgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKHNwYWNlICYmIFN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlLl9pZCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gIFx0XHRcdFx0XHRcdCBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3JvbGVBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICBpZiAoXy5pc0VtcHR5KF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzcG9uZCA9IGZ1bmN0aW9uKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzLCBkZWxheUluTWlsbGlzZWNvbmRzLCBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcywgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28sIHNlbmRSZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PSBudWxsKSB7XG4gICAgICBzdGF0dXNDb2RlID0gMjAwO1xuICAgIH1cbiAgICBpZiAoaGVhZGVycyA9PSBudWxsKSB7XG4gICAgICBoZWFkZXJzID0ge307XG4gICAgfVxuICAgIGRlZmF1bHRIZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyh0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyhoZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gXy5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuICAgIGlmIChoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFwaS5fY29uZmlnLnByZXR0eUpzb24pIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHksIHZvaWQgMCwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoYm9keSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZW5kKCk7XG4gICAgfTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxIHx8IHN0YXR1c0NvZGUgPT09IDQwMykge1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDA7XG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd287XG4gICAgICByZXR1cm4gTWV0ZW9yLnNldFRpbWVvdXQoc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblxuY2xhc3MgQE9kYXRhUmVzdGl2dXNcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0QF9yb3V0ZXMgPSBbXVxuXHRcdEBfY29uZmlnID1cblx0XHRcdHBhdGhzOiBbXVxuXHRcdFx0dXNlRGVmYXVsdEF1dGg6IGZhbHNlXG5cdFx0XHRhcGlQYXRoOiAnYXBpLydcblx0XHRcdHZlcnNpb246IG51bGxcblx0XHRcdHByZXR0eUpzb246IGZhbHNlXG5cdFx0XHRhdXRoOlxuXHRcdFx0XHR0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbidcblx0XHRcdFx0dXNlcjogLT5cblx0XHRcdFx0XHRjb29raWVzID0gbmV3IENvb2tpZXMoIEByZXF1ZXN0LCBAcmVzcG9uc2UgKVxuXHRcdFx0XHRcdHVzZXJJZCA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRcdFx0YXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblx0XHRcdFx0XHRzcGFjZUlkID0gQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IEB1cmxQYXJhbXNbJ3NwYWNlSWQnXVxuXHRcdFx0XHRcdGlmIGF1dGhUb2tlblxuXHRcdFx0XHRcdFx0dG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aFRva2VuXG5cdFx0XHRcdFx0aWYgQHJlcXVlc3QudXNlcklkXG5cdFx0XHRcdFx0XHRfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogQHJlcXVlc3QudXNlcklkfSlcblx0XHRcdFx0XHRcdHVzZXI6IF91c2VyXG5cdFx0XHRcdFx0XHR1c2VySWQ6IHVzZXJJZFxuXHRcdFx0XHRcdFx0c3BhY2VJZDogc3BhY2VJZFxuXHRcdFx0XHRcdFx0dG9rZW46IHRva2VuXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dXNlcklkOiB1c2VySWRcblx0XHRcdFx0XHRcdHNwYWNlSWQ6IHNwYWNlSWRcblx0XHRcdFx0XHRcdHRva2VuOiB0b2tlblxuXHRcdFx0ZGVmYXVsdEhlYWRlcnM6XG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdGVuYWJsZUNvcnM6IHRydWVcblxuXHRcdCMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXG5cdFx0Xy5leHRlbmQgQF9jb25maWcsIG9wdGlvbnNcblxuXHRcdGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcblx0XHRcdGNvcnNIZWFkZXJzID1cblx0XHRcdFx0J0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xuXHRcdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0LCBPRGF0YS1WZXJzaW9uJ1xuXG5cdFx0XHRpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxuXHRcdFx0XHRjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuLCBYLVNwYWNlLUlkJ1xuXG5cdFx0XHQjIFNldCBkZWZhdWx0IGhlYWRlciB0byBlbmFibGUgQ09SUyBpZiBjb25maWd1cmVkXG5cdFx0XHRfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcblxuXHRcdFx0aWYgbm90IEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcblx0XHRcdFx0QF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XG5cdFx0XHRcdFx0QHJlc3BvbnNlLndyaXRlSGVhZCAyMDAsIGNvcnNIZWFkZXJzXG5cdFx0XHRcdFx0QGRvbmUoKVxuXG5cdFx0IyBOb3JtYWxpemUgdGhlIEFQSSBwYXRoXG5cdFx0aWYgQF9jb25maWcuYXBpUGF0aFswXSBpcyAnLydcblx0XHRcdEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcblx0XHRpZiBfLmxhc3QoQF9jb25maWcuYXBpUGF0aCkgaXNudCAnLydcblx0XHRcdEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoICsgJy8nXG5cblx0XHQjIFVSTCBwYXRoIHZlcnNpb25pbmcgaXMgdGhlIG9ubHkgdHlwZSBvZiBBUEkgdmVyc2lvbmluZyBjdXJyZW50bHkgYXZhaWxhYmxlLCBzbyBpZiBhIHZlcnNpb24gaXNcblx0XHQjIHByb3ZpZGVkLCBhcHBlbmQgaXQgdG8gdGhlIGJhc2UgcGF0aCBvZiB0aGUgQVBJXG5cdFx0aWYgQF9jb25maWcudmVyc2lvblxuXHRcdFx0QF9jb25maWcuYXBpUGF0aCArPSBAX2NvbmZpZy52ZXJzaW9uICsgJy8nXG5cblx0XHQjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxuXHRcdGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG5cdFx0XHRAX2luaXRBdXRoKClcblx0XHRlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcblx0XHRcdEBfaW5pdEF1dGgoKVxuXHRcdFx0Y29uc29sZS53YXJuICdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgK1xuXHRcdFx0XHRcdCdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcblxuXHRcdHJldHVybiB0aGlzXG5cblxuXHQjIyMqXG5cdFx0QWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuXG5cdFx0QHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuXHRcdEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuXHRcdEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcblx0XHRAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcblx0XHRAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG5cdFx0QHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuXHRcdFx0XHRjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG5cdFx0XHRcdGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cblx0IyMjXG5cdGFkZFJvdXRlOiAocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSAtPlxuXHRcdCMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXG5cdFx0cm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKVxuXHRcdEBfcm91dGVzLnB1c2gocm91dGUpXG5cblx0XHRyb3V0ZS5hZGRUb0FwaSgpXG5cblx0XHRyZXR1cm4gdGhpc1xuXG5cblx0IyMjKlxuXHRcdEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcblx0IyMjXG5cdGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxuXHRcdG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ11cblx0XHRtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddXG5cblx0XHQjIEdyYWIgdGhlIHNldCBvZiBlbmRwb2ludHNcblx0XHRpZiBjb2xsZWN0aW9uIGlzIE1ldGVvci51c2Vyc1xuXHRcdFx0Y29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcblx0XHRlbHNlXG5cdFx0XHRjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF9jb2xsZWN0aW9uRW5kcG9pbnRzXG5cblx0XHQjIEZsYXR0ZW4gdGhlIG9wdGlvbnMgYW5kIHNldCBkZWZhdWx0cyBpZiBuZWNlc3Nhcnlcblx0XHRlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyBvciB7fVxuXHRcdHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XG5cdFx0ZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIG9yIFtdXG5cdFx0IyBVc2UgY29sbGVjdGlvbiBuYW1lIGFzIGRlZmF1bHQgcGF0aFxuXHRcdHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxuXG5cdFx0IyBTZXBhcmF0ZSB0aGUgcmVxdWVzdGVkIGVuZHBvaW50cyBieSB0aGUgcm91dGUgdGhleSBiZWxvbmcgdG8gKG9uZSBmb3Igb3BlcmF0aW5nIG9uIHRoZSBlbnRpcmVcblx0XHQjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXG5cdFx0Y29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge31cblx0XHRlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9XG5cdFx0aWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcblx0XHRcdCMgR2VuZXJhdGUgYWxsIGVuZHBvaW50cyBvbiB0aGlzIGNvbGxlY3Rpb25cblx0XHRcdF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHQjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcblx0XHRcdFx0aWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cblx0XHRcdFx0XHRfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG5cdFx0XHRcdGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0LCB0aGlzXG5cdFx0ZWxzZVxuXHRcdFx0IyBHZW5lcmF0ZSBhbnkgZW5kcG9pbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZXhjbHVkZWRcblx0XHRcdF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHRpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXG5cdFx0XHRcdFx0IyBDb25maWd1cmUgZW5kcG9pbnQgYW5kIG1hcCB0byBpdCdzIGh0dHAgbWV0aG9kXG5cdFx0XHRcdFx0IyBUT0RPOiBDb25zaWRlciBwcmVkZWZpbmluZyBhIG1hcCBvZiBtZXRob2RzIHRvIHRoZWlyIGh0dHAgbWV0aG9kIHR5cGUgKGUuZy4sIGdldEFsbDogZ2V0KVxuXHRcdFx0XHRcdGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXG5cdFx0XHRcdFx0Y29uZmlndXJlZEVuZHBvaW50ID0ge31cblx0XHRcdFx0XHRfLmVhY2ggY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIChhY3Rpb24sIG1ldGhvZFR5cGUpIC0+XG5cdFx0XHRcdFx0XHRjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxuXHRcdFx0XHRcdFx0XHRfLmNoYWluIGFjdGlvblxuXHRcdFx0XHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHRcdFx0XHQuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xuXHRcdFx0XHRcdFx0XHQudmFsdWUoKVxuXHRcdFx0XHRcdCMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuXHRcdFx0XHRcdGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXG5cdFx0XHRcdFx0XHRfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuXHRcdFx0XHRcdGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0LCB0aGlzXG5cblx0XHQjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcblx0XHRAYWRkUm91dGUgcGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHNcblx0XHRAYWRkUm91dGUgXCIje3BhdGh9LzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzXG5cblx0XHRyZXR1cm4gdGhpc1xuXG5cblx0IyMjKlxuXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuXHQjIyNcblx0X2NvbGxlY3Rpb25FbmRwb2ludHM6XG5cdFx0Z2V0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRcdHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXG5cdFx0XHRcdFx0aWYgZW50aXR5XG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cblx0XHRwdXQ6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0cHV0OlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcblx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcblx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cblx0XHRkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0ZGVsZXRlOlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cblx0XHRwb3N0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdHBvc3Q6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuXHRcdFx0XHRcdGlmIGVudGl0eVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRnZXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRzZWxlY3RvciA9IHt9XG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXG5cdFx0XHRcdFx0aWYgZW50aXRpZXNcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cblxuXG5cdCMjIypcblx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG5cdCMjI1xuXHRfdXNlckNvbGxlY3Rpb25FbmRwb2ludHM6XG5cdFx0Z2V0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcblx0XHRcdFx0XHRpZiBlbnRpdHlcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuXHRcdHB1dDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRwdXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxuXHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuXHRcdFx0XHRcdFx0e3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cblx0XHRkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0ZGVsZXRlOlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0aWYgY29sbGVjdGlvbi5yZW1vdmUgQHVybFBhcmFtcy5pZFxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cblx0XHRwb3N0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdHBvc3Q6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHQjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcblx0XHRcdFx0XHRlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIgQGJvZHlQYXJhbXNcblx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWQsIGZpZWxkczogcHJvZmlsZTogMVxuXHRcdFx0XHRcdGlmIGVudGl0eVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnfVxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRnZXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXG5cdFx0XHRcdFx0aWYgZW50aXRpZXNcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnfVxuXG5cblx0IyMjXG5cdFx0QWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuXHQjIyNcblx0X2luaXRBdXRoOiAtPlxuXHRcdHNlbGYgPSB0aGlzXG5cdFx0IyMjXG5cdFx0XHRBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG5cblx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG5cdFx0XHRhZGRpbmcgaG9vaykuXG5cdFx0IyMjXG5cdFx0QGFkZFJvdXRlICdsb2dpbicsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSxcblx0XHRcdHBvc3Q6IC0+XG5cdFx0XHRcdCMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcblx0XHRcdFx0dXNlciA9IHt9XG5cdFx0XHRcdGlmIEBib2R5UGFyYW1zLnVzZXJcblx0XHRcdFx0XHRpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxuXHRcdFx0XHRcdFx0dXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxuXHRcdFx0XHRlbHNlIGlmIEBib2R5UGFyYW1zLnVzZXJuYW1lXG5cdFx0XHRcdFx0dXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJuYW1lXG5cdFx0XHRcdGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcblx0XHRcdFx0XHR1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMuZW1haWxcblxuXHRcdFx0XHQjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0YXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQgdXNlciwgQGJvZHlQYXJhbXMucGFzc3dvcmRcblx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZVxuXHRcdFx0XHRcdHJldHVybiB7fSA9XG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiBlLmVycm9yXG5cdFx0XHRcdFx0XHRib2R5OiBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6IGUucmVhc29uXG5cblx0XHRcdFx0IyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxuXHRcdFx0XHQjIFRPRE86IENvbnNpZGVyIHJldHVybmluZyB0aGUgdXNlciBpbiBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKCksIGluc3RlYWQgb2YgZmV0Y2hpbmcgaXQgYWdhaW4gaGVyZVxuXHRcdFx0XHRpZiBhdXRoLnVzZXJJZCBhbmQgYXV0aC5hdXRoVG9rZW5cblx0XHRcdFx0XHRzZWFyY2hRdWVyeSA9IHt9XG5cdFx0XHRcdFx0c2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGguYXV0aFRva2VuXG5cdFx0XHRcdFx0QHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRcdFx0J19pZCc6IGF1dGgudXNlcklkXG5cdFx0XHRcdFx0XHRzZWFyY2hRdWVyeVxuXHRcdFx0XHRcdEB1c2VySWQgPSBAdXNlcj8uX2lkXG5cblx0XHRcdFx0cmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGF1dGh9XG5cblx0XHRcdFx0IyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuXHRcdFx0XHRleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbj8uY2FsbCh0aGlzKVxuXHRcdFx0XHRpZiBleHRyYURhdGE/XG5cdFx0XHRcdFx0Xy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG5cdFx0XHRcdHJlc3BvbnNlXG5cblx0XHRsb2dvdXQgPSAtPlxuXHRcdFx0IyBSZW1vdmUgdGhlIGdpdmVuIGF1dGggdG9rZW4gZnJvbSB0aGUgdXNlcidzIGFjY291bnRcblx0XHRcdGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cblx0XHRcdHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlblxuXHRcdFx0aW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xuXHRcdFx0dG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgMCwgaW5kZXhcblx0XHRcdHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgaW5kZXggKyAxXG5cdFx0XHR0b2tlblRvUmVtb3ZlID0ge31cblx0XHRcdHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW5cblx0XHRcdHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge31cblx0XHRcdHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXG5cdFx0XHRNZXRlb3IudXNlcnMudXBkYXRlIEB1c2VyLl9pZCwgeyRwdWxsOiB0b2tlblJlbW92YWxRdWVyeX1cblxuXHRcdFx0cmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxuXG5cdFx0XHQjIENhbGwgdGhlIGxvZ291dCBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuXHRcdFx0ZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXG5cdFx0XHRpZiBleHRyYURhdGE/XG5cdFx0XHRcdF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcblxuXHRcdFx0cmVzcG9uc2VcblxuXHRcdCMjI1xuXHRcdFx0QWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcblxuXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuXHRcdFx0YWRkaW5nIGhvb2spLlxuXHRcdCMjI1xuXHRcdEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXG5cdFx0XHRnZXQ6IC0+XG5cdFx0XHRcdGNvbnNvbGUud2FybiBcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXG5cdFx0XHRcdHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKVxuXHRcdFx0cG9zdDogbG9nb3V0XG5cbk9kYXRhUmVzdGl2dXMgPSBAT2RhdGFSZXN0aXZ1c1xuIiwidmFyIENvb2tpZXMsIE9kYXRhUmVzdGl2dXMsIGJhc2ljQXV0aCxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG5iYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxudGhpcy5PZGF0YVJlc3RpdnVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBPZGF0YVJlc3RpdnVzKG9wdGlvbnMpIHtcbiAgICB2YXIgY29yc0hlYWRlcnM7XG4gICAgdGhpcy5fcm91dGVzID0gW107XG4gICAgdGhpcy5fY29uZmlnID0ge1xuICAgICAgcGF0aHM6IFtdLFxuICAgICAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlLFxuICAgICAgYXBpUGF0aDogJ2FwaS8nLFxuICAgICAgdmVyc2lvbjogbnVsbCxcbiAgICAgIHByZXR0eUpzb246IGZhbHNlLFxuICAgICAgYXV0aDoge1xuICAgICAgICB0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbicsXG4gICAgICAgIHVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfdXNlciwgYXV0aFRva2VuLCBjb29raWVzLCBzcGFjZUlkLCB0b2tlbiwgdXNlcklkO1xuICAgICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyh0aGlzLnJlcXVlc3QsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIHVzZXJJZCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgICAgICAgc3BhY2VJZCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgdGhpcy51cmxQYXJhbXNbJ3NwYWNlSWQnXTtcbiAgICAgICAgICBpZiAoYXV0aFRva2VuKSB7XG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnVzZXJJZCkge1xuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXI6IF91c2VyLFxuICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgc3BhY2VJZDogc3BhY2VJZCxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgc3BhY2VJZDogc3BhY2VJZCxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXG4gICAgfTtcbiAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcsIG9wdGlvbnMpO1xuICAgIGlmICh0aGlzLl9jb25maWcuZW5hYmxlQ29ycykge1xuICAgICAgY29yc0hlYWRlcnMgPSB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQsIE9EYXRhLVZlcnNpb24nXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuLCBYLVNwYWNlLUlkJztcbiAgICAgIH1cbiAgICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnMpO1xuICAgICAgaWYgKCF0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgY29yc0hlYWRlcnMpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hcGlQYXRoWzBdID09PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGguc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChfLmxhc3QodGhpcy5fY29uZmlnLmFwaVBhdGgpICE9PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGggKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmVyc2lvbikge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggKz0gdGhpcy5fY29uZmlnLnZlcnNpb24gKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jb25maWcudXNlQXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICsgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgXHRcdEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcbiAgXG4gIFx0XHRAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG4gIFx0XHRAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgXHRcdEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgXHRcdEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICBcdFx0QHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxuICBcdFx0QHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICBcdFx0XHRcdGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcbiAgXHRcdFx0XHRhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLmFkZFJvdXRlID0gZnVuY3Rpb24ocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSB7XG4gICAgdmFyIHJvdXRlO1xuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cyk7XG4gICAgdGhpcy5fcm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJvdXRlLmFkZFRvQXBpKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgXHRcdEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuYWRkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbkVuZHBvaW50cywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24sIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kcywgbWV0aG9kc09uQ29sbGVjdGlvbiwgcGF0aCwgcm91dGVPcHRpb25zO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXTtcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddO1xuICAgIGlmIChjb2xsZWN0aW9uID09PSBNZXRlb3IudXNlcnMpIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX2NvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIHx8IHt9O1xuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIHx8IHt9O1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyB8fCBbXTtcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIHx8IGNvbGxlY3Rpb24uX25hbWU7XG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgJiYgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKSkge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBjb25maWd1cmVkRW5kcG9pbnQsIGVuZHBvaW50T3B0aW9ucztcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kKSA8IDAgJiYgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF07XG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge307XG4gICAgICAgICAgXy5lYWNoKGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCBmdW5jdGlvbihhY3Rpb24sIG1ldGhvZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPSBfLmNoYWluKGFjdGlvbikuY2xvbmUoKS5leHRlbmQoZW5kcG9pbnRPcHRpb25zKS52YWx1ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIHRoaXMuYWRkUm91dGUocGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMpO1xuICAgIHRoaXMuYWRkUm91dGUocGF0aCArIFwiLzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICBcdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLl9jb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIHtcbiAgICAgICAgICAgICAgJHNldDogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZShzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICB0aGlzLmJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0KHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcywgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQ7XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUodGhpcy51cmxQYXJhbXMuaWQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzO1xuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2VycydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLl9pbml0QXV0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dvdXQsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAvKlxuICAgIFx0XHRcdEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICBcdFx0XHRBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgIFx0XHRcdGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICB0aGlzLmFkZFJvdXRlKCdsb2dpbicsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBwb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF1dGgsIGUsIGV4dHJhRGF0YSwgcmVmLCByZWYxLCByZXNwb25zZSwgc2VhcmNoUXVlcnksIHVzZXI7XG4gICAgICAgIHVzZXIgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWUpIHtcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy5lbWFpbCkge1xuICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMuZW1haWw7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCh1c2VyLCB0aGlzLmJvZHlQYXJhbXMucGFzc3dvcmQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGUucmVhc29uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXV0aC51c2VySWQgJiYgYXV0aC5hdXRoVG9rZW4pIHtcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoLmF1dGhUb2tlbik7XG4gICAgICAgICAgdGhpcy51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgfSwgc2VhcmNoUXVlcnkpO1xuICAgICAgICAgIHRoaXMudXNlcklkID0gKHJlZiA9IHRoaXMudXNlcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgZGF0YTogYXV0aFxuICAgICAgICB9O1xuICAgICAgICBleHRyYURhdGEgPSAocmVmMSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluKSAhPSBudWxsID8gcmVmMS5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhUb2tlbiwgZXh0cmFEYXRhLCBoYXNoZWRUb2tlbiwgaW5kZXgsIHJlZiwgcmVzcG9uc2UsIHRva2VuRmllbGROYW1lLCB0b2tlbkxvY2F0aW9uLCB0b2tlblBhdGgsIHRva2VuUmVtb3ZhbFF1ZXJ5LCB0b2tlblRvUmVtb3ZlO1xuICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddO1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlbjtcbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9O1xuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlbjtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge307XG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZTtcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodGhpcy51c2VyLl9pZCwge1xuICAgICAgICAkcHVsbDogdG9rZW5SZW1vdmFsUXVlcnlcbiAgICAgIH0pO1xuICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBleHRyYURhdGEgPSAocmVmID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0KSAhPSBudWxsID8gcmVmLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdFx0QWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICBcdFx0XHRBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgXHRcdFx0YWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLmFkZFJvdXRlKCdsb2dvdXQnLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWVcbiAgICB9LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiKTtcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHBvc3Q6IGxvZ291dFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBPZGF0YVJlc3RpdnVzO1xuXG59KSgpO1xuXG5PZGF0YVJlc3RpdnVzID0gdGhpcy5PZGF0YVJlc3RpdnVzO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblxuXHRnZXRPYmplY3RzID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWVzKS0+XG5cdFx0ZGF0YSA9IHt9XG5cdFx0b2JqZWN0X25hbWVzLnNwbGl0KCcsJykuZm9yRWFjaCAob2JqZWN0X25hbWUpLT5cblx0XHRcdG9iamVjdCA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdFx0ZGF0YVtvYmplY3QubmFtZV0gPSBvYmplY3Rcblx0XHRyZXR1cm4gZGF0YTtcblxuXHRnZXRPYmplY3QgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxuXHRcdGRhdGEgPSBfLmNsb25lKENyZWF0b3IuT2JqZWN0c1tDcmVhdG9yLmdldE9iamVjdE5hbWUoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKV0pXG5cdFx0aWYgIWRhdGFcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuaXoOaViOeahGlkICN7b2JqZWN0X25hbWV9XCIpXG5cblx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkuZmV0Y2goKVxuXHRcdHBzZXRzID0geyBwc2V0c0FkbWluLCBwc2V0c1VzZXIsIHBzZXRzQ3VycmVudCB9XG5cblx0XHRvYmplY3RfcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cblx0XHRkZWxldGUgZGF0YS5saXN0X3ZpZXdzXG5cdFx0ZGVsZXRlIGRhdGEucGVybWlzc2lvbl9zZXRcblxuXHRcdGlmIG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd1JlYWRcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdFx0ZGF0YS5hbGxvd0VkaXQgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dFZGl0XG5cdFx0XHRkYXRhLmFsbG93RGVsZXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93RGVsZXRlXG5cdFx0XHRkYXRhLmFsbG93Q3JlYXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0XHRkYXRhLm1vZGlmeUFsbFJlY29yZHMgPSBvYmplY3RfcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xuXG5cdFx0XHRmaWVsZHMgPSB7fVxuXHRcdFx0Xy5mb3JFYWNoIGRhdGEuZmllbGRzLCAoZmllbGQsIGtleSktPlxuXHRcdFx0XHRfZmllbGQgPSBfLmNsb25lKGZpZWxkKVxuXG5cdFx0XHRcdGlmICFfZmllbGQubmFtZVxuXHRcdFx0XHRcdF9maWVsZC5uYW1lID0ga2V5XG5cblx0XHRcdFx0I+WwhuS4jeWPr+e8lui+keeahOWtl+auteiuvue9ruS4unJlYWRvbmx5ID0gdHJ1ZVxuXHRcdFx0XHRpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpID4gLTEpXG5cdFx0XHRcdFx0X2ZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0XHRcdCPkuI3ov5Tlm57kuI3lj6/op4HlrZfmrrVcblx0XHRcdFx0aWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA8IDApXG5cdFx0XHRcdFx0ZmllbGRzW2tleV0gPSBfZmllbGRcblxuXHRcdFx0ZGF0YS5maWVsZHMgPSBmaWVsZHNcblxuXHRcdGVsc2Vcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gZmFsc2VcblxuXHRcdHJldHVybiBkYXRhXG5cblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsIFN0ZWVkb3NPRGF0YS5BUElfUEFUSCArICcvb2JqZWN0cy86aWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdFx0dHJ5XG5cdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuXHRcdFx0aWYgIXVzZXJJZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXG5cblx0XHRcdHNwYWNlSWQgPSByZXEucGFyYW1zPy5zcGFjZUlkXG5cdFx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJNaXNzIHNwYWNlSWRcIilcblxuXHRcdFx0b2JqZWN0X25hbWUgPSByZXEucGFyYW1zPy5pZFxuXHRcdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3MgaWRcIilcblxuXHRcdFx0X29iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZE9uZSh7X2lkOiBvYmplY3RfbmFtZX0pXG5cblx0XHRcdGlmIF9vYmogJiYgX29iai5uYW1lXG5cdFx0XHRcdG9iamVjdF9uYW1lID0gX29iai5uYW1lXG5cblx0XHRcdGlmIG9iamVjdF9uYW1lLnNwbGl0KCcsJykubGVuZ3RoID4gMVxuXHRcdFx0XHRkYXRhID0gZ2V0T2JqZWN0cyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkYXRhID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogMjAwLFxuXHRcdFx0XHRkYXRhOiBkYXRhIHx8IHt9XG5cdFx0XHR9XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cblx0XHRcdH0iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGdldE9iamVjdCwgZ2V0T2JqZWN0cztcbiAgZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWVzKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHt9O1xuICAgIG9iamVjdF9uYW1lcy5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBvYmplY3Q7XG4gICAgICBvYmplY3QgPSBnZXRPYmplY3Qoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICByZXR1cm4gZGF0YVtvYmplY3QubmFtZV0gPSBvYmplY3Q7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG4gIGdldE9iamVjdCA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgZGF0YSwgZmllbGRzLCBvYmplY3RfcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1cnJlbnQsIHBzZXRzVXNlcjtcbiAgICBkYXRhID0gXy5jbG9uZShDcmVhdG9yLk9iamVjdHNbQ3JlYXRvci5nZXRPYmplY3ROYW1lKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSldKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuaXoOaViOeahGlkIFwiICsgb2JqZWN0X25hbWUpO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnRcbiAgICB9O1xuICAgIG9iamVjdF9wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgZGVsZXRlIGRhdGEubGlzdF92aWV3cztcbiAgICBkZWxldGUgZGF0YS5wZXJtaXNzaW9uX3NldDtcbiAgICBpZiAob2JqZWN0X3Blcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgICAgZGF0YS5hbGxvd1JlYWQgPSB0cnVlO1xuICAgICAgZGF0YS5hbGxvd0VkaXQgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dFZGl0O1xuICAgICAgZGF0YS5hbGxvd0RlbGV0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZTtcbiAgICAgIGRhdGEuYWxsb3dDcmVhdGUgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dDcmVhdGU7XG4gICAgICBkYXRhLm1vZGlmeUFsbFJlY29yZHMgPSBvYmplY3RfcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgIGZpZWxkcyA9IHt9O1xuICAgICAgXy5mb3JFYWNoKGRhdGEuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgICAgIHZhciBfZmllbGQ7XG4gICAgICAgIF9maWVsZCA9IF8uY2xvbmUoZmllbGQpO1xuICAgICAgICBpZiAoIV9maWVsZC5uYW1lKSB7XG4gICAgICAgICAgX2ZpZWxkLm5hbWUgPSBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA+IC0xKSB7XG4gICAgICAgICAgX2ZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpIDwgMCkge1xuICAgICAgICAgIHJldHVybiBmaWVsZHNba2V5XSA9IF9maWVsZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYXRhLmZpZWxkcyA9IGZpZWxkcztcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgU3RlZWRvc09EYXRhLkFQSV9QQVRIICsgJy9vYmplY3RzLzppZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIF9vYmosIGRhdGEsIGUsIG9iamVjdF9uYW1lLCByZWYsIHJlZjEsIHNwYWNlSWQsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgICB9XG4gICAgICBzcGFjZUlkID0gKHJlZiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMDtcbiAgICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJNaXNzIHNwYWNlSWRcIik7XG4gICAgICB9XG4gICAgICBvYmplY3RfbmFtZSA9IChyZWYxID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZjEuaWQgOiB2b2lkIDA7XG4gICAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3MgaWRcIik7XG4gICAgICB9XG4gICAgICBfb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgICAgX2lkOiBvYmplY3RfbmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoX29iaiAmJiBfb2JqLm5hbWUpIHtcbiAgICAgICAgb2JqZWN0X25hbWUgPSBfb2JqLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAob2JqZWN0X25hbWUuc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XG4gICAgICAgIGRhdGEgPSBnZXRPYmplY3RzKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YSA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YTogZGF0YSB8fCB7fVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiBlLmVycm9yIHx8IDUwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1ldGVvck9EYXRhUm91dGVyID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpLk1ldGVvck9EYXRhUm91dGVyO1xuXHRPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5PRGF0YVJvdXRlclxuXHRleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuXHRhcHAgPSBleHByZXNzKCk7XG5cdGFwcC51c2UoJy9hcGkvb2RhdGEvdjQnLCBNZXRlb3JPRGF0YVJvdXRlcik7XG5cdE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuTWV0ZW9yT0RhdGFBUElWNFJvdXRlcjtcblx0aWYgTWV0ZW9yT0RhdGFBUElWNFJvdXRlclxuXHRcdGFwcC51c2UoJy9hcGkvdjQnLCBNZXRlb3JPRGF0YUFQSVY0Um91dGVyKVxuXHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShhcHApO1xuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKS0+XG5cdFx0aWYobmFtZSAhPSAnZGVmYXVsdCcpXG5cdFx0XHRvdGhlckFwcCA9IGV4cHJlc3MoKTtcblx0XHRcdG90aGVyQXBwLnVzZShcIi9hcGkvb2RhdGEvI3tuYW1lfVwiLCBPRGF0YVJvdXRlcik7XG5cdFx0XHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShvdGhlckFwcCk7XG5cbiMgXHRvZGF0YVY0TW9uZ29kYiA9IHJlcXVpcmUgJ29kYXRhLXY0LW1vbmdvZGInXG4jIFx0cXVlcnlzdHJpbmcgPSByZXF1aXJlICdxdWVyeXN0cmluZydcblxuIyBcdGhhbmRsZUVycm9yID0gKGUpLT5cbiMgXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuIyBcdFx0Ym9keSA9IHt9XG4jIFx0XHRlcnJvciA9IHt9XG4jIFx0XHRlcnJvclsnbWVzc2FnZSddID0gZS5tZXNzYWdlXG4jIFx0XHRzdGF0dXNDb2RlID0gNTAwXG4jIFx0XHRpZiBlLmVycm9yIGFuZCBfLmlzTnVtYmVyKGUuZXJyb3IpXG4jIFx0XHRcdHN0YXR1c0NvZGUgPSBlLmVycm9yXG4jIFx0XHRlcnJvclsnY29kZSddID0gc3RhdHVzQ29kZVxuIyBcdFx0ZXJyb3JbJ2Vycm9yJ10gPSBzdGF0dXNDb2RlXG4jIFx0XHRlcnJvclsnZGV0YWlscyddID0gZS5kZXRhaWxzXG4jIFx0XHRlcnJvclsncmVhc29uJ10gPSBlLnJlYXNvblxuIyBcdFx0Ym9keVsnZXJyb3InXSA9IGVycm9yXG4jIFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRzdGF0dXNDb2RlOiBzdGF0dXNDb2RlXG4jIFx0XHRcdGJvZHk6Ym9keVxuIyBcdFx0fVxuXG4jIFx0dmlzaXRvclBhcnNlciA9ICh2aXNpdG9yKS0+XG4jIFx0XHRwYXJzZWRPcHQgPSB7fVxuIyBcdFx0aWYgdmlzaXRvci5wcm9qZWN0aW9uXG4jIFx0XHRcdHBhcnNlZE9wdC5maWVsZHMgPSB2aXNpdG9yLnByb2plY3Rpb25cbiMgXHRcdGlmIHZpc2l0b3IuaGFzT3duUHJvcGVydHkoJ2xpbWl0JylcbiMgXHRcdFx0cGFyc2VkT3B0LmxpbWl0ID0gdmlzaXRvci5saW1pdFxuXG4jIFx0XHRpZiB2aXNpdG9yLmhhc093blByb3BlcnR5KCdza2lwJylcbiMgXHRcdFx0cGFyc2VkT3B0LnNraXAgPSB2aXNpdG9yLnNraXBcblxuIyBcdFx0aWYgdmlzaXRvci5zb3J0XG4jIFx0XHRcdHBhcnNlZE9wdC5zb3J0ID0gdmlzaXRvci5zb3J0XG5cbiMgXHRcdHBhcnNlZE9wdFxuIyBcdGRlYWxXaXRoRXhwYW5kID0gKGNyZWF0ZVF1ZXJ5LCBlbnRpdGllcywga2V5LCBzcGFjZUlkKS0+XG4jIFx0XHRpZiBfLmlzRW1wdHkgY3JlYXRlUXVlcnkuaW5jbHVkZXNcbiMgXHRcdFx0cmV0dXJuXG5cbiMgXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZClcbiMgXHRcdF8uZWFjaCBjcmVhdGVRdWVyeS5pbmNsdWRlcywgKGluY2x1ZGUpLT5cbiMgXHRcdFx0IyBjb25zb2xlLmxvZyAnaW5jbHVkZTogJywgaW5jbHVkZVxuIyBcdFx0XHRuYXZpZ2F0aW9uUHJvcGVydHkgPSBpbmNsdWRlLm5hdmlnYXRpb25Qcm9wZXJ0eVxuIyBcdFx0XHQjIGNvbnNvbGUubG9nICduYXZpZ2F0aW9uUHJvcGVydHk6ICcsIG5hdmlnYXRpb25Qcm9wZXJ0eVxuIyBcdFx0XHRmaWVsZCA9IG9iai5maWVsZHNbbmF2aWdhdGlvblByb3BlcnR5XVxuIyBcdFx0XHRpZiBmaWVsZCBhbmQgKGZpZWxkLnR5cGUgaXMgJ2xvb2t1cCcgb3IgZmllbGQudHlwZSBpcyAnbWFzdGVyX2RldGFpbCcpXG4jIFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bylcbiMgXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpXG4jIFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXG4jIFx0XHRcdFx0XHRxdWVyeU9wdGlvbnMgPSB2aXNpdG9yUGFyc2VyKGluY2x1ZGUpXG4jIFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nIGZpZWxkLnJlZmVyZW5jZV90b1xuIyBcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxuIyBcdFx0XHRcdFx0XHRfcm9fTkFNRV9GSUVMRF9LRVkgPSBDcmVhdG9yLmdldE9iamVjdChmaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpPy5OQU1FX0ZJRUxEX0tFWVxuIyBcdFx0XHRcdFx0XHRfLmVhY2ggZW50aXRpZXMsIChlbnRpdHksIGlkeCktPlxuIyBcdFx0XHRcdFx0XHRcdGlmIGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldXG4jIFx0XHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbERhdGEgPSBfLmNsb25lKGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRtdWx0aVF1ZXJ5ID0gXy5leHRlbmQge19pZDogeyRpbjogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV19fSwgaW5jbHVkZS5xdWVyeVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uZmluZChtdWx0aVF1ZXJ5LCBxdWVyeU9wdGlvbnMpLmZldGNoKClcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgIWVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XS5sZW5ndGhcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBvcmlnaW5hbERhdGFcbiMgXHRcdFx0XHRcdFx0XHRcdFx0I+aOkuW6j1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBDcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyhlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0sIG9yaWdpbmFsRGF0YSlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldID0gXy5tYXAgZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldLCAobyktPlxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRvWydyZWZlcmVuY2VfdG8uX28nXSA9IGZpZWxkLnJlZmVyZW5jZV90b1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdG9bJ19OQU1FX0ZJRUxEX1ZBTFVFJ10gPSBvW19yb19OQU1FX0ZJRUxEX0tFWV1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb1xuIyBcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRzaW5nbGVRdWVyeSA9IF8uZXh0ZW5kIHtfaWQ6IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldfSwgaW5jbHVkZS5xdWVyeVxuXG4jIFx0XHRcdFx0XHRcdFx0XHRcdCMg54m55q6K5aSE55CG5Zyo55u45YWz6KGo5Lit5rKh5pyJ5om+5Yiw5pWw5o2u55qE5oOF5Ya177yM6L+U5Zue5Y6f5pWw5o2uXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XSA9IHJlZmVyZW5jZVRvQ29sbGVjdGlvbi5maW5kT25lKHNpbmdsZVF1ZXJ5LCBxdWVyeU9wdGlvbnMpIHx8IGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ3JlZmVyZW5jZV90by5vJ10gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uX25hbWVcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ3JlZmVyZW5jZV90by5fbyddID0gZmllbGQucmVmZXJlbmNlX3RvXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydfTkFNRV9GSUVMRF9WQUxVRSddID0gZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldW19yb19OQU1FX0ZJRUxEX0tFWV1cbiMgXHRcdFx0XHRcdGlmIF8uaXNBcnJheSBmaWVsZC5yZWZlcmVuY2VfdG9cbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIGVudGl0aWVzLCAoZW50aXR5LCBpZHgpLT5cbiMgXHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlbbmF2aWdhdGlvblByb3BlcnR5XT8uaWRzXG4jIFx0XHRcdFx0XHRcdFx0XHRfbyA9IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLm9cbiMgXHRcdFx0XHRcdFx0XHRcdF9yb19OQU1FX0ZJRUxEX0tFWSA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vLCBzcGFjZUlkKT8uTkFNRV9GSUVMRF9LRVlcbiMgXHRcdFx0XHRcdFx0XHRcdGlmIHF1ZXJ5T3B0aW9ucz8uZmllbGRzICYmIF9yb19OQU1FX0ZJRUxEX0tFWVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRxdWVyeU9wdGlvbnMuZmllbGRzW19yb19OQU1FX0ZJRUxEX0tFWV0gPSAxXG4jIFx0XHRcdFx0XHRcdFx0XHRyZWZlcmVuY2VUb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0ubywgc3BhY2VJZClcbiMgXHRcdFx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZVRvQ29sbGVjdGlvblxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdF9pZHMgPSBfLmNsb25lKGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLmlkcylcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRtdWx0aVF1ZXJ5ID0gXy5leHRlbmQge19pZDogeyRpbjogZW50aXR5W25hdmlnYXRpb25Qcm9wZXJ0eV0uaWRzfX0sIGluY2x1ZGUucXVlcnlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBfLm1hcCByZWZlcmVuY2VUb0NvbGxlY3Rpb24uZmluZChtdWx0aVF1ZXJ5LCBxdWVyeU9wdGlvbnMpLmZldGNoKCksIChvKS0+XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvWydyZWZlcmVuY2VfdG8ubyddID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLl9uYW1lXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvWydyZWZlcmVuY2VfdG8uX28nXSA9IF9vXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvWydfTkFNRV9GSUVMRF9WQUxVRSddID0gb1tfcm9fTkFNRV9GSUVMRF9LRVldXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdCPmjpLluo9cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSBDcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyhlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0sIF9pZHMpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzaW5nbGVRdWVyeSA9IF8uZXh0ZW5kIHtfaWQ6IGVudGl0eVtuYXZpZ2F0aW9uUHJvcGVydHldLmlkc1swXX0sIGluY2x1ZGUucXVlcnlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV0gPSByZWZlcmVuY2VUb0NvbGxlY3Rpb24uZmluZE9uZShzaW5nbGVRdWVyeSwgcXVlcnlPcHRpb25zKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW50aXRpZXNbaWR4XVtuYXZpZ2F0aW9uUHJvcGVydHldWydyZWZlcmVuY2VfdG8ubyddID0gcmVmZXJlbmNlVG9Db2xsZWN0aW9uLl9uYW1lXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllc1tpZHhdW25hdmlnYXRpb25Qcm9wZXJ0eV1bJ3JlZmVyZW5jZV90by5fbyddID0gX29cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVsnX05BTUVfRklFTERfVkFMVUUnXSA9IGVudGl0aWVzW2lkeF1bbmF2aWdhdGlvblByb3BlcnR5XVtfcm9fTkFNRV9GSUVMRF9LRVldXG5cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0IyBUT0RPXG5cblxuIyBcdFx0cmV0dXJuXG5cbiMgXHRzZXRPZGF0YVByb3BlcnR5PShlbnRpdGllcyxzcGFjZSxrZXkpLT5cbiMgXHRcdGVudGl0aWVzX09kYXRhUHJvcGVydGllcyA9IFtdXG4jIFx0XHRfLmVhY2ggZW50aXRpZXMsIChlbnRpdHksIGlkeCktPlxuIyBcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0ge31cbiMgXHRcdFx0aWQgPSBlbnRpdGllc1tpZHhdW1wiX2lkXCJdXG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXNbJ0BvZGF0YS5pZCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoKHNwYWNlLGtleSkrICcoXFwnJyArIFwiI3tpZH1cIiArICdcXCcpJ1xuIyBcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWydAb2RhdGEuZXRhZyddID0gXCJXL1xcXCIwOEQ1ODk3MjBCQkIzREIxXFxcIlwiXG4jIFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXNbJ0BvZGF0YS5lZGl0TGluayddID0gZW50aXR5X09kYXRhUHJvcGVydGllc1snQG9kYXRhLmlkJ11cbiMgXHRcdFx0Xy5leHRlbmQgZW50aXR5X09kYXRhUHJvcGVydGllcyxlbnRpdHlcbiMgXHRcdFx0ZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzLnB1c2ggZW50aXR5X09kYXRhUHJvcGVydGllc1xuIyBcdFx0cmV0dXJuIGVudGl0aWVzX09kYXRhUHJvcGVydGllc1xuXG4jIFx0c2V0RXJyb3JNZXNzYWdlID0gKHN0YXR1c0NvZGUsY29sbGVjdGlvbixrZXksYWN0aW9uKS0+XG4jIFx0XHRib2R5ID0ge31cbiMgXHRcdGVycm9yID0ge31cbiMgXHRcdGlubmVyZXJyb3IgPSB7fVxuIyBcdFx0aWYgc3RhdHVzQ29kZSA9PSA0MDRcbiMgXHRcdFx0aWYgY29sbGVjdGlvblxuIyBcdFx0XHRcdGlmIGFjdGlvbiA9PSAncG9zdCdcbiMgXHRcdFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3Bvc3RfZmFpbFwiKVxuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXG4jIFx0XHRcdFx0XHRlcnJvclsnY29kZSddID0gNDA0XG4jIFx0XHRcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX3Bvc3RfZmFpbFwiXG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfcmVjb3JkX3F1ZXJ5X2ZhaWxcIilcbiMgXHRcdFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xuIyBcdFx0XHRcdFx0ZXJyb3JbJ2NvZGUnXSA9IDQwNFxuIyBcdFx0XHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV9yZWNvcmRfcXVlcnlfZmFpbFwiXG4jIFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV9jb2xsZWN0aW9uX3F1ZXJ5X2ZhaWxcIikrIGtleVxuIyBcdFx0XHRcdGlubmVyZXJyb3JbJ3R5cGUnXSA9ICdNaWNyb3NvZnQuT0RhdGEuQ29yZS5VcmlQYXJzZXIuT0RhdGFVbnJlY29nbml6ZWRQYXRoRXhjZXB0aW9uJ1xuIyBcdFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDRcbiMgXHRcdFx0XHRlcnJvclsnbWVzc2FnZSddID0gXCJjcmVhdG9yX29kYXRhX2NvbGxlY3Rpb25fcXVlcnlfZmFpbFwiXG4jIFx0XHRpZiAgc3RhdHVzQ29kZSA9PSA0MDFcbiMgXHRcdFx0aW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfYXV0aGVudGljYXRpb25fcmVxdWlyZWRcIilcbiMgXHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXG4jIFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDFcbiMgXHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV9hdXRoZW50aWNhdGlvbl9yZXF1aXJlZFwiXG4jIFx0XHRpZiBzdGF0dXNDb2RlID09IDQwM1xuIyBcdFx0XHRzd2l0Y2ggYWN0aW9uXG4jIFx0XHRcdFx0d2hlbiAnZ2V0JyB0aGVuIGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfYWNjZXNzX2ZhaWxcIilcbiMgXHRcdFx0XHR3aGVuICdwb3N0JyB0aGVuIGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfY3JlYXRlX2ZhaWxcIilcbiMgXHRcdFx0XHR3aGVuICdwdXQnIHRoZW4gaW5uZXJlcnJvclsnbWVzc2FnZSddID0gdChcImNyZWF0b3Jfb2RhdGFfdXNlcl91cGRhdGVfZmFpbFwiKVxuIyBcdFx0XHRcdHdoZW4gJ2RlbGV0ZScgdGhlbiBpbm5lcmVycm9yWydtZXNzYWdlJ10gPSB0KFwiY3JlYXRvcl9vZGF0YV91c2VyX3JlbW92ZV9mYWlsXCIpXG4jIFx0XHRcdGlubmVyZXJyb3JbJ21lc3NhZ2UnXSA9IHQoXCJjcmVhdG9yX29kYXRhX3VzZXJfYWNjZXNzX2ZhaWxcIilcbiMgXHRcdFx0aW5uZXJlcnJvclsndHlwZSddID0gJ01pY3Jvc29mdC5PRGF0YS5Db3JlLlVyaVBhcnNlci5PRGF0YVVucmVjb2duaXplZFBhdGhFeGNlcHRpb24nXG4jIFx0XHRcdGVycm9yWydjb2RlJ10gPSA0MDNcbiMgXHRcdFx0ZXJyb3JbJ21lc3NhZ2UnXSA9IFwiY3JlYXRvcl9vZGF0YV91c2VyX2FjY2Vzc19mYWlsXCJcbiMgXHRcdGVycm9yWydpbm5lcmVycm9yJ10gPSBpbm5lcmVycm9yXG4jIFx0XHRib2R5WydlcnJvciddID0gZXJyb3JcbiMgXHRcdHJldHVybiBib2R5XG5cbiMgXHRyZW1vdmVJbnZhbGlkTWV0aG9kID0gKHF1ZXJ5UGFyYW1zKS0+XG4jIFx0XHRpZiBxdWVyeVBhcmFtcy4kZmlsdGVyICYmIHF1ZXJ5UGFyYW1zLiRmaWx0ZXIuaW5kZXhPZigndG9sb3dlcignKSA+IC0xXG4jIFx0XHRcdHJlbW92ZU1ldGhvZCA9ICgkMSktPlxuIyBcdFx0XHRcdHJldHVybiAkMS5yZXBsYWNlKCd0b2xvd2VyKCcsICcnKS5yZXBsYWNlKCcpJywgJycpXG4jIFx0XHRcdHF1ZXJ5UGFyYW1zLiRmaWx0ZXIgPSBxdWVyeVBhcmFtcy4kZmlsdGVyLnJlcGxhY2UoL3RvbG93ZXJcXCgoW15cXCldKylcXCkvZywgcmVtb3ZlTWV0aG9kKVxuXG4jIFx0aXNTYW1lQ29tcGFueSA9IChzcGFjZUlkLCB1c2VySWQsIGNvbXBhbnlJZCwgcXVlcnkpLT5cbiMgXHRcdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgY29tcGFueV9pZDogMSwgY29tcGFueV9pZHM6IDEgfSB9KVxuIyBcdFx0aWYgIWNvbXBhbnlJZCAmJiBxdWVyeVxuIyBcdFx0XHRjb21wYW55SWQgPSBzdS5jb21wYW55X2lkXG4jIFx0XHRcdHF1ZXJ5LmNvbXBhbnlfaWQgPSB7ICRpbjogc3UuY29tcGFueV9pZHMgfVxuIyBcdFx0cmV0dXJuIHN1LmNvbXBhbnlfaWRzLmluY2x1ZGVzKGNvbXBhbnlJZClcblxuIyBcdCMg5LiN6L+U5Zue5bey5YGH5Yig6Zmk55qE5pWw5o2uXG4jIFx0ZXhjbHVkZURlbGV0ZWQgPSAocXVlcnkpLT5cbiMgXHRcdHF1ZXJ5LmlzX2RlbGV0ZWQgPSB7ICRuZTogdHJ1ZSB9XG5cbiMgXHQjIOS/ruaUueOAgeWIoOmZpOaXtu+8jOWmguaenCBkb2Muc3BhY2UgPSBcImdsb2JhbFwi77yM5oql6ZSZXG4jIFx0Y2hlY2tHbG9iYWxSZWNvcmQgPSAoY29sbGVjdGlvbiwgaWQsIG9iamVjdCktPlxuIyBcdFx0aWYgb2JqZWN0LmVuYWJsZV9zcGFjZV9nbG9iYWwgJiYgY29sbGVjdGlvbi5maW5kKHsgX2lkOiBpZCwgc3BhY2U6ICdnbG9iYWwnfSkuY291bnQoKVxuIyBcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLkuI3og73kv67mlLnmiJbogIXliKDpmaTmoIflh4blr7nosaFcIilcblxuXG4jIFx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCc6b2JqZWN0X25hbWUnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcbiMgXHRcdGdldDogKCktPlxuIyBcdFx0XHR0cnlcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0Ym9keTpzZXRFcnJvck1lc3NhZ2UoNDAxKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBzcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0Ym9keTpzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuXG4jIFx0XHRcdFx0cmVtb3ZlSW52YWxpZE1ldGhvZChAcXVlcnlQYXJhbXMpXG4jIFx0XHRcdFx0cXMgPSBkZWNvZGVVUklDb21wb25lbnQocXVlcnlzdHJpbmcuc3RyaW5naWZ5KEBxdWVyeVBhcmFtcykpXG4jIFx0XHRcdFx0Y3JlYXRlUXVlcnkgPSBpZiBxcyB0aGVuIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KHFzKSBlbHNlIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KClcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdGlmIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIG9yIChwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgJiYgaXNTYW1lQ29tcGFueShzcGFjZUlkLCBAdXNlcklkLCBjcmVhdGVRdWVyeS5xdWVyeS5jb21wYW55X2lkLCBjcmVhdGVRdWVyeS5xdWVyeSkpIG9yIChwZXJtaXNzaW9ucy5hbGxvd1JlYWQgYW5kIEB1c2VySWQpXG5cbiMgXHRcdFx0XHRcdGlmIGtleSBpcyAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5WydtZXRhZGF0YS5zcGFjZSddID0gc3BhY2VJZFxuIyBcdFx0XHRcdFx0ZWxzZSBpZiBrZXkgaXMgJ3NwYWNlcydcbiMgXHRcdFx0XHRcdFx0aWYgc3BhY2VJZCBpc250ICdndWVzdCdcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5faWQgPSBzcGFjZUlkXG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdGlmIHNwYWNlSWQgaXNudCAnZ3Vlc3QnIGFuZCBrZXkgIT0gXCJ1c2Vyc1wiIGFuZCBjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSBpc250ICdnbG9iYWwnXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSBzcGFjZUlkXG5cbiMgXHRcdFx0XHRcdGlmIENyZWF0b3IuaXNDb21tb25TcGFjZShzcGFjZUlkKVxuIyBcdFx0XHRcdFx0XHRpZiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCBAdXNlcklkKVxuIyBcdFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnc3BhY2VzJ1xuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZFxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZVxuIyBcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0dXNlcl9zcGFjZXMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kKHt1c2VyOiBAdXNlcklkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pLmZldGNoKClcbiMgXHRcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ3NwYWNlcydcbiMgXHRcdFx0XHRcdFx0XHRcdCMgc3BhY2Ug5a+55omA5pyJ55So5oi36K6w5b2V5Li65Y+q6K+7XG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgY3JlYXRlUXVlcnkucXVlcnkuX2lkXG4jIFx0XHRcdFx0XHRcdFx0XHQjIGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9IHskaW46IF8ucGx1Y2sodXNlcl9zcGFjZXMsICdzcGFjZScpfVxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5LnNwYWNlID0geyRpbjogXy5wbHVjayh1c2VyX3NwYWNlcywgJ3NwYWNlJyl9XG5cbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5zb3J0IG9yICFfLnNpemUoY3JlYXRlUXVlcnkuc29ydClcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkuc29ydCA9IHsgbW9kaWZpZWQ6IC0xIH1cbiMgXHRcdFx0XHRcdGlzX2VudGVycHJpc2UgPSBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlSWQsXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIpXG4jIFx0XHRcdFx0XHRpc19wcm9mZXNzaW9uYWwgPSBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uKHNwYWNlSWQsXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIilcbiMgXHRcdFx0XHRcdGlzX3N0YW5kYXJkID0gU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbihzcGFjZUlkLFwid29ya2Zsb3cuc3RhbmRhcmRcIilcbiMgXHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LmxpbWl0XG4jIFx0XHRcdFx0XHRcdGxpbWl0ID0gY3JlYXRlUXVlcnkubGltaXRcbiMgXHRcdFx0XHRcdFx0aWYgaXNfZW50ZXJwcmlzZSBhbmQgbGltaXQ+MTAwMDAwXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkubGltaXQgPSAxMDAwMDBcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBpc19wcm9mZXNzaW9uYWwgYW5kIGxpbWl0PjEwMDAwIGFuZCAhaXNfZW50ZXJwcmlzZVxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMDBcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBpc19zdGFuZGFyZCBhbmQgbGltaXQ+MTAwMCBhbmQgIWlzX3Byb2Zlc3Npb25hbCBhbmQgIWlzX2VudGVycHJpc2VcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDBcbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0aWYgaXNfZW50ZXJwcmlzZVxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMDAwXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYgaXNfcHJvZmVzc2lvbmFsIGFuZCAhaXNfZW50ZXJwcmlzZVxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LmxpbWl0ID0gMTAwMDBcbiMgXHRcdFx0XHRcdFx0ZWxzZSBpZiBpc19zdGFuZGFyZCBhbmQgIWlzX2VudGVycHJpc2UgYW5kICFpc19wcm9mZXNzaW9uYWxcbiMgXHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMDBcbiMgXHRcdFx0XHRcdHVucmVhZGFibGVfZmllbGRzID0gcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgfHwgW11cbiMgXHRcdFx0XHRcdGlmIGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25cbiMgXHRcdFx0XHRcdFx0cHJvamVjdGlvbiA9IHt9XG4jIFx0XHRcdFx0XHRcdF8ua2V5cyhjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKS5mb3JFYWNoIChrZXkpLT5cbiMgXHRcdFx0XHRcdFx0XHRpZiBfLmluZGV4T2YodW5yZWFkYWJsZV9maWVsZHMsIGtleSkgPCAwXG4jIFx0XHRcdFx0XHRcdFx0XHQjaWYgbm90ICgoZmllbGRzW2tleV0/LnR5cGUgPT0gJ2xvb2t1cCcgb3IgZmllbGRzW2tleV0/LnR5cGUgPT0gJ21hc3Rlcl9kZXRhaWwnKSBhbmQgZmllbGRzW2tleV0ubXVsdGlwbGUpXG4jIFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0aW9uW2tleV0gPSAxXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gPSBwcm9qZWN0aW9uXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkucHJvamVjdGlvbiBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pXG4jIFx0XHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGtleSwgc3BhY2VJZCwgQHVzZXJJZClcbiMgXHRcdFx0XHRcdFx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKS5maWVsZHNcbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGZpZWxkKS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaW5kZXhPZignJCcpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdFx0I2lmIGZpZWxkc1tmaWVsZF0/Lm11bHRpcGxlIT0gdHJ1ZVxuIyBcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucHJvamVjdGlvbltmaWVsZF0gPSAxXG4jIFx0XHRcdFx0XHRpZiBub3QgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xuIyBcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3NoYXJlXG4jIFx0XHRcdFx0XHRcdFx0IyDmu6HotrPlhbHkuqvop4TliJnkuK3nmoTorrDlvZXkuZ/opoHmkJzntKLlh7rmnaVcbiMgXHRcdFx0XHRcdFx0XHRkZWxldGUgY3JlYXRlUXVlcnkucXVlcnkub3duZXJcbiMgXHRcdFx0XHRcdFx0XHRzaGFyZXMgPSBbXVxuIyBcdFx0XHRcdFx0XHRcdG9yZ3MgPSBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zKHNwYWNlSWQsIEB1c2VySWQsIHRydWUpXG4jIFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2gge1wib3duZXJcIjogQHVzZXJJZH1cbiMgXHRcdFx0XHRcdFx0XHRzaGFyZXMucHVzaCB7IFwic2hhcmluZy51XCI6IEB1c2VySWQgfVxuIyBcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHsgXCJzaGFyaW5nLm9cIjogeyAkaW46IG9yZ3MgfSB9XG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbXCIkb3JcIl0gPSBzaGFyZXNcbiMgXHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Lm93bmVyID0gQHVzZXJJZFxuIyBcdFx0XHRcdFx0ZW50aXRpZXMgPSBbXVxuXG4jIFx0XHRcdFx0XHRleGNsdWRlRGVsZXRlZChjcmVhdGVRdWVyeS5xdWVyeSlcblxuIyBcdFx0XHRcdFx0aWYgQHF1ZXJ5UGFyYW1zLiR0b3AgaXNudCAnMCdcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnksIHZpc2l0b3JQYXJzZXIoY3JlYXRlUXVlcnkpKS5mZXRjaCgpXG4jIFx0XHRcdFx0XHRzY2FubmVkQ291bnQgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnkse2ZpZWxkczp7X2lkOiAxfX0pLmNvdW50KClcbiMgXHRcdFx0XHRcdGlmIGVudGl0aWVzXG4jIFx0XHRcdFx0XHRcdGRlYWxXaXRoRXhwYW5kKGNyZWF0ZVF1ZXJ5LCBlbnRpdGllcywga2V5LCBzcGFjZUlkKVxuIyBcdFx0XHRcdFx0XHQjc2Nhbm5lZENvdW50ID0gZW50aXRpZXMubGVuZ3RoXG4jIFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKHNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdCNcdGJvZHlbJ0BvZGF0YS5uZXh0TGluayddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoKHNwYWNlSWQsa2V5KStcIj8lMjRza2lwPVwiKyAxMFxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY291bnQnXSA9IHNjYW5uZWRDb3VudFxuIyBcdFx0XHRcdFx0XHRlbnRpdGllc19PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLHNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0aWVzX09kYXRhUHJvcGVydGllc1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSxcImdldFwiKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRjYXRjaCBlXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcblxuIyBcdFx0cG9zdDogKCktPlxuIyBcdFx0XHR0cnlcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdFx0c3BhY2VJZCA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuIyBcdFx0XHRcdGlmIG5vdCBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpPy5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0Ym9keTpzZXRFcnJvck1lc3NhZ2UoNDAxKVxuIyBcdFx0XHRcdH1cblxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBzcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0Ym9keTpzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcbiMgXHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gc3BhY2VJZFxuIyBcdFx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnXG4jIFx0XHRcdFx0XHRcdGRlbGV0ZSBAYm9keVBhcmFtcy5zcGFjZVxuIyBcdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xuIyBcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXG4jIFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXG4jIFx0XHRcdFx0XHRpZiBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRlbnRpdGllcy5wdXNoIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcbiMgXHRcdFx0XHRcdFx0ZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXR5X09kYXRhUHJvcGVydGllc1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5LCdwb3N0JylcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRjYXRjaCBlXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcblxuIyBcdH0pXG4jIFx0U3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCc6b2JqZWN0X25hbWUvcmVjZW50Jywge2F1dGhSZXF1aXJlZDogdHJ1ZSwgc3BhY2VSZXF1aXJlZDogZmFsc2V9LCB7XG4jIFx0XHRnZXQ6KCktPlxuIyBcdFx0XHR0cnlcbiMgXHRcdFx0XHRrZXkgPSBAdXJsUGFyYW1zLm9iamVjdF9uYW1lXG4jIFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDFcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19jb2xsZWN0aW9uID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcIm9iamVjdF9yZWNlbnRfdmlld2VkXCJdXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19zZWxlY3RvciA9IHtcInJlY29yZC5vXCI6a2V5LGNyZWF0ZWRfYnk6QHVzZXJJZH1cbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X29wdGlvbnMgPSB7fVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfb3B0aW9ucy5zb3J0ID0ge2NyZWF0ZWQ6IC0xfVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfb3B0aW9ucy5maWVsZHMgPSB7cmVjb3JkOjF9XG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzID0gcmVjZW50X3ZpZXdfY29sbGVjdGlvbi5maW5kKHJlY2VudF92aWV3X3NlbGVjdG9yLHJlY2VudF92aWV3X29wdGlvbnMpLmZldGNoKClcbiMgXHRcdFx0XHRcdHJlY2VudF92aWV3X3JlY29yZHNfaWRzID0gXy5wbHVjayhyZWNlbnRfdmlld19yZWNvcmRzLCdyZWNvcmQnKVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSByZWNlbnRfdmlld19yZWNvcmRzX2lkcy5nZXRQcm9wZXJ0eShcImlkc1wiKVxuIyBcdFx0XHRcdFx0cmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMgPSBfLmZsYXR0ZW4ocmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMpXG4jIFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IF8udW5pcShyZWNlbnRfdmlld19yZWNvcmRzX2lkcylcbiMgXHRcdFx0XHRcdHJlbW92ZUludmFsaWRNZXRob2QoQHF1ZXJ5UGFyYW1zKVxuIyBcdFx0XHRcdFx0cXMgPSBkZWNvZGVVUklDb21wb25lbnQocXVlcnlzdHJpbmcuc3RyaW5naWZ5KEBxdWVyeVBhcmFtcykpXG4jIFx0XHRcdFx0XHRjcmVhdGVRdWVyeSA9IGlmIHFzIHRoZW4gb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkocXMpIGVsc2Ugb2RhdGFWNE1vbmdvZGIuY3JlYXRlUXVlcnkoKVxuIyBcdFx0XHRcdFx0aWYga2V5IGlzICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnlbJ21ldGFkYXRhLnNwYWNlJ10gPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5saW1pdFxuIyBcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5saW1pdCA9IDEwMFxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkubGltaXQgYW5kIHJlY2VudF92aWV3X3JlY29yZHNfaWRzLmxlbmd0aD5jcmVhdGVRdWVyeS5saW1pdFxuIyBcdFx0XHRcdFx0XHRyZWNlbnRfdmlld19yZWNvcmRzX2lkcyA9IF8uZmlyc3QocmVjZW50X3ZpZXdfcmVjb3Jkc19pZHMsY3JlYXRlUXVlcnkubGltaXQpXG4jIFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5faWQgPSB7JGluOnJlY2VudF92aWV3X3JlY29yZHNfaWRzfVxuIyBcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxuIyBcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkucHJvamVjdGlvblxuIyBcdFx0XHRcdFx0XHRwcm9qZWN0aW9uID0ge31cbiMgXHRcdFx0XHRcdFx0Xy5rZXlzKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pLmZvckVhY2ggKGtleSktPlxuIyBcdFx0XHRcdFx0XHRcdGlmIF8uaW5kZXhPZih1bnJlYWRhYmxlX2ZpZWxkcywga2V5KSA8IDBcbiMgXHRcdFx0XHRcdFx0XHRcdCMgaWYgbm90ICgoZmllbGRzW2tleV0/LnR5cGUgPT0gJ2xvb2t1cCcgb3IgZmllbGRzW2tleV0/LnR5cGUgPT0gJ21hc3Rlcl9kZXRhaWwnKSBhbmQgZmllbGRzW2tleV0ubXVsdGlwbGUpXG4jIFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0aW9uW2tleV0gPSAxXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gPSBwcm9qZWN0aW9uXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkucHJvamVjdGlvbiBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24pXG4jIFx0XHRcdFx0XHRcdHJlYWRhYmxlX2ZpZWxkcyA9IENyZWF0b3IuZ2V0RmllbGRzKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkKVxuIyBcdFx0XHRcdFx0XHRmaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCkuZmllbGRzXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCByZWFkYWJsZV9maWVsZHMsIChmaWVsZCktPlxuIyBcdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmluZGV4T2YoJyQnKSA8IDBcbiMgXHRcdFx0XHRcdFx0XHRcdCNpZiBmaWVsZHNbZmllbGRdPy5tdWx0aXBsZSE9IHRydWVcbiMgXHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb25bZmllbGRdID0gMVxuXG4jIFx0XHRcdFx0XHRleGNsdWRlRGVsZXRlZChjcmVhdGVRdWVyeS5xdWVyeSlcblxuIyBcdFx0XHRcdFx0aWYgQHF1ZXJ5UGFyYW1zLiR0b3AgaXNudCAnMCdcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoY3JlYXRlUXVlcnkucXVlcnksIHZpc2l0b3JQYXJzZXIoY3JlYXRlUXVlcnkpKS5mZXRjaCgpXG4jIFx0XHRcdFx0XHRlbnRpdGllc19pbmRleCA9IFtdXG4jIFx0XHRcdFx0XHRlbnRpdGllc19pZHMgPSBfLnBsdWNrKGVudGl0aWVzLCdfaWQnKVxuIyBcdFx0XHRcdFx0c29ydF9lbnRpdGllcyA9IFtdXG4jIFx0XHRcdFx0XHRpZiBub3QgY3JlYXRlUXVlcnkuc29ydCBvciAhXy5zaXplKGNyZWF0ZVF1ZXJ5LnNvcnQpXG4jIFx0XHRcdFx0XHRcdF8uZWFjaCByZWNlbnRfdmlld19yZWNvcmRzX2lkcyAsKHJlY2VudF92aWV3X3JlY29yZHNfaWQpLT5cbiMgXHRcdFx0XHRcdFx0XHRpbmRleCA9IF8uaW5kZXhPZihlbnRpdGllc19pZHMscmVjZW50X3ZpZXdfcmVjb3Jkc19pZClcbiMgXHRcdFx0XHRcdFx0XHRpZiBpbmRleD4tMVxuIyBcdFx0XHRcdFx0XHRcdFx0c29ydF9lbnRpdGllcy5wdXNoIGVudGl0aWVzW2luZGV4XVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRzb3J0X2VudGl0aWVzID0gZW50aXRpZXNcbiMgXHRcdFx0XHRcdGlmIHNvcnRfZW50aXRpZXNcbiMgXHRcdFx0XHRcdFx0ZGVhbFdpdGhFeHBhbmQoY3JlYXRlUXVlcnksIHNvcnRfZW50aXRpZXMsIGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdCNcdGJvZHlbJ0BvZGF0YS5uZXh0TGluayddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCxrZXkpK1wiPyUyNHNraXA9XCIrIDEwXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb3VudCddID0gc29ydF9lbnRpdGllcy5sZW5ndGhcbiMgXHRcdFx0XHRcdFx0ZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShzb3J0X2VudGl0aWVzLEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXRpZXNfT2RhdGFQcm9wZXJ0aWVzXG4jIFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXksJ2dldCcpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRjYXRjaCBlXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcbiMgfSlcblxuIyBcdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnOm9iamVjdF9uYW1lLzpfaWQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlLCBzcGFjZVJlcXVpcmVkOiBmYWxzZX0sIHtcbiMgXHRcdHBvc3Q6ICgpLT5cbiMgXHRcdFx0dHJ5XG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRcdGlmIG5vdCBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCk/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcbiMgXHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0XHRlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG4jIFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcbiMgXHRcdFx0XHRcdGVudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdGlmIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdGVudGl0aWVzLnB1c2ggZW50aXR5XG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXG4jIFx0XHRcdFx0XHRcdGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gZW50aXR5X09kYXRhUHJvcGVydGllc1xuIyBcdFx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5LCdwb3N0JylcbiMgXHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ3Bvc3QnKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRjYXRjaCBlXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcbiMgXHRcdGdldDooKS0+XG4jIFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0aWYga2V5LmluZGV4T2YoXCIoXCIpID4gLTFcbiMgXHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRjb2xsZWN0aW9uSW5mbyA9IGtleVxuIyBcdFx0XHRcdGZpZWxkTmFtZSA9IEB1cmxQYXJhbXMuX2lkLnNwbGl0KCdfZXhwYW5kJylbMF1cbiMgXHRcdFx0XHRjb2xsZWN0aW9uSW5mb1NwbGl0ID0gY29sbGVjdGlvbkluZm8uc3BsaXQoJygnKVxuIyBcdFx0XHRcdGNvbGxlY3Rpb25OYW1lID0gY29sbGVjdGlvbkluZm9TcGxpdFswXVxuIyBcdFx0XHRcdGlkID0gY29sbGVjdGlvbkluZm9TcGxpdFsxXS5zcGxpdCgnXFwnJylbMV1cblxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUsIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRmaWVsZHNPcHRpb25zID0ge31cbiMgXHRcdFx0XHRmaWVsZHNPcHRpb25zW2ZpZWxkTmFtZV0gPSAxXG4jIFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHtfaWQ6IGlkfSwge2ZpZWxkczogZmllbGRzT3B0aW9uc30pXG5cbiMgXHRcdFx0XHRmaWVsZFZhbHVlID0gbnVsbFxuIyBcdFx0XHRcdGlmIGVudGl0eVxuIyBcdFx0XHRcdFx0ZmllbGRWYWx1ZSA9IGVudGl0eVtmaWVsZE5hbWVdXG5cbiMgXHRcdFx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChjb2xsZWN0aW9uTmFtZSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGZpZWxkID0gb2JqLmZpZWxkc1tmaWVsZE5hbWVdXG5cbiMgXHRcdFx0XHRpZiBmaWVsZCBhbmQgZmllbGRWYWx1ZSBhbmQgKGZpZWxkLnR5cGUgaXMgJ2xvb2t1cCcgb3IgZmllbGQudHlwZSBpcyAnbWFzdGVyX2RldGFpbCcpXG4jIFx0XHRcdFx0XHRsb29rdXBDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bywgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdFx0cXVlcnlPcHRpb25zID0ge2ZpZWxkczoge319XG4jIFx0XHRcdFx0XHRyZWFkYWJsZV9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhmaWVsZC5yZWZlcmVuY2VfdG8sIEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZClcbiMgXHRcdFx0XHRcdF8uZWFjaCByZWFkYWJsZV9maWVsZHMsIChmKS0+XG4jIFx0XHRcdFx0XHRcdGlmIGYuaW5kZXhPZignJCcpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdHF1ZXJ5T3B0aW9ucy5maWVsZHNbZl0gPSAxXG5cbiMgXHRcdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG4jIFx0XHRcdFx0XHRcdHZhbHVlcyA9IFtdXG4jIFx0XHRcdFx0XHRcdGxvb2t1cENvbGxlY3Rpb24uZmluZCh7X2lkOiB7JGluOiBmaWVsZFZhbHVlfX0sIHF1ZXJ5T3B0aW9ucykuZm9yRWFjaCAob2JqKS0+XG4jIFx0XHRcdFx0XHRcdFx0Xy5lYWNoIG9iaiwgKHYsIGspLT5cbiMgXHRcdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheSh2KSB8fCAoXy5pc09iamVjdCh2KSAmJiAhXy5pc0RhdGUodikpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdG9ialtrXSA9IEpTT04uc3RyaW5naWZ5KHYpXG4jIFx0XHRcdFx0XHRcdFx0dmFsdWVzLnB1c2gob2JqKVxuIyBcdFx0XHRcdFx0XHRib2R5Wyd2YWx1ZSddID0gdmFsdWVzXG4jIFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCkgKyBcIiMje2NvbGxlY3Rpb25JbmZvfS8je0B1cmxQYXJhbXMuX2lkfVwiXG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdGJvZHkgPSBsb29rdXBDb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogZmllbGRWYWx1ZX0sIHF1ZXJ5T3B0aW9ucykgfHwge31cbiMgXHRcdFx0XHRcdFx0Xy5lYWNoIGJvZHksICh2LCBrKS0+XG4jIFx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KHYpIHx8IChfLmlzT2JqZWN0KHYpICYmICFfLmlzRGF0ZSh2KSlcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHlba10gPSBKU09OLnN0cmluZ2lmeSh2KVxuIyBcdFx0XHRcdFx0XHRib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zLnNwYWNlSWQpICsgXCIjI3tmaWVsZC5yZWZlcmVuY2VfdG99LyRlbnRpdHlcIlxuXG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoQHVybFBhcmFtcy5zcGFjZUlkKSArIFwiIyN7Y29sbGVjdGlvbkluZm99LyN7QHVybFBhcmFtcy5faWR9XCJcbiMgXHRcdFx0XHRcdGJvZHlbJ3ZhbHVlJ10gPSBmaWVsZFZhbHVlXG5cbiMgXHRcdFx0XHRoZWFkZXJzWydDb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uO29kYXRhLm1ldGFkYXRhPW1pbmltYWw7Y2hhcnNldD11dGYtOCdcbiMgXHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuXG4jIFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XG4jIFx0XHRcdGVsc2VcbiMgXHRcdFx0XHR0cnlcbiMgXHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdFx0aWYgbm90IG9iamVjdD8uZW5hYmxlX2FwaVxuIyBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSlcbiMgXHRcdFx0XHRcdFx0fVxuXG4jIFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcbiMgXHRcdFx0XHRcdFx0dW5yZWFkYWJsZV9maWVsZHMgPSBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyB8fCBbXVxuIyBcdFx0XHRcdFx0XHRyZW1vdmVJbnZhbGlkTWV0aG9kKEBxdWVyeVBhcmFtcylcbiMgXHRcdFx0XHRcdFx0cXMgPSBkZWNvZGVVUklDb21wb25lbnQocXVlcnlzdHJpbmcuc3RyaW5naWZ5KEBxdWVyeVBhcmFtcykpXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5ID0gaWYgcXMgdGhlbiBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeShxcykgZWxzZSBvZGF0YVY0TW9uZ29kYi5jcmVhdGVRdWVyeSgpXG4jIFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Ll9pZCA9ICBAdXJsUGFyYW1zLl9pZFxuIyBcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5WydtZXRhZGF0YS5zcGFjZSddID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0XHRcdGVsc2UgaWYga2V5ICE9ICdzcGFjZXMnXG4jIFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkucXVlcnkuc3BhY2UgPSAgQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0XHRcdHVucmVhZGFibGVfZmllbGRzID0gcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgfHwgW11cbiMgXHRcdFx0XHRcdFx0aWYgY3JlYXRlUXVlcnkucHJvamVjdGlvblxuIyBcdFx0XHRcdFx0XHRcdHByb2plY3Rpb24gPSB7fVxuIyBcdFx0XHRcdFx0XHRcdF8ua2V5cyhjcmVhdGVRdWVyeS5wcm9qZWN0aW9uKS5mb3JFYWNoIChrZXkpLT5cbiMgXHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5kZXhPZih1bnJlYWRhYmxlX2ZpZWxkcywga2V5KSA8IDBcbiMgXHRcdFx0XHRcdFx0XHRcdFx0IyBpZiBub3QgKChmaWVsZHNba2V5XT8udHlwZSA9PSAnbG9va3VwJyBvciBmaWVsZHNba2V5XT8udHlwZSA9PSAnbWFzdGVyX2RldGFpbCcpIGFuZCBmaWVsZHNba2V5XS5tdWx0aXBsZSlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdGlvbltrZXldID0gMVxuIyBcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnByb2plY3Rpb24gPSBwcm9qZWN0aW9uXG4jIFx0XHRcdFx0XHRcdGlmIG5vdCBjcmVhdGVRdWVyeS5wcm9qZWN0aW9uIG9yICFfLnNpemUoY3JlYXRlUXVlcnkucHJvamVjdGlvbilcbiMgXHRcdFx0XHRcdFx0XHRyZWFkYWJsZV9maWVsZHMgPSBDcmVhdG9yLmdldEZpZWxkcyhrZXksIEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZClcbiMgXHRcdFx0XHRcdFx0XHRmaWVsZHMgPSBvYmplY3QuZmllbGRzXG4jIFx0XHRcdFx0XHRcdFx0Xy5lYWNoIHJlYWRhYmxlX2ZpZWxkcywgKGZpZWxkKSAtPlxuIyBcdFx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaW5kZXhPZignJCcpIDwgMFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5wcm9qZWN0aW9uW2ZpZWxkXSA9IDFcbiMgXHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGNyZWF0ZVF1ZXJ5LnF1ZXJ5LHZpc2l0b3JQYXJzZXIoY3JlYXRlUXVlcnkpKVxuIyBcdFx0XHRcdFx0XHRlbnRpdGllcyA9IFtdXG4jIFx0XHRcdFx0XHRcdGlmIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRcdGlzQWxsb3dlZCA9IGVudGl0eS5vd25lciA9PSBAdXNlcklkIG9yIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIG9yIChwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgJiYgaXNTYW1lQ29tcGFueShAdXJsUGFyYW1zLnNwYWNlSWQsIEB1c2VySWQsIGVudGl0eS5jb21wYW55X2lkKSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3NoYXJlIGFuZCAhaXNBbGxvd2VkXG4jIFx0XHRcdFx0XHRcdFx0XHRzaGFyZXMgPSBbXVxuIyBcdFx0XHRcdFx0XHRcdFx0b3JncyA9IFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCB0cnVlKVxuIyBcdFx0XHRcdFx0XHRcdFx0c2hhcmVzLnB1c2ggeyBcInNoYXJpbmcudVwiOiBAdXNlcklkIH1cbiMgXHRcdFx0XHRcdFx0XHRcdHNoYXJlcy5wdXNoIHsgXCJzaGFyaW5nLm9cIjogeyAkaW46IG9yZ3MgfSB9XG4jIFx0XHRcdFx0XHRcdFx0XHRpc0FsbG93ZWQgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IEB1cmxQYXJhbXMuX2lkLCBcIiRvclwiOiBzaGFyZXMgfSwgeyBmaWVsZHM6IHsgX2lkOiAxIH0gfSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBpc0FsbG93ZWRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllcy5wdXNoIGVudGl0eVxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVhbFdpdGhFeHBhbmQoY3JlYXRlUXVlcnksIGVudGl0aWVzLCBrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSkgKyAnLyRlbnRpdHknXG4jIFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzID0gc2V0T2RhdGFQcm9wZXJ0eShlbnRpdGllcyxAdXJsUGFyYW1zLnNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0XHRcdF8uZXh0ZW5kIGJvZHksZW50aXR5X09kYXRhUHJvcGVydGllc1swXVxuIyBcdFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdFx0XHRoZWFkZXJzWydPRGF0YS1WZXJzaW9uJ10gPSBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuIyBcdFx0XHRcdFx0XHRcdFx0e2JvZHk6IGJvZHksIGhlYWRlcnM6IGhlYWRlcnN9XG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwMyxjb2xsZWN0aW9uLGtleSwnZ2V0JylcbiMgXHRcdFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keTogc2V0RXJyb3JNZXNzYWdlKDQwNCxjb2xsZWN0aW9uLGtleSwnZ2V0JylcbiMgXHRcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdnZXQnKVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0Y2F0Y2ggZVxuIyBcdFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcblxuIyBcdFx0cHV0OigpLT5cbiMgXHRcdFx0dHJ5XG4jIFx0XHRcdFx0a2V5ID0gQHVybFBhcmFtcy5vYmplY3RfbmFtZVxuIyBcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBvYmplY3Q/LmVuYWJsZV9hcGlcbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAxXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDEpXG4jIFx0XHRcdFx0XHR9XG5cbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdHNwYWNlSWQgPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdGlmIGtleSA9PSBcInVzZXJzXCJcbiMgXHRcdFx0XHRcdHJlY29yZF9vd25lciA9IEB1cmxQYXJhbXMuX2lkXG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmVjb3JkX293bmVyID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiBAdXJsUGFyYW1zLl9pZCB9LCB7IGZpZWxkczogeyBvd25lcjogMSB9IH0pPy5vd25lclxuXG4jIFx0XHRcdFx0Y29tcGFueUlkID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiBAdXJsUGFyYW1zLl9pZCB9LCB7IGZpZWxkczogeyBjb21wYW55X2lkOiAxIH0gfSk/LmNvbXBhbnlfaWRcblxuIyBcdFx0XHRcdGlzQWxsb3dlZCA9IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgb3IgKHBlcm1pc3Npb25zLmFsbG93RWRpdCBhbmQgcmVjb3JkX293bmVyID09IEB1c2VySWQgKSBvciAocGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgJiYgaXNTYW1lQ29tcGFueShzcGFjZUlkLCBAdXNlcklkLCBjb21wYW55SWQpKVxuIyBcdFx0XHRcdGlmIGlzQWxsb3dlZFxuIyBcdFx0XHRcdFx0Y2hlY2tHbG9iYWxSZWNvcmQoY29sbGVjdGlvbiwgQHVybFBhcmFtcy5faWQsIG9iamVjdClcbiMgXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5faWQsIHNwYWNlOiBzcGFjZUlkfVxuIyBcdFx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIG9yIHNwYWNlSWQgaXMgJ2NvbW1vbicgb3Iga2V5ID09IFwidXNlcnNcIlxuIyBcdFx0XHRcdFx0XHRkZWxldGUgc2VsZWN0b3Iuc3BhY2VcbiMgXHRcdFx0XHRcdGZpZWxkc19lZGl0YWJsZSA9IHRydWVcbiMgXHRcdFx0XHRcdF8ua2V5cyhAYm9keVBhcmFtcy4kc2V0KS5mb3JFYWNoIChrZXkpLT5cbiMgXHRcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBrZXkpID4gLTFcbiMgXHRcdFx0XHRcdFx0XHRmaWVsZHNfZWRpdGFibGUgPSBmYWxzZVxuIyBcdFx0XHRcdFx0aWYgZmllbGRzX2VkaXRhYmxlXG4jIFx0XHRcdFx0XHRcdGlmIGtleSBpcyAnc3BhY2VzJ1xuIyBcdFx0XHRcdFx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxuIyBcdFx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgQGJvZHlQYXJhbXNcbiMgXHRcdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXG4jIFx0XHRcdFx0XHRcdFx0I3N0YXR1c0NvZGU6IDIwMVxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuX2lkXG4jIFx0XHRcdFx0XHRcdFx0IyBlbnRpdGllcyA9IFtdXG4jIFx0XHRcdFx0XHRcdFx0IyBib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0XHRoZWFkZXJzID0ge31cbiMgXHRcdFx0XHRcdFx0XHRib2R5ID0ge31cbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0aWVzLnB1c2ggZW50aXR5XG4jIFx0XHRcdFx0XHRcdFx0IyBib2R5WydAb2RhdGEuY29udGV4dCddID0gU3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGgoc3BhY2VJZCwga2V5KSArICcvJGVudGl0eSdcbiMgXHRcdFx0XHRcdFx0XHQjIGVudGl0eV9PZGF0YVByb3BlcnRpZXMgPSBzZXRPZGF0YVByb3BlcnR5KGVudGl0aWVzLHNwYWNlSWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0XHQjIF8uZXh0ZW5kIGJvZHksZW50aXR5X09kYXRhUHJvcGVydGllc1swXVxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247b2RhdGEubWV0YWRhdGE9bWluaW1hbDtjaGFyc2V0PXV0Zi04J1xuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnNbJ09EYXRhLVZlcnNpb24nXSA9IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4jIFx0XHRcdFx0XHRcdFx0e2hlYWRlcnM6IGhlYWRlcnMsYm9keTpib2R5fVxuIyBcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJue1xuIyBcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXksJ3B1dCcpXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5LCdwdXQnKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRjYXRjaCBlXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcbiMgXHRcdGRlbGV0ZTooKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIEB1cmxQYXJhbXMuc3BhY2VJZClcbiMgXHRcdFx0XHRpZiBub3Qgb2JqZWN0Py5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxuIyBcdFx0XHRcdFx0XHR9XG5cbiMgXHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuIyBcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdHNwYWNlSWQgPSBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0cmVjb3JkRGF0YSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiBAdXJsUGFyYW1zLl9pZH0sIHsgZmllbGRzOiB7IG93bmVyOiAxLCBjb21wYW55X2lkOiAxIH0gfSlcbiMgXHRcdFx0XHRyZWNvcmRfb3duZXIgPSByZWNvcmREYXRhPy5vd25lclxuIyBcdFx0XHRcdGNvbXBhbnlJZCA9IHJlY29yZERhdGE/LmNvbXBhbnlfaWRcbiMgXHRcdFx0XHRpc0FsbG93ZWQgPSAocGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUpIG9yIChwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyBhbmQgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgYW5kIGlzU2FtZUNvbXBhbnkoc3BhY2VJZCwgQHVzZXJJZCwgY29tcGFueUlkKSkgb3IgKHBlcm1pc3Npb25zLmFsbG93RGVsZXRlIGFuZCByZWNvcmRfb3duZXI9PUB1c2VySWQgKVxuIyBcdFx0XHRcdGlmIGlzQWxsb3dlZFxuIyBcdFx0XHRcdFx0Y2hlY2tHbG9iYWxSZWNvcmQoY29sbGVjdGlvbiwgQHVybFBhcmFtcy5faWQsIG9iamVjdClcbiMgXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5faWQsIHNwYWNlOiBzcGFjZUlkfVxuIyBcdFx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnXG4jIFx0XHRcdFx0XHRcdGRlbGV0ZSBzZWxlY3Rvci5zcGFjZVxuXG4jIFx0XHRcdFx0XHRpZiBvYmplY3Q/LmVuYWJsZV90cmFzaFxuIyBcdFx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xuIyBcdFx0XHRcdFx0XHRcdCRzZXQ6IHtcbiMgXHRcdFx0XHRcdFx0XHRcdGlzX2RlbGV0ZWQ6IHRydWUsXG4jIFx0XHRcdFx0XHRcdFx0XHRkZWxldGVkOiBuZXcgRGF0ZSgpLFxuIyBcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlZF9ieTogQHVzZXJJZFxuIyBcdFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRcdFx0fSlcbiMgXHRcdFx0XHRcdFx0aWYgZW50aXR5SXNVcGRhdGVkXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0XHR7aGVhZGVyczogaGVhZGVycyxib2R5OmJvZHl9XG4jIFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxuIyBcdFx0XHRcdFx0XHRcdGhlYWRlcnMgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdGJvZHkgPSB7fVxuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXRpZXMucHVzaCBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0XHQjIGJvZHlbJ0BvZGF0YS5jb250ZXh0J10gPSBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aChzcGFjZUlkLCBrZXkpICsgJy8kZW50aXR5J1xuIyBcdFx0XHRcdFx0XHRcdCMgZW50aXR5X09kYXRhUHJvcGVydGllcyA9IHNldE9kYXRhUHJvcGVydHkoZW50aXRpZXMsc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdCMgXy5leHRlbmQgYm9keSxlbnRpdHlfT2RhdGFQcm9wZXJ0aWVzWzBdXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0XHR7aGVhZGVyczogaGVhZGVycyxib2R5OmJvZHl9XG4jIFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdHJldHVybiB7XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAzLGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRjYXRjaCBlXG4jIFx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yIGVcbiMgXHR9KVxuXG4jIFx0IyBfaWTlj6/kvKBhbGxcbiMgXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJzpvYmplY3RfbmFtZS86X2lkLzptZXRob2ROYW1lJywge2F1dGhSZXF1aXJlZDogdHJ1ZSwgc3BhY2VSZXF1aXJlZDogZmFsc2V9LCB7XG4jIFx0XHRwb3N0OiAoKS0+XG4jIFx0XHRcdHRyeVxuIyBcdFx0XHRcdGtleSA9IEB1cmxQYXJhbXMub2JqZWN0X25hbWVcbiMgXHRcdFx0XHRpZiBub3QgQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpPy5lbmFibGVfYXBpXG4jIFx0XHRcdFx0XHRyZXR1cm57XG4jIFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMVxuIyBcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDAxKVxuIyBcdFx0XHRcdFx0fVxuIyBcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5LCBAdXJsUGFyYW1zLnNwYWNlSWQpXG4jIFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdHJldHVybntcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDQsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG5cbiMgXHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHVybFBhcmFtcy5zcGFjZUlkLCBAdXNlcklkLCBrZXkpXG4jIFx0XHRcdFx0aWYgcGVybWlzc2lvbnMuYWxsb3dSZWFkXG4jIFx0XHRcdFx0XHRtZXRob2ROYW1lID0gQHVybFBhcmFtcy5tZXRob2ROYW1lXG4jIFx0XHRcdFx0XHRtZXRob2RzID0gQ3JlYXRvci5PYmplY3RzW2tleV0/Lm1ldGhvZHMgfHwge31cbiMgXHRcdFx0XHRcdGlmIG1ldGhvZHMuaGFzT3duUHJvcGVydHkobWV0aG9kTmFtZSlcbiMgXHRcdFx0XHRcdFx0dGhpc09iaiA9IHtcbiMgXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZToga2V5XG4jIFx0XHRcdFx0XHRcdFx0cmVjb3JkX2lkOiBAdXJsUGFyYW1zLl9pZFxuIyBcdFx0XHRcdFx0XHRcdHNwYWNlX2lkOiBAdXJsUGFyYW1zLnNwYWNlSWRcbiMgXHRcdFx0XHRcdFx0XHR1c2VyX2lkOiBAdXNlcklkXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnM6IHBlcm1pc3Npb25zXG4jIFx0XHRcdFx0XHRcdH1cbiMgXHRcdFx0XHRcdFx0cmV0dXJuIG1ldGhvZHNbbWV0aG9kTmFtZV0uYXBwbHkodGhpc09iaiwgW0Bib2R5UGFyYW1zXSkgfHwge31cbiMgXHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRib2R5OiBzZXRFcnJvck1lc3NhZ2UoNDA0LGNvbGxlY3Rpb24sa2V5KVxuIyBcdFx0XHRcdFx0XHR9XG4jIFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0cmV0dXJuIHtcbiMgXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAzXG4jIFx0XHRcdFx0XHRcdGJvZHk6IHNldEVycm9yTWVzc2FnZSg0MDMsY29sbGVjdGlvbixrZXkpXG4jIFx0XHRcdFx0XHR9XG4jIFx0XHRcdGNhdGNoIGVcbiMgXHRcdFx0XHRyZXR1cm4gaGFuZGxlRXJyb3IgZVxuXG4jIFx0fSlcblxuIyBcdCNUT0RPIHJlbW92ZVxuIyBcdF8uZWFjaCBbXSwgKHZhbHVlLCBrZXksIGxpc3QpLT4gI0NyZWF0b3IuQ29sbGVjdGlvbnNcbiMgXHRcdGlmIG5vdCBDcmVhdG9yLmdldE9iamVjdChrZXkpPy5lbmFibGVfYXBpXG4jIFx0XHRcdHJldHVyblxuXG4jIFx0XHRpZiBTdGVlZG9zT2RhdGFBUElcblxuIyBcdFx0XHRTdGVlZG9zT2RhdGFBUEkuYWRkQ29sbGVjdGlvbiBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KSxcbiMgXHRcdFx0XHRleGNsdWRlZEVuZHBvaW50czogW11cbiMgXHRcdFx0XHRyb3V0ZU9wdGlvbnM6XG4jIFx0XHRcdFx0XHRhdXRoUmVxdWlyZWQ6IHRydWVcbiMgXHRcdFx0XHRcdHNwYWNlUmVxdWlyZWQ6IGZhbHNlXG4jIFx0XHRcdFx0ZW5kcG9pbnRzOlxuIyBcdFx0XHRcdFx0Z2V0QWxsOlxuIyBcdFx0XHRcdFx0XHRhY3Rpb246IC0+XG4jIFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihrZXkpXG4jIFx0XHRcdFx0XHRcdFx0aWYgbm90IGNvbGxlY3Rpb25cbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQ29sbGVjdGlvbiBub3QgZm91bmQnfVxuXG4jIFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKEB1cmxQYXJhbXMuc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIG9yIChwZXJtaXNzaW9ucy5hbGxvd1JlYWQgYW5kIEB1c2VySWQpXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHJlbW92ZUludmFsaWRNZXRob2QoQHF1ZXJ5UGFyYW1zKVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRxcyA9IGRlY29kZVVSSUNvbXBvbmVudChxdWVyeXN0cmluZy5zdHJpbmdpZnkoQHF1ZXJ5UGFyYW1zKSlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0Y3JlYXRlUXVlcnkgPSBpZiBxcyB0aGVuIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KHFzKSBlbHNlIG9kYXRhVjRNb25nb2RiLmNyZWF0ZVF1ZXJ5KClcblxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBrZXkgaXMgJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5WydtZXRhZGF0YS5zcGFjZSddID0gQHVybFBhcmFtcy5zcGFjZUlkXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGVRdWVyeS5xdWVyeS5zcGFjZSA9IEB1cmxQYXJhbXMuc3BhY2VJZFxuXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGlmIG5vdCBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3Jkc1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZVF1ZXJ5LnF1ZXJ5Lm93bmVyID0gQHVzZXJJZFxuXG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0aWVzID0gW11cbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgQHF1ZXJ5UGFyYW1zLiR0b3AgaXNudCAnMCdcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChjcmVhdGVRdWVyeS5xdWVyeSwgdmlzaXRvclBhcnNlcihjcmVhdGVRdWVyeSkpLmZldGNoKClcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2Nhbm5lZENvdW50ID0gY29sbGVjdGlvbi5maW5kKGNyZWF0ZVF1ZXJ5LnF1ZXJ5KS5jb3VudCgpXG5cbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXRpZXNcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWFsV2l0aEV4cGFuZChjcmVhdGVRdWVyeSwgZW50aXRpZXMsIGtleSwgQHVybFBhcmFtcy5zcGFjZUlkKVxuXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keSA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVycyA9IHt9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keVsnQG9kYXRhLmNvbnRleHQnXSA9IFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoKEB1cmxQYXJhbXMuc3BhY2VJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHlbJ0BvZGF0YS5jb3VudCddID0gc2Nhbm5lZENvdW50XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keVsndmFsdWUnXSA9IGVudGl0aWVzXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snQ29udGVudC10eXBlJ10gPSAnYXBwbGljYXRpb24vanNvbjtvZGF0YS5tZXRhZGF0YT1taW5pbWFsO2NoYXJzZXQ9dXRmLTgnXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0aGVhZGVyc1snT0RhdGEtVmVyc2lvbiddID0gU3RlZWRvc09EYXRhLlZFUlNJT05cbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7Ym9keTogYm9keSwgaGVhZGVyczogaGVhZGVyc31cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nfVxuIyBcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwMFxuIyBcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnQWN0aW9uIG5vdCBwZXJtaXR0ZWQnfVxuIyBcdFx0XHRcdFx0cG9zdDpcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cblxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gQHNwYWNlSWRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0aWYgZW50aXR5XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCB2YWx1ZTogZW50aXR5fVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCd9XG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XG4jIFx0XHRcdFx0XHRnZXQ6XG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XG5cbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd1JlYWRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkLCBzcGFjZTogQHNwYWNlSWR9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBzZWxlY3RvclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIHZhbHVlOiBlbnRpdHl9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XG4jIFx0XHRcdFx0XHRwdXQ6XG4jIFx0XHRcdFx0XHRcdGFjdGlvbjogLT5cbiMgXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBub3QgY29sbGVjdGlvblxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdDb2xsZWN0aW9uIG5vdCBmb3VuZCd9XG5cbiMgXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoQHNwYWNlSWQsIEB1c2VySWQsIGtleSlcbiMgXHRcdFx0XHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5hbGxvd0VkaXRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkLCBzcGFjZTogQHNwYWNlSWR9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCAkc2V0OiBAYm9keVBhcmFtc1xuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgdmFsdWU6IGVudGl0eX1cbiMgXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiMgXHRcdFx0XHRcdFx0XHRlbHNlXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0FjdGlvbiBub3QgcGVybWl0dGVkJ31cbiMgXHRcdFx0XHRcdGRlbGV0ZTpcbiMgXHRcdFx0XHRcdFx0YWN0aW9uOiAtPlxuIyBcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oa2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIG5vdCBjb2xsZWN0aW9uXG4jIFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0NvbGxlY3Rpb24gbm90IGZvdW5kJ31cblxuIyBcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhAc3BhY2VJZCwgQHVzZXJJZCwga2V5KVxuIyBcdFx0XHRcdFx0XHRcdGlmIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlXG4jIFx0XHRcdFx0XHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZCwgc3BhY2U6IEBzcGFjZUlkfVxuIyBcdFx0XHRcdFx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxuIyBcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCd9XG4jIFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcbiMgXHRcdFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XG4jIFx0XHRcdFx0XHRcdFx0ZWxzZVxuIyBcdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDAwXG4jIFx0XHRcdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdBY3Rpb24gbm90IHBlcm1pdHRlZCd9XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIE1ldGVvck9EYXRhQVBJVjRSb3V0ZXIsIE1ldGVvck9EYXRhUm91dGVyLCBPRGF0YVJvdXRlciwgYXBwLCBleHByZXNzO1xuICBNZXRlb3JPRGF0YVJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5NZXRlb3JPRGF0YVJvdXRlcjtcbiAgT0RhdGFSb3V0ZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJykuT0RhdGFSb3V0ZXI7XG4gIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG4gIGFwcCA9IGV4cHJlc3MoKTtcbiAgYXBwLnVzZSgnL2FwaS9vZGF0YS92NCcsIE1ldGVvck9EYXRhUm91dGVyKTtcbiAgTWV0ZW9yT0RhdGFBUElWNFJvdXRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKS5NZXRlb3JPRGF0YUFQSVY0Um91dGVyO1xuICBpZiAoTWV0ZW9yT0RhdGFBUElWNFJvdXRlcikge1xuICAgIGFwcC51c2UoJy9hcGkvdjQnLCBNZXRlb3JPRGF0YUFQSVY0Um91dGVyKTtcbiAgfVxuICBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShhcHApO1xuICByZXR1cm4gXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgdmFyIG90aGVyQXBwO1xuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIG90aGVyQXBwID0gZXhwcmVzcygpO1xuICAgICAgb3RoZXJBcHAudXNlKFwiL2FwaS9vZGF0YS9cIiArIG5hbWUsIE9EYXRhUm91dGVyKTtcbiAgICAgIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShvdGhlckFwcCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXG5iYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJylcblxuYXV0aG9yaXphdGlvbkNhY2hlID0ge31cblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSAnL2FwaS9vZGF0YS92NC8nLCAocmVxLCByZXMsIG5leHQpLT5cblxuXHRGaWJlcigoKS0+XG5cdFx0aWYgIXJlcS51c2VySWRcblx0XHRcdGlzQXV0aGVkID0gZmFsc2Vcblx0XHRcdCMgb2F1dGgy6aqM6K+BXG5cdFx0XHRpZiByZXE/LnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cblx0XHRcdFx0Y29uc29sZS5sb2cgJ09BdXRoMjogJywgcmVxLnF1ZXJ5LmFjY2Vzc190b2tlblxuXHRcdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihyZXEucXVlcnkuYWNjZXNzX3Rva2VuKVxuXHRcdFx0XHRpZiB1c2VySWRcblx0XHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblx0XHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcblx0XHRcdCMgYmFzaWPpqozor4Fcblx0XHRcdGlmIHJlcS5oZWFkZXJzWydhdXRob3JpemF0aW9uJ11cblx0XHRcdFx0YXV0aCA9IGJhc2ljQXV0aC5wYXJzZShyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKVxuXHRcdFx0XHRpZiBhdXRoXG5cdFx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHt1c2VybmFtZTogYXV0aC5uYW1lfSwgeyBmaWVsZHM6IHsgJ3NlcnZpY2VzJzogMSB9IH0pXG5cdFx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdFx0aWYgYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPT0gYXV0aC5wYXNzXG5cdFx0XHRcdFx0XHRcdGlzQXV0aGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCB1c2VyLCBhdXRoLnBhc3Ncblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGlmICFyZXN1bHQuZXJyb3Jcblx0XHRcdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRpZiBfLmtleXMoYXV0aG9yaXphdGlvbkNhY2hlKS5sZW5ndGggPiAxMDBcblx0XHRcdFx0XHRcdFx0XHRcdGF1dGhvcml6YXRpb25DYWNoZSA9IHt9XG5cdFx0XHRcdFx0XHRcdFx0YXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPSBhdXRoLnBhc3Ncblx0XHRcdGlmIGlzQXV0aGVkXG5cdFx0XHRcdHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSA9IHVzZXIuX2lkXG5cdFx0XHRcdHRva2VuID0gbnVsbFxuXHRcdFx0XHRhcHBfaWQgPSBcImNyZWF0b3JcIlxuXHRcdFx0XHRjbGllbnRfaWQgPSBcInBjXCJcblx0XHRcdFx0bG9naW5Ub2tlbnMgPSB1c2VyLnNlcnZpY2VzPy5yZXN1bWU/LmxvZ2luVG9rZW5zXG5cdFx0XHRcdGlmIGxvZ2luVG9rZW5zXG5cdFx0XHRcdFx0YXBwX2xvZ2luX3Rva2VuID0gXy5maW5kKGxvZ2luVG9rZW5zLCAodCktPlxuXHRcdFx0XHRcdFx0cmV0dXJuIHQuYXBwX2lkIGlzIGFwcF9pZCBhbmQgdC5jbGllbnRfaWQgaXMgY2xpZW50X2lkXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdHRva2VuID0gYXBwX2xvZ2luX3Rva2VuLnRva2VuIGlmIGFwcF9sb2dpbl90b2tlblxuXG5cdFx0XHRcdGlmIG5vdCB0b2tlblxuXHRcdFx0XHRcdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcblx0XHRcdFx0XHR0b2tlbiA9IGF1dGhUb2tlbi50b2tlblxuXHRcdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4gYXV0aFRva2VuXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4uYXBwX2lkID0gYXBwX2lkXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4uY2xpZW50X2lkID0gY2xpZW50X2lkXG5cdFx0XHRcdFx0aGFzaGVkVG9rZW4udG9rZW4gPSB0b2tlblxuXHRcdFx0XHRcdEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIHVzZXIuX2lkLCBoYXNoZWRUb2tlblxuXG5cdFx0XHRcdGlmIHRva2VuXG5cdFx0XHRcdFx0cmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddID0gdG9rZW5cblx0XHRuZXh0KClcblx0KS5ydW4oKVxuIiwidmFyIEZpYmVyLCBhdXRob3JpemF0aW9uQ2FjaGUsIGJhc2ljQXV0aDtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpO1xuXG5hdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL2FwaS9vZGF0YS92NC8nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFwcF9pZCwgYXBwX2xvZ2luX3Rva2VuLCBhdXRoLCBhdXRoVG9rZW4sIGNsaWVudF9pZCwgaGFzaGVkVG9rZW4sIGlzQXV0aGVkLCBsb2dpblRva2VucywgcmVmLCByZWYxLCByZWYyLCByZXN1bHQsIHRva2VuLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFyZXEudXNlcklkKSB7XG4gICAgICBpc0F1dGhlZCA9IGZhbHNlO1xuICAgICAgaWYgKHJlcSAhPSBudWxsID8gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ09BdXRoMjogJywgcmVxLnF1ZXJ5LmFjY2Vzc190b2tlbik7XG4gICAgICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIF9pZDogdXNlcklkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddKSB7XG4gICAgICAgIGF1dGggPSBiYXNpY0F1dGgucGFyc2UocmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSk7XG4gICAgICAgIGlmIChhdXRoKSB7XG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoLm5hbWVcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgJ3NlcnZpY2VzJzogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICBpZiAoYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPT09IGF1dGgucGFzcykge1xuICAgICAgICAgICAgICBpc0F1dGhlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBhdXRoLnBhc3MpO1xuICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5lcnJvcikge1xuICAgICAgICAgICAgICAgIGlzQXV0aGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoXy5rZXlzKGF1dGhvcml6YXRpb25DYWNoZSkubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uQ2FjaGUgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbkNhY2hlW2F1dGgubmFtZV0gPSBhdXRoLnBhc3M7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0F1dGhlZCkge1xuICAgICAgICByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gPSB1c2VyLl9pZDtcbiAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICBhcHBfaWQgPSBcImNyZWF0b3JcIjtcbiAgICAgICAgY2xpZW50X2lkID0gXCJwY1wiO1xuICAgICAgICBsb2dpblRva2VucyA9IChyZWYxID0gdXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5yZXN1bWUpICE9IG51bGwgPyByZWYyLmxvZ2luVG9rZW5zIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICBpZiAobG9naW5Ub2tlbnMpIHtcbiAgICAgICAgICBhcHBfbG9naW5fdG9rZW4gPSBfLmZpbmQobG9naW5Ub2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LmFwcF9pZCA9PT0gYXBwX2lkICYmIHQuY2xpZW50X2lkID09PSBjbGllbnRfaWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGFwcF9sb2dpbl90b2tlbikge1xuICAgICAgICAgICAgdG9rZW4gPSBhcHBfbG9naW5fdG9rZW4udG9rZW47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICAgICAgICAgIHRva2VuID0gYXV0aFRva2VuLnRva2VuO1xuICAgICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgICBoYXNoZWRUb2tlbi5hcHBfaWQgPSBhcHBfaWQ7XG4gICAgICAgICAgaGFzaGVkVG9rZW4uY2xpZW50X2lkID0gY2xpZW50X2lkO1xuICAgICAgICAgIGhhc2hlZFRva2VuLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4odXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV4dCgpO1xuICB9KS5ydW4oKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0U2VydmljZU1ldGFkYXRhID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YScpLlNlcnZpY2VNZXRhZGF0YTtcblx0U2VydmljZURvY3VtZW50ID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1kb2N1bWVudCcpLlNlcnZpY2VEb2N1bWVudDtcblx0X05VTUJFUl9UWVBFUyA9IFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCJdXG5cblx0X0JPT0xFQU5fVFlQRVMgPSBbXCJib29sZWFuXCJdXG5cblx0X0RBVEVUSU1FX09GRlNFVF9UWVBFUyA9IFsnZGF0ZXRpbWUnXVxuXG5cdF9OQU1FU1BBQ0UgPSBcIkNyZWF0b3JFbnRpdGllc1wiXG5cblx0Z2V0T2JqZWN0c09kYXRhU2NoZW1hID0gKHNwYWNlSWQpLT5cblx0XHRzY2hlbWEgPSB7dmVyc2lvbjogU3RlZWRvc09EYXRhLlZFUlNJT04sIGRhdGFTZXJ2aWNlczoge3NjaGVtYTogW119fVxuXG5cdFx0ZW50aXRpZXNfc2NoZW1hID0ge31cblxuXHRcdGVudGl0aWVzX3NjaGVtYS5uYW1lc3BhY2UgPSBfTkFNRVNQQUNFXG5cblx0XHRlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSA9IFtdXG5cblx0XHRlbnRpdGllc19zY2hlbWEuYW5ub3RhdGlvbnMgPSBbXVxuXG5cdFx0Xy5lYWNoIENyZWF0b3IuQ29sbGVjdGlvbnMsICh2YWx1ZSwga2V5LCBsaXN0KS0+XG5cdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qoa2V5LCBzcGFjZUlkKVxuXHRcdFx0aWYgbm90IF9vYmplY3Q/LmVuYWJsZV9hcGlcblx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdCMg5Li76ZSuXG5cdFx0XHRrZXlzID0gW3twcm9wZXJ0eVJlZjoge25hbWU6IFwiX2lkXCIsIGNvbXB1dGVkS2V5OiB0cnVlfX1dXG5cblx0XHRcdGVudGl0aWUgPSB7XG5cdFx0XHRcdG5hbWU6IF9vYmplY3QubmFtZVxuXHRcdFx0XHRrZXk6a2V5c1xuXHRcdFx0fVxuXG5cdFx0XHRrZXlzLmZvckVhY2ggKF9rZXkpLT5cblx0XHRcdFx0ZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zLnB1c2gge1xuXHRcdFx0XHRcdHRhcmdldDogX05BTUVTUEFDRSArIFwiLlwiICsgX29iamVjdC5uYW1lICsgXCIvXCIgKyBfa2V5LnByb3BlcnR5UmVmLm5hbWUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbjogW3tcblx0XHRcdFx0XHRcdFwidGVybVwiOiBcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbXB1dGVkXCIsXG5cdFx0XHRcdFx0XHRcImJvb2xcIjogXCJ0cnVlXCJcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9XG5cblx0XHRcdCMgRW50aXR5VHlwZVxuXHRcdFx0cHJvcGVydHkgPSBbXVxuXHRcdFx0cHJvcGVydHkucHVzaCB7bmFtZTogXCJfaWRcIiwgdHlwZTogXCJFZG0uU3RyaW5nXCIsIG51bGxhYmxlOiBmYWxzZX1cblxuXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5ID0gW11cblxuXHRcdFx0Xy5mb3JFYWNoIF9vYmplY3QuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblxuXHRcdFx0XHRfcHJvcGVydHkgPSB7bmFtZTogZmllbGRfbmFtZSwgdHlwZTogXCJFZG0uU3RyaW5nXCJ9XG5cblx0XHRcdFx0aWYgXy5jb250YWlucyBfTlVNQkVSX1RZUEVTLCBmaWVsZC50eXBlXG5cdFx0XHRcdFx0X3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Eb3VibGVcIlxuXHRcdFx0XHRlbHNlIGlmIF8uY29udGFpbnMgX0JPT0xFQU5fVFlQRVMsIGZpZWxkLnR5cGVcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkJvb2xlYW5cIlxuXHRcdFx0XHRlbHNlIGlmIF8uY29udGFpbnMgX0RBVEVUSU1FX09GRlNFVF9UWVBFUywgZmllbGQudHlwZVxuXHRcdFx0XHRcdF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIlxuXHRcdFx0XHRcdF9wcm9wZXJ0eS5wcmVjaXNpb24gPSBcIjhcIlxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlcXVpcmVkXG5cdFx0XHRcdFx0X3Byb3BlcnR5Lm51bGxhYmxlID0gZmFsc2VcblxuXHRcdFx0XHRwcm9wZXJ0eS5wdXNoIF9wcm9wZXJ0eVxuXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90b1xuXHRcdFx0XHRcdGlmICFfLmlzQXJyYXkocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX3RvID0gW3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdHJlZmVyZW5jZV90by5mb3JFYWNoIChyKS0+XG5cdFx0XHRcdFx0XHRyZWZlcmVuY2Vfb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qociwgc3BhY2VJZClcblx0XHRcdFx0XHRcdGlmIHJlZmVyZW5jZV9vYmpcblx0XHRcdFx0XHRcdFx0X25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVhcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lXG5cdFx0XHRcdFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eS5wdXNoIHtcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBfbmFtZSxcblx0I1x0XHRcdFx0XHRcdFx0dHlwZTogXCJDb2xsZWN0aW9uKFwiICsgX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lICsgXCIpXCIsXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lXG5cdFx0XHRcdFx0XHRcdFx0cGFydG5lcjogX29iamVjdC5uYW1lICNUT0RPXG5cdFx0XHRcdFx0XHRcdFx0X3JlX25hbWU6IHJlZmVyZW5jZV9vYmoubmFtZVxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludDogW1xuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eTogZmllbGRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlZFByb3BlcnR5OiBcIl9pZFwiXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybiBcInJlZmVyZW5jZSB0byAnI3tyfScgaW52YWxpZC5cIlxuXG5cdFx0XHRlbnRpdGllLnByb3BlcnR5ID0gcHJvcGVydHlcblx0XHRcdGVudGl0aWUubmF2aWdhdGlvblByb3BlcnR5ID0gbmF2aWdhdGlvblByb3BlcnR5XG5cblx0XHRcdGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLnB1c2ggZW50aXRpZVxuXG5cdFx0c2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaCBlbnRpdGllc19zY2hlbWFcblxuXG5cdFx0Y29udGFpbmVyX3NjaGVtYSA9IHt9XG5cdFx0Y29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIgPSB7bmFtZTogXCJjb250YWluZXJcIn1cblx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQgPSBbXVxuXG5cdFx0Xy5mb3JFYWNoIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLCAoX2V0LCBrKS0+XG5cdFx0XHRjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQucHVzaCB7XG5cdFx0XHRcdFwibmFtZVwiOiBfZXQubmFtZSxcblx0XHRcdFx0XCJlbnRpdHlUeXBlXCI6IF9OQU1FU1BBQ0UgKyBcIi5cIiArIF9ldC5uYW1lLFxuXHRcdFx0XHRcIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIjogW11cblx0XHRcdH1cblxuXHRcdCMgVE9ETyBTZXJ2aWNlTWV0YWRhdGHkuI3mlK/mjIFuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5n5bGe5oCnXG4jXHRcdF8uZm9yRWFjaCBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgKF9ldCwgayktPlxuI1x0XHRcdF8uZm9yRWFjaCBfZXQubmF2aWdhdGlvblByb3BlcnR5LCAoX2V0X25wLCBucF9rKS0+XG4jXHRcdFx0XHRfZXMgPSBfLmZpbmQgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LCAoX2VzKS0+XG4jXHRcdFx0XHRcdFx0XHRyZXR1cm4gX2VzLm5hbWUgPT0gX2V0X25wLnBhcnRuZXJcbiNcbiNcdFx0XHRcdF9lcz8ubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5wdXNoIHtcInBhdGhcIjogX2V0X25wLl9yZV9uYW1lLCBcInRhcmdldFwiOiBfZXRfbnAuX3JlX25hbWV9XG4jXHRcdFx0XHRjb25zb2xlLmxvZyhcIl9lc1wiLCBfZXMpXG4jXG4jXHRcdGNvbnNvbGUubG9nKFwiY29udGFpbmVyX3NjaGVtYVwiLCBKU09OLnN0cmluZ2lmeShjb250YWluZXJfc2NoZW1hKSlcblxuXHRcdHNjaGVtYS5kYXRhU2VydmljZXMuc2NoZW1hLnB1c2ggY29udGFpbmVyX3NjaGVtYVxuXG5cdFx0cmV0dXJuIHNjaGVtYVxuXG5cdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZSgnJywge2F1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRH0sIHtcblx0XHRnZXQ6ICgpLT5cblx0XHRcdGNvbnRleHQgPSBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoKEB1cmxQYXJhbXM/LnNwYWNlSWQpXG5cdFx0XHRzZXJ2aWNlRG9jdW1lbnQgID0gU2VydmljZURvY3VtZW50LnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKEB1cmxQYXJhbXM/LnNwYWNlSWQpLCB7Y29udGV4dDogY29udGV4dH0pO1xuXHRcdFx0Ym9keSA9IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyxcblx0XHRcdFx0XHQnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJvZHk6IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG5cdFx0XHR9O1xuXHR9KVxuXG5cdFN0ZWVkb3NPZGF0YUFQSS5hZGRSb3V0ZShTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCwge2F1dGhSZXF1aXJlZDogU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRH0sIHtcblx0XHRnZXQ6ICgpLT5cblx0XHRcdHNlcnZpY2VNZXRhZGF0YSA9IFNlcnZpY2VNZXRhZGF0YS5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYShAdXJsUGFyYW1zPy5zcGFjZUlkKSlcblx0XHRcdGJvZHkgPSBzZXJ2aWNlTWV0YWRhdGEuZG9jdW1lbnQoKVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sOyBjaGFyc2V0PXV0Zi04Jyxcblx0XHRcdFx0XHQnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJvZHk6IGJvZHlcblx0XHRcdH07XG5cdH0pIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBTZXJ2aWNlRG9jdW1lbnQsIFNlcnZpY2VNZXRhZGF0YSwgX0JPT0xFQU5fVFlQRVMsIF9EQVRFVElNRV9PRkZTRVRfVFlQRVMsIF9OQU1FU1BBQ0UsIF9OVU1CRVJfVFlQRVMsIGdldE9iamVjdHNPZGF0YVNjaGVtYTtcbiAgU2VydmljZU1ldGFkYXRhID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1tZXRhZGF0YScpLlNlcnZpY2VNZXRhZGF0YTtcbiAgU2VydmljZURvY3VtZW50ID0gcmVxdWlyZSgnb2RhdGEtdjQtc2VydmljZS1kb2N1bWVudCcpLlNlcnZpY2VEb2N1bWVudDtcbiAgX05VTUJFUl9UWVBFUyA9IFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCJdO1xuICBfQk9PTEVBTl9UWVBFUyA9IFtcImJvb2xlYW5cIl07XG4gIF9EQVRFVElNRV9PRkZTRVRfVFlQRVMgPSBbJ2RhdGV0aW1lJ107XG4gIF9OQU1FU1BBQ0UgPSBcIkNyZWF0b3JFbnRpdGllc1wiO1xuICBnZXRPYmplY3RzT2RhdGFTY2hlbWEgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGNvbnRhaW5lcl9zY2hlbWEsIGVudGl0aWVzX3NjaGVtYSwgc2NoZW1hO1xuICAgIHNjaGVtYSA9IHtcbiAgICAgIHZlcnNpb246IFN0ZWVkb3NPRGF0YS5WRVJTSU9OLFxuICAgICAgZGF0YVNlcnZpY2VzOiB7XG4gICAgICAgIHNjaGVtYTogW11cbiAgICAgIH1cbiAgICB9O1xuICAgIGVudGl0aWVzX3NjaGVtYSA9IHt9O1xuICAgIGVudGl0aWVzX3NjaGVtYS5uYW1lc3BhY2UgPSBfTkFNRVNQQUNFO1xuICAgIGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlID0gW107XG4gICAgZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zID0gW107XG4gICAgXy5lYWNoKENyZWF0b3IuQ29sbGVjdGlvbnMsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGxpc3QpIHtcbiAgICAgIHZhciBfb2JqZWN0LCBlbnRpdGllLCBrZXlzLCBuYXZpZ2F0aW9uUHJvcGVydHksIHByb3BlcnR5O1xuICAgICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZCk7XG4gICAgICBpZiAoIShfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmVuYWJsZV9hcGkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGtleXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm9wZXJ0eVJlZjoge1xuICAgICAgICAgICAgbmFtZTogXCJfaWRcIixcbiAgICAgICAgICAgIGNvbXB1dGVkS2V5OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgZW50aXRpZSA9IHtcbiAgICAgICAgbmFtZTogX29iamVjdC5uYW1lLFxuICAgICAgICBrZXk6IGtleXNcbiAgICAgIH07XG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oX2tleSkge1xuICAgICAgICByZXR1cm4gZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zLnB1c2goe1xuICAgICAgICAgIHRhcmdldDogX05BTUVTUEFDRSArIFwiLlwiICsgX29iamVjdC5uYW1lICsgXCIvXCIgKyBfa2V5LnByb3BlcnR5UmVmLm5hbWUsXG4gICAgICAgICAgYW5ub3RhdGlvbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRlcm1cIjogXCJPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZFwiLFxuICAgICAgICAgICAgICBcImJvb2xcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBwcm9wZXJ0eSA9IFtdO1xuICAgICAgcHJvcGVydHkucHVzaCh7XG4gICAgICAgIG5hbWU6IFwiX2lkXCIsXG4gICAgICAgIHR5cGU6IFwiRWRtLlN0cmluZ1wiLFxuICAgICAgICBudWxsYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgbmF2aWdhdGlvblByb3BlcnR5ID0gW107XG4gICAgICBfLmZvckVhY2goX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICAgIHZhciBfcHJvcGVydHksIHJlZmVyZW5jZV90bztcbiAgICAgICAgX3Byb3BlcnR5ID0ge1xuICAgICAgICAgIG5hbWU6IGZpZWxkX25hbWUsXG4gICAgICAgICAgdHlwZTogXCJFZG0uU3RyaW5nXCJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKF8uY29udGFpbnMoX05VTUJFUl9UWVBFUywgZmllbGQudHlwZSkpIHtcbiAgICAgICAgICBfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRvdWJsZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKF8uY29udGFpbnMoX0JPT0xFQU5fVFlQRVMsIGZpZWxkLnR5cGUpKSB7XG4gICAgICAgICAgX3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Cb29sZWFuXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5jb250YWlucyhfREFURVRJTUVfT0ZGU0VUX1RZUEVTLCBmaWVsZC50eXBlKSkge1xuICAgICAgICAgIF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjtcbiAgICAgICAgICBfcHJvcGVydHkucHJlY2lzaW9uID0gXCI4XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICAgICAgX3Byb3BlcnR5Lm51bGxhYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcHJvcGVydHkucHVzaChfcHJvcGVydHkpO1xuICAgICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgIGlmIChyZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoIV8uaXNBcnJheShyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICByZWZlcmVuY2VfdG8gPSBbcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIHZhciBfbmFtZSwgcmVmZXJlbmNlX29iajtcbiAgICAgICAgICAgIHJlZmVyZW5jZV9vYmogPSBDcmVhdG9yLmdldE9iamVjdChyLCBzcGFjZUlkKTtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2Vfb2JqKSB7XG4gICAgICAgICAgICAgIF9uYW1lID0gZmllbGRfbmFtZSArIFN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYO1xuICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBuYXZpZ2F0aW9uUHJvcGVydHkucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogX25hbWUsXG4gICAgICAgICAgICAgICAgdHlwZTogX05BTUVTUEFDRSArIFwiLlwiICsgcmVmZXJlbmNlX29iai5uYW1lLFxuICAgICAgICAgICAgICAgIHBhcnRuZXI6IF9vYmplY3QubmFtZSxcbiAgICAgICAgICAgICAgICBfcmVfbmFtZTogcmVmZXJlbmNlX29iai5uYW1lLFxuICAgICAgICAgICAgICAgIHJlZmVyZW50aWFsQ29uc3RyYWludDogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogZmllbGRfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlZFByb3BlcnR5OiBcIl9pZFwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oXCJyZWZlcmVuY2UgdG8gJ1wiICsgciArIFwiJyBpbnZhbGlkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBlbnRpdGllLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgICBlbnRpdGllLm5hdmlnYXRpb25Qcm9wZXJ0eSA9IG5hdmlnYXRpb25Qcm9wZXJ0eTtcbiAgICAgIHJldHVybiBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZS5wdXNoKGVudGl0aWUpO1xuICAgIH0pO1xuICAgIHNjaGVtYS5kYXRhU2VydmljZXMuc2NoZW1hLnB1c2goZW50aXRpZXNfc2NoZW1hKTtcbiAgICBjb250YWluZXJfc2NoZW1hID0ge307XG4gICAgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIgPSB7XG4gICAgICBuYW1lOiBcImNvbnRhaW5lclwiXG4gICAgfTtcbiAgICBjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQgPSBbXTtcbiAgICBfLmZvckVhY2goZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUsIGZ1bmN0aW9uKF9ldCwgaykge1xuICAgICAgcmV0dXJuIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldC5wdXNoKHtcbiAgICAgICAgXCJuYW1lXCI6IF9ldC5uYW1lLFxuICAgICAgICBcImVudGl0eVR5cGVcIjogX05BTUVTUEFDRSArIFwiLlwiICsgX2V0Lm5hbWUsXG4gICAgICAgIFwibmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiOiBbXVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgc2NoZW1hLmRhdGFTZXJ2aWNlcy5zY2hlbWEucHVzaChjb250YWluZXJfc2NoZW1hKTtcbiAgICByZXR1cm4gc2NoZW1hO1xuICB9O1xuICBTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJycsIHtcbiAgICBhdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRURcbiAgfSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm9keSwgY29udGV4dCwgcmVmLCByZWYxLCBzZXJ2aWNlRG9jdW1lbnQ7XG4gICAgICBjb250ZXh0ID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aCgocmVmID0gdGhpcy51cmxQYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgICBzZXJ2aWNlRG9jdW1lbnQgPSBTZXJ2aWNlRG9jdW1lbnQucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoKHJlZjEgPSB0aGlzLnVybFBhcmFtcykgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCksIHtcbiAgICAgICAgY29udGV4dDogY29udGV4dFxuICAgICAgfSk7XG4gICAgICBib2R5ID0gc2VydmljZURvY3VtZW50LmRvY3VtZW50KCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAnT0RhdGEtVmVyc2lvbic6IFN0ZWVkb3NPRGF0YS5WRVJTSU9OXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEgsIHtcbiAgICBhdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRURcbiAgfSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm9keSwgcmVmLCBzZXJ2aWNlTWV0YWRhdGE7XG4gICAgICBzZXJ2aWNlTWV0YWRhdGEgPSBTZXJ2aWNlTWV0YWRhdGEucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoKHJlZiA9IHRoaXMudXJsUGFyYW1zKSAhPSBudWxsID8gcmVmLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICAgIGJvZHkgPSBzZXJ2aWNlTWV0YWRhdGEuZG9jdW1lbnQoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbDsgY2hhcnNldD11dGYtOCcsXG4gICAgICAgICAgJ09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBib2R5XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIkBTdGVlZG9zT0RhdGEgPSB7fVxuU3RlZWRvc09EYXRhLlZFUlNJT04gPSAnNC4wJ1xuU3RlZWRvc09EYXRhLkFVVEhSRVFVSVJFRCA9IHRydWVcblN0ZWVkb3NPRGF0YS5BUElfUEFUSCA9ICcvYXBpL29kYXRhL3Y0LzpzcGFjZUlkJ1xuU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEggPSAnJG1ldGFkYXRhJ1xuU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVggPSBcIl9leHBhbmRcIlxuU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoID0gKHNwYWNlSWQpLT5cblx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgnYXBpL29kYXRhL3Y0LycgKyBzcGFjZUlkKVxuXG5TdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoID0gKHNwYWNlSWQsb2JqZWN0X25hbWUpLT5cblx0cmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIFwiLyN7b2JqZWN0X25hbWV9XCJcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGggPSAoc3BhY2VJZCktPlxuXHRcdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je1N0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIfVwiXG5cblx0U3RlZWRvc09EYXRhLmdldE9EYXRhQ29udGV4dFBhdGggPSAoc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIFwiIyN7b2JqZWN0X25hbWV9XCJcblx0U3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoID0gKHNwYWNlSWQsb2JqZWN0X25hbWUpLT5cblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgXCIvI3tvYmplY3RfbmFtZX1cIlxuXG5cblx0QFN0ZWVkb3NPZGF0YUFQSSA9IG5ldyBPZGF0YVJlc3RpdnVzXG5cdFx0YXBpUGF0aDogU3RlZWRvc09EYXRhLkFQSV9QQVRILFxuXHRcdHVzZURlZmF1bHRBdXRoOiB0cnVlXG5cdFx0cHJldHR5SnNvbjogdHJ1ZVxuXHRcdGVuYWJsZUNvcnM6IHRydWVcblx0XHRkZWZhdWx0SGVhZGVyczpcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiIsInRoaXMuU3RlZWRvc09EYXRhID0ge307XG5cblN0ZWVkb3NPRGF0YS5WRVJTSU9OID0gJzQuMCc7XG5cblN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUQgPSB0cnVlO1xuXG5TdGVlZG9zT0RhdGEuQVBJX1BBVEggPSAnL2FwaS9vZGF0YS92NC86c3BhY2VJZCc7XG5cblN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIID0gJyRtZXRhZGF0YSc7XG5cblN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYID0gXCJfZXhwYW5kXCI7XG5cblN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgnYXBpL29kYXRhL3Y0LycgKyBzcGFjZUlkKTtcbn07XG5cblN0ZWVkb3NPRGF0YS5nZXRPRGF0YVBhdGggPSBmdW5jdGlvbihzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyAoXCIvXCIgKyBTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCk7XG4gIH07XG4gIFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChzcGFjZUlkKSArIChcIiNcIiArIG9iamVjdF9uYW1lKTtcbiAgfTtcbiAgU3RlZWRvc09EYXRhLmdldE9EYXRhTmV4dExpbmtQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgb2JqZWN0X25hbWUpO1xuICB9O1xuICB0aGlzLlN0ZWVkb3NPZGF0YUFQSSA9IG5ldyBPZGF0YVJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiBTdGVlZG9zT0RhdGEuQVBJX1BBVEgsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiB0cnVlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
