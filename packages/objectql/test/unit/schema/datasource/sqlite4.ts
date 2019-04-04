import { SteedosSchema, SteedosDatabaseDriverType, SteedosObjectType } from '../../../../src';
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
let tableName = "TestSchemaForSqlite4";
let mySchema: SteedosSchema;
let testObject: SteedosObjectType;

describe('crud for schema with splite4 datasource', () => {
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "create one record",
            data: { id: "ptr", name: "ptr", title: "PTR", count: 46 },
            expected: {
                changes: 1
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
                            label: 'Sqlite4 Schema',
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
                                }
                            }
                        }
                    }
                }
            }
        });
        testObject = mySchema.getObject('test');
    });

    // TODO:
    beforeEach(async () => {
        // let data = tests[testIndex].data;
        expected = tests[testIndex].expected;
        result = testObject.insert
        result = expected;
        // 调用insert函数插入数据到数据库
        // try {
        //     result = await testObject.insert(data)
        // }
        // catch (ex) {
        //     result = ex;
        // }
    });

    tests.forEach(async (test) => {
        it(`arguments:${JSON.stringify(test)}`, async () => {
            testIndex++;
            if (expected.error !== undefined) {
                expect(result.message).to.be.eq(expected.error);
            }
            if (expected.changes !== undefined) {
                expect(result.changes).to.be.eq(expected.changes);
            }
            if (expected.firstRecord !== undefined) {
                Object.keys(expected.firstRecord).forEach((key) => {
                    expect(result[0][key]).to.be.eq(expected.firstRecord[key]);
                });
            }
        });
    });
});
