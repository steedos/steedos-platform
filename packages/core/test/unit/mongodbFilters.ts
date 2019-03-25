import { SteedosMongoDriver } from "../../src/driver";
import { expect } from 'chai';

describe('respond with an array of app', () => {
    it('respond with an array of app', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert("apps", { _id: "ptr", name: "ptr", title: "PTR" })
        await mongo.insert("apps", { _id: "cnpc", name: "cnpc", title: "CNPC" })
        
        let queryOptions = {
            fields: ["_id","name"],
            filters: "(name eq 'ptr') or (name eq 'cnpcccc')"
        };
        let result = await mongo.find("apps", queryOptions);
        console.log(result)
        
        await mongo.delete("apps", "ptr")
        await mongo.delete("apps", "cnpc")
        expect(result).to.be.length(1);

    });
});