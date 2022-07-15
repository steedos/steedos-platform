"use strict";
const { Provider } = require('oidc-provider');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: 'oidc-provider',
	mixins: [],
	/**
	 * Settings
	 */
	settings: {
	},

	/**
	 * Dependencies
	 */
	dependencies: ['steedos-server'],

	/**
	 * Actions
	 */
	actions: {

	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		async findAccount(ctx, sub, token) {
			// @param ctx - koa request context
			// @param sub {string} - account identifier (subject)
			// @param token - is a reference to the token used for which a given account is being loaded,
			//   is undefined in scenarios where claims are returned from authorization endpoint
			return {
			  accountId: sub,
			  // @param use {string} - can either be "id_token" or "userinfo", depending on
			  //   where the specific claims are intended to be put in
			  // @param scope {string} - the intended scope, while oidc-provider will mask
			  //   claims depending on the scope automatically you might want to skip
			  //   loading some claims from external resources or through db projection etc. based on this
			  //   detail or not return them in ID Tokens but only UserInfo and so on
			  // @param claims {object} - the part of the claims authorization parameter for either
			  //   "id_token" or "userinfo" (depends on the "use" param)
			  // @param rejected {Array[String]} - claim names that were rejected by the end-user, you might
			  //   want to skip loading some claims from external resources or through db projection
			  async claims(use, scope, claims, rejected) {
				return { sub };
			  },
			};
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

		this.oidc = new Provider(process.env.ROOT_URL, {
			// ... see the available options in Configuration options section
			clients: [{
			  client_id: 'foo',
			  client_secret: 'foo',
			  redirect_uris: ['https://jwt.io'],
			  response_types: ['id_token'],
			  grant_types: ['implicit'],
			  token_endpoint_auth_method: 'none',
			  // + other client properties
			}],
			// ...
			findAccount: this.findAccount,
			cookies: {
			//   keys: process.env.SECURE_KEY.split(','),
			},
		});
		
		// Gitpod has a proxy in front that terminates ssl, you should trust the proxy.
		this.oidc.proxy = true;

		// express/nodejs style application callback (req, res, next) for use with express apps, see /examples/express.js
		WebApp.connectHandlers.use('/oidc', this.oidc.callback());
		
		this.logger.warn(`service started, check ${process.env.ROOT_URL}/oidc/.well-known/openid-configuration`);
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
