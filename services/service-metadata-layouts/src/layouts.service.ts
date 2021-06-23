"use strict";
import { METADATA_TYPE } from '.';
import { ActionHandlers } from './actionsHandler';
module.exports = {
    name: "layouts",
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: ['metadata'],

    events: {
		[`$METADATA.${METADATA_TYPE}.*`]: {
            async handler(ctx) {
                return await ActionHandlers.refresh(ctx);
            }
        }
	},
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
            async handler(ctx) {
                return await ActionHandlers.get(ctx);
            }
        },
        getAll: {
            async handler(ctx) {
                return await ActionHandlers.getAll(ctx);
            }
        },
        filter: {
            async handler(ctx){
                return await ActionHandlers.filter(ctx);
            }
        },
        add: {
            async handler(ctx) {
                return await ActionHandlers.add(ctx);
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
        }
    },
    hooks:{
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
