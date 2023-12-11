/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-12-10 16:17:25
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-12-10 16:21:29
 * @FilePath: /steedos-platform-2.3/services/service-package-loader/src/printLoader/index.ts
 * @Description: 
 */
import { LoadPrintFile } from '@steedos/metadata-core'
import { registerPrint } from '@steedos/metadata-registrar'
import path = require('path');
import _ = require('lodash');
import { Print } from './types';
import { METADATA_SYSTEM_PERMISSION } from '../consts';

const loadPrintFile = new LoadPrintFile();

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    let filePath = path.join(packagePath, "**");
    const metadatasJSON = loadPrintFile.load(filePath);
    if (_.isEmpty(metadatasJSON)) {
        return;
    }

    // 注册到元数据中心
    const data = [];
    for (const apiName in metadatasJSON) {
        const doc: Print = metadatasJSON[apiName];
        data.push(Object.assign(doc, METADATA_SYSTEM_PERMISSION));
    }
    if (data.length > 0) {
        await registerPrint.mregister(broker, packageServiceName, data)
    }

}