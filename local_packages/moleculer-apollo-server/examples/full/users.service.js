"use strict";

const _ = require("lodash");
const { moleculerGql: gql } = require("../../index");

const users = [
	{ id: 1, name: "Genaro Krueger", birthday: new Date("1975-12-17"), type: "1" },
	{ id: 2, name: "Nicholas Paris", birthday: new Date("1981-01-27"), type: "2" },
	{ id: 3, name: "Quinton Loden", birthday: new Date("1995-03-22"), type: "3" },
	{ id: 4, name: "Bradford Knauer", birthday: new Date("2008-11-01"), type: "2" },
	{ id: 5, name: "Damien Accetta", birthday: new Date("1959-08-07"), type: "1" },
];

module.exports = {
	name: "users",
	settings: {
		graphql: {
			type: gql`
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
			enum: gql`
				"""
				Enumerations for user types
				"""
				enum UserType {
					ADMIN
					PUBLISHER
					READER
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
				query: gql`
					type Query {
						users(limit: Int): [User]
					}
				`,
			},
			handler(ctx) {
				let result = _.cloneDeep(users);
				if (ctx.params.limit) {
					result = users.slice(0, ctx.params.limit);
				} else {
					result = users;
				}

				return _.cloneDeep(result);
			},
		},

		resolve: {
			params: {
				id: [{ type: "number" }, { type: "array", items: "number" }],
			},
			handler(ctx) {
				this.logger.debug("resolve action called.", { params: ctx.params });
				if (Array.isArray(ctx.params.id)) {
					return _.cloneDeep(ctx.params.id.map(id => this.findByID(id)));
				} else {
					return _.cloneDeep(this.findByID(ctx.params.id));
				}
			},
		},
	},

	methods: {
		findByID(id) {
			return users.find(user => user.id == id);
		},
	},
};
