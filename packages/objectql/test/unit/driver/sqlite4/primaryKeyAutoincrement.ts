
import { SteedosSqlite3Driver } from "../../../../src/driver";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestPrimaryKeyForSqlite4";

describe('primary key autoincrement test for sqlite3 database', () => {
    before(async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.get(`select count(*) as count from sqlite_master where type = 'table' and name = '${tableName}'`);
        console.log("insert data to sqlite3 database before check table count result:");
        console.log(result);
        expect(result.count).to.be.not.eq(undefined);
        if (result.count) {
            await sqlite3.run(`DROP TABLE ${tableName}`);
        }
        await sqlite3.run(`
            CREATE TABLE ${tableName}(
                [id] INTEGER primary key autoincrement,
                [name] TEXT,
                [title] TEXT,
                [count] INTEGER
            );
        `);
    });

    it('create the first record', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.insert(tableName, { name: "ptr", title: "PTR", count: 46 });

        console.log("primary key autoincrement test for sqlite3 database result:");
        console.log(result);
        expect(result.lastID).to.be.eq(1);
    });

    it('create the second record', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.insert(tableName, { name: "ptr", title: "PTR", count: 46 });

        console.log("primary key autoincrement test for sqlite3 database result:");
        console.log(result);
        expect(result.lastID).to.be.eq(2);
    });

    it('create the third record with id value', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.insert(tableName, { id: 5, name: "ptr", title: "PTR", count: 46 });

        console.log("primary key autoincrement test for sqlite3 database result:");
        console.log(result);
        expect(result.lastID).to.be.eq(5);
    });

    it('create the fourth record', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.insert(tableName, { name: "ptr", title: "PTR", count: 46 });

        console.log("primary key autoincrement test for sqlite3 database result:");
        console.log(result);
        expect(result.lastID).to.be.eq(6);
    });

    it('delete all records from the table', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.run(`DELETE FROM ${tableName}`);

        console.log("primary key autoincrement test for sqlite3 database result:");
        console.log(result);
        expect(result.lastID).to.be.eq(0);
    });

    it('recreate the first record', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.insert(tableName, { name: "ptr", title: "PTR", count: 46 });

        console.log("primary key autoincrement test for sqlite3 database result:");
        console.log(result);
        expect(result.lastID).to.be.eq(7);
    });

    it('truncate the table', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await sqlite3.run(`DELETE FROM ${tableName}`);
        let result: any = await sqlite3.run(`DELETE FROM sqlite_sequence WHERE name='${tableName}'`);

        console.log("primary key autoincrement test for sqlite3 database result:");
        console.log(result);
        expect(result.lastID).to.be.eq(0);
    });

    it('recreate the first record again', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.insert(tableName, { name: "ptr", title: "PTR", count: 46 });

        console.log("primary key autoincrement test for sqlite3 database result:");
        console.log(result);
        expect(result.lastID).to.be.eq(1);
    });

});
