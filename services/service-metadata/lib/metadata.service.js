"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const actionsHandler_1 = require("./actionsHandler");
module.exports = {
    name: "metadata",
    namespace: "steedos",
    /**
     * Settings
     */
    settings: {
        // Exposed port
        port: process.env.PORT || 3040,
        // Exposed IP
        ip: "0.0.0.0",
        // Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],
        routes: [
            {
                path: "/api",
                whitelist: [
                    "**"
                ],
                // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
                use: [],
                // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
                mergeParams: true,
                // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
                authentication: false,
                // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
                authorization: false,
                // The auto-alias feature allows you to declare your route alias directly in your services.
                // The gateway will dynamically build the full routes from service schema.
                autoAliases: true,
                aliases: {},
                /**
                 * Before call hook. You can check the request.
                 * @param {Context} ctx
                 * @param {Object} route
                 * @param {IncomingRequest} req
                 * @param {ServerResponse} res
                 * @param {Object} data
                 *
                onBeforeCall(ctx, route, req, res) {
                    // Set request headers to context meta
                    ctx.meta.userAgent = req.headers["user-agent"];
                }, */
                /**
                 * After call hook. You can modify the data.
                 * @param {Context} ctx
                 * @param {Object} route
                 * @param {IncomingRequest} req
                 * @param {ServerResponse} res
                 * @param {Object} data
                onAfterCall(ctx, route, req, res, data) {
                    // Async function which return with Promise
                    return doSomething(ctx, res, data);
                }, */
                // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
                callingOptions: {},
                bodyParsers: {
                    json: {
                        strict: false,
                        limit: "1MB"
                    },
                    urlencoded: {
                        extended: true,
                        limit: "1MB"
                    }
                },
                // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
                mappingPolicy: "all",
                // Enable/disable logging
                logging: true
            }
        ],
        // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
        log4XXResponses: false,
        // Logging the request parameters. Set to any log level to enable it. E.g. "info"
        logRequestParams: null,
        // Logging the response data. Set to any log level to enable it. E.g. "info"
        logResponseData: null,
        // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
        assets: {
            folder: "public",
            // Options to `server-static` module
            options: {}
        }
    },
    /**
     * Dependencies
     */
    dependencies: [],
    /**
     * Actions
     */
    actions: {
        get: {
            rest: {
                method: "GET",
                path: "/object"
            },
            handler(ctx) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return actionsHandler_1.ActionHandlers.get(ctx);
                });
            }
        },
        add: {
            handler(ctx) {
                return actionsHandler_1.ActionHandlers.add(ctx);
            }
        },
        delete: {
            handler(ctx) {
                return actionsHandler_1.ActionHandlers.delete(ctx);
            }
        }
    },
    /**
     * Events
     */
    events: {},
    /**
     * Methods
     */
    methods: {},
    /**
     * Service created lifecycle event handler
     */
    created() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    },
    /**
     * Service started lifecycle event handler
     */
    started() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    },
    /**
     * Service stopped lifecycle event handler
     */
    stopped() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
};
//# sourceMappingURL=metadata.service.js.map