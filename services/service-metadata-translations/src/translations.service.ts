"use strict";
import { ActionHandlers } from './actionsHandler';
module.exports = {
    name: "translations",
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        // /**
        //  * Say a 'Hello' action.
        //  *
        //  * @returns
        //  */
        // get: {
        //     rest: {
        //         method: "GET",
        //         path: "/object"
        //     },
        //     async handler(ctx) {
        //         return await ActionHandlers.get(ctx);
        //     }
        // },
        getTranslations: {
            async handler(ctx) {
                return await ActionHandlers.getTranslations(ctx);
            }
        },
        addTranslation: {
            async handler(ctx) {
                return await ActionHandlers.addTranslation(ctx);
            }
        },
        getObjectTranslations: {
            async handler(ctx) {
                return await ActionHandlers.getObjectTranslations(ctx);
            }
        },
        addObjectTranslation: {
            async handler(ctx) {
                return await ActionHandlers.addObjectTranslation(ctx);
            }
        },
        addObjectTranslationTemplates: {
            async handler(ctx) {
                return await ActionHandlers.addObjectTranslationTemplates(ctx);
            }
        },
        getObjectTranslationTemplates: {
            async handler(ctx) {
                return await ActionHandlers.getObjectTranslationTemplates(ctx);
            }
        },
        addObjectTranslations: {
            async handler(ctx) {
                return await ActionHandlers.addObjectTranslations(ctx);
            }
        },
        // change: {
        //     async handler(ctx) {
        //         return await ActionHandlers.change(ctx);
        //     }
        // },
        // delete: {
        //     async handler(ctx) {
        //         return await ActionHandlers.delete(ctx);
        //     }
        // },
        // verify: {
        //     async handler(ctx) {
        //         return await ActionHandlers.verify(ctx);
        //     }
        // }
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