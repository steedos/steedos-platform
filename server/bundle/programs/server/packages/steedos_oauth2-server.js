(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Random = Package.random.Random;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var BlazeLayout = Package['kadira:blaze-layout'].BlazeLayout;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var check = Package.check.check;
var Match = Package.check.Match;
var Async = Package['meteorhacks:async'].Async;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var refreshTokensCollection, authCodesCollection, spaceId, oAuth2Server, MeteorModel, client, __coffeescriptShare;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_oauth2-server/lib/common.js                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
db.OAuth2Clients = new Meteor.Collection('OAuth2Clients');
db.OAuth2Clients.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    }
});

refreshTokensCollection = new Meteor.Collection('OAuth2RefreshTokens');
refreshTokensCollection.allow({
    insert: function(userId, doc) {
        return Meteor.isServer && userId && userId === doc.userId;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return false;
    },
    remove: function(userId, doc) {
        return userId && userId === doc.userId;
    }
});

authCodesCollection = new Meteor.Collection('OAuth2AuthCodes');
authCodesCollection.allow({
    insert: function(userId, doc) {
        return Meteor.isServer && userId && userId === doc.userId;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return false;
    },
    remove: function(userId, doc) {
        return userId && userId === doc.userId;
    }
});

if(Meteor.isServer){
    authCodesCollection.before.insert(function(userId, doc){
        spaceId = db.space_users.findOne({user: doc.userId}).space;
        doc.spaceId = spaceId;
    });
}


