

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
		STEEDOS_CLOUD_URL: process.env.STEEDOS_CLOUD_URL ? process.env.STEEDOS_CLOUD_URL : 'https://console.steedos.cn',
		STEEDOS_CLOUD_SPACE_ID: process.env.STEEDOS_CLOUD_SPACE_ID,
		STEEDOS_CLOUD_API_KEY: process.env.STEEDOS_CLOUD_API_KEY,
		STEEDOS_REGISTRY_URL: process.env.STEEDOS_REGISTRY_URL ? process.env.STEEDOS_REGISTRY_URL : 'https://registry.steedos.cn/',
		STEEDOS_CLOUD_SYNC_PACKAGES: validator.toBoolean(process.env.STEEDOS_CLOUD_SYNC_PACKAGES || 'false', true),
		STEEDOS_INITIAL_PACKAGES: process.env.STEEDOS_INITIAL_PACKAGES
	},

	/**
	 * Dependencies
	 */
	dependencies: ['~packages-standard-objects'],

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
				const packageConfig = _.find(packages, (_p, pname) => {
					return pname === module;
				})
				if (packageConfig) {
					if (packageConfig.enable) {
						if (packageConfig.local) {
							let packagePath = packageConfig.path;
							if(!path.isAbsolute(packagePath)){
								packagePath = path.resolve(process.cwd(), packagePath)
							}
							await loader.loadPackage(module, packagePath);
							const metadata = await loader.getPackageMetadata(util.getPackageRelativePath(process.cwd(), packageConfig.path));
							await ctx.broker.call(`@steedos/service-packages.install`, {
								serviceInfo: Object.assign({}, Object.assign({}, packageConfig, { name: module }), {
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
                const packageConfig = await loader.disablePackage(module);
				if(packageConfig.path){
					const metadata = await loader.getPackageMetadata(util.getPackageRelativePath(process.cwd(), packageConfig.path));
					await ctx.broker.call(`@steedos/service-packages.install`, {
						serviceInfo: Object.assign({}, packageConfig, {
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
                let packageConfig = await loader.enablePackage(module);
				if(packageConfig.static){
					packageConfig = Object.assign({}, packageConfig, this.getStaticPackageInfo(packageConfig, packageConfig.name))
				}
				const metadata = await loader.getPackageMetadata(util.getPackageRelativePath(process.cwd(), packageConfig.path));
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
			async handler(ctx){
				const installErrors = {};
				const installPackages = [];
				try {
					const user = ctx.meta.user;
					if(!user.is_space_admin){
						throw new Error('not permission!');
					}
					try {
						await this.loginSteedosRegistry();
						console.info(`login steedos registry success`);
					} catch (error) {
						// console.error(`login steedos registry fail: `, error.message);
					}
					const settings = this.settings;
					const syncCloudPackages = settings.STEEDOS_CLOUD_SYNC_PACKAGES;
					let result = null;
					if(syncCloudPackages){
						result = await this.getCloudSaasPurchasedPackages();
					}
					if(result){
						for (const _package of result.packages) {
							try {
								const { name, version, label, description } = _package
								let enable = true; //安装已购买的软件包时先默认启用
								//TODO 处理 registry_url
								// 安装最新版
								const packageInfo = await this.installPackage(name, null, label, description, enable, ctx.broker);
								installPackages.push(packageInfo)
							} catch (error) {
								if(error.stderr){
									installErrors[_package.name] = error.stderr
								}else{
									installErrors[_package.name] = error.message
								}
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
		},
		installPackageFromUrl: {
			async handler(ctx){
				try {
					const user = ctx.meta.user;
					if(!user.is_space_admin){
						throw new Error('not permission!');
					}
					try {
						await this.loginSteedosRegistry();
						console.info(`login steedos registry success`);
					} catch (error) {
						// console.error(`login steedos registry fail: `, error.message);
					}
					let { module, version, url, auth, registry_url } = ctx.params
					const enable = true;
					return await this.installPackageFromUrl(module, version, url, auth, enable, registry_url, ctx.broker)
				} catch (error) {
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
				return await loader.installPackage(broker, {module, version, label, description, enable})
            }
		},
		getCloudSaasPurchasedPackages:{
			async handler() {
				const settings = this.settings;
				const apiKey = settings.STEEDOS_CLOUD_API_KEY || process.env.STEEDOS_CLOUD_API_KEY
				const spaceId = settings.STEEDOS_CLOUD_SPACE_ID || process.env.STEEDOS_CLOUD_SPACE_ID
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
					if(item.product){
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
		},
		installPackageFromUrl: {
			async handler(module, version, url, auth, enable, registry_url, broker) {
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

				const settings = this.settings;
				if (url && url.startsWith(settings.STEEDOS_CLOUD_URL + '/api/pkg/download')) {
					const apiKey = settings.STEEDOS_CLOUD_API_KEY || process.env.STEEDOS_CLOUD_API_KEY
					const spaceId = settings.STEEDOS_CLOUD_SPACE_ID || process.env.STEEDOS_CLOUD_SPACE_ID
					const cloudUrl = settings.STEEDOS_CLOUD_URL

					if (!apiKey || !spaceId || !cloudUrl) {
						throw new Error(`请配置STEEDOS_CLOUD参数`);
					}
					const headers = Object.assign({}, { 'Content-Type': 'application/json' }, { [HEADER_AUTH]: `${AUTH_TYPE} apikey,${apiKey}` });
					const response = await fetch(url, {
						method: 'POST', headers: headers, body: JSON.stringify({ _authToken: auth })
					});

					const result = await response.json();

					if (result.error) {
						throw new Error(`安装失败，软件包URL或认证信息错误`)
					}
					url = `${url}/${result.token}`
					console.log(`url`, url);
				}
				const packagePath = await registry.installModule(module, version, url, registry_url);
				const packageInfo = loader.getPackageInfo(null, packagePath);
				const packageName = packageInfo.name;
				if(enable){
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
				await broker.call(`@steedos/service-packages.install`, {
					serviceInfo: Object.assign({}, packageConfig, {
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
		loginSteedosRegistry: {
			async handler() {
				const settings = this.settings;
				// 配置主控地址
				const consoleUrl = settings.STEEDOS_CLOUD_URL;
				if (!consoleUrl) {
					throw new Error('请配置主控地址');
				}

				// 初始化工作区数据
				// 获取环境变量中工作区信息
				const spaceId = settings.STEEDOS_CLOUD_SPACE_ID || process.env.STEEDOS_CLOUD_SPACE_ID;
				const apiKey = settings.STEEDOS_CLOUD_API_KEY || process.env.STEEDOS_CLOUD_API_KEY;

				if (!spaceId || !apiKey) {
					throw new Error('请配置环境变量STEEDOS_CLOUD_SPACE_ID和STEEDOS_CLOUD_API_KEY。');
				}

				const registryUrl = settings.STEEDOS_REGISTRY_URL

				// 调用接口获取初始化信息
				const { info, scopes } = await this.getSafeScopes(spaceId, apiKey, consoleUrl);
				const { adminPhone } = info;
				if (!adminPhone) {
					throw new Error('缺少工作区信息 工作区名称、管理员姓名、管理员手机号，请检查');
				}
				// let scope = '';
				// if (scopes && scopes.length > 0) {
				// 	scope = scopes[0];
				// }
				await login.loginToRegistry(adminPhone, apiKey, `${adminPhone}@steedos.com`, registryUrl, undefined);
				login.setYarnrcScopes(scopes, registryUrl);
			}
		},
		initialPackages: {
			async handler(){
				const settings = this.settings;
				const packages = settings.STEEDOS_INITIAL_PACKAGES;
				if(_.isString(packages) && packages){
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
								await this.installPackage(installProps.name, installProps.version, null, null, true, this.broker);
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
					loader.appendToPackagesConfig(name, options)
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
				const packageJson = require(`${_path}/package.json`);
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
					if (Object.hasOwnProperty.call(installPackages, name) && (packageName && packageName === name)) {
						let _packageInfo = installPackages[name];
						if(_packageInfo.static){
							_packageInfo = Object.assign({}, _packageInfo, this.getStaticPackageInfo(_packageInfo, name))
						}else{
							_packageInfo = Object.assign({}, _packageInfo, this.getPackageInfo(_packageInfo, name))
						}
						const metadata = await loader.getPackageMetadata(_packageInfo.path);
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
								metadata: metadata,
								static: _packageInfo.static,
								homepage: _packageInfo.homepage
							}
						})
					}
				}
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
		try {
			await this.loginSteedosRegistry();
			console.info(`login steedos registry success`);
		} catch (error) {
			// console.error(`login steedos registry fail: `, error.message);
		}
 
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

		// 新版单包项目加载
		// try {
		// 	if(fs.existsSync(path.join(process.cwd(), 'package.service.js'))){
		// 		const packagePath = process.cwd(); 
		// 		if(fs.existsSync(packagePath)){
		// 			const packageInfo = require(path.join(packagePath, 'package.json'));
		// 			loader.appendToPackagesConfig(`${packageInfo.name}`, {version: packageInfo.version, description: packageInfo.description, local: true, path: util.getPackageRelativePath(process.cwd(), packagePath)});
		// 		}
		// 	}
		// } catch (error) {
		// 	console.log(`started error`, error)
		// }

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
