"use strict";
import { ActionHandlers } from './actionsHandler';

module.exports = {
    name: "objects",
    /**
     * Settings
     */
    settings: {

    },

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
            async handler(ctx) {
                return ActionHandlers.get(ctx);
            }
        },
        add: {
            handler(ctx) {
                // this.broker.emit("$object.registered", {name: 'test'});
                return ActionHandlers.add(ctx);
            }
        },
        change: {
            handler(ctx) {
                return ActionHandlers.change(ctx);
            }
        },
        delete: {
            handler(ctx) {
                return ActionHandlers.delete(ctx);
            }
        },
        verify: {
            handler(ctx) {
                return ActionHandlers.verify(ctx);
            }
        }
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {

    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
