"use strict";

jest.mock("apollo-server-core");
const { ApolloServerBase } = require("apollo-server-core");

jest.mock("graphql-upload");
const GraphqlUpload = require("graphql-upload");

jest.mock("@apollographql/graphql-playground-html");
const Playground = require("@apollographql/graphql-playground-html");

jest.mock("../../src/moleculerApollo");
const moleculerApollo = require("../../src/moleculerApollo");

const ApolloServer = require("../../src/ApolloServer").ApolloServer;

//ApolloServerCore.convertNodeHttpToRequest.mockImplementation(() => "convertedRequest");

describe("Test ApolloServer", () => {
	test("should support Uploads", () => {
		const apolloServer = new ApolloServer({});
		expect(apolloServer.supportsUploads()).toBe(true);
	});

	test("should support subscriptions", () => {
		const apolloServer = new ApolloServer({});
		expect(apolloServer.supportsSubscriptions()).toBe(true);
	});

	test("should call super graphQLServerOptions", () => {
		const apolloServer = new ApolloServer({});
		ApolloServerBase.prototype.graphQLServerOptions = jest.fn();

		apolloServer.createGraphQLServerOptions("req", "res");

		expect(ApolloServerBase.prototype.graphQLServerOptions).toBeCalledTimes(1);
		expect(ApolloServerBase.prototype.graphQLServerOptions).toBeCalledWith({
			req: "req",
			res: "res",
		});
	});

	describe("Test healthcheck handler", () => {
		const apolloServer = new ApolloServer({});

		const fakeCtx = {
			meta: {},
		};
		const fakeService = {
			sendResponse: jest.fn(),
		};

		const fakeReq = {};
		const fakeRes = {
			$ctx: fakeCtx,
			$service: fakeService,
			$route: {},
		};

		test("should return 200 'pass'", async () => {
			const onHealthCheck = jest.fn(() => "Everything OK");

			await apolloServer.handleHealthCheck({ req: fakeReq, res: fakeRes, onHealthCheck });

			expect(onHealthCheck).toBeCalledTimes(1);
			expect(onHealthCheck).toBeCalledWith(fakeReq);

			expect(fakeRes.statusCode).toBe(200);

			expect(fakeService.sendResponse).toBeCalledTimes(1);
			expect(fakeService.sendResponse).toBeCalledWith(fakeReq, fakeRes, {
				result: "Everything OK",
				status: "pass",
			});

			expect(fakeCtx.meta.$responseType).toBe("application/health+json");
		});

		test("should return 503 'fail'", async () => {
			fakeService.sendResponse.mockClear();

			const onHealthCheck = jest.fn(() => Promise.reject(new Error("Something wrong")));

			await apolloServer.handleHealthCheck({ req: fakeReq, res: fakeRes, onHealthCheck });

			expect(onHealthCheck).toBeCalledTimes(1);
			expect(onHealthCheck).toBeCalledWith(fakeReq);

			expect(fakeRes.statusCode).toBe(503);

			expect(fakeService.sendResponse).toBeCalledTimes(1);
			expect(fakeService.sendResponse).toBeCalledWith(fakeReq, fakeRes, {
				result: "Error: Something wrong",
				status: "fail",
			});

			expect(fakeCtx.meta.$responseType).toBe("application/health+json");
		});

		test("should call an empty healthcheck function", async () => {
			fakeService.sendResponse.mockClear();
			fakeCtx.meta.$responseType = "application/json";

			const onHealthCheck = null;

			await apolloServer.handleHealthCheck({ req: fakeReq, res: fakeRes, onHealthCheck });

			expect(fakeRes.statusCode).toBe(200);

			expect(fakeService.sendResponse).toBeCalledTimes(1);
			expect(fakeService.sendResponse).toBeCalledWith(fakeReq, fakeRes, {
				result: undefined,
				status: "pass",
			});

			expect(fakeCtx.meta.$responseType).toBe("application/json");
		});
	});

	describe("Test createHandler", () => {
		const apolloServer = new ApolloServer({});
		apolloServer.createGraphQLServerOptions = jest.fn();
		apolloServer.willStart = jest.fn(() => Promise.resolve());
		const fakeGraphqlHandler = jest.fn(() => Promise.resolve("GraphQL Response Data"));
		moleculerApollo.mockImplementation(() => fakeGraphqlHandler);

		const fakeCtx = {
			meta: {},
		};
		const fakeService = {
			sendResponse: jest.fn(),
		};

		let fakeReq;
		let fakeRes;

		beforeEach(() => {
			fakeReq = {
				headers: {},
			};
			fakeRes = {
				$ctx: fakeCtx,
				$service: fakeService,
				$route: {},
			};
		});

		test("should handle as a request", async () => {
			const handler = apolloServer.createHandler();

			await handler(fakeReq, fakeRes);

			expect(moleculerApollo).toBeCalledTimes(1);
			expect(moleculerApollo).toBeCalledWith(expect.any(Function));

			expect(fakeGraphqlHandler).toBeCalledTimes(1);
			expect(fakeGraphqlHandler).toBeCalledWith(fakeReq, fakeRes);

			expect(fakeRes.statusCode).toBe(200);

			expect(fakeService.sendResponse).toBeCalledTimes(1);
			expect(fakeService.sendResponse).toBeCalledWith(
				fakeReq,
				fakeRes,
				"GraphQL Response Data"
			);

			expect(fakeCtx.meta.$responseType).toBe("application/json");

			// Call "moleculerApollo" first argument
			moleculerApollo.mock.calls[0][0]();
			expect(apolloServer.createGraphQLServerOptions).toBeCalledTimes(1);
			expect(apolloServer.createGraphQLServerOptions).toBeCalledWith(fakeReq, fakeRes);
		});

		test("should call onAfterCall function", async () => {
			const handler = apolloServer.createHandler();
			const onAfterCall = jest.fn();
			const $route = { onAfterCall };
			fakeRes.$route = $route;

			await handler(fakeReq, fakeRes);

			expect(onAfterCall).toHaveBeenCalledTimes(1);
			expect(onAfterCall).toHaveBeenCalledWith(
				fakeCtx,
				$route,
				fakeReq,
				fakeRes,
				"GraphQL Response Data"
			);
		});

		test("should handle as a file upload request", async () => {
			// Clear mocks
			moleculerApollo.mockClear();
			fakeGraphqlHandler.mockClear();
			fakeService.sendResponse.mockClear();
			apolloServer.createGraphQLServerOptions.mockClear();
			GraphqlUpload.processRequest.mockImplementation(() => Promise.resolve("file upload"));

			// Init mocks
			apolloServer.uploadsConfig = { a: 5 };
			fakeReq.headers["content-type"] = "multipart/form-data";

			// Create handler
			const handler = apolloServer.createHandler();

			// Call handler
			await handler(fakeReq, fakeRes);

			// Assertions
			expect(fakeReq.filePayload).toBe("file upload");
			expect(GraphqlUpload.processRequest).toBeCalledTimes(1);
			expect(GraphqlUpload.processRequest).toBeCalledWith(
				fakeReq,
				fakeRes,
				apolloServer.uploadsConfig
			);

			expect(moleculerApollo).toBeCalledTimes(1);
			expect(moleculerApollo).toBeCalledWith(expect.any(Function));

			expect(fakeGraphqlHandler).toBeCalledTimes(1);
			expect(fakeGraphqlHandler).toBeCalledWith(fakeReq, fakeRes);

			expect(fakeRes.statusCode).toBe(200);

			expect(fakeService.sendResponse).toBeCalledTimes(1);
			expect(fakeService.sendResponse).toBeCalledWith(
				fakeReq,
				fakeRes,
				"GraphQL Response Data"
			);

			expect(fakeCtx.meta.$responseType).toBe("application/json");
		});

		test("should handle as health-check request", async () => {
			// Clear mocks
			moleculerApollo.mockClear();
			fakeGraphqlHandler.mockClear();
			fakeService.sendResponse.mockClear();
			apolloServer.createGraphQLServerOptions.mockClear();
			GraphqlUpload.processRequest.mockClear();
			jest.spyOn(apolloServer, "handleHealthCheck");

			// Init mocks
			fakeReq.url = "/.well-known/apollo/server-health";
			const onHealthCheck = jest.fn();

			// Create handler
			const handler = apolloServer.createHandler({ onHealthCheck });

			// Call handler
			await handler(fakeReq, fakeRes);

			// Assertions
			expect(apolloServer.handleHealthCheck).toBeCalledTimes(1);
			expect(apolloServer.handleHealthCheck).toBeCalledWith({
				req: fakeReq,
				res: fakeRes,
				onHealthCheck,
			});

			expect(moleculerApollo).toBeCalledTimes(0);
		});

		test("should not handle as health-check request if disabled", async () => {
			// Clear mocks
			moleculerApollo.mockClear();
			fakeGraphqlHandler.mockClear();
			fakeService.sendResponse.mockClear();
			apolloServer.createGraphQLServerOptions.mockClear();
			GraphqlUpload.processRequest.mockClear();
			apolloServer.handleHealthCheck.mockClear();

			// Init mocks
			fakeReq.url = "/.well-known/apollo/server-health";
			const onHealthCheck = jest.fn();

			// Create handler
			const handler = apolloServer.createHandler({ disableHealthCheck: true, onHealthCheck });

			// Call handler
			await handler(fakeReq, fakeRes);

			// Assertions
			expect(apolloServer.handleHealthCheck).toBeCalledTimes(0);
			expect(moleculerApollo).toBeCalledTimes(1);
		});

		test("should handle as playground request", async () => {
			// Clear mocks
			moleculerApollo.mockClear();
			fakeService.sendResponse.mockClear();
			Playground.renderPlaygroundPage.mockImplementation(() => "playground-page");

			// Init mocks
			apolloServer.playgroundOptions = {
				b: "John",
			};
			apolloServer.subscriptionsPath = "/subscription";
			fakeCtx.meta.$responseType = null;
			fakeReq.url = "/graphql";
			fakeReq.method = "GET";
			fakeReq.headers = {
				accept: "text/html",
			};

			// Create handler
			const handler = apolloServer.createHandler();

			// Call handler
			await handler(fakeReq, fakeRes);

			// Assertions
			expect(moleculerApollo).toBeCalledTimes(0);

			expect(Playground.renderPlaygroundPage).toBeCalledTimes(1);
			expect(Playground.renderPlaygroundPage).toBeCalledWith({
				endpoint: "/graphql",
				subscriptionEndpoint: "/subscription",
				b: "John",
			});

			expect(fakeRes.statusCode).toBe(200);

			expect(fakeService.sendResponse).toBeCalledTimes(1);
			expect(fakeService.sendResponse).toBeCalledWith(fakeReq, fakeRes, "playground-page");

			expect(fakeCtx.meta.$responseType).toBe("text/html");
		});
	});
});
