"use strict";
const chalk = require('chalk');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const createHash = require('crypto').createHash;
const steedosLicense = require("@steedos/license");
const objectql = require('@steedos/objectql');
// const randomstring = require("randomstring");
const project = require('./package.json');
const packageName = project.name;

module.exports = {
	name: packageName,
	namespace: "steedos",
	settings: {
		STEEDOS_CLOUD_URL: process.env.STEEDOS_CLOUD_URL ? process.env.STEEDOS_CLOUD_URL : 'https://console.steedos.cn',
		STEEDOS_CLOUD_SPACE_ID: process.env.STEEDOS_CLOUD_SPACE_ID,
		STEEDOS_CLOUD_API_KEY: process.env.STEEDOS_CLOUD_API_KEY
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

	},
	events: {
		'steedos-server.started': async function (ctx) {
			// console.log(chalk.blue('steedos-server.started'));
			const settings = this.settings;
			const spaceObj = objectql.getObject('spaces');
			// 查询库中工作区记录，如果有工作区记录则不初始化
			let spacesCount = await spaceObj.count({});
			if (spacesCount > 0) {
				return;
			}

			console.log(chalk.blue('开始初始化工作区'));

			// 配置主控地址
			const consoleUrl = settings.STEEDOS_CLOUD_URL;
			if (!consoleUrl) {
				console.log(chalk.red('请配置主控地址'));
				return;
			}

			// 初始化工作区数据
			// 获取环境变量中工作区信息
			const spaceId = settings.STEEDOS_CLOUD_SPACE_ID;
			const apiKey = settings.STEEDOS_CLOUD_API_KEY;

			if (!spaceId || !apiKey) {
				console.log(chalk.red('请配置环境变量STEEDOS_CLOUD_SPACE_ID和STEEDOS_CLOUD_API_KEY。'));
				return;
			}

			// 调用接口获取初始化信息
			const { spaceName, adminName, adminPhone, adminPassword } = await this.getInitInfo(spaceId, apiKey, consoleUrl);

			if (!spaceName || !adminName || !adminPhone) {
				console.log(chalk.red('缺少初始化工作区信息 工作区名称、管理员姓名、管理员手机号，请检查'));
				return;
			}

			// 新建数据
			const userObj = objectql.getObject('users');
			const comapnyObj = objectql.getObject('company');
			const orgObj = objectql.getObject('organizations');
			const spaceUserObj = objectql.getObject('space_users');
			const apiKeysObj = objectql.getObject('api_keys');
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
					username: adminPhone, // 用户名使用手机号赋值，用于用户登录
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

				// 给工作区添加许可证，调用导入许可证接口
				await this.actions.saveLicenses({ spaceId, apiKey, consoleUrl }, { parentCtx: ctx });

				try {
					await ctx.broker.call('~packages-project-server.installPurchasedPackages', {}, {
						meta: {
							user: {
								is_space_admin: true
							}
						}
					});
				} catch (error) {
					console.error(`工作区初始化失败：installPurchasedPackages error`, error)
				}

				console.log(chalk.blue('工作区初始化完毕'));

			} catch (error) {
				console.log(chalk.red('工作区初始化失败：'));
				console.log(error);
				let users = await userObj.find({ filters: [['mobile', '=', adminPhone]] });
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
					await this.actions.saveLicenses({ spaceId, apiKey, consoleUrl }, { parentCtx: ctx });
					// 同步工作区信息（公司名称、华炎云中api_key字段、api_key不存在则创建）
					const { spaceName, adminName, adminPhone, adminPassword } = await this.getInitInfo(spaceId, apiKey, consoleUrl);
					const spaceObj = objectql.getObject('spaces');
					const apiKeysObj = objectql.getObject('api_keys');
					await spaceObj.directUpdate(spaceId, { name: spaceName, api_key: apiKey });
					const apiKeyCount = await apiKeysObj.count({ filters: [ ['api_key', '=', apiKey] ] });
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
		}
	}
}