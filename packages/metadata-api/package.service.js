/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-10-11 16:39:42
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-meteor-package-loader');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { DbManager } = require('./lib/util/dbManager')
const { jsonToDb } = require('./lib/metadata/deploy/jsonToDb')
const { deleteFolderRecursive } = require('@steedos/metadata-core')
const { loadFileToJson } = require('./lib/metadata/deploy/fileToJson')
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
            path: path.join(__dirname, 'lib')
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

        deploy: {
            async handler(ctx) {
                const { fileBase64 } = ctx.params
                const userSession = ctx.meta.user
                return await this.deploy(fileBase64, userSession)
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

        deploy: async function (fileBase64, userSession) {
            const dataBuffer = Buffer.from(fileBase64, 'base64');

            var tempDFolder = path.join(os.tmpdir(), "steedos-dx");

            if (!fs.existsSync(tempDFolder)) {
                fs.mkdirSync(tempDFolder);
            }

            var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "steedos-dx", 'upload-'));

            var zipDir = path.join(tempDir, 'deploy.zip');

            fs.writeFileSync(zipDir, dataBuffer);
            var resMsg = {
                status: 0,
                msg: '',
            };

            var dbManager = new DbManager(userSession);
            try {
                let SteedosPackage = await loadFileToJson(tempDir);

                var isEmptyPackage = true;
                for (const metadataName in SteedosPackage) {
                    const metadata = SteedosPackage[metadataName];
                    for (const key in metadata) {
                        if (metadata[key]) {
                            isEmptyPackage = false;
                            break;
                        }
                    }
                }
                if (isEmptyPackage) {
                    throw new Error('data not found in package');
                }

                await dbManager.connect();
                var session = await dbManager.startSession();
                await jsonToDb(SteedosPackage, dbManager, session);

                resMsg.status = 0;
                resMsg.msg = "deploy success!";

            } catch (err) {
                resMsg.status = -1;
                resMsg.msg = err.message;
            } finally {
                await dbManager.endSession();
                await dbManager.close();
            }

            deleteFolderRecursive(tempDir);

            return resMsg;
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

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
