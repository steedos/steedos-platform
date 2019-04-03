import { SteedosMongoDriver } from "../../../../src/driver";
import { expect } from 'chai';

describe('filter records with simple filters', () => {
    it('filter records with simple filters', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert("apps", { _id: "ptr", name: "ptr", title: "PTR" })
        await mongo.insert("apps", { _id: "cnpc", name: "cnpc", title: "CNPC" })

        let queryOptions = {
            fields: ["_id", "name"],
            filters: [["name", "=", "ptr"], ["title", "=", "PTR"]]
        };
        let result = await mongo.find("apps", queryOptions);

        await mongo.delete("apps", "ptr");
        await mongo.delete("apps", "cnpc");
        expect(result).to.be.length(1);

    });
});

describe('filter records with odata query string', () => {
    it('filter records with odata query string', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert("apps", { _id: "ptr", name: "ptr", title: "PTR" })
        await mongo.insert("apps", { _id: "cnpc", name: "cnpc", title: "CNPC" })

        let queryOptions = {
            fields: ["_id", "name"],
            filters: "(name eq 'ptr') and (title eq 'PTR')"
        };
        let result = await mongo.find("apps", queryOptions);

        await mongo.delete("apps", "ptr");
        await mongo.delete("apps", "cnpc");
        expect(result).to.be.length(1);

    });
});

describe('filter records count with odata query string', () => {
    it('filter records count with odata query string', async () => {

        let mongo = new SteedosMongoDriver({ url: "mongodb://127.0.0.1/steedos" });
        await mongo.connect();
        await mongo.insert("apps", { _id: "ptr", name: "ptr", title: "PTR" })
        await mongo.insert("apps", { _id: "cnpc", name: "cnpc", title: "CNPC" })

        let queryOptions = {
            fields: ["_id", "name"],
            filters: "(name eq 'ptr') and (title eq 'PTR')"
        };
        let result = await mongo.count("apps", queryOptions);

        await mongo.delete("apps", "ptr");
        await mongo.delete("apps", "cnpc");
        expect(result).to.be.eq(1);

    });
});