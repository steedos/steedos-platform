import { SteedosMongoDriver } from "../../src/driver";
import { expect } from 'chai';

describe('Test connection', () => {
    it('should return true', async () => {
      
        let driver = new SteedosMongoDriver( "mongodb://127.0.0.1/steedos" );
        let queryOptions = {
            fields: ["_id"],
            filters: ["_id", "=", "-10"]
        };
        let result = await driver.find("users", queryOptions);
        expect(result).to.be.length(0);
  
    });
  });