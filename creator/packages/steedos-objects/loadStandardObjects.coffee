try
	if Meteor.isDevelopment
		steedosCore = require('@steedos/core')
		objectql = require('@steedos/objectql')
		moleculer = require("moleculer");
		packageLoader = require('@steedos/service-meteor-package-loader');
		path = require('path')
		settings = {
			built_in_plugins: [
				"@steedos/workflow",
				"@steedos/accounts",
				"@steedos/steedos-plugin-schema-builder",
				"@steedos/plugin-enterprise",
				"@steedos/word-template",
				"@steedos/plugin-qywx",
				"@steedos/metadata-api",
				"@steedos/plugin-dingtalk"],
			plugins: []
		}
		Meteor.startup ->
			try
				broker = new moleculer.ServiceBroker({
					namespace: "steedos",
					nodeID: "steedos-creator",
					metadata: {},
					transporter: process.env.TRANSPORTER,
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
					}
				})
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

						broker.waitForServices(standardObjectsPackageLoaderService.name).then (resolve, reject) ->
							steedosCore.init.call(settings).then ()->
								cb(reject, resolve)
					)
				)()
			catch ex
				console.error("error:",ex)
catch e
	console.error("error:",e)