// import { getAllPackages, uncompressPackages } from '@steedos/metadata-core';
import * as _ from 'underscore';
const globby = require("globby");
// import * as path from 'path';
const path = require("path");
import { getSteedosSchema } from '@steedos/objectql';

// export async function loadPackages() {
//     await uncompressPackages(process.cwd());
//     // const packages = await getAllPackages(process.cwd());
//     // packages.push(path.join(process.cwd(), 'steedos-app'));
//     // _.each(packages, function(filePath: string){
//     //     addAllConfigFiles(path.join(filePath, '**'), null);
//     // })
//     // TODO 重新编写自动加载package的逻辑，应是service方式
//     let schema = getSteedosSchema();
//     let broker = schema.broker;
//     if (broker) {
//         const packages = await getAllPackages(process.cwd());
//         for await (const packagePath of packages) {
//             const filePatten = [
//                 path.join(packagePath, "**", "package.service.js")
//             ]
//             const matchedPaths:[string] = globby.sync(filePatten);
//             for await (const serviceFilePath of matchedPaths) {
//                 const service = broker.loadService(serviceFilePath);
//                 if (!broker.started) { //如果broker未启动则手动启动service
//                     broker._restartService(service)
//                 }
//             }
//         }
//     }
// }

export async function loadPackage(packagePath){
    let schema = getSteedosSchema();
    let broker = schema.broker;
    if(broker){
        const filePatten = [
          path.join(packagePath, "**", "package.service.js"),
          "!" + path.join(packagePath, "**", "node_modules"),
        ];
        const matchedPaths:[string] = globby.sync(filePatten);
        for await (const serviceFilePath of matchedPaths) {
            const service = broker.loadService(serviceFilePath);
            if (!broker.started) { //如果broker未启动则手动启动service
                broker._restartService(service)
            }
        }
    }
}