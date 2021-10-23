"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const _ = require('lodash');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [packageLoader],
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: packageName,
			isPackage: false
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {},

	/**
	 * Events
	 */
	 events: {
		'steedos-server.started': async function (ctx) {
			// Accounts.onLogin((a,b,c,d,e)=>{
			// 	console.log(`Accounts.onLogin`, a,b,c,d,e)
			// 	Accounts.logoutOtherClients((error, result)=>{
			// 		console.log(`logoutOtherClients...`)
			// 		console.log(`error`, error)
			// 		console.log(`result`, result)
			// 	});
			// })
		}
	},

	/**
	 * Methods
	 */
	methods: {},

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
