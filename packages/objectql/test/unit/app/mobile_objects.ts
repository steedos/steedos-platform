import { expect } from 'chai';
import { SteedosSchema } from '../../../src';
var _ =require("underscore")

describe('Test App mobile_objects', () => {
    it('App mobile_objects return true', async () => {
        let mySchema = new SteedosSchema({
            datasources: {
                mongo: {
                    driver: 'mongo', 
                    url: 'mongodb://127.0.0.1/steedos',
                    apps: {
                        test: {
                            _id: "test",
                            name: "Test",
                            description: "Test",
                            icon_slds: "",
                            objects: ["test"],
                            mobile_objects: ["test"]
                        }
                    },
                }
            }
        })

        mySchema.getDataSource("mongo").init();
  
        let testApp = mySchema.getDataSource("mongo").getApp("test")
        expect(_.isEmpty(testApp.toConfig().mobile_objects)).to.equal(false)
    });
  });