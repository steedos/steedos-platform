"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToServer = void 0;
const auth_1 = require("../../auth");
/**
 *
 * @param base64 打包好的zip文件，内含一个package.json
 */
function sendToServer(base64) {
    auth_1.authRequest('/api/metadata/deploy', {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        form: {
            file: base64
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
            console.info(body);
        }
    });
}
exports.sendToServer = sendToServer;
//# sourceMappingURL=index.js.map