import { SteedosSchema, SteedosDatabaseDriverType, SteedosObjectType } from '../../../../../src';
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
let tableName = "TestSchemaCRUDForSqlite3";
let mySchema: SteedosSchema;
let testObject: SteedosObjectType;

describe('crud for schema with splite3 datasource', () => {
    try{
        require("sqlite3");
    }
    catch(ex){
        return true;
    }
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "create one record",
            method: "insert",
            data: { id: "ptr", name: "ptr", title: "PTR", count: 46, amount: 198.4 },
            expected: {
                gt: 0
            }
        },
        {
            title: "update one record",
            method: "update",
            id: "ptr",
            data: { name: "ptr-", title: "PTR-", count: 460 },
            expected: {
                length: 0
            }
        },
        {
            title: "read one record",
            method: "findOne",
            id: "ptr",
            queryOptions: {
                fields: ["name", "count"]
            },
            expected: {
                findOneResult: { name: "ptr-", title: undefined, count: 460}
            }
        },
        {
            title: "delete one record",
            method: "delete",
            id: "ptr",
            expected: {
                length: 0
            }
        }
    ];

    before(async () => {
        mySchema = new SteedosSchema({
            datasources: {
                default: {
                    driver: SteedosDatabaseDriverType.Sqlite,
                    url: databaseUrl,
                    objects: {
                        test: {
                            label: 'Sqlite3 Schema',
                            tableName: tableName,
                            fields: {
                                id: {
                                    label: '主键',
                                    type: 'text'
                                },
                                name: {
                                    label: '名称',
                                    type: 'text'
                                },
                                title: {
                                    label: '标题',
                                    type: 'text'
                                },
                                count: {
                                    label: '数量',
                                    type: 'number'
                                },
                                amount: {
                                    label: '金额',
                                    type: 'number',
                                    scale: 2
                                }
                            }
                        }
                    }
                }
            }
        });
        const datasources = mySchema.getDataSources();
        for (let name in datasources) {
            await datasources[name].dropTables();
            await datasources[name].createTables();
        }
        testObject = mySchema.getObject('test');
    });

    beforeEach(async () => {
        let data = tests[testIndex].data;
        expected = tests[testIndex].expected;
        let method = tests[testIndex].method;
        let id = tests[testIndex].id;
        let queryOptions = tests[testIndex].queryOptions;
        if (id) {
            result = await testObject[method](id, data || queryOptions).catch((ex: any) => { console.error(ex); return false; });
        }
        else {
            result = await testObject[method](data).catch((ex: any) => { console.error(ex); return false; });
        }
    });

    tests.forEach(async (test) => {
        it(`arguments:${JSON.stringify(test)}`, async () => {
            testIndex++;
            if (expected.error !== undefined) {
                expect(result.message).to.be.eq(expected.error);
            }
            if (expected.length !== undefined) {
                expect(result).to.be.length(expected.length);
            }
            if (expected.gt !== undefined) {
                expect(result).to.be.gt(expected.gt);
            }
            if (expected.findOneResult !== undefined) {
                Object.keys(expected.findOneResult).forEach((key) => {
                    expect(result[key]).to.be.eq(expected.findOneResult[key]);
                });
            }
        });
    });
});