oAuth2Server = {
    pubSubNames: {
        authCodes: 'oauth2/authCodes',
        refreshTokens: 'oauth2/refreshTokens'
    },
    methodNames: {
        authCodeGrant: 'oauth2/authCodeGrant'
    },
    collections: {
        refreshToken: refreshTokensCollection,
        authCode: authCodesCollection,
        clients: db.OAuth2Clients
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_oauth2-server/lib/meteor-model.js                                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/**
 * A oauth2-server model for dealing with the meteor collections. Original code
 * from: https://github.com/RocketChat/rocketchat-oauth2-server/blob/master/model.coffee
 * Modifications and improvements have been made.
 * This class is used a callback model for oauth2-server. oauth2-server runs it's calls
 * in a different context and fiber. Doing so can get really messy when attempting to
 * run Meteor code, like Collection calls. We work-around this problem by creating
 * instance methods are runtime that are proxied through Meteor.bindEnvironment.
 * This strategy allows us to specify the this context.
 * Defining the class with prototype methods defined by Meteor.bindEnvironment
 * would ensure we lose our this context when the method executes.
 */
MeteorModel = (function() {
    function MeteorModel(accessTokenCollection,
                         refreshTokenCollection,
                         authCodeCollection,
                         clientsCollection,
                         debug) {
        this.accessTokenCollection = accessTokenCollection;
        this.refreshTokenCollection = refreshTokenCollection;
        this.authCodeCollection = authCodeCollection;
        this.clientsCollection = clientsCollection;
        this.debug = debug;

        ///////////////////
        // Defining the methods.
        ///////////////////

        this.getAccessToken = Meteor.bindEnvironment(
                function (bearerToken, callback) {
                if (this.debug === true) {
                    console.log('[OAuth2Server]', 'in getAccessToken (bearerToken:', bearerToken, ')');
                }

                try {
                    var token = this.accessTokenCollection.findOne({
                        accessToken: bearerToken
                    });

                    callback(null, token);

                } catch (e) {
                    callback(e);
                }
            },
            null, // exception handler
            this // this context.
        );

        this.getClient = Meteor.bindEnvironment(
            function (clientId, clientSecret, callback) {
                if (this.debug === true) {
                    console.log('[OAuth2Server]', 'in getClient (clientId:', clientId, ', clientSecret:', clientSecret, ')');
                }

                try {
                    var collection = this.clientsCollection;
                    if (clientSecret == null) {
                        client = collection.findOne({
                            active: true,
                            clientId: clientId
                        });
                    } else {
                        client = collection.findOne({
                            active: true,
                            clientId: clientId,
                            clientSecret: clientSecret
                        });
                    }
                    callback(null, client);
                } catch (e) {
                    callback(e);
                }
            },
            null, // exception handler
            this // this context.
        );


        this.grantTypeAllowed = Meteor.bindEnvironment(
            function (clientId, grantType, callback) {
                if (this.debug === true) {
                    console.log('[OAuth2Server]', 'in grantTypeAllowed (clientId:', clientId, ', grantType:', grantType + ')');
                }

                callback(false, grantType === 'authorization_code');
            },
            null, // exception handler
            this // this context.
        );

        this.saveAccessToken = Meteor.bindEnvironment(
            function (token, clientId, expires, user, callback) {
                if (this.debug === true) {
                    console.log('[OAuth2Server]', 'in saveAccessToken (token:', token, ', clientId:', clientId, ', user:', user, ', expires:', expires, ')');
                }
                
                try {
                    // 有效期（默认一小时）
                    var collection = this.clientsCollection;
                    var clientObj = collection.findOne({clientId: clientId});
                    if(clientObj && clientObj.expires && clientObj.expires>1){
                        expires.setHours(expires.getHours()+clientObj.expires-1);
                    }
                    var tokenId = this.accessTokenCollection.insert({
                        accessToken: token,
                        clientId: clientId,
                        userId: user.id,
                        expires: expires
                    });

                    callback(null, tokenId);

                } catch (e) {
                    callback(e);
                }
            },
            null, // exception handler
            this // this context.
        );

        this.getAuthCode = Meteor.bindEnvironment(
            function (authCode, callback) {
                if (this.debug === true) {
                    console.log('[OAuth2Server]', 'in getAuthCode (authCode: ' + authCode + ')');
                }

                try {
                    var code = this.authCodeCollection.findOne({
                        authCode: authCode
                    });

                    callback(null, code);

                } catch (e) {
                    callback(e);
                }
            },
            null, // exception handler
            this // this context.
        );

        this.saveAuthCode = Meteor.bindEnvironment(
            function (code, clientId, expires, user, callback) {
                Meteor.bindEnvironment(code, clientId, expires, user, callback)
                if (this.debug === true) {
                    console.log('[OAuth2Server]', 'in saveAuthCode (code:', code, ', clientId:', clientId, ', expires:', expires, ', user:', user, ')');
                }

                try {
                    this.authCodeCollection.remove({authCode: code});
                    var codeId = this.authCodeCollection.insert({
                        authCode: code,
                        clientId: clientId,
                        userId: user.id,
                        expires: expires
                    });

                    callback(null, codeId);

                } catch (e) {
                    callback(e);
                }
            },
            null, // exception handler
            this // this context.
        );

        this.saveRefreshToken = Meteor.bindEnvironment(
            function (token, clientId, expires, user, callback) {
                if (this.debug === true) {
                    console.log('[OAuth2Server]', 'in saveRefreshToken (token:', token, ', clientId:', clientId, ', user:', user, ', expires:', expires, ')');
                }

                try {
                    this.refreshTokenCollection.remove({refreshToken: token});
                    var tokenId = this.refreshTokenCollection.insert({
                        refreshToken: token,
                        clientId: clientId,
                        userId: user.id,
                        expires: expires
                    });

                    callback(null, tokenId);

                } catch (e) {
                    callback(e);
                }
            },
            null, // exception handler
            this // this context.
        );

        this.getRefreshToken = Meteor.bindEnvironment(
            function (refreshToken, callback) {
                if (this.debug === true) {
                    console.log('[OAuth2Server]', 'in getRefreshToken (refreshToken: ' + refreshToken + ')');
                }

                try {
                    var token = this.refreshTokenCollection.findOne({
                        refreshToken: refreshToken
                    });

                    callback(null, token);

                } catch (e) {
                    callback(e);
                }
            },
            null, // exception handler
            this // this context.
        );
    };

    return MeteorModel;
})();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_oauth2-server/lib/server.js                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// get the node modules.
var express = Npm.require('express'),
    bodyParser = Npm.require('body-parser'),
    oauthserver = Npm.require('oauth2-server');


// configure the server-side collections. The rest of the collections
// exist in common.js and are for both client and server.
db.OAuth2AccessTokens = new Meteor.Collection('OAuth2AccessTokens');

if(Meteor.isServer){
    db.OAuth2AccessTokens.before.insert(function(userId, doc){
        spaceId = db.space_users.findOne({user: doc.userId}).space;
        doc.spaceId = spaceId;
    });
}

// setup the node oauth2 model.
var meteorModel = new MeteorModel(
    db.OAuth2AccessTokens,
    refreshTokensCollection,
    authCodesCollection,
    db.OAuth2Clients,
    true
);


// setup the exported object.
oAuth2Server.oauthserver = oauthserver({
    model: meteorModel,
    grants: ['authorization_code'],
    debug: true
});

oAuth2Server.collections.accessToken = db.OAuth2AccessTokens;

// configure a url handler for the /steedos/oauth2/token path.
var app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.all('/oauth2/token', oAuth2Server.oauthserver.grant());
// 不应该给整个app设置全局的bodyParser，会影响cms正文字段summernote控件中的图片上传控件保存报错：request entity too large
app.all('/oauth2/token', bodyParser.urlencoded({ extended: true }), bodyParser.json(), oAuth2Server.oauthserver.grant());

WebApp.rawConnectHandlers.use(app);


/////////////////////
// Configure really basic identity service
////////////////////
JsonRoutes.Middleware.use(
    '/oauth2/getIdentity',
    oAuth2Server.oauthserver.authorise()
);

JsonRoutes.add('get', '/oauth2/getIdentity', function(req, res, next) {
    var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
    
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    var user = Meteor.users.findOne(accessToken.userId);

    JsonRoutes.sendResult(
        res,
        {
            data: {
                id: user._id,
                name: user.name,
                username: user.username
            }
        }
    );
});



////////////////////
// Meteor publish.
///////////////////
Meteor.publish(oAuth2Server.pubSubNames.authCodes, function() {
    if (!this.userId) {
        return this.ready();
    }

    return oAuth2Server.collections.authCode.find({
        userId: this.userId,
        expires: {
            $gt: new Date()
        }
    });
});

Meteor.publish(oAuth2Server.pubSubNames.refreshTokens, function() {
    if (!this.userId) {
        return this.ready();
    }

    return oAuth2Server.collections.refreshToken.find({
        userId: this.userId,
        expires: {
            $gt: new Date()
        }
    });
});

////////////
// configure the meteor methods.
//////////////
var methods = {};
methods[oAuth2Server.methodNames.authCodeGrant] = function(clientId, redirectUri, responseType, scope, state) {
    // validate parameters.
    check(clientId, String);
    check(redirectUri, String);
    check(responseType, String);
    check(scope, Match.Optional(Match.OneOf(null, [String])));
    check(state, Match.Optional(Match.OneOf(null, String)));

    if (!scope) {
        scope = [];
    }

    // validate the user is authenticated.
    var userId = this.userId;
    if (!userId) {
        return {
            success: false,
            error: 'User not authenticated.'
        };
    }

    // The oauth2-server project relies heavily on express to validate and
    // manipulate the oauth2 grant. A forthcoming version will abstract this
    // behaviour into promises.
    // That being the case, we need to get run an authorization grant as if
    // it were a promise. Warning, the following code is difficult to follow.
    // What we are doing is mocking and express app but never attaching it to
    // Meteor. This allows oauth2-server to behave as it would as if it was
    // natively attached to the webapp. The following code mocks express,
    // request, response, check and next in order to retrive the data we need.
    // Further, we are also running this in a synchronous manner. Enjoy! :)

    // create check callback that returns the user.
    var checkCallback = function (req, callback) {
        callback(
            null, // error.
            true, // user authorizes the code creation.
            {
                id: userId
            }
        );
    };

    // retrieve the grant function from oauth2-server. This method setups up the
    // this context and such. The returned method is what express would normally
    // expect when handling a URL. eg. function(req, res, next)
    var authCodeGrantFn = oAuth2Server.oauthserver.authCodeGrant(checkCallback);

    // make the grant function run synchronously.
    var authCodeGrantFnSync = Async.wrap(function (done) {
        // the return object.
        var response = {
            success: false,
            error: null,
            authorizationCode: null,
            redirectToUri: null
        };

        // create mock express app.
        var mockApp = express();
        var req = mockApp.request;

        // set the request body values. In a typical express setup, the body
        // would be parsed by the body-parser package. We are cutting out
        // the middle man, so to speak.
        req.body = {
            client_id: clientId,
            response_type: responseType,
            redirect_uri: redirectUri
        };
        req.query = {};

        // listen for redirect calls.
        var res = mockApp.response;
        res.redirect = function (uri) {
            response.redirectToUri = uri;

            // we have what we need, trigger the done function with the response data.
            done(null, response);
        };

        // listen for errors.
        var next = function (err) {
            response.error = err;

            // we have what we need, trigger the done function with the response data.
            done(null, response);
        };

        // call the async function with the mocked params.
        authCodeGrantFn(req, res, next);
    });

    // run the auth code grant function in a synchronous manner.
    var result = authCodeGrantFnSync();


    // update the success flag.
    result.success = !result.error && !(/[?&]error=/g).test(result.redirectToUri);

    // set the authorization code.
    if (result.redirectToUri) {
        var match = result.redirectToUri.match(/[?&]code=([0-9a-f]+)/);
        if (match.length > 1) {
            result.authorizationCode = match[1];
        }

        // add the state to the url.
        if (state) {
            result.redirectToUri += '&state=' + state;
        }
    }
//console.log(result);

    return result;
};

Meteor.methods(methods);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_oauth2-server/client/subscribe.coffee                                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var subClients;
subClients = new SubsManager();
Meteor.startup(function () {
  return Tracker.autorun(function (c) {
    var client_id;

    if (subClients.ready()) {
      client_id = FlowRouter.getQueryParam("client_id");

      if (client_id) {
        return subClients.subscribe("OAuth2Clients", client_id);
      }
    }
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_oauth2-server/server/rest.coffee                                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies;
Cookies = Npm.require("cookies");
JsonRoutes.Middleware.use('/oauth2/sso', oAuth2Server.oauthserver.authorise());
JsonRoutes.add('get', '/oauth2/sso', function (req, res, next) {
  var accessToken, accessTokenStr, authToken, cookies, hashedToken, redirectUrl, ref, ref1, ref2, ref3, userId;
  redirectUrl = (req != null ? (ref = req.params) != null ? ref.redirect_url : void 0 : void 0) || (req != null ? (ref1 = req.query) != null ? ref1.redirect_url : void 0 : void 0) || '/';
  accessTokenStr = (req != null ? (ref2 = req.params) != null ? ref2.access_token : void 0 : void 0) || (req != null ? (ref3 = req.query) != null ? ref3.access_token : void 0 : void 0);
  accessToken = oAuth2Server.collections.accessToken.findOne({
    accessToken: accessTokenStr
  });
  cookies = new Cookies(req, res);
  userId = cookies.get("X-User-Id");
  authToken = cookies.get("X-Auth-Token");

  if (userId && authToken) {
    if (accessToken.userId !== userId) {
      Setup.clearAuthCookies(req, res);
      hashedToken = Accounts._hashLoginToken(authToken);
      Accounts.destroyToken(userId, hashedToken);
    } else {
      res.writeHead(301, {
        'Location': redirectUrl
      });
      return res.end('');
    }
  }

  authToken = Accounts._generateStampedLoginToken();
  hashedToken = Accounts._hashStampedToken(authToken);

  Accounts._insertHashedLoginToken(accessToken.userId, hashedToken);

  Setup.setAuthCookies(req, res, accessToken.userId, authToken.token);
  res.writeHead(301, {
    'Location': redirectUrl
  });
  return res.end('');
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_oauth2-server/server/publications/oauth2clients.coffee                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish("OAuth2Clients", function (clientId) {
  var collection;
  collection = oAuth2Server.collections.client;
  return collection.find({
    'clientId': clientId
  }, {
    fields: {
      clientName: 1
    }
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_oauth2-server/server/methods/oauth2authcodes.coffee                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  isAuthorized: function (userId, clientId) {
    var count;
    count = authCodesCollection.find({
      'userId': userId,
      'clientId': clientId
    }).count();

    if (count > 0) {
      return true;
    } else {
      return false;
    }
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:oauth2-server", {
  oAuth2Server: oAuth2Server,
  Random: Random
});

})();

//# sourceURL=meteor://💻app/packages/steedos_oauth2-server.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYXV0aDItc2VydmVyL2NsaWVudC9zdWJzY3JpYmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jbGllbnQvc3Vic2NyaWJlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYXV0aDItc2VydmVyL3NlcnZlci9yZXN0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Jlc3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29hdXRoMi1zZXJ2ZXIvc2VydmVyL3B1YmxpY2F0aW9ucy9vYXV0aDJjbGllbnRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYXV0aDItc2VydmVyL3NlcnZlci9tZXRob2RzL29hdXRoMmF1dGhjb2Rlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29hdXRoMmF1dGhjb2Rlcy5jb2ZmZWUiXSwibmFtZXMiOlsic3ViQ2xpZW50cyIsIlN1YnNNYW5hZ2VyIiwiTWV0ZW9yIiwic3RhcnR1cCIsIlRyYWNrZXIiLCJhdXRvcnVuIiwiYyIsImNsaWVudF9pZCIsInJlYWR5IiwiRmxvd1JvdXRlciIsImdldFF1ZXJ5UGFyYW0iLCJzdWJzY3JpYmUiLCJDb29raWVzIiwiTnBtIiwicmVxdWlyZSIsIkpzb25Sb3V0ZXMiLCJNaWRkbGV3YXJlIiwidXNlIiwib0F1dGgyU2VydmVyIiwib2F1dGhzZXJ2ZXIiLCJhdXRob3Jpc2UiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYWNjZXNzVG9rZW4iLCJhY2Nlc3NUb2tlblN0ciIsImF1dGhUb2tlbiIsImNvb2tpZXMiLCJoYXNoZWRUb2tlbiIsInJlZGlyZWN0VXJsIiwicmVmIiwicmVmMSIsInJlZjIiLCJyZWYzIiwidXNlcklkIiwicGFyYW1zIiwicmVkaXJlY3RfdXJsIiwicXVlcnkiLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9ucyIsImZpbmRPbmUiLCJnZXQiLCJTZXR1cCIsImNsZWFyQXV0aENvb2tpZXMiLCJBY2NvdW50cyIsIl9oYXNoTG9naW5Ub2tlbiIsImRlc3Ryb3lUb2tlbiIsIndyaXRlSGVhZCIsImVuZCIsIl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuIiwiX2hhc2hTdGFtcGVkVG9rZW4iLCJfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiIsInNldEF1dGhDb29raWVzIiwidG9rZW4iLCJwdWJsaXNoIiwiY2xpZW50SWQiLCJjb2xsZWN0aW9uIiwiY2xpZW50IiwiZmluZCIsImZpZWxkcyIsImNsaWVudE5hbWUiLCJtZXRob2RzIiwiaXNBdXRob3JpemVkIiwiY291bnQiLCJhdXRoQ29kZXNDb2xsZWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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LE1BQUl5QixTQUFKLENBQWMsR0FBZCxFQUFtQjtBQUFDLGdCQUFZbEI7QUFBYixHQUFuQjtBQUNBLFNBQU9QLElBQUkwQixHQUFKLENBQVEsRUFBUixDQUFQO0FBL0JELEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVQQS9DLE9BQU9xRCxPQUFQLENBQWUsZUFBZixFQUFnQyxVQUFDQyxRQUFEO0FBQy9CLE1BQUFDLFVBQUE7QUFBQUEsZUFBYXZDLGFBQWFzQixXQUFiLENBQXlCa0IsTUFBdEM7QUFDQSxTQUFPRCxXQUFXRSxJQUFYLENBQWdCO0FBQUMsZ0JBQVlIO0FBQWIsR0FBaEIsRUFBd0M7QUFBQ0ksWUFBTztBQUFDQyxrQkFBVztBQUFaO0FBQVIsR0FBeEMsQ0FBUDtBQUZELEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTNELE9BQU80RCxPQUFQLENBQ0M7QUFBQUMsZ0JBQWMsVUFBQzVCLE1BQUQsRUFBUXFCLFFBQVI7QUFDUCxRQUFBUSxLQUFBO0FBQUFBLFlBQVFDLG9CQUFvQk4sSUFBcEIsQ0FBeUI7QUFBQyxnQkFBU3hCLE1BQVY7QUFBaUIsa0JBQVdxQjtBQUE1QixLQUF6QixFQUFnRVEsS0FBaEUsRUFBUjs7QUFDQSxRQUFHQSxRQUFRLENBQVg7QUFDSSxhQUFPLElBQVA7QUFESjtBQUdJLGFBQU8sS0FBUDtBQ0tQO0FEVko7QUFBQSxDQURELEUiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2F1dGgyLXNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInN1YkNsaWVudHMgPSBuZXcgU3Vic01hbmFnZXIoKVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRUcmFja2VyLmF1dG9ydW4gKGMpLT5cclxuICAgICAgICBpZiBzdWJDbGllbnRzLnJlYWR5KClcclxuICAgICAgICAgICAgY2xpZW50X2lkID0gRmxvd1JvdXRlci5nZXRRdWVyeVBhcmFtKFwiY2xpZW50X2lkXCIpXHJcbiAgICAgICAgICAgIGlmIGNsaWVudF9pZFxyXG4gICAgICAgICAgICAgICAgc3ViQ2xpZW50cy5zdWJzY3JpYmUgXCJPQXV0aDJDbGllbnRzXCIsY2xpZW50X2lkIiwidmFyIHN1YkNsaWVudHM7XG5cbnN1YkNsaWVudHMgPSBuZXcgU3Vic01hbmFnZXIoKTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oYykge1xuICAgIHZhciBjbGllbnRfaWQ7XG4gICAgaWYgKHN1YkNsaWVudHMucmVhZHkoKSkge1xuICAgICAgY2xpZW50X2lkID0gRmxvd1JvdXRlci5nZXRRdWVyeVBhcmFtKFwiY2xpZW50X2lkXCIpO1xuICAgICAgaWYgKGNsaWVudF9pZCkge1xuICAgICAgICByZXR1cm4gc3ViQ2xpZW50cy5zdWJzY3JpYmUoXCJPQXV0aDJDbGllbnRzXCIsIGNsaWVudF9pZCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiQ29va2llcyA9IE5wbS5yZXF1aXJlKFwiY29va2llc1wiKVxyXG5cclxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZShcclxuXHQnL29hdXRoMi9zc28nLFxyXG5cdG9BdXRoMlNlcnZlci5vYXV0aHNlcnZlci5hdXRob3Jpc2UoKVxyXG4pXHJcblxyXG5Kc29uUm91dGVzLmFkZCAnZ2V0JywgJy9vYXV0aDIvc3NvJywgKHJlcSwgcmVzLCBuZXh0KS0+XHJcblxyXG5cdHJlZGlyZWN0VXJsID0gcmVxPy5wYXJhbXM/LnJlZGlyZWN0X3VybCB8fCByZXE/LnF1ZXJ5Py5yZWRpcmVjdF91cmwgfHwgJy8nXHJcblx0XHJcblx0YWNjZXNzVG9rZW5TdHIgPSByZXE/LnBhcmFtcz8uYWNjZXNzX3Rva2VuIHx8IHJlcT8ucXVlcnk/LmFjY2Vzc190b2tlblxyXG5cdFxyXG5cdGFjY2Vzc1Rva2VuID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuLmZpbmRPbmUoXHJcblx0XHR7YWNjZXNzVG9rZW46IGFjY2Vzc1Rva2VuU3RyfVxyXG5cdClcclxuXHRcclxuXHRjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XHJcblx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuXHQjIOWmguaenOacrOWcsOW3sue7j+aciWNvb2tpZXNcclxuXHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0IyDmr5TovoPmnKzlnLDmlbDmja7lkozlvZPliY3nlKjmiLfmmK/lkKbkuIDoh7RcclxuXHRcdGlmIGFjY2Vzc1Rva2VuLnVzZXJJZCE9dXNlcklkXHJcblx0XHRcdCMg5LiN5LiA6Ie077yM5riF6Zmk5L+h5oGvXHJcblx0XHRcdFNldHVwLmNsZWFyQXV0aENvb2tpZXMocmVxLCByZXMpXHJcblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdFx0QWNjb3VudHMuZGVzdHJveVRva2VuKHVzZXJJZCwgaGFzaGVkVG9rZW4pXHJcblx0XHRlbHNlXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAxLCB7J0xvY2F0aW9uJzogcmVkaXJlY3RVcmwgfVxyXG5cdFx0XHRyZXR1cm4gcmVzLmVuZCAnJ1xyXG5cdCMg6aqM6K+B5oiQ5Yqf77yM55m75b2VXHJcblx0YXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKVxyXG5cdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4gYXV0aFRva2VuXHJcblx0QWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4gYWNjZXNzVG9rZW4udXNlcklkLGhhc2hlZFRva2VuXHJcblx0U2V0dXAuc2V0QXV0aENvb2tpZXMgcmVxLHJlcyxhY2Nlc3NUb2tlbi51c2VySWQsYXV0aFRva2VuLnRva2VuXHJcblx0cmVzLndyaXRlSGVhZCAzMDEsIHsnTG9jYXRpb24nOiByZWRpcmVjdFVybCB9XHJcblx0cmV0dXJuIHJlcy5lbmQgJydcclxuXHJcblxyXG5cclxuIiwidmFyIENvb2tpZXM7XG5cbkNvb2tpZXMgPSBOcG0ucmVxdWlyZShcImNvb2tpZXNcIik7XG5cbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoJy9vYXV0aDIvc3NvJywgb0F1dGgyU2VydmVyLm9hdXRoc2VydmVyLmF1dGhvcmlzZSgpKTtcblxuSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvb2F1dGgyL3NzbycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhY2Nlc3NUb2tlbiwgYWNjZXNzVG9rZW5TdHIsIGF1dGhUb2tlbiwgY29va2llcywgaGFzaGVkVG9rZW4sIHJlZGlyZWN0VXJsLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHVzZXJJZDtcbiAgcmVkaXJlY3RVcmwgPSAocmVxICE9IG51bGwgPyAocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWRpcmVjdF91cmwgOiB2b2lkIDAgOiB2b2lkIDApIHx8IChyZXEgIT0gbnVsbCA/IChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMS5yZWRpcmVjdF91cmwgOiB2b2lkIDAgOiB2b2lkIDApIHx8ICcvJztcbiAgYWNjZXNzVG9rZW5TdHIgPSAocmVxICE9IG51bGwgPyAocmVmMiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYyLmFjY2Vzc190b2tlbiA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgKHJlcSAhPSBudWxsID8gKHJlZjMgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYzLmFjY2Vzc190b2tlbiA6IHZvaWQgMCA6IHZvaWQgMCk7XG4gIGFjY2Vzc1Rva2VuID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuLmZpbmRPbmUoe1xuICAgIGFjY2Vzc1Rva2VuOiBhY2Nlc3NUb2tlblN0clxuICB9KTtcbiAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGlmIChhY2Nlc3NUb2tlbi51c2VySWQgIT09IHVzZXJJZCkge1xuICAgICAgU2V0dXAuY2xlYXJBdXRoQ29va2llcyhyZXEsIHJlcyk7XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgQWNjb3VudHMuZGVzdHJveVRva2VuKHVzZXJJZCwgaGFzaGVkVG9rZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMSwge1xuICAgICAgICAnTG9jYXRpb24nOiByZWRpcmVjdFVybFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzLmVuZCgnJyk7XG4gICAgfVxuICB9XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4oYWNjZXNzVG9rZW4udXNlcklkLCBoYXNoZWRUb2tlbik7XG4gIFNldHVwLnNldEF1dGhDb29raWVzKHJlcSwgcmVzLCBhY2Nlc3NUb2tlbi51c2VySWQsIGF1dGhUb2tlbi50b2tlbik7XG4gIHJlcy53cml0ZUhlYWQoMzAxLCB7XG4gICAgJ0xvY2F0aW9uJzogcmVkaXJlY3RVcmxcbiAgfSk7XG4gIHJldHVybiByZXMuZW5kKCcnKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJPQXV0aDJDbGllbnRzXCIsIChjbGllbnRJZCktPlxyXG5cdGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuY2xpZW50XHJcblx0cmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7J2NsaWVudElkJzogY2xpZW50SWR9LCB7ZmllbGRzOntjbGllbnROYW1lOjF9fSkiLCJNZXRlb3IubWV0aG9kc1xyXG5cdGlzQXV0aG9yaXplZDogKHVzZXJJZCxjbGllbnRJZCkgLT5cclxuICAgICAgICBjb3VudCA9IGF1dGhDb2Rlc0NvbGxlY3Rpb24uZmluZCh7J3VzZXJJZCc6dXNlcklkLCdjbGllbnRJZCc6Y2xpZW50SWR9KS5jb3VudCgpXHJcbiAgICAgICAgaWYgY291bnQgPiAwXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2UiLCJNZXRlb3IubWV0aG9kcyh7XG4gIGlzQXV0aG9yaXplZDogZnVuY3Rpb24odXNlcklkLCBjbGllbnRJZCkge1xuICAgIHZhciBjb3VudDtcbiAgICBjb3VudCA9IGF1dGhDb2Rlc0NvbGxlY3Rpb24uZmluZCh7XG4gICAgICAndXNlcklkJzogdXNlcklkLFxuICAgICAgJ2NsaWVudElkJzogY2xpZW50SWRcbiAgICB9KS5jb3VudCgpO1xuICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59KTtcbiJdfQ==
