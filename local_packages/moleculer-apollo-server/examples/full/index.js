"use strict";

const fs = require("fs");
const { Kind } = require("graphql");
const { ServiceBroker } = require("moleculer");
const ApiGateway = require("moleculer-web");
const { ApolloService } = require("../../index");

const broker = new ServiceBroker({
	logLevel: process.env.LOGLEVEL || "info" /*, transporter: "NATS"*/,
});

broker.createService({
	name: "api",

	mixins: [
		// Gateway
		ApiGateway,

		// GraphQL Apollo Server
		ApolloService({
			// Global GraphQL typeDefs
			typeDefs: ["scalar Date", "scalar Timestamp"],

			// Global resolvers
			resolvers: {
				Date: {
					__parseValue(value) {
						return new Date(value); // value from the client
					},
					__serialize(value) {
						return value.toISOString().split("T")[0]; // value sent to the client
					},
					__parseLiteral(ast) {
						if (ast.kind === Kind.INT) {
							return parseInt(ast.value, 10); // ast value is always in string format
						}

						return null;
					},
				},
				Timestamp: {
					__parseValue(value) {
						return new Date(value); // value from the client
					},
					__serialize(value) {
						return value.toISOString(); // value sent to the client
					},
					__parseLiteral(ast) {
						if (ast.kind === Kind.INT) {
							return parseInt(ast.value, 10); // ast value is always in string format
						}

						return null;
					},
				},
			},

			// API Gateway route options
			routeOptions: {
				path: "/graphql",
				cors: true,
				mappingPolicy: "restrict",
			},

			// https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
			serverOptions: {
				tracing: false,

				engine: {
					apiKey: process.env.APOLLO_ENGINE_KEY,
				},
			},
		}),
	],

	events: {
		"graphql.schema.updated"({ schema }) {
			fs.writeFileSync(__dirname + "/generated-schema.gql", schema, "utf8");
			this.logger.info("Generated GraphQL schema:\n\n" + schema);
		},
	},
});

broker.loadServices(__dirname);

broker.start().then(async () => {
	broker.repl();

	broker.logger.info("----------------------------------------------------------");
	broker.logger.info("Open the http://localhost:3000/graphql URL in your browser");
	broker.logger.info("----------------------------------------------------------");
});
