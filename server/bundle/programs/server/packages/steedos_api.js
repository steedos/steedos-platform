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
var ServerSession = Package['steedos:base'].ServerSession;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare, ironRouterSendErrorToResponse, msg;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:api":{"checkNpm.js":function(require,exports,module){

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
  'huawei-push': '>=0.0.6-0',
  'xiaomi-push': '>=0.4.5'
}, 'steedos:api');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_files.coffee":function(require){

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

},"lib":{"restivus":{"auth.coffee":function(){

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

},"route.coffee":function(){

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

},"restivus.coffee":function(){

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

}}},"core.coffee":function(){

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

},"steedos":{"space_users.coffee":function(){

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

},"organizations.coffee":function(){

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

}},"routes":{"s3.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/routes/s3.coffee                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.add("post", "/api/v4/instances/s3/", function (req, res, next) {
  return JsonRoutes.parseFiles(req, res, function () {
    var collection, newFile;
    collection = cfs.instances;

    if (req.files && req.files[0]) {
      newFile = new FS.File();
      return newFile.attachData(req.files[0].data, {
        type: req.files[0].mimeType
      }, function (err) {
        var body, e, fileObj, filename, metadata, parent, r, resp, size;
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

        size = fileObj.original.size;

        if (!size) {
          size = 1024;
        }

        resp = {
          version_id: fileObj._id,
          size: size
        };
        res.setHeader("x-amz-version-id", fileObj._id);
        res.end(JSON.stringify(resp));
      });
    } else {
      res.statusCode = 500;
      return res.end();
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

},"push.coffee":function(){

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

},"aliyun_push.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/routes/aliyun_push.coffee                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ALY, Aliyun_push, HwPush, MiPush, Xinge;
ALY = require('aliyun-sdk');
Xinge = require('xinge');
HwPush = require('huawei-push');
MiPush = require('xiaomi-push');
Aliyun_push = {};

Aliyun_push.sendMessage = function (userTokens, notification, callback) {
  var ALYPUSH, XingeApp, aliyunTokens, androidMessage, data, huaweiTokens, miTokens, msg, noti, package_name, ref, ref1, ref2, ref3, tokenDataList, xingeTokens;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3BhcnNlX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFyc2VfZmlsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvbGliL3Jlc3RpdnVzL2lyb24tcm91dGVyLWVycm9yLXRvLXJlc3BvbnNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3N0ZWVkb3Mvc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zdGVlZG9zL3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsIkJ1c2JveSIsIkZpYmVyIiwicmVxdWlyZSIsIkpzb25Sb3V0ZXMiLCJwYXJzZUZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImZpbGVzIiwibWV0aG9kIiwiaGVhZGVycyIsIm9uIiwiZmllbGRuYW1lIiwiZmlsZSIsImZpbGVuYW1lIiwiZW5jb2RpbmciLCJtaW1ldHlwZSIsImJ1ZmZlcnMiLCJpbWFnZSIsIm1pbWVUeXBlIiwiZGF0YSIsInB1c2giLCJCdWZmZXIiLCJjb25jYXQiLCJ2YWx1ZSIsImJvZHkiLCJydW4iLCJwaXBlIiwiZ2V0VXNlclF1ZXJ5U2VsZWN0b3IiLCJ1c2VyVmFsaWRhdG9yIiwiQXV0aCIsIk1hdGNoIiwiV2hlcmUiLCJ1c2VyIiwiY2hlY2siLCJpZCIsIk9wdGlvbmFsIiwiU3RyaW5nIiwidXNlcm5hbWUiLCJlbWFpbCIsIl8iLCJrZXlzIiwibGVuZ3RoIiwiRXJyb3IiLCJsb2dpbldpdGhQYXNzd29yZCIsInBhc3N3b3JkIiwiYXV0aFRva2VuIiwiYXV0aGVudGljYXRpbmdVc2VyIiwiYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IiLCJoYXNoZWRUb2tlbiIsInBhc3N3b3JkVmVyaWZpY2F0aW9uIiwicmVmIiwic3BhY2VfdXNlcnMiLCJzcGFjZXMiLCJNZXRlb3IiLCJ1c2VycyIsImZpbmRPbmUiLCJzZXJ2aWNlcyIsIkFjY291bnRzIiwiX2NoZWNrUGFzc3dvcmQiLCJlcnJvciIsIl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuIiwiX2hhc2hTdGFtcGVkVG9rZW4iLCJfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiIsIl9pZCIsImRiIiwiZmluZCIsImZldGNoIiwiZWFjaCIsInN1Iiwic3BhY2UiLCJpc19wYWlkIiwiaW5kZXhPZiIsImFkbWlucyIsIm5hbWUiLCJ0b2tlbiIsInVzZXJJZCIsImFkbWluU3BhY2VzIiwiZW52IiwicHJvY2VzcyIsIk5PREVfRU5WIiwiaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UiLCJlcnIiLCJzdGF0dXNDb2RlIiwic3RhdHVzIiwibXNnIiwic3RhY2siLCJ0b1N0cmluZyIsImNvbnNvbGUiLCJoZWFkZXJzU2VudCIsInNvY2tldCIsImRlc3Ryb3kiLCJzZXRIZWFkZXIiLCJieXRlTGVuZ3RoIiwiZW5kIiwic2hhcmUiLCJSb3V0ZSIsImFwaSIsInBhdGgiLCJvcHRpb25zIiwiZW5kcG9pbnRzMSIsImVuZHBvaW50cyIsInByb3RvdHlwZSIsImFkZFRvQXBpIiwiYXZhaWxhYmxlTWV0aG9kcyIsImFsbG93ZWRNZXRob2RzIiwiZnVsbFBhdGgiLCJyZWplY3RlZE1ldGhvZHMiLCJzZWxmIiwiY29udGFpbnMiLCJfY29uZmlnIiwicGF0aHMiLCJleHRlbmQiLCJkZWZhdWx0T3B0aW9uc0VuZHBvaW50IiwiX3Jlc29sdmVFbmRwb2ludHMiLCJfY29uZmlndXJlRW5kcG9pbnRzIiwiZmlsdGVyIiwicmVqZWN0IiwiYXBpUGF0aCIsImVuZHBvaW50IiwiYWRkIiwiZG9uZUZ1bmMiLCJlbmRwb2ludENvbnRleHQiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZUluaXRpYXRlZCIsInVybFBhcmFtcyIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicXVlcnkiLCJib2R5UGFyYW1zIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZG9uZSIsIl9jYWxsRW5kcG9pbnQiLCJlcnJvcjEiLCJfcmVzcG9uZCIsIm1lc3NhZ2UiLCJqb2luIiwidG9VcHBlckNhc2UiLCJpc0Z1bmN0aW9uIiwiYWN0aW9uIiwicmVmMSIsInJlZjIiLCJyb2xlUmVxdWlyZWQiLCJ1bmlvbiIsImlzRW1wdHkiLCJhdXRoUmVxdWlyZWQiLCJzcGFjZVJlcXVpcmVkIiwiaW52b2NhdGlvbiIsIl9hdXRoQWNjZXB0ZWQiLCJfcm9sZUFjY2VwdGVkIiwiX3NwYWNlQWNjZXB0ZWQiLCJERFBDb21tb24iLCJNZXRob2RJbnZvY2F0aW9uIiwiaXNTaW11bGF0aW9uIiwiY29ubmVjdGlvbiIsInJhbmRvbVNlZWQiLCJtYWtlUnBjU2VlZCIsIkREUCIsIl9DdXJyZW50SW52b2NhdGlvbiIsIndpdGhWYWx1ZSIsImNhbGwiLCJfYXV0aGVudGljYXRlIiwiYXV0aCIsInVzZXJTZWxlY3RvciIsInNwYWNlX3VzZXJzX2NvdW50Iiwic3BhY2VJZCIsImNvdW50IiwiaW50ZXJzZWN0aW9uIiwicm9sZXMiLCJkZWZhdWx0SGVhZGVycyIsImRlbGF5SW5NaWxsaXNlY29uZHMiLCJtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyIsInJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvIiwic2VuZFJlc3BvbnNlIiwiX2xvd2VyQ2FzZUtleXMiLCJtYXRjaCIsInByZXR0eUpzb24iLCJKU09OIiwic3RyaW5naWZ5Iiwid3JpdGVIZWFkIiwid3JpdGUiLCJNYXRoIiwicmFuZG9tIiwic2V0VGltZW91dCIsIm9iamVjdCIsImNoYWluIiwicGFpcnMiLCJtYXAiLCJhdHRyIiwidG9Mb3dlckNhc2UiLCJSZXN0aXZ1cyIsIml0ZW0iLCJpIiwibCIsImNvcnNIZWFkZXJzIiwiX3JvdXRlcyIsInVzZURlZmF1bHRBdXRoIiwidmVyc2lvbiIsIl91c2VyIiwiX2hhc2hMb2dpblRva2VuIiwiZW5hYmxlQ29ycyIsInNsaWNlIiwibGFzdCIsIl9pbml0QXV0aCIsInVzZUF1dGgiLCJ3YXJuIiwiYWRkUm91dGUiLCJyb3V0ZSIsImFkZENvbGxlY3Rpb24iLCJjb2xsZWN0aW9uIiwiY29sbGVjdGlvbkVuZHBvaW50cyIsImNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyIsImVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiIsImVudGl0eVJvdXRlRW5kcG9pbnRzIiwiZXhjbHVkZWRFbmRwb2ludHMiLCJtZXRob2RzIiwibWV0aG9kc09uQ29sbGVjdGlvbiIsInJvdXRlT3B0aW9ucyIsIl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyIsIl9jb2xsZWN0aW9uRW5kcG9pbnRzIiwiX25hbWUiLCJjb25maWd1cmVkRW5kcG9pbnQiLCJlbmRwb2ludE9wdGlvbnMiLCJtZXRob2RUeXBlIiwiY2xvbmUiLCJnZXQiLCJlbnRpdHkiLCJzZWxlY3RvciIsInB1dCIsImVudGl0eUlzVXBkYXRlZCIsInVwZGF0ZSIsIiRzZXQiLCJyZW1vdmUiLCJwb3N0IiwiZW50aXR5SWQiLCJpbnNlcnQiLCJnZXRBbGwiLCJlbnRpdGllcyIsImZpZWxkcyIsInByb2ZpbGUiLCJjcmVhdGVVc2VyIiwibG9nb3V0IiwiZSIsImV4dHJhRGF0YSIsInNlYXJjaFF1ZXJ5IiwicmVhc29uIiwib25Mb2dnZWRJbiIsImV4dHJhIiwiaW5kZXgiLCJ0b2tlbkZpZWxkTmFtZSIsInRva2VuTG9jYXRpb24iLCJ0b2tlblBhdGgiLCJ0b2tlblJlbW92YWxRdWVyeSIsInRva2VuVG9SZW1vdmUiLCJsYXN0SW5kZXhPZiIsInN1YnN0cmluZyIsIiRwdWxsIiwib25Mb2dnZWRPdXQiLCJpc1NlcnZlciIsIkFQSSIsInN0YXJ0dXAiLCJvcmdhbml6YXRpb25zIiwibmV3RmlsZSIsImNmcyIsImluc3RhbmNlcyIsIkZTIiwiRmlsZSIsImF0dGFjaERhdGEiLCJ0eXBlIiwiZmlsZU9iaiIsIm1ldGFkYXRhIiwicGFyZW50IiwiciIsInJlc3AiLCJzaXplIiwiaW5jbHVkZXMiLCJtb21lbnQiLCJEYXRlIiwiZm9ybWF0Iiwic3BsaXQiLCJwb3AiLCJkZWNvZGVVUklDb21wb25lbnQiLCJyZXBsYWNlIiwib3duZXIiLCJvd25lcl9uYW1lIiwiaW5zdGFuY2UiLCJhcHByb3ZlIiwiY3VycmVudCIsInRvTG9jYWxlTG93ZXJDYXNlIiwiaXNfcHJpdmF0ZSIsIm1haW4iLCIkdW5zZXQiLCJsb2NrZWRfYnkiLCJsb2NrZWRfYnlfbmFtZSIsIiRuZSIsIm9yaWdpbmFsIiwidmVyc2lvbl9pZCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsInB1c2hUb3BpYyIsInVzZXJJZHMiLCJmcm9tIiwiYXBwTmFtZSIsImFsZXJ0VGl0bGUiLCJhbGVydCIsImJhZGdlIiwic291bmQiLCJQdXNoIiwic2VuZCIsInB1c2hTZW5kIiwidGV4dCIsInRpdGxlIiwiQUxZIiwiQWxpeXVuX3B1c2giLCJId1B1c2giLCJNaVB1c2giLCJYaW5nZSIsInNlbmRNZXNzYWdlIiwidXNlclRva2VucyIsIm5vdGlmaWNhdGlvbiIsImNhbGxiYWNrIiwiQUxZUFVTSCIsIlhpbmdlQXBwIiwiYWxpeXVuVG9rZW5zIiwiYW5kcm9pZE1lc3NhZ2UiLCJodWF3ZWlUb2tlbnMiLCJtaVRva2VucyIsIm5vdGkiLCJwYWNrYWdlX25hbWUiLCJyZWYzIiwidG9rZW5EYXRhTGlzdCIsInhpbmdlVG9rZW5zIiwiZGVidWciLCJsb2ciLCJBcnJheSIsImZvckVhY2giLCJ1c2VyVG9rZW4iLCJhcnIiLCJzZXR0aW5ncyIsImFsaXl1biIsIlBVU0giLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsImFwaVZlcnNpb24iLCJBcHBLZXkiLCJhcHBLZXkiLCJUYXJnZXQiLCJUYXJnZXRWYWx1ZSIsIlRpdGxlIiwiU3VtbWFyeSIsInB1c2hOb3RpY2VUb0FuZHJvaWQiLCJ4aW5nZSIsImFjY2Vzc0lkIiwic2VjcmV0S2V5IiwiQW5kcm9pZE1lc3NhZ2UiLCJNRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OIiwiY29udGVudCIsInN0eWxlIiwiU3R5bGUiLCJDbGlja0FjdGlvbiIsInQiLCJwdXNoVG9TaW5nbGVEZXZpY2UiLCJodWF3ZWkiLCJhcHBQa2dOYW1lIiwicGF5bG9hZCIsIkh1YXdlaVB1c2giLCJjb25maWciLCJhcHBJZCIsImFwcFNlY3JldCIsInNlbmRNYW55IiwibWkiLCJNZXNzYWdlIiwiZGVzY3JpcHRpb24iLCJOb3RpZmljYXRpb24iLCJwcm9kdWN0aW9uIiwicmVnaWQiLCJyZWY0IiwicmVmNSIsInJlZjYiLCJjcm9uIiwicHVzaF9pbnRlcnZhbCIsImtlZXBOb3RpZmljYXRpb25zIiwic2VuZEludGVydmFsIiwic2VuZEJhdGNoU2l6ZSIsImFwbiIsImtleURhdGEiLCJjZXJ0RGF0YSIsImdjbSIsInByb2plY3ROdW1iZXIiLCJhcGlLZXkiLCJDb25maWd1cmUiLCJzZW5kR0NNIiwib2xkX3NlbmRHQ00iLCJzZW5kQWxpeXVuIiwidGVzdCIsIk9iamVjdCIsInJlc3VsdCIsImNhbm9uaWNhbF9pZHMiLCJvbGRUb2tlbiIsIm5ld1Rva2VuIiwicmVzdWx0cyIsInJlZ2lzdHJhdGlvbl9pZCIsIl9yZXBsYWNlVG9rZW4iLCJmYWlsdXJlIiwiX3JlbW92ZVRva2VuIiwiZ2NtVG9rZW5zIiwib2xkX3NlbmRBUE4iLCJzZW5kQVBOIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQkgsZ0JBQWdCLENBQUM7QUFDaEIsZ0JBQWMsU0FERTtBQUVoQkksUUFBTSxFQUFFLFVBRlE7QUFHaEJDLFNBQU8sRUFBRSxTQUhPO0FBSWhCLFNBQU8sU0FKUztBQUtoQixTQUFPLFVBTFM7QUFNaEIsYUFBVyxVQU5LO0FB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QTBCLENBQXpGLElBQStGd0gsS0FBS3hILE9BQUwsQ0FBYSxLQUFiLElBQXNCLENDOEJySDtBRC9CTyxRQUFaOztBQUdBLFVBQUc0TyxLQUFLeUIsS0FBUjtBQUNDclAsZ0JBQVFzUCxHQUFSLENBQVksZUFBWixFQUE4QndFLFVBQVUvVCxRQUFWLEVBQTlCO0FDK0JHOztBRDdCSjZOLFdBQUtzRixVQUFMLENBQWdCdEUsWUFBaEIsRUFBOEJKLFlBQTlCO0FDK0JHLGFEN0JIWixLQUFLcUYsV0FBTCxDQUFpQmEsU0FBakIsRUFBNEJ0RixZQUE1QixDQzZCRztBRDFEVyxLQUFmOztBQStCQVosU0FBS21HLFdBQUwsR0FBbUJuRyxLQUFLb0csT0FBeEI7QUM4QkUsV0Q3QkZwRyxLQUFLb0csT0FBTCxHQUFlLFVBQUN2RSxTQUFELEVBQVlqQixZQUFaO0FBQ2QsVUFBQVEsSUFBQTs7QUFBQSxVQUFHUixhQUFhUixLQUFiLElBQXVCUSxhQUFhVCxJQUF2QztBQUNDaUIsZUFBT2hTLEVBQUV5TCxLQUFGLENBQVErRixZQUFSLENBQVA7QUFDQVEsYUFBS2pCLElBQUwsR0FBWWlCLEtBQUtoQixLQUFMLEdBQWEsR0FBYixHQUFtQmdCLEtBQUtqQixJQUFwQztBQUNBaUIsYUFBS2hCLEtBQUwsR0FBYSxFQUFiO0FDK0JJLGVEOUJKSixLQUFLbUcsV0FBTCxDQUFpQnRFLFNBQWpCLEVBQTRCVCxJQUE1QixDQzhCSTtBRGxDTDtBQ29DSyxlRDlCSnBCLEtBQUttRyxXQUFMLENBQWlCdEUsU0FBakIsRUFBNEJqQixZQUE1QixDQzhCSTtBQUNEO0FEdENVLEtDNkJiO0FBV0Q7QUR4SkgsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19hcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdCdhbGl5dW4tc2RrJzogJz49MS45LjInLFxyXG5cdGJ1c2JveTogXCI+PTAuMi4xM1wiLFxyXG5cdGNvb2tpZXM6IFwiPj0wLjYuMlwiLFxyXG5cdCdjc3YnOiBcIj49NS4xLjJcIixcclxuXHQndXJsJzogJz49MC4xMC4wJyxcclxuXHQncmVxdWVzdCc6ICc+PTIuODEuMCcsXHJcblx0J3hpbmdlJzogJz49MS4xLjMnLFxyXG5cdCdodWF3ZWktcHVzaCc6ICc+PTAuMC42LTAnLFxyXG5cdCd4aWFvbWktcHVzaCc6ICc+PTAuNC41J1xyXG59LCAnc3RlZWRvczphcGknKTsiLCJCdXNib3kgPSByZXF1aXJlKCdidXNib3knKTtcclxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcclxuXHJcbkpzb25Sb3V0ZXMucGFyc2VGaWxlcyA9IChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHRmaWxlcyA9IFtdOyAjIFN0b3JlIGZpbGVzIGluIGFuIGFycmF5IGFuZCB0aGVuIHBhc3MgdGhlbSB0byByZXF1ZXN0LlxyXG5cclxuXHRpZiAocmVxLm1ldGhvZCA9PSBcIlBPU1RcIilcclxuXHRcdGJ1c2JveSA9IG5ldyBCdXNib3koeyBoZWFkZXJzOiByZXEuaGVhZGVycyB9KTtcclxuXHRcdGJ1c2JveS5vbiBcImZpbGVcIiwgIChmaWVsZG5hbWUsIGZpbGUsIGZpbGVuYW1lLCBlbmNvZGluZywgbWltZXR5cGUpIC0+XHJcblx0XHRcdGltYWdlID0ge307ICMgY3JhdGUgYW4gaW1hZ2Ugb2JqZWN0XHJcblx0XHRcdGltYWdlLm1pbWVUeXBlID0gbWltZXR5cGU7XHJcblx0XHRcdGltYWdlLmVuY29kaW5nID0gZW5jb2Rpbmc7XHJcblx0XHRcdGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XHJcblxyXG5cdFx0XHQjIGJ1ZmZlciB0aGUgcmVhZCBjaHVua3NcclxuXHRcdFx0YnVmZmVycyA9IFtdO1xyXG5cclxuXHRcdFx0ZmlsZS5vbiAnZGF0YScsIChkYXRhKSAtPlxyXG5cdFx0XHRcdGJ1ZmZlcnMucHVzaChkYXRhKTtcclxuXHJcblx0XHRcdGZpbGUub24gJ2VuZCcsICgpIC0+XHJcblx0XHRcdFx0IyBjb25jYXQgdGhlIGNodW5rc1xyXG5cdFx0XHRcdGltYWdlLmRhdGEgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xyXG5cdFx0XHRcdCMgcHVzaCB0aGUgaW1hZ2Ugb2JqZWN0IHRvIHRoZSBmaWxlIGFycmF5XHJcblx0XHRcdFx0ZmlsZXMucHVzaChpbWFnZSk7XHJcblxyXG5cclxuXHRcdGJ1c2JveS5vbiBcImZpZWxkXCIsIChmaWVsZG5hbWUsIHZhbHVlKSAtPlxyXG5cdFx0XHRyZXEuYm9keVtmaWVsZG5hbWVdID0gdmFsdWU7XHJcblxyXG5cdFx0YnVzYm95Lm9uIFwiZmluaXNoXCIsICAoKSAtPlxyXG5cdFx0XHQjIFBhc3MgdGhlIGZpbGUgYXJyYXkgdG9nZXRoZXIgd2l0aCB0aGUgcmVxdWVzdFxyXG5cdFx0XHRyZXEuZmlsZXMgPSBmaWxlcztcclxuXHJcblx0XHRcdEZpYmVyICgpLT5cclxuXHRcdFx0XHRuZXh0KCk7XHJcblx0XHRcdC5ydW4oKTtcclxuXHJcblx0XHQjIFBhc3MgcmVxdWVzdCB0byBidXNib3lcclxuXHRcdHJlcS5waXBlKGJ1c2JveSk7XHJcblxyXG5cdGVsc2VcclxuXHRcdG5leHQoKTtcclxuXHJcblxyXG4jSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZShKc29uUm91dGVzLnBhcnNlRmlsZXMpOyIsInZhciBCdXNib3ksIEZpYmVyO1xuXG5CdXNib3kgPSByZXF1aXJlKCdidXNib3knKTtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuSnNvblJvdXRlcy5wYXJzZUZpbGVzID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJ1c2JveSwgZmlsZXM7XG4gIGZpbGVzID0gW107XG4gIGlmIChyZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgIGJ1c2JveSA9IG5ldyBCdXNib3koe1xuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnNcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWxlXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkge1xuICAgICAgdmFyIGJ1ZmZlcnMsIGltYWdlO1xuICAgICAgaW1hZ2UgPSB7fTtcbiAgICAgIGltYWdlLm1pbWVUeXBlID0gbWltZXR5cGU7XG4gICAgICBpbWFnZS5lbmNvZGluZyA9IGVuY29kaW5nO1xuICAgICAgaW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbiAgICAgIGJ1ZmZlcnMgPSBbXTtcbiAgICAgIGZpbGUub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHJldHVybiBidWZmZXJzLnB1c2goZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmaWxlLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaW1hZ2UuZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XG4gICAgICAgIHJldHVybiBmaWxlcy5wdXNoKGltYWdlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpZWxkXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXEuYm9keVtmaWVsZG5hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmluaXNoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmVxLmZpbGVzID0gZmlsZXM7XG4gICAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9KS5ydW4oKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVxLnBpcGUoYnVzYm95KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG59O1xuIiwiQEF1dGggb3I9IHt9XHJcblxyXG4jIyNcclxuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXHJcbiMjI1xyXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUgKHVzZXIpIC0+XHJcbiAgY2hlY2sgdXNlcixcclxuICAgIGlkOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuXHJcbiAgaWYgXy5rZXlzKHVzZXIpLmxlbmd0aCBpcyBub3QgMVxyXG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yICdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJ1xyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG5cclxuXHJcbiMjI1xyXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcclxuIyMjXHJcbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gKHVzZXIpIC0+XHJcbiAgaWYgdXNlci5pZFxyXG4gICAgcmV0dXJuIHsnX2lkJzogdXNlci5pZH1cclxuICBlbHNlIGlmIHVzZXIudXNlcm5hbWVcclxuICAgIHJldHVybiB7J3VzZXJuYW1lJzogdXNlci51c2VybmFtZX1cclxuICBlbHNlIGlmIHVzZXIuZW1haWxcclxuICAgIHJldHVybiB7J2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbH1cclxuXHJcbiAgIyBXZSBzaG91bGRuJ3QgYmUgaGVyZSBpZiB0aGUgdXNlciBvYmplY3Qgd2FzIHByb3Blcmx5IHZhbGlkYXRlZFxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcidcclxuXHJcblxyXG4jIyNcclxuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcclxuIyMjXHJcbkBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gKHVzZXIsIHBhc3N3b3JkKSAtPlxyXG4gIGlmIG5vdCB1c2VyIG9yIG5vdCBwYXNzd29yZFxyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG4gICMgVmFsaWRhdGUgdGhlIGxvZ2luIGlucHV0IHR5cGVzXHJcbiAgY2hlY2sgdXNlciwgdXNlclZhbGlkYXRvclxyXG4gIGNoZWNrIHBhc3N3b3JkLCBTdHJpbmdcclxuXHJcbiAgIyBSZXRyaWV2ZSB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxyXG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcilcclxuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvcilcclxuXHJcbiAgaWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlclxyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcbiAgaWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcz8ucGFzc3dvcmRcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuICAjIEF1dGhlbnRpY2F0ZSB0aGUgdXNlcidzIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCBhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkXHJcbiAgaWYgcGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3JcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuICAjIEFkZCBhIG5ldyBhdXRoIHRva2VuIHRvIHRoZSB1c2VyJ3MgYWNjb3VudFxyXG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcclxuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxyXG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuXHJcblxyXG4gIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZH0pLmZldGNoKClcclxuICBzcGFjZXMgPSBbXVxyXG4gIF8uZWFjaCBzcGFjZV91c2VycywgKHN1KS0+XHJcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKVxyXG4gICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXHJcbiAgICBpZiBzcGFjZT8uaXNfcGFpZCBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcik+PTBcclxuICAgICAgc3BhY2VzLnB1c2hcclxuICAgICAgICBfaWQ6IHNwYWNlLl9pZFxyXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcclxuICByZXR1cm4ge2F1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLCB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGFkbWluU3BhY2VzOiBzcGFjZXN9XHJcbiIsInZhciBnZXRVc2VyUXVlcnlTZWxlY3RvciwgdXNlclZhbGlkYXRvcjtcblxudGhpcy5BdXRoIHx8ICh0aGlzLkF1dGggPSB7fSk7XG5cblxuLypcbiAgQSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuICovXG5cbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbih1c2VyKSB7XG4gIGNoZWNrKHVzZXIsIHtcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKVxuICB9KTtcbiAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggPT09ICExKSB7XG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKCdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuXG4vKlxuICBSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4gKi9cblxuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSBmdW5jdGlvbih1c2VyKSB7XG4gIGlmICh1c2VyLmlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdfaWQnOiB1c2VyLmlkXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWVcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIuZW1haWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJyk7XG59O1xuXG5cbi8qXG4gIExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuICovXG5cbnRoaXMuQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3N3b3JkKSB7XG4gIHZhciBhdXRoVG9rZW4sIGF1dGhlbnRpY2F0aW5nVXNlciwgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IsIGhhc2hlZFRva2VuLCBwYXNzd29yZFZlcmlmaWNhdGlvbiwgcmVmLCBzcGFjZV91c2Vycywgc3BhY2VzO1xuICBpZiAoIXVzZXIgfHwgIXBhc3N3b3JkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBjaGVjayh1c2VyLCB1c2VyVmFsaWRhdG9yKTtcbiAgY2hlY2socGFzc3dvcmQsIFN0cmluZyk7XG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcik7XG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKTtcbiAgaWYgKCFhdXRoZW50aWNhdGluZ1VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGlmICghKChyZWYgPSBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXMpICE9IG51bGwgPyByZWYucGFzc3dvcmQgOiB2b2lkIDApKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmQpO1xuICBpZiAocGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4oYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW4pO1xuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWRcbiAgfSkuZmV0Y2goKTtcbiAgc3BhY2VzID0gW107XG4gIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24oc3UpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSk7XG4gICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcikgPj0gMCkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHtcbiAgICAgICAgX2lkOiBzcGFjZS5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgYXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sXG4gICAgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLFxuICAgIGFkbWluU3BhY2VzOiBzcGFjZXNcbiAgfTtcbn07XG4iLCIvLyBXZSBuZWVkIGEgZnVuY3Rpb24gdGhhdCB0cmVhdHMgdGhyb3duIGVycm9ycyBleGFjdGx5IGxpa2UgSXJvbiBSb3V0ZXIgd291bGQuXHJcbi8vIFRoaXMgZmlsZSBpcyB3cml0dGVuIGluIEphdmFTY3JpcHQgdG8gZW5hYmxlIGNvcHktcGFzdGluZyBJcm9uIFJvdXRlciBjb2RlLlxyXG5cclxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMM1xyXG52YXIgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcclxuXHJcbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDQ3XHJcbmlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlID0gZnVuY3Rpb24gKGVyciwgcmVxLCByZXMpIHtcclxuICBpZiAocmVzLnN0YXR1c0NvZGUgPCA0MDApXHJcbiAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcclxuXHJcbiAgaWYgKGVyci5zdGF0dXMpXHJcbiAgICByZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XHJcblxyXG4gIGlmIChlbnYgPT09ICdkZXZlbG9wbWVudCcpXHJcbiAgICBtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xyXG4gIGVsc2VcclxuICAgIC8vWFhYIGdldCB0aGlzIGZyb20gc3RhbmRhcmQgZGljdCBvZiBlcnJvciBtZXNzYWdlcz9cclxuICAgIG1zZyA9ICdTZXJ2ZXIgZXJyb3IuJztcclxuXHJcbiAgY29uc29sZS5lcnJvcihlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpO1xyXG5cclxuICBpZiAocmVzLmhlYWRlcnNTZW50KVxyXG4gICAgcmV0dXJuIHJlcS5zb2NrZXQuZGVzdHJveSgpO1xyXG5cclxuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XHJcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBCdWZmZXIuYnl0ZUxlbmd0aChtc2cpKTtcclxuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0hFQUQnKVxyXG4gICAgcmV0dXJuIHJlcy5lbmQoKTtcclxuICByZXMuZW5kKG1zZyk7XHJcbiAgcmV0dXJuO1xyXG59XHJcbiIsImNsYXNzIHNoYXJlLlJvdXRlXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQGFwaSwgQHBhdGgsIEBvcHRpb25zLCBAZW5kcG9pbnRzKSAtPlxyXG4gICAgIyBDaGVjayBpZiBvcHRpb25zIHdlcmUgcHJvdmlkZWRcclxuICAgIGlmIG5vdCBAZW5kcG9pbnRzXHJcbiAgICAgIEBlbmRwb2ludHMgPSBAb3B0aW9uc1xyXG4gICAgICBAb3B0aW9ucyA9IHt9XHJcblxyXG5cclxuICBhZGRUb0FwaTogZG8gLT5cclxuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddXHJcblxyXG4gICAgcmV0dXJuIC0+XHJcbiAgICAgIHNlbGYgPSB0aGlzXHJcblxyXG4gICAgICAjIFRocm93IGFuIGVycm9yIGlmIGEgcm91dGUgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCBhdCB0aGlzIHBhdGhcclxuICAgICAgIyBUT0RPOiBDaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoIHBhdGhzIHRoYXQgZm9sbG93IHNhbWUgcGF0dGVybiB3aXRoIGRpZmZlcmVudCBwYXJhbWV0ZXIgbmFtZXNcclxuICAgICAgaWYgXy5jb250YWlucyBAYXBpLl9jb25maWcucGF0aHMsIEBwYXRoXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6ICN7QHBhdGh9XCJcclxuXHJcbiAgICAgICMgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgT1BUSU9OUyBlbmRwb2ludCB3aXRoIG91ciBvd25cclxuICAgICAgQGVuZHBvaW50cyA9IF8uZXh0ZW5kIG9wdGlvbnM6IEBhcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50LCBAZW5kcG9pbnRzXHJcblxyXG4gICAgICAjIENvbmZpZ3VyZSBlYWNoIGVuZHBvaW50IG9uIHRoaXMgcm91dGVcclxuICAgICAgQF9yZXNvbHZlRW5kcG9pbnRzKClcclxuICAgICAgQF9jb25maWd1cmVFbmRwb2ludHMoKVxyXG5cclxuICAgICAgIyBBZGQgdG8gb3VyIGxpc3Qgb2YgZXhpc3RpbmcgcGF0aHNcclxuICAgICAgQGFwaS5fY29uZmlnLnBhdGhzLnB1c2ggQHBhdGhcclxuXHJcbiAgICAgIGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcclxuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcclxuXHJcbiAgICAgICMgU2V0dXAgZW5kcG9pbnRzIG9uIHJvdXRlXHJcbiAgICAgIGZ1bGxQYXRoID0gQGFwaS5fY29uZmlnLmFwaVBhdGggKyBAcGF0aFxyXG4gICAgICBfLmVhY2ggYWxsb3dlZE1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdXHJcbiAgICAgICAgSnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxyXG4gICAgICAgICAgIyBBZGQgZnVuY3Rpb24gdG8gZW5kcG9pbnQgY29udGV4dCBmb3IgaW5kaWNhdGluZyBhIHJlc3BvbnNlIGhhcyBiZWVuIGluaXRpYXRlZCBtYW51YWxseVxyXG4gICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZVxyXG4gICAgICAgICAgZG9uZUZ1bmMgPSAtPlxyXG4gICAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IHRydWVcclxuXHJcbiAgICAgICAgICBlbmRwb2ludENvbnRleHQgPVxyXG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXNcclxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeVxyXG4gICAgICAgICAgICBib2R5UGFyYW1zOiByZXEuYm9keVxyXG4gICAgICAgICAgICByZXF1ZXN0OiByZXFcclxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlc1xyXG4gICAgICAgICAgICBkb25lOiBkb25lRnVuY1xyXG4gICAgICAgICAgIyBBZGQgZW5kcG9pbnQgY29uZmlnIG9wdGlvbnMgdG8gY29udGV4dFxyXG4gICAgICAgICAgXy5leHRlbmQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG5cclxuICAgICAgICAgICMgUnVuIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRcclxuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IG51bGxcclxuICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG4gICAgICAgICAgY2F0Y2ggZXJyb3JcclxuICAgICAgICAgICAgIyBEbyBleGFjdGx5IHdoYXQgSXJvbiBSb3V0ZXIgd291bGQgaGF2ZSBkb25lLCB0byBhdm9pZCBjaGFuZ2luZyB0aGUgQVBJXHJcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgIGlmIHJlc3BvbnNlSW5pdGlhdGVkXHJcbiAgICAgICAgICAgICMgRW5zdXJlIHRoZSByZXNwb25zZSBpcyBwcm9wZXJseSBjb21wbGV0ZWRcclxuICAgICAgICAgICAgcmVzLmVuZCgpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBpZiByZXMuaGVhZGVyc1NlbnRcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXHJcbiAgICAgICAgICAgIGVsc2UgaWYgcmVzcG9uc2VEYXRhIGlzIG51bGwgb3IgcmVzcG9uc2VEYXRhIGlzIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcclxuXHJcbiAgICAgICAgICAjIEdlbmVyYXRlIGFuZCByZXR1cm4gdGhlIGh0dHAgcmVzcG9uc2UsIGhhbmRsaW5nIHRoZSBkaWZmZXJlbnQgZW5kcG9pbnQgcmVzcG9uc2UgdHlwZXNcclxuICAgICAgICAgIGlmIHJlc3BvbnNlRGF0YS5ib2R5IGFuZCAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgb3IgcmVzcG9uc2VEYXRhLmhlYWRlcnMpXHJcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGFcclxuXHJcbiAgICAgIF8uZWFjaCByZWplY3RlZE1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgSnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxyXG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xyXG4gICAgICAgICAgaGVhZGVycyA9ICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxyXG4gICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzXHJcblxyXG5cclxuICAjIyNcclxuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxyXG4gICAgZnVuY3Rpb25cclxuXHJcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cclxuICAjIyNcclxuICBfcmVzb2x2ZUVuZHBvaW50czogLT5cclxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSAtPlxyXG4gICAgICBpZiBfLmlzRnVuY3Rpb24oZW5kcG9pbnQpXHJcbiAgICAgICAgZW5kcG9pbnRzW21ldGhvZF0gPSB7YWN0aW9uOiBlbmRwb2ludH1cclxuICAgIHJldHVyblxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XHJcbiAgICBiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcclxuXHJcbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxyXG4gICAgZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcclxuICAgIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxyXG5cclxuICAgIEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxyXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcclxuICAgIHJlc3BlY3RpdmVseS5cclxuXHJcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cclxuICAgIEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcclxuICAjIyNcclxuICBfY29uZmlndXJlRW5kcG9pbnRzOiAtPlxyXG4gICAgXy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kKSAtPlxyXG4gICAgICBpZiBtZXRob2QgaXNudCAnb3B0aW9ucydcclxuICAgICAgICAjIENvbmZpZ3VyZSBhY2NlcHRhYmxlIHJvbGVzXHJcbiAgICAgICAgaWYgbm90IEBvcHRpb25zPy5yb2xlUmVxdWlyZWRcclxuICAgICAgICAgIEBvcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdXHJcbiAgICAgICAgaWYgbm90IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW11cclxuICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBfLnVuaW9uIGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgQG9wdGlvbnMucm9sZVJlcXVpcmVkXHJcbiAgICAgICAgIyBNYWtlIGl0IGVhc2llciB0byBjaGVjayBpZiBubyByb2xlcyBhcmUgcmVxdWlyZWRcclxuICAgICAgICBpZiBfLmlzRW1wdHkgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZVxyXG5cclxuICAgICAgICAjIENvbmZpZ3VyZSBhdXRoIHJlcXVpcmVtZW50XHJcbiAgICAgICAgaWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkIGlzIHVuZGVmaW5lZFxyXG4gICAgICAgICAgaWYgQG9wdGlvbnM/LmF1dGhSZXF1aXJlZCBvciBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZVxyXG5cclxuICAgICAgICBpZiBAb3B0aW9ucz8uc3BhY2VSZXF1aXJlZFxyXG4gICAgICAgICAgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IEBvcHRpb25zLnNwYWNlUmVxdWlyZWRcclxuICAgICAgICByZXR1cm5cclxuICAgICwgdGhpc1xyXG4gICAgcmV0dXJuXHJcblxyXG5cclxuICAjIyNcclxuICAgIEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcclxuXHJcbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcclxuICAjIyNcclxuICBfY2FsbEVuZHBvaW50OiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuICAgICMgQ2FsbCB0aGUgZW5kcG9pbnQgaWYgYXV0aGVudGljYXRpb24gZG9lc24ndCBmYWlsXHJcbiAgICBpZiBAX2F1dGhBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcbiAgICAgIGlmIEBfcm9sZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuICAgICAgICBpZiBAX3NwYWNlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG4gICAgICAgICAgI2VuZHBvaW50LmFjdGlvbi5jYWxsIGVuZHBvaW50Q29udGV4dFxyXG4gICAgICAgICAgaW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvblxyXG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcclxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcclxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcclxuICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlIGludm9jYXRpb24sIC0+XHJcbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHN0YXR1c0NvZGU6IDQwM1xyXG4gICAgICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBzdGF0dXNDb2RlOiA0MDNcclxuICAgICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxyXG4gICAgZWxzZVxyXG4gICAgICBzdGF0dXNDb2RlOiA0MDFcclxuICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XHJcblxyXG5cclxuICAjIyNcclxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcclxuXHJcbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXHJcbiAgICBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcclxuICAgIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxyXG5cclxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcclxuICAjIyNcclxuICBfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuICAgIGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZFxyXG4gICAgICBAX2F1dGhlbnRpY2F0ZSBlbmRwb2ludENvbnRleHRcclxuICAgIGVsc2UgdHJ1ZVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxyXG5cclxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cclxuXHJcbiAgICBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuICAjIyNcclxuICBfYXV0aGVudGljYXRlOiAoZW5kcG9pbnRDb250ZXh0KSAtPlxyXG4gICAgIyBHZXQgYXV0aCBpbmZvXHJcbiAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcclxuXHJcbiAgICAjIEdldCB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxyXG4gICAgaWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcclxuICAgICAgdXNlclNlbGVjdG9yID0ge31cclxuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkXHJcbiAgICAgIHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXHJcbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lIHVzZXJTZWxlY3RvclxyXG5cclxuICAgICMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuICAgIGlmIGF1dGg/LnVzZXJcclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXJcclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcclxuICAgICAgdHJ1ZVxyXG4gICAgZWxzZSBmYWxzZVxyXG5cclxuICAjIyNcclxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXHJcblxyXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxyXG5cclxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXHJcbiAgICAgICAgICAgICBlbmRwb2ludFxyXG4gICMjI1xyXG4gIF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuICAgIGlmIGVuZHBvaW50LnNwYWNlUmVxdWlyZWRcclxuICAgICAgYXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXHJcbiAgICAgIGlmIGF1dGg/LnNwYWNlSWRcclxuICAgICAgICBzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGgudXNlcklkLCBzcGFjZTphdXRoLnNwYWNlSWR9KS5jb3VudCgpXHJcbiAgICAgICAgaWYgc3BhY2VfdXNlcnNfY291bnRcclxuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxyXG4gICAgICAgICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXHJcbiAgICAgICAgICBpZiBzcGFjZT8uaXNfcGFpZCBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpPj0wXHJcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gICMjI1xyXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcclxuXHJcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXHJcblxyXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcclxuICAgICAgICAgICAgIGVuZHBvaW50XHJcbiAgIyMjXHJcbiAgX3JvbGVBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcbiAgICBpZiBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuICAgICAgaWYgXy5pc0VtcHR5IF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB0cnVlXHJcblxyXG5cclxuICAjIyNcclxuICAgIFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XHJcbiAgIyMjXHJcbiAgX3Jlc3BvbmQ6IChyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZT0yMDAsIGhlYWRlcnM9e30pIC0+XHJcbiAgICAjIE92ZXJyaWRlIGFueSBkZWZhdWx0IGhlYWRlcnMgdGhhdCBoYXZlIGJlZW4gcHJvdmlkZWQgKGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gYmUgY2FzZSBpbnNlbnNpdGl2ZSlcclxuICAgICMgVE9ETzogQ29uc2lkZXIgb25seSBsb3dlcmNhc2luZyB0aGUgaGVhZGVyIGtleXMgd2UgbmVlZCBub3JtYWxpemVkLCBsaWtlIENvbnRlbnQtVHlwZVxyXG4gICAgZGVmYXVsdEhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgQGFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzXHJcbiAgICBoZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIGhlYWRlcnNcclxuICAgIGhlYWRlcnMgPSBfLmV4dGVuZCBkZWZhdWx0SGVhZGVycywgaGVhZGVyc1xyXG5cclxuICAgICMgUHJlcGFyZSBKU09OIGJvZHkgZm9yIHJlc3BvbnNlIHdoZW4gQ29udGVudC1UeXBlIGluZGljYXRlcyBKU09OIHR5cGVcclxuICAgIGlmIGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSBpc250IG51bGxcclxuICAgICAgaWYgQGFwaS5fY29uZmlnLnByZXR0eUpzb25cclxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keSwgdW5kZWZpbmVkLCAyXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keVxyXG5cclxuICAgICMgU2VuZCByZXNwb25zZVxyXG4gICAgc2VuZFJlc3BvbnNlID0gLT5cclxuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkIHN0YXR1c0NvZGUsIGhlYWRlcnNcclxuICAgICAgcmVzcG9uc2Uud3JpdGUgYm9keVxyXG4gICAgICByZXNwb25zZS5lbmQoKVxyXG4gICAgaWYgc3RhdHVzQ29kZSBpbiBbNDAxLCA0MDNdXHJcbiAgICAgICMgSGFja2VycyBjYW4gbWVhc3VyZSB0aGUgcmVzcG9uc2UgdGltZSB0byBkZXRlcm1pbmUgdGhpbmdzIGxpa2Ugd2hldGhlciB0aGUgNDAxIHJlc3BvbnNlIHdhcyBcclxuICAgICAgIyBjYXVzZWQgYnkgYmFkIHVzZXIgaWQgdnMgYmFkIHBhc3N3b3JkLlxyXG4gICAgICAjIEluIGRvaW5nIHNvLCB0aGV5IGNhbiBmaXJzdCBzY2FuIGZvciB2YWxpZCB1c2VyIGlkcyByZWdhcmRsZXNzIG9mIHZhbGlkIHBhc3N3b3Jkcy5cclxuICAgICAgIyBEZWxheSBieSBhIHJhbmRvbSBhbW91bnQgdG8gcmVkdWNlIHRoZSBhYmlsaXR5IGZvciBhIGhhY2tlciB0byBkZXRlcm1pbmUgdGhlIHJlc3BvbnNlIHRpbWUuXHJcbiAgICAgICMgU2VlIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvQmxvY2tpbmdfQnJ1dGVfRm9yY2VfQXR0YWNrcyNGaW5kaW5nX090aGVyX0NvdW50ZXJtZWFzdXJlc1xyXG4gICAgICAjIFNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9UaW1pbmdfYXR0YWNrXHJcbiAgICAgIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzID0gNTAwXHJcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKClcclxuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd29cclxuICAgICAgTWV0ZW9yLnNldFRpbWVvdXQgc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzXHJcbiAgICBlbHNlXHJcbiAgICAgIHNlbmRSZXNwb25zZSgpXHJcblxyXG4gICMjI1xyXG4gICAgUmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxyXG4gICMjI1xyXG4gIF9sb3dlckNhc2VLZXlzOiAob2JqZWN0KSAtPlxyXG4gICAgXy5jaGFpbiBvYmplY3RcclxuICAgIC5wYWlycygpXHJcbiAgICAubWFwIChhdHRyKSAtPlxyXG4gICAgICBbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXVxyXG4gICAgLm9iamVjdCgpXHJcbiAgICAudmFsdWUoKVxyXG4iLCJzaGFyZS5Sb3V0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUm91dGUoYXBpLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMxKSB7XG4gICAgdGhpcy5hcGkgPSBhcGk7XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuZW5kcG9pbnRzID0gZW5kcG9pbnRzMTtcbiAgICBpZiAoIXRoaXMuZW5kcG9pbnRzKSB7XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IHRoaXMub3B0aW9ucztcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIFJvdXRlLnByb3RvdHlwZS5hZGRUb0FwaSA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYXZhaWxhYmxlTWV0aG9kcztcbiAgICBhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWxsb3dlZE1ldGhvZHMsIGZ1bGxQYXRoLCByZWplY3RlZE1ldGhvZHMsIHNlbGY7XG4gICAgICBzZWxmID0gdGhpcztcbiAgICAgIGlmIChfLmNvbnRhaW5zKHRoaXMuYXBpLl9jb25maWcucGF0aHMsIHRoaXMucGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6IFwiICsgdGhpcy5wYXRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gXy5leHRlbmQoe1xuICAgICAgICBvcHRpb25zOiB0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcbiAgICAgIH0sIHRoaXMuZW5kcG9pbnRzKTtcbiAgICAgIHRoaXMuX3Jlc29sdmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuX2NvbmZpZ3VyZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5hcGkuX2NvbmZpZy5wYXRocy5wdXNoKHRoaXMucGF0aCk7XG4gICAgICBhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyKGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICByZWplY3RlZE1ldGhvZHMgPSBfLnJlamVjdChhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgZnVsbFBhdGggPSB0aGlzLmFwaS5fY29uZmlnLmFwaVBhdGggKyB0aGlzLnBhdGg7XG4gICAgICBfLmVhY2goYWxsb3dlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgZW5kcG9pbnQ7XG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXTtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGRvbmVGdW5jLCBlbmRwb2ludENvbnRleHQsIGVycm9yLCByZXNwb25zZURhdGEsIHJlc3BvbnNlSW5pdGlhdGVkO1xuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2U7XG4gICAgICAgICAgZG9uZUZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZUluaXRpYXRlZCA9IHRydWU7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBlbmRwb2ludENvbnRleHQgPSB7XG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXMsXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogcmVxLnF1ZXJ5LFxuICAgICAgICAgICAgYm9keVBhcmFtczogcmVxLmJvZHksXG4gICAgICAgICAgICByZXF1ZXN0OiByZXEsXG4gICAgICAgICAgICByZXNwb25zZTogcmVzLFxuICAgICAgICAgICAgZG9uZTogZG9uZUZ1bmNcbiAgICAgICAgICB9O1xuICAgICAgICAgIF8uZXh0ZW5kKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IG51bGw7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlSW5pdGlhdGVkKSB7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyZXMuaGVhZGVyc1NlbnQpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZURhdGEgPT09IG51bGwgfHwgcmVzcG9uc2VEYXRhID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VEYXRhLmJvZHkgJiYgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIHx8IHJlc3BvbnNlRGF0YS5oZWFkZXJzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2gocmVqZWN0ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGhlYWRlcnMsIHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgIH07XG4gICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVycyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSkoKTtcblxuXG4gIC8qXG4gICAgQ29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gICAgZnVuY3Rpb25cbiAgXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzb2x2ZUVuZHBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIF8uZWFjaCh0aGlzLmVuZHBvaW50cywgZnVuY3Rpb24oZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKGVuZHBvaW50KSkge1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRzW21ldGhvZF0gPSB7XG4gICAgICAgICAgYWN0aW9uOiBlbmRwb2ludFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG5cbiAgLypcbiAgICBDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gICAgYmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG4gIFxuICAgIEF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3IgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuXG4gICAgZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcbiAgICBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gICAgQWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgICByZXNwZWN0aXZlbHkuXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgIEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jb25maWd1cmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAobWV0aG9kICE9PSAnb3B0aW9ucycpIHtcbiAgICAgICAgaWYgKCEoKHJlZiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZi5yb2xlUmVxdWlyZWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQpO1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50LnJvbGVSZXF1aXJlZCkpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAoKChyZWYxID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMS5hdXRoUmVxdWlyZWQgOiB2b2lkIDApIHx8IGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgocmVmMiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjIuc3BhY2VSZXF1aXJlZCA6IHZvaWQgMCkge1xuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSB0aGlzLm9wdGlvbnMuc3BhY2VSZXF1aXJlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG4gIFxuICAgIEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2NhbGxFbmRwb2ludCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgaW52b2NhdGlvbjtcbiAgICBpZiAodGhpcy5fYXV0aEFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICBpZiAodGhpcy5fcm9sZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcGFjZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgICAgaW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvbih7XG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUoaW52b2NhdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzQ29kZTogNDAxLFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG4gIFxuICAgIE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcbiAgICBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcbiAgICBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gICAgQHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlKGVuZHBvaW50Q29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcbiAgXG4gICAgSWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuICBcbiAgICBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQpIHtcbiAgICB2YXIgYXV0aCwgdXNlclNlbGVjdG9yO1xuICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgaWYgKChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXJJZCA6IHZvaWQgMCkgJiYgKGF1dGggIT0gbnVsbCA/IGF1dGgudG9rZW4gOiB2b2lkIDApICYmICEoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSkge1xuICAgICAgdXNlclNlbGVjdG9yID0ge307XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWQ7XG4gICAgICB1c2VyU2VsZWN0b3JbdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW47XG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VyU2VsZWN0b3IpO1xuICAgIH1cbiAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSB7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlcjtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3NwYWNlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGF1dGgsIHNwYWNlLCBzcGFjZV91c2Vyc19jb3VudDtcbiAgICBpZiAoZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCkge1xuICAgICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnNwYWNlSWQgOiB2b2lkIDApIHtcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICB1c2VyOiBhdXRoLnVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogYXV0aC5zcGFjZUlkXG4gICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgIGlmIChzcGFjZV91c2Vyc19jb3VudCkge1xuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKTtcbiAgICAgICAgICBpZiAoKHNwYWNlICE9IG51bGwgPyBzcGFjZS5pc19wYWlkIDogdm9pZCAwKSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCkgPj0gMCkge1xuICAgICAgICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWQ7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3JvbGVBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICBpZiAoXy5pc0VtcHR5KF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgICBSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc3BvbmQgPSBmdW5jdGlvbihyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZSwgaGVhZGVycykge1xuICAgIHZhciBkZWZhdWx0SGVhZGVycywgZGVsYXlJbk1pbGxpc2Vjb25kcywgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMsIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvLCBzZW5kUmVzcG9uc2U7XG4gICAgaWYgKHN0YXR1c0NvZGUgPT0gbnVsbCkge1xuICAgICAgc3RhdHVzQ29kZSA9IDIwMDtcbiAgICB9XG4gICAgaWYgKGhlYWRlcnMgPT0gbnVsbCkge1xuICAgICAgaGVhZGVycyA9IHt9O1xuICAgIH1cbiAgICBkZWZhdWx0SGVhZGVycyA9IHRoaXMuX2xvd2VyQ2FzZUtleXModGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0SGVhZGVycyk7XG4gICAgaGVhZGVycyA9IHRoaXMuX2xvd2VyQ2FzZUtleXMoaGVhZGVycyk7XG4gICAgaGVhZGVycyA9IF8uZXh0ZW5kKGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzKTtcbiAgICBpZiAoaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hcGkuX2NvbmZpZy5wcmV0dHlKc29uKSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5LCB2b2lkIDAsIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICAgICAgfVxuICAgIH1cbiAgICBzZW5kUmVzcG9uc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZChzdGF0dXNDb2RlLCBoZWFkZXJzKTtcbiAgICAgIHJlc3BvbnNlLndyaXRlKGJvZHkpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmVuZCgpO1xuICAgIH07XG4gICAgaWYgKHN0YXR1c0NvZGUgPT09IDQwMSB8fCBzdGF0dXNDb2RlID09PSA0MDMpIHtcbiAgICAgIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzID0gNTAwO1xuICAgICAgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28gPSAxICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvO1xuICAgICAgcmV0dXJuIE1ldGVvci5zZXRUaW1lb3V0KHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZW5kUmVzcG9uc2UoKTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9sb3dlckNhc2VLZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIF8uY2hhaW4ob2JqZWN0KS5wYWlycygpLm1hcChmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV07XG4gICAgfSkub2JqZWN0KCkudmFsdWUoKTtcbiAgfTtcblxuICByZXR1cm4gUm91dGU7XG5cbn0pKCk7XG4iLCJjbGFzcyBAUmVzdGl2dXNcclxuXHJcbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxyXG4gICAgQF9yb3V0ZXMgPSBbXVxyXG4gICAgQF9jb25maWcgPVxyXG4gICAgICBwYXRoczogW11cclxuICAgICAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlXHJcbiAgICAgIGFwaVBhdGg6ICdhcGkvJ1xyXG4gICAgICB2ZXJzaW9uOiBudWxsXHJcbiAgICAgIHByZXR0eUpzb246IGZhbHNlXHJcbiAgICAgIGF1dGg6XHJcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nXHJcbiAgICAgICAgdXNlcjogLT5cclxuICAgICAgICAgIGlmIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXHJcbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXHJcbiAgICAgICAgICBpZiBAcmVxdWVzdC51c2VySWRcclxuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IEByZXF1ZXN0LnVzZXJJZH0pXHJcbiAgICAgICAgICAgIHVzZXI6IF91c2VyXHJcbiAgICAgICAgICAgIHVzZXJJZDogQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ11cclxuICAgICAgICAgICAgc3BhY2VJZDogQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddXHJcbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXHJcbiAgICAgICAgICAgIHNwYWNlSWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXVxyXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cclxuICAgICAgZGVmYXVsdEhlYWRlcnM6XHJcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXHJcblxyXG4gICAgIyBDb25maWd1cmUgQVBJIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcclxuICAgIF8uZXh0ZW5kIEBfY29uZmlnLCBvcHRpb25zXHJcblxyXG4gICAgaWYgQF9jb25maWcuZW5hYmxlQ29yc1xyXG4gICAgICBjb3JzSGVhZGVycyA9XHJcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xyXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXHJcblxyXG4gICAgICBpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxyXG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4nXHJcblxyXG4gICAgICAjIFNldCBkZWZhdWx0IGhlYWRlciB0byBlbmFibGUgQ09SUyBpZiBjb25maWd1cmVkXHJcbiAgICAgIF8uZXh0ZW5kIEBfY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVyc1xyXG5cclxuICAgICAgaWYgbm90IEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcclxuICAgICAgICBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gLT5cclxuICAgICAgICAgIEByZXNwb25zZS53cml0ZUhlYWQgMjAwLCBjb3JzSGVhZGVyc1xyXG4gICAgICAgICAgQGRvbmUoKVxyXG5cclxuICAgICMgTm9ybWFsaXplIHRoZSBBUEkgcGF0aFxyXG4gICAgaWYgQF9jb25maWcuYXBpUGF0aFswXSBpcyAnLydcclxuICAgICAgQF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGguc2xpY2UgMVxyXG4gICAgaWYgXy5sYXN0KEBfY29uZmlnLmFwaVBhdGgpIGlzbnQgJy8nXHJcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoICsgJy8nXHJcblxyXG4gICAgIyBVUkwgcGF0aCB2ZXJzaW9uaW5nIGlzIHRoZSBvbmx5IHR5cGUgb2YgQVBJIHZlcnNpb25pbmcgY3VycmVudGx5IGF2YWlsYWJsZSwgc28gaWYgYSB2ZXJzaW9uIGlzXHJcbiAgICAjIHByb3ZpZGVkLCBhcHBlbmQgaXQgdG8gdGhlIGJhc2UgcGF0aCBvZiB0aGUgQVBJXHJcbiAgICBpZiBAX2NvbmZpZy52ZXJzaW9uXHJcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggKz0gQF9jb25maWcudmVyc2lvbiArICcvJ1xyXG5cclxuICAgICMgQWRkIGRlZmF1bHQgbG9naW4gYW5kIGxvZ291dCBlbmRwb2ludHMgaWYgYXV0aCBpcyBjb25maWd1cmVkXHJcbiAgICBpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxyXG4gICAgICBAX2luaXRBdXRoKClcclxuICAgIGVsc2UgaWYgQF9jb25maWcudXNlQXV0aFxyXG4gICAgICBAX2luaXRBdXRoKClcclxuICAgICAgY29uc29sZS53YXJuICdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgK1xyXG4gICAgICAgICAgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJ1xyXG5cclxuICAgIHJldHVybiB0aGlzXHJcblxyXG5cclxuICAjIyMqXHJcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXHJcblxyXG4gICAgQHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxyXG4gICAgQHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXHJcbiAgICBAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXHJcbiAgICBAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcclxuICAgIEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcclxuICAgIEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcclxuICAgICAgICBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXHJcbiAgICAgICAgYW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxyXG4gICMjI1xyXG4gIGFkZFJvdXRlOiAocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSAtPlxyXG4gICAgIyBDcmVhdGUgYSBuZXcgcm91dGUgYW5kIGFkZCBpdCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyByb3V0ZXNcclxuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cylcclxuICAgIEBfcm91dGVzLnB1c2gocm91dGUpXHJcblxyXG4gICAgcm91dGUuYWRkVG9BcGkoKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcblxyXG5cclxuICAjIyMqXHJcbiAgICBHZW5lcmF0ZSByb3V0ZXMgZm9yIHRoZSBNZXRlb3IgQ29sbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lXHJcbiAgIyMjXHJcbiAgYWRkQ29sbGVjdGlvbjogKGNvbGxlY3Rpb24sIG9wdGlvbnM9e30pIC0+XHJcbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddXHJcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddXHJcblxyXG4gICAgIyBHcmFiIHRoZSBzZXQgb2YgZW5kcG9pbnRzXHJcbiAgICBpZiBjb2xsZWN0aW9uIGlzIE1ldGVvci51c2Vyc1xyXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF91c2VyQ29sbGVjdGlvbkVuZHBvaW50c1xyXG4gICAgZWxzZVxyXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF9jb2xsZWN0aW9uRW5kcG9pbnRzXHJcblxyXG4gICAgIyBGbGF0dGVuIHRoZSBvcHRpb25zIGFuZCBzZXQgZGVmYXVsdHMgaWYgbmVjZXNzYXJ5XHJcbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyBvciB7fVxyXG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgb3Ige31cclxuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyBvciBbXVxyXG4gICAgIyBVc2UgY29sbGVjdGlvbiBuYW1lIGFzIGRlZmF1bHQgcGF0aFxyXG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCBvciBjb2xsZWN0aW9uLl9uYW1lXHJcblxyXG4gICAgIyBTZXBhcmF0ZSB0aGUgcmVxdWVzdGVkIGVuZHBvaW50cyBieSB0aGUgcm91dGUgdGhleSBiZWxvbmcgdG8gKG9uZSBmb3Igb3BlcmF0aW5nIG9uIHRoZSBlbnRpcmVcclxuICAgICMgY29sbGVjdGlvbiBhbmQgb25lIGZvciBvcGVyYXRpbmcgb24gYSBzaW5nbGUgZW50aXR5IHdpdGhpbiB0aGUgY29sbGVjdGlvbilcclxuICAgIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyA9IHt9XHJcbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9XHJcbiAgICBpZiBfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSBhbmQgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKVxyXG4gICAgICAjIEdlbmVyYXRlIGFsbCBlbmRwb2ludHMgb24gdGhpcyBjb2xsZWN0aW9uXHJcbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xyXG4gICAgICAgIGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXHJcbiAgICAgICAgICBfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXHJcbiAgICAgICAgZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcclxuICAgICAgICByZXR1cm5cclxuICAgICAgLCB0aGlzXHJcbiAgICBlbHNlXHJcbiAgICAgICMgR2VuZXJhdGUgYW55IGVuZHBvaW50cyB0aGF0IGhhdmVuJ3QgYmVlbiBleHBsaWNpdGx5IGV4Y2x1ZGVkXHJcbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgIGlmIG1ldGhvZCBub3QgaW4gZXhjbHVkZWRFbmRwb2ludHMgYW5kIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdIGlzbnQgZmFsc2VcclxuICAgICAgICAgICMgQ29uZmlndXJlIGVuZHBvaW50IGFuZCBtYXAgdG8gaXQncyBodHRwIG1ldGhvZFxyXG4gICAgICAgICAgIyBUT0RPOiBDb25zaWRlciBwcmVkZWZpbmluZyBhIG1hcCBvZiBtZXRob2RzIHRvIHRoZWlyIGh0dHAgbWV0aG9kIHR5cGUgKGUuZy4sIGdldEFsbDogZ2V0KVxyXG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF1cclxuICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludCA9IHt9XHJcbiAgICAgICAgICBfLmVhY2ggY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIChhY3Rpb24sIG1ldGhvZFR5cGUpIC0+XHJcbiAgICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9XHJcbiAgICAgICAgICAgICAgXy5jaGFpbiBhY3Rpb25cclxuICAgICAgICAgICAgICAuY2xvbmUoKVxyXG4gICAgICAgICAgICAgIC5leHRlbmQgZW5kcG9pbnRPcHRpb25zXHJcbiAgICAgICAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xyXG4gICAgICAgICAgaWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cclxuICAgICAgICAgICAgXy5leHRlbmQgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnRcclxuICAgICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICwgdGhpc1xyXG5cclxuICAgICMgQWRkIHRoZSByb3V0ZXMgdG8gdGhlIEFQSVxyXG4gICAgQGFkZFJvdXRlIHBhdGgsIHJvdXRlT3B0aW9ucywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzXHJcbiAgICBAYWRkUm91dGUgXCIje3BhdGh9LzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuXHJcblxyXG4gICMjIypcclxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxyXG4gICMjI1xyXG4gIF9jb2xsZWN0aW9uRW5kcG9pbnRzOlxyXG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZ2V0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cclxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXHJcbiAgICAgICAgICBpZiBlbnRpdHlcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcbiAgICBwdXQ6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBwdXQ6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxyXG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcclxuICAgICAgICAgIGlmIGVudGl0eUlzVXBkYXRlZFxyXG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZFxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cclxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGRlbGV0ZTpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XHJcbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgIGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCd9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgcG9zdDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgICAgQGJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcclxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxyXG4gICAgICAgICAgaWYgZW50aXR5XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMVxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxyXG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZ2V0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIHNlbGVjdG9yID0ge31cclxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKClcclxuICAgICAgICAgIGlmIGVudGl0aWVzXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cclxuXHJcblxyXG4gICMjIypcclxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcclxuICAjIyNcclxuICBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHM6XHJcbiAgICBnZXQ6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBnZXQ6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxyXG4gICAgICAgICAgaWYgZW50aXR5XHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxyXG4gICAgcHV0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgcHV0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIEB1cmxQYXJhbXMuaWQsICRzZXQ6IHByb2ZpbGU6IEBib2R5UGFyYW1zXHJcbiAgICAgICAgICBpZiBlbnRpdHlJc1VwZGF0ZWRcclxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxyXG4gICAgICAgICAgICB7c3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogZW50aXR5fVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxyXG4gICAgZGVsZXRlOiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZGVsZXRlOlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIGlmIGNvbGxlY3Rpb24ucmVtb3ZlIEB1cmxQYXJhbXMuaWRcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ31cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuICAgIHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBwb3N0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgICMgQ3JlYXRlIGEgbmV3IHVzZXIgYWNjb3VudFxyXG4gICAgICAgICAgZW50aXR5SWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyIEBib2R5UGFyYW1zXHJcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWQsIGZpZWxkczogcHJvZmlsZTogMVxyXG4gICAgICAgICAgaWYgZW50aXR5XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMVxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnfVxyXG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZ2V0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCBmaWVsZHM6IHByb2ZpbGU6IDEpLmZldGNoKClcclxuICAgICAgICAgIGlmIGVudGl0aWVzXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnfVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXHJcbiAgIyMjXHJcbiAgX2luaXRBdXRoOiAtPlxyXG4gICAgc2VsZiA9IHRoaXNcclxuICAgICMjI1xyXG4gICAgICBBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXHJcblxyXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxyXG4gICAgICBhZGRpbmcgaG9vaykuXHJcbiAgICAjIyNcclxuICAgIEBhZGRSb3V0ZSAnbG9naW4nLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sXHJcbiAgICAgIHBvc3Q6IC0+XHJcbiAgICAgICAgIyBHcmFiIHRoZSB1c2VybmFtZSBvciBlbWFpbCB0aGF0IHRoZSB1c2VyIGlzIGxvZ2dpbmcgaW4gd2l0aFxyXG4gICAgICAgIHVzZXIgPSB7fVxyXG4gICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXJcclxuICAgICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpIGlzIC0xXHJcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSBAYm9keVBhcmFtcy51c2VyXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy51c2VyXHJcbiAgICAgICAgZWxzZSBpZiBAYm9keVBhcmFtcy51c2VybmFtZVxyXG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJuYW1lXHJcbiAgICAgICAgZWxzZSBpZiBAYm9keVBhcmFtcy5lbWFpbFxyXG4gICAgICAgICAgdXNlci5lbWFpbCA9IEBib2R5UGFyYW1zLmVtYWlsXHJcblxyXG4gICAgICAgICMgVHJ5IHRvIGxvZyB0aGUgdXNlciBpbnRvIHRoZSB1c2VyJ3MgYWNjb3VudCAoaWYgc3VjY2Vzc2Z1bCB3ZSdsbCBnZXQgYW4gYXV0aCB0b2tlbiBiYWNrKVxyXG4gICAgICAgIHRyeVxyXG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQgdXNlciwgQGJvZHlQYXJhbXMucGFzc3dvcmRcclxuICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuICAgICAgICAgIHJldHVybiB7fSA9XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3JcclxuICAgICAgICAgICAgYm9keTogc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiBlLnJlYXNvblxyXG5cclxuICAgICAgICAjIEdldCB0aGUgYXV0aGVudGljYXRlZCB1c2VyXHJcbiAgICAgICAgIyBUT0RPOiBDb25zaWRlciByZXR1cm5pbmcgdGhlIHVzZXIgaW4gQXV0aC5sb2dpbldpdGhQYXNzd29yZCgpLCBpbnN0ZWFkIG9mIGZldGNoaW5nIGl0IGFnYWluIGhlcmVcclxuICAgICAgICBpZiBhdXRoLnVzZXJJZCBhbmQgYXV0aC5hdXRoVG9rZW5cclxuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge31cclxuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoLmF1dGhUb2tlblxyXG4gICAgICAgICAgQHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcclxuICAgICAgICAgICAgc2VhcmNoUXVlcnlcclxuICAgICAgICAgIEB1c2VySWQgPSBAdXNlcj8uX2lkXHJcblxyXG4gICAgICAgIHJlc3BvbnNlID0ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBhdXRofVxyXG5cclxuICAgICAgICAjIENhbGwgdGhlIGxvZ2luIGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXHJcbiAgICAgICAgZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4/LmNhbGwodGhpcylcclxuICAgICAgICBpZiBleHRyYURhdGE/XHJcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXHJcblxyXG4gICAgICAgIHJlc3BvbnNlXHJcblxyXG4gICAgbG9nb3V0ID0gLT5cclxuICAgICAgIyBSZW1vdmUgdGhlIGdpdmVuIGF1dGggdG9rZW4gZnJvbSB0aGUgdXNlcidzIGFjY291bnRcclxuICAgICAgYXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cclxuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aFRva2VuXHJcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlblxyXG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YgJy4nXHJcbiAgICAgIHRva2VuUGF0aCA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nIDAsIGluZGV4XHJcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgaW5kZXggKyAxXHJcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fVxyXG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuXHJcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge31cclxuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmVcclxuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSBAdXNlci5faWQsIHskcHVsbDogdG9rZW5SZW1vdmFsUXVlcnl9XHJcblxyXG4gICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ319XHJcblxyXG4gICAgICAjIENhbGwgdGhlIGxvZ291dCBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxyXG4gICAgICBleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQ/LmNhbGwodGhpcylcclxuICAgICAgaWYgZXh0cmFEYXRhP1xyXG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcclxuXHJcbiAgICAgIHJlc3BvbnNlXHJcblxyXG4gICAgIyMjXHJcbiAgICAgIEFkZCBhIGxvZ291dCBlbmRwb2ludCB0byB0aGUgQVBJXHJcblxyXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXHJcbiAgICAgIGFkZGluZyBob29rKS5cclxuICAgICMjI1xyXG4gICAgQGFkZFJvdXRlICdsb2dvdXQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSxcclxuICAgICAgZ2V0OiAtPlxyXG4gICAgICAgIGNvbnNvbGUud2FybiBcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCJcclxuICAgICAgICBjb25zb2xlLndhcm4gXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCJcclxuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcylcclxuICAgICAgcG9zdDogbG9nb3V0XHJcblxyXG5SZXN0aXZ1cyA9IEBSZXN0aXZ1c1xyXG4iLCJ2YXIgUmVzdGl2dXMsXG4gIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxudGhpcy5SZXN0aXZ1cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUmVzdGl2dXMob3B0aW9ucykge1xuICAgIHZhciBjb3JzSGVhZGVycztcbiAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcbiAgICB0aGlzLl9jb25maWcgPSB7XG4gICAgICBwYXRoczogW10sXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXG4gICAgICBhcGlQYXRoOiAnYXBpLycsXG4gICAgICB2ZXJzaW9uOiBudWxsLFxuICAgICAgcHJldHR5SnNvbjogZmFsc2UsXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJyxcbiAgICAgICAgdXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF91c2VyLCB0b2tlbjtcbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddKSB7XG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnVzZXJJZCkge1xuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXI6IF91c2VyLFxuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXG4gICAgfTtcbiAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcsIG9wdGlvbnMpO1xuICAgIGlmICh0aGlzLl9jb25maWcuZW5hYmxlQ29ycykge1xuICAgICAgY29yc0hlYWRlcnMgPSB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJztcbiAgICAgIH1cbiAgICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnMpO1xuICAgICAgaWYgKCF0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgY29yc0hlYWRlcnMpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hcGlQYXRoWzBdID09PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGguc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChfLmxhc3QodGhpcy5fY29uZmlnLmFwaVBhdGgpICE9PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGggKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmVyc2lvbikge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggKz0gdGhpcy5fY29uZmlnLnZlcnNpb24gKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jb25maWcudXNlQXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICsgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG4gIFxuICAgIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcbiAgICBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICBAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxuICAgIEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcbiAgICAgICAgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxuICAgICAgICBhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5hZGRSb3V0ZSA9IGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykge1xuICAgIHZhciByb3V0ZTtcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpO1xuICAgIHRoaXMuX3JvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByb3V0ZS5hZGRUb0FwaSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuYWRkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbkVuZHBvaW50cywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24sIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kcywgbWV0aG9kc09uQ29sbGVjdGlvbiwgcGF0aCwgcm91dGVPcHRpb25zO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXTtcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddO1xuICAgIGlmIChjb2xsZWN0aW9uID09PSBNZXRlb3IudXNlcnMpIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX2NvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIHx8IHt9O1xuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIHx8IHt9O1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyB8fCBbXTtcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIHx8IGNvbGxlY3Rpb24uX25hbWU7XG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgJiYgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKSkge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBjb25maWd1cmVkRW5kcG9pbnQsIGVuZHBvaW50T3B0aW9ucztcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kKSA8IDAgJiYgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF07XG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge307XG4gICAgICAgICAgXy5lYWNoKGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCBmdW5jdGlvbihhY3Rpb24sIG1ldGhvZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPSBfLmNoYWluKGFjdGlvbikuY2xvbmUoKS5leHRlbmQoZW5kcG9pbnRPcHRpb25zKS52YWx1ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIHRoaXMuYWRkUm91dGUocGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMpO1xuICAgIHRoaXMuYWRkUm91dGUocGF0aCArIFwiLzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX2NvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZCwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xuICAgICAgICAgICAgICAkc2V0OiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5O1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkO1xuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHRoaXMudXJsUGFyYW1zLmlkKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcztcbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl9pbml0QXV0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dvdXQsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAvKlxuICAgICAgQWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICB0aGlzLmFkZFJvdXRlKCdsb2dpbicsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBwb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF1dGgsIGUsIGV4dHJhRGF0YSwgcmVmLCByZWYxLCByZXNwb25zZSwgc2VhcmNoUXVlcnksIHVzZXI7XG4gICAgICAgIHVzZXIgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWUpIHtcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy5lbWFpbCkge1xuICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMuZW1haWw7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCh1c2VyLCB0aGlzLmJvZHlQYXJhbXMucGFzc3dvcmQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGUucmVhc29uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXV0aC51c2VySWQgJiYgYXV0aC5hdXRoVG9rZW4pIHtcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoLmF1dGhUb2tlbik7XG4gICAgICAgICAgdGhpcy51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgfSwgc2VhcmNoUXVlcnkpO1xuICAgICAgICAgIHRoaXMudXNlcklkID0gKHJlZiA9IHRoaXMudXNlcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgZGF0YTogYXV0aFxuICAgICAgICB9O1xuICAgICAgICBleHRyYURhdGEgPSAocmVmMSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluKSAhPSBudWxsID8gcmVmMS5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhUb2tlbiwgZXh0cmFEYXRhLCBoYXNoZWRUb2tlbiwgaW5kZXgsIHJlZiwgcmVzcG9uc2UsIHRva2VuRmllbGROYW1lLCB0b2tlbkxvY2F0aW9uLCB0b2tlblBhdGgsIHRva2VuUmVtb3ZhbFF1ZXJ5LCB0b2tlblRvUmVtb3ZlO1xuICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddO1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlbjtcbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9O1xuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlbjtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge307XG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZTtcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodGhpcy51c2VyLl9pZCwge1xuICAgICAgICAkcHVsbDogdG9rZW5SZW1vdmFsUXVlcnlcbiAgICAgIH0pO1xuICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBleHRyYURhdGEgPSAocmVmID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0KSAhPSBudWxsID8gcmVmLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLmFkZFJvdXRlKCdsb2dvdXQnLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWVcbiAgICB9LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiKTtcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHBvc3Q6IGxvZ291dFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBSZXN0aXZ1cztcblxufSkoKTtcblxuUmVzdGl2dXMgPSB0aGlzLlJlc3RpdnVzO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICBAQVBJID0gbmV3IFJlc3RpdnVzXHJcbiAgICAgICAgYXBpUGF0aDogJ3N0ZWVkb3MvYXBpLycsXHJcbiAgICAgICAgdXNlRGVmYXVsdEF1dGg6IHRydWVcclxuICAgICAgICBwcmV0dHlKc29uOiB0cnVlXHJcbiAgICAgICAgZW5hYmxlQ29yczogZmFsc2VcclxuICAgICAgICBkZWZhdWx0SGVhZGVyczpcclxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIHRoaXMuQVBJID0gbmV3IFJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiAnc3RlZWRvcy9hcGkvJyxcbiAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgICBwcmV0dHlKc29uOiB0cnVlLFxuICAgIGVuYWJsZUNvcnM6IGZhbHNlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0QVBJLmFkZENvbGxlY3Rpb24gZGIuc3BhY2VfdXNlcnMsIFxyXG5cdFx0ZXhjbHVkZWRFbmRwb2ludHM6IFtdXHJcblx0XHRyb3V0ZU9wdGlvbnM6XHJcblx0XHRcdGF1dGhSZXF1aXJlZDogdHJ1ZVxyXG5cdFx0XHRzcGFjZVJlcXVpcmVkOiB0cnVlIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBUEkuYWRkQ29sbGVjdGlvbihkYi5zcGFjZV91c2Vycywge1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXSxcbiAgICByb3V0ZU9wdGlvbnM6IHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNwYWNlUmVxdWlyZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdEFQSS5hZGRDb2xsZWN0aW9uIGRiLm9yZ2FuaXphdGlvbnMsIFxyXG5cdFx0ZXhjbHVkZWRFbmRwb2ludHM6IFtdXHJcblx0XHRyb3V0ZU9wdGlvbnM6XHJcblx0XHRcdGF1dGhSZXF1aXJlZDogdHJ1ZVxyXG5cdFx0XHRzcGFjZVJlcXVpcmVkOiB0cnVlIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBUEkuYWRkQ29sbGVjdGlvbihkYi5vcmdhbml6YXRpb25zLCB7XG4gICAgZXhjbHVkZWRFbmRwb2ludHM6IFtdLFxuICAgIHJvdXRlT3B0aW9uczoge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgc3BhY2VSZXF1aXJlZDogdHJ1ZVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuICBKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cclxuICAgIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXHJcblxyXG4gICAgaWYgcmVxLmZpbGVzIGFuZCByZXEuZmlsZXNbMF1cclxuXHJcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xyXG4gICAgICBuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9LCAoZXJyKSAtPlxyXG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lXHJcblxyXG4gICAgICAgIGlmIFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSlcclxuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKClcclxuXHJcbiAgICAgICAgYm9keSA9IHJlcS5ib2R5XHJcbiAgICAgICAgdHJ5XHJcbiAgICAgICAgICBpZiBib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwiSUVcIiBvciBib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwibm9kZVwiKVxyXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSlcclxuICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKVxyXG4gICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpXHJcblxyXG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSlcclxuICAgICAgICBcclxuICAgICAgICBpZiBib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnb3duZXJfbmFtZSddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsnaW5zdGFuY2UnXSAgJiYgYm9keVsnYXBwcm92ZSddXHJcbiAgICAgICAgICBwYXJlbnQgPSAnJ1xyXG4gICAgICAgICAgbWV0YWRhdGEgPSB7b3duZXI6Ym9keVsnb3duZXInXSwgb3duZXJfbmFtZTpib2R5Wydvd25lcl9uYW1lJ10sIHNwYWNlOmJvZHlbJ3NwYWNlJ10sIGluc3RhbmNlOmJvZHlbJ2luc3RhbmNlJ10sIGFwcHJvdmU6IGJvZHlbJ2FwcHJvdmUnXSwgY3VycmVudDogdHJ1ZX1cclxuXHJcbiAgICAgICAgICBpZiBib2R5W1wiaXNfcHJpdmF0ZVwiXSAmJiBib2R5W1wiaXNfcHJpdmF0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09IFwidHJ1ZVwiXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSB0cnVlXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSBmYWxzZVxyXG5cclxuICAgICAgICAgIGlmIGJvZHlbJ21haW4nXSA9PSBcInRydWVcIlxyXG4gICAgICAgICAgICBtZXRhZGF0YS5tYWluID0gdHJ1ZVxyXG5cclxuICAgICAgICAgIGlmIGJvZHlbJ2lzQWRkVmVyc2lvbiddICYmIGJvZHlbJ3BhcmVudCddXHJcbiAgICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXHJcbiAgICAgICAgICAjIGVsc2VcclxuICAgICAgICAgICMgICBjb2xsZWN0aW9uLmZpbmQoeydtZXRhZGF0YS5pbnN0YW5jZSc6IGJvZHlbJ2luc3RhbmNlJ10sICdtZXRhZGF0YS5jdXJyZW50JyA6IHRydWV9KS5mb3JFYWNoIChjKSAtPlxyXG4gICAgICAgICAgIyAgICAgaWYgYy5uYW1lKCkgPT0gZmlsZW5hbWVcclxuICAgICAgICAgICMgICAgICAgcGFyZW50ID0gYy5tZXRhZGF0YS5wYXJlbnRcclxuXHJcbiAgICAgICAgICBpZiBwYXJlbnRcclxuICAgICAgICAgICAgciA9IGNvbGxlY3Rpb24udXBkYXRlKHsnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LCAnbWV0YWRhdGEuY3VycmVudCcgOiB0cnVlfSwgeyR1bnNldCA6IHsnbWV0YWRhdGEuY3VycmVudCcgOiAnJ319KVxyXG4gICAgICAgICAgICBpZiByXHJcbiAgICAgICAgICAgICAgbWV0YWRhdGEucGFyZW50ID0gcGFyZW50XHJcbiAgICAgICAgICAgICAgaWYgYm9keVsnbG9ja2VkX2J5J10gJiYgYm9keVsnbG9ja2VkX2J5X25hbWUnXVxyXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5ID0gYm9keVsnbG9ja2VkX2J5J11cclxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieV9uYW1lID0gYm9keVsnbG9ja2VkX2J5X25hbWUnXVxyXG5cclxuICAgICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcclxuICAgICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuICAgICAgICAgICAgICAjIOWIoOmZpOWQjOS4gOS4queUs+ivt+WNleWQjOS4gOS4quatpemqpOWQjOS4gOS4quS6uuS4iuS8oOeahOmHjeWkjeeahOaWh+S7tlxyXG4gICAgICAgICAgICAgIGlmIGJvZHlbXCJvdmVyd3JpdGVcIl0gJiYgYm9keVtcIm92ZXJ3cml0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09IFwidHJ1ZVwiXHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnJlbW92ZSh7J21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSwgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCwgJ21ldGFkYXRhLm93bmVyJzogYm9keVsnb3duZXInXSwgJ21ldGFkYXRhLmFwcHJvdmUnOiBib2R5WydhcHByb3ZlJ10sICdtZXRhZGF0YS5jdXJyZW50JzogeyRuZTogdHJ1ZX19KVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcclxuICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuICAgICAgICAgICAgZmlsZU9iai51cGRhdGUoeyRzZXQ6IHsnbWV0YWRhdGEucGFyZW50JyA6IGZpbGVPYmouX2lkfX0pXHJcblxyXG4gICAgICAgICMg5YW85a656ICB54mI5pysXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuXHJcblxyXG4gICAgICAgIHNpemUgPSBmaWxlT2JqLm9yaWdpbmFsLnNpemVcclxuICAgICAgICBpZiAhc2l6ZVxyXG4gICAgICAgICAgc2l6ZSA9IDEwMjRcclxuXHJcbiAgICAgICAgcmVzcCA9XHJcbiAgICAgICAgICB2ZXJzaW9uX2lkOiBmaWxlT2JqLl9pZCxcclxuICAgICAgICAgIHNpemU6IHNpemVcclxuXHJcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIngtYW16LXZlcnNpb24taWRcIixmaWxlT2JqLl9pZCk7XHJcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICBlbHNlXHJcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG4gICAgICByZXMuZW5kKCk7XHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJkZWxldGVcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcclxuXHJcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcclxuICBpZiBpZFxyXG4gICAgZmlsZSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogaWQgfSlcclxuICAgIGlmIGZpbGVcclxuICAgICAgZmlsZS5yZW1vdmUoKVxyXG4gICAgICByZXNwID0ge1xyXG4gICAgICAgIHN0YXR1czogXCJPS1wiXHJcbiAgICAgIH1cclxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XHJcbiAgICAgIHJldHVyblxyXG5cclxuICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcclxuICByZXMuZW5kKCk7XHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcclxuXHJcbiAgcmVzLnN0YXR1c0NvZGUgPSAzMDI7XHJcbiAgcmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvaW5zdGFuY2VzL1wiKSArIGlkICsgXCI/ZG93bmxvYWQ9MVwiXHJcbiAgcmVzLmVuZCgpO1xyXG5cclxuXHJcbiMgTWV0ZW9yLm1ldGhvZHNcclxuXHJcbiMgICBzM191cGdyYWRlOiAobWluLCBtYXgpIC0+XHJcbiMgICAgIGNvbnNvbGUubG9nKFwiL3MzL3VwZ3JhZGVcIilcclxuXHJcbiMgICAgIGZzID0gcmVxdWlyZSgnZnMnKVxyXG4jICAgICBtaW1lID0gcmVxdWlyZSgnbWltZScpXHJcblxyXG4jICAgICByb290X3BhdGggPSBcIi9tbnQvZmFrZXMzLzEwXCJcclxuIyAgICAgY29uc29sZS5sb2cocm9vdF9wYXRoKVxyXG4jICAgICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xyXG5cclxuIyAgICAgIyDpgY3ljoZpbnN0YW5jZSDmi7zlh7rpmYTku7bot6/lvoQg5Yiw5pys5Zyw5om+5a+55bqU5paH5Lu2IOWIhuS4pOenjeaDheWGtSAxLi9maWxlbmFtZV92ZXJzaW9uSWQgMi4vZmlsZW5hbWXvvJtcclxuIyAgICAgZGVhbF93aXRoX3ZlcnNpb24gPSAocm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCB2ZXJzaW9uLCBhdHRhY2hfZmlsZW5hbWUpIC0+XHJcbiMgICAgICAgX3JldiA9IHZlcnNpb24uX3JldlxyXG4jICAgICAgIGlmIChjb2xsZWN0aW9uLmZpbmQoe1wiX2lkXCI6IF9yZXZ9KS5jb3VudCgpID4wKVxyXG4jICAgICAgICAgcmV0dXJuXHJcbiMgICAgICAgY3JlYXRlZF9ieSA9IHZlcnNpb24uY3JlYXRlZF9ieVxyXG4jICAgICAgIGFwcHJvdmUgPSB2ZXJzaW9uLmFwcHJvdmVcclxuIyAgICAgICBmaWxlbmFtZSA9IHZlcnNpb24uZmlsZW5hbWUgfHwgYXR0YWNoX2ZpbGVuYW1lO1xyXG4jICAgICAgIG1pbWVfdHlwZSA9IG1pbWUubG9va3VwKGZpbGVuYW1lKVxyXG4jICAgICAgIG5ld19wYXRoID0gcm9vdF9wYXRoICsgXCIvc3BhY2VzL1wiICsgc3BhY2UgKyBcIi93b3JrZmxvdy9cIiArIGluc19pZCArIFwiL1wiICsgZmlsZW5hbWUgKyBcIl9cIiArIF9yZXZcclxuIyAgICAgICBvbGRfcGF0aCA9IHJvb3RfcGF0aCArIFwiL3NwYWNlcy9cIiArIHNwYWNlICsgXCIvd29ya2Zsb3cvXCIgKyBpbnNfaWQgKyBcIi9cIiArIGZpbGVuYW1lXHJcblxyXG4jICAgICAgIHJlYWRGaWxlID0gKGZ1bGxfcGF0aCkgLT5cclxuIyAgICAgICAgIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMgZnVsbF9wYXRoXHJcblxyXG4jICAgICAgICAgaWYgZGF0YVxyXG4jICAgICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcclxuIyAgICAgICAgICAgbmV3RmlsZS5faWQgPSBfcmV2O1xyXG4jICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0ge293bmVyOmNyZWF0ZWRfYnksIHNwYWNlOnNwYWNlLCBpbnN0YW5jZTppbnNfaWQsIGFwcHJvdmU6IGFwcHJvdmV9O1xyXG4jICAgICAgICAgICBuZXdGaWxlLmF0dGFjaERhdGEgZGF0YSwge3R5cGU6IG1pbWVfdHlwZX1cclxuIyAgICAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxyXG4jICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG4jICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlT2JqLl9pZClcclxuXHJcbiMgICAgICAgdHJ5XHJcbiMgICAgICAgICBuID0gZnMuc3RhdFN5bmMgbmV3X3BhdGhcclxuIyAgICAgICAgIGlmIG4gJiYgbi5pc0ZpbGUoKVxyXG4jICAgICAgICAgICByZWFkRmlsZSBuZXdfcGF0aFxyXG4jICAgICAgIGNhdGNoIGVycm9yXHJcbiMgICAgICAgICB0cnlcclxuIyAgICAgICAgICAgb2xkID0gZnMuc3RhdFN5bmMgb2xkX3BhdGhcclxuIyAgICAgICAgICAgaWYgb2xkICYmIG9sZC5pc0ZpbGUoKVxyXG4jICAgICAgICAgICAgIHJlYWRGaWxlIG9sZF9wYXRoXHJcbiMgICAgICAgICBjYXRjaCBlcnJvclxyXG4jICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZmlsZSBub3QgZm91bmQ6IFwiICsgb2xkX3BhdGgpXHJcblxyXG5cclxuIyAgICAgY291bnQgPSBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pLmNvdW50KCk7XHJcbiMgICAgIGNvbnNvbGUubG9nKFwiYWxsIGluc3RhbmNlczogXCIgKyBjb3VudClcclxuXHJcbiMgICAgIGIgPSBuZXcgRGF0ZSgpXHJcblxyXG4jICAgICBpID0gbWluXHJcbiMgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBza2lwOiBtaW4sIGxpbWl0OiBtYXgtbWlufSkuZm9yRWFjaCAoaW5zKSAtPlxyXG4jICAgICAgIGkgPSBpICsgMVxyXG4jICAgICAgIGNvbnNvbGUubG9nKGkgKyBcIjpcIiArIGlucy5uYW1lKVxyXG4jICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcclxuIyAgICAgICBzcGFjZSA9IGlucy5zcGFjZVxyXG4jICAgICAgIGluc19pZCA9IGlucy5faWRcclxuIyAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCkgLT5cclxuIyAgICAgICAgIGRlYWxfd2l0aF92ZXJzaW9uIHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgYXR0LmN1cnJlbnQsIGF0dC5maWxlbmFtZVxyXG4jICAgICAgICAgaWYgYXR0Lmhpc3RvcnlzXHJcbiMgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XHJcbiMgICAgICAgICAgICAgZGVhbF93aXRoX3ZlcnNpb24gcm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCBoaXMsIGF0dC5maWxlbmFtZVxyXG5cclxuIyAgICAgY29uc29sZS5sb2cobmV3IERhdGUoKSAtIGIpXHJcblxyXG4jICAgICByZXR1cm4gXCJva1wiXHJcbiIsIkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgbmV3RmlsZTtcbiAgICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlcztcbiAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5hdHRhY2hEYXRhKHJlcS5maWxlc1swXS5kYXRhLCB7XG4gICAgICAgIHR5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZVxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHZhciBib2R5LCBlLCBmaWxlT2JqLCBmaWxlbmFtZSwgbWV0YWRhdGEsIHBhcmVudCwgciwgcmVzcCwgc2l6ZTtcbiAgICAgICAgZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWU7XG4gICAgICAgIGlmIChbXCJpbWFnZS5qcGdcIiwgXCJpbWFnZS5naWZcIiwgXCJpbWFnZS5qcGVnXCIsIFwiaW1hZ2UucG5nXCJdLmluY2x1ZGVzKGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICBib2R5ID0gcmVxLmJvZHk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGJvZHkgJiYgKGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwiSUVcIiB8fCBib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIm5vZGVcIikpIHtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZmlsZW5hbWUpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZW5hbWUpO1xuICAgICAgICBpZiAoYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ293bmVyX25hbWUnXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ2luc3RhbmNlJ10gJiYgYm9keVsnYXBwcm92ZSddKSB7XG4gICAgICAgICAgcGFyZW50ID0gJyc7XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBvd25lcjogYm9keVsnb3duZXInXSxcbiAgICAgICAgICAgIG93bmVyX25hbWU6IGJvZHlbJ293bmVyX25hbWUnXSxcbiAgICAgICAgICAgIHNwYWNlOiBib2R5WydzcGFjZSddLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGJvZHlbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICBhcHByb3ZlOiBib2R5WydhcHByb3ZlJ10sXG4gICAgICAgICAgICBjdXJyZW50OiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoYm9keVtcImlzX3ByaXZhdGVcIl0gJiYgYm9keVtcImlzX3ByaXZhdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChib2R5WydtYWluJ10gPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYWluID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJvZHlbJ2lzQWRkVmVyc2lvbiddICYmIGJvZHlbJ3BhcmVudCddKSB7XG4gICAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgciA9IGNvbGxlY3Rpb24udXBkYXRlKHtcbiAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCxcbiAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50JzogJydcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgICAgIGlmIChib2R5Wydsb2NrZWRfYnknXSAmJiBib2R5Wydsb2NrZWRfYnlfbmFtZSddKSB7XG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5ID0gYm9keVsnbG9ja2VkX2J5J107XG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5X25hbWUgPSBib2R5Wydsb2NrZWRfYnlfbmFtZSddO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICAgICAgICBpZiAoYm9keVtcIm92ZXJ3cml0ZVwiXSAmJiBib2R5W1wib3ZlcndyaXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5yZW1vdmUoe1xuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEub3duZXInOiBib2R5Wydvd25lciddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLmFwcHJvdmUnOiBib2R5WydhcHByb3ZlJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJG5lOiB0cnVlXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICAgICAgZmlsZU9iai51cGRhdGUoe1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IGZpbGVPYmouX2lkXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgaWYgKCFzaXplKSB7XG4gICAgICAgICAgc2l6ZSA9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICB2ZXJzaW9uX2lkOiBmaWxlT2JqLl9pZCxcbiAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIH07XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJ4LWFtei12ZXJzaW9uLWlkXCIsIGZpbGVPYmouX2lkKTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICByZXR1cm4gcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJkZWxldGVcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGZpbGUsIGlkLCByZXNwO1xuICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlcztcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcbiAgaWYgKGlkKSB7XG4gICAgZmlsZSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICBfaWQ6IGlkXG4gICAgfSk7XG4gICAgaWYgKGZpbGUpIHtcbiAgICAgIGZpbGUucmVtb3ZlKCk7XG4gICAgICByZXNwID0ge1xuICAgICAgICBzdGF0dXM6IFwiT0tcIlxuICAgICAgfTtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgcmV0dXJuIHJlcy5lbmQoKTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgaWQ7XG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG4gIHJlcy5zdGF0dXNDb2RlID0gMzAyO1xuICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9pbnN0YW5jZXMvXCIpICsgaWQgKyBcIj9kb3dubG9hZD0xXCIpO1xuICByZXR1cm4gcmVzLmVuZCgpO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL3B1c2gvbWVzc2FnZVwiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcbiAgICBpZiByZXEuYm9keT8ucHVzaFRvcGljIGFuZCByZXEuYm9keS51c2VySWRzIGFuZCByZXEuYm9keS5kYXRhXHJcbiAgICAgICAgbWVzc2FnZSA9IFxyXG4gICAgICAgICAgICBmcm9tOiBcInN0ZWVkb3NcIlxyXG4gICAgICAgICAgICBxdWVyeTpcclxuICAgICAgICAgICAgICAgIGFwcE5hbWU6IHJlcS5ib2R5LnB1c2hUb3BpY1xyXG4gICAgICAgICAgICAgICAgdXNlcklkOiBcclxuICAgICAgICAgICAgICAgICAgICBcIiRpblwiOiB1c2VySWRzXHJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlP1xyXG4gICAgICAgICAgICBtZXNzYWdlW1widGl0bGVcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGVcclxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmFsZXJ0P1xyXG4gICAgICAgICAgICBtZXNzYWdlW1widGV4dFwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnRcclxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmJhZGdlP1xyXG4gICAgICAgICAgICBtZXNzYWdlW1wiYmFkZ2VcIl0gPSByZXEuYm9keS5kYXRhLmJhZGdlICsgXCJcIlxyXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuc291bmQ/XHJcbiAgICAgICAgICAgIG1lc3NhZ2VbXCJzb3VuZFwiXSA9IHJlcS5ib2R5LmRhdGEuc291bmRcclxuICAgICAgICAjaWYgcmVxLmJvZHkuZGF0YS5kYXRhP1xyXG4gICAgICAgICMgICAgbWVzc2FnZVtcImRhdGFcIl0gPSByZXEuYm9keS5kYXRhLmRhdGFcclxuICAgICAgICBQdXNoLnNlbmQgbWVzc2FnZVxyXG5cclxuICAgICAgICByZXMuZW5kKFwic3VjY2Vzc1wiKTtcclxuXHJcblxyXG5cclxuTWV0ZW9yLm1ldGhvZHNcclxuICAgIHB1c2hTZW5kOiAodGV4dCx0aXRsZSxiYWRnZSx1c2VySWQpIC0+XHJcbiAgICAgICAgaWYgKCF1c2VySWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBQdXNoLnNlbmRcclxuICAgICAgICAgICAgZnJvbTogJ3N0ZWVkb3MnLFxyXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXHJcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgIGJhZGdlOiBiYWRnZSxcclxuICAgICAgICAgICAgcXVlcnk6IFxyXG4gICAgICAgICAgICAgICAgdXNlcklkOiB1c2VySWRcclxuICAgICAgICAgICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxyXG4iLCJKc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL3B1c2gvbWVzc2FnZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgbWVzc2FnZSwgcmVmO1xuICBpZiAoKChyZWYgPSByZXEuYm9keSkgIT0gbnVsbCA/IHJlZi5wdXNoVG9waWMgOiB2b2lkIDApICYmIHJlcS5ib2R5LnVzZXJJZHMgJiYgcmVxLmJvZHkuZGF0YSkge1xuICAgIG1lc3NhZ2UgPSB7XG4gICAgICBmcm9tOiBcInN0ZWVkb3NcIixcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGFwcE5hbWU6IHJlcS5ib2R5LnB1c2hUb3BpYyxcbiAgICAgICAgdXNlcklkOiB7XG4gICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAocmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJ0aXRsZVwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZTtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYWxlcnQgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInRleHRcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0O1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5iYWRnZSAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1wiYmFkZ2VcIl0gPSByZXEuYm9keS5kYXRhLmJhZGdlICsgXCJcIjtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuc291bmQgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInNvdW5kXCJdID0gcmVxLmJvZHkuZGF0YS5zb3VuZDtcbiAgICB9XG4gICAgUHVzaC5zZW5kKG1lc3NhZ2UpO1xuICAgIHJldHVybiByZXMuZW5kKFwic3VjY2Vzc1wiKTtcbiAgfVxufSk7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgcHVzaFNlbmQ6IGZ1bmN0aW9uKHRleHQsIHRpdGxlLCBiYWRnZSwgdXNlcklkKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIFB1c2guc2VuZCh7XG4gICAgICBmcm9tOiAnc3RlZWRvcycsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgYmFkZ2U6IGJhZGdlLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcclxuWGluZ2UgPSByZXF1aXJlKCd4aW5nZScpO1xyXG5Id1B1c2ggPSByZXF1aXJlKCdodWF3ZWktcHVzaCcpO1xyXG5NaVB1c2ggPSByZXF1aXJlKCd4aWFvbWktcHVzaCcpO1xyXG5cclxuQWxpeXVuX3B1c2ggPSB7fTtcclxuXHJcbkFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgY2FsbGJhY2spIC0+XHJcblx0aWYgbm90aWZpY2F0aW9uLnRpdGxlIGFuZCBub3RpZmljYXRpb24udGV4dFxyXG5cdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRjb25zb2xlLmxvZyB1c2VyVG9rZW5zXHJcblxyXG5cdFx0YWxpeXVuVG9rZW5zID0gbmV3IEFycmF5XHJcblx0XHR4aW5nZVRva2VucyA9IG5ldyBBcnJheVxyXG5cdFx0aHVhd2VpVG9rZW5zID0gbmV3IEFycmF5XHJcblx0XHRtaVRva2VucyA9IG5ldyBBcnJheVxyXG5cclxuXHRcdHVzZXJUb2tlbnMuZm9yRWFjaCAodXNlclRva2VuKSAtPlxyXG5cdFx0XHRhcnIgPSB1c2VyVG9rZW4uc3BsaXQoJzonKVxyXG5cdFx0XHRpZiBhcnJbMF0gaXMgXCJhbGl5dW5cIlxyXG5cdFx0XHRcdGFsaXl1blRva2Vucy5wdXNoIF8ubGFzdChhcnIpXHJcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwieGluZ2VcIlxyXG5cdFx0XHRcdHhpbmdlVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcclxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJodWF3ZWlcIlxyXG5cdFx0XHRcdGh1YXdlaVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXHJcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwibWlcIlxyXG5cdFx0XHRcdG1pVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcclxuXHJcblx0XHRpZiAhXy5pc0VtcHR5KGFsaXl1blRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hbGl5dW5cclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiYWxpeXVuVG9rZW5zOiAje2FsaXl1blRva2Vuc31cIlxyXG5cdFx0XHRBTFlQVVNIID0gbmV3IChBTFkuUFVTSCkoXHJcblx0XHRcdFx0YWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hY2Nlc3NLZXlJZFxyXG5cdFx0XHRcdHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLnNlY3JldEFjY2Vzc0tleVxyXG5cdFx0XHRcdGVuZHBvaW50OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uZW5kcG9pbnRcclxuXHRcdFx0XHRhcGlWZXJzaW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBpVmVyc2lvbik7XHJcblxyXG5cdFx0XHRkYXRhID0gXHJcblx0XHRcdFx0QXBwS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBwS2V5XHJcblx0XHRcdFx0VGFyZ2V0OiAnZGV2aWNlJ1xyXG5cdFx0XHRcdFRhcmdldFZhbHVlOiBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFRpdGxlOiBub3RpZmljYXRpb24udGl0bGVcclxuXHRcdFx0XHRTdW1tYXJ5OiBub3RpZmljYXRpb24udGV4dFxyXG5cclxuXHRcdFx0QUxZUFVTSC5wdXNoTm90aWNlVG9BbmRyb2lkIGRhdGEsIGNhbGxiYWNrXHJcblxyXG5cdFx0aWYgIV8uaXNFbXB0eSh4aW5nZVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy54aW5nZVxyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJ4aW5nZVRva2VuczogI3t4aW5nZVRva2Vuc31cIlxyXG5cdFx0XHRYaW5nZUFwcCA9IG5ldyBYaW5nZS5YaW5nZUFwcChNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5hY2Nlc3NJZCwgTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2Uuc2VjcmV0S2V5KVxyXG5cdFx0XHRcclxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UgPSBuZXcgWGluZ2UuQW5kcm9pZE1lc3NhZ2VcclxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UudHlwZSA9IFhpbmdlLk1FU1NBR0VfVFlQRV9OT1RJRklDQVRJT05cclxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGVcclxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UuY29udGVudCA9IG5vdGlmaWNhdGlvbi50ZXh0XHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnN0eWxlID0gbmV3IFhpbmdlLlN0eWxlXHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLmFjdGlvbiA9IG5ldyBYaW5nZS5DbGlja0FjdGlvblxyXG5cclxuXHRcdFx0Xy5lYWNoIHhpbmdlVG9rZW5zLCAodCktPlxyXG5cdFx0XHRcdFhpbmdlQXBwLnB1c2hUb1NpbmdsZURldmljZSB0LCBhbmRyb2lkTWVzc2FnZSwgY2FsbGJhY2tcclxuXHJcblx0XHRpZiAhXy5pc0VtcHR5KGh1YXdlaVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5odWF3ZWlcclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiaHVhd2VpVG9rZW5zOiAje2h1YXdlaVRva2Vuc31cIlxyXG5cdFx0XHQjIG1zZyA9IG5ldyBId1B1c2guTWVzc2FnZVxyXG5cdFx0XHQjIG1zZy50aXRsZShub3RpZmljYXRpb24udGl0bGUpLmNvbnRlbnQobm90aWZpY2F0aW9uLnRleHQpXHJcblx0XHRcdCMgbXNnLmV4dHJhcyhub3RpZmljYXRpb24ucGF5bG9hZClcclxuXHRcdFx0IyBub3RpZmljYXRpb24gPSBuZXcgSHdQdXNoLk5vdGlmaWNhdGlvbihcclxuXHRcdFx0IyBcdGFwcElkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwSWRcclxuXHRcdFx0IyBcdGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFNlY3JldFxyXG5cdFx0XHQjIClcclxuXHRcdFx0IyBfLmVhY2ggaHVhd2VpVG9rZW5zLCAodCktPlxyXG5cdFx0XHQjIFx0bm90aWZpY2F0aW9uLnNlbmQgdCwgbXNnLCBjYWxsYmFja1xyXG5cclxuXHJcblx0XHRcdHBhY2thZ2VfbmFtZSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBQa2dOYW1lXHJcblx0XHRcdHRva2VuRGF0YUxpc3QgPSBbXVxyXG5cdFx0XHRfLmVhY2ggaHVhd2VpVG9rZW5zLCAodCktPlxyXG5cdFx0XHRcdHRva2VuRGF0YUxpc3QucHVzaCh7J3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSwgJ3Rva2VuJzogdH0pXHJcblx0XHRcdG5vdGkgPSB7J2FuZHJvaWQnOiB7J3RpdGxlJzogbm90aWZpY2F0aW9uLnRpdGxlLCAnbWVzc2FnZSc6IG5vdGlmaWNhdGlvbi50ZXh0fSwgJ2V4dHJhcyc6IG5vdGlmaWNhdGlvbi5wYXlsb2FkfVxyXG5cclxuXHRcdFx0SHVhd2VpUHVzaC5jb25maWcgW3sncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLCAnY2xpZW50X2lkJzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcElkLCAnY2xpZW50X3NlY3JldCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXR9XVxyXG5cdFx0XHRcclxuXHRcdFx0SHVhd2VpUHVzaC5zZW5kTWFueSBub3RpLCB0b2tlbkRhdGFMaXN0XHJcblxyXG5cclxuXHRcdGlmICFfLmlzRW1wdHkobWlUb2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ubWlcclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwibWlUb2tlbnM6ICN7bWlUb2tlbnN9XCJcclxuXHRcdFx0bXNnID0gbmV3IE1pUHVzaC5NZXNzYWdlXHJcblx0XHRcdG1zZy50aXRsZShub3RpZmljYXRpb24udGl0bGUpLmRlc2NyaXB0aW9uKG5vdGlmaWNhdGlvbi50ZXh0KVxyXG5cdFx0XHRub3RpZmljYXRpb24gPSBuZXcgTWlQdXNoLk5vdGlmaWNhdGlvbihcclxuXHRcdFx0XHRwcm9kdWN0aW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5wcm9kdWN0aW9uXHJcblx0XHRcdFx0YXBwU2VjcmV0OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5hcHBTZWNyZXRcclxuXHRcdFx0KVxyXG5cdFx0XHRfLmVhY2ggbWlUb2tlbnMsIChyZWdpZCktPlxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbi5zZW5kIHJlZ2lkLCBtc2csIGNhbGxiYWNrXHJcblxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRcclxuXHRpZiBub3QgTWV0ZW9yLnNldHRpbmdzLmNyb24/LnB1c2hfaW50ZXJ2YWxcclxuXHRcdHJldHVyblxyXG5cclxuXHRjb25maWcgPSB7XHJcblx0XHRkZWJ1ZzogdHJ1ZVxyXG5cdFx0a2VlcE5vdGlmaWNhdGlvbnM6IGZhbHNlXHJcblx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLnB1c2hfaW50ZXJ2YWxcclxuXHRcdHNlbmRCYXRjaFNpemU6IDEwXHJcblx0XHRwcm9kdWN0aW9uOiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAhXy5pc0VtcHR5KE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hcG4pXHJcblx0XHRjb25maWcuYXBuID0ge1xyXG5cdFx0XHRrZXlEYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4ua2V5RGF0YVxyXG5cdFx0XHRjZXJ0RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmNlcnREYXRhXHJcblx0XHR9XHJcblx0aWYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uZ2NtKVxyXG5cdFx0Y29uZmlnLmdjbSA9IHtcclxuXHRcdFx0cHJvamVjdE51bWJlcjogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLnByb2plY3ROdW1iZXJcclxuXHRcdFx0YXBpS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20uYXBpS2V5XHJcblx0XHR9XHJcblxyXG5cdFB1c2guQ29uZmlndXJlIGNvbmZpZ1xyXG5cdFxyXG5cdGlmIChNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYWxpeXVuIG9yIE1ldGVvci5zZXR0aW5ncy5wdXNoPy54aW5nZSBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8uaHVhd2VpIG9yIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5taSkgYW5kIFB1c2ggYW5kIHR5cGVvZiBQdXNoLnNlbmRHQ00gPT0gJ2Z1bmN0aW9uJ1xyXG5cdFx0XHJcblx0XHRQdXNoLm9sZF9zZW5kR0NNID0gUHVzaC5zZW5kR0NNO1xyXG5cclxuXHRcdFB1c2guc2VuZEFsaXl1biA9ICh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIC0+XHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxyXG5cclxuXHRcdFx0aWYgTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpXHJcblx0XHRcdFx0bm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSlcclxuXHRcdFx0IyBNYWtlIHN1cmUgdXNlclRva2VucyBhcmUgYW4gYXJyYXkgb2Ygc3RyaW5nc1xyXG5cdFx0XHRpZiB1c2VyVG9rZW5zID09ICcnICsgdXNlclRva2Vuc1xyXG5cdFx0XHRcdHVzZXJUb2tlbnMgPSBbIHVzZXJUb2tlbnMgXVxyXG5cdFx0XHQjIENoZWNrIGlmIGFueSB0b2tlbnMgaW4gdGhlcmUgdG8gc2VuZFxyXG5cdFx0XHRpZiAhdXNlclRva2Vucy5sZW5ndGhcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCdcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uXHJcblxyXG5cdFx0XHRGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpXHJcblx0ICBcclxuXHRcdFx0dXNlclRva2VuID0gaWYgdXNlclRva2Vucy5sZW5ndGggPT0gMSB0aGVuIHVzZXJUb2tlbnNbMF0gZWxzZSBudWxsXHJcblx0XHRcdEFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgKGVyciwgcmVzdWx0KSAtPlxyXG5cdFx0XHRcdGlmIGVyclxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQgRVJST1I6IHJlc3VsdCBvZiBzZW5kZXI6ICcgKyByZXN1bHRcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRpZiByZXN1bHQgPT0gbnVsbFxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyAnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlciBpcyBudWxsJ1xyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyAnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlcjogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdClcclxuXHJcblx0XHRcdFx0XHRpZiByZXN1bHQuY2Fub25pY2FsX2lkcyA9PSAxIGFuZCB1c2VyVG9rZW5cclxuXHRcdFx0XHRcdFx0RmliZXIoKHNlbGYpIC0+XHJcblx0XHRcdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmNhbGxiYWNrIHNlbGYub2xkVG9rZW4sIHNlbGYubmV3VG9rZW5cclxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJcclxuXHRcdFx0XHRcdFx0KS5ydW5cclxuXHRcdFx0XHRcdFx0XHRvbGRUb2tlbjogZ2NtOiB1c2VyVG9rZW5cclxuXHRcdFx0XHRcdFx0XHRuZXdUb2tlbjogZ2NtOiBcImFsaXl1bjpcIiArIHJlc3VsdC5yZXN1bHRzWzBdLnJlZ2lzdHJhdGlvbl9pZFxyXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiBfcmVwbGFjZVRva2VuXHJcblx0XHRcdFx0XHRpZiByZXN1bHQuZmFpbHVyZSAhPSAwIGFuZCB1c2VyVG9rZW5cclxuXHRcdFx0XHRcdFx0RmliZXIoKHNlbGYpIC0+XHJcblx0XHRcdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmNhbGxiYWNrIHNlbGYudG9rZW5cclxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJcclxuXHRcdFx0XHRcdFx0KS5ydW5cclxuXHRcdFx0XHRcdFx0XHR0b2tlbjogZ2NtOiB1c2VyVG9rZW5cclxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjazogX3JlbW92ZVRva2VuXHJcblxyXG5cclxuXHJcblx0XHRQdXNoLnNlbmRHQ00gPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uKSAtPlxyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gZnJvbSBhbGl5dW4tPiBQdXNoLnNlbmRHQ00nXHJcblx0XHRcdGlmIE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KVxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pXHJcblx0XHRcdCMgTWFrZSBzdXJlIHVzZXJUb2tlbnMgYXJlIGFuIGFycmF5IG9mIHN0cmluZ3NcclxuXHRcdFx0aWYgdXNlclRva2VucyA9PSAnJyArIHVzZXJUb2tlbnNcclxuXHRcdFx0XHR1c2VyVG9rZW5zID0gWyB1c2VyVG9rZW5zIF1cclxuXHRcdFx0IyBDaGVjayBpZiBhbnkgdG9rZW5zIGluIHRoZXJlIHRvIHNlbmRcclxuXHRcdFx0aWYgIXVzZXJUb2tlbnMubGVuZ3RoXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTScsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxyXG5cclxuXHRcdFx0YWxpeXVuVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoKGl0ZW0pIC0+XHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmluZGV4T2YoJ2FsaXl1bjonKSA+IC0xIG9yIGl0ZW0uaW5kZXhPZigneGluZ2U6JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ2h1YXdlaTonKSA+IC0xIG9yIGl0ZW0uaW5kZXhPZignbWk6JykgPiAtMVxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdhbGl5dW5Ub2tlbnMgaXMgJywgYWxpeXVuVG9rZW5zLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdGdjbVRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKChpdGVtKSAtPlxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5pbmRleE9mKFwiYWxpeXVuOlwiKSA8IDAgYW5kIGl0ZW0uaW5kZXhPZihcInhpbmdlOlwiKSA8IDAgYW5kIGl0ZW0uaW5kZXhPZihcImh1YXdlaTpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJtaTpcIikgPCAwXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ2djbVRva2VucyBpcyAnICwgZ2NtVG9rZW5zLnRvU3RyaW5nKCk7XHJcblxyXG5cdFx0XHRQdXNoLnNlbmRBbGl5dW4oYWxpeXVuVG9rZW5zLCBub3RpZmljYXRpb24pO1xyXG5cclxuXHRcdFx0UHVzaC5vbGRfc2VuZEdDTShnY21Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XHJcblxyXG5cdFx0UHVzaC5vbGRfc2VuZEFQTiA9IFB1c2guc2VuZEFQTlxyXG5cdFx0UHVzaC5zZW5kQVBOID0gKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKSAtPlxyXG5cdFx0XHRpZiBub3RpZmljYXRpb24udGl0bGUgYW5kIG5vdGlmaWNhdGlvbi50ZXh0XHJcblx0XHRcdFx0bm90aSA9IF8uY2xvbmUobm90aWZpY2F0aW9uKVxyXG5cdFx0XHRcdG5vdGkudGV4dCA9IG5vdGkudGl0bGUgKyBcIiBcIiArIG5vdGkudGV4dFxyXG5cdFx0XHRcdG5vdGkudGl0bGUgPSBcIlwiXHJcblx0XHRcdFx0UHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGkpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKVxyXG4iLCJ2YXIgQUxZLCBBbGl5dW5fcHVzaCwgSHdQdXNoLCBNaVB1c2gsIFhpbmdlO1xuXG5BTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG5cblhpbmdlID0gcmVxdWlyZSgneGluZ2UnKTtcblxuSHdQdXNoID0gcmVxdWlyZSgnaHVhd2VpLXB1c2gnKTtcblxuTWlQdXNoID0gcmVxdWlyZSgneGlhb21pLXB1c2gnKTtcblxuQWxpeXVuX3B1c2ggPSB7fTtcblxuQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGNhbGxiYWNrKSB7XG4gIHZhciBBTFlQVVNILCBYaW5nZUFwcCwgYWxpeXVuVG9rZW5zLCBhbmRyb2lkTWVzc2FnZSwgZGF0YSwgaHVhd2VpVG9rZW5zLCBtaVRva2VucywgbXNnLCBub3RpLCBwYWNrYWdlX25hbWUsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdG9rZW5EYXRhTGlzdCwgeGluZ2VUb2tlbnM7XG4gIGlmIChub3RpZmljYXRpb24udGl0bGUgJiYgbm90aWZpY2F0aW9uLnRleHQpIHtcbiAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2codXNlclRva2Vucyk7XG4gICAgfVxuICAgIGFsaXl1blRva2VucyA9IG5ldyBBcnJheTtcbiAgICB4aW5nZVRva2VucyA9IG5ldyBBcnJheTtcbiAgICBodWF3ZWlUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgbWlUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgdXNlclRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uKHVzZXJUb2tlbikge1xuICAgICAgdmFyIGFycjtcbiAgICAgIGFyciA9IHVzZXJUb2tlbi5zcGxpdCgnOicpO1xuICAgICAgaWYgKGFyclswXSA9PT0gXCJhbGl5dW5cIikge1xuICAgICAgICByZXR1cm4gYWxpeXVuVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwieGluZ2VcIikge1xuICAgICAgICByZXR1cm4geGluZ2VUb2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyclswXSA9PT0gXCJodWF3ZWlcIikge1xuICAgICAgICByZXR1cm4gaHVhd2VpVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwibWlcIikge1xuICAgICAgICByZXR1cm4gbWlUb2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFfLmlzRW1wdHkoYWxpeXVuVG9rZW5zKSAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmLmFsaXl1biA6IHZvaWQgMCkpIHtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYWxpeXVuVG9rZW5zOiBcIiArIGFsaXl1blRva2Vucyk7XG4gICAgICB9XG4gICAgICBBTFlQVVNIID0gbmV3IEFMWS5QVVNIKHtcbiAgICAgICAgYWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hY2Nlc3NLZXlJZCxcbiAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5LFxuICAgICAgICBlbmRwb2ludDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmVuZHBvaW50LFxuICAgICAgICBhcGlWZXJzaW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBpVmVyc2lvblxuICAgICAgfSk7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBBcHBLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hcHBLZXksXG4gICAgICAgIFRhcmdldDogJ2RldmljZScsXG4gICAgICAgIFRhcmdldFZhbHVlOiBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKSxcbiAgICAgICAgVGl0bGU6IG5vdGlmaWNhdGlvbi50aXRsZSxcbiAgICAgICAgU3VtbWFyeTogbm90aWZpY2F0aW9uLnRleHRcbiAgICAgIH07XG4gICAgICBBTFlQVVNILnB1c2hOb3RpY2VUb0FuZHJvaWQoZGF0YSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eSh4aW5nZVRva2VucykgJiYgKChyZWYxID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYxLnhpbmdlIDogdm9pZCAwKSkge1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ4aW5nZVRva2VuczogXCIgKyB4aW5nZVRva2Vucyk7XG4gICAgICB9XG4gICAgICBYaW5nZUFwcCA9IG5ldyBYaW5nZS5YaW5nZUFwcChNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5hY2Nlc3NJZCwgTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2Uuc2VjcmV0S2V5KTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlID0gbmV3IFhpbmdlLkFuZHJvaWRNZXNzYWdlO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UudHlwZSA9IFhpbmdlLk1FU1NBR0VfVFlQRV9OT1RJRklDQVRJT047XG4gICAgICBhbmRyb2lkTWVzc2FnZS50aXRsZSA9IG5vdGlmaWNhdGlvbi50aXRsZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLmNvbnRlbnQgPSBub3RpZmljYXRpb24udGV4dDtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnN0eWxlID0gbmV3IFhpbmdlLlN0eWxlO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UuYWN0aW9uID0gbmV3IFhpbmdlLkNsaWNrQWN0aW9uO1xuICAgICAgXy5lYWNoKHhpbmdlVG9rZW5zLCBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiBYaW5nZUFwcC5wdXNoVG9TaW5nbGVEZXZpY2UodCwgYW5kcm9pZE1lc3NhZ2UsIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eShodWF3ZWlUb2tlbnMpICYmICgocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMi5odWF3ZWkgOiB2b2lkIDApKSB7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImh1YXdlaVRva2VuczogXCIgKyBodWF3ZWlUb2tlbnMpO1xuICAgICAgfVxuICAgICAgcGFja2FnZV9uYW1lID0gTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFBrZ05hbWU7XG4gICAgICB0b2tlbkRhdGFMaXN0ID0gW107XG4gICAgICBfLmVhY2goaHVhd2VpVG9rZW5zLCBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0b2tlbkRhdGFMaXN0LnB1c2goe1xuICAgICAgICAgICdwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsXG4gICAgICAgICAgJ3Rva2VuJzogdFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgbm90aSA9IHtcbiAgICAgICAgJ2FuZHJvaWQnOiB7XG4gICAgICAgICAgJ3RpdGxlJzogbm90aWZpY2F0aW9uLnRpdGxlLFxuICAgICAgICAgICdtZXNzYWdlJzogbm90aWZpY2F0aW9uLnRleHRcbiAgICAgICAgfSxcbiAgICAgICAgJ2V4dHJhcyc6IG5vdGlmaWNhdGlvbi5wYXlsb2FkXG4gICAgICB9O1xuICAgICAgSHVhd2VpUHVzaC5jb25maWcoW1xuICAgICAgICB7XG4gICAgICAgICAgJ3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSxcbiAgICAgICAgICAnY2xpZW50X2lkJzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcElkLFxuICAgICAgICAgICdjbGllbnRfc2VjcmV0JzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFNlY3JldFxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICAgIEh1YXdlaVB1c2guc2VuZE1hbnkobm90aSwgdG9rZW5EYXRhTGlzdCk7XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KG1pVG9rZW5zKSAmJiAoKHJlZjMgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjMubWkgOiB2b2lkIDApKSB7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm1pVG9rZW5zOiBcIiArIG1pVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIG1zZyA9IG5ldyBNaVB1c2guTWVzc2FnZTtcbiAgICAgIG1zZy50aXRsZShub3RpZmljYXRpb24udGl0bGUpLmRlc2NyaXB0aW9uKG5vdGlmaWNhdGlvbi50ZXh0KTtcbiAgICAgIG5vdGlmaWNhdGlvbiA9IG5ldyBNaVB1c2guTm90aWZpY2F0aW9uKHtcbiAgICAgICAgcHJvZHVjdGlvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkucHJvZHVjdGlvbixcbiAgICAgICAgYXBwU2VjcmV0OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5hcHBTZWNyZXRcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChtaVRva2VucywgZnVuY3Rpb24ocmVnaWQpIHtcbiAgICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5zZW5kKHJlZ2lkLCBtc2csIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjb25maWcsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgcmVmNjtcbiAgaWYgKCEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5jcm9uKSAhPSBudWxsID8gcmVmLnB1c2hfaW50ZXJ2YWwgOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbmZpZyA9IHtcbiAgICBkZWJ1ZzogdHJ1ZSxcbiAgICBrZWVwTm90aWZpY2F0aW9uczogZmFsc2UsXG4gICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5wdXNoX2ludGVydmFsLFxuICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgIHByb2R1Y3Rpb246IHRydWVcbiAgfTtcbiAgaWYgKCFfLmlzRW1wdHkoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjEuYXBuIDogdm9pZCAwKSkge1xuICAgIGNvbmZpZy5hcG4gPSB7XG4gICAgICBrZXlEYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4ua2V5RGF0YSxcbiAgICAgIGNlcnREYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4uY2VydERhdGFcbiAgICB9O1xuICB9XG4gIGlmICghXy5pc0VtcHR5KChyZWYyID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYyLmdjbSA6IHZvaWQgMCkpIHtcbiAgICBjb25maWcuZ2NtID0ge1xuICAgICAgcHJvamVjdE51bWJlcjogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLnByb2plY3ROdW1iZXIsXG4gICAgICBhcGlLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5hcGlLZXlcbiAgICB9O1xuICB9XG4gIFB1c2guQ29uZmlndXJlKGNvbmZpZyk7XG4gIGlmICgoKChyZWYzID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYzLmFsaXl1biA6IHZvaWQgMCkgfHwgKChyZWY0ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY0LnhpbmdlIDogdm9pZCAwKSB8fCAoKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjUuaHVhd2VpIDogdm9pZCAwKSB8fCAoKHJlZjYgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjYubWkgOiB2b2lkIDApKSAmJiBQdXNoICYmIHR5cGVvZiBQdXNoLnNlbmRHQ00gPT09ICdmdW5jdGlvbicpIHtcbiAgICBQdXNoLm9sZF9zZW5kR0NNID0gUHVzaC5zZW5kR0NNO1xuICAgIFB1c2guc2VuZEFsaXl1biA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIEZpYmVyLCB1c2VyVG9rZW47XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAoTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJUb2tlbnMgPT09ICcnICsgdXNlclRva2Vucykge1xuICAgICAgICB1c2VyVG9rZW5zID0gW3VzZXJUb2tlbnNdO1xuICAgICAgfVxuICAgICAgaWYgKCF1c2VyVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICAgICAgdXNlclRva2VuID0gdXNlclRva2Vucy5sZW5ndGggPT09IDEgPyB1c2VyVG9rZW5zWzBdIDogbnVsbDtcbiAgICAgIHJldHVybiBBbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2coJ0FORFJPSUQgRVJST1I6IHJlc3VsdCBvZiBzZW5kZXI6ICcgKyByZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyIGlzIG51bGwnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlcjogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0LmNhbm9uaWNhbF9pZHMgPT09IDEgJiYgdXNlclRva2VuKSB7XG4gICAgICAgICAgICBGaWJlcihmdW5jdGlvbihzZWxmKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soc2VsZi5vbGRUb2tlbiwgc2VsZi5uZXdUb2tlbik7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnJ1bih7XG4gICAgICAgICAgICAgIG9sZFRva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiB1c2VyVG9rZW5cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmV3VG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IFwiYWxpeXVuOlwiICsgcmVzdWx0LnJlc3VsdHNbMF0ucmVnaXN0cmF0aW9uX2lkXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBfcmVwbGFjZVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdC5mYWlsdXJlICE9PSAwICYmIHVzZXJUb2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhzZWxmLnRva2VuKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkucnVuKHtcbiAgICAgICAgICAgICAgdG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IHVzZXJUb2tlblxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWxsYmFjazogX3JlbW92ZVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgUHVzaC5zZW5kR0NNID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uKSB7XG4gICAgICB2YXIgYWxpeXVuVG9rZW5zLCBnY21Ub2tlbnM7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBmcm9tIGFsaXl1bi0+IFB1c2guc2VuZEdDTScpO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KSkge1xuICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyVG9rZW5zID09PSAnJyArIHVzZXJUb2tlbnMpIHtcbiAgICAgICAgdXNlclRva2VucyA9IFt1c2VyVG9rZW5zXTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlclRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgYWxpeXVuVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5pbmRleE9mKCdhbGl5dW46JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ3hpbmdlOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCdodWF3ZWk6JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ21pOicpID4gLTE7XG4gICAgICB9KTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbGl5dW5Ub2tlbnMgaXMgJywgYWxpeXVuVG9rZW5zLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgZ2NtVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5pbmRleE9mKFwiYWxpeXVuOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwieGluZ2U6XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJodWF3ZWk6XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJtaTpcIikgPCAwO1xuICAgICAgfSk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2NtVG9rZW5zIGlzICcsIGdjbVRva2Vucy50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIFB1c2guc2VuZEFsaXl1bihhbGl5dW5Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEdDTShnY21Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgfTtcbiAgICBQdXNoLm9sZF9zZW5kQVBOID0gUHVzaC5zZW5kQVBOO1xuICAgIHJldHVybiBQdXNoLnNlbmRBUE4gPSBmdW5jdGlvbih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIG5vdGk7XG4gICAgICBpZiAobm90aWZpY2F0aW9uLnRpdGxlICYmIG5vdGlmaWNhdGlvbi50ZXh0KSB7XG4gICAgICAgIG5vdGkgPSBfLmNsb25lKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIG5vdGkudGV4dCA9IG5vdGkudGl0bGUgKyBcIiBcIiArIG5vdGkudGV4dDtcbiAgICAgICAgbm90aS50aXRsZSA9IFwiXCI7XG4gICAgICAgIHJldHVybiBQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iXX0=
