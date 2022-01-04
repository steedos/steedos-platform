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
  var config, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;

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

  if (!_.isEmpty((ref1 = Meteor.settings.push) != null ? ref1.apn : void 0) && !_.isEmpty((ref2 = Meteor.settings.push) != null ? ref2.apn.keyData : void 0) && !_.isEmpty((ref3 = Meteor.settings.push) != null ? ref3.apn.certData : void 0)) {
    config.apn = {
      keyData: Meteor.settings.push.apn.keyData,
      certData: Meteor.settings.push.apn.certData
    };
  }

  if (!_.isEmpty((ref4 = Meteor.settings.push) != null ? ref4.gcm : void 0) && !_.isEmpty((ref5 = Meteor.settings.push) != null ? ref5.gcm.projectNumber : void 0) && !_.isEmpty((ref6 = Meteor.settings.push) != null ? ref6.gcm.apiKey : void 0)) {
    config.gcm = {
      projectNumber: Meteor.settings.push.gcm.projectNumber,
      apiKey: Meteor.settings.push.gcm.apiKey
    };
  }

  Push.Configure(config);

  if ((((ref7 = Meteor.settings.push) != null ? ref7.aliyun : void 0) || ((ref8 = Meteor.settings.push) != null ? ref8.xinge : void 0) || ((ref9 = Meteor.settings.push) != null ? ref9.huawei : void 0) || ((ref10 = Meteor.settings.push) != null ? ref10.mi : void 0)) && Push && typeof Push.sendGCM === 'function') {
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
      var e, noti;

      try {
        if (notification.title && notification.text) {
          noti = _.clone(notification);
          noti.text = noti.title + " " + noti.text;
          noti.title = "";
          return Push.old_sendAPN(userToken, noti);
        } else {
          return Push.old_sendAPN(userToken, notification);
        }
      } catch (error) {
        e = error;
        return console.error(e);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3BhcnNlX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFyc2VfZmlsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvbGliL3Jlc3RpdnVzL2lyb24tcm91dGVyLWVycm9yLXRvLXJlc3BvbnNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3N0ZWVkb3Mvc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zdGVlZG9zL3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsIkJ1c2JveSIsIkZpYmVyIiwicmVxdWlyZSIsIkpzb25Sb3V0ZXMiLCJwYXJzZUZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImZpbGVzIiwibWV0aG9kIiwiaGVhZGVycyIsIm9uIiwiZmllbGRuYW1lIiwiZmlsZSIsImZpbGVuYW1lIiwiZW5jb2RpbmciLCJtaW1ldHlwZSIsImJ1ZmZlcnMiLCJpbWFnZSIsIm1pbWVUeXBlIiwiZGF0YSIsInB1c2giLCJCdWZmZXIiLCJjb25jYXQiLCJ2YWx1ZSIsImJvZHkiLCJydW4iLCJwaXBlIiwiZ2V0VXNlclF1ZXJ5U2VsZWN0b3IiLCJ1c2VyVmFsaWRhdG9yIiwiQXV0aCIsIk1hdGNoIiwiV2hlcmUiLCJ1c2VyIiwiY2hlY2siLCJpZCIsIk9wdGlvbmFsIiwiU3RyaW5nIiwidXNlcm5hbWUiLCJlbWFpbCIsIl8iLCJrZXlzIiwibGVuZ3RoIiwiRXJyb3IiLCJsb2dpbldpdGhQYXNzd29yZCIsInBhc3N3b3JkIiwiYXV0aFRva2VuIiwiYXV0aGVudGljYXRpbmdVc2VyIiwiYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IiLCJoYXNoZWRUb2tlbiIsInBhc3N3b3JkVmVyaWZpY2F0aW9uIiwicmVmIiwic3BhY2VfdXNlcnMiLCJzcGFjZXMiLCJNZXRlb3IiLCJ1c2VycyIsImZpbmRPbmUiLCJzZXJ2aWNlcyIsIkFjY291bnRzIiwiX2NoZWNrUGFzc3dvcmQiLCJlcnJvciIsIl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuIiwiX2hhc2hTdGFtcGVkVG9rZW4iLCJfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiIsIl9pZCIsImRiIiwiZmluZCIsImZldGNoIiwiZWFjaCIsInN1Iiwic3BhY2UiLCJTdGVlZG9zIiwiaGFzRmVhdHVyZSIsImluZGV4T2YiLCJhZG1pbnMiLCJuYW1lIiwidG9rZW4iLCJ1c2VySWQiLCJhZG1pblNwYWNlcyIsImVudiIsInByb2Nlc3MiLCJOT0RFX0VOViIsImlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlIiwiZXJyIiwic3RhdHVzQ29kZSIsInN0YXR1cyIsIm1zZyIsInN0YWNrIiwidG9TdHJpbmciLCJjb25zb2xlIiwiaGVhZGVyc1NlbnQiLCJzb2NrZXQiLCJkZXN0cm95Iiwic2V0SGVhZGVyIiwiYnl0ZUxlbmd0aCIsImVuZCIsInNoYXJlIiwiUm91dGUiLCJhcGkiLCJwYXRoIiwib3B0aW9ucyIsImVuZHBvaW50czEiLCJlbmRwb2ludHMiLCJwcm90b3R5cGUiLCJhZGRUb0FwaSIsImF2YWlsYWJsZU1ldGhvZHMiLCJhbGxvd2VkTWV0aG9kcyIsImZ1bGxQYXRoIiwicmVqZWN0ZWRNZXRob2RzIiwic2VsZiIsImNvbnRhaW5zIiwiX2NvbmZpZyIsInBhdGhzIiwiZXh0ZW5kIiwiZGVmYXVsdE9wdGlvbnNFbmRwb2ludCIsIl9yZXNvbHZlRW5kcG9pbnRzIiwiX2NvbmZpZ3VyZUVuZHBvaW50cyIsImZpbHRlciIsInJlamVjdCIsImFwaVBhdGgiLCJlbmRwb2ludCIsImFkZCIsImRvbmVGdW5jIiwiZW5kcG9pbnRDb250ZXh0IiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VJbml0aWF0ZWQiLCJ1cmxQYXJhbXMiLCJwYXJhbXMiLCJxdWVyeVBhcmFtcyIsInF1ZXJ5IiwiYm9keVBhcmFtcyIsInJlcXVlc3QiLCJyZXNwb25zZSIsImRvbmUiLCJfY2FsbEVuZHBvaW50IiwiZXJyb3IxIiwiX3Jlc3BvbmQiLCJtZXNzYWdlIiwiam9pbiIsInRvVXBwZXJDYXNlIiwiaXNGdW5jdGlvbiIsImFjdGlvbiIsInJlZjEiLCJyZWYyIiwicm9sZVJlcXVpcmVkIiwidW5pb24iLCJpc0VtcHR5IiwiYXV0aFJlcXVpcmVkIiwic3BhY2VSZXF1aXJlZCIsImludm9jYXRpb24iLCJfYXV0aEFjY2VwdGVkIiwiX3JvbGVBY2NlcHRlZCIsIl9zcGFjZUFjY2VwdGVkIiwiRERQQ29tbW9uIiwiTWV0aG9kSW52b2NhdGlvbiIsImlzU2ltdWxhdGlvbiIsImNvbm5lY3Rpb24iLCJyYW5kb21TZWVkIiwibWFrZVJwY1NlZWQiLCJERFAiLCJfQ3VycmVudEludm9jYXRpb24iLCJ3aXRoVmFsdWUiLCJjYWxsIiwiX2F1dGhlbnRpY2F0ZSIsImF1dGgiLCJ1c2VyU2VsZWN0b3IiLCJzcGFjZV91c2Vyc19jb3VudCIsInNwYWNlSWQiLCJjb3VudCIsImludGVyc2VjdGlvbiIsInJvbGVzIiwiZGVmYXVsdEhlYWRlcnMiLCJkZWxheUluTWlsbGlzZWNvbmRzIiwibWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMiLCJyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byIsInNlbmRSZXNwb25zZSIsIl9sb3dlckNhc2VLZXlzIiwibWF0Y2giLCJwcmV0dHlKc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlSGVhZCIsIndyaXRlIiwiTWF0aCIsInJhbmRvbSIsInNldFRpbWVvdXQiLCJvYmplY3QiLCJjaGFpbiIsInBhaXJzIiwibWFwIiwiYXR0ciIsInRvTG93ZXJDYXNlIiwiUmVzdGl2dXMiLCJpdGVtIiwiaSIsImwiLCJjb3JzSGVhZGVycyIsIl9yb3V0ZXMiLCJ1c2VEZWZhdWx0QXV0aCIsInZlcnNpb24iLCJfdXNlciIsIl9oYXNoTG9naW5Ub2tlbiIsImVuYWJsZUNvcnMiLCJzbGljZSIsImxhc3QiLCJfaW5pdEF1dGgiLCJ1c2VBdXRoIiwid2FybiIsImFkZFJvdXRlIiwicm91dGUiLCJhZGRDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FbmRwb2ludHMiLCJjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMiLCJlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24iLCJlbnRpdHlSb3V0ZUVuZHBvaW50cyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwibWV0aG9kcyIsIm1ldGhvZHNPbkNvbGxlY3Rpb24iLCJyb3V0ZU9wdGlvbnMiLCJfdXNlckNvbGxlY3Rpb25FbmRwb2ludHMiLCJfY29sbGVjdGlvbkVuZHBvaW50cyIsIl9uYW1lIiwiY29uZmlndXJlZEVuZHBvaW50IiwiZW5kcG9pbnRPcHRpb25zIiwibWV0aG9kVHlwZSIsImNsb25lIiwiZ2V0IiwiZW50aXR5Iiwic2VsZWN0b3IiLCJwdXQiLCJlbnRpdHlJc1VwZGF0ZWQiLCJ1cGRhdGUiLCIkc2V0IiwicmVtb3ZlIiwicG9zdCIsImVudGl0eUlkIiwiaW5zZXJ0IiwiZ2V0QWxsIiwiZW50aXRpZXMiLCJmaWVsZHMiLCJwcm9maWxlIiwiY3JlYXRlVXNlciIsImxvZ291dCIsImUiLCJleHRyYURhdGEiLCJzZWFyY2hRdWVyeSIsInJlYXNvbiIsIm9uTG9nZ2VkSW4iLCJleHRyYSIsImluZGV4IiwidG9rZW5GaWVsZE5hbWUiLCJ0b2tlbkxvY2F0aW9uIiwidG9rZW5QYXRoIiwidG9rZW5SZW1vdmFsUXVlcnkiLCJ0b2tlblRvUmVtb3ZlIiwibGFzdEluZGV4T2YiLCJzdWJzdHJpbmciLCIkcHVsbCIsIm9uTG9nZ2VkT3V0IiwiaXNTZXJ2ZXIiLCJBUEkiLCJzdGFydHVwIiwib3JnYW5pemF0aW9ucyIsImNmcyIsImluc3RhbmNlcyIsIm5ld0ZpbGUiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwidHlwZSIsImZpbGVPYmoiLCJtZXRhZGF0YSIsInBhcmVudCIsInIiLCJpbmNsdWRlcyIsIm1vbWVudCIsIkRhdGUiLCJmb3JtYXQiLCJzcGxpdCIsInBvcCIsImRlY29kZVVSSUNvbXBvbmVudCIsInJlcGxhY2UiLCJvd25lciIsIm93bmVyX25hbWUiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwidG9Mb2NhbGVMb3dlckNhc2UiLCJpc19wcml2YXRlIiwibWFpbiIsIiR1bnNldCIsImxvY2tlZF9ieSIsImxvY2tlZF9ieV9uYW1lIiwiJG5lIiwib25jZSIsInN0b3JlTmFtZSIsInJlc3AiLCJzaXplIiwib3JpZ2luYWwiLCJ2ZXJzaW9uX2lkIiwiYWJzb2x1dGVVcmwiLCJwdXNoVG9waWMiLCJ1c2VySWRzIiwiZnJvbSIsImFwcE5hbWUiLCJhbGVydFRpdGxlIiwiYWxlcnQiLCJiYWRnZSIsInNvdW5kIiwiUHVzaCIsInNlbmQiLCJwdXNoU2VuZCIsInRleHQiLCJ0aXRsZSIsIkFsaXl1bl9wdXNoIiwic2VuZE1lc3NhZ2UiLCJ1c2VyVG9rZW5zIiwibm90aWZpY2F0aW9uIiwiY2FsbGJhY2siLCJBTFkiLCJBTFlQVVNIIiwiTWlQdXNoIiwiWGluZ2UiLCJYaW5nZUFwcCIsImFsaXl1blRva2VucyIsImFuZHJvaWRNZXNzYWdlIiwiaHVhd2VpVG9rZW5zIiwibWlUb2tlbnMiLCJub3RpIiwicGFja2FnZV9uYW1lIiwicmVmMyIsInRva2VuRGF0YUxpc3QiLCJ4aW5nZVRva2VucyIsImRlYnVnIiwibG9nIiwiQXJyYXkiLCJmb3JFYWNoIiwidXNlclRva2VuIiwiYXJyIiwic2V0dGluZ3MiLCJhbGl5dW4iLCJQVVNIIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJhcGlWZXJzaW9uIiwiQXBwS2V5IiwiYXBwS2V5IiwiVGFyZ2V0IiwiVGFyZ2V0VmFsdWUiLCJUaXRsZSIsIlN1bW1hcnkiLCJwdXNoTm90aWNlVG9BbmRyb2lkIiwieGluZ2UiLCJhY2Nlc3NJZCIsInNlY3JldEtleSIsIkFuZHJvaWRNZXNzYWdlIiwiTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTiIsImNvbnRlbnQiLCJzdHlsZSIsIlN0eWxlIiwiQ2xpY2tBY3Rpb24iLCJ0IiwicHVzaFRvU2luZ2xlRGV2aWNlIiwiaHVhd2VpIiwiYXBwUGtnTmFtZSIsInBheWxvYWQiLCJIdWF3ZWlQdXNoIiwiY29uZmlnIiwiYXBwSWQiLCJhcHBTZWNyZXQiLCJzZW5kTWFueSIsIm1pIiwiTWVzc2FnZSIsImRlc2NyaXB0aW9uIiwiTm90aWZpY2F0aW9uIiwicHJvZHVjdGlvbiIsInJlZ2lkIiwicmVmMTAiLCJyZWY0IiwicmVmNSIsInJlZjYiLCJyZWY3IiwicmVmOCIsInJlZjkiLCJjcm9uIiwicHVzaF9pbnRlcnZhbCIsImtlZXBOb3RpZmljYXRpb25zIiwic2VuZEludGVydmFsIiwic2VuZEJhdGNoU2l6ZSIsImFwbiIsImtleURhdGEiLCJjZXJ0RGF0YSIsImdjbSIsInByb2plY3ROdW1iZXIiLCJhcGlLZXkiLCJDb25maWd1cmUiLCJzZW5kR0NNIiwib2xkX3NlbmRHQ00iLCJzZW5kQWxpeXVuIiwidGVzdCIsIk9iamVjdCIsInJlc3VsdCIsImNhbm9uaWNhbF9pZHMiLCJvbGRUb2tlbiIsIm5ld1Rva2VuIiwicmVzdWx0cyIsInJlZ2lzdHJhdGlvbl9pZCIsIl9yZXBsYWNlVG9rZW4iLCJmYWlsdXJlIiwiX3JlbW92ZVRva2VuIiwiZ2NtVG9rZW5zIiwib2xkX3NlbmRBUE4iLCJzZW5kQVBOIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixnQkFBYyxTQURFO0FBRWhCSSxRQUFNLEVBQUUsVUFGUTtBQUdoQkMsU0FBTyxFQUFFLFNBSE87QUFJaEIsU0FB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QUt1RyxPQUFMLEdBQWUsVUFBQzNFLFNBQUQsRUFBWXBCLFlBQVo7QUFDZCxVQUFBMUUsQ0FBQSxFQUFBcUYsSUFBQTs7QUFBQTtBQUNDLFlBQUdYLGFBQWFKLEtBQWIsSUFBdUJJLGFBQWFMLElBQXZDO0FBQ0NnQixpQkFBT2pTLEVBQUUwTCxLQUFGLENBQVE0RixZQUFSLENBQVA7QUFDQVcsZUFBS2hCLElBQUwsR0FBWWdCLEtBQUtmLEtBQUwsR0FBYSxHQUFiLEdBQW1CZSxLQUFLaEIsSUFBcEM7QUFDQWdCLGVBQUtmLEtBQUwsR0FBYSxFQUFiO0FDc0NLLGlCRHJDTEosS0FBS3NHLFdBQUwsQ0FBaUIxRSxTQUFqQixFQUE0QlQsSUFBNUIsQ0NxQ0s7QUR6Q047QUMyQ00saUJEckNMbkIsS0FBS3NHLFdBQUwsQ0FBaUIxRSxTQUFqQixFQUE0QnBCLFlBQTVCLENDcUNLO0FENUNQO0FBQUEsZUFBQWxRLEtBQUE7QUFRTXdMLFlBQUF4TCxLQUFBO0FDd0NELGVEdkNKNkIsUUFBUTdCLEtBQVIsQ0FBY3dMLENBQWQsQ0N1Q0k7QUFDRDtBRGxEVSxLQ29DYjtBQWdCRDtBRHBLSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHQnYWxpeXVuLXNkayc6ICc+PTEuOS4yJyxcblx0YnVzYm95OiBcIj49MC4yLjEzXCIsXG5cdGNvb2tpZXM6IFwiPj0wLjYuMlwiLFxuXHQnY3N2JzogXCI+PTUuMS4yXCIsXG5cdCd1cmwnOiAnPj0wLjEwLjAnLFxuXHQncmVxdWVzdCc6ICc+PTIuODEuMCcsXG5cdCd4aW5nZSc6ICc+PTEuMS4zJyxcblx0J3hpYW9taS1wdXNoJzogJz49MC40LjUnXG59LCAnc3RlZWRvczphcGknKTsiLCJCdXNib3kgPSByZXF1aXJlKCdidXNib3knKTtcbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbkpzb25Sb3V0ZXMucGFyc2VGaWxlcyA9IChyZXEsIHJlcywgbmV4dCkgLT5cblx0ZmlsZXMgPSBbXTsgIyBTdG9yZSBmaWxlcyBpbiBhbiBhcnJheSBhbmQgdGhlbiBwYXNzIHRoZW0gdG8gcmVxdWVzdC5cblxuXHRpZiAocmVxLm1ldGhvZCA9PSBcIlBPU1RcIilcblx0XHRidXNib3kgPSBuZXcgQnVzYm95KHsgaGVhZGVyczogcmVxLmhlYWRlcnMgfSk7XG5cdFx0YnVzYm95Lm9uIFwiZmlsZVwiLCAgKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkgLT5cblx0XHRcdGltYWdlID0ge307ICMgY3JhdGUgYW4gaW1hZ2Ugb2JqZWN0XG5cdFx0XHRpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xuXHRcdFx0aW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcblx0XHRcdGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XG5cblx0XHRcdCMgYnVmZmVyIHRoZSByZWFkIGNodW5rc1xuXHRcdFx0YnVmZmVycyA9IFtdO1xuXG5cdFx0XHRmaWxlLm9uICdkYXRhJywgKGRhdGEpIC0+XG5cdFx0XHRcdGJ1ZmZlcnMucHVzaChkYXRhKTtcblxuXHRcdFx0ZmlsZS5vbiAnZW5kJywgKCkgLT5cblx0XHRcdFx0IyBjb25jYXQgdGhlIGNodW5rc1xuXHRcdFx0XHRpbWFnZS5kYXRhID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKTtcblx0XHRcdFx0IyBwdXNoIHRoZSBpbWFnZSBvYmplY3QgdG8gdGhlIGZpbGUgYXJyYXlcblx0XHRcdFx0ZmlsZXMucHVzaChpbWFnZSk7XG5cblxuXHRcdGJ1c2JveS5vbiBcImZpZWxkXCIsIChmaWVsZG5hbWUsIHZhbHVlKSAtPlxuXHRcdFx0cmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xuXG5cdFx0YnVzYm95Lm9uIFwiZmluaXNoXCIsICAoKSAtPlxuXHRcdFx0IyBQYXNzIHRoZSBmaWxlIGFycmF5IHRvZ2V0aGVyIHdpdGggdGhlIHJlcXVlc3Rcblx0XHRcdHJlcS5maWxlcyA9IGZpbGVzO1xuXG5cdFx0XHRGaWJlciAoKS0+XG5cdFx0XHRcdG5leHQoKTtcblx0XHRcdC5ydW4oKTtcblxuXHRcdCMgUGFzcyByZXF1ZXN0IHRvIGJ1c2JveVxuXHRcdHJlcS5waXBlKGJ1c2JveSk7XG5cblx0ZWxzZVxuXHRcdG5leHQoKTtcblxuXG4jSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZShKc29uUm91dGVzLnBhcnNlRmlsZXMpOyIsInZhciBCdXNib3ksIEZpYmVyO1xuXG5CdXNib3kgPSByZXF1aXJlKCdidXNib3knKTtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuSnNvblJvdXRlcy5wYXJzZUZpbGVzID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJ1c2JveSwgZmlsZXM7XG4gIGZpbGVzID0gW107XG4gIGlmIChyZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgIGJ1c2JveSA9IG5ldyBCdXNib3koe1xuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnNcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWxlXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkge1xuICAgICAgdmFyIGJ1ZmZlcnMsIGltYWdlO1xuICAgICAgaW1hZ2UgPSB7fTtcbiAgICAgIGltYWdlLm1pbWVUeXBlID0gbWltZXR5cGU7XG4gICAgICBpbWFnZS5lbmNvZGluZyA9IGVuY29kaW5nO1xuICAgICAgaW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbiAgICAgIGJ1ZmZlcnMgPSBbXTtcbiAgICAgIGZpbGUub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHJldHVybiBidWZmZXJzLnB1c2goZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmaWxlLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaW1hZ2UuZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XG4gICAgICAgIHJldHVybiBmaWxlcy5wdXNoKGltYWdlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpZWxkXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXEuYm9keVtmaWVsZG5hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmluaXNoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmVxLmZpbGVzID0gZmlsZXM7XG4gICAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9KS5ydW4oKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVxLnBpcGUoYnVzYm95KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG59O1xuIiwiQEF1dGggb3I9IHt9XG5cbiMjI1xuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4jIyNcbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZSAodXNlcikgLT5cbiAgY2hlY2sgdXNlcixcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcblxuICBpZiBfLmtleXModXNlcikubGVuZ3RoIGlzIG5vdCAxXG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yICdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJ1xuXG4gIHJldHVybiB0cnVlXG5cblxuIyMjXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiMjI1xuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSAodXNlcikgLT5cbiAgaWYgdXNlci5pZFxuICAgIHJldHVybiB7J19pZCc6IHVzZXIuaWR9XG4gIGVsc2UgaWYgdXNlci51c2VybmFtZVxuICAgIHJldHVybiB7J3VzZXJuYW1lJzogdXNlci51c2VybmFtZX1cbiAgZWxzZSBpZiB1c2VyLmVtYWlsXG4gICAgcmV0dXJuIHsnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsfVxuXG4gICMgV2Ugc2hvdWxkbid0IGJlIGhlcmUgaWYgdGhlIHVzZXIgb2JqZWN0IHdhcyBwcm9wZXJseSB2YWxpZGF0ZWRcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJ1xuXG5cbiMjI1xuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiMjI1xuQEF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSAodXNlciwgcGFzc3dvcmQpIC0+XG4gIGlmIG5vdCB1c2VyIG9yIG5vdCBwYXNzd29yZFxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG4gICMgVmFsaWRhdGUgdGhlIGxvZ2luIGlucHV0IHR5cGVzXG4gIGNoZWNrIHVzZXIsIHVzZXJWYWxpZGF0b3JcbiAgY2hlY2sgcGFzc3dvcmQsIFN0cmluZ1xuXG4gICMgUmV0cmlldmUgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKVxuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvcilcblxuICBpZiBub3QgYXV0aGVudGljYXRpbmdVc2VyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXM/LnBhc3N3b3JkXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cbiAgIyBBdXRoZW50aWNhdGUgdGhlIHVzZXIncyBwYXNzd29yZFxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmRcbiAgaWYgcGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3JcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuICAjIEFkZCBhIG5ldyBhdXRoIHRva2VuIHRvIHRoZSB1c2VyJ3MgYWNjb3VudFxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpXG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4gYXV0aFRva2VuXG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuXG5cbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkfSkuZmV0Y2goKVxuICBzcGFjZXMgPSBbXVxuICBfLmVhY2ggc3BhY2VfdXNlcnMsIChzdSktPlxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpXG4gICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXG4gICAgaWYgc3BhY2UgJiYgU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3Uuc3BhY2UpIGFuZCBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBzdS51c2VyKT49MFxuICAgICAgc3BhY2VzLnB1c2hcbiAgICAgICAgX2lkOiBzcGFjZS5faWRcbiAgICAgICAgbmFtZTogc3BhY2UubmFtZVxuICByZXR1cm4ge2F1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLCB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGFkbWluU3BhY2VzOiBzcGFjZXN9XG4iLCJ2YXIgZ2V0VXNlclF1ZXJ5U2VsZWN0b3IsIHVzZXJWYWxpZGF0b3I7XG5cbnRoaXMuQXV0aCB8fCAodGhpcy5BdXRoID0ge30pO1xuXG5cbi8qXG4gIEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiAqL1xuXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24odXNlcikge1xuICBjaGVjayh1c2VyLCB7XG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgZW1haWw6IE1hdGNoLk9wdGlvbmFsKFN0cmluZylcbiAgfSk7XG4gIGlmIChfLmtleXModXNlcikubGVuZ3RoID09PSAhMSkge1xuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvcignVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCcpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cblxuLypcbiAgUmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuICovXG5cbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gZnVuY3Rpb24odXNlcikge1xuICBpZiAodXNlci5pZCkge1xuICAgIHJldHVybiB7XG4gICAgICAnX2lkJzogdXNlci5pZFxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci51c2VybmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICAndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLmVtYWlsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWxcbiAgICB9O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcicpO1xufTtcblxuXG4vKlxuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiAqL1xuXG50aGlzLkF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbih1c2VyLCBwYXNzd29yZCkge1xuICB2YXIgYXV0aFRva2VuLCBhdXRoZW50aWNhdGluZ1VzZXIsIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yLCBoYXNoZWRUb2tlbiwgcGFzc3dvcmRWZXJpZmljYXRpb24sIHJlZiwgc3BhY2VfdXNlcnMsIHNwYWNlcztcbiAgaWYgKCF1c2VyIHx8ICFwYXNzd29yZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgY2hlY2sodXNlciwgdXNlclZhbGlkYXRvcik7XG4gIGNoZWNrKHBhc3N3b3JkLCBTdHJpbmcpO1xuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpO1xuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3Rvcik7XG4gIGlmICghYXV0aGVudGljYXRpbmdVc2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBpZiAoISgocmVmID0gYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzKSAhPSBudWxsID8gcmVmLnBhc3N3b3JkIDogdm9pZCAwKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZChhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkKTtcbiAgaWYgKHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuKGF1dGhUb2tlbik7XG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuKGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkXG4gIH0pLmZldGNoKCk7XG4gIHNwYWNlcyA9IFtdO1xuICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHN1KSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpO1xuICAgIGlmIChzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzdS5zcGFjZSkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcikgPj0gMCkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHtcbiAgICAgICAgX2lkOiBzcGFjZS5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgYXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sXG4gICAgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLFxuICAgIGFkbWluU3BhY2VzOiBzcGFjZXNcbiAgfTtcbn07XG4iLCIvLyBXZSBuZWVkIGEgZnVuY3Rpb24gdGhhdCB0cmVhdHMgdGhyb3duIGVycm9ycyBleGFjdGx5IGxpa2UgSXJvbiBSb3V0ZXIgd291bGQuXG4vLyBUaGlzIGZpbGUgaXMgd3JpdHRlbiBpbiBKYXZhU2NyaXB0IHRvIGVuYWJsZSBjb3B5LXBhc3RpbmcgSXJvbiBSb3V0ZXIgY29kZS5cblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMM1xudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XG5cbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDQ3XG5pcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSA9IGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzKSB7XG4gIGlmIChyZXMuc3RhdHVzQ29kZSA8IDQwMClcbiAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcblxuICBpZiAoZXJyLnN0YXR1cylcbiAgICByZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XG5cbiAgaWYgKGVudiA9PT0gJ2RldmVsb3BtZW50JylcbiAgICBtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xuICBlbHNlXG4gICAgLy9YWFggZ2V0IHRoaXMgZnJvbSBzdGFuZGFyZCBkaWN0IG9mIGVycm9yIG1lc3NhZ2VzP1xuICAgIG1zZyA9ICdTZXJ2ZXIgZXJyb3IuJztcblxuICBjb25zb2xlLmVycm9yKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSk7XG5cbiAgaWYgKHJlcy5oZWFkZXJzU2VudClcbiAgICByZXR1cm4gcmVxLnNvY2tldC5kZXN0cm95KCk7XG5cbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIEJ1ZmZlci5ieXRlTGVuZ3RoKG1zZykpO1xuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0hFQUQnKVxuICAgIHJldHVybiByZXMuZW5kKCk7XG4gIHJlcy5lbmQobXNnKTtcbiAgcmV0dXJuO1xufVxuIiwiY2xhc3Mgc2hhcmUuUm91dGVcblxuICBjb25zdHJ1Y3RvcjogKEBhcGksIEBwYXRoLCBAb3B0aW9ucywgQGVuZHBvaW50cykgLT5cbiAgICAjIENoZWNrIGlmIG9wdGlvbnMgd2VyZSBwcm92aWRlZFxuICAgIGlmIG5vdCBAZW5kcG9pbnRzXG4gICAgICBAZW5kcG9pbnRzID0gQG9wdGlvbnNcbiAgICAgIEBvcHRpb25zID0ge31cblxuXG4gIGFkZFRvQXBpOiBkbyAtPlxuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddXG5cbiAgICByZXR1cm4gLT5cbiAgICAgIHNlbGYgPSB0aGlzXG5cbiAgICAgICMgVGhyb3cgYW4gZXJyb3IgaWYgYSByb3V0ZSBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIGF0IHRoaXMgcGF0aFxuICAgICAgIyBUT0RPOiBDaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoIHBhdGhzIHRoYXQgZm9sbG93IHNhbWUgcGF0dGVybiB3aXRoIGRpZmZlcmVudCBwYXJhbWV0ZXIgbmFtZXNcbiAgICAgIGlmIF8uY29udGFpbnMgQGFwaS5fY29uZmlnLnBhdGhzLCBAcGF0aFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogI3tAcGF0aH1cIlxuXG4gICAgICAjIE92ZXJyaWRlIHRoZSBkZWZhdWx0IE9QVElPTlMgZW5kcG9pbnQgd2l0aCBvdXIgb3duXG4gICAgICBAZW5kcG9pbnRzID0gXy5leHRlbmQgb3B0aW9uczogQGFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQsIEBlbmRwb2ludHNcblxuICAgICAgIyBDb25maWd1cmUgZWFjaCBlbmRwb2ludCBvbiB0aGlzIHJvdXRlXG4gICAgICBAX3Jlc29sdmVFbmRwb2ludHMoKVxuICAgICAgQF9jb25maWd1cmVFbmRwb2ludHMoKVxuXG4gICAgICAjIEFkZCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyBwYXRoc1xuICAgICAgQGFwaS5fY29uZmlnLnBhdGhzLnB1c2ggQHBhdGhcblxuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlciBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0IGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxuXG4gICAgICAjIFNldHVwIGVuZHBvaW50cyBvbiByb3V0ZVxuICAgICAgZnVsbFBhdGggPSBAYXBpLl9jb25maWcuYXBpUGF0aCArIEBwYXRoXG4gICAgICBfLmVhY2ggYWxsb3dlZE1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXVxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG4gICAgICAgICAgIyBBZGQgZnVuY3Rpb24gdG8gZW5kcG9pbnQgY29udGV4dCBmb3IgaW5kaWNhdGluZyBhIHJlc3BvbnNlIGhhcyBiZWVuIGluaXRpYXRlZCBtYW51YWxseVxuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2VcbiAgICAgICAgICBkb25lRnVuYyA9IC0+XG4gICAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IHRydWVcblxuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9XG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXNcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnlcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5XG4gICAgICAgICAgICByZXF1ZXN0OiByZXFcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXNcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgIyBBZGQgZW5kcG9pbnQgY29uZmlnIG9wdGlvbnMgdG8gY29udGV4dFxuICAgICAgICAgIF8uZXh0ZW5kIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblxuICAgICAgICAgICMgUnVuIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsXG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICAjIERvIGV4YWN0bHkgd2hhdCBJcm9uIFJvdXRlciB3b3VsZCBoYXZlIGRvbmUsIHRvIGF2b2lkIGNoYW5naW5nIHRoZSBBUElcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIGlmIHJlc3BvbnNlSW5pdGlhdGVkXG4gICAgICAgICAgICAjIEVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgcHJvcGVybHkgY29tcGxldGVkXG4gICAgICAgICAgICByZXMuZW5kKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIHJlcy5oZWFkZXJzU2VudFxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXG4gICAgICAgICAgICBlbHNlIGlmIHJlc3BvbnNlRGF0YSBpcyBudWxsIG9yIHJlc3BvbnNlRGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxuXG4gICAgICAgICAgIyBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBodHRwIHJlc3BvbnNlLCBoYW5kbGluZyB0aGUgZGlmZmVyZW50IGVuZHBvaW50IHJlc3BvbnNlIHR5cGVzXG4gICAgICAgICAgaWYgcmVzcG9uc2VEYXRhLmJvZHkgYW5kIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSBvciByZXNwb25zZURhdGEuaGVhZGVycylcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YVxuXG4gICAgICBfLmVhY2ggcmVqZWN0ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgIGhlYWRlcnMgPSAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnNcblxuXG4gICMjI1xuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG5cbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgIyMjXG4gIF9yZXNvbHZlRW5kcG9pbnRzOiAtPlxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSAtPlxuICAgICAgaWYgXy5pc0Z1bmN0aW9uKGVuZHBvaW50KVxuICAgICAgICBlbmRwb2ludHNbbWV0aG9kXSA9IHthY3Rpb246IGVuZHBvaW50fVxuICAgIHJldHVyblxuXG5cbiAgIyMjXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuXG4gICAgQXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cbiAgICBlbnRpcmUgcm91dGUsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZCBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbFxuICAgIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuXG4gICAgQWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgICByZXNwZWN0aXZlbHkuXG5cbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICMjI1xuICBfY29uZmlndXJlRW5kcG9pbnRzOiAtPlxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCkgLT5cbiAgICAgIGlmIG1ldGhvZCBpc250ICdvcHRpb25zJ1xuICAgICAgICAjIENvbmZpZ3VyZSBhY2NlcHRhYmxlIHJvbGVzXG4gICAgICAgIGlmIG5vdCBAb3B0aW9ucz8ucm9sZVJlcXVpcmVkXG4gICAgICAgICAgQG9wdGlvbnMucm9sZVJlcXVpcmVkID0gW11cbiAgICAgICAgaWYgbm90IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdXG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24gZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBAb3B0aW9ucy5yb2xlUmVxdWlyZWRcbiAgICAgICAgIyBNYWtlIGl0IGVhc2llciB0byBjaGVjayBpZiBubyByb2xlcyBhcmUgcmVxdWlyZWRcbiAgICAgICAgaWYgXy5pc0VtcHR5IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IGZhbHNlXG5cbiAgICAgICAgIyBDb25maWd1cmUgYXV0aCByZXF1aXJlbWVudFxuICAgICAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgQG9wdGlvbnM/LmF1dGhSZXF1aXJlZCBvciBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZVxuXG4gICAgICAgIGlmIEBvcHRpb25zPy5zcGFjZVJlcXVpcmVkXG4gICAgICAgICAgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IEBvcHRpb25zLnNwYWNlUmVxdWlyZWRcbiAgICAgICAgcmV0dXJuXG4gICAgLCB0aGlzXG4gICAgcmV0dXJuXG5cblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG5cbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgIyMjXG4gIF9jYWxsRW5kcG9pbnQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgICMgQ2FsbCB0aGUgZW5kcG9pbnQgaWYgYXV0aGVudGljYXRpb24gZG9lc24ndCBmYWlsXG4gICAgaWYgQF9hdXRoQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgaWYgQF9yb2xlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICBpZiBAX3NwYWNlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICAgICNlbmRwb2ludC5hY3Rpb24uY2FsbCBlbmRwb2ludENvbnRleHRcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uXG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcbiAgICAgICBcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUgaW52b2NhdGlvbiwgLT5cbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzXG4gICAgICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XG4gICAgICBlbHNlXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwM1xuICAgICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxuICAgIGVsc2VcbiAgICAgIHN0YXR1c0NvZGU6IDQwMVxuICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XG5cblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG5cbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cbiAgICBAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICMjI1xuICBfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWRcbiAgICAgIEBfYXV0aGVudGljYXRlIGVuZHBvaW50Q29udGV4dFxuICAgIGVsc2UgdHJ1ZVxuXG5cbiAgIyMjXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcblxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cblxuICAgIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAjIyNcbiAgX2F1dGhlbnRpY2F0ZTogKGVuZHBvaW50Q29udGV4dCkgLT5cbiAgICAjIEdldCBhdXRoIGluZm9cbiAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcblxuICAgICMgR2V0IHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgaWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWRcbiAgICAgIHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSB1c2VyU2VsZWN0b3JcblxuICAgICMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICBpZiBhdXRoPy51c2VyXG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcbiAgICAgIHRydWVcbiAgICBlbHNlIGZhbHNlXG5cbiAgIyMjXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgIyMjXG4gIF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5zcGFjZVJlcXVpcmVkXG4gICAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcbiAgICAgIGlmIGF1dGg/LnNwYWNlSWRcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoLnVzZXJJZCwgc3BhY2U6YXV0aC5zcGFjZUlkfSkuY291bnQoKVxuICAgICAgICBpZiBzcGFjZV91c2Vyc19jb3VudFxuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxuICAgICAgICAgICMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xuICAgICAgICAgIGlmIHNwYWNlICYmIFN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlLl9pZCkgYW5kIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKT49MFxuICAgICAgICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWRcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCJcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgIyMjXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgIyMjXG4gIF9yb2xlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgIGlmIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgaWYgXy5pc0VtcHR5IF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIHRydWVcblxuXG4gICMjI1xuICAgIFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICMjI1xuICBfcmVzcG9uZDogKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlPTIwMCwgaGVhZGVycz17fSkgLT5cbiAgICAjIE92ZXJyaWRlIGFueSBkZWZhdWx0IGhlYWRlcnMgdGhhdCBoYXZlIGJlZW4gcHJvdmlkZWQgKGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gYmUgY2FzZSBpbnNlbnNpdGl2ZSlcbiAgICAjIFRPRE86IENvbnNpZGVyIG9ubHkgbG93ZXJjYXNpbmcgdGhlIGhlYWRlciBrZXlzIHdlIG5lZWQgbm9ybWFsaXplZCwgbGlrZSBDb250ZW50LVR5cGVcbiAgICBkZWZhdWx0SGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBAYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnNcbiAgICBoZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIGhlYWRlcnNcbiAgICBoZWFkZXJzID0gXy5leHRlbmQgZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnNcblxuICAgICMgUHJlcGFyZSBKU09OIGJvZHkgZm9yIHJlc3BvbnNlIHdoZW4gQ29udGVudC1UeXBlIGluZGljYXRlcyBKU09OIHR5cGVcbiAgICBpZiBoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgaXNudCBudWxsXG4gICAgICBpZiBAYXBpLl9jb25maWcucHJldHR5SnNvblxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keSwgdW5kZWZpbmVkLCAyXG4gICAgICBlbHNlXG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5XG5cbiAgICAjIFNlbmQgcmVzcG9uc2VcbiAgICBzZW5kUmVzcG9uc2UgPSAtPlxuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkIHN0YXR1c0NvZGUsIGhlYWRlcnNcbiAgICAgIHJlc3BvbnNlLndyaXRlIGJvZHlcbiAgICAgIHJlc3BvbnNlLmVuZCgpXG4gICAgaWYgc3RhdHVzQ29kZSBpbiBbNDAxLCA0MDNdXG4gICAgICAjIEhhY2tlcnMgY2FuIG1lYXN1cmUgdGhlIHJlc3BvbnNlIHRpbWUgdG8gZGV0ZXJtaW5lIHRoaW5ncyBsaWtlIHdoZXRoZXIgdGhlIDQwMSByZXNwb25zZSB3YXMgXG4gICAgICAjIGNhdXNlZCBieSBiYWQgdXNlciBpZCB2cyBiYWQgcGFzc3dvcmQuXG4gICAgICAjIEluIGRvaW5nIHNvLCB0aGV5IGNhbiBmaXJzdCBzY2FuIGZvciB2YWxpZCB1c2VyIGlkcyByZWdhcmRsZXNzIG9mIHZhbGlkIHBhc3N3b3Jkcy5cbiAgICAgICMgRGVsYXkgYnkgYSByYW5kb20gYW1vdW50IHRvIHJlZHVjZSB0aGUgYWJpbGl0eSBmb3IgYSBoYWNrZXIgdG8gZGV0ZXJtaW5lIHRoZSByZXNwb25zZSB0aW1lLlxuICAgICAgIyBTZWUgaHR0cHM6Ly93d3cub3dhc3Aub3JnL2luZGV4LnBocC9CbG9ja2luZ19CcnV0ZV9Gb3JjZV9BdHRhY2tzI0ZpbmRpbmdfT3RoZXJfQ291bnRlcm1lYXN1cmVzXG4gICAgICAjIFNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9UaW1pbmdfYXR0YWNrXG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMFxuICAgICAgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28gPSAxICsgTWF0aC5yYW5kb20oKVxuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd29cbiAgICAgIE1ldGVvci5zZXRUaW1lb3V0IHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kc1xuICAgIGVsc2VcbiAgICAgIHNlbmRSZXNwb25zZSgpXG5cbiAgIyMjXG4gICAgUmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxuICAjIyNcbiAgX2xvd2VyQ2FzZUtleXM6IChvYmplY3QpIC0+XG4gICAgXy5jaGFpbiBvYmplY3RcbiAgICAucGFpcnMoKVxuICAgIC5tYXAgKGF0dHIpIC0+XG4gICAgICBbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXVxuICAgIC5vYmplY3QoKVxuICAgIC52YWx1ZSgpXG4iLCJzaGFyZS5Sb3V0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUm91dGUoYXBpLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMxKSB7XG4gICAgdGhpcy5hcGkgPSBhcGk7XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuZW5kcG9pbnRzID0gZW5kcG9pbnRzMTtcbiAgICBpZiAoIXRoaXMuZW5kcG9pbnRzKSB7XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IHRoaXMub3B0aW9ucztcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIFJvdXRlLnByb3RvdHlwZS5hZGRUb0FwaSA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYXZhaWxhYmxlTWV0aG9kcztcbiAgICBhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWxsb3dlZE1ldGhvZHMsIGZ1bGxQYXRoLCByZWplY3RlZE1ldGhvZHMsIHNlbGY7XG4gICAgICBzZWxmID0gdGhpcztcbiAgICAgIGlmIChfLmNvbnRhaW5zKHRoaXMuYXBpLl9jb25maWcucGF0aHMsIHRoaXMucGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6IFwiICsgdGhpcy5wYXRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gXy5leHRlbmQoe1xuICAgICAgICBvcHRpb25zOiB0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcbiAgICAgIH0sIHRoaXMuZW5kcG9pbnRzKTtcbiAgICAgIHRoaXMuX3Jlc29sdmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuX2NvbmZpZ3VyZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5hcGkuX2NvbmZpZy5wYXRocy5wdXNoKHRoaXMucGF0aCk7XG4gICAgICBhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyKGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICByZWplY3RlZE1ldGhvZHMgPSBfLnJlamVjdChhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgZnVsbFBhdGggPSB0aGlzLmFwaS5fY29uZmlnLmFwaVBhdGggKyB0aGlzLnBhdGg7XG4gICAgICBfLmVhY2goYWxsb3dlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgZW5kcG9pbnQ7XG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXTtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGRvbmVGdW5jLCBlbmRwb2ludENvbnRleHQsIGVycm9yLCByZXNwb25zZURhdGEsIHJlc3BvbnNlSW5pdGlhdGVkO1xuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2U7XG4gICAgICAgICAgZG9uZUZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZUluaXRpYXRlZCA9IHRydWU7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBlbmRwb2ludENvbnRleHQgPSB7XG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXMsXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogcmVxLnF1ZXJ5LFxuICAgICAgICAgICAgYm9keVBhcmFtczogcmVxLmJvZHksXG4gICAgICAgICAgICByZXF1ZXN0OiByZXEsXG4gICAgICAgICAgICByZXNwb25zZTogcmVzLFxuICAgICAgICAgICAgZG9uZTogZG9uZUZ1bmNcbiAgICAgICAgICB9O1xuICAgICAgICAgIF8uZXh0ZW5kKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IG51bGw7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlSW5pdGlhdGVkKSB7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyZXMuaGVhZGVyc1NlbnQpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZURhdGEgPT09IG51bGwgfHwgcmVzcG9uc2VEYXRhID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VEYXRhLmJvZHkgJiYgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIHx8IHJlc3BvbnNlRGF0YS5oZWFkZXJzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2gocmVqZWN0ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGhlYWRlcnMsIHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgIH07XG4gICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVycyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSkoKTtcblxuXG4gIC8qXG4gICAgQ29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gICAgZnVuY3Rpb25cbiAgXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzb2x2ZUVuZHBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIF8uZWFjaCh0aGlzLmVuZHBvaW50cywgZnVuY3Rpb24oZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKGVuZHBvaW50KSkge1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRzW21ldGhvZF0gPSB7XG4gICAgICAgICAgYWN0aW9uOiBlbmRwb2ludFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG5cbiAgLypcbiAgICBDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gICAgYmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG4gIFxuICAgIEF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3IgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuXG4gICAgZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcbiAgICBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gICAgQWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgICByZXNwZWN0aXZlbHkuXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgIEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jb25maWd1cmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAobWV0aG9kICE9PSAnb3B0aW9ucycpIHtcbiAgICAgICAgaWYgKCEoKHJlZiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZi5yb2xlUmVxdWlyZWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQpO1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50LnJvbGVSZXF1aXJlZCkpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAoKChyZWYxID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMS5hdXRoUmVxdWlyZWQgOiB2b2lkIDApIHx8IGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgocmVmMiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjIuc3BhY2VSZXF1aXJlZCA6IHZvaWQgMCkge1xuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSB0aGlzLm9wdGlvbnMuc3BhY2VSZXF1aXJlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG4gIFxuICAgIEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2NhbGxFbmRwb2ludCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgaW52b2NhdGlvbjtcbiAgICBpZiAodGhpcy5fYXV0aEFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICBpZiAodGhpcy5fcm9sZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcGFjZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgICAgaW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvbih7XG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUoaW52b2NhdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzQ29kZTogNDAxLFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG4gIFxuICAgIE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcbiAgICBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcbiAgICBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gICAgQHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlKGVuZHBvaW50Q29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcbiAgXG4gICAgSWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuICBcbiAgICBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQpIHtcbiAgICB2YXIgYXV0aCwgdXNlclNlbGVjdG9yO1xuICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgaWYgKChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXJJZCA6IHZvaWQgMCkgJiYgKGF1dGggIT0gbnVsbCA/IGF1dGgudG9rZW4gOiB2b2lkIDApICYmICEoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSkge1xuICAgICAgdXNlclNlbGVjdG9yID0ge307XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWQ7XG4gICAgICB1c2VyU2VsZWN0b3JbdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW47XG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VyU2VsZWN0b3IpO1xuICAgIH1cbiAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSB7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlcjtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3NwYWNlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGF1dGgsIHNwYWNlLCBzcGFjZV91c2Vyc19jb3VudDtcbiAgICBpZiAoZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCkge1xuICAgICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnNwYWNlSWQgOiB2b2lkIDApIHtcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICB1c2VyOiBhdXRoLnVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogYXV0aC5zcGFjZUlkXG4gICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgIGlmIChzcGFjZV91c2Vyc19jb3VudCkge1xuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKTtcbiAgICAgICAgICBpZiAoc3BhY2UgJiYgU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3BhY2UuX2lkKSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCkgPj0gMCkge1xuICAgICAgICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWQ7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3JvbGVBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICBpZiAoXy5pc0VtcHR5KF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgICBSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc3BvbmQgPSBmdW5jdGlvbihyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZSwgaGVhZGVycykge1xuICAgIHZhciBkZWZhdWx0SGVhZGVycywgZGVsYXlJbk1pbGxpc2Vjb25kcywgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMsIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvLCBzZW5kUmVzcG9uc2U7XG4gICAgaWYgKHN0YXR1c0NvZGUgPT0gbnVsbCkge1xuICAgICAgc3RhdHVzQ29kZSA9IDIwMDtcbiAgICB9XG4gICAgaWYgKGhlYWRlcnMgPT0gbnVsbCkge1xuICAgICAgaGVhZGVycyA9IHt9O1xuICAgIH1cbiAgICBkZWZhdWx0SGVhZGVycyA9IHRoaXMuX2xvd2VyQ2FzZUtleXModGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0SGVhZGVycyk7XG4gICAgaGVhZGVycyA9IHRoaXMuX2xvd2VyQ2FzZUtleXMoaGVhZGVycyk7XG4gICAgaGVhZGVycyA9IF8uZXh0ZW5kKGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzKTtcbiAgICBpZiAoaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hcGkuX2NvbmZpZy5wcmV0dHlKc29uKSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5LCB2b2lkIDAsIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICAgICAgfVxuICAgIH1cbiAgICBzZW5kUmVzcG9uc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZChzdGF0dXNDb2RlLCBoZWFkZXJzKTtcbiAgICAgIHJlc3BvbnNlLndyaXRlKGJvZHkpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmVuZCgpO1xuICAgIH07XG4gICAgaWYgKHN0YXR1c0NvZGUgPT09IDQwMSB8fCBzdGF0dXNDb2RlID09PSA0MDMpIHtcbiAgICAgIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzID0gNTAwO1xuICAgICAgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28gPSAxICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvO1xuICAgICAgcmV0dXJuIE1ldGVvci5zZXRUaW1lb3V0KHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZW5kUmVzcG9uc2UoKTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9sb3dlckNhc2VLZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIF8uY2hhaW4ob2JqZWN0KS5wYWlycygpLm1hcChmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV07XG4gICAgfSkub2JqZWN0KCkudmFsdWUoKTtcbiAgfTtcblxuICByZXR1cm4gUm91dGU7XG5cbn0pKCk7XG4iLCJjbGFzcyBAUmVzdGl2dXNcblxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG4gICAgQF9yb3V0ZXMgPSBbXVxuICAgIEBfY29uZmlnID1cbiAgICAgIHBhdGhzOiBbXVxuICAgICAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlXG4gICAgICBhcGlQYXRoOiAnYXBpLydcbiAgICAgIHZlcnNpb246IG51bGxcbiAgICAgIHByZXR0eUpzb246IGZhbHNlXG4gICAgICBhdXRoOlxuICAgICAgICB0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbidcbiAgICAgICAgdXNlcjogLT5cbiAgICAgICAgICBpZiBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxuICAgICAgICAgICAgdG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cbiAgICAgICAgICBpZiBAcmVxdWVzdC51c2VySWRcbiAgICAgICAgICAgIF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBAcmVxdWVzdC51c2VySWR9KVxuICAgICAgICAgICAgdXNlcjogX3VzZXJcbiAgICAgICAgICAgIHVzZXJJZDogQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ11cbiAgICAgICAgICAgIHNwYWNlSWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXVxuICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdXNlcklkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXVxuICAgICAgICAgICAgc3BhY2VJZDogQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgIGRlZmF1bHRIZWFkZXJzOlxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXG5cbiAgICAjIENvbmZpZ3VyZSBBUEkgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xuICAgIF8uZXh0ZW5kIEBfY29uZmlnLCBvcHRpb25zXG5cbiAgICBpZiBAX2NvbmZpZy5lbmFibGVDb3JzXG4gICAgICBjb3JzSGVhZGVycyA9XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKidcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCdcblxuICAgICAgaWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcbiAgICAgICAgY29yc0hlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSArPSAnLCBYLVVzZXItSWQsIFgtQXV0aC1Ub2tlbidcblxuICAgICAgIyBTZXQgZGVmYXVsdCBoZWFkZXIgdG8gZW5hYmxlIENPUlMgaWYgY29uZmlndXJlZFxuICAgICAgXy5leHRlbmQgQF9jb25maWcuZGVmYXVsdEhlYWRlcnMsIGNvcnNIZWFkZXJzXG5cbiAgICAgIGlmIG5vdCBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICAgIEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQgPSAtPlxuICAgICAgICAgIEByZXNwb25zZS53cml0ZUhlYWQgMjAwLCBjb3JzSGVhZGVyc1xuICAgICAgICAgIEBkb25lKClcblxuICAgICMgTm9ybWFsaXplIHRoZSBBUEkgcGF0aFxuICAgIGlmIEBfY29uZmlnLmFwaVBhdGhbMF0gaXMgJy8nXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoID0gQF9jb25maWcuYXBpUGF0aC5zbGljZSAxXG4gICAgaWYgXy5sYXN0KEBfY29uZmlnLmFwaVBhdGgpIGlzbnQgJy8nXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoID0gQF9jb25maWcuYXBpUGF0aCArICcvJ1xuXG4gICAgIyBVUkwgcGF0aCB2ZXJzaW9uaW5nIGlzIHRoZSBvbmx5IHR5cGUgb2YgQVBJIHZlcnNpb25pbmcgY3VycmVudGx5IGF2YWlsYWJsZSwgc28gaWYgYSB2ZXJzaW9uIGlzXG4gICAgIyBwcm92aWRlZCwgYXBwZW5kIGl0IHRvIHRoZSBiYXNlIHBhdGggb2YgdGhlIEFQSVxuICAgIGlmIEBfY29uZmlnLnZlcnNpb25cbiAgICAgIEBfY29uZmlnLmFwaVBhdGggKz0gQF9jb25maWcudmVyc2lvbiArICcvJ1xuXG4gICAgIyBBZGQgZGVmYXVsdCBsb2dpbiBhbmQgbG9nb3V0IGVuZHBvaW50cyBpZiBhdXRoIGlzIGNvbmZpZ3VyZWRcbiAgICBpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxuICAgICAgQF9pbml0QXV0aCgpXG4gICAgZWxzZSBpZiBAX2NvbmZpZy51c2VBdXRoXG4gICAgICBAX2luaXRBdXRoKClcbiAgICAgIGNvbnNvbGUud2FybiAnV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICtcbiAgICAgICAgICAnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnXG5cbiAgICByZXR1cm4gdGhpc1xuXG5cbiAgIyMjKlxuICAgIEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcblxuICAgIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcbiAgICBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICBAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxuICAgIEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcbiAgICAgICAgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxuICAgICAgICBhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXG4gICMjI1xuICBhZGRSb3V0ZTogKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykgLT5cbiAgICAjIENyZWF0ZSBhIG5ldyByb3V0ZSBhbmQgYWRkIGl0IHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHJvdXRlc1xuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cylcbiAgICBAX3JvdXRlcy5wdXNoKHJvdXRlKVxuXG4gICAgcm91dGUuYWRkVG9BcGkoKVxuXG4gICAgcmV0dXJuIHRoaXNcblxuXG4gICMjIypcbiAgICBHZW5lcmF0ZSByb3V0ZXMgZm9yIHRoZSBNZXRlb3IgQ29sbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICMjI1xuICBhZGRDb2xsZWN0aW9uOiAoY29sbGVjdGlvbiwgb3B0aW9ucz17fSkgLT5cbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddXG4gICAgbWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXVxuXG4gICAgIyBHcmFiIHRoZSBzZXQgb2YgZW5kcG9pbnRzXG4gICAgaWYgY29sbGVjdGlvbiBpcyBNZXRlb3IudXNlcnNcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzXG4gICAgZWxzZVxuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IEBfY29sbGVjdGlvbkVuZHBvaW50c1xuXG4gICAgIyBGbGF0dGVuIHRoZSBvcHRpb25zIGFuZCBzZXQgZGVmYXVsdHMgaWYgbmVjZXNzYXJ5XG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgb3Ige31cbiAgICByb3V0ZU9wdGlvbnMgPSBvcHRpb25zLnJvdXRlT3B0aW9ucyBvciB7fVxuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyBvciBbXVxuICAgICMgVXNlIGNvbGxlY3Rpb24gbmFtZSBhcyBkZWZhdWx0IHBhdGhcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIG9yIGNvbGxlY3Rpb24uX25hbWVcblxuICAgICMgU2VwYXJhdGUgdGhlIHJlcXVlc3RlZCBlbmRwb2ludHMgYnkgdGhlIHJvdXRlIHRoZXkgYmVsb25nIHRvIChvbmUgZm9yIG9wZXJhdGluZyBvbiB0aGUgZW50aXJlXG4gICAgIyBjb2xsZWN0aW9uIGFuZCBvbmUgZm9yIG9wZXJhdGluZyBvbiBhIHNpbmdsZSBlbnRpdHkgd2l0aGluIHRoZSBjb2xsZWN0aW9uKVxuICAgIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyA9IHt9XG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fVxuICAgIGlmIF8uaXNFbXB0eShlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24pIGFuZCBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpXG4gICAgICAjIEdlbmVyYXRlIGFsbCBlbmRwb2ludHMgb24gdGhpcyBjb2xsZWN0aW9uXG4gICAgICBfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cbiAgICAgICAgIyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXG4gICAgICAgIGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXG4gICAgICAgICAgXy5leHRlbmQgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKVxuICAgICAgICBlbHNlIF8uZXh0ZW5kIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKVxuICAgICAgICByZXR1cm5cbiAgICAgICwgdGhpc1xuICAgIGVsc2VcbiAgICAgICMgR2VuZXJhdGUgYW55IGVuZHBvaW50cyB0aGF0IGhhdmVuJ3QgYmVlbiBleHBsaWNpdGx5IGV4Y2x1ZGVkXG4gICAgICBfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cbiAgICAgICAgaWYgbWV0aG9kIG5vdCBpbiBleGNsdWRlZEVuZHBvaW50cyBhbmQgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gaXNudCBmYWxzZVxuICAgICAgICAgICMgQ29uZmlndXJlIGVuZHBvaW50IGFuZCBtYXAgdG8gaXQncyBodHRwIG1ldGhvZFxuICAgICAgICAgICMgVE9ETzogQ29uc2lkZXIgcHJlZGVmaW5pbmcgYSBtYXAgb2YgbWV0aG9kcyB0byB0aGVpciBodHRwIG1ldGhvZCB0eXBlIChlLmcuLCBnZXRBbGw6IGdldClcbiAgICAgICAgICBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXVxuICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludCA9IHt9XG4gICAgICAgICAgXy5lYWNoIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCAoYWN0aW9uLCBtZXRob2RUeXBlKSAtPlxuICAgICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50W21ldGhvZFR5cGVdID1cbiAgICAgICAgICAgICAgXy5jaGFpbiBhY3Rpb25cbiAgICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgICAgLmV4dGVuZCBlbmRwb2ludE9wdGlvbnNcbiAgICAgICAgICAgICAgLnZhbHVlKClcbiAgICAgICAgICAjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcbiAgICAgICAgICBpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxuICAgICAgICAgICAgXy5leHRlbmQgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnRcbiAgICAgICAgICBlbHNlIF8uZXh0ZW5kIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnRcbiAgICAgICAgICByZXR1cm5cbiAgICAgICwgdGhpc1xuXG4gICAgIyBBZGQgdGhlIHJvdXRlcyB0byB0aGUgQVBJXG4gICAgQGFkZFJvdXRlIHBhdGgsIHJvdXRlT3B0aW9ucywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzXG4gICAgQGFkZFJvdXRlIFwiI3twYXRofS86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50c1xuXG4gICAgcmV0dXJuIHRoaXNcblxuXG4gICMjIypcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcbiAgIyMjXG4gIF9jb2xsZWN0aW9uRW5kcG9pbnRzOlxuICAgIGdldDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBnZXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBzZWxlY3RvclxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XG4gICAgcHV0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHB1dDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsICRzZXQ6IEBib2R5UGFyYW1zXG4gICAgICAgICAgaWYgZW50aXR5SXNVcGRhdGVkXG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZFxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XG4gICAgZGVsZXRlOiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGRlbGV0ZTpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgaWYgY29sbGVjdGlvbi5yZW1vdmUgc2VsZWN0b3JcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCd9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XG4gICAgcG9zdDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBwb3N0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBAYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcbiAgICAgICAgICBpZiBlbnRpdHlcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMVxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ31cbiAgICBnZXRBbGw6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZ2V0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7fVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChzZWxlY3RvcikuZmV0Y2goKVxuICAgICAgICAgIGlmIGVudGl0aWVzXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbid9XG5cblxuICAjIyMqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxuICAjIyNcbiAgX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzOlxuICAgIGdldDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBnZXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cbiAgICBwdXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcHV0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgQHVybFBhcmFtcy5pZCwgJHNldDogcHJvZmlsZTogQGJvZHlQYXJhbXNcbiAgICAgICAgICBpZiBlbnRpdHlJc1VwZGF0ZWRcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcbiAgICAgICAgICAgIHtzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBlbnRpdHl9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XG4gICAgZGVsZXRlOiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGRlbGV0ZTpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGlmIGNvbGxlY3Rpb24ucmVtb3ZlIEB1cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCd9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XG4gICAgcG9zdDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBwb3N0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgIyBDcmVhdGUgYSBuZXcgdXNlciBhY2NvdW50XG4gICAgICAgICAgZW50aXR5SWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyIEBib2R5UGFyYW1zXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcbiAgICAgICAgICBpZiBlbnRpdHlcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMVxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXG4gICAgICAgICAgICB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ31cbiAgICBnZXRBbGw6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZ2V0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIGZpZWxkczogcHJvZmlsZTogMSkuZmV0Y2goKVxuICAgICAgICAgIGlmIGVudGl0aWVzXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ31cblxuXG4gICMjI1xuICAgIEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcbiAgIyMjXG4gIF9pbml0QXV0aDogLT5cbiAgICBzZWxmID0gdGhpc1xuICAgICMjI1xuICAgICAgQWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxuXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICMjI1xuICAgIEBhZGRSb3V0ZSAnbG9naW4nLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sXG4gICAgICBwb3N0OiAtPlxuICAgICAgICAjIEdyYWIgdGhlIHVzZXJuYW1lIG9yIGVtYWlsIHRoYXQgdGhlIHVzZXIgaXMgbG9nZ2luZyBpbiB3aXRoXG4gICAgICAgIHVzZXIgPSB7fVxuICAgICAgICBpZiBAYm9keVBhcmFtcy51c2VyXG4gICAgICAgICAgaWYgQGJvZHlQYXJhbXMudXNlci5pbmRleE9mKCdAJykgaXMgLTFcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSBAYm9keVBhcmFtcy51c2VyXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdXNlci5lbWFpbCA9IEBib2R5UGFyYW1zLnVzZXJcbiAgICAgICAgZWxzZSBpZiBAYm9keVBhcmFtcy51c2VybmFtZVxuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSBAYm9keVBhcmFtcy51c2VybmFtZVxuICAgICAgICBlbHNlIGlmIEBib2R5UGFyYW1zLmVtYWlsXG4gICAgICAgICAgdXNlci5lbWFpbCA9IEBib2R5UGFyYW1zLmVtYWlsXG5cbiAgICAgICAgIyBUcnkgdG8gbG9nIHRoZSB1c2VyIGludG8gdGhlIHVzZXIncyBhY2NvdW50IChpZiBzdWNjZXNzZnVsIHdlJ2xsIGdldCBhbiBhdXRoIHRva2VuIGJhY2spXG4gICAgICAgIHRyeVxuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkIHVzZXIsIEBib2R5UGFyYW1zLnBhc3N3b3JkXG4gICAgICAgIGNhdGNoIGVcbiAgICAgICAgICBjb25zb2xlLmVycm9yIGVcbiAgICAgICAgICByZXR1cm4ge30gPVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogZS5lcnJvclxuICAgICAgICAgICAgYm9keTogc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiBlLnJlYXNvblxuXG4gICAgICAgICMgR2V0IHRoZSBhdXRoZW50aWNhdGVkIHVzZXJcbiAgICAgICAgIyBUT0RPOiBDb25zaWRlciByZXR1cm5pbmcgdGhlIHVzZXIgaW4gQXV0aC5sb2dpbldpdGhQYXNzd29yZCgpLCBpbnN0ZWFkIG9mIGZldGNoaW5nIGl0IGFnYWluIGhlcmVcbiAgICAgICAgaWYgYXV0aC51c2VySWQgYW5kIGF1dGguYXV0aFRva2VuXG4gICAgICAgICAgc2VhcmNoUXVlcnkgPSB7fVxuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoLmF1dGhUb2tlblxuICAgICAgICAgIEB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcbiAgICAgICAgICAgICdfaWQnOiBhdXRoLnVzZXJJZFxuICAgICAgICAgICAgc2VhcmNoUXVlcnlcbiAgICAgICAgICBAdXNlcklkID0gQHVzZXI/Ll9pZFxuXG4gICAgICAgIHJlc3BvbnNlID0ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBhdXRofVxuXG4gICAgICAgICMgQ2FsbCB0aGUgbG9naW4gaG9vayB3aXRoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYXR0YWNoZWRcbiAgICAgICAgZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4/LmNhbGwodGhpcylcbiAgICAgICAgaWYgZXh0cmFEYXRhP1xuICAgICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcblxuICAgICAgICByZXNwb25zZVxuXG4gICAgbG9nb3V0ID0gLT5cbiAgICAgICMgUmVtb3ZlIHRoZSBnaXZlbiBhdXRoIHRva2VuIGZyb20gdGhlIHVzZXIncyBhY2NvdW50XG4gICAgICBhdXRoVG9rZW4gPSBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aFRva2VuXG4gICAgICB0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW5cbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZiAnLidcbiAgICAgIHRva2VuUGF0aCA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nIDAsIGluZGV4XG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nIGluZGV4ICsgMVxuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9XG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuXG4gICAgICB0b2tlblJlbW92YWxRdWVyeSA9IHt9XG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZVxuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSBAdXNlci5faWQsIHskcHVsbDogdG9rZW5SZW1vdmFsUXVlcnl9XG5cbiAgICAgIHJlc3BvbnNlID0ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7bWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnfX1cblxuICAgICAgIyBDYWxsIHRoZSBsb2dvdXQgaG9vayB3aXRoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYXR0YWNoZWRcbiAgICAgIGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZE91dD8uY2FsbCh0aGlzKVxuICAgICAgaWYgZXh0cmFEYXRhP1xuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXG5cbiAgICAgIHJlc3BvbnNlXG5cbiAgICAjIyNcbiAgICAgIEFkZCBhIGxvZ291dCBlbmRwb2ludCB0byB0aGUgQVBJXG5cbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBvdXQsIHRoZSBvbkxvZ2dlZE91dCBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAjIyNcbiAgICBAYWRkUm91dGUgJ2xvZ291dCcsIHthdXRoUmVxdWlyZWQ6IHRydWV9LFxuICAgICAgZ2V0OiAtPlxuICAgICAgICBjb25zb2xlLndhcm4gXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiXG4gICAgICAgIGNvbnNvbGUud2FybiBcIiAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzL2lzc3Vlcy8xMDBcIlxuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcylcbiAgICAgIHBvc3Q6IGxvZ291dFxuXG5SZXN0aXZ1cyA9IEBSZXN0aXZ1c1xuIiwidmFyIFJlc3RpdnVzLFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbnRoaXMuUmVzdGl2dXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJlc3RpdnVzKG9wdGlvbnMpIHtcbiAgICB2YXIgY29yc0hlYWRlcnM7XG4gICAgdGhpcy5fcm91dGVzID0gW107XG4gICAgdGhpcy5fY29uZmlnID0ge1xuICAgICAgcGF0aHM6IFtdLFxuICAgICAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlLFxuICAgICAgYXBpUGF0aDogJ2FwaS8nLFxuICAgICAgdmVyc2lvbjogbnVsbCxcbiAgICAgIHByZXR0eUpzb246IGZhbHNlLFxuICAgICAgYXV0aDoge1xuICAgICAgICB0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbicsXG4gICAgICAgIHVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfdXNlciwgdG9rZW47XG4gICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSkge1xuICAgICAgICAgICAgdG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC51c2VySWQpIHtcbiAgICAgICAgICAgIF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy5yZXF1ZXN0LnVzZXJJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VyOiBfdXNlcixcbiAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10sXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10sXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10sXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10sXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxuICAgIH07XG4gICAgXy5leHRlbmQodGhpcy5fY29uZmlnLCBvcHRpb25zKTtcbiAgICBpZiAodGhpcy5fY29uZmlnLmVuYWJsZUNvcnMpIHtcbiAgICAgIGNvcnNIZWFkZXJzID0ge1xuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0J1xuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgICAgY29yc0hlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSArPSAnLCBYLVVzZXItSWQsIFgtQXV0aC1Ub2tlbic7XG4gICAgICB9XG4gICAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcuZGVmYXVsdEhlYWRlcnMsIGNvcnNIZWFkZXJzKTtcbiAgICAgIGlmICghdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlLndyaXRlSGVhZCgyMDAsIGNvcnNIZWFkZXJzKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcuYXBpUGF0aFswXSA9PT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoLnNsaWNlKDEpO1xuICAgIH1cbiAgICBpZiAoXy5sYXN0KHRoaXMuX2NvbmZpZy5hcGlQYXRoKSAhPT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnZlcnNpb24pIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoICs9IHRoaXMuX2NvbmZpZy52ZXJzaW9uICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY29uZmlnLnVzZUF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgLyoqXG4gICAgQWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuICBcbiAgICBAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG4gICAgQHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgQHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcbiAgICBAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG4gICAgICAgIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcbiAgICAgICAgYW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuYWRkUm91dGUgPSBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIHtcbiAgICB2YXIgcm91dGU7XG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKTtcbiAgICB0aGlzLl9yb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgcm91dGUuYWRkVG9BcGkoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgIEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLmFkZENvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25FbmRwb2ludHMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uLCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZHMsIG1ldGhvZHNPbkNvbGxlY3Rpb24sIHBhdGgsIHJvdXRlT3B0aW9ucztcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ107XG4gICAgbWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXTtcbiAgICBpZiAoY29sbGVjdGlvbiA9PT0gTWV0ZW9yLnVzZXJzKSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl9jb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH1cbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyB8fCB7fTtcbiAgICByb3V0ZU9wdGlvbnMgPSBvcHRpb25zLnJvdXRlT3B0aW9ucyB8fCB7fTtcbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgfHwgW107XG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCB8fCBjb2xsZWN0aW9uLl9uYW1lO1xuICAgIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24pICYmIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cykpIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgY29uZmlndXJlZEVuZHBvaW50LCBlbmRwb2ludE9wdGlvbnM7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwoZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZCkgPCAwICYmIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdO1xuICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludCA9IHt9O1xuICAgICAgICAgIF8uZWFjaChjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgZnVuY3Rpb24oYWN0aW9uLCBtZXRob2RUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlndXJlZEVuZHBvaW50W21ldGhvZFR5cGVdID0gXy5jaGFpbihhY3Rpb24pLmNsb25lKCkuZXh0ZW5kKGVuZHBvaW50T3B0aW9ucykudmFsdWUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLmFkZFJvdXRlKHBhdGgsIHJvdXRlT3B0aW9ucywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzKTtcbiAgICB0aGlzLmFkZFJvdXRlKHBhdGggKyBcIi86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl9jb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIHtcbiAgICAgICAgICAgICAgJHNldDogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZShzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICB0aGlzLmJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0KHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcywgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZDtcbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZSh0aGlzLnVybFBhcmFtcy5pZCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgZW50aXR5SWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAoe1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCdcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXM7XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5faW5pdEF1dGggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9nb3V0LCBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgLypcbiAgICAgIEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgdGhpcy5hZGRSb3V0ZSgnbG9naW4nLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlXG4gICAgfSwge1xuICAgICAgcG9zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdXRoLCBlLCBleHRyYURhdGEsIHJlZiwgcmVmMSwgcmVzcG9uc2UsIHNlYXJjaFF1ZXJ5LCB1c2VyO1xuICAgICAgICB1c2VyID0ge307XG4gICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcikge1xuICAgICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlci5pbmRleE9mKCdAJykgPT09IC0xKSB7XG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lKSB7XG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VybmFtZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMuZW1haWwpIHtcbiAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLmVtYWlsO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQodXNlciwgdGhpcy5ib2R5UGFyYW1zLnBhc3N3b3JkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogZS5lcnJvcixcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBlLnJlYXNvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF1dGgudXNlcklkICYmIGF1dGguYXV0aFRva2VuKSB7XG4gICAgICAgICAgc2VhcmNoUXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aC5hdXRoVG9rZW4pO1xuICAgICAgICAgIHRoaXMudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICdfaWQnOiBhdXRoLnVzZXJJZFxuICAgICAgICAgIH0sIHNlYXJjaFF1ZXJ5KTtcbiAgICAgICAgICB0aGlzLnVzZXJJZCA9IChyZWYgPSB0aGlzLnVzZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIGRhdGE6IGF1dGhcbiAgICAgICAgfTtcbiAgICAgICAgZXh0cmFEYXRhID0gKHJlZjEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbikgIT0gbnVsbCA/IHJlZjEuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhdXRoVG9rZW4sIGV4dHJhRGF0YSwgaGFzaGVkVG9rZW4sIGluZGV4LCByZWYsIHJlc3BvbnNlLCB0b2tlbkZpZWxkTmFtZSwgdG9rZW5Mb2NhdGlvbiwgdG9rZW5QYXRoLCB0b2tlblJlbW92YWxRdWVyeSwgdG9rZW5Ub1JlbW92ZTtcbiAgICAgIGF1dGhUb2tlbiA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXTtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW47XG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIHRva2VuUGF0aCA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoaW5kZXggKyAxKTtcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fTtcbiAgICAgIHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW47XG4gICAgICB0b2tlblJlbW92YWxRdWVyeSA9IHt9O1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmU7XG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlKHRoaXMudXNlci5faWQsIHtcbiAgICAgICAgJHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5XG4gICAgICB9KTtcbiAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZXh0cmFEYXRhID0gKHJlZiA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZE91dCkgIT0gbnVsbCA/IHJlZi5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG5cbiAgICAvKlxuICAgICAgQWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBvdXQsIHRoZSBvbkxvZ2dlZE91dCBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5hZGRSb3V0ZSgnbG9nb3V0Jywge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlXG4gICAgfSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIik7XG4gICAgICAgIGNvbnNvbGUud2FybihcIiAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzL2lzc3Vlcy8xMDBcIik7XG4gICAgICAgIHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKTtcbiAgICAgIH0sXG4gICAgICBwb3N0OiBsb2dvdXRcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gUmVzdGl2dXM7XG5cbn0pKCk7XG5cblJlc3RpdnVzID0gdGhpcy5SZXN0aXZ1cztcbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgIEBBUEkgPSBuZXcgUmVzdGl2dXNcbiAgICAgICAgYXBpUGF0aDogJ3N0ZWVkb3MvYXBpLycsXG4gICAgICAgIHVzZURlZmF1bHRBdXRoOiB0cnVlXG4gICAgICAgIHByZXR0eUpzb246IHRydWVcbiAgICAgICAgZW5hYmxlQ29yczogZmFsc2VcbiAgICAgICAgZGVmYXVsdEhlYWRlcnM6XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgdGhpcy5BUEkgPSBuZXcgUmVzdGl2dXMoe1xuICAgIGFwaVBhdGg6ICdzdGVlZG9zL2FwaS8nLFxuICAgIHVzZURlZmF1bHRBdXRoOiB0cnVlLFxuICAgIHByZXR0eUpzb246IHRydWUsXG4gICAgZW5hYmxlQ29yczogZmFsc2UsXG4gICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9XG4gIH0pO1xufVxuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0QVBJLmFkZENvbGxlY3Rpb24gZGIuc3BhY2VfdXNlcnMsIFxuXHRcdGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXVxuXHRcdHJvdXRlT3B0aW9uczpcblx0XHRcdGF1dGhSZXF1aXJlZDogdHJ1ZVxuXHRcdFx0c3BhY2VSZXF1aXJlZDogdHJ1ZSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQVBJLmFkZENvbGxlY3Rpb24oZGIuc3BhY2VfdXNlcnMsIHtcbiAgICBleGNsdWRlZEVuZHBvaW50czogW10sXG4gICAgcm91dGVPcHRpb25zOiB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWUsXG4gICAgICBzcGFjZVJlcXVpcmVkOiB0cnVlXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0QVBJLmFkZENvbGxlY3Rpb24gZGIub3JnYW5pemF0aW9ucywgXG5cdFx0ZXhjbHVkZWRFbmRwb2ludHM6IFtdXG5cdFx0cm91dGVPcHRpb25zOlxuXHRcdFx0YXV0aFJlcXVpcmVkOiB0cnVlXG5cdFx0XHRzcGFjZVJlcXVpcmVkOiB0cnVlIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBUEkuYWRkQ29sbGVjdGlvbihkYi5vcmdhbml6YXRpb25zLCB7XG4gICAgZXhjbHVkZWRFbmRwb2ludHM6IFtdLFxuICAgIHJvdXRlT3B0aW9uczoge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgc3BhY2VSZXF1aXJlZDogdHJ1ZVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xuICBKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cbiAgICBpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICBuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9LCAoZXJyKSAtPlxuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZVxuXG4gICAgICAgIGlmIFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpXG5cbiAgICAgICAgYm9keSA9IHJlcS5ib2R5XG4gICAgICAgIHRyeVxuICAgICAgICAgIGlmIGJvZHkgJiYgKGJvZHlbJ3VwbG9hZF9mcm9tJ10gaXMgXCJJRVwiIG9yIGJvZHlbJ3VwbG9hZF9mcm9tJ10gaXMgXCJub2RlXCIpXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSlcbiAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZmlsZW5hbWUpXG4gICAgICAgICAgY29uc29sZS5lcnJvciBlXG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKVxuXG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSlcbiAgICAgICAgXG4gICAgICAgIGlmIGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5Wydvd25lcl9uYW1lJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydpbnN0YW5jZSddICAmJiBib2R5WydhcHByb3ZlJ11cbiAgICAgICAgICBwYXJlbnQgPSAnJ1xuICAgICAgICAgIG1ldGFkYXRhID0ge293bmVyOmJvZHlbJ293bmVyJ10sIG93bmVyX25hbWU6Ym9keVsnb3duZXJfbmFtZSddLCBzcGFjZTpib2R5WydzcGFjZSddLCBpbnN0YW5jZTpib2R5WydpbnN0YW5jZSddLCBhcHByb3ZlOiBib2R5WydhcHByb3ZlJ10sIGN1cnJlbnQ6IHRydWV9XG5cbiAgICAgICAgICBpZiBib2R5W1wiaXNfcHJpdmF0ZVwiXSAmJiBib2R5W1wiaXNfcHJpdmF0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09IFwidHJ1ZVwiXG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gdHJ1ZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSBmYWxzZVxuXG4gICAgICAgICAgaWYgYm9keVsnbWFpbiddID09IFwidHJ1ZVwiXG4gICAgICAgICAgICBtZXRhZGF0YS5tYWluID0gdHJ1ZVxuXG4gICAgICAgICAgaWYgYm9keVsnaXNBZGRWZXJzaW9uJ10gJiYgYm9keVsncGFyZW50J11cbiAgICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXG4gICAgICAgICAgIyBlbHNlXG4gICAgICAgICAgIyAgIGNvbGxlY3Rpb24uZmluZCh7J21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSwgJ21ldGFkYXRhLmN1cnJlbnQnIDogdHJ1ZX0pLmZvckVhY2ggKGMpIC0+XG4gICAgICAgICAgIyAgICAgaWYgYy5uYW1lKCkgPT0gZmlsZW5hbWVcbiAgICAgICAgICAjICAgICAgIHBhcmVudCA9IGMubWV0YWRhdGEucGFyZW50XG5cbiAgICAgICAgICBpZiBwYXJlbnRcbiAgICAgICAgICAgIHIgPSBjb2xsZWN0aW9uLnVwZGF0ZSh7J21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCwgJ21ldGFkYXRhLmN1cnJlbnQnIDogdHJ1ZX0sIHskdW5zZXQgOiB7J21ldGFkYXRhLmN1cnJlbnQnIDogJyd9fSlcbiAgICAgICAgICAgIGlmIHJcbiAgICAgICAgICAgICAgbWV0YWRhdGEucGFyZW50ID0gcGFyZW50XG4gICAgICAgICAgICAgIGlmIGJvZHlbJ2xvY2tlZF9ieSddICYmIGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ11cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnkgPSBib2R5Wydsb2NrZWRfYnknXVxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieV9uYW1lID0gYm9keVsnbG9ja2VkX2J5X25hbWUnXVxuXG4gICAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuICAgICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuXG4gICAgICAgICAgICAgICMg5Yig6Zmk5ZCM5LiA5Liq55Sz6K+35Y2V5ZCM5LiA5Liq5q2l6aqk5ZCM5LiA5Liq5Lq65LiK5Lyg55qE6YeN5aSN55qE5paH5Lu2XG4gICAgICAgICAgICAgIGlmIGJvZHlbXCJvdmVyd3JpdGVcIl0gJiYgYm9keVtcIm92ZXJ3cml0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09IFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5yZW1vdmUoeydtZXRhZGF0YS5pbnN0YW5jZSc6IGJvZHlbJ2luc3RhbmNlJ10sICdtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsICdtZXRhZGF0YS5vd25lcic6IGJvZHlbJ293bmVyJ10sICdtZXRhZGF0YS5hcHByb3ZlJzogYm9keVsnYXBwcm92ZSddLCAnbWV0YWRhdGEuY3VycmVudCc6IHskbmU6IHRydWV9fSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcbiAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG4gICAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7JHNldDogeydtZXRhZGF0YS5wYXJlbnQnIDogZmlsZU9iai5faWR9fSlcblxuICAgICAgICAjIOWFvOWuueiAgeeJiOacrFxuICAgICAgICBlbHNlXG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG5ld0ZpbGUub25jZSAnc3RvcmVkJywgKHN0b3JlTmFtZSktPlxuICAgICAgICBzaXplID0gbmV3RmlsZS5vcmlnaW5hbC5zaXplXG4gICAgICAgIGlmICFzaXplXG4gICAgICAgICAgc2l6ZSA9IDEwMjRcbiAgICAgICAgcmVzcCA9XG4gICAgICAgICAgdmVyc2lvbl9pZDogbmV3RmlsZS5faWQsXG4gICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgICAgcmV0dXJuXG4gICAgZWxzZVxuICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm5cblxuXG5Kc29uUm91dGVzLmFkZCBcImRlbGV0ZVwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXG5cbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcbiAgaWYgaWRcbiAgICBmaWxlID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiBpZCB9KVxuICAgIGlmIGZpbGVcbiAgICAgIGZpbGUucmVtb3ZlKClcbiAgICAgIHJlc3AgPSB7XG4gICAgICAgIHN0YXR1czogXCJPS1wiXG4gICAgICB9XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIHJldHVyblxuXG4gIHJlcy5zdGF0dXNDb2RlID0gNDA0O1xuICByZXMuZW5kKCk7XG5cblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cblxuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuXG4gIHJlcy5zdGF0dXNDb2RlID0gMzAyO1xuICByZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9pbnN0YW5jZXMvXCIpICsgaWQgKyBcIj9kb3dubG9hZD0xXCJcbiAgcmVzLmVuZCgpO1xuXG5cbiMgTWV0ZW9yLm1ldGhvZHNcblxuIyAgIHMzX3VwZ3JhZGU6IChtaW4sIG1heCkgLT5cbiMgICAgIGNvbnNvbGUubG9nKFwiL3MzL3VwZ3JhZGVcIilcblxuIyAgICAgZnMgPSByZXF1aXJlKCdmcycpXG4jICAgICBtaW1lID0gcmVxdWlyZSgnbWltZScpXG5cbiMgICAgIHJvb3RfcGF0aCA9IFwiL21udC9mYWtlczMvMTBcIlxuIyAgICAgY29uc29sZS5sb2cocm9vdF9wYXRoKVxuIyAgICAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcblxuIyAgICAgIyDpgY3ljoZpbnN0YW5jZSDmi7zlh7rpmYTku7bot6/lvoQg5Yiw5pys5Zyw5om+5a+55bqU5paH5Lu2IOWIhuS4pOenjeaDheWGtSAxLi9maWxlbmFtZV92ZXJzaW9uSWQgMi4vZmlsZW5hbWXvvJtcbiMgICAgIGRlYWxfd2l0aF92ZXJzaW9uID0gKHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgdmVyc2lvbiwgYXR0YWNoX2ZpbGVuYW1lKSAtPlxuIyAgICAgICBfcmV2ID0gdmVyc2lvbi5fcmV2XG4jICAgICAgIGlmIChjb2xsZWN0aW9uLmZpbmQoe1wiX2lkXCI6IF9yZXZ9KS5jb3VudCgpID4wKVxuIyAgICAgICAgIHJldHVyblxuIyAgICAgICBjcmVhdGVkX2J5ID0gdmVyc2lvbi5jcmVhdGVkX2J5XG4jICAgICAgIGFwcHJvdmUgPSB2ZXJzaW9uLmFwcHJvdmVcbiMgICAgICAgZmlsZW5hbWUgPSB2ZXJzaW9uLmZpbGVuYW1lIHx8IGF0dGFjaF9maWxlbmFtZTtcbiMgICAgICAgbWltZV90eXBlID0gbWltZS5sb29rdXAoZmlsZW5hbWUpXG4jICAgICAgIG5ld19wYXRoID0gcm9vdF9wYXRoICsgXCIvc3BhY2VzL1wiICsgc3BhY2UgKyBcIi93b3JrZmxvdy9cIiArIGluc19pZCArIFwiL1wiICsgZmlsZW5hbWUgKyBcIl9cIiArIF9yZXZcbiMgICAgICAgb2xkX3BhdGggPSByb290X3BhdGggKyBcIi9zcGFjZXMvXCIgKyBzcGFjZSArIFwiL3dvcmtmbG93L1wiICsgaW5zX2lkICsgXCIvXCIgKyBmaWxlbmFtZVxuXG4jICAgICAgIHJlYWRGaWxlID0gKGZ1bGxfcGF0aCkgLT5cbiMgICAgICAgICBkYXRhID0gZnMucmVhZEZpbGVTeW5jIGZ1bGxfcGF0aFxuXG4jICAgICAgICAgaWYgZGF0YVxuIyAgICAgICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4jICAgICAgICAgICBuZXdGaWxlLl9pZCA9IF9yZXY7XG4jICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0ge293bmVyOmNyZWF0ZWRfYnksIHNwYWNlOnNwYWNlLCBpbnN0YW5jZTppbnNfaWQsIGFwcHJvdmU6IGFwcHJvdmV9O1xuIyAgICAgICAgICAgbmV3RmlsZS5hdHRhY2hEYXRhIGRhdGEsIHt0eXBlOiBtaW1lX3R5cGV9XG4jICAgICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZW5hbWUpXG4jICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuIyAgICAgICAgICAgY29uc29sZS5sb2coZmlsZU9iai5faWQpXG5cbiMgICAgICAgdHJ5XG4jICAgICAgICAgbiA9IGZzLnN0YXRTeW5jIG5ld19wYXRoXG4jICAgICAgICAgaWYgbiAmJiBuLmlzRmlsZSgpXG4jICAgICAgICAgICByZWFkRmlsZSBuZXdfcGF0aFxuIyAgICAgICBjYXRjaCBlcnJvclxuIyAgICAgICAgIHRyeVxuIyAgICAgICAgICAgb2xkID0gZnMuc3RhdFN5bmMgb2xkX3BhdGhcbiMgICAgICAgICAgIGlmIG9sZCAmJiBvbGQuaXNGaWxlKClcbiMgICAgICAgICAgICAgcmVhZEZpbGUgb2xkX3BhdGhcbiMgICAgICAgICBjYXRjaCBlcnJvclxuIyAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZpbGUgbm90IGZvdW5kOiBcIiArIG9sZF9wYXRoKVxuXG5cbiMgICAgIGNvdW50ID0gZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX19KS5jb3VudCgpO1xuIyAgICAgY29uc29sZS5sb2coXCJhbGwgaW5zdGFuY2VzOiBcIiArIGNvdW50KVxuXG4jICAgICBiID0gbmV3IERhdGUoKVxuXG4jICAgICBpID0gbWluXG4jICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgc2tpcDogbWluLCBsaW1pdDogbWF4LW1pbn0pLmZvckVhY2ggKGlucykgLT5cbiMgICAgICAgaSA9IGkgKyAxXG4jICAgICAgIGNvbnNvbGUubG9nKGkgKyBcIjpcIiArIGlucy5uYW1lKVxuIyAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzXG4jICAgICAgIHNwYWNlID0gaW5zLnNwYWNlXG4jICAgICAgIGluc19pZCA9IGlucy5faWRcbiMgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpIC0+XG4jICAgICAgICAgZGVhbF93aXRoX3ZlcnNpb24gcm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCBhdHQuY3VycmVudCwgYXR0LmZpbGVuYW1lXG4jICAgICAgICAgaWYgYXR0Lmhpc3RvcnlzXG4jICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxuIyAgICAgICAgICAgICBkZWFsX3dpdGhfdmVyc2lvbiByb290X3BhdGgsIHNwYWNlLCBpbnNfaWQsIGhpcywgYXR0LmZpbGVuYW1lXG5cbiMgICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCkgLSBiKVxuXG4jICAgICByZXR1cm4gXCJva1wiXG4iLCJKc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzO1xuICByZXR1cm4gSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmV3RmlsZTtcbiAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGJvZHksIGUsIGZpbGVPYmosIGZpbGVuYW1lLCBtZXRhZGF0YSwgcGFyZW50LCByO1xuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZTtcbiAgICAgICAgaWYgKFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgPSByZXEuYm9keTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJJRVwiIHx8IGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwibm9kZVwiKSkge1xuICAgICAgICAgICAgZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSk7XG4gICAgICAgIGlmIChib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnb3duZXJfbmFtZSddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsnaW5zdGFuY2UnXSAmJiBib2R5WydhcHByb3ZlJ10pIHtcbiAgICAgICAgICBwYXJlbnQgPSAnJztcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIG93bmVyOiBib2R5Wydvd25lciddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYm9keVsnb3duZXJfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IGJvZHlbJ3NwYWNlJ10sXG4gICAgICAgICAgICBpbnN0YW5jZTogYm9keVsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgIGFwcHJvdmU6IGJvZHlbJ2FwcHJvdmUnXSxcbiAgICAgICAgICAgIGN1cnJlbnQ6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChib2R5W1wiaXNfcHJpdmF0ZVwiXSAmJiBib2R5W1wiaXNfcHJpdmF0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJvZHlbJ21haW4nXSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1haW4gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYm9keVsnaXNBZGRWZXJzaW9uJ10gJiYgYm9keVsncGFyZW50J10pIHtcbiAgICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICByID0gY29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LFxuICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiAnJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgaWYgKGJvZHlbJ2xvY2tlZF9ieSddICYmIGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ10pIHtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnkgPSBib2R5Wydsb2NrZWRfYnknXTtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnlfbmFtZSA9IGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ107XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgICAgICAgIGlmIChib2R5W1wib3ZlcndyaXRlXCJdICYmIGJvZHlbXCJvdmVyd3JpdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5vd25lcic6IGJvZHlbJ293bmVyJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuYXBwcm92ZSc6IGJvZHlbJ2FwcHJvdmUnXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAkbmU6IHRydWVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogZmlsZU9iai5faWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbihzdG9yZU5hbWUpIHtcbiAgICAgICAgdmFyIHJlc3AsIHNpemU7XG4gICAgICAgIHNpemUgPSBuZXdGaWxlLm9yaWdpbmFsLnNpemU7XG4gICAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAgIHNpemUgPSAxMDI0O1xuICAgICAgICB9XG4gICAgICAgIHJlc3AgPSB7XG4gICAgICAgICAgdmVyc2lvbl9pZDogbmV3RmlsZS5faWQsXG4gICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICB9O1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZGVsZXRlXCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjb2xsZWN0aW9uLCBmaWxlLCBpZCwgcmVzcDtcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXM7XG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG4gIGlmIChpZCkge1xuICAgIGZpbGUgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpZFxuICAgIH0pO1xuICAgIGlmIChmaWxlKSB7XG4gICAgICBmaWxlLnJlbW92ZSgpO1xuICAgICAgcmVzcCA9IHtcbiAgICAgICAgc3RhdHVzOiBcIk9LXCJcbiAgICAgIH07XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gIHJldHVybiByZXMuZW5kKCk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGlkO1xuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuICByZXMuc3RhdHVzQ29kZSA9IDMwMjtcbiAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvaW5zdGFuY2VzL1wiKSArIGlkICsgXCI/ZG93bmxvYWQ9MVwiKTtcbiAgcmV0dXJuIHJlcy5lbmQoKTtcbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9wdXNoL21lc3NhZ2VcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIGlmIHJlcS5ib2R5Py5wdXNoVG9waWMgYW5kIHJlcS5ib2R5LnVzZXJJZHMgYW5kIHJlcS5ib2R5LmRhdGFcbiAgICAgICAgbWVzc2FnZSA9IFxuICAgICAgICAgICAgZnJvbTogXCJzdGVlZG9zXCJcbiAgICAgICAgICAgIHF1ZXJ5OlxuICAgICAgICAgICAgICAgIGFwcE5hbWU6IHJlcS5ib2R5LnB1c2hUb3BpY1xuICAgICAgICAgICAgICAgIHVzZXJJZDogXG4gICAgICAgICAgICAgICAgICAgIFwiJGluXCI6IHVzZXJJZHNcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlP1xuICAgICAgICAgICAgbWVzc2FnZVtcInRpdGxlXCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYWxlcnQ/XG4gICAgICAgICAgICBtZXNzYWdlW1widGV4dFwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnRcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5iYWRnZT9cbiAgICAgICAgICAgIG1lc3NhZ2VbXCJiYWRnZVwiXSA9IHJlcS5ib2R5LmRhdGEuYmFkZ2UgKyBcIlwiXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuc291bmQ/XG4gICAgICAgICAgICBtZXNzYWdlW1wic291bmRcIl0gPSByZXEuYm9keS5kYXRhLnNvdW5kXG4gICAgICAgICNpZiByZXEuYm9keS5kYXRhLmRhdGE/XG4gICAgICAgICMgICAgbWVzc2FnZVtcImRhdGFcIl0gPSByZXEuYm9keS5kYXRhLmRhdGFcbiAgICAgICAgUHVzaC5zZW5kIG1lc3NhZ2VcblxuICAgICAgICByZXMuZW5kKFwic3VjY2Vzc1wiKTtcblxuXG5cbk1ldGVvci5tZXRob2RzXG4gICAgcHVzaFNlbmQ6ICh0ZXh0LHRpdGxlLGJhZGdlLHVzZXJJZCkgLT5cbiAgICAgICAgaWYgKCF1c2VySWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIFB1c2guc2VuZFxuICAgICAgICAgICAgZnJvbTogJ3N0ZWVkb3MnLFxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICAgIGJhZGdlOiBiYWRnZSxcbiAgICAgICAgICAgIHF1ZXJ5OiBcbiAgICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZFxuICAgICAgICAgICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuIiwiSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9wdXNoL21lc3NhZ2VcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIG1lc3NhZ2UsIHJlZjtcbiAgaWYgKCgocmVmID0gcmVxLmJvZHkpICE9IG51bGwgPyByZWYucHVzaFRvcGljIDogdm9pZCAwKSAmJiByZXEuYm9keS51c2VySWRzICYmIHJlcS5ib2R5LmRhdGEpIHtcbiAgICBtZXNzYWdlID0ge1xuICAgICAgZnJvbTogXCJzdGVlZG9zXCIsXG4gICAgICBxdWVyeToge1xuICAgICAgICBhcHBOYW1lOiByZXEuYm9keS5wdXNoVG9waWMsXG4gICAgICAgIHVzZXJJZDoge1xuICAgICAgICAgIFwiJGluXCI6IHVzZXJJZHNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZSAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1widGl0bGVcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGU7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLmFsZXJ0ICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJ0ZXh0XCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydDtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYmFkZ2UgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCI7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLnNvdW5kICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJzb3VuZFwiXSA9IHJlcS5ib2R5LmRhdGEuc291bmQ7XG4gICAgfVxuICAgIFB1c2guc2VuZChtZXNzYWdlKTtcbiAgICByZXR1cm4gcmVzLmVuZChcInN1Y2Nlc3NcIik7XG4gIH1cbn0pO1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gIHB1c2hTZW5kOiBmdW5jdGlvbih0ZXh0LCB0aXRsZSwgYmFkZ2UsIHVzZXJJZCkge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBQdXNoLnNlbmQoe1xuICAgICAgZnJvbTogJ3N0ZWVkb3MnLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgdGV4dDogdGV4dCxcbiAgICAgIGJhZGdlOiBiYWRnZSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJBbGl5dW5fcHVzaCA9IHt9O1xuXG5BbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSA9ICh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGNhbGxiYWNrKSAtPlxuXHRpZiBub3RpZmljYXRpb24udGl0bGUgYW5kIG5vdGlmaWNhdGlvbi50ZXh0XG5cdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0Y29uc29sZS5sb2cgdXNlclRva2Vuc1xuXG5cdFx0YWxpeXVuVG9rZW5zID0gbmV3IEFycmF5XG5cdFx0eGluZ2VUb2tlbnMgPSBuZXcgQXJyYXlcblx0XHRodWF3ZWlUb2tlbnMgPSBuZXcgQXJyYXlcblx0XHRtaVRva2VucyA9IG5ldyBBcnJheVxuXG5cdFx0dXNlclRva2Vucy5mb3JFYWNoICh1c2VyVG9rZW4pIC0+XG5cdFx0XHRhcnIgPSB1c2VyVG9rZW4uc3BsaXQoJzonKVxuXHRcdFx0aWYgYXJyWzBdIGlzIFwiYWxpeXVuXCJcblx0XHRcdFx0YWxpeXVuVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwieGluZ2VcIlxuXHRcdFx0XHR4aW5nZVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXG5cdFx0XHRlbHNlIGlmIGFyclswXSBpcyBcImh1YXdlaVwiXG5cdFx0XHRcdGh1YXdlaVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXG5cdFx0XHRlbHNlIGlmIGFyclswXSBpcyBcIm1pXCJcblx0XHRcdFx0bWlUb2tlbnMucHVzaCBfLmxhc3QoYXJyKVxuXG5cdFx0aWYgIV8uaXNFbXB0eShhbGl5dW5Ub2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYWxpeXVuXG5cdFx0XHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiYWxpeXVuVG9rZW5zOiAje2FsaXl1blRva2Vuc31cIlxuXHRcdFx0QUxZUFVTSCA9IG5ldyAoQUxZLlBVU0gpKFxuXHRcdFx0XHRhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFjY2Vzc0tleUlkXG5cdFx0XHRcdHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLnNlY3JldEFjY2Vzc0tleVxuXHRcdFx0XHRlbmRwb2ludDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmVuZHBvaW50XG5cdFx0XHRcdGFwaVZlcnNpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hcGlWZXJzaW9uKTtcblxuXHRcdFx0ZGF0YSA9IFxuXHRcdFx0XHRBcHBLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hcHBLZXlcblx0XHRcdFx0VGFyZ2V0OiAnZGV2aWNlJ1xuXHRcdFx0XHRUYXJnZXRWYWx1ZTogYWxpeXVuVG9rZW5zLnRvU3RyaW5nKClcblx0XHRcdFx0VGl0bGU6IG5vdGlmaWNhdGlvbi50aXRsZVxuXHRcdFx0XHRTdW1tYXJ5OiBub3RpZmljYXRpb24udGV4dFxuXG5cdFx0XHRBTFlQVVNILnB1c2hOb3RpY2VUb0FuZHJvaWQgZGF0YSwgY2FsbGJhY2tcblxuXHRcdGlmICFfLmlzRW1wdHkoeGluZ2VUb2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ueGluZ2Vcblx0XHRcdFhpbmdlID0gcmVxdWlyZSgneGluZ2UnKTtcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJ4aW5nZVRva2VuczogI3t4aW5nZVRva2Vuc31cIlxuXHRcdFx0WGluZ2VBcHAgPSBuZXcgWGluZ2UuWGluZ2VBcHAoTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2UuYWNjZXNzSWQsIE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLnNlY3JldEtleSlcblx0XHRcdFxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UgPSBuZXcgWGluZ2UuQW5kcm9pZE1lc3NhZ2Vcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnR5cGUgPSBYaW5nZS5NRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS50aXRsZSA9IG5vdGlmaWNhdGlvbi50aXRsZVxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UuY29udGVudCA9IG5vdGlmaWNhdGlvbi50ZXh0XG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5zdHlsZSA9IG5ldyBYaW5nZS5TdHlsZVxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UuYWN0aW9uID0gbmV3IFhpbmdlLkNsaWNrQWN0aW9uXG5cblx0XHRcdF8uZWFjaCB4aW5nZVRva2VucywgKHQpLT5cblx0XHRcdFx0WGluZ2VBcHAucHVzaFRvU2luZ2xlRGV2aWNlIHQsIGFuZHJvaWRNZXNzYWdlLCBjYWxsYmFja1xuXG5cdFx0aWYgIV8uaXNFbXB0eShodWF3ZWlUb2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8uaHVhd2VpXG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiaHVhd2VpVG9rZW5zOiAje2h1YXdlaVRva2Vuc31cIlxuXG5cdFx0XHRwYWNrYWdlX25hbWUgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwUGtnTmFtZVxuXHRcdFx0dG9rZW5EYXRhTGlzdCA9IFtdXG5cdFx0XHRfLmVhY2ggaHVhd2VpVG9rZW5zLCAodCktPlxuXHRcdFx0XHR0b2tlbkRhdGFMaXN0LnB1c2goeydwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsICd0b2tlbic6IHR9KVxuXHRcdFx0bm90aSA9IHsnYW5kcm9pZCc6IHsndGl0bGUnOiBub3RpZmljYXRpb24udGl0bGUsICdtZXNzYWdlJzogbm90aWZpY2F0aW9uLnRleHR9LCAnZXh0cmFzJzogbm90aWZpY2F0aW9uLnBheWxvYWR9XG5cblx0XHRcdEh1YXdlaVB1c2guY29uZmlnIFt7J3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSwgJ2NsaWVudF9pZCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBJZCwgJ2NsaWVudF9zZWNyZXQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwU2VjcmV0fV1cblx0XHRcdFxuXHRcdFx0SHVhd2VpUHVzaC5zZW5kTWFueSBub3RpLCB0b2tlbkRhdGFMaXN0XG5cblxuXHRcdGlmICFfLmlzRW1wdHkobWlUb2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ubWlcblx0XHRcdE1pUHVzaCA9IHJlcXVpcmUoJ3hpYW9taS1wdXNoJyk7XG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwibWlUb2tlbnM6ICN7bWlUb2tlbnN9XCJcblx0XHRcdG1zZyA9IG5ldyBNaVB1c2guTWVzc2FnZVxuXHRcdFx0bXNnLnRpdGxlKG5vdGlmaWNhdGlvbi50aXRsZSkuZGVzY3JpcHRpb24obm90aWZpY2F0aW9uLnRleHQpXG5cdFx0XHRub3RpZmljYXRpb24gPSBuZXcgTWlQdXNoLk5vdGlmaWNhdGlvbihcblx0XHRcdFx0cHJvZHVjdGlvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkucHJvZHVjdGlvblxuXHRcdFx0XHRhcHBTZWNyZXQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLmFwcFNlY3JldFxuXHRcdFx0KVxuXHRcdFx0Xy5lYWNoIG1pVG9rZW5zLCAocmVnaWQpLT5cblx0XHRcdFx0bm90aWZpY2F0aW9uLnNlbmQgcmVnaWQsIG1zZywgY2FsbGJhY2tcblxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRcblx0aWYgbm90IE1ldGVvci5zZXR0aW5ncy5jcm9uPy5wdXNoX2ludGVydmFsXG5cdFx0cmV0dXJuXG5cblx0Y29uZmlnID0ge1xuXHRcdGRlYnVnOiB0cnVlXG5cdFx0a2VlcE5vdGlmaWNhdGlvbnM6IGZhbHNlXG5cdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5wdXNoX2ludGVydmFsXG5cdFx0c2VuZEJhdGNoU2l6ZTogMTBcblx0XHRwcm9kdWN0aW9uOiB0cnVlXG5cdH1cblxuXHRpZiAhXy5pc0VtcHR5KE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hcG4pICYmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFwbi5rZXlEYXRhKSAmJiAhXy5pc0VtcHR5KE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hcG4uY2VydERhdGEpXG5cdFx0Y29uZmlnLmFwbiA9IHtcblx0XHRcdGtleURhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5rZXlEYXRhXG5cdFx0XHRjZXJ0RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmNlcnREYXRhXG5cdFx0fVxuXHRpZiAhXy5pc0VtcHR5KE1ldGVvci5zZXR0aW5ncy5wdXNoPy5nY20pICYmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmdjbS5wcm9qZWN0TnVtYmVyKSAmJiAhXy5pc0VtcHR5KE1ldGVvci5zZXR0aW5ncy5wdXNoPy5nY20uYXBpS2V5KVxuXHRcdGNvbmZpZy5nY20gPSB7XG5cdFx0XHRwcm9qZWN0TnVtYmVyOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20ucHJvamVjdE51bWJlclxuXHRcdFx0YXBpS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20uYXBpS2V5XG5cdFx0fVxuXG5cdFB1c2guQ29uZmlndXJlIGNvbmZpZ1xuXHRcblx0aWYgKE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hbGl5dW4gb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/LnhpbmdlIG9yIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5odWF3ZWkgb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lm1pKSBhbmQgUHVzaCBhbmQgdHlwZW9mIFB1c2guc2VuZEdDTSA9PSAnZnVuY3Rpb24nXG5cdFx0XG5cdFx0UHVzaC5vbGRfc2VuZEdDTSA9IFB1c2guc2VuZEdDTTtcblxuXHRcdFB1c2guc2VuZEFsaXl1biA9ICh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIC0+XG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uXG5cblx0XHRcdGlmIE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KVxuXHRcdFx0XHRub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKVxuXHRcdFx0IyBNYWtlIHN1cmUgdXNlclRva2VucyBhcmUgYW4gYXJyYXkgb2Ygc3RyaW5nc1xuXHRcdFx0aWYgdXNlclRva2VucyA9PSAnJyArIHVzZXJUb2tlbnNcblx0XHRcdFx0dXNlclRva2VucyA9IFsgdXNlclRva2VucyBdXG5cdFx0XHQjIENoZWNrIGlmIGFueSB0b2tlbnMgaW4gdGhlcmUgdG8gc2VuZFxuXHRcdFx0aWYgIXVzZXJUb2tlbnMubGVuZ3RoXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJ1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cblxuXHRcdFx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXHQgIFxuXHRcdFx0dXNlclRva2VuID0gaWYgdXNlclRva2Vucy5sZW5ndGggPT0gMSB0aGVuIHVzZXJUb2tlbnNbMF0gZWxzZSBudWxsXG5cdFx0XHRBbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIChlcnIsIHJlc3VsdCkgLT5cblx0XHRcdFx0aWYgZXJyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQgRVJST1I6IHJlc3VsdCBvZiBzZW5kZXI6ICcgKyByZXN1bHRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIHJlc3VsdCA9PSBudWxsXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyAnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlciBpcyBudWxsJ1xuXHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXI6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpXG5cblx0XHRcdFx0XHRpZiByZXN1bHQuY2Fub25pY2FsX2lkcyA9PSAxIGFuZCB1c2VyVG9rZW5cblx0XHRcdFx0XHRcdEZpYmVyKChzZWxmKSAtPlxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmNhbGxiYWNrIHNlbGYub2xkVG9rZW4sIHNlbGYubmV3VG9rZW5cblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyXG5cdFx0XHRcdFx0XHQpLnJ1blxuXHRcdFx0XHRcdFx0XHRvbGRUb2tlbjogZ2NtOiB1c2VyVG9rZW5cblx0XHRcdFx0XHRcdFx0bmV3VG9rZW46IGdjbTogXCJhbGl5dW46XCIgKyByZXN1bHQucmVzdWx0c1swXS5yZWdpc3RyYXRpb25faWRcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2s6IF9yZXBsYWNlVG9rZW5cblx0XHRcdFx0XHRpZiByZXN1bHQuZmFpbHVyZSAhPSAwIGFuZCB1c2VyVG9rZW5cblx0XHRcdFx0XHRcdEZpYmVyKChzZWxmKSAtPlxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmNhbGxiYWNrIHNlbGYudG9rZW5cblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyXG5cdFx0XHRcdFx0XHQpLnJ1blxuXHRcdFx0XHRcdFx0XHR0b2tlbjogZ2NtOiB1c2VyVG9rZW5cblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2s6IF9yZW1vdmVUb2tlblxuXG5cblxuXHRcdFB1c2guc2VuZEdDTSA9ICh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIC0+XG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIGZyb20gYWxpeXVuLT4gUHVzaC5zZW5kR0NNJ1xuXHRcdFx0aWYgTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpXG5cdFx0XHRcdG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pXG5cdFx0XHQjIE1ha2Ugc3VyZSB1c2VyVG9rZW5zIGFyZSBhbiBhcnJheSBvZiBzdHJpbmdzXG5cdFx0XHRpZiB1c2VyVG9rZW5zID09ICcnICsgdXNlclRva2Vuc1xuXHRcdFx0XHR1c2VyVG9rZW5zID0gWyB1c2VyVG9rZW5zIF1cblx0XHRcdCMgQ2hlY2sgaWYgYW55IHRva2VucyBpbiB0aGVyZSB0byBzZW5kXG5cdFx0XHRpZiAhdXNlclRva2Vucy5sZW5ndGhcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTScsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxuXG5cdFx0XHRhbGl5dW5Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcigoaXRlbSkgLT5cblx0XHRcdFx0XHRcdFx0XHRpdGVtLmluZGV4T2YoJ2FsaXl1bjonKSA+IC0xIG9yIGl0ZW0uaW5kZXhPZigneGluZ2U6JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ2h1YXdlaTonKSA+IC0xIG9yIGl0ZW0uaW5kZXhPZignbWk6JykgPiAtMVxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdhbGl5dW5Ub2tlbnMgaXMgJywgYWxpeXVuVG9rZW5zLnRvU3RyaW5nKClcblxuXHRcdFx0Z2NtVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoKGl0ZW0pIC0+XG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5pbmRleE9mKFwiYWxpeXVuOlwiKSA8IDAgYW5kIGl0ZW0uaW5kZXhPZihcInhpbmdlOlwiKSA8IDAgYW5kIGl0ZW0uaW5kZXhPZihcImh1YXdlaTpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJtaTpcIikgPCAwXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ2djbVRva2VucyBpcyAnICwgZ2NtVG9rZW5zLnRvU3RyaW5nKCk7XG5cblx0XHRcdFB1c2guc2VuZEFsaXl1bihhbGl5dW5Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG5cblx0XHRcdFB1c2gub2xkX3NlbmRHQ00oZ2NtVG9rZW5zLCBub3RpZmljYXRpb24pO1xuXG5cdFx0UHVzaC5vbGRfc2VuZEFQTiA9IFB1c2guc2VuZEFQTlxuXHRcdFB1c2guc2VuZEFQTiA9ICh1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbikgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRpZiBub3RpZmljYXRpb24udGl0bGUgYW5kIG5vdGlmaWNhdGlvbi50ZXh0XG5cdFx0XHRcdFx0bm90aSA9IF8uY2xvbmUobm90aWZpY2F0aW9uKVxuXHRcdFx0XHRcdG5vdGkudGV4dCA9IG5vdGkudGl0bGUgKyBcIiBcIiArIG5vdGkudGV4dFxuXHRcdFx0XHRcdG5vdGkudGl0bGUgPSBcIlwiXG5cdFx0XHRcdFx0UHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGkpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGUpXG4iLCJ2YXIgQWxpeXVuX3B1c2g7XG5cbkFsaXl1bl9wdXNoID0ge307XG5cbkFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBjYWxsYmFjaykge1xuICB2YXIgQUxZLCBBTFlQVVNILCBNaVB1c2gsIFhpbmdlLCBYaW5nZUFwcCwgYWxpeXVuVG9rZW5zLCBhbmRyb2lkTWVzc2FnZSwgZGF0YSwgaHVhd2VpVG9rZW5zLCBtaVRva2VucywgbXNnLCBub3RpLCBwYWNrYWdlX25hbWUsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdG9rZW5EYXRhTGlzdCwgeGluZ2VUb2tlbnM7XG4gIGlmIChub3RpZmljYXRpb24udGl0bGUgJiYgbm90aWZpY2F0aW9uLnRleHQpIHtcbiAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2codXNlclRva2Vucyk7XG4gICAgfVxuICAgIGFsaXl1blRva2VucyA9IG5ldyBBcnJheTtcbiAgICB4aW5nZVRva2VucyA9IG5ldyBBcnJheTtcbiAgICBodWF3ZWlUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgbWlUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgdXNlclRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uKHVzZXJUb2tlbikge1xuICAgICAgdmFyIGFycjtcbiAgICAgIGFyciA9IHVzZXJUb2tlbi5zcGxpdCgnOicpO1xuICAgICAgaWYgKGFyclswXSA9PT0gXCJhbGl5dW5cIikge1xuICAgICAgICByZXR1cm4gYWxpeXVuVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwieGluZ2VcIikge1xuICAgICAgICByZXR1cm4geGluZ2VUb2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyclswXSA9PT0gXCJodWF3ZWlcIikge1xuICAgICAgICByZXR1cm4gaHVhd2VpVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwibWlcIikge1xuICAgICAgICByZXR1cm4gbWlUb2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFfLmlzRW1wdHkoYWxpeXVuVG9rZW5zKSAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmLmFsaXl1biA6IHZvaWQgMCkpIHtcbiAgICAgIEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYWxpeXVuVG9rZW5zOiBcIiArIGFsaXl1blRva2Vucyk7XG4gICAgICB9XG4gICAgICBBTFlQVVNIID0gbmV3IEFMWS5QVVNIKHtcbiAgICAgICAgYWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hY2Nlc3NLZXlJZCxcbiAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5LFxuICAgICAgICBlbmRwb2ludDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmVuZHBvaW50LFxuICAgICAgICBhcGlWZXJzaW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBpVmVyc2lvblxuICAgICAgfSk7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBBcHBLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hcHBLZXksXG4gICAgICAgIFRhcmdldDogJ2RldmljZScsXG4gICAgICAgIFRhcmdldFZhbHVlOiBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKSxcbiAgICAgICAgVGl0bGU6IG5vdGlmaWNhdGlvbi50aXRsZSxcbiAgICAgICAgU3VtbWFyeTogbm90aWZpY2F0aW9uLnRleHRcbiAgICAgIH07XG4gICAgICBBTFlQVVNILnB1c2hOb3RpY2VUb0FuZHJvaWQoZGF0YSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eSh4aW5nZVRva2VucykgJiYgKChyZWYxID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYxLnhpbmdlIDogdm9pZCAwKSkge1xuICAgICAgWGluZ2UgPSByZXF1aXJlKCd4aW5nZScpO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ4aW5nZVRva2VuczogXCIgKyB4aW5nZVRva2Vucyk7XG4gICAgICB9XG4gICAgICBYaW5nZUFwcCA9IG5ldyBYaW5nZS5YaW5nZUFwcChNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5hY2Nlc3NJZCwgTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2Uuc2VjcmV0S2V5KTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlID0gbmV3IFhpbmdlLkFuZHJvaWRNZXNzYWdlO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UudHlwZSA9IFhpbmdlLk1FU1NBR0VfVFlQRV9OT1RJRklDQVRJT047XG4gICAgICBhbmRyb2lkTWVzc2FnZS50aXRsZSA9IG5vdGlmaWNhdGlvbi50aXRsZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLmNvbnRlbnQgPSBub3RpZmljYXRpb24udGV4dDtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnN0eWxlID0gbmV3IFhpbmdlLlN0eWxlO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UuYWN0aW9uID0gbmV3IFhpbmdlLkNsaWNrQWN0aW9uO1xuICAgICAgXy5lYWNoKHhpbmdlVG9rZW5zLCBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiBYaW5nZUFwcC5wdXNoVG9TaW5nbGVEZXZpY2UodCwgYW5kcm9pZE1lc3NhZ2UsIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eShodWF3ZWlUb2tlbnMpICYmICgocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMi5odWF3ZWkgOiB2b2lkIDApKSB7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImh1YXdlaVRva2VuczogXCIgKyBodWF3ZWlUb2tlbnMpO1xuICAgICAgfVxuICAgICAgcGFja2FnZV9uYW1lID0gTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFBrZ05hbWU7XG4gICAgICB0b2tlbkRhdGFMaXN0ID0gW107XG4gICAgICBfLmVhY2goaHVhd2VpVG9rZW5zLCBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0b2tlbkRhdGFMaXN0LnB1c2goe1xuICAgICAgICAgICdwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsXG4gICAgICAgICAgJ3Rva2VuJzogdFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgbm90aSA9IHtcbiAgICAgICAgJ2FuZHJvaWQnOiB7XG4gICAgICAgICAgJ3RpdGxlJzogbm90aWZpY2F0aW9uLnRpdGxlLFxuICAgICAgICAgICdtZXNzYWdlJzogbm90aWZpY2F0aW9uLnRleHRcbiAgICAgICAgfSxcbiAgICAgICAgJ2V4dHJhcyc6IG5vdGlmaWNhdGlvbi5wYXlsb2FkXG4gICAgICB9O1xuICAgICAgSHVhd2VpUHVzaC5jb25maWcoW1xuICAgICAgICB7XG4gICAgICAgICAgJ3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSxcbiAgICAgICAgICAnY2xpZW50X2lkJzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcElkLFxuICAgICAgICAgICdjbGllbnRfc2VjcmV0JzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFNlY3JldFxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICAgIEh1YXdlaVB1c2guc2VuZE1hbnkobm90aSwgdG9rZW5EYXRhTGlzdCk7XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KG1pVG9rZW5zKSAmJiAoKHJlZjMgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjMubWkgOiB2b2lkIDApKSB7XG4gICAgICBNaVB1c2ggPSByZXF1aXJlKCd4aWFvbWktcHVzaCcpO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJtaVRva2VuczogXCIgKyBtaVRva2Vucyk7XG4gICAgICB9XG4gICAgICBtc2cgPSBuZXcgTWlQdXNoLk1lc3NhZ2U7XG4gICAgICBtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5kZXNjcmlwdGlvbihub3RpZmljYXRpb24udGV4dCk7XG4gICAgICBub3RpZmljYXRpb24gPSBuZXcgTWlQdXNoLk5vdGlmaWNhdGlvbih7XG4gICAgICAgIHByb2R1Y3Rpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLnByb2R1Y3Rpb24sXG4gICAgICAgIGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkuYXBwU2VjcmV0XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2gobWlUb2tlbnMsIGZ1bmN0aW9uKHJlZ2lkKSB7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uc2VuZChyZWdpZCwgbXNnLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY29uZmlnLCByZWYsIHJlZjEsIHJlZjEwLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWY2LCByZWY3LCByZWY4LCByZWY5O1xuICBpZiAoISgocmVmID0gTWV0ZW9yLnNldHRpbmdzLmNyb24pICE9IG51bGwgPyByZWYucHVzaF9pbnRlcnZhbCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uZmlnID0ge1xuICAgIGRlYnVnOiB0cnVlLFxuICAgIGtlZXBOb3RpZmljYXRpb25zOiBmYWxzZSxcbiAgICBzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLnB1c2hfaW50ZXJ2YWwsXG4gICAgc2VuZEJhdGNoU2l6ZTogMTAsXG4gICAgcHJvZHVjdGlvbjogdHJ1ZVxuICB9O1xuICBpZiAoIV8uaXNFbXB0eSgocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMS5hcG4gOiB2b2lkIDApICYmICFfLmlzRW1wdHkoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjIuYXBuLmtleURhdGEgOiB2b2lkIDApICYmICFfLmlzRW1wdHkoKHJlZjMgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjMuYXBuLmNlcnREYXRhIDogdm9pZCAwKSkge1xuICAgIGNvbmZpZy5hcG4gPSB7XG4gICAgICBrZXlEYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4ua2V5RGF0YSxcbiAgICAgIGNlcnREYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4uY2VydERhdGFcbiAgICB9O1xuICB9XG4gIGlmICghXy5pc0VtcHR5KChyZWY0ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY0LmdjbSA6IHZvaWQgMCkgJiYgIV8uaXNFbXB0eSgocmVmNSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNS5nY20ucHJvamVjdE51bWJlciA6IHZvaWQgMCkgJiYgIV8uaXNFbXB0eSgocmVmNiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNi5nY20uYXBpS2V5IDogdm9pZCAwKSkge1xuICAgIGNvbmZpZy5nY20gPSB7XG4gICAgICBwcm9qZWN0TnVtYmVyOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20ucHJvamVjdE51bWJlcixcbiAgICAgIGFwaUtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLmFwaUtleVxuICAgIH07XG4gIH1cbiAgUHVzaC5Db25maWd1cmUoY29uZmlnKTtcbiAgaWYgKCgoKHJlZjcgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjcuYWxpeXVuIDogdm9pZCAwKSB8fCAoKHJlZjggPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjgueGluZ2UgOiB2b2lkIDApIHx8ICgocmVmOSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmOS5odWF3ZWkgOiB2b2lkIDApIHx8ICgocmVmMTAgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjEwLm1pIDogdm9pZCAwKSkgJiYgUHVzaCAmJiB0eXBlb2YgUHVzaC5zZW5kR0NNID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUHVzaC5vbGRfc2VuZEdDTSA9IFB1c2guc2VuZEdDTTtcbiAgICBQdXNoLnNlbmRBbGl5dW4gPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBGaWJlciwgdXNlclRva2VuO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KSkge1xuICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyVG9rZW5zID09PSAnJyArIHVzZXJUb2tlbnMpIHtcbiAgICAgICAgdXNlclRva2VucyA9IFt1c2VyVG9rZW5zXTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlclRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgICAgIHVzZXJUb2tlbiA9IHVzZXJUb2tlbnMubGVuZ3RoID09PSAxID8gdXNlclRva2Vuc1swXSA6IG51bGw7XG4gICAgICByZXR1cm4gQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UodXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdBTkRST0lEIEVSUk9SOiByZXN1bHQgb2Ygc2VuZGVyOiAnICsgcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlciBpcyBudWxsJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXI6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdC5jYW5vbmljYWxfaWRzID09PSAxICYmIHVzZXJUb2tlbikge1xuICAgICAgICAgICAgRmliZXIoZnVuY3Rpb24oc2VsZikge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKHNlbGYub2xkVG9rZW4sIHNlbGYubmV3VG9rZW4pO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5ydW4oe1xuICAgICAgICAgICAgICBvbGRUb2tlbjoge1xuICAgICAgICAgICAgICAgIGdjbTogdXNlclRva2VuXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5ld1Rva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiBcImFsaXl1bjpcIiArIHJlc3VsdC5yZXN1bHRzWzBdLnJlZ2lzdHJhdGlvbl9pZFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWxsYmFjazogX3JlcGxhY2VUb2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQuZmFpbHVyZSAhPT0gMCAmJiB1c2VyVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBGaWJlcihmdW5jdGlvbihzZWxmKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soc2VsZi50b2tlbik7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnJ1bih7XG4gICAgICAgICAgICAgIHRva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiB1c2VyVG9rZW5cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IF9yZW1vdmVUb2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIFB1c2guc2VuZEdDTSA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIGFsaXl1blRva2VucywgZ2NtVG9rZW5zO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gZnJvbSBhbGl5dW4tPiBQdXNoLnNlbmRHQ00nKTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdCkpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSk7XG4gICAgICB9XG4gICAgICBpZiAodXNlclRva2VucyA9PT0gJycgKyB1c2VyVG9rZW5zKSB7XG4gICAgICAgIHVzZXJUb2tlbnMgPSBbdXNlclRva2Vuc107XG4gICAgICB9XG4gICAgICBpZiAoIXVzZXJUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICAgIGFsaXl1blRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaW5kZXhPZignYWxpeXVuOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCd4aW5nZTonKSA+IC0xIHx8IGl0ZW0uaW5kZXhPZignaHVhd2VpOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCdtaTonKSA+IC0xO1xuICAgICAgfSk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnYWxpeXVuVG9rZW5zIGlzICcsIGFsaXl1blRva2Vucy50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIGdjbVRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaW5kZXhPZihcImFsaXl1bjpcIikgPCAwICYmIGl0ZW0uaW5kZXhPZihcInhpbmdlOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwiaHVhd2VpOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwibWk6XCIpIDwgMDtcbiAgICAgIH0pO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2djbVRva2VucyBpcyAnLCBnY21Ub2tlbnMudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICBQdXNoLnNlbmRBbGl5dW4oYWxpeXVuVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRHQ00oZ2NtVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgIH07XG4gICAgUHVzaC5vbGRfc2VuZEFQTiA9IFB1c2guc2VuZEFQTjtcbiAgICByZXR1cm4gUHVzaC5zZW5kQVBOID0gZnVuY3Rpb24odXNlclRva2VuLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBlLCBub3RpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKG5vdGlmaWNhdGlvbi50aXRsZSAmJiBub3RpZmljYXRpb24udGV4dCkge1xuICAgICAgICAgIG5vdGkgPSBfLmNsb25lKG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgbm90aS50ZXh0ID0gbm90aS50aXRsZSArIFwiIFwiICsgbm90aS50ZXh0O1xuICAgICAgICAgIG5vdGkudGl0bGUgPSBcIlwiO1xuICAgICAgICAgIHJldHVybiBQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpZmljYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIl19
