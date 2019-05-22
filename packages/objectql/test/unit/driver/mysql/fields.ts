import { SteedosSchema, SteedosMySqlDriver, SteedosQueryOptions, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';

const host = process.env.DRIVER_MYSQL_Host;//不提供host值时不运行单元测试
const username = process.env.DRIVER_MYSQL_Username;
const password = process.env.DRIVER_MYSQL_Password;
const database = process.env.DRIVER_MYSQL_Database;
let tableName = "TestFieldsForMySql";
let driver: SteedosMySqlDriver;

describe('fetch records width specific fields for mysql database', () => {
    if (!host) {
        return true;
    }
    try {
        require("mysql");
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
                length: 2
            }
        },
        {
            title: "fields arguments is empty",
            options: {
            },
            expected: {
                length: 2
            }
        }
    ];

    before(async () => {
        let mySchema = new SteedosSchema({
            datasources: {
                default: {
                    host: host,
                    username: username,
                    password: password,
                    database: database,
                    driver: SteedosDatabaseDriverType.MySql,
                    objects: {
                        test: {
                            label: 'MySql Schema',
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
        await datasource.init();
        driver = <SteedosMySqlDriver>datasource.adapter;
        await driver.run(`SET SQL_SAFE_UPDATES = 0`);
        await driver.run(`delete from ${tableName}`);
        await driver.run(`SET SQL_SAFE_UPDATES = 1`);
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR", tag: "one" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC", tag: "one" });
    });

    beforeEach(async () => {
        let queryOptions: SteedosQueryOptions = tests[testIndex].options;
        expected = tests[testIndex].expected;
        try {
            result = await driver.find(tableName, queryOptions);
        }
        catch (ex) {
            result = ex;
        }
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
