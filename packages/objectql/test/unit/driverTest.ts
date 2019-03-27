import { SteedosMongoDriver } from "../../src/driver";
import { expect } from 'chai';

describe('Test connection', () => {
    it('should return true', async () => {
      
        let mongo = new SteedosMongoDriver( {url: "mongodb://127.0.0.1/steedos"} );
        await mongo.connect();
        let queryOptions = {
            fields: ["_id"],
            filters: ["_id", "=", "-10"]
        };
        let result = await mongo.find("users", queryOptions);
        expect(result).to.be.length(0);
  
    });
  });