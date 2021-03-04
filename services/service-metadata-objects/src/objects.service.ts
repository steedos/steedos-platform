"use strict";
import { ActionHandlers } from './actionsHandler';
import { FormulaActionHandler } from './formula/formulaActionHandler';
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
                return await ActionHandlers.get(ctx);
            }
        },
        add: {
            async handler(ctx) {
                // this.broker.emit("$object.registered", {name: 'test'});
                await this.formulaActionHandler.add(ctx)
                return await ActionHandlers.add(ctx);
            }
        },
        change: {
            async handler(ctx) {
                return await ActionHandlers.change(ctx);
            }
        },
        delete: {
            async handler(ctx) {
                return await ActionHandlers.delete(ctx);
            }
        },
        verify: {
            async handler(ctx) {
                return await ActionHandlers.verify(ctx);
            }
        },
        getObjectFieldFormulaConfigs:{
            async handler(ctx) {
                return await this.formulaActionHandler.filter(ctx);
            }
        },
        getObjectFieldFormulaConfig:{
            async handler(ctx) {
                return await this.formulaActionHandler.get(ctx);
            }
        },
        getFormulaVarsAndQuotes:{
            async handler(ctx) {
                return await this.formulaActionHandler.getFormulaVarsAndQuotes(ctx);
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
        this.formulaActionHandler = new FormulaActionHandler(this.broker)
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
