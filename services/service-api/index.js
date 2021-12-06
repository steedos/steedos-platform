"use strict";

const ApiGateway = require("moleculer-web");
const steedosAuth = require('@steedos/auth');
const { ApolloService } = require("moleculer-apollo-server");
const GraphQLJSON = require('graphql-type-json');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway,
		// GraphQL Apollo Server
		ApolloService({

			// Global GraphQL typeDefs
			typeDefs: `scalar JSON`,

			// Global resolvers
			resolvers: {
				JSON: GraphQLJSON,
			},

			// API Gateway route options
			routeOptions: {
				path: "/graphql",
				cors: true,
				whitelist: [
					"**"
				],
				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],
				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,
				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,
				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,
				aliases: {},
				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},
				bodyParsers: {
					json: {
						strict: false,
						limit: "10MB"
					},
					urlencoded: {
						extended: true,
						limit: "10MB"
					}
				},
				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"
				// Enable/disable logging
				logging: true,
				// Route error handler
				onError(req, res, err) {
					res.setHeader("Content-Type", "application/json; charset=utf-8");
					res.writeHead(err.code || 500);
					res.end(JSON.stringify(err));
				}
			},

			// https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
			serverOptions: {
				tracing: true,

				engine: {
					apiKey: process.env.APOLLO_ENGINE_KEY
				},
				subscriptions: false,
				playground: {
					settings: {
						'request.credentials': 'same-origin'
					}
				},
				introspection: true
			}
		})
	],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 3001,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		routes: [
			{
				path: "/service/api",

				whitelist: [
					"**"
				],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

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
						limit: "10MB"
					},
					urlencoded: {
						extended: true,
						limit: "10MB"
					}
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: false,

				// Route error handler
				onError(req, res, err) {
					res.setHeader("Content-Type", "application/json; charset=utf-8");
					res.writeHead(err.code || 500);
					res.end(JSON.stringify({error: err.message}));
				}
			}
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: 'debug',
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,


		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {}
		}
	},

	methods: {

		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req, res) {
			let user = await steedosAuth.auth(req, res);
			if (user && user.userId) {
				return user;
			} else {
				return null;
			}
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req, res) {
			// Get the authenticated user.
			const user = ctx.meta.user;

			if (!user) {
				return res.status(401).send('NO_RIGHTS');
			}

			// // It check the `auth` property in action schema.
			// if (req.$action.auth == "required" && !user) {
			// 	throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
			// }
		}

	}
};
