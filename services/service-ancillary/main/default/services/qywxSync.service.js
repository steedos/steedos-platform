/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-21 09:19:40
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-21 16:49:08
 * @Description: 
 */
const qywxSync = require('../routers/sync');

module.exports = {
	name: 'qywxSync',
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
		write: {
            async handler(ctx) {
                const { content } = ctx.params;
                return qywxSync.write(content);
            }
        },
        decrypt: {
            async handler(ctx) {
                return await qywxSync.decrypt(ctx.params);
            }
        },
        userinfoPush: {
            async handler(ctx) {
                const { userId, status = 0 } = ctx.params;
                return await qywxSync.userinfoPush(userId, status);
            }
        },
        deptinfoPush: {
            async handler(ctx) {
                const { deptId, name, parentId, status = 0 } = ctx.params;
                return await qywxSync.deptinfoPush(deptId, name, parentId, status);
            }
        },
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
