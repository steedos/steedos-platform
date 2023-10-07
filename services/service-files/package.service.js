/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-08 09:38:56
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-07 18:04:23
 * @Description: 
 */
"use strict";
// @ts-check

const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const Fiber = require('fibers')

const path = require('path')
const os = require('os')
const fs = require('fs')
const hexoid = require('hexoid')
const toHexoId = hexoid(25)
const FileType = require('file-type');
const {
	getCollection,
	File,
} = require('./main/default/manager');

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
		},

		/**
		 * 上传文件，调用示例：
		 * const stream = fs.createReadStream(filepath);
			const fileDoc = await this.broker.call('~packages-@steedos/service-files.uploadCollectionFile', stream, {
				meta: {
					filename, // 文件名
					owner // 所有者ID
				}
			})
		 */
		uploadCollectionFile: {
			async handler(ctx) {
				return await new Promise(function (resolve, reject) {
					try {
						const stream = ctx.params
						const { filename, owner } = ctx.meta
						// console.log('>'.repeat(20), 'uploadCollectionFile:', filename)
						if (!filename || !owner) {
							throw new Error('need filename and owner')
						}

						// 存成临时文件
						const tempFilename = toHexoId();
						const tempFilepath = path.join(path.resolve(os.tmpdir()), tempFilename)
						// console.log(require('chalk').red(tempFilepath))
						const tempWS = fs.createWriteStream(tempFilepath);
						stream.pipe(tempWS);

						tempWS.on('finish', async () => {
							// console.log('All writes are now complete.');
							const fileStats = fs.statSync(tempFilepath)

							const FS_COLLECTION_NAME = "files";
							const DB_COLLECTION_NAME = `cfs.${FS_COLLECTION_NAME}.filerecord`;
							const collection = await getCollection(DB_COLLECTION_NAME);

							const mimeInfo = await FileType.fromFile(tempFilepath)
							const mimetype = mimeInfo.mime
							const newFile = new File({
								name: filename,
								size: fileStats.size,
								mimetype,
								fsCollectionName: FS_COLLECTION_NAME
							});

							newFile.metadata = {
								owner
							};
							// 保存文件
							newFile.save(tempFilepath, async function (err, result) {
								if (err) {
									reject(err)
									return;
								}

								await collection.insertOne(newFile.insertDoc());

								const fileDoc = await collection.findOne({ _id: newFile.id });
								resolve(fileDoc);
							})
						});


					} catch (error) {
						reject(error);
					}
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
