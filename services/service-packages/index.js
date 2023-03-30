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
const getInstallCacherKey = (serviceInfo)=>{
    return `#packages_install.${serviceInfo.name}.${serviceInfo.nodeID}`
}

const getRoutersInfoCacherKey = (packageName)=>{
	return `#packageRouter.${packageName}`
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
		install: {
			params: {
                serviceInfo: { type: "object"},
            },
			async handler(ctx) {
                await ctx.broker.call('metadata.add', {key: getInstallCacherKey(ctx.params.serviceInfo), data: ctx.params.serviceInfo}, {meta: ctx.meta})
			}
		},
		uninstall: {
			params: {
                serviceInfo: { type: "object"},
            },
			async handler(ctx) {
                await ctx.broker.call('metadata.delete', {key: getInstallCacherKey(ctx.params.serviceInfo), data: ctx.params.serviceInfo}, {meta: ctx.meta})
			}
		},
		getSteedosInstallPackages: {
            async handler(ctx) {
                return await ctx.broker.call('metadata.filter', {key: getInstallCacherKey({name: "*", instanceID: "*", nodeID: "*"})}, {meta: ctx.meta}) 
			}
        },
        getSteedosPackages: {
            async handler(ctx) {
                return await ctx.broker.call('metadata.filter', {key: getCacherKey({name: "*", instanceID: "*", nodeID: "*"})}, {meta: ctx.meta}) 
			}
        },
		setPackageRoutersInfo: {
			async handler(ctx) {
                return await ctx.broker.call('metadata.add', {key: getRoutersInfoCacherKey(ctx.params.packageName), data: ctx.params.data}, {meta: ctx.meta}) 
			} 
		},
		getPackageRoutersInfo: {
			async handler(ctx) {
                return await ctx.broker.call('metadata.get', {key: getRoutersInfoCacherKey(ctx.params.packageName)}, {meta: ctx.meta}) 
			} 
		},
		getPackageMetadata: {
			async handler(ctx) {
				const serviceName = `~packages-${ctx.params.packageName}`
                const configs = await ctx.broker.call(`metadata.getServiceMetadatas`, {
					serviceName,
					metadataType: "*",
					metadataApiName: "*"
				});
				const metadata = [];
				_.each(configs, (config)=>{
					if(config.metadataType && config.metadataApiName){
						const {label,name} = config.metadata || {}
						metadata.push({type: config.metadataType, api_name: config.metadataApiName, label: label || name})
					}
				})
				return metadata;
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
