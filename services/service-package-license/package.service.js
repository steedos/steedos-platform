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
				const settings = this.settings;
				// 配置主控地址
				const consoleUrl = settings.STEEDOS_CLOUD_URL;
				if (!consoleUrl) {
					return;
				}
				// 获取环境变量中工作区信息。优先获取环境变量中的数据，初始化工作区时，仅修改环境变量中的参数值。
				const spaceId = process.env.STEEDOS_CLOUD_SPACE_ID || settings.STEEDOS_CLOUD_SPACE_ID;
				const apiKey = process.env.STEEDOS_CLOUD_API_KEY || settings.STEEDOS_CLOUD_API_KEY;
				if (!spaceId || !apiKey) {
					return;
				}
				return await this.syncPackagesLicense(spaceId, apiKey, consoleUrl);
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
		'steedos-server.started': async function (ctx) {
			await this.actions.syncPackagesLicense({}, { parentCtx: ctx });
		}
	},

	/**
	 * Methods
	 */
	methods: {
		syncPackagesLicense: {
			async handler(spaceId, apiKey, consoleUrl) {
				try {
					let result = await axios({
						url: `${consoleUrl}/api/saas/space/packages/license/${spaceId}`,
						method: 'get',
						data: {},
						headers: { "Content-Type": "application/json", "Authorization": `Bearer apikey,${apiKey}` }
					});
					if (!result.data.success) {
						throw new Error(result.data.error);
					}
					for (const license of result.data.licenses) {
						try {
							const licenseInfo = license.split(',');
							let license_decrypt = steedosLicense.verifyLicenseFile(licenseInfo[0], licenseInfo[1], spaceId);
							if (license_decrypt.verify_error) {
								throw new Error(license_decrypt.verify_error);
							}
							await steedosLicense.save({ license: licenseInfo[0], is_local: license_decrypt.is_local, key: licenseInfo[1], verify_status: license_decrypt.verify_status, verify_error: license_decrypt.verify_erro, license_last_verify: new Date(), _id: license_decrypt._id, product: license_decrypt.product }, spaceId);
						} catch (error) {
							console.error(`sync packages license fail: `, error.message);
						}
					}
					console.info(`sync packages license success`);
				} catch (error) {
					console.error(`sync packages license fail: `, error.message);
				}
			}
		},
		hasFeature: {
			async handler(featureKey, spaceId) {
				return Steedos.hasFeature(featureKey, spaceId)
			}
		},
		getFeature: {
			async handler(featureKey, spaceId) {
				return Steedos.getFeature(featureKey, spaceId)
			}
		},
		getProduct: {
			async handler(productKey, spaceId) {
				return Steedos.getProduct(productKey, spaceId)
			}
		},
		hasProduct: {
			async handler(productKey, spaceId) {
				return Steedos.hasProduct(productKey, spaceId)
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
