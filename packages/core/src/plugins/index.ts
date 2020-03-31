import { JsonMap } from '@salesforce/ts-types';

let tryFetchPluginsInfo: Function;

tryFetchPluginsInfo = function (name: string, ref: JsonMap) {
    try {
        let json = require(`${name}/package.json`);
        if(json && ref){
            ref[`${name}`] = {
                version: json.version
            };
        }
    } catch (_error) {
    }
};

/**
 * 返回各个主要插件的版本号信息
 */
export function getPlugins(): JsonMap {
    let results: JsonMap = {};
    tryFetchPluginsInfo("@steedos/core", results);
    tryFetchPluginsInfo("@steedos/objectql", results);
    tryFetchPluginsInfo("@steedos/accounts", results);
    tryFetchPluginsInfo("@steedos/steedos-plugin-workflow", results);
    return results;
}