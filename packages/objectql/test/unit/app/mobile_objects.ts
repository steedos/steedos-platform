import { expect } from 'chai';
import { addAppConfig, getAppConfig } from '../../../src';
var _ =require("underscore")

describe('Test App mobile_objects', () => {
    it('App mobile_objects return true', async () => {

        addAppConfig({
            _id: "test",
            name: "Test",
            description: "Test",
            icon_slds: "",
            objects: ["test"],
            mobile_objects: ["test"]
        })

        let testApp: any = getAppConfig("test")
        expect(_.isEmpty(testApp.mobile_objects)).to.equal(false)
    });
  });