/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @Description: 
 */
// import { getAllPackages, uncompressPackages } from '@steedos/metadata-core';
import * as _ from 'underscore';
import { syncMatchFiles } from '../';
// import * as path from 'path';
const path = require("path");
// import { getSteedosSchema, loadService } from '@steedos/objectql';


function clearRequireCache(filename) {
    /* istanbul ignore next */
    Object.keys(require.cache).forEach(function (key) {
        if (key == filename) {
            delete require.cache[key];
        }
    });
};

function loadService(broker, filename){
    clearRequireCache(filename);
    return broker.loadService(filename);
}


export async function loadPackage(packagePath){
    // let schema = getSteedosSchema();
    let broker = global['broker']; //schema.broker;
    if(broker){
        const filePatten = [
          path.join(packagePath, "**", "package.service.js"),
          "!" + path.join(packagePath, "**", "node_modules"),
        ];
        const matchedPaths:[string] = syncMatchFiles(filePatten);
        for await (const serviceFilePath of matchedPaths) {
            const service = loadService(broker, serviceFilePath);
            if (!broker.started) { //如果broker未启动则手动启动service
                broker._restartService(service)
            }
        }
    }
}