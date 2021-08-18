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
		Role: '*',
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
				return _.uniq(_.compact(nodes));
            }
		},
		installPackage:{
			async handler(ctx) {
				const { module, version, label, description} = ctx.params
                const packagePath = await registry.installModule(module, version)
				const packageInfo = await loader.loadPackage(module, packagePath);
				const packageConfog = {
					label: label, 
					version: packageInfo.version, 
					description: description || packageInfo.description, 
					local: !!packagePath, 
					path: util.getPackageRelativePath(process.cwd(), packageInfo.packagePath)
				}
				loader.appendToPackagesConfig(packageInfo.name, packageConfog);
				const metadata = await getPackageMetadata(util.getPackageRelativePath(process.cwd(), packageInfo.packagePath));
				await ctx.broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, packageConfog, {
						name: packageInfo.name,
						enable: true, 
						nodeID: ctx.broker.nodeID, 
						instanceID: ctx.broker.instanceID,
						metadata: metadata
					})
				})
				return packageConfog;
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
							await loader.loadPackage(module, spackage.path);
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
                const packageConfog = await loader.disablePackage(module);
				await ctx.broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, packageConfog, {
						nodeID: ctx.broker.nodeID, 
						instanceID: ctx.broker.instanceID, 
					})
				})
				return {}
            }
		},
		enablePackage:{
			async handler(ctx) {
				const { module } = ctx.params
                const packageConfog = await loader.enablePackage(module);
				await ctx.broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, packageConfog, {
						nodeID: ctx.broker.nodeID, 
						instanceID: ctx.broker.instanceID, 
					})
				})
				return {}
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
	}
};
