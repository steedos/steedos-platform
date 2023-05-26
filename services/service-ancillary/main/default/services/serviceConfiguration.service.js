/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-21 09:19:40
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-21 15:26:42
 * @Description: 
 */

module.exports = {
	name: 'serviceConfiguration',
	namespace: "steedos",
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
		findOne: {
            async handler(ctx) {
                const { query } = ctx.params;
                return ServiceConfiguration.configurations.findOne(query);
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
