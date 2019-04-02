import { SteedosSqlite3Driver } from "../../../../src/driver";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestSortForSqlite4";

describe('fetch records for sqlite4 with sort arguments as a string that comply with odata-v4 protocol', () => {
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

    it('sort asc as default', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR" })
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC" })

        let queryOptions = {
            fields: ["name"],
            sort: 'name'
        };
        let result1 = await driver.find(tableName, queryOptions);
        console.log("fetch records with sort arguments result:");
        console.log(result1);

        queryOptions.sort = 'name asc'
        let result2 = await driver.find(tableName, queryOptions);

        await driver.delete(tableName, "ptr");
        await driver.delete(tableName, "cnpc");
        expect(result1).to.be.length(2);
        expect(result1[0].name).to.be.eq("cnpc");
        expect(result1[1].name).to.be.eq("ptr");

        expect(JSON.stringify(result1)).to.be.eq(JSON.stringify(result2));
    
    });

    it('sort desc', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC" })
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR" })

        let queryOptions = {
            fields: ["name"],
            sort: 'name desc'
        };
        let result = await driver.find(tableName, queryOptions);
        console.log("fetch records with sort arguments result:");
        console.log(result);

        await driver.delete(tableName, "ptr");
        await driver.delete(tableName, "cnpc");
        expect(result).to.be.length(2);
        expect(result[0].name).to.be.eq("ptr");
        expect(result[1].name).to.be.eq("cnpc");
    });

    it('multi sort', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "cnpc1", name: "cnpc", title: "CNPC", count: 68 })
        await driver.insert(tableName, { id: "cnpc2", name: "cnpc", title: "CNPC", count: 30 })
        await driver.insert(tableName, { id: "ptr1", name: "ptr", title: "PTR", count: 32 })
        await driver.insert(tableName, { id: "ptr2", name: "ptr", title: "PTR", count: 96 })

        let queryOptions = {
            fields: ["id", "name"],
            sort: 'name desc,count'
        };
        let result = await driver.find(tableName, queryOptions);
        console.log("fetch records with sort arguments result:");
        console.log(result);

        await driver.delete(tableName, "ptr1");
        await driver.delete(tableName, "cnpc1");
        await driver.delete(tableName, "ptr2");
        await driver.delete(tableName, "cnpc2");
        expect(result).to.be.length(4);
        expect(result[0].id).to.be.eq("ptr1");
        expect(result[1].id).to.be.eq("ptr2");
        expect(result[2].id).to.be.eq("cnpc2");
        expect(result[3].id).to.be.eq("cnpc1");
    });

    it('multi sort error correction', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.connect();
        await driver.insert(tableName, { id: "cnpc1", name: "cnpc", title: "CNPC", count: 68 })
        await driver.insert(tableName, { id: "cnpc2", name: "cnpc", title: "CNPC", count: 30 })
        await driver.insert(tableName, { id: "ptr1", name: "ptr", title: "PTR", count: 32 })
        await driver.insert(tableName, { id: "ptr2", name: "ptr", title: "PTR", count: 96 })

        let queryOptions = {
            fields: ["id", "name"],
            sort: 'name desc, count ,,'
        };
        let result = await driver.find(tableName, queryOptions);
        console.log("fetch records with sort arguments result:");
        console.log(result);

        await driver.delete(tableName, "ptr1");
        await driver.delete(tableName, "cnpc1");
        await driver.delete(tableName, "ptr2");
        await driver.delete(tableName, "cnpc2");
        expect(result).to.be.length(4);
        expect(result[0].id).to.be.eq("ptr1");
        expect(result[1].id).to.be.eq("ptr2");
        expect(result[2].id).to.be.eq("cnpc2");
        expect(result[3].id).to.be.eq("cnpc1");
    });
});
