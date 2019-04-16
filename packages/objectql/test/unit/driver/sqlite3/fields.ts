import { SteedosSqlite3Driver } from "../../../../src/driver";
import { SteedosQueryOptions } from "../../../../src/types/query";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestFieldsForSqlite3";
let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });

describe('fetch records width specific fields for sqlite3 database', () => {
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
            title: "fields arguments is a array",
            options: {
                fields: ["name", "title"]
            },
            expected: {
                length: 2,
                firstRecord:{
                    name: "ptr",
                    title: "PTR",
                    tag: undefined
                }
            }
        },
        {
            title: "fields arguments is a string",
            options: {
                fields: "name, title, "
            },
            expected: {
                length: 2,
                firstRecord: {
                    name: "ptr",
                    title: "PTR",
                    tag: undefined
                }
            }
        },
        // {
        //     title: "fields must not be undefined or empty",
        //     options: {
        //         fields: []
        //     },
        //     expected: {
        //         error: 'fields must not be undefined or empty'
        //     }
        // }
    ];

    before(async () => {
        let objects = {
            test: {
                label: 'Sqlite3 Schema',
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
                    tag: {
                        label: '数量',
                        type: 'text'
                    }
                }
            }
        };
        await driver.registerEntities(objects);
    });

    beforeEach(async () => {
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR", tag: "one" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC", tag: "one" });

        let queryOptions: SteedosQueryOptions = tests[testIndex].options;
        expected = tests[testIndex].expected;
        try {
            result = await driver.find(tableName, queryOptions);
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
            if (expected.firstRecord !== undefined) {
                Object.keys(expected.firstRecord).forEach((key) => {
                    expect(result[0][key]).to.be.eq(expected.firstRecord[key]);
                });
            }
        });
    });
});
