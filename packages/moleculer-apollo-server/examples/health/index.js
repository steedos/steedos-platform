"use strict";

let { ServiceBroker } = require("moleculer");

const ApiGateway = require("moleculer-web");
const { ApolloService } = require("../../index");

const brokerWithRandomHealthy = new ServiceBroker({
	logLevel: "info",
	hotReload: true,
	namespace: "randomhealthy",
});

const brokerWithWrongSchema = new ServiceBroker({
	logLevel: "info",
	hotReload: true,
	namespace: "wrongschema",
});

const greeterService = {
	name: "greeter",

	actions: {
		hello: {
			graphql: {
				query: "hello: String!",
			},
			handler() {
				return "Hello Moleculer!";
			},
		},
	},
};

// ===================================
// Random healthy
// ===================================

brokerWithRandomHealthy.createService({
	name: "api",
	settings: { port: 3000 },
	mixins: [
		// Gateway
		ApiGateway,

		// GraphQL Apollo Server
		ApolloService({
			// API Gateway route options
			routeOptions: {
				path: "/graphql",
				cors: true,
				mappingPolicy: "restrict",
			},

			// https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
			serverOptions: {
				async onHealthCheck() {
					if (Math.random() >= 0.5) {
						throw new Error("Database not connected");
					}
					return { database: true, storage: true };
				},
			},
		}),
	],
});
brokerWithRandomHealthy.createService(greeterService);

// ===================================
// Schema non healthy
// ===================================

brokerWithWrongSchema.createService({
	name: "api",
	settings: { port: 3001 },
	mixins: [
		// Gateway
		ApiGateway,

		// GraphQL Apollo Server
		ApolloService({
			typeDefs: "ThisIsSoWrongInMySchema",
			// API Gateway route options
			routeOptions: {
				path: "/graphql",
				cors: true,
				mappingPolicy: "restrict",
			},

			// https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
			serverOptions: {},
		}),
	],
});
brokerWithWrongSchema.createService(greeterService);

// ===================================

Promise.all([brokerWithRandomHealthy.start(), brokerWithWrongSchema.start()]).then(() => {
	brokerWithWrongSchema.logger.info("API With wrong schema started ----------------------------");
	brokerWithWrongSchema.logger.info("Open the http://localhost:3001/graphql URL in your browser");
	brokerWithWrongSchema.logger.info("----------------------------------------------------------");

	brokerWithRandomHealthy.logger.info("API With random health result (1/2) ----------------------");
	brokerWithRandomHealthy.logger.info("Open the http://localhost:3000/graphql URL in your browser");
	brokerWithRandomHealthy.logger.info("----------------------------------------------------------");

	brokerWithWrongSchema.repl();
});
