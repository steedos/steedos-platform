import { expect } from 'chai';
import { SteedosSchema } from '../../../src';
var path = require('path')
var _ =require("underscore")

describe('Test object extend', () => {
    it('extend return true', async () => {
        let mySchema = new SteedosSchema({
            datasources: {
                sqlite: {
                    driver: 'mongo', 
                    url: 'mongodb://127.0.0.1/steedos',
                    objectFiles: [path.resolve(__dirname, "./src")]
                }
            }
        })

        mySchema.getDataSource("sqlite").init();
  
        let accounts = mySchema.getObject('sqlite.accounts');

        expect(_.has(accounts.toConfig().fields, "company_id")).to.equal(true)
    });
  });