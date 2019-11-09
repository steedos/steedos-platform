import { expect } from 'chai';
let objectql = require("../../src")
let path = require("path");


describe('Load StedosConfig Test', () => {
    it('LoadStedosConfigTest return true', async () => {
        let datasource = objectql.getDataSource()
        objectql.addObjectConfigFiles(path.join(__dirname, "../../apps/contracts/src/**"), 'default');
        datasource.init()
        let permission_set = objectql.getObject("permission_set")
        objectql.addAppConfigFiles(path.join(process.cwd(), "../../apps/contracts/src/**"))
        let apps = objectql.getAppConfigs()
        let record = objectql.getConfigs('spaces');
        expect(permission_set != undefined).to.equal(true) && expect(apps != undefined).to.equal(true) && expect(record != undefined).to.equal(true)
    });
  });