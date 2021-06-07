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
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var HuaweiPush = Package['steedos:huaweipush'].HuaweiPush;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare, ironRouterSendErrorToResponse, msg;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:api":{"checkNpm.js":function module(require,exports,module){

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
  'xiaomi-push': '>=0.4.5'
}, 'steedos:api');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_files.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/parse_files.coffee                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Busboy, Fiber;
Busboy = require('busboy');
Fiber = require('fibers');

JsonRoutes.parseFiles = function (req, res, next) {
  var busboy, files;
  files = [];

  if (req.method === "POST") {
    busboy = new Busboy({
      headers: req.headers
    });
    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      var buffers, image;
      image = {};
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"restivus":{"auth.coffee":function module(){

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

    if (space && Steedos.hasFeature('paid', su.space) && _.indexOf(space.admins, su.user) >= 0) {
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

},"route.coffee":function module(){

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

},"restivus.coffee":function module(){

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

}}},"core.coffee":function module(){

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

},"steedos":{"space_users.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/steedos/space_users.coffee                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return API.addCollection(db.space_users, {
    excludedEndpoints: [],
    routeOptions: {
      authRequired: true,
      spaceRequired: true
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"organizations.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/steedos/organizations.coffee                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return API.addCollection(db.organizations, {
    excludedEndpoints: [],
    routeOptions: {
      authRequired: true,
      spaceRequired: true
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"s3.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/routes/s3.coffee                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.add("post", "/api/v4/instances/s3/", function (req, res, next) {
  var collection;
  collection = cfs.instances;
  return JsonRoutes.parseFiles(req, res, function () {
    var newFile;

    if (req.files && req.files[0]) {
      newFile = new FS.File();
      newFile.attachData(req.files[0].data, {
        type: req.files[0].mimeType
      }, function (err) {
        var body, e, fileObj, filename, metadata, parent, r;
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
      });
      return newFile.once('stored', function (storeName) {
        var resp, size;
        size = newFile.original.size;

        if (!size) {
          size = 1024;
        }

        resp = {
          version_id: newFile._id,
          size: size
        };
        res.end(JSON.stringify(resp));
      });
    } else {
      res.statusCode = 500;
      res.end();
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

},"push.coffee":function module(){

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

},"aliyun_push.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/routes/aliyun_push.coffee                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Aliyun_push;
Aliyun_push = {};

Aliyun_push.sendMessage = function (userTokens, notification, callback) {
  var ALY, ALYPUSH, MiPush, Xinge, XingeApp, aliyunTokens, androidMessage, data, huaweiTokens, miTokens, msg, noti, package_name, ref, ref1, ref2, ref3, tokenDataList, xingeTokens;

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
      ALY = require('aliyun-sdk');

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
      Xinge = require('xinge');

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
      MiPush = require('xiaomi-push');

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
require("/node_modules/meteor/steedos:api/parse_files.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/auth.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/iron-router-error-to-response.js");
require("/node_modules/meteor/steedos:api/lib/restivus/route.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/restivus.coffee");
require("/node_modules/meteor/steedos:api/core.coffee");
require("/node_modules/meteor/steedos:api/steedos/space_users.coffee");
require("/node_modules/meteor/steedos:api/steedos/organizations.coffee");
require("/node_modules/meteor/steedos:api/routes/s3.coffee");
require("/node_modules/meteor/steedos:api/routes/push.coffee");
require("/node_modules/meteor/steedos:api/routes/aliyun_push.coffee");

/* Exports */
Package._define("steedos:api");

})();

//# sourceURL=meteor://💻app/packages/steedos_api.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3BhcnNlX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFyc2VfZmlsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvbGliL3Jlc3RpdnVzL2lyb24tcm91dGVyLWVycm9yLXRvLXJlc3BvbnNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3N0ZWVkb3Mvc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zdGVlZG9zL3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsIkJ1c2JveSIsIkZpYmVyIiwicmVxdWlyZSIsIkpzb25Sb3V0ZXMiLCJwYXJzZUZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImZpbGVzIiwibWV0aG9kIiwiaGVhZGVycyIsIm9uIiwiZmllbGRuYW1lIiwiZmlsZSIsImZpbGVuYW1lIiwiZW5jb2RpbmciLCJtaW1ldHlwZSIsImJ1ZmZlcnMiLCJpbWFnZSIsIm1pbWVUeXBlIiwiZGF0YSIsInB1c2giLCJCdWZmZXIiLCJjb25jYXQiLCJ2YWx1ZSIsImJvZHkiLCJydW4iLCJwaXBlIiwiZ2V0VXNlclF1ZXJ5U2VsZWN0b3IiLCJ1c2VyVmFsaWRhdG9yIiwiQXV0aCIsIk1hdGNoIiwiV2hlcmUiLCJ1c2VyIiwiY2hlY2siLCJpZCIsIk9wdGlvbmFsIiwiU3RyaW5nIiwidXNlcm5hbWUiLCJlbWFpbCIsIl8iLCJrZXlzIiwibGVuZ3RoIiwiRXJyb3IiLCJsb2dpbldpdGhQYXNzd29yZCIsInBhc3N3b3JkIiwiYXV0aFRva2VuIiwiYXV0aGVudGljYXRpbmdVc2VyIiwiYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IiLCJoYXNoZWRUb2tlbiIsInBhc3N3b3JkVmVyaWZpY2F0aW9uIiwicmVmIiwic3BhY2VfdXNlcnMiLCJzcGFjZXMiLCJNZXRlb3IiLCJ1c2VycyIsImZpbmRPbmUiLCJzZXJ2aWNlcyIsIkFjY291bnRzIiwiX2NoZWNrUGFzc3dvcmQiLCJlcnJvciIsIl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuIiwiX2hhc2hTdGFtcGVkVG9rZW4iLCJfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiIsIl9pZCIsImRiIiwiZmluZCIsImZldGNoIiwiZWFjaCIsInN1Iiwic3BhY2UiLCJTdGVlZG9zIiwiaGFzRmVhdHVyZSIsImluZGV4T2YiLCJhZG1pbnMiLCJuYW1lIiwidG9rZW4iLCJ1c2VySWQiLCJhZG1pblNwYWNlcyIsImVudiIsInByb2Nlc3MiLCJOT0RFX0VOViIsImlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlIiwiZXJyIiwic3RhdHVzQ29kZSIsInN0YXR1cyIsIm1zZyIsInN0YWNrIiwidG9TdHJpbmciLCJjb25zb2xlIiwiaGVhZGVyc1NlbnQiLCJzb2NrZXQiLCJkZXN0cm95Iiwic2V0SGVhZGVyIiwiYnl0ZUxlbmd0aCIsImVuZCIsInNoYXJlIiwiUm91dGUiLCJhcGkiLCJwYXRoIiwib3B0aW9ucyIsImVuZHBvaW50czEiLCJlbmRwb2ludHMiLCJwcm90b3R5cGUiLCJhZGRUb0FwaSIsImF2YWlsYWJsZU1ldGhvZHMiLCJhbGxvd2VkTWV0aG9kcyIsImZ1bGxQYXRoIiwicmVqZWN0ZWRNZXRob2RzIiwic2VsZiIsImNvbnRhaW5zIiwiX2NvbmZpZyIsInBhdGhzIiwiZXh0ZW5kIiwiZGVmYXVsdE9wdGlvbnNFbmRwb2ludCIsIl9yZXNvbHZlRW5kcG9pbnRzIiwiX2NvbmZpZ3VyZUVuZHBvaW50cyIsImZpbHRlciIsInJlamVjdCIsImFwaVBhdGgiLCJlbmRwb2ludCIsImFkZCIsImRvbmVGdW5jIiwiZW5kcG9pbnRDb250ZXh0IiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VJbml0aWF0ZWQiLCJ1cmxQYXJhbXMiLCJwYXJhbXMiLCJxdWVyeVBhcmFtcyIsInF1ZXJ5IiwiYm9keVBhcmFtcyIsInJlcXVlc3QiLCJyZXNwb25zZSIsImRvbmUiLCJfY2FsbEVuZHBvaW50IiwiZXJyb3IxIiwiX3Jlc3BvbmQiLCJtZXNzYWdlIiwiam9pbiIsInRvVXBwZXJDYXNlIiwiaXNGdW5jdGlvbiIsImFjdGlvbiIsInJlZjEiLCJyZWYyIiwicm9sZVJlcXVpcmVkIiwidW5pb24iLCJpc0VtcHR5IiwiYXV0aFJlcXVpcmVkIiwic3BhY2VSZXF1aXJlZCIsImludm9jYXRpb24iLCJfYXV0aEFjY2VwdGVkIiwiX3JvbGVBY2NlcHRlZCIsIl9zcGFjZUFjY2VwdGVkIiwiRERQQ29tbW9uIiwiTWV0aG9kSW52b2NhdGlvbiIsImlzU2ltdWxhdGlvbiIsImNvbm5lY3Rpb24iLCJyYW5kb21TZWVkIiwibWFrZVJwY1NlZWQiLCJERFAiLCJfQ3VycmVudEludm9jYXRpb24iLCJ3aXRoVmFsdWUiLCJjYWxsIiwiX2F1dGhlbnRpY2F0ZSIsImF1dGgiLCJ1c2VyU2VsZWN0b3IiLCJzcGFjZV91c2Vyc19jb3VudCIsInNwYWNlSWQiLCJjb3VudCIsImludGVyc2VjdGlvbiIsInJvbGVzIiwiZGVmYXVsdEhlYWRlcnMiLCJkZWxheUluTWlsbGlzZWNvbmRzIiwibWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMiLCJyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byIsInNlbmRSZXNwb25zZSIsIl9sb3dlckNhc2VLZXlzIiwibWF0Y2giLCJwcmV0dHlKc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlSGVhZCIsIndyaXRlIiwiTWF0aCIsInJhbmRvbSIsInNldFRpbWVvdXQiLCJvYmplY3QiLCJjaGFpbiIsInBhaXJzIiwibWFwIiwiYXR0ciIsInRvTG93ZXJDYXNlIiwiUmVzdGl2dXMiLCJpdGVtIiwiaSIsImwiLCJjb3JzSGVhZGVycyIsIl9yb3V0ZXMiLCJ1c2VEZWZhdWx0QXV0aCIsInZlcnNpb24iLCJfdXNlciIsIl9oYXNoTG9naW5Ub2tlbiIsImVuYWJsZUNvcnMiLCJzbGljZSIsImxhc3QiLCJfaW5pdEF1dGgiLCJ1c2VBdXRoIiwid2FybiIsImFkZFJvdXRlIiwicm91dGUiLCJhZGRDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FbmRwb2ludHMiLCJjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMiLCJlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24iLCJlbnRpdHlSb3V0ZUVuZHBvaW50cyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwibWV0aG9kcyIsIm1ldGhvZHNPbkNvbGxlY3Rpb24iLCJyb3V0ZU9wdGlvbnMiLCJfdXNlckNvbGxlY3Rpb25FbmRwb2ludHMiLCJfY29sbGVjdGlvbkVuZHBvaW50cyIsIl9uYW1lIiwiY29uZmlndXJlZEVuZHBvaW50IiwiZW5kcG9pbnRPcHRpb25zIiwibWV0aG9kVHlwZSIsImNsb25lIiwiZ2V0IiwiZW50aXR5Iiwic2VsZWN0b3IiLCJwdXQiLCJlbnRpdHlJc1VwZGF0ZWQiLCJ1cGRhdGUiLCIkc2V0IiwicmVtb3ZlIiwicG9zdCIsImVudGl0eUlkIiwiaW5zZXJ0IiwiZ2V0QWxsIiwiZW50aXRpZXMiLCJmaWVsZHMiLCJwcm9maWxlIiwiY3JlYXRlVXNlciIsImxvZ291dCIsImUiLCJleHRyYURhdGEiLCJzZWFyY2hRdWVyeSIsInJlYXNvbiIsIm9uTG9nZ2VkSW4iLCJleHRyYSIsImluZGV4IiwidG9rZW5GaWVsZE5hbWUiLCJ0b2tlbkxvY2F0aW9uIiwidG9rZW5QYXRoIiwidG9rZW5SZW1vdmFsUXVlcnkiLCJ0b2tlblRvUmVtb3ZlIiwibGFzdEluZGV4T2YiLCJzdWJzdHJpbmciLCIkcHVsbCIsIm9uTG9nZ2VkT3V0IiwiaXNTZXJ2ZXIiLCJBUEkiLCJzdGFydHVwIiwib3JnYW5pemF0aW9ucyIsImNmcyIsImluc3RhbmNlcyIsIm5ld0ZpbGUiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwidHlwZSIsImZpbGVPYmoiLCJtZXRhZGF0YSIsInBhcmVudCIsInIiLCJpbmNsdWRlcyIsIm1vbWVudCIsIkRhdGUiLCJmb3JtYXQiLCJzcGxpdCIsInBvcCIsImRlY29kZVVSSUNvbXBvbmVudCIsInJlcGxhY2UiLCJvd25lciIsIm93bmVyX25hbWUiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwidG9Mb2NhbGVMb3dlckNhc2UiLCJpc19wcml2YXRlIiwibWFpbiIsIiR1bnNldCIsImxvY2tlZF9ieSIsImxvY2tlZF9ieV9uYW1lIiwiJG5lIiwib25jZSIsInN0b3JlTmFtZSIsInJlc3AiLCJzaXplIiwib3JpZ2luYWwiLCJ2ZXJzaW9uX2lkIiwiYWJzb2x1dGVVcmwiLCJwdXNoVG9waWMiLCJ1c2VySWRzIiwiZnJvbSIsImFwcE5hbWUiLCJhbGVydFRpdGxlIiwiYWxlcnQiLCJiYWRnZSIsInNvdW5kIiwiUHVzaCIsInNlbmQiLCJwdXNoU2VuZCIsInRleHQiLCJ0aXRsZSIsIkFsaXl1bl9wdXNoIiwic2VuZE1lc3NhZ2UiLCJ1c2VyVG9rZW5zIiwibm90aWZpY2F0aW9uIiwiY2FsbGJhY2siLCJBTFkiLCJBTFlQVVNIIiwiTWlQdXNoIiwiWGluZ2UiLCJYaW5nZUFwcCIsImFsaXl1blRva2VucyIsImFuZHJvaWRNZXNzYWdlIiwiaHVhd2VpVG9rZW5zIiwibWlUb2tlbnMiLCJub3RpIiwicGFja2FnZV9uYW1lIiwicmVmMyIsInRva2VuRGF0YUxpc3QiLCJ4aW5nZVRva2VucyIsImRlYnVnIiwibG9nIiwiQXJyYXkiLCJmb3JFYWNoIiwidXNlclRva2VuIiwiYXJyIiwic2V0dGluZ3MiLCJhbGl5dW4iLCJQVVNIIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJhcGlWZXJzaW9uIiwiQXBwS2V5IiwiYXBwS2V5IiwiVGFyZ2V0IiwiVGFyZ2V0VmFsdWUiLCJUaXRsZSIsIlN1bW1hcnkiLCJwdXNoTm90aWNlVG9BbmRyb2lkIiwieGluZ2UiLCJhY2Nlc3NJZCIsInNlY3JldEtleSIsIkFuZHJvaWRNZXNzYWdlIiwiTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTiIsImNvbnRlbnQiLCJzdHlsZSIsIlN0eWxlIiwiQ2xpY2tBY3Rpb24iLCJ0IiwicHVzaFRvU2luZ2xlRGV2aWNlIiwiaHVhd2VpIiwiYXBwUGtnTmFtZSIsInBheWxvYWQiLCJIdWF3ZWlQdXNoIiwiY29uZmlnIiwiYXBwSWQiLCJhcHBTZWNyZXQiLCJzZW5kTWFueSIsIm1pIiwiTWVzc2FnZSIsImRlc2NyaXB0aW9uIiwiTm90aWZpY2F0aW9uIiwicHJvZHVjdGlvbiIsInJlZ2lkIiwicmVmNCIsInJlZjUiLCJyZWY2IiwiY3JvbiIsInB1c2hfaW50ZXJ2YWwiLCJrZWVwTm90aWZpY2F0aW9ucyIsInNlbmRJbnRlcnZhbCIsInNlbmRCYXRjaFNpemUiLCJhcG4iLCJrZXlEYXRhIiwiY2VydERhdGEiLCJnY20iLCJwcm9qZWN0TnVtYmVyIiwiYXBpS2V5IiwiQ29uZmlndXJlIiwic2VuZEdDTSIsIm9sZF9zZW5kR0NNIiwic2VuZEFsaXl1biIsInRlc3QiLCJPYmplY3QiLCJyZXN1bHQiLCJjYW5vbmljYWxfaWRzIiwib2xkVG9rZW4iLCJuZXdUb2tlbiIsInJlc3VsdHMiLCJyZWdpc3RyYXRpb25faWQiLCJfcmVwbGFjZVRva2VuIiwiZmFpbHVyZSIsIl9yZW1vdmVUb2tlbiIsImdjbVRva2VucyIsIm9sZF9zZW5kQVBOIiwic2VuZEFQTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQkgsZ0JBQWdCLENBQUM7QUFDaEIsZ0JBQWMsU0FERTtBQUVoQkksUUFBTSxFQUFFLFVBRlE7QUFHaEJDLFNBQU8sRUFBRSxTQUhPO0FBSWhCLFNBQU8sU0FKUztBQUtoQixTQUFPLFVBTFM7QUFNaEIs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QXlCLENBQXpELElBQStEd0gsS0FBS3hILE9BQUwsQ0FBYSxTQUFiLElBQTBCLENBQXpGLElBQStGd0gsS0FBS3hILE9BQUwsQ0FBYSxLQUFiLElBQXNCLENDcUNySDtBRHRDTyxRQUFaOztBQUdBLFVBQUc2TyxLQUFLd0IsS0FBUjtBQUNDclAsZ0JBQVFzUCxHQUFSLENBQVksZUFBWixFQUE4QndFLFVBQVUvVCxRQUFWLEVBQTlCO0FDc0NHOztBRHBDSjhOLFdBQUtxRixVQUFMLENBQWdCdEUsWUFBaEIsRUFBOEJQLFlBQTlCO0FDc0NHLGFEcENIUixLQUFLb0YsV0FBTCxDQUFpQmEsU0FBakIsRUFBNEJ6RixZQUE1QixDQ29DRztBRGpFVyxLQUFmOztBQStCQVIsU0FBS2tHLFdBQUwsR0FBbUJsRyxLQUFLbUcsT0FBeEI7QUNxQ0UsV0RwQ0ZuRyxLQUFLbUcsT0FBTCxHQUFlLFVBQUN2RSxTQUFELEVBQVlwQixZQUFaO0FBQ2QsVUFBQVcsSUFBQTs7QUFBQSxVQUFHWCxhQUFhSixLQUFiLElBQXVCSSxhQUFhTCxJQUF2QztBQUNDZ0IsZUFBT2pTLEVBQUUwTCxLQUFGLENBQVE0RixZQUFSLENBQVA7QUFDQVcsYUFBS2hCLElBQUwsR0FBWWdCLEtBQUtmLEtBQUwsR0FBYSxHQUFiLEdBQW1CZSxLQUFLaEIsSUFBcEM7QUFDQWdCLGFBQUtmLEtBQUwsR0FBYSxFQUFiO0FDc0NJLGVEckNKSixLQUFLa0csV0FBTCxDQUFpQnRFLFNBQWpCLEVBQTRCVCxJQUE1QixDQ3FDSTtBRHpDTDtBQzJDSyxlRHJDSm5CLEtBQUtrRyxXQUFMLENBQWlCdEUsU0FBakIsRUFBNEJwQixZQUE1QixDQ3FDSTtBQUNEO0FEN0NVLEtDb0NiO0FBV0Q7QUQvSkgsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19hcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0J2FsaXl1bi1zZGsnOiAnPj0xLjkuMicsXG5cdGJ1c2JveTogXCI+PTAuMi4xM1wiLFxuXHRjb29raWVzOiBcIj49MC42LjJcIixcblx0J2Nzdic6IFwiPj01LjEuMlwiLFxuXHQndXJsJzogJz49MC4xMC4wJyxcblx0J3JlcXVlc3QnOiAnPj0yLjgxLjAnLFxuXHQneGluZ2UnOiAnPj0xLjEuMycsXG5cdCd4aWFvbWktcHVzaCc6ICc+PTAuNC41J1xufSwgJ3N0ZWVkb3M6YXBpJyk7IiwiQnVzYm95ID0gcmVxdWlyZSgnYnVzYm95Jyk7XG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLnBhcnNlRmlsZXMgPSAocmVxLCByZXMsIG5leHQpIC0+XG5cdGZpbGVzID0gW107ICMgU3RvcmUgZmlsZXMgaW4gYW4gYXJyYXkgYW5kIHRoZW4gcGFzcyB0aGVtIHRvIHJlcXVlc3QuXG5cblx0aWYgKHJlcS5tZXRob2QgPT0gXCJQT1NUXCIpXG5cdFx0YnVzYm95ID0gbmV3IEJ1c2JveSh7IGhlYWRlcnM6IHJlcS5oZWFkZXJzIH0pO1xuXHRcdGJ1c2JveS5vbiBcImZpbGVcIiwgIChmaWVsZG5hbWUsIGZpbGUsIGZpbGVuYW1lLCBlbmNvZGluZywgbWltZXR5cGUpIC0+XG5cdFx0XHRpbWFnZSA9IHt9OyAjIGNyYXRlIGFuIGltYWdlIG9iamVjdFxuXHRcdFx0aW1hZ2UubWltZVR5cGUgPSBtaW1ldHlwZTtcblx0XHRcdGltYWdlLmVuY29kaW5nID0gZW5jb2Rpbmc7XG5cdFx0XHRpbWFnZS5maWxlbmFtZSA9IGZpbGVuYW1lO1xuXG5cdFx0XHQjIGJ1ZmZlciB0aGUgcmVhZCBjaHVua3Ncblx0XHRcdGJ1ZmZlcnMgPSBbXTtcblxuXHRcdFx0ZmlsZS5vbiAnZGF0YScsIChkYXRhKSAtPlxuXHRcdFx0XHRidWZmZXJzLnB1c2goZGF0YSk7XG5cblx0XHRcdGZpbGUub24gJ2VuZCcsICgpIC0+XG5cdFx0XHRcdCMgY29uY2F0IHRoZSBjaHVua3Ncblx0XHRcdFx0aW1hZ2UuZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XG5cdFx0XHRcdCMgcHVzaCB0aGUgaW1hZ2Ugb2JqZWN0IHRvIHRoZSBmaWxlIGFycmF5XG5cdFx0XHRcdGZpbGVzLnB1c2goaW1hZ2UpO1xuXG5cblx0XHRidXNib3kub24gXCJmaWVsZFwiLCAoZmllbGRuYW1lLCB2YWx1ZSkgLT5cblx0XHRcdHJlcS5ib2R5W2ZpZWxkbmFtZV0gPSB2YWx1ZTtcblxuXHRcdGJ1c2JveS5vbiBcImZpbmlzaFwiLCAgKCkgLT5cblx0XHRcdCMgUGFzcyB0aGUgZmlsZSBhcnJheSB0b2dldGhlciB3aXRoIHRoZSByZXF1ZXN0XG5cdFx0XHRyZXEuZmlsZXMgPSBmaWxlcztcblxuXHRcdFx0RmliZXIgKCktPlxuXHRcdFx0XHRuZXh0KCk7XG5cdFx0XHQucnVuKCk7XG5cblx0XHQjIFBhc3MgcmVxdWVzdCB0byBidXNib3lcblx0XHRyZXEucGlwZShidXNib3kpO1xuXG5cdGVsc2Vcblx0XHRuZXh0KCk7XG5cblxuI0pzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoSnNvblJvdXRlcy5wYXJzZUZpbGVzKTsiLCJ2YXIgQnVzYm95LCBGaWJlcjtcblxuQnVzYm95ID0gcmVxdWlyZSgnYnVzYm95Jyk7XG5cbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbkpzb25Sb3V0ZXMucGFyc2VGaWxlcyA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBidXNib3ksIGZpbGVzO1xuICBmaWxlcyA9IFtdO1xuICBpZiAocmVxLm1ldGhvZCA9PT0gXCJQT1NUXCIpIHtcbiAgICBidXNib3kgPSBuZXcgQnVzYm95KHtcbiAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzXG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmlsZVwiLCBmdW5jdGlvbihmaWVsZG5hbWUsIGZpbGUsIGZpbGVuYW1lLCBlbmNvZGluZywgbWltZXR5cGUpIHtcbiAgICAgIHZhciBidWZmZXJzLCBpbWFnZTtcbiAgICAgIGltYWdlID0ge307XG4gICAgICBpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xuICAgICAgaW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgICAgIGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XG4gICAgICBidWZmZXJzID0gW107XG4gICAgICBmaWxlLm9uKCdkYXRhJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICByZXR1cm4gYnVmZmVycy5wdXNoKGRhdGEpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmlsZS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGltYWdlLmRhdGEgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuICAgICAgICByZXR1cm4gZmlsZXMucHVzaChpbWFnZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWVsZFwiLCBmdW5jdGlvbihmaWVsZG5hbWUsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpbmlzaFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfSkucnVuKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcS5waXBlKGJ1c2JveSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxufTtcbiIsIkBBdXRoIG9yPSB7fVxuXG4jIyNcbiAgQSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuIyMjXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUgKHVzZXIpIC0+XG4gIGNoZWNrIHVzZXIsXG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG5cbiAgaWYgXy5rZXlzKHVzZXIpLmxlbmd0aCBpcyBub3QgMVxuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvciAnVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCdcblxuICByZXR1cm4gdHJ1ZVxuXG5cbiMjI1xuICBSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4jIyNcbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gKHVzZXIpIC0+XG4gIGlmIHVzZXIuaWRcbiAgICByZXR1cm4geydfaWQnOiB1c2VyLmlkfVxuICBlbHNlIGlmIHVzZXIudXNlcm5hbWVcbiAgICByZXR1cm4geyd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWV9XG4gIGVsc2UgaWYgdXNlci5lbWFpbFxuICAgIHJldHVybiB7J2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbH1cblxuICAjIFdlIHNob3VsZG4ndCBiZSBoZXJlIGlmIHRoZSB1c2VyIG9iamVjdCB3YXMgcHJvcGVybHkgdmFsaWRhdGVkXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcidcblxuXG4jIyNcbiAgTG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXG4jIyNcbkBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gKHVzZXIsIHBhc3N3b3JkKSAtPlxuICBpZiBub3QgdXNlciBvciBub3QgcGFzc3dvcmRcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuICAjIFZhbGlkYXRlIHRoZSBsb2dpbiBpbnB1dCB0eXBlc1xuICBjaGVjayB1c2VyLCB1c2VyVmFsaWRhdG9yXG4gIGNoZWNrIHBhc3N3b3JkLCBTdHJpbmdcblxuICAjIFJldHJpZXZlIHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcilcbiAgYXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpXG5cbiAgaWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuICBpZiBub3QgYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzPy5wYXNzd29yZFxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG4gICMgQXV0aGVudGljYXRlIHRoZSB1c2VyJ3MgcGFzc3dvcmRcbiAgcGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCBhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkXG4gIGlmIHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cbiAgIyBBZGQgYSBuZXcgYXV0aCB0b2tlbiB0byB0aGUgdXNlcidzIGFjY291bnRcbiAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKVxuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxuICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlblxuXG4gIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZH0pLmZldGNoKClcbiAgc3BhY2VzID0gW11cbiAgXy5lYWNoIHNwYWNlX3VzZXJzLCAoc3UpLT5cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKVxuICAgICMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xuICAgIGlmIHNwYWNlICYmIFN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHN1LnNwYWNlKSBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcik+PTBcbiAgICAgIHNwYWNlcy5wdXNoXG4gICAgICAgIF9pZDogc3BhY2UuX2lkXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgcmV0dXJuIHthdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbiwgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBhZG1pblNwYWNlczogc3BhY2VzfVxuIiwidmFyIGdldFVzZXJRdWVyeVNlbGVjdG9yLCB1c2VyVmFsaWRhdG9yO1xuXG50aGlzLkF1dGggfHwgKHRoaXMuQXV0aCA9IHt9KTtcblxuXG4vKlxuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4gKi9cblxudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlKGZ1bmN0aW9uKHVzZXIpIHtcbiAgY2hlY2sodXNlciwge1xuICAgIGlkOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpXG4gIH0pO1xuICBpZiAoXy5rZXlzKHVzZXIpLmxlbmd0aCA9PT0gITEpIHtcbiAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IoJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5cbi8qXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiAqL1xuXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgaWYgKHVzZXIuaWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ19pZCc6IHVzZXIuaWRcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3VzZXJuYW1lJzogdXNlci51c2VybmFtZVxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci5lbWFpbCkge1xuICAgIHJldHVybiB7XG4gICAgICAnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsXG4gICAgfTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInKTtcbn07XG5cblxuLypcbiAgTG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXG4gKi9cblxudGhpcy5BdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gZnVuY3Rpb24odXNlciwgcGFzc3dvcmQpIHtcbiAgdmFyIGF1dGhUb2tlbiwgYXV0aGVudGljYXRpbmdVc2VyLCBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciwgaGFzaGVkVG9rZW4sIHBhc3N3b3JkVmVyaWZpY2F0aW9uLCByZWYsIHNwYWNlX3VzZXJzLCBzcGFjZXM7XG4gIGlmICghdXNlciB8fCAhcGFzc3dvcmQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGNoZWNrKHVzZXIsIHVzZXJWYWxpZGF0b3IpO1xuICBjaGVjayhwYXNzd29yZCwgU3RyaW5nKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpO1xuICBpZiAoIWF1dGhlbnRpY2F0aW5nVXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaWYgKCEoKHJlZiA9IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IHJlZi5wYXNzd29yZCA6IHZvaWQgMCkpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZCk7XG4gIGlmIChwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKTtcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbihhdXRoVG9rZW4pO1xuICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbihhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlbik7XG4gIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZFxuICB9KS5mZXRjaCgpO1xuICBzcGFjZXMgPSBbXTtcbiAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbihzdSkge1xuICAgIHZhciBzcGFjZTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKTtcbiAgICBpZiAoc3BhY2UgJiYgU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3Uuc3BhY2UpICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpID49IDApIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh7XG4gICAgICAgIF9pZDogc3BhY2UuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGF1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLFxuICAgIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCxcbiAgICBhZG1pblNwYWNlczogc3BhY2VzXG4gIH07XG59O1xuIiwiLy8gV2UgbmVlZCBhIGZ1bmN0aW9uIHRoYXQgdHJlYXRzIHRocm93biBlcnJvcnMgZXhhY3RseSBsaWtlIElyb24gUm91dGVyIHdvdWxkLlxuLy8gVGhpcyBmaWxlIGlzIHdyaXR0ZW4gaW4gSmF2YVNjcmlwdCB0byBlbmFibGUgY29weS1wYXN0aW5nIElyb24gUm91dGVyIGNvZGUuXG5cbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDNcbnZhciBlbnYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnO1xuXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0w0N1xuaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UgPSBmdW5jdGlvbiAoZXJyLCByZXEsIHJlcykge1xuICBpZiAocmVzLnN0YXR1c0NvZGUgPCA0MDApXG4gICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG5cbiAgaWYgKGVyci5zdGF0dXMpXG4gICAgcmVzLnN0YXR1c0NvZGUgPSBlcnIuc3RhdHVzO1xuXG4gIGlmIChlbnYgPT09ICdkZXZlbG9wbWVudCcpXG4gICAgbXNnID0gKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSkgKyAnXFxuJztcbiAgZWxzZVxuICAgIC8vWFhYIGdldCB0aGlzIGZyb20gc3RhbmRhcmQgZGljdCBvZiBlcnJvciBtZXNzYWdlcz9cbiAgICBtc2cgPSAnU2VydmVyIGVycm9yLic7XG5cbiAgY29uc29sZS5lcnJvcihlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpO1xuXG4gIGlmIChyZXMuaGVhZGVyc1NlbnQpXG4gICAgcmV0dXJuIHJlcS5zb2NrZXQuZGVzdHJveSgpO1xuXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L2h0bWwnKTtcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBCdWZmZXIuYnl0ZUxlbmd0aChtc2cpKTtcbiAgaWYgKHJlcS5tZXRob2QgPT09ICdIRUFEJylcbiAgICByZXR1cm4gcmVzLmVuZCgpO1xuICByZXMuZW5kKG1zZyk7XG4gIHJldHVybjtcbn1cbiIsImNsYXNzIHNoYXJlLlJvdXRlXG5cbiAgY29uc3RydWN0b3I6IChAYXBpLCBAcGF0aCwgQG9wdGlvbnMsIEBlbmRwb2ludHMpIC0+XG4gICAgIyBDaGVjayBpZiBvcHRpb25zIHdlcmUgcHJvdmlkZWRcbiAgICBpZiBub3QgQGVuZHBvaW50c1xuICAgICAgQGVuZHBvaW50cyA9IEBvcHRpb25zXG4gICAgICBAb3B0aW9ucyA9IHt9XG5cblxuICBhZGRUb0FwaTogZG8gLT5cbiAgICBhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXVxuXG4gICAgcmV0dXJuIC0+XG4gICAgICBzZWxmID0gdGhpc1xuXG4gICAgICAjIFRocm93IGFuIGVycm9yIGlmIGEgcm91dGUgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCBhdCB0aGlzIHBhdGhcbiAgICAgICMgVE9ETzogQ2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aCBwYXRocyB0aGF0IGZvbGxvdyBzYW1lIHBhdHRlcm4gd2l0aCBkaWZmZXJlbnQgcGFyYW1ldGVyIG5hbWVzXG4gICAgICBpZiBfLmNvbnRhaW5zIEBhcGkuX2NvbmZpZy5wYXRocywgQHBhdGhcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6ICN7QHBhdGh9XCJcblxuICAgICAgIyBPdmVycmlkZSB0aGUgZGVmYXVsdCBPUFRJT05TIGVuZHBvaW50IHdpdGggb3VyIG93blxuICAgICAgQGVuZHBvaW50cyA9IF8uZXh0ZW5kIG9wdGlvbnM6IEBhcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50LCBAZW5kcG9pbnRzXG5cbiAgICAgICMgQ29uZmlndXJlIGVhY2ggZW5kcG9pbnQgb24gdGhpcyByb3V0ZVxuICAgICAgQF9yZXNvbHZlRW5kcG9pbnRzKClcbiAgICAgIEBfY29uZmlndXJlRW5kcG9pbnRzKClcblxuICAgICAgIyBBZGQgdG8gb3VyIGxpc3Qgb2YgZXhpc3RpbmcgcGF0aHNcbiAgICAgIEBhcGkuX2NvbmZpZy5wYXRocy5wdXNoIEBwYXRoXG5cbiAgICAgIGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cbiAgICAgICAgXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXG4gICAgICByZWplY3RlZE1ldGhvZHMgPSBfLnJlamVjdCBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcblxuICAgICAgIyBTZXR1cCBlbmRwb2ludHMgb24gcm91dGVcbiAgICAgIGZ1bGxQYXRoID0gQGFwaS5fY29uZmlnLmFwaVBhdGggKyBAcGF0aFxuICAgICAgXy5lYWNoIGFsbG93ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF1cbiAgICAgICAgSnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxuICAgICAgICAgICMgQWRkIGZ1bmN0aW9uIHRvIGVuZHBvaW50IGNvbnRleHQgZm9yIGluZGljYXRpbmcgYSByZXNwb25zZSBoYXMgYmVlbiBpbml0aWF0ZWQgbWFudWFsbHlcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlXG4gICAgICAgICAgZG9uZUZ1bmMgPSAtPlxuICAgICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlXG5cbiAgICAgICAgICBlbmRwb2ludENvbnRleHQgPVxuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogcmVxLnF1ZXJ5XG4gICAgICAgICAgICBib2R5UGFyYW1zOiByZXEuYm9keVxuICAgICAgICAgICAgcmVxdWVzdDogcmVxXG4gICAgICAgICAgICByZXNwb25zZTogcmVzXG4gICAgICAgICAgICBkb25lOiBkb25lRnVuY1xuICAgICAgICAgICMgQWRkIGVuZHBvaW50IGNvbmZpZyBvcHRpb25zIHRvIGNvbnRleHRcbiAgICAgICAgICBfLmV4dGVuZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cbiAgICAgICAgICAjIFJ1biB0aGUgcmVxdWVzdGVkIGVuZHBvaW50XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gbnVsbFxuICAgICAgICAgIHRyeVxuICAgICAgICAgICAgcmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50IGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcbiAgICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgICAgIyBEbyBleGFjdGx5IHdoYXQgSXJvbiBSb3V0ZXIgd291bGQgaGF2ZSBkb25lLCB0byBhdm9pZCBjaGFuZ2luZyB0aGUgQVBJXG4gICAgICAgICAgICBpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICBpZiByZXNwb25zZUluaXRpYXRlZFxuICAgICAgICAgICAgIyBFbnN1cmUgdGhlIHJlc3BvbnNlIGlzIHByb3Blcmx5IGNvbXBsZXRlZFxuICAgICAgICAgICAgcmVzLmVuZCgpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiByZXMuaGVhZGVyc1NlbnRcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxuICAgICAgICAgICAgZWxzZSBpZiByZXNwb25zZURhdGEgaXMgbnVsbCBvciByZXNwb25zZURhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcblxuICAgICAgICAgICMgR2VuZXJhdGUgYW5kIHJldHVybiB0aGUgaHR0cCByZXNwb25zZSwgaGFuZGxpbmcgdGhlIGRpZmZlcmVudCBlbmRwb2ludCByZXNwb25zZSB0eXBlc1xuICAgICAgICAgIGlmIHJlc3BvbnNlRGF0YS5ib2R5IGFuZCAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgb3IgcmVzcG9uc2VEYXRhLmhlYWRlcnMpXG4gICAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVyc1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGFcblxuICAgICAgXy5lYWNoIHJlamVjdGVkTWV0aG9kcywgKG1ldGhvZCkgLT5cbiAgICAgICAgSnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICBoZWFkZXJzID0gJ0FsbG93JzogYWxsb3dlZE1ldGhvZHMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzXG5cblxuICAjIyNcbiAgICBDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcbiAgICBmdW5jdGlvblxuXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gICMjI1xuICBfcmVzb2x2ZUVuZHBvaW50czogLT5cbiAgICBfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykgLT5cbiAgICAgIGlmIF8uaXNGdW5jdGlvbihlbmRwb2ludClcbiAgICAgICAgZW5kcG9pbnRzW21ldGhvZF0gPSB7YWN0aW9uOiBlbmRwb2ludH1cbiAgICByZXR1cm5cblxuXG4gICMjI1xuICAgIENvbmZpZ3VyZSB0aGUgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnQgb24gYWxsIGVuZHBvaW50cyAoZXhjZXB0IE9QVElPTlMsIHdoaWNoIG11c3RcbiAgICBiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcblxuICAgIEF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3IgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuXG4gICAgZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcbiAgICBvdmVycmlkZSB0aGUgZGVmYXVsdC5cblxuICAgIEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICAgIGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gICAgcmVzcGVjdGl2ZWx5LlxuXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gICAgQHBhcmFtIHtFbmRwb2ludH0gZW5kcG9pbnQgVGhlIGVuZHBvaW50IHRvIGNvbmZpZ3VyZVxuICAjIyNcbiAgX2NvbmZpZ3VyZUVuZHBvaW50czogLT5cbiAgICBfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QpIC0+XG4gICAgICBpZiBtZXRob2QgaXNudCAnb3B0aW9ucydcbiAgICAgICAgIyBDb25maWd1cmUgYWNjZXB0YWJsZSByb2xlc1xuICAgICAgICBpZiBub3QgQG9wdGlvbnM/LnJvbGVSZXF1aXJlZFxuICAgICAgICAgIEBvcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdXG4gICAgICAgIGlmIG5vdCBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBbXVxuICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBfLnVuaW9uIGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgQG9wdGlvbnMucm9sZVJlcXVpcmVkXG4gICAgICAgICMgTWFrZSBpdCBlYXNpZXIgdG8gY2hlY2sgaWYgbm8gcm9sZXMgYXJlIHJlcXVpcmVkXG4gICAgICAgIGlmIF8uaXNFbXB0eSBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZVxuXG4gICAgICAgICMgQ29uZmlndXJlIGF1dGggcmVxdWlyZW1lbnRcbiAgICAgICAgaWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGlmIEBvcHRpb25zPy5hdXRoUmVxdWlyZWQgb3IgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSB0cnVlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2VcblxuICAgICAgICBpZiBAb3B0aW9ucz8uc3BhY2VSZXF1aXJlZFxuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSBAb3B0aW9ucy5zcGFjZVJlcXVpcmVkXG4gICAgICAgIHJldHVyblxuICAgICwgdGhpc1xuICAgIHJldHVyblxuXG5cbiAgIyMjXG4gICAgQXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuXG4gICAgQHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXG4gICMjI1xuICBfY2FsbEVuZHBvaW50OiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICAjIENhbGwgdGhlIGVuZHBvaW50IGlmIGF1dGhlbnRpY2F0aW9uIGRvZXNuJ3QgZmFpbFxuICAgIGlmIEBfYXV0aEFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcbiAgICAgIGlmIEBfcm9sZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcbiAgICAgICAgaWYgQF9zcGFjZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcbiAgICAgICAgICAjZW5kcG9pbnQuYWN0aW9uLmNhbGwgZW5kcG9pbnRDb250ZXh0XG4gICAgICAgICAgaW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvblxuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgXG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlIGludm9jYXRpb24sIC0+XG4gICAgICAgICAgICByZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHN0YXR1c0NvZGU6IDQwM1xuICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nfVxuICAgICAgZWxzZVxuICAgICAgICBzdGF0dXNDb2RlOiA0MDNcbiAgICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ31cbiAgICBlbHNlXG4gICAgICBzdGF0dXNDb2RlOiA0MDFcbiAgICAgIGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nfVxuXG5cbiAgIyMjXG4gICAgQXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuXG4gICAgT25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxuICAgIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxuICAgIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuXG4gICAgQHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuICAjIyNcbiAgX2F1dGhBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG4gICAgaWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkXG4gICAgICBAX2F1dGhlbnRpY2F0ZSBlbmRwb2ludENvbnRleHRcbiAgICBlbHNlIHRydWVcblxuXG4gICMjI1xuICAgIFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG5cbiAgICBJZiB2ZXJpZmllZCwgYXR0YWNoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgdG8gdGhlIGNvbnRleHQuXG5cbiAgICBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgIyMjXG4gIF9hdXRoZW50aWNhdGU6IChlbmRwb2ludENvbnRleHQpIC0+XG4gICAgIyBHZXQgYXV0aCBpbmZvXG4gICAgYXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXG5cbiAgICAjIEdldCB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxuICAgIGlmIGF1dGg/LnVzZXJJZCBhbmQgYXV0aD8udG9rZW4gYW5kIG5vdCBhdXRoPy51c2VyXG4gICAgICB1c2VyU2VsZWN0b3IgPSB7fVxuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkXG4gICAgICB1c2VyU2VsZWN0b3JbQGFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlblxuICAgICAgYXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUgdXNlclNlbGVjdG9yXG5cbiAgICAjIEF0dGFjaCB0aGUgdXNlciBhbmQgdGhlaXIgSUQgdG8gdGhlIGNvbnRleHQgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgaWYgYXV0aD8udXNlclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXJcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkXG4gICAgICB0cnVlXG4gICAgZWxzZSBmYWxzZVxuXG4gICMjI1xuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG5cbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG5cbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICMjI1xuICBfc3BhY2VBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG4gICAgaWYgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZFxuICAgICAgYXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXG4gICAgICBpZiBhdXRoPy5zcGFjZUlkXG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aC51c2VySWQsIHNwYWNlOmF1dGguc3BhY2VJZH0pLmNvdW50KClcbiAgICAgICAgaWYgc3BhY2VfdXNlcnNfY291bnRcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZClcbiAgICAgICAgICAjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcbiAgICAgICAgICBpZiBzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZS5faWQpIGFuZCBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCk+PTBcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuXG4gICMjI1xuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG5cbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG5cbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICMjI1xuICBfcm9sZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgIGlmIF8uaXNFbXB0eSBfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB0cnVlXG5cblxuICAjIyNcbiAgICBSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxuICAjIyNcbiAgX3Jlc3BvbmQ6IChyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZT0yMDAsIGhlYWRlcnM9e30pIC0+XG4gICAgIyBPdmVycmlkZSBhbnkgZGVmYXVsdCBoZWFkZXJzIHRoYXQgaGF2ZSBiZWVuIHByb3ZpZGVkIChrZXlzIGFyZSBub3JtYWxpemVkIHRvIGJlIGNhc2UgaW5zZW5zaXRpdmUpXG4gICAgIyBUT0RPOiBDb25zaWRlciBvbmx5IGxvd2VyY2FzaW5nIHRoZSBoZWFkZXIga2V5cyB3ZSBuZWVkIG5vcm1hbGl6ZWQsIGxpa2UgQ29udGVudC1UeXBlXG4gICAgZGVmYXVsdEhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgQGFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzXG4gICAgaGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBoZWFkZXJzXG4gICAgaGVhZGVycyA9IF8uZXh0ZW5kIGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzXG5cbiAgICAjIFByZXBhcmUgSlNPTiBib2R5IGZvciByZXNwb25zZSB3aGVuIENvbnRlbnQtVHlwZSBpbmRpY2F0ZXMgSlNPTiB0eXBlXG4gICAgaWYgaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pIGlzbnQgbnVsbFxuICAgICAgaWYgQGFwaS5fY29uZmlnLnByZXR0eUpzb25cbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHksIHVuZGVmaW5lZCwgMlxuICAgICAgZWxzZVxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keVxuXG4gICAgIyBTZW5kIHJlc3BvbnNlXG4gICAgc2VuZFJlc3BvbnNlID0gLT5cbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCBzdGF0dXNDb2RlLCBoZWFkZXJzXG4gICAgICByZXNwb25zZS53cml0ZSBib2R5XG4gICAgICByZXNwb25zZS5lbmQoKVxuICAgIGlmIHN0YXR1c0NvZGUgaW4gWzQwMSwgNDAzXVxuICAgICAgIyBIYWNrZXJzIGNhbiBtZWFzdXJlIHRoZSByZXNwb25zZSB0aW1lIHRvIGRldGVybWluZSB0aGluZ3MgbGlrZSB3aGV0aGVyIHRoZSA0MDEgcmVzcG9uc2Ugd2FzIFxuICAgICAgIyBjYXVzZWQgYnkgYmFkIHVzZXIgaWQgdnMgYmFkIHBhc3N3b3JkLlxuICAgICAgIyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXG4gICAgICAjIERlbGF5IGJ5IGEgcmFuZG9tIGFtb3VudCB0byByZWR1Y2UgdGhlIGFiaWxpdHkgZm9yIGEgaGFja2VyIHRvIGRldGVybWluZSB0aGUgcmVzcG9uc2UgdGltZS5cbiAgICAgICMgU2VlIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvQmxvY2tpbmdfQnJ1dGVfRm9yY2VfQXR0YWNrcyNGaW5kaW5nX090aGVyX0NvdW50ZXJtZWFzdXJlc1xuICAgICAgIyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDBcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKClcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXG4gICAgICBNZXRlb3Iuc2V0VGltZW91dCBzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHNcbiAgICBlbHNlXG4gICAgICBzZW5kUmVzcG9uc2UoKVxuXG4gICMjI1xuICAgIFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcbiAgIyMjXG4gIF9sb3dlckNhc2VLZXlzOiAob2JqZWN0KSAtPlxuICAgIF8uY2hhaW4gb2JqZWN0XG4gICAgLnBhaXJzKClcbiAgICAubWFwIChhdHRyKSAtPlxuICAgICAgW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cbiAgICAub2JqZWN0KClcbiAgICAudmFsdWUoKVxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuICBcbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gICAgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICAgIGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gICAgcmVzcGVjdGl2ZWx5LlxuICBcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY29uZmlndXJlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kKSB7XG4gICAgICB2YXIgcmVmLCByZWYxLCByZWYyO1xuICAgICAgaWYgKG1ldGhvZCAhPT0gJ29wdGlvbnMnKSB7XG4gICAgICAgIGlmICghKChyZWYgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYucm9sZVJlcXVpcmVkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkKTtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludC5yb2xlUmVxdWlyZWQpKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKCgocmVmMSA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjEuYXV0aFJlcXVpcmVkIDogdm9pZCAwKSB8fCBlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHJlZjIgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYyLnNwYWNlUmVxdWlyZWQgOiB2b2lkIDApIHtcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gdGhpcy5vcHRpb25zLnNwYWNlUmVxdWlyZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuICBcbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuICBcbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZShlbmRwb2ludENvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cbiAgXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aGVudGljYXRlID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0KSB7XG4gICAgdmFyIGF1dGgsIHVzZXJTZWxlY3RvcjtcbiAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgIGlmICgoYXV0aCAhPSBudWxsID8gYXV0aC51c2VySWQgOiB2b2lkIDApICYmIChhdXRoICE9IG51bGwgPyBhdXRoLnRva2VuIDogdm9pZCAwKSAmJiAhKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkpIHtcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9O1xuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkO1xuICAgICAgdXNlclNlbGVjdG9yW3RoaXMuYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuO1xuICAgICAgYXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodXNlclNlbGVjdG9yKTtcbiAgICB9XG4gICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkge1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXI7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKHNwYWNlICYmIFN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlLl9pZCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yb2xlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgaWYgKF8uaXNFbXB0eShfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gICAgUmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNwb25kID0gZnVuY3Rpb24ocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGUsIGhlYWRlcnMpIHtcbiAgICB2YXIgZGVmYXVsdEhlYWRlcnMsIGRlbGF5SW5NaWxsaXNlY29uZHMsIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzLCByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bywgc2VuZFJlc3BvbnNlO1xuICAgIGlmIChzdGF0dXNDb2RlID09IG51bGwpIHtcbiAgICAgIHN0YXR1c0NvZGUgPSAyMDA7XG4gICAgfVxuICAgIGlmIChoZWFkZXJzID09IG51bGwpIHtcbiAgICAgIGhlYWRlcnMgPSB7fTtcbiAgICB9XG4gICAgZGVmYXVsdEhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKGhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSBfLmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG4gICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYXBpLl9jb25maWcucHJldHR5SnNvbikge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSwgdm9pZCAwLCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNwb25zZS53cml0ZUhlYWQoc3RhdHVzQ29kZSwgaGVhZGVycyk7XG4gICAgICByZXNwb25zZS53cml0ZShib2R5KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5lbmQoKTtcbiAgICB9O1xuICAgIGlmIChzdGF0dXNDb2RlID09PSA0MDEgfHwgc3RhdHVzQ29kZSA9PT0gNDAzKSB7XG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMDtcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICBkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bztcbiAgICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dChzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VuZFJlc3BvbnNlKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiY2xhc3MgQFJlc3RpdnVzXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIEBfcm91dGVzID0gW11cbiAgICBAX2NvbmZpZyA9XG4gICAgICBwYXRoczogW11cbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZVxuICAgICAgYXBpUGF0aDogJ2FwaS8nXG4gICAgICB2ZXJzaW9uOiBudWxsXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZVxuICAgICAgYXV0aDpcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nXG4gICAgICAgIHVzZXI6IC0+XG4gICAgICAgICAgaWYgQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG4gICAgICAgICAgaWYgQHJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogQHJlcXVlc3QudXNlcklkfSlcbiAgICAgICAgICAgIHVzZXI6IF91c2VyXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXG4gICAgICAgICAgICBzcGFjZUlkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ11cbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVzZXJJZDogQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ11cbiAgICAgICAgICAgIHNwYWNlSWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXVxuICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICBkZWZhdWx0SGVhZGVyczpcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxuXG4gICAgIyBDb25maWd1cmUgQVBJIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcbiAgICBfLmV4dGVuZCBAX2NvbmZpZywgb3B0aW9uc1xuXG4gICAgaWYgQF9jb25maWcuZW5hYmxlQ29yc1xuICAgICAgY29yc0hlYWRlcnMgPVxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXG5cbiAgICAgIGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4nXG5cbiAgICAgICMgU2V0IGRlZmF1bHQgaGVhZGVyIHRvIGVuYWJsZSBDT1JTIGlmIGNvbmZpZ3VyZWRcbiAgICAgIF8uZXh0ZW5kIEBfY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVyc1xuXG4gICAgICBpZiBub3QgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuICAgICAgICBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gLT5cbiAgICAgICAgICBAcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgY29yc0hlYWRlcnNcbiAgICAgICAgICBAZG9uZSgpXG5cbiAgICAjIE5vcm1hbGl6ZSB0aGUgQVBJIHBhdGhcbiAgICBpZiBAX2NvbmZpZy5hcGlQYXRoWzBdIGlzICcvJ1xuICAgICAgQF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGguc2xpY2UgMVxuICAgIGlmIF8ubGFzdChAX2NvbmZpZy5hcGlQYXRoKSBpc250ICcvJ1xuICAgICAgQF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGggKyAnLydcblxuICAgICMgVVJMIHBhdGggdmVyc2lvbmluZyBpcyB0aGUgb25seSB0eXBlIG9mIEFQSSB2ZXJzaW9uaW5nIGN1cnJlbnRseSBhdmFpbGFibGUsIHNvIGlmIGEgdmVyc2lvbiBpc1xuICAgICMgcHJvdmlkZWQsIGFwcGVuZCBpdCB0byB0aGUgYmFzZSBwYXRoIG9mIHRoZSBBUElcbiAgICBpZiBAX2NvbmZpZy52ZXJzaW9uXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoICs9IEBfY29uZmlnLnZlcnNpb24gKyAnLydcblxuICAgICMgQWRkIGRlZmF1bHQgbG9naW4gYW5kIGxvZ291dCBlbmRwb2ludHMgaWYgYXV0aCBpcyBjb25maWd1cmVkXG4gICAgaWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcbiAgICAgIEBfaW5pdEF1dGgoKVxuICAgIGVsc2UgaWYgQF9jb25maWcudXNlQXV0aFxuICAgICAgQF9pbml0QXV0aCgpXG4gICAgICBjb25zb2xlLndhcm4gJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArXG4gICAgICAgICAgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJ1xuXG4gICAgcmV0dXJuIHRoaXNcblxuXG4gICMjIypcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG5cbiAgICBAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG4gICAgQHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgQHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcbiAgICBAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG4gICAgICAgIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcbiAgICAgICAgYW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuICAjIyNcbiAgYWRkUm91dGU6IChwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIC0+XG4gICAgIyBDcmVhdGUgYSBuZXcgcm91dGUgYW5kIGFkZCBpdCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyByb3V0ZXNcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpXG4gICAgQF9yb3V0ZXMucHVzaChyb3V0ZSlcblxuICAgIHJvdXRlLmFkZFRvQXBpKClcblxuICAgIHJldHVybiB0aGlzXG5cblxuICAjIyMqXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAjIyNcbiAgYWRkQ29sbGVjdGlvbjogKGNvbGxlY3Rpb24sIG9wdGlvbnM9e30pIC0+XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXVxuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ11cblxuICAgICMgR3JhYiB0aGUgc2V0IG9mIGVuZHBvaW50c1xuICAgIGlmIGNvbGxlY3Rpb24gaXMgTWV0ZW9yLnVzZXJzXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF91c2VyQ29sbGVjdGlvbkVuZHBvaW50c1xuICAgIGVsc2VcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX2NvbGxlY3Rpb25FbmRwb2ludHNcblxuICAgICMgRmxhdHRlbiB0aGUgb3B0aW9ucyBhbmQgc2V0IGRlZmF1bHRzIGlmIG5lY2Vzc2FyeVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIG9yIHt9XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgb3Ige31cbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgb3IgW11cbiAgICAjIFVzZSBjb2xsZWN0aW9uIG5hbWUgYXMgZGVmYXVsdCBwYXRoXG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCBvciBjb2xsZWN0aW9uLl9uYW1lXG5cbiAgICAjIFNlcGFyYXRlIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRzIGJ5IHRoZSByb3V0ZSB0aGV5IGJlbG9uZyB0byAob25lIGZvciBvcGVyYXRpbmcgb24gdGhlIGVudGlyZVxuICAgICMgY29sbGVjdGlvbiBhbmQgb25lIGZvciBvcGVyYXRpbmcgb24gYSBzaW5nbGUgZW50aXR5IHdpdGhpbiB0aGUgY29sbGVjdGlvbilcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fVxuICAgIGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge31cbiAgICBpZiBfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSBhbmQgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKVxuICAgICAgIyBHZW5lcmF0ZSBhbGwgZW5kcG9pbnRzIG9uIHRoaXMgY29sbGVjdGlvblxuICAgICAgXy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuICAgICAgICBpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxuICAgICAgICAgIF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcbiAgICAgICAgZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcbiAgICAgICAgcmV0dXJuXG4gICAgICAsIHRoaXNcbiAgICBlbHNlXG4gICAgICAjIEdlbmVyYXRlIGFueSBlbmRwb2ludHMgdGhhdCBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBleGNsdWRlZFxuICAgICAgXy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIGlmIG1ldGhvZCBub3QgaW4gZXhjbHVkZWRFbmRwb2ludHMgYW5kIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdIGlzbnQgZmFsc2VcbiAgICAgICAgICAjIENvbmZpZ3VyZSBlbmRwb2ludCBhbmQgbWFwIHRvIGl0J3MgaHR0cCBtZXRob2RcbiAgICAgICAgICAjIFRPRE86IENvbnNpZGVyIHByZWRlZmluaW5nIGEgbWFwIG9mIG1ldGhvZHMgdG8gdGhlaXIgaHR0cCBtZXRob2QgdHlwZSAoZS5nLiwgZ2V0QWxsOiBnZXQpXG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF1cbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fVxuICAgICAgICAgIF8uZWFjaCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgKGFjdGlvbiwgbWV0aG9kVHlwZSkgLT5cbiAgICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9XG4gICAgICAgICAgICAgIF8uY2hhaW4gYWN0aW9uXG4gICAgICAgICAgICAgIC5jbG9uZSgpXG4gICAgICAgICAgICAgIC5leHRlbmQgZW5kcG9pbnRPcHRpb25zXG4gICAgICAgICAgICAgIC52YWx1ZSgpXG4gICAgICAgICAgIyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXG4gICAgICAgICAgaWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cbiAgICAgICAgICAgIF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG4gICAgICAgICAgZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAsIHRoaXNcblxuICAgICMgQWRkIHRoZSByb3V0ZXMgdG8gdGhlIEFQSVxuICAgIEBhZGRSb3V0ZSBwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50c1xuICAgIEBhZGRSb3V0ZSBcIiN7cGF0aH0vOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHNcblxuICAgIHJldHVybiB0aGlzXG5cblxuICAjIyMqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICMjI1xuICBfY29sbGVjdGlvbkVuZHBvaW50czpcbiAgICBnZXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZ2V0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgc2VsZWN0b3JcbiAgICAgICAgICBpZiBlbnRpdHlcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuICAgIHB1dDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBwdXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCAkc2V0OiBAYm9keVBhcmFtc1xuICAgICAgICAgIGlmIGVudGl0eUlzVXBkYXRlZFxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBkZWxldGU6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuICAgIHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcG9zdDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgQGJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCd9XG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIHNlbGVjdG9yID0ge31cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKClcbiAgICAgICAgICBpZiBlbnRpdGllc1xuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nfVxuXG5cbiAgIyMjKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgIyMjXG4gIF91c2VyQ29sbGVjdGlvbkVuZHBvaW50czpcbiAgICBnZXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZ2V0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XG4gICAgcHV0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHB1dDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIEB1cmxQYXJhbXMuaWQsICRzZXQ6IHByb2ZpbGU6IEBib2R5UGFyYW1zXG4gICAgICAgICAgaWYgZW50aXR5SXNVcGRhdGVkXG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXG4gICAgICAgICAgICB7c3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBkZWxldGU6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBAdXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuICAgIHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcG9zdDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgICMgQ3JlYXRlIGEgbmV3IHVzZXIgYWNjb3VudFxuICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlciBAYm9keVBhcmFtc1xuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZCwgZmllbGRzOiBwcm9maWxlOiAxXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCd9XG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCBmaWVsZHM6IHByb2ZpbGU6IDEpLmZldGNoKClcbiAgICAgICAgICBpZiBlbnRpdGllc1xuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2Vycyd9XG5cblxuICAjIyNcbiAgICBBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG4gICMjI1xuICBfaW5pdEF1dGg6IC0+XG4gICAgc2VsZiA9IHRoaXNcbiAgICAjIyNcbiAgICAgIEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcblxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAjIyNcbiAgICBAYWRkUm91dGUgJ2xvZ2luJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LFxuICAgICAgcG9zdDogLT5cbiAgICAgICAgIyBHcmFiIHRoZSB1c2VybmFtZSBvciBlbWFpbCB0aGF0IHRoZSB1c2VyIGlzIGxvZ2dpbmcgaW4gd2l0aFxuICAgICAgICB1c2VyID0ge31cbiAgICAgICAgaWYgQGJvZHlQYXJhbXMudXNlclxuICAgICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpIGlzIC0xXG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlclxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy51c2VyXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMudXNlcm5hbWVcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlcm5hbWVcbiAgICAgICAgZWxzZSBpZiBAYm9keVBhcmFtcy5lbWFpbFxuICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy5lbWFpbFxuXG4gICAgICAgICMgVHJ5IHRvIGxvZyB0aGUgdXNlciBpbnRvIHRoZSB1c2VyJ3MgYWNjb3VudCAoaWYgc3VjY2Vzc2Z1bCB3ZSdsbCBnZXQgYW4gYXV0aCB0b2tlbiBiYWNrKVxuICAgICAgICB0cnlcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCB1c2VyLCBAYm9keVBhcmFtcy5wYXNzd29yZFxuICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgY29uc29sZS5lcnJvciBlXG4gICAgICAgICAgcmV0dXJuIHt9ID1cbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3JcbiAgICAgICAgICAgIGJvZHk6IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5yZWFzb25cblxuICAgICAgICAjIEdldCB0aGUgYXV0aGVudGljYXRlZCB1c2VyXG4gICAgICAgICMgVE9ETzogQ29uc2lkZXIgcmV0dXJuaW5nIHRoZSB1c2VyIGluIEF1dGgubG9naW5XaXRoUGFzc3dvcmQoKSwgaW5zdGVhZCBvZiBmZXRjaGluZyBpdCBhZ2FpbiBoZXJlXG4gICAgICAgIGlmIGF1dGgudXNlcklkIGFuZCBhdXRoLmF1dGhUb2tlblxuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge31cbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aC5hdXRoVG9rZW5cbiAgICAgICAgICBAdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICAgIHNlYXJjaFF1ZXJ5XG4gICAgICAgICAgQHVzZXJJZCA9IEB1c2VyPy5faWRcblxuICAgICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogYXV0aH1cblxuICAgICAgICAjIENhbGwgdGhlIGxvZ2luIGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG4gICAgICAgIGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluPy5jYWxsKHRoaXMpXG4gICAgICAgIGlmIGV4dHJhRGF0YT9cbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXG5cbiAgICAgICAgcmVzcG9uc2VcblxuICAgIGxvZ291dCA9IC0+XG4gICAgICAjIFJlbW92ZSB0aGUgZ2l2ZW4gYXV0aCB0b2tlbiBmcm9tIHRoZSB1c2VyJ3MgYWNjb3VudFxuICAgICAgYXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuXG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YgJy4nXG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyAwLCBpbmRleFxuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyBpbmRleCArIDFcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fVxuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlblxuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fVxuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmVcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUgQHVzZXIuX2lkLCB7JHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5fVxuXG4gICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ319XG5cbiAgICAgICMgQ2FsbCB0aGUgbG9nb3V0IGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG4gICAgICBleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQ/LmNhbGwodGhpcylcbiAgICAgIGlmIGV4dHJhRGF0YT9cbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG4gICAgICByZXNwb25zZVxuXG4gICAgIyMjXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgIyMjXG4gICAgQGFkZFJvdXRlICdsb2dvdXQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSxcbiAgICAgIGdldDogLT5cbiAgICAgICAgY29uc29sZS53YXJuIFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIlxuICAgICAgICBjb25zb2xlLndhcm4gXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCJcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpXG4gICAgICBwb3N0OiBsb2dvdXRcblxuUmVzdGl2dXMgPSBAUmVzdGl2dXNcbiIsInZhciBSZXN0aXZ1cyxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG50aGlzLlJlc3RpdnVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSZXN0aXZ1cyhvcHRpb25zKSB7XG4gICAgdmFyIGNvcnNIZWFkZXJzO1xuICAgIHRoaXMuX3JvdXRlcyA9IFtdO1xuICAgIHRoaXMuX2NvbmZpZyA9IHtcbiAgICAgIHBhdGhzOiBbXSxcbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZSxcbiAgICAgIGFwaVBhdGg6ICdhcGkvJyxcbiAgICAgIHZlcnNpb246IG51bGwsXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nLFxuICAgICAgICB1c2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3VzZXIsIHRva2VuO1xuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10pIHtcbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QudXNlcklkKSB7XG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMucmVxdWVzdC51c2VySWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcjogX3VzZXIsXG4gICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddLFxuICAgICAgICAgICAgICBzcGFjZUlkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddLFxuICAgICAgICAgICAgICBzcGFjZUlkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcbiAgICB9O1xuICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZywgb3B0aW9ucyk7XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5lbmFibGVDb3JzKSB7XG4gICAgICBjb3JzSGVhZGVycyA9IHtcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCdcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4nO1xuICAgICAgfVxuICAgICAgXy5leHRlbmQodGhpcy5fY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVycyk7XG4gICAgICBpZiAoIXRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50KSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZS53cml0ZUhlYWQoMjAwLCBjb3JzSGVhZGVycyk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLmFwaVBhdGhbMF0gPT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aC5zbGljZSgxKTtcbiAgICB9XG4gICAgaWYgKF8ubGFzdCh0aGlzLl9jb25maWcuYXBpUGF0aCkgIT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aCArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy52ZXJzaW9uKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCArPSB0aGlzLl9jb25maWcudmVyc2lvbiArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbmZpZy51c2VBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgKyAnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICAgIEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcbiAgXG4gICAgQHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgIEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gICAgQHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICAgICAgICBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG4gICAgICAgIGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLmFkZFJvdXRlID0gZnVuY3Rpb24ocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSB7XG4gICAgdmFyIHJvdXRlO1xuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cyk7XG4gICAgdGhpcy5fcm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJvdXRlLmFkZFRvQXBpKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgICBHZW5lcmF0ZSByb3V0ZXMgZm9yIHRoZSBNZXRlb3IgQ29sbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5hZGRDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgb3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uRW5kcG9pbnRzLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiwgZW50aXR5Um91dGVFbmRwb2ludHMsIGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2RzLCBtZXRob2RzT25Db2xsZWN0aW9uLCBwYXRoLCByb3V0ZU9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddO1xuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ107XG4gICAgaWYgKGNvbGxlY3Rpb24gPT09IE1ldGVvci51c2Vycykge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fY29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9XG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgfHwge307XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgfHwge307XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIHx8IFtdO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGggfHwgY29sbGVjdGlvbi5fbmFtZTtcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSAmJiBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpKSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGNvbmZpZ3VyZWRFbmRwb2ludCwgZW5kcG9pbnRPcHRpb25zO1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2QpIDwgMCAmJiBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXTtcbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fTtcbiAgICAgICAgICBfLmVhY2goY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIGZ1bmN0aW9uKGFjdGlvbiwgbWV0aG9kVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9IF8uY2hhaW4oYWN0aW9uKS5jbG9uZSgpLmV4dGVuZChlbmRwb2ludE9wdGlvbnMpLnZhbHVlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyk7XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoICsgXCIvOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5fY29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5ib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCh0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXMsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChzZWxlY3RvcikuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQ7XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUodGhpcy51cmxQYXJhbXMuaWQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzO1xuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2VycydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX2luaXRBdXRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvZ291dCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcblxuICAgIC8qXG4gICAgICBBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHRoaXMuYWRkUm91dGUoJ2xvZ2luJywge1xuICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXV0aCwgZSwgZXh0cmFEYXRhLCByZWYsIHJlZjEsIHJlc3BvbnNlLCBzZWFyY2hRdWVyeSwgdXNlcjtcbiAgICAgICAgdXNlciA9IHt9O1xuICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpID09PSAtMSkge1xuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VybmFtZSkge1xuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLmVtYWlsKSB7XG4gICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy5lbWFpbDtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKHVzZXIsIHRoaXMuYm9keVBhcmFtcy5wYXNzd29yZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3IsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZS5yZWFzb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdXRoLnVzZXJJZCAmJiBhdXRoLmF1dGhUb2tlbikge1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGguYXV0aFRva2VuKTtcbiAgICAgICAgICB0aGlzLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICB9LCBzZWFyY2hRdWVyeSk7XG4gICAgICAgICAgdGhpcy51c2VySWQgPSAocmVmID0gdGhpcy51c2VyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICBkYXRhOiBhdXRoXG4gICAgICAgIH07XG4gICAgICAgIGV4dHJhRGF0YSA9IChyZWYxID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4pICE9IG51bGwgPyByZWYxLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aFRva2VuLCBleHRyYURhdGEsIGhhc2hlZFRva2VuLCBpbmRleCwgcmVmLCByZXNwb25zZSwgdG9rZW5GaWVsZE5hbWUsIHRva2VuTG9jYXRpb24sIHRva2VuUGF0aCwgdG9rZW5SZW1vdmFsUXVlcnksIHRva2VuVG9SZW1vdmU7XG4gICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ107XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuO1xuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKGluZGV4ICsgMSk7XG4gICAgICB0b2tlblRvUmVtb3ZlID0ge307XG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuO1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fTtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlO1xuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh0aGlzLnVzZXIuX2lkLCB7XG4gICAgICAgICRwdWxsOiB0b2tlblJlbW92YWxRdWVyeVxuICAgICAgfSk7XG4gICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGV4dHJhRGF0YSA9IChyZWYgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQpICE9IG51bGwgPyByZWYuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgIEFkZCBhIGxvZ291dCBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMuYWRkUm91dGUoJ2xvZ291dCcsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCIpO1xuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcyk7XG4gICAgICB9LFxuICAgICAgcG9zdDogbG9nb3V0XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFJlc3RpdnVzO1xuXG59KSgpO1xuXG5SZXN0aXZ1cyA9IHRoaXMuUmVzdGl2dXM7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICBAQVBJID0gbmV3IFJlc3RpdnVzXG4gICAgICAgIGFwaVBhdGg6ICdzdGVlZG9zL2FwaS8nLFxuICAgICAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZVxuICAgICAgICBwcmV0dHlKc29uOiB0cnVlXG4gICAgICAgIGVuYWJsZUNvcnM6IGZhbHNlXG4gICAgICAgIGRlZmF1bHRIZWFkZXJzOlxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIHRoaXMuQVBJID0gbmV3IFJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiAnc3RlZWRvcy9hcGkvJyxcbiAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgICBwcmV0dHlKc29uOiB0cnVlLFxuICAgIGVuYWJsZUNvcnM6IGZhbHNlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdEFQSS5hZGRDb2xsZWN0aW9uIGRiLnNwYWNlX3VzZXJzLCBcblx0XHRleGNsdWRlZEVuZHBvaW50czogW11cblx0XHRyb3V0ZU9wdGlvbnM6XG5cdFx0XHRhdXRoUmVxdWlyZWQ6IHRydWVcblx0XHRcdHNwYWNlUmVxdWlyZWQ6IHRydWUiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFQSS5hZGRDb2xsZWN0aW9uKGRiLnNwYWNlX3VzZXJzLCB7XG4gICAgZXhjbHVkZWRFbmRwb2ludHM6IFtdLFxuICAgIHJvdXRlT3B0aW9uczoge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgc3BhY2VSZXF1aXJlZDogdHJ1ZVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdEFQSS5hZGRDb2xsZWN0aW9uIGRiLm9yZ2FuaXphdGlvbnMsIFxuXHRcdGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXVxuXHRcdHJvdXRlT3B0aW9uczpcblx0XHRcdGF1dGhSZXF1aXJlZDogdHJ1ZVxuXHRcdFx0c3BhY2VSZXF1aXJlZDogdHJ1ZSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQVBJLmFkZENvbGxlY3Rpb24oZGIub3JnYW5pemF0aW9ucywge1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXSxcbiAgICByb3V0ZU9wdGlvbnM6IHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNwYWNlUmVxdWlyZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcbiAgSnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XG4gICAgaWYgcmVxLmZpbGVzIGFuZCByZXEuZmlsZXNbMF1cbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgbmV3RmlsZS5hdHRhY2hEYXRhIHJlcS5maWxlc1swXS5kYXRhLCB7dHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlfSwgKGVycikgLT5cbiAgICAgICAgZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWVcblxuICAgICAgICBpZiBbXCJpbWFnZS5qcGdcIiwgXCJpbWFnZS5naWZcIiwgXCJpbWFnZS5qcGVnXCIsIFwiaW1hZ2UucG5nXCJdLmluY2x1ZGVzKGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKVxuXG4gICAgICAgIGJvZHkgPSByZXEuYm9keVxuICAgICAgICB0cnlcbiAgICAgICAgICBpZiBib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwiSUVcIiBvciBib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwibm9kZVwiKVxuICAgICAgICAgICAgZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpXG4gICAgICAgIGNhdGNoIGVcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIilcblxuICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZW5hbWUpXG4gICAgICAgIFxuICAgICAgICBpZiBib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnb3duZXJfbmFtZSddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsnaW5zdGFuY2UnXSAgJiYgYm9keVsnYXBwcm92ZSddXG4gICAgICAgICAgcGFyZW50ID0gJydcbiAgICAgICAgICBtZXRhZGF0YSA9IHtvd25lcjpib2R5Wydvd25lciddLCBvd25lcl9uYW1lOmJvZHlbJ293bmVyX25hbWUnXSwgc3BhY2U6Ym9keVsnc3BhY2UnXSwgaW5zdGFuY2U6Ym9keVsnaW5zdGFuY2UnXSwgYXBwcm92ZTogYm9keVsnYXBwcm92ZSddLCBjdXJyZW50OiB0cnVlfVxuXG4gICAgICAgICAgaWYgYm9keVtcImlzX3ByaXZhdGVcIl0gJiYgYm9keVtcImlzX3ByaXZhdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSBcInRydWVcIlxuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IHRydWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gZmFsc2VcblxuICAgICAgICAgIGlmIGJvZHlbJ21haW4nXSA9PSBcInRydWVcIlxuICAgICAgICAgICAgbWV0YWRhdGEubWFpbiA9IHRydWVcblxuICAgICAgICAgIGlmIGJvZHlbJ2lzQWRkVmVyc2lvbiddICYmIGJvZHlbJ3BhcmVudCddXG4gICAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxuICAgICAgICAgICMgZWxzZVxuICAgICAgICAgICMgICBjb2xsZWN0aW9uLmZpbmQoeydtZXRhZGF0YS5pbnN0YW5jZSc6IGJvZHlbJ2luc3RhbmNlJ10sICdtZXRhZGF0YS5jdXJyZW50JyA6IHRydWV9KS5mb3JFYWNoIChjKSAtPlxuICAgICAgICAgICMgICAgIGlmIGMubmFtZSgpID09IGZpbGVuYW1lXG4gICAgICAgICAgIyAgICAgICBwYXJlbnQgPSBjLm1ldGFkYXRhLnBhcmVudFxuXG4gICAgICAgICAgaWYgcGFyZW50XG4gICAgICAgICAgICByID0gY29sbGVjdGlvbi51cGRhdGUoeydtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsICdtZXRhZGF0YS5jdXJyZW50JyA6IHRydWV9LCB7JHVuc2V0IDogeydtZXRhZGF0YS5jdXJyZW50JyA6ICcnfX0pXG4gICAgICAgICAgICBpZiByXG4gICAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudFxuICAgICAgICAgICAgICBpZiBib2R5Wydsb2NrZWRfYnknXSAmJiBib2R5Wydsb2NrZWRfYnlfbmFtZSddXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5ID0gYm9keVsnbG9ja2VkX2J5J11cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnlfbmFtZSA9IGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ11cblxuICAgICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcbiAgICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcblxuICAgICAgICAgICAgICAjIOWIoOmZpOWQjOS4gOS4queUs+ivt+WNleWQjOS4gOS4quatpemqpOWQjOS4gOS4quS6uuS4iuS8oOeahOmHjeWkjeeahOaWh+S7tlxuICAgICAgICAgICAgICBpZiBib2R5W1wib3ZlcndyaXRlXCJdICYmIGJvZHlbXCJvdmVyd3JpdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSBcInRydWVcIlxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHsnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLCAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LCAnbWV0YWRhdGEub3duZXInOiBib2R5Wydvd25lciddLCAnbWV0YWRhdGEuYXBwcm92ZSc6IGJvZHlbJ2FwcHJvdmUnXSwgJ21ldGFkYXRhLmN1cnJlbnQnOiB7JG5lOiB0cnVlfX0pXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXG4gICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuICAgICAgICAgICAgZmlsZU9iai51cGRhdGUoeyRzZXQ6IHsnbWV0YWRhdGEucGFyZW50JyA6IGZpbGVPYmouX2lkfX0pXG5cbiAgICAgICAgIyDlhbzlrrnogIHniYjmnKxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG4gICAgICAgIHJldHVyblxuXG4gICAgICBuZXdGaWxlLm9uY2UgJ3N0b3JlZCcsIChzdG9yZU5hbWUpLT5cbiAgICAgICAgc2l6ZSA9IG5ld0ZpbGUub3JpZ2luYWwuc2l6ZVxuICAgICAgICBpZiAhc2l6ZVxuICAgICAgICAgIHNpemUgPSAxMDI0XG4gICAgICAgIHJlc3AgPVxuICAgICAgICAgIHZlcnNpb25faWQ6IG5ld0ZpbGUuX2lkLFxuICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICAgIHJldHVyblxuICAgIGVsc2VcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuXG5cblxuSnNvblJvdXRlcy5hZGQgXCJkZWxldGVcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cblxuICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xuXG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG4gIGlmIGlkXG4gICAgZmlsZSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogaWQgfSlcbiAgICBpZiBmaWxlXG4gICAgICBmaWxlLnJlbW92ZSgpXG4gICAgICByZXNwID0ge1xuICAgICAgICBzdGF0dXM6IFwiT0tcIlxuICAgICAgfVxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICByZXR1cm5cblxuICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgcmVzLmVuZCgpO1xuXG5cbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XG5cbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcblxuICByZXMuc3RhdHVzQ29kZSA9IDMwMjtcbiAgcmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvaW5zdGFuY2VzL1wiKSArIGlkICsgXCI/ZG93bmxvYWQ9MVwiXG4gIHJlcy5lbmQoKTtcblxuXG4jIE1ldGVvci5tZXRob2RzXG5cbiMgICBzM191cGdyYWRlOiAobWluLCBtYXgpIC0+XG4jICAgICBjb25zb2xlLmxvZyhcIi9zMy91cGdyYWRlXCIpXG5cbiMgICAgIGZzID0gcmVxdWlyZSgnZnMnKVxuIyAgICAgbWltZSA9IHJlcXVpcmUoJ21pbWUnKVxuXG4jICAgICByb290X3BhdGggPSBcIi9tbnQvZmFrZXMzLzEwXCJcbiMgICAgIGNvbnNvbGUubG9nKHJvb3RfcGF0aClcbiMgICAgIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXG5cbiMgICAgICMg6YGN5Y6GaW5zdGFuY2Ug5ou85Ye66ZmE5Lu26Lev5b6EIOWIsOacrOWcsOaJvuWvueW6lOaWh+S7tiDliIbkuKTnp43mg4XlhrUgMS4vZmlsZW5hbWVfdmVyc2lvbklkIDIuL2ZpbGVuYW1l77ybXG4jICAgICBkZWFsX3dpdGhfdmVyc2lvbiA9IChyb290X3BhdGgsIHNwYWNlLCBpbnNfaWQsIHZlcnNpb24sIGF0dGFjaF9maWxlbmFtZSkgLT5cbiMgICAgICAgX3JldiA9IHZlcnNpb24uX3JldlxuIyAgICAgICBpZiAoY29sbGVjdGlvbi5maW5kKHtcIl9pZFwiOiBfcmV2fSkuY291bnQoKSA+MClcbiMgICAgICAgICByZXR1cm5cbiMgICAgICAgY3JlYXRlZF9ieSA9IHZlcnNpb24uY3JlYXRlZF9ieVxuIyAgICAgICBhcHByb3ZlID0gdmVyc2lvbi5hcHByb3ZlXG4jICAgICAgIGZpbGVuYW1lID0gdmVyc2lvbi5maWxlbmFtZSB8fCBhdHRhY2hfZmlsZW5hbWU7XG4jICAgICAgIG1pbWVfdHlwZSA9IG1pbWUubG9va3VwKGZpbGVuYW1lKVxuIyAgICAgICBuZXdfcGF0aCA9IHJvb3RfcGF0aCArIFwiL3NwYWNlcy9cIiArIHNwYWNlICsgXCIvd29ya2Zsb3cvXCIgKyBpbnNfaWQgKyBcIi9cIiArIGZpbGVuYW1lICsgXCJfXCIgKyBfcmV2XG4jICAgICAgIG9sZF9wYXRoID0gcm9vdF9wYXRoICsgXCIvc3BhY2VzL1wiICsgc3BhY2UgKyBcIi93b3JrZmxvdy9cIiArIGluc19pZCArIFwiL1wiICsgZmlsZW5hbWVcblxuIyAgICAgICByZWFkRmlsZSA9IChmdWxsX3BhdGgpIC0+XG4jICAgICAgICAgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyBmdWxsX3BhdGhcblxuIyAgICAgICAgIGlmIGRhdGFcbiMgICAgICAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuIyAgICAgICAgICAgbmV3RmlsZS5faWQgPSBfcmV2O1xuIyAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IHtvd25lcjpjcmVhdGVkX2J5LCBzcGFjZTpzcGFjZSwgaW5zdGFuY2U6aW5zX2lkLCBhcHByb3ZlOiBhcHByb3ZlfTtcbiMgICAgICAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YSBkYXRhLCB7dHlwZTogbWltZV90eXBlfVxuIyAgICAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxuIyAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcbiMgICAgICAgICAgIGNvbnNvbGUubG9nKGZpbGVPYmouX2lkKVxuXG4jICAgICAgIHRyeVxuIyAgICAgICAgIG4gPSBmcy5zdGF0U3luYyBuZXdfcGF0aFxuIyAgICAgICAgIGlmIG4gJiYgbi5pc0ZpbGUoKVxuIyAgICAgICAgICAgcmVhZEZpbGUgbmV3X3BhdGhcbiMgICAgICAgY2F0Y2ggZXJyb3JcbiMgICAgICAgICB0cnlcbiMgICAgICAgICAgIG9sZCA9IGZzLnN0YXRTeW5jIG9sZF9wYXRoXG4jICAgICAgICAgICBpZiBvbGQgJiYgb2xkLmlzRmlsZSgpXG4jICAgICAgICAgICAgIHJlYWRGaWxlIG9sZF9wYXRoXG4jICAgICAgICAgY2F0Y2ggZXJyb3JcbiMgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaWxlIG5vdCBmb3VuZDogXCIgKyBvbGRfcGF0aClcblxuXG4jICAgICBjb3VudCA9IGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9fSkuY291bnQoKTtcbiMgICAgIGNvbnNvbGUubG9nKFwiYWxsIGluc3RhbmNlczogXCIgKyBjb3VudClcblxuIyAgICAgYiA9IG5ldyBEYXRlKClcblxuIyAgICAgaSA9IG1pblxuIyAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIHNraXA6IG1pbiwgbGltaXQ6IG1heC1taW59KS5mb3JFYWNoIChpbnMpIC0+XG4jICAgICAgIGkgPSBpICsgMVxuIyAgICAgICBjb25zb2xlLmxvZyhpICsgXCI6XCIgKyBpbnMubmFtZSlcbiMgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xuIyAgICAgICBzcGFjZSA9IGlucy5zcGFjZVxuIyAgICAgICBpbnNfaWQgPSBpbnMuX2lkXG4jICAgICAgIGF0dGFjaHMuZm9yRWFjaCAoYXR0KSAtPlxuIyAgICAgICAgIGRlYWxfd2l0aF92ZXJzaW9uIHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgYXR0LmN1cnJlbnQsIGF0dC5maWxlbmFtZVxuIyAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xuIyAgICAgICAgICAgYXR0Lmhpc3RvcnlzLmZvckVhY2ggKGhpcykgLT5cbiMgICAgICAgICAgICAgZGVhbF93aXRoX3ZlcnNpb24gcm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCBoaXMsIGF0dC5maWxlbmFtZVxuXG4jICAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpIC0gYilcblxuIyAgICAgcmV0dXJuIFwib2tcIlxuIiwiSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlcztcbiAgcmV0dXJuIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5ld0ZpbGU7XG4gICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgbmV3RmlsZS5hdHRhY2hEYXRhKHJlcS5maWxlc1swXS5kYXRhLCB7XG4gICAgICAgIHR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZVxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHZhciBib2R5LCBlLCBmaWxlT2JqLCBmaWxlbmFtZSwgbWV0YWRhdGEsIHBhcmVudCwgcjtcbiAgICAgICAgZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWU7XG4gICAgICAgIGlmIChbXCJpbWFnZS5qcGdcIiwgXCJpbWFnZS5naWZcIiwgXCJpbWFnZS5qcGVnXCIsIFwiaW1hZ2UucG5nXCJdLmluY2x1ZGVzKGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICBib2R5ID0gcmVxLmJvZHk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGJvZHkgJiYgKGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwiSUVcIiB8fCBib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIm5vZGVcIikpIHtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZmlsZW5hbWUpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZW5hbWUpO1xuICAgICAgICBpZiAoYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ293bmVyX25hbWUnXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ2luc3RhbmNlJ10gJiYgYm9keVsnYXBwcm92ZSddKSB7XG4gICAgICAgICAgcGFyZW50ID0gJyc7XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBvd25lcjogYm9keVsnb3duZXInXSxcbiAgICAgICAgICAgIG93bmVyX25hbWU6IGJvZHlbJ293bmVyX25hbWUnXSxcbiAgICAgICAgICAgIHNwYWNlOiBib2R5WydzcGFjZSddLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGJvZHlbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICBhcHByb3ZlOiBib2R5WydhcHByb3ZlJ10sXG4gICAgICAgICAgICBjdXJyZW50OiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoYm9keVtcImlzX3ByaXZhdGVcIl0gJiYgYm9keVtcImlzX3ByaXZhdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChib2R5WydtYWluJ10gPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYWluID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJvZHlbJ2lzQWRkVmVyc2lvbiddICYmIGJvZHlbJ3BhcmVudCddKSB7XG4gICAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgciA9IGNvbGxlY3Rpb24udXBkYXRlKHtcbiAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCxcbiAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50JzogJydcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgICAgIGlmIChib2R5Wydsb2NrZWRfYnknXSAmJiBib2R5Wydsb2NrZWRfYnlfbmFtZSddKSB7XG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5ID0gYm9keVsnbG9ja2VkX2J5J107XG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5X25hbWUgPSBib2R5Wydsb2NrZWRfYnlfbmFtZSddO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICAgICAgICBpZiAoYm9keVtcIm92ZXJ3cml0ZVwiXSAmJiBib2R5W1wib3ZlcndyaXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5yZW1vdmUoe1xuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEub3duZXInOiBib2R5Wydvd25lciddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLmFwcHJvdmUnOiBib2R5WydhcHByb3ZlJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJG5lOiB0cnVlXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICAgICAgZmlsZU9iai51cGRhdGUoe1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IGZpbGVPYmouX2lkXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUub25jZSgnc3RvcmVkJywgZnVuY3Rpb24oc3RvcmVOYW1lKSB7XG4gICAgICAgIHZhciByZXNwLCBzaXplO1xuICAgICAgICBzaXplID0gbmV3RmlsZS5vcmlnaW5hbC5zaXplO1xuICAgICAgICBpZiAoIXNpemUpIHtcbiAgICAgICAgICBzaXplID0gMTAyNDtcbiAgICAgICAgfVxuICAgICAgICByZXNwID0ge1xuICAgICAgICAgIHZlcnNpb25faWQ6IG5ld0ZpbGUuX2lkLFxuICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcImRlbGV0ZVwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY29sbGVjdGlvbiwgZmlsZSwgaWQsIHJlc3A7XG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzO1xuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuICBpZiAoaWQpIHtcbiAgICBmaWxlID0gY29sbGVjdGlvbi5maW5kT25lKHtcbiAgICAgIF9pZDogaWRcbiAgICB9KTtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgZmlsZS5yZW1vdmUoKTtcbiAgICAgIHJlc3AgPSB7XG4gICAgICAgIHN0YXR1czogXCJPS1wiXG4gICAgICB9O1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJlcy5zdGF0dXNDb2RlID0gNDA0O1xuICByZXR1cm4gcmVzLmVuZCgpO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBpZDtcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcbiAgcmVzLnN0YXR1c0NvZGUgPSAzMDI7XG4gIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2luc3RhbmNlcy9cIikgKyBpZCArIFwiP2Rvd25sb2FkPTFcIik7XG4gIHJldHVybiByZXMuZW5kKCk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvcHVzaC9tZXNzYWdlXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgICBpZiByZXEuYm9keT8ucHVzaFRvcGljIGFuZCByZXEuYm9keS51c2VySWRzIGFuZCByZXEuYm9keS5kYXRhXG4gICAgICAgIG1lc3NhZ2UgPSBcbiAgICAgICAgICAgIGZyb206IFwic3RlZWRvc1wiXG4gICAgICAgICAgICBxdWVyeTpcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiByZXEuYm9keS5wdXNoVG9waWNcbiAgICAgICAgICAgICAgICB1c2VySWQ6IFxuICAgICAgICAgICAgICAgICAgICBcIiRpblwiOiB1c2VySWRzXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZT9cbiAgICAgICAgICAgIG1lc3NhZ2VbXCJ0aXRsZVwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZVxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmFsZXJ0P1xuICAgICAgICAgICAgbWVzc2FnZVtcInRleHRcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0XG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYmFkZ2U/XG4gICAgICAgICAgICBtZXNzYWdlW1wiYmFkZ2VcIl0gPSByZXEuYm9keS5kYXRhLmJhZGdlICsgXCJcIlxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLnNvdW5kP1xuICAgICAgICAgICAgbWVzc2FnZVtcInNvdW5kXCJdID0gcmVxLmJvZHkuZGF0YS5zb3VuZFxuICAgICAgICAjaWYgcmVxLmJvZHkuZGF0YS5kYXRhP1xuICAgICAgICAjICAgIG1lc3NhZ2VbXCJkYXRhXCJdID0gcmVxLmJvZHkuZGF0YS5kYXRhXG4gICAgICAgIFB1c2guc2VuZCBtZXNzYWdlXG5cbiAgICAgICAgcmVzLmVuZChcInN1Y2Nlc3NcIik7XG5cblxuXG5NZXRlb3IubWV0aG9kc1xuICAgIHB1c2hTZW5kOiAodGV4dCx0aXRsZSxiYWRnZSx1c2VySWQpIC0+XG4gICAgICAgIGlmICghdXNlcklkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBQdXNoLnNlbmRcbiAgICAgICAgICAgIGZyb206ICdzdGVlZG9zJyxcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICBiYWRnZTogYmFkZ2UsXG4gICAgICAgICAgICBxdWVyeTogXG4gICAgICAgICAgICAgICAgdXNlcklkOiB1c2VySWRcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiIsIkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvcHVzaC9tZXNzYWdlXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBtZXNzYWdlLCByZWY7XG4gIGlmICgoKHJlZiA9IHJlcS5ib2R5KSAhPSBudWxsID8gcmVmLnB1c2hUb3BpYyA6IHZvaWQgMCkgJiYgcmVxLmJvZHkudXNlcklkcyAmJiByZXEuYm9keS5kYXRhKSB7XG4gICAgbWVzc2FnZSA9IHtcbiAgICAgIGZyb206IFwic3RlZWRvc1wiLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYXBwTmFtZTogcmVxLmJvZHkucHVzaFRvcGljLFxuICAgICAgICB1c2VySWQ6IHtcbiAgICAgICAgICBcIiRpblwiOiB1c2VySWRzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChyZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGUgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInRpdGxlXCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlO1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5hbGVydCAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1widGV4dFwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnQ7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLmJhZGdlICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJiYWRnZVwiXSA9IHJlcS5ib2R5LmRhdGEuYmFkZ2UgKyBcIlwiO1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5zb3VuZCAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1wic291bmRcIl0gPSByZXEuYm9keS5kYXRhLnNvdW5kO1xuICAgIH1cbiAgICBQdXNoLnNlbmQobWVzc2FnZSk7XG4gICAgcmV0dXJuIHJlcy5lbmQoXCJzdWNjZXNzXCIpO1xuICB9XG59KTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICBwdXNoU2VuZDogZnVuY3Rpb24odGV4dCwgdGl0bGUsIGJhZGdlLCB1c2VySWQpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gUHVzaC5zZW5kKHtcbiAgICAgIGZyb206ICdzdGVlZG9zJyxcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIHRleHQ6IHRleHQsXG4gICAgICBiYWRnZTogYmFkZ2UsXG4gICAgICBxdWVyeToge1xuICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQWxpeXVuX3B1c2ggPSB7fTtcblxuQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBjYWxsYmFjaykgLT5cblx0aWYgbm90aWZpY2F0aW9uLnRpdGxlIGFuZCBub3RpZmljYXRpb24udGV4dFxuXHRcdGlmIFB1c2guZGVidWdcblx0XHRcdGNvbnNvbGUubG9nIHVzZXJUb2tlbnNcblxuXHRcdGFsaXl1blRva2VucyA9IG5ldyBBcnJheVxuXHRcdHhpbmdlVG9rZW5zID0gbmV3IEFycmF5XG5cdFx0aHVhd2VpVG9rZW5zID0gbmV3IEFycmF5XG5cdFx0bWlUb2tlbnMgPSBuZXcgQXJyYXlcblxuXHRcdHVzZXJUb2tlbnMuZm9yRWFjaCAodXNlclRva2VuKSAtPlxuXHRcdFx0YXJyID0gdXNlclRva2VuLnNwbGl0KCc6Jylcblx0XHRcdGlmIGFyclswXSBpcyBcImFsaXl1blwiXG5cdFx0XHRcdGFsaXl1blRva2Vucy5wdXNoIF8ubGFzdChhcnIpXG5cdFx0XHRlbHNlIGlmIGFyclswXSBpcyBcInhpbmdlXCJcblx0XHRcdFx0eGluZ2VUb2tlbnMucHVzaCBfLmxhc3QoYXJyKVxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJodWF3ZWlcIlxuXHRcdFx0XHRodWF3ZWlUb2tlbnMucHVzaCBfLmxhc3QoYXJyKVxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJtaVwiXG5cdFx0XHRcdG1pVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcblxuXHRcdGlmICFfLmlzRW1wdHkoYWxpeXVuVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFsaXl1blxuXHRcdFx0QUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcImFsaXl1blRva2VuczogI3thbGl5dW5Ub2tlbnN9XCJcblx0XHRcdEFMWVBVU0ggPSBuZXcgKEFMWS5QVVNIKShcblx0XHRcdFx0YWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hY2Nlc3NLZXlJZFxuXHRcdFx0XHRzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXlcblx0XHRcdFx0ZW5kcG9pbnQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5lbmRwb2ludFxuXHRcdFx0XHRhcGlWZXJzaW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBpVmVyc2lvbik7XG5cblx0XHRcdGRhdGEgPSBcblx0XHRcdFx0QXBwS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBwS2V5XG5cdFx0XHRcdFRhcmdldDogJ2RldmljZSdcblx0XHRcdFx0VGFyZ2V0VmFsdWU6IGFsaXl1blRva2Vucy50b1N0cmluZygpXG5cdFx0XHRcdFRpdGxlOiBub3RpZmljYXRpb24udGl0bGVcblx0XHRcdFx0U3VtbWFyeTogbm90aWZpY2F0aW9uLnRleHRcblxuXHRcdFx0QUxZUFVTSC5wdXNoTm90aWNlVG9BbmRyb2lkIGRhdGEsIGNhbGxiYWNrXG5cblx0XHRpZiAhXy5pc0VtcHR5KHhpbmdlVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/LnhpbmdlXG5cdFx0XHRYaW5nZSA9IHJlcXVpcmUoJ3hpbmdlJyk7XG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwieGluZ2VUb2tlbnM6ICN7eGluZ2VUb2tlbnN9XCJcblx0XHRcdFhpbmdlQXBwID0gbmV3IFhpbmdlLlhpbmdlQXBwKE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLmFjY2Vzc0lkLCBNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5zZWNyZXRLZXkpXG5cdFx0XHRcblx0XHRcdGFuZHJvaWRNZXNzYWdlID0gbmV3IFhpbmdlLkFuZHJvaWRNZXNzYWdlXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS50eXBlID0gWGluZ2UuTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTlxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGVcblx0XHRcdGFuZHJvaWRNZXNzYWdlLmNvbnRlbnQgPSBub3RpZmljYXRpb24udGV4dFxuXHRcdFx0YW5kcm9pZE1lc3NhZ2Uuc3R5bGUgPSBuZXcgWGluZ2UuU3R5bGVcblx0XHRcdGFuZHJvaWRNZXNzYWdlLmFjdGlvbiA9IG5ldyBYaW5nZS5DbGlja0FjdGlvblxuXG5cdFx0XHRfLmVhY2ggeGluZ2VUb2tlbnMsICh0KS0+XG5cdFx0XHRcdFhpbmdlQXBwLnB1c2hUb1NpbmdsZURldmljZSB0LCBhbmRyb2lkTWVzc2FnZSwgY2FsbGJhY2tcblxuXHRcdGlmICFfLmlzRW1wdHkoaHVhd2VpVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lmh1YXdlaVxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcImh1YXdlaVRva2VuczogI3todWF3ZWlUb2tlbnN9XCJcblxuXHRcdFx0cGFja2FnZV9uYW1lID0gTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFBrZ05hbWVcblx0XHRcdHRva2VuRGF0YUxpc3QgPSBbXVxuXHRcdFx0Xy5lYWNoIGh1YXdlaVRva2VucywgKHQpLT5cblx0XHRcdFx0dG9rZW5EYXRhTGlzdC5wdXNoKHsncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLCAndG9rZW4nOiB0fSlcblx0XHRcdG5vdGkgPSB7J2FuZHJvaWQnOiB7J3RpdGxlJzogbm90aWZpY2F0aW9uLnRpdGxlLCAnbWVzc2FnZSc6IG5vdGlmaWNhdGlvbi50ZXh0fSwgJ2V4dHJhcyc6IG5vdGlmaWNhdGlvbi5wYXlsb2FkfVxuXG5cdFx0XHRIdWF3ZWlQdXNoLmNvbmZpZyBbeydwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsICdjbGllbnRfaWQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwSWQsICdjbGllbnRfc2VjcmV0JzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFNlY3JldH1dXG5cdFx0XHRcblx0XHRcdEh1YXdlaVB1c2guc2VuZE1hbnkgbm90aSwgdG9rZW5EYXRhTGlzdFxuXG5cblx0XHRpZiAhXy5pc0VtcHR5KG1pVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lm1pXG5cdFx0XHRNaVB1c2ggPSByZXF1aXJlKCd4aWFvbWktcHVzaCcpO1xuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcIm1pVG9rZW5zOiAje21pVG9rZW5zfVwiXG5cdFx0XHRtc2cgPSBuZXcgTWlQdXNoLk1lc3NhZ2Vcblx0XHRcdG1zZy50aXRsZShub3RpZmljYXRpb24udGl0bGUpLmRlc2NyaXB0aW9uKG5vdGlmaWNhdGlvbi50ZXh0KVxuXHRcdFx0bm90aWZpY2F0aW9uID0gbmV3IE1pUHVzaC5Ob3RpZmljYXRpb24oXG5cdFx0XHRcdHByb2R1Y3Rpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLnByb2R1Y3Rpb25cblx0XHRcdFx0YXBwU2VjcmV0OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5hcHBTZWNyZXRcblx0XHRcdClcblx0XHRcdF8uZWFjaCBtaVRva2VucywgKHJlZ2lkKS0+XG5cdFx0XHRcdG5vdGlmaWNhdGlvbi5zZW5kIHJlZ2lkLCBtc2csIGNhbGxiYWNrXG5cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0XG5cdGlmIG5vdCBNZXRlb3Iuc2V0dGluZ3MuY3Jvbj8ucHVzaF9pbnRlcnZhbFxuXHRcdHJldHVyblxuXG5cdGNvbmZpZyA9IHtcblx0XHRkZWJ1ZzogdHJ1ZVxuXHRcdGtlZXBOb3RpZmljYXRpb25zOiBmYWxzZVxuXHRcdHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24ucHVzaF9pbnRlcnZhbFxuXHRcdHNlbmRCYXRjaFNpemU6IDEwXG5cdFx0cHJvZHVjdGlvbjogdHJ1ZVxuXHR9XG5cblx0aWYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYXBuKVxuXHRcdGNvbmZpZy5hcG4gPSB7XG5cdFx0XHRrZXlEYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4ua2V5RGF0YVxuXHRcdFx0Y2VydERhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5jZXJ0RGF0YVxuXHRcdH1cblx0aWYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uZ2NtKVxuXHRcdGNvbmZpZy5nY20gPSB7XG5cdFx0XHRwcm9qZWN0TnVtYmVyOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20ucHJvamVjdE51bWJlclxuXHRcdFx0YXBpS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20uYXBpS2V5XG5cdFx0fVxuXG5cdFB1c2guQ29uZmlndXJlIGNvbmZpZ1xuXHRcblx0aWYgKE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hbGl5dW4gb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/LnhpbmdlIG9yIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5odWF3ZWkgb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lm1pKSBhbmQgUHVzaCBhbmQgdHlwZW9mIFB1c2guc2VuZEdDTSA9PSAnZnVuY3Rpb24nXG5cdFx0XG5cdFx0UHVzaC5vbGRfc2VuZEdDTSA9IFB1c2guc2VuZEdDTTtcblxuXHRcdFB1c2guc2VuZEFsaXl1biA9ICh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIC0+XG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uXG5cblx0XHRcdGlmIE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KVxuXHRcdFx0XHRub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKVxuXHRcdFx0IyBNYWtlIHN1cmUgdXNlclRva2VucyBhcmUgYW4gYXJyYXkgb2Ygc3RyaW5nc1xuXHRcdFx0aWYgdXNlclRva2VucyA9PSAnJyArIHVzZXJUb2tlbnNcblx0XHRcdFx0dXNlclRva2VucyA9IFsgdXNlclRva2VucyBdXG5cdFx0XHQjIENoZWNrIGlmIGFueSB0b2tlbnMgaW4gdGhlcmUgdG8gc2VuZFxuXHRcdFx0aWYgIXVzZXJUb2tlbnMubGVuZ3RoXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJ1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cblxuXHRcdFx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXHQgIFxuXHRcdFx0dXNlclRva2VuID0gaWYgdXNlclRva2Vucy5sZW5ndGggPT0gMSB0aGVuIHVzZXJUb2tlbnNbMF0gZWxzZSBudWxsXG5cdFx0XHRBbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIChlcnIsIHJlc3VsdCkgLT5cblx0XHRcdFx0aWYgZXJyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQgRVJST1I6IHJlc3VsdCBvZiBzZW5kZXI6ICcgKyByZXN1bHRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIHJlc3VsdCA9PSBudWxsXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyAnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlciBpcyBudWxsJ1xuXHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXI6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpXG5cblx0XHRcdFx0XHRpZiByZXN1bHQuY2Fub25pY2FsX2lkcyA9PSAxIGFuZCB1c2VyVG9rZW5cblx0XHRcdFx0XHRcdEZpYmVyKChzZWxmKSAtPlxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmNhbGxiYWNrIHNlbGYub2xkVG9rZW4sIHNlbGYubmV3VG9rZW5cblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyXG5cdFx0XHRcdFx0XHQpLnJ1blxuXHRcdFx0XHRcdFx0XHRvbGRUb2tlbjogZ2NtOiB1c2VyVG9rZW5cblx0XHRcdFx0XHRcdFx0bmV3VG9rZW46IGdjbTogXCJhbGl5dW46XCIgKyByZXN1bHQucmVzdWx0c1swXS5yZWdpc3RyYXRpb25faWRcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2s6IF9yZXBsYWNlVG9rZW5cblx0XHRcdFx0XHRpZiByZXN1bHQuZmFpbHVyZSAhPSAwIGFuZCB1c2VyVG9rZW5cblx0XHRcdFx0XHRcdEZpYmVyKChzZWxmKSAtPlxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmNhbGxiYWNrIHNlbGYudG9rZW5cblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyXG5cdFx0XHRcdFx0XHQpLnJ1blxuXHRcdFx0XHRcdFx0XHR0b2tlbjogZ2NtOiB1c2VyVG9rZW5cblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2s6IF9yZW1vdmVUb2tlblxuXG5cblxuXHRcdFB1c2guc2VuZEdDTSA9ICh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIC0+XG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIGZyb20gYWxpeXVuLT4gUHVzaC5zZW5kR0NNJ1xuXHRcdFx0aWYgTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpXG5cdFx0XHRcdG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pXG5cdFx0XHQjIE1ha2Ugc3VyZSB1c2VyVG9rZW5zIGFyZSBhbiBhcnJheSBvZiBzdHJpbmdzXG5cdFx0XHRpZiB1c2VyVG9rZW5zID09ICcnICsgdXNlclRva2Vuc1xuXHRcdFx0XHR1c2VyVG9rZW5zID0gWyB1c2VyVG9rZW5zIF1cblx0XHRcdCMgQ2hlY2sgaWYgYW55IHRva2VucyBpbiB0aGVyZSB0byBzZW5kXG5cdFx0XHRpZiAhdXNlclRva2Vucy5sZW5ndGhcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTScsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxuXG5cdFx0XHRhbGl5dW5Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcigoaXRlbSkgLT5cblx0XHRcdFx0XHRcdFx0XHRpdGVtLmluZGV4T2YoJ2FsaXl1bjonKSA+IC0xIG9yIGl0ZW0uaW5kZXhPZigneGluZ2U6JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ2h1YXdlaTonKSA+IC0xIG9yIGl0ZW0uaW5kZXhPZignbWk6JykgPiAtMVxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdhbGl5dW5Ub2tlbnMgaXMgJywgYWxpeXVuVG9rZW5zLnRvU3RyaW5nKClcblxuXHRcdFx0Z2NtVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoKGl0ZW0pIC0+XG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5pbmRleE9mKFwiYWxpeXVuOlwiKSA8IDAgYW5kIGl0ZW0uaW5kZXhPZihcInhpbmdlOlwiKSA8IDAgYW5kIGl0ZW0uaW5kZXhPZihcImh1YXdlaTpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJtaTpcIikgPCAwXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ2djbVRva2VucyBpcyAnICwgZ2NtVG9rZW5zLnRvU3RyaW5nKCk7XG5cblx0XHRcdFB1c2guc2VuZEFsaXl1bihhbGl5dW5Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG5cblx0XHRcdFB1c2gub2xkX3NlbmRHQ00oZ2NtVG9rZW5zLCBub3RpZmljYXRpb24pO1xuXG5cdFx0UHVzaC5vbGRfc2VuZEFQTiA9IFB1c2guc2VuZEFQTlxuXHRcdFB1c2guc2VuZEFQTiA9ICh1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbikgLT5cblx0XHRcdGlmIG5vdGlmaWNhdGlvbi50aXRsZSBhbmQgbm90aWZpY2F0aW9uLnRleHRcblx0XHRcdFx0bm90aSA9IF8uY2xvbmUobm90aWZpY2F0aW9uKVxuXHRcdFx0XHRub3RpLnRleHQgPSBub3RpLnRpdGxlICsgXCIgXCIgKyBub3RpLnRleHRcblx0XHRcdFx0bm90aS50aXRsZSA9IFwiXCJcblx0XHRcdFx0UHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGkpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpZmljYXRpb24pXG4iLCJ2YXIgQWxpeXVuX3B1c2g7XG5cbkFsaXl1bl9wdXNoID0ge307XG5cbkFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBjYWxsYmFjaykge1xuICB2YXIgQUxZLCBBTFlQVVNILCBNaVB1c2gsIFhpbmdlLCBYaW5nZUFwcCwgYWxpeXVuVG9rZW5zLCBhbmRyb2lkTWVzc2FnZSwgZGF0YSwgaHVhd2VpVG9rZW5zLCBtaVRva2VucywgbXNnLCBub3RpLCBwYWNrYWdlX25hbWUsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdG9rZW5EYXRhTGlzdCwgeGluZ2VUb2tlbnM7XG4gIGlmIChub3RpZmljYXRpb24udGl0bGUgJiYgbm90aWZpY2F0aW9uLnRleHQpIHtcbiAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2codXNlclRva2Vucyk7XG4gICAgfVxuICAgIGFsaXl1blRva2VucyA9IG5ldyBBcnJheTtcbiAgICB4aW5nZVRva2VucyA9IG5ldyBBcnJheTtcbiAgICBodWF3ZWlUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgbWlUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgdXNlclRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uKHVzZXJUb2tlbikge1xuICAgICAgdmFyIGFycjtcbiAgICAgIGFyciA9IHVzZXJUb2tlbi5zcGxpdCgnOicpO1xuICAgICAgaWYgKGFyclswXSA9PT0gXCJhbGl5dW5cIikge1xuICAgICAgICByZXR1cm4gYWxpeXVuVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwieGluZ2VcIikge1xuICAgICAgICByZXR1cm4geGluZ2VUb2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyclswXSA9PT0gXCJodWF3ZWlcIikge1xuICAgICAgICByZXR1cm4gaHVhd2VpVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwibWlcIikge1xuICAgICAgICByZXR1cm4gbWlUb2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFfLmlzRW1wdHkoYWxpeXVuVG9rZW5zKSAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmLmFsaXl1biA6IHZvaWQgMCkpIHtcbiAgICAgIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYWxpeXVuVG9rZW5zOiBcIiArIGFsaXl1blRva2Vucyk7XG4gICAgICB9XG4gICAgICBBTFlQVVNIID0gbmV3IEFMWS5QVVNIKHtcbiAgICAgICAgYWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hY2Nlc3NLZXlJZCxcbiAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5LFxuICAgICAgICBlbmRwb2ludDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmVuZHBvaW50LFxuICAgICAgICBhcGlWZXJzaW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBpVmVyc2lvblxuICAgICAgfSk7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBBcHBLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hcHBLZXksXG4gICAgICAgIFRhcmdldDogJ2RldmljZScsXG4gICAgICAgIFRhcmdldFZhbHVlOiBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKSxcbiAgICAgICAgVGl0bGU6IG5vdGlmaWNhdGlvbi50aXRsZSxcbiAgICAgICAgU3VtbWFyeTogbm90aWZpY2F0aW9uLnRleHRcbiAgICAgIH07XG4gICAgICBBTFlQVVNILnB1c2hOb3RpY2VUb0FuZHJvaWQoZGF0YSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eSh4aW5nZVRva2VucykgJiYgKChyZWYxID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYxLnhpbmdlIDogdm9pZCAwKSkge1xuICAgICAgWGluZ2UgPSByZXF1aXJlKCd4aW5nZScpO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ4aW5nZVRva2VuczogXCIgKyB4aW5nZVRva2Vucyk7XG4gICAgICB9XG4gICAgICBYaW5nZUFwcCA9IG5ldyBYaW5nZS5YaW5nZUFwcChNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5hY2Nlc3NJZCwgTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2Uuc2VjcmV0S2V5KTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlID0gbmV3IFhpbmdlLkFuZHJvaWRNZXNzYWdlO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UudHlwZSA9IFhpbmdlLk1FU1NBR0VfVFlQRV9OT1RJRklDQVRJT047XG4gICAgICBhbmRyb2lkTWVzc2FnZS50aXRsZSA9IG5vdGlmaWNhdGlvbi50aXRsZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLmNvbnRlbnQgPSBub3RpZmljYXRpb24udGV4dDtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnN0eWxlID0gbmV3IFhpbmdlLlN0eWxlO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UuYWN0aW9uID0gbmV3IFhpbmdlLkNsaWNrQWN0aW9uO1xuICAgICAgXy5lYWNoKHhpbmdlVG9rZW5zLCBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiBYaW5nZUFwcC5wdXNoVG9TaW5nbGVEZXZpY2UodCwgYW5kcm9pZE1lc3NhZ2UsIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eShodWF3ZWlUb2tlbnMpICYmICgocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMi5odWF3ZWkgOiB2b2lkIDApKSB7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImh1YXdlaVRva2VuczogXCIgKyBodWF3ZWlUb2tlbnMpO1xuICAgICAgfVxuICAgICAgcGFja2FnZV9uYW1lID0gTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFBrZ05hbWU7XG4gICAgICB0b2tlbkRhdGFMaXN0ID0gW107XG4gICAgICBfLmVhY2goaHVhd2VpVG9rZW5zLCBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0b2tlbkRhdGFMaXN0LnB1c2goe1xuICAgICAgICAgICdwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsXG4gICAgICAgICAgJ3Rva2VuJzogdFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgbm90aSA9IHtcbiAgICAgICAgJ2FuZHJvaWQnOiB7XG4gICAgICAgICAgJ3RpdGxlJzogbm90aWZpY2F0aW9uLnRpdGxlLFxuICAgICAgICAgICdtZXNzYWdlJzogbm90aWZpY2F0aW9uLnRleHRcbiAgICAgICAgfSxcbiAgICAgICAgJ2V4dHJhcyc6IG5vdGlmaWNhdGlvbi5wYXlsb2FkXG4gICAgICB9O1xuICAgICAgSHVhd2VpUHVzaC5jb25maWcoW1xuICAgICAgICB7XG4gICAgICAgICAgJ3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSxcbiAgICAgICAgICAnY2xpZW50X2lkJzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcElkLFxuICAgICAgICAgICdjbGllbnRfc2VjcmV0JzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFNlY3JldFxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICAgIEh1YXdlaVB1c2guc2VuZE1hbnkobm90aSwgdG9rZW5EYXRhTGlzdCk7XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KG1pVG9rZW5zKSAmJiAoKHJlZjMgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjMubWkgOiB2b2lkIDApKSB7XG4gICAgICBNaVB1c2ggPSByZXF1aXJlKCd4aWFvbWktcHVzaCcpO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJtaVRva2VuczogXCIgKyBtaVRva2Vucyk7XG4gICAgICB9XG4gICAgICBtc2cgPSBuZXcgTWlQdXNoLk1lc3NhZ2U7XG4gICAgICBtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5kZXNjcmlwdGlvbihub3RpZmljYXRpb24udGV4dCk7XG4gICAgICBub3RpZmljYXRpb24gPSBuZXcgTWlQdXNoLk5vdGlmaWNhdGlvbih7XG4gICAgICAgIHByb2R1Y3Rpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLnByb2R1Y3Rpb24sXG4gICAgICAgIGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkuYXBwU2VjcmV0XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2gobWlUb2tlbnMsIGZ1bmN0aW9uKHJlZ2lkKSB7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uc2VuZChyZWdpZCwgbXNnLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY29uZmlnLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjY7XG4gIGlmICghKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MuY3JvbikgIT0gbnVsbCA/IHJlZi5wdXNoX2ludGVydmFsIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25maWcgPSB7XG4gICAgZGVidWc6IHRydWUsXG4gICAga2VlcE5vdGlmaWNhdGlvbnM6IGZhbHNlLFxuICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24ucHVzaF9pbnRlcnZhbCxcbiAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICBwcm9kdWN0aW9uOiB0cnVlXG4gIH07XG4gIGlmICghXy5pc0VtcHR5KChyZWYxID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYxLmFwbiA6IHZvaWQgMCkpIHtcbiAgICBjb25maWcuYXBuID0ge1xuICAgICAga2V5RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmtleURhdGEsXG4gICAgICBjZXJ0RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmNlcnREYXRhXG4gICAgfTtcbiAgfVxuICBpZiAoIV8uaXNFbXB0eSgocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMi5nY20gOiB2b2lkIDApKSB7XG4gICAgY29uZmlnLmdjbSA9IHtcbiAgICAgIHByb2plY3ROdW1iZXI6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5wcm9qZWN0TnVtYmVyLFxuICAgICAgYXBpS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20uYXBpS2V5XG4gICAgfTtcbiAgfVxuICBQdXNoLkNvbmZpZ3VyZShjb25maWcpO1xuICBpZiAoKCgocmVmMyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMy5hbGl5dW4gOiB2b2lkIDApIHx8ICgocmVmNCA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNC54aW5nZSA6IHZvaWQgMCkgfHwgKChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY1Lmh1YXdlaSA6IHZvaWQgMCkgfHwgKChyZWY2ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY2Lm1pIDogdm9pZCAwKSkgJiYgUHVzaCAmJiB0eXBlb2YgUHVzaC5zZW5kR0NNID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUHVzaC5vbGRfc2VuZEdDTSA9IFB1c2guc2VuZEdDTTtcbiAgICBQdXNoLnNlbmRBbGl5dW4gPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBGaWJlciwgdXNlclRva2VuO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KSkge1xuICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyVG9rZW5zID09PSAnJyArIHVzZXJUb2tlbnMpIHtcbiAgICAgICAgdXNlclRva2VucyA9IFt1c2VyVG9rZW5zXTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlclRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgICAgIHVzZXJUb2tlbiA9IHVzZXJUb2tlbnMubGVuZ3RoID09PSAxID8gdXNlclRva2Vuc1swXSA6IG51bGw7XG4gICAgICByZXR1cm4gQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UodXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdBTkRST0lEIEVSUk9SOiByZXN1bHQgb2Ygc2VuZGVyOiAnICsgcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlciBpcyBudWxsJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXI6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdC5jYW5vbmljYWxfaWRzID09PSAxICYmIHVzZXJUb2tlbikge1xuICAgICAgICAgICAgRmliZXIoZnVuY3Rpb24oc2VsZikge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKHNlbGYub2xkVG9rZW4sIHNlbGYubmV3VG9rZW4pO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5ydW4oe1xuICAgICAgICAgICAgICBvbGRUb2tlbjoge1xuICAgICAgICAgICAgICAgIGdjbTogdXNlclRva2VuXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5ld1Rva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiBcImFsaXl1bjpcIiArIHJlc3VsdC5yZXN1bHRzWzBdLnJlZ2lzdHJhdGlvbl9pZFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWxsYmFjazogX3JlcGxhY2VUb2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQuZmFpbHVyZSAhPT0gMCAmJiB1c2VyVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBGaWJlcihmdW5jdGlvbihzZWxmKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soc2VsZi50b2tlbik7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnJ1bih7XG4gICAgICAgICAgICAgIHRva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiB1c2VyVG9rZW5cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IF9yZW1vdmVUb2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIFB1c2guc2VuZEdDTSA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIGFsaXl1blRva2VucywgZ2NtVG9rZW5zO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gZnJvbSBhbGl5dW4tPiBQdXNoLnNlbmRHQ00nKTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdCkpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSk7XG4gICAgICB9XG4gICAgICBpZiAodXNlclRva2VucyA9PT0gJycgKyB1c2VyVG9rZW5zKSB7XG4gICAgICAgIHVzZXJUb2tlbnMgPSBbdXNlclRva2Vuc107XG4gICAgICB9XG4gICAgICBpZiAoIXVzZXJUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICAgIGFsaXl1blRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaW5kZXhPZignYWxpeXVuOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCd4aW5nZTonKSA+IC0xIHx8IGl0ZW0uaW5kZXhPZignaHVhd2VpOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCdtaTonKSA+IC0xO1xuICAgICAgfSk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnYWxpeXVuVG9rZW5zIGlzICcsIGFsaXl1blRva2Vucy50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIGdjbVRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaW5kZXhPZihcImFsaXl1bjpcIikgPCAwICYmIGl0ZW0uaW5kZXhPZihcInhpbmdlOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwiaHVhd2VpOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwibWk6XCIpIDwgMDtcbiAgICAgIH0pO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2djbVRva2VucyBpcyAnLCBnY21Ub2tlbnMudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICBQdXNoLnNlbmRBbGl5dW4oYWxpeXVuVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRHQ00oZ2NtVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgIH07XG4gICAgUHVzaC5vbGRfc2VuZEFQTiA9IFB1c2guc2VuZEFQTjtcbiAgICByZXR1cm4gUHVzaC5zZW5kQVBOID0gZnVuY3Rpb24odXNlclRva2VuLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBub3RpO1xuICAgICAgaWYgKG5vdGlmaWNhdGlvbi50aXRsZSAmJiBub3RpZmljYXRpb24udGV4dCkge1xuICAgICAgICBub3RpID0gXy5jbG9uZShub3RpZmljYXRpb24pO1xuICAgICAgICBub3RpLnRleHQgPSBub3RpLnRpdGxlICsgXCIgXCIgKyBub3RpLnRleHQ7XG4gICAgICAgIG5vdGkudGl0bGUgPSBcIlwiO1xuICAgICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIl19
