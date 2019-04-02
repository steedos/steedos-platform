import { SteedosSqlite3Driver } from "../../../../src/driver";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestFiltersForSqlite4";

describe('filters for sqlite3 database', () => {
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
                [count] INTEGER
            );
        `);
    });

    it('filter records with filters', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC" });

        let queryOptions = {
            fields: ["id", "name"],
            filters: [["name", "=", "ptr"], ["title", "=", "PTR"]]
        };
        let result = await driver.find(tableName, queryOptions);
        console.log("filter records with simple filters result:");
        console.log(result);

        await driver.delete(tableName, "ptr");
        await driver.delete(tableName, "cnpc");
        expect(result).to.be.length(1);

    });

    it('filter records with odata query string', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC" });

        let queryOptions = {
            fields: ["id", "name"],
            filters: "(name eq 'ptr') and (title eq 'PTR')"
        };
        let result = await driver.find(tableName, queryOptions);
        console.log("filter records with simple filters result:");
        console.log(result);

        await driver.delete(tableName, "ptr");
        await driver.delete(tableName, "cnpc");
        expect(result).to.be.length(1);
    });

    it('filter records count with filters or odata query string', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC" });

        let queryOptions1 = {
            fields: ["id", "name"],
            filters: [["name", "=", "ptr"], ["title", "=", "PTR"]]
        };
        let result1 = await driver.count(tableName, queryOptions1);
        console.log("filter records with simple filters result:");
        console.log(result1);

        let queryOptions2 = {
            fields: ["id", "name"],
            filters: "(name eq 'ptr') and (title eq 'PTR')"
        };
        let result2 = await driver.count(tableName, queryOptions2);

        await driver.delete(tableName, "ptr");
        await driver.delete(tableName, "cnpc");
        expect(result1).to.be.eq(1);
        expect(result1).to.be.eq(result2);

    });
});
