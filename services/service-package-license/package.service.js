"use strict";
const project = require('./package.json');
const packageName = project.name;
const _ = require(`lodash`);
const axios = require('axios');
const steedosLicense = require("@steedos/license");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [],
	/**
	 * Settings
	 */
	settings: {
		STEEDOS_CLOUD_URL: process.env.STEEDOS_CLOUD_URL ? process.env.STEEDOS_CLOUD_URL : 'https://console.steedos.cn',
		STEEDOS_CLOUD_SPACE_ID: process.env.STEEDOS_CLOUD_SPACE_ID,
		STEEDOS_CLOUD_API_KEY: process.env.STEEDOS_CLOUD_API_KEY
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		syncPackagesLicense: {
			rest: {
				method: "POST",
				path: "/syncSpaceLicense"
			},
			params: {},
			async handler(ctx) {
				return await this.syncPackagesLicense(ctx);
			}
		},
		getFeature: {
			handler(ctx) {
				const { key, spaceId } = ctx.params;
				return this.getFeature(key, spaceId)
			}
		},
		hasFeature: {
			handler(ctx) {
				const { key, spaceId } = ctx.params;
				return this.hasFeature(key, spaceId)
			}
		},
		getProduct: {
			handler(ctx) {
				const { key, spaceId } = ctx.params;
				return this.getProduct(key, spaceId)
			}
		},
		hasProduct: {
			handler(ctx) {
				const { key, spaceId } = ctx.params;
				return this.hasProduct(key, spaceId)
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
		getService: (ctx, serviceName)=>{
			const serviceList = ctx.broker.registry.getServiceList({ withActions: false });
			return _.find(serviceList, (_service)=>{
				return _service.name == serviceName;
			})
		},
		syncPackagesLicense: {
			async handler(ctx) {
				const eeLicenseServiceName = '~packages-@steedos/ee_service-plugin-license'
				const eeLicenseService = this.getService(ctx, eeLicenseServiceName);
				if(eeLicenseService){
					ctx.broker.call(`${eeLicenseServiceName}.syncPackagesLicense`);
				}
			}
		},
		hasFeature: {
			async handler(featureKey, spaceId) {
				return await Steedos.hasFeature(featureKey, spaceId)
			}
		},
		getFeature: {
			async handler(featureKey, spaceId) {
				return await Steedos.getFeature(featureKey, spaceId)
			}
		},
		getProduct: {
			async handler(productKey, spaceId) {
				return await Steedos.getProduct(productKey, spaceId)
			}
		},
		hasProduct: {
			async handler(productKey, spaceId) {
				return await Steedos.hasProduct(productKey, spaceId)
			}
		},
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
