import { SteedosSqlite3Driver } from "../../../../src/driver";
import { expect } from 'chai';

let databaseUrl = "sqlite-test.db";
// let databaseUrl = ':memory:';
let tableName = "TestCrudForSqlite4";

describe('crud for sqlite3 database', () => {
    before(async ()=>{
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.get(`select count(*) as count from sqlite_master where type = 'table' and name = '${tableName}'`);
        console.log("insert data to sqlite3 database before check table count result:");
        console.log(result);
        expect(result.count).to.be.not.eq(undefined);
        if (result.count){
            await sqlite3.run(`DROP TABLE ${tableName}`);
        }
        await sqlite3.run(`
            CREATE TABLE ${tableName}(
                [id] TEXT primary key,
                [name] TEXT,
                [title] TEXT,
                [count] INTEGER
            );
        `);
    });

    it('create one record', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result:any = await sqlite3.insert(tableName, { id: "ptr", name: "ptr", title: "PTR", count: 46 })

        console.log("crud for sqlite3 database result:");
        console.log(result);
        expect(result.changes).to.be.eq(1);
    });

    it('update one record', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.update(tableName, "ptr", { name: "ptr-", title: "PTR-", count: 460 })

        console.log("crud for sqlite3 database result:");
        console.log(result);
        expect(result.changes).to.be.eq(1);
    });

    it('read one record', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let queryOptions = {
            fields: ["name", "count"]
        };
        let result: any = await sqlite3.findOne(tableName, "ptr", queryOptions);

        console.log("crud for sqlite3 database result:");
        console.log(result);
        expect(result.name).to.be.eq("ptr-");
        expect(result.count).to.be.eq(460);
    });

    it('delete one record', async () => {
        let sqlite3 = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await sqlite3.delete(tableName, "ptr");

        console.log("crud for sqlite3 database result:");
        console.log(result);
        expect(result.changes).to.be.eq(1);
    });
});
