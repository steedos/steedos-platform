import { SteedosSchema, SteedosSqlServerDriver, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';

const connectConfig = require('../../../../test/connection.json').mssql;//不提供connectConfig值时不运行单元测试
let tableName = "TestCrudForSqlserver";
let driver: SteedosSqlServerDriver;
describe('crud for sqlserver database', () => {
    if (!connectConfig){
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
            title: "create one record",
            method: "insert",
            data: { id: "ptr", name: "ptr", title: "PTR", count: 46 },
            expected: {
                returnRecord: { id: "ptr", name: "ptr", title: "PTR", count: 46 }
            }
        },
        {
            title: "update one record",
            method: "update",
            id: "ptr",
            data: { name: "ptr-", title: "PTR-", count: 460 },
            expected: {
                returnRecord: { id: "ptr", name: "ptr-", title: "PTR-", count: 460 }
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
                returnRecord: { name: "ptr-", title: undefined, count: 460 }
            }
        },
        {
            title: "delete one record",
            method: "delete",
            id: "ptr",
            expected: {
                eq: undefined
            }
        }
    ];

    before(async () => {
        let datasourceDefault: any = {
            driver: SteedosDatabaseDriverType.SqlServer,
            objects: {
                test: {
                    label: 'SqlServer Schema',
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
        datasourceDefault = { ...datasourceDefault, ...connectConfig }
        let mySchema = new SteedosSchema({
            datasources: {
                DatasourcesDriverTest: datasourceDefault
            }
        });
        const datasource = mySchema.getDataSource("DatasourcesDriverTest");
        await datasource.init();
        driver = <SteedosSqlServerDriver>datasource.adapter;
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
        it(`${test.title}`, async () => {
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
