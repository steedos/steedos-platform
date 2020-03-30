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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.all('/oauth2/token', oAuth2Server.oauthserver.grant());

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
// packages/steedos_oauth2-server/i18n/en.i18n.json.js                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Package['universe:i18n'].i18n.addTranslations('en','',{"authorize":"Authorize","get_user_info":"Get your account information","get_follow_permission":"will get the follow permission"});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_oauth2-server/i18n/zh-CN.i18n.json.js                                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"authorize":"授权","get_user_info":"获取您的账户信息","get_follow_permission":"将获得以下权限"});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYXV0aDItc2VydmVyL2NsaWVudC9zdWJzY3JpYmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jbGllbnQvc3Vic2NyaWJlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYXV0aDItc2VydmVyL3NlcnZlci9yZXN0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Jlc3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29hdXRoMi1zZXJ2ZXIvc2VydmVyL3B1YmxpY2F0aW9ucy9vYXV0aDJjbGllbnRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYXV0aDItc2VydmVyL3NlcnZlci9tZXRob2RzL29hdXRoMmF1dGhjb2Rlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29hdXRoMmF1dGhjb2Rlcy5jb2ZmZWUiXSwibmFtZXMiOlsic3ViQ2xpZW50cyIsIlN1YnNNYW5hZ2VyIiwiTWV0ZW9yIiwic3RhcnR1cCIsIlRyYWNrZXIiLCJhdXRvcnVuIiwiYyIsImNsaWVudF9pZCIsInJlYWR5IiwiRmxvd1JvdXRlciIsImdldFF1ZXJ5UGFyYW0iLCJzdWJzY3JpYmUiLCJDb29raWVzIiwiTnBtIiwicmVxdWlyZSIsIkpzb25Sb3V0ZXMiLCJNaWRkbGV3YXJlIiwidXNlIiwib0F1dGgyU2VydmVyIiwib2F1dGhzZXJ2ZXIiLCJhdXRob3Jpc2UiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYWNjZXNzVG9rZW4iLCJhY2Nlc3NUb2tlblN0ciIsImF1dGhUb2tlbiIsImNvb2tpZXMiLCJoYXNoZWRUb2tlbiIsInJlZGlyZWN0VXJsIiwicmVmIiwicmVmMSIsInJlZjIiLCJyZWYzIiwidXNlcklkIiwicGFyYW1zIiwicmVkaXJlY3RfdXJsIiwicXVlcnkiLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9ucyIsImZpbmRPbmUiLCJnZXQiLCJTZXR1cCIsImNsZWFyQXV0aENvb2tpZXMiLCJBY2NvdW50cyIsIl9oYXNoTG9naW5Ub2tlbiIsImRlc3Ryb3lUb2tlbiIsIndyaXRlSGVhZCIsImVuZCIsIl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuIiwiX2hhc2hTdGFtcGVkVG9rZW4iLCJfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiIsInNldEF1dGhDb29raWVzIiwidG9rZW4iLCJwdWJsaXNoIiwiY2xpZW50SWQiLCJjb2xsZWN0aW9uIiwiY2xpZW50IiwiZmluZCIsImZpZWxkcyIsImNsaWVudE5hbWUiLCJtZXRob2RzIiwiaXNBdXRob3JpemVkIiwiY291bnQiLCJhdXRoQ29kZXNDb2xsZWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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VSxNQUF6QyxFQUFnRFIsVUFBVTJCLEtBQTFEO0FBQ0EvQixNQUFJeUIsU0FBSixDQUFjLEdBQWQsRUFBbUI7QUFBQyxnQkFBWWxCO0FBQWIsR0FBbkI7QUFDQSxTQUFPUCxJQUFJMEIsR0FBSixDQUFRLEVBQVIsQ0FBUDtBQS9CRCxHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFUEEvQyxPQUFPcUQsT0FBUCxDQUFlLGVBQWYsRUFBZ0MsVUFBQ0MsUUFBRDtBQUMvQixNQUFBQyxVQUFBO0FBQUFBLGVBQWF2QyxhQUFhc0IsV0FBYixDQUF5QmtCLE1BQXRDO0FBQ0EsU0FBT0QsV0FBV0UsSUFBWCxDQUFnQjtBQUFDLGdCQUFZSDtBQUFiLEdBQWhCLEVBQXdDO0FBQUNJLFlBQU87QUFBQ0Msa0JBQVc7QUFBWjtBQUFSLEdBQXhDLENBQVA7QUFGRCxHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEzRCxPQUFPNEQsT0FBUCxDQUNDO0FBQUFDLGdCQUFjLFVBQUM1QixNQUFELEVBQVFxQixRQUFSO0FBQ1AsUUFBQVEsS0FBQTtBQUFBQSxZQUFRQyxvQkFBb0JOLElBQXBCLENBQXlCO0FBQUMsZ0JBQVN4QixNQUFWO0FBQWlCLGtCQUFXcUI7QUFBNUIsS0FBekIsRUFBZ0VRLEtBQWhFLEVBQVI7O0FBQ0EsUUFBR0EsUUFBUSxDQUFYO0FBQ0ksYUFBTyxJQUFQO0FBREo7QUFHSSxhQUFPLEtBQVA7QUNLUDtBRFZKO0FBQUEsQ0FERCxFIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29hdXRoMi1zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJzdWJDbGllbnRzID0gbmV3IFN1YnNNYW5hZ2VyKClcclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcblx0VHJhY2tlci5hdXRvcnVuIChjKS0+XHJcbiAgICAgICAgaWYgc3ViQ2xpZW50cy5yZWFkeSgpXHJcbiAgICAgICAgICAgIGNsaWVudF9pZCA9IEZsb3dSb3V0ZXIuZ2V0UXVlcnlQYXJhbShcImNsaWVudF9pZFwiKVxyXG4gICAgICAgICAgICBpZiBjbGllbnRfaWRcclxuICAgICAgICAgICAgICAgIHN1YkNsaWVudHMuc3Vic2NyaWJlIFwiT0F1dGgyQ2xpZW50c1wiLGNsaWVudF9pZCIsInZhciBzdWJDbGllbnRzO1xuXG5zdWJDbGllbnRzID0gbmV3IFN1YnNNYW5hZ2VyKCk7XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKGMpIHtcbiAgICB2YXIgY2xpZW50X2lkO1xuICAgIGlmIChzdWJDbGllbnRzLnJlYWR5KCkpIHtcbiAgICAgIGNsaWVudF9pZCA9IEZsb3dSb3V0ZXIuZ2V0UXVlcnlQYXJhbShcImNsaWVudF9pZFwiKTtcbiAgICAgIGlmIChjbGllbnRfaWQpIHtcbiAgICAgICAgcmV0dXJuIHN1YkNsaWVudHMuc3Vic2NyaWJlKFwiT0F1dGgyQ2xpZW50c1wiLCBjbGllbnRfaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIkNvb2tpZXMgPSBOcG0ucmVxdWlyZShcImNvb2tpZXNcIilcclxuXHJcbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoXHJcblx0Jy9vYXV0aDIvc3NvJyxcclxuXHRvQXV0aDJTZXJ2ZXIub2F1dGhzZXJ2ZXIuYXV0aG9yaXNlKClcclxuKVxyXG5cclxuSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvb2F1dGgyL3NzbycsIChyZXEsIHJlcywgbmV4dCktPlxyXG5cclxuXHRyZWRpcmVjdFVybCA9IHJlcT8ucGFyYW1zPy5yZWRpcmVjdF91cmwgfHwgcmVxPy5xdWVyeT8ucmVkaXJlY3RfdXJsIHx8ICcvJ1xyXG5cdFxyXG5cdGFjY2Vzc1Rva2VuU3RyID0gcmVxPy5wYXJhbXM/LmFjY2Vzc190b2tlbiB8fCByZXE/LnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cclxuXHRcclxuXHRhY2Nlc3NUb2tlbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlbi5maW5kT25lKFxyXG5cdFx0e2FjY2Vzc1Rva2VuOiBhY2Nlc3NUb2tlblN0cn1cclxuXHQpXHJcblx0XHJcblx0Y29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xyXG5cdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcblx0IyDlpoLmnpzmnKzlnLDlt7Lnu4/mnIljb29raWVzXHJcblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cclxuXHRcdCMg5q+U6L6D5pys5Zyw5pWw5o2u5ZKM5b2T5YmN55So5oi35piv5ZCm5LiA6Ie0XHJcblx0XHRpZiBhY2Nlc3NUb2tlbi51c2VySWQhPXVzZXJJZFxyXG5cdFx0XHQjIOS4jeS4gOiHtO+8jOa4hemZpOS/oeaBr1xyXG5cdFx0XHRTZXR1cC5jbGVhckF1dGhDb29raWVzKHJlcSwgcmVzKVxyXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHRcdEFjY291bnRzLmRlc3Ryb3lUb2tlbih1c2VySWQsIGhhc2hlZFRva2VuKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMSwgeydMb2NhdGlvbic6IHJlZGlyZWN0VXJsIH1cclxuXHRcdFx0cmV0dXJuIHJlcy5lbmQgJydcclxuXHQjIOmqjOivgeaIkOWKn++8jOeZu+W9lVxyXG5cdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcclxuXHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxyXG5cdEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIGFjY2Vzc1Rva2VuLnVzZXJJZCxoYXNoZWRUb2tlblxyXG5cdFNldHVwLnNldEF1dGhDb29raWVzIHJlcSxyZXMsYWNjZXNzVG9rZW4udXNlcklkLGF1dGhUb2tlbi50b2tlblxyXG5cdHJlcy53cml0ZUhlYWQgMzAxLCB7J0xvY2F0aW9uJzogcmVkaXJlY3RVcmwgfVxyXG5cdHJldHVybiByZXMuZW5kICcnXHJcblxyXG5cclxuXHJcbiIsInZhciBDb29raWVzO1xuXG5Db29raWVzID0gTnBtLnJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKCcvb2F1dGgyL3NzbycsIG9BdXRoMlNlcnZlci5vYXV0aHNlcnZlci5hdXRob3Jpc2UoKSk7XG5cbkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL29hdXRoMi9zc28nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWNjZXNzVG9rZW4sIGFjY2Vzc1Rva2VuU3RyLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGhhc2hlZFRva2VuLCByZWRpcmVjdFVybCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCB1c2VySWQ7XG4gIHJlZGlyZWN0VXJsID0gKHJlcSAhPSBudWxsID8gKHJlZiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYucmVkaXJlY3RfdXJsIDogdm9pZCAwIDogdm9pZCAwKSB8fCAocmVxICE9IG51bGwgPyAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEucmVkaXJlY3RfdXJsIDogdm9pZCAwIDogdm9pZCAwKSB8fCAnLyc7XG4gIGFjY2Vzc1Rva2VuU3RyID0gKHJlcSAhPSBudWxsID8gKHJlZjIgPSByZXEucGFyYW1zKSAhPSBudWxsID8gcmVmMi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDAgOiB2b2lkIDApIHx8IChyZXEgIT0gbnVsbCA/IChyZWYzID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMy5hY2Nlc3NfdG9rZW4gOiB2b2lkIDAgOiB2b2lkIDApO1xuICBhY2Nlc3NUb2tlbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlbi5maW5kT25lKHtcbiAgICBhY2Nlc3NUb2tlbjogYWNjZXNzVG9rZW5TdHJcbiAgfSk7XG4gIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICBpZiAoYWNjZXNzVG9rZW4udXNlcklkICE9PSB1c2VySWQpIHtcbiAgICAgIFNldHVwLmNsZWFyQXV0aENvb2tpZXMocmVxLCByZXMpO1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIEFjY291bnRzLmRlc3Ryb3lUb2tlbih1c2VySWQsIGhhc2hlZFRva2VuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDEsIHtcbiAgICAgICAgJ0xvY2F0aW9uJzogcmVkaXJlY3RVcmxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcy5lbmQoJycpO1xuICAgIH1cbiAgfVxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuKGF1dGhUb2tlbik7XG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuKGFjY2Vzc1Rva2VuLnVzZXJJZCwgaGFzaGVkVG9rZW4pO1xuICBTZXR1cC5zZXRBdXRoQ29va2llcyhyZXEsIHJlcywgYWNjZXNzVG9rZW4udXNlcklkLCBhdXRoVG9rZW4udG9rZW4pO1xuICByZXMud3JpdGVIZWFkKDMwMSwge1xuICAgICdMb2NhdGlvbic6IHJlZGlyZWN0VXJsXG4gIH0pO1xuICByZXR1cm4gcmVzLmVuZCgnJyk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwiT0F1dGgyQ2xpZW50c1wiLCAoY2xpZW50SWQpLT5cclxuXHRjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmNsaWVudFxyXG5cdHJldHVybiBjb2xsZWN0aW9uLmZpbmQoeydjbGllbnRJZCc6IGNsaWVudElkfSwge2ZpZWxkczp7Y2xpZW50TmFtZToxfX0pIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRpc0F1dGhvcml6ZWQ6ICh1c2VySWQsY2xpZW50SWQpIC0+XHJcbiAgICAgICAgY291bnQgPSBhdXRoQ29kZXNDb2xsZWN0aW9uLmZpbmQoeyd1c2VySWQnOnVzZXJJZCwnY2xpZW50SWQnOmNsaWVudElkfSkuY291bnQoKVxyXG4gICAgICAgIGlmIGNvdW50ID4gMFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBpc0F1dGhvcml6ZWQ6IGZ1bmN0aW9uKHVzZXJJZCwgY2xpZW50SWQpIHtcbiAgICB2YXIgY291bnQ7XG4gICAgY291bnQgPSBhdXRoQ29kZXNDb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgJ3VzZXJJZCc6IHVzZXJJZCxcbiAgICAgICdjbGllbnRJZCc6IGNsaWVudElkXG4gICAgfSkuY291bnQoKTtcbiAgICBpZiAoY291bnQgPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufSk7XG4iXX0=
