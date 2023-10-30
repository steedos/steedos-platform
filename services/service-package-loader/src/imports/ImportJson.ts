/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-26 10:31:50
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-26 10:48:39
 * @FilePath: /steedos-platform-2.3/services/service-package-loader/src/imports/ImportJson.ts
 * @Description: 
 */
import { each } from 'lodash';
import { Base } from './Base';
import { syncMatchFiles } from '@steedos/metadata-core';
import path = require('path');
import fs = require("fs");

export default class ImportJson implements Base {

    async readFile(filePath: string): Promise<Array<{ objectName: string, records: Array<any> }>> {
        let results: any = []
        const filePatten = [
            path.join(filePath, "**", "*.data.json"),
            "!" + path.join(filePath, "**", "*.flow.data.json"),
            "!" + path.join(filePath, "node_modules")];

        const matchedPaths: [string] = syncMatchFiles(filePatten);
        each(matchedPaths, (matchedPath: string) => {
            let records = JSON.parse(fs.readFileSync(matchedPath, 'utf8').normalize('NFC'));
            let objectName = path.basename(matchedPath).split('.')[0];
            results.push({ objectName: objectName, records: records });
        })
        return results
    }

}