import ImportJson from './ImportJson';
const csv = require('csvtojson')
const path = require('path');
import { syncMatchFiles } from '@steedos/metadata-core';

export default class ImportCsv extends ImportJson {

    constructor(userSession: any) {
        super(userSession);
    }

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