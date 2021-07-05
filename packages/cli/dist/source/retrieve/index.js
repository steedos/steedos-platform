"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromServer = void 0;
const auth_1 = require("../../auth");
// const fs = require('fs');
// const os = require('os');
// const path = require("path");
// const chalk= require('chalk');
// const request = require('request');
// const yaml = require('js-yaml');
// const _ = require('underscore');
const validator = require('validator');
/**
 *
 * @param reqYml 请求的yml文件(base64)
 * @param callback
 */
function getFromServer(reqYml, callback) {
    auth_1.authRequest('/api/metadata/retrieve', {
        method: "GET",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        form: {
            yml: reqYml,
        }
    }, function (error, response, body) {
        if (error) {
            console.error('Error: ', error.message);
        }
        else if (response && response.statusCode && response.statusCode != 200) {
            if (response.statusCode == 401) {
                console.error('Error: Please run command, steedos source:config');
            }
            else {
                console.error(body);
            }
        }
        else {
            const isBase64 = validator.isBase64(body);
            // console.log("isBase64",isBase64);
            if (!isBase64) {
                console.error('Error: metadata-api not detected, enable metadata-api first');
            }
            else {
                var zipBuffer = Buffer.from(body, 'base64');
                callback(zipBuffer);
            }
        }
    });
}
exports.getFromServer = getFromServer;
//# sourceMappingURL=index.js.map