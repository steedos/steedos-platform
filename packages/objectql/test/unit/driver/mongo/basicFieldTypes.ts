import { SteedosMongoDriver } from "../../../../src/driver";
import { expect } from 'chai';

let tableName = "mongo-driver-test-basic-field-types";
let driver = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });

describe('basic field types for mongo database', () => {
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "create one record",
            method: "insert",
            data: { text: "text", textarea: "textarea", int: 10, float: 46.25, date: new Date('2019-04-30T09:00:00.000Z'), datetime: new Date('2019-04-30T09:00:00.000Z'), bool: true },
            expected: {
                returnRecord: { text: "text", textarea: "textarea", int: 10, float: 46.25, date: new Date('2019-04-30T09:00:00.000Z'), datetime: new Date('2019-04-30T09:00:00.000Z'), bool: true }
            }
        },
        {
            title: "read one record",
            method: "findOne",
            id: "5cc7be06c783928584d1ebc3",
            queryOptions: {
                fields: ["text", "textarea", "int", "float", "date", "datetime", "bool"]
            },
            expected: {
                returnRecord: { text: "text", textarea: "textarea", int: 10, float: 46.25, bool: true }
            }
        }
    ];

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
                    if (result) {
                        if (result[key] instanceof Date) {
                            expect(result[key].getTime()).to.be.eq(expected.returnRecord[key].getTime());
                        }
                        else {
                            expect(result[key]).to.be.eq(expected.returnRecord[key]);
                        }
                    }
                });
            }
        });
    });
});

