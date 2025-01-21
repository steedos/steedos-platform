"use strict";

const gql = require("../../src/gql");

// prettier-ignore
describe("Test gql", () => {
	it("should format Query", () => {
		expect(gql`
			type Query {
				posts(limit: Int): [Post]
			}
		`).toBe(`
				posts(limit: Int): [Post]
			`);

		expect(
			gql`type    Query 	{ posts(limit: Int): [Post] }`,
		).toBe(" posts(limit: Int): [Post] ");
	});

	it("should format Mutation", () => {
		expect(gql`
			type Mutation {
				upvote(id: Int!, userID: Int!): Post
			}
		`).toBe(`
				upvote(id: Int!, userID: Int!): Post
			`);
	});

	it("should format Subscription", () => {
		expect(gql`
			type Subscription {
				vote(userID: Int!): String!
			}
		`).toBe(`
				vote(userID: Int!): String!
			`);
	});

	it("should not format", () => {
		expect(gql`posts(limit: Int): [Post]`).toBe("posts(limit: Int): [Post]");
	});
});
