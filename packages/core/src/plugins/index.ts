import { JsonMap } from '@salesforce/ts-types';
import { Plugins } from '../init/plugins';

let tryFetchPluginsInfo: Function;

tryFetchPluginsInfo = function (name: string, ref: JsonMap, plugins: Array<string>, skipPluginsCheck: boolean) {
    try {
        if(!skipPluginsCheck && plugins.indexOf(name) < 0){
            return;
        }
        let json = require(`${name}/package.json`);
        if(json && ref){
            ref[`${name}`] = {
                version: json.version
            };
        }
    } catch (_error) {
    }
};


const fetchPlugins = function (names: Array<string>, ref: JsonMap) {
    const settingsPlugins = Plugins.getPluginNames();
    const skipPlugins = ["@steedos/core", "@steedos/objectql"];
    names.forEach(name => {
        tryFetchPluginsInfo(name, ref, settingsPlugins, skipPlugins.indexOf(name) > -1);
    });
};

/**
 * 返回各个主要插件的版本号信息
 */
export function getPlugins(): JsonMap {
    let results: JsonMap = {};
    const plugins = [
        "@steedos/core",
        "@steedos/objectql",
        "@steedos/accounts",
        "@steedos/steedos-plugin-workflow",
        "@steedos/plugin-jsreport",
        "@steedos/plugin-stimulsoft-report"];
    fetchPlugins(plugins, results);
    return results;
}