"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequest = void 0;
const request = require('request');
const _ = require('underscore');
const metadata_core_1 = require("@steedos/metadata-core");
metadata_core_1.loadENV();
function authRequest(url, requestOptions, requestCallback) {
    var metadataURL = metadata_core_1.getMetaDataUrl();
    requestOptions.url = `${metadataURL}${url}`;
    // requestOptions.form.space = getMetaDataSpaceId();
    if (!_.has(requestOptions, 'headers')) {
        requestOptions.headers = {};
    }
    if (!_.has(requestOptions.headers, 'Authorization')) {
        requestOptions.headers["Authorization"] = metadata_core_1.getAPIAuthorization();
    }
    return request(requestOptions, requestCallback);
}
exports.authRequest = authRequest;
//# sourceMappingURL=index.js.map