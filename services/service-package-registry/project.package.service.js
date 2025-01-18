

"use strict";
const loader = require('./main/default/manager/loader');
const packages = require('./main/default/manager/packages');
const registry = require('./main/default/manager/registry');
const metadata = require('@steedos/metadata-core')
const axios = require('axios');
const _ = require(`lodash`);
const path = require(`path`);

const util = require('./main/default/manager/util');
const fetch = require('node-fetch');
const fs = require('fs');
const { MoleculerError } = require("moleculer").Errors;
const validator = require('validator');
const npa = require("npm-package-arg");
const login = require('./main/default/manager/login');

const HEADER_AUTH = 'Authorization';
const AUTH_TYPE = 'Bearer';

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: '@steedos/service-project',
	namespace: "steedos",
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: this.name,
			isPackage: false
		},
		STEEDOS_INITIAL_PACKAGES: process.env.STEEDOS_INITIAL_PACKAGES
	},

	/**
	 * Dependencies
	 */
	dependencies: ['@steedos/service-packages'],

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
				let packageConfig = _.find(packages, (_p, pname) => {
					_p.name = pname;
					return pname === module;
				})
				if (packageConfig) {
					if (packageConfig.enable) {
						if(packageConfig.static){
							packageConfig = Object.assign({}, packageConfig, this.getStaticPackageInfo(packageConfig, packageConfig.name))
						}
						if (packageConfig.local) {
							let packagePath = packageConfig.path;
							if(!path.isAbsolute(packagePath)){
								packagePath = path.resolve(process.cwd(), packagePath)
							}
							await loader.loadPackage(module, packagePath);
							const metadata = await loader.getPackageMetadata(util.getPackageRelativePath(process.cwd(), packageConfig.path));
							const packageYmlData = loader.getPackageYmlData(packagePath);
							await ctx.broker.call(`@steedos/service-packages.install`, {
								serviceInfo: Object.assign({}, Object.assign({}, packageConfig, { name: module }), {
									packageYmlData: packageYmlData,
									nodeID: ctx.broker.nodeID,
									instanceID: ctx.broker.instanceID,
									metadata: metadata
								})
							})
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
                let packageConfig = await loader.disablePackage(module);
				if(packageConfig.static){
					packageConfig = Object.assign({}, packageConfig, this.getStaticPackageInfo(packageConfig, packageConfig.name))
				}
				if(packageConfig.path){
					const metadata = await loader.getPackageMetadata(util.getPackageRelativePath(process.cwd(), packageConfig.path));
					const packageYmlData = loader.getPackageYmlData(packageConfig.path);
					await ctx.broker.call(`@steedos/service-packages.install`, {
						serviceInfo: Object.assign({}, packageConfig, {
							packageYmlData,
							nodeID: ctx.broker.nodeID, 
							instanceID: ctx.broker.instanceID,
							metadata: metadata 
						})
					})
				}
				return {}
            }
		},
		enablePackage:{
			async handler(ctx) {
				const { module } = ctx.params
				let packageConfig = await loader.getPackageConfig(module);

				if(packageConfig.static){
					packageConfig = Object.assign({}, packageConfig, this.getStaticPackageInfo(packageConfig, packageConfig.name))
				}

				const packageYmlData = loader.getPackageYmlData(packageConfig.path);

				if(packageYmlData.dependencies){
					await packages.checkDependencies(path.resolve(packageConfig.path), packageYmlData.dependencies || [])
				}
                packageConfig = await loader.enablePackage(module);

				if(packageConfig.static){
					packageConfig = Object.assign({}, packageConfig, this.getStaticPackageInfo(packageConfig, packageConfig.name))
				}

				const metadata = await loader.getPackageMetadata(util.getPackageRelativePath(process.cwd(), packageConfig.path));
				await ctx.broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, packageConfig, {
						packageYmlData,
						nodeID: ctx.broker.nodeID, 
						instanceID: ctx.broker.instanceID,
						metadata: metadata
					})
				})
				return {}
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
		},
		installPackageFromUrl: {
			async handler(ctx){
				try {
					const user = ctx.meta.user;
					if(!user.is_space_admin){
						throw new Error('not permission!');
					}
					let { module, version, url, auth, registry_url, fromClient = false } = ctx.params
					const enable = true;
					return await this.installPackageFromUrl(module, version, url, auth, enable, registry_url, ctx.broker, {fromClient})
				} catch (error) {
					this.broker.logger.error(`installPackageFromUrl: `, error);
					let errorInfo = error.message || '';
					if (error.stderr) {
						const errors = error.stderr.split('\n');
						errors.forEach(element => {
							if (element) {
								try {
									const item = JSON.parse(element);
									if (item.type === 'error') {
										errorInfo = errorInfo + item.data + '\n'
									}
								} catch (error) {
								}
							}
						});
					}
					throw new MoleculerError(errorInfo, 500, "ERR_SOMETHING");
				}
			}
		},
		initialPackages: {
			async handler(ctx) {
				return await this.initialPackages();
			}
		},
		addPackages: {
			async handler(ctx) {
				return await this.addPackages(ctx);
			}
		},
		getNpmrc: {
			async handler(ctx){
				return await loader.getNpmrc()
			}
		},
		setNpmrc: {
			async handler(ctx){
				const { npmrc } = ctx.params;
				return await loader.setNpmrc(npmrc)
			}
		},
		yarnAddPackage: {
			async handler(ctx) {
				const { yarnPackage } = ctx.params;
				return await this.yarnAddPackage(yarnPackage);
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
			async handler(module, version, label, description, enable, broker, registry) {
				return await loader.installPackage(broker, {module, version, label, description, enable, registry})
            }
		},
		getPackageVersions: {
			async handler(module) {
                return packages.getPackageVersions(module);
            }
		},
		upgradePackage: {
			async handler(module, version) {
				//TODO 处理 registry_url
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
				const metadata = await loader.getPackageMetadata(util.getPackageRelativePath(process.cwd(), packagePath));
				const packageYmlData = loader.getPackageYmlData(packagePath);
				await this.broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, newConfig, {
						packageYmlData,
						name: module,
						enable: enable, 
						nodeID: this.broker.nodeID, 
						instanceID: this.broker.instanceID,
						metadata: metadata
					})
				})
				return packageConfig;
            }
		},
		installPackageFromUrl: {
			async handler(module, version, url, auth, enable, registry_url, broker, {fromClient}) {
				if(!module || !_.isString(module) || !module.trim()){
					throw new Error(`无效的软件包名称`);
				} else {
					module = module.trim();
				}
				if (url && !registry.isPackageUrl(url)) {
					throw new Error(`无效的软件包地址`);
				}
				if (url) {
					url = url.trim();
					version = null;
				} else {
					url = null;
					if (!version) {
						version = 'latest'
					} else {
						version = version.trim();
					}
				}

				const packagePath = await registry.installModule(module, version, url, registry_url);
				const packageInfo = loader.getPackageInfo(null, packagePath);
				const packageName = packageInfo.name;
				if(enable){
					if(fromClient){
						await packages.checkDependencies(packagePath)
					}
					await loader.loadPackage(packageName, packagePath);
				}else{
					enable = false;
				}
				const packageConfig = {
					label: packageInfo.name, 
					version: packageInfo.version, 
					description: packageInfo.description || '', 
					local: false, 
					enable: enable,
					url: url,
					// registry_url: registry_url,
					path: util.getPackageRelativePath(process.cwd(), packagePath)
				}
				loader.appendToPackagesConfig(packageName, packageConfig);
				let metadata = {}
				try {
					// 软件包元数据扫描失败,并不影响软件包的启动. 在控制台输出异常信息即可.
					metadata = await loader.getPackageMetadata(util.getPackageRelativePath(process.cwd(), packagePath));
				} catch (error) {
					console.error(error)
				}
				const packageYmlData = loader.getPackageYmlData(packagePath);
				await broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, packageConfig, {
						packageYmlData,
						name: packageName,
						enable: enable, 
						nodeID: broker.nodeID, 
						instanceID: broker.instanceID,
						metadata: metadata
					})
				})
				return packageConfig;
			}
		},
		getSafeScopes: {
			async handler(spaceId, apiKey, consoleUrl) {
				let result = await axios({
					url: `${consoleUrl}/api/npm-scopes/safe`,
					method: 'post',
					data: {
						cloudSpaceId: spaceId
					},
					timeout: 5 * 1000,
					headers: { "Content-Type": "application/json", "Authorization": `Bearer apikey,${apiKey}` }
				})
				if (!result.data.success) {
					throw new Error(result.data.error);
				}
				return result.data;
			}
		},
		initialPackages: {
			async handler(){
				const settings = this.settings;
				const packages = settings.STEEDOS_INITIAL_PACKAGES;
				if(_.isString(packages) && packages){
					console.log('install initial packages: ', packages);
					for (const packageName of packages.split(',')) {
						try {
							const parsed = npa(packageName);
							const installProps = {
								url: null,
								name: null,
								version: null
							};
							switch (parsed.type) {
								case "tag":
									installProps.name = parsed.name;
									installProps.version = parsed.rawSpec;
									break;
								case "version":
									installProps.name = parsed.name;
									installProps.version = parsed.rawSpec;
									break;
								case "range":
									installProps.name = parsed.name;
									installProps.version = parsed.rawSpec;
									break;
								case "directory":
								case "remote":
								case "file":
								case "git":
									installProps.url = parsed.rawSpec;
									break;
								case "alias":
									throw new Error(`not support ${parsed.type}`);
							}
							if(installProps.url){
								//module, version, url, auth, enable, registry_url, broker
								await this.installPackageFromUrl(installProps.url, installProps.version, installProps.url, null, true, null, this.broker);
							}else{
								//module, version, label, description, enable, broker
								await this.installPackage(installProps.name, installProps.version, null, null, true, this.broker, process.env.NPM_REGISTRY_URL);
							}
						} catch (error) {
							this.broker.logger.error(`initialPackages: ${packageName}. ${error.message}`);
						}
					}
				}
			}
		},
		addPackages: {
			async handler(ctx){
				const { packages } = ctx.params;
				for(const _package of packages){
					let name = null;
					let options = null;
					if(_.isString(_package)){
						name = _package;
						options = {}
					}else{
						const { name: _name, ..._options} = _package;
						name = _name;
						options = _options;
					}
					if(!_.has(options, 'static')){
						options.static = true
					}
					loader.appendToPackagesConfig(name, options, 'addPackage')
					await this.installPackagesSyncToMetaData(name);
				}
			}
		},
		getStaticPackageInfo: {
			handler(packageInfo, packageName){
				const _path = packageInfo.path || path.dirname(require.resolve(`${packageName}/package.json`));
				const packageJson = require(`${_path}/package.json`);
				return {
					path: _path,
					version: packageJson.version,
					description: packageJson.description,
					homepage: packageJson.homepage
				}
			}
		},
		getPackageInfo: {
			handler(packageInfo, packageName){
				let packagePath = packageInfo.path || path.dirname(require.resolve(`${packageName}/package.json`));
				if(!path.isAbsolute(packagePath)){
					packagePath = path.resolve(process.cwd(), packagePath)
				}
				const packageJson = require(`${packagePath}/package.json`);
				return {
					version: packageJson.version,
					description: packageJson.description,
					homepage: packageJson.homepage
				}
			}
		},
		installPackagesSyncToMetaData:{
			async handler(packageName){
				//注册本地已安装的steedos packages
				const installPackages = loader.loadPackagesConfig();
				for (const name in installPackages) {
					if (Object.hasOwnProperty.call(installPackages, name) && (packageName && packageName === name || !packageName)) {
						let _packageInfo = installPackages[name];
						if(_packageInfo.static){
							_packageInfo = Object.assign({}, _packageInfo, this.getStaticPackageInfo(_packageInfo, name))
						}else{
							_packageInfo = Object.assign({}, _packageInfo, this.getPackageInfo(_packageInfo, name))
						}
						const metadata = await loader.getPackageMetadata(_packageInfo.path);
						const packageYmlData = loader.getPackageYmlData(_packageInfo.path);
						await this.broker.call(`@steedos/service-packages.install`, {
							serviceInfo: {
								packageYmlData,
								name: name, 
								nodeID: this.broker.nodeID, 
								instanceID: this.broker.instanceID, 
								path: _packageInfo.path,
								local: _packageInfo.local, 
								enable: false, 
								version: _packageInfo.version, 
								description: _packageInfo.description,
								metadata: metadata,
								static: _packageInfo.static,
								homepage: _packageInfo.homepage
							}
						})
					}
				}
			}
		},
		yarnAddPackage: {
			async handler(yarnPackage) {
                const packages = await registry.yarnAddPackage(yarnPackage);
				for (const packageInfo of packages) {
					const packagePath = packageInfo.path;
					loader.appendToPackagesConfig(packageInfo.name, {
						version: packageInfo.version,
						path: util.getPackageRelativePath(process.cwd(), packagePath),
						enable: false
					});
					const metadata = await loader.getPackageMetadata(util.getPackageRelativePath(process.cwd(), packagePath));
					const packageYmlData = loader.getPackageYmlData(packagePath);
					await this.broker.call(`@steedos/service-packages.install`, {
						serviceInfo: Object.assign({}, {
							version: packageInfo.version,
							path: packageInfo.path
						}, {
							packageYmlData: packageYmlData,
							name: packageInfo.name,
							enable: false, 
							nodeID: broker.nodeID, 
							instanceID: broker.instanceID,
							metadata: metadata
						})
					})
				}
            }
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {
		console.log(`created`, "@steedos/service-project")
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		console.log(`started`, "@steedos/service-project")
		const PACKAGE_INSTALL_NODE = process.env.PACKAGE_INSTALL_NODE
		if(PACKAGE_INSTALL_NODE){
			await this.broker.call('metadata.add', {key: `#package_install_node.${this.broker.nodeID}`, data: {nodeID: PACKAGE_INSTALL_NODE}}, {meta: {}}) 
		}
		packages.maintainSystemFiles()
		// 单包路径steedos-app
		try {
			const packagePath = path.join(process.cwd(), 'steedos-app');
			if(fs.existsSync(packagePath)){
				const packageInfo = require(path.join(packagePath, 'package.json'));
				loader.appendToPackagesConfig(`${packageInfo.name}`, {version: packageInfo.version, description: packageInfo.description || '', local: true, path: util.getPackageRelativePath(process.cwd(), packagePath)});
			}
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

		await this.installPackagesSyncToMetaData()
		
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
