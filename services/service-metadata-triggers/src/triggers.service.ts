"use strict";
import { ActionHandlers, METADATA_TYPE } from './actionsHandler';

module.exports = {
	name: "triggers",
	namespace: "steedos",
	/**
	 * Settings
	 */
	settings: {
		// Exposed port
		port: process.env.PORT || 3040,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		routes: [
			{
				path: "/api",

				whitelist: [
					"**"
				],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {

				},

				/** 
				 * Before call hook. You can check the request.
				 * @param {Context} ctx 
				 * @param {Object} route 
				 * @param {IncomingRequest} req 
				 * @param {ServerResponse} res 
				 * @param {Object} data
				 * 
				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, */

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx 
				 * @param {Object} route 
				 * @param {IncomingRequest} req 
				 * @param {ServerResponse} res 
				 * @param {Object} data
				onAfterCall(ctx, route, req, res, data) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB"
					},
					urlencoded: {
						extended: true,
						limit: "1MB"
					}
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true
			}
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,


		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {}
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
		/**
         * Say a 'Hello' action.
         *
         * @returns
         */
        get: {
            rest: {
                method: "GET",
                path: "/get"
            },
			params: {
				objectApiName: "string",
				when:"string",
				name:"string"
			},
            async handler(ctx) {
                return await ActionHandlers.get(ctx);
            }
        },
		getAll: {
            async handler(ctx) {
                return await ActionHandlers.getAll(ctx);
            }
        },
		filter: {
			params: {
				objectApiName: "string",
				when:"string"
			},
            async handler(ctx) {
                return await ActionHandlers.filter(ctx);
            }
        },
        add: {
			params: {
				data: "object"
			},
            async handler(ctx) {
                return await ActionHandlers.add(ctx);
            }
        },
        change: {
			params: {
				data: "object",
				oldData: "object"
			},
            async handler(ctx) {
                return await ActionHandlers.change(ctx);
            }
        },
        delete: {
			params: {
				data: "object"
			},
            async handler(ctx) {
                return await ActionHandlers.delete(ctx);
            }
        },
	},

	events: {
		[`$METADATA.${METADATA_TYPE}.*`]: {
            async handler(ctx) {
                return await ActionHandlers.refresh(ctx);
            }
        },
		[`$METADATA.${METADATA_TYPE}-pattern.*`]: {
            async handler(ctx) {
                return await ActionHandlers.refresh(ctx);
            }
        },
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
		this.nodes = [];

		this.metrics = {};
		this.workerRegistry = {};
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
