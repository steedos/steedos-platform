try
	if process.env.CREATOR_NODE_ENV == 'development'
		steedosCore = require('@steedos/core')
		objectql = require('@steedos/objectql')
		moleculer = require("moleculer");
		packageLoader = require('@steedos/service-meteor-package-loader');
		APIService = require('@steedos/service-api');
		MetadataService = require('@steedos/service-metadata-server');
		packageService = require("@steedos/service-package-registry");
		path = require('path')

		config = objectql.getSteedosConfig();
		settings = {
			built_in_plugins: [
				"@steedos/standard-space",
				"@steedos/standard-cms",
				"@steedos/standard-object-database",
				"@steedos/standard-process-approval",
				"@steedos/standard-collaboration",
				"@steedos/standard-ui",
				"@steedos/standard-permission",
				"@steedos/webapp-public",
				"@steedos/service-cachers-manager",
				"@steedos/unpkg",
				"@steedos/workflow",
				"@steedos/accounts",
				"@steedos/plugin-company",
				"@steedos/metadata-api",
				"@steedos/data-import",
				# "@steedos/service-fields-indexs",
				"@steedos/service-accounts",
				"@steedos/service-charts",
				# "@steedos/service-pages",
				"@steedos/service-package-registry",
		   		"@steedos/service-package-tool",
				# "@steedos/standard-process",
				"@steedos/webapp-accounts",
				"@steedos/service-workflow",
				"@steedos/service-plugin-amis",
				"@steedos/service-files",
				"@steedos/service-identity-jwt"
			],
			plugins: config.plugins
		}
		Meteor.startup ->
			try
				broker = new moleculer.ServiceBroker({
					namespace: "steedos",
					nodeID: "steedos-creator",
					metadata: {},
					transporter: process.env.TRANSPORTER,
					cacher: process.env.CACHER,
					logLevel: "warn",
					serializer: "JSON",
					requestTimeout: 60 * 1000,
					maxCallLevel: 100,

					heartbeatInterval: 10,
					heartbeatTimeout: 30,

					contextParamsCloning: false,

					tracking: {
						enabled: false,
						shutdownTimeout: 5000,
					},

					disableBalancer: false,

					registry: {
						strategy: "RoundRobin",
						preferLocal: true
					},

					bulkhead: {
						enabled: false,
						concurrency: 10,
						maxQueueSize: 100,
					},
					validator: true,
					errorHandler: null,
					tracing: {
						enabled: false,
						exporter: {
							type: "Console",
							options: {
								logger: null,
								colors: true,
								width: 100,
								gaugeWidth: 40
							}
						}
					},
					skipProcessEventRegistration: true,

					created: (broker)-> 
						# Clear all cache entries
						broker.logger.warn('Clear all cache entries on startup.')
						broker.cacher.clean();
				});

				objectql.broker.init(broker);

				objectqlService = broker.createService(require("@steedos/service-objectql"));
				
				projectService = broker.createService({
					name: "project-server",
					namespace: "steedos",
					mixins: [packageService],
				});


				metadataService = broker.createService({
					name: 'metadata-server',
					mixins: [MetadataService],
					settings: {
					} 
				});

				uiService = broker.createService(require("@steedos/service-ui"));

				apiService = broker.createService({
					name: "api",
					mixins: [APIService],
					settings: {
						port: null
					} 
				});

				pageService = broker.createService({
					name: "@steedos/service-pages",
					mixins: [require('@steedos/service-pages')],
					settings: {
						port: null
					} 
				});

				steedosService = broker.createService({
					name: "steedos-server",
					mixins: [],
					settings: {
						port: null
					},
					started: ()->
						setTimeout ->
							broker.emit 'steedos-server.started'
							return
						, 1000
				});

				objectql.getSteedosSchema(broker);
				standardObjectsDir = objectql.StandardObjectsPath;
				standardObjectsPackageLoaderService = broker.createService({
					name: 'standard-objects',
					mixins: [packageLoader],
					settings: { packageInfo: {
						path: standardObjectsDir,
					} }
				});

				Meteor.wrapAsync((cb)->
					broker.start().then(()->
						if !broker.started 
							broker._restartService(objectqlService);
							broker._restartService(standardObjectsPackageLoaderService);
							broker._restartService(uiService);

						express = require('express');
						connectHandlersExpress = express();
						connectHandlersExpress.use(require('@steedos/router').staticRouter());
						broker.waitForServices('~packages-@steedos/service-ui').then ()->
							console.log('waitForServices ~packages-@steedos/service-ui')
							connectHandlersExpress.use(SteedosApi.express())
							WebApp.connectHandlers.use(connectHandlersExpress)
						
						# steedosCore.init(settings).then ()->
						# 	cb();

						broker.waitForServices(standardObjectsPackageLoaderService.name).then (resolve, reject) ->
							steedosCore.init(settings).then ()->
								cb(reject, resolve)
					)
				)()
			catch ex
				console.error("error:",ex)
catch e
	console.error("error:",e)