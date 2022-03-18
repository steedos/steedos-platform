module.exports = {
    name: "amis",
    mixins: [],
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
        getDefaultSchema: {
            async handler(ctx) {
                // const userSession = ctx.meta.user;
                // const { type, app, objectApiName, recordId, formFactor } = ctx.params;
                return this.getDefaultSchema();
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
        getDefaultSchema: {
            handler() {
                

            }
        }
    },

    /**
     * Service created lifecycle event handler
     */
    async created() {

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
