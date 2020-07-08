import { SteedosSchema, SteedosSqlite3Driver, SteedosQueryOptions, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
const connectConfig = {
    url: databaseUrl
};
let tableName = "TestPageForSqlite3";
let driver: SteedosSqlite3Driver;

describe('fetch records by paging for sqlite3 database', () => {
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
            title: "top",
            options: {
                fields: ["name"],
                sort: 'index',
                top: 2
            },
            expected: {
                length: 2
            }
        },
        {
            title: "skip",
            options: {
                fields: ["id", "name"],
                sort: 'index',
                skip: 2
            },
            expected: {
                length: 2
            }
        },
        {
            title: "top without skip",
            options: {
                fields: ["name"],
                top: 2
            },
            expected: {
                length: 2
            }
        },
        {
            title: "skip without top",
            options: {
                fields: ["name"],
                skip: 3
            },
            expected: {
                length: 1
            }
        },
        {
            title: "top and skip for paging",
            options: {
                fields: ["id", "name"],
                sort: 'index',
                top: 2,
                skip: 3
            },
            expected: {
                length: 1,
                firstRecordId: "ptr2"
            }
        },
        {
            title: "multi sort for paging",
            options: {
                fields: ["id", "name"],
                sort: 'name desc,index',
                top: 2,
                skip: 1
            },
            expected: {
                length: 2,
                firstRecordId: "ptr2"
            }
        },
        {
            title: "filter for paging with endswith",
            options: {
                fields: ["id", "name"],
                filters: [["name", "endswith", "pc"]],
                sort: 'id desc,index',
                top: 2,
                skip: 0
            },
            expected: {
                length: 2,
                firstRecordId: "cnpc2"
            }
        },
        {
            title: "filter for paging with notcontains",
            options: {
                fields: ["id", "name"],
                filters: [["name", "notcontains", "pc"]],
                sort: 'id desc,index',
                top: 2,
                skip: 0
            },
            expected: {
                length: 2,
                firstRecordId: "ptr2"
            }
        },
        {
            title: "filter for paging with multi equal",
            options: {
                fields: ["id", "name"],
                filters: [["name", "=", "cnpc"], ["title", "=", "CNPC"]],
                sort: 'id desc,index',
                top: 2,
                skip: 0
            },
            expected: {
                length: 2
            }
        }
    ];

    before(async () => {
        let datasourceDefault: any = {
            driver: SteedosDatabaseDriverType.Sqlite,
            objects: {
                test: {
                    label: 'Sqlite3 Schema',
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
                        index: {
                            label: '序号',
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
        await datasource.createTables();
        driver = <SteedosSqlite3Driver>datasource.adapter;
        await driver.run(`DELETE FROM "${tableName}"`);
        await driver.insert(tableName, { id: "cnpc1", name: "cnpc", title: "CNPC", index: 1 });
        await driver.insert(tableName, { id: "cnpc2", name: "cnpc", title: "CNPC", index: 2 });
        await driver.insert(tableName, { id: "ptr1", name: "ptr", title: "PTR", index: 3 });
        await driver.insert(tableName, { id: "ptr2", name: "ptr", title: "PTR", index: 4 });
    });

    beforeEach(async () => {
        let queryOptions: SteedosQueryOptions = tests[testIndex].options;
        expected = tests[testIndex].expected;
        try {
            result = await driver.find(tableName, queryOptions);
        }
        catch(ex){
            result = ex;
        }
    });

    tests.forEach(async (test) => {
        it(`${test.title}`, async () => {
            testIndex++;
            if (expected.error !== undefined) {
                expect(result.message).to.be.eq(expected.error);
            }
            if (expected.length !== undefined){
                expect(result).to.be.length(expected.length);
            }
            if (expected.firstRecordId !== undefined) {
                expect(result[0].id).to.be.eq(expected.firstRecordId);
            }
        });
    });
});
