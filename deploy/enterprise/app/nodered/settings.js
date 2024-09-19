"use strict";
const path = require('path');
const lodash = require('lodash');

// Node-Red Configuration
// https://nodered.org/docs/user-guide/runtime/configuration

process.env.PORT = 3200;

const storageDir = path.join(process.env.STEEDOS_STORAGE_DIR, "data", "node-red");

module.exports = {
    flowFile: path.join(storageDir,'flows.json'),
    flowFilePretty: true,
    credentialSecret: process.env.NODERED_CREDENTIAL_SECRET || 'steedos',
    userDir: path.join(storageDir, '.node-red'),
    functionGlobalContext: {
        lodash
    },
    httpStatic: path.join(__dirname, 'public'),
};
