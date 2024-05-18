/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-05-15 14:09:25
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-18 09:43:43
 * @FilePath: /steedos-platform-2.3/services/service-package-loader/src/loader/functionYmlLoader.ts
 * @Description: 
 */
import { LoadFunctionFile } from '@steedos/metadata-core'
import path = require('path');
import _ = require('lodash');

const loadFunctionFile = new LoadFunctionFile();

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    let filePath = path.join(packagePath, "**");
    let functions: any = loadFunctionFile.load(filePath);
    if (_.isEmpty(functions)) {
        return;
    }
    for (const name in functions) {
        const func = functions[name];

        func._name =  func.name.substr(`${func.objectApiName}_`.length) // apiname

        await broker.call(`object_functions.add`, { apiName: `${func.objectApiName}.${func.name}`, data: func }, {
            meta: {
                metadataServiceName: packageServiceName,
                caller: {
                    nodeID: broker.nodeID,
                    service: {
                        name: packageServiceName,
                    }
                }
            }
        });
    }
}