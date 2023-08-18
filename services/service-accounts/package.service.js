"use strict";
const project = require('./package.json');
const serviceName = project.name;
const auth = require("@steedos/auth");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: serviceName,
	namespace: "steedos",
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: serviceName
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [],
	/**
	 * Actions
	 */
	actions: {
		getUserSession: {
			async handler(ctx) {
				const { authorization, userId, spaceId } = ctx.params;
				let authToken = '';
				let params = {};
				if (authorization) {
					if(authorization.split(' ')[0] == 'Bearer'){
						authToken = authorization.split(' ')[1];
					}else{
						authToken = authorization
					}
					if (authToken.startsWith('apikey,')) {
						params.token = authToken;
					} else {
						params.spaceId = authToken.split(',')[0];
						params.token = authToken.split(',')[1];
					}
					return await auth.getSession(params.token, params.spaceId);
				}else if(userId && spaceId){
					return await auth.getSessionByUserId(userId, spaceId)
				}
            }
		}
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
	async started(ctx) {
		
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		
	}
};
