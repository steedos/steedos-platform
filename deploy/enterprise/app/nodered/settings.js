"use strict";
const path = require('path');
const fs = require('fs');
const lodash = require('lodash');

// Node-Red Configuration
// https://nodered.org/docs/user-guide/runtime/configuration

const uiPort = process.env.NODERED_PORT || "1880";
const storageDir = path.join(process.env.STEEDOS_STORAGE_DIR, "data", "nodered");

const flowFilePath = path.join(storageDir, 'flows.json');
const templateFlowFilePath = path.join(__dirname, 'flows-template.json'); // 模板文件路径

// 检查并复制模板文件
if (!fs.existsSync(flowFilePath)) {
    console.log(`flows.json 文件不存在，从模板文件复制: ${templateFlowFilePath} 到 ${flowFilePath}`);
    fs.copyFileSync(templateFlowFilePath, flowFilePath);
}

module.exports = {
    flowFile: path.join(storageDir,'flows.json'),
    flowFilePretty: true,
    credentialSecret: process.env.NODERED_CREDENTIAL_SECRET || 'steedos',
    userDir: path.join(storageDir, '.node-red'),
    functionGlobalContext: {
        lodash
    },
    uiPort,
    httpStatic: path.join(__dirname, 'public'),
    httpRoot: "/nodered/"
};
