import _, { each, includes, isArray, keys } from 'lodash';
import { Base } from './Base';
import { DbManager } from '@steedos/metadata-api/lib/util/dbManager'
import { ObjectId } from "mongodb";
import { syncMatchFiles } from '@steedos/metadata-core';
const path = require('path');
const fs = require("fs");
import { EJSON } from 'bson'
import { formatResults, preCreateCollection, readFileResult } from '..';

const transactionOptions: any = {
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' }
};

export default class ImportJson implements Base {
    userSession: any;

    constructor(userSession: any) {
        this.userSession = userSession;
    }

    format(record) {
        if (!record) {
            return record;
        }
        // each(record, (v, k) => {
        //     if (includes(keys(v), '$date')) {
        //         record[k] = new Date(v.$date)
        //     } else if (isArray(v)) {
        //         each(v, (v2) => {
        //             this.format(v2)
        //         })
        //     }
        // })
        return EJSON.parse(JSON.stringify(record));
    }

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

    async fileRecordsToDB(jsonData: readFileResult[]) {
        const userSession = this.userSession
        const { spaceId, userId, company_id, company_ids } = userSession
        var dbManager = new DbManager(userSession);
        const now = new Date()
        try {

            let results = formatResults(jsonData, userSession)

            await dbManager.connect();

            // 如果库中没有collection则提前新建好
            await preCreateCollection(dbManager, results)

            var session = await dbManager.startSession();
            try {
                await session.withTransaction(async () => {
                    for (const result of results) {
                        try {
                            for (let record of result.records) {
                                record = this.format(record);
                                const dbRecord = await dbManager.findOne(result.objectName, { _id: record._id }, true);
                                if (dbRecord) {
                                    delete record.space;
                                    delete record.owner;
                                    delete record.created;
                                    delete record.created_by;
                                    await dbManager.update(result.objectName, { _id: record._id }, Object.assign(record, {
                                        modified: now,
                                        modified_by: userId,
                                        company_id: company_id,
                                        company_ids: company_ids,
                                    }))
                                } else {
                                    await dbManager.insert(result.objectName, Object.assign(record, {
                                        _id: record._id || new ObjectId().toHexString(),
                                        space: spaceId,
                                        owner: userId,
                                        created: now,
                                        created_by: userId,
                                        modified: now,
                                        modified_by: userId,
                                        company_id: company_id,
                                        company_ids: company_ids,
                                    }), false)
                                }
                            }
                        } catch (error) {
                            console.error(`import ${result.objectName} error`, error.message)
                            throw error;
                        }
                    }
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