import { SteedosMongoDriver } from "../../../../src/driver";
import { expect } from 'chai';

let tableName = "mongo-driver-test-fields";

describe('fetch records width specific fields', () => {
    before(async ()=>{
        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.collection(tableName).deleteMany()
    });

    it('fetch only some specific fields', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert(tableName, { _id: "ptr", name: "ptr", title: "PTR" })
        await mongo.insert(tableName, { _id: "cnpc", name: "cnpc", title: "CNPC" })

        let queryOptions = {
            fields: ["name"]
        };
        let result = await mongo.find(tableName, queryOptions);
        console.log("fetch records width specific fields result:");
        console.log(result);

        await mongo.delete(tableName, "ptr");
        await mongo.delete(tableName, "cnpc");
        expect(result).to.be.length(2);
        expect(result[0].name).to.be.eq("ptr");
        expect(result[0].title).to.be.eq(undefined);
    });
    it('fetch all fields', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert(tableName, { _id: "ptr", name: "ptr", title: "PTR" })
        await mongo.insert(tableName, { _id: "cnpc", name: "cnpc", title: "CNPC" })

        let queryOptions = {
            fields: []
        };
        let result = await mongo.find(tableName, queryOptions);
        console.log("fetch records width specific fields result:");
        console.log(result);

        await mongo.delete(tableName, "ptr");
        await mongo.delete(tableName, "cnpc");
        expect(result).to.be.length(2);
        expect(result[0].name).to.be.eq("ptr");
        expect(result[0].title).to.be.eq("PTR");
    });
});
