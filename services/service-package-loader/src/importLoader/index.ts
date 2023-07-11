/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-07-10 13:49:21
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-07-10 14:05:05
 * @FilePath: /project-template/Users/sunhaolin/Documents/GitHub/steedos-platform-2.3/services/service-package-loader/src/importLoader/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { LoadImportFile } from '@steedos/metadata-core'
import { registerImport } from '@steedos/metadata-registrar'
import path = require('path');
import _ = require('lodash');
import { Import } from './types';
import { METADATA_SYSTEM_PERMISSION } from '../consts';

const loadImportFile = new LoadImportFile();

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    let filePath = path.join(packagePath, "**");
    const metadatasJSON = loadImportFile.load(filePath);
    if (_.isEmpty(metadatasJSON)) {
        return;
    }

    // 注册到元数据中心
    const data = [];
    for (const apiName in metadatasJSON) {
        const doc: Import = metadatasJSON[apiName];
        data.push(Object.assign(doc, METADATA_SYSTEM_PERMISSION));
    }
    if (data.length > 0) {
        await registerImport.mregister(broker, packageServiceName, data)
    }

}