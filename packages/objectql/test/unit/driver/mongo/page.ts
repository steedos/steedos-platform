import { SteedosMongoDriver } from "../../../../src/driver";
import { expect } from 'chai';

let tableName = "mongo-driver-test-page";

describe('fetch records by paging for mongo database', () => {
    before(async ()=>{
        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.collection(tableName).deleteMany()
    });

    it('top', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert(tableName, { _id: "cnpc1", name: "cnpc", title: "CNPC", index: 1 });
        await mongo.insert(tableName, { _id: "cnpc2", name: "cnpc", title: "CNPC", index: 2 });
        await mongo.insert(tableName, { _id: "ptr1", name: "ptr", title: "PTR", index: 3 });
        await mongo.insert(tableName, { _id: "ptr2", name: "ptr", title: "PTR", index: 4 });

        let queryOptions = {
            fields: ["name"],
            top: 2
        };
        let result = await mongo.find(tableName, queryOptions);

        await mongo.delete(tableName, "ptr1");
        await mongo.delete(tableName, "cnpc1");
        await mongo.delete(tableName, "ptr2");
        await mongo.delete(tableName, "cnpc2");
        expect(result).to.be.length(2);
    });

    it('skip', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert(tableName, { _id: "cnpc1", name: "cnpc", title: "CNPC", index: 1 });
        await mongo.insert(tableName, { _id: "cnpc2", name: "cnpc", title: "CNPC", index: 2 });
        await mongo.insert(tableName, { _id: "ptr1", name: "ptr", title: "PTR", index: 3 });
        await mongo.insert(tableName, { _id: "ptr2", name: "ptr", title: "PTR", index: 4 });

        let queryOptions = {
            fields: ["name"],
            sort: 'index',
            skip: 2
        };
        let result = await mongo.find(tableName, queryOptions);

        await mongo.delete(tableName, "ptr1");
        await mongo.delete(tableName, "cnpc1");
        await mongo.delete(tableName, "ptr2");
        await mongo.delete(tableName, "cnpc2");
        expect(result).to.be.length(2);
        expect(result[0]._id).to.be.eq("ptr1");
    });

    it('top and skip for paging', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert(tableName, { _id: "cnpc1", name: "cnpc", title: "CNPC", index: 1 });
        await mongo.insert(tableName, { _id: "cnpc2", name: "cnpc", title: "CNPC", index: 2 });
        await mongo.insert(tableName, { _id: "ptr1", name: "ptr", title: "PTR", index: 3 });
        await mongo.insert(tableName, { _id: "ptr2", name: "ptr", title: "PTR", index: 4 });

        let queryOptions = {
            fields: ["name"],
            sort: 'index',
            top: 2,
            skip: 3
        };
        let result = await mongo.find(tableName, queryOptions);

        await mongo.delete(tableName, "ptr1");
        await mongo.delete(tableName, "cnpc1");
        await mongo.delete(tableName, "ptr2");
        await mongo.delete(tableName, "cnpc2");
        expect(result).to.be.length(1);
        expect(result[0]._id).to.be.eq("ptr2");
    });
});
