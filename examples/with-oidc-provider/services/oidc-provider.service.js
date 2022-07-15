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
		// ... see the available options in Configuration options section
		clients: [{
		  client_id: 'foo',
		  client_secret: 'bar',
		  redirect_uris: ['http://lvh.me:8080/cb'],
		  // + other client properties
		}],
		// ...
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

		this.oidc = new Provider('http://localhost:3000', this.settings);
		
		// express/nodejs style application callback (req, res, next) for use with express apps, see /examples/express.js
		WebApp.connectHandlers.use('/oidc', this.oidc.callback());
		
		this.logger.warn('oidc started, check /oidc/.well-known/openid-configuration');
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
