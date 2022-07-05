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
				"@steedos/webapp-public",
				"@steedos/service-ui",
				"@steedos/service-cachers-manager",
				"@steedos/unpkg",
				"@steedos/workflow",
				"@steedos/accounts",
				# "@steedos/steedos-plugin-schema-builder",
				"@steedos/plugin-company",
				# "@steedos/plugin-jsreport",
				# "@steedos/word-template",
				"@steedos/metadata-api",
				# "@steedos/plugin-dingtalk",
				"@steedos/data-import",
				# "@steedos/service-fields-indexs",
				"@steedos/service-accounts",
				"@steedos/service-charts",
				"@steedos/service-pages",
				"@steedos/service-cloud-init",
				"@steedos/service-package-registry",
				# "@steedos/standard-process",
				"@steedos/webapp-accounts",
				"@steedos/service-workflow",
				"@steedos/service-plugin-amis",
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
					skipProcessEventRegistration: true
				});
				
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

				apiService = broker.createService({
					name: "api",
					mixins: [APIService],
					settings: {
						port: null
					} 
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
							broker._restartService(standardObjectsPackageLoaderService);

						WebApp.connectHandlers.use("/", apiService.express());
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