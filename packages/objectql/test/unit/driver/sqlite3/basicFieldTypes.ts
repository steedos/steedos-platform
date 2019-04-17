import { SteedosSchema, SteedosSqlite3Driver, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestFieldTypesForSqlite3";
let driver: SteedosSqlite3Driver;

describe('basic field types for sqlite3 database', () => {
    try {
        require("sqlite3");
    }
    catch (ex) {
        return true;
    }
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "create one record",
            method: "insert",
            data: { text: "text", textarea: "textarea", int: 10, double: 46.25, date: new Date(), datetime: new Date() },
            expected: {
                returnRecord: { text: "text", textarea: "textarea", int: 10, double: 46.25 }
            }
        },
        {
            title: "read one record",
            method: "findOne",
            id: 1,
            queryOptions: {
                fields: ["text", "textarea", "int", "double", "date"]
            },
            expected: {
                returnRecord: { text: "text", textarea: "textarea", int: 10, double: 46.25 }
            }
        }
    ];

    before(async () => {
        let mySchema = new SteedosSchema({
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
                                    type: 'number',
                                    primary: true,
                                    generated: true
                                },
                                text: {
                                    label: '文本',
                                    type: 'text'
                                },
                                textarea: {
                                    label: '长文本',
                                    type: 'textarea'
                                },
                                int: {
                                    label: '数量',
                                    type: 'number'
                                },
                                double: {
                                    label: '双精度数值',
                                    type: 'number',
                                    scale: 4
                                },
                                date: {
                                    label: '日期',
                                    type: 'date'
                                },
                                datetime: {
                                    label: '创建时间',
                                    type: 'datetime'
                                }
                            }
                        }
                    }
                }
            }
        });
        const datasource = mySchema.getDataSource("default");
        await datasource.registerEntities();
        driver = <SteedosSqlite3Driver>datasource.adapter;
    });

    beforeEach(async () => {
        let data = tests[testIndex].data;
        expected = tests[testIndex].expected;
        let method = tests[testIndex].method;
        let id = tests[testIndex].id;
        let queryOptions = tests[testIndex].queryOptions;
        if (id) {
            result = await driver[method](tableName, id, data || queryOptions).catch((ex: any) => { console.error(ex); return false; });
        }
        else {
            result = await driver[method](tableName, data).catch((ex: any) => { console.error(ex); return false; });
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
            if (expected.eq !== undefined) {
                expect(result).to.be.eq(expected.eq);
            }
            if (expected.returnRecord !== undefined) {
                Object.keys(expected.returnRecord).forEach((key) => {
                    expect(result).to.be.not.eq(undefined);
                    if (result){
                        expect(result[key]).to.be.eq(expected.returnRecord[key]);
                    }
                });
            }
        });
    });
});
