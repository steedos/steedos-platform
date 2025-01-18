"use strict";

const ApiGateway = require("moleculer-web");
const steedosAuth = require('@steedos/auth');
const { ApolloService } = require("moleculer-apollo-server");
const { MoleculerServerError } = require("moleculer").Errors;
const GraphQLJSON = require('graphql-type-json');
const {
	// GraphQLDate,
	// GraphQLTime,
	GraphQLDateTime
} = require('graphql-iso-date');
const SteedosRouter = require('@steedos/router');
const _ = require('lodash');
const ServiceObjectGraphql = require('@steedos/service-object-graphql')
const DataLoader = require("dataloader");
const { LRUMap } = require('lru_map');
const validator = require('validator');
const enablePlayground = validator.toBoolean(process.env.STEEDOS_GRAPHQL_ENABLE_CONSOLE || 'true', true);
const openBrowser = require('react-dev-utils/openBrowser');
const requestIp = require('request-ip');
const mixinOptions = {

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
			try {
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.writeHead(err.code || 500);
				res.end(JSON.stringify(err));
			} catch (Exception) {
				res.writeHead(500);
				res.end(JSON.stringify(err));
			}
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
		} : false,
		introspection: enablePlayground
	}
}
const ObjectDataLoaderMapKeys = {};
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */
module.exports = {
	name: "api",
	mixins: [ApiGateway,
		// GraphQL Apollo Server
		ApolloService(mixinOptions),
		ServiceObjectGraphql
	],

	projectStarted: false,

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		server: false,

		// Exposed port
		port: process.env.PORT || 3001,

		// Exposed IP
		// ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [
			function (req, res, next) {
				// 如果service-object-grapqhl未结算完成，则提示服务未就绪，刷新重试
				// if (!this.projectStarted) {
				// 	const message = 'service is not ready, please refresh later.';
				// 	res.writeHead(503, { 'Content-Type': 'application/json' });
				// 	res.end(JSON.stringify({ status: 1, msg: message, data: {}, errors: [{ message: message }] }));
				// 	return;
				// }
				next();
			}
		],

		routes: [
			{
				aliases: {
					"GET /api/health"(req, res) {
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.end(JSON.stringify({ status: 'ok' }));
					}
				}
			},
			{
				path: "/service/api",

				whitelist: [
					"**",
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
				 * 
				*/
				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
					ctx.meta.clientIp = requestIp.getClientIp(req);
				},

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
					try {
						res.setHeader("Content-Type", "application/json; charset=utf-8");
						res.writeHead(err.code || 500);
						res.end(JSON.stringify({ error: err.message, detail: err }));
					} catch (error) {
						res.writeHead(500);
						res.end(JSON.stringify({ error: err.message }));
					}
				}
			},
			{
				path: "/api/v1",

				whitelist: [
					"rest.*",
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
					try {
						res.setHeader("Content-Type", "application/json; charset=utf-8");
						res.writeHead(err.code || 500);

						let msg = err.message;

						if (err.code === 422 && err.type === 'VALIDATION_ERROR') {
							msg = err.data.map(item => item.message).join('');
						}

						res.end(JSON.stringify({
							"status": -1,
							"msg": msg
						}));
					} catch (Exception) {
						res.writeHead(500);
						res.end(JSON.stringify({
							"status": -1,
							"msg": err.message,
							"data": {}
						}));
					}
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
		 * Get the unique key assigned to the DataLoader map
		 * @param {string} actionName - Fully qualified action name to bind to dataloader
		 * @param {Object.<string, any>} staticParams - Static parameters to use in dataloader
		 * @param {Object.<string, any>} args - Arguments passed to GraphQL child resolver
		 * @returns {string} Key to the dataloader instance
		 */
		getObjectDataLoaderMapKey(objectName, referenceToField = '_id', spaceId) {
			if (objectName) {
				const key = `${spaceId}_object:${objectName}.${referenceToField}`;
				if (!ObjectDataLoaderMapKeys[objectName]) {
					ObjectDataLoaderMapKeys[objectName] = [];
				}
				ObjectDataLoaderMapKeys[objectName].push(key);
				return key;
			}
			// 如果没有objectName，则抛出错误信息
			throw new Error("objectName is required");
		},


		async objectDataLoaderHandler(actionName, staticParams, rootParams, graphqlCtx) {
			const rootKeys = Object.keys(rootParams);
			const { root, args, context, resolveInfo } = graphqlCtx;
			const userSession = context.ctx.meta.user;
			const spaceId = userSession.spaceId;
			const dataLoaderMapKey = this.getObjectDataLoaderMapKey(
				staticParams.__objectName || staticParams.objectName
				, staticParams.referenceToField || '_id'
				, spaceId
			);
			const objectDataLoaders = this.objectDataLoaders;
			// if a dataLoader batching parameter is specified, then all root params can be data loaded;
			// otherwise use only the primary rootParam
			const primaryDataLoaderRootKey = rootKeys[0]; // for dataloader, use the first root key only
			const dataLoaderBatchParam = this.dataLoaderBatchParams.get(actionName);
			const dataLoaderUseAllRootKeys = dataLoaderBatchParam != null;

			// check to see if the DataLoader has already been added to the GraphQL context; if not then add it for subsequent use
			let dataLoader;
			// console.log(`objectDataLoaders.has(dataLoaderMapKey)`, objectDataLoaders.has(dataLoaderMapKey))
			if (objectDataLoaders.has(dataLoaderMapKey)) {
				dataLoader = objectDataLoaders.get(dataLoaderMapKey);
			} else {
				const batchedParamKey =
					dataLoaderBatchParam || rootParams[primaryDataLoaderRootKey];
				dataLoader = this.buildDataLoader(
					context.ctx,
					actionName,
					batchedParamKey,
					staticParams,
					args,
					{ hashCacheKey: dataLoaderUseAllRootKeys }, // must hash the cache key if not loading scalar
					spaceId
				);
				objectDataLoaders.set(dataLoaderMapKey, dataLoader);
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
		},

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
		async authenticate(ctx, route, req, res, alias) {
			if (alias.authentication === false) {
				return null;
			}
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
		async authorize(ctx, route, req, res, alias) {
			ctx.meta.requestHeaders = req.headers;

			if (alias.authorization === false) {
				return;
			}
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
				objectDataLoader: useObjectDataLoader = false,
				nullIfError = false,
				params: staticParams = {},
				rootParams = {},
				fileUploadArg = null,
			} = def;
			const rootKeys = Object.keys(rootParams);
			return async (root, args, context, resolveInfo) => {
				try {
					if (useObjectDataLoader) {
						return await this.objectDataLoaderHandler(actionName, staticParams, rootParams, { root, args, context, resolveInfo });
					} else if (useDataLoader) {
						const userSession = context.ctx.meta.user;
						const spaceId = userSession.spaceId;
						const dataLoaderMapKey = this.getDataLoaderMapKey(
							actionName,
							staticParams,
							args,
							spaceId
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
								{ hashCacheKey: dataLoaderUseAllRootKeys }, // must hash the cache key if not loading scalar
								spaceId
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

						return await context.ctx.call(actionName, mergedParams, { meta: { resolveInfo } });
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

		/**
		 * Generate GraphQL Schema
		 *
		 * @param {Object[]} services
		 * @returns {Object} Generated schema
		 */
		generateGraphQLSchema(services) {
			let str;
			try {
				let typeDefs = [];
				let resolvers = {};
				let schemaDirectives = null;

				if (mixinOptions.typeDefs) {
					typeDefs = typeDefs.concat(mixinOptions.typeDefs);
				}

				if (mixinOptions.resolvers) {
					resolvers = _.cloneDeep(mixinOptions.resolvers);
				}

				if (mixinOptions.schemaDirectives) {
					schemaDirectives = _.cloneDeep(mixinOptions.schemaDirectives);
				}

				let queries = [];
				let mutations = [];
				let subscriptions = [];
				let types = [];
				let interfaces = [];
				let unions = [];
				let enums = [];
				let inputs = [];

				if (this.globalGraphQLSettings) {
					if (_.isObject(this.globalGraphQLSettings)) {
						const globalDef = this.globalGraphQLSettings;
						const thisServiceName = this.name;
						// console.log('thisServiceName', thisServiceName)

						if (globalDef.query) {
							queries = queries.concat(globalDef.query);
						}

						if (globalDef.mutation) {
							mutations = mutations.concat(globalDef.mutation);
						}

						if (globalDef.subscription) {
							subscriptions = subscriptions.concat(globalDef.subscription);
						}

						if (globalDef.type) {
							types = types.concat(globalDef.type);
						}

						if (globalDef.interface) {
							interfaces = interfaces.concat(globalDef.interface);
						}

						if (globalDef.union) {
							unions = unions.concat(globalDef.union);
						}

						if (globalDef.enum) {
							enums = enums.concat(globalDef.enum);
						}

						if (globalDef.input) {
							inputs = inputs.concat(globalDef.input);
						}

						if (globalDef.resolvers) {
							resolvers = Object.entries(globalDef.resolvers).reduce(
								(acc, [name, resolver]) => {
									acc[name] = _.merge(
										acc[name] || {},
										this.createServiceResolvers(thisServiceName, resolver)
									);
									return acc;
								},
								resolvers
							);


							for (const objectName in this.ObjectsUIResolvers) {
								if (resolvers[objectName]) {
									resolvers[objectName]['_ui'] = this.ObjectsUIResolvers[objectName];
								}
							}
						}
					}
				}

				const processedServices = new Set();

				services.forEach(service => {
					const serviceName = this.getServiceName(service);

					// Skip multiple instances of services
					if (processedServices.has(serviceName)) return;
					processedServices.add(serviceName);

					if (service.settings && service.settings.graphql) {
						// --- COMPILE SERVICE-LEVEL DEFINITIONS ---
						if (_.isObject(service.settings.graphql)) {
							const globalDef = service.settings.graphql;

							if (globalDef.query) {
								queries = queries.concat(globalDef.query);
							}

							if (globalDef.mutation) {
								mutations = mutations.concat(globalDef.mutation);
							}

							if (globalDef.subscription) {
								subscriptions = subscriptions.concat(globalDef.subscription);
							}

							if (globalDef.type) {
								types = types.concat(globalDef.type);
							}

							if (globalDef.interface) {
								interfaces = interfaces.concat(globalDef.interface);
							}

							if (globalDef.union) {
								unions = unions.concat(globalDef.union);
							}

							if (globalDef.enum) {
								enums = enums.concat(globalDef.enum);
							}

							if (globalDef.input) {
								inputs = inputs.concat(globalDef.input);
							}

							if (globalDef.resolvers) {
								resolvers = Object.entries(globalDef.resolvers).reduce(
									(acc, [name, resolver]) => {
										acc[name] = _.merge(
											acc[name] || {},
											this.createServiceResolvers(serviceName, resolver)
										);
										return acc;
									},
									resolvers
								);
							}
						}
					}

					// --- COMPILE ACTION-LEVEL DEFINITIONS ---
					const resolver = {};

					Object.values(service.actions).forEach(action => {
						const { graphql: def } = action;
						if (
							mixinOptions.checkActionVisibility &&
							action.visibility != null &&
							action.visibility != "published"
						)
							return;

						if (def && _.isObject(def)) {
							if (def.query) {
								if (!resolver["Query"]) resolver.Query = {};

								_.castArray(def.query).forEach(query => {
									const name = this.getFieldName(query);
									queries.push(query);
									resolver.Query[name] = this.createActionResolver(
										action.name
									);
								});
							}

							if (def.mutation) {
								if (!resolver["Mutation"]) resolver.Mutation = {};

								_.castArray(def.mutation).forEach(mutation => {
									const name = this.getFieldName(mutation);
									mutations.push(mutation);
									resolver.Mutation[name] = this.createActionResolver(
										action.name,
										{
											fileUploadArg: def.fileUploadArg,
										}
									);
								});
							}

							if (def.subscription) {
								if (!resolver["Subscription"]) resolver.Subscription = {};

								_.castArray(def.subscription).forEach(subscription => {
									const name = this.getFieldName(subscription);
									subscriptions.push(subscription);
									resolver.Subscription[name] =
										this.createAsyncIteratorResolver(
											action.name,
											def.tags,
											def.filter
										);
								});
							}

							if (def.type) {
								types = types.concat(def.type);
							}

							if (def.interface) {
								interfaces = interfaces.concat(def.interface);
							}

							if (def.union) {
								unions = unions.concat(def.union);
							}

							if (def.enum) {
								enums = enums.concat(def.enum);
							}

							if (def.input) {
								inputs = inputs.concat(def.input);
							}
						}
					});

					if (Object.keys(resolver).length > 0) {
						resolvers = _.merge(resolvers, resolver);
					}
				});

				if (
					queries.length > 0 ||
					types.length > 0 ||
					mutations.length > 0 ||
					subscriptions.length > 0 ||
					interfaces.length > 0 ||
					unions.length > 0 ||
					enums.length > 0 ||
					inputs.length > 0
				) {
					str = "";
					if (queries.length > 0) {
						str += `
							type Query {
								${queries.join("\n")}
							}
						`;
					}

					if (mutations.length > 0) {
						str += `
							type Mutation {
								${mutations.join("\n")}
							}
						`;
					}

					if (subscriptions.length > 0) {
						str += `
							type Subscription {
								${subscriptions.join("\n")}
							}
						`;
					}

					if (types.length > 0) {
						str += `
							${types.join("\n")}
						`;
					}

					if (interfaces.length > 0) {
						str += `
							${interfaces.join("\n")}
						`;
					}

					if (unions.length > 0) {
						str += `
							${unions.join("\n")}
						`;
					}

					if (enums.length > 0) {
						str += `
							${enums.join("\n")}
						`;
					}

					if (inputs.length > 0) {
						str += `
							${inputs.join("\n")}
						`;
					}

					typeDefs.push(str);
				}

				try {
					return this.makeExecutableSchema({ typeDefs, resolvers, schemaDirectives });
				} catch (error) {
					this.logger.error(error);
					return this.graphqlSchema
				}
			} catch (err) {
				// 用于调试异常GraphQL schema
				// const fs = require('fs');
				// // 写入的文件路径
				// const filePath = `UNABLE_COMPILE_GRAPHQL_SCHEMA.${new Date().getTime()}.txt`;
				// // 使用fs.writeFile方法写入文件
				// fs.writeFile(filePath, str, (err) => {
				// 	if (err) {
				// 		console.error(err);
				// 		return;
				// 	}
				// 	console.log('文件已写入');
				// });

				throw new MoleculerServerError(
					"Unable to compile GraphQL schema",
					500,
					"UNABLE_COMPILE_GRAPHQL_SCHEMA",
					{ err }
				);
			}
		},

		/**
		 * Get the unique key assigned to the DataLoader map
		 * @param {string} actionName - Fully qualified action name to bind to dataloader
		 * @param {Object.<string, any>} staticParams - Static parameters to use in dataloader
		 * @param {Object.<string, any>} args - Arguments passed to GraphQL child resolver
		 * @returns {string} Key to the dataloader instance
		 */
		getDataLoaderMapKey(actionName, staticParams, args, spaceId) {
			if (Object.keys(staticParams).length > 0 || Object.keys(args).length > 0) {
				// create a unique hash of the static params and the arguments to ensure a unique DataLoader instance
				const actionParams = _.defaultsDeep({}, args, staticParams);
				const paramsHash = hash(actionParams);
				return `${spaceId}_${actionName}:${paramsHash}`;
			}

			// if no static params or arguments are present then the action name can serve as the key
			return actionName;
		},

		/**
			 * Build a DataLoader instance
			 *
			 * @param {Object} ctx - Moleculer context
			 * @param {string} actionName - Fully qualified action name to bind to dataloader
			 * @param {string} batchedParamKey - Parameter key to use for loaded values
			 * @param {Object} staticParams - Static parameters to use in dataloader
			 * @param {Object} args - Arguments passed to GraphQL child resolver
			 * @param {Object} [options={}] - Optional arguments
			 * @param {Boolean} [options.hashCacheKey=false] - Use a hash for the cacheKeyFn
			 * @returns {DataLoader} Dataloader instance
			 */
		buildDataLoader(
			ctx,
			actionName,
			batchedParamKey,
			staticParams,
			args,
			{ hashCacheKey = false } = {},
			spaceId
		) {
			const batchLoadFn = keys => {
				const rootParams = { [batchedParamKey]: keys };
				// !!! 这里的ctx是buildDataLoader时传进来的参数，在后续触发执行batchLoadFn时ctx.meta中的信息依然是旧的，故此函数体中代码不要使用ctx.meta中的信息
				return ctx.call(actionName, _.defaultsDeep({}, args, rootParams, staticParams), { meta: { ...ctx.meta, spaceId } });
			};

			const dataLoaderOptions = this.dataLoaderOptions.get(actionName) || {};
			const cacheKeyFn = hashCacheKey && (key => hash(key));
			const options = {
				...(cacheKeyFn && { cacheKeyFn }),
				cacheMap: new LRUMap(1000),
				...dataLoaderOptions,
			};
			return new DataLoader(batchLoadFn, options);
		}

	},
	created() {
		this.objectDataLoaders = new Map();
		this.app = SteedosRouter.staticRouter();
	},
	events: {
		'@objectRecordEvent.*.*': function (ctx) {
			const { objectApiName, isUpdate, isDelete, id, doc } = ctx.params;
			if (objectApiName && (isUpdate || isDelete)) {
				const keys = ObjectDataLoaderMapKeys[objectApiName] || [];
				let dataLoaderKeys = [id];
				if (objectApiName === 'space_users') {
					dataLoaderKeys.push(doc.user)
				}
				_.each(keys, (key) => {
					const loader = this.objectDataLoaders.get(key);
					if (loader) {
						for (const dataLoaderKey of dataLoaderKeys) {
							loader.clear(dataLoaderKey);
						}
					}
				})
			}
		},
		'service-ui.started': function () {
			this.app.use("/", this.express());
		},
		"$packages.changed": function () {
			if (!this.projectStarted) {
				this.projectStarted = true
				// 开发环境, 显示耗时
				if (process.env.NODE_ENV == 'development' && global.__startDate) {
					console.log('耗时: ' + (new Date().getTime() - global.__startDate.getTime()) + ' ms');
				}
				console.log(`Project is running at ${process.env.ROOT_URL}`);
				console.log('');
				if (process.env.STEEDOS_AUTO_OPEN_BROWSER != 'false') { // 默认打开，如果不想打开，设置STEEDOS_AUTO_OPEN_BROWSER=false
					setTimeout(function () {
						try {
							openBrowser(process.env.ROOT_URL);
						} catch (error) {
							console.error(error);
							console.error('auto open browser failed.');
						}
					}, 100)

				}
			}
		}
	},
	async started() {
		console.log('started', this.name)
		this.broker.createService(require("@steedos/service-ui"));
		// if (this.settings.server != true && this.settings.steedos_api_port){
		// 	/* istanbul ignore next */
		// 	await new this.Promise((resolve, reject) => {
		// 		this.app.listen(this.settings.steedos_api_port, err => {
		// 			if (err)
		// 				return reject(err);
		// 			this.logger.info(`Steedos Experience Server listening on ${this.settings.url}`);
		// 			resolve();
		// 		});
		// 	});
		// }

		this.broker.waitForServices('~packages-@steedos/service-ui').then(() => {
			this.app.use("/", this.express());
		})
		global.SteedosApi = {
			express: this.express
		}
	},

	actions: {
		getObjectDisplayData: {
			handler(ctx) {
				const { objectApiName, recordId, fields } = ctx.params;
				return this.getObjectDisplayData(objectApiName, recordId, fields);
			}
		}
	}
};
