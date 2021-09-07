"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFile = void 0;
const fs = require('fs');
const yaml = require('js-yaml');
const clone = require('clone');
const path = require('path');
function loadFile(filePath) {
    let json = {};
    try {
        let extname = path.extname(filePath);
        if (extname.toLocaleLowerCase() === '.json')
            json = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
        else if (extname.toLocaleLowerCase() === '.yml')
            json = yaml.load(fs.readFileSync(filePath, 'utf8'));
        else if (extname.toLocaleLowerCase() === '.js')
            json = clone(require(filePath));
    }
    catch (error) {
        console.error('loadFile error', filePath, error);
    }
    return json;
}
exports.loadFile = loadFile;
;
//# sourceMappingURL=load_file.js.map