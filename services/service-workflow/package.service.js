"use strict";
const Fiber = require("fibers");
const project = require('./package.json');
const serviceName = project.name;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: serviceName,
	namespace: "steedos",
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: serviceName
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [],
	/**
	 * Actions
	 */
	actions: {
		create_instance: {
			params:
			{
				instance: { type: 'object', optional: false },
				user: { type: 'object', optional: false },
			},
			async handler(ctx) {
				try {
					return new Promise(function (resolve, reject) {
						Fiber(function () {
							try {
								const { instance, user } = ctx.params;
								let new_ins_id = uuflowManager.create_instance(instance, user);
								resolve(new_ins_id);
							} catch (error) {
								console.error(error);
								reject(error);
							}
						}).run();
					})
				} catch (error) {
					return false;
				}
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
	async started(ctx) {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
