import { expect } from 'chai';
let objectql = require("../../src")


describe('Load loadSteedosConfig Test', () => {
    it('loadSteedosConfig return true', async () => {
        let config = objectql.getSteedosConfig();
        let config2 = objectql.getSteedosConfig();
        expect(config).to.equal(config2)  && expect(config.datasources.default.connection.url).to.equal("mongodb://127.0.0.1/steedos")
    });
  });