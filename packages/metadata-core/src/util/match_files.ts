/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-15 17:45:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 09:39:58
 * @Description: 
 */
const globby = require('globby');
const crypto = require('crypto')
const fs = require("fs");

export const syncMatchFiles = (patterns: string[], options: any = {}) => {
    return globby.sync(patterns.map((pattern)=>{ return pattern.replace(/\\/g, "/")}), options);
}

export function getMD5(data){
    let md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
}

export function loadJSONFile(filePath: string){
    return JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
}

export function clearRequireCache(filename) {
    /* istanbul ignore next */
    Object.keys(require.cache).forEach(function (key) {
        if (key == filename) {
            delete require.cache[key];
        }
    });
};

export function JSONStringify(data) {
    return JSON.stringify(data, function (key, val) {
        if (typeof val === 'function') {
            return val + '';
        }
        return val;
    })
}