"use strict";

jest.mock("apollo-server-core");
const ApolloServerCore = require("apollo-server-core");
ApolloServerCore.convertNodeHttpToRequest.mockImplementation(() => "convertedRequest");

const graphqlMoleculer = require("../../src/moleculerApollo");

describe("Test graphqlMoleculer", () => {
	it("should throw error if not options", () => {
		expect(() => graphqlMoleculer()).toThrow("Apollo Server requires options.");
	});

	it("should throw error if there are more arguments", () => {
		expect(() => graphqlMoleculer({}, true)).toThrow(
			"Apollo Server expects exactly one argument, got 2",
		);
	});

	it("should return a handler", () => {
		expect(graphqlMoleculer({})).toBeInstanceOf(Function);
	});
});

describe("Test graphqlMoleculer handler", () => {
	let options = { a: 5 };

	let fakeReq = {
		method: "GET",
		url: "http://my-server/graphql?filter=something",
	};
	let fakeRes = {
		setHeader: jest.fn(),
		end: jest.fn(),
	};

	it("should return the response of runHttpQuery with GET request", async () => {
		ApolloServerCore.runHttpQuery.mockImplementation(() =>
			Promise.resolve({
				graphqlResponse: "my-response",
				responseInit: {
					headers: {
						"X-Response-Time": "123ms",
					},
				},
			}),
		);

		const handler = graphqlMoleculer(options);

		const res = await handler(fakeReq, fakeRes);

		expect(res).toBe("my-response");

		expect(ApolloServerCore.runHttpQuery).toBeCalledTimes(1);
		expect(ApolloServerCore.runHttpQuery).toBeCalledWith([fakeReq, fakeRes], {
			method: "GET",
			options: {
				a: 5,
			},
			query: {
				filter: "something",
			},
			request: "convertedRequest",
		});
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledTimes(1);
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledWith(fakeReq);

		expect(fakeRes.setHeader).toBeCalledTimes(1);
		expect(fakeRes.setHeader).toBeCalledWith("X-Response-Time", "123ms");

		expect(fakeRes.statusCode).toBeUndefined();
		expect(fakeRes.end).toBeCalledTimes(0);
	});

	it("should return the response of runHttpQuery with POST & body", async () => {
		ApolloServerCore.runHttpQuery.mockClear();
		ApolloServerCore.convertNodeHttpToRequest.mockClear();
		fakeRes.setHeader.mockClear();
		fakeRes.end.mockClear();

		fakeReq.method = "POST";
		fakeReq.body = "postBody";

		const handler = graphqlMoleculer(options);

		const res = await handler(fakeReq, fakeRes);

		expect(res).toBe("my-response");

		expect(ApolloServerCore.runHttpQuery).toBeCalledTimes(1);
		expect(ApolloServerCore.runHttpQuery).toBeCalledWith([fakeReq, fakeRes], {
			method: "POST",
			options: {
				a: 5,
			},
			query: "postBody",
			request: "convertedRequest",
		});
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledTimes(1);
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledWith(fakeReq);

		expect(fakeRes.setHeader).toBeCalledTimes(1);
		expect(fakeRes.setHeader).toBeCalledWith("X-Response-Time", "123ms");

		expect(fakeRes.statusCode).toBeUndefined();
		expect(fakeRes.end).toBeCalledTimes(0);
	});

	it("should return the response of runHttpQuery with POST & filePayload", async () => {
		ApolloServerCore.runHttpQuery.mockClear();
		ApolloServerCore.convertNodeHttpToRequest.mockClear();
		fakeRes.setHeader.mockClear();
		fakeRes.end.mockClear();

		fakeReq.method = "POST";
		fakeReq.filePayload = "filePayload";

		const handler = graphqlMoleculer(options);

		const res = await handler(fakeReq, fakeRes);

		expect(res).toBe("my-response");

		expect(ApolloServerCore.runHttpQuery).toBeCalledTimes(1);
		expect(ApolloServerCore.runHttpQuery).toBeCalledWith([fakeReq, fakeRes], {
			method: "POST",
			options: {
				a: 5,
			},
			query: "filePayload",
			request: "convertedRequest",
		});
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledTimes(1);
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledWith(fakeReq);

		expect(fakeRes.setHeader).toBeCalledTimes(1);
		expect(fakeRes.setHeader).toBeCalledWith("X-Response-Time", "123ms");

		expect(fakeRes.statusCode).toBeUndefined();
		expect(fakeRes.end).toBeCalledTimes(0);
	});

	it("should return the GraphQL error", async () => {
		ApolloServerCore.runHttpQuery.mockImplementation(() => {
			const err = new Error("Some GraphQL error");
			throw err;
		});

		ApolloServerCore.runHttpQuery.mockClear();
		ApolloServerCore.convertNodeHttpToRequest.mockClear();
		fakeRes.setHeader.mockClear();
		fakeRes.end.mockClear();

		const handler = graphqlMoleculer(options);

		const res = await handler(fakeReq, fakeRes);

		expect(res).toBeUndefined();

		expect(ApolloServerCore.runHttpQuery).toBeCalledTimes(1);
		expect(ApolloServerCore.runHttpQuery).toBeCalledWith([fakeReq, fakeRes], {
			method: "POST",
			options: {
				a: 5,
			},
			query: "filePayload",
			request: "convertedRequest",
		});
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledTimes(1);
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledWith(fakeReq);

		expect(fakeRes.setHeader).toBeCalledTimes(0);

		expect(fakeRes.statusCode).toBe(500);
		expect(fakeRes.end).toBeCalledTimes(1);
		expect(fakeRes.end).toBeCalledWith("Some GraphQL error");
	});

	it("should return the GraphQL error", async () => {
		ApolloServerCore.runHttpQuery.mockImplementation(() => {
			const err = new Error("Some HTTP Query error");
			err.name = "HttpQueryError";
			err.statusCode = 422;
			err.headers = {
				"X-Http-Error": "Some error",
			};
			throw err;
		});

		ApolloServerCore.runHttpQuery.mockClear();
		ApolloServerCore.convertNodeHttpToRequest.mockClear();
		fakeRes.setHeader.mockClear();
		fakeRes.end.mockClear();

		const handler = graphqlMoleculer(options);

		const res = await handler(fakeReq, fakeRes);

		expect(res).toBeUndefined();

		expect(ApolloServerCore.runHttpQuery).toBeCalledTimes(1);
		expect(ApolloServerCore.runHttpQuery).toBeCalledWith([fakeReq, fakeRes], {
			method: "POST",
			options: {
				a: 5,
			},
			query: "filePayload",
			request: "convertedRequest",
		});
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledTimes(1);
		expect(ApolloServerCore.convertNodeHttpToRequest).toBeCalledWith(fakeReq);

		expect(fakeRes.setHeader).toBeCalledTimes(1);
		expect(fakeRes.setHeader).toBeCalledWith("X-Http-Error", "Some error");

		expect(fakeRes.statusCode).toBe(422);
		expect(fakeRes.end).toBeCalledTimes(1);
		expect(fakeRes.end).toBeCalledWith("Some HTTP Query error");
	});
});
