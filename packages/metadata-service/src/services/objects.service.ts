"use strict";

import { SObject } from "../handler/object";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

 const SObjectHandler = new SObject();

module.exports = {
	name: "objects",
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
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		get: {
			rest: {
				method: "GET",
				path: "/object"
			},
			async handler(ctx) {
				return SObjectHandler.get(ctx.broker, ctx.params.objectAPIName);
			}
		},
		add:{
			handler(ctx){
				this.broker.emit("$object.registered", {name: 'test'});
				return SObjectHandler.add(ctx.broker, ctx.params.data);
				return true;
			}
		},
		change:{
			handler(ctx){
				return SObjectHandler.change(ctx.broker, ctx.params.data, ctx.params.oldData);
			}
		},
		delete:{
			handler(ctx){
				return SObjectHandler.delete(ctx.broker, ctx.params.objectAPIName);
			}
		},
		verify:{
			handler(ctx){
				console.log("verify");
				return true;
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
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		// setInterval(()=>{
		// 	this.broker.call("appContracts.find", {name: 'main 1'}).then(res2=>{console.log(res2)})
		// 	// this.broker.call("$node.services").then(res => console.log(res));
		// }, 10000)
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
