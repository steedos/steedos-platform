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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3BhcnNlX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFyc2VfZmlsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvbGliL3Jlc3RpdnVzL2lyb24tcm91dGVyLWVycm9yLXRvLXJlc3BvbnNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3N0ZWVkb3Mvc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zdGVlZG9zL3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsIkJ1c2JveSIsIkZpYmVyIiwicmVxdWlyZSIsIkpzb25Sb3V0ZXMiLCJwYXJzZUZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImZpbGVzIiwibWV0aG9kIiwiaGVhZGVycyIsIm9uIiwiZmllbGRuYW1lIiwiZmlsZSIsImZpbGVuYW1lIiwiZW5jb2RpbmciLCJtaW1ldHlwZSIsImJ1ZmZlcnMiLCJpbWFnZSIsIm1pbWVUeXBlIiwiZGF0YSIsInB1c2giLCJCdWZmZXIiLCJjb25jYXQiLCJ2YWx1ZSIsImJvZHkiLCJydW4iLCJwaXBlIiwiZ2V0VXNlclF1ZXJ5U2VsZWN0b3IiLCJ1c2VyVmFsaWRhdG9yIiwiQXV0aCIsIk1hdGNoIiwiV2hlcmUiLCJ1c2VyIiwiY2hlY2siLCJpZCIsIk9wdGlvbmFsIiwiU3RyaW5nIiwidXNlcm5hbWUiLCJlbWFpbCIsIl8iLCJrZXlzIiwibGVuZ3RoIiwiRXJyb3IiLCJsb2dpbldpdGhQYXNzd29yZCIsInBhc3N3b3JkIiwiYXV0aFRva2VuIiwiYXV0aGVudGljYXRpbmdVc2VyIiwiYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IiLCJoYXNoZWRUb2tlbiIsInBhc3N3b3JkVmVyaWZpY2F0aW9uIiwicmVmIiwic3BhY2VfdXNlcnMiLCJzcGFjZXMiLCJNZXRlb3IiLCJ1c2VycyIsImZpbmRPbmUiLCJzZXJ2aWNlcyIsIkFjY291bnRzIiwiX2NoZWNrUGFzc3dvcmQiLCJlcnJvciIsIl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuIiwiX2hhc2hTdGFtcGVkVG9rZW4iLCJfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiIsIl9pZCIsImRiIiwiZmluZCIsImZldGNoIiwiZWFjaCIsInN1Iiwic3BhY2UiLCJTdGVlZG9zIiwiaGFzRmVhdHVyZSIsImluZGV4T2YiLCJhZG1pbnMiLCJuYW1lIiwidG9rZW4iLCJ1c2VySWQiLCJhZG1pblNwYWNlcyIsImVudiIsInByb2Nlc3MiLCJOT0RFX0VOViIsImlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlIiwiZXJyIiwic3RhdHVzQ29kZSIsInN0YXR1cyIsIm1zZyIsInN0YWNrIiwidG9TdHJpbmciLCJjb25zb2xlIiwiaGVhZGVyc1NlbnQiLCJzb2NrZXQiLCJkZXN0cm95Iiwic2V0SGVhZGVyIiwiYnl0ZUxlbmd0aCIsImVuZCIsInNoYXJlIiwiUm91dGUiLCJhcGkiLCJwYXRoIiwib3B0aW9ucyIsImVuZHBvaW50czEiLCJlbmRwb2ludHMiLCJwcm90b3R5cGUiLCJhZGRUb0FwaSIsImF2YWlsYWJsZU1ldGhvZHMiLCJhbGxvd2VkTWV0aG9kcyIsImZ1bGxQYXRoIiwicmVqZWN0ZWRNZXRob2RzIiwic2VsZiIsImNvbnRhaW5zIiwiX2NvbmZpZyIsInBhdGhzIiwiZXh0ZW5kIiwiZGVmYXVsdE9wdGlvbnNFbmRwb2ludCIsIl9yZXNvbHZlRW5kcG9pbnRzIiwiX2NvbmZpZ3VyZUVuZHBvaW50cyIsImZpbHRlciIsInJlamVjdCIsImFwaVBhdGgiLCJlbmRwb2ludCIsImFkZCIsImRvbmVGdW5jIiwiZW5kcG9pbnRDb250ZXh0IiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VJbml0aWF0ZWQiLCJ1cmxQYXJhbXMiLCJwYXJhbXMiLCJxdWVyeVBhcmFtcyIsInF1ZXJ5IiwiYm9keVBhcmFtcyIsInJlcXVlc3QiLCJyZXNwb25zZSIsImRvbmUiLCJfY2FsbEVuZHBvaW50IiwiZXJyb3IxIiwiX3Jlc3BvbmQiLCJtZXNzYWdlIiwiam9pbiIsInRvVXBwZXJDYXNlIiwiaXNGdW5jdGlvbiIsImFjdGlvbiIsInJlZjEiLCJyZWYyIiwicm9sZVJlcXVpcmVkIiwidW5pb24iLCJpc0VtcHR5IiwiYXV0aFJlcXVpcmVkIiwic3BhY2VSZXF1aXJlZCIsImludm9jYXRpb24iLCJfYXV0aEFjY2VwdGVkIiwiX3JvbGVBY2NlcHRlZCIsIl9zcGFjZUFjY2VwdGVkIiwiRERQQ29tbW9uIiwiTWV0aG9kSW52b2NhdGlvbiIsImlzU2ltdWxhdGlvbiIsImNvbm5lY3Rpb24iLCJyYW5kb21TZWVkIiwibWFrZVJwY1NlZWQiLCJERFAiLCJfQ3VycmVudEludm9jYXRpb24iLCJ3aXRoVmFsdWUiLCJjYWxsIiwiX2F1dGhlbnRpY2F0ZSIsImF1dGgiLCJ1c2VyU2VsZWN0b3IiLCJzcGFjZV91c2Vyc19jb3VudCIsInNwYWNlSWQiLCJjb3VudCIsImludGVyc2VjdGlvbiIsInJvbGVzIiwiZGVmYXVsdEhlYWRlcnMiLCJkZWxheUluTWlsbGlzZWNvbmRzIiwibWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMiLCJyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byIsInNlbmRSZXNwb25zZSIsIl9sb3dlckNhc2VLZXlzIiwibWF0Y2giLCJwcmV0dHlKc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlSGVhZCIsIndyaXRlIiwiTWF0aCIsInJhbmRvbSIsInNldFRpbWVvdXQiLCJvYmplY3QiLCJjaGFpbiIsInBhaXJzIiwibWFwIiwiYXR0ciIsInRvTG93ZXJDYXNlIiwiUmVzdGl2dXMiLCJpdGVtIiwiaSIsImwiLCJjb3JzSGVhZGVycyIsIl9yb3V0ZXMiLCJ1c2VEZWZhdWx0QXV0aCIsInZlcnNpb24iLCJfdXNlciIsIl9oYXNoTG9naW5Ub2tlbiIsImVuYWJsZUNvcnMiLCJzbGljZSIsImxhc3QiLCJfaW5pdEF1dGgiLCJ1c2VBdXRoIiwid2FybiIsImFkZFJvdXRlIiwicm91dGUiLCJhZGRDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FbmRwb2ludHMiLCJjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMiLCJlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24iLCJlbnRpdHlSb3V0ZUVuZHBvaW50cyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwibWV0aG9kcyIsIm1ldGhvZHNPbkNvbGxlY3Rpb24iLCJyb3V0ZU9wdGlvbnMiLCJfdXNlckNvbGxlY3Rpb25FbmRwb2ludHMiLCJfY29sbGVjdGlvbkVuZHBvaW50cyIsIl9uYW1lIiwiY29uZmlndXJlZEVuZHBvaW50IiwiZW5kcG9pbnRPcHRpb25zIiwibWV0aG9kVHlwZSIsImNsb25lIiwiZ2V0IiwiZW50aXR5Iiwic2VsZWN0b3IiLCJwdXQiLCJlbnRpdHlJc1VwZGF0ZWQiLCJ1cGRhdGUiLCIkc2V0IiwicmVtb3ZlIiwicG9zdCIsImVudGl0eUlkIiwiaW5zZXJ0IiwiZ2V0QWxsIiwiZW50aXRpZXMiLCJmaWVsZHMiLCJwcm9maWxlIiwiY3JlYXRlVXNlciIsImxvZ291dCIsImUiLCJleHRyYURhdGEiLCJzZWFyY2hRdWVyeSIsInJlYXNvbiIsIm9uTG9nZ2VkSW4iLCJleHRyYSIsImluZGV4IiwidG9rZW5GaWVsZE5hbWUiLCJ0b2tlbkxvY2F0aW9uIiwidG9rZW5QYXRoIiwidG9rZW5SZW1vdmFsUXVlcnkiLCJ0b2tlblRvUmVtb3ZlIiwibGFzdEluZGV4T2YiLCJzdWJzdHJpbmciLCIkcHVsbCIsIm9uTG9nZ2VkT3V0IiwiaXNTZXJ2ZXIiLCJBUEkiLCJzdGFydHVwIiwib3JnYW5pemF0aW9ucyIsImNmcyIsImluc3RhbmNlcyIsIm5ld0ZpbGUiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwidHlwZSIsImZpbGVPYmoiLCJtZXRhZGF0YSIsInBhcmVudCIsInIiLCJpbmNsdWRlcyIsIm1vbWVudCIsIkRhdGUiLCJmb3JtYXQiLCJzcGxpdCIsInBvcCIsImRlY29kZVVSSUNvbXBvbmVudCIsInJlcGxhY2UiLCJvd25lciIsIm93bmVyX25hbWUiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwidG9Mb2NhbGVMb3dlckNhc2UiLCJpc19wcml2YXRlIiwibWFpbiIsIiR1bnNldCIsImxvY2tlZF9ieSIsImxvY2tlZF9ieV9uYW1lIiwiJG5lIiwib25jZSIsInN0b3JlTmFtZSIsInJlc3AiLCJzaXplIiwib3JpZ2luYWwiLCJ2ZXJzaW9uX2lkIiwiYWJzb2x1dGVVcmwiLCJwdXNoVG9waWMiLCJ1c2VySWRzIiwiZnJvbSIsImFwcE5hbWUiLCJhbGVydFRpdGxlIiwiYWxlcnQiLCJiYWRnZSIsInNvdW5kIiwiUHVzaCIsInNlbmQiLCJwdXNoU2VuZCIsInRleHQiLCJ0aXRsZSIsIkFsaXl1bl9wdXNoIiwic2VuZE1lc3NhZ2UiLCJ1c2VyVG9rZW5zIiwibm90aWZpY2F0aW9uIiwiY2FsbGJhY2siLCJBTFkiLCJBTFlQVVNIIiwiTWlQdXNoIiwiWGluZ2UiLCJYaW5nZUFwcCIsImFsaXl1blRva2VucyIsImFuZHJvaWRNZXNzYWdlIiwiaHVhd2VpVG9rZW5zIiwibWlUb2tlbnMiLCJub3RpIiwicGFja2FnZV9uYW1lIiwicmVmMyIsInRva2VuRGF0YUxpc3QiLCJ4aW5nZVRva2VucyIsImRlYnVnIiwibG9nIiwiQXJyYXkiLCJmb3JFYWNoIiwidXNlclRva2VuIiwiYXJyIiwic2V0dGluZ3MiLCJhbGl5dW4iLCJQVVNIIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJhcGlWZXJzaW9uIiwiQXBwS2V5IiwiYXBwS2V5IiwiVGFyZ2V0IiwiVGFyZ2V0VmFsdWUiLCJUaXRsZSIsIlN1bW1hcnkiLCJwdXNoTm90aWNlVG9BbmRyb2lkIiwieGluZ2UiLCJhY2Nlc3NJZCIsInNlY3JldEtleSIsIkFuZHJvaWRNZXNzYWdlIiwiTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTiIsImNvbnRlbnQiLCJzdHlsZSIsIlN0eWxlIiwiQ2xpY2tBY3Rpb24iLCJ0IiwicHVzaFRvU2luZ2xlRGV2aWNlIiwiaHVhd2VpIiwiYXBwUGtnTmFtZSIsInBheWxvYWQiLCJIdWF3ZWlQdXNoIiwiY29uZmlnIiwiYXBwSWQiLCJhcHBTZWNyZXQiLCJzZW5kTWFueSIsIm1pIiwiTWVzc2FnZSIsImRlc2NyaXB0aW9uIiwiTm90aWZpY2F0aW9uIiwicHJvZHVjdGlvbiIsInJlZ2lkIiwicmVmNCIsInJlZjUiLCJyZWY2IiwiY3JvbiIsInB1c2hfaW50ZXJ2YWwiLCJrZWVwTm90aWZpY2F0aW9ucyIsInNlbmRJbnRlcnZhbCIsInNlbmRCYXRjaFNpemUiLCJhcG4iLCJrZXlEYXRhIiwiY2VydERhdGEiLCJnY20iLCJwcm9qZWN0TnVtYmVyIiwiYXBpS2V5IiwiQ29uZmlndXJlIiwic2VuZEdDTSIsIm9sZF9zZW5kR0NNIiwic2VuZEFsaXl1biIsInRlc3QiLCJPYmplY3QiLCJyZXN1bHQiLCJjYW5vbmljYWxfaWRzIiwib2xkVG9rZW4iLCJuZXdUb2tlbiIsInJlc3VsdHMiLCJyZWdpc3RyYXRpb25faWQiLCJfcmVwbGFjZVRva2VuIiwiZmFpbHVyZSIsIl9yZW1vdmVUb2tlbiIsImdjbVRva2VucyIsIm9sZF9zZW5kQVBOIiwic2VuZEFQTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLGdCQUFjLFNBREU7QUFFaEJJLFFBQU0sRUFBRSxVQUZRO0FBR2hCQyxTQUFPLEVBQUUsU0FITztBQUloQixTQUFPLFNBSlM7QUFLaEIsU0FBTyxVQUxTO0FBTWhCLGFBQVcsVUFOSztBQU9oQixXQUFTLFNBUE87QUFRaEIsaUJBQWU7QUFSQyxDQUFELEVBU2IsYUFUYSxDQUFoQixDOzs7Ozs7Ozs7Ozs7QUNEQSxJQUFBQyxNQUFBLEVBQUFDLEtBQUE7QUFBQUQsU0FBU0UsUUFBUSxRQUFSLENBQVQ7QUFDQUQsUUFBUUMsUUFBUSxRQUFSLENBQVI7O0FBRUFDLFdBQVdDLFVBQVgsR0FBd0IsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUFDdkIsTUFBQVQsTUFBQSxFQUFBVSxLQUFBO0FBQUFBLFVBQVEsRUFBUjs7QUFFQSxNQUFJSCxJQUFJSSxNQUFKLEtBQWMsTUFBbEI7QUFDQ1gsYUFBUyxJQUFJRSxNQUFKLENBQVc7QUFBRVUsZUFBU0wsSUFBSUs7QUFBZixLQUFYLENBQVQ7QUFDQVosV0FBT2EsRUFBUCxDQUFVLE1BQVYsRUFBbUIsVUFBQ0MsU0FBRCxFQUFZQyxJQUFaLEVBQWtCQyxRQUFsQixFQUE0QkMsUUFBNUIsRUFBc0NDLFFBQXRDO0FBQ2xCLFVBQUFDLE9BQUEsRUFBQUMsS0FBQTtBQUFBQSxjQUFRLEVBQVI7QUFDQUEsWUFBTUMsUUFBTixHQUFpQkgsUUFBakI7QUFDQUUsWUFBTUgsUUFBTixHQUFpQkEsUUFBakI7QUFDQUcsWUFBTUosUUFBTixHQUFpQkEsUUFBakI7QUFHQUcsZ0JBQVUsRUFBVjtBQUVBSixXQUFLRixFQUFMLENBQVEsTUFBUixFQUFnQixVQUFDUyxJQUFEO0FDSVgsZURISkgsUUFBUUksSUFBUixDQUFhRCxJQUFiLENDR0k7QURKTDtBQ01HLGFESEhQLEtBQUtGLEVBQUwsQ0FBUSxLQUFSLEVBQWU7QUFFZE8sY0FBTUUsSUFBTixHQUFhRSxPQUFPQyxNQUFQLENBQWNOLE9BQWQsQ0FBYjtBQ0dJLGVEREpULE1BQU1hLElBQU4sQ0FBV0gsS0FBWCxDQ0NJO0FETEwsUUNHRztBRGZKO0FBbUJBcEIsV0FBT2EsRUFBUCxDQUFVLE9BQVYsRUFBbUIsVUFBQ0MsU0FBRCxFQUFZWSxLQUFaO0FDRWYsYURESG5CLElBQUlvQixJQUFKLENBQVNiLFNBQVQsSUFBc0JZLEtDQ25CO0FERko7QUFHQTFCLFdBQU9hLEVBQVAsQ0FBVSxRQUFWLEVBQXFCO0FBRXBCTixVQUFJRyxLQUFKLEdBQVlBLEtBQVo7QUNDRyxhRENIUCxNQUFNO0FDQUQsZURDSk0sTUNESTtBREFMLFNBRUNtQixHQUZELEVDREc7QURISjtBQ09FLFdERUZyQixJQUFJc0IsSUFBSixDQUFTN0IsTUFBVCxDQ0ZFO0FEL0JIO0FDaUNHLFdER0ZTLE1DSEU7QUFDRDtBRHJDcUIsQ0FBeEIsQzs7Ozs7Ozs7Ozs7O0FFSEEsSUFBQXFCLG9CQUFBLEVBQUFDLGFBQUE7QUFBQSxLQUFDQyxJQUFELFVBQUNBLElBQUQsR0FBVSxFQUFWLEUsQ0FFQTs7O0FBR0FELGdCQUFnQkUsTUFBTUMsS0FBTixDQUFZLFVBQUNDLElBQUQ7QUFDMUJDLFFBQU1ELElBQU4sRUFDRTtBQUFBRSxRQUFJSixNQUFNSyxRQUFOLENBQWVDLE1BQWYsQ0FBSjtBQUNBQyxjQUFVUCxNQUFNSyxRQUFOLENBQWVDLE1BQWYsQ0FEVjtBQUVBRSxXQUFPUixNQUFNSyxRQUFOLENBQWVDLE1BQWY7QUFGUCxHQURGOztBQUtBLE1BQUdHLEVBQUVDLElBQUYsQ0FBT1IsSUFBUCxFQUFhUyxNQUFiLEtBQXVCLENBQUksQ0FBOUI7QUFDRSxVQUFNLElBQUlYLE1BQU1ZLEtBQVYsQ0FBZ0IsNkNBQWhCLENBQU47QUNLRDs7QURIRCxTQUFPLElBQVA7QUFUYyxFQUFoQixDLENBWUE7Ozs7QUFHQWYsdUJBQXVCLFVBQUNLLElBQUQ7QUFDckIsTUFBR0EsS0FBS0UsRUFBUjtBQUNFLFdBQU87QUFBQyxhQUFPRixLQUFLRTtBQUFiLEtBQVA7QUFERixTQUVLLElBQUdGLEtBQUtLLFFBQVI7QUFDSCxXQUFPO0FBQUMsa0JBQVlMLEtBQUtLO0FBQWxCLEtBQVA7QUFERyxTQUVBLElBQUdMLEtBQUtNLEtBQVI7QUFDSCxXQUFPO0FBQUMsd0JBQWtCTixLQUFLTTtBQUF4QixLQUFQO0FDYUQ7O0FEVkQsUUFBTSxJQUFJSSxLQUFKLENBQVUsMENBQVYsQ0FBTjtBQVRxQixDQUF2QixDLENBWUE7Ozs7QUFHQSxLQUFDYixJQUFELENBQU1jLGlCQUFOLEdBQTBCLFVBQUNYLElBQUQsRUFBT1ksUUFBUDtBQUN4QixNQUFBQyxTQUFBLEVBQUFDLGtCQUFBLEVBQUFDLDBCQUFBLEVBQUFDLFdBQUEsRUFBQUMsb0JBQUEsRUFBQUMsR0FBQSxFQUFBQyxXQUFBLEVBQUFDLE1BQUE7O0FBQUEsTUFBRyxDQUFJcEIsSUFBSixJQUFZLENBQUlZLFFBQW5CO0FBQ0UsVUFBTSxJQUFJUyxPQUFPWCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGNBQXRCLENBQU47QUNlRDs7QURaRFQsUUFBTUQsSUFBTixFQUFZSixhQUFaO0FBQ0FLLFFBQU1XLFFBQU4sRUFBZ0JSLE1BQWhCO0FBR0FXLCtCQUE2QnBCLHFCQUFxQkssSUFBckIsQ0FBN0I7QUFDQWMsdUJBQXFCTyxPQUFPQyxLQUFQLENBQWFDLE9BQWIsQ0FBcUJSLDBCQUFyQixDQUFyQjs7QUFFQSxNQUFHLENBQUlELGtCQUFQO0FBQ0UsVUFBTSxJQUFJTyxPQUFPWCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGNBQXRCLENBQU47QUNXRDs7QURWRCxNQUFHLEdBQUFRLE1BQUFKLG1CQUFBVSxRQUFBLFlBQUFOLElBQWlDTixRQUFqQyxHQUFpQyxNQUFqQyxDQUFIO0FBQ0UsVUFBTSxJQUFJUyxPQUFPWCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGNBQXRCLENBQU47QUNZRDs7QURURE8seUJBQXVCUSxTQUFTQyxjQUFULENBQXdCWixrQkFBeEIsRUFBNENGLFFBQTVDLENBQXZCOztBQUNBLE1BQUdLLHFCQUFxQlUsS0FBeEI7QUFDRSxVQUFNLElBQUlOLE9BQU9YLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsY0FBdEIsQ0FBTjtBQ1dEOztBRFJERyxjQUFZWSxTQUFTRywwQkFBVCxFQUFaO0FBQ0FaLGdCQUFjUyxTQUFTSSxpQkFBVCxDQUEyQmhCLFNBQTNCLENBQWQ7O0FBQ0FZLFdBQVNLLHVCQUFULENBQWlDaEIsbUJBQW1CaUIsR0FBcEQsRUFBeURmLFdBQXpEOztBQUVBRyxnQkFBY2EsR0FBR2IsV0FBSCxDQUFlYyxJQUFmLENBQW9CO0FBQUNqQyxVQUFNYyxtQkFBbUJpQjtBQUExQixHQUFwQixFQUFvREcsS0FBcEQsRUFBZDtBQUNBZCxXQUFTLEVBQVQ7O0FBQ0FiLElBQUU0QixJQUFGLENBQU9oQixXQUFQLEVBQW9CLFVBQUNpQixFQUFEO0FBQ2xCLFFBQUFDLEtBQUE7QUFBQUEsWUFBUUwsR0FBR1osTUFBSCxDQUFVRyxPQUFWLENBQWtCYSxHQUFHQyxLQUFyQixDQUFSOztBQUVBLFFBQUdBLFNBQVNDLFFBQVFDLFVBQVIsQ0FBbUIsTUFBbkIsRUFBMkJILEdBQUdDLEtBQTlCLENBQVQsSUFBa0Q5QixFQUFFaUMsT0FBRixDQUFVSCxNQUFNSSxNQUFoQixFQUF3QkwsR0FBR3BDLElBQTNCLEtBQWtDLENBQXZGO0FDV0UsYURWQW9CLE9BQU9oQyxJQUFQLENBQ0U7QUFBQTJDLGFBQUtNLE1BQU1OLEdBQVg7QUFDQVcsY0FBTUwsTUFBTUs7QUFEWixPQURGLENDVUE7QUFJRDtBRGxCSDs7QUFPQSxTQUFPO0FBQUM3QixlQUFXQSxVQUFVOEIsS0FBdEI7QUFBNkJDLFlBQVE5QixtQkFBbUJpQixHQUF4RDtBQUE2RGMsaUJBQWF6QjtBQUExRSxHQUFQO0FBcEN3QixDQUExQixDOzs7Ozs7Ozs7OztBRW5DQTtBQUNBO0FBRUE7QUFDQSxJQUFJMEIsR0FBRyxHQUFHQyxPQUFPLENBQUNELEdBQVIsQ0FBWUUsUUFBWixJQUF3QixhQUFsQyxDLENBRUE7O0FBQ0FDLDZCQUE2QixHQUFHLFVBQVVDLEdBQVYsRUFBZTlFLEdBQWYsRUFBb0JDLEdBQXBCLEVBQXlCO0FBQ3ZELE1BQUlBLEdBQUcsQ0FBQzhFLFVBQUosR0FBaUIsR0FBckIsRUFDRTlFLEdBQUcsQ0FBQzhFLFVBQUosR0FBaUIsR0FBakI7QUFFRixNQUFJRCxHQUFHLENBQUNFLE1BQVIsRUFDRS9FLEdBQUcsQ0FBQzhFLFVBQUosR0FBaUJELEdBQUcsQ0FBQ0UsTUFBckI7QUFFRixNQUFJTixHQUFHLEtBQUssYUFBWixFQUNFTyxHQUFHLEdBQUcsQ0FBQ0gsR0FBRyxDQUFDSSxLQUFKLElBQWFKLEdBQUcsQ0FBQ0ssUUFBSixFQUFkLElBQWdDLElBQXRDLENBREYsS0FHRTtBQUNBRixPQUFHLEdBQUcsZUFBTjtBQUVGRyxTQUFPLENBQUM3QixLQUFSLENBQWN1QixHQUFHLENBQUNJLEtBQUosSUFBYUosR0FBRyxDQUFDSyxRQUFKLEVBQTNCO0FBRUEsTUFBSWxGLEdBQUcsQ0FBQ29GLFdBQVIsRUFDRSxPQUFPckYsR0FBRyxDQUFDc0YsTUFBSixDQUFXQyxPQUFYLEVBQVA7QUFFRnRGLEtBQUcsQ0FBQ3VGLFNBQUosQ0FBYyxjQUFkLEVBQThCLFdBQTlCO0FBQ0F2RixLQUFHLENBQUN1RixTQUFKLENBQWMsZ0JBQWQsRUFBZ0N2RSxNQUFNLENBQUN3RSxVQUFQLENBQWtCUixHQUFsQixDQUFoQztBQUNBLE1BQUlqRixHQUFHLENBQUNJLE1BQUosS0FBZSxNQUFuQixFQUNFLE9BQU9ILEdBQUcsQ0FBQ3lGLEdBQUosRUFBUDtBQUNGekYsS0FBRyxDQUFDeUYsR0FBSixDQUFRVCxHQUFSO0FBQ0E7QUFDRCxDQXhCRCxDOzs7Ozs7Ozs7Ozs7QUNQTVUsTUFBTUMsS0FBTixHQUFNO0FBRUcsV0FBQUEsS0FBQSxDQUFDQyxHQUFELEVBQU9DLElBQVAsRUFBY0MsT0FBZCxFQUF3QkMsVUFBeEI7QUFBQyxTQUFDSCxHQUFELEdBQUFBLEdBQUE7QUFBTSxTQUFDQyxJQUFELEdBQUFBLElBQUE7QUFBTyxTQUFDQyxPQUFELEdBQUFBLE9BQUE7QUFBVSxTQUFDRSxTQUFELEdBQUFELFVBQUE7O0FBRW5DLFFBQUcsQ0FBSSxLQUFDQyxTQUFSO0FBQ0UsV0FBQ0EsU0FBRCxHQUFhLEtBQUNGLE9BQWQ7QUFDQSxXQUFDQSxPQUFELEdBQVcsRUFBWDtBQ0dEO0FEUFU7O0FDVWJILFFBQU1NLFNBQU4sQ0RIQUMsUUNHQSxHREhhO0FBQ1gsUUFBQUMsZ0JBQUE7QUFBQUEsdUJBQW1CLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsS0FBaEIsRUFBdUIsT0FBdkIsRUFBZ0MsUUFBaEMsRUFBMEMsU0FBMUMsQ0FBbkI7QUFFQSxXQUFPO0FBQ0wsVUFBQUMsY0FBQSxFQUFBQyxRQUFBLEVBQUFDLGVBQUEsRUFBQUMsSUFBQTtBQUFBQSxhQUFPLElBQVA7O0FBSUEsVUFBR3JFLEVBQUVzRSxRQUFGLENBQVcsS0FBQ1osR0FBRCxDQUFLYSxPQUFMLENBQWFDLEtBQXhCLEVBQStCLEtBQUNiLElBQWhDLENBQUg7QUFDRSxjQUFNLElBQUl4RCxLQUFKLENBQVUsNkNBQTJDLEtBQUN3RCxJQUF0RCxDQUFOO0FDRUQ7O0FEQ0QsV0FBQ0csU0FBRCxHQUFhOUQsRUFBRXlFLE1BQUYsQ0FBUztBQUFBYixpQkFBUyxLQUFDRixHQUFELENBQUthLE9BQUwsQ0FBYUc7QUFBdEIsT0FBVCxFQUF1RCxLQUFDWixTQUF4RCxDQUFiOztBQUdBLFdBQUNhLGlCQUFEOztBQUNBLFdBQUNDLG1CQUFEOztBQUdBLFdBQUNsQixHQUFELENBQUthLE9BQUwsQ0FBYUMsS0FBYixDQUFtQjNGLElBQW5CLENBQXdCLEtBQUM4RSxJQUF6Qjs7QUFFQU8sdUJBQWlCbEUsRUFBRTZFLE1BQUYsQ0FBU1osZ0JBQVQsRUFBMkIsVUFBQ2hHLE1BQUQ7QUNGMUMsZURHQStCLEVBQUVzRSxRQUFGLENBQVd0RSxFQUFFQyxJQUFGLENBQU9vRSxLQUFLUCxTQUFaLENBQVgsRUFBbUM3RixNQUFuQyxDQ0hBO0FERWUsUUFBakI7QUFFQW1HLHdCQUFrQnBFLEVBQUU4RSxNQUFGLENBQVNiLGdCQUFULEVBQTJCLFVBQUNoRyxNQUFEO0FDRDNDLGVERUErQixFQUFFc0UsUUFBRixDQUFXdEUsRUFBRUMsSUFBRixDQUFPb0UsS0FBS1AsU0FBWixDQUFYLEVBQW1DN0YsTUFBbkMsQ0NGQTtBRENnQixRQUFsQjtBQUlBa0csaUJBQVcsS0FBQ1QsR0FBRCxDQUFLYSxPQUFMLENBQWFRLE9BQWIsR0FBdUIsS0FBQ3BCLElBQW5DOztBQUNBM0QsUUFBRTRCLElBQUYsQ0FBT3NDLGNBQVAsRUFBdUIsVUFBQ2pHLE1BQUQ7QUFDckIsWUFBQStHLFFBQUE7QUFBQUEsbUJBQVdYLEtBQUtQLFNBQUwsQ0FBZTdGLE1BQWYsQ0FBWDtBQ0RBLGVERUFOLFdBQVdzSCxHQUFYLENBQWVoSCxNQUFmLEVBQXVCa0csUUFBdkIsRUFBaUMsVUFBQ3RHLEdBQUQsRUFBTUMsR0FBTjtBQUUvQixjQUFBb0gsUUFBQSxFQUFBQyxlQUFBLEVBQUEvRCxLQUFBLEVBQUFnRSxZQUFBLEVBQUFDLGlCQUFBO0FBQUFBLDhCQUFvQixLQUFwQjs7QUFDQUgscUJBQVc7QUNEVCxtQkRFQUcsb0JBQW9CLElDRnBCO0FEQ1MsV0FBWDs7QUFHQUYsNEJBQ0U7QUFBQUcsdUJBQVd6SCxJQUFJMEgsTUFBZjtBQUNBQyx5QkFBYTNILElBQUk0SCxLQURqQjtBQUVBQyx3QkFBWTdILElBQUlvQixJQUZoQjtBQUdBMEcscUJBQVM5SCxHQUhUO0FBSUErSCxzQkFBVTlILEdBSlY7QUFLQStILGtCQUFNWDtBQUxOLFdBREY7O0FBUUFsRixZQUFFeUUsTUFBRixDQUFTVSxlQUFULEVBQTBCSCxRQUExQjs7QUFHQUkseUJBQWUsSUFBZjs7QUFDQTtBQUNFQSwyQkFBZWYsS0FBS3lCLGFBQUwsQ0FBbUJYLGVBQW5CLEVBQW9DSCxRQUFwQyxDQUFmO0FBREYsbUJBQUFlLE1BQUE7QUFFTTNFLG9CQUFBMkUsTUFBQTtBQUVKckQsMENBQThCdEIsS0FBOUIsRUFBcUN2RCxHQUFyQyxFQUEwQ0MsR0FBMUM7QUFDQTtBQ0hEOztBREtELGNBQUd1SCxpQkFBSDtBQUVFdkgsZ0JBQUl5RixHQUFKO0FBQ0E7QUFIRjtBQUtFLGdCQUFHekYsSUFBSW9GLFdBQVA7QUFDRSxvQkFBTSxJQUFJL0MsS0FBSixDQUFVLHNFQUFvRWxDLE1BQXBFLEdBQTJFLEdBQTNFLEdBQThFa0csUUFBeEYsQ0FBTjtBQURGLG1CQUVLLElBQUdpQixpQkFBZ0IsSUFBaEIsSUFBd0JBLGlCQUFnQixNQUEzQztBQUNILG9CQUFNLElBQUlqRixLQUFKLENBQVUsdURBQXFEbEMsTUFBckQsR0FBNEQsR0FBNUQsR0FBK0RrRyxRQUF6RSxDQUFOO0FBUko7QUNLQzs7QURNRCxjQUFHaUIsYUFBYW5HLElBQWIsS0FBdUJtRyxhQUFheEMsVUFBYixJQUEyQndDLGFBQWFsSCxPQUEvRCxDQUFIO0FDSkUsbUJES0FtRyxLQUFLMkIsUUFBTCxDQUFjbEksR0FBZCxFQUFtQnNILGFBQWFuRyxJQUFoQyxFQUFzQ21HLGFBQWF4QyxVQUFuRCxFQUErRHdDLGFBQWFsSCxPQUE1RSxDQ0xBO0FESUY7QUNGRSxtQkRLQW1HLEtBQUsyQixRQUFMLENBQWNsSSxHQUFkLEVBQW1Cc0gsWUFBbkIsQ0NMQTtBQUNEO0FEbkNILFVDRkE7QURBRjs7QUN3Q0EsYURHQXBGLEVBQUU0QixJQUFGLENBQU93QyxlQUFQLEVBQXdCLFVBQUNuRyxNQUFEO0FDRnRCLGVER0FOLFdBQVdzSCxHQUFYLENBQWVoSCxNQUFmLEVBQXVCa0csUUFBdkIsRUFBaUMsVUFBQ3RHLEdBQUQsRUFBTUMsR0FBTjtBQUMvQixjQUFBSSxPQUFBLEVBQUFrSCxZQUFBO0FBQUFBLHlCQUFlO0FBQUF2QyxvQkFBUSxPQUFSO0FBQWlCb0QscUJBQVM7QUFBMUIsV0FBZjtBQUNBL0gsb0JBQVU7QUFBQSxxQkFBU2dHLGVBQWVnQyxJQUFmLENBQW9CLElBQXBCLEVBQTBCQyxXQUExQjtBQUFULFdBQVY7QUNJQSxpQkRIQTlCLEtBQUsyQixRQUFMLENBQWNsSSxHQUFkLEVBQW1Cc0gsWUFBbkIsRUFBaUMsR0FBakMsRUFBc0NsSCxPQUF0QyxDQ0dBO0FETkYsVUNIQTtBREVGLFFDSEE7QURqRUssS0FBUDtBQUhXLEtDR2IsQ0RaVSxDQXVGVjs7Ozs7OztBQ2NBdUYsUUFBTU0sU0FBTixDRFJBWSxpQkNRQSxHRFJtQjtBQUNqQjNFLE1BQUU0QixJQUFGLENBQU8sS0FBQ2tDLFNBQVIsRUFBbUIsVUFBQ2tCLFFBQUQsRUFBVy9HLE1BQVgsRUFBbUI2RixTQUFuQjtBQUNqQixVQUFHOUQsRUFBRW9HLFVBQUYsQ0FBYXBCLFFBQWIsQ0FBSDtBQ1NFLGVEUkFsQixVQUFVN0YsTUFBVixJQUFvQjtBQUFDb0ksa0JBQVFyQjtBQUFULFNDUXBCO0FBR0Q7QURiSDtBQURpQixHQ1FuQixDRHJHVSxDQW9HVjs7Ozs7Ozs7Ozs7Ozs7OztBQzRCQXZCLFFBQU1NLFNBQU4sQ0RiQWEsbUJDYUEsR0RicUI7QUFDbkI1RSxNQUFFNEIsSUFBRixDQUFPLEtBQUNrQyxTQUFSLEVBQW1CLFVBQUNrQixRQUFELEVBQVcvRyxNQUFYO0FBQ2pCLFVBQUEwQyxHQUFBLEVBQUEyRixJQUFBLEVBQUFDLElBQUE7O0FBQUEsVUFBR3RJLFdBQVksU0FBZjtBQUVFLFlBQUcsR0FBQTBDLE1BQUEsS0FBQWlELE9BQUEsWUFBQWpELElBQWM2RixZQUFkLEdBQWMsTUFBZCxDQUFIO0FBQ0UsZUFBQzVDLE9BQUQsQ0FBUzRDLFlBQVQsR0FBd0IsRUFBeEI7QUNjRDs7QURiRCxZQUFHLENBQUl4QixTQUFTd0IsWUFBaEI7QUFDRXhCLG1CQUFTd0IsWUFBVCxHQUF3QixFQUF4QjtBQ2VEOztBRGREeEIsaUJBQVN3QixZQUFULEdBQXdCeEcsRUFBRXlHLEtBQUYsQ0FBUXpCLFNBQVN3QixZQUFqQixFQUErQixLQUFDNUMsT0FBRCxDQUFTNEMsWUFBeEMsQ0FBeEI7O0FBRUEsWUFBR3hHLEVBQUUwRyxPQUFGLENBQVUxQixTQUFTd0IsWUFBbkIsQ0FBSDtBQUNFeEIsbUJBQVN3QixZQUFULEdBQXdCLEtBQXhCO0FDZUQ7O0FEWkQsWUFBR3hCLFNBQVMyQixZQUFULEtBQXlCLE1BQTVCO0FBQ0UsZ0JBQUFMLE9BQUEsS0FBQTFDLE9BQUEsWUFBQTBDLEtBQWFLLFlBQWIsR0FBYSxNQUFiLEtBQTZCM0IsU0FBU3dCLFlBQXRDO0FBQ0V4QixxQkFBUzJCLFlBQVQsR0FBd0IsSUFBeEI7QUFERjtBQUdFM0IscUJBQVMyQixZQUFULEdBQXdCLEtBQXhCO0FBSko7QUNtQkM7O0FEYkQsYUFBQUosT0FBQSxLQUFBM0MsT0FBQSxZQUFBMkMsS0FBYUssYUFBYixHQUFhLE1BQWI7QUFDRTVCLG1CQUFTNEIsYUFBVCxHQUF5QixLQUFDaEQsT0FBRCxDQUFTZ0QsYUFBbEM7QUFuQko7QUNtQ0M7QURwQ0gsT0FzQkUsSUF0QkY7QUFEbUIsR0NhckIsQ0RoSVUsQ0E4SVY7Ozs7OztBQ3FCQW5ELFFBQU1NLFNBQU4sQ0RoQkErQixhQ2dCQSxHRGhCZSxVQUFDWCxlQUFELEVBQWtCSCxRQUFsQjtBQUViLFFBQUE2QixVQUFBOztBQUFBLFFBQUcsS0FBQ0MsYUFBRCxDQUFlM0IsZUFBZixFQUFnQ0gsUUFBaEMsQ0FBSDtBQUNFLFVBQUcsS0FBQytCLGFBQUQsQ0FBZTVCLGVBQWYsRUFBZ0NILFFBQWhDLENBQUg7QUFDRSxZQUFHLEtBQUNnQyxjQUFELENBQWdCN0IsZUFBaEIsRUFBaUNILFFBQWpDLENBQUg7QUFFRTZCLHVCQUFhLElBQUlJLFVBQVVDLGdCQUFkLENBQ1g7QUFBQUMsMEJBQWMsSUFBZDtBQUNBOUUsb0JBQVE4QyxnQkFBZ0I5QyxNQUR4QjtBQUVBK0Usd0JBQVksSUFGWjtBQUdBQyx3QkFBWUosVUFBVUssV0FBVjtBQUhaLFdBRFcsQ0FBYjtBQU1BLGlCQUFPQyxJQUFJQyxrQkFBSixDQUF1QkMsU0FBdkIsQ0FBaUNaLFVBQWpDLEVBQTZDO0FBQ2xELG1CQUFPN0IsU0FBU3FCLE1BQVQsQ0FBZ0JxQixJQUFoQixDQUFxQnZDLGVBQXJCLENBQVA7QUFESyxZQUFQO0FBUkY7QUMyQkUsaUJEaEJBO0FBQUF2Qyx3QkFBWSxHQUFaO0FBQ0EzRCxrQkFBTTtBQUFDNEQsc0JBQVEsT0FBVDtBQUFrQm9ELHVCQUFTO0FBQTNCO0FBRE4sV0NnQkE7QUQ1Qko7QUFBQTtBQ3FDRSxlRHRCQTtBQUFBckQsc0JBQVksR0FBWjtBQUNBM0QsZ0JBQU07QUFBQzRELG9CQUFRLE9BQVQ7QUFBa0JvRCxxQkFBUztBQUEzQjtBQUROLFNDc0JBO0FEdENKO0FBQUE7QUMrQ0UsYUQ1QkE7QUFBQXJELG9CQUFZLEdBQVo7QUFDQTNELGNBQU07QUFBQzRELGtCQUFRLE9BQVQ7QUFBa0JvRCxtQkFBUztBQUEzQjtBQUROLE9DNEJBO0FBT0Q7QUR4RFksR0NnQmYsQ0RuS1UsQ0E0S1Y7Ozs7Ozs7Ozs7QUM2Q0F4QyxRQUFNTSxTQUFOLENEcENBK0MsYUNvQ0EsR0RwQ2UsVUFBQzNCLGVBQUQsRUFBa0JILFFBQWxCO0FBQ2IsUUFBR0EsU0FBUzJCLFlBQVo7QUNxQ0UsYURwQ0EsS0FBQ2dCLGFBQUQsQ0FBZXhDLGVBQWYsQ0NvQ0E7QURyQ0Y7QUN1Q0UsYURyQ0csSUNxQ0g7QUFDRDtBRHpDWSxHQ29DZixDRHpOVSxDQTJMVjs7Ozs7Ozs7QUMrQ0ExQixRQUFNTSxTQUFOLENEeENBNEQsYUN3Q0EsR0R4Q2UsVUFBQ3hDLGVBQUQ7QUFFYixRQUFBeUMsSUFBQSxFQUFBQyxZQUFBO0FBQUFELFdBQU8sS0FBQ2xFLEdBQUQsQ0FBS2EsT0FBTCxDQUFhcUQsSUFBYixDQUFrQm5JLElBQWxCLENBQXVCaUksSUFBdkIsQ0FBNEJ2QyxlQUE1QixDQUFQOztBQUdBLFNBQUF5QyxRQUFBLE9BQUdBLEtBQU12RixNQUFULEdBQVMsTUFBVCxNQUFHdUYsUUFBQSxPQUFpQkEsS0FBTXhGLEtBQXZCLEdBQXVCLE1BQTFCLEtBQW9DLEVBQUF3RixRQUFBLE9BQUlBLEtBQU1uSSxJQUFWLEdBQVUsTUFBVixDQUFwQztBQUNFb0kscUJBQWUsRUFBZjtBQUNBQSxtQkFBYXJHLEdBQWIsR0FBbUJvRyxLQUFLdkYsTUFBeEI7QUFDQXdGLG1CQUFhLEtBQUNuRSxHQUFELENBQUthLE9BQUwsQ0FBYXFELElBQWIsQ0FBa0J4RixLQUEvQixJQUF3Q3dGLEtBQUt4RixLQUE3QztBQUNBd0YsV0FBS25JLElBQUwsR0FBWXFCLE9BQU9DLEtBQVAsQ0FBYUMsT0FBYixDQUFxQjZHLFlBQXJCLENBQVo7QUN1Q0Q7O0FEcENELFFBQUFELFFBQUEsT0FBR0EsS0FBTW5JLElBQVQsR0FBUyxNQUFUO0FBQ0UwRixzQkFBZ0IxRixJQUFoQixHQUF1Qm1JLEtBQUtuSSxJQUE1QjtBQUNBMEYsc0JBQWdCOUMsTUFBaEIsR0FBeUJ1RixLQUFLbkksSUFBTCxDQUFVK0IsR0FBbkM7QUNzQ0EsYURyQ0EsSUNxQ0E7QUR4Q0Y7QUMwQ0UsYUR0Q0csS0NzQ0g7QUFDRDtBRHZEWSxHQ3dDZixDRDFPVSxDQW9OVjs7Ozs7Ozs7O0FDa0RBaUMsUUFBTU0sU0FBTixDRDFDQWlELGNDMENBLEdEMUNnQixVQUFDN0IsZUFBRCxFQUFrQkgsUUFBbEI7QUFDZCxRQUFBNEMsSUFBQSxFQUFBOUYsS0FBQSxFQUFBZ0csaUJBQUE7O0FBQUEsUUFBRzlDLFNBQVM0QixhQUFaO0FBQ0VnQixhQUFPLEtBQUNsRSxHQUFELENBQUthLE9BQUwsQ0FBYXFELElBQWIsQ0FBa0JuSSxJQUFsQixDQUF1QmlJLElBQXZCLENBQTRCdkMsZUFBNUIsQ0FBUDs7QUFDQSxVQUFBeUMsUUFBQSxPQUFHQSxLQUFNRyxPQUFULEdBQVMsTUFBVDtBQUNFRCw0QkFBb0JyRyxHQUFHYixXQUFILENBQWVjLElBQWYsQ0FBb0I7QUFBQ2pDLGdCQUFNbUksS0FBS3ZGLE1BQVo7QUFBb0JQLGlCQUFNOEYsS0FBS0c7QUFBL0IsU0FBcEIsRUFBNkRDLEtBQTdELEVBQXBCOztBQUNBLFlBQUdGLGlCQUFIO0FBQ0VoRyxrQkFBUUwsR0FBR1osTUFBSCxDQUFVRyxPQUFWLENBQWtCNEcsS0FBS0csT0FBdkIsQ0FBUjs7QUFFQSxjQUFHakcsU0FBU0MsUUFBUUMsVUFBUixDQUFtQixNQUFuQixFQUEyQkYsTUFBTU4sR0FBakMsQ0FBVCxJQUFtRHhCLEVBQUVpQyxPQUFGLENBQVVILE1BQU1JLE1BQWhCLEVBQXdCMEYsS0FBS3ZGLE1BQTdCLEtBQXNDLENBQTVGO0FBQ0U4Qyw0QkFBZ0I0QyxPQUFoQixHQUEwQkgsS0FBS0csT0FBL0I7QUFDQSxtQkFBTyxJQUFQO0FBTEo7QUFGRjtBQ3VEQzs7QUQvQ0Q1QyxzQkFBZ0I0QyxPQUFoQixHQUEwQixLQUExQjtBQUNBLGFBQU8sS0FBUDtBQ2lERDs7QURoREQsV0FBTyxJQUFQO0FBYmMsR0MwQ2hCLENEdFFVLENBMk9WOzs7Ozs7Ozs7QUM0REF0RSxRQUFNTSxTQUFOLENEcERBZ0QsYUNvREEsR0RwRGUsVUFBQzVCLGVBQUQsRUFBa0JILFFBQWxCO0FBQ2IsUUFBR0EsU0FBU3dCLFlBQVo7QUFDRSxVQUFHeEcsRUFBRTBHLE9BQUYsQ0FBVTFHLEVBQUVpSSxZQUFGLENBQWVqRCxTQUFTd0IsWUFBeEIsRUFBc0NyQixnQkFBZ0IxRixJQUFoQixDQUFxQnlJLEtBQTNELENBQVYsQ0FBSDtBQUNFLGVBQU8sS0FBUDtBQUZKO0FDd0RDOztBQUNELFdEdERBLElDc0RBO0FEMURhLEdDb0RmLENEdlNVLENBMFBWOzs7O0FDMkRBekUsUUFBTU0sU0FBTixDRHhEQWlDLFFDd0RBLEdEeERVLFVBQUNKLFFBQUQsRUFBVzNHLElBQVgsRUFBaUIyRCxVQUFqQixFQUFpQzFFLE9BQWpDO0FBR1IsUUFBQWlLLGNBQUEsRUFBQUMsbUJBQUEsRUFBQUMsMEJBQUEsRUFBQUMsZ0NBQUEsRUFBQUMsWUFBQTs7QUN1REEsUUFBSTNGLGNBQWMsSUFBbEIsRUFBd0I7QUQxRENBLG1CQUFXLEdBQVg7QUM0RHhCOztBQUNELFFBQUkxRSxXQUFXLElBQWYsRUFBcUI7QUQ3RG9CQSxnQkFBUSxFQUFSO0FDK0R4Qzs7QUQ1RERpSyxxQkFBaUIsS0FBQ0ssY0FBRCxDQUFnQixLQUFDOUUsR0FBRCxDQUFLYSxPQUFMLENBQWE0RCxjQUE3QixDQUFqQjtBQUNBakssY0FBVSxLQUFDc0ssY0FBRCxDQUFnQnRLLE9BQWhCLENBQVY7QUFDQUEsY0FBVThCLEVBQUV5RSxNQUFGLENBQVMwRCxjQUFULEVBQXlCakssT0FBekIsQ0FBVjs7QUFHQSxRQUFHQSxRQUFRLGNBQVIsRUFBd0J1SyxLQUF4QixDQUE4QixpQkFBOUIsTUFBc0QsSUFBekQ7QUFDRSxVQUFHLEtBQUMvRSxHQUFELENBQUthLE9BQUwsQ0FBYW1FLFVBQWhCO0FBQ0V6SixlQUFPMEosS0FBS0MsU0FBTCxDQUFlM0osSUFBZixFQUFxQixNQUFyQixFQUFnQyxDQUFoQyxDQUFQO0FBREY7QUFHRUEsZUFBTzBKLEtBQUtDLFNBQUwsQ0FBZTNKLElBQWYsQ0FBUDtBQUpKO0FDaUVDOztBRDFERHNKLG1CQUFlO0FBQ2IzQyxlQUFTaUQsU0FBVCxDQUFtQmpHLFVBQW5CLEVBQStCMUUsT0FBL0I7QUFDQTBILGVBQVNrRCxLQUFULENBQWU3SixJQUFmO0FDNERBLGFEM0RBMkcsU0FBU3JDLEdBQVQsRUMyREE7QUQ5RGEsS0FBZjs7QUFJQSxRQUFHWCxlQUFlLEdBQWYsSUFBQUEsZUFBb0IsR0FBdkI7QUFPRXlGLG1DQUE2QixHQUE3QjtBQUNBQyx5Q0FBbUMsSUFBSVMsS0FBS0MsTUFBTCxFQUF2QztBQUNBWiw0QkFBc0JDLDZCQUE2QkMsZ0NBQW5EO0FDdURBLGFEdERBeEgsT0FBT21JLFVBQVAsQ0FBa0JWLFlBQWxCLEVBQWdDSCxtQkFBaEMsQ0NzREE7QURoRUY7QUNrRUUsYUR0REFHLGNDc0RBO0FBQ0Q7QUR0Rk8sR0N3RFYsQ0RyVFUsQ0E4UlY7Ozs7QUM2REE5RSxRQUFNTSxTQUFOLENEMURBeUUsY0MwREEsR0QxRGdCLFVBQUNVLE1BQUQ7QUMyRGQsV0QxREFsSixFQUFFbUosS0FBRixDQUFRRCxNQUFSLEVBQ0NFLEtBREQsR0FFQ0MsR0FGRCxDQUVLLFVBQUNDLElBQUQ7QUN5REgsYUR4REEsQ0FBQ0EsS0FBSyxDQUFMLEVBQVFDLFdBQVIsRUFBRCxFQUF3QkQsS0FBSyxDQUFMLENBQXhCLENDd0RBO0FEM0RGLE9BSUNKLE1BSkQsR0FLQ2xLLEtBTEQsRUMwREE7QUQzRGMsR0MwRGhCOztBQU1BLFNBQU95RSxLQUFQO0FBRUQsQ0RuV1csRUFBTixDOzs7Ozs7Ozs7Ozs7QUVBTixJQUFBK0YsUUFBQTtBQUFBLElBQUF2SCxVQUFBLEdBQUFBLE9BQUEsY0FBQXdILElBQUE7QUFBQSxXQUFBQyxJQUFBLEdBQUFDLElBQUEsS0FBQXpKLE1BQUEsRUFBQXdKLElBQUFDLENBQUEsRUFBQUQsR0FBQTtBQUFBLFFBQUFBLEtBQUEsYUFBQUEsQ0FBQSxNQUFBRCxJQUFBLFNBQUFDLENBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFNLEtBQUNGLFFBQUQsR0FBQztBQUVRLFdBQUFBLFFBQUEsQ0FBQzVGLE9BQUQ7QUFDWCxRQUFBZ0csV0FBQTtBQUFBLFNBQUNDLE9BQUQsR0FBVyxFQUFYO0FBQ0EsU0FBQ3RGLE9BQUQsR0FDRTtBQUFBQyxhQUFPLEVBQVA7QUFDQXNGLHNCQUFnQixLQURoQjtBQUVBL0UsZUFBUyxNQUZUO0FBR0FnRixlQUFTLElBSFQ7QUFJQXJCLGtCQUFZLEtBSlo7QUFLQWQsWUFDRTtBQUFBeEYsZUFBTyx5Q0FBUDtBQUNBM0MsY0FBTTtBQUNKLGNBQUF1SyxLQUFBLEVBQUE1SCxLQUFBOztBQUFBLGNBQUcsS0FBQ3VELE9BQUQsQ0FBU3pILE9BQVQsQ0FBaUIsY0FBakIsQ0FBSDtBQUNFa0Usb0JBQVFsQixTQUFTK0ksZUFBVCxDQUF5QixLQUFDdEUsT0FBRCxDQUFTekgsT0FBVCxDQUFpQixjQUFqQixDQUF6QixDQUFSO0FDS0Q7O0FESkQsY0FBRyxLQUFDeUgsT0FBRCxDQUFTdEQsTUFBWjtBQUNFMkgsb0JBQVF2SSxHQUFHVixLQUFILENBQVNDLE9BQVQsQ0FBaUI7QUFBQ1EsbUJBQUssS0FBQ21FLE9BQUQsQ0FBU3REO0FBQWYsYUFBakIsQ0FBUjtBQ1FBLG1CRFBBO0FBQUE1QyxvQkFBTXVLLEtBQU47QUFDQTNILHNCQUFRLEtBQUNzRCxPQUFELENBQVN6SCxPQUFULENBQWlCLFdBQWpCLENBRFI7QUFFQTZKLHVCQUFTLEtBQUNwQyxPQUFELENBQVN6SCxPQUFULENBQWlCLFlBQWpCLENBRlQ7QUFHQWtFLHFCQUFPQTtBQUhQLGFDT0E7QURURjtBQ2dCRSxtQkRUQTtBQUFBQyxzQkFBUSxLQUFDc0QsT0FBRCxDQUFTekgsT0FBVCxDQUFpQixXQUFqQixDQUFSO0FBQ0E2Six1QkFBUyxLQUFDcEMsT0FBRCxDQUFTekgsT0FBVCxDQUFpQixZQUFqQixDQURUO0FBRUFrRSxxQkFBT0E7QUFGUCxhQ1NBO0FBS0Q7QUR6Qkg7QUFBQSxPQU5GO0FBb0JBK0Ysc0JBQ0U7QUFBQSx3QkFBZ0I7QUFBaEIsT0FyQkY7QUFzQkErQixrQkFBWTtBQXRCWixLQURGOztBQTBCQWxLLE1BQUV5RSxNQUFGLENBQVMsS0FBQ0YsT0FBVixFQUFtQlgsT0FBbkI7O0FBRUEsUUFBRyxLQUFDVyxPQUFELENBQVMyRixVQUFaO0FBQ0VOLG9CQUNFO0FBQUEsdUNBQStCLEdBQS9CO0FBQ0Esd0NBQWdDO0FBRGhDLE9BREY7O0FBSUEsVUFBRyxLQUFDckYsT0FBRCxDQUFTdUYsY0FBWjtBQUNFRixvQkFBWSw4QkFBWixLQUErQywyQkFBL0M7QUNjRDs7QURYRDVKLFFBQUV5RSxNQUFGLENBQVMsS0FBQ0YsT0FBRCxDQUFTNEQsY0FBbEIsRUFBa0N5QixXQUFsQzs7QUFFQSxVQUFHLENBQUksS0FBQ3JGLE9BQUQsQ0FBU0csc0JBQWhCO0FBQ0UsYUFBQ0gsT0FBRCxDQUFTRyxzQkFBVCxHQUFrQztBQUNoQyxlQUFDa0IsUUFBRCxDQUFVaUQsU0FBVixDQUFvQixHQUFwQixFQUF5QmUsV0FBekI7QUNZQSxpQkRYQSxLQUFDL0QsSUFBRCxFQ1dBO0FEYmdDLFNBQWxDO0FBWko7QUM0QkM7O0FEWEQsUUFBRyxLQUFDdEIsT0FBRCxDQUFTUSxPQUFULENBQWlCLENBQWpCLE1BQXVCLEdBQTFCO0FBQ0UsV0FBQ1IsT0FBRCxDQUFTUSxPQUFULEdBQW1CLEtBQUNSLE9BQUQsQ0FBU1EsT0FBVCxDQUFpQm9GLEtBQWpCLENBQXVCLENBQXZCLENBQW5CO0FDYUQ7O0FEWkQsUUFBR25LLEVBQUVvSyxJQUFGLENBQU8sS0FBQzdGLE9BQUQsQ0FBU1EsT0FBaEIsTUFBOEIsR0FBakM7QUFDRSxXQUFDUixPQUFELENBQVNRLE9BQVQsR0FBbUIsS0FBQ1IsT0FBRCxDQUFTUSxPQUFULEdBQW1CLEdBQXRDO0FDY0Q7O0FEVkQsUUFBRyxLQUFDUixPQUFELENBQVN3RixPQUFaO0FBQ0UsV0FBQ3hGLE9BQUQsQ0FBU1EsT0FBVCxJQUFvQixLQUFDUixPQUFELENBQVN3RixPQUFULEdBQW1CLEdBQXZDO0FDWUQ7O0FEVEQsUUFBRyxLQUFDeEYsT0FBRCxDQUFTdUYsY0FBWjtBQUNFLFdBQUNPLFNBQUQ7QUFERixXQUVLLElBQUcsS0FBQzlGLE9BQUQsQ0FBUytGLE9BQVo7QUFDSCxXQUFDRCxTQUFEOztBQUNBcEgsY0FBUXNILElBQVIsQ0FBYSx5RUFDVCw2Q0FESjtBQ1dEOztBRFJELFdBQU8sSUFBUDtBQWpFVyxHQUZSLENBc0VMOzs7Ozs7Ozs7Ozs7O0FDdUJBZixXQUFTekYsU0FBVCxDRFhBeUcsUUNXQSxHRFhVLFVBQUM3RyxJQUFELEVBQU9DLE9BQVAsRUFBZ0JFLFNBQWhCO0FBRVIsUUFBQTJHLEtBQUE7QUFBQUEsWUFBUSxJQUFJakgsTUFBTUMsS0FBVixDQUFnQixJQUFoQixFQUFzQkUsSUFBdEIsRUFBNEJDLE9BQTVCLEVBQXFDRSxTQUFyQyxDQUFSOztBQUNBLFNBQUMrRixPQUFELENBQVNoTCxJQUFULENBQWM0TCxLQUFkOztBQUVBQSxVQUFNekcsUUFBTjtBQUVBLFdBQU8sSUFBUDtBQVBRLEdDV1YsQ0Q3RkssQ0E0Rkw7Ozs7QUNjQXdGLFdBQVN6RixTQUFULENEWEEyRyxhQ1dBLEdEWGUsVUFBQ0MsVUFBRCxFQUFhL0csT0FBYjtBQUNiLFFBQUFnSCxtQkFBQSxFQUFBQyx3QkFBQSxFQUFBQyw4QkFBQSxFQUFBQyxvQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxPQUFBLEVBQUFDLG1CQUFBLEVBQUF2SCxJQUFBLEVBQUF3SCxZQUFBOztBQ1lBLFFBQUl2SCxXQUFXLElBQWYsRUFBcUI7QURiS0EsZ0JBQVEsRUFBUjtBQ2V6Qjs7QURkRHFILGNBQVUsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixLQUFoQixFQUF1QixRQUF2QixFQUFpQyxRQUFqQyxDQUFWO0FBQ0FDLDBCQUFzQixDQUFDLE1BQUQsRUFBUyxRQUFULENBQXRCOztBQUdBLFFBQUdQLGVBQWM3SixPQUFPQyxLQUF4QjtBQUNFNkosNEJBQXNCLEtBQUNRLHdCQUF2QjtBQURGO0FBR0VSLDRCQUFzQixLQUFDUyxvQkFBdkI7QUNjRDs7QURYRFAscUNBQWlDbEgsUUFBUUUsU0FBUixJQUFxQixFQUF0RDtBQUNBcUgsbUJBQWV2SCxRQUFRdUgsWUFBUixJQUF3QixFQUF2QztBQUNBSCx3QkFBb0JwSCxRQUFRb0gsaUJBQVIsSUFBNkIsRUFBakQ7QUFFQXJILFdBQU9DLFFBQVFELElBQVIsSUFBZ0JnSCxXQUFXVyxLQUFsQztBQUlBVCwrQkFBMkIsRUFBM0I7QUFDQUUsMkJBQXVCLEVBQXZCOztBQUNBLFFBQUcvSyxFQUFFMEcsT0FBRixDQUFVb0UsOEJBQVYsS0FBOEM5SyxFQUFFMEcsT0FBRixDQUFVc0UsaUJBQVYsQ0FBakQ7QUFFRWhMLFFBQUU0QixJQUFGLENBQU9xSixPQUFQLEVBQWdCLFVBQUNoTixNQUFEO0FBRWQsWUFBR2dFLFFBQUF5RixJQUFBLENBQVV3RCxtQkFBVixFQUFBak4sTUFBQSxNQUFIO0FBQ0UrQixZQUFFeUUsTUFBRixDQUFTb0csd0JBQVQsRUFBbUNELG9CQUFvQjNNLE1BQXBCLEVBQTRCeUosSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUNpRCxVQUF2QyxDQUFuQztBQURGO0FBRUszSyxZQUFFeUUsTUFBRixDQUFTc0csb0JBQVQsRUFBK0JILG9CQUFvQjNNLE1BQXBCLEVBQTRCeUosSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUNpRCxVQUF2QyxDQUEvQjtBQ1FKO0FEWkgsU0FNRSxJQU5GO0FBRkY7QUFXRTNLLFFBQUU0QixJQUFGLENBQU9xSixPQUFQLEVBQWdCLFVBQUNoTixNQUFEO0FBQ2QsWUFBQXNOLGtCQUFBLEVBQUFDLGVBQUE7O0FBQUEsWUFBR3ZKLFFBQUF5RixJQUFBLENBQWNzRCxpQkFBZCxFQUFBL00sTUFBQSxTQUFvQzZNLCtCQUErQjdNLE1BQS9CLE1BQTRDLEtBQW5GO0FBR0V1Tiw0QkFBa0JWLCtCQUErQjdNLE1BQS9CLENBQWxCO0FBQ0FzTiwrQkFBcUIsRUFBckI7O0FBQ0F2TCxZQUFFNEIsSUFBRixDQUFPZ0osb0JBQW9CM00sTUFBcEIsRUFBNEJ5SixJQUE1QixDQUFpQyxJQUFqQyxFQUF1Q2lELFVBQXZDLENBQVAsRUFBMkQsVUFBQ3RFLE1BQUQsRUFBU29GLFVBQVQ7QUNNekQsbUJETEFGLG1CQUFtQkUsVUFBbkIsSUFDRXpMLEVBQUVtSixLQUFGLENBQVE5QyxNQUFSLEVBQ0NxRixLQURELEdBRUNqSCxNQUZELENBRVErRyxlQUZSLEVBR0N4TSxLQUhELEVDSUY7QURORjs7QUFPQSxjQUFHaUQsUUFBQXlGLElBQUEsQ0FBVXdELG1CQUFWLEVBQUFqTixNQUFBLE1BQUg7QUFDRStCLGNBQUV5RSxNQUFGLENBQVNvRyx3QkFBVCxFQUFtQ1Usa0JBQW5DO0FBREY7QUFFS3ZMLGNBQUV5RSxNQUFGLENBQVNzRyxvQkFBVCxFQUErQlEsa0JBQS9CO0FBZFA7QUNrQkM7QURuQkgsU0FpQkUsSUFqQkY7QUNxQkQ7O0FEREQsU0FBQ2YsUUFBRCxDQUFVN0csSUFBVixFQUFnQndILFlBQWhCLEVBQThCTix3QkFBOUI7QUFDQSxTQUFDTCxRQUFELENBQWE3RyxPQUFLLE1BQWxCLEVBQXlCd0gsWUFBekIsRUFBdUNKLG9CQUF2QztBQUVBLFdBQU8sSUFBUDtBQXZEYSxHQ1dmLENEMUdLLENBeUpMOzs7O0FDTUF2QixXQUFTekYsU0FBVCxDREhBc0gsb0JDR0EsR0RGRTtBQUFBTSxTQUFLLFVBQUNoQixVQUFEO0FDSUgsYURIQTtBQUFBZ0IsYUFDRTtBQUFBdEYsa0JBQVE7QUFDTixnQkFBQXVGLE1BQUEsRUFBQUMsUUFBQTtBQUFBQSx1QkFBVztBQUFDckssbUJBQUssS0FBQzhELFNBQUQsQ0FBVzNGO0FBQWpCLGFBQVg7O0FBQ0EsZ0JBQUcsS0FBS29JLE9BQVI7QUFDRThELHVCQUFTL0osS0FBVCxHQUFpQixLQUFLaUcsT0FBdEI7QUNRQzs7QURQSDZELHFCQUFTakIsV0FBVzNKLE9BQVgsQ0FBbUI2SyxRQUFuQixDQUFUOztBQUNBLGdCQUFHRCxNQUFIO0FDU0kscUJEUkY7QUFBQy9JLHdCQUFRLFNBQVQ7QUFBb0JqRSxzQkFBTWdOO0FBQTFCLGVDUUU7QURUSjtBQ2NJLHFCRFhGO0FBQUFoSiw0QkFBWSxHQUFaO0FBQ0EzRCxzQkFBTTtBQUFDNEQsMEJBQVEsTUFBVDtBQUFpQm9ELDJCQUFTO0FBQTFCO0FBRE4sZUNXRTtBQU9EO0FEMUJMO0FBQUE7QUFERixPQ0dBO0FESkY7QUFZQTZGLFNBQUssVUFBQ25CLFVBQUQ7QUNzQkgsYURyQkE7QUFBQW1CLGFBQ0U7QUFBQXpGLGtCQUFRO0FBQ04sZ0JBQUF1RixNQUFBLEVBQUFHLGVBQUEsRUFBQUYsUUFBQTtBQUFBQSx1QkFBVztBQUFDckssbUJBQUssS0FBQzhELFNBQUQsQ0FBVzNGO0FBQWpCLGFBQVg7O0FBQ0EsZ0JBQUcsS0FBS29JLE9BQVI7QUFDRThELHVCQUFTL0osS0FBVCxHQUFpQixLQUFLaUcsT0FBdEI7QUMwQkM7O0FEekJIZ0UsOEJBQWtCcEIsV0FBV3FCLE1BQVgsQ0FBa0JILFFBQWxCLEVBQTRCO0FBQUFJLG9CQUFNLEtBQUN2RztBQUFQLGFBQTVCLENBQWxCOztBQUNBLGdCQUFHcUcsZUFBSDtBQUNFSCx1QkFBU2pCLFdBQVczSixPQUFYLENBQW1CLEtBQUNzRSxTQUFELENBQVczRixFQUE5QixDQUFUO0FDNkJFLHFCRDVCRjtBQUFDa0Qsd0JBQVEsU0FBVDtBQUFvQmpFLHNCQUFNZ047QUFBMUIsZUM0QkU7QUQ5Qko7QUNtQ0kscUJEL0JGO0FBQUFoSiw0QkFBWSxHQUFaO0FBQ0EzRCxzQkFBTTtBQUFDNEQsMEJBQVEsTUFBVDtBQUFpQm9ELDJCQUFTO0FBQTFCO0FBRE4sZUMrQkU7QUFPRDtBRC9DTDtBQUFBO0FBREYsT0NxQkE7QURsQ0Y7QUF5QkEsY0FBUSxVQUFDMEUsVUFBRDtBQzBDTixhRHpDQTtBQUFBLGtCQUNFO0FBQUF0RSxrQkFBUTtBQUNOLGdCQUFBd0YsUUFBQTtBQUFBQSx1QkFBVztBQUFDckssbUJBQUssS0FBQzhELFNBQUQsQ0FBVzNGO0FBQWpCLGFBQVg7O0FBQ0EsZ0JBQUcsS0FBS29JLE9BQVI7QUFDRThELHVCQUFTL0osS0FBVCxHQUFpQixLQUFLaUcsT0FBdEI7QUM4Q0M7O0FEN0NILGdCQUFHNEMsV0FBV3VCLE1BQVgsQ0FBa0JMLFFBQWxCLENBQUg7QUMrQ0kscUJEOUNGO0FBQUNoSix3QkFBUSxTQUFUO0FBQW9CakUsc0JBQU07QUFBQXFILDJCQUFTO0FBQVQ7QUFBMUIsZUM4Q0U7QUQvQ0o7QUNzREkscUJEbkRGO0FBQUFyRCw0QkFBWSxHQUFaO0FBQ0EzRCxzQkFBTTtBQUFDNEQsMEJBQVEsTUFBVDtBQUFpQm9ELDJCQUFTO0FBQTFCO0FBRE4sZUNtREU7QUFPRDtBRGpFTDtBQUFBO0FBREYsT0N5Q0E7QURuRUY7QUFvQ0FrRyxVQUFNLFVBQUN4QixVQUFEO0FDOERKLGFEN0RBO0FBQUF3QixjQUNFO0FBQUE5RixrQkFBUTtBQUNOLGdCQUFBdUYsTUFBQSxFQUFBUSxRQUFBOztBQUFBLGdCQUFHLEtBQUtyRSxPQUFSO0FBQ0UsbUJBQUNyQyxVQUFELENBQVk1RCxLQUFaLEdBQW9CLEtBQUtpRyxPQUF6QjtBQ2dFQzs7QUQvREhxRSx1QkFBV3pCLFdBQVcwQixNQUFYLENBQWtCLEtBQUMzRyxVQUFuQixDQUFYO0FBQ0FrRyxxQkFBU2pCLFdBQVczSixPQUFYLENBQW1Cb0wsUUFBbkIsQ0FBVDs7QUFDQSxnQkFBR1IsTUFBSDtBQ2lFSSxxQkRoRUY7QUFBQWhKLDRCQUFZLEdBQVo7QUFDQTNELHNCQUFNO0FBQUM0RCwwQkFBUSxTQUFUO0FBQW9CakUsd0JBQU1nTjtBQUExQjtBQUROLGVDZ0VFO0FEakVKO0FDeUVJLHFCRHJFRjtBQUFBaEosNEJBQVksR0FBWjtBQUNBM0Qsc0JBQU07QUFBQzRELDBCQUFRLE1BQVQ7QUFBaUJvRCwyQkFBUztBQUExQjtBQUROLGVDcUVFO0FBT0Q7QURyRkw7QUFBQTtBQURGLE9DNkRBO0FEbEdGO0FBaURBcUcsWUFBUSxVQUFDM0IsVUFBRDtBQ2dGTixhRC9FQTtBQUFBZ0IsYUFDRTtBQUFBdEYsa0JBQVE7QUFDTixnQkFBQWtHLFFBQUEsRUFBQVYsUUFBQTtBQUFBQSx1QkFBVyxFQUFYOztBQUNBLGdCQUFHLEtBQUs5RCxPQUFSO0FBQ0U4RCx1QkFBUy9KLEtBQVQsR0FBaUIsS0FBS2lHLE9BQXRCO0FDa0ZDOztBRGpGSHdFLHVCQUFXNUIsV0FBV2pKLElBQVgsQ0FBZ0JtSyxRQUFoQixFQUEwQmxLLEtBQTFCLEVBQVg7O0FBQ0EsZ0JBQUc0SyxRQUFIO0FDbUZJLHFCRGxGRjtBQUFDMUosd0JBQVEsU0FBVDtBQUFvQmpFLHNCQUFNMk47QUFBMUIsZUNrRkU7QURuRko7QUN3RkkscUJEckZGO0FBQUEzSiw0QkFBWSxHQUFaO0FBQ0EzRCxzQkFBTTtBQUFDNEQsMEJBQVEsTUFBVDtBQUFpQm9ELDJCQUFTO0FBQTFCO0FBRE4sZUNxRkU7QUFPRDtBRHBHTDtBQUFBO0FBREYsT0MrRUE7QURqSUY7QUFBQSxHQ0VGLENEL0pLLENBNE5MOzs7QUNvR0F1RCxXQUFTekYsU0FBVCxDRGpHQXFILHdCQ2lHQSxHRGhHRTtBQUFBTyxTQUFLLFVBQUNoQixVQUFEO0FDa0dILGFEakdBO0FBQUFnQixhQUNFO0FBQUF0RixrQkFBUTtBQUNOLGdCQUFBdUYsTUFBQTtBQUFBQSxxQkFBU2pCLFdBQVczSixPQUFYLENBQW1CLEtBQUNzRSxTQUFELENBQVczRixFQUE5QixFQUFrQztBQUFBNk0sc0JBQVE7QUFBQUMseUJBQVM7QUFBVDtBQUFSLGFBQWxDLENBQVQ7O0FBQ0EsZ0JBQUdiLE1BQUg7QUN3R0kscUJEdkdGO0FBQUMvSSx3QkFBUSxTQUFUO0FBQW9CakUsc0JBQU1nTjtBQUExQixlQ3VHRTtBRHhHSjtBQzZHSSxxQkQxR0Y7QUFBQWhKLDRCQUFZLEdBQVo7QUFDQTNELHNCQUFNO0FBQUM0RCwwQkFBUSxNQUFUO0FBQWlCb0QsMkJBQVM7QUFBMUI7QUFETixlQzBHRTtBQU9EO0FEdEhMO0FBQUE7QUFERixPQ2lHQTtBRGxHRjtBQVNBNkYsU0FBSyxVQUFDbkIsVUFBRDtBQ3FISCxhRHBIQTtBQUFBbUIsYUFDRTtBQUFBekYsa0JBQVE7QUFDTixnQkFBQXVGLE1BQUEsRUFBQUcsZUFBQTtBQUFBQSw4QkFBa0JwQixXQUFXcUIsTUFBWCxDQUFrQixLQUFDMUcsU0FBRCxDQUFXM0YsRUFBN0IsRUFBaUM7QUFBQXNNLG9CQUFNO0FBQUFRLHlCQUFTLEtBQUMvRztBQUFWO0FBQU4sYUFBakMsQ0FBbEI7O0FBQ0EsZ0JBQUdxRyxlQUFIO0FBQ0VILHVCQUFTakIsV0FBVzNKLE9BQVgsQ0FBbUIsS0FBQ3NFLFNBQUQsQ0FBVzNGLEVBQTlCLEVBQWtDO0FBQUE2TSx3QkFBUTtBQUFBQywyQkFBUztBQUFUO0FBQVIsZUFBbEMsQ0FBVDtBQytIRSxxQkQ5SEY7QUFBQzVKLHdCQUFRLFNBQVQ7QUFBb0JqRSxzQkFBTWdOO0FBQTFCLGVDOEhFO0FEaElKO0FDcUlJLHFCRGpJRjtBQUFBaEosNEJBQVksR0FBWjtBQUNBM0Qsc0JBQU07QUFBQzRELDBCQUFRLE1BQVQ7QUFBaUJvRCwyQkFBUztBQUExQjtBQUROLGVDaUlFO0FBT0Q7QUQ5SUw7QUFBQTtBQURGLE9Db0hBO0FEOUhGO0FBbUJBLGNBQVEsVUFBQzBFLFVBQUQ7QUM0SU4sYUQzSUE7QUFBQSxrQkFDRTtBQUFBdEUsa0JBQVE7QUFDTixnQkFBR3NFLFdBQVd1QixNQUFYLENBQWtCLEtBQUM1RyxTQUFELENBQVczRixFQUE3QixDQUFIO0FDNklJLHFCRDVJRjtBQUFDa0Qsd0JBQVEsU0FBVDtBQUFvQmpFLHNCQUFNO0FBQUFxSCwyQkFBUztBQUFUO0FBQTFCLGVDNElFO0FEN0lKO0FDb0pJLHFCRGpKRjtBQUFBckQsNEJBQVksR0FBWjtBQUNBM0Qsc0JBQU07QUFBQzRELDBCQUFRLE1BQVQ7QUFBaUJvRCwyQkFBUztBQUExQjtBQUROLGVDaUpFO0FBT0Q7QUQ1Skw7QUFBQTtBQURGLE9DMklBO0FEL0pGO0FBMkJBa0csVUFBTSxVQUFDeEIsVUFBRDtBQzRKSixhRDNKQTtBQUFBd0IsY0FDRTtBQUFBOUYsa0JBQVE7QUFFTixnQkFBQXVGLE1BQUEsRUFBQVEsUUFBQTtBQUFBQSx1QkFBV2xMLFNBQVN3TCxVQUFULENBQW9CLEtBQUNoSCxVQUFyQixDQUFYO0FBQ0FrRyxxQkFBU2pCLFdBQVczSixPQUFYLENBQW1Cb0wsUUFBbkIsRUFBNkI7QUFBQUksc0JBQVE7QUFBQUMseUJBQVM7QUFBVDtBQUFSLGFBQTdCLENBQVQ7O0FBQ0EsZ0JBQUdiLE1BQUg7QUNpS0kscUJEaEtGO0FBQUFoSiw0QkFBWSxHQUFaO0FBQ0EzRCxzQkFBTTtBQUFDNEQsMEJBQVEsU0FBVDtBQUFvQmpFLHdCQUFNZ047QUFBMUI7QUFETixlQ2dLRTtBRGpLSjtBQUlFO0FBQUFoSiw0QkFBWTtBQUFaO0FDd0tFLHFCRHZLRjtBQUFDQyx3QkFBUSxNQUFUO0FBQWlCb0QseUJBQVM7QUFBMUIsZUN1S0U7QUFJRDtBRHBMTDtBQUFBO0FBREYsT0MySkE7QUR2TEY7QUF1Q0FxRyxZQUFRLFVBQUMzQixVQUFEO0FDZ0xOLGFEL0tBO0FBQUFnQixhQUNFO0FBQUF0RixrQkFBUTtBQUNOLGdCQUFBa0csUUFBQTtBQUFBQSx1QkFBVzVCLFdBQVdqSixJQUFYLENBQWdCLEVBQWhCLEVBQW9CO0FBQUE4SyxzQkFBUTtBQUFBQyx5QkFBUztBQUFUO0FBQVIsYUFBcEIsRUFBd0M5SyxLQUF4QyxFQUFYOztBQUNBLGdCQUFHNEssUUFBSDtBQ3NMSSxxQkRyTEY7QUFBQzFKLHdCQUFRLFNBQVQ7QUFBb0JqRSxzQkFBTTJOO0FBQTFCLGVDcUxFO0FEdExKO0FDMkxJLHFCRHhMRjtBQUFBM0osNEJBQVksR0FBWjtBQUNBM0Qsc0JBQU07QUFBQzRELDBCQUFRLE1BQVQ7QUFBaUJvRCwyQkFBUztBQUExQjtBQUROLGVDd0xFO0FBT0Q7QURwTUw7QUFBQTtBQURGLE9DK0tBO0FEdk5GO0FBQUEsR0NnR0YsQ0RoVUssQ0FrUkw7Ozs7QUN1TUF1RCxXQUFTekYsU0FBVCxDRHBNQXNHLFNDb01BLEdEcE1XO0FBQ1QsUUFBQXNDLE1BQUEsRUFBQXRJLElBQUE7QUFBQUEsV0FBTyxJQUFQLENBRFMsQ0FFVDs7Ozs7O0FBTUEsU0FBQ21HLFFBQUQsQ0FBVSxPQUFWLEVBQW1CO0FBQUM3RCxvQkFBYztBQUFmLEtBQW5CLEVBQ0U7QUFBQXdGLFlBQU07QUFFSixZQUFBdkUsSUFBQSxFQUFBZ0YsQ0FBQSxFQUFBQyxTQUFBLEVBQUFsTSxHQUFBLEVBQUEyRixJQUFBLEVBQUFWLFFBQUEsRUFBQWtILFdBQUEsRUFBQXJOLElBQUE7QUFBQUEsZUFBTyxFQUFQOztBQUNBLFlBQUcsS0FBQ2lHLFVBQUQsQ0FBWWpHLElBQWY7QUFDRSxjQUFHLEtBQUNpRyxVQUFELENBQVlqRyxJQUFaLENBQWlCd0MsT0FBakIsQ0FBeUIsR0FBekIsTUFBaUMsQ0FBQyxDQUFyQztBQUNFeEMsaUJBQUtLLFFBQUwsR0FBZ0IsS0FBQzRGLFVBQUQsQ0FBWWpHLElBQTVCO0FBREY7QUFHRUEsaUJBQUtNLEtBQUwsR0FBYSxLQUFDMkYsVUFBRCxDQUFZakcsSUFBekI7QUFKSjtBQUFBLGVBS0ssSUFBRyxLQUFDaUcsVUFBRCxDQUFZNUYsUUFBZjtBQUNITCxlQUFLSyxRQUFMLEdBQWdCLEtBQUM0RixVQUFELENBQVk1RixRQUE1QjtBQURHLGVBRUEsSUFBRyxLQUFDNEYsVUFBRCxDQUFZM0YsS0FBZjtBQUNITixlQUFLTSxLQUFMLEdBQWEsS0FBQzJGLFVBQUQsQ0FBWTNGLEtBQXpCO0FDME1EOztBRHZNRDtBQUNFNkgsaUJBQU90SSxLQUFLYyxpQkFBTCxDQUF1QlgsSUFBdkIsRUFBNkIsS0FBQ2lHLFVBQUQsQ0FBWXJGLFFBQXpDLENBQVA7QUFERixpQkFBQWUsS0FBQTtBQUVNd0wsY0FBQXhMLEtBQUE7QUFDSjZCLGtCQUFRN0IsS0FBUixDQUFjd0wsQ0FBZDtBQUNBLGlCQUNFO0FBQUFoSyx3QkFBWWdLLEVBQUV4TCxLQUFkO0FBQ0FuQyxrQkFBTTtBQUFBNEQsc0JBQVEsT0FBUjtBQUFpQm9ELHVCQUFTMkcsRUFBRUc7QUFBNUI7QUFETixXQURGO0FDZ05EOztBRDFNRCxZQUFHbkYsS0FBS3ZGLE1BQUwsSUFBZ0J1RixLQUFLdEgsU0FBeEI7QUFDRXdNLHdCQUFjLEVBQWQ7QUFDQUEsc0JBQVl6SSxLQUFLRSxPQUFMLENBQWFxRCxJQUFiLENBQWtCeEYsS0FBOUIsSUFBdUNsQixTQUFTK0ksZUFBVCxDQUF5QnJDLEtBQUt0SCxTQUE5QixDQUF2QztBQUNBLGVBQUNiLElBQUQsR0FBUXFCLE9BQU9DLEtBQVAsQ0FBYUMsT0FBYixDQUNOO0FBQUEsbUJBQU80RyxLQUFLdkY7QUFBWixXQURNLEVBRU55SyxXQUZNLENBQVI7QUFHQSxlQUFDekssTUFBRCxJQUFBMUIsTUFBQSxLQUFBbEIsSUFBQSxZQUFBa0IsSUFBaUJhLEdBQWpCLEdBQWlCLE1BQWpCO0FDNE1EOztBRDFNRG9FLG1CQUFXO0FBQUMvQyxrQkFBUSxTQUFUO0FBQW9CakUsZ0JBQU1nSjtBQUExQixTQUFYO0FBR0FpRixvQkFBQSxDQUFBdkcsT0FBQWpDLEtBQUFFLE9BQUEsQ0FBQXlJLFVBQUEsWUFBQTFHLEtBQXFDb0IsSUFBckMsQ0FBMEMsSUFBMUMsSUFBWSxNQUFaOztBQUNBLFlBQUdtRixhQUFBLElBQUg7QUFDRTdNLFlBQUV5RSxNQUFGLENBQVNtQixTQUFTaEgsSUFBbEIsRUFBd0I7QUFBQ3FPLG1CQUFPSjtBQUFSLFdBQXhCO0FDK01EOztBQUNELGVEOU1BakgsUUM4TUE7QURyUEY7QUFBQSxLQURGOztBQTBDQStHLGFBQVM7QUFFUCxVQUFBck0sU0FBQSxFQUFBdU0sU0FBQSxFQUFBcE0sV0FBQSxFQUFBeU0sS0FBQSxFQUFBdk0sR0FBQSxFQUFBaUYsUUFBQSxFQUFBdUgsY0FBQSxFQUFBQyxhQUFBLEVBQUFDLFNBQUEsRUFBQUMsaUJBQUEsRUFBQUMsYUFBQTtBQUFBak4sa0JBQVksS0FBQ3FGLE9BQUQsQ0FBU3pILE9BQVQsQ0FBaUIsY0FBakIsQ0FBWjtBQUNBdUMsb0JBQWNTLFNBQVMrSSxlQUFULENBQXlCM0osU0FBekIsQ0FBZDtBQUNBOE0sc0JBQWdCL0ksS0FBS0UsT0FBTCxDQUFhcUQsSUFBYixDQUFrQnhGLEtBQWxDO0FBQ0E4SyxjQUFRRSxjQUFjSSxXQUFkLENBQTBCLEdBQTFCLENBQVI7QUFDQUgsa0JBQVlELGNBQWNLLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMkJQLEtBQTNCLENBQVo7QUFDQUMsdUJBQWlCQyxjQUFjSyxTQUFkLENBQXdCUCxRQUFRLENBQWhDLENBQWpCO0FBQ0FLLHNCQUFnQixFQUFoQjtBQUNBQSxvQkFBY0osY0FBZCxJQUFnQzFNLFdBQWhDO0FBQ0E2TSwwQkFBb0IsRUFBcEI7QUFDQUEsd0JBQWtCRCxTQUFsQixJQUErQkUsYUFBL0I7QUFDQXpNLGFBQU9DLEtBQVAsQ0FBYWlMLE1BQWIsQ0FBb0IsS0FBQ3ZNLElBQUQsQ0FBTStCLEdBQTFCLEVBQStCO0FBQUNrTSxlQUFPSjtBQUFSLE9BQS9CO0FBRUExSCxpQkFBVztBQUFDL0MsZ0JBQVEsU0FBVDtBQUFvQmpFLGNBQU07QUFBQ3FILG1CQUFTO0FBQVY7QUFBMUIsT0FBWDtBQUdBNEcsa0JBQUEsQ0FBQWxNLE1BQUEwRCxLQUFBRSxPQUFBLENBQUFvSixXQUFBLFlBQUFoTixJQUFzQytHLElBQXRDLENBQTJDLElBQTNDLElBQVksTUFBWjs7QUFDQSxVQUFHbUYsYUFBQSxJQUFIO0FBQ0U3TSxVQUFFeUUsTUFBRixDQUFTbUIsU0FBU2hILElBQWxCLEVBQXdCO0FBQUNxTyxpQkFBT0o7QUFBUixTQUF4QjtBQ3NORDs7QUFDRCxhRHJOQWpILFFDcU5BO0FEMU9PLEtBQVQsQ0FsRFMsQ0F5RVQ7Ozs7Ozs7QUM0TkEsV0R0TkEsS0FBQzRFLFFBQUQsQ0FBVSxRQUFWLEVBQW9CO0FBQUM3RCxvQkFBYztBQUFmLEtBQXBCLEVBQ0U7QUFBQWdGLFdBQUs7QUFDSDFJLGdCQUFRc0gsSUFBUixDQUFhLHFGQUFiO0FBQ0F0SCxnQkFBUXNILElBQVIsQ0FBYSwrREFBYjtBQUNBLGVBQU9vQyxPQUFPakYsSUFBUCxDQUFZLElBQVosQ0FBUDtBQUhGO0FBSUF5RSxZQUFNUTtBQUpOLEtBREYsQ0NzTkE7QURyU1MsR0NvTVg7O0FBNkdBLFNBQU9uRCxRQUFQO0FBRUQsQ0R4a0JNLEVBQUQ7O0FBMldOQSxXQUFXLEtBQUNBLFFBQVosQzs7Ozs7Ozs7Ozs7O0FFM1dBLElBQUcxSSxPQUFPOE0sUUFBVjtBQUNJLE9BQUNDLEdBQUQsR0FBTyxJQUFJckUsUUFBSixDQUNIO0FBQUF6RSxhQUFTLGNBQVQ7QUFDQStFLG9CQUFnQixJQURoQjtBQUVBcEIsZ0JBQVksSUFGWjtBQUdBd0IsZ0JBQVksS0FIWjtBQUlBL0Isb0JBQ0U7QUFBQSxzQkFBZ0I7QUFBaEI7QUFMRixHQURHLENBQVA7QUNTSCxDOzs7Ozs7Ozs7Ozs7QUNWRHJILE9BQU9nTixPQUFQLENBQWU7QUNDYixTREFERCxJQUFJbkQsYUFBSixDQUFrQmpKLEdBQUdiLFdBQXJCLEVBQ0M7QUFBQW9LLHVCQUFtQixFQUFuQjtBQUNBRyxrQkFDQztBQUFBeEUsb0JBQWMsSUFBZDtBQUNBQyxxQkFBZTtBQURmO0FBRkQsR0FERCxDQ0FDO0FEREYsRzs7Ozs7Ozs7Ozs7O0FFQUE5RixPQUFPZ04sT0FBUCxDQUFlO0FDQ2IsU0RBREQsSUFBSW5ELGFBQUosQ0FBa0JqSixHQUFHc00sYUFBckIsRUFDQztBQUFBL0MsdUJBQW1CLEVBQW5CO0FBQ0FHLGtCQUNDO0FBQUF4RSxvQkFBYyxJQUFkO0FBQ0FDLHFCQUFlO0FBRGY7QUFGRCxHQURELENDQUM7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQWpKLFdBQVdzSCxHQUFYLENBQWUsTUFBZixFQUF1Qix1QkFBdkIsRUFBaUQsVUFBQ3BILEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYO0FBQy9DLE1BQUE0TSxVQUFBO0FBQUFBLGVBQWFxRCxJQUFJQyxTQUFqQjtBQ0VBLFNEREF0USxXQUFXQyxVQUFYLENBQXNCQyxHQUF0QixFQUEyQkMsR0FBM0IsRUFBZ0M7QUFDOUIsUUFBQW9RLE9BQUE7O0FBQUEsUUFBR3JRLElBQUlHLEtBQUosSUFBY0gsSUFBSUcsS0FBSixDQUFVLENBQVYsQ0FBakI7QUFDRWtRLGdCQUFVLElBQUlDLEdBQUdDLElBQVAsRUFBVjtBQUNBRixjQUFRRyxVQUFSLENBQW1CeFEsSUFBSUcsS0FBSixDQUFVLENBQVYsRUFBYVksSUFBaEMsRUFBc0M7QUFBQzBQLGNBQU16USxJQUFJRyxLQUFKLENBQVUsQ0FBVixFQUFhVztBQUFwQixPQUF0QyxFQUFxRSxVQUFDZ0UsR0FBRDtBQUNuRSxZQUFBMUQsSUFBQSxFQUFBMk4sQ0FBQSxFQUFBMkIsT0FBQSxFQUFBalEsUUFBQSxFQUFBa1EsUUFBQSxFQUFBQyxNQUFBLEVBQUFDLENBQUE7QUFBQXBRLG1CQUFXVCxJQUFJRyxLQUFKLENBQVUsQ0FBVixFQUFhTSxRQUF4Qjs7QUFFQSxZQUFHLENBQUMsV0FBRCxFQUFjLFdBQWQsRUFBMkIsWUFBM0IsRUFBeUMsV0FBekMsRUFBc0RxUSxRQUF0RCxDQUErRHJRLFNBQVNpTCxXQUFULEVBQS9ELENBQUg7QUFDRWpMLHFCQUFXLFdBQVdzUSxPQUFPLElBQUlDLElBQUosRUFBUCxFQUFtQkMsTUFBbkIsQ0FBMEIsZ0JBQTFCLENBQVgsR0FBeUQsR0FBekQsR0FBK0R4USxTQUFTeVEsS0FBVCxDQUFlLEdBQWYsRUFBb0JDLEdBQXBCLEVBQTFFO0FDS0Q7O0FESEQvUCxlQUFPcEIsSUFBSW9CLElBQVg7O0FBQ0E7QUFDRSxjQUFHQSxTQUFTQSxLQUFLLGFBQUwsTUFBdUIsSUFBdkIsSUFBK0JBLEtBQUssYUFBTCxNQUF1QixNQUEvRCxDQUFIO0FBQ0VYLHVCQUFXMlEsbUJBQW1CM1EsUUFBbkIsQ0FBWDtBQUZKO0FBQUEsaUJBQUE4QyxLQUFBO0FBR013TCxjQUFBeEwsS0FBQTtBQUNKNkIsa0JBQVE3QixLQUFSLENBQWM5QyxRQUFkO0FBQ0EyRSxrQkFBUTdCLEtBQVIsQ0FBY3dMLENBQWQ7QUFDQXRPLHFCQUFXQSxTQUFTNFEsT0FBVCxDQUFpQixJQUFqQixFQUF1QixHQUF2QixDQUFYO0FDT0Q7O0FETERoQixnQkFBUS9MLElBQVIsQ0FBYTdELFFBQWI7O0FBRUEsWUFBR1csUUFBUUEsS0FBSyxPQUFMLENBQVIsSUFBeUJBLEtBQUssWUFBTCxDQUF6QixJQUErQ0EsS0FBSyxPQUFMLENBQS9DLElBQWdFQSxLQUFLLFVBQUwsQ0FBaEUsSUFBcUZBLEtBQUssU0FBTCxDQUF4RjtBQUNFd1AsbUJBQVMsRUFBVDtBQUNBRCxxQkFBVztBQUFDVyxtQkFBTWxRLEtBQUssT0FBTCxDQUFQO0FBQXNCbVEsd0JBQVduUSxLQUFLLFlBQUwsQ0FBakM7QUFBcUQ2QyxtQkFBTTdDLEtBQUssT0FBTCxDQUEzRDtBQUEwRW9RLHNCQUFTcFEsS0FBSyxVQUFMLENBQW5GO0FBQXFHcVEscUJBQVNyUSxLQUFLLFNBQUwsQ0FBOUc7QUFBK0hzUSxxQkFBUztBQUF4SSxXQUFYOztBQUVBLGNBQUd0USxLQUFLLFlBQUwsS0FBc0JBLEtBQUssWUFBTCxFQUFtQnVRLGlCQUFuQixPQUEwQyxNQUFuRTtBQUNFaEIscUJBQVNpQixVQUFULEdBQXNCLElBQXRCO0FBREY7QUFHRWpCLHFCQUFTaUIsVUFBVCxHQUFzQixLQUF0QjtBQ1lEOztBRFZELGNBQUd4USxLQUFLLE1BQUwsTUFBZ0IsTUFBbkI7QUFDRXVQLHFCQUFTa0IsSUFBVCxHQUFnQixJQUFoQjtBQ1lEOztBRFZELGNBQUd6USxLQUFLLGNBQUwsS0FBd0JBLEtBQUssUUFBTCxDQUEzQjtBQUNFd1AscUJBQVN4UCxLQUFLLFFBQUwsQ0FBVDtBQ1lEOztBRE5ELGNBQUd3UCxNQUFIO0FBQ0VDLGdCQUFJL0QsV0FBV3FCLE1BQVgsQ0FBa0I7QUFBQyxpQ0FBbUJ5QyxNQUFwQjtBQUE0QixrQ0FBcUI7QUFBakQsYUFBbEIsRUFBMEU7QUFBQ2tCLHNCQUFTO0FBQUMsb0NBQXFCO0FBQXRCO0FBQVYsYUFBMUUsQ0FBSjs7QUFDQSxnQkFBR2pCLENBQUg7QUFDRUYsdUJBQVNDLE1BQVQsR0FBa0JBLE1BQWxCOztBQUNBLGtCQUFHeFAsS0FBSyxXQUFMLEtBQXFCQSxLQUFLLGdCQUFMLENBQXhCO0FBQ0V1UCx5QkFBU29CLFNBQVQsR0FBcUIzUSxLQUFLLFdBQUwsQ0FBckI7QUFDQXVQLHlCQUFTcUIsY0FBVCxHQUEwQjVRLEtBQUssZ0JBQUwsQ0FBMUI7QUNlRDs7QURiRGlQLHNCQUFRTSxRQUFSLEdBQW1CQSxRQUFuQjtBQUNBRCx3QkFBVTVELFdBQVcwQixNQUFYLENBQWtCNkIsT0FBbEIsQ0FBVjs7QUFHQSxrQkFBR2pQLEtBQUssV0FBTCxLQUFxQkEsS0FBSyxXQUFMLEVBQWtCdVEsaUJBQWxCLE9BQXlDLE1BQWpFO0FBQ0U3RSwyQkFBV3VCLE1BQVgsQ0FBa0I7QUFBQyx1Q0FBcUJqTixLQUFLLFVBQUwsQ0FBdEI7QUFBd0MscUNBQW1Cd1AsTUFBM0Q7QUFBbUUsb0NBQWtCeFAsS0FBSyxPQUFMLENBQXJGO0FBQW9HLHNDQUFvQkEsS0FBSyxTQUFMLENBQXhIO0FBQXlJLHNDQUFvQjtBQUFDNlEseUJBQUs7QUFBTjtBQUE3SixpQkFBbEI7QUFYSjtBQUZGO0FBQUE7QUFlRTVCLG9CQUFRTSxRQUFSLEdBQW1CQSxRQUFuQjtBQUNBRCxzQkFBVTVELFdBQVcwQixNQUFYLENBQWtCNkIsT0FBbEIsQ0FBVjtBQUNBSyxvQkFBUXZDLE1BQVIsQ0FBZTtBQUFDQyxvQkFBTTtBQUFDLG1DQUFvQnNDLFFBQVEvTTtBQUE3QjtBQUFQLGFBQWY7QUFwQ0o7QUFBQTtBQXdDRStNLG9CQUFVNUQsV0FBVzBCLE1BQVgsQ0FBa0I2QixPQUFsQixDQUFWO0FDMEJEO0FEbkZIO0FDcUZBLGFEekJBQSxRQUFRNkIsSUFBUixDQUFhLFFBQWIsRUFBdUIsVUFBQ0MsU0FBRDtBQUNyQixZQUFBQyxJQUFBLEVBQUFDLElBQUE7QUFBQUEsZUFBT2hDLFFBQVFpQyxRQUFSLENBQWlCRCxJQUF4Qjs7QUFDQSxZQUFHLENBQUNBLElBQUo7QUFDRUEsaUJBQU8sSUFBUDtBQzJCRDs7QUQxQkRELGVBQ0U7QUFBQUcsc0JBQVlsQyxRQUFRMU0sR0FBcEI7QUFDQTBPLGdCQUFNQTtBQUROLFNBREY7QUFHQXBTLFlBQUl5RixHQUFKLENBQVFvRixLQUFLQyxTQUFMLENBQWVxSCxJQUFmLENBQVI7QUFQRixRQ3lCQTtBRHZGRjtBQXdFRW5TLFVBQUk4RSxVQUFKLEdBQWlCLEdBQWpCO0FBQ0E5RSxVQUFJeUYsR0FBSjtBQzZCRDtBRHZHSCxJQ0NBO0FESEY7QUFnRkE1RixXQUFXc0gsR0FBWCxDQUFlLFFBQWYsRUFBeUIsdUJBQXpCLEVBQW1ELFVBQUNwSCxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWDtBQUVqRCxNQUFBNE0sVUFBQSxFQUFBdE0sSUFBQSxFQUFBc0IsRUFBQSxFQUFBc1EsSUFBQTtBQUFBdEYsZUFBYXFELElBQUlDLFNBQWpCO0FBRUF0TyxPQUFLOUIsSUFBSTRILEtBQUosQ0FBVTJLLFVBQWY7O0FBQ0EsTUFBR3pRLEVBQUg7QUFDRXRCLFdBQU9zTSxXQUFXM0osT0FBWCxDQUFtQjtBQUFFUSxXQUFLN0I7QUFBUCxLQUFuQixDQUFQOztBQUNBLFFBQUd0QixJQUFIO0FBQ0VBLFdBQUs2TixNQUFMO0FBQ0ErRCxhQUFPO0FBQ0xwTixnQkFBUTtBQURILE9BQVA7QUFHQS9FLFVBQUl5RixHQUFKLENBQVFvRixLQUFLQyxTQUFMLENBQWVxSCxJQUFmLENBQVI7QUFDQTtBQVJKO0FDd0NDOztBRDlCRG5TLE1BQUk4RSxVQUFKLEdBQWlCLEdBQWpCO0FDZ0NBLFNEL0JBOUUsSUFBSXlGLEdBQUosRUMrQkE7QUQvQ0Y7QUFtQkE1RixXQUFXc0gsR0FBWCxDQUFlLEtBQWYsRUFBc0IsdUJBQXRCLEVBQWdELFVBQUNwSCxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWDtBQUU5QyxNQUFBNEIsRUFBQTtBQUFBQSxPQUFLOUIsSUFBSTRILEtBQUosQ0FBVTJLLFVBQWY7QUFFQXRTLE1BQUk4RSxVQUFKLEdBQWlCLEdBQWpCO0FBQ0E5RSxNQUFJdUYsU0FBSixDQUFjLFVBQWQsRUFBMEJ0QixRQUFRc08sV0FBUixDQUFvQixzQkFBcEIsSUFBOEMxUSxFQUE5QyxHQUFtRCxhQUE3RTtBQytCQSxTRDlCQTdCLElBQUl5RixHQUFKLEVDOEJBO0FEcENGLEc7Ozs7Ozs7Ozs7OztBRW5HQTVGLFdBQVdzSCxHQUFYLENBQWUsTUFBZixFQUF1QixtQkFBdkIsRUFBNEMsVUFBQ3BILEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYO0FBQ3hDLE1BQUFrSSxPQUFBLEVBQUF0RixHQUFBOztBQUFBLFFBQUFBLE1BQUE5QyxJQUFBb0IsSUFBQSxZQUFBMEIsSUFBYTJQLFNBQWIsR0FBYSxNQUFiLEtBQTJCelMsSUFBSW9CLElBQUosQ0FBU3NSLE9BQXBDLElBQWdEMVMsSUFBSW9CLElBQUosQ0FBU0wsSUFBekQ7QUFDSXFILGNBQ0k7QUFBQXVLLFlBQU0sU0FBTjtBQUNBL0ssYUFDSTtBQUFBZ0wsaUJBQVM1UyxJQUFJb0IsSUFBSixDQUFTcVIsU0FBbEI7QUFDQWpPLGdCQUNJO0FBQUEsaUJBQU9rTztBQUFQO0FBRko7QUFGSixLQURKOztBQU1BLFFBQUcxUyxJQUFBb0IsSUFBQSxDQUFBTCxJQUFBLENBQUE4UixVQUFBLFFBQUg7QUFDSXpLLGNBQVEsT0FBUixJQUFtQnBJLElBQUlvQixJQUFKLENBQVNMLElBQVQsQ0FBYzhSLFVBQWpDO0FDS1A7O0FESkcsUUFBRzdTLElBQUFvQixJQUFBLENBQUFMLElBQUEsQ0FBQStSLEtBQUEsUUFBSDtBQUNJMUssY0FBUSxNQUFSLElBQWtCcEksSUFBSW9CLElBQUosQ0FBU0wsSUFBVCxDQUFjK1IsS0FBaEM7QUNNUDs7QURMRyxRQUFHOVMsSUFBQW9CLElBQUEsQ0FBQUwsSUFBQSxDQUFBZ1MsS0FBQSxRQUFIO0FBQ0kzSyxjQUFRLE9BQVIsSUFBbUJwSSxJQUFJb0IsSUFBSixDQUFTTCxJQUFULENBQWNnUyxLQUFkLEdBQXNCLEVBQXpDO0FDT1A7O0FETkcsUUFBRy9TLElBQUFvQixJQUFBLENBQUFMLElBQUEsQ0FBQWlTLEtBQUEsUUFBSDtBQUNJNUssY0FBUSxPQUFSLElBQW1CcEksSUFBSW9CLElBQUosQ0FBU0wsSUFBVCxDQUFjaVMsS0FBakM7QUNRUDs7QURMR0MsU0FBS0MsSUFBTCxDQUFVOUssT0FBVjtBQ09KLFdETEluSSxJQUFJeUYsR0FBSixDQUFRLFNBQVIsQ0NLSjtBQUNEO0FEMUJIO0FBd0JBekMsT0FBT21LLE9BQVAsQ0FDSTtBQUFBK0YsWUFBVSxVQUFDQyxJQUFELEVBQU1DLEtBQU4sRUFBWU4sS0FBWixFQUFrQnZPLE1BQWxCO0FBQ04sUUFBSSxDQUFDQSxNQUFMO0FBQ0k7QUNNUDs7QUFDRCxXRE5JeU8sS0FBS0MsSUFBTCxDQUNJO0FBQUFQLFlBQU0sU0FBTjtBQUNBVSxhQUFPQSxLQURQO0FBRUFELFlBQU1BLElBRk47QUFHQUwsYUFBT0EsS0FIUDtBQUlBbkwsYUFDSTtBQUFBcEQsZ0JBQVFBLE1BQVI7QUFDQW9PLGlCQUFTO0FBRFQ7QUFMSixLQURKLENDTUo7QURUQTtBQUFBLENBREosRTs7Ozs7Ozs7Ozs7O0FFeEJBLElBQUFVLFdBQUE7QUFBQUEsY0FBYyxFQUFkOztBQUVBQSxZQUFZQyxXQUFaLEdBQTBCLFVBQUNDLFVBQUQsRUFBYUMsWUFBYixFQUEyQkMsUUFBM0I7QUFDekIsTUFBQUMsR0FBQSxFQUFBQyxPQUFBLEVBQUFDLE1BQUEsRUFBQUMsS0FBQSxFQUFBQyxRQUFBLEVBQUFDLFlBQUEsRUFBQUMsY0FBQSxFQUFBbFQsSUFBQSxFQUFBbVQsWUFBQSxFQUFBQyxRQUFBLEVBQUFsUCxHQUFBLEVBQUFtUCxJQUFBLEVBQUFDLFlBQUEsRUFBQXZSLEdBQUEsRUFBQTJGLElBQUEsRUFBQUMsSUFBQSxFQUFBNEwsSUFBQSxFQUFBQyxhQUFBLEVBQUFDLFdBQUE7O0FBQUEsTUFBR2YsYUFBYUosS0FBYixJQUF1QkksYUFBYUwsSUFBdkM7QUFDQyxRQUFHSCxLQUFLd0IsS0FBUjtBQUNDclAsY0FBUXNQLEdBQVIsQ0FBWWxCLFVBQVo7QUNJRTs7QURGSFEsbUJBQWUsSUFBSVcsS0FBSixFQUFmO0FBQ0FILGtCQUFjLElBQUlHLEtBQUosRUFBZDtBQUNBVCxtQkFBZSxJQUFJUyxLQUFKLEVBQWY7QUFDQVIsZUFBVyxJQUFJUSxLQUFKLEVBQVg7QUFFQW5CLGVBQVdvQixPQUFYLENBQW1CLFVBQUNDLFNBQUQ7QUFDbEIsVUFBQUMsR0FBQTtBQUFBQSxZQUFNRCxVQUFVM0QsS0FBVixDQUFnQixHQUFoQixDQUFOOztBQUNBLFVBQUc0RCxJQUFJLENBQUosTUFBVSxRQUFiO0FDSUssZURISmQsYUFBYWhULElBQWIsQ0FBa0JtQixFQUFFb0ssSUFBRixDQUFPdUksR0FBUCxDQUFsQixDQ0dJO0FESkwsYUFFSyxJQUFHQSxJQUFJLENBQUosTUFBVSxPQUFiO0FDSUEsZURISk4sWUFBWXhULElBQVosQ0FBaUJtQixFQUFFb0ssSUFBRixDQUFPdUksR0FBUCxDQUFqQixDQ0dJO0FESkEsYUFFQSxJQUFHQSxJQUFJLENBQUosTUFBVSxRQUFiO0FDSUEsZURISlosYUFBYWxULElBQWIsQ0FBa0JtQixFQUFFb0ssSUFBRixDQUFPdUksR0FBUCxDQUFsQixDQ0dJO0FESkEsYUFFQSxJQUFHQSxJQUFJLENBQUosTUFBVSxJQUFiO0FDSUEsZURISlgsU0FBU25ULElBQVQsQ0FBY21CLEVBQUVvSyxJQUFGLENBQU91SSxHQUFQLENBQWQsQ0NHSTtBQUNEO0FEYkw7O0FBV0EsUUFBRyxDQUFDM1MsRUFBRTBHLE9BQUYsQ0FBVW1MLFlBQVYsQ0FBRCxNQUFBbFIsTUFBQUcsT0FBQThSLFFBQUEsQ0FBQS9ULElBQUEsWUFBQThCLElBQW1Ea1MsTUFBbkQsR0FBbUQsTUFBbkQsQ0FBSDtBQUNDckIsWUFBTTlULFFBQVEsWUFBUixDQUFOOztBQUNBLFVBQUdvVCxLQUFLd0IsS0FBUjtBQUNDclAsZ0JBQVFzUCxHQUFSLENBQVksbUJBQWlCVixZQUE3QjtBQ0tHOztBREpKSixnQkFBVSxJQUFLRCxJQUFJc0IsSUFBVCxDQUNUO0FBQUFDLHFCQUFhalMsT0FBTzhSLFFBQVAsQ0FBZ0IvVCxJQUFoQixDQUFxQmdVLE1BQXJCLENBQTRCRSxXQUF6QztBQUNBQyx5QkFBaUJsUyxPQUFPOFIsUUFBUCxDQUFnQi9ULElBQWhCLENBQXFCZ1UsTUFBckIsQ0FBNEJHLGVBRDdDO0FBRUFoTyxrQkFBVWxFLE9BQU84UixRQUFQLENBQWdCL1QsSUFBaEIsQ0FBcUJnVSxNQUFyQixDQUE0QjdOLFFBRnRDO0FBR0FpTyxvQkFBWW5TLE9BQU84UixRQUFQLENBQWdCL1QsSUFBaEIsQ0FBcUJnVSxNQUFyQixDQUE0Qkk7QUFIeEMsT0FEUyxDQUFWO0FBTUFyVSxhQUNDO0FBQUFzVSxnQkFBUXBTLE9BQU84UixRQUFQLENBQWdCL1QsSUFBaEIsQ0FBcUJnVSxNQUFyQixDQUE0Qk0sTUFBcEM7QUFDQUMsZ0JBQVEsUUFEUjtBQUVBQyxxQkFBYXhCLGFBQWE3TyxRQUFiLEVBRmI7QUFHQXNRLGVBQU9oQyxhQUFhSixLQUhwQjtBQUlBcUMsaUJBQVNqQyxhQUFhTDtBQUp0QixPQUREO0FBT0FRLGNBQVErQixtQkFBUixDQUE0QjVVLElBQTVCLEVBQWtDMlMsUUFBbEM7QUNNRTs7QURKSCxRQUFHLENBQUN2UixFQUFFMEcsT0FBRixDQUFVMkwsV0FBVixDQUFELE1BQUEvTCxPQUFBeEYsT0FBQThSLFFBQUEsQ0FBQS9ULElBQUEsWUFBQXlILEtBQWtEbU4sS0FBbEQsR0FBa0QsTUFBbEQsQ0FBSDtBQUNDOUIsY0FBUWpVLFFBQVEsT0FBUixDQUFSOztBQUNBLFVBQUdvVCxLQUFLd0IsS0FBUjtBQUNDclAsZ0JBQVFzUCxHQUFSLENBQVksa0JBQWdCRixXQUE1QjtBQ01HOztBRExKVCxpQkFBVyxJQUFJRCxNQUFNQyxRQUFWLENBQW1COVEsT0FBTzhSLFFBQVAsQ0FBZ0IvVCxJQUFoQixDQUFxQjRVLEtBQXJCLENBQTJCQyxRQUE5QyxFQUF3RDVTLE9BQU84UixRQUFQLENBQWdCL1QsSUFBaEIsQ0FBcUI0VSxLQUFyQixDQUEyQkUsU0FBbkYsQ0FBWDtBQUVBN0IsdUJBQWlCLElBQUlILE1BQU1pQyxjQUFWLEVBQWpCO0FBQ0E5QixxQkFBZXhELElBQWYsR0FBc0JxRCxNQUFNa0MseUJBQTVCO0FBQ0EvQixxQkFBZVosS0FBZixHQUF1QkksYUFBYUosS0FBcEM7QUFDQVkscUJBQWVnQyxPQUFmLEdBQXlCeEMsYUFBYUwsSUFBdEM7QUFDQWEscUJBQWVpQyxLQUFmLEdBQXVCLElBQUlwQyxNQUFNcUMsS0FBVixFQUF2QjtBQUNBbEMscUJBQWV6TCxNQUFmLEdBQXdCLElBQUlzTCxNQUFNc0MsV0FBVixFQUF4Qjs7QUFFQWpVLFFBQUU0QixJQUFGLENBQU95USxXQUFQLEVBQW9CLFVBQUM2QixDQUFEO0FDS2YsZURKSnRDLFNBQVN1QyxrQkFBVCxDQUE0QkQsQ0FBNUIsRUFBK0JwQyxjQUEvQixFQUErQ1AsUUFBL0MsQ0NJSTtBRExMO0FDT0U7O0FESkgsUUFBRyxDQUFDdlIsRUFBRTBHLE9BQUYsQ0FBVXFMLFlBQVYsQ0FBRCxNQUFBeEwsT0FBQXpGLE9BQUE4UixRQUFBLENBQUEvVCxJQUFBLFlBQUEwSCxLQUFtRDZOLE1BQW5ELEdBQW1ELE1BQW5ELENBQUg7QUFDQyxVQUFHdEQsS0FBS3dCLEtBQVI7QUFDQ3JQLGdCQUFRc1AsR0FBUixDQUFZLG1CQUFpQlIsWUFBN0I7QUNNRzs7QURKSkcscUJBQWVwUixPQUFPOFIsUUFBUCxDQUFnQi9ULElBQWhCLENBQXFCdVYsTUFBckIsQ0FBNEJDLFVBQTNDO0FBQ0FqQyxzQkFBZ0IsRUFBaEI7O0FBQ0FwUyxRQUFFNEIsSUFBRixDQUFPbVEsWUFBUCxFQUFxQixVQUFDbUMsQ0FBRDtBQ01oQixlRExKOUIsY0FBY3ZULElBQWQsQ0FBbUI7QUFBQywwQkFBZ0JxVCxZQUFqQjtBQUErQixtQkFBU2dDO0FBQXhDLFNBQW5CLENDS0k7QUROTDs7QUFFQWpDLGFBQU87QUFBQyxtQkFBVztBQUFDLG1CQUFTWCxhQUFhSixLQUF2QjtBQUE4QixxQkFBV0ksYUFBYUw7QUFBdEQsU0FBWjtBQUF5RSxrQkFBVUssYUFBYWdEO0FBQWhHLE9BQVA7QUFFQUMsaUJBQVdDLE1BQVgsQ0FBa0IsQ0FBQztBQUFDLHdCQUFnQnRDLFlBQWpCO0FBQStCLHFCQUFhcFIsT0FBTzhSLFFBQVAsQ0FBZ0IvVCxJQUFoQixDQUFxQnVWLE1BQXJCLENBQTRCSyxLQUF4RTtBQUErRSx5QkFBaUIzVCxPQUFPOFIsUUFBUCxDQUFnQi9ULElBQWhCLENBQXFCdVYsTUFBckIsQ0FBNEJNO0FBQTVILE9BQUQsQ0FBbEI7QUFFQUgsaUJBQVdJLFFBQVgsQ0FBb0IxQyxJQUFwQixFQUEwQkcsYUFBMUI7QUNvQkU7O0FEakJILFFBQUcsQ0FBQ3BTLEVBQUUwRyxPQUFGLENBQVVzTCxRQUFWLENBQUQsTUFBQUcsT0FBQXJSLE9BQUE4UixRQUFBLENBQUEvVCxJQUFBLFlBQUFzVCxLQUErQ3lDLEVBQS9DLEdBQStDLE1BQS9DLENBQUg7QUFDQ2xELGVBQVNoVSxRQUFRLGFBQVIsQ0FBVDs7QUFDQSxVQUFHb1QsS0FBS3dCLEtBQVI7QUFDQ3JQLGdCQUFRc1AsR0FBUixDQUFZLGVBQWFQLFFBQXpCO0FDbUJHOztBRGxCSmxQLFlBQU0sSUFBSTRPLE9BQU9tRCxPQUFYLEVBQU47QUFDQS9SLFVBQUlvTyxLQUFKLENBQVVJLGFBQWFKLEtBQXZCLEVBQThCNEQsV0FBOUIsQ0FBMEN4RCxhQUFhTCxJQUF2RDtBQUNBSyxxQkFBZSxJQUFJSSxPQUFPcUQsWUFBWCxDQUNkO0FBQUFDLG9CQUFZbFUsT0FBTzhSLFFBQVAsQ0FBZ0IvVCxJQUFoQixDQUFxQitWLEVBQXJCLENBQXdCSSxVQUFwQztBQUNBTixtQkFBVzVULE9BQU84UixRQUFQLENBQWdCL1QsSUFBaEIsQ0FBcUIrVixFQUFyQixDQUF3QkY7QUFEbkMsT0FEYyxDQUFmO0FDdUJHLGFEbkJIMVUsRUFBRTRCLElBQUYsQ0FBT29RLFFBQVAsRUFBaUIsVUFBQ2lELEtBQUQ7QUNvQlosZURuQkozRCxhQUFhUCxJQUFiLENBQWtCa0UsS0FBbEIsRUFBeUJuUyxHQUF6QixFQUE4QnlPLFFBQTlCLENDbUJJO0FEcEJMLFFDbUJHO0FEbkdMO0FDdUdFO0FEeEd1QixDQUExQjs7QUFxRkF6USxPQUFPZ04sT0FBUCxDQUFlO0FBRWQsTUFBQTBHLE1BQUEsRUFBQTdULEdBQUEsRUFBQTJGLElBQUEsRUFBQUMsSUFBQSxFQUFBNEwsSUFBQSxFQUFBK0MsSUFBQSxFQUFBQyxJQUFBLEVBQUFDLElBQUE7O0FBQUEsTUFBRyxHQUFBelUsTUFBQUcsT0FBQThSLFFBQUEsQ0FBQXlDLElBQUEsWUFBQTFVLElBQTBCMlUsYUFBMUIsR0FBMEIsTUFBMUIsQ0FBSDtBQUNDO0FDdUJDOztBRHJCRmQsV0FBUztBQUNSbEMsV0FBTyxJQURDO0FBRVJpRCx1QkFBbUIsS0FGWDtBQUdSQyxrQkFBYzFVLE9BQU84UixRQUFQLENBQWdCeUMsSUFBaEIsQ0FBcUJDLGFBSDNCO0FBSVJHLG1CQUFlLEVBSlA7QUFLUlQsZ0JBQVk7QUFMSixHQUFUOztBQVFBLE1BQUcsQ0FBQ2hWLEVBQUUwRyxPQUFGLEVBQUFKLE9BQUF4RixPQUFBOFIsUUFBQSxDQUFBL1QsSUFBQSxZQUFBeUgsS0FBZ0NvUCxHQUFoQyxHQUFnQyxNQUFoQyxDQUFKO0FBQ0NsQixXQUFPa0IsR0FBUCxHQUFhO0FBQ1pDLGVBQVM3VSxPQUFPOFIsUUFBUCxDQUFnQi9ULElBQWhCLENBQXFCNlcsR0FBckIsQ0FBeUJDLE9BRHRCO0FBRVpDLGdCQUFVOVUsT0FBTzhSLFFBQVAsQ0FBZ0IvVCxJQUFoQixDQUFxQjZXLEdBQXJCLENBQXlCRTtBQUZ2QixLQUFiO0FDeUJDOztBRHJCRixNQUFHLENBQUM1VixFQUFFMEcsT0FBRixFQUFBSCxPQUFBekYsT0FBQThSLFFBQUEsQ0FBQS9ULElBQUEsWUFBQTBILEtBQWdDc1AsR0FBaEMsR0FBZ0MsTUFBaEMsQ0FBSjtBQUNDckIsV0FBT3FCLEdBQVAsR0FBYTtBQUNaQyxxQkFBZWhWLE9BQU84UixRQUFQLENBQWdCL1QsSUFBaEIsQ0FBcUJnWCxHQUFyQixDQUF5QkMsYUFENUI7QUFFWkMsY0FBUWpWLE9BQU84UixRQUFQLENBQWdCL1QsSUFBaEIsQ0FBcUJnWCxHQUFyQixDQUF5QkU7QUFGckIsS0FBYjtBQzBCQzs7QURyQkZqRixPQUFLa0YsU0FBTCxDQUFleEIsTUFBZjs7QUFFQSxNQUFHLEdBQUFyQyxPQUFBclIsT0FBQThSLFFBQUEsQ0FBQS9ULElBQUEsWUFBQXNULEtBQXVCVSxNQUF2QixHQUF1QixNQUF2QixNQUFDLENBQUFxQyxPQUFBcFUsT0FBQThSLFFBQUEsQ0FBQS9ULElBQUEsWUFBQXFXLEtBQXNEekIsS0FBdEQsR0FBc0QsTUFBdkQsTUFBQyxDQUFBMEIsT0FBQXJVLE9BQUE4UixRQUFBLENBQUEvVCxJQUFBLFlBQUFzVyxLQUFxRmYsTUFBckYsR0FBcUYsTUFBdEYsTUFBQyxDQUFBZ0IsT0FBQXRVLE9BQUE4UixRQUFBLENBQUEvVCxJQUFBLFlBQUF1VyxLQUFxSFIsRUFBckgsR0FBcUgsTUFBdEgsTUFBOEg5RCxJQUE5SCxJQUF1SSxPQUFPQSxLQUFLbUYsT0FBWixLQUF1QixVQUFqSztBQUVDbkYsU0FBS29GLFdBQUwsR0FBbUJwRixLQUFLbUYsT0FBeEI7O0FBRUFuRixTQUFLcUYsVUFBTCxHQUFrQixVQUFDOUUsVUFBRCxFQUFhQyxZQUFiO0FBQ2pCLFVBQUE3VCxLQUFBLEVBQUFpVixTQUFBOztBQUFBLFVBQUc1QixLQUFLd0IsS0FBUjtBQUNDclAsZ0JBQVFzUCxHQUFSLENBQVksWUFBWixFQUEwQmxCLFVBQTFCLEVBQXNDQyxZQUF0QztBQ3FCRzs7QURuQkosVUFBRy9SLE1BQU02VyxJQUFOLENBQVc5RSxhQUFhdUUsR0FBeEIsRUFBNkJRLE1BQTdCLENBQUg7QUFDQy9FLHVCQUFldFIsRUFBRXlFLE1BQUYsQ0FBUyxFQUFULEVBQWE2TSxZQUFiLEVBQTJCQSxhQUFhdUUsR0FBeEMsQ0FBZjtBQ3FCRzs7QURuQkosVUFBR3hFLGVBQWMsS0FBS0EsVUFBdEI7QUFDQ0EscUJBQWEsQ0FBRUEsVUFBRixDQUFiO0FDcUJHOztBRG5CSixVQUFHLENBQUNBLFdBQVduUixNQUFmO0FBQ0MrQyxnQkFBUXNQLEdBQVIsQ0FBWSw4QkFBWjtBQUNBO0FDcUJHOztBRHBCSixVQUFHekIsS0FBS3dCLEtBQVI7QUFDQ3JQLGdCQUFRc1AsR0FBUixDQUFZLFlBQVosRUFBMEJsQixVQUExQixFQUFzQ0MsWUFBdEM7QUNzQkc7O0FEcEJKN1QsY0FBUUMsUUFBUSxRQUFSLENBQVI7QUFFQWdWLGtCQUFlckIsV0FBV25SLE1BQVgsS0FBcUIsQ0FBckIsR0FBNEJtUixXQUFXLENBQVgsQ0FBNUIsR0FBK0MsSUFBOUQ7QUNxQkcsYURwQkhGLFlBQVlDLFdBQVosQ0FBd0JDLFVBQXhCLEVBQW9DQyxZQUFwQyxFQUFrRCxVQUFDM08sR0FBRCxFQUFNMlQsTUFBTjtBQUNqRCxZQUFHM1QsR0FBSDtBQ3FCTSxpQkRwQkxNLFFBQVFzUCxHQUFSLENBQVksc0NBQXNDK0QsTUFBbEQsQ0NvQks7QURyQk47QUFHQyxjQUFHQSxXQUFVLElBQWI7QUFDQ3JULG9CQUFRc1AsR0FBUixDQUFZLG1DQUFaO0FDcUJLOztBRHBCTjs7QUFFQSxjQUFHekIsS0FBS3dCLEtBQVI7QUFDQ3JQLG9CQUFRc1AsR0FBUixDQUFZLGdDQUFnQzVKLEtBQUtDLFNBQUwsQ0FBZTBOLE1BQWYsQ0FBNUM7QUNxQks7O0FEbkJOLGNBQUdBLE9BQU9DLGFBQVAsS0FBd0IsQ0FBeEIsSUFBOEI3RCxTQUFqQztBQUNDalYsa0JBQU0sVUFBQzRHLElBQUQ7QUFDTDtBQ3FCUyx1QkRwQlJBLEtBQUtrTixRQUFMLENBQWNsTixLQUFLbVMsUUFBbkIsRUFBNkJuUyxLQUFLb1MsUUFBbEMsQ0NvQlE7QURyQlQsdUJBQUFyVixLQUFBO0FBRU11QixzQkFBQXZCLEtBQUE7QUNzQkU7QUR6QlQsZUFJRWxDLEdBSkYsQ0FLQztBQUFBc1gsd0JBQVU7QUFBQVgscUJBQUtuRDtBQUFMLGVBQVY7QUFDQStELHdCQUFVO0FBQUFaLHFCQUFLLFlBQVlTLE9BQU9JLE9BQVAsQ0FBZSxDQUFmLEVBQWtCQztBQUFuQyxlQURWO0FBRUFwRix3QkFBVXFGO0FBRlYsYUFMRDtBQ21DSzs7QUQzQk4sY0FBR04sT0FBT08sT0FBUCxLQUFrQixDQUFsQixJQUF3Qm5FLFNBQTNCO0FDNkJPLG1CRDVCTmpWLE1BQU0sVUFBQzRHLElBQUQ7QUFDTDtBQzZCUyx1QkQ1QlJBLEtBQUtrTixRQUFMLENBQWNsTixLQUFLakMsS0FBbkIsQ0M0QlE7QUQ3QlQsdUJBQUFoQixLQUFBO0FBRU11QixzQkFBQXZCLEtBQUE7QUM4QkU7QURqQ1QsZUFJRWxDLEdBSkYsQ0FLQztBQUFBa0QscUJBQU87QUFBQXlULHFCQUFLbkQ7QUFBTCxlQUFQO0FBQ0FuQix3QkFBVXVGO0FBRFYsYUFMRCxDQzRCTTtBRGhEUjtBQzZESztBRDlETixRQ29CRztBRHZDYyxLQUFsQjs7QUFrREFoRyxTQUFLbUYsT0FBTCxHQUFlLFVBQUM1RSxVQUFELEVBQWFDLFlBQWI7QUFDZCxVQUFBTyxZQUFBLEVBQUFrRixTQUFBOztBQUFBLFVBQUdqRyxLQUFLd0IsS0FBUjtBQUNDclAsZ0JBQVFzUCxHQUFSLENBQVksb0NBQVo7QUNvQ0c7O0FEbkNKLFVBQUdoVCxNQUFNNlcsSUFBTixDQUFXOUUsYUFBYXVFLEdBQXhCLEVBQTZCUSxNQUE3QixDQUFIO0FBQ0MvRSx1QkFBZXRSLEVBQUV5RSxNQUFGLENBQVMsRUFBVCxFQUFhNk0sWUFBYixFQUEyQkEsYUFBYXVFLEdBQXhDLENBQWY7QUNxQ0c7O0FEbkNKLFVBQUd4RSxlQUFjLEtBQUtBLFVBQXRCO0FBQ0NBLHFCQUFhLENBQUVBLFVBQUYsQ0FBYjtBQ3FDRzs7QURuQ0osVUFBRyxDQUFDQSxXQUFXblIsTUFBZjtBQUNDK0MsZ0JBQVFzUCxHQUFSLENBQVksOEJBQVo7QUFDQTtBQ3FDRzs7QURwQ0osVUFBR3pCLEtBQUt3QixLQUFSO0FBQ0NyUCxnQkFBUXNQLEdBQVIsQ0FBWSxTQUFaLEVBQXVCbEIsVUFBdkIsRUFBbUNDLFlBQW5DO0FDc0NHOztBRHBDSk8scUJBQWVSLFdBQVd4TSxNQUFYLENBQWtCLFVBQUM0RSxJQUFEO0FDc0M1QixlRHJDQUEsS0FBS3hILE9BQUwsQ0FBYSxTQUFiLElBQTBCLENBQUMsQ0FBM0IsSUFBZ0N3SCxLQUFLeEgsT0FBTCxDQUFhLFFBQWIsSUFBeUIsQ0FBQyxDQUExRCxJQUErRHdILEtBQUt4SCxPQUFMLENBQWEsU0FBYixJQUEwQixDQUFDLENBQTFGLElBQStGd0gsS0FBS3hILE9BQUwsQ0FBYSxLQUFiLElBQXNCLENBQUMsQ0NxQ3RIO0FEdENVLFFBQWY7O0FBR0EsVUFBRzZPLEtBQUt3QixLQUFSO0FBQ0NyUCxnQkFBUXNQLEdBQVIsQ0FBWSxrQkFBWixFQUFnQ1YsYUFBYTdPLFFBQWIsRUFBaEM7QUNzQ0c7O0FEcENKK1Qsa0JBQVkxRixXQUFXeE0sTUFBWCxDQUFrQixVQUFDNEUsSUFBRDtBQ3NDekIsZURyQ0FBLEtBQUt4SCxPQUFMLENBQWEsU0FBYixJQUEwQixDQUExQixJQUFnQ3dILEtBQUt4SCxPQUFMLENBQWEsUUFBYixJQUF5QixDQUF6RCxJQUErRHdILEtBQUt4SCxPQUFMLENBQWEsU0FBYixJQUEwQixDQUF6RixJQUErRndILEtBQUt4SCxPQUFMLENBQWEsS0FBYixJQUFzQixDQ3FDckg7QUR0Q08sUUFBWjs7QUFHQSxVQUFHNk8sS0FBS3dCLEtBQVI7QUFDQ3JQLGdCQUFRc1AsR0FBUixDQUFZLGVBQVosRUFBOEJ3RSxVQUFVL1QsUUFBVixFQUE5QjtBQ3NDRzs7QURwQ0o4TixXQUFLcUYsVUFBTCxDQUFnQnRFLFlBQWhCLEVBQThCUCxZQUE5QjtBQ3NDRyxhRHBDSFIsS0FBS29GLFdBQUwsQ0FBaUJhLFNBQWpCLEVBQTRCekYsWUFBNUIsQ0NvQ0c7QURqRVcsS0FBZjs7QUErQkFSLFNBQUtrRyxXQUFMLEdBQW1CbEcsS0FBS21HLE9BQXhCO0FDcUNFLFdEcENGbkcsS0FBS21HLE9BQUwsR0FBZSxVQUFDdkUsU0FBRCxFQUFZcEIsWUFBWjtBQUNkLFVBQUFXLElBQUE7O0FBQUEsVUFBR1gsYUFBYUosS0FBYixJQUF1QkksYUFBYUwsSUFBdkM7QUFDQ2dCLGVBQU9qUyxFQUFFMEwsS0FBRixDQUFRNEYsWUFBUixDQUFQO0FBQ0FXLGFBQUtoQixJQUFMLEdBQVlnQixLQUFLZixLQUFMLEdBQWEsR0FBYixHQUFtQmUsS0FBS2hCLElBQXBDO0FBQ0FnQixhQUFLZixLQUFMLEdBQWEsRUFBYjtBQ3NDSSxlRHJDSkosS0FBS2tHLFdBQUwsQ0FBaUJ0RSxTQUFqQixFQUE0QlQsSUFBNUIsQ0NxQ0k7QUR6Q0w7QUMyQ0ssZURyQ0puQixLQUFLa0csV0FBTCxDQUFpQnRFLFNBQWpCLEVBQTRCcEIsWUFBNUIsQ0NxQ0k7QUFDRDtBRDdDVSxLQ29DYjtBQVdEO0FEL0pILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdCdhbGl5dW4tc2RrJzogJz49MS45LjInLFxuXHRidXNib3k6IFwiPj0wLjIuMTNcIixcblx0Y29va2llczogXCI+PTAuNi4yXCIsXG5cdCdjc3YnOiBcIj49NS4xLjJcIixcblx0J3VybCc6ICc+PTAuMTAuMCcsXG5cdCdyZXF1ZXN0JzogJz49Mi44MS4wJyxcblx0J3hpbmdlJzogJz49MS4xLjMnLFxuXHQneGlhb21pLXB1c2gnOiAnPj0wLjQuNSdcbn0sICdzdGVlZG9zOmFwaScpOyIsIkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuSnNvblJvdXRlcy5wYXJzZUZpbGVzID0gKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRmaWxlcyA9IFtdOyAjIFN0b3JlIGZpbGVzIGluIGFuIGFycmF5IGFuZCB0aGVuIHBhc3MgdGhlbSB0byByZXF1ZXN0LlxuXG5cdGlmIChyZXEubWV0aG9kID09IFwiUE9TVFwiKVxuXHRcdGJ1c2JveSA9IG5ldyBCdXNib3koeyBoZWFkZXJzOiByZXEuaGVhZGVycyB9KTtcblx0XHRidXNib3kub24gXCJmaWxlXCIsICAoZmllbGRuYW1lLCBmaWxlLCBmaWxlbmFtZSwgZW5jb2RpbmcsIG1pbWV0eXBlKSAtPlxuXHRcdFx0aW1hZ2UgPSB7fTsgIyBjcmF0ZSBhbiBpbWFnZSBvYmplY3Rcblx0XHRcdGltYWdlLm1pbWVUeXBlID0gbWltZXR5cGU7XG5cdFx0XHRpbWFnZS5lbmNvZGluZyA9IGVuY29kaW5nO1xuXHRcdFx0aW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcblxuXHRcdFx0IyBidWZmZXIgdGhlIHJlYWQgY2h1bmtzXG5cdFx0XHRidWZmZXJzID0gW107XG5cblx0XHRcdGZpbGUub24gJ2RhdGEnLCAoZGF0YSkgLT5cblx0XHRcdFx0YnVmZmVycy5wdXNoKGRhdGEpO1xuXG5cdFx0XHRmaWxlLm9uICdlbmQnLCAoKSAtPlxuXHRcdFx0XHQjIGNvbmNhdCB0aGUgY2h1bmtzXG5cdFx0XHRcdGltYWdlLmRhdGEgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuXHRcdFx0XHQjIHB1c2ggdGhlIGltYWdlIG9iamVjdCB0byB0aGUgZmlsZSBhcnJheVxuXHRcdFx0XHRmaWxlcy5wdXNoKGltYWdlKTtcblxuXG5cdFx0YnVzYm95Lm9uIFwiZmllbGRcIiwgKGZpZWxkbmFtZSwgdmFsdWUpIC0+XG5cdFx0XHRyZXEuYm9keVtmaWVsZG5hbWVdID0gdmFsdWU7XG5cblx0XHRidXNib3kub24gXCJmaW5pc2hcIiwgICgpIC0+XG5cdFx0XHQjIFBhc3MgdGhlIGZpbGUgYXJyYXkgdG9nZXRoZXIgd2l0aCB0aGUgcmVxdWVzdFxuXHRcdFx0cmVxLmZpbGVzID0gZmlsZXM7XG5cblx0XHRcdEZpYmVyICgpLT5cblx0XHRcdFx0bmV4dCgpO1xuXHRcdFx0LnJ1bigpO1xuXG5cdFx0IyBQYXNzIHJlcXVlc3QgdG8gYnVzYm95XG5cdFx0cmVxLnBpcGUoYnVzYm95KTtcblxuXHRlbHNlXG5cdFx0bmV4dCgpO1xuXG5cbiNKc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKEpzb25Sb3V0ZXMucGFyc2VGaWxlcyk7IiwidmFyIEJ1c2JveSwgRmliZXI7XG5cbkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLnBhcnNlRmlsZXMgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYnVzYm95LCBmaWxlcztcbiAgZmlsZXMgPSBbXTtcbiAgaWYgKHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgYnVzYm95ID0gbmV3IEJ1c2JveSh7XG4gICAgICBoZWFkZXJzOiByZXEuaGVhZGVyc1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpbGVcIiwgZnVuY3Rpb24oZmllbGRuYW1lLCBmaWxlLCBmaWxlbmFtZSwgZW5jb2RpbmcsIG1pbWV0eXBlKSB7XG4gICAgICB2YXIgYnVmZmVycywgaW1hZ2U7XG4gICAgICBpbWFnZSA9IHt9O1xuICAgICAgaW1hZ2UubWltZVR5cGUgPSBtaW1ldHlwZTtcbiAgICAgIGltYWdlLmVuY29kaW5nID0gZW5jb2Rpbmc7XG4gICAgICBpbWFnZS5maWxlbmFtZSA9IGZpbGVuYW1lO1xuICAgICAgYnVmZmVycyA9IFtdO1xuICAgICAgZmlsZS5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcnMucHVzaChkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZpbGUub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpbWFnZS5kYXRhID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKTtcbiAgICAgICAgcmV0dXJuIGZpbGVzLnB1c2goaW1hZ2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmllbGRcIiwgZnVuY3Rpb24oZmllbGRuYW1lLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlcS5ib2R5W2ZpZWxkbmFtZV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaW5pc2hcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXEuZmlsZXMgPSBmaWxlcztcbiAgICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgIH0pLnJ1bigpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXEucGlwZShidXNib3kpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXh0KCk7XG4gIH1cbn07XG4iLCJAQXV0aCBvcj0ge31cblxuIyMjXG4gIEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiMjI1xudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlICh1c2VyKSAtPlxuICBjaGVjayB1c2VyLFxuICAgIGlkOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG4gICAgZW1haWw6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuXG4gIGlmIF8ua2V5cyh1c2VyKS5sZW5ndGggaXMgbm90IDFcbiAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IgJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnXG5cbiAgcmV0dXJuIHRydWVcblxuXG4jIyNcbiAgUmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuIyMjXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9ICh1c2VyKSAtPlxuICBpZiB1c2VyLmlkXG4gICAgcmV0dXJuIHsnX2lkJzogdXNlci5pZH1cbiAgZWxzZSBpZiB1c2VyLnVzZXJuYW1lXG4gICAgcmV0dXJuIHsndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lfVxuICBlbHNlIGlmIHVzZXIuZW1haWxcbiAgICByZXR1cm4geydlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWx9XG5cbiAgIyBXZSBzaG91bGRuJ3QgYmUgaGVyZSBpZiB0aGUgdXNlciBvYmplY3Qgd2FzIHByb3Blcmx5IHZhbGlkYXRlZFxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInXG5cblxuIyMjXG4gIExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuIyMjXG5AQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9ICh1c2VyLCBwYXNzd29yZCkgLT5cbiAgaWYgbm90IHVzZXIgb3Igbm90IHBhc3N3b3JkXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cbiAgIyBWYWxpZGF0ZSB0aGUgbG9naW4gaW5wdXQgdHlwZXNcbiAgY2hlY2sgdXNlciwgdXNlclZhbGlkYXRvclxuICBjaGVjayBwYXNzd29yZCwgU3RyaW5nXG5cbiAgIyBSZXRyaWV2ZSB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpXG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKVxuXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXJcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcbiAgaWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcz8ucGFzc3dvcmRcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuICAjIEF1dGhlbnRpY2F0ZSB0aGUgdXNlcidzIHBhc3N3b3JkXG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZFxuICBpZiBwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG4gICMgQWRkIGEgbmV3IGF1dGggdG9rZW4gdG8gdGhlIHVzZXIncyBhY2NvdW50XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4gYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW5cblxuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWR9KS5mZXRjaCgpXG4gIHNwYWNlcyA9IFtdXG4gIF8uZWFjaCBzcGFjZV91c2VycywgKHN1KS0+XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSlcbiAgICAjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcbiAgICBpZiBzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzdS5zcGFjZSkgYW5kIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpPj0wXG4gICAgICBzcGFjZXMucHVzaFxuICAgICAgICBfaWQ6IHNwYWNlLl9pZFxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXG4gIHJldHVybiB7YXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgYWRtaW5TcGFjZXM6IHNwYWNlc31cbiIsInZhciBnZXRVc2VyUXVlcnlTZWxlY3RvciwgdXNlclZhbGlkYXRvcjtcblxudGhpcy5BdXRoIHx8ICh0aGlzLkF1dGggPSB7fSk7XG5cblxuLypcbiAgQSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuICovXG5cbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbih1c2VyKSB7XG4gIGNoZWNrKHVzZXIsIHtcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKVxuICB9KTtcbiAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggPT09ICExKSB7XG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKCdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuXG4vKlxuICBSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4gKi9cblxuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSBmdW5jdGlvbih1c2VyKSB7XG4gIGlmICh1c2VyLmlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdfaWQnOiB1c2VyLmlkXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWVcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIuZW1haWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJyk7XG59O1xuXG5cbi8qXG4gIExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuICovXG5cbnRoaXMuQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3N3b3JkKSB7XG4gIHZhciBhdXRoVG9rZW4sIGF1dGhlbnRpY2F0aW5nVXNlciwgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IsIGhhc2hlZFRva2VuLCBwYXNzd29yZFZlcmlmaWNhdGlvbiwgcmVmLCBzcGFjZV91c2Vycywgc3BhY2VzO1xuICBpZiAoIXVzZXIgfHwgIXBhc3N3b3JkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBjaGVjayh1c2VyLCB1c2VyVmFsaWRhdG9yKTtcbiAgY2hlY2socGFzc3dvcmQsIFN0cmluZyk7XG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcik7XG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKTtcbiAgaWYgKCFhdXRoZW50aWNhdGluZ1VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGlmICghKChyZWYgPSBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXMpICE9IG51bGwgPyByZWYucGFzc3dvcmQgOiB2b2lkIDApKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmQpO1xuICBpZiAocGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4oYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW4pO1xuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWRcbiAgfSkuZmV0Y2goKTtcbiAgc3BhY2VzID0gW107XG4gIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24oc3UpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSk7XG4gICAgaWYgKHNwYWNlICYmIFN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHN1LnNwYWNlKSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBzdS51c2VyKSA+PSAwKSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2goe1xuICAgICAgICBfaWQ6IHNwYWNlLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2UubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBhdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbixcbiAgICB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsXG4gICAgYWRtaW5TcGFjZXM6IHNwYWNlc1xuICB9O1xufTtcbiIsIi8vIFdlIG5lZWQgYSBmdW5jdGlvbiB0aGF0IHRyZWF0cyB0aHJvd24gZXJyb3JzIGV4YWN0bHkgbGlrZSBJcm9uIFJvdXRlciB3b3VsZC5cbi8vIFRoaXMgZmlsZSBpcyB3cml0dGVuIGluIEphdmFTY3JpcHQgdG8gZW5hYmxlIGNvcHktcGFzdGluZyBJcm9uIFJvdXRlciBjb2RlLlxuXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0wzXG52YXIgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMNDdcbmlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlID0gZnVuY3Rpb24gKGVyciwgcmVxLCByZXMpIHtcbiAgaWYgKHJlcy5zdGF0dXNDb2RlIDwgNDAwKVxuICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuXG4gIGlmIChlcnIuc3RhdHVzKVxuICAgIHJlcy5zdGF0dXNDb2RlID0gZXJyLnN0YXR1cztcblxuICBpZiAoZW52ID09PSAnZGV2ZWxvcG1lbnQnKVxuICAgIG1zZyA9IChlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpICsgJ1xcbic7XG4gIGVsc2VcbiAgICAvL1hYWCBnZXQgdGhpcyBmcm9tIHN0YW5kYXJkIGRpY3Qgb2YgZXJyb3IgbWVzc2FnZXM/XG4gICAgbXNnID0gJ1NlcnZlciBlcnJvci4nO1xuXG4gIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKTtcblxuICBpZiAocmVzLmhlYWRlcnNTZW50KVxuICAgIHJldHVybiByZXEuc29ja2V0LmRlc3Ryb3koKTtcblxuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgQnVmZmVyLmJ5dGVMZW5ndGgobXNnKSk7XG4gIGlmIChyZXEubWV0aG9kID09PSAnSEVBRCcpXG4gICAgcmV0dXJuIHJlcy5lbmQoKTtcbiAgcmVzLmVuZChtc2cpO1xuICByZXR1cm47XG59XG4iLCJjbGFzcyBzaGFyZS5Sb3V0ZVxuXG4gIGNvbnN0cnVjdG9yOiAoQGFwaSwgQHBhdGgsIEBvcHRpb25zLCBAZW5kcG9pbnRzKSAtPlxuICAgICMgQ2hlY2sgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkXG4gICAgaWYgbm90IEBlbmRwb2ludHNcbiAgICAgIEBlbmRwb2ludHMgPSBAb3B0aW9uc1xuICAgICAgQG9wdGlvbnMgPSB7fVxuXG5cbiAgYWRkVG9BcGk6IGRvIC0+XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ11cblxuICAgIHJldHVybiAtPlxuICAgICAgc2VsZiA9IHRoaXNcblxuICAgICAgIyBUaHJvdyBhbiBlcnJvciBpZiBhIHJvdXRlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgYXQgdGhpcyBwYXRoXG4gICAgICAjIFRPRE86IENoZWNrIGZvciBjb2xsaXNpb25zIHdpdGggcGF0aHMgdGhhdCBmb2xsb3cgc2FtZSBwYXR0ZXJuIHdpdGggZGlmZmVyZW50IHBhcmFtZXRlciBuYW1lc1xuICAgICAgaWYgXy5jb250YWlucyBAYXBpLl9jb25maWcucGF0aHMsIEBwYXRoXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiAje0BwYXRofVwiXG5cbiAgICAgICMgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgT1BUSU9OUyBlbmRwb2ludCB3aXRoIG91ciBvd25cbiAgICAgIEBlbmRwb2ludHMgPSBfLmV4dGVuZCBvcHRpb25zOiBAYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCwgQGVuZHBvaW50c1xuXG4gICAgICAjIENvbmZpZ3VyZSBlYWNoIGVuZHBvaW50IG9uIHRoaXMgcm91dGVcbiAgICAgIEBfcmVzb2x2ZUVuZHBvaW50cygpXG4gICAgICBAX2NvbmZpZ3VyZUVuZHBvaW50cygpXG5cbiAgICAgICMgQWRkIHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHBhdGhzXG4gICAgICBAYXBpLl9jb25maWcucGF0aHMucHVzaCBAcGF0aFxuXG4gICAgICBhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyIGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cbiAgICAgICAgXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXG5cbiAgICAgICMgU2V0dXAgZW5kcG9pbnRzIG9uIHJvdXRlXG4gICAgICBmdWxsUGF0aCA9IEBhcGkuX2NvbmZpZy5hcGlQYXRoICsgQHBhdGhcbiAgICAgIF8uZWFjaCBhbGxvd2VkTWV0aG9kcywgKG1ldGhvZCkgLT5cbiAgICAgICAgZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdXG4gICAgICAgIEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cbiAgICAgICAgICAjIEFkZCBmdW5jdGlvbiB0byBlbmRwb2ludCBjb250ZXh0IGZvciBpbmRpY2F0aW5nIGEgcmVzcG9uc2UgaGFzIGJlZW4gaW5pdGlhdGVkIG1hbnVhbGx5XG4gICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZVxuICAgICAgICAgIGRvbmVGdW5jID0gLT5cbiAgICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZVxuXG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID1cbiAgICAgICAgICAgIHVybFBhcmFtczogcmVxLnBhcmFtc1xuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeVxuICAgICAgICAgICAgYm9keVBhcmFtczogcmVxLmJvZHlcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlc1xuICAgICAgICAgICAgZG9uZTogZG9uZUZ1bmNcbiAgICAgICAgICAjIEFkZCBlbmRwb2ludCBjb25maWcgb3B0aW9ucyB0byBjb250ZXh0XG4gICAgICAgICAgXy5leHRlbmQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuXG4gICAgICAgICAgIyBSdW4gdGhlIHJlcXVlc3RlZCBlbmRwb2ludFxuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IG51bGxcbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG4gICAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgICMgRG8gZXhhY3RseSB3aGF0IElyb24gUm91dGVyIHdvdWxkIGhhdmUgZG9uZSwgdG8gYXZvaWQgY2hhbmdpbmcgdGhlIEFQSVxuICAgICAgICAgICAgaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgaWYgcmVzcG9uc2VJbml0aWF0ZWRcbiAgICAgICAgICAgICMgRW5zdXJlIHRoZSByZXNwb25zZSBpcyBwcm9wZXJseSBjb21wbGV0ZWRcbiAgICAgICAgICAgIHJlcy5lbmQoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgcmVzLmhlYWRlcnNTZW50XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcbiAgICAgICAgICAgIGVsc2UgaWYgcmVzcG9uc2VEYXRhIGlzIG51bGwgb3IgcmVzcG9uc2VEYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXG5cbiAgICAgICAgICAjIEdlbmVyYXRlIGFuZCByZXR1cm4gdGhlIGh0dHAgcmVzcG9uc2UsIGhhbmRsaW5nIHRoZSBkaWZmZXJlbnQgZW5kcG9pbnQgcmVzcG9uc2UgdHlwZXNcbiAgICAgICAgICBpZiByZXNwb25zZURhdGEuYm9keSBhbmQgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIG9yIHJlc3BvbnNlRGF0YS5oZWFkZXJzKVxuICAgICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnNcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhXG5cbiAgICAgIF8uZWFjaCByZWplY3RlZE1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cbiAgICAgICAgICByZXNwb25zZURhdGEgPSBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXG4gICAgICAgICAgaGVhZGVycyA9ICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxuICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVyc1xuXG5cbiAgIyMjXG4gICAgQ29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gICAgZnVuY3Rpb25cblxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAjIyNcbiAgX3Jlc29sdmVFbmRwb2ludHM6IC0+XG4gICAgXy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIC0+XG4gICAgICBpZiBfLmlzRnVuY3Rpb24oZW5kcG9pbnQpXG4gICAgICAgIGVuZHBvaW50c1ttZXRob2RdID0ge2FjdGlvbjogZW5kcG9pbnR9XG4gICAgcmV0dXJuXG5cblxuICAjIyNcbiAgICBDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gICAgYmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG5cbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gICAgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cbiAgICBBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcbiAgICBhY2Nlc3NlZCBhdCA8Y29kZT5lbmRwb2ludC5hdXRoUmVxdWlyZWQ8L2NvZGU+IGFuZCA8Y29kZT5lbmRwb2ludC5yb2xlUmVxdWlyZWQ8L2NvZGU+LFxuICAgIHJlc3BlY3RpdmVseS5cblxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgIEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgIyMjXG4gIF9jb25maWd1cmVFbmRwb2ludHM6IC0+XG4gICAgXy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kKSAtPlxuICAgICAgaWYgbWV0aG9kIGlzbnQgJ29wdGlvbnMnXG4gICAgICAgICMgQ29uZmlndXJlIGFjY2VwdGFibGUgcm9sZXNcbiAgICAgICAgaWYgbm90IEBvcHRpb25zPy5yb2xlUmVxdWlyZWRcbiAgICAgICAgICBAb3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXVxuICAgICAgICBpZiBub3QgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW11cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbiBlbmRwb2ludC5yb2xlUmVxdWlyZWQsIEBvcHRpb25zLnJvbGVSZXF1aXJlZFxuICAgICAgICAjIE1ha2UgaXQgZWFzaWVyIHRvIGNoZWNrIGlmIG5vIHJvbGVzIGFyZSByZXF1aXJlZFxuICAgICAgICBpZiBfLmlzRW1wdHkgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2VcblxuICAgICAgICAjIENvbmZpZ3VyZSBhdXRoIHJlcXVpcmVtZW50XG4gICAgICAgIGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZCBpcyB1bmRlZmluZWRcbiAgICAgICAgICBpZiBAb3B0aW9ucz8uYXV0aFJlcXVpcmVkIG9yIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlXG5cbiAgICAgICAgaWYgQG9wdGlvbnM/LnNwYWNlUmVxdWlyZWRcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gQG9wdGlvbnMuc3BhY2VSZXF1aXJlZFxuICAgICAgICByZXR1cm5cbiAgICAsIHRoaXNcbiAgICByZXR1cm5cblxuXG4gICMjI1xuICAgIEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcblxuICAgIEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xuICAjIyNcbiAgX2NhbGxFbmRwb2ludDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG4gICAgIyBDYWxsIHRoZSBlbmRwb2ludCBpZiBhdXRoZW50aWNhdGlvbiBkb2Vzbid0IGZhaWxcbiAgICBpZiBAX2F1dGhBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG4gICAgICBpZiBAX3JvbGVBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG4gICAgICAgIGlmIEBfc3BhY2VBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG4gICAgICAgICAgI2VuZHBvaW50LmFjdGlvbi5jYWxsIGVuZHBvaW50Q29udGV4dFxuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cbiAgICAgICAgICAgIGlzU2ltdWxhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcbiAgICAgICAgICAgIGNvbm5lY3Rpb246IG51bGwsXG4gICAgICAgICAgICByYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxuICAgICAgIFxuICAgICAgICAgIHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZSBpbnZvY2F0aW9uLCAtPlxuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzdGF0dXNDb2RlOiA0MDNcbiAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ31cbiAgICAgIGVsc2VcbiAgICAgICAgc3RhdHVzQ29kZTogNDAzXG4gICAgICAgIGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLid9XG4gICAgZWxzZVxuICAgICAgc3RhdHVzQ29kZTogNDAxXG4gICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ31cblxuXG4gICMjI1xuICAgIEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcblxuICAgIE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcbiAgICBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcbiAgICBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cblxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcbiAgIyMjXG4gIF9hdXRoQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgIGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZFxuICAgICAgQF9hdXRoZW50aWNhdGUgZW5kcG9pbnRDb250ZXh0XG4gICAgZWxzZSB0cnVlXG5cblxuICAjIyNcbiAgICBWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxuXG4gICAgSWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICMjI1xuICBfYXV0aGVudGljYXRlOiAoZW5kcG9pbnRDb250ZXh0KSAtPlxuICAgICMgR2V0IGF1dGggaW5mb1xuICAgIGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxuXG4gICAgIyBHZXQgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICBpZiBhdXRoPy51c2VySWQgYW5kIGF1dGg/LnRva2VuIGFuZCBub3QgYXV0aD8udXNlclxuICAgICAgdXNlclNlbGVjdG9yID0ge31cbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZFxuICAgICAgdXNlclNlbGVjdG9yW0BhcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW5cbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lIHVzZXJTZWxlY3RvclxuXG4gICAgIyBBdHRhY2ggdGhlIHVzZXIgYW5kIHRoZWlyIElEIHRvIHRoZSBjb250ZXh0IGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgIGlmIGF1dGg/LnVzZXJcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyXG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZFxuICAgICAgdHJ1ZVxuICAgIGVsc2UgZmFsc2VcblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAjIyNcbiAgX3NwYWNlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgIGlmIGVuZHBvaW50LnNwYWNlUmVxdWlyZWRcbiAgICAgIGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxuICAgICAgaWYgYXV0aD8uc3BhY2VJZFxuICAgICAgICBzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGgudXNlcklkLCBzcGFjZTphdXRoLnNwYWNlSWR9KS5jb3VudCgpXG4gICAgICAgIGlmIHNwYWNlX3VzZXJzX2NvdW50XG4gICAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpXG4gICAgICAgICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXG4gICAgICAgICAgaWYgc3BhY2UgJiYgU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3BhY2UuX2lkKSBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpPj0wXG4gICAgICAgICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZFxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIlxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAjIyNcbiAgX3JvbGVBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG4gICAgaWYgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG4gICAgICBpZiBfLmlzRW1wdHkgXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcylcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgdHJ1ZVxuXG5cbiAgIyMjXG4gICAgUmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcbiAgIyMjXG4gIF9yZXNwb25kOiAocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGU9MjAwLCBoZWFkZXJzPXt9KSAtPlxuICAgICMgT3ZlcnJpZGUgYW55IGRlZmF1bHQgaGVhZGVycyB0aGF0IGhhdmUgYmVlbiBwcm92aWRlZCAoa2V5cyBhcmUgbm9ybWFsaXplZCB0byBiZSBjYXNlIGluc2Vuc2l0aXZlKVxuICAgICMgVE9ETzogQ29uc2lkZXIgb25seSBsb3dlcmNhc2luZyB0aGUgaGVhZGVyIGtleXMgd2UgbmVlZCBub3JtYWxpemVkLCBsaWtlIENvbnRlbnQtVHlwZVxuICAgIGRlZmF1bHRIZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIEBhcGkuX2NvbmZpZy5kZWZhdWx0SGVhZGVyc1xuICAgIGhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgaGVhZGVyc1xuICAgIGhlYWRlcnMgPSBfLmV4dGVuZCBkZWZhdWx0SGVhZGVycywgaGVhZGVyc1xuXG4gICAgIyBQcmVwYXJlIEpTT04gYm9keSBmb3IgcmVzcG9uc2Ugd2hlbiBDb250ZW50LVR5cGUgaW5kaWNhdGVzIEpTT04gdHlwZVxuICAgIGlmIGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSBpc250IG51bGxcbiAgICAgIGlmIEBhcGkuX2NvbmZpZy5wcmV0dHlKc29uXG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5LCB1bmRlZmluZWQsIDJcbiAgICAgIGVsc2VcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHlcblxuICAgICMgU2VuZCByZXNwb25zZVxuICAgIHNlbmRSZXNwb25zZSA9IC0+XG4gICAgICByZXNwb25zZS53cml0ZUhlYWQgc3RhdHVzQ29kZSwgaGVhZGVyc1xuICAgICAgcmVzcG9uc2Uud3JpdGUgYm9keVxuICAgICAgcmVzcG9uc2UuZW5kKClcbiAgICBpZiBzdGF0dXNDb2RlIGluIFs0MDEsIDQwM11cbiAgICAgICMgSGFja2VycyBjYW4gbWVhc3VyZSB0aGUgcmVzcG9uc2UgdGltZSB0byBkZXRlcm1pbmUgdGhpbmdzIGxpa2Ugd2hldGhlciB0aGUgNDAxIHJlc3BvbnNlIHdhcyBcbiAgICAgICMgY2F1c2VkIGJ5IGJhZCB1c2VyIGlkIHZzIGJhZCBwYXNzd29yZC5cbiAgICAgICMgSW4gZG9pbmcgc28sIHRoZXkgY2FuIGZpcnN0IHNjYW4gZm9yIHZhbGlkIHVzZXIgaWRzIHJlZ2FyZGxlc3Mgb2YgdmFsaWQgcGFzc3dvcmRzLlxuICAgICAgIyBEZWxheSBieSBhIHJhbmRvbSBhbW91bnQgdG8gcmVkdWNlIHRoZSBhYmlsaXR5IGZvciBhIGhhY2tlciB0byBkZXRlcm1pbmUgdGhlIHJlc3BvbnNlIHRpbWUuXG4gICAgICAjIFNlZSBodHRwczovL3d3dy5vd2FzcC5vcmcvaW5kZXgucGhwL0Jsb2NraW5nX0JydXRlX0ZvcmNlX0F0dGFja3MjRmluZGluZ19PdGhlcl9Db3VudGVybWVhc3VyZXNcbiAgICAgICMgU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RpbWluZ19hdHRhY2tcbiAgICAgIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzID0gNTAwXG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpXG4gICAgICBkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3b1xuICAgICAgTWV0ZW9yLnNldFRpbWVvdXQgc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzXG4gICAgZWxzZVxuICAgICAgc2VuZFJlc3BvbnNlKClcblxuICAjIyNcbiAgICBSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICMjI1xuICBfbG93ZXJDYXNlS2V5czogKG9iamVjdCkgLT5cbiAgICBfLmNoYWluIG9iamVjdFxuICAgIC5wYWlycygpXG4gICAgLm1hcCAoYXR0cikgLT5cbiAgICAgIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dXG4gICAgLm9iamVjdCgpXG4gICAgLnZhbHVlKClcbiIsInNoYXJlLlJvdXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSb3V0ZShhcGksIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50czEpIHtcbiAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5lbmRwb2ludHMgPSBlbmRwb2ludHMxO1xuICAgIGlmICghdGhpcy5lbmRwb2ludHMpIHtcbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gdGhpcy5vcHRpb25zO1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgfVxuICB9XG5cbiAgUm91dGUucHJvdG90eXBlLmFkZFRvQXBpID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdmFpbGFibGVNZXRob2RzO1xuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhbGxvd2VkTWV0aG9kcywgZnVsbFBhdGgsIHJlamVjdGVkTWV0aG9kcywgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKF8uY29udGFpbnModGhpcy5hcGkuX2NvbmZpZy5wYXRocywgdGhpcy5wYXRoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogXCIgKyB0aGlzLnBhdGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5lbmRwb2ludHMgPSBfLmV4dGVuZCh7XG4gICAgICAgIG9wdGlvbnM6IHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuICAgICAgfSwgdGhpcy5lbmRwb2ludHMpO1xuICAgICAgdGhpcy5fcmVzb2x2ZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5fY29uZmlndXJlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLmFwaS5fY29uZmlnLnBhdGhzLnB1c2godGhpcy5wYXRoKTtcbiAgICAgIGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0KGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICBmdWxsUGF0aCA9IHRoaXMuYXBpLl9jb25maWcuYXBpUGF0aCArIHRoaXMucGF0aDtcbiAgICAgIF8uZWFjaChhbGxvd2VkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBlbmRwb2ludDtcbiAgICAgICAgZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdO1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgZG9uZUZ1bmMsIGVuZHBvaW50Q29udGV4dCwgZXJyb3IsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VJbml0aWF0ZWQ7XG4gICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBkb25lRnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9IHtcbiAgICAgICAgICAgIHVybFBhcmFtczogcmVxLnBhcmFtcyxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnksXG4gICAgICAgICAgICBib2R5UGFyYW1zOiByZXEuYm9keSxcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcSxcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXMsXG4gICAgICAgICAgICBkb25lOiBkb25lRnVuY1xuICAgICAgICAgIH07XG4gICAgICAgICAgXy5leHRlbmQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gbnVsbDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50KGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICBpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VJbml0aWF0ZWQpIHtcbiAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlRGF0YSA9PT0gbnVsbCB8fCByZXNwb25zZURhdGEgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6IFwiICsgbWV0aG9kICsgXCIgXCIgKyBmdWxsUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZURhdGEuYm9keSAmJiAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgfHwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWplY3RlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gSnNvblJvdXRlcy5hZGQobWV0aG9kLCBmdWxsUGF0aCwgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgICB2YXIgaGVhZGVycywgcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXG4gICAgICAgICAgfTtcbiAgICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgJ0FsbG93JzogYWxsb3dlZE1ldGhvZHMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fcmVzcG9uZChyZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KSgpO1xuXG5cbiAgLypcbiAgICBDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcbiAgICBmdW5jdGlvblxuICBcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNvbHZlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oZW5kcG9pbnQpKSB7XG4gICAgICAgIHJldHVybiBlbmRwb2ludHNbbWV0aG9kXSA9IHtcbiAgICAgICAgICBhY3Rpb246IGVuZHBvaW50XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cblxuICAvKlxuICAgIENvbmZpZ3VyZSB0aGUgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnQgb24gYWxsIGVuZHBvaW50cyAoZXhjZXB0IE9QVElPTlMsIHdoaWNoIG11c3RcbiAgICBiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcbiAgXG4gICAgQXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cbiAgICBlbnRpcmUgcm91dGUsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZCBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbFxuICAgIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuICBcbiAgICBBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcbiAgICBhY2Nlc3NlZCBhdCA8Y29kZT5lbmRwb2ludC5hdXRoUmVxdWlyZWQ8L2NvZGU+IGFuZCA8Y29kZT5lbmRwb2ludC5yb2xlUmVxdWlyZWQ8L2NvZGU+LFxuICAgIHJlc3BlY3RpdmVseS5cbiAgXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gICAgQHBhcmFtIHtFbmRwb2ludH0gZW5kcG9pbnQgVGhlIGVuZHBvaW50IHRvIGNvbmZpZ3VyZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2NvbmZpZ3VyZUVuZHBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIF8uZWFjaCh0aGlzLmVuZHBvaW50cywgZnVuY3Rpb24oZW5kcG9pbnQsIG1ldGhvZCkge1xuICAgICAgdmFyIHJlZiwgcmVmMSwgcmVmMjtcbiAgICAgIGlmIChtZXRob2QgIT09ICdvcHRpb25zJykge1xuICAgICAgICBpZiAoISgocmVmID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmLnJvbGVSZXF1aXJlZCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBfLnVuaW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCk7XG4gICAgICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmRwb2ludC5hdXRoUmVxdWlyZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgIGlmICgoKHJlZjEgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYxLmF1dGhSZXF1aXJlZCA6IHZvaWQgMCkgfHwgZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChyZWYyID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMi5zcGFjZVJlcXVpcmVkIDogdm9pZCAwKSB7XG4gICAgICAgICAgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IHRoaXMub3B0aW9ucy5zcGFjZVJlcXVpcmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcbiAgXG4gICAgQHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY2FsbEVuZHBvaW50ID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBpbnZvY2F0aW9uO1xuICAgIGlmICh0aGlzLl9hdXRoQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgIGlmICh0aGlzLl9yb2xlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NwYWNlQWNjZXB0ZWQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkpIHtcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uKHtcbiAgICAgICAgICAgIGlzU2ltdWxhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcbiAgICAgICAgICAgIGNvbm5lY3Rpb246IG51bGwsXG4gICAgICAgICAgICByYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZShpbnZvY2F0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXNDb2RlOiA0MDEsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLidcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcbiAgXG4gICAgT25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxuICAgIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxuICAgIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuICBcbiAgICBAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aEFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5hdXRoUmVxdWlyZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGUoZW5kcG9pbnRDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxuICBcbiAgICBJZiB2ZXJpZmllZCwgYXR0YWNoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgdG8gdGhlIGNvbnRleHQuXG4gIFxuICAgIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCkge1xuICAgIHZhciBhdXRoLCB1c2VyU2VsZWN0b3I7XG4gICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICBpZiAoKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlcklkIDogdm9pZCAwKSAmJiAoYXV0aCAhPSBudWxsID8gYXV0aC50b2tlbiA6IHZvaWQgMCkgJiYgIShhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgICB1c2VyU2VsZWN0b3IgPSB7fTtcbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZDtcbiAgICAgIHVzZXJTZWxlY3Rvclt0aGlzLmFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlbjtcbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJTZWxlY3Rvcik7XG4gICAgfVxuICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXIgOiB2b2lkIDApIHtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyO1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fc3BhY2VBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgYXV0aCwgc3BhY2UsIHNwYWNlX3VzZXJzX2NvdW50O1xuICAgIGlmIChlbmRwb2ludC5zcGFjZVJlcXVpcmVkKSB7XG4gICAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGguc3BhY2VJZCA6IHZvaWQgMCkge1xuICAgICAgICBzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHVzZXI6IGF1dGgudXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBhdXRoLnNwYWNlSWRcbiAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXJzX2NvdW50KSB7XG4gICAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpO1xuICAgICAgICAgIGlmIChzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZS5faWQpICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKSA+PSAwKSB7XG4gICAgICAgICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcm9sZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgIGlmIChfLmlzRW1wdHkoXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcykpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICAgIFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzcG9uZCA9IGZ1bmN0aW9uKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzLCBkZWxheUluTWlsbGlzZWNvbmRzLCBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcywgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28sIHNlbmRSZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PSBudWxsKSB7XG4gICAgICBzdGF0dXNDb2RlID0gMjAwO1xuICAgIH1cbiAgICBpZiAoaGVhZGVycyA9PSBudWxsKSB7XG4gICAgICBoZWFkZXJzID0ge307XG4gICAgfVxuICAgIGRlZmF1bHRIZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyh0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyhoZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gXy5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuICAgIGlmIChoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFwaS5fY29uZmlnLnByZXR0eUpzb24pIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHksIHZvaWQgMCwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoYm9keSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZW5kKCk7XG4gICAgfTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxIHx8IHN0YXR1c0NvZGUgPT09IDQwMykge1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDA7XG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd287XG4gICAgICByZXR1cm4gTWV0ZW9yLnNldFRpbWVvdXQoc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgUmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2xvd2VyQ2FzZUtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gXy5jaGFpbihvYmplY3QpLnBhaXJzKCkubWFwKGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiBbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXTtcbiAgICB9KS5vYmplY3QoKS52YWx1ZSgpO1xuICB9O1xuXG4gIHJldHVybiBSb3V0ZTtcblxufSkoKTtcbiIsImNsYXNzIEBSZXN0aXZ1c1xuXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICBAX3JvdXRlcyA9IFtdXG4gICAgQF9jb25maWcgPVxuICAgICAgcGF0aHM6IFtdXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2VcbiAgICAgIGFwaVBhdGg6ICdhcGkvJ1xuICAgICAgdmVyc2lvbjogbnVsbFxuICAgICAgcHJldHR5SnNvbjogZmFsc2VcbiAgICAgIGF1dGg6XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJ1xuICAgICAgICB1c2VyOiAtPlxuICAgICAgICAgIGlmIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxuICAgICAgICAgIGlmIEByZXF1ZXN0LnVzZXJJZFxuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IEByZXF1ZXN0LnVzZXJJZH0pXG4gICAgICAgICAgICB1c2VyOiBfdXNlclxuICAgICAgICAgICAgdXNlcklkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXVxuICAgICAgICAgICAgc3BhY2VJZDogQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXG4gICAgICAgICAgICBzcGFjZUlkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ11cbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgZGVmYXVsdEhlYWRlcnM6XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcblxuICAgICMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXG4gICAgXy5leHRlbmQgQF9jb25maWcsIG9wdGlvbnNcblxuICAgIGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcbiAgICAgIGNvcnNIZWFkZXJzID1cbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0J1xuXG4gICAgICBpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJ1xuXG4gICAgICAjIFNldCBkZWZhdWx0IGhlYWRlciB0byBlbmFibGUgQ09SUyBpZiBjb25maWd1cmVkXG4gICAgICBfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcblxuICAgICAgaWYgbm90IEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcbiAgICAgICAgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XG4gICAgICAgICAgQHJlc3BvbnNlLndyaXRlSGVhZCAyMDAsIGNvcnNIZWFkZXJzXG4gICAgICAgICAgQGRvbmUoKVxuXG4gICAgIyBOb3JtYWxpemUgdGhlIEFQSSBwYXRoXG4gICAgaWYgQF9jb25maWcuYXBpUGF0aFswXSBpcyAnLydcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcbiAgICBpZiBfLmxhc3QoQF9jb25maWcuYXBpUGF0aCkgaXNudCAnLydcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoICsgJy8nXG5cbiAgICAjIFVSTCBwYXRoIHZlcnNpb25pbmcgaXMgdGhlIG9ubHkgdHlwZSBvZiBBUEkgdmVyc2lvbmluZyBjdXJyZW50bHkgYXZhaWxhYmxlLCBzbyBpZiBhIHZlcnNpb24gaXNcbiAgICAjIHByb3ZpZGVkLCBhcHBlbmQgaXQgdG8gdGhlIGJhc2UgcGF0aCBvZiB0aGUgQVBJXG4gICAgaWYgQF9jb25maWcudmVyc2lvblxuICAgICAgQF9jb25maWcuYXBpUGF0aCArPSBAX2NvbmZpZy52ZXJzaW9uICsgJy8nXG5cbiAgICAjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxuICAgIGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG4gICAgICBAX2luaXRBdXRoKClcbiAgICBlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcbiAgICAgIEBfaW5pdEF1dGgoKVxuICAgICAgY29uc29sZS53YXJuICdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgK1xuICAgICAgICAgICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcblxuICAgIHJldHVybiB0aGlzXG5cblxuICAjIyMqXG4gICAgQWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuXG4gICAgQHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgIEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gICAgQHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICAgICAgICBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG4gICAgICAgIGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgIyMjXG4gIGFkZFJvdXRlOiAocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSAtPlxuICAgICMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKVxuICAgIEBfcm91dGVzLnB1c2gocm91dGUpXG5cbiAgICByb3V0ZS5hZGRUb0FwaSgpXG5cbiAgICByZXR1cm4gdGhpc1xuXG5cbiAgIyMjKlxuICAgIEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgIyMjXG4gIGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxuICAgIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ11cbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddXG5cbiAgICAjIEdyYWIgdGhlIHNldCBvZiBlbmRwb2ludHNcbiAgICBpZiBjb2xsZWN0aW9uIGlzIE1ldGVvci51c2Vyc1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcbiAgICBlbHNlXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF9jb2xsZWN0aW9uRW5kcG9pbnRzXG5cbiAgICAjIEZsYXR0ZW4gdGhlIG9wdGlvbnMgYW5kIHNldCBkZWZhdWx0cyBpZiBuZWNlc3NhcnlcbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyBvciB7fVxuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIG9yIFtdXG4gICAgIyBVc2UgY29sbGVjdGlvbiBuYW1lIGFzIGRlZmF1bHQgcGF0aFxuICAgIHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxuXG4gICAgIyBTZXBhcmF0ZSB0aGUgcmVxdWVzdGVkIGVuZHBvaW50cyBieSB0aGUgcm91dGUgdGhleSBiZWxvbmcgdG8gKG9uZSBmb3Igb3BlcmF0aW5nIG9uIHRoZSBlbnRpcmVcbiAgICAjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge31cbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9XG4gICAgaWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcbiAgICAgICMgR2VuZXJhdGUgYWxsIGVuZHBvaW50cyBvbiB0aGlzIGNvbGxlY3Rpb25cbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICAjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcbiAgICAgICAgaWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cbiAgICAgICAgICBfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG4gICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG4gICAgICAgIHJldHVyblxuICAgICAgLCB0aGlzXG4gICAgZWxzZVxuICAgICAgIyBHZW5lcmF0ZSBhbnkgZW5kcG9pbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZXhjbHVkZWRcbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXG4gICAgICAgICAgIyBDb25maWd1cmUgZW5kcG9pbnQgYW5kIG1hcCB0byBpdCdzIGh0dHAgbWV0aG9kXG4gICAgICAgICAgIyBUT0RPOiBDb25zaWRlciBwcmVkZWZpbmluZyBhIG1hcCBvZiBtZXRob2RzIHRvIHRoZWlyIGh0dHAgbWV0aG9kIHR5cGUgKGUuZy4sIGdldEFsbDogZ2V0KVxuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge31cbiAgICAgICAgICBfLmVhY2ggY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIChhY3Rpb24sIG1ldGhvZFR5cGUpIC0+XG4gICAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxuICAgICAgICAgICAgICBfLmNoYWluIGFjdGlvblxuICAgICAgICAgICAgICAuY2xvbmUoKVxuICAgICAgICAgICAgICAuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xuICAgICAgICAgICAgICAudmFsdWUoKVxuICAgICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuICAgICAgICAgIGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXG4gICAgICAgICAgICBfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuICAgICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuICAgICAgICAgIHJldHVyblxuICAgICAgLCB0aGlzXG5cbiAgICAjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcbiAgICBAYWRkUm91dGUgcGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHNcbiAgICBAYWRkUm91dGUgXCIje3BhdGh9LzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzXG5cbiAgICByZXR1cm4gdGhpc1xuXG5cbiAgIyMjKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAjIyNcbiAgX2NvbGxlY3Rpb25FbmRwb2ludHM6XG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiAgICBwdXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcHV0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcbiAgICAgICAgICBpZiBlbnRpdHlJc1VwZGF0ZWRcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiAgICBkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZGVsZXRlOlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHBvc3Q6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBnZXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHt9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXG4gICAgICAgICAgaWYgZW50aXRpZXNcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cblxuXG4gICMjIypcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG4gICMjI1xuICBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHM6XG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcbiAgICAgICAgICBpZiBlbnRpdHlcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuICAgIHB1dDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBwdXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xuICAgICAgICAgIGlmIGVudGl0eUlzVXBkYXRlZFxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuICAgICAgICAgICAge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cbiAgICBkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZGVsZXRlOlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgaWYgY29sbGVjdGlvbi5yZW1vdmUgQHVybFBhcmFtcy5pZFxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHBvc3Q6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICAjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcbiAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIgQGJvZHlQYXJhbXNcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWQsIGZpZWxkczogcHJvZmlsZTogMVxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgIHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnfVxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBnZXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXG4gICAgICAgICAgaWYgZW50aXRpZXNcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnfVxuXG5cbiAgIyMjXG4gICAgQWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuICAjIyNcbiAgX2luaXRBdXRoOiAtPlxuICAgIHNlbGYgPSB0aGlzXG4gICAgIyMjXG4gICAgICBBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG5cbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgIyMjXG4gICAgQGFkZFJvdXRlICdsb2dpbicsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSxcbiAgICAgIHBvc3Q6IC0+XG4gICAgICAgICMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcbiAgICAgICAgdXNlciA9IHt9XG4gICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXJcbiAgICAgICAgICBpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxuICAgICAgICBlbHNlIGlmIEBib2R5UGFyYW1zLnVzZXJuYW1lXG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJuYW1lXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcbiAgICAgICAgICB1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMuZW1haWxcblxuICAgICAgICAjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcbiAgICAgICAgdHJ5XG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQgdXNlciwgQGJvZHlQYXJhbXMucGFzc3dvcmRcbiAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuICAgICAgICAgIHJldHVybiB7fSA9XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yXG4gICAgICAgICAgICBib2R5OiBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6IGUucmVhc29uXG5cbiAgICAgICAgIyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxuICAgICAgICAjIFRPRE86IENvbnNpZGVyIHJldHVybmluZyB0aGUgdXNlciBpbiBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKCksIGluc3RlYWQgb2YgZmV0Y2hpbmcgaXQgYWdhaW4gaGVyZVxuICAgICAgICBpZiBhdXRoLnVzZXJJZCBhbmQgYXV0aC5hdXRoVG9rZW5cbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGguYXV0aFRva2VuXG4gICAgICAgICAgQHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgICBzZWFyY2hRdWVyeVxuICAgICAgICAgIEB1c2VySWQgPSBAdXNlcj8uX2lkXG5cbiAgICAgICAgcmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGF1dGh9XG5cbiAgICAgICAgIyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuICAgICAgICBleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbj8uY2FsbCh0aGlzKVxuICAgICAgICBpZiBleHRyYURhdGE/XG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG4gICAgICAgIHJlc3BvbnNlXG5cbiAgICBsb2dvdXQgPSAtPlxuICAgICAgIyBSZW1vdmUgdGhlIGdpdmVuIGF1dGggdG9rZW4gZnJvbSB0aGUgdXNlcidzIGFjY291bnRcbiAgICAgIGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlblxuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgMCwgaW5kZXhcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgaW5kZXggKyAxXG4gICAgICB0b2tlblRvUmVtb3ZlID0ge31cbiAgICAgIHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW5cbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge31cbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlIEB1c2VyLl9pZCwgeyRwdWxsOiB0b2tlblJlbW92YWxRdWVyeX1cblxuICAgICAgcmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxuXG4gICAgICAjIENhbGwgdGhlIGxvZ291dCBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuICAgICAgZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXG4gICAgICBpZiBleHRyYURhdGE/XG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcblxuICAgICAgcmVzcG9uc2VcblxuICAgICMjI1xuICAgICAgQWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcblxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICMjI1xuICAgIEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXG4gICAgICBnZXQ6IC0+XG4gICAgICAgIGNvbnNvbGUud2FybiBcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCJcbiAgICAgICAgY29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXG4gICAgICAgIHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKVxuICAgICAgcG9zdDogbG9nb3V0XG5cblJlc3RpdnVzID0gQFJlc3RpdnVzXG4iLCJ2YXIgUmVzdGl2dXMsXG4gIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxudGhpcy5SZXN0aXZ1cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUmVzdGl2dXMob3B0aW9ucykge1xuICAgIHZhciBjb3JzSGVhZGVycztcbiAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcbiAgICB0aGlzLl9jb25maWcgPSB7XG4gICAgICBwYXRoczogW10sXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXG4gICAgICBhcGlQYXRoOiAnYXBpLycsXG4gICAgICB2ZXJzaW9uOiBudWxsLFxuICAgICAgcHJldHR5SnNvbjogZmFsc2UsXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJyxcbiAgICAgICAgdXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF91c2VyLCB0b2tlbjtcbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddKSB7XG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnVzZXJJZCkge1xuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXI6IF91c2VyLFxuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXG4gICAgfTtcbiAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcsIG9wdGlvbnMpO1xuICAgIGlmICh0aGlzLl9jb25maWcuZW5hYmxlQ29ycykge1xuICAgICAgY29yc0hlYWRlcnMgPSB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJztcbiAgICAgIH1cbiAgICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnMpO1xuICAgICAgaWYgKCF0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgY29yc0hlYWRlcnMpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hcGlQYXRoWzBdID09PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGguc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChfLmxhc3QodGhpcy5fY29uZmlnLmFwaVBhdGgpICE9PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGggKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmVyc2lvbikge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggKz0gdGhpcy5fY29uZmlnLnZlcnNpb24gKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jb25maWcudXNlQXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICsgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG4gIFxuICAgIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcbiAgICBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICBAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxuICAgIEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcbiAgICAgICAgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxuICAgICAgICBhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5hZGRSb3V0ZSA9IGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykge1xuICAgIHZhciByb3V0ZTtcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpO1xuICAgIHRoaXMuX3JvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByb3V0ZS5hZGRUb0FwaSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuYWRkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbkVuZHBvaW50cywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24sIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kcywgbWV0aG9kc09uQ29sbGVjdGlvbiwgcGF0aCwgcm91dGVPcHRpb25zO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXTtcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddO1xuICAgIGlmIChjb2xsZWN0aW9uID09PSBNZXRlb3IudXNlcnMpIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX2NvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIHx8IHt9O1xuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIHx8IHt9O1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyB8fCBbXTtcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIHx8IGNvbGxlY3Rpb24uX25hbWU7XG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgJiYgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKSkge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBjb25maWd1cmVkRW5kcG9pbnQsIGVuZHBvaW50T3B0aW9ucztcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kKSA8IDAgJiYgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF07XG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge307XG4gICAgICAgICAgXy5lYWNoKGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCBmdW5jdGlvbihhY3Rpb24sIG1ldGhvZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPSBfLmNoYWluKGFjdGlvbikuY2xvbmUoKS5leHRlbmQoZW5kcG9pbnRPcHRpb25zKS52YWx1ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIHRoaXMuYWRkUm91dGUocGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMpO1xuICAgIHRoaXMuYWRkUm91dGUocGF0aCArIFwiLzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX2NvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZCwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xuICAgICAgICAgICAgICAkc2V0OiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5O1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkO1xuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHRoaXMudXJsUGFyYW1zLmlkKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcztcbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl9pbml0QXV0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dvdXQsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAvKlxuICAgICAgQWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICB0aGlzLmFkZFJvdXRlKCdsb2dpbicsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBwb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF1dGgsIGUsIGV4dHJhRGF0YSwgcmVmLCByZWYxLCByZXNwb25zZSwgc2VhcmNoUXVlcnksIHVzZXI7XG4gICAgICAgIHVzZXIgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWUpIHtcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy5lbWFpbCkge1xuICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMuZW1haWw7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCh1c2VyLCB0aGlzLmJvZHlQYXJhbXMucGFzc3dvcmQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGUucmVhc29uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXV0aC51c2VySWQgJiYgYXV0aC5hdXRoVG9rZW4pIHtcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoLmF1dGhUb2tlbik7XG4gICAgICAgICAgdGhpcy51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgfSwgc2VhcmNoUXVlcnkpO1xuICAgICAgICAgIHRoaXMudXNlcklkID0gKHJlZiA9IHRoaXMudXNlcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgZGF0YTogYXV0aFxuICAgICAgICB9O1xuICAgICAgICBleHRyYURhdGEgPSAocmVmMSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluKSAhPSBudWxsID8gcmVmMS5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhUb2tlbiwgZXh0cmFEYXRhLCBoYXNoZWRUb2tlbiwgaW5kZXgsIHJlZiwgcmVzcG9uc2UsIHRva2VuRmllbGROYW1lLCB0b2tlbkxvY2F0aW9uLCB0b2tlblBhdGgsIHRva2VuUmVtb3ZhbFF1ZXJ5LCB0b2tlblRvUmVtb3ZlO1xuICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddO1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlbjtcbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9O1xuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlbjtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge307XG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZTtcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodGhpcy51c2VyLl9pZCwge1xuICAgICAgICAkcHVsbDogdG9rZW5SZW1vdmFsUXVlcnlcbiAgICAgIH0pO1xuICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBleHRyYURhdGEgPSAocmVmID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0KSAhPSBudWxsID8gcmVmLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLmFkZFJvdXRlKCdsb2dvdXQnLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWVcbiAgICB9LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiKTtcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHBvc3Q6IGxvZ291dFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBSZXN0aXZ1cztcblxufSkoKTtcblxuUmVzdGl2dXMgPSB0aGlzLlJlc3RpdnVzO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgQEFQSSA9IG5ldyBSZXN0aXZ1c1xuICAgICAgICBhcGlQYXRoOiAnc3RlZWRvcy9hcGkvJyxcbiAgICAgICAgdXNlRGVmYXVsdEF1dGg6IHRydWVcbiAgICAgICAgcHJldHR5SnNvbjogdHJ1ZVxuICAgICAgICBlbmFibGVDb3JzOiBmYWxzZVxuICAgICAgICBkZWZhdWx0SGVhZGVyczpcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICB0aGlzLkFQSSA9IG5ldyBSZXN0aXZ1cyh7XG4gICAgYXBpUGF0aDogJ3N0ZWVkb3MvYXBpLycsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiBmYWxzZSxcbiAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH1cbiAgfSk7XG59XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRBUEkuYWRkQ29sbGVjdGlvbiBkYi5zcGFjZV91c2VycywgXG5cdFx0ZXhjbHVkZWRFbmRwb2ludHM6IFtdXG5cdFx0cm91dGVPcHRpb25zOlxuXHRcdFx0YXV0aFJlcXVpcmVkOiB0cnVlXG5cdFx0XHRzcGFjZVJlcXVpcmVkOiB0cnVlIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBUEkuYWRkQ29sbGVjdGlvbihkYi5zcGFjZV91c2Vycywge1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXSxcbiAgICByb3V0ZU9wdGlvbnM6IHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNwYWNlUmVxdWlyZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRBUEkuYWRkQ29sbGVjdGlvbiBkYi5vcmdhbml6YXRpb25zLCBcblx0XHRleGNsdWRlZEVuZHBvaW50czogW11cblx0XHRyb3V0ZU9wdGlvbnM6XG5cdFx0XHRhdXRoUmVxdWlyZWQ6IHRydWVcblx0XHRcdHNwYWNlUmVxdWlyZWQ6IHRydWUiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFQSS5hZGRDb2xsZWN0aW9uKGRiLm9yZ2FuaXphdGlvbnMsIHtcbiAgICBleGNsdWRlZEVuZHBvaW50czogW10sXG4gICAgcm91dGVPcHRpb25zOiB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWUsXG4gICAgICBzcGFjZVJlcXVpcmVkOiB0cnVlXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXG4gIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuICAgIGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cbiAgICAgICAgaWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKClcblxuICAgICAgICBib2R5ID0gcmVxLmJvZHlcbiAgICAgICAgdHJ5XG4gICAgICAgICAgaWYgYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIklFXCIgb3IgYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIm5vZGVcIilcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKVxuICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSlcbiAgICAgICAgICBjb25zb2xlLmVycm9yIGVcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpXG5cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxuICAgICAgICBcbiAgICAgICAgaWYgYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ293bmVyX25hbWUnXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ2luc3RhbmNlJ10gICYmIGJvZHlbJ2FwcHJvdmUnXVxuICAgICAgICAgIHBhcmVudCA9ICcnXG4gICAgICAgICAgbWV0YWRhdGEgPSB7b3duZXI6Ym9keVsnb3duZXInXSwgb3duZXJfbmFtZTpib2R5Wydvd25lcl9uYW1lJ10sIHNwYWNlOmJvZHlbJ3NwYWNlJ10sIGluc3RhbmNlOmJvZHlbJ2luc3RhbmNlJ10sIGFwcHJvdmU6IGJvZHlbJ2FwcHJvdmUnXSwgY3VycmVudDogdHJ1ZX1cblxuICAgICAgICAgIGlmIGJvZHlbXCJpc19wcml2YXRlXCJdICYmIGJvZHlbXCJpc19wcml2YXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSB0cnVlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IGZhbHNlXG5cbiAgICAgICAgICBpZiBib2R5WydtYWluJ10gPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgIG1ldGFkYXRhLm1haW4gPSB0cnVlXG5cbiAgICAgICAgICBpZiBib2R5Wydpc0FkZFZlcnNpb24nXSAmJiBib2R5WydwYXJlbnQnXVxuICAgICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J11cbiAgICAgICAgICAjIGVsc2VcbiAgICAgICAgICAjICAgY29sbGVjdGlvbi5maW5kKHsnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLCAnbWV0YWRhdGEuY3VycmVudCcgOiB0cnVlfSkuZm9yRWFjaCAoYykgLT5cbiAgICAgICAgICAjICAgICBpZiBjLm5hbWUoKSA9PSBmaWxlbmFtZVxuICAgICAgICAgICMgICAgICAgcGFyZW50ID0gYy5tZXRhZGF0YS5wYXJlbnRcblxuICAgICAgICAgIGlmIHBhcmVudFxuICAgICAgICAgICAgciA9IGNvbGxlY3Rpb24udXBkYXRlKHsnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LCAnbWV0YWRhdGEuY3VycmVudCcgOiB0cnVlfSwgeyR1bnNldCA6IHsnbWV0YWRhdGEuY3VycmVudCcgOiAnJ319KVxuICAgICAgICAgICAgaWYgclxuICAgICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgICAgICAgaWYgYm9keVsnbG9ja2VkX2J5J10gJiYgYm9keVsnbG9ja2VkX2J5X25hbWUnXVxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieSA9IGJvZHlbJ2xvY2tlZF9ieSddXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5X25hbWUgPSBib2R5Wydsb2NrZWRfYnlfbmFtZSddXG5cbiAgICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXG4gICAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG5cbiAgICAgICAgICAgICAgIyDliKDpmaTlkIzkuIDkuKrnlLPor7fljZXlkIzkuIDkuKrmraXpqqTlkIzkuIDkuKrkurrkuIrkvKDnmoTph43lpI3nmoTmlofku7ZcbiAgICAgICAgICAgICAgaWYgYm9keVtcIm92ZXJ3cml0ZVwiXSAmJiBib2R5W1wib3ZlcndyaXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnJlbW92ZSh7J21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSwgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCwgJ21ldGFkYXRhLm93bmVyJzogYm9keVsnb3duZXInXSwgJ21ldGFkYXRhLmFwcHJvdmUnOiBib2R5WydhcHByb3ZlJ10sICdtZXRhZGF0YS5jdXJyZW50JzogeyRuZTogdHJ1ZX19KVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcbiAgICAgICAgICAgIGZpbGVPYmoudXBkYXRlKHskc2V0OiB7J21ldGFkYXRhLnBhcmVudCcgOiBmaWxlT2JqLl9pZH19KVxuXG4gICAgICAgICMg5YW85a656ICB54mI5pysXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuICAgICAgICByZXR1cm5cblxuICAgICAgbmV3RmlsZS5vbmNlICdzdG9yZWQnLCAoc3RvcmVOYW1lKS0+XG4gICAgICAgIHNpemUgPSBuZXdGaWxlLm9yaWdpbmFsLnNpemVcbiAgICAgICAgaWYgIXNpemVcbiAgICAgICAgICBzaXplID0gMTAyNFxuICAgICAgICByZXNwID1cbiAgICAgICAgICB2ZXJzaW9uX2lkOiBuZXdGaWxlLl9pZCxcbiAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgICByZXR1cm5cbiAgICBlbHNlXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVyblxuXG5cbkpzb25Sb3V0ZXMuYWRkIFwiZGVsZXRlXCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XG5cbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcblxuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuICBpZiBpZFxuICAgIGZpbGUgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IGlkIH0pXG4gICAgaWYgZmlsZVxuICAgICAgZmlsZS5yZW1vdmUoKVxuICAgICAgcmVzcCA9IHtcbiAgICAgICAgc3RhdHVzOiBcIk9LXCJcbiAgICAgIH1cbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgcmV0dXJuXG5cbiAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gIHJlcy5lbmQoKTtcblxuXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG5cbiAgcmVzLnN0YXR1c0NvZGUgPSAzMDI7XG4gIHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2luc3RhbmNlcy9cIikgKyBpZCArIFwiP2Rvd25sb2FkPTFcIlxuICByZXMuZW5kKCk7XG5cblxuIyBNZXRlb3IubWV0aG9kc1xuXG4jICAgczNfdXBncmFkZTogKG1pbiwgbWF4KSAtPlxuIyAgICAgY29uc29sZS5sb2coXCIvczMvdXBncmFkZVwiKVxuXG4jICAgICBmcyA9IHJlcXVpcmUoJ2ZzJylcbiMgICAgIG1pbWUgPSByZXF1aXJlKCdtaW1lJylcblxuIyAgICAgcm9vdF9wYXRoID0gXCIvbW50L2Zha2VzMy8xMFwiXG4jICAgICBjb25zb2xlLmxvZyhyb290X3BhdGgpXG4jICAgICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xuXG4jICAgICAjIOmBjeWOhmluc3RhbmNlIOaLvOWHuumZhOS7tui3r+W+hCDliLDmnKzlnLDmib7lr7nlupTmlofku7Yg5YiG5Lik56eN5oOF5Ya1IDEuL2ZpbGVuYW1lX3ZlcnNpb25JZCAyLi9maWxlbmFtZe+8m1xuIyAgICAgZGVhbF93aXRoX3ZlcnNpb24gPSAocm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCB2ZXJzaW9uLCBhdHRhY2hfZmlsZW5hbWUpIC0+XG4jICAgICAgIF9yZXYgPSB2ZXJzaW9uLl9yZXZcbiMgICAgICAgaWYgKGNvbGxlY3Rpb24uZmluZCh7XCJfaWRcIjogX3Jldn0pLmNvdW50KCkgPjApXG4jICAgICAgICAgcmV0dXJuXG4jICAgICAgIGNyZWF0ZWRfYnkgPSB2ZXJzaW9uLmNyZWF0ZWRfYnlcbiMgICAgICAgYXBwcm92ZSA9IHZlcnNpb24uYXBwcm92ZVxuIyAgICAgICBmaWxlbmFtZSA9IHZlcnNpb24uZmlsZW5hbWUgfHwgYXR0YWNoX2ZpbGVuYW1lO1xuIyAgICAgICBtaW1lX3R5cGUgPSBtaW1lLmxvb2t1cChmaWxlbmFtZSlcbiMgICAgICAgbmV3X3BhdGggPSByb290X3BhdGggKyBcIi9zcGFjZXMvXCIgKyBzcGFjZSArIFwiL3dvcmtmbG93L1wiICsgaW5zX2lkICsgXCIvXCIgKyBmaWxlbmFtZSArIFwiX1wiICsgX3JldlxuIyAgICAgICBvbGRfcGF0aCA9IHJvb3RfcGF0aCArIFwiL3NwYWNlcy9cIiArIHNwYWNlICsgXCIvd29ya2Zsb3cvXCIgKyBpbnNfaWQgKyBcIi9cIiArIGZpbGVuYW1lXG5cbiMgICAgICAgcmVhZEZpbGUgPSAoZnVsbF9wYXRoKSAtPlxuIyAgICAgICAgIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMgZnVsbF9wYXRoXG5cbiMgICAgICAgICBpZiBkYXRhXG4jICAgICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiMgICAgICAgICAgIG5ld0ZpbGUuX2lkID0gX3JldjtcbiMgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSB7b3duZXI6Y3JlYXRlZF9ieSwgc3BhY2U6c3BhY2UsIGluc3RhbmNlOmluc19pZCwgYXBwcm92ZTogYXBwcm92ZX07XG4jICAgICAgICAgICBuZXdGaWxlLmF0dGFjaERhdGEgZGF0YSwge3R5cGU6IG1pbWVfdHlwZX1cbiMgICAgICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSlcbiMgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG4jICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlT2JqLl9pZClcblxuIyAgICAgICB0cnlcbiMgICAgICAgICBuID0gZnMuc3RhdFN5bmMgbmV3X3BhdGhcbiMgICAgICAgICBpZiBuICYmIG4uaXNGaWxlKClcbiMgICAgICAgICAgIHJlYWRGaWxlIG5ld19wYXRoXG4jICAgICAgIGNhdGNoIGVycm9yXG4jICAgICAgICAgdHJ5XG4jICAgICAgICAgICBvbGQgPSBmcy5zdGF0U3luYyBvbGRfcGF0aFxuIyAgICAgICAgICAgaWYgb2xkICYmIG9sZC5pc0ZpbGUoKVxuIyAgICAgICAgICAgICByZWFkRmlsZSBvbGRfcGF0aFxuIyAgICAgICAgIGNhdGNoIGVycm9yXG4jICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZmlsZSBub3QgZm91bmQ6IFwiICsgb2xkX3BhdGgpXG5cblxuIyAgICAgY291bnQgPSBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pLmNvdW50KCk7XG4jICAgICBjb25zb2xlLmxvZyhcImFsbCBpbnN0YW5jZXM6IFwiICsgY291bnQpXG5cbiMgICAgIGIgPSBuZXcgRGF0ZSgpXG5cbiMgICAgIGkgPSBtaW5cbiMgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBza2lwOiBtaW4sIGxpbWl0OiBtYXgtbWlufSkuZm9yRWFjaCAoaW5zKSAtPlxuIyAgICAgICBpID0gaSArIDFcbiMgICAgICAgY29uc29sZS5sb2coaSArIFwiOlwiICsgaW5zLm5hbWUpXG4jICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcbiMgICAgICAgc3BhY2UgPSBpbnMuc3BhY2VcbiMgICAgICAgaW5zX2lkID0gaW5zLl9pZFxuIyAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCkgLT5cbiMgICAgICAgICBkZWFsX3dpdGhfdmVyc2lvbiByb290X3BhdGgsIHNwYWNlLCBpbnNfaWQsIGF0dC5jdXJyZW50LCBhdHQuZmlsZW5hbWVcbiMgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcbiMgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XG4jICAgICAgICAgICAgIGRlYWxfd2l0aF92ZXJzaW9uIHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgaGlzLCBhdHQuZmlsZW5hbWVcblxuIyAgICAgY29uc29sZS5sb2cobmV3IERhdGUoKSAtIGIpXG5cbiMgICAgIHJldHVybiBcIm9rXCJcbiIsIkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXM7XG4gIHJldHVybiBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBuZXdGaWxlO1xuICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgYm9keSwgZSwgZmlsZU9iaiwgZmlsZW5hbWUsIG1ldGFkYXRhLCBwYXJlbnQsIHI7XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lO1xuICAgICAgICBpZiAoW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IHJlcS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIklFXCIgfHwgYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJub2RlXCIpKSB7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKTtcbiAgICAgICAgaWYgKGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5Wydvd25lcl9uYW1lJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydpbnN0YW5jZSddICYmIGJvZHlbJ2FwcHJvdmUnXSkge1xuICAgICAgICAgIHBhcmVudCA9ICcnO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgb3duZXI6IGJvZHlbJ293bmVyJ10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBib2R5Wydvd25lcl9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogYm9keVsnc3BhY2UnXSxcbiAgICAgICAgICAgIGluc3RhbmNlOiBib2R5WydpbnN0YW5jZSddLFxuICAgICAgICAgICAgYXBwcm92ZTogYm9keVsnYXBwcm92ZSddLFxuICAgICAgICAgICAgY3VycmVudDogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGJvZHlbXCJpc19wcml2YXRlXCJdICYmIGJvZHlbXCJpc19wcml2YXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYm9keVsnbWFpbiddID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEubWFpbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChib2R5Wydpc0FkZFZlcnNpb24nXSAmJiBib2R5WydwYXJlbnQnXSkge1xuICAgICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHIgPSBjb2xsZWN0aW9uLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsXG4gICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkdW5zZXQ6IHtcbiAgICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6ICcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgbWV0YWRhdGEucGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgICBpZiAoYm9keVsnbG9ja2VkX2J5J10gJiYgYm9keVsnbG9ja2VkX2J5X25hbWUnXSkge1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieSA9IGJvZHlbJ2xvY2tlZF9ieSddO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieV9uYW1lID0gYm9keVsnbG9ja2VkX2J5X25hbWUnXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgICAgICAgaWYgKGJvZHlbXCJvdmVyd3JpdGVcIl0gJiYgYm9keVtcIm92ZXJ3cml0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHtcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGJvZHlbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLm93bmVyJzogYm9keVsnb3duZXInXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5hcHByb3ZlJzogYm9keVsnYXBwcm92ZSddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICRuZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgICAgIGZpbGVPYmoudXBkYXRlKHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBmaWxlT2JqLl9pZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXdGaWxlLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uKHN0b3JlTmFtZSkge1xuICAgICAgICB2YXIgcmVzcCwgc2l6ZTtcbiAgICAgICAgc2l6ZSA9IG5ld0ZpbGUub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgaWYgKCFzaXplKSB7XG4gICAgICAgICAgc2l6ZSA9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICB2ZXJzaW9uX2lkOiBuZXdGaWxlLl9pZCxcbiAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIH07XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJkZWxldGVcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGZpbGUsIGlkLCByZXNwO1xuICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlcztcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcbiAgaWYgKGlkKSB7XG4gICAgZmlsZSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICBfaWQ6IGlkXG4gICAgfSk7XG4gICAgaWYgKGZpbGUpIHtcbiAgICAgIGZpbGUucmVtb3ZlKCk7XG4gICAgICByZXNwID0ge1xuICAgICAgICBzdGF0dXM6IFwiT0tcIlxuICAgICAgfTtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgcmV0dXJuIHJlcy5lbmQoKTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgaWQ7XG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG4gIHJlcy5zdGF0dXNDb2RlID0gMzAyO1xuICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9pbnN0YW5jZXMvXCIpICsgaWQgKyBcIj9kb3dubG9hZD0xXCIpO1xuICByZXR1cm4gcmVzLmVuZCgpO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL3B1c2gvbWVzc2FnZVwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgaWYgcmVxLmJvZHk/LnB1c2hUb3BpYyBhbmQgcmVxLmJvZHkudXNlcklkcyBhbmQgcmVxLmJvZHkuZGF0YVxuICAgICAgICBtZXNzYWdlID0gXG4gICAgICAgICAgICBmcm9tOiBcInN0ZWVkb3NcIlxuICAgICAgICAgICAgcXVlcnk6XG4gICAgICAgICAgICAgICAgYXBwTmFtZTogcmVxLmJvZHkucHVzaFRvcGljXG4gICAgICAgICAgICAgICAgdXNlcklkOiBcbiAgICAgICAgICAgICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGU/XG4gICAgICAgICAgICBtZXNzYWdlW1widGl0bGVcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGVcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5hbGVydD9cbiAgICAgICAgICAgIG1lc3NhZ2VbXCJ0ZXh0XCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmJhZGdlP1xuICAgICAgICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5zb3VuZD9cbiAgICAgICAgICAgIG1lc3NhZ2VbXCJzb3VuZFwiXSA9IHJlcS5ib2R5LmRhdGEuc291bmRcbiAgICAgICAgI2lmIHJlcS5ib2R5LmRhdGEuZGF0YT9cbiAgICAgICAgIyAgICBtZXNzYWdlW1wiZGF0YVwiXSA9IHJlcS5ib2R5LmRhdGEuZGF0YVxuICAgICAgICBQdXNoLnNlbmQgbWVzc2FnZVxuXG4gICAgICAgIHJlcy5lbmQoXCJzdWNjZXNzXCIpO1xuXG5cblxuTWV0ZW9yLm1ldGhvZHNcbiAgICBwdXNoU2VuZDogKHRleHQsdGl0bGUsYmFkZ2UsdXNlcklkKSAtPlxuICAgICAgICBpZiAoIXVzZXJJZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgUHVzaC5zZW5kXG4gICAgICAgICAgICBmcm9tOiAnc3RlZWRvcycsXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICAgICAgYmFkZ2U6IGJhZGdlLFxuICAgICAgICAgICAgcXVlcnk6IFxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4iLCJKc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL3B1c2gvbWVzc2FnZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgbWVzc2FnZSwgcmVmO1xuICBpZiAoKChyZWYgPSByZXEuYm9keSkgIT0gbnVsbCA/IHJlZi5wdXNoVG9waWMgOiB2b2lkIDApICYmIHJlcS5ib2R5LnVzZXJJZHMgJiYgcmVxLmJvZHkuZGF0YSkge1xuICAgIG1lc3NhZ2UgPSB7XG4gICAgICBmcm9tOiBcInN0ZWVkb3NcIixcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGFwcE5hbWU6IHJlcS5ib2R5LnB1c2hUb3BpYyxcbiAgICAgICAgdXNlcklkOiB7XG4gICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAocmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJ0aXRsZVwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZTtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYWxlcnQgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInRleHRcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0O1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5iYWRnZSAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1wiYmFkZ2VcIl0gPSByZXEuYm9keS5kYXRhLmJhZGdlICsgXCJcIjtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuc291bmQgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInNvdW5kXCJdID0gcmVxLmJvZHkuZGF0YS5zb3VuZDtcbiAgICB9XG4gICAgUHVzaC5zZW5kKG1lc3NhZ2UpO1xuICAgIHJldHVybiByZXMuZW5kKFwic3VjY2Vzc1wiKTtcbiAgfVxufSk7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgcHVzaFNlbmQ6IGZ1bmN0aW9uKHRleHQsIHRpdGxlLCBiYWRnZSwgdXNlcklkKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIFB1c2guc2VuZCh7XG4gICAgICBmcm9tOiAnc3RlZWRvcycsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgYmFkZ2U6IGJhZGdlLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkFsaXl1bl9wdXNoID0ge307XG5cbkFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgY2FsbGJhY2spIC0+XG5cdGlmIG5vdGlmaWNhdGlvbi50aXRsZSBhbmQgbm90aWZpY2F0aW9uLnRleHRcblx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRjb25zb2xlLmxvZyB1c2VyVG9rZW5zXG5cblx0XHRhbGl5dW5Ub2tlbnMgPSBuZXcgQXJyYXlcblx0XHR4aW5nZVRva2VucyA9IG5ldyBBcnJheVxuXHRcdGh1YXdlaVRva2VucyA9IG5ldyBBcnJheVxuXHRcdG1pVG9rZW5zID0gbmV3IEFycmF5XG5cblx0XHR1c2VyVG9rZW5zLmZvckVhY2ggKHVzZXJUb2tlbikgLT5cblx0XHRcdGFyciA9IHVzZXJUb2tlbi5zcGxpdCgnOicpXG5cdFx0XHRpZiBhcnJbMF0gaXMgXCJhbGl5dW5cIlxuXHRcdFx0XHRhbGl5dW5Ub2tlbnMucHVzaCBfLmxhc3QoYXJyKVxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJ4aW5nZVwiXG5cdFx0XHRcdHhpbmdlVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwiaHVhd2VpXCJcblx0XHRcdFx0aHVhd2VpVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwibWlcIlxuXHRcdFx0XHRtaVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXG5cblx0XHRpZiAhXy5pc0VtcHR5KGFsaXl1blRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hbGl5dW5cblx0XHRcdEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJhbGl5dW5Ub2tlbnM6ICN7YWxpeXVuVG9rZW5zfVwiXG5cdFx0XHRBTFlQVVNIID0gbmV3IChBTFkuUFVTSCkoXG5cdFx0XHRcdGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWRcblx0XHRcdFx0c2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5XG5cdFx0XHRcdGVuZHBvaW50OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uZW5kcG9pbnRcblx0XHRcdFx0YXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb24pO1xuXG5cdFx0XHRkYXRhID0gXG5cdFx0XHRcdEFwcEtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwcEtleVxuXHRcdFx0XHRUYXJnZXQ6ICdkZXZpY2UnXG5cdFx0XHRcdFRhcmdldFZhbHVlOiBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKVxuXHRcdFx0XHRUaXRsZTogbm90aWZpY2F0aW9uLnRpdGxlXG5cdFx0XHRcdFN1bW1hcnk6IG5vdGlmaWNhdGlvbi50ZXh0XG5cblx0XHRcdEFMWVBVU0gucHVzaE5vdGljZVRvQW5kcm9pZCBkYXRhLCBjYWxsYmFja1xuXG5cdFx0aWYgIV8uaXNFbXB0eSh4aW5nZVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy54aW5nZVxuXHRcdFx0WGluZ2UgPSByZXF1aXJlKCd4aW5nZScpO1xuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcInhpbmdlVG9rZW5zOiAje3hpbmdlVG9rZW5zfVwiXG5cdFx0XHRYaW5nZUFwcCA9IG5ldyBYaW5nZS5YaW5nZUFwcChNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5hY2Nlc3NJZCwgTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2Uuc2VjcmV0S2V5KVxuXHRcdFx0XG5cdFx0XHRhbmRyb2lkTWVzc2FnZSA9IG5ldyBYaW5nZS5BbmRyb2lkTWVzc2FnZVxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UudHlwZSA9IFhpbmdlLk1FU1NBR0VfVFlQRV9OT1RJRklDQVRJT05cblx0XHRcdGFuZHJvaWRNZXNzYWdlLnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5jb250ZW50ID0gbm90aWZpY2F0aW9uLnRleHRcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnN0eWxlID0gbmV3IFhpbmdlLlN0eWxlXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5hY3Rpb24gPSBuZXcgWGluZ2UuQ2xpY2tBY3Rpb25cblxuXHRcdFx0Xy5lYWNoIHhpbmdlVG9rZW5zLCAodCktPlxuXHRcdFx0XHRYaW5nZUFwcC5wdXNoVG9TaW5nbGVEZXZpY2UgdCwgYW5kcm9pZE1lc3NhZ2UsIGNhbGxiYWNrXG5cblx0XHRpZiAhXy5pc0VtcHR5KGh1YXdlaVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5odWF3ZWlcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJodWF3ZWlUb2tlbnM6ICN7aHVhd2VpVG9rZW5zfVwiXG5cblx0XHRcdHBhY2thZ2VfbmFtZSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBQa2dOYW1lXG5cdFx0XHR0b2tlbkRhdGFMaXN0ID0gW11cblx0XHRcdF8uZWFjaCBodWF3ZWlUb2tlbnMsICh0KS0+XG5cdFx0XHRcdHRva2VuRGF0YUxpc3QucHVzaCh7J3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSwgJ3Rva2VuJzogdH0pXG5cdFx0XHRub3RpID0geydhbmRyb2lkJzogeyd0aXRsZSc6IG5vdGlmaWNhdGlvbi50aXRsZSwgJ21lc3NhZ2UnOiBub3RpZmljYXRpb24udGV4dH0sICdleHRyYXMnOiBub3RpZmljYXRpb24ucGF5bG9hZH1cblxuXHRcdFx0SHVhd2VpUHVzaC5jb25maWcgW3sncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLCAnY2xpZW50X2lkJzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcElkLCAnY2xpZW50X3NlY3JldCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXR9XVxuXHRcdFx0XG5cdFx0XHRIdWF3ZWlQdXNoLnNlbmRNYW55IG5vdGksIHRva2VuRGF0YUxpc3RcblxuXG5cdFx0aWYgIV8uaXNFbXB0eShtaVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5taVxuXHRcdFx0TWlQdXNoID0gcmVxdWlyZSgneGlhb21pLXB1c2gnKTtcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJtaVRva2VuczogI3ttaVRva2Vuc31cIlxuXHRcdFx0bXNnID0gbmV3IE1pUHVzaC5NZXNzYWdlXG5cdFx0XHRtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5kZXNjcmlwdGlvbihub3RpZmljYXRpb24udGV4dClcblx0XHRcdG5vdGlmaWNhdGlvbiA9IG5ldyBNaVB1c2guTm90aWZpY2F0aW9uKFxuXHRcdFx0XHRwcm9kdWN0aW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5wcm9kdWN0aW9uXG5cdFx0XHRcdGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkuYXBwU2VjcmV0XG5cdFx0XHQpXG5cdFx0XHRfLmVhY2ggbWlUb2tlbnMsIChyZWdpZCktPlxuXHRcdFx0XHRub3RpZmljYXRpb24uc2VuZCByZWdpZCwgbXNnLCBjYWxsYmFja1xuXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdFxuXHRpZiBub3QgTWV0ZW9yLnNldHRpbmdzLmNyb24/LnB1c2hfaW50ZXJ2YWxcblx0XHRyZXR1cm5cblxuXHRjb25maWcgPSB7XG5cdFx0ZGVidWc6IHRydWVcblx0XHRrZWVwTm90aWZpY2F0aW9uczogZmFsc2Vcblx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLnB1c2hfaW50ZXJ2YWxcblx0XHRzZW5kQmF0Y2hTaXplOiAxMFxuXHRcdHByb2R1Y3Rpb246IHRydWVcblx0fVxuXG5cdGlmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFwbilcblx0XHRjb25maWcuYXBuID0ge1xuXHRcdFx0a2V5RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmtleURhdGFcblx0XHRcdGNlcnREYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4uY2VydERhdGFcblx0XHR9XG5cdGlmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmdjbSlcblx0XHRjb25maWcuZ2NtID0ge1xuXHRcdFx0cHJvamVjdE51bWJlcjogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLnByb2plY3ROdW1iZXJcblx0XHRcdGFwaUtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLmFwaUtleVxuXHRcdH1cblxuXHRQdXNoLkNvbmZpZ3VyZSBjb25maWdcblx0XG5cdGlmIChNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYWxpeXVuIG9yIE1ldGVvci5zZXR0aW5ncy5wdXNoPy54aW5nZSBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8uaHVhd2VpIG9yIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5taSkgYW5kIFB1c2ggYW5kIHR5cGVvZiBQdXNoLnNlbmRHQ00gPT0gJ2Z1bmN0aW9uJ1xuXHRcdFxuXHRcdFB1c2gub2xkX3NlbmRHQ00gPSBQdXNoLnNlbmRHQ007XG5cblx0XHRQdXNoLnNlbmRBbGl5dW4gPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxuXG5cdFx0XHRpZiBNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdClcblx0XHRcdFx0bm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSlcblx0XHRcdCMgTWFrZSBzdXJlIHVzZXJUb2tlbnMgYXJlIGFuIGFycmF5IG9mIHN0cmluZ3Ncblx0XHRcdGlmIHVzZXJUb2tlbnMgPT0gJycgKyB1c2VyVG9rZW5zXG5cdFx0XHRcdHVzZXJUb2tlbnMgPSBbIHVzZXJUb2tlbnMgXVxuXHRcdFx0IyBDaGVjayBpZiBhbnkgdG9rZW5zIGluIHRoZXJlIHRvIHNlbmRcblx0XHRcdGlmICF1c2VyVG9rZW5zLmxlbmd0aFxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCdcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uXG5cblx0XHRcdEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJylcblx0ICBcblx0XHRcdHVzZXJUb2tlbiA9IGlmIHVzZXJUb2tlbnMubGVuZ3RoID09IDEgdGhlbiB1c2VyVG9rZW5zWzBdIGVsc2UgbnVsbFxuXHRcdFx0QWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgdXNlclRva2Vucywgbm90aWZpY2F0aW9uLCAoZXJyLCByZXN1bHQpIC0+XG5cdFx0XHRcdGlmIGVyclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEIEVSUk9SOiByZXN1bHQgb2Ygc2VuZGVyOiAnICsgcmVzdWx0XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiByZXN1bHQgPT0gbnVsbFxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXIgaXMgbnVsbCdcblx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KVxuXG5cdFx0XHRcdFx0aWYgcmVzdWx0LmNhbm9uaWNhbF9pZHMgPT0gMSBhbmQgdXNlclRva2VuXG5cdFx0XHRcdFx0XHRGaWJlcigoc2VsZikgLT5cblx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jYWxsYmFjayBzZWxmLm9sZFRva2VuLCBzZWxmLm5ld1Rva2VuXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVyclxuXHRcdFx0XHRcdFx0KS5ydW5cblx0XHRcdFx0XHRcdFx0b2xkVG9rZW46IGdjbTogdXNlclRva2VuXG5cdFx0XHRcdFx0XHRcdG5ld1Rva2VuOiBnY206IFwiYWxpeXVuOlwiICsgcmVzdWx0LnJlc3VsdHNbMF0ucmVnaXN0cmF0aW9uX2lkXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiBfcmVwbGFjZVRva2VuXG5cdFx0XHRcdFx0aWYgcmVzdWx0LmZhaWx1cmUgIT0gMCBhbmQgdXNlclRva2VuXG5cdFx0XHRcdFx0XHRGaWJlcigoc2VsZikgLT5cblx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jYWxsYmFjayBzZWxmLnRva2VuXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVyclxuXHRcdFx0XHRcdFx0KS5ydW5cblx0XHRcdFx0XHRcdFx0dG9rZW46IGdjbTogdXNlclRva2VuXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiBfcmVtb3ZlVG9rZW5cblxuXG5cblx0XHRQdXNoLnNlbmRHQ00gPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTSBmcm9tIGFsaXl1bi0+IFB1c2guc2VuZEdDTSdcblx0XHRcdGlmIE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KVxuXHRcdFx0XHRub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKVxuXHRcdFx0IyBNYWtlIHN1cmUgdXNlclRva2VucyBhcmUgYW4gYXJyYXkgb2Ygc3RyaW5nc1xuXHRcdFx0aWYgdXNlclRva2VucyA9PSAnJyArIHVzZXJUb2tlbnNcblx0XHRcdFx0dXNlclRva2VucyA9IFsgdXNlclRva2VucyBdXG5cdFx0XHQjIENoZWNrIGlmIGFueSB0b2tlbnMgaW4gdGhlcmUgdG8gc2VuZFxuXHRcdFx0aWYgIXVzZXJUb2tlbnMubGVuZ3RoXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJ1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cblxuXHRcdFx0YWxpeXVuVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoKGl0ZW0pIC0+XG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5pbmRleE9mKCdhbGl5dW46JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ3hpbmdlOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCdodWF3ZWk6JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ21pOicpID4gLTFcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnYWxpeXVuVG9rZW5zIGlzICcsIGFsaXl1blRva2Vucy50b1N0cmluZygpXG5cblx0XHRcdGdjbVRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKChpdGVtKSAtPlxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uaW5kZXhPZihcImFsaXl1bjpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJ4aW5nZTpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJodWF3ZWk6XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwibWk6XCIpIDwgMFxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdnY21Ub2tlbnMgaXMgJyAsIGdjbVRva2Vucy50b1N0cmluZygpO1xuXG5cdFx0XHRQdXNoLnNlbmRBbGl5dW4oYWxpeXVuVG9rZW5zLCBub3RpZmljYXRpb24pO1xuXG5cdFx0XHRQdXNoLm9sZF9zZW5kR0NNKGdjbVRva2Vucywgbm90aWZpY2F0aW9uKTtcblxuXHRcdFB1c2gub2xkX3NlbmRBUE4gPSBQdXNoLnNlbmRBUE5cblx0XHRQdXNoLnNlbmRBUE4gPSAodXNlclRva2VuLCBub3RpZmljYXRpb24pIC0+XG5cdFx0XHRpZiBub3RpZmljYXRpb24udGl0bGUgYW5kIG5vdGlmaWNhdGlvbi50ZXh0XG5cdFx0XHRcdG5vdGkgPSBfLmNsb25lKG5vdGlmaWNhdGlvbilcblx0XHRcdFx0bm90aS50ZXh0ID0gbm90aS50aXRsZSArIFwiIFwiICsgbm90aS50ZXh0XG5cdFx0XHRcdG5vdGkudGl0bGUgPSBcIlwiXG5cdFx0XHRcdFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKVxuIiwidmFyIEFsaXl1bl9wdXNoO1xuXG5BbGl5dW5fcHVzaCA9IHt9O1xuXG5BbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgY2FsbGJhY2spIHtcbiAgdmFyIEFMWSwgQUxZUFVTSCwgTWlQdXNoLCBYaW5nZSwgWGluZ2VBcHAsIGFsaXl1blRva2VucywgYW5kcm9pZE1lc3NhZ2UsIGRhdGEsIGh1YXdlaVRva2VucywgbWlUb2tlbnMsIG1zZywgbm90aSwgcGFja2FnZV9uYW1lLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHRva2VuRGF0YUxpc3QsIHhpbmdlVG9rZW5zO1xuICBpZiAobm90aWZpY2F0aW9uLnRpdGxlICYmIG5vdGlmaWNhdGlvbi50ZXh0KSB7XG4gICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKHVzZXJUb2tlbnMpO1xuICAgIH1cbiAgICBhbGl5dW5Ub2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgeGluZ2VUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgaHVhd2VpVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIG1pVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIHVzZXJUb2tlbnMuZm9yRWFjaChmdW5jdGlvbih1c2VyVG9rZW4pIHtcbiAgICAgIHZhciBhcnI7XG4gICAgICBhcnIgPSB1c2VyVG9rZW4uc3BsaXQoJzonKTtcbiAgICAgIGlmIChhcnJbMF0gPT09IFwiYWxpeXVuXCIpIHtcbiAgICAgICAgcmV0dXJuIGFsaXl1blRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcInhpbmdlXCIpIHtcbiAgICAgICAgcmV0dXJuIHhpbmdlVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwiaHVhd2VpXCIpIHtcbiAgICAgICAgcmV0dXJuIGh1YXdlaVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcIm1pXCIpIHtcbiAgICAgICAgcmV0dXJuIG1pVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghXy5pc0VtcHR5KGFsaXl1blRva2VucykgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZi5hbGl5dW4gOiB2b2lkIDApKSB7XG4gICAgICBBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImFsaXl1blRva2VuczogXCIgKyBhbGl5dW5Ub2tlbnMpO1xuICAgICAgfVxuICAgICAgQUxZUFVTSCA9IG5ldyBBTFkuUFVTSCh7XG4gICAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWQsXG4gICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLnNlY3JldEFjY2Vzc0tleSxcbiAgICAgICAgZW5kcG9pbnQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5lbmRwb2ludCxcbiAgICAgICAgYXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb25cbiAgICAgIH0pO1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgQXBwS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBwS2V5LFxuICAgICAgICBUYXJnZXQ6ICdkZXZpY2UnLFxuICAgICAgICBUYXJnZXRWYWx1ZTogYWxpeXVuVG9rZW5zLnRvU3RyaW5nKCksXG4gICAgICAgIFRpdGxlOiBub3RpZmljYXRpb24udGl0bGUsXG4gICAgICAgIFN1bW1hcnk6IG5vdGlmaWNhdGlvbi50ZXh0XG4gICAgICB9O1xuICAgICAgQUxZUFVTSC5wdXNoTm90aWNlVG9BbmRyb2lkKGRhdGEsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkoeGluZ2VUb2tlbnMpICYmICgocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMS54aW5nZSA6IHZvaWQgMCkpIHtcbiAgICAgIFhpbmdlID0gcmVxdWlyZSgneGluZ2UnKTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwieGluZ2VUb2tlbnM6IFwiICsgeGluZ2VUb2tlbnMpO1xuICAgICAgfVxuICAgICAgWGluZ2VBcHAgPSBuZXcgWGluZ2UuWGluZ2VBcHAoTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2UuYWNjZXNzSWQsIE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLnNlY3JldEtleSk7XG4gICAgICBhbmRyb2lkTWVzc2FnZSA9IG5ldyBYaW5nZS5BbmRyb2lkTWVzc2FnZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnR5cGUgPSBYaW5nZS5NRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGU7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5jb250ZW50ID0gbm90aWZpY2F0aW9uLnRleHQ7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5zdHlsZSA9IG5ldyBYaW5nZS5TdHlsZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLmFjdGlvbiA9IG5ldyBYaW5nZS5DbGlja0FjdGlvbjtcbiAgICAgIF8uZWFjaCh4aW5nZVRva2VucywgZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gWGluZ2VBcHAucHVzaFRvU2luZ2xlRGV2aWNlKHQsIGFuZHJvaWRNZXNzYWdlLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkoaHVhd2VpVG9rZW5zKSAmJiAoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjIuaHVhd2VpIDogdm9pZCAwKSkge1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJodWF3ZWlUb2tlbnM6IFwiICsgaHVhd2VpVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIHBhY2thZ2VfbmFtZSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBQa2dOYW1lO1xuICAgICAgdG9rZW5EYXRhTGlzdCA9IFtdO1xuICAgICAgXy5lYWNoKGh1YXdlaVRva2VucywgZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdG9rZW5EYXRhTGlzdC5wdXNoKHtcbiAgICAgICAgICAncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLFxuICAgICAgICAgICd0b2tlbic6IHRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIG5vdGkgPSB7XG4gICAgICAgICdhbmRyb2lkJzoge1xuICAgICAgICAgICd0aXRsZSc6IG5vdGlmaWNhdGlvbi50aXRsZSxcbiAgICAgICAgICAnbWVzc2FnZSc6IG5vdGlmaWNhdGlvbi50ZXh0XG4gICAgICAgIH0sXG4gICAgICAgICdleHRyYXMnOiBub3RpZmljYXRpb24ucGF5bG9hZFxuICAgICAgfTtcbiAgICAgIEh1YXdlaVB1c2guY29uZmlnKFtcbiAgICAgICAge1xuICAgICAgICAgICdwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsXG4gICAgICAgICAgJ2NsaWVudF9pZCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBJZCxcbiAgICAgICAgICAnY2xpZW50X3NlY3JldCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXRcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgICBIdWF3ZWlQdXNoLnNlbmRNYW55KG5vdGksIHRva2VuRGF0YUxpc3QpO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eShtaVRva2VucykgJiYgKChyZWYzID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYzLm1pIDogdm9pZCAwKSkge1xuICAgICAgTWlQdXNoID0gcmVxdWlyZSgneGlhb21pLXB1c2gnKTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibWlUb2tlbnM6IFwiICsgbWlUb2tlbnMpO1xuICAgICAgfVxuICAgICAgbXNnID0gbmV3IE1pUHVzaC5NZXNzYWdlO1xuICAgICAgbXNnLnRpdGxlKG5vdGlmaWNhdGlvbi50aXRsZSkuZGVzY3JpcHRpb24obm90aWZpY2F0aW9uLnRleHQpO1xuICAgICAgbm90aWZpY2F0aW9uID0gbmV3IE1pUHVzaC5Ob3RpZmljYXRpb24oe1xuICAgICAgICBwcm9kdWN0aW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5wcm9kdWN0aW9uLFxuICAgICAgICBhcHBTZWNyZXQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLmFwcFNlY3JldFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKG1pVG9rZW5zLCBmdW5jdGlvbihyZWdpZCkge1xuICAgICAgICByZXR1cm4gbm90aWZpY2F0aW9uLnNlbmQocmVnaWQsIG1zZywgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNvbmZpZywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWY2O1xuICBpZiAoISgocmVmID0gTWV0ZW9yLnNldHRpbmdzLmNyb24pICE9IG51bGwgPyByZWYucHVzaF9pbnRlcnZhbCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uZmlnID0ge1xuICAgIGRlYnVnOiB0cnVlLFxuICAgIGtlZXBOb3RpZmljYXRpb25zOiBmYWxzZSxcbiAgICBzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLnB1c2hfaW50ZXJ2YWwsXG4gICAgc2VuZEJhdGNoU2l6ZTogMTAsXG4gICAgcHJvZHVjdGlvbjogdHJ1ZVxuICB9O1xuICBpZiAoIV8uaXNFbXB0eSgocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMS5hcG4gOiB2b2lkIDApKSB7XG4gICAgY29uZmlnLmFwbiA9IHtcbiAgICAgIGtleURhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5rZXlEYXRhLFxuICAgICAgY2VydERhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5jZXJ0RGF0YVxuICAgIH07XG4gIH1cbiAgaWYgKCFfLmlzRW1wdHkoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjIuZ2NtIDogdm9pZCAwKSkge1xuICAgIGNvbmZpZy5nY20gPSB7XG4gICAgICBwcm9qZWN0TnVtYmVyOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20ucHJvamVjdE51bWJlcixcbiAgICAgIGFwaUtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLmFwaUtleVxuICAgIH07XG4gIH1cbiAgUHVzaC5Db25maWd1cmUoY29uZmlnKTtcbiAgaWYgKCgoKHJlZjMgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjMuYWxpeXVuIDogdm9pZCAwKSB8fCAoKHJlZjQgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjQueGluZ2UgOiB2b2lkIDApIHx8ICgocmVmNSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNS5odWF3ZWkgOiB2b2lkIDApIHx8ICgocmVmNiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNi5taSA6IHZvaWQgMCkpICYmIFB1c2ggJiYgdHlwZW9mIFB1c2guc2VuZEdDTSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFB1c2gub2xkX3NlbmRHQ00gPSBQdXNoLnNlbmRHQ007XG4gICAgUHVzaC5zZW5kQWxpeXVuID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uKSB7XG4gICAgICB2YXIgRmliZXIsIHVzZXJUb2tlbjtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdCkpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSk7XG4gICAgICB9XG4gICAgICBpZiAodXNlclRva2VucyA9PT0gJycgKyB1c2VyVG9rZW5zKSB7XG4gICAgICAgIHVzZXJUb2tlbnMgPSBbdXNlclRva2Vuc107XG4gICAgICB9XG4gICAgICBpZiAoIXVzZXJUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICAgIEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG4gICAgICB1c2VyVG9rZW4gPSB1c2VyVG9rZW5zLmxlbmd0aCA9PT0gMSA/IHVzZXJUb2tlbnNbMF0gOiBudWxsO1xuICAgICAgcmV0dXJuIEFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmxvZygnQU5EUk9JRCBFUlJPUjogcmVzdWx0IG9mIHNlbmRlcjogJyArIHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXIgaXMgbnVsbCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQuY2Fub25pY2FsX2lkcyA9PT0gMSAmJiB1c2VyVG9rZW4pIHtcbiAgICAgICAgICAgIEZpYmVyKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhzZWxmLm9sZFRva2VuLCBzZWxmLm5ld1Rva2VuKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkucnVuKHtcbiAgICAgICAgICAgICAgb2xkVG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IHVzZXJUb2tlblxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBuZXdUb2tlbjoge1xuICAgICAgICAgICAgICAgIGdjbTogXCJhbGl5dW46XCIgKyByZXN1bHQucmVzdWx0c1swXS5yZWdpc3RyYXRpb25faWRcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IF9yZXBsYWNlVG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0LmZhaWx1cmUgIT09IDAgJiYgdXNlclRva2VuKSB7XG4gICAgICAgICAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oc2VsZikge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKHNlbGYudG9rZW4pO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5ydW4oe1xuICAgICAgICAgICAgICB0b2tlbjoge1xuICAgICAgICAgICAgICAgIGdjbTogdXNlclRva2VuXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBfcmVtb3ZlVG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgICBQdXNoLnNlbmRHQ00gPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBhbGl5dW5Ub2tlbnMsIGdjbVRva2VucztcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNIGZyb20gYWxpeXVuLT4gUHVzaC5zZW5kR0NNJyk7XG4gICAgICB9XG4gICAgICBpZiAoTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJUb2tlbnMgPT09ICcnICsgdXNlclRva2Vucykge1xuICAgICAgICB1c2VyVG9rZW5zID0gW3VzZXJUb2tlbnNdO1xuICAgICAgfVxuICAgICAgaWYgKCF1c2VyVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTScsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBhbGl5dW5Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmluZGV4T2YoJ2FsaXl1bjonKSA+IC0xIHx8IGl0ZW0uaW5kZXhPZigneGluZ2U6JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ2h1YXdlaTonKSA+IC0xIHx8IGl0ZW0uaW5kZXhPZignbWk6JykgPiAtMTtcbiAgICAgIH0pO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FsaXl1blRva2VucyBpcyAnLCBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICBnY21Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmluZGV4T2YoXCJhbGl5dW46XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJ4aW5nZTpcIikgPCAwICYmIGl0ZW0uaW5kZXhPZihcImh1YXdlaTpcIikgPCAwICYmIGl0ZW0uaW5kZXhPZihcIm1pOlwiKSA8IDA7XG4gICAgICB9KTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnY21Ub2tlbnMgaXMgJywgZ2NtVG9rZW5zLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgUHVzaC5zZW5kQWxpeXVuKGFsaXl1blRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIHJldHVybiBQdXNoLm9sZF9zZW5kR0NNKGdjbVRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICB9O1xuICAgIFB1c2gub2xkX3NlbmRBUE4gPSBQdXNoLnNlbmRBUE47XG4gICAgcmV0dXJuIFB1c2guc2VuZEFQTiA9IGZ1bmN0aW9uKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKSB7XG4gICAgICB2YXIgbm90aTtcbiAgICAgIGlmIChub3RpZmljYXRpb24udGl0bGUgJiYgbm90aWZpY2F0aW9uLnRleHQpIHtcbiAgICAgICAgbm90aSA9IF8uY2xvbmUobm90aWZpY2F0aW9uKTtcbiAgICAgICAgbm90aS50ZXh0ID0gbm90aS50aXRsZSArIFwiIFwiICsgbm90aS50ZXh0O1xuICAgICAgICBub3RpLnRpdGxlID0gXCJcIjtcbiAgICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiJdfQ==
