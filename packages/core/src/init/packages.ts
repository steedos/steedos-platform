import { getAllPackages, uncompressPackages } from '@steedos/metadata-core';
import { wrapAsync } from '@steedos/objectql';
import * as _ from 'underscore';
// import * as path from 'path';
import { getSteedosSchema } from '@steedos/objectql';

export function loadPackages() {
    wrapAsync(async function () {
        await uncompressPackages(process.cwd());
        // const packages = await getAllPackages(process.cwd());
        // packages.push(path.join(process.cwd(), 'steedos-app'));
        // _.each(packages, function(filePath: string){
        //     addAllConfigFiles(path.join(filePath, '**'), null);
        // })
        // TODO 重新编写自动加载package的逻辑，应是service方式
        let schema = getSteedosSchema();
        let broker = schema.broker;
        if (broker) {
            const packages = await getAllPackages(process.cwd());
            _.each(packages, function (filePath: string) {
                // console.log('filePath: ', filePath)
                broker.loadServices(filePath, "steedos-app/package.service.js");
            })
        }

    }, {})
}