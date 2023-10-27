import { DbManager } from '@steedos/metadata-api/lib/util/dbManager'
import { keyBy, isEmpty } from 'lodash'
import { getSteedosConfig } from '@steedos/objectql'
import ImportJson from './imports/ImportJson'
import ImportCsv from './imports/ImportCsv'
import ImportFlow from './imports/ImportFlow'
import { userSessionType } from './types'
import _ from 'lodash'

export async function getUserSession(spaceId?: string): Promise<userSessionType | any> {
    var dbManager = new DbManager({});
    const now = new Date()
    try {
        await dbManager.connect();
        const selector = {}
        if (spaceId) {
            selector['_id'] = spaceId
        }
        const space = await dbManager.findOne('spaces', selector, false);
        if (!space) {
            return;
        }
        const spaceOwner = space.owner;
        const spaceUser = await dbManager.findOne('space_users', { space: space._id, user: spaceOwner }, false);
        if (!spaceUser) {
            return;
        }
        return {
            spaceId: space._id,
            userId: spaceOwner,
            company_id: spaceUser.company_id,
            company_ids: spaceUser.company_ids
        };
    } catch (error) {
        console.error(error)
    } finally {
        await dbManager.endSession();
        await dbManager.close();
    }
}

/**
 * 如果库中没有collection则提前新建好
 * @param dbManager mongodb 数据库操作类
 * @param results 需要导入的数据
 */
export async function preCreateCollection(dbManager, results: readFileResult[]) {
    const db = dbManager.client.db()
    const collectionInfos = await db.listCollections({}, { nameOnly: true }).toArray()
    const collectionsMap = keyBy(collectionInfos, 'name')
    const config = getSteedosConfig()
    const datasourceConfig = config.datasources['default']
    const locale = datasourceConfig.locale || 'zh'
    const options = {
        'collation': { 'locale': locale },
    };
    for (const result of results) {
        const objectName = result.objectName
        if (!collectionsMap[objectName]) {
            try {
                await db.createCollection(objectName, options)
            } catch (error) {
                // DO NOTHING
            }
        }
    }
}

export type readFileResult = {
    readonly objectName: string,
    readonly records: any[]
}

export type importDataType = {
    csv: readFileResult[],
    json: readFileResult[],
    flow: object,
}

/**
 * 将数据中的${space_id}替换为spaceId值
 * @param results 
 * @param userSession 
 * @returns new results
 */
export function formatResults(results: readFileResult[], userSession: userSessionType): readFileResult[] {
    const { spaceId, userId } = userSession
    return JSON.parse(JSON.stringify(results).replace(/\${space_id}/g, spaceId).replace(/\${space_owner_id}/g, userId))
}

/**
 * 
 * @param {*} filePath 要导入数据的文件夹路径
 * @param {*} onlyInsert 仅导入，在导入数据之前先检查，如果存在任意一条记录，则不执行导入
 */
export async function importData(data: importDataType, onlyInsert: boolean = true, spaceId?: string) {
    const userSession = await getUserSession(spaceId)
    if (isEmpty(userSession)) {
        return;
    }

    if (_.isEmpty(data)) {
        return;
    }

    const importer = {
        csv: new ImportCsv(userSession),
        json: new ImportJson(userSession),
        flow: new ImportFlow(userSession)
    }

    const csvData = data?.csv
    const jsonData = data?.json
    const flowData = data?.flow

    if (onlyInsert) {
        var dbManager = new DbManager(userSession);
        try {
            await dbManager.connect();
            //检查csv数据是否存在
            for (const result of csvData) {
                for (let record of result.records) {
                    const dbRecord = await dbManager.findOne(result.objectName, { _id: record._id }, true);
                    if (dbRecord) {
                        throw new Error(`停止导入数据：${result.objectName}对象的${record._id}记录已存在`);
                    }
                }
            }
            //检查json数据是否存在
            for (const result of jsonData) {
                const objectName = result.objectName;
                const records = result.records;
                const recordsIds = _.map(records, '_id');
                const dbRecords = await dbManager.find(objectName, { _id: { $in: recordsIds } }, false, 0, { projection: { _id: 1 } });
                if (dbRecords.length > 0) {
                    throw new Error(`停止导入数据：${result.objectName}对象已存在${dbRecords.length}条记录`);
                }
            }
            //检查flow数据是否存在
            for (const formName in flowData) {
                var form = flowData[formName];

                let flowApiName = form.api_name

                if (flowApiName) {
                    let flow = await dbManager.findOneWithProjection('flows', { api_name: flowApiName }, { form: 1 })
                    if (flow) {
                        throw new Error(`停止导入数据：流程${flowApiName}已存在`);
                    }
                }
            }
        } catch (error) {
            console.info(error.message);
            return;
        } finally {
            await dbManager.endSession();
            await dbManager.close();
        }
    }
    importer.csv.fileRecordsToDB(csvData);
    importer.json.fileRecordsToDB(jsonData);
    importer.flow.fileRecordsToDB(flowData);
}