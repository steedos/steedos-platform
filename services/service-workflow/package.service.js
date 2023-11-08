"use strict";
const Fiber = require("fibers");
const project = require('./package.json');
const serviceName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const { excuteTriggers } = require('./main/default/utils/trigger');

const rests = require('./src/rests')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: serviceName,
	namespace: "steedos",
	mixins: [packageLoader],
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: serviceName,
			isPackage: false
		},
		excuteTriggers: excuteTriggers
	},

	/**
	 * Dependencies
	 */
	dependencies: ['~packages-standard-objects'],
	/**
	 * Actions
	 */
	actions: {
		...rests,

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
		},
		send_badge_to_user: {
			params: {
				send_from: { type: 'string', optional: false },
				user_id: { type: 'string', optional: false }
			},
			async handler(ctx) {
				try {
					return new Promise(function (resolve, reject) {
						Fiber(function () {
							try {
								const { send_from, user_id } = ctx.params;
								pushManager.send_message_to_specifyUser(send_from, user_id);
								resolve(true);
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
