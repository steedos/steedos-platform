import { SteedosSchema, SteedosSqlServerDriver, SteedosQueryOptions, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';

let url = process.env.DRIVER_SQLSERVER_URL;//不提供url值时不运行单元测试
let tableName = "TestFieldsForSqlserver";
let driver: SteedosSqlServerDriver;

describe('fetch records width specific fields for sqlserver database', () => {
    if (!url) {
        return true;
    }
    try {
        require("mssql");
    }
    catch (ex) {
        return true;
    }
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "fields arguments is a array",
            options: {
                fields: ["name", "title"]
            },
            expected: {
                length: 2,
                firstRecord:{
                    tag: undefined
                }
            }
        },
        {
            title: "fields arguments is a string",
            options: {
                fields: "name, title, "
            },
            expected: {
                length: 2,
                firstRecord: {
                    tag: undefined
                }
            }
        },
        {
            title: "fields arguments is a empty array",
            options: {
                fields: []
            },
            expected: {
                length: 2,
                firstRecord: { id: "cnpc", name: "cnpc", title: "CNPC", tag: "one" }
            }
        },
        {
            title: "fields arguments is empty",
            options: {
            },
            expected: {
                length: 2,
                firstRecord: { id: "cnpc", name: "cnpc", title: "CNPC", tag: "one" }
            }
        }
    ];

    before(async () => {
        let mySchema = new SteedosSchema({
            datasources: {
                default: {
                    url: url,
                    driver: SteedosDatabaseDriverType.SqlServer,
                    objects: {
                        test: {
                            label: 'SqlServer Schema',
                            tableName: tableName,
                            fields: {
                                id: {
                                    label: '主键',
                                    type: 'text',
                                    primary: true
                                },
                                name: {
                                    label: '名称',
                                    type: 'text'
                                },
                                title: {
                                    label: '标题',
                                    type: 'text'
                                },
                                tag: {
                                    label: '数量',
                                    type: 'text'
                                }
                            }
                        }
                    }
                }
            }
        });
        const datasource = mySchema.getDataSource("default");
        await datasource.createTables();
        driver = <SteedosSqlServerDriver>datasource.adapter;
    });

    beforeEach(async () => {
        await driver.run(`delete from ${tableName}`);
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR", tag: "one" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC", tag: "one" });

        let queryOptions: SteedosQueryOptions = tests[testIndex].options;
        expected = tests[testIndex].expected;
        try {
            result = await driver.find(tableName, queryOptions);
        }
        catch (ex) {
            result = ex;
        }
    });

    afterEach(async () => {
        await driver.delete(tableName, "ptr");
        await driver.delete(tableName, "cnpc");
    });

    tests.forEach(async (test) => {
        it(`${test.title}`, async () => {
            testIndex++;
            if (expected.error !== undefined) {
                expect(result.message).to.be.eq(expected.error);
            }
            if (expected.length !== undefined) {
                expect(result).to.be.length(expected.length);
            }
            if (expected.firstRecord !== undefined) {
                Object.keys(expected.firstRecord).forEach((key) => {
                    expect(result[0][key]).to.be.eq(expected.firstRecord[key]);
                });
            }
        });
    });
});
