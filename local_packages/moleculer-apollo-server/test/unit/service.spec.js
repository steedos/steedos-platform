"use strict";

jest.mock("../../src/ApolloServer");
const { ApolloServer } = require("../../src/ApolloServer");

jest.mock("graphql-tools");
const { makeExecutableSchema } = require("graphql-tools");

jest.mock("graphql");
const GraphQL = require("graphql");

jest.mock("graphql-subscriptions");
const { PubSub, withFilter } = require("graphql-subscriptions");

const ApolloServerService = require("../../src/service");

const { ServiceBroker, Context, Errors } = require("moleculer");

async function startService(mixinOptions, baseSchema) {
	const broker = new ServiceBroker({ logger: false });

	baseSchema = baseSchema || {
		name: "api",
		settings: {
			routes: [],
		},
	};

	const svc = broker.createService(ApolloServerService(mixinOptions), baseSchema);
	await broker.start();

	return { broker, svc, stop: () => broker.stop() };
}

describe("Test Service", () => {
	describe("Test created handler", () => {
		it("should register a route with default options", async () => {
			const { svc, stop } = await startService();

			expect(svc.shouldUpdateGraphqlSchema).toBe(true);

			expect(svc.settings.routes[0]).toStrictEqual({
				path: "/graphql",

				aliases: {
					"/": expect.any(Function),
					"GET /.well-known/apollo/server-health": expect.any(Function),
				},

				mappingPolicy: "restrict",

				bodyParsers: {
					json: true,
					urlencoded: { extended: true },
				},
			});
			await stop();
		});

		describe("Test `/` route handler", () => {
			it("should prepare graphql schema & call handler", async () => {
				const { svc, stop } = await startService();

				// Test `/` alias
				svc.prepareGraphQLSchema = jest.fn();
				svc.graphqlHandler = jest.fn(() => "result");
				const fakeReq = { req: 1 };
				const fakeRes = { res: 1 };

				const res = await svc.settings.routes[0].aliases["/"].call(svc, fakeReq, fakeRes);

				expect(res).toBe("result");
				expect(svc.prepareGraphQLSchema).toBeCalledTimes(1);
				expect(svc.graphqlHandler).toBeCalledTimes(1);
				expect(svc.graphqlHandler).toBeCalledWith(fakeReq, fakeRes);

				await stop();
			});

			it("should call sendError if error occurs when preparing graphql schema", async () => {
				const { svc, stop } = await startService();

				const err = new Error("Something happened");
				svc.sendError = jest.fn();
				svc.prepareGraphQLSchema = jest.fn(() => {
					throw err;
				});
				svc.graphqlHandler = jest.fn(() => "result");
				const fakeReq = { req: 1 };
				const fakeRes = { res: 1 };

				const res = await svc.settings.routes[0].aliases["/"].call(svc, fakeReq, fakeRes);

				expect(res).toBeUndefined();
				expect(svc.prepareGraphQLSchema).toBeCalledTimes(1);
				expect(svc.graphqlHandler).toBeCalledTimes(0);
				expect(svc.sendError).toBeCalledTimes(1);
				expect(svc.sendError).toBeCalledWith(fakeReq, fakeRes, err);

				await stop();
			});

			it("should call sendError if error occurs when handling graphql request", async () => {
				const { svc, stop } = await startService();

				const err = new Error("Something happened");
				svc.sendError = jest.fn();
				svc.prepareGraphQLSchema = jest.fn();
				svc.graphqlHandler = jest.fn(() => {
					throw err;
				});
				const fakeReq = { req: 1 };
				const fakeRes = { res: 1 };

				const res = await svc.settings.routes[0].aliases["/"].call(svc, fakeReq, fakeRes);

				expect(res).toBeUndefined();
				expect(svc.prepareGraphQLSchema).toBeCalledTimes(1);
				expect(svc.graphqlHandler).toBeCalledTimes(1);
				expect(svc.sendError).toBeCalledTimes(1);
				expect(svc.sendError).toBeCalledWith(fakeReq, fakeRes, err);

				await stop();
			});
		});

		describe("Test `GET /.well-known/apollo/server-health` route handler", () => {
			it("should prepare graphql schema & call handler", async () => {
				const { svc, stop } = await startService();

				// Test `/` alias
				svc.prepareGraphQLSchema = jest.fn();
				svc.graphqlHandler = jest.fn(() => "result");
				const fakeReq = { req: 1 };
				const fakeRes = { res: 1 };

				const res = await svc.settings.routes[0].aliases[
					"GET /.well-known/apollo/server-health"
				].call(svc, fakeReq, fakeRes);

				expect(res).toBe("result");
				expect(svc.prepareGraphQLSchema).toBeCalledTimes(1);
				expect(svc.graphqlHandler).toBeCalledTimes(1);
				expect(svc.graphqlHandler).toBeCalledWith(fakeReq, fakeRes);

				await stop();
			});

			it("should call sendError if error occurs when preparing graphql schema", async () => {
				const { svc, stop } = await startService();

				const err = new Error("Something happened");
				svc.sendResponse = jest.fn();
				svc.prepareGraphQLSchema = jest.fn(() => {
					throw err;
				});
				svc.graphqlHandler = jest.fn(() => "result");
				const fakeReq = { req: 1 };
				const fakeRes = { res: 1 };

				const res = await svc.settings.routes[0].aliases[
					"GET /.well-known/apollo/server-health"
				].call(svc, fakeReq, fakeRes);

				expect(res).toBeUndefined();
				expect(svc.prepareGraphQLSchema).toBeCalledTimes(1);
				expect(svc.graphqlHandler).toBeCalledTimes(0);
				expect(svc.sendResponse).toBeCalledTimes(1);
				expect(svc.sendResponse).toBeCalledWith(
					fakeReq,
					fakeRes,
					{ status: "fail", schema: false },
					{ responseType: "application/health+json" }
				);

				await stop();
			});

			it("should call sendError if error occurs when handling graphql request", async () => {
				const { svc, stop } = await startService();

				const err = new Error("Something happened");
				svc.sendResponse = jest.fn();
				svc.prepareGraphQLSchema = jest.fn();
				svc.graphqlHandler = jest.fn(() => {
					throw err;
				});
				const fakeReq = { req: 1 };
				const fakeRes = { res: 1 };

				const res = await svc.settings.routes[0].aliases[
					"GET /.well-known/apollo/server-health"
				].call(svc, fakeReq, fakeRes);

				expect(res).toBeUndefined();
				expect(svc.prepareGraphQLSchema).toBeCalledTimes(1);
				expect(svc.graphqlHandler).toBeCalledTimes(1);
				expect(svc.sendResponse).toBeCalledTimes(1);
				expect(svc.sendResponse).toBeCalledWith(
					fakeReq,
					fakeRes,
					{ status: "fail", schema: false },
					{ responseType: "application/health+json" }
				);

				await stop();
			});
		});

		it("should register a route with custom options", async () => {
			const { svc, stop } = await startService({
				routeOptions: {
					path: "/apollo-server",

					aliases: {
						"GET /my-alias": jest.fn(),
					},

					cors: true,
				},
			});

			expect(svc.settings.routes[0]).toStrictEqual({
				path: "/apollo-server",

				aliases: {
					"/": expect.any(Function),
					"GET /.well-known/apollo/server-health": expect.any(Function),
					"GET /my-alias": expect.any(Function),
				},

				mappingPolicy: "restrict",

				bodyParsers: {
					json: true,
					urlencoded: { extended: true },
				},

				cors: true,
			});

			await stop();
		});
	});

	describe("Test registered events", () => {
		it("should subscribe to '$services.changed' event", async () => {
			const { broker, svc, stop } = await startService();
			svc.invalidateGraphQLSchema = jest.fn();

			await broker.broadcastLocal("$services.changed");

			expect(svc.invalidateGraphQLSchema).toBeCalledTimes(1);
			expect(svc.invalidateGraphQLSchema).toBeCalledWith();

			await stop();
		});

		it("should not invalidate schema when autoUpdateSchema is false", async () => {
			const { broker, svc, stop } = await startService({
				autoUpdateSchema: false,
			});
			svc.invalidateGraphQLSchema = jest.fn();

			await broker.broadcastLocal("$services.changed");

			expect(svc.invalidateGraphQLSchema).toBeCalledTimes(0);

			await stop();
		});

		it("should not invalidate schema when autoUpdateSchema is true", async () => {
			const { broker, svc, stop } = await startService({
				autoUpdateSchema: true,
			});
			svc.invalidateGraphQLSchema = jest.fn();

			await broker.broadcastLocal("$services.changed");

			expect(svc.invalidateGraphQLSchema).toBeCalledTimes(1);
			expect(svc.invalidateGraphQLSchema).toBeCalledWith();

			await stop();
		});

		it("should subscribe to the default subscription event", async () => {
			const { broker, svc, stop } = await startService();

			svc.pubsub = {
				publish: jest.fn(),
			};

			await broker.broadcastLocal("graphql.publish", {
				tag: "tag",
				payload: { a: 5 },
			});

			expect(svc.pubsub.publish).toBeCalledTimes(1);
			expect(svc.pubsub.publish).toBeCalledWith("tag", { a: 5 });

			await stop();
		});

		it("should subscribe to a custom subscription event", async () => {
			const { broker, svc, stop } = await startService({
				subscriptionEventName: "my.graphql.event",
			});

			svc.pubsub = {
				publish: jest.fn(),
			};

			await broker.broadcastLocal("my.graphql.event", {
				tag: "tag",
				payload: { a: 5 },
			});

			expect(svc.pubsub.publish).toBeCalledTimes(1);
			expect(svc.pubsub.publish).toBeCalledWith("tag", { a: 5 });

			await stop();
		});
	});

	describe("Test action", () => {
		it("should create the 'graphql' action", async () => {
			const { broker, svc, stop } = await startService();
			svc.prepareGraphQLSchema = jest.fn();
			svc.graphqlSchema = "graphqlSchema";
			GraphQL.graphql.mockImplementation(async () => "result");

			const res = await broker.call("api.graphql", {
				query: "my-query",
				variables: { a: 5 },
			});
			expect(res).toBe("result");

			expect(svc.prepareGraphQLSchema).toBeCalledTimes(1);
			expect(svc.prepareGraphQLSchema).toBeCalledWith();

			expect(GraphQL.graphql).toBeCalledTimes(1);
			expect(GraphQL.graphql).toBeCalledWith(
				"graphqlSchema",
				"my-query",
				null,
				{ ctx: expect.any(Context) },
				{ a: 5 }
			);

			await stop();
		});

		it("should not create the 'graphql' action", async () => {
			const { broker, stop } = await startService({ createAction: false });

			await expect(broker.call("api.graphql")).rejects.toThrow(Errors.ServiceNotFoundError);

			await stop();
		});
	});

	describe("Test methods", () => {
		describe("Test 'invalidateGraphQLSchema'", () => {
			it("should create the 'graphql' action", async () => {
				const { svc, stop } = await startService();

				svc.shouldUpdateGraphqlSchema = false;

				svc.invalidateGraphQLSchema();

				expect(svc.shouldUpdateGraphqlSchema).toBe(true);

				await stop();
			});
		});

		describe("Test 'getFieldName'", () => {
			let svc, stop;

			beforeAll(async () => {
				const res = await startService();
				svc = res.svc;
				stop = res.stop;
			});

			afterAll(async () => await stop());

			it("should return field name from one-line declaration", async () => {
				expect(svc.getFieldName("posts(limit: Int): [Post]")).toBe("posts");
			});

			it("should return field name from multi-line declaration", async () => {
				expect(
					svc.getFieldName(`
						getWorkspaces(
							name: [String]
							clientId: [String]
							sort: [String]
							pageSize: Int
							page: Int
						) : [Workspace]`)
				).toBe("getWorkspaces");
			});

			it("should return field name with comments", async () => {
				expect(
					svc.getFieldName(`
					# Get all posts with limit
					# Returns an array
					posts(limit: Int): [Post]`)
				).toBe("posts");
			});
		});
	});

	describe("Test 'getServiceName'", () => {
		it("should return the service fullName", async () => {
			const { svc, stop } = await startService();

			expect(svc.getServiceName({ name: "posts" })).toBe("posts");
			expect(svc.getServiceName({ name: "posts", version: 5 })).toBe("v5.posts");
			expect(svc.getServiceName({ name: "posts", version: "staging" })).toBe("staging.posts");
			expect(
				svc.getServiceName({ name: "posts", version: "staging", fullName: "full.posts" })
			).toBe("full.posts");

			await stop();
		});
	});

	describe("Test 'getResolverActionName'", () => {
		it("should return the resolver name", async () => {
			const { svc, stop } = await startService();

			expect(svc.getResolverActionName("posts", "list")).toBe("posts.list");
			expect(svc.getResolverActionName("users", "users.list")).toBe("users.list");

			await stop();
		});
	});

	describe("Test 'createServiceResolvers'", () => {
		it("should call actionResolvers", async () => {
			const { svc, stop } = await startService();

			svc.createActionResolver = jest.fn(() => jest.fn());

			const resolvers = {
				author: {
					// Call the `users.resolve` action with `id` params
					action: "users.resolve",
					rootParams: {
						author: "id",
					},
				},
				voters: {
					// Call the `users.resolve` action with `id` params
					action: "voters.get",
					rootParams: {
						voters: "id",
					},
				},

				UserType: {
					ADMIN: { value: "1" },
					READER: { value: "2" },
				},
			};

			expect(svc.createServiceResolvers("users", resolvers)).toStrictEqual({
				author: expect.any(Function),
				voters: expect.any(Function),
				UserType: {
					ADMIN: { value: "1" },
					READER: { value: "2" },
				},
			});

			expect(svc.createActionResolver).toBeCalledTimes(2);
			expect(svc.createActionResolver).toBeCalledWith("users.resolve", resolvers.author);
			expect(svc.createActionResolver).toBeCalledWith("voters.get", resolvers.voters);

			await stop();
		});
	});

	describe("Test 'createActionResolver' without DataLoader or Upload", () => {
		let broker, svc, stop;

		beforeAll(async () => {
			const res = await startService();
			broker = res.broker;
			svc = res.svc;
			stop = res.stop;
		});

		afterAll(async () => await stop());

		it("should return a resolver Function", async () => {
			expect(svc.createActionResolver("posts.find")).toBeInstanceOf(Function);
		});

		it("should call the given action with keys", async () => {
			const resolver = svc.createActionResolver("posts.find", {
				rootParams: {
					author: "id",
				},

				params: {
					repl: false,
				},
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn(() => "response from action");

			const fakeRoot = { author: 12345 };

			const res = await resolver(fakeRoot, { a: 5 }, { ctx });

			expect(res).toBe("response from action");

			expect(ctx.call).toBeCalledTimes(1);
			expect(ctx.call).toBeCalledWith("posts.find", {
				a: 5,
				id: 12345,
				repl: false,
			});
		});

		it("should throw error", async () => {
			const resolver = svc.createActionResolver("posts.find", {
				params: {
					limit: 5,
				},
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn(() =>
				Promise.reject(new Errors.MoleculerError("Something happened"))
			);

			const fakeRoot = { author: 12345 };

			expect.assertions(3);
			try {
				await resolver(fakeRoot, { a: 5 }, { ctx });
			} catch (err) {
				expect(err.message).toBe("Something happened");
			}

			expect(ctx.call).toBeCalledTimes(1);
			expect(ctx.call).toBeCalledWith("posts.find", {
				limit: 5,
				a: 5,
			});
		});

		it("should not throw error if nullIfError is true", async () => {
			const resolver = svc.createActionResolver("posts.find", {
				nullIfError: true,
				rootParams: {
					author: "id",
					"company.code": "company.code",
				},
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn(() =>
				Promise.reject(new Errors.MoleculerError("Something happened"))
			);

			const fakeRoot = { author: 12345, company: { code: "Moleculer" } };

			const res = await resolver(fakeRoot, { a: 5 }, { ctx });

			expect(res).toBeNull();

			expect(ctx.call).toBeCalledTimes(1);
			expect(ctx.call).toBeCalledWith("posts.find", {
				id: 12345,
				company: {
					code: "Moleculer",
				},
				a: 5,
			});
		});

		it("should use null value if skipNullKeys is false", async () => {
			const resolver = svc.createActionResolver("posts.find", {
				rootParams: {
					author: "id",
				},
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn(() => "response from action");

			const fakeRoot = {};

			const res = await resolver(fakeRoot, { a: 5 }, { ctx });

			expect(res).toBe("response from action");

			expect(ctx.call).toBeCalledTimes(1);
			expect(ctx.call).toBeCalledWith("posts.find", {
				id: undefined,
				a: 5,
			});
		});

		it("should not call action if id is null and skipNullKeys is true", async () => {
			const resolver = svc.createActionResolver("posts.find", {
				skipNullKeys: true,
				rootParams: {
					author: "id",
				},
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn(() => "response from action");

			const fakeRoot = {};

			const res = await resolver(fakeRoot, { a: 5 }, { ctx });

			expect(res).toBe(null);

			expect(ctx.call).toBeCalledTimes(0);
		});
	});

	describe("Test 'createActionResolver' with File Upload", () => {
		let broker, svc, stop;

		beforeAll(async () => {
			const res = await startService();
			broker = res.broker;
			svc = res.svc;
			stop = res.stop;
		});

		afterAll(async () => await stop());

		it("should create a stream and pass to call", async () => {
			const resolver = svc.createActionResolver("posts.uploadSingle", {
				fileUploadArg: "file",
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn(() => "response from action");

			const fakeRoot = {};

			const file = {
				filename: "filename.txt",
				encoding: "7bit",
				mimetype: "text/plain",
				createReadStream: () => "fake read stream",
			};

			const res = await resolver(fakeRoot, { file, other: "something" }, { ctx });

			expect(res).toBe("response from action");

			expect(ctx.call).toBeCalledTimes(1);
			expect(ctx.call).toBeCalledWith("posts.uploadSingle", "fake read stream", {
				meta: {
					$fileInfo: {
						filename: "filename.txt",
						encoding: "7bit",
						mimetype: "text/plain",
					},
					$args: { other: "something" },
				},
			});
		});

		it("should invoke call once per file when handling an array of file uploads", async () => {
			const resolver = svc.createActionResolver("posts.uploadMulti", {
				fileUploadArg: "files",
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn((_, stream) => `response for ${stream}`);

			const fakeRoot = {};

			const files = [
				{
					filename: "filename1.txt",
					encoding: "7bit",
					mimetype: "text/plain",
					createReadStream: () => "fake read stream 1",
				},
				{
					filename: "filename2.txt",
					encoding: "7bit",
					mimetype: "text/plain",
					createReadStream: () => "fake read stream 2",
				},
			];

			const res = await resolver(fakeRoot, { files, other: "something" }, { ctx });

			expect(res).toEqual([
				"response for fake read stream 1",
				"response for fake read stream 2",
			]);

			expect(ctx.call).toBeCalledTimes(2);
			expect(ctx.call).toBeCalledWith("posts.uploadMulti", "fake read stream 1", {
				meta: {
					$fileInfo: {
						filename: "filename1.txt",
						encoding: "7bit",
						mimetype: "text/plain",
					},
					$args: { other: "something" },
				},
			});
			expect(ctx.call).toBeCalledWith("posts.uploadMulti", "fake read stream 2", {
				meta: {
					$fileInfo: {
						filename: "filename2.txt",
						encoding: "7bit",
						mimetype: "text/plain",
					},
					$args: { other: "something" },
				},
			});
		});
	});

	describe("Test 'createActionResolver' with DataLoader", () => {
		let broker, svc, stop;

		beforeAll(async () => {
			const res = await startService();
			broker = res.broker;
			svc = res.svc;
			stop = res.stop;
		});

		afterAll(async () => await stop());

		beforeEach(() => {
			svc.dataLoaderOptions.clear();
			svc.dataLoaderBatchParams.clear();
		});

		it("should return null if no rootValue", async () => {
			const resolver = svc.createActionResolver("posts.find", {
				rootParams: {
					author: "id",
				},

				dataLoader: true,
			});

			const fakeRoot = { user: 12345 };

			const res = await resolver(fakeRoot, { a: 5 }, { dataLoaders: new Map() });

			expect(res).toBeNull();
		});

		it("should call the action via the loader with single value", async () => {
			const resolver = svc.createActionResolver("users.resolve", {
				rootParams: {
					author: "id",
				},

				dataLoader: true,
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn().mockResolvedValue(["response from action"]);

			const fakeRoot = { author: 12345 };

			const res = await resolver(fakeRoot, { a: 5 }, { ctx, dataLoaders: new Map() });

			expect(res).toBe("response from action");

			expect(ctx.call).toHaveBeenCalledTimes(1);
			expect(ctx.call).toHaveBeenNthCalledWith(1, "users.resolve", { a: 5, id: [12345] });
		});

		it("should call the action via the loader with multi value", async () => {
			const resolver = svc.createActionResolver("users.resolve", {
				rootParams: {
					author: "id",
				},

				dataLoader: true,
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn().mockResolvedValue(["res1", "res2", "res3"]);

			const fakeRoot = { author: [1, 2, 5] };

			const res = await resolver(fakeRoot, { a: 5 }, { ctx, dataLoaders: new Map() });

			expect(res).toEqual(["res1", "res2", "res3"]);

			expect(ctx.call).toHaveBeenCalledTimes(1);
			expect(ctx.call).toHaveBeenNthCalledWith(1, "users.resolve", { a: 5, id: [1, 2, 5] });
		});

		it("should call the action via the loader with multi value and use max batch size", async () => {
			svc.dataLoaderOptions.set("users.resolve", { maxBatchSize: 2 });
			const resolver = svc.createActionResolver("users.resolve", {
				rootParams: {
					author: "id",
				},

				dataLoader: true,
			});

			const ctx = new Context(broker);
			ctx.call = jest
				.fn()
				.mockResolvedValueOnce(["res1", "res2"])
				.mockResolvedValueOnce(["res3"]);

			const fakeRoot = { author: [1, 2, 5] };

			const res = await resolver(fakeRoot, { a: 5 }, { ctx, dataLoaders: new Map() });

			expect(res).toEqual(["res1", "res2", "res3"]);

			expect(ctx.call).toHaveBeenCalledTimes(2);
			expect(ctx.call).toHaveBeenNthCalledWith(1, "users.resolve", { a: 5, id: [1, 2] });
			expect(ctx.call).toHaveBeenNthCalledWith(2, "users.resolve", { a: 5, id: [5] });
		});

		it("should call the action via the loader using all root params", async () => {
			svc.dataLoaderBatchParams.set("users.resolve", "testBatchParam");
			const resolver = svc.createActionResolver("users.resolve", {
				rootParams: {
					authorId: "authorIdParam",
					testId: "testIdParam",
				},

				dataLoader: true,
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn().mockResolvedValue(["res1", "res2", "res3"]);

			const fakeRoot1 = { authorId: 1, testId: "foo" };
			const fakeRoot2 = { authorId: 2, testId: "bar" };
			const fakeRoot3 = { authorId: 5, testId: "baz" };

			const fakeContext = { ctx, dataLoaders: new Map() };
			const res = await Promise.all([
				resolver(fakeRoot1, {}, fakeContext),
				resolver(fakeRoot2, {}, fakeContext),
				resolver(fakeRoot3, {}, fakeContext),
			]);

			expect(res).toEqual(["res1", "res2", "res3"]);

			expect(ctx.call).toHaveBeenCalledTimes(1);
			expect(ctx.call).toHaveBeenNthCalledWith(1, "users.resolve", {
				testBatchParam: [
					{ authorIdParam: 1, testIdParam: "foo" },
					{ authorIdParam: 2, testIdParam: "bar" },
					{ authorIdParam: 5, testIdParam: "baz" },
				],
			});
		});

		it("should call the action via the loader using all root params while leveraging cache", async () => {
			svc.dataLoaderBatchParams.set("users.resolve", "testBatchParam");
			const resolver = svc.createActionResolver("users.resolve", {
				rootParams: {
					authorId: "authorIdParam",
					testId: "testIdParam",
				},

				dataLoader: true,
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn().mockResolvedValue(["res1", "res2"]);

			const fakeRoot1 = { authorId: 1, testId: "foo" };
			const fakeRoot2 = { authorId: 2, testId: "bar" };
			const fakeRoot3 = { authorId: 1, testId: "foo" }; // same as fakeRoot1

			const fakeContext = { ctx, dataLoaders: new Map() };
			const res = await Promise.all([
				resolver(fakeRoot1, {}, fakeContext),
				resolver(fakeRoot2, {}, fakeContext),
				resolver(fakeRoot3, {}, fakeContext),
			]);

			expect(res).toEqual(["res1", "res2", "res1"]);

			expect(ctx.call).toHaveBeenCalledTimes(1);
			expect(ctx.call).toHaveBeenNthCalledWith(1, "users.resolve", {
				testBatchParam: [
					{ authorIdParam: 1, testIdParam: "foo" },
					{ authorIdParam: 2, testIdParam: "bar" },
				],
			});
		});

		it("should reuse the loader for multiple calls with the same context", async () => {
			const resolver = svc.createActionResolver("users.resolve", {
				rootParams: {
					author: "id",
				},

				dataLoader: true,
			});

			const ctx = new Context(broker);
			ctx.call = jest
				.fn()
				.mockResolvedValueOnce(["res1", "res2", "res5"])
				.mockResolvedValueOnce(["res3", "res4", "res6"]);

			const fakeRoot1 = { author: [1, 2, 5] };
			const fakeRoot2 = { author: [3, 4, 6] };

			const fakeContext = { ctx, dataLoaders: new Map() };
			const res1 = await resolver(fakeRoot1, { a: 5 }, fakeContext);
			expect(fakeContext.dataLoaders.size).toBe(1);
			const res2 = await resolver(fakeRoot2, { a: 5 }, fakeContext);
			expect(fakeContext.dataLoaders.size).toBe(1);

			expect(res1).toEqual(["res1", "res2", "res5"]);
			expect(res2).toEqual(["res3", "res4", "res6"]);

			expect(ctx.call).toHaveBeenCalledTimes(2);
			expect(ctx.call).toHaveBeenNthCalledWith(1, "users.resolve", {
				a: 5,
				id: [1, 2, 5],
			});
			expect(ctx.call).toHaveBeenNthCalledWith(2, "users.resolve", {
				a: 5,
				id: [3, 4, 6],
			});
		});

		it("should make multiple loaders for multiple calls with different args", async () => {
			const resolver = svc.createActionResolver("users.resolve", {
				rootParams: {
					author: "id",
				},

				dataLoader: true,
			});

			const ctx = new Context(broker);
			ctx.call = jest
				.fn()
				.mockResolvedValueOnce(["res1", "res2", "res5"])
				.mockResolvedValueOnce(["res3", "res4", "res6"]);

			const fakeRoot1 = { author: [1, 2, 5] };
			const fakeRoot2 = { author: [3, 4, 6] };

			const fakeContext = { ctx, dataLoaders: new Map() };
			const res1 = await resolver(fakeRoot1, { a: 5 }, fakeContext);
			expect(fakeContext.dataLoaders.size).toBe(1);
			const res2 = await resolver(fakeRoot2, { a: 10 }, fakeContext);
			expect(fakeContext.dataLoaders.size).toBe(2);

			expect(res1).toEqual(["res1", "res2", "res5"]);
			expect(res2).toEqual(["res3", "res4", "res6"]);

			expect(ctx.call).toHaveBeenCalledTimes(2);
			expect(ctx.call).toHaveBeenNthCalledWith(1, "users.resolve", {
				a: 5,
				id: [1, 2, 5],
			});
			expect(ctx.call).toHaveBeenNthCalledWith(2, "users.resolve", {
				a: 10,
				id: [3, 4, 6],
			});
		});

		it("should construct a loader with key without a hash if no args and no params", async () => {
			const resolver = svc.createActionResolver("users.resolve", {
				rootParams: {
					author: "id",
				},

				dataLoader: true,
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn().mockResolvedValue(["response from action"]);

			const fakeRoot = { author: 12345 };

			const fakeContext = { ctx, dataLoaders: new Map() };
			await resolver(fakeRoot, {}, fakeContext);

			const dataLoaderEntries = [...fakeContext.dataLoaders.entries()];

			expect(dataLoaderEntries.length).toBe(1);
			expect(dataLoaderEntries[0][0].split(":").length).toBe(1);
		});

		it("should construct a loader with key with a hash if args passed", async () => {
			const resolver = svc.createActionResolver("users.resolve", {
				rootParams: {
					author: "id",
				},

				dataLoader: true,
			});

			const ctx = new Context(broker);
			ctx.call = jest.fn().mockResolvedValue(["response from action"]);

			const fakeRoot = { author: 12345 };

			const fakeContext = { ctx, dataLoaders: new Map() };
			await resolver(fakeRoot, { a: 5 }, fakeContext);

			const dataLoaderEntries = [...fakeContext.dataLoaders.entries()];

			expect(dataLoaderEntries.length).toBe(1);
			expect(dataLoaderEntries[0][0].split(":").length).toBe(2);
		});
	});

	describe("Test 'createAsyncIteratorResolver'", () => {
		let broker, svc, stop;

		beforeAll(async () => {
			const res = await startService();
			broker = res.broker;
			svc = res.svc;
			stop = res.stop;

			svc.pubsub = { asyncIterator: jest.fn(() => "iterator-result") };
			broker.call = jest.fn(async () => "action response");
		});

		afterAll(async () => await stop());

		it("should create resolver without tags & filter", async () => {
			const res = svc.createAsyncIteratorResolver("posts.find");

			expect(res).toEqual({
				subscribe: expect.any(Function),
				resolve: expect.any(Function),
			});

			// Test subscribe
			const res2 = res.subscribe();

			expect(res2).toBe("iterator-result");
			expect(svc.pubsub.asyncIterator).toBeCalledTimes(1);
			expect(svc.pubsub.asyncIterator).toBeCalledWith([]);

			// Test resolve
			const ctx = new Context(broker);
			ctx.call = jest.fn(async () => "action response");
			const res3 = await res.resolve({ a: 5 }, { b: "John" }, { ctx });

			expect(res3).toBe("action response");
			expect(ctx.call).toBeCalledTimes(1);
			expect(ctx.call).toBeCalledWith("posts.find", { b: "John", payload: { a: 5 } });
		});

		it("should create resolver with tags", async () => {
			svc.pubsub.asyncIterator.mockClear();

			const res = svc.createAsyncIteratorResolver("posts.find", ["a", "b"]);

			expect(res).toEqual({
				subscribe: expect.any(Function),
				resolve: expect.any(Function),
			});

			// Test subscribe
			const res2 = res.subscribe();

			expect(res2).toBe("iterator-result");
			expect(svc.pubsub.asyncIterator).toBeCalledTimes(1);
			expect(svc.pubsub.asyncIterator).toBeCalledWith(["a", "b"]);
		});

		it("should create resolver with tags & filter", async () => {
			svc.pubsub.asyncIterator.mockClear();
			broker.call.mockClear();
			withFilter.mockImplementation((fn1, fn2) => [fn1, fn2]);

			const res = svc.createAsyncIteratorResolver("posts.find", ["a", "b"], "posts.filter");

			expect(res).toEqual({
				subscribe: [expect.any(Function), expect.any(Function)],
				resolve: expect.any(Function),
			});

			// Test first function
			const ctx = new Context(broker);
			expect(res.subscribe[0](undefined, undefined, { ctx })).toBe("iterator-result");

			expect(svc.pubsub.asyncIterator).toBeCalledTimes(1);
			expect(svc.pubsub.asyncIterator).toBeCalledWith(["a", "b"]);

			// Test second function without payload
			expect(await res.subscribe[1](undefined, undefined, { ctx })).toBe(false);

			// Test second function with payload
			ctx.call = jest.fn(async () => "action response");
			expect(await res.subscribe[1]({ a: 5 }, { b: "John" }, { ctx })).toBe(
				"action response"
			);

			expect(ctx.call).toBeCalledTimes(1);
			expect(ctx.call).toBeCalledWith("posts.filter", { b: "John", payload: { a: 5 } });
		});
	});

	describe("Test 'generateGraphQLSchema'", () => {
		it("should create an empty schema", async () => {
			makeExecutableSchema.mockImplementation(() => "generated-schema");
			const { svc, stop } = await startService();

			const res = svc.generateGraphQLSchema([]);
			expect(res).toBe("generated-schema");

			expect(makeExecutableSchema).toBeCalledTimes(1);
			expect(makeExecutableSchema).toBeCalledWith({
				typeDefs: [],
				resolvers: {},
				schemaDirectives: null,
			});

			await stop();
		});

		it("should create a schema with schemaDirectives", async () => {
			makeExecutableSchema.mockClear();
			const UniqueIdDirective = jest.fn();
			const { svc, stop } = await startService({
				schemaDirectives: {
					uid: UniqueIdDirective,
				},
			});

			const res = svc.generateGraphQLSchema([]);
			expect(res).toBe("generated-schema");

			expect(makeExecutableSchema).toBeCalledTimes(1);
			expect(makeExecutableSchema).toBeCalledWith({
				typeDefs: [],
				resolvers: {},
				schemaDirectives: {
					uid: UniqueIdDirective,
				},
			});

			await stop();
		});

		it("should create a schema with global, service & action definitions", async () => {
			makeExecutableSchema.mockClear();
			const globalResolvers = {
				Date: {
					__parseValue(value) {
						return new Date(value); // value from the client
					},
					__serialize(value) {
						return value.getTime(); // value sent to the client
					},
				},
			};
			const { svc, stop } = await startService({
				typeDefs: `
					scalar Date
				`,

				resolvers: globalResolvers,
			});

			const res = svc.generateGraphQLSchema([
				{
					name: "posts",
					fullName: "posts",

					settings: {
						graphql: {
							type: `
								type Post {
									id: Int!
									title: String!
									author: User!
									votes: Int!
									voters: [User]
									createdAt: Timestamp
									error: String
								}
							`,

							query: `
								categories(): [String]
							`,

							mutation: `
								addCategory(name: String!): String
							`,

							subscription: `
								categoryChanges(): String!
							`,

							resolvers: {
								Post: {
									author: {
										action: "users.resolve",
										rootParams: {
											author: "id",
										},
									},
									voters: {
										action: "users.resolve",
										dataLoader: true,
										rootParams: {
											voters: "id",
										},
									},
								},
							},
						},
					},

					actions: {
						find: {
							graphql: {
								query: "posts(limit: Int): [Post]",

								type: `
									type VoteInfo {
										votes: Int!,
										voters: [User]
									}
								`,
							},
						},
						upvote: {
							params: {
								id: "number",
								userID: "number",
							},
							graphql: {
								mutation: "upvote(input: PostVoteInput): Post",
								input: `
									input PostVoteInput {
										id: Int!,
										userID: Int!
									}
								`,
							},
						},
						vote: {
							params: { payload: "object" },
							graphql: {
								enum: `
									enum VoteType {
										VOTE_UP,
										VOTE_DOWN
									}
								`,

								subscription: `
									vote(userID: Int!): String!
								`,
								tags: ["VOTE"],
								filter: "posts.vote.filter",
							},
							handler(ctx) {
								return ctx.params.payload.type;
							},
						},
					},
				},

				{
					name: "users",
					version: 2,
					fullName: "v2.users",

					settings: {
						graphql: {
							type: `
								"""
								This type describes a user entity.
								"""
								type User {
									id: Int!
									name: String!
									birthday: Date
									posts(limit: Int): [Post]
									postCount: Int
									type: UserType
								}
							`,
							enum: `
								"""
								Enumerations for user types
								"""
								enum UserType {
									ADMIN
									PUBLISHER
									READER
								}
							`,

							interface: `
								interface Book {
									title: String
									author: Author
								}
							`,

							union: `
								union Result = User | Author
							`,

							input: `
								input PostAndMediaInput {
									title: String
									body: String
									mediaUrls: [String]
								}
							`,

							resolvers: {
								User: {
									posts: {
										action: "posts.findByUser",
										rootParams: {
											id: "userID",
										},
									},
									postCount: {
										// Call the "posts.count" action
										action: "posts.count",
										// Get `id` value from `root` and put it into `ctx.params.query.author`
										rootParams: {
											id: "query.author",
										},
									},
								},
								UserType: {
									ADMIN: "1",
									PUBLISHER: "2",
									READER: "3",
								},
							},
						},
					},

					actions: {
						find: {
							//cache: true,
							params: {
								limit: { type: "number", optional: true },
							},
							graphql: {
								query: `
									users(limit: Int): [User]
								`,
							},
						},
					},
				},
				{
					// Must be skipped
					name: "posts",
					fullName: "posts",

					settings: {
						graphql: {
							type: `
								type Post2 {
									id: Int!
									title: String!
								}
							`,
						},
					},
				},
			]);
			expect(res).toBe("generated-schema");

			expect(makeExecutableSchema).toBeCalledTimes(1);
			expect(makeExecutableSchema.mock.calls[0][0]).toMatchSnapshot();

			await stop();
		});

		it("should throw further the error", async () => {
			makeExecutableSchema.mockImplementation(() => {
				throw new Error("Something is wrong");
			});
			const { svc, stop } = await startService();

			expect(() => svc.generateGraphQLSchema([])).toThrow(Errors.MoleculerServerError);

			await stop();
		});
	});

	describe("Test 'prepareGraphQLSchema'", () => {
		const createHandler = jest.fn(() => "createdHandler");
		const installSubscriptionHandlers = jest.fn();

		const fakeApolloServer = {
			createHandler,
			installSubscriptionHandlers,
		};

		ApolloServer.mockImplementation(() => fakeApolloServer);

		GraphQL.printSchema.mockImplementation(() => "printed schema");

		const services = [
			{
				name: "test-svc-1",
				actions: [
					{
						name: "test-action-1",
						graphql: {
							dataLoaderOptions: { option1: "option-value-1" },
							dataLoaderBatchParam: "batch-param-1",
						},
					},
					{ name: "test-action-2" },
				],
			},
			{
				name: "test-svc-2",
				version: 1,
				actions: [
					{
						name: "test-action-3",
						graphql: {
							dataLoaderOptions: { option2: "option-value-2" },
							dataLoaderBatchParam: "batch-param-2",
						},
					},
					{ name: "test-action-4" },
				],
			},
		];

		beforeEach(() => {
			createHandler.mockClear();
			installSubscriptionHandlers.mockClear();

			ApolloServer.mockClear();
			GraphQL.printSchema.mockClear();
		});

		it("should create local variables", async () => {
			const { broker, svc, stop } = await startService({
				serverOptions: {
					path: "/my-graphql",
					playground: true,
				},
			});

			svc.server = "server";
			broker.broadcast = jest.fn();
			broker.registry.getServiceList = jest.fn(() => services);
			svc.generateGraphQLSchema = jest.fn(() => "graphql schema");

			expect(svc.pubsub).toBeNull();
			expect(svc.apolloServer).toBeNull();
			expect(svc.graphqlHandler).toBeNull();
			expect(svc.graphqlSchema).toBeNull();
			expect(svc.shouldUpdateGraphqlSchema).toBe(true);

			svc.prepareGraphQLSchema();

			expect(svc.pubsub).toBeInstanceOf(PubSub);

			expect(broker.registry.getServiceList).toBeCalledTimes(1);
			expect(broker.registry.getServiceList).toBeCalledWith({ withActions: true });

			expect(svc.generateGraphQLSchema).toBeCalledTimes(1);
			expect(svc.generateGraphQLSchema).toBeCalledWith(services);

			expect(svc.apolloServer).toBe(fakeApolloServer);

			expect(ApolloServer).toBeCalledTimes(1);
			expect(ApolloServer).toBeCalledWith({
				schema: "graphql schema",
				context: expect.any(Function),
				path: "/my-graphql",
				playground: true,
				subscriptions: {
					onConnect: expect.any(Function),
				},
			});

			expect(svc.graphqlHandler).toBe("createdHandler");

			expect(createHandler).toBeCalledTimes(1);
			expect(createHandler).toBeCalledWith({
				path: "/my-graphql",
				playground: true,
			});

			expect(installSubscriptionHandlers).toBeCalledTimes(1);
			expect(installSubscriptionHandlers).toBeCalledWith("server");

			expect(svc.graphqlSchema).toBe("graphql schema");

			expect(svc.shouldUpdateGraphqlSchema).toBe(false);

			expect(broker.broadcast).toBeCalledTimes(1);
			expect(broker.broadcast).toBeCalledWith("graphql.schema.updated", {
				schema: "printed schema",
			});

			expect(GraphQL.printSchema).toBeCalledTimes(2);
			expect(GraphQL.printSchema).toBeCalledWith("graphql schema");

			expect(svc.dataLoaderOptions).toEqual(
				new Map([
					["test-svc-1.test-action-1", { option1: "option-value-1" }],
					["v1.test-svc-2.test-action-3", { option2: "option-value-2" }],
				])
			);

			expect(svc.dataLoaderBatchParams).toEqual(
				new Map([
					["test-svc-1.test-action-1", "batch-param-1"],
					["v1.test-svc-2.test-action-3", "batch-param-2"],
				])
			);

			// Test `context` method
			const contextFn = ApolloServer.mock.calls[0][0].context;

			expect(
				contextFn({
					connection: {
						context: {
							$service: "service",
							$ctx: "context",
							$params: { a: 5 },
						},
					},
				})
			).toEqual({
				ctx: "context",
				dataLoaders: new Map(),
				params: {
					a: 5,
				},
				service: "service",
			});

			const req = {
				$ctx: "context",
				$service: "service",
				$params: { a: 5 },
			};
			expect(
				contextFn({
					req,
					connection: {
						$service: "service",
					},
				})
			).toEqual({
				ctx: "context",
				dataLoaders: new Map(),
				params: {
					a: 5,
				},
				service: "service",
			});

			// Test subscription `onConnect`
			const onConnect = ApolloServer.mock.calls[0][0].subscriptions.onConnect;

			const connectionParams = { b: 100 };
			const socket = { connectionParams, upgradeReq: { query: 101 } };
			const connect = await onConnect(connectionParams, socket);

			expect(connect.$service).toEqual(svc);
			expect(connect.$ctx).toBeDefined();
			expect(connect.$params.body).toEqual(connectionParams);
			expect(connect.$params.query).toEqual(socket.upgradeReq.query);

			await stop();
		});

		it("Should avoid binding apollo subscription handlers if the server config has them disabled", async () => {
			const { broker, svc, stop } = await startService({
				serverOptions: {
					path: "/my-graphql",
					subscriptions: false,
				},
			});

			svc.server = "server";
			broker.broadcast = jest.fn();

			broker.registry.getServiceList = jest.fn(() => services);
			svc.generateGraphQLSchema = jest.fn(() => "graphql schema");

			expect(svc.pubsub).toBeNull();
			expect(svc.apolloServer).toBeNull();
			expect(svc.graphqlHandler).toBeNull();
			expect(svc.graphqlSchema).toBeNull();
			expect(svc.shouldUpdateGraphqlSchema).toBe(true);

			svc.prepareGraphQLSchema();

			expect(installSubscriptionHandlers).not.toHaveBeenCalled();

			expect(svc.generateGraphQLSchema).toBeCalledTimes(1);
			expect(svc.generateGraphQLSchema).toBeCalledWith(services);

			expect(svc.shouldUpdateGraphqlSchema).toBe(false);
			expect(svc.graphqlSchema).toBe("graphql schema");

			await stop();
		});
	});
});
