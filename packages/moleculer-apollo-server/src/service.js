/*
 * moleculer-apollo-server
 * Copyright (c) 2020 MoleculerJS (https://github.com/moleculerjs/moleculer-apollo-server)
 * MIT Licensed
 */

"use strict";

const _ = require("lodash");
const { MoleculerServerError } = require("moleculer").Errors;
const { ApolloServer } = require("./ApolloServer");
const DataLoader = require("dataloader");
const { makeExecutableSchema } = require("graphql-tools");
const GraphQL = require("graphql");
const { PubSub, withFilter } = require("graphql-subscriptions");
const hash = require("object-hash");

module.exports = function (mixinOptions) {
	mixinOptions = _.defaultsDeep(mixinOptions, {
		routeOptions: {
			path: "/graphql",
		},
		schema: null,
		serverOptions: {},
		createAction: true,
		subscriptionEventName: "graphql.publish",
		invalidateEventName: "graphql.invalidate",
		autoUpdateSchema: true,
		checkActionVisibility: false,
	});

	const serviceSchema = {
		actions: {
			ws: {
				timeout: 0,
				visibility: "private",
				tracing: {
					tags: {
						params: ["socket.upgradeReq.url"],
					},
					spanName: ctx => `UPGRADE ${ctx.params.socket.upgradeReq.url}`,
				},
				handler(ctx) {
					const { socket, connectionParams } = ctx.params;
					return {
						$ctx: ctx,
						$socket: socket,
						$service: this,
						$params: { body: connectionParams, query: socket.upgradeReq.query },
					};
				},
			},
		},

		events: {
			[mixinOptions.invalidateEventName]() {
				this.invalidateGraphQLSchema();
			},
			"$services.changed"() {
				if (mixinOptions.autoUpdateSchema) {
					this.invalidateGraphQLSchema();
				}
			},
			[mixinOptions.subscriptionEventName](event) {
				if (this.pubsub) {
					this.pubsub.publish(event.tag, event.payload);
				}
			},
		},

		methods: {
			/**
			 * Invalidate the generated GraphQL schema
			 */
			invalidateGraphQLSchema() {
				this.shouldUpdateGraphqlSchema = true;
			},

			/**
			 * Return the field name in a GraphQL Mutation, Query, or Subscription declaration
			 * @param {String} declaration - Mutation, Query, or Subscription declaration
			 * @returns {String} Field name of declaration
			 */
			getFieldName(declaration) {
				// Remove all multi-line/single-line descriptions and comments
				const cleanedDeclaration = declaration
					.replace(/"([\s\S]*?)"/g, "")
					.replace(/^[\s]*?#.*\n?/gm, "")
					.trim();
				return cleanedDeclaration.split(/[(:]/g)[0];
			},

			/**
			 * Get the full name of a service including version spec.
			 *
			 * @param {Service} service - Service object
			 * @returns {String} Name of service including version spec
			 */
			getServiceName(service) {
				if (service.fullName) return service.fullName;

				if (service.version != null)
					return (
						(typeof service.version == "number"
							? "v" + service.version
							: service.version) +
						"." +
						service.name
					);

				return service.name;
			},

			/**
			 * Get action name for resolver
			 *
			 * @param {String} service
			 * @param {String} action
			 */
			getResolverActionName(service, action) {
				if (action.indexOf(".") === -1) {
					return `${service}.${action}`;
				} else {
					return action;
				}
			},

			/**
			 * Create resolvers from service settings
			 *
			 * @param {String} serviceName
			 * @param {Object} resolvers
			 */
			createServiceResolvers(serviceName, resolvers) {
				return Object.entries(resolvers).reduce((acc, [name, r]) => {
					if (_.isPlainObject(r) && r.action != null) {
						// matches signature for remote action resolver
						acc[name] = this.createActionResolver(
							this.getResolverActionName(serviceName, r.action),
							r
						);
					} else {
						// something else (enum, etc.)
						acc[name] = r;
					}

					return acc;
				}, {});
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

				return async (root, args, context) => {
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
							let hasRootKeyValue = false;
							if (root && rootKeys) {
								rootKeys.forEach(key => {
									const v = _.get(root, key);
									_.set(params, rootParams[key], v);
									if (v != null) hasRootKeyValue = true;
								});

								if (def.skipNullKeys && !hasRootKeyValue) {
									return null;
								}
							}

							let mergedParams = _.defaultsDeep({}, args, params, staticParams);

							if (this.prepareContextParams) {
								mergedParams = await this.prepareContextParams(
									mergedParams,
									actionName,
									context
								);
							}

							return await context.ctx.call(actionName, mergedParams);
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
			 * Get the unique key assigned to the DataLoader map
			 * @param {string} actionName - Fully qualified action name to bind to dataloader
			 * @param {Object.<string, any>} staticParams - Static parameters to use in dataloader
			 * @param {Object.<string, any>} args - Arguments passed to GraphQL child resolver
			 * @returns {string} Key to the dataloader instance
			 */
			getDataLoaderMapKey(actionName, staticParams, args) {
				if (Object.keys(staticParams).length > 0 || Object.keys(args).length > 0) {
					// create a unique hash of the static params and the arguments to ensure a unique DataLoader instance
					const actionParams = _.defaultsDeep({}, args, staticParams);
					const paramsHash = hash(actionParams);
					return `${actionName}:${paramsHash}`;
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
				{ hashCacheKey = false } = {}
			) {
				const batchLoadFn = keys => {
					const rootParams = { [batchedParamKey]: keys };
					return ctx.call(actionName, _.defaultsDeep({}, args, rootParams, staticParams));
				};

				const dataLoaderOptions = this.dataLoaderOptions.get(actionName) || {};
				const cacheKeyFn = hashCacheKey && (key => hash(key));
				const options = {
					...(cacheKeyFn && { cacheKeyFn }),
					...dataLoaderOptions,
				};

				return new DataLoader(batchLoadFn, options);
			},

			/**
			 * Create resolver for subscription
			 *
			 * @param {String} actionName
			 * @param {Array?} tags
			 * @param {String?} filter
			 */
			createAsyncIteratorResolver(actionName, tags = [], filter) {
				return {
					subscribe: filter
						? withFilter(
								() => this.pubsub.asyncIterator(tags),
								async (payload, params, { ctx }) =>
									payload !== undefined
										? ctx.call(filter, { ...params, payload })
										: false
						  )
						: () => this.pubsub.asyncIterator(tags),
					resolve: (payload, params, { ctx }) =>
						ctx.call(actionName, { ...params, payload }),
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

					return this.makeExecutableSchema({ typeDefs, resolvers, schemaDirectives });
				} catch (err) {
					throw new MoleculerServerError(
						"Unable to compile GraphQL schema",
						500,
						"UNABLE_COMPILE_GRAPHQL_SCHEMA",
						{ err, str }
					);
				}
			},

			/**
			 * Call the `makeExecutableSchema`. If you would like
			 * to manipulate the concatenated typeDefs, or the generated schema,
			 * just overwrite it in your service file.
			 * @param {Object} schemaDef
			 */
			makeExecutableSchema(schemaDef) {
				return makeExecutableSchema(schemaDef);
			},

			/**
			 * Create PubSub instance.
			 */
			createPubSub() {
				return new PubSub();
			},

			/**
			 * Prepare GraphQL schemas based on Moleculer services.
			 */
			async prepareGraphQLSchema() {
				// Schema is up-to-date
				if (!this.shouldUpdateGraphqlSchema && this.graphqlHandler) {
					return;
				}

				if (this.apolloServer) {
					await this.apolloServer.stop();
				}

				// Create new server & regenerate GraphQL schema
				this.logger.info(
					"♻ Recreate Apollo GraphQL server and regenerate GraphQL schema..."
				);

				try {
					this.pubsub = this.createPubSub();
					const services = this.broker.registry.getServiceList({ withActions: true });
					const schema = this.generateGraphQLSchema(services);

					this.logger.debug(
						"Generated GraphQL schema:\n\n" + GraphQL.printSchema(schema)
					);

					this.apolloServer = new ApolloServer({
						schema,
						..._.defaultsDeep({}, mixinOptions.serverOptions, {
							context: ({ req, connection }) => ({
								...(req
									? {
											ctx: req.$ctx,
											service: req.$service,
											params: req.$params,
									  }
									: {
											ctx: connection.context.$ctx,
											service: connection.context.$service,
											params: connection.context.$params,
									  }),
								dataLoaders: new Map(), // create an empty map to load DataLoader instances into
							}),
							subscriptions: {
								onConnect: (connectionParams, socket) =>
									this.actions.ws({ connectionParams, socket }),
							},
						}),
					});

					this.graphqlHandler = this.apolloServer.createHandler(
						mixinOptions.serverOptions
					);

					if (mixinOptions.serverOptions.subscriptions !== false) {
						// Avoid installing the subscription handlers if they have been disabled
						this.apolloServer.installSubscriptionHandlers(this.server);
					}

					this.graphqlSchema = schema;

					this.buildLoaderOptionMap(services); // rebuild the options for DataLoaders

					this.shouldUpdateGraphqlSchema = false;

					this.broker.broadcast("graphql.schema.updated", {
						schema: GraphQL.printSchema(schema),
					});
				} catch (err) {
					this.logger.error(err);
					throw err;
				}
			},

			/**
			 * Build a map of options to use with DataLoader
			 *
			 * @param {Object[]} services
			 * @modifies {this.dataLoaderOptions}
			 * @modifies {this.dataLoaderBatchParams}
			 */
			buildLoaderOptionMap(services) {
				this.dataLoaderOptions.clear(); // clear map before rebuilding
				this.dataLoaderBatchParams.clear(); // clear map before rebuilding

				services.forEach(service => {
					Object.values(service.actions).forEach(action => {
						const { graphql: graphqlDefinition, name: actionName } = action;
						if (
							graphqlDefinition &&
							(graphqlDefinition.dataLoaderOptions ||
								graphqlDefinition.dataLoaderBatchParam)
						) {
							const serviceName = this.getServiceName(service);
							const fullActionName = this.getResolverActionName(
								serviceName,
								actionName
							);

							if (graphqlDefinition.dataLoaderOptions) {
								this.dataLoaderOptions.set(
									fullActionName,
									graphqlDefinition.dataLoaderOptions
								);
							}

							if (graphqlDefinition.dataLoaderBatchParam) {
								this.dataLoaderBatchParams.set(
									fullActionName,
									graphqlDefinition.dataLoaderBatchParam
								);
							}
						}
					});
				});
			},
		},

		created() {
			this.apolloServer = null;
			this.graphqlHandler = null;
			this.graphqlSchema = null;
			this.pubsub = null;
			this.shouldUpdateGraphqlSchema = true;
			this.dataLoaderOptions = new Map();
			this.dataLoaderBatchParams = new Map();

			// Bind service to onConnect method
			if (
				mixinOptions.serverOptions.subscriptions &&
				_.isFunction(mixinOptions.serverOptions.subscriptions.onConnect)
			) {
				mixinOptions.serverOptions.subscriptions.onConnect =
					mixinOptions.serverOptions.subscriptions.onConnect.bind(this);
			}

			const route = _.defaultsDeep(mixinOptions.routeOptions, {
				aliases: {
					async "/"(req, res) {
						try {
							await this.prepareGraphQLSchema();
							return await this.graphqlHandler(req, res);
						} catch (err) {
							this.sendError(req, res, err);
						}
					},
					async "GET /.well-known/apollo/server-health"(req, res) {
						try {
							await this.prepareGraphQLSchema();
							return await this.graphqlHandler(req, res);
						} catch (err) {
							res.statusCode = 503;
							return this.sendResponse(
								req,
								res,
								{ status: "fail", schema: false },
								{ responseType: "application/health+json" }
							);
						}
					},
				},

				mappingPolicy: "restrict",

				bodyParsers: {
					json: true,
					urlencoded: { extended: true },
				},
			});

			// Add route
			this.settings.routes.unshift(route);
		},

		started() {
			this.logger.info(`🚀 GraphQL server is available at ${mixinOptions.routeOptions.path}`);
		},
	};

	if (mixinOptions.createAction) {
		serviceSchema.actions = {
			...serviceSchema.actions,
			graphql: {
				params: {
					query: { type: "string" },
					variables: { type: "object", optional: true },
				},
				async handler(ctx) {
					await this.prepareGraphQLSchema();
					return GraphQL.graphql(
						this.graphqlSchema,
						ctx.params.query,
						null,
						{ ctx },
						ctx.params.variables
					);
				},
			},
		};
	}

	return serviceSchema;
};
