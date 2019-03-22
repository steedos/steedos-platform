import { SteedosMongoDriver } from "../../src/driver";
import { expect } from 'chai';

describe('Test connection', () => {
    it('should return true', async () => {
      
        let driver = new SteedosMongoDriver(  "mongodb://127.0.0.1/steedos" );
        let queryOptions = {};
        let result = await driver.find("users", [["2"]], ["abc"], queryOptions);
        expect(result).to.equal(false);
      
  
    });
  });