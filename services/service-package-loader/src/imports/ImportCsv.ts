/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-26 10:31:50
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-26 10:51:00
 * @FilePath: /steedos-platform-2.3/services/service-package-loader/src/imports/ImportCsv.ts
 * @Description: 
 */
import ImportJson from './ImportJson';
import csv = require('csvtojson');
import path = require('path');
import { syncMatchFiles } from '@steedos/metadata-core';

export default class ImportCsv extends ImportJson {

    async readFile(filePath: string): Promise<Array<{ objectName: string, records: Array<any> }>> {
        let results: any = []
        const filePatten = [
            path.join(filePath, "**", "*.data.csv"),
            "!" + path.join(filePath, "node_modules"),
        ]
        const matchedPaths: [string] = syncMatchFiles(filePatten);
        for (const matchedPath of matchedPaths) {
            let records = await csv().fromFile(matchedPath);
            let objectName = path.basename(matchedPath).split('.')[0];
            results.push({ objectName: objectName, records: records });
        }
        return results
    }
}