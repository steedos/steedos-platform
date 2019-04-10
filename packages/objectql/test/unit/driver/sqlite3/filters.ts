import { SteedosSqlite3Driver } from "../../../../src/driver";
import { SteedosQueryOptions } from "../../../../src/types/query";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestFiltersForSqlite3";
let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });

describe('filters for sqlite3 database', () => {
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
        result = await driver.run(`select count(*) as count from sqlite_master where type = 'table' and name = '${tableName}'`);
        expect(result[0].count).to.be.not.eq(undefined);
        if (result[0].count) {
            await driver.run(`DROP TABLE ${tableName}`);
        }
        await driver.run(`
            CREATE TABLE ${tableName}(
                [id] TEXT primary key,
                [name] TEXT,
                [title] TEXT,
                [count] INTEGER
            );
        `);
    });

    beforeEach(async () => {
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC" });

        let queryOptions: SteedosQueryOptions = tests[testIndex].options;
        expected = tests[testIndex].expected;
        let functionName: string = tests[testIndex].function;
        try {
            if (functionName){
                result = await driver[functionName](tableName, queryOptions);
            }
            else{
                result = await driver.find(tableName, queryOptions);
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
        it(`arguments:${JSON.stringify(test)}`, async () => {
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

