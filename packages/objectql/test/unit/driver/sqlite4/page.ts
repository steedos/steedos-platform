import { SteedosSqlite3Driver } from "../../../../src/driver";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestPageForSqlite4";

describe('fetch records by paging for sqlite4 database', () => {
    before(async () => {
        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await driver.get(`select count(*) as count from sqlite_master where type = 'table' and name = '${tableName}'`);
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

    it('top', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "cnpc1", name: "cnpc", title: "CNPC", index: 1 });
        await driver.insert(tableName, { id: "cnpc2", name: "cnpc", title: "CNPC", index: 2 });
        await driver.insert(tableName, { id: "ptr1", name: "ptr", title: "PTR", index: 3 });
        await driver.insert(tableName, { id: "ptr2", name: "ptr", title: "PTR", index: 4 });

        let queryOptions = {
            fields: ["name"],
            top: 2
        };
        let result = await driver.find(tableName, queryOptions);
        console.log("fetch records by paging result:");
        console.log(result);

        await driver.delete(tableName, "ptr1");
        await driver.delete(tableName, "cnpc1");
        await driver.delete(tableName, "ptr2");
        await driver.delete(tableName, "cnpc2");
        expect(result).to.be.length(2);

    });

    it('skip', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "cnpc1", name: "cnpc", title: "CNPC", index: 1 });
        await driver.insert(tableName, { id: "cnpc2", name: "cnpc", title: "CNPC", index: 2 });
        await driver.insert(tableName, { id: "ptr1", name: "ptr", title: "PTR", index: 3 });
        await driver.insert(tableName, { id: "ptr2", name: "ptr", title: "PTR", index: 4 });

        let queryOptions = {
            fields: ["id", "name"],
            sort: 'index',
            skip: 2
        };
        let result: any = "";
        try {
            result = await driver.find(tableName, queryOptions);
        }
        catch (ex) {
            result = "top must not be empty for skip";
        }
        console.log("fetch records by paging result:");
        console.log(result);
       
        await driver.delete(tableName, "ptr1");
        await driver.delete(tableName, "cnpc1");
        await driver.delete(tableName, "ptr2");
        await driver.delete(tableName, "cnpc2");
        expect(result).to.be.eq("top must not be empty for skip");

    });

    it('top and skip for paging', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "cnpc1", name: "cnpc", title: "CNPC", index: 1 });
        await driver.insert(tableName, { id: "cnpc2", name: "cnpc", title: "CNPC", index: 2 });
        await driver.insert(tableName, { id: "ptr1", name: "ptr", title: "PTR", index: 3 });
        await driver.insert(tableName, { id: "ptr2", name: "ptr", title: "PTR", index: 4 });

        let queryOptions = {
            fields: ["id", "name"],
            sort: 'index',
            top: 2,
            skip: 3
        };
        let result = await driver.find(tableName, queryOptions);
        console.log("fetch records by paging result:");
        console.log(result);

        await driver.delete(tableName, "ptr1");
        await driver.delete(tableName, "cnpc1");
        await driver.delete(tableName, "ptr2");
        await driver.delete(tableName, "cnpc2");
        expect(result).to.be.length(1);
        expect(result[0].id).to.be.eq("ptr2");
    });
});
