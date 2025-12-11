"use strict";

const { ApolloServerBase } = require("apollo-server-core");
const accept = require("@hapi/accept");
const moleculerApollo = require("./moleculerApollo");

// ... [Keep your renderPlaygroundPage function exactly as is] ...
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

// ... [Keep your send function as is] ...
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
  // --- ADDED: Constructor to handle playground options manually ---
  constructor(config) {
    super(config);
    // Apollo Server v3 removes the playground option from the instance.
    // We must manually capture it.
    // We default to {} (enabled) if it is not explicitly set to false.
    this.playgroundOptions = config.playground !== false ? (config.playground || {}) : false;
    
    // Also capture uploads config manually if needed, though v3 usually preserves it in other ways,
    // it's safer to ensure it exists for your handler logic below.
    this.uploadsConfig = config.uploads !== false ? (config.uploads || {}) : false;
  }
  // ---------------------------------------------------------------

  createGraphQLServerOptions(req, res) {
    return super.graphQLServerOptions({ req, res });
  }

  createHandler({ path, disableHealthCheck, onHealthCheck } = {}) {
    // FIX: Support Apollo Server v3 (.start) and v2 (.willStart)
    let promiseWillStart;
    if (typeof this.start === 'function') {
      promiseWillStart = this.start();
    } else if (typeof this.willStart === 'function') {
      promiseWillStart = this.willStart();
    } else {
      promiseWillStart = Promise.resolve();
    }

    return async (req, res) => {
      this.graphqlPath = path || "/graphql";

      await promiseWillStart;

      // Handle File Uploads (graphql-upload v17)
      if (this.uploadsConfig) {
        const contentType = req.headers["content-type"];
        if (contentType && contentType.startsWith("multipart/form-data")) {
            try {
                const { processRequest } = await import("graphql-upload/processRequest.mjs");
                // Note: processRequest no longer takes options in v17, 
                // but we pass this.uploadsConfig just in case you wrap/shim it, 
                // typically it just takes (req, res).
                // If you need to configure limits, you usually do it via middleware before this 
                // or ensure processRequest respects the limits you want.
                req.filePayload = await processRequest(req, res, this.uploadsConfig);
            } catch (error) {
                if (error.status && error.expose) {
                    return send(req, res, error.status, error.message);
                }
                return send(req, res, 500, "File upload processing failed.");
            }
        }
      }

      if (!disableHealthCheck && req.url === "/.well-known/apollo/server-health")
        return await this.handleHealthCheck({ req, res, onHealthCheck });

      // Handle Playground (GET requests requiring HTML)
      // This will now work because this.playgroundOptions is set in the constructor
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
          return send(
            req,
            res,
            200,
            renderPlaygroundPage(middlewareOptions),
            "text/html"
          );
        }
      }

      const graphqlHandler = moleculerApollo(() => this.createGraphQLServerOptions(req, res));
      const responseData = await graphqlHandler(req, res);
      return send(req, res, 200, responseData);
    };
  }

  supportsUploads() {
    return true;
  }

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