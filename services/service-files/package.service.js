/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-08 09:38:56
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-09-09 16:48:46
 * @Description: 
 */
"use strict";
// @ts-check

const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const Fiber = require('fibers')

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
		health: {
			async handler() {
				return 'ok'
			}
		},
		/**
		 * 获取附件数据，调用示例：
		 * const fileData = await this.broker.call('~packages-@steedos/service-files.getFileById', {
				fileId: fileId
			})
			const buffer = Buffer.from(fileData)
		 */
		getFileById: {
			params: {
				fileId: {
					type: 'string'
				}
			},
			async handler(ctx) {
				const { fileId } = ctx.params
				// console.log('>'.repeat(20), 'getFileById', fileId)
				return await new Promise(function (resolve, reject) {
					Fiber(function () {
						try {
							let file = cfs.files.findOne(fileId);
							if (file) {
								var stream = file.createReadStream('files');
								var chunks = [];
								stream.on('data', function (chunk) {
									return chunks.push(chunk);
								});
								stream.on('end', async function () {
									try {
										let stream = Buffer.concat(chunks);
										resolve(stream);
									} catch (error) {
										reject(error);
									}
								});
							}

						} catch (error) {
							reject(error);
						}
					}).run();
				})
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
		// 如果STEEDOS_CFS_DOWNLOAD_PUBLIC为空则默认为avatars
		if (!process.env.STEEDOS_CFS_DOWNLOAD_PUBLIC) {
			process.env.STEEDOS_CFS_DOWNLOAD_PUBLIC = 'avatars';
		}
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
