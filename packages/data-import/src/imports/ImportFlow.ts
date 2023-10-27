/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2022-07-15 18:16:49
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-26 14:49:19
 * @FilePath: /steedos-platform-2.3/packages/data-import/src/imports/ImportFlow.ts
 * @Description: 
 */
import { DbManager } from '@steedos/metadata-api/lib/util/dbManager'
import { flowsToDb } from '@steedos/metadata-api/lib/metadata/collection/flow'
// import { checkNameEquals } from '@steedos/metadata-api/lib/util/check_name_equals'
import { loadFile, syncMatchFiles } from '@steedos/metadata-core';
import { Base } from './Base';
const path = require('path');
const _ = require('underscore');

const transactionOptions: any = {
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' }
};

export default class ImportFlow implements Base {
    objectName: string = "flows";
    userSession: any;

    constructor(userSession: any) {
        this.userSession = userSession;
    }

    readFile(filePath: string): any {
        const filePatten = [
            path.join(filePath, "**", "*.flow.data.json"),
            "!" + path.join(filePath, "node_modules"),
        ]
        const matchedPaths: [string] = syncMatchFiles(filePatten);
        let flows = {};
        for (let k = 0; k < matchedPaths.length; k++) {
            let matchedPath = matchedPaths[k];
            let json = loadFile(matchedPath);
            let formName = matchedPath.substring(matchedPath.lastIndexOf('/') + 1, matchedPath.indexOf('.flow'));
            let form = {};
            try {
                if (json) {

                    // checkNameEquals(json, formName, matchedPath, TypeInfoKeys.Flow);

                    let flowKeys = _.keys(json);
                    for (let m in flowKeys) {
                        let key = flowKeys[m];
                        if (typeof key === 'function') {
                            continue;
                        }
                        let val = json[key];
                        if (typeof val === 'function') {
                            json[key] = val.toString();
                        }
                        form[key] = json[key];
                    }
                    flows[formName] = json;
                }
            } catch (error) {
                console.error('loadFlows error', matchedPath, error);
                throw error
            }
        }
        return flows;
    }

    async fileRecordsToDB(flows: object) {
        const dbManager = new DbManager(this.userSession);
        try {
            await dbManager.connect();
            const session = await dbManager.startSession();
            try {
                await session.withTransaction(async () => {
                    await flowsToDb(dbManager, flows, true);
                }, transactionOptions);
            } catch (err) {
                console.log(err)
                throw err
            }
        } catch (error) {
            console.error(error)
        } finally {
            await dbManager.endSession();
            await dbManager.close();
        }
    }
}