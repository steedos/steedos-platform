"use strict";

const _ = require("lodash");
const { MoleculerClientError } = require("moleculer").Errors;
const { moleculerGql: gql } = require("../../index");

const posts = [
	{
		id: 1,
		title: "First post",
		author: 3,
		votes: 2,
		voters: [2, 5],
		createdAt: new Date("2018-08-23T08:10:25"),
	},
	{
		id: 2,
		title: "Second post",
		author: 1,
		votes: 0,
		voters: [],
		createdAt: new Date("2018-11-23T12:59:30"),
	},
	{
		id: 3,
		title: "Third post",
		author: 2,
		votes: 1,
		voters: [5],
		createdAt: new Date("2018-02-23T22:24:28"),
	},
	{
		id: 4,
		title: "4th post",
		author: 3,
		votes: 3,
		voters: [4, 1, 2],
		createdAt: new Date("2018-10-23T10:33:00"),
	},
	{
		id: 5,
		title: "5th post",
		author: 5,
		votes: 1,
		voters: [4],
		createdAt: new Date("2018-11-24T21:15:30"),
	},
];

module.exports = {
	name: "posts",
	settings: {
		graphql: {
			type: gql`
				"""
				This type describes a post entity.
				"""
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
			resolvers: {
				Post: {
					author: {
						action: "users.resolve",
						dataLoader: process.env.DATALOADER === "true",
						rootParams: {
							author: "id",
						},
					},
					voters: {
						action: "users.resolve",
						dataLoader: process.env.DATALOADER === "true",
						rootParams: {
							voters: "id",
						},
					},
					error: {
						action: "posts.error",
						nullIfError: true,
					},
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
						posts(limit: Int): [Post]
					}
				`,
			},
			handler(ctx) {
				let result = _.cloneDeep(posts);
				if (ctx.params.limit) {
					result = posts.slice(0, ctx.params.limit);
				} else {
					result = posts;
				}

				return _.cloneDeep(result);
			},
		},

		count: {
			params: {
				query: { type: "object", optional: true },
			},
			handler(ctx) {
				if (!ctx.params.query) {
					return posts.length;
				}

				return posts.filter(post => post.author == ctx.params.query.author).length;
			},
		},

		findByUser: {
			params: {
				userID: "number",
			},
			handler(ctx) {
				return _.cloneDeep(posts.filter(post => post.author == ctx.params.userID));
			},
		},

		upvote: {
			params: {
				id: "number",
				userID: "number",
			},
			graphql: {
				mutation: gql`
					type Mutation {
						upvote(id: Int!, userID: Int!): Post
					}
				`,
			},
			async handler(ctx) {
				const post = this.findByID(ctx.params.id);
				if (!post) {
					throw new MoleculerClientError("Post is not found");
				}

				const has = post.voters.find(voter => voter == ctx.params.userID);
				if (has) {
					throw new MoleculerClientError("User has already voted this post");
				}

				post.voters.push(ctx.params.userID);
				post.votes = post.voters.length;

				await ctx.broadcast("graphql.publish", {
					tag: "VOTE",
					payload: { type: "up", userID: ctx.params.userID },
				});

				return _.cloneDeep(post);
			},
		},

		downvote: {
			params: {
				id: "number",
				userID: "number",
			},
			graphql: {
				mutation: gql`
					type Mutation {
						downvote(id: Int!, userID: Int!): Post
					}
				`,
			},
			async handler(ctx) {
				const post = this.findByID(ctx.params.id);
				if (!post) {
					throw new MoleculerClientError("Post is not found");
				}

				const has = post.voters.find(voter => voter == ctx.params.userID);
				if (!has) {
					throw new MoleculerClientError("User has not voted this post yet");
				}

				post.voters = post.voters.filter(voter => voter != ctx.params.userID);
				post.votes = post.voters.length;

				await ctx.broadcast("graphql.publish", {
					tag: "VOTE",
					payload: { type: "down", userID: ctx.params.userID },
				});

				return _.cloneDeep(post);
			},
		},
		vote: {
			params: { payload: "object" },
			graphql: {
				subscription: gql`
					type Subscription {
						vote(userID: Int!): String!
					}
				`,
				tags: ["VOTE"],
				filter: "posts.vote.filter",
			},
			handler(ctx) {
				return ctx.params.payload.type;
			},
		},
		"vote.filter": {
			params: { userID: "number", payload: "object" },
			handler(ctx) {
				return ctx.params.payload.userID === ctx.params.userID;
			},
		},
		error: {
			handler() {
				throw new Error("Oh look an error !");
			},
		},
	},

	methods: {
		findByID(id) {
			return posts.find(post => post.id == id);
		},
	},
};
