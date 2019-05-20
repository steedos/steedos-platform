import { SteedosSchema, SteedosOracleDriver, SteedosQueryOptions, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';

const connectString = process.env.DRIVER_ORACLE_ConnectString;//不提供connectString值时不运行单元测试
const username = process.env.DRIVER_ORACLE_Username;
const password = process.env.DRIVER_ORACLE_Password;
const database = process.env.DRIVER_ORACLE_Database;
let tableName = "TestFiltersForOracle";
let driver: SteedosOracleDriver;

describe('filters for oracle database', () => {
    if (!connectString) {
        return true;
    }
    try {
        require("oracledb");
    }
    catch (ex) {
        return true;
    }
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "filter records with filters",
            options: {
                fields: ["id", "name"],
                filters: [["name", "=", "ptr"], ["title", "=", "PTR"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with odata query string",
            options: {
                fields: ["id", "name"],
                filters: "(name eq 'ptr') and (title eq 'PTR')"
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with empty array",
            options: {
                fields: ["id", "name"],
                filters: []
            },
            expected: {
                length: 2
            }
        },
        {
            title: "filter records with empty string",
            options: {
                fields: ["id", "name"],
                filters: ""
            },
            expected: {
                length: 2
            }
        },
        {
            title: "filter records with operator: >",
            options: {
                fields: ["id", "name"],
                filters: [["count", ">", 20]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: >=",
            options: {
                fields: ["id", "name"],
                filters: [["count", ">=", 120]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: <",
            options: {
                fields: ["id", "name"],
                filters: [["count", "<", 100]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: <=",
            options: {
                fields: ["id", "name"],
                filters: [["count", "<=", 18]]
            },
            expected: {
                length: 1
            }
        },
        // {
        //     title: "filter records with operator: between",
        //     options: {
        //         fields: ["id", "name"],
        //         filters: [["count", "between", [10, 100]]]
        //     },
        //     expected: {
        //         length: 1
        //     }
        // },
        {
            title: "filter records with operator: startswith",
            options: {
                fields: ["id", "name"],
                filters: [["name", "startswith", "cn"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: contains",
            options: {
                fields: ["id", "name"],
                filters: [["name", "contains", "p"]]
            },
            expected: {
                length: 2
            }
        },
        {
            title: "filter records with operator: notcontains",
            options: {
                fields: ["id", "name"],
                filters: [["name", "notcontains", "cn"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "records count with filters",
            function: "count",
            options: {
                fields: ["id", "name"],
                filters: [["name", "=", "ptr"], ["title", "=", "PTR"]]
            },
            expected: {
                eq: 1
            }
        },
        {
            title: "records count with odata query string",
            function: "count",
            options: {
                fields: ["id", "name"],
                filters: "(name eq 'ptr') and (title eq 'PTR')"
            },
            expected: {
                eq: 1
            }
        }
    ];

    before(async () => {
        let mySchema = new SteedosSchema({
            datasources: {
                default: {
                    connectString: connectString,
                    username: username,
                    password: password,
                    database: database,
                    driver: SteedosDatabaseDriverType.Oracle,
                    objects: {
                        test: {
                            label: 'Oracle Schema',
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
        const datasource = mySchema.getDataSource("default");
        await datasource.init();
        driver = <SteedosOracleDriver>datasource.adapter;
    });

    beforeEach(async () => {
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR", count: 120 });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC", count: 18 });

        let queryOptions: SteedosQueryOptions = tests[testIndex].options;
        expected = tests[testIndex].expected;
        let functionName: string = tests[testIndex].function;
        try {
            if (functionName) {
                result = await driver[functionName](tableName, queryOptions);
            }
            else {
                result = await driver.find(tableName, queryOptions).catch((ex: any) => { console.error(ex); return false; });
            }
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
            if (expected.eq !== undefined) {
                expect(result).to.be.eq(expected.eq);
            }
        });
    });
});

