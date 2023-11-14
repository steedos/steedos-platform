/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-26 10:22:14
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-14 16:39:33
 * @FilePath: /steedos-platform-2.3/services/service-package-loader/src/methods/importData.ts
 * @Description: 
 */
import ImportJson from '../imports/ImportJson';
import ImportCsv from '../imports/ImportCsv'

import fs = require('fs');

export async function handler(filePath: string, onlyInsert: boolean, spaceId: string) {
    if (!filePath) {
        return
    }
    if (!fs.existsSync(filePath)) {
        return
    }

    const importer = {
        csv: new ImportCsv(),
        json: new ImportJson(),
    }

    const csvData = await importer.csv.readFile(filePath);

    const jsonData = await importer.json.readFile(filePath);


    await this.broker.call("@steedos/data-import.importData", {
        data: {
            "csv": csvData,
            "json": jsonData,
        },
        spaceId,
        onlyInsert,
    })

}
