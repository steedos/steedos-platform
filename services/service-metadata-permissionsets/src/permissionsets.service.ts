"use strict";
import { ActionHandlers } from './actionsHandler';
import { METADATA_TYPE, PROFILE_METADATA_TYPE } from './index';
module.exports = {
    name: "permissionsets",
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
        },
        [`$METADATA.${PROFILE_METADATA_TYPE}.*`]: {
            async handler(ctx) {
                return await ActionHandlers.refreshProfiles(ctx);
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
        },
        getProfile: {
            async handler(ctx) {
                return await ActionHandlers.getProfile(ctx);
            }
        },
        getProfiles: {
            async handler(ctx) {
                return await ActionHandlers.getProfiles(ctx);
            }
        },
        addProfile: {
            async handler(ctx) {
                return await ActionHandlers.addProfile(ctx);
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
