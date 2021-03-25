"use strict";
import { ActionHandlers } from './actionsHandler';
import { MasterDetailActionHandler } from './master-detail/masterDetailActionHandler'
import { FormulaActionHandler } from './formula/formulaActionHandler';
import { SummaryActionHandler } from './summary/summaryActionHandler';
import { LookupActionHandler } from './lookup/LookupActionHandler';
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
        getAll: {
            rest: {
                method: "GET",
                path: "/objects"
            },
            async handler(ctx) {
                return await ActionHandlers.getAll(ctx);
            }
        },
        add: {
            async handler(ctx) {
                await this.masterDetailActionHandler.add(ctx);
                await this.lookupActionHandler.add(ctx);
                await this.formulaActionHandler.add(ctx);
                await this.summaryActionHandler.add(ctx);
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
        getObjectFieldFormulaConfigs: {
            async handler(ctx) {
                return await this.formulaActionHandler.filter(ctx);
            }
        },
        verifyObjectFieldFormulaConfig: {
            async handler(ctx) {
                return await this.formulaActionHandler.verifyObjectFieldFormulaConfig(ctx);
            }
        },
        getObjectFieldFormulaConfig: {
            async handler(ctx) {
                return await this.formulaActionHandler.get(ctx);
            }
        },
        getFormulaVarsAndQuotes: {
            async handler(ctx) {
                return await this.formulaActionHandler.getFormulaVarsAndQuotes(ctx);
            }
        },
        getObjectFieldSummaryConfigs: {
            async handler(ctx) {
                return await this.summaryActionHandler.filter(ctx);
            }
        },
        getObjectFieldSummaryConfig: {
            async handler(ctx) {
                return await this.summaryActionHandler.get(ctx);
            }
        },
        getDetails: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getDetails(objectApiName);
            }
        },
        getDetailPaths: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getDetailPaths(objectApiName);
            }
        },
        getMaxDetailsLeave: {
            async handler(ctx) {
                const { objectApiName, paths } = ctx.params;
                return await this.masterDetailActionHandler.getMaxDetailsLeave(objectApiName, paths);
            }
        },
        getMasters: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getMasters(objectApiName);
            }
        },
        getMasterPaths: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getMasterPaths(objectApiName);
            }
        },
        getMaxMastersLeave: {
            async handler(ctx) {
                const { objectApiName, paths } = ctx.params;
                return await this.masterDetailActionHandler.getMaxMastersLeave(objectApiName, paths);
            }
        }
    },
    hooks: {
        // error: {
        //     // Global error handler
        //     "*": function(ctx, err) {
        //         // this.logger.error(`Error occurred when '${ctx.action.name}' action was called`, err);
        //         // Throw further the error
        //         throw err;
        //     }
        // }
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
        this.masterDetailActionHandler = new MasterDetailActionHandler(this.broker);
        this.formulaActionHandler = new FormulaActionHandler(this.broker);
        this.summaryActionHandler = new SummaryActionHandler(this.broker);
        this.lookupActionHandler = new LookupActionHandler(this.broker);
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
