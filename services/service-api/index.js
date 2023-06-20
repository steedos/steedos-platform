"use strict";

const ApiGateway = require("moleculer-web");
const steedosAuth = require('@steedos/auth');
const { ApolloService } = require("moleculer-apollo-server");
const GraphQLJSON = require('graphql-type-json');
const {
	// GraphQLDate,
	// GraphQLTime,
	GraphQLDateTime
} = require('graphql-iso-date');

const _ = require('lodash');

const validator = require('validator');
const enablePlayground = validator.toBoolean(process.env.STEEDOS_GRAPHQL_ENABLE_CONSOLE || 'true', true)

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
			typeDefs: ['scalar Date', `scalar JSON`],

			// Global resolvers
			resolvers: {
				JSON: GraphQLJSON,
				Date: GraphQLDateTime
			},

			// API Gateway route options
			routeOptions: {
				path: "/graphql",
				// cors: true, //会导致response返回 access-control-allow-origin: *, 并进一步导致客户端请求时withCredentials: true参数带来的跨域错误
				whitelist: [
					"graphql"
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
				tracing: process.env.NODE_ENV !== 'production',

				engine: {
					apiKey: process.env.APOLLO_ENGINE_KEY
				},
				subscriptions: false,
				playground: enablePlayground ? {
					settings: {
						'request.credentials': 'same-origin'
					}
				}: false,
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
				aliases: {
					"GET /api/health"(req, res){
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.end(JSON.stringify({ status: 'ok' }));
					}
				}
			},
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
					res.end(JSON.stringify({ error: err.message }));
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
				throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
			}

			// // It check the `auth` property in action schema.
			// if (req.$action.auth == "required" && !user) {
			// 	throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
			// }
		},

		/**
		 * Create resolver for action
		 *
		 * @param {String} actionName
		 * @param {Object?} def
		 */
		 createActionResolver(actionName, def = {}) {
			const {
				dataLoader: useDataLoader = false,
				nullIfError = false,
				params: staticParams = {},
				rootParams = {},
				fileUploadArg = null,
			} = def;
			const rootKeys = Object.keys(rootParams);

			return async (root, args, context, resolveInfo) => {
				try {
					if (useDataLoader) {
						const dataLoaderMapKey = this.getDataLoaderMapKey(
							actionName,
							staticParams,
							args
						);
						// if a dataLoader batching parameter is specified, then all root params can be data loaded;
						// otherwise use only the primary rootParam
						const primaryDataLoaderRootKey = rootKeys[0]; // for dataloader, use the first root key only
						const dataLoaderBatchParam = this.dataLoaderBatchParams.get(actionName);
						const dataLoaderUseAllRootKeys = dataLoaderBatchParam != null;

						// check to see if the DataLoader has already been added to the GraphQL context; if not then add it for subsequent use
						let dataLoader;
						if (context.dataLoaders.has(dataLoaderMapKey)) {
							dataLoader = context.dataLoaders.get(dataLoaderMapKey);
						} else {
							const batchedParamKey =
								dataLoaderBatchParam || rootParams[primaryDataLoaderRootKey];

							dataLoader = this.buildDataLoader(
								context.ctx,
								actionName,
								batchedParamKey,
								staticParams,
								args,
								{ hashCacheKey: dataLoaderUseAllRootKeys } // must hash the cache key if not loading scalar
							);
							context.dataLoaders.set(dataLoaderMapKey, dataLoader);
						}

						let dataLoaderKey;
						if (dataLoaderUseAllRootKeys) {
							if (root && rootKeys) {
								dataLoaderKey = {};

								rootKeys.forEach(key => {
									_.set(dataLoaderKey, rootParams[key], _.get(root, key));
								});
							}
						} else {
							dataLoaderKey = root && _.get(root, primaryDataLoaderRootKey);
						}

						if (dataLoaderKey == null) {
							return null;
						}

						return Array.isArray(dataLoaderKey)
							? await dataLoader.loadMany(dataLoaderKey)
							: await dataLoader.load(dataLoaderKey);
					} else if (fileUploadArg != null && args[fileUploadArg] != null) {
						const additionalArgs = _.omit(args, [fileUploadArg]);

						if (Array.isArray(args[fileUploadArg])) {
							return await Promise.all(
								args[fileUploadArg].map(async uploadPromise => {
									const { createReadStream, ...$fileInfo } =
										await uploadPromise;
									const stream = createReadStream();
									return context.ctx.call(actionName, stream, {
										meta: { $fileInfo, $args: additionalArgs },
									});
								})
							);
						}

						const { createReadStream, ...$fileInfo } = await args[fileUploadArg];
						const stream = createReadStream();
						return await context.ctx.call(actionName, stream, {
							meta: { $fileInfo, $args: additionalArgs },
						});
					} else {
						const params = {};
						if (root && rootKeys) {
							rootKeys.forEach(key => {
								_.set(params, rootParams[key], _.get(root, key));
							});
						}

						let mergedParams = _.defaultsDeep({}, args, params, staticParams);

						if (this.prepareContextParams) {
							mergedParams = await this.prepareContextParams(
								mergedParams,
								actionName,
								context
							);
						}

						return await context.ctx.call(actionName, mergedParams, { meta: {resolveInfo} });
					}
				} catch (err) {
					if (nullIfError) {
						return null;
					}
					/* istanbul ignore next */
					if (err && err.ctx) {
						err.ctx = null; // Avoid circular JSON in Moleculer <= 0.13
					}
					throw err;
				}
			};
		},

	}
};
