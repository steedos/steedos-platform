"use strict";

const MolApolloServer = require("../../");

describe("Test ApolloService exports", () => {
	it("should export ApolloServerCore classes", () => {
		expect(MolApolloServer.GraphQLUpload).toBeDefined();
		expect(MolApolloServer.GraphQLExtension).toBeDefined();
		expect(MolApolloServer.gql).toBeDefined();
		expect(MolApolloServer.ApolloError).toBeDefined();
		expect(MolApolloServer.toApolloError).toBeDefined();
		expect(MolApolloServer.SyntaxError).toBeDefined();
		expect(MolApolloServer.ValidationError).toBeDefined();
		expect(MolApolloServer.AuthenticationError).toBeDefined();
		expect(MolApolloServer.ForbiddenError).toBeDefined();
		expect(MolApolloServer.UserInputError).toBeDefined();
		expect(MolApolloServer.defaultPlaygroundOptions).toBeDefined();
	});

	it("should export Moleculer modules", () => {
		expect(MolApolloServer.ApolloServer).toBeDefined();
		expect(MolApolloServer.ApolloService).toBeDefined();
		expect(MolApolloServer.moleculerGql).toBeDefined();
	});
});
