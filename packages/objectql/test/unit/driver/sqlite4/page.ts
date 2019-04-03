import { SteedosSqlite3Driver } from "../../../../src/driver";
import { SteedosQueryOptions } from "../../../../src/types/query";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestPageForSqlite4";
let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });

describe('fetch records by paging for sqlite4 database', () => {
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "top",
            options: {
                fields: ["name"],
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
                error: 'top must not be empty for skip'
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
        }
    ];

    before(async () => {
        result = await driver.get(`select count(*) as count from sqlite_master where type = 'table' and name = '${tableName}'`);
        console.log("insert data to sqlite3 database before check table count result:");
        console.log(result);
        expect(result.count).to.be.not.eq(undefined);
        if (result.count) {
            await driver.run(`DROP TABLE ${tableName}`);
        }
        await driver.run(`
            CREATE TABLE ${tableName}(
                [id] TEXT primary key,
                [name] TEXT,
                [title] TEXT,
                [index] INTEGER
            );
        `);
    });

    beforeEach(async () => {
        await driver.insert(tableName, { id: "cnpc1", name: "cnpc", title: "CNPC", index: 1 });
        await driver.insert(tableName, { id: "cnpc2", name: "cnpc", title: "CNPC", index: 2 });
        await driver.insert(tableName, { id: "ptr1", name: "ptr", title: "PTR", index: 3 });
        await driver.insert(tableName, { id: "ptr2", name: "ptr", title: "PTR", index: 4 });

        let queryOptions: SteedosQueryOptions = tests[testIndex].options;
        expected = tests[testIndex].expected;
        try {
            result = await driver.find(tableName, queryOptions);
        }
        catch(ex){
            result = ex;
        }
        console.log(`${tests[testIndex].title} result:`);
        console.log(result);
    });

    afterEach(async () => {
        await driver.delete(tableName, "cnpc1");
        await driver.delete(tableName, "cnpc2");
        await driver.delete(tableName, "ptr1");
        await driver.delete(tableName, "ptr2");
    });

    tests.forEach(async (test) => {
        it(`arguments:${JSON.stringify(test)}`, async () => {
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
