/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-17 18:20:11
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { DbManager } = require('./lib/util/dbManager')
const { jsonToDb } = require('./lib/metadata/deploy/jsonToDb')
const { deleteFolderRecursive } = require('@steedos/metadata-core')
const { loadFileToJson } = require('./lib/metadata/deploy/fileToJson')
const {
  getMetadataTypeInfo, getMetadataTypeInfos
} = require("@steedos/metadata-core");
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
                const { fileBase64, packageInfo = {} } = ctx.params
                const userSession = ctx.meta.user
                return await this.deploy(fileBase64, userSession, packageInfo)
            }
        },
        remove: {
            async handler(ctx) {
                const { name } = ctx.params
                const userSession = ctx.meta.user
                return await this.remove(name, userSession)
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

        deploy: async function (fileBase64, userSession, packageInfo) {
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

            var dbManager = new DbManager(userSession, packageInfo);
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

                for (const metadataName in SteedosPackage) {
                    const metadataItems = SteedosPackage[metadataName];
                    for (const metadataItemName in metadataItems) {
                    const metadataTypeInfo = getMetadataTypeInfo(metadataName);
                    const metadataItem = metadataItems[metadataItemName];
                    await global?.broker.call(`b6-metadata.updated`, {
                        type: metadataTypeInfo.tableName,
                        id: metadataItemName,
                        data: metadataItem,
                    });
                    } 
                }

                if(packageInfo && packageInfo.name){
                    const dbPackage = await dbManager.findOne('steedos_packages', { name: packageInfo.name });
                    if(dbPackage){
                        await dbManager.update('steedos_packages', dbPackage._id, packageInfo);
                    }else{
                        await dbManager.insert('steedos_packages', packageInfo);
                    }
                }

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
        },
        remove: async function (packageName, userSession) {
            const transactionOptions = {
                readPreference: 'primary',
                readConcern: { level: 'majority' },
                writeConcern: { w: 'majority' }
            };
            const dbManager = new DbManager(userSession);
            try {
                await dbManager.connect();
                var session = await dbManager.startSession();
                await session.withTransaction(async () => {
                    const typeInfos = getMetadataTypeInfos();
                    for (const tName in typeInfos) {
                        const typeInfo = typeInfos[tName];
                        console.log('deleteMany', tName, typeInfo.tableName, {package_name: packageName})
                        if(typeInfo.tableName){
                            await dbManager.deleteMany(typeInfo.tableName, {package_name: packageName});
                        }
                    }

                    for(const tName of ['process_definition', 'action_field_updates', 'workflow_notifications', 'process_instance', 'process_node', 'flow_roles', 'roles']){
                        await dbManager.deleteMany(tName, {package_name: packageName});
                    }

                    await dbManager.delete('steedos_packages', { name: packageName });

                }, transactionOptions)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                console.log(err)
            } finally {
                await dbManager.endSession();
                await dbManager.close();
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

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
