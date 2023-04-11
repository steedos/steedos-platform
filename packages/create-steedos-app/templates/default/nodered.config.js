"use strict";
require('dotenv-flow').config({});
const path = require('path');
const lodash = require('lodash');

// Node-Red Configuration
// https://nodered.org/docs/user-guide/runtime/configuration
const appName = process.env.NODE_RED_STORAGE_APP_NAME || 'default'
module.exports = {
    flowFile: path.join(__dirname,'flows', `${appName}.json`),
    flowFilePretty: true,
    credentialSecret: process.env.NODERED_CREDENTIAL_SECRET || 'steedos',
    nodesDir: path.join(__dirname,'nodes'),
    userDir: path.join(__dirname,'.node-red'),
    functionGlobalContext: {
        _: lodash
    }    // enables global context
};
