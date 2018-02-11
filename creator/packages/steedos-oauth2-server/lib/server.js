// get the node modules.
var express = Npm.require('express'),
    bodyParser = Npm.require('body-parser'),
    oauthserver = Npm.require('oauth2-server');


// configure the server-side collections. The rest of the collections
// exist in common.js and are for both client and server.
var accessTokenCollection = new Meteor.Collection('OAuth2AccessTokens');
// var clientsCollection = new Meteor.Collection('OAuth2Clients');

var clientsCollection = Creator.Collections['OAuth2Clients'];

if(Meteor.isServer){
    accessTokenCollection.before.insert(function(userId, doc){
        spaceId = db.space_users.findOne({user: doc.userId}).space;
        doc.spaceId = spaceId;
    });
}

// setup the node oauth2 model.
var meteorModel = new MeteorModel(
    accessTokenCollection,
    refreshTokensCollection,
    authCodesCollection,
    true
);


// setup the exported object.
oAuth2Server.oauthserver = oauthserver({
    model: meteorModel,
    grants: ['authorization_code'],
    debug: true
});

oAuth2Server.collections.accessToken = accessTokenCollection;
oAuth2Server.collections.client = clientsCollection;

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
