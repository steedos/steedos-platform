"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const actionsHandler_1 = require("./actionsHandler");
module.exports = {
    name: "objects",
    /**
     * Settings
     */
    settings: {},
    /**
     * Dependencies
     */
    dependencies: ['metadata'],
    /**
     * Actions
     */
    actions: {
        /**
         * Say a 'Hello' action.
         *
         * @returns
         */
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
                // this.broker.emit("$object.registered", {name: 'test'});
                return actionsHandler_1.ActionHandlers.add(ctx);
            }
        },
        change: {
            handler(ctx) {
                return actionsHandler_1.ActionHandlers.change(ctx);
            }
        },
        delete: {
            handler(ctx) {
                return actionsHandler_1.ActionHandlers.delete(ctx);
            }
        },
        verify: {
            handler(ctx) {
                return actionsHandler_1.ActionHandlers.verify(ctx);
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
//# sourceMappingURL=objects.service.js.map