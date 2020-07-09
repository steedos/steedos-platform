import { SteedosSchema, SteedosOracleDriver, SteedosQueryOptions, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';

const connectConfig = require('../../../../test/connection.json').oracle;//不提供connectConfig值时不运行单元测试
let tableName = "TestFiltersForOracle";
let driver: SteedosOracleDriver;

describe('filters for oracle database', () => {
    if (!connectConfig) {
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
                filters: [["name", "=", "ptr"], ["title", "=", "This is PTR"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with odata query string",
            options: {
                fields: ["id", "name"],
                filters: "(name eq 'ptr') and (title eq 'This is PTR')"
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
            title: "filter records with operator: eq and contains",
            options: {
                fields: ["id", "name"],
                filters: [["title", "=", "This is PTR"], ["name", "contains", "p"]]
            },
            expected: {
                length: 1
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
                filters: [["name", "=", "ptr"], ["title", "=", "This is PTR"]]
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
                filters: "(name eq 'ptr') and (title eq 'This is PTR')"
            },
            expected: {
                eq: 1
            }
        }
    ];

    before(async () => {
        let datasourceDefault: any = {
            driver: SteedosDatabaseDriverType.Oracle,
            objects: {
                test: {
                    label: 'Oracle Schema',
                    table_name: tableName,
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
        };
        datasourceDefault = { ...datasourceDefault, ...connectConfig };
        let mySchema = new SteedosSchema({
            datasources: {
                DatasourcesDriverTest: datasourceDefault
            }
        });
        const datasource = mySchema.getDataSource("DatasourcesDriverTest");
        await datasource.init();
        driver = <SteedosOracleDriver>datasource.adapter;
    });

    beforeEach(async () => {
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "This is PTR", count: 120 });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "This is CNPC", count: 18 });

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

