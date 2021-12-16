const _ = require('underscore');
const randomString = require("crypto-random-string");
const accounts = require('@steedos/accounts');

const GrantTypes = ['authorization_code', 'refresh_token']

const getOAuth2ClientBody = (clientId, clientName, clientSecret, clientUri, logoUri, responseTypes, scope, callbacks) => {
    return {
        client_id: clientId,
        client_name: clientName,
        client_secret: clientSecret,
        client_uri: clientUri,
        logo_uri: logoUri,
        response_types: responseTypes,
        scope: scope,
        callbacks: callbacks,
        redirect_uris: [callbacks],
        grant_types: GrantTypes,
        token_endpoint_auth_method: 'client_secret_post'
    }
}

//grant-types authorization_code,refresh_token
//token-endpoint-auth-method client_secret_post
const createOAuth2Client = async (clientId, clientName, clientSecret, clientUri, logoUri, responseTypes, scope, callbacks) => {
    console.log(`createOAuth2Client`, clientId);
    return await accounts.hydraAdmin.createOAuth2Client(getOAuth2ClientBody(clientId, clientName, clientSecret, clientUri, logoUri, responseTypes, scope, callbacks))
};

const deleteOAuth2Client = async (clientId) => {
    console.log(`deleteOAuth2Client`, clientId);
    return await accounts.hydraAdmin.deleteOAuth2Client(clientId);
}

const updateOAuth2Client = async (clientId, clientName, clientSecret, clientUri, logoUri, responseTypes, scope, callbacks) => {
    console.log(`updateOAuth2Client`, clientId);
    return await accounts.hydraAdmin.createOAuth2Client(getOAuth2ClientBody(clientId, clientName, clientSecret, clientUri, logoUri, responseTypes, scope, callbacks))
};

const upsetOAuth2Client = async (clientId, clientName, clientSecret, clientUri, logoUri, responseTypes, scope, callbacks) => {
    const client = await accounts.hydraAdmin.getOAuth2Client(clientId);
    if (client) {
        return await updateOAuth2Client(clientId, clientName, clientSecret, clientUri, logoUri, responseTypes, scope, callbacks)
    } else {
        return await createOAuth2Client(clientId, clientName, clientSecret, clientUri, logoUri, responseTypes, scope, callbacks)
    }
}

const getResponseTypes = (oauth2_scopes) => {
    const scopes = ['code', 'id_token'];
    _.each(oauth2_scopes, (oauth2_scope) => {
        if (oauth2_scope === 'profile') {
            scopes.push('steedos_id')
            scopes.push('name')
            scopes.push('username')
            scopes.push('mobile')
            scopes.push('email')
            // scopes.push('job_number')
            scopes.push('locale')
            scopes.push('space')
            // scopes.push('profile')
            scopes.push('userId')
            scopes.push('mobile_verified')
            scopes.push('email_verified')
            scopes.push('utcOffset')
        }
    })
    return scopes;
}

module.exports = {
    listenTo: 'apps',
    beforeInsert: async function () {
        const { doc } = this;
        if (doc.oauth2_enabled) {
            doc.oauth2_client_secret = randomString(40);
        };
    },
    afterInsert: async function () {
        const { doc } = this;

        if (doc.oauth2_enabled) {
            const responseTypes = getResponseTypes(doc.oauth2_scopes)
            const result = await createOAuth2Client(
                doc.code,
                doc.name,
                doc.oauth2_client_secret,
                doc.oauth2_home_url,
                Meteor.absoluteUrl(`/api/files/images/${doc.oauth2_logo}`),
                responseTypes,
                doc.oauth2_scopes.join(','),
                doc.oauth2_callback_url
            )
            console.log(`result`, result);
        };

    },
    beforeUpdate: async function () {
        const { doc, id } = this
        if (doc.oauth2_enabled) {
            const record = await objectql.getObject('apps').findOne(id);
            if (!record.oauth2_client_secret) {
                doc.oauth2_client_secret = randomString(40);
            }
        }
    },
    afterUpdate: async function () {
        const { previousDoc, id, doc } = this;
        const newDoc = await objectql.getObject('apps').findOne(id)

        if ((_.has(doc, 'oauth2_enabled') && previousDoc.oauth2_enabled && newDoc.oauth2_enabled != true) || (_.has(doc, 'code') && previousDoc.code != newDoc.code)) {
            await deleteOAuth2Client(newDoc.code)
        }

        if (newDoc.oauth2_enabled) {
            const responseTypes = getResponseTypes(newDoc.oauth2_scopes)
            await upsetOAuth2Client(
                newDoc.code,
                newDoc.name,
                newDoc.oauth2_client_secret,
                newDoc.oauth2_home_url,
                Meteor.absoluteUrl(`/api/files/images/${newDoc.oauth2_logo}`),
                responseTypes,
                newDoc.oauth2_scopes.join(','),
                newDoc.oauth2_callback_url)
        }
    },
    afterDelete: async function () {
        const { previousDoc } = this;
        if (previousDoc.oauth2_enabled) {
            await deleteOAuth2Client(doc.code)
        }
    }
}