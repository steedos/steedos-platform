oAuth2Server.subscribeTo = {
    authCode: function() {
        return Meteor.subscribe(oAuth2Server.pubSubNames.authCodes);
    },
    refreshTokens: function() {
        return Meteor.subscribe(oAuth2Server.pubSubNames.refreshTokens);
    }
};

oAuth2Server.callMethod = {
    /**
     *
     * @param client_id : string - The client id.
     * @param redirect_uri : string - The Uri to goto after processing.
     * @param response_type : string - Oauth response type.
     * @param scope : string[] - An array of scopes.
     * @param state : string - A state variable provided by the client. It will be added onto the redirectToUri.
     * @param callback
     */
    authCodeGrant: function(client_id, redirect_uri, response_type, scope, state, callback) {
        Meteor.call(
            oAuth2Server.methodNames.authCodeGrant,
            client_id,
            redirect_uri,
            response_type,
            scope,
            state,
            callback
        );
    }
};

