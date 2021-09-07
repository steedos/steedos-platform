"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolderRecursive = void 0;
const fs = require('fs');
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
exports.deleteFolderRecursive = deleteFolderRecursive;
//# sourceMappingURL=rm_dir.js.map