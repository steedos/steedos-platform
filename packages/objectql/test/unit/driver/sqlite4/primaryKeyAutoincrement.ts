import { SteedosSqlite3Driver } from "../../../../src/driver";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestPrimaryKeyForSqlite4";
let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });

describe('primary key autoincrement test for sqlite3 database', () => {
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "create the first record",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                lastID: 1
            }
        },
        {
            title: "create the second record",
            runSql: "",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                lastID: 2
            }
        },
        {
            title: "create the third record with id value",
            insertData: { id: 5, name: "ptr", title: "PTR", count: 46 },
            expected: {
                lastID: 5
            }
        },
        {
            title: "create the fourth record",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                lastID: 6
            }
        },
        {
            title: "delete all records from the table",
            runSql: `DELETE FROM ${tableName}`,
            expected: {
                lastID: 0
            }
        },
        {
            title: "recreate the first record",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                lastID: 7
            }
        },
        {
            title: "truncate the table",
            runSqls: [`DELETE FROM ${tableName}`, `DELETE FROM sqlite_sequence WHERE name='${tableName}'`],
            expected: {
                lastID: 0
            }
        },
        {
            title: "recreate the first record again",
            insertData: { name: "ptr", title: "PTR", count: 46 },
            expected: {
                lastID: 1
            }
        }
    ];

    before(async () => {
        result = await driver.get(`select count(*) as count from sqlite_master where type = 'table' and name = '${tableName}'`);
        expect(result.count).to.be.not.eq(undefined);
        if (result.count) {
            await driver.run(`DROP TABLE ${tableName}`);
        }
        await driver.run(`
            CREATE TABLE ${tableName}(
                [id] INTEGER primary key autoincrement,
                [name] TEXT,
                [title] TEXT,
                [count] INTEGER
            );
        `);
    });

    beforeEach(async () => {
        let runSql: any = tests[testIndex].runSql;
        let runSqls: any = tests[testIndex].runSqls;
        let insertData: any = tests[testIndex].insertData;
        expected = tests[testIndex].expected;
        result = {};
        if (runSql) {
            driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
            result = await driver.run(runSql);
        }
        else if (runSqls) {
            driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
            // 这时不能直接用runSqls.forEach，只能用for
            // runSqls.forEach(async (sql)=>{
            //     result = await driver.run(sql);
            // });
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
            expect(result.lastID).to.be.eq(expected.lastID);
        });
    });
});
