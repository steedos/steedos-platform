import { SteedosMongoDriver } from "../../src/driver";
import { expect } from 'chai';

describe('respond with an array of app', () => {
    it('respond with an array of app', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert("app", { _id: "ptr", name: "ptr", title: "PTR" })
        await mongo.insert("app", { _id: "cnpc", name: "cnpc", title: "CNPC" })
        
        let queryOptions = {
            fields: ["_id","name"],
            filters: [["name", "=", "ptr"], ["title", "=", "PTR"]]
        };
        let result = await mongo.find("app", queryOptions);
        
        await mongo.delete("app", "ptr")
        await mongo.delete("app", "cnpc")
        expect(result).to.be.length(1);

    });
});