import { SteedosSqlite3Driver } from "../../../../src/driver";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestPrimaryKeyForSqlite3";
let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
let objects = {};

describe.only('primary key autoincrement test for sqlite3 database', () => {
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
                    id: 3,
                    name: "ptr"
                }
            }
        },
        {
            title: "create the fourth record",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                insertResult: {
                    id: 4,
                    name: "ptr"
                }
            }
        },
        {
            title: "delete all records from the table",
            runSql: `DELETE FROM ${tableName}`,
            expected: {
                length: 0
            }
        },
        {
            title: "recreate the first record",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                insertResult: {
                    id: 5,
                    name: "ptr"
                }
            }
        },
        {
            title: "truncate the table",
            runSqls: [`DELETE FROM ${tableName}`, `DELETE FROM sqlite_sequence WHERE name='${tableName}'`],
            expected: {
                length: 0
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
        objects = {
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
        };
        await driver.registerEntities(objects);
    });

    after(async () => {
        await driver.run(`DELETE FROM ${tableName}`);
        await driver.run(`DELETE FROM sqlite_sequence WHERE name='${tableName}'`);
    });

    beforeEach(async () => {
        let runSql: any = tests[testIndex].runSql;
        let runSqls: any = tests[testIndex].runSqls;
        let insertData: any = tests[testIndex].insertData;
        expected = tests[testIndex].expected;
        result = {};
        if (runSql) {
            driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
            await driver.registerEntities(objects);
            result = await driver.run(runSql);
        }
        else if (runSqls) {
            driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
            await driver.registerEntities(objects);
            for (let i = 0; i < runSqls.length;i++){
                result = await driver.run(runSqls[i]);
            }
        }
        else if (insertData) {
            result = await driver.insert(tableName, insertData);
        }
    });

    tests.forEach((test) => {
        it(`arguments:${JSON.stringify(test)}`, async () => {
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
