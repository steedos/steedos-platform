import { SteedosSchema, SteedosOracleDriver, SteedosQueryOptions, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';

const connectConfig = require('../../../../test/connection.json').oracle;//不提供connectConfig值时不运行单元测试
let tableName = "TestSortForOracle";
let driver: SteedosOracleDriver;

describe('fetch records for oracle with sort arguments as a string that comply with odata-v4 protocol', () => {
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
            title: "sort asc as default",
            options: {
                fields: ["id", "name"],
                sort: 'name'
            },
            expected:{
                length: 4,
                firstRecordId: "cnpc1"
            }
        },
        {
            title: "sort asc",
            options: {
                fields: ["id", "name"],
                sort: 'name asc'
            },
            expected: {
                length: 4,
                firstRecordId: "cnpc1"
            }
        },
        {
            title: "sort desc",
            options: {
                fields: ["id", "name"],
                sort: 'name desc'
            },
            expected: {
                length: 4,
                firstRecordId: "ptr1"
            }
        },
        {
            title: "multi sort",
            options: {
                fields: ["id", "name"],
                sort: 'name,count desc'
            },
            expected: {
                length: 4,
                firstRecordId: "cnpc2"
            }
        },
        {
            title: "multi sort error correction",
            options: {
                fields: ["id", "name"],
                sort: 'name, count desc,, '
            },
            expected: {
                length: 4,
                firstRecordId: "cnpc2"
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
        await driver.insert(tableName, { id: "cnpc1", name: "cnpc", title: "CNPC", count: 68 });
        await driver.insert(tableName, { id: "cnpc2", name: "cnpc", title: "CNPC", count: 130 });
        await driver.insert(tableName, { id: "ptr1", name: "ptr", title: "PTR", count: 32 });
        await driver.insert(tableName, { id: "ptr2", name: "ptr", title: "PTR", count: 96 });
        
        let queryOptions: SteedosQueryOptions = tests[testIndex].options;
        expected = tests[testIndex].expected;
        result = await driver.find(tableName, queryOptions);
    });

    afterEach(async () => {
        await driver.delete(tableName, "cnpc1");
        await driver.delete(tableName, "cnpc2");
        await driver.delete(tableName, "ptr1");
        await driver.delete(tableName, "ptr2");
    });

    tests.forEach(async (test) => {
        it(`${test.title}`, async () => {
            testIndex++;
            expect(result).to.be.length(expected.length);
            expect(result[0].id).to.be.eq(expected.firstRecordId);
        });
    });
});
