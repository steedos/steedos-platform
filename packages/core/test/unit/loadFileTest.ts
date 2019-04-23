import { expect } from 'chai';
import { getObjectConfigManager } from '../../src'
// var util = require("../../src/util");
var path = require("path");

describe.only('load field file', () => {
    it('should return true', () => {
        // let apps = util.loadFile(path.resolve(__dirname, "../../../standard-objects/apps.object.yml"));
        // console.log('apps', apps);
        getObjectConfigManager().createFromFile(path.resolve(__dirname, "../../../standard-objects/apps.object.yml"))
        // let Creator = getCreator();
        // console.log('Creator.Objects', Creator.Objects);
        expect(1).to.equal(1)
    });
});
