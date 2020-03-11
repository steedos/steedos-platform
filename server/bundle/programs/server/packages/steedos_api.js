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
      return newFile.on('stored', function (storeName) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3BhcnNlX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFyc2VfZmlsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvbGliL3Jlc3RpdnVzL2lyb24tcm91dGVyLWVycm9yLXRvLXJlc3BvbnNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3N0ZWVkb3Mvc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zdGVlZG9zL3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsIkJ1c2JveSIsIkZpYmVyIiwicmVxdWlyZSIsIkpzb25Sb3V0ZXMiLCJwYXJzZUZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImZpbGVzIiwibWV0aG9kIiwiaGVhZGVycyIsIm9uIiwiZmllbGRuYW1lIiwiZmlsZSIsImZpbGVuYW1lIiwiZW5jb2RpbmciLCJtaW1ldHlwZSIsImJ1ZmZlcnMiLCJpbWFnZSIsIm1pbWVUeXBlIiwiZGF0YSIsInB1c2giLCJCdWZmZXIiLCJjb25jYXQiLCJ2YWx1ZSIsImJvZHkiLCJydW4iLCJwaXBlIiwiZ2V0VXNlclF1ZXJ5U2VsZWN0b3IiLCJ1c2VyVmFsaWRhdG9yIiwiQXV0aCIsIk1hdGNoIiwiV2hlcmUiLCJ1c2VyIiwiY2hlY2siLCJpZCIsIk9wdGlvbmFsIiwiU3RyaW5nIiwidXNlcm5hbWUiLCJlbWFpbCIsIl8iLCJrZXlzIiwibGVuZ3RoIiwiRXJyb3IiLCJsb2dpbldpdGhQYXNzd29yZCIsInBhc3N3b3JkIiwiYXV0aFRva2VuIiwiYXV0aGVudGljYXRpbmdVc2VyIiwiYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IiLCJoYXNoZWRUb2tlbiIsInBhc3N3b3JkVmVyaWZpY2F0aW9uIiwicmVmIiwic3BhY2VfdXNlcnMiLCJzcGFjZXMiLCJNZXRlb3IiLCJ1c2VycyIsImZpbmRPbmUiLCJzZXJ2aWNlcyIsIkFjY291bnRzIiwiX2NoZWNrUGFzc3dvcmQiLCJlcnJvciIsIl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuIiwiX2hhc2hTdGFtcGVkVG9rZW4iLCJfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiIsIl9pZCIsImRiIiwiZmluZCIsImZldGNoIiwiZWFjaCIsInN1Iiwic3BhY2UiLCJpc19wYWlkIiwiaW5kZXhPZiIsImFkbWlucyIsIm5hbWUiLCJ0b2tlbiIsInVzZXJJZCIsImFkbWluU3BhY2VzIiwiZW52IiwicHJvY2VzcyIsIk5PREVfRU5WIiwiaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UiLCJlcnIiLCJzdGF0dXNDb2RlIiwic3RhdHVzIiwibXNnIiwic3RhY2siLCJ0b1N0cmluZyIsImNvbnNvbGUiLCJoZWFkZXJzU2VudCIsInNvY2tldCIsImRlc3Ryb3kiLCJzZXRIZWFkZXIiLCJieXRlTGVuZ3RoIiwiZW5kIiwic2hhcmUiLCJSb3V0ZSIsImFwaSIsInBhdGgiLCJvcHRpb25zIiwiZW5kcG9pbnRzMSIsImVuZHBvaW50cyIsInByb3RvdHlwZSIsImFkZFRvQXBpIiwiYXZhaWxhYmxlTWV0aG9kcyIsImFsbG93ZWRNZXRob2RzIiwiZnVsbFBhdGgiLCJyZWplY3RlZE1ldGhvZHMiLCJzZWxmIiwiY29udGFpbnMiLCJfY29uZmlnIiwicGF0aHMiLCJleHRlbmQiLCJkZWZhdWx0T3B0aW9uc0VuZHBvaW50IiwiX3Jlc29sdmVFbmRwb2ludHMiLCJfY29uZmlndXJlRW5kcG9pbnRzIiwiZmlsdGVyIiwicmVqZWN0IiwiYXBpUGF0aCIsImVuZHBvaW50IiwiYWRkIiwiZG9uZUZ1bmMiLCJlbmRwb2ludENvbnRleHQiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZUluaXRpYXRlZCIsInVybFBhcmFtcyIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicXVlcnkiLCJib2R5UGFyYW1zIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZG9uZSIsIl9jYWxsRW5kcG9pbnQiLCJlcnJvcjEiLCJfcmVzcG9uZCIsIm1lc3NhZ2UiLCJqb2luIiwidG9VcHBlckNhc2UiLCJpc0Z1bmN0aW9uIiwiYWN0aW9uIiwicmVmMSIsInJlZjIiLCJyb2xlUmVxdWlyZWQiLCJ1bmlvbiIsImlzRW1wdHkiLCJhdXRoUmVxdWlyZWQiLCJzcGFjZVJlcXVpcmVkIiwiaW52b2NhdGlvbiIsIl9hdXRoQWNjZXB0ZWQiLCJfcm9sZUFjY2VwdGVkIiwiX3NwYWNlQWNjZXB0ZWQiLCJERFBDb21tb24iLCJNZXRob2RJbnZvY2F0aW9uIiwiaXNTaW11bGF0aW9uIiwiY29ubmVjdGlvbiIsInJhbmRvbVNlZWQiLCJtYWtlUnBjU2VlZCIsIkREUCIsIl9DdXJyZW50SW52b2NhdGlvbiIsIndpdGhWYWx1ZSIsImNhbGwiLCJfYXV0aGVudGljYXRlIiwiYXV0aCIsInVzZXJTZWxlY3RvciIsInNwYWNlX3VzZXJzX2NvdW50Iiwic3BhY2VJZCIsImNvdW50IiwiaW50ZXJzZWN0aW9uIiwicm9sZXMiLCJkZWZhdWx0SGVhZGVycyIsImRlbGF5SW5NaWxsaXNlY29uZHMiLCJtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyIsInJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvIiwic2VuZFJlc3BvbnNlIiwiX2xvd2VyQ2FzZUtleXMiLCJtYXRjaCIsInByZXR0eUpzb24iLCJKU09OIiwic3RyaW5naWZ5Iiwid3JpdGVIZWFkIiwid3JpdGUiLCJNYXRoIiwicmFuZG9tIiwic2V0VGltZW91dCIsIm9iamVjdCIsImNoYWluIiwicGFpcnMiLCJtYXAiLCJhdHRyIiwidG9Mb3dlckNhc2UiLCJSZXN0aXZ1cyIsIml0ZW0iLCJpIiwibCIsImNvcnNIZWFkZXJzIiwiX3JvdXRlcyIsInVzZURlZmF1bHRBdXRoIiwidmVyc2lvbiIsIl91c2VyIiwiX2hhc2hMb2dpblRva2VuIiwiZW5hYmxlQ29ycyIsInNsaWNlIiwibGFzdCIsIl9pbml0QXV0aCIsInVzZUF1dGgiLCJ3YXJuIiwiYWRkUm91dGUiLCJyb3V0ZSIsImFkZENvbGxlY3Rpb24iLCJjb2xsZWN0aW9uIiwiY29sbGVjdGlvbkVuZHBvaW50cyIsImNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyIsImVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiIsImVudGl0eVJvdXRlRW5kcG9pbnRzIiwiZXhjbHVkZWRFbmRwb2ludHMiLCJtZXRob2RzIiwibWV0aG9kc09uQ29sbGVjdGlvbiIsInJvdXRlT3B0aW9ucyIsIl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyIsIl9jb2xsZWN0aW9uRW5kcG9pbnRzIiwiX25hbWUiLCJjb25maWd1cmVkRW5kcG9pbnQiLCJlbmRwb2ludE9wdGlvbnMiLCJtZXRob2RUeXBlIiwiY2xvbmUiLCJnZXQiLCJlbnRpdHkiLCJzZWxlY3RvciIsInB1dCIsImVudGl0eUlzVXBkYXRlZCIsInVwZGF0ZSIsIiRzZXQiLCJyZW1vdmUiLCJwb3N0IiwiZW50aXR5SWQiLCJpbnNlcnQiLCJnZXRBbGwiLCJlbnRpdGllcyIsImZpZWxkcyIsInByb2ZpbGUiLCJjcmVhdGVVc2VyIiwibG9nb3V0IiwiZSIsImV4dHJhRGF0YSIsInNlYXJjaFF1ZXJ5IiwicmVhc29uIiwib25Mb2dnZWRJbiIsImV4dHJhIiwiaW5kZXgiLCJ0b2tlbkZpZWxkTmFtZSIsInRva2VuTG9jYXRpb24iLCJ0b2tlblBhdGgiLCJ0b2tlblJlbW92YWxRdWVyeSIsInRva2VuVG9SZW1vdmUiLCJsYXN0SW5kZXhPZiIsInN1YnN0cmluZyIsIiRwdWxsIiwib25Mb2dnZWRPdXQiLCJpc1NlcnZlciIsIkFQSSIsInN0YXJ0dXAiLCJvcmdhbml6YXRpb25zIiwiY2ZzIiwiaW5zdGFuY2VzIiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImF0dGFjaERhdGEiLCJ0eXBlIiwiZmlsZU9iaiIsIm1ldGFkYXRhIiwicGFyZW50IiwiciIsImluY2x1ZGVzIiwibW9tZW50IiwiRGF0ZSIsImZvcm1hdCIsInNwbGl0IiwicG9wIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwicmVwbGFjZSIsIm93bmVyIiwib3duZXJfbmFtZSIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsImlzX3ByaXZhdGUiLCJtYWluIiwiJHVuc2V0IiwibG9ja2VkX2J5IiwibG9ja2VkX2J5X25hbWUiLCIkbmUiLCJzdG9yZU5hbWUiLCJyZXNwIiwic2l6ZSIsIm9yaWdpbmFsIiwidmVyc2lvbl9pZCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsInB1c2hUb3BpYyIsInVzZXJJZHMiLCJmcm9tIiwiYXBwTmFtZSIsImFsZXJ0VGl0bGUiLCJhbGVydCIsImJhZGdlIiwic291bmQiLCJQdXNoIiwic2VuZCIsInB1c2hTZW5kIiwidGV4dCIsInRpdGxlIiwiQUxZIiwiQWxpeXVuX3B1c2giLCJId1B1c2giLCJNaVB1c2giLCJYaW5nZSIsInNlbmRNZXNzYWdlIiwidXNlclRva2VucyIsIm5vdGlmaWNhdGlvbiIsImNhbGxiYWNrIiwiQUxZUFVTSCIsIlhpbmdlQXBwIiwiYWxpeXVuVG9rZW5zIiwiYW5kcm9pZE1lc3NhZ2UiLCJodWF3ZWlUb2tlbnMiLCJtaVRva2VucyIsIm5vdGkiLCJwYWNrYWdlX25hbWUiLCJyZWYzIiwidG9rZW5EYXRhTGlzdCIsInhpbmdlVG9rZW5zIiwiZGVidWciLCJsb2ciLCJBcnJheSIsImZvckVhY2giLCJ1c2VyVG9rZW4iLCJhcnIiLCJzZXR0aW5ncyIsImFsaXl1biIsIlBVU0giLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsImFwaVZlcnNpb24iLCJBcHBLZXkiLCJhcHBLZXkiLCJUYXJnZXQiLCJUYXJnZXRWYWx1ZSIsIlRpdGxlIiwiU3VtbWFyeSIsInB1c2hOb3RpY2VUb0FuZHJvaWQiLCJ4aW5nZSIsImFjY2Vzc0lkIiwic2VjcmV0S2V5IiwiQW5kcm9pZE1lc3NhZ2UiLCJNRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OIiwiY29udGVudCIsInN0eWxlIiwiU3R5bGUiLCJDbGlja0FjdGlvbiIsInQiLCJwdXNoVG9TaW5nbGVEZXZpY2UiLCJodWF3ZWkiLCJhcHBQa2dOYW1lIiwicGF5bG9hZCIsIkh1YXdlaVB1c2giLCJjb25maWciLCJhcHBJZCIsImFwcFNlY3JldCIsInNlbmRNYW55IiwibWkiLCJNZXNzYWdlIiwiZGVzY3JpcHRpb24iLCJOb3RpZmljYXRpb24iLCJwcm9kdWN0aW9uIiwicmVnaWQiLCJyZWY0IiwicmVmNSIsInJlZjYiLCJjcm9uIiwicHVzaF9pbnRlcnZhbCIsImtlZXBOb3RpZmljYXRpb25zIiwic2VuZEludGVydmFsIiwic2VuZEJhdGNoU2l6ZSIsImFwbiIsImtleURhdGEiLCJjZXJ0RGF0YSIsImdjbSIsInByb2plY3ROdW1iZXIiLCJhcGlLZXkiLCJDb25maWd1cmUiLCJzZW5kR0NNIiwib2xkX3NlbmRHQ00iLCJzZW5kQWxpeXVuIiwidGVzdCIsIk9iamVjdCIsInJlc3VsdCIsImNhbm9uaWNhbF9pZHMiLCJvbGRUb2tlbiIsIm5ld1Rva2VuIiwicmVzdWx0cyIsInJlZ2lzdHJhdGlvbl9pZCIsIl9yZXBsYWNlVG9rZW4iLCJmYWlsdXJlIiwiX3JlbW92ZVRva2VuIiwiZ2NtVG9rZW5zIiwib2xkX3NlbmRBUE4iLCJzZW5kQVBOIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQkgsZ0JBQWdCLENBQUM7QUFDaEIsZ0JBQWMsU0FERTtBQUVoQkksUUFBTSxFQUFFLFVBRlE7QUFHaEJDLFNBQU8sRUFBRSxTQUhPO0FBSWhCLFNBQU8sU0FKUztBQUtoQixTQUFPLFVBTFM7QUFNaEIs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QUFhLFNBQWIsSUFBMEIsQ0FBekYsSUFBK0Z3SCxLQUFLeEgsT0FBTCxDQUFhLEtBQWIsSUFBc0IsQ0M4QnJIO0FEL0JPLFFBQVo7O0FBR0EsVUFBRzZPLEtBQUt5QixLQUFSO0FBQ0N0UCxnQkFBUXVQLEdBQVIsQ0FBWSxlQUFaLEVBQThCd0UsVUFBVWhVLFFBQVYsRUFBOUI7QUMrQkc7O0FEN0JKOE4sV0FBS3NGLFVBQUwsQ0FBZ0J0RSxZQUFoQixFQUE4QkosWUFBOUI7QUMrQkcsYUQ3QkhaLEtBQUtxRixXQUFMLENBQWlCYSxTQUFqQixFQUE0QnRGLFlBQTVCLENDNkJHO0FEMURXLEtBQWY7O0FBK0JBWixTQUFLbUcsV0FBTCxHQUFtQm5HLEtBQUtvRyxPQUF4QjtBQzhCRSxXRDdCRnBHLEtBQUtvRyxPQUFMLEdBQWUsVUFBQ3ZFLFNBQUQsRUFBWWpCLFlBQVo7QUFDZCxVQUFBUSxJQUFBOztBQUFBLFVBQUdSLGFBQWFSLEtBQWIsSUFBdUJRLGFBQWFULElBQXZDO0FBQ0NpQixlQUFPalMsRUFBRXlMLEtBQUYsQ0FBUWdHLFlBQVIsQ0FBUDtBQUNBUSxhQUFLakIsSUFBTCxHQUFZaUIsS0FBS2hCLEtBQUwsR0FBYSxHQUFiLEdBQW1CZ0IsS0FBS2pCLElBQXBDO0FBQ0FpQixhQUFLaEIsS0FBTCxHQUFhLEVBQWI7QUMrQkksZUQ5QkpKLEtBQUttRyxXQUFMLENBQWlCdEUsU0FBakIsRUFBNEJULElBQTVCLENDOEJJO0FEbENMO0FDb0NLLGVEOUJKcEIsS0FBS21HLFdBQUwsQ0FBaUJ0RSxTQUFqQixFQUE0QmpCLFlBQTVCLENDOEJJO0FBQ0Q7QUR0Q1UsS0M2QmI7QUFXRDtBRHhKSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0J2FsaXl1bi1zZGsnOiAnPj0xLjkuMicsXHJcblx0YnVzYm95OiBcIj49MC4yLjEzXCIsXHJcblx0Y29va2llczogXCI+PTAuNi4yXCIsXHJcblx0J2Nzdic6IFwiPj01LjEuMlwiLFxyXG5cdCd1cmwnOiAnPj0wLjEwLjAnLFxyXG5cdCdyZXF1ZXN0JzogJz49Mi44MS4wJyxcclxuXHQneGluZ2UnOiAnPj0xLjEuMycsXHJcblx0J2h1YXdlaS1wdXNoJzogJz49MC4wLjYtMCcsXHJcblx0J3hpYW9taS1wdXNoJzogJz49MC40LjUnXHJcbn0sICdzdGVlZG9zOmFwaScpOyIsIkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xyXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xyXG5cclxuSnNvblJvdXRlcy5wYXJzZUZpbGVzID0gKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdGZpbGVzID0gW107ICMgU3RvcmUgZmlsZXMgaW4gYW4gYXJyYXkgYW5kIHRoZW4gcGFzcyB0aGVtIHRvIHJlcXVlc3QuXHJcblxyXG5cdGlmIChyZXEubWV0aG9kID09IFwiUE9TVFwiKVxyXG5cdFx0YnVzYm95ID0gbmV3IEJ1c2JveSh7IGhlYWRlcnM6IHJlcS5oZWFkZXJzIH0pO1xyXG5cdFx0YnVzYm95Lm9uIFwiZmlsZVwiLCAgKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkgLT5cclxuXHRcdFx0aW1hZ2UgPSB7fTsgIyBjcmF0ZSBhbiBpbWFnZSBvYmplY3RcclxuXHRcdFx0aW1hZ2UubWltZVR5cGUgPSBtaW1ldHlwZTtcclxuXHRcdFx0aW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcclxuXHRcdFx0aW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcclxuXHJcblx0XHRcdCMgYnVmZmVyIHRoZSByZWFkIGNodW5rc1xyXG5cdFx0XHRidWZmZXJzID0gW107XHJcblxyXG5cdFx0XHRmaWxlLm9uICdkYXRhJywgKGRhdGEpIC0+XHJcblx0XHRcdFx0YnVmZmVycy5wdXNoKGRhdGEpO1xyXG5cclxuXHRcdFx0ZmlsZS5vbiAnZW5kJywgKCkgLT5cclxuXHRcdFx0XHQjIGNvbmNhdCB0aGUgY2h1bmtzXHJcblx0XHRcdFx0aW1hZ2UuZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XHJcblx0XHRcdFx0IyBwdXNoIHRoZSBpbWFnZSBvYmplY3QgdG8gdGhlIGZpbGUgYXJyYXlcclxuXHRcdFx0XHRmaWxlcy5wdXNoKGltYWdlKTtcclxuXHJcblxyXG5cdFx0YnVzYm95Lm9uIFwiZmllbGRcIiwgKGZpZWxkbmFtZSwgdmFsdWUpIC0+XHJcblx0XHRcdHJlcS5ib2R5W2ZpZWxkbmFtZV0gPSB2YWx1ZTtcclxuXHJcblx0XHRidXNib3kub24gXCJmaW5pc2hcIiwgICgpIC0+XHJcblx0XHRcdCMgUGFzcyB0aGUgZmlsZSBhcnJheSB0b2dldGhlciB3aXRoIHRoZSByZXF1ZXN0XHJcblx0XHRcdHJlcS5maWxlcyA9IGZpbGVzO1xyXG5cclxuXHRcdFx0RmliZXIgKCktPlxyXG5cdFx0XHRcdG5leHQoKTtcclxuXHRcdFx0LnJ1bigpO1xyXG5cclxuXHRcdCMgUGFzcyByZXF1ZXN0IHRvIGJ1c2JveVxyXG5cdFx0cmVxLnBpcGUoYnVzYm95KTtcclxuXHJcblx0ZWxzZVxyXG5cdFx0bmV4dCgpO1xyXG5cclxuXHJcbiNKc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKEpzb25Sb3V0ZXMucGFyc2VGaWxlcyk7IiwidmFyIEJ1c2JveSwgRmliZXI7XG5cbkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLnBhcnNlRmlsZXMgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYnVzYm95LCBmaWxlcztcbiAgZmlsZXMgPSBbXTtcbiAgaWYgKHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgYnVzYm95ID0gbmV3IEJ1c2JveSh7XG4gICAgICBoZWFkZXJzOiByZXEuaGVhZGVyc1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpbGVcIiwgZnVuY3Rpb24oZmllbGRuYW1lLCBmaWxlLCBmaWxlbmFtZSwgZW5jb2RpbmcsIG1pbWV0eXBlKSB7XG4gICAgICB2YXIgYnVmZmVycywgaW1hZ2U7XG4gICAgICBpbWFnZSA9IHt9O1xuICAgICAgaW1hZ2UubWltZVR5cGUgPSBtaW1ldHlwZTtcbiAgICAgIGltYWdlLmVuY29kaW5nID0gZW5jb2Rpbmc7XG4gICAgICBpbWFnZS5maWxlbmFtZSA9IGZpbGVuYW1lO1xuICAgICAgYnVmZmVycyA9IFtdO1xuICAgICAgZmlsZS5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcnMucHVzaChkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZpbGUub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpbWFnZS5kYXRhID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKTtcbiAgICAgICAgcmV0dXJuIGZpbGVzLnB1c2goaW1hZ2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmllbGRcIiwgZnVuY3Rpb24oZmllbGRuYW1lLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlcS5ib2R5W2ZpZWxkbmFtZV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaW5pc2hcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXEuZmlsZXMgPSBmaWxlcztcbiAgICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgIH0pLnJ1bigpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXEucGlwZShidXNib3kpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXh0KCk7XG4gIH1cbn07XG4iLCJAQXV0aCBvcj0ge31cclxuXHJcbiMjI1xyXG4gIEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcclxuIyMjXHJcbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZSAodXNlcikgLT5cclxuICBjaGVjayB1c2VyLFxyXG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xyXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xyXG4gICAgZW1haWw6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xyXG5cclxuICBpZiBfLmtleXModXNlcikubGVuZ3RoIGlzIG5vdCAxXHJcbiAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IgJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnXHJcblxyXG4gIHJldHVybiB0cnVlXHJcblxyXG5cclxuIyMjXHJcbiAgUmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxyXG4jIyNcclxuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSAodXNlcikgLT5cclxuICBpZiB1c2VyLmlkXHJcbiAgICByZXR1cm4geydfaWQnOiB1c2VyLmlkfVxyXG4gIGVsc2UgaWYgdXNlci51c2VybmFtZVxyXG4gICAgcmV0dXJuIHsndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lfVxyXG4gIGVsc2UgaWYgdXNlci5lbWFpbFxyXG4gICAgcmV0dXJuIHsnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsfVxyXG5cclxuICAjIFdlIHNob3VsZG4ndCBiZSBoZXJlIGlmIHRoZSB1c2VyIG9iamVjdCB3YXMgcHJvcGVybHkgdmFsaWRhdGVkXHJcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJ1xyXG5cclxuXHJcbiMjI1xyXG4gIExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxyXG4jIyNcclxuQEF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSAodXNlciwgcGFzc3dvcmQpIC0+XHJcbiAgaWYgbm90IHVzZXIgb3Igbm90IHBhc3N3b3JkXHJcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcbiAgIyBWYWxpZGF0ZSB0aGUgbG9naW4gaW5wdXQgdHlwZXNcclxuICBjaGVjayB1c2VyLCB1c2VyVmFsaWRhdG9yXHJcbiAgY2hlY2sgcGFzc3dvcmQsIFN0cmluZ1xyXG5cclxuICAjIFJldHJpZXZlIHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXHJcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKVxyXG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKVxyXG5cclxuICBpZiBub3QgYXV0aGVudGljYXRpbmdVc2VyXHJcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuICBpZiBub3QgYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzPy5wYXNzd29yZFxyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG4gICMgQXV0aGVudGljYXRlIHRoZSB1c2VyJ3MgcGFzc3dvcmRcclxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmRcclxuICBpZiBwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvclxyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG4gICMgQWRkIGEgbmV3IGF1dGggdG9rZW4gdG8gdGhlIHVzZXIncyBhY2NvdW50XHJcbiAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKVxyXG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4gYXV0aFRva2VuXHJcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4gYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW5cclxuXHJcbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkfSkuZmV0Y2goKVxyXG4gIHNwYWNlcyA9IFtdXHJcbiAgXy5lYWNoIHNwYWNlX3VzZXJzLCAoc3UpLT5cclxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpXHJcbiAgICAjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcclxuICAgIGlmIHNwYWNlPy5pc19wYWlkIGFuZCBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBzdS51c2VyKT49MFxyXG4gICAgICBzcGFjZXMucHVzaFxyXG4gICAgICAgIF9pZDogc3BhY2UuX2lkXHJcbiAgICAgICAgbmFtZTogc3BhY2UubmFtZVxyXG4gIHJldHVybiB7YXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgYWRtaW5TcGFjZXM6IHNwYWNlc31cclxuIiwidmFyIGdldFVzZXJRdWVyeVNlbGVjdG9yLCB1c2VyVmFsaWRhdG9yO1xuXG50aGlzLkF1dGggfHwgKHRoaXMuQXV0aCA9IHt9KTtcblxuXG4vKlxuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4gKi9cblxudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlKGZ1bmN0aW9uKHVzZXIpIHtcbiAgY2hlY2sodXNlciwge1xuICAgIGlkOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpXG4gIH0pO1xuICBpZiAoXy5rZXlzKHVzZXIpLmxlbmd0aCA9PT0gITEpIHtcbiAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IoJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5cbi8qXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiAqL1xuXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgaWYgKHVzZXIuaWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ19pZCc6IHVzZXIuaWRcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3VzZXJuYW1lJzogdXNlci51c2VybmFtZVxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci5lbWFpbCkge1xuICAgIHJldHVybiB7XG4gICAgICAnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsXG4gICAgfTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInKTtcbn07XG5cblxuLypcbiAgTG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXG4gKi9cblxudGhpcy5BdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gZnVuY3Rpb24odXNlciwgcGFzc3dvcmQpIHtcbiAgdmFyIGF1dGhUb2tlbiwgYXV0aGVudGljYXRpbmdVc2VyLCBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciwgaGFzaGVkVG9rZW4sIHBhc3N3b3JkVmVyaWZpY2F0aW9uLCByZWYsIHNwYWNlX3VzZXJzLCBzcGFjZXM7XG4gIGlmICghdXNlciB8fCAhcGFzc3dvcmQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGNoZWNrKHVzZXIsIHVzZXJWYWxpZGF0b3IpO1xuICBjaGVjayhwYXNzd29yZCwgU3RyaW5nKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpO1xuICBpZiAoIWF1dGhlbnRpY2F0aW5nVXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaWYgKCEoKHJlZiA9IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IHJlZi5wYXNzd29yZCA6IHZvaWQgMCkpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZCk7XG4gIGlmIChwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKTtcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbihhdXRoVG9rZW4pO1xuICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbihhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlbik7XG4gIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZFxuICB9KS5mZXRjaCgpO1xuICBzcGFjZXMgPSBbXTtcbiAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbihzdSkge1xuICAgIHZhciBzcGFjZTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKTtcbiAgICBpZiAoKHNwYWNlICE9IG51bGwgPyBzcGFjZS5pc19wYWlkIDogdm9pZCAwKSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBzdS51c2VyKSA+PSAwKSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2goe1xuICAgICAgICBfaWQ6IHNwYWNlLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2UubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBhdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbixcbiAgICB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsXG4gICAgYWRtaW5TcGFjZXM6IHNwYWNlc1xuICB9O1xufTtcbiIsIi8vIFdlIG5lZWQgYSBmdW5jdGlvbiB0aGF0IHRyZWF0cyB0aHJvd24gZXJyb3JzIGV4YWN0bHkgbGlrZSBJcm9uIFJvdXRlciB3b3VsZC5cclxuLy8gVGhpcyBmaWxlIGlzIHdyaXR0ZW4gaW4gSmF2YVNjcmlwdCB0byBlbmFibGUgY29weS1wYXN0aW5nIElyb24gUm91dGVyIGNvZGUuXHJcblxyXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0wzXHJcbnZhciBlbnYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMNDdcclxuaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UgPSBmdW5jdGlvbiAoZXJyLCByZXEsIHJlcykge1xyXG4gIGlmIChyZXMuc3RhdHVzQ29kZSA8IDQwMClcclxuICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG5cclxuICBpZiAoZXJyLnN0YXR1cylcclxuICAgIHJlcy5zdGF0dXNDb2RlID0gZXJyLnN0YXR1cztcclxuXHJcbiAgaWYgKGVudiA9PT0gJ2RldmVsb3BtZW50JylcclxuICAgIG1zZyA9IChlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpICsgJ1xcbic7XHJcbiAgZWxzZVxyXG4gICAgLy9YWFggZ2V0IHRoaXMgZnJvbSBzdGFuZGFyZCBkaWN0IG9mIGVycm9yIG1lc3NhZ2VzP1xyXG4gICAgbXNnID0gJ1NlcnZlciBlcnJvci4nO1xyXG5cclxuICBjb25zb2xlLmVycm9yKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSk7XHJcblxyXG4gIGlmIChyZXMuaGVhZGVyc1NlbnQpXHJcbiAgICByZXR1cm4gcmVxLnNvY2tldC5kZXN0cm95KCk7XHJcblxyXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L2h0bWwnKTtcclxuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIEJ1ZmZlci5ieXRlTGVuZ3RoKG1zZykpO1xyXG4gIGlmIChyZXEubWV0aG9kID09PSAnSEVBRCcpXHJcbiAgICByZXR1cm4gcmVzLmVuZCgpO1xyXG4gIHJlcy5lbmQobXNnKTtcclxuICByZXR1cm47XHJcbn1cclxuIiwiY2xhc3Mgc2hhcmUuUm91dGVcclxuXHJcbiAgY29uc3RydWN0b3I6IChAYXBpLCBAcGF0aCwgQG9wdGlvbnMsIEBlbmRwb2ludHMpIC0+XHJcbiAgICAjIENoZWNrIGlmIG9wdGlvbnMgd2VyZSBwcm92aWRlZFxyXG4gICAgaWYgbm90IEBlbmRwb2ludHNcclxuICAgICAgQGVuZHBvaW50cyA9IEBvcHRpb25zXHJcbiAgICAgIEBvcHRpb25zID0ge31cclxuXHJcblxyXG4gIGFkZFRvQXBpOiBkbyAtPlxyXG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ11cclxuXHJcbiAgICByZXR1cm4gLT5cclxuICAgICAgc2VsZiA9IHRoaXNcclxuXHJcbiAgICAgICMgVGhyb3cgYW4gZXJyb3IgaWYgYSByb3V0ZSBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIGF0IHRoaXMgcGF0aFxyXG4gICAgICAjIFRPRE86IENoZWNrIGZvciBjb2xsaXNpb25zIHdpdGggcGF0aHMgdGhhdCBmb2xsb3cgc2FtZSBwYXR0ZXJuIHdpdGggZGlmZmVyZW50IHBhcmFtZXRlciBuYW1lc1xyXG4gICAgICBpZiBfLmNvbnRhaW5zIEBhcGkuX2NvbmZpZy5wYXRocywgQHBhdGhcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogI3tAcGF0aH1cIlxyXG5cclxuICAgICAgIyBPdmVycmlkZSB0aGUgZGVmYXVsdCBPUFRJT05TIGVuZHBvaW50IHdpdGggb3VyIG93blxyXG4gICAgICBAZW5kcG9pbnRzID0gXy5leHRlbmQgb3B0aW9uczogQGFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQsIEBlbmRwb2ludHNcclxuXHJcbiAgICAgICMgQ29uZmlndXJlIGVhY2ggZW5kcG9pbnQgb24gdGhpcyByb3V0ZVxyXG4gICAgICBAX3Jlc29sdmVFbmRwb2ludHMoKVxyXG4gICAgICBAX2NvbmZpZ3VyZUVuZHBvaW50cygpXHJcblxyXG4gICAgICAjIEFkZCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyBwYXRoc1xyXG4gICAgICBAYXBpLl9jb25maWcucGF0aHMucHVzaCBAcGF0aFxyXG5cclxuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlciBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxyXG4gICAgICByZWplY3RlZE1ldGhvZHMgPSBfLnJlamVjdCBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxyXG5cclxuICAgICAgIyBTZXR1cCBlbmRwb2ludHMgb24gcm91dGVcclxuICAgICAgZnVsbFBhdGggPSBAYXBpLl9jb25maWcuYXBpUGF0aCArIEBwYXRoXHJcbiAgICAgIF8uZWFjaCBhbGxvd2VkTWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF1cclxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XHJcbiAgICAgICAgICAjIEFkZCBmdW5jdGlvbiB0byBlbmRwb2ludCBjb250ZXh0IGZvciBpbmRpY2F0aW5nIGEgcmVzcG9uc2UgaGFzIGJlZW4gaW5pdGlhdGVkIG1hbnVhbGx5XHJcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlXHJcbiAgICAgICAgICBkb25lRnVuYyA9IC0+XHJcbiAgICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9XHJcbiAgICAgICAgICAgIHVybFBhcmFtczogcmVxLnBhcmFtc1xyXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogcmVxLnF1ZXJ5XHJcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5XHJcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxyXG4gICAgICAgICAgICByZXNwb25zZTogcmVzXHJcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXHJcbiAgICAgICAgICAjIEFkZCBlbmRwb2ludCBjb25maWcgb3B0aW9ucyB0byBjb250ZXh0XHJcbiAgICAgICAgICBfLmV4dGVuZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcblxyXG4gICAgICAgICAgIyBSdW4gdGhlIHJlcXVlc3RlZCBlbmRwb2ludFxyXG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gbnVsbFxyXG4gICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcbiAgICAgICAgICBjYXRjaCBlcnJvclxyXG4gICAgICAgICAgICAjIERvIGV4YWN0bHkgd2hhdCBJcm9uIFJvdXRlciB3b3VsZCBoYXZlIGRvbmUsIHRvIGF2b2lkIGNoYW5naW5nIHRoZSBBUElcclxuICAgICAgICAgICAgaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgaWYgcmVzcG9uc2VJbml0aWF0ZWRcclxuICAgICAgICAgICAgIyBFbnN1cmUgdGhlIHJlc3BvbnNlIGlzIHByb3Blcmx5IGNvbXBsZXRlZFxyXG4gICAgICAgICAgICByZXMuZW5kKClcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGlmIHJlcy5oZWFkZXJzU2VudFxyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcclxuICAgICAgICAgICAgZWxzZSBpZiByZXNwb25zZURhdGEgaXMgbnVsbCBvciByZXNwb25zZURhdGEgaXMgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxyXG5cclxuICAgICAgICAgICMgR2VuZXJhdGUgYW5kIHJldHVybiB0aGUgaHR0cCByZXNwb25zZSwgaGFuZGxpbmcgdGhlIGRpZmZlcmVudCBlbmRwb2ludCByZXNwb25zZSB0eXBlc1xyXG4gICAgICAgICAgaWYgcmVzcG9uc2VEYXRhLmJvZHkgYW5kIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSBvciByZXNwb25zZURhdGEuaGVhZGVycylcclxuICAgICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnNcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YVxyXG5cclxuICAgICAgXy5lYWNoIHJlamVjdGVkTWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XHJcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXHJcbiAgICAgICAgICBoZWFkZXJzID0gJ0FsbG93JzogYWxsb3dlZE1ldGhvZHMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnNcclxuXHJcblxyXG4gICMjI1xyXG4gICAgQ29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXHJcbiAgICBmdW5jdGlvblxyXG5cclxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xyXG4gICMjI1xyXG4gIF9yZXNvbHZlRW5kcG9pbnRzOiAtPlxyXG4gICAgXy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIC0+XHJcbiAgICAgIGlmIF8uaXNGdW5jdGlvbihlbmRwb2ludClcclxuICAgICAgICBlbmRwb2ludHNbbWV0aG9kXSA9IHthY3Rpb246IGVuZHBvaW50fVxyXG4gICAgcmV0dXJuXHJcblxyXG5cclxuICAjIyNcclxuICAgIENvbmZpZ3VyZSB0aGUgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnQgb24gYWxsIGVuZHBvaW50cyAoZXhjZXB0IE9QVElPTlMsIHdoaWNoIG11c3RcclxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxyXG5cclxuICAgIEF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3IgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuXHJcbiAgICBlbnRpcmUgcm91dGUsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZCBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbFxyXG4gICAgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXHJcblxyXG4gICAgQWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXHJcbiAgICBhY2Nlc3NlZCBhdCA8Y29kZT5lbmRwb2ludC5hdXRoUmVxdWlyZWQ8L2NvZGU+IGFuZCA8Y29kZT5lbmRwb2ludC5yb2xlUmVxdWlyZWQ8L2NvZGU+LFxyXG4gICAgcmVzcGVjdGl2ZWx5LlxyXG5cclxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xyXG4gICAgQHBhcmFtIHtFbmRwb2ludH0gZW5kcG9pbnQgVGhlIGVuZHBvaW50IHRvIGNvbmZpZ3VyZVxyXG4gICMjI1xyXG4gIF9jb25maWd1cmVFbmRwb2ludHM6IC0+XHJcbiAgICBfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QpIC0+XHJcbiAgICAgIGlmIG1ldGhvZCBpc250ICdvcHRpb25zJ1xyXG4gICAgICAgICMgQ29uZmlndXJlIGFjY2VwdGFibGUgcm9sZXNcclxuICAgICAgICBpZiBub3QgQG9wdGlvbnM/LnJvbGVSZXF1aXJlZFxyXG4gICAgICAgICAgQG9wdGlvbnMucm9sZVJlcXVpcmVkID0gW11cclxuICAgICAgICBpZiBub3QgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBbXVxyXG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24gZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBAb3B0aW9ucy5yb2xlUmVxdWlyZWRcclxuICAgICAgICAjIE1ha2UgaXQgZWFzaWVyIHRvIGNoZWNrIGlmIG5vIHJvbGVzIGFyZSByZXF1aXJlZFxyXG4gICAgICAgIGlmIF8uaXNFbXB0eSBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IGZhbHNlXHJcblxyXG4gICAgICAgICMgQ29uZmlndXJlIGF1dGggcmVxdWlyZW1lbnRcclxuICAgICAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWQgaXMgdW5kZWZpbmVkXHJcbiAgICAgICAgICBpZiBAb3B0aW9ucz8uYXV0aFJlcXVpcmVkIG9yIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSB0cnVlXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlXHJcblxyXG4gICAgICAgIGlmIEBvcHRpb25zPy5zcGFjZVJlcXVpcmVkXHJcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gQG9wdGlvbnMuc3BhY2VSZXF1aXJlZFxyXG4gICAgICAgIHJldHVyblxyXG4gICAgLCB0aGlzXHJcbiAgICByZXR1cm5cclxuXHJcblxyXG4gICMjI1xyXG4gICAgQXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxyXG5cclxuICAgIEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xyXG4gICMjI1xyXG4gIF9jYWxsRW5kcG9pbnQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxyXG4gICAgIyBDYWxsIHRoZSBlbmRwb2ludCBpZiBhdXRoZW50aWNhdGlvbiBkb2Vzbid0IGZhaWxcclxuICAgIGlmIEBfYXV0aEFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuICAgICAgaWYgQF9yb2xlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG4gICAgICAgIGlmIEBfc3BhY2VBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcbiAgICAgICAgICAjZW5kcG9pbnQuYWN0aW9uLmNhbGwgZW5kcG9pbnRDb250ZXh0XHJcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uXHJcbiAgICAgICAgICAgIGlzU2ltdWxhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxyXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICByYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxyXG4gICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUgaW52b2NhdGlvbiwgLT5cclxuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzXHJcbiAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ31cclxuICAgICAgZWxzZVxyXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwM1xyXG4gICAgICAgIGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLid9XHJcbiAgICBlbHNlXHJcbiAgICAgIHN0YXR1c0NvZGU6IDQwMVxyXG4gICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ31cclxuXHJcblxyXG4gICMjI1xyXG4gICAgQXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxyXG5cclxuICAgIE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcclxuICAgIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxyXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXHJcblxyXG4gICAgQHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxyXG4gICMjI1xyXG4gIF9hdXRoQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxyXG4gICAgaWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkXHJcbiAgICAgIEBfYXV0aGVudGljYXRlIGVuZHBvaW50Q29udGV4dFxyXG4gICAgZWxzZSB0cnVlXHJcblxyXG5cclxuICAjIyNcclxuICAgIFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXHJcblxyXG4gICAgSWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxyXG5cclxuICAgIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG4gICMjI1xyXG4gIF9hdXRoZW50aWNhdGU6IChlbmRwb2ludENvbnRleHQpIC0+XHJcbiAgICAjIEdldCBhdXRoIGluZm9cclxuICAgIGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxyXG5cclxuICAgICMgR2V0IHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXHJcbiAgICBpZiBhdXRoPy51c2VySWQgYW5kIGF1dGg/LnRva2VuIGFuZCBub3QgYXV0aD8udXNlclxyXG4gICAgICB1c2VyU2VsZWN0b3IgPSB7fVxyXG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWRcclxuICAgICAgdXNlclNlbGVjdG9yW0BhcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW5cclxuICAgICAgYXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUgdXNlclNlbGVjdG9yXHJcblxyXG4gICAgIyBBdHRhY2ggdGhlIHVzZXIgYW5kIHRoZWlyIElEIHRvIHRoZSBjb250ZXh0IGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG4gICAgaWYgYXV0aD8udXNlclxyXG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlclxyXG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZFxyXG4gICAgICB0cnVlXHJcbiAgICBlbHNlIGZhbHNlXHJcblxyXG4gICMjI1xyXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcclxuXHJcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXHJcblxyXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcclxuICAgICAgICAgICAgIGVuZHBvaW50XHJcbiAgIyMjXHJcbiAgX3NwYWNlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxyXG4gICAgaWYgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZFxyXG4gICAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcclxuICAgICAgaWYgYXV0aD8uc3BhY2VJZFxyXG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aC51c2VySWQsIHNwYWNlOmF1dGguc3BhY2VJZH0pLmNvdW50KClcclxuICAgICAgICBpZiBzcGFjZV91c2Vyc19jb3VudFxyXG4gICAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpXHJcbiAgICAgICAgICAjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcclxuICAgICAgICAgIGlmIHNwYWNlPy5pc19wYWlkIGFuZCBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCk+PTBcclxuICAgICAgICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWRcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgIyMjXHJcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxyXG5cclxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cclxuXHJcbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxyXG4gICAgICAgICAgICAgZW5kcG9pbnRcclxuICAjIyNcclxuICBfcm9sZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuICAgIGlmIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG4gICAgICBpZiBfLmlzRW1wdHkgXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcylcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHRydWVcclxuXHJcblxyXG4gICMjI1xyXG4gICAgUmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcclxuICAjIyNcclxuICBfcmVzcG9uZDogKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlPTIwMCwgaGVhZGVycz17fSkgLT5cclxuICAgICMgT3ZlcnJpZGUgYW55IGRlZmF1bHQgaGVhZGVycyB0aGF0IGhhdmUgYmVlbiBwcm92aWRlZCAoa2V5cyBhcmUgbm9ybWFsaXplZCB0byBiZSBjYXNlIGluc2Vuc2l0aXZlKVxyXG4gICAgIyBUT0RPOiBDb25zaWRlciBvbmx5IGxvd2VyY2FzaW5nIHRoZSBoZWFkZXIga2V5cyB3ZSBuZWVkIG5vcm1hbGl6ZWQsIGxpa2UgQ29udGVudC1UeXBlXHJcbiAgICBkZWZhdWx0SGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBAYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnNcclxuICAgIGhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgaGVhZGVyc1xyXG4gICAgaGVhZGVycyA9IF8uZXh0ZW5kIGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzXHJcblxyXG4gICAgIyBQcmVwYXJlIEpTT04gYm9keSBmb3IgcmVzcG9uc2Ugd2hlbiBDb250ZW50LVR5cGUgaW5kaWNhdGVzIEpTT04gdHlwZVxyXG4gICAgaWYgaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pIGlzbnQgbnVsbFxyXG4gICAgICBpZiBAYXBpLl9jb25maWcucHJldHR5SnNvblxyXG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5LCB1bmRlZmluZWQsIDJcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5XHJcblxyXG4gICAgIyBTZW5kIHJlc3BvbnNlXHJcbiAgICBzZW5kUmVzcG9uc2UgPSAtPlxyXG4gICAgICByZXNwb25zZS53cml0ZUhlYWQgc3RhdHVzQ29kZSwgaGVhZGVyc1xyXG4gICAgICByZXNwb25zZS53cml0ZSBib2R5XHJcbiAgICAgIHJlc3BvbnNlLmVuZCgpXHJcbiAgICBpZiBzdGF0dXNDb2RlIGluIFs0MDEsIDQwM11cclxuICAgICAgIyBIYWNrZXJzIGNhbiBtZWFzdXJlIHRoZSByZXNwb25zZSB0aW1lIHRvIGRldGVybWluZSB0aGluZ3MgbGlrZSB3aGV0aGVyIHRoZSA0MDEgcmVzcG9uc2Ugd2FzIFxyXG4gICAgICAjIGNhdXNlZCBieSBiYWQgdXNlciBpZCB2cyBiYWQgcGFzc3dvcmQuXHJcbiAgICAgICMgSW4gZG9pbmcgc28sIHRoZXkgY2FuIGZpcnN0IHNjYW4gZm9yIHZhbGlkIHVzZXIgaWRzIHJlZ2FyZGxlc3Mgb2YgdmFsaWQgcGFzc3dvcmRzLlxyXG4gICAgICAjIERlbGF5IGJ5IGEgcmFuZG9tIGFtb3VudCB0byByZWR1Y2UgdGhlIGFiaWxpdHkgZm9yIGEgaGFja2VyIHRvIGRldGVybWluZSB0aGUgcmVzcG9uc2UgdGltZS5cclxuICAgICAgIyBTZWUgaHR0cHM6Ly93d3cub3dhc3Aub3JnL2luZGV4LnBocC9CbG9ja2luZ19CcnV0ZV9Gb3JjZV9BdHRhY2tzI0ZpbmRpbmdfT3RoZXJfQ291bnRlcm1lYXN1cmVzXHJcbiAgICAgICMgU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RpbWluZ19hdHRhY2tcclxuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDBcclxuICAgICAgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28gPSAxICsgTWF0aC5yYW5kb20oKVxyXG4gICAgICBkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3b1xyXG4gICAgICBNZXRlb3Iuc2V0VGltZW91dCBzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHNcclxuICAgIGVsc2VcclxuICAgICAgc2VuZFJlc3BvbnNlKClcclxuXHJcbiAgIyMjXHJcbiAgICBSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXHJcbiAgIyMjXHJcbiAgX2xvd2VyQ2FzZUtleXM6IChvYmplY3QpIC0+XHJcbiAgICBfLmNoYWluIG9iamVjdFxyXG4gICAgLnBhaXJzKClcclxuICAgIC5tYXAgKGF0dHIpIC0+XHJcbiAgICAgIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dXHJcbiAgICAub2JqZWN0KClcclxuICAgIC52YWx1ZSgpXHJcbiIsInNoYXJlLlJvdXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSb3V0ZShhcGksIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50czEpIHtcbiAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5lbmRwb2ludHMgPSBlbmRwb2ludHMxO1xuICAgIGlmICghdGhpcy5lbmRwb2ludHMpIHtcbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gdGhpcy5vcHRpb25zO1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgfVxuICB9XG5cbiAgUm91dGUucHJvdG90eXBlLmFkZFRvQXBpID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdmFpbGFibGVNZXRob2RzO1xuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhbGxvd2VkTWV0aG9kcywgZnVsbFBhdGgsIHJlamVjdGVkTWV0aG9kcywgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKF8uY29udGFpbnModGhpcy5hcGkuX2NvbmZpZy5wYXRocywgdGhpcy5wYXRoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogXCIgKyB0aGlzLnBhdGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5lbmRwb2ludHMgPSBfLmV4dGVuZCh7XG4gICAgICAgIG9wdGlvbnM6IHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuICAgICAgfSwgdGhpcy5lbmRwb2ludHMpO1xuICAgICAgdGhpcy5fcmVzb2x2ZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5fY29uZmlndXJlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLmFwaS5fY29uZmlnLnBhdGhzLnB1c2godGhpcy5wYXRoKTtcbiAgICAgIGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0KGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICBmdWxsUGF0aCA9IHRoaXMuYXBpLl9jb25maWcuYXBpUGF0aCArIHRoaXMucGF0aDtcbiAgICAgIF8uZWFjaChhbGxvd2VkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBlbmRwb2ludDtcbiAgICAgICAgZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdO1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgZG9uZUZ1bmMsIGVuZHBvaW50Q29udGV4dCwgZXJyb3IsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VJbml0aWF0ZWQ7XG4gICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBkb25lRnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9IHtcbiAgICAgICAgICAgIHVybFBhcmFtczogcmVxLnBhcmFtcyxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnksXG4gICAgICAgICAgICBib2R5UGFyYW1zOiByZXEuYm9keSxcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcSxcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXMsXG4gICAgICAgICAgICBkb25lOiBkb25lRnVuY1xuICAgICAgICAgIH07XG4gICAgICAgICAgXy5leHRlbmQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gbnVsbDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50KGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICBpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VJbml0aWF0ZWQpIHtcbiAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlRGF0YSA9PT0gbnVsbCB8fCByZXNwb25zZURhdGEgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZURhdGEuYm9keSAmJiAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgfHwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWplY3RlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgaGVhZGVycywgcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXG4gICAgICAgICAgfTtcbiAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgJ0FsbG93JzogYWxsb3dlZE1ldGhvZHMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KSgpO1xuXG5cbiAgLypcbiAgICBDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcbiAgICBmdW5jdGlvblxuICBcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNvbHZlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oZW5kcG9pbnQpKSB7XG4gICAgICAgIHJldHVybiBlbmRwb2ludHNbbWV0aG9kXSA9IHtcbiAgICAgICAgICBhY3Rpb246IGVuZHBvaW50XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cblxuICAvKlxuICAgIENvbmZpZ3VyZSB0aGUgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnQgb24gYWxsIGVuZHBvaW50cyAoZXhjZXB0IE9QVElPTlMsIHdoaWNoIG11c3RcbiAgICBiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcbiAgXG4gICAgQXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cbiAgICBlbnRpcmUgcm91dGUsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZCBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbFxuICAgIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuICBcbiAgICBBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcbiAgICBhY2Nlc3NlZCBhdCA8Y29kZT5lbmRwb2ludC5hdXRoUmVxdWlyZWQ8L2NvZGU+IGFuZCA8Y29kZT5lbmRwb2ludC5yb2xlUmVxdWlyZWQ8L2NvZGU+LFxuICAgIHJlc3BlY3RpdmVseS5cbiAgXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gICAgQHBhcmFtIHtFbmRwb2ludH0gZW5kcG9pbnQgVGhlIGVuZHBvaW50IHRvIGNvbmZpZ3VyZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2NvbmZpZ3VyZUVuZHBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIF8uZWFjaCh0aGlzLmVuZHBvaW50cywgZnVuY3Rpb24oZW5kcG9pbnQsIG1ldGhvZCkge1xuICAgICAgdmFyIHJlZiwgcmVmMSwgcmVmMjtcbiAgICAgIGlmIChtZXRob2QgIT09ICdvcHRpb25zJykge1xuICAgICAgICBpZiAoISgocmVmID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmLnJvbGVSZXF1aXJlZCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBfLnVuaW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCk7XG4gICAgICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmRwb2ludC5hdXRoUmVxdWlyZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgIGlmICgoKHJlZjEgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYxLmF1dGhSZXF1aXJlZCA6IHZvaWQgMCkgfHwgZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChyZWYyID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMi5zcGFjZVJlcXVpcmVkIDogdm9pZCAwKSB7XG4gICAgICAgICAgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IHRoaXMub3B0aW9ucy5zcGFjZVJlcXVpcmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcbiAgXG4gICAgQHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY2FsbEVuZHBvaW50ID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBpbnZvY2F0aW9uO1xuICAgIGlmICh0aGlzLl9hdXRoQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgIGlmICh0aGlzLl9yb2xlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NwYWNlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uKHtcbiAgICAgICAgICAgIGlzU2ltdWxhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcbiAgICAgICAgICAgIGNvbm5lY3Rpb246IG51bGwsXG4gICAgICAgICAgICByYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZShpbnZvY2F0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXNDb2RlOiA0MDEsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLidcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcbiAgXG4gICAgT25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxuICAgIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxuICAgIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuICBcbiAgICBAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aEFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5hdXRoUmVxdWlyZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGUoZW5kcG9pbnRDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxuICBcbiAgICBJZiB2ZXJpZmllZCwgYXR0YWNoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgdG8gdGhlIGNvbnRleHQuXG4gIFxuICAgIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCkge1xuICAgIHZhciBhdXRoLCB1c2VyU2VsZWN0b3I7XG4gICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICBpZiAoKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlcklkIDogdm9pZCAwKSAmJiAoYXV0aCAhPSBudWxsID8gYXV0aC50b2tlbiA6IHZvaWQgMCkgJiYgIShhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgICB1c2VyU2VsZWN0b3IgPSB7fTtcbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZDtcbiAgICAgIHVzZXJTZWxlY3Rvclt0aGlzLmFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlbjtcbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJTZWxlY3Rvcik7XG4gICAgfVxuICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApIHtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyO1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fc3BhY2VBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgYXV0aCwgc3BhY2UsIHNwYWNlX3VzZXJzX2NvdW50O1xuICAgIGlmIChlbmRwb2ludC5zcGFjZVJlcXVpcmVkKSB7XG4gICAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGguc3BhY2VJZCA6IHZvaWQgMCkge1xuICAgICAgICBzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHVzZXI6IGF1dGgudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBhdXRoLnNwYWNlSWRcbiAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXJzX2NvdW50KSB7XG4gICAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpO1xuICAgICAgICAgIGlmICgoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmlzX3BhaWQgOiB2b2lkIDApICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKSA+PSAwKSB7XG4gICAgICAgICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcm9sZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgIGlmIChfLmlzRW1wdHkoXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcykpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICAgIFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzcG9uZCA9IGZ1bmN0aW9uKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzLCBkZWxheUluTWlsbGlzZWNvbmRzLCBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcywgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28sIHNlbmRSZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PSBudWxsKSB7XG4gICAgICBzdGF0dXNDb2RlID0gMjAwO1xuICAgIH1cbiAgICBpZiAoaGVhZGVycyA9PSBudWxsKSB7XG4gICAgICBoZWFkZXJzID0ge307XG4gICAgfVxuICAgIGRlZmF1bHRIZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyh0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyhoZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gXy5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuICAgIGlmIChoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFwaS5fY29uZmlnLnByZXR0eUpzb24pIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHksIHZvaWQgMCwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoYm9keSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZW5kKCk7XG4gICAgfTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxIHx8IHN0YXR1c0NvZGUgPT09IDQwMykge1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDA7XG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd287XG4gICAgICByZXR1cm4gTWV0ZW9yLnNldFRpbWVvdXQoc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgUmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2xvd2VyQ2FzZUtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gXy5jaGFpbihvYmplY3QpLnBhaXJzKCkubWFwKGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiBbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXTtcbiAgICB9KS5vYmplY3QoKS52YWx1ZSgpO1xuICB9O1xuXG4gIHJldHVybiBSb3V0ZTtcblxufSkoKTtcbiIsImNsYXNzIEBSZXN0aXZ1c1xyXG5cclxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XHJcbiAgICBAX3JvdXRlcyA9IFtdXHJcbiAgICBAX2NvbmZpZyA9XHJcbiAgICAgIHBhdGhzOiBbXVxyXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2VcclxuICAgICAgYXBpUGF0aDogJ2FwaS8nXHJcbiAgICAgIHZlcnNpb246IG51bGxcclxuICAgICAgcHJldHR5SnNvbjogZmFsc2VcclxuICAgICAgYXV0aDpcclxuICAgICAgICB0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbidcclxuICAgICAgICB1c2VyOiAtPlxyXG4gICAgICAgICAgaWYgQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cclxuICAgICAgICAgICAgdG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cclxuICAgICAgICAgIGlmIEByZXF1ZXN0LnVzZXJJZFxyXG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogQHJlcXVlc3QudXNlcklkfSlcclxuICAgICAgICAgICAgdXNlcjogX3VzZXJcclxuICAgICAgICAgICAgdXNlcklkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXVxyXG4gICAgICAgICAgICBzcGFjZUlkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ11cclxuICAgICAgICAgICAgdG9rZW46IHRva2VuXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHVzZXJJZDogQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ11cclxuICAgICAgICAgICAgc3BhY2VJZDogQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddXHJcbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxyXG4gICAgICBkZWZhdWx0SGVhZGVyczpcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcclxuXHJcbiAgICAjIENvbmZpZ3VyZSBBUEkgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xyXG4gICAgXy5leHRlbmQgQF9jb25maWcsIG9wdGlvbnNcclxuXHJcbiAgICBpZiBAX2NvbmZpZy5lbmFibGVDb3JzXHJcbiAgICAgIGNvcnNIZWFkZXJzID1cclxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXHJcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCdcclxuXHJcbiAgICAgIGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXHJcbiAgICAgICAgY29yc0hlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSArPSAnLCBYLVVzZXItSWQsIFgtQXV0aC1Ub2tlbidcclxuXHJcbiAgICAgICMgU2V0IGRlZmF1bHQgaGVhZGVyIHRvIGVuYWJsZSBDT1JTIGlmIGNvbmZpZ3VyZWRcclxuICAgICAgXy5leHRlbmQgQF9jb25maWcuZGVmYXVsdEhlYWRlcnMsIGNvcnNIZWFkZXJzXHJcblxyXG4gICAgICBpZiBub3QgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxyXG4gICAgICAgIEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQgPSAtPlxyXG4gICAgICAgICAgQHJlc3BvbnNlLndyaXRlSGVhZCAyMDAsIGNvcnNIZWFkZXJzXHJcbiAgICAgICAgICBAZG9uZSgpXHJcblxyXG4gICAgIyBOb3JtYWxpemUgdGhlIEFQSSBwYXRoXHJcbiAgICBpZiBAX2NvbmZpZy5hcGlQYXRoWzBdIGlzICcvJ1xyXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoID0gQF9jb25maWcuYXBpUGF0aC5zbGljZSAxXHJcbiAgICBpZiBfLmxhc3QoQF9jb25maWcuYXBpUGF0aCkgaXNudCAnLydcclxuICAgICAgQF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGggKyAnLydcclxuXHJcbiAgICAjIFVSTCBwYXRoIHZlcnNpb25pbmcgaXMgdGhlIG9ubHkgdHlwZSBvZiBBUEkgdmVyc2lvbmluZyBjdXJyZW50bHkgYXZhaWxhYmxlLCBzbyBpZiBhIHZlcnNpb24gaXNcclxuICAgICMgcHJvdmlkZWQsIGFwcGVuZCBpdCB0byB0aGUgYmFzZSBwYXRoIG9mIHRoZSBBUElcclxuICAgIGlmIEBfY29uZmlnLnZlcnNpb25cclxuICAgICAgQF9jb25maWcuYXBpUGF0aCArPSBAX2NvbmZpZy52ZXJzaW9uICsgJy8nXHJcblxyXG4gICAgIyBBZGQgZGVmYXVsdCBsb2dpbiBhbmQgbG9nb3V0IGVuZHBvaW50cyBpZiBhdXRoIGlzIGNvbmZpZ3VyZWRcclxuICAgIGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXHJcbiAgICAgIEBfaW5pdEF1dGgoKVxyXG4gICAgZWxzZSBpZiBAX2NvbmZpZy51c2VBdXRoXHJcbiAgICAgIEBfaW5pdEF1dGgoKVxyXG4gICAgICBjb25zb2xlLndhcm4gJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArXHJcbiAgICAgICAgICAnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuXHJcblxyXG4gICMjIypcclxuICAgIEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcclxuXHJcbiAgICBAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXHJcbiAgICBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcclxuICAgIEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcclxuICAgIEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxyXG4gICAgQHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxyXG4gICAgQHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxyXG4gICAgICAgIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcclxuICAgICAgICBhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXHJcbiAgIyMjXHJcbiAgYWRkUm91dGU6IChwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIC0+XHJcbiAgICAjIENyZWF0ZSBhIG5ldyByb3V0ZSBhbmQgYWRkIGl0IHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHJvdXRlc1xyXG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKVxyXG4gICAgQF9yb3V0ZXMucHVzaChyb3V0ZSlcclxuXHJcbiAgICByb3V0ZS5hZGRUb0FwaSgpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuXHJcblxyXG4gICMjIypcclxuICAgIEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcclxuICAjIyNcclxuICBhZGRDb2xsZWN0aW9uOiAoY29sbGVjdGlvbiwgb3B0aW9ucz17fSkgLT5cclxuICAgIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ11cclxuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ11cclxuXHJcbiAgICAjIEdyYWIgdGhlIHNldCBvZiBlbmRwb2ludHNcclxuICAgIGlmIGNvbGxlY3Rpb24gaXMgTWV0ZW9yLnVzZXJzXHJcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzXHJcbiAgICBlbHNlXHJcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX2NvbGxlY3Rpb25FbmRwb2ludHNcclxuXHJcbiAgICAjIEZsYXR0ZW4gdGhlIG9wdGlvbnMgYW5kIHNldCBkZWZhdWx0cyBpZiBuZWNlc3NhcnlcclxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIG9yIHt9XHJcbiAgICByb3V0ZU9wdGlvbnMgPSBvcHRpb25zLnJvdXRlT3B0aW9ucyBvciB7fVxyXG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIG9yIFtdXHJcbiAgICAjIFVzZSBjb2xsZWN0aW9uIG5hbWUgYXMgZGVmYXVsdCBwYXRoXHJcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIG9yIGNvbGxlY3Rpb24uX25hbWVcclxuXHJcbiAgICAjIFNlcGFyYXRlIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRzIGJ5IHRoZSByb3V0ZSB0aGV5IGJlbG9uZyB0byAob25lIGZvciBvcGVyYXRpbmcgb24gdGhlIGVudGlyZVxyXG4gICAgIyBjb2xsZWN0aW9uIGFuZCBvbmUgZm9yIG9wZXJhdGluZyBvbiBhIHNpbmdsZSBlbnRpdHkgd2l0aGluIHRoZSBjb2xsZWN0aW9uKVxyXG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge31cclxuICAgIGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge31cclxuICAgIGlmIF8uaXNFbXB0eShlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24pIGFuZCBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpXHJcbiAgICAgICMgR2VuZXJhdGUgYWxsIGVuZHBvaW50cyBvbiB0aGlzIGNvbGxlY3Rpb25cclxuICAgICAgXy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgIyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXHJcbiAgICAgICAgaWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cclxuICAgICAgICAgIF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcclxuICAgICAgICBlbHNlIF8uZXh0ZW5kIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICAsIHRoaXNcclxuICAgIGVsc2VcclxuICAgICAgIyBHZW5lcmF0ZSBhbnkgZW5kcG9pbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZXhjbHVkZWRcclxuICAgICAgXy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgaWYgbWV0aG9kIG5vdCBpbiBleGNsdWRlZEVuZHBvaW50cyBhbmQgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gaXNudCBmYWxzZVxyXG4gICAgICAgICAgIyBDb25maWd1cmUgZW5kcG9pbnQgYW5kIG1hcCB0byBpdCdzIGh0dHAgbWV0aG9kXHJcbiAgICAgICAgICAjIFRPRE86IENvbnNpZGVyIHByZWRlZmluaW5nIGEgbWFwIG9mIG1ldGhvZHMgdG8gdGhlaXIgaHR0cCBtZXRob2QgdHlwZSAoZS5nLiwgZ2V0QWxsOiBnZXQpXHJcbiAgICAgICAgICBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXVxyXG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge31cclxuICAgICAgICAgIF8uZWFjaCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgKGFjdGlvbiwgbWV0aG9kVHlwZSkgLT5cclxuICAgICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50W21ldGhvZFR5cGVdID1cclxuICAgICAgICAgICAgICBfLmNoYWluIGFjdGlvblxyXG4gICAgICAgICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgICAgICAgLmV4dGVuZCBlbmRwb2ludE9wdGlvbnNcclxuICAgICAgICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgICAgIyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXHJcbiAgICAgICAgICBpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxyXG4gICAgICAgICAgICBfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxyXG4gICAgICAgICAgZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgLCB0aGlzXHJcblxyXG4gICAgIyBBZGQgdGhlIHJvdXRlcyB0byB0aGUgQVBJXHJcbiAgICBAYWRkUm91dGUgcGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHNcclxuICAgIEBhZGRSb3V0ZSBcIiN7cGF0aH0vOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHNcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG5cclxuXHJcbiAgIyMjKlxyXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXHJcbiAgIyMjXHJcbiAgX2NvbGxlY3Rpb25FbmRwb2ludHM6XHJcbiAgICBnZXQ6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBnZXQ6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxyXG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgc2VsZWN0b3JcclxuICAgICAgICAgIGlmIGVudGl0eVxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cclxuICAgIHB1dDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIHB1dDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XHJcbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCAkc2V0OiBAYm9keVBhcmFtc1xyXG4gICAgICAgICAgaWYgZW50aXR5SXNVcGRhdGVkXHJcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG4gICAgZGVsZXRlOiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZGVsZXRlOlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cclxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgaWYgY29sbGVjdGlvbi5yZW1vdmUgc2VsZWN0b3JcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cclxuICAgIHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBwb3N0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgICBAYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xyXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXHJcbiAgICAgICAgICBpZiBlbnRpdHlcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxXHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCd9XHJcbiAgICBnZXRBbGw6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBnZXQ6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgc2VsZWN0b3IgPSB7fVxyXG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChzZWxlY3RvcikuZmV0Y2goKVxyXG4gICAgICAgICAgaWYgZW50aXRpZXNcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nfVxyXG5cclxuXHJcbiAgIyMjKlxyXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxyXG4gICMjI1xyXG4gIF91c2VyQ29sbGVjdGlvbkVuZHBvaW50czpcclxuICAgIGdldDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGdldDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXHJcbiAgICAgICAgICBpZiBlbnRpdHlcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XHJcbiAgICBwdXQ6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBwdXQ6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgQHVybFBhcmFtcy5pZCwgJHNldDogcHJvZmlsZTogQGJvZHlQYXJhbXNcclxuICAgICAgICAgIGlmIGVudGl0eUlzVXBkYXRlZFxyXG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXHJcbiAgICAgICAgICAgIHtzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XHJcbiAgICBkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBkZWxldGU6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgaWYgY29sbGVjdGlvbi5yZW1vdmUgQHVybFBhcmFtcy5pZFxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnfVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxyXG4gICAgcG9zdDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIHBvc3Q6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgIyBDcmVhdGUgYSBuZXcgdXNlciBhY2NvdW50XHJcbiAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIgQGJvZHlQYXJhbXNcclxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZCwgZmllbGRzOiBwcm9maWxlOiAxXHJcbiAgICAgICAgICBpZiBlbnRpdHlcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxXHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcclxuICAgICAgICAgICAge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCd9XHJcbiAgICBnZXRBbGw6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBnZXQ6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIGZpZWxkczogcHJvZmlsZTogMSkuZmV0Y2goKVxyXG4gICAgICAgICAgaWYgZW50aXRpZXNcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2Vycyd9XHJcblxyXG5cclxuICAjIyNcclxuICAgIEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcclxuICAjIyNcclxuICBfaW5pdEF1dGg6IC0+XHJcbiAgICBzZWxmID0gdGhpc1xyXG4gICAgIyMjXHJcbiAgICAgIEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcclxuXHJcbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXHJcbiAgICAgIGFkZGluZyBob29rKS5cclxuICAgICMjI1xyXG4gICAgQGFkZFJvdXRlICdsb2dpbicsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSxcclxuICAgICAgcG9zdDogLT5cclxuICAgICAgICAjIEdyYWIgdGhlIHVzZXJuYW1lIG9yIGVtYWlsIHRoYXQgdGhlIHVzZXIgaXMgbG9nZ2luZyBpbiB3aXRoXHJcbiAgICAgICAgdXNlciA9IHt9XHJcbiAgICAgICAgaWYgQGJvZHlQYXJhbXMudXNlclxyXG4gICAgICAgICAgaWYgQGJvZHlQYXJhbXMudXNlci5pbmRleE9mKCdAJykgaXMgLTFcclxuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdXNlci5lbWFpbCA9IEBib2R5UGFyYW1zLnVzZXJcclxuICAgICAgICBlbHNlIGlmIEBib2R5UGFyYW1zLnVzZXJuYW1lXHJcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlcm5hbWVcclxuICAgICAgICBlbHNlIGlmIEBib2R5UGFyYW1zLmVtYWlsXHJcbiAgICAgICAgICB1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMuZW1haWxcclxuXHJcbiAgICAgICAgIyBUcnkgdG8gbG9nIHRoZSB1c2VyIGludG8gdGhlIHVzZXIncyBhY2NvdW50IChpZiBzdWNjZXNzZnVsIHdlJ2xsIGdldCBhbiBhdXRoIHRva2VuIGJhY2spXHJcbiAgICAgICAgdHJ5XHJcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCB1c2VyLCBAYm9keVBhcmFtcy5wYXNzd29yZFxyXG4gICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxyXG4gICAgICAgICAgcmV0dXJuIHt9ID1cclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogZS5lcnJvclxyXG4gICAgICAgICAgICBib2R5OiBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6IGUucmVhc29uXHJcblxyXG4gICAgICAgICMgR2V0IHRoZSBhdXRoZW50aWNhdGVkIHVzZXJcclxuICAgICAgICAjIFRPRE86IENvbnNpZGVyIHJldHVybmluZyB0aGUgdXNlciBpbiBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKCksIGluc3RlYWQgb2YgZmV0Y2hpbmcgaXQgYWdhaW4gaGVyZVxyXG4gICAgICAgIGlmIGF1dGgudXNlcklkIGFuZCBhdXRoLmF1dGhUb2tlblxyXG4gICAgICAgICAgc2VhcmNoUXVlcnkgPSB7fVxyXG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGguYXV0aFRva2VuXHJcbiAgICAgICAgICBAdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcbiAgICAgICAgICAgICdfaWQnOiBhdXRoLnVzZXJJZFxyXG4gICAgICAgICAgICBzZWFyY2hRdWVyeVxyXG4gICAgICAgICAgQHVzZXJJZCA9IEB1c2VyPy5faWRcclxuXHJcbiAgICAgICAgcmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGF1dGh9XHJcblxyXG4gICAgICAgICMgQ2FsbCB0aGUgbG9naW4gaG9vayB3aXRoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYXR0YWNoZWRcclxuICAgICAgICBleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbj8uY2FsbCh0aGlzKVxyXG4gICAgICAgIGlmIGV4dHJhRGF0YT9cclxuICAgICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcclxuXHJcbiAgICAgICAgcmVzcG9uc2VcclxuXHJcbiAgICBsb2dvdXQgPSAtPlxyXG4gICAgICAjIFJlbW92ZSB0aGUgZ2l2ZW4gYXV0aCB0b2tlbiBmcm9tIHRoZSB1c2VyJ3MgYWNjb3VudFxyXG4gICAgICBhdXRoVG9rZW4gPSBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxyXG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cclxuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuXHJcbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZiAnLidcclxuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgMCwgaW5kZXhcclxuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyBpbmRleCArIDFcclxuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9XHJcbiAgICAgIHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW5cclxuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fVxyXG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZVxyXG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlIEB1c2VyLl9pZCwgeyRwdWxsOiB0b2tlblJlbW92YWxRdWVyeX1cclxuXHJcbiAgICAgIHJlc3BvbnNlID0ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7bWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnfX1cclxuXHJcbiAgICAgICMgQ2FsbCB0aGUgbG9nb3V0IGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXHJcbiAgICAgIGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZE91dD8uY2FsbCh0aGlzKVxyXG4gICAgICBpZiBleHRyYURhdGE/XHJcbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxyXG5cclxuICAgICAgcmVzcG9uc2VcclxuXHJcbiAgICAjIyNcclxuICAgICAgQWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcclxuXHJcbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBvdXQsIHRoZSBvbkxvZ2dlZE91dCBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcclxuICAgICAgYWRkaW5nIGhvb2spLlxyXG4gICAgIyMjXHJcbiAgICBAYWRkUm91dGUgJ2xvZ291dCcsIHthdXRoUmVxdWlyZWQ6IHRydWV9LFxyXG4gICAgICBnZXQ6IC0+XHJcbiAgICAgICAgY29uc29sZS53YXJuIFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIlxyXG4gICAgICAgIGNvbnNvbGUud2FybiBcIiAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzL2lzc3Vlcy8xMDBcIlxyXG4gICAgICAgIHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKVxyXG4gICAgICBwb3N0OiBsb2dvdXRcclxuXHJcblJlc3RpdnVzID0gQFJlc3RpdnVzXHJcbiIsInZhciBSZXN0aXZ1cyxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG50aGlzLlJlc3RpdnVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSZXN0aXZ1cyhvcHRpb25zKSB7XG4gICAgdmFyIGNvcnNIZWFkZXJzO1xuICAgIHRoaXMuX3JvdXRlcyA9IFtdO1xuICAgIHRoaXMuX2NvbmZpZyA9IHtcbiAgICAgIHBhdGhzOiBbXSxcbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZSxcbiAgICAgIGFwaVBhdGg6ICdhcGkvJyxcbiAgICAgIHZlcnNpb246IG51bGwsXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nLFxuICAgICAgICB1c2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3VzZXIsIHRva2VuO1xuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10pIHtcbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QudXNlcklkKSB7XG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMucmVxdWVzdC51c2VySWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcjogX3VzZXIsXG4gICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddLFxuICAgICAgICAgICAgICBzcGFjZUlkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddLFxuICAgICAgICAgICAgICBzcGFjZUlkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcbiAgICB9O1xuICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZywgb3B0aW9ucyk7XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5lbmFibGVDb3JzKSB7XG4gICAgICBjb3JzSGVhZGVycyA9IHtcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCdcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4nO1xuICAgICAgfVxuICAgICAgXy5leHRlbmQodGhpcy5fY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVycyk7XG4gICAgICBpZiAoIXRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50KSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZS53cml0ZUhlYWQoMjAwLCBjb3JzSGVhZGVycyk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLmFwaVBhdGhbMF0gPT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aC5zbGljZSgxKTtcbiAgICB9XG4gICAgaWYgKF8ubGFzdCh0aGlzLl9jb25maWcuYXBpUGF0aCkgIT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aCArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy52ZXJzaW9uKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCArPSB0aGlzLl9jb25maWcudmVyc2lvbiArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbmZpZy51c2VBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgKyAnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICAgIEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcbiAgXG4gICAgQHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgIEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gICAgQHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICAgICAgICBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG4gICAgICAgIGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLmFkZFJvdXRlID0gZnVuY3Rpb24ocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSB7XG4gICAgdmFyIHJvdXRlO1xuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cyk7XG4gICAgdGhpcy5fcm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJvdXRlLmFkZFRvQXBpKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgICBHZW5lcmF0ZSByb3V0ZXMgZm9yIHRoZSBNZXRlb3IgQ29sbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5hZGRDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgb3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uRW5kcG9pbnRzLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiwgZW50aXR5Um91dGVFbmRwb2ludHMsIGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2RzLCBtZXRob2RzT25Db2xsZWN0aW9uLCBwYXRoLCByb3V0ZU9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddO1xuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ107XG4gICAgaWYgKGNvbGxlY3Rpb24gPT09IE1ldGVvci51c2Vycykge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fY29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9XG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgfHwge307XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgfHwge307XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIHx8IFtdO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGggfHwgY29sbGVjdGlvbi5fbmFtZTtcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSAmJiBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpKSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGNvbmZpZ3VyZWRFbmRwb2ludCwgZW5kcG9pbnRPcHRpb25zO1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2QpIDwgMCAmJiBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXTtcbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fTtcbiAgICAgICAgICBfLmVhY2goY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIGZ1bmN0aW9uKGFjdGlvbiwgbWV0aG9kVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9IF8uY2hhaW4oYWN0aW9uKS5jbG9uZSgpLmV4dGVuZChlbmRwb2ludE9wdGlvbnMpLnZhbHVlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyk7XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoICsgXCIvOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5fY29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5ib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCh0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXMsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChzZWxlY3RvcikuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQ7XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUodGhpcy51cmxQYXJhbXMuaWQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzO1xuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2VycydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX2luaXRBdXRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvZ291dCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcblxuICAgIC8qXG4gICAgICBBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHRoaXMuYWRkUm91dGUoJ2xvZ2luJywge1xuICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXV0aCwgZSwgZXh0cmFEYXRhLCByZWYsIHJlZjEsIHJlc3BvbnNlLCBzZWFyY2hRdWVyeSwgdXNlcjtcbiAgICAgICAgdXNlciA9IHt9O1xuICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpID09PSAtMSkge1xuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VybmFtZSkge1xuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLmVtYWlsKSB7XG4gICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy5lbWFpbDtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKHVzZXIsIHRoaXMuYm9keVBhcmFtcy5wYXNzd29yZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3IsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZS5yZWFzb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdXRoLnVzZXJJZCAmJiBhdXRoLmF1dGhUb2tlbikge1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGguYXV0aFRva2VuKTtcbiAgICAgICAgICB0aGlzLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICB9LCBzZWFyY2hRdWVyeSk7XG4gICAgICAgICAgdGhpcy51c2VySWQgPSAocmVmID0gdGhpcy51c2VyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICBkYXRhOiBhdXRoXG4gICAgICAgIH07XG4gICAgICAgIGV4dHJhRGF0YSA9IChyZWYxID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4pICE9IG51bGwgPyByZWYxLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aFRva2VuLCBleHRyYURhdGEsIGhhc2hlZFRva2VuLCBpbmRleCwgcmVmLCByZXNwb25zZSwgdG9rZW5GaWVsZE5hbWUsIHRva2VuTG9jYXRpb24sIHRva2VuUGF0aCwgdG9rZW5SZW1vdmFsUXVlcnksIHRva2VuVG9SZW1vdmU7XG4gICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ107XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuO1xuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKGluZGV4ICsgMSk7XG4gICAgICB0b2tlblRvUmVtb3ZlID0ge307XG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuO1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fTtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlO1xuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh0aGlzLnVzZXIuX2lkLCB7XG4gICAgICAgICRwdWxsOiB0b2tlblJlbW92YWxRdWVyeVxuICAgICAgfSk7XG4gICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGV4dHJhRGF0YSA9IChyZWYgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQpICE9IG51bGwgPyByZWYuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgIEFkZCBhIGxvZ291dCBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMuYWRkUm91dGUoJ2xvZ291dCcsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCIpO1xuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcyk7XG4gICAgICB9LFxuICAgICAgcG9zdDogbG9nb3V0XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFJlc3RpdnVzO1xuXG59KSgpO1xuXG5SZXN0aXZ1cyA9IHRoaXMuUmVzdGl2dXM7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgIEBBUEkgPSBuZXcgUmVzdGl2dXNcclxuICAgICAgICBhcGlQYXRoOiAnc3RlZWRvcy9hcGkvJyxcclxuICAgICAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZVxyXG4gICAgICAgIHByZXR0eUpzb246IHRydWVcclxuICAgICAgICBlbmFibGVDb3JzOiBmYWxzZVxyXG4gICAgICAgIGRlZmF1bHRIZWFkZXJzOlxyXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgdGhpcy5BUEkgPSBuZXcgUmVzdGl2dXMoe1xuICAgIGFwaVBhdGg6ICdzdGVlZG9zL2FwaS8nLFxuICAgIHVzZURlZmF1bHRBdXRoOiB0cnVlLFxuICAgIHByZXR0eUpzb246IHRydWUsXG4gICAgZW5hYmxlQ29yczogZmFsc2UsXG4gICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9XG4gIH0pO1xufVxuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRBUEkuYWRkQ29sbGVjdGlvbiBkYi5zcGFjZV91c2VycywgXHJcblx0XHRleGNsdWRlZEVuZHBvaW50czogW11cclxuXHRcdHJvdXRlT3B0aW9uczpcclxuXHRcdFx0YXV0aFJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdHNwYWNlUmVxdWlyZWQ6IHRydWUiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFQSS5hZGRDb2xsZWN0aW9uKGRiLnNwYWNlX3VzZXJzLCB7XG4gICAgZXhjbHVkZWRFbmRwb2ludHM6IFtdLFxuICAgIHJvdXRlT3B0aW9uczoge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgc3BhY2VSZXF1aXJlZDogdHJ1ZVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0QVBJLmFkZENvbGxlY3Rpb24gZGIub3JnYW5pemF0aW9ucywgXHJcblx0XHRleGNsdWRlZEVuZHBvaW50czogW11cclxuXHRcdHJvdXRlT3B0aW9uczpcclxuXHRcdFx0YXV0aFJlcXVpcmVkOiB0cnVlXHJcblx0XHRcdHNwYWNlUmVxdWlyZWQ6IHRydWUiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFQSS5hZGRDb2xsZWN0aW9uKGRiLm9yZ2FuaXphdGlvbnMsIHtcbiAgICBleGNsdWRlZEVuZHBvaW50czogW10sXG4gICAgcm91dGVPcHRpb25zOiB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWUsXG4gICAgICBzcGFjZVJlcXVpcmVkOiB0cnVlXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcclxuICBKc29uUm91dGVzLnBhcnNlRmlsZXMgcmVxLCByZXMsICgpLT5cclxuICAgIGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXHJcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xyXG4gICAgICBuZXdGaWxlLmF0dGFjaERhdGEgcmVxLmZpbGVzWzBdLmRhdGEsIHt0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGV9LCAoZXJyKSAtPlxyXG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lXHJcblxyXG4gICAgICAgIGlmIFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSlcclxuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKClcclxuXHJcbiAgICAgICAgYm9keSA9IHJlcS5ib2R5XHJcbiAgICAgICAgdHJ5XHJcbiAgICAgICAgICBpZiBib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwiSUVcIiBvciBib2R5Wyd1cGxvYWRfZnJvbSddIGlzIFwibm9kZVwiKVxyXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSlcclxuICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKVxyXG4gICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpXHJcblxyXG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSlcclxuICAgICAgICBcclxuICAgICAgICBpZiBib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnb3duZXJfbmFtZSddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsnaW5zdGFuY2UnXSAgJiYgYm9keVsnYXBwcm92ZSddXHJcbiAgICAgICAgICBwYXJlbnQgPSAnJ1xyXG4gICAgICAgICAgbWV0YWRhdGEgPSB7b3duZXI6Ym9keVsnb3duZXInXSwgb3duZXJfbmFtZTpib2R5Wydvd25lcl9uYW1lJ10sIHNwYWNlOmJvZHlbJ3NwYWNlJ10sIGluc3RhbmNlOmJvZHlbJ2luc3RhbmNlJ10sIGFwcHJvdmU6IGJvZHlbJ2FwcHJvdmUnXSwgY3VycmVudDogdHJ1ZX1cclxuXHJcbiAgICAgICAgICBpZiBib2R5W1wiaXNfcHJpdmF0ZVwiXSAmJiBib2R5W1wiaXNfcHJpdmF0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09IFwidHJ1ZVwiXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSB0cnVlXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSBmYWxzZVxyXG5cclxuICAgICAgICAgIGlmIGJvZHlbJ21haW4nXSA9PSBcInRydWVcIlxyXG4gICAgICAgICAgICBtZXRhZGF0YS5tYWluID0gdHJ1ZVxyXG5cclxuICAgICAgICAgIGlmIGJvZHlbJ2lzQWRkVmVyc2lvbiddICYmIGJvZHlbJ3BhcmVudCddXHJcbiAgICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddXHJcbiAgICAgICAgICAjIGVsc2VcclxuICAgICAgICAgICMgICBjb2xsZWN0aW9uLmZpbmQoeydtZXRhZGF0YS5pbnN0YW5jZSc6IGJvZHlbJ2luc3RhbmNlJ10sICdtZXRhZGF0YS5jdXJyZW50JyA6IHRydWV9KS5mb3JFYWNoIChjKSAtPlxyXG4gICAgICAgICAgIyAgICAgaWYgYy5uYW1lKCkgPT0gZmlsZW5hbWVcclxuICAgICAgICAgICMgICAgICAgcGFyZW50ID0gYy5tZXRhZGF0YS5wYXJlbnRcclxuXHJcbiAgICAgICAgICBpZiBwYXJlbnRcclxuICAgICAgICAgICAgciA9IGNvbGxlY3Rpb24udXBkYXRlKHsnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LCAnbWV0YWRhdGEuY3VycmVudCcgOiB0cnVlfSwgeyR1bnNldCA6IHsnbWV0YWRhdGEuY3VycmVudCcgOiAnJ319KVxyXG4gICAgICAgICAgICBpZiByXHJcbiAgICAgICAgICAgICAgbWV0YWRhdGEucGFyZW50ID0gcGFyZW50XHJcbiAgICAgICAgICAgICAgaWYgYm9keVsnbG9ja2VkX2J5J10gJiYgYm9keVsnbG9ja2VkX2J5X25hbWUnXVxyXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5ID0gYm9keVsnbG9ja2VkX2J5J11cclxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieV9uYW1lID0gYm9keVsnbG9ja2VkX2J5X25hbWUnXVxyXG5cclxuICAgICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcclxuICAgICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuICAgICAgICAgICAgICAjIOWIoOmZpOWQjOS4gOS4queUs+ivt+WNleWQjOS4gOS4quatpemqpOWQjOS4gOS4quS6uuS4iuS8oOeahOmHjeWkjeeahOaWh+S7tlxyXG4gICAgICAgICAgICAgIGlmIGJvZHlbXCJvdmVyd3JpdGVcIl0gJiYgYm9keVtcIm92ZXJ3cml0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09IFwidHJ1ZVwiXHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnJlbW92ZSh7J21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSwgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCwgJ21ldGFkYXRhLm93bmVyJzogYm9keVsnb3duZXInXSwgJ21ldGFkYXRhLmFwcHJvdmUnOiBib2R5WydhcHByb3ZlJ10sICdtZXRhZGF0YS5jdXJyZW50JzogeyRuZTogdHJ1ZX19KVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcclxuICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuICAgICAgICAgICAgZmlsZU9iai51cGRhdGUoeyRzZXQ6IHsnbWV0YWRhdGEucGFyZW50JyA6IGZpbGVPYmouX2lkfX0pXHJcblxyXG4gICAgICAgICMg5YW85a656ICB54mI5pysXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIG5ld0ZpbGUub24gJ3N0b3JlZCcsIChzdG9yZU5hbWUpLT5cclxuICAgICAgICBzaXplID0gbmV3RmlsZS5vcmlnaW5hbC5zaXplXHJcbiAgICAgICAgaWYgIXNpemVcclxuICAgICAgICAgIHNpemUgPSAxMDI0XHJcbiAgICAgICAgcmVzcCA9XHJcbiAgICAgICAgICB2ZXJzaW9uX2lkOiBuZXdGaWxlLl9pZCxcclxuICAgICAgICAgIHNpemU6IHNpemVcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcclxuICAgICAgICByZXR1cm5cclxuICAgIGVsc2VcclxuICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XHJcbiAgICAgIHJlcy5lbmQoKTtcclxuICAgICAgcmV0dXJuXHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJkZWxldGVcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcclxuXHJcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcclxuICBpZiBpZFxyXG4gICAgZmlsZSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogaWQgfSlcclxuICAgIGlmIGZpbGVcclxuICAgICAgZmlsZS5yZW1vdmUoKVxyXG4gICAgICByZXNwID0ge1xyXG4gICAgICAgIHN0YXR1czogXCJPS1wiXHJcbiAgICAgIH1cclxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XHJcbiAgICAgIHJldHVyblxyXG5cclxuICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcclxuICByZXMuZW5kKCk7XHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcclxuXHJcbiAgcmVzLnN0YXR1c0NvZGUgPSAzMDI7XHJcbiAgcmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvaW5zdGFuY2VzL1wiKSArIGlkICsgXCI/ZG93bmxvYWQ9MVwiXHJcbiAgcmVzLmVuZCgpO1xyXG5cclxuXHJcbiMgTWV0ZW9yLm1ldGhvZHNcclxuXHJcbiMgICBzM191cGdyYWRlOiAobWluLCBtYXgpIC0+XHJcbiMgICAgIGNvbnNvbGUubG9nKFwiL3MzL3VwZ3JhZGVcIilcclxuXHJcbiMgICAgIGZzID0gcmVxdWlyZSgnZnMnKVxyXG4jICAgICBtaW1lID0gcmVxdWlyZSgnbWltZScpXHJcblxyXG4jICAgICByb290X3BhdGggPSBcIi9tbnQvZmFrZXMzLzEwXCJcclxuIyAgICAgY29uc29sZS5sb2cocm9vdF9wYXRoKVxyXG4jICAgICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xyXG5cclxuIyAgICAgIyDpgY3ljoZpbnN0YW5jZSDmi7zlh7rpmYTku7bot6/lvoQg5Yiw5pys5Zyw5om+5a+55bqU5paH5Lu2IOWIhuS4pOenjeaDheWGtSAxLi9maWxlbmFtZV92ZXJzaW9uSWQgMi4vZmlsZW5hbWXvvJtcclxuIyAgICAgZGVhbF93aXRoX3ZlcnNpb24gPSAocm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCB2ZXJzaW9uLCBhdHRhY2hfZmlsZW5hbWUpIC0+XHJcbiMgICAgICAgX3JldiA9IHZlcnNpb24uX3JldlxyXG4jICAgICAgIGlmIChjb2xsZWN0aW9uLmZpbmQoe1wiX2lkXCI6IF9yZXZ9KS5jb3VudCgpID4wKVxyXG4jICAgICAgICAgcmV0dXJuXHJcbiMgICAgICAgY3JlYXRlZF9ieSA9IHZlcnNpb24uY3JlYXRlZF9ieVxyXG4jICAgICAgIGFwcHJvdmUgPSB2ZXJzaW9uLmFwcHJvdmVcclxuIyAgICAgICBmaWxlbmFtZSA9IHZlcnNpb24uZmlsZW5hbWUgfHwgYXR0YWNoX2ZpbGVuYW1lO1xyXG4jICAgICAgIG1pbWVfdHlwZSA9IG1pbWUubG9va3VwKGZpbGVuYW1lKVxyXG4jICAgICAgIG5ld19wYXRoID0gcm9vdF9wYXRoICsgXCIvc3BhY2VzL1wiICsgc3BhY2UgKyBcIi93b3JrZmxvdy9cIiArIGluc19pZCArIFwiL1wiICsgZmlsZW5hbWUgKyBcIl9cIiArIF9yZXZcclxuIyAgICAgICBvbGRfcGF0aCA9IHJvb3RfcGF0aCArIFwiL3NwYWNlcy9cIiArIHNwYWNlICsgXCIvd29ya2Zsb3cvXCIgKyBpbnNfaWQgKyBcIi9cIiArIGZpbGVuYW1lXHJcblxyXG4jICAgICAgIHJlYWRGaWxlID0gKGZ1bGxfcGF0aCkgLT5cclxuIyAgICAgICAgIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMgZnVsbF9wYXRoXHJcblxyXG4jICAgICAgICAgaWYgZGF0YVxyXG4jICAgICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcclxuIyAgICAgICAgICAgbmV3RmlsZS5faWQgPSBfcmV2O1xyXG4jICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0ge293bmVyOmNyZWF0ZWRfYnksIHNwYWNlOnNwYWNlLCBpbnN0YW5jZTppbnNfaWQsIGFwcHJvdmU6IGFwcHJvdmV9O1xyXG4jICAgICAgICAgICBuZXdGaWxlLmF0dGFjaERhdGEgZGF0YSwge3R5cGU6IG1pbWVfdHlwZX1cclxuIyAgICAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxyXG4jICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG4jICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlT2JqLl9pZClcclxuXHJcbiMgICAgICAgdHJ5XHJcbiMgICAgICAgICBuID0gZnMuc3RhdFN5bmMgbmV3X3BhdGhcclxuIyAgICAgICAgIGlmIG4gJiYgbi5pc0ZpbGUoKVxyXG4jICAgICAgICAgICByZWFkRmlsZSBuZXdfcGF0aFxyXG4jICAgICAgIGNhdGNoIGVycm9yXHJcbiMgICAgICAgICB0cnlcclxuIyAgICAgICAgICAgb2xkID0gZnMuc3RhdFN5bmMgb2xkX3BhdGhcclxuIyAgICAgICAgICAgaWYgb2xkICYmIG9sZC5pc0ZpbGUoKVxyXG4jICAgICAgICAgICAgIHJlYWRGaWxlIG9sZF9wYXRoXHJcbiMgICAgICAgICBjYXRjaCBlcnJvclxyXG4jICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZmlsZSBub3QgZm91bmQ6IFwiICsgb2xkX3BhdGgpXHJcblxyXG5cclxuIyAgICAgY291bnQgPSBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pLmNvdW50KCk7XHJcbiMgICAgIGNvbnNvbGUubG9nKFwiYWxsIGluc3RhbmNlczogXCIgKyBjb3VudClcclxuXHJcbiMgICAgIGIgPSBuZXcgRGF0ZSgpXHJcblxyXG4jICAgICBpID0gbWluXHJcbiMgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBza2lwOiBtaW4sIGxpbWl0OiBtYXgtbWlufSkuZm9yRWFjaCAoaW5zKSAtPlxyXG4jICAgICAgIGkgPSBpICsgMVxyXG4jICAgICAgIGNvbnNvbGUubG9nKGkgKyBcIjpcIiArIGlucy5uYW1lKVxyXG4jICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcclxuIyAgICAgICBzcGFjZSA9IGlucy5zcGFjZVxyXG4jICAgICAgIGluc19pZCA9IGlucy5faWRcclxuIyAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCkgLT5cclxuIyAgICAgICAgIGRlYWxfd2l0aF92ZXJzaW9uIHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgYXR0LmN1cnJlbnQsIGF0dC5maWxlbmFtZVxyXG4jICAgICAgICAgaWYgYXR0Lmhpc3RvcnlzXHJcbiMgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XHJcbiMgICAgICAgICAgICAgZGVhbF93aXRoX3ZlcnNpb24gcm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCBoaXMsIGF0dC5maWxlbmFtZVxyXG5cclxuIyAgICAgY29uc29sZS5sb2cobmV3IERhdGUoKSAtIGIpXHJcblxyXG4jICAgICByZXR1cm4gXCJva1wiXHJcbiIsIkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXM7XG4gIHJldHVybiBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBuZXdGaWxlO1xuICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgYm9keSwgZSwgZmlsZU9iaiwgZmlsZW5hbWUsIG1ldGFkYXRhLCBwYXJlbnQsIHI7XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lO1xuICAgICAgICBpZiAoW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IHJlcS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIklFXCIgfHwgYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJub2RlXCIpKSB7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKTtcbiAgICAgICAgaWYgKGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5Wydvd25lcl9uYW1lJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydpbnN0YW5jZSddICYmIGJvZHlbJ2FwcHJvdmUnXSkge1xuICAgICAgICAgIHBhcmVudCA9ICcnO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgb3duZXI6IGJvZHlbJ293bmVyJ10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBib2R5Wydvd25lcl9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogYm9keVsnc3BhY2UnXSxcbiAgICAgICAgICAgIGluc3RhbmNlOiBib2R5WydpbnN0YW5jZSddLFxuICAgICAgICAgICAgYXBwcm92ZTogYm9keVsnYXBwcm92ZSddLFxuICAgICAgICAgICAgY3VycmVudDogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGJvZHlbXCJpc19wcml2YXRlXCJdICYmIGJvZHlbXCJpc19wcml2YXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYm9keVsnbWFpbiddID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEubWFpbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChib2R5Wydpc0FkZFZlcnNpb24nXSAmJiBib2R5WydwYXJlbnQnXSkge1xuICAgICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHIgPSBjb2xsZWN0aW9uLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsXG4gICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkdW5zZXQ6IHtcbiAgICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6ICcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgbWV0YWRhdGEucGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgICBpZiAoYm9keVsnbG9ja2VkX2J5J10gJiYgYm9keVsnbG9ja2VkX2J5X25hbWUnXSkge1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieSA9IGJvZHlbJ2xvY2tlZF9ieSddO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieV9uYW1lID0gYm9keVsnbG9ja2VkX2J5X25hbWUnXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgICAgICAgaWYgKGJvZHlbXCJvdmVyd3JpdGVcIl0gJiYgYm9keVtcIm92ZXJ3cml0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHtcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGJvZHlbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLm93bmVyJzogYm9keVsnb3duZXInXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5hcHByb3ZlJzogYm9keVsnYXBwcm92ZSddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICRuZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgICAgIGZpbGVPYmoudXBkYXRlKHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBmaWxlT2JqLl9pZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXdGaWxlLm9uKCdzdG9yZWQnLCBmdW5jdGlvbihzdG9yZU5hbWUpIHtcbiAgICAgICAgdmFyIHJlc3AsIHNpemU7XG4gICAgICAgIHNpemUgPSBuZXdGaWxlLm9yaWdpbmFsLnNpemU7XG4gICAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAgIHNpemUgPSAxMDI0O1xuICAgICAgICB9XG4gICAgICAgIHJlc3AgPSB7XG4gICAgICAgICAgdmVyc2lvbl9pZDogbmV3RmlsZS5faWQsXG4gICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICB9O1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZGVsZXRlXCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjb2xsZWN0aW9uLCBmaWxlLCBpZCwgcmVzcDtcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXM7XG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG4gIGlmIChpZCkge1xuICAgIGZpbGUgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpZFxuICAgIH0pO1xuICAgIGlmIChmaWxlKSB7XG4gICAgICBmaWxlLnJlbW92ZSgpO1xuICAgICAgcmVzcCA9IHtcbiAgICAgICAgc3RhdHVzOiBcIk9LXCJcbiAgICAgIH07XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gIHJldHVybiByZXMuZW5kKCk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGlkO1xuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuICByZXMuc3RhdHVzQ29kZSA9IDMwMjtcbiAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvaW5zdGFuY2VzL1wiKSArIGlkICsgXCI/ZG93bmxvYWQ9MVwiKTtcbiAgcmV0dXJuIHJlcy5lbmQoKTtcbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9wdXNoL21lc3NhZ2VcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgaWYgcmVxLmJvZHk/LnB1c2hUb3BpYyBhbmQgcmVxLmJvZHkudXNlcklkcyBhbmQgcmVxLmJvZHkuZGF0YVxyXG4gICAgICAgIG1lc3NhZ2UgPSBcclxuICAgICAgICAgICAgZnJvbTogXCJzdGVlZG9zXCJcclxuICAgICAgICAgICAgcXVlcnk6XHJcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiByZXEuYm9keS5wdXNoVG9waWNcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogXHJcbiAgICAgICAgICAgICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xyXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZT9cclxuICAgICAgICAgICAgbWVzc2FnZVtcInRpdGxlXCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlXHJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5hbGVydD9cclxuICAgICAgICAgICAgbWVzc2FnZVtcInRleHRcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0XHJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5iYWRnZT9cclxuICAgICAgICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCJcclxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLnNvdW5kP1xyXG4gICAgICAgICAgICBtZXNzYWdlW1wic291bmRcIl0gPSByZXEuYm9keS5kYXRhLnNvdW5kXHJcbiAgICAgICAgI2lmIHJlcS5ib2R5LmRhdGEuZGF0YT9cclxuICAgICAgICAjICAgIG1lc3NhZ2VbXCJkYXRhXCJdID0gcmVxLmJvZHkuZGF0YS5kYXRhXHJcbiAgICAgICAgUHVzaC5zZW5kIG1lc3NhZ2VcclxuXHJcbiAgICAgICAgcmVzLmVuZChcInN1Y2Nlc3NcIik7XHJcblxyXG5cclxuXHJcbk1ldGVvci5tZXRob2RzXHJcbiAgICBwdXNoU2VuZDogKHRleHQsdGl0bGUsYmFkZ2UsdXNlcklkKSAtPlxyXG4gICAgICAgIGlmICghdXNlcklkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgUHVzaC5zZW5kXHJcbiAgICAgICAgICAgIGZyb206ICdzdGVlZG9zJyxcclxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICBiYWRnZTogYmFkZ2UsXHJcbiAgICAgICAgICAgIHF1ZXJ5OiBcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXHJcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcclxuIiwiSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9wdXNoL21lc3NhZ2VcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIG1lc3NhZ2UsIHJlZjtcbiAgaWYgKCgocmVmID0gcmVxLmJvZHkpICE9IG51bGwgPyByZWYucHVzaFRvcGljIDogdm9pZCAwKSAmJiByZXEuYm9keS51c2VySWRzICYmIHJlcS5ib2R5LmRhdGEpIHtcbiAgICBtZXNzYWdlID0ge1xuICAgICAgZnJvbTogXCJzdGVlZG9zXCIsXG4gICAgICBxdWVyeToge1xuICAgICAgICBhcHBOYW1lOiByZXEuYm9keS5wdXNoVG9waWMsXG4gICAgICAgIHVzZXJJZDoge1xuICAgICAgICAgIFwiJGluXCI6IHVzZXJJZHNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZSAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1widGl0bGVcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGU7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLmFsZXJ0ICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJ0ZXh0XCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydDtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYmFkZ2UgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCI7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLnNvdW5kICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJzb3VuZFwiXSA9IHJlcS5ib2R5LmRhdGEuc291bmQ7XG4gICAgfVxuICAgIFB1c2guc2VuZChtZXNzYWdlKTtcbiAgICByZXR1cm4gcmVzLmVuZChcInN1Y2Nlc3NcIik7XG4gIH1cbn0pO1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gIHB1c2hTZW5kOiBmdW5jdGlvbih0ZXh0LCB0aXRsZSwgYmFkZ2UsIHVzZXJJZCkge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBQdXNoLnNlbmQoe1xuICAgICAgZnJvbTogJ3N0ZWVkb3MnLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgdGV4dDogdGV4dCxcbiAgICAgIGJhZGdlOiBiYWRnZSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XHJcblhpbmdlID0gcmVxdWlyZSgneGluZ2UnKTtcclxuSHdQdXNoID0gcmVxdWlyZSgnaHVhd2VpLXB1c2gnKTtcclxuTWlQdXNoID0gcmVxdWlyZSgneGlhb21pLXB1c2gnKTtcclxuXHJcbkFsaXl1bl9wdXNoID0ge307XHJcblxyXG5BbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSA9ICh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGNhbGxiYWNrKSAtPlxyXG5cdGlmIG5vdGlmaWNhdGlvbi50aXRsZSBhbmQgbm90aWZpY2F0aW9uLnRleHRcclxuXHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0Y29uc29sZS5sb2cgdXNlclRva2Vuc1xyXG5cclxuXHRcdGFsaXl1blRva2VucyA9IG5ldyBBcnJheVxyXG5cdFx0eGluZ2VUb2tlbnMgPSBuZXcgQXJyYXlcclxuXHRcdGh1YXdlaVRva2VucyA9IG5ldyBBcnJheVxyXG5cdFx0bWlUb2tlbnMgPSBuZXcgQXJyYXlcclxuXHJcblx0XHR1c2VyVG9rZW5zLmZvckVhY2ggKHVzZXJUb2tlbikgLT5cclxuXHRcdFx0YXJyID0gdXNlclRva2VuLnNwbGl0KCc6JylcclxuXHRcdFx0aWYgYXJyWzBdIGlzIFwiYWxpeXVuXCJcclxuXHRcdFx0XHRhbGl5dW5Ub2tlbnMucHVzaCBfLmxhc3QoYXJyKVxyXG5cdFx0XHRlbHNlIGlmIGFyclswXSBpcyBcInhpbmdlXCJcclxuXHRcdFx0XHR4aW5nZVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXHJcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwiaHVhd2VpXCJcclxuXHRcdFx0XHRodWF3ZWlUb2tlbnMucHVzaCBfLmxhc3QoYXJyKVxyXG5cdFx0XHRlbHNlIGlmIGFyclswXSBpcyBcIm1pXCJcclxuXHRcdFx0XHRtaVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXHJcblxyXG5cdFx0aWYgIV8uaXNFbXB0eShhbGl5dW5Ub2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYWxpeXVuXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyBcImFsaXl1blRva2VuczogI3thbGl5dW5Ub2tlbnN9XCJcclxuXHRcdFx0QUxZUFVTSCA9IG5ldyAoQUxZLlBVU0gpKFxyXG5cdFx0XHRcdGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWRcclxuXHRcdFx0XHRzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXlcclxuXHRcdFx0XHRlbmRwb2ludDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmVuZHBvaW50XHJcblx0XHRcdFx0YXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb24pO1xyXG5cclxuXHRcdFx0ZGF0YSA9IFxyXG5cdFx0XHRcdEFwcEtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwcEtleVxyXG5cdFx0XHRcdFRhcmdldDogJ2RldmljZSdcclxuXHRcdFx0XHRUYXJnZXRWYWx1ZTogYWxpeXVuVG9rZW5zLnRvU3RyaW5nKClcclxuXHRcdFx0XHRUaXRsZTogbm90aWZpY2F0aW9uLnRpdGxlXHJcblx0XHRcdFx0U3VtbWFyeTogbm90aWZpY2F0aW9uLnRleHRcclxuXHJcblx0XHRcdEFMWVBVU0gucHVzaE5vdGljZVRvQW5kcm9pZCBkYXRhLCBjYWxsYmFja1xyXG5cclxuXHRcdGlmICFfLmlzRW1wdHkoeGluZ2VUb2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ueGluZ2VcclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwieGluZ2VUb2tlbnM6ICN7eGluZ2VUb2tlbnN9XCJcclxuXHRcdFx0WGluZ2VBcHAgPSBuZXcgWGluZ2UuWGluZ2VBcHAoTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2UuYWNjZXNzSWQsIE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLnNlY3JldEtleSlcclxuXHRcdFx0XHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlID0gbmV3IFhpbmdlLkFuZHJvaWRNZXNzYWdlXHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnR5cGUgPSBYaW5nZS5NRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OXHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlXHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLmNvbnRlbnQgPSBub3RpZmljYXRpb24udGV4dFxyXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5zdHlsZSA9IG5ldyBYaW5nZS5TdHlsZVxyXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5hY3Rpb24gPSBuZXcgWGluZ2UuQ2xpY2tBY3Rpb25cclxuXHJcblx0XHRcdF8uZWFjaCB4aW5nZVRva2VucywgKHQpLT5cclxuXHRcdFx0XHRYaW5nZUFwcC5wdXNoVG9TaW5nbGVEZXZpY2UgdCwgYW5kcm9pZE1lc3NhZ2UsIGNhbGxiYWNrXHJcblxyXG5cdFx0aWYgIV8uaXNFbXB0eShodWF3ZWlUb2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8uaHVhd2VpXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyBcImh1YXdlaVRva2VuczogI3todWF3ZWlUb2tlbnN9XCJcclxuXHRcdFx0IyBtc2cgPSBuZXcgSHdQdXNoLk1lc3NhZ2VcclxuXHRcdFx0IyBtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5jb250ZW50KG5vdGlmaWNhdGlvbi50ZXh0KVxyXG5cdFx0XHQjIG1zZy5leHRyYXMobm90aWZpY2F0aW9uLnBheWxvYWQpXHJcblx0XHRcdCMgbm90aWZpY2F0aW9uID0gbmV3IEh3UHVzaC5Ob3RpZmljYXRpb24oXHJcblx0XHRcdCMgXHRhcHBJZDogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcElkXHJcblx0XHRcdCMgXHRhcHBTZWNyZXQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXRcclxuXHRcdFx0IyApXHJcblx0XHRcdCMgXy5lYWNoIGh1YXdlaVRva2VucywgKHQpLT5cclxuXHRcdFx0IyBcdG5vdGlmaWNhdGlvbi5zZW5kIHQsIG1zZywgY2FsbGJhY2tcclxuXHJcblxyXG5cdFx0XHRwYWNrYWdlX25hbWUgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwUGtnTmFtZVxyXG5cdFx0XHR0b2tlbkRhdGFMaXN0ID0gW11cclxuXHRcdFx0Xy5lYWNoIGh1YXdlaVRva2VucywgKHQpLT5cclxuXHRcdFx0XHR0b2tlbkRhdGFMaXN0LnB1c2goeydwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsICd0b2tlbic6IHR9KVxyXG5cdFx0XHRub3RpID0geydhbmRyb2lkJzogeyd0aXRsZSc6IG5vdGlmaWNhdGlvbi50aXRsZSwgJ21lc3NhZ2UnOiBub3RpZmljYXRpb24udGV4dH0sICdleHRyYXMnOiBub3RpZmljYXRpb24ucGF5bG9hZH1cclxuXHJcblx0XHRcdEh1YXdlaVB1c2guY29uZmlnIFt7J3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSwgJ2NsaWVudF9pZCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBJZCwgJ2NsaWVudF9zZWNyZXQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwU2VjcmV0fV1cclxuXHRcdFx0XHJcblx0XHRcdEh1YXdlaVB1c2guc2VuZE1hbnkgbm90aSwgdG9rZW5EYXRhTGlzdFxyXG5cclxuXHJcblx0XHRpZiAhXy5pc0VtcHR5KG1pVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lm1pXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyBcIm1pVG9rZW5zOiAje21pVG9rZW5zfVwiXHJcblx0XHRcdG1zZyA9IG5ldyBNaVB1c2guTWVzc2FnZVxyXG5cdFx0XHRtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5kZXNjcmlwdGlvbihub3RpZmljYXRpb24udGV4dClcclxuXHRcdFx0bm90aWZpY2F0aW9uID0gbmV3IE1pUHVzaC5Ob3RpZmljYXRpb24oXHJcblx0XHRcdFx0cHJvZHVjdGlvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkucHJvZHVjdGlvblxyXG5cdFx0XHRcdGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkuYXBwU2VjcmV0XHJcblx0XHRcdClcclxuXHRcdFx0Xy5lYWNoIG1pVG9rZW5zLCAocmVnaWQpLT5cclxuXHRcdFx0XHRub3RpZmljYXRpb24uc2VuZCByZWdpZCwgbXNnLCBjYWxsYmFja1xyXG5cclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcblx0XHJcblx0aWYgbm90IE1ldGVvci5zZXR0aW5ncy5jcm9uPy5wdXNoX2ludGVydmFsXHJcblx0XHRyZXR1cm5cclxuXHJcblx0Y29uZmlnID0ge1xyXG5cdFx0ZGVidWc6IHRydWVcclxuXHRcdGtlZXBOb3RpZmljYXRpb25zOiBmYWxzZVxyXG5cdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5wdXNoX2ludGVydmFsXHJcblx0XHRzZW5kQmF0Y2hTaXplOiAxMFxyXG5cdFx0cHJvZHVjdGlvbjogdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYXBuKVxyXG5cdFx0Y29uZmlnLmFwbiA9IHtcclxuXHRcdFx0a2V5RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmtleURhdGFcclxuXHRcdFx0Y2VydERhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5jZXJ0RGF0YVxyXG5cdFx0fVxyXG5cdGlmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmdjbSlcclxuXHRcdGNvbmZpZy5nY20gPSB7XHJcblx0XHRcdHByb2plY3ROdW1iZXI6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5wcm9qZWN0TnVtYmVyXHJcblx0XHRcdGFwaUtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLmFwaUtleVxyXG5cdFx0fVxyXG5cclxuXHRQdXNoLkNvbmZpZ3VyZSBjb25maWdcclxuXHRcclxuXHRpZiAoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFsaXl1biBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ueGluZ2Ugb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lmh1YXdlaSBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ubWkpIGFuZCBQdXNoIGFuZCB0eXBlb2YgUHVzaC5zZW5kR0NNID09ICdmdW5jdGlvbidcclxuXHRcdFxyXG5cdFx0UHVzaC5vbGRfc2VuZEdDTSA9IFB1c2guc2VuZEdDTTtcclxuXHJcblx0XHRQdXNoLnNlbmRBbGl5dW4gPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uKSAtPlxyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cclxuXHJcblx0XHRcdGlmIE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KVxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pXHJcblx0XHRcdCMgTWFrZSBzdXJlIHVzZXJUb2tlbnMgYXJlIGFuIGFycmF5IG9mIHN0cmluZ3NcclxuXHRcdFx0aWYgdXNlclRva2VucyA9PSAnJyArIHVzZXJUb2tlbnNcclxuXHRcdFx0XHR1c2VyVG9rZW5zID0gWyB1c2VyVG9rZW5zIF1cclxuXHRcdFx0IyBDaGVjayBpZiBhbnkgdG9rZW5zIGluIHRoZXJlIHRvIHNlbmRcclxuXHRcdFx0aWYgIXVzZXJUb2tlbnMubGVuZ3RoXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxyXG5cclxuXHRcdFx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxyXG5cdCAgXHJcblx0XHRcdHVzZXJUb2tlbiA9IGlmIHVzZXJUb2tlbnMubGVuZ3RoID09IDEgdGhlbiB1c2VyVG9rZW5zWzBdIGVsc2UgbnVsbFxyXG5cdFx0XHRBbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIChlcnIsIHJlc3VsdCkgLT5cclxuXHRcdFx0XHRpZiBlcnJcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEIEVSUk9SOiByZXN1bHQgb2Ygc2VuZGVyOiAnICsgcmVzdWx0XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0aWYgcmVzdWx0ID09IG51bGxcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXIgaXMgbnVsbCdcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXI6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpXHJcblxyXG5cdFx0XHRcdFx0aWYgcmVzdWx0LmNhbm9uaWNhbF9pZHMgPT0gMSBhbmQgdXNlclRva2VuXHJcblx0XHRcdFx0XHRcdEZpYmVyKChzZWxmKSAtPlxyXG5cdFx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jYWxsYmFjayBzZWxmLm9sZFRva2VuLCBzZWxmLm5ld1Rva2VuXHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyXHJcblx0XHRcdFx0XHRcdCkucnVuXHJcblx0XHRcdFx0XHRcdFx0b2xkVG9rZW46IGdjbTogdXNlclRva2VuXHJcblx0XHRcdFx0XHRcdFx0bmV3VG9rZW46IGdjbTogXCJhbGl5dW46XCIgKyByZXN1bHQucmVzdWx0c1swXS5yZWdpc3RyYXRpb25faWRcclxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjazogX3JlcGxhY2VUb2tlblxyXG5cdFx0XHRcdFx0aWYgcmVzdWx0LmZhaWx1cmUgIT0gMCBhbmQgdXNlclRva2VuXHJcblx0XHRcdFx0XHRcdEZpYmVyKChzZWxmKSAtPlxyXG5cdFx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jYWxsYmFjayBzZWxmLnRva2VuXHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyXHJcblx0XHRcdFx0XHRcdCkucnVuXHJcblx0XHRcdFx0XHRcdFx0dG9rZW46IGdjbTogdXNlclRva2VuXHJcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2s6IF9yZW1vdmVUb2tlblxyXG5cclxuXHJcblxyXG5cdFx0UHVzaC5zZW5kR0NNID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikgLT5cclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIGZyb20gYWxpeXVuLT4gUHVzaC5zZW5kR0NNJ1xyXG5cdFx0XHRpZiBNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdClcclxuXHRcdFx0XHRub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKVxyXG5cdFx0XHQjIE1ha2Ugc3VyZSB1c2VyVG9rZW5zIGFyZSBhbiBhcnJheSBvZiBzdHJpbmdzXHJcblx0XHRcdGlmIHVzZXJUb2tlbnMgPT0gJycgKyB1c2VyVG9rZW5zXHJcblx0XHRcdFx0dXNlclRva2VucyA9IFsgdXNlclRva2VucyBdXHJcblx0XHRcdCMgQ2hlY2sgaWYgYW55IHRva2VucyBpbiB0aGVyZSB0byBzZW5kXHJcblx0XHRcdGlmICF1c2VyVG9rZW5zLmxlbmd0aFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJ1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cclxuXHJcblx0XHRcdGFsaXl1blRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKChpdGVtKSAtPlxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5pbmRleE9mKCdhbGl5dW46JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ3hpbmdlOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCdodWF3ZWk6JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ21pOicpID4gLTFcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnYWxpeXVuVG9rZW5zIGlzICcsIGFsaXl1blRva2Vucy50b1N0cmluZygpXHJcblxyXG5cdFx0XHRnY21Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcigoaXRlbSkgLT5cclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uaW5kZXhPZihcImFsaXl1bjpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJ4aW5nZTpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJodWF3ZWk6XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwibWk6XCIpIDwgMFxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdnY21Ub2tlbnMgaXMgJyAsIGdjbVRva2Vucy50b1N0cmluZygpO1xyXG5cclxuXHRcdFx0UHVzaC5zZW5kQWxpeXVuKGFsaXl1blRva2Vucywgbm90aWZpY2F0aW9uKTtcclxuXHJcblx0XHRcdFB1c2gub2xkX3NlbmRHQ00oZ2NtVG9rZW5zLCBub3RpZmljYXRpb24pO1xyXG5cclxuXHRcdFB1c2gub2xkX3NlbmRBUE4gPSBQdXNoLnNlbmRBUE5cclxuXHRcdFB1c2guc2VuZEFQTiA9ICh1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbikgLT5cclxuXHRcdFx0aWYgbm90aWZpY2F0aW9uLnRpdGxlIGFuZCBub3RpZmljYXRpb24udGV4dFxyXG5cdFx0XHRcdG5vdGkgPSBfLmNsb25lKG5vdGlmaWNhdGlvbilcclxuXHRcdFx0XHRub3RpLnRleHQgPSBub3RpLnRpdGxlICsgXCIgXCIgKyBub3RpLnRleHRcclxuXHRcdFx0XHRub3RpLnRpdGxlID0gXCJcIlxyXG5cdFx0XHRcdFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0UHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbilcclxuIiwidmFyIEFMWSwgQWxpeXVuX3B1c2gsIEh3UHVzaCwgTWlQdXNoLCBYaW5nZTtcblxuQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuXG5YaW5nZSA9IHJlcXVpcmUoJ3hpbmdlJyk7XG5cbkh3UHVzaCA9IHJlcXVpcmUoJ2h1YXdlaS1wdXNoJyk7XG5cbk1pUHVzaCA9IHJlcXVpcmUoJ3hpYW9taS1wdXNoJyk7XG5cbkFsaXl1bl9wdXNoID0ge307XG5cbkFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBjYWxsYmFjaykge1xuICB2YXIgQUxZUFVTSCwgWGluZ2VBcHAsIGFsaXl1blRva2VucywgYW5kcm9pZE1lc3NhZ2UsIGRhdGEsIGh1YXdlaVRva2VucywgbWlUb2tlbnMsIG1zZywgbm90aSwgcGFja2FnZV9uYW1lLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHRva2VuRGF0YUxpc3QsIHhpbmdlVG9rZW5zO1xuICBpZiAobm90aWZpY2F0aW9uLnRpdGxlICYmIG5vdGlmaWNhdGlvbi50ZXh0KSB7XG4gICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKHVzZXJUb2tlbnMpO1xuICAgIH1cbiAgICBhbGl5dW5Ub2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgeGluZ2VUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgaHVhd2VpVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIG1pVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIHVzZXJUb2tlbnMuZm9yRWFjaChmdW5jdGlvbih1c2VyVG9rZW4pIHtcbiAgICAgIHZhciBhcnI7XG4gICAgICBhcnIgPSB1c2VyVG9rZW4uc3BsaXQoJzonKTtcbiAgICAgIGlmIChhcnJbMF0gPT09IFwiYWxpeXVuXCIpIHtcbiAgICAgICAgcmV0dXJuIGFsaXl1blRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcInhpbmdlXCIpIHtcbiAgICAgICAgcmV0dXJuIHhpbmdlVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwiaHVhd2VpXCIpIHtcbiAgICAgICAgcmV0dXJuIGh1YXdlaVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcIm1pXCIpIHtcbiAgICAgICAgcmV0dXJuIG1pVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghXy5pc0VtcHR5KGFsaXl1blRva2VucykgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZi5hbGl5dW4gOiB2b2lkIDApKSB7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImFsaXl1blRva2VuczogXCIgKyBhbGl5dW5Ub2tlbnMpO1xuICAgICAgfVxuICAgICAgQUxZUFVTSCA9IG5ldyBBTFkuUFVTSCh7XG4gICAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWQsXG4gICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLnNlY3JldEFjY2Vzc0tleSxcbiAgICAgICAgZW5kcG9pbnQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5lbmRwb2ludCxcbiAgICAgICAgYXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb25cbiAgICAgIH0pO1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgQXBwS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBwS2V5LFxuICAgICAgICBUYXJnZXQ6ICdkZXZpY2UnLFxuICAgICAgICBUYXJnZXRWYWx1ZTogYWxpeXVuVG9rZW5zLnRvU3RyaW5nKCksXG4gICAgICAgIFRpdGxlOiBub3RpZmljYXRpb24udGl0bGUsXG4gICAgICAgIFN1bW1hcnk6IG5vdGlmaWNhdGlvbi50ZXh0XG4gICAgICB9O1xuICAgICAgQUxZUFVTSC5wdXNoTm90aWNlVG9BbmRyb2lkKGRhdGEsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkoeGluZ2VUb2tlbnMpICYmICgocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMS54aW5nZSA6IHZvaWQgMCkpIHtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwieGluZ2VUb2tlbnM6IFwiICsgeGluZ2VUb2tlbnMpO1xuICAgICAgfVxuICAgICAgWGluZ2VBcHAgPSBuZXcgWGluZ2UuWGluZ2VBcHAoTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2UuYWNjZXNzSWQsIE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLnNlY3JldEtleSk7XG4gICAgICBhbmRyb2lkTWVzc2FnZSA9IG5ldyBYaW5nZS5BbmRyb2lkTWVzc2FnZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnR5cGUgPSBYaW5nZS5NRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGU7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5jb250ZW50ID0gbm90aWZpY2F0aW9uLnRleHQ7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5zdHlsZSA9IG5ldyBYaW5nZS5TdHlsZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLmFjdGlvbiA9IG5ldyBYaW5nZS5DbGlja0FjdGlvbjtcbiAgICAgIF8uZWFjaCh4aW5nZVRva2VucywgZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gWGluZ2VBcHAucHVzaFRvU2luZ2xlRGV2aWNlKHQsIGFuZHJvaWRNZXNzYWdlLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkoaHVhd2VpVG9rZW5zKSAmJiAoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjIuaHVhd2VpIDogdm9pZCAwKSkge1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJodWF3ZWlUb2tlbnM6IFwiICsgaHVhd2VpVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIHBhY2thZ2VfbmFtZSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBQa2dOYW1lO1xuICAgICAgdG9rZW5EYXRhTGlzdCA9IFtdO1xuICAgICAgXy5lYWNoKGh1YXdlaVRva2VucywgZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdG9rZW5EYXRhTGlzdC5wdXNoKHtcbiAgICAgICAgICAncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLFxuICAgICAgICAgICd0b2tlbic6IHRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIG5vdGkgPSB7XG4gICAgICAgICdhbmRyb2lkJzoge1xuICAgICAgICAgICd0aXRsZSc6IG5vdGlmaWNhdGlvbi50aXRsZSxcbiAgICAgICAgICAnbWVzc2FnZSc6IG5vdGlmaWNhdGlvbi50ZXh0XG4gICAgICAgIH0sXG4gICAgICAgICdleHRyYXMnOiBub3RpZmljYXRpb24ucGF5bG9hZFxuICAgICAgfTtcbiAgICAgIEh1YXdlaVB1c2guY29uZmlnKFtcbiAgICAgICAge1xuICAgICAgICAgICdwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsXG4gICAgICAgICAgJ2NsaWVudF9pZCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBJZCxcbiAgICAgICAgICAnY2xpZW50X3NlY3JldCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXRcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgICBIdWF3ZWlQdXNoLnNlbmRNYW55KG5vdGksIHRva2VuRGF0YUxpc3QpO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eShtaVRva2VucykgJiYgKChyZWYzID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYzLm1pIDogdm9pZCAwKSkge1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJtaVRva2VuczogXCIgKyBtaVRva2Vucyk7XG4gICAgICB9XG4gICAgICBtc2cgPSBuZXcgTWlQdXNoLk1lc3NhZ2U7XG4gICAgICBtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5kZXNjcmlwdGlvbihub3RpZmljYXRpb24udGV4dCk7XG4gICAgICBub3RpZmljYXRpb24gPSBuZXcgTWlQdXNoLk5vdGlmaWNhdGlvbih7XG4gICAgICAgIHByb2R1Y3Rpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLnByb2R1Y3Rpb24sXG4gICAgICAgIGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkuYXBwU2VjcmV0XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2gobWlUb2tlbnMsIGZ1bmN0aW9uKHJlZ2lkKSB7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uc2VuZChyZWdpZCwgbXNnLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY29uZmlnLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjY7XG4gIGlmICghKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MuY3JvbikgIT0gbnVsbCA/IHJlZi5wdXNoX2ludGVydmFsIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25maWcgPSB7XG4gICAgZGVidWc6IHRydWUsXG4gICAga2VlcE5vdGlmaWNhdGlvbnM6IGZhbHNlLFxuICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24ucHVzaF9pbnRlcnZhbCxcbiAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICBwcm9kdWN0aW9uOiB0cnVlXG4gIH07XG4gIGlmICghXy5pc0VtcHR5KChyZWYxID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYxLmFwbiA6IHZvaWQgMCkpIHtcbiAgICBjb25maWcuYXBuID0ge1xuICAgICAga2V5RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmtleURhdGEsXG4gICAgICBjZXJ0RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmNlcnREYXRhXG4gICAgfTtcbiAgfVxuICBpZiAoIV8uaXNFbXB0eSgocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMi5nY20gOiB2b2lkIDApKSB7XG4gICAgY29uZmlnLmdjbSA9IHtcbiAgICAgIHByb2plY3ROdW1iZXI6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5wcm9qZWN0TnVtYmVyLFxuICAgICAgYXBpS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20uYXBpS2V5XG4gICAgfTtcbiAgfVxuICBQdXNoLkNvbmZpZ3VyZShjb25maWcpO1xuICBpZiAoKCgocmVmMyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMy5hbGl5dW4gOiB2b2lkIDApIHx8ICgocmVmNCA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNC54aW5nZSA6IHZvaWQgMCkgfHwgKChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY1Lmh1YXdlaSA6IHZvaWQgMCkgfHwgKChyZWY2ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY2Lm1pIDogdm9pZCAwKSkgJiYgUHVzaCAmJiB0eXBlb2YgUHVzaC5zZW5kR0NNID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUHVzaC5vbGRfc2VuZEdDTSA9IFB1c2guc2VuZEdDTTtcbiAgICBQdXNoLnNlbmRBbGl5dW4gPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBGaWJlciwgdXNlclRva2VuO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KSkge1xuICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyVG9rZW5zID09PSAnJyArIHVzZXJUb2tlbnMpIHtcbiAgICAgICAgdXNlclRva2VucyA9IFt1c2VyVG9rZW5zXTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlclRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgICAgIHVzZXJUb2tlbiA9IHVzZXJUb2tlbnMubGVuZ3RoID09PSAxID8gdXNlclRva2Vuc1swXSA6IG51bGw7XG4gICAgICByZXR1cm4gQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UodXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdBTkRST0lEIEVSUk9SOiByZXN1bHQgb2Ygc2VuZGVyOiAnICsgcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlciBpcyBudWxsJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXI6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdC5jYW5vbmljYWxfaWRzID09PSAxICYmIHVzZXJUb2tlbikge1xuICAgICAgICAgICAgRmliZXIoZnVuY3Rpb24oc2VsZikge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKHNlbGYub2xkVG9rZW4sIHNlbGYubmV3VG9rZW4pO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5ydW4oe1xuICAgICAgICAgICAgICBvbGRUb2tlbjoge1xuICAgICAgICAgICAgICAgIGdjbTogdXNlclRva2VuXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5ld1Rva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiBcImFsaXl1bjpcIiArIHJlc3VsdC5yZXN1bHRzWzBdLnJlZ2lzdHJhdGlvbl9pZFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWxsYmFjazogX3JlcGxhY2VUb2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQuZmFpbHVyZSAhPT0gMCAmJiB1c2VyVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBGaWJlcihmdW5jdGlvbihzZWxmKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soc2VsZi50b2tlbik7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnJ1bih7XG4gICAgICAgICAgICAgIHRva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiB1c2VyVG9rZW5cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IF9yZW1vdmVUb2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIFB1c2guc2VuZEdDTSA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIGFsaXl1blRva2VucywgZ2NtVG9rZW5zO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gZnJvbSBhbGl5dW4tPiBQdXNoLnNlbmRHQ00nKTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdCkpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSk7XG4gICAgICB9XG4gICAgICBpZiAodXNlclRva2VucyA9PT0gJycgKyB1c2VyVG9rZW5zKSB7XG4gICAgICAgIHVzZXJUb2tlbnMgPSBbdXNlclRva2Vuc107XG4gICAgICB9XG4gICAgICBpZiAoIXVzZXJUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICAgIGFsaXl1blRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaW5kZXhPZignYWxpeXVuOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCd4aW5nZTonKSA+IC0xIHx8IGl0ZW0uaW5kZXhPZignaHVhd2VpOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCdtaTonKSA+IC0xO1xuICAgICAgfSk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnYWxpeXVuVG9rZW5zIGlzICcsIGFsaXl1blRva2Vucy50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIGdjbVRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaW5kZXhPZihcImFsaXl1bjpcIikgPCAwICYmIGl0ZW0uaW5kZXhPZihcInhpbmdlOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwiaHVhd2VpOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwibWk6XCIpIDwgMDtcbiAgICAgIH0pO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2djbVRva2VucyBpcyAnLCBnY21Ub2tlbnMudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICBQdXNoLnNlbmRBbGl5dW4oYWxpeXVuVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRHQ00oZ2NtVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgIH07XG4gICAgUHVzaC5vbGRfc2VuZEFQTiA9IFB1c2guc2VuZEFQTjtcbiAgICByZXR1cm4gUHVzaC5zZW5kQVBOID0gZnVuY3Rpb24odXNlclRva2VuLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBub3RpO1xuICAgICAgaWYgKG5vdGlmaWNhdGlvbi50aXRsZSAmJiBub3RpZmljYXRpb24udGV4dCkge1xuICAgICAgICBub3RpID0gXy5jbG9uZShub3RpZmljYXRpb24pO1xuICAgICAgICBub3RpLnRleHQgPSBub3RpLnRpdGxlICsgXCIgXCIgKyBub3RpLnRleHQ7XG4gICAgICAgIG5vdGkudGl0bGUgPSBcIlwiO1xuICAgICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIl19
