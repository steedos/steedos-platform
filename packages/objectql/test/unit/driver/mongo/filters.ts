import { SteedosMongoDriver } from "../../../../src/driver";
import { expect } from 'chai';
import { SteedosQueryOptions } from "../../../../src/types/query";

let tableName = "mongo-driver-test-filters";
let driver = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });

describe('filters for mongo database', () => {
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "filter records with filters",
            options: {
                fields: ["id", "name"],
                filters: [["name", "=", "ptr"], ["title", "=", "This is PTR"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with odata query string",
            options: {
                fields: ["id", "name"],
                filters: "(name eq 'ptr') and (title eq 'This is PTR')"
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with empty array",
            options: {
                fields: ["id", "name"],
                filters: []
            },
            expected: {
                length: 2
            }
        },
        {
            title: "filter records with empty string",
            options: {
                fields: ["id", "name"],
                filters: ""
            },
            expected: {
                length: 2
            }
        },
        {
            title: "filter records with operator: >",
            options: {
                fields: ["id", "name"],
                filters: [["count", ">", 20]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: >=",
            options: {
                fields: ["id", "name"],
                filters: [["count", ">=", 120]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: <",
            options: {
                fields: ["id", "name"],
                filters: [["count", "<", 100]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: <=",
            options: {
                fields: ["id", "name"],
                filters: [["count", "<=", 18]]
            },
            expected: {
                length: 1
            }
        },
        // {
        //     title: "filter records with operator: between",
        //     options: {
        //         fields: ["id", "name"],
        //         filters: [["count", "between", [10, 100]]]
        //     },
        //     expected: {
        //         length: 1
        //     }
        // },
        {
            title: "filter records with operator: startswith",
            options: {
                fields: ["id", "name"],
                filters: [["name", "startswith", "cn"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: notstartswith",
            options: {
                fields: ["id", "name"],
                filters: [["name", "notstartswith", "cn"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: endswith",
            options: {
                fields: ["id", "name"],
                filters: [["name", "endswith", "pc"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: notendswith",
            options: {
                fields: ["id", "name"],
                filters: [["name", "notendswith", "pc"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: contains",
            options: {
                fields: ["id", "name"],
                filters: [["name", "contains", "p"]]
            },
            expected: {
                length: 2
            }
        },
        {
            title: "filter records with operator: eq and contains",
            options: {
                fields: ["id", "name"],
                filters: [["title", "=", "This is PTR"], ["name", "contains", "p"]]
            },
            expected: {
                length: 1
            }
        },
        {
            title: "filter records with operator: notcontains",
            options: {
                fields: ["id", "name"],
                filters: [["name", "notcontains", "cn"]]
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
                filters: [["name", "=", "ptr"], ["title", "=", "This is PTR"]]
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
                filters: "(name eq 'ptr') and (title eq 'This is PTR')"
            },
            expected: {
                eq: 1
            }
        }
    ];

    before(async () => {
    });

    beforeEach(async () => {
        await driver.insert(tableName, { _id: "ptr", name: "ptr", title: "This is PTR", count: 120 });
        await driver.insert(tableName, { _id: "cnpc", name: "cnpc", title: "This is CNPC", count: 18 });

        let queryOptions: SteedosQueryOptions = tests[testIndex].options;
        expected = tests[testIndex].expected;
        let functionName: string = tests[testIndex].function;
        try {
            if (functionName) {
                result = await driver[functionName](tableName, queryOptions);
            }
            else {
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
        });
    });
});

