import { SteedosMongoDriver } from "../../../../src/driver";
import { expect } from 'chai';

let tableName = "mongo-driver-test-crud";
let driver = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });

describe('crud for mongo database', () => {
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
            title: "create one record",
            method: "insert",
            data: { _id: "ptr", name: "ptr", title: "PTR", count: 46 },
            expected: {
                returnRecord: { _id: "ptr", name: "ptr", title: "PTR", count: 46 }
            }
        },
        {
            title: "update one record",
            method: "update",
            _id: "ptr",
            data: { name: "ptr-", title: "PTR-", count: 460 },
            expected: {
                returnRecord: { _id: 'ptr', name: 'ptr-', title: 'PTR-', count: 460 }
            }
        },
        {
            title: "read one record",
            method: "findOne",
            _id: "ptr",
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
            _id: "ptr",
            expected: {
                eq: undefined
            }
        }
    ];

    beforeEach(async () => {
        let data = tests[testIndex].data;
        expected = tests[testIndex].expected;
        let method = tests[testIndex].method;
        let _id = tests[testIndex]._id;
        let queryOptions = tests[testIndex].queryOptions;
        if (_id) {
            result = await driver[method](tableName, _id, data || queryOptions).catch((ex: any) => { console.error(ex); return false; });
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
            if (expected.eq !== undefined) {
                expect(result).to.be.eq(expected.eq);
            }
            if (expected.gt !== undefined) {
                expect(result).to.be.gt(expected.gt);
            }
            if (expected.returnRecord !== undefined) {
                Object.keys(expected.returnRecord).forEach((key) => {
                    expect(result[key]).to.be.eq(expected.returnRecord[key]);
                });
            }
        });
    });
});
