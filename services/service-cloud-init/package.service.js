"use strict";
const chalk = require('chalk');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const createHash = require('crypto').createHash;
const steedosLicense = require("@steedos/license");
const objectql = require('@steedos/objectql');
const fs = require('fs')
const path = require('path')
const ini = require('ini')
const randomstring = require("randomstring");
const project = require('./package.json');
const packageName = project.name;
const validator = require('validator');

let Initializing = false;

function saveLocalEnv(localEnv) {
	var localEnvPath = getLocalEnvPath()
	fs.writeFileSync(localEnvPath, ini.stringify(localEnv));
}
function getLocalEnv() {
	var localEnvPath = getLocalEnvPath()
	var localEnv = {}
	try {
		var fileBuffer = fs.readFileSync(localEnvPath, 'utf-8');
		localEnv = ini.parse(fileBuffer);
	} catch (err) {

	}
	return localEnv;
}

const PROFILE_FILENAME = '.env.local'
function getLocalEnvPath() {
	var projectPath = process.cwd();
	var profileFilepath = path.join(projectPath, PROFILE_FILENAME);
	return profileFilepath
}

module.exports = {
	name: packageName,
	namespace: "steedos",
	settings: {
		STEEDOS_HELP_URL: process.env.STEEDOS_HELP_URL ? process.env.STEEDOS_HELP_URL : 'https://www.steedos.com',
		STEEDOS_TENANT_ENABLE_ACTIVATION: validator.toBoolean(process.env.STEEDOS_TENANT_ENABLE_ACTIVATION || 'false', true),
		// 通过云端中控初始化本地服务
		STEEDOS_CLOUD_URL: process.env.STEEDOS_CLOUD_URL ? process.env.STEEDOS_CLOUD_URL : 'https://console.steedos.cn',
		STEEDOS_CLOUD_SPACE_ID: process.env.STEEDOS_CLOUD_SPACE_ID,
		STEEDOS_CLOUD_API_KEY: process.env.STEEDOS_CLOUD_API_KEY,
		// 通过环境变量初始化本地服务
		STEEDOS_INITIAL_USERNAME: process.env.STEEDOS_INITIAL_USERNAME,
		STEEDOS_INITIAL_PASSWORD: process.env.STEEDOS_INITIAL_PASSWORD,
		STEEDOS_INITIAL_NAME: process.env.STEEDOS_INITIAL_NAME,               // 可选，未配置时默认为用户名
		STEEDOS_INITIAL_EMAIL: process.env.STEEDOS_INITIAL_EMAIL,             // 可选
		STEEDOS_INITIAL_MOBILE: process.env.STEEDOS_INITIAL_MOBILE,           // 可选
		STEEDOS_INITIAL_TENANT_ID: process.env.STEEDOS_INITIAL_TENANT_ID,     // 可选，未配置时自动生成
		STEEDOS_INITIAL_TENANT_NAME: process.env.STEEDOS_INITIAL_TENANT_NAME, // 可选，未配置时就是“我的公司”
		STEEDOS_INITIAL_API_KEY: process.env.STEEDOS_INITIAL_API_KEY,         // 可选，未配置时自动生成随机串
	},
	methods: {
		hashAndBcryptPassword: async function (password, algorithm) {
			const hashedPassword = algorithm ? this.hashPassword(password, algorithm) : password;
			return await this.bcryptPassword(hashedPassword);
		},
		hashPassword: function (password, algorithm) {
			if (typeof password === 'string') {
				const hash = createHash(algorithm);
				hash.update(password);
				return hash.digest('hex');
			}

			return password.digest;
		},
		bcryptPassword: async function (password) {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);
			return hash;
		},
		/**
		 * 调用主控接口获取许可证
		 * @param {*} spaceId 
		 * @param {*} apiKey 
		 * @param {*} consoleUrl 
		 */
		getLicenses: async function (spaceId, apiKey, consoleUrl) {
			let result = await axios({
				url: `${consoleUrl}/api/saas/space/init/license/${spaceId}`,
				method: 'get',
				data: {},
				headers: { "Content-Type": "application/json", "Authorization": `Bearer apikey,${apiKey}` }
			});
			if (!result.data.success) {
				throw new Error(result.data.error);
			}
			return result.data.licenses;
		},
		/**
		 * 获取工作区初始化信息
		 * @param {*} spaceId 
		 * @param {*} apiKey 
		 * @param {*} consoleUrl 
		 * @returns 
		 */
		getInitInfo: async function (spaceId, apiKey, consoleUrl) {
			let result = await axios({
				url: `${consoleUrl}/api/saas/trial/application/space/init/info`,
				method: 'post',
				data: {
					cloudSpaceId: spaceId
				},
				headers: { "Content-Type": "application/json", "Authorization": `Bearer apikey,${apiKey}` }
			})
			if (!result.data.success) {
				throw new Error(result.data.error);
			}
			return result.data.info;
		},
		allowInit: async function (spaces) {
			if (spaces && spaces.length > 0) {
				return false;
			}
			// 查询库中工作区记录，如果有工作区记录则不初始化
			const spaceObj = objectql.getObject('spaces');
			let spacesCount = await spaceObj.count({});
			if (spacesCount > 0) {
				return false;
			}
			return true;
		},
		// 初始化工作区
		initSpace: async function ({ spaceName, spaceId, adminUsername, adminName, adminPhone, adminPassword, adminEmail, apiKey }) {
			// 新建数据
			const userObj = objectql.getObject('users');
			const comapnyObj = objectql.getObject('company');
			const orgObj = objectql.getObject('organizations');
			const spaceUserObj = objectql.getObject('space_users');
			const apiKeysObj = objectql.getObject('api_keys');
			const spaceObj = objectql.getObject('spaces');
			const now = new Date();

			try {
				// 用户
				const userId = await userObj._makeNewID();
				// const userPassword = randomstring.generate(7);
				const baseInfo = {
					owner: userId,
					created: now,
					modified: now,
					created_by: userId,
					modified_by: userId
				};
				const userNewDoc = {
					_id: userId,
					name: adminName,
					mobile: adminPhone,
					username: adminUsername,
					email: adminEmail,
					locale: 'zh-cn',
					services: {
						password: {
							bcrypt: await this.hashAndBcryptPassword(adminPassword, 'sha256')
						}
					},
					steedos_id: userId,
					...baseInfo
				};
				await userObj.directInsert(userNewDoc);
				// 工作区
				await spaceObj.insert({
					_id: spaceId,
					space: spaceId,
					name: spaceName,
					admins: [userId],
					api_key: apiKey,
					...baseInfo
				})
				// 默认不开启自助注册
				await spaceObj.directUpdate(spaceId, { enable_register: false });

				const apiKeyCount = await apiKeysObj.count({ filters: [['api_key', '=', apiKey]] })
				if (apiKeyCount == 0) {
					// 生成管理员的api_keys
					const newApiKeyDoc = {
						_id: apiKey,
						name: 'admin api key',
						api_key: apiKey,
						active: true,
						space: spaceId,
						...baseInfo
					};
					await apiKeysObj.insert(newApiKeyDoc);
				}

				// 给工作区添加许可证，调用导入许可证接口
				// await this.actions.saveLicenses({ spaceId, apiKey, consoleUrl }, { parentCtx: ctx });

				try {
					await this.broker.call('~packages-project-server.installPurchasedPackages', {}, {
						meta: {
							user: {
								is_space_admin: true
							}
						}
					});
				} catch (error) {
					console.error(`工作区初始化失败：installPurchasedPackages error`, error)
				}

				this.broker.emit("service-cloud-init.succeeded");

				console.log(chalk.blue('工作区初始化完毕'));

			} catch (error) {
				let users = await userObj.find({ filters: [['username', '=', adminUsername]] });
				for (const doc of users) {
					await userObj.directDelete(doc._id);
				}
				await spaceObj.directDelete(spaceId);
				let spaceFilters = { filters: [['space', '=', spaceId]] };
				let companyDocs = await comapnyObj.directFind(spaceFilters);
				for (const doc of companyDocs) {
					await comapnyObj.directDelete(doc._id);
				}
				let orgDocs = await orgObj.directFind(spaceFilters);
				for (const doc of orgDocs) {
					await orgObj.directDelete(doc._id);
				}
				let spaceUserDocs = await spaceUserObj.directFind(spaceFilters);
				for (const doc of spaceUserDocs) {
					await spaceUserObj.directDelete(doc._id);
				}
				let apiKeyDocs = await apiKeysObj.directFind(spaceFilters);
				for (const doc of apiKeyDocs) {
					await apiKeysObj.directDelete(doc._id);
				}
				console.log(error);
				throw new Error(`工作区初始化失败：${error.message}`);
			}
		},
		// 从云端初始化
		initSteedosFromCloud: async function (spaceId, apiKey) {
			console.log(chalk.blue('开始初始化工作区'));
			// 配置主控地址
			const consoleUrl = this.settings.STEEDOS_CLOUD_URL;
			if (!consoleUrl) {
				throw new Error('请配置主控地址');
			}
			// 初始化工作区数据
			if (!spaceId || !apiKey) {
				throw new Error('请配置环境变量STEEDOS_CLOUD_SPACE_ID和STEEDOS_CLOUD_API_KEY。');
			}
			// 调用接口获取初始化信息
			let spaceName, adminName, adminPhone, adminPassword, adminEmail;
			try {
				const info = await this.getInitInfo(spaceId, apiKey, consoleUrl);
				spaceName = info.spaceName;
				adminName = info.adminName;
				adminPhone = info.adminPhone;
				adminPassword = info.adminPassword;
				adminEmail = info.adminEmail
			} catch (error) {
				throw new Error('初始化参数错误，请重新配置');
			}

			if (!spaceName || !adminName) {
				throw new Error('缺少初始化工作区信息 工作区名称、管理员姓名，请检查');
			}
			const initInfo = {
				spaceName: spaceName,
				spaceId: spaceId,
				adminUsername: adminPhone || '',
				adminName: adminName,
				adminPhone: adminPhone || '',
				adminPassword: adminPassword,
				adminEmail: adminEmail || '',
				apiKey: apiKey
			}
			await this.initSpace(initInfo)
		},
		// 从环境变量初始化
		initSteedos: async function ({ iUsername, iPassword, iName, iEmail, iMobile, iTenantID, iTenantName, iApiKey }) {
			console.log(chalk.blue('开始初始化工作区'));
			// 校验用户名格式
			if (iUsername && !/^[A-Za-z0-9-_.\u00C0-\u017F\u4e00-\u9fa5]+$/.test(iUsername)) {
				throw new Error(`用户名 ${iUsername} 格式错误，用户名支持字母、数字、减号(-)、点(.)、下划线(_)及中文，请确认。`)
			}
			// 校验邮箱格式
			if (iEmail && !validator.isEmail(iEmail)) {
				throw new Error(`邮箱 ${iEmail} 格式错误，请确认。`)
			}
			// 校验手机号格式
			if (iMobile && !validator.isMobilePhone(iMobile)) {
				throw new Error(`手机号 ${iMobile} 格式错误，请确认。`)
			}
			// 校验tenantid格式
			if (iTenantID) {
				if (!/^[a-zA-Z0-9]+$/.test(iTenantID) || (iTenantID.length != 17 && iTenantID.length != 24)) {
					throw new Error(`魔方ID ${iTenantID} 格式错误，魔方ID值由字母、数字组成且长度为17或24。`)
				}
			}
			// 校验apikey格式
			if (iApiKey && (!/^[a-zA-Z0-9-_]+$/.test(iApiKey) || (iApiKey.length != 43))) {
				throw new Error(`ApiKey ${iApiKey} 格式错误，ApiKey由字母、数字组成且长度为43。`)
			}
			const spaceObj = objectql.getObject('spaces')
			const initInfo = {
				spaceName: iTenantName || '我的公司',
				spaceId: iTenantID || (await spaceObj._makeNewID()),
				adminUsername: iUsername,
				adminName: iName || iUsername,
				adminPhone: iMobile || '',
				adminPassword: iPassword,
				adminEmail: iEmail || '',
				apiKey: iApiKey || randomstring.generate(43)
			}
			await this.initSpace(initInfo)
		},
		initProject: async function (ctx) {
			// 获取环境变量中工作区信息
			const {
				STEEDOS_CLOUD_SPACE_ID: spaceId,
				STEEDOS_CLOUD_API_KEY: apiKey,

				STEEDOS_INITIAL_USERNAME: iUsername,
				STEEDOS_INITIAL_PASSWORD: iPassword,
				STEEDOS_INITIAL_NAME: iName,
				STEEDOS_INITIAL_EMAIL: iEmail,
				STEEDOS_INITIAL_MOBILE: iMobile,
				STEEDOS_INITIAL_TENANT_ID: iTenantID,
				STEEDOS_INITIAL_TENANT_NAME: iTenantName,
				STEEDOS_INITIAL_API_KEY: iApiKey,
			} = this.settings;

			if (spaceId && apiKey) {
				// 从云端初始化
				await this.initSteedosFromCloud(spaceId, apiKey)
			}
			else if (iUsername && iPassword) {
				// 从环境变量初始化
				await this.initSteedos({ iUsername, iPassword, iName, iEmail, iMobile, iTenantID, iTenantName, iApiKey })
			}

		}
	},
	events: {
		'steedos-server.started': async function (ctx) {
			// console.log(chalk.blue('steedos-server.started'));
			const records = await objectql.getObject('spaces').directFind({ top: 1, fields: ['_id'], sort: { created: -1 } });
			const steedosConfig = objectql.getSteedosConfig();

			if (records.length > 0) {
				steedosConfig.setTenant({ _id: records[0]._id });
			} else {
				steedosConfig.setTenant({ enable_create_tenant: true, enable_register: true });
			}
			const allowInit = await this.allowInit(records);
			if (!allowInit) {
				Initializing = false;
				return;
			}
			Initializing = true;
			try {
				await this.initProject(ctx);
			} catch (error) {
				console.log(error)
				console.log(chalk.red(error.message));
			} finally {
				try {
					await ctx.broker.call('~packages-project-server.initialPackages', {}, {});
				} catch (error) {
					console.error(`工作区初始化失败：installPurchasedPackages error`, error)
				} finally {
					Initializing = false;
				}
			}
		}
	},
	actions: {
		manualSyncSpaceLicense: {
			rest: {
				method: "POST",
				path: "/manualSyncSpaceLicense"
			},
			params: {},
			handler: async function (ctx) {
				try {
					// console.log(chalk.blue('manualSyncSpaceLicense...'));
					const settings = this.settings;
					// 配置主控地址
					const consoleUrl = settings.STEEDOS_CLOUD_URL;
					if (!consoleUrl) {
						throw new Error('请配置主控地址环境变量STEEDOS_CLOUD_URL');
					}
					// 获取环境变量中工作区信息
					const spaceId = settings.STEEDOS_CLOUD_SPACE_ID;
					const apiKey = settings.STEEDOS_CLOUD_API_KEY;
					if (!spaceId || !apiKey) {
						throw new Error('请配置环境变量STEEDOS_CLOUD_SPACE_ID和STEEDOS_CLOUD_API_KEY。');
					}
					const userSession = ctx.meta.user;
					const userId = userSession.userId;
					// 给工作区添加许可证，调用导入许可证接口
					// await this.actions.saveLicenses({ spaceId, apiKey, consoleUrl }, { parentCtx: ctx });
					// 同步软件包许可证
					await this.broker.call(`@steedos/service-package-license.syncPackagesLicense`);

					// 同步工作区信息（公司名称、华炎云中api_key字段、api_key不存在则创建）
					const { spaceName, adminName, adminPhone, adminPassword } = await this.getInitInfo(spaceId, apiKey, consoleUrl);
					const spaceObj = objectql.getObject('spaces');
					const apiKeysObj = objectql.getObject('api_keys');
					await spaceObj.directUpdate(spaceId, { name: spaceName, api_key: apiKey });
					const apiKeyCount = await apiKeysObj.count({ filters: [['api_key', '=', apiKey]] });
					if (apiKeyCount == 0) {
						const now = new Date();
						const baseInfo = {
							owner: userId,
							created: now,
							modified: now,
							created_by: userId,
							modified_by: userId
						};
						const newApiKeyDoc = {
							_id: apiKey,
							name: 'admin api key',
							api_key: apiKey,
							active: true,
							space: spaceId,
							...baseInfo
						};
						await apiKeysObj.insert(newApiKeyDoc);
					}
					return { success: true };
				} catch (error) {
					return { success: false, error: error.message };
				}
			}
		},

		saveLicenses: {
			params: {
				spaceId: { type: 'string', optional: false },
				apiKey: { type: 'string', optional: false },
				consoleUrl: { type: 'string', optional: false }
			},
			handler: async function (ctx) {
				const { spaceId, apiKey, consoleUrl } = ctx.params;
				// 给工作区添加许可证，调用导入许可证接口
				const licenses = await this.getLicenses(spaceId, apiKey, consoleUrl);
				for (const license of licenses) {
					const licenseInfo = license.split(',');
					let license_decrypt = steedosLicense.verifyLicenseFile(licenseInfo[0], licenseInfo[1], spaceId);
					if (license_decrypt.verify_error) {
						throw new Error(license_decrypt.verify_error);
					}
					await steedosLicense.save({ license: licenseInfo[0], is_local: license_decrypt.is_local, key: licenseInfo[1], verify_status: license_decrypt.verify_status, verify_error: license_decrypt.verify_erro, license_last_verify: new Date(), _id: license_decrypt._id, product: license_decrypt.product }, spaceId);
				}
			}
		},
		serverInitInfo: {
			handler: async function (ctx) {
				try {
					const settings = this.settings;
					const allowInit = await this.allowInit();
					return {
						allow_init: false, // settings.STEEDOS_TENANT_ENABLE_ACTIVATION && allowInit && !Initializing,
						cloud_url: settings.STEEDOS_CLOUD_URL,
						help_url: `${settings.STEEDOS_HELP_URL}/docs/deploy/deploy-activate`
					};
				} catch (error) {
					return { success: false, error: error.message };
				}
			}
		},
		initServer: {
			rest: {
				method: "POST",
				path: "/initServer"
			},
			handler: async function (ctx) {
				try {
					/**
					 * 1 写入环境变量
					 * 2 调用初始化action
					*/
					const allowInit = await this.allowInit();
					if (!allowInit || Initializing) {
						return { success: true };
					}

					const settings = this.settings;

					Initializing = true;

					//consoleUrl
					const { spaceId, apiKey } = ctx.params;

					settings.STEEDOS_CLOUD_SPACE_ID = spaceId
					settings.STEEDOS_CLOUD_API_KEY = apiKey
					process.env.STEEDOS_CLOUD_SPACE_ID = spaceId
					process.env.STEEDOS_CLOUD_API_KEY = apiKey

					await this.initProject(ctx, spaceId, apiKey);

					var localEnv = getLocalEnv();
					localEnv['STEEDOS_CLOUD_SPACE_ID'] = spaceId;
					localEnv['STEEDOS_CLOUD_API_KEY'] = apiKey;


					localEnv['METADATA_SERVER'] = localEnv['METADATA_SERVER'] || process.env.ROOT_URL;
					localEnv['METADATA_APIKEY'] = localEnv['METADATA_APIKEY'] || apiKey;

					try {
						saveLocalEnv(localEnv);
					} catch (error) {
						// console.error(error);
					}
					Initializing = false;
					return { success: true };
				} catch (error) {
					Initializing = false;
					return { success: false, error: error.message };
				}
			}
		}
	}
}