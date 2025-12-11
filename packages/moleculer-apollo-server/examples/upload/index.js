"use strict";

const { ServiceBroker } = require("moleculer");
const ApiGateway = require("moleculer-web");
const { ApolloService } = require("../../index"); // GraphQLUpload is removed from here

// We need to wrap the setup in an async function to use dynamic import for ESM modules
async function start() {
  // Dynamic import for graphql-upload v17+
  const { GraphQLUpload } = await import("graphql-upload/GraphQLUpload.mjs");

  const broker = new ServiceBroker({ logLevel: "info", hotReload: true });

  broker.createService({
    name: "api",

    mixins: [
      // Gateway
      ApiGateway,

      // GraphQL Apollo Server
      ApolloService({
        typeDefs: ["scalar Upload"],
        resolvers: {
          Upload: GraphQLUpload,
        },
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

    events: {
      "graphql.schema.updated"({ schema }) {
        this.logger.info("Generated GraphQL schema:\n\n" + schema);
      },
    },
  });

  broker.createService({
    name: "files",
    settings: {
      graphql: {
        type: `
                """
                This type describes a File entity.
                """
                type File {
                    filename: String!
                    encoding: String!
                    mimetype: String!
                }
            `,
      },
    },
    actions: {
      hello: {
        graphql: {
          query: "hello: String!",
        },
        handler() {
          return "Hello Moleculer!";
        },
      },
      singleUpload: {
        graphql: {
          mutation: "singleUpload(file: Upload!, other: String): File!",
          fileUploadArg: "file",
        },
        async handler(ctx) {
          const fileChunks = [];
          for await (const chunk of ctx.params) {
            fileChunks.push(chunk);
          }
          const fileContents = Buffer.concat(fileChunks);
          ctx.broker.logger.info("Uploaded File Contents:", fileContents.toString());
          ctx.broker.logger.info("Additional arguments:", ctx.meta.$args);
          return ctx.meta.$fileInfo;
        },
      },
    },
  });

  await broker.start();
  broker.repl();

  broker.logger.info("----------------------------------------------------------");
  broker.logger.info("For information about creating a file upload request,");
  broker.logger.info(
    "see https://github.com/jaydenseric/graphql-multipart-request-spec#curl-request"
  );
  broker.logger.info("----------------------------------------------------------");
}

start();