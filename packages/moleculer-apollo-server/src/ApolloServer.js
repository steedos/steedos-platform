"use strict";

const { ApolloServerBase } = require("apollo-server-core");
const { processRequest } = require("graphql-upload");
const accept = require("@hapi/accept");
const moleculerApollo = require("./moleculerApollo");

// --- 新增：本地定义的 Playground 渲染函数 ---
// 这替代了已废弃的 @apollographql/graphql-playground-html 包
function renderPlaygroundPage({ endpoint, subscriptionEndpoint, ...options }) {
  const settings = JSON.stringify({
    endpoint,
    subscriptionEndpoint,
    ...options,
  });
	const unpkgUrl = process.env.STEEDOS_UNPKG_URL || "https://unpkg.com";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset=utf-8 />
      <meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
      <title>GraphQL Playground</title>
      <link rel="stylesheet" href="${unpkgUrl}/graphql-playground-react/build/static/css/index.css" />
      <link rel="shortcut icon" href="${unpkgUrl}/graphql-playground-react/build/favicon.png" />
      <script src="${unpkgUrl}/graphql-playground-react/build/static/js/middleware.js"></script>
    </head>
    <body>
      <div id="root">
        <style>
          body { background-color: rgb(23, 42, 58); font-family: Open Sans, sans-serif; height: 100vh; margin: 0; overflow: hidden; }
          #root { height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; }
          .loading { font-size: 32px; font-weight: 200; color: rgba(255, 255, 255, .6); margin-left: 20px; }
          img { width: 78px; height: 78px; }
          .title { font-weight: 400; }
        </style>
        <img src='${unpkgUrl}/graphql-playground-react/build/logo.png' alt=''>
        <div class="loading"> Loading
          <span class="title">GraphQL Playground</span>
        </div>
      </div>
      <script>
        window.addEventListener('load', function (event) {
          GraphQLPlayground.init(document.getElementById('root'), ${settings})
        })
      </script>
    </body>
    </html>
  `;
}
// ------------------------------------------

async function send(req, res, statusCode, data, responseType = "application/json") {
  res.statusCode = statusCode;

  const ctx = res.$ctx;
  if (!ctx.meta.$responseType) {
    ctx.meta.$responseType = responseType;
  }

  const route = res.$route;
  if (route.onAfterCall) {
    data = await route.onAfterCall.call(this, ctx, route, req, res, data);
  }

  const service = res.$service;
  service.sendResponse(req, res, data);
}

class ApolloServer extends ApolloServerBase {
  // Extract Apollo Server options from the request.
  createGraphQLServerOptions(req, res) {
    return super.graphQLServerOptions({ req, res });
  }

  // Prepares and returns an async function that can be used to handle
  // GraphQL requests.
  createHandler({ path, disableHealthCheck, onHealthCheck } = {}) {
    const promiseWillStart = this.willStart();

    return async (req, res) => {
      this.graphqlPath = path || "/graphql";

      await promiseWillStart;

      // If file uploads are detected, prepare them for easier handling with
      // the help of `graphql-upload`.
      if (this.uploadsConfig) {
        const contentType = req.headers["content-type"];
        if (contentType && contentType.startsWith("multipart/form-data")) {
          req.filePayload = await processRequest(req, res, this.uploadsConfig);
        }
      }

      // If health checking is enabled, trigger the `onHealthCheck`
      // function when the health check URL is requested.
      if (!disableHealthCheck && req.url === "/.well-known/apollo/server-health")
        return await this.handleHealthCheck({ req, res, onHealthCheck });

      // If the `playgroundOptions` are set, register a `graphql-playground` instance
      // (not available in production) that is then used to handle all
      // incoming GraphQL requests.
      if (this.playgroundOptions && req.method === "GET") {
        const { mediaTypes } = accept.parseAll(req.headers);
        const prefersHTML =
          mediaTypes.find(x => x === "text/html" || x === "application/json") ===
          "text/html";

        if (prefersHTML) {
          const middlewareOptions = Object.assign(
            {
              endpoint: this.graphqlPath,
              subscriptionEndpoint: this.subscriptionsPath,
            },
            this.playgroundOptions
          );
          // 这里直接调用上面定义的本地函数
          return send(
            req,
            res,
            200,
            renderPlaygroundPage(middlewareOptions),
            "text/html"
          );
        }
      }

      // Handle incoming GraphQL requests using Apollo Server.
      const graphqlHandler = moleculerApollo(() => this.createGraphQLServerOptions(req, res));
      const responseData = await graphqlHandler(req, res);
      return send(req, res, 200, responseData);
    };
  }

  // This integration supports file uploads.
  supportsUploads() {
    return true;
  }

  // This integration supports subscriptions.
  supportsSubscriptions() {
    return true;
  }

  async handleHealthCheck({ req, res, onHealthCheck }) {
    onHealthCheck = onHealthCheck || (() => undefined);
    try {
      const result = await onHealthCheck(req);
      return send(req, res, 200, { status: "pass", result }, "application/health+json");
    } catch (error) {
      const result = error instanceof Error ? error.toString() : error;
      return send(req, res, 503, { status: "fail", result }, "application/health+json");
    }
  }
}
module.exports = {
  ApolloServer,
};