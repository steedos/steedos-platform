const { ServiceBroker } = require("moleculer");
const { MoleculerClientError } = require("moleculer").Errors;

const ApiGateway = require("moleculer-web");
const { ApolloService } = require("../../index");

const fetch = require("node-fetch");

describe("Integration test for greeter service", () => {
	const broker = new ServiceBroker({ logger: false });

	let port;
	const apiSvc = broker.createService({
		name: "api",

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

				checkActionVisibility: true,

				// https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
				serverOptions: {},
			}),
		],

		settings: {
			ip: "0.0.0.0",
			port: 0, // Random
		},

		methods: {
			prepareContextParams(params, actionName) {
				if (actionName === "greeter.replace" && params.input) {
					return params.input;
				}
				return params;
			},
		},
	});

	broker.createService({
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
			welcome: {
				graphql: {
					query: `
						welcome(name: String!): String!
					`,
				},
				handler(ctx) {
					return `Hello ${ctx.params.name}`;
				},
			},
			/*update: {
				graphql: {
					subscription: "update: String!",
					tags: ["TEST"],
				},
				handler(ctx) {
					return ctx.params.payload;
				},
			},*/

			replace: {
				graphql: {
					input: `input GreeterInput {
						name: String!
					}`,
					type: `type GreeterOutput {
						name: String
					}`,
					mutation: "replace(input: GreeterInput!): GreeterOutput",
				},
				handler(ctx) {
					return ctx.params;
				},
			},

			danger: {
				graphql: {
					query: "danger: String!",
				},
				async handler() {
					throw new MoleculerClientError(
						"I've said it's a danger action!",
						422,
						"DANGER"
					);
				},
			},

			secret: {
				visibility: "protected",
				graphql: {
					query: "secret: String!",
				},
				async handler() {
					return "! TOP SECRET !";
				},
			},
		},
	});

	beforeAll(async () => {
		await broker.start();
		port = apiSvc.server.address().port;
	});
	afterAll(() => broker.stop());

	it("should call the greeter.hello action", async () => {
		const res = await fetch(`http://127.0.0.1:${port}/graphql`, {
			method: "post",
			body: JSON.stringify({
				operationName: null,
				variables: {},
				query: "{ hello }",
			}),
			headers: { "Content-Type": "application/json" },
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toStrictEqual({
			data: {
				hello: "Hello Moleculer!",
			},
		});
	});

	it("should call the greeter.welcome action with parameter", async () => {
		const res = await fetch(`http://127.0.0.1:${port}/graphql`, {
			method: "post",
			body: JSON.stringify({
				operationName: null,
				variables: {},
				query: 'query { welcome(name: "GraphQL") }',
			}),
			headers: { "Content-Type": "application/json" },
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toStrictEqual({
			data: {
				welcome: "Hello GraphQL",
			},
		});
	});

	it("should call the greeter.welcome action with query variable", async () => {
		const res = await fetch(`http://127.0.0.1:${port}/graphql`, {
			method: "post",
			body: JSON.stringify({
				operationName: null,
				variables: { name: "Moleculer GraphQL" },
				query: "query ($name: String!) { welcome(name: $name) }",
			}),
			headers: { "Content-Type": "application/json" },
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toStrictEqual({
			data: {
				welcome: "Hello Moleculer GraphQL",
			},
		});
	});

	it("should call the greeter.welcome action with wrapped input params", async () => {
		const res = await fetch(`http://127.0.0.1:${port}/graphql`, {
			method: "post",
			body: JSON.stringify({
				operationName: null,
				variables: { name: "Moleculer GraphQL" },
				query: "mutation ($name: String!) { replace(input: { name: $name }) { name } }",
			}),
			headers: { "Content-Type": "application/json" },
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toStrictEqual({
			data: {
				replace: {
					name: "Moleculer GraphQL",
				},
			},
		});
	});

	it("should call the greeter.danger and receives an error", async () => {
		const res = await fetch(`http://127.0.0.1:${port}/graphql`, {
			method: "post",
			body: JSON.stringify({
				operationName: null,
				variables: {},
				query: "query { danger }",
			}),
			headers: { "Content-Type": "application/json" },
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toStrictEqual({
			data: null,
			errors: [
				{
					extensions: {
						code: "INTERNAL_SERVER_ERROR",
						exception: {
							code: 422,
							retryable: false,
							type: "DANGER",
						},
					},
					locations: [
						{
							column: 9,
							line: 1,
						},
					],
					message: "I've said it's a danger action!",
					path: ["danger"],
				},
			],
		});
	});

	it("should not call the greeter.secret", async () => {
		const res = await fetch(`http://127.0.0.1:${port}/graphql`, {
			method: "post",
			body: JSON.stringify({
				operationName: null,
				variables: {},
				query: "query { danger }",
			}),
			headers: { "Content-Type": "application/json" },
		});

		expect(res.status).toBe(200);
		expect(await res.json()).toStrictEqual({
			data: null,
			errors: [
				{
					extensions: {
						code: "INTERNAL_SERVER_ERROR",
						exception: {
							code: 422,
							retryable: false,
							type: "DANGER",
						},
					},
					locations: [
						{
							column: 9,
							line: 1,
						},
					],
					message: "I've said it's a danger action!",
					path: ["danger"],
				},
			],
		});
	});
});
