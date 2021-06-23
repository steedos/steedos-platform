"use strict";

const pkg = require('@steedos/mongodb-memory-server-core');
const { MongoMemoryReplSet } = pkg;
const path = require('path');
const fs = require('fs');
const dbDirectoryName = 'db';

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: "mongodb-server",

    /**
     * Settings
     */
    settings: {

        debug: process.env.MONGO_DEBUG || false,
        downloadMirror: 'https://www-steedos-com.oss-cn-beijing.aliyuncs.com/steedos/platform/bin/mongodb',

        port: process.env.MONGO_PORT || 27018,
        dbPath: process.env.MONGO_DBPATH || path.join(process.cwd(), dbDirectoryName),

        binary: {
            version: '4.2.11',
            downloadDir: path.join(process.cwd(), 'bin/mongodb'),
        },

        replSet: {
            name: 'rsSteedos',
            auth: false,
            args: ['--bind_ip_all'],
            count: 1,
            dbName: 'steedos',
            ip: 'localhost',
            oplogSize: 1,
            spawn: {},
            storageEngine: 'wiredTiger'
        },

        autoStart: true,

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {

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
        startMongo: async function () {
            process.env.MONGOMS_DEBUG = this.settings.debug;
            process.env.MONGOMS_DOWNLOAD_MIRROR = this.settings.downloadMirror;

            this.settings.instanceOpts = [
                {
                    port: this.settings.port,
                    dbPath: this.settings.dbPath,
                },
            ];

            if (!fs.existsSync(this.settings.dbPath)) {
                fs.mkdirSync(this.settings.dbPath);
            }

            this.logger.warn(`MongoDB port: ${this.settings.port}`);
            this.logger.warn(`MongoDB db path: ${this.settings.dbPath}`);

            this.mongod = await MongoMemoryReplSet.create(this.settings);
            this.settings.url = this.mongod.getUri();
            this.settings.oplogUrl = `mongodb://localhost:${this.settings.port}/local`;
            process.env.MONGO_OPLOG_URL = this.settings.oplogUrl
            process.env.MONGO_URL = this.settings.url;
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {

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
        await this.mongod.stop();
    }
};
