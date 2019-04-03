import { SteedosMongoDriver } from "../../../../src/driver";
import { expect } from 'chai';

let tableName = "mongo-driver-test-sort";

describe('fetch records for mongodb with sort arguments as a string that comply with odata-v4 protocol', () => {
    before(async ()=>{
        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.collection(tableName).deleteMany()
    });

    it('sort asc as default', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert(tableName, { _id: "ptr", name: "ptr", title: "PTR" })
        await mongo.insert(tableName, { _id: "cnpc", name: "cnpc", title: "CNPC" })

        let queryOptions = {
            fields: ["name"],
            sort: 'name'
        };
        let result1 = await mongo.find(tableName, queryOptions);

        queryOptions.sort = 'name asc'
        let result2 = await mongo.find(tableName, queryOptions);

        await mongo.delete(tableName, "ptr");
        await mongo.delete(tableName, "cnpc");
        expect(result1).to.be.length(2);
        expect(result1[0].name).to.be.eq("cnpc");
        expect(result1[1].name).to.be.eq("ptr");

        expect(JSON.stringify(result1)).to.be.eq(JSON.stringify(result2));
    });

    it('sort desc', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert(tableName, { _id: "cnpc", name: "cnpc", title: "CNPC" })
        await mongo.insert(tableName, { _id: "ptr", name: "ptr", title: "PTR" })

        let queryOptions = {
            fields: ["name"],
            sort: 'name desc'
        };
        let result = await mongo.find(tableName, queryOptions);

        await mongo.delete(tableName, "ptr");
        await mongo.delete(tableName, "cnpc");
        expect(result).to.be.length(2);
        expect(result[0].name).to.be.eq("ptr");
        expect(result[1].name).to.be.eq("cnpc");
    });

    it('multi sort', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert(tableName, { _id: "cnpc1", name: "cnpc", title: "CNPC", count: 68 })
        await mongo.insert(tableName, { _id: "cnpc2", name: "cnpc", title: "CNPC", count: 30 })
        await mongo.insert(tableName, { _id: "ptr1", name: "ptr", title: "PTR", count: 32 })
        await mongo.insert(tableName, { _id: "ptr2", name: "ptr", title: "PTR", count: 96 })

        let queryOptions = {
            fields: ["name"],
            sort: 'name desc,count'
        };
        let result = await mongo.find(tableName, queryOptions);

        await mongo.delete(tableName, "ptr1");
        await mongo.delete(tableName, "cnpc1");
        await mongo.delete(tableName, "ptr2");
        await mongo.delete(tableName, "cnpc2");
        expect(result).to.be.length(4);
        expect(result[0]._id).to.be.eq("ptr1");
        expect(result[1]._id).to.be.eq("ptr2");
        expect(result[2]._id).to.be.eq("cnpc2");
        expect(result[3]._id).to.be.eq("cnpc1");
    });

    it('multi sort error correction', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert(tableName, { _id: "cnpc1", name: "cnpc", title: "CNPC", count: 68 })
        await mongo.insert(tableName, { _id: "cnpc2", name: "cnpc", title: "CNPC", count: 30 })
        await mongo.insert(tableName, { _id: "ptr1", name: "ptr", title: "PTR", count: 32 })
        await mongo.insert(tableName, { _id: "ptr2", name: "ptr", title: "PTR", count: 96 })

        let queryOptions = {
            fields: ["name"],
            sort: 'name desc, count ,,'
        };
        let result = await mongo.find(tableName, queryOptions);

        await mongo.delete(tableName, "ptr1");
        await mongo.delete(tableName, "cnpc1");
        await mongo.delete(tableName, "ptr2");
        await mongo.delete(tableName, "cnpc2");
        expect(result).to.be.length(4);
        expect(result[0]._id).to.be.eq("ptr1");
        expect(result[1]._id).to.be.eq("ptr2");
        expect(result[2]._id).to.be.eq("cnpc2");
        expect(result[3]._id).to.be.eq("cnpc1");
    });
});
