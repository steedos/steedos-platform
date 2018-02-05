Meteor OAuth2 Server
===
Use your meteor application as an oauth2 server. This package will give the
developer the tools necessary to get oauth2 running easily. Look at the
resourceServer example for a detailed demonstration on how to get things
working.

## Installation
`meteor add prime8consulting:meteor-oauth2-server`


## API

oAuth2Server - Exported so all code in meteor can access the functionality.
 - pubSubNames
   - authCodes - Constant string representing the auth codes pub/sub.

   - refreshTokens - Constant string representing the refresh token pub/sub.

 - methodNames
   - authCodeGrant - Constant string representing th authCodeGran meteor method.

 - collections
   - refreshToken - Collection of the refresh tokens.

   - authCode - Collection of the authorization codes.

   - accessToken - (server) Collection of the access tokens.

   - client - (server) Collection of the clients authorized to use the oauth2 service.

 - oauthserver - (server) Underlying node-oauth2-server object used to handle the oauth2 requests and responses.

 - subscribeTo (client)
   - authCode - Wrapper function to subscribe to the auth code subscription. Returns a standard subscription handle.

   Example:
   ```javascript
       // subscribe to a user's authorization codes.
       oAuth2Server.subscribeTo.authCode();
   ```

   - refreshTokens - Wrapper function subscribe to the refresh tokens subscription. Returns a standard subscription handle.

   Example:
   ```javascript
      // subscribe to a user's refresh tokens.
      oAuth2Server.subscribeTo.refreshTokens();
    ```

 - callMethod (client)
   - authCodeGrant - Wrapper for Meteor.method to create an authorization code. This is an async function
   and a callback must be provided to be of any use.

   Example:
   ```javascript
   oAuth2Server.callMethod.authCodeGrant(client_id, redirect_uri, response_type, scope, state, function(err, authCodeGrantResult) {
       // see below for a description of authCodeGrantResult
   });
   ```

    authCodeGrantResult
    ```javascript
    {
        success: boolean,
        error: any,
        authorizationCode: string,
        redirectToUri: string
    }
    ```

## Examples
There is an example meteor application that demonstrates authentication from
another meteor application.
https://github.com/prime-8-consulting/meteor-oauth2/tree/master/examples

Checkout the resourceServer example application for a full example on how this
package can and should be used. Your can also run both examples side-by-side
to watch the entire login workflow.