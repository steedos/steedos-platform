import { SteedosMongoDriver } from "../../src/driver";
import { expect } from 'chai';

describe('respond with an array of apps_auths', () => {
    it('respond with an array of apps_auths', async () => {

        let mongo = new SteedosMongoDriver({url:"mongodb://192.168.0.21/fssh20181214"});
        await mongo.connect();
        let queryOptions = {
            fields: ["_id","name"],
            filters: [["name", "=", "ptr"], ["title", "=", "PTR"]]
        };
        let result = await mongo.find("apps_auths", queryOptions);
        expect(result).to.be.length.greaterThan(0);

    });
});