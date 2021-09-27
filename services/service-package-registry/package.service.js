"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const loader = require('./main/default/manager/loader');
const packages = require('./main/default/manager/packages');
const registry = require('./main/default/manager/registry');
const metadata = require('@steedos/metadata-core')
const _ = require(`lodash`);
const path = require(`path`);
const objectql = require('@steedos/objectql');
const metadataApi = require('@steedos/metadata-api');
const util = require('./main/default/manager/util');
const fetch = require('node-fetch');
const { MoleculerError } = require("moleculer").Errors;

const HEADER_AUTH = 'Authorization';
const AUTH_TYPE = 'Bearer';

const getPackageMetadata = async (packagePath)=>{
	const packageMetadata = [];
	const result = await metadataApi.loadFileToJson(packagePath, {
		CustomApplication: '*',
		CustomPermissionset: '*',
		CustomProfile: '*',
		CustomObject: '*',
		Layout: '*',
		CustomReport: '*',
		Workflow: '*',
		Flow: '*',
		ApprovalProcess: '*',
		Role: '*',
		FlowRole: '*',
		Query: '*',
		Chart: '*',
		Page: '*',
		Tab: '*',
	});

	_.each(result, (metadataItems, metadataType)=>{
		_.each(metadataItems, (metadata, apiName)=>{
			packageMetadata.push({
				label: metadata.label || metadata.name,
				type: metadataType,
				api_name: apiName
			})
		})
	})
	return packageMetadata;
}

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
			name: this.name,
			isPackage: false
		},
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
		getProjectNodes: {
			rest: {
                method: "GET",
                path: "/getProjectNodes"
            },
            async handler(ctx) {
                // let schema = objectql.getSteedosSchema();
				// let broker = schema.broker;
				// const serviceList = broker.registry.getServiceList({ withActions: false });
				// const services = _.filter(serviceList, (_service)=>{
				// 	return _service.name == this.name;
				// })
				// return services;
				const data = await ctx.broker.call('metadata.filter', {key: `#package_install_node.*`}, {meta: ctx.meta})
				const nodes = [];
				_.each(data,(item)=>{
					nodes.push(item.metadata.nodeID)
				})
				let installNodes = _.uniq(_.compact(nodes));

				if(installNodes.length === 0){
					installNodes = [ctx.broker.nodeID]
				}
				return installNodes;
            }
		},
		installPackage:{
			async handler(ctx) {
				const { module, version, label, description} = ctx.params
				return await this.installPackage(module, version, label, description, true, ctx.broker);
            }
		},
		uninstallPackage:{
			async handler(ctx) {
				const { module } = ctx.params
                await loader.removePackage(module);
        		await registry.uninstallModule(module)
				await ctx.broker.call(`@steedos/service-packages.uninstall`, {
					serviceInfo: {
						name: module, 
						nodeID: ctx.broker.nodeID, 
						instanceID: ctx.broker.instanceID, 
					}
				})
				return {};
            }
		},
		reloadPackage:{
			async handler(ctx) {
				const { module } = ctx.params
                const packages = loader.loadPackagesConfig();
				const spackage = _.find(packages, (_p, pname)=>{
					return pname === module;
				})
				if(spackage){
					if(spackage.enable){
						if(spackage.local){
							let packagePath = spackage.path;
							if(!path.isAbsolute(packagePath)){
								packagePath = path.resolve(process.cwd(), packagePath)
							}
							await loader.loadPackage(module, packagePath);
						}else{
							await loader.loadPackage(module);
						}
					}else{
						throw new Error('package is disable: ' + module )
					}
				}else{
					throw new Error('not find package: ' + module)
				}

				return {}
            }
		},
		disablePackage:{
			async handler(ctx) {
				const { module } = ctx.params
                const packageConfig = await loader.disablePackage(module);
				const metadata = await getPackageMetadata(util.getPackageRelativePath(process.cwd(), packageConfig.path));
				await ctx.broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, packageConfig, {
						nodeID: ctx.broker.nodeID, 
						instanceID: ctx.broker.instanceID,
						metadata: metadata 
					})
				})
				return {}
            }
		},
		enablePackage:{
			async handler(ctx) {
				const { module } = ctx.params
                const packageConfig = await loader.enablePackage(module);
				const metadata = await getPackageMetadata(util.getPackageRelativePath(process.cwd(), packageConfig.path));
				await ctx.broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, packageConfig, {
						nodeID: ctx.broker.nodeID, 
						instanceID: ctx.broker.instanceID,
						metadata: metadata
					})
				})
				return {}
            }
		},
		getCloudSaasPurchasedPackages:{
			rest: {
                method: "GET",
                path: "/cloud/saas/packages/purchased"
            },
			async handler(ctx) {
				try {
					
					const user = ctx.meta.user;
					if(!user.is_space_admin){
						throw new Error('not permission!');
					}
					return await this.getCloudSaasPurchasedPackages();
				} catch (error) {
					throw new MoleculerError(error.message, 500, "ERR_SOMETHING");
				}
            }
		},
		installPurchasedPackages: {
			rest: {
                method: "POST",
                path: "/cloud/saas/packages/purchased"
            },
			async handler(ctx){
				const installErrors = {};
				const installPackages = [];
				try {
					const user = ctx.meta.user;
					if(!user.is_space_admin){
						throw new Error('not permission!');
					}
					const result = await this.getCloudSaasPurchasedPackages();
					for (const _package of result.packages) {
						try {
							const { name, version, label, description } = _package
							let enable = true; //安装已购买的软件包时先默认启用
							const packageInfo = await this.installPackage(name, version, label, description, enable, ctx.broker);
							installPackages.push(packageInfo)
						} catch (error) {
							if(error.stderr){
								installErrors[_package.name] = error.stderr
							}else{
								installErrors[_package.name] = error.message
							}
						}
					}
					return {
						installPackages: installPackages,
						installErrors: installErrors
					}
				} catch (error) {
					throw new MoleculerError(error.message, 500, "ERR_SOMETHING");
				}
			}
		},
		getPackageVersions: {
			async handler(ctx) {
				const { module } = ctx.params
				return await this.getPackageVersions(module);
            }
		},
		upgradePackage: {
			async handler(ctx) {
				const { module, version } = ctx.params
				return await this.upgradePackage(module, version);
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
		installPackage: {
			async handler(module, version, label, description, enable, broker) {
                const packagePath = await registry.installModule(module, version)
				if(enable){
					const packageInfo = await loader.loadPackage(module, packagePath);
				}else{
					enable = false;
				}
				const packageConfig = {
					label: label, 
					version: version, 
					description: description || '', 
					local: false, 
					enable: enable,
					path: util.getPackageRelativePath(process.cwd(), packagePath)
				}
				loader.appendToPackagesConfig(module, packageConfig);
				const metadata = await getPackageMetadata(util.getPackageRelativePath(process.cwd(), packagePath));
				await broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, packageConfig, {
						name: module,
						enable: enable, 
						nodeID: broker.nodeID, 
						instanceID: broker.instanceID,
						metadata: metadata
					})
				})
				return packageConfig;
            }
		},
		getCloudSaasPurchasedPackages:{
			async handler() {
				const settings = this.settings;
				const apiKey = settings.STEEDOS_CLOUD_API_KEY
				const spaceId = settings.STEEDOS_CLOUD_SPACE_ID
				const url = settings.STEEDOS_CLOUD_URL

				if(!apiKey || !spaceId || !url){
					throw new Error(`请配置STEEDOS_CLOUD参数`);
				}
				const headers = Object.assign({}, {'Content-Type': 'application/json'}, { [HEADER_AUTH]: `${AUTH_TYPE} apikey,${apiKey}`});
				const response = await fetch(`${url}/api/shop/product_subscriptions/steedos-packages`, {
					method: 'GET', headers: headers
				});

				const result = await response.json();

				if(result.status === 'error'){
					throw new Error(`${url}: ${result.message}`)
				}

				const packages = [];

				_.each(result.data, (item)=>{
					let isExist = _.find(packages, (_package)=>{
						return _package.name === item.product.sku
					})
					if(!isExist){
						packages.push({
							name: item.product.sku, 
							version: null,  //始终安装latest最新版
							label: item.product.name, 
							description: item.product.description || ''
						})
					}
				})
				return { packages : packages}
            }
		},
		getPackageVersions: {
			async handler(module) {
                return packages.getPackageVersions(module);
            }
		},
		upgradePackage: {
			async handler(module, version) {
                const packagePath = await registry.installModule(module, version);
				const enable = true;
				if(enable){
					await loader.loadPackage(module, packagePath);
				}else{
					enable = false;
				}
				const packageConfig = {
					version: version, 
					enable: enable,
					path: util.getPackageRelativePath(process.cwd(), packagePath)
				}
				const newConfig = loader.appendToPackagesConfig(module, packageConfig);
				const metadata = await getPackageMetadata(util.getPackageRelativePath(process.cwd(), packagePath));
				await this.broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, newConfig, {
						name: module,
						enable: enable, 
						nodeID: this.broker.nodeID, 
						instanceID: this.broker.instanceID,
						metadata: metadata
					})
				})
				return packageConfig;
            }
		}
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
		const PACKAGE_INSTALL_NODE = process.env.PACKAGE_INSTALL_NODE
		if(PACKAGE_INSTALL_NODE){
			await this.broker.call('metadata.add', {key: `#package_install_node.${this.broker.nodeID}`, data: {nodeID: PACKAGE_INSTALL_NODE}}, {meta: {}}) 
		}
		packages.maintainSystemFiles()
		try {
			const packagePath = path.join(process.cwd(), 'steedos-app');
			const packageInfo = require(path.join(packagePath, 'package.json'));
			loader.appendToPackagesConfig(`${packageInfo.name}`, {version: packageInfo.version, description: packageInfo.description, local: true, path: util.getPackageRelativePath(process.cwd(), packagePath)});
		} catch (error) {
			console.log(`started error`, error)
		}

		await metadata.uncompressPackages(process.cwd());
		const mPackages = metadata.getAllPackages(process.cwd());
		_.each(mPackages, (packagePath)=>{
			try {
				const packageInfo = require(path.join(packagePath, 'package.json'));
				loader.appendToPackagesConfig(packageInfo.name, {version: packageInfo.version, description: packageInfo.description, local: true, path: util.getPackageRelativePath(process.cwd(), packagePath)});
			} catch (error) {
				console.log(`started error`, error)
			}
		})
		await loader.loadPackages();

		//注册本地已安装的steedos packages
		const installPackages = loader.loadPackagesConfig();
		for (const name in installPackages) {
			if (Object.hasOwnProperty.call(installPackages, name)) {
				const _packageInfo = installPackages[name];
				const metadata = await getPackageMetadata(_packageInfo.path);
				await this.broker.call(`@steedos/service-packages.install`, {
					serviceInfo: {
						name: name, 
						nodeID: this.broker.nodeID, 
						instanceID: this.broker.instanceID, 
						path: _packageInfo.path,
						local: _packageInfo.local, 
						enable: _packageInfo.enable, 
						version: _packageInfo.version, 
						description: _packageInfo.description,
						metadata: metadata
					}
				})
			}
		}
		
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		const PACKAGE_INSTALL_NODE = process.env.PACKAGE_INSTALL_NODE
		if(PACKAGE_INSTALL_NODE){
			this.broker.call('metadata.delete', {key: `#package_install_node.${this.broker.nodeID}`}, {meta: {}}) 
		}
		const installPackages = loader.loadPackagesConfig();
		for (const name in installPackages) {
			this.broker.call(`@steedos/service-packages.uninstall`, {
				serviceInfo: {
					name: name, 
					nodeID: this.broker.nodeID, 
					instanceID: this.broker.instanceID, 
				}
			})
		}
	},
    merged(schema) {
        schema.name = '~packages-project-server';  //禁止修改name
    }
};
