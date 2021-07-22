"use strict";
const project = require('./package.json');
const packageName = project.name;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */

const getCacherKey = (serviceInfo)=>{
    return `#packages.${serviceInfo.name}.${serviceInfo.instanceID}`
}

module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [],
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: packageName
		}
	},

	/**
	 * Dependencies
	 */
    dependencies: ['metadata'],

	/**
	 * Actions
	 */
	actions: {
        offline: {
			params: {
                serviceInfo: { type: "object"},
            },
			async handler(ctx) {
                await ctx.broker.call('metadata.delete', {key: getCacherKey(ctx.params.serviceInfo)}, {meta: ctx.meta})
			}
		},
        online: {
			params: {
                serviceInfo: { type: "object"},
            },
			async handler(ctx) {
                await ctx.broker.call('metadata.add', {key: getCacherKey(ctx.params.serviceInfo), data: ctx.params.serviceInfo}, {meta: ctx.meta})
			}
		},
        getSteedosPackages: {
            async handler(ctx) {
                return await ctx.broker.call('metadata.filter', {key: getCacherKey({name: "*", instanceID: "*"})}, {meta: ctx.meta}) 
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
