import { SteedosSchema, SteedosOracleDriver, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';

const connectConfig = require('../../../../test/connection.json').oracle;//不提供connectConfig值时不运行单元测试
let tableName = "TestPrimaryKeyForOracle";
let sequenceName = "SU_TESTPRIMARYKEYFORORACLE";
let driver: SteedosOracleDriver;

describe('primary key autoincrement test for oracle database', () => {
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
            title: "create the first record",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                insertResult: {
                    id: 1,
                    name: "ptr"
                }
            }
        },
        {
            title: "create the second record",
            runSql: "",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                insertResult: {
                    id: 2,
                    name: "ptr"
                }
            }
        },
        {
            title: "create the third record with id value",
            insertData: { id: 5, name: "ptr", title: "PTR", count: 46 },
            expected: {
                insertResult: {
                    id: 5,
                    name: "ptr"
                }
            }
        },
        {
            title: "create the fourth record",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                insertResult: {
                    id: 3,
                    name: "ptr"
                }
            }
        },
        {
            title: "delete all records from the table",
            runSql: `DELETE FROM "${tableName}"`,
            expected: {
                eq: undefined
            }
        },
        {
            title: "recreate the first record",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                insertResult: {
                    id: 4,
                    name: "ptr"
                }
            }
        },
        {
            title: "truncate the table",
            runSqls: [`DROP SEQUENCE ${sequenceName}`, `CREATE SEQUENCE ${sequenceName} INCREMENT BY 1 START WITH 1 NOMAXvalue NOCYCLE ORDER CACHE 20`],
            expected: {
                eq: undefined
            }
        },
        {
            title: "recreate the first record again",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                insertResult: {
                    id: 1,
                    name: "ptr"
                }
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
                            type: 'number',
                            primary: true,
                            generated: true
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

        // 删除重置主键自增队列
        await driver.run(`DELETE FROM "${tableName}"`);
        await driver.run(`DROP SEQUENCE ${sequenceName}`);
        await driver.run(`CREATE SEQUENCE ${sequenceName} INCREMENT BY 1 START WITH 1 NOMAXvalue NOCYCLE ORDER CACHE 20`);
    });

    after(async () => {
        // 删除重置主键自增队列
        await driver.run(`DELETE FROM "${tableName}"`);
        await driver.run(`DROP SEQUENCE ${sequenceName}`);
        await driver.run(`CREATE SEQUENCE ${sequenceName} INCREMENT BY 1 START WITH 1 NOMAXvalue NOCYCLE ORDER CACHE 20`);
    });

    beforeEach(async () => {
        let runSql: any = tests[testIndex].runSql;
        let runSqls: any = tests[testIndex].runSqls;
        let insertData: any = tests[testIndex].insertData;
        expected = tests[testIndex].expected;
        result = {};
        if (runSql) {
            result = await driver.run(runSql);
        }
        else if (runSqls) {
            for (let i = 0; i < runSqls.length;i++){
                result = await driver.run(runSqls[i]);
            }
        }
        else if (insertData) {
            result = await driver.insert(tableName, insertData);
        }
    });

    tests.forEach((test) => {
        it(`${test.title}`, async () => {
            testIndex++;
            if (expected.length !== undefined) {
                expect(result).to.be.length(expected.length);
            }
            if (expected.eq !== undefined) {
                expect(result).to.be.eq(expected.eq);
            }
            if (expected.insertResult !== undefined) {
                Object.keys(expected.insertResult).forEach((key) => {
                    expect(result[key]).to.be.eq(expected.insertResult[key]);
                });
            }
        });
    });
});
