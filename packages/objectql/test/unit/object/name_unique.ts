import { expect } from 'chai';
import { SteedosSchema } from '../../../src';
var path = require('path')

describe('Test object name is unique', () => {
    let mySchema = new SteedosSchema({
        datasources: {
            mongo: {
                driver: 'mongo', 
                url: 'mongodb://127.0.0.1/steedos',
                objectFiles: [path.resolve(__dirname, "./src")]
            },
            mongo2: {
                driver: 'mongo', 
                url: 'mongodb://127.0.0.1/steedos',
                objectFiles: [path.resolve(__dirname, "./src")]
            },
            mongo3: {
                driver: 'mongo', 
                url: 'mongodb://127.0.0.1/steedos',
                objectFiles: [path.resolve(__dirname, "./src3")]
            }
        }
    })
    mySchema.getDataSource("mongo").init();
    it('name is unique check', () => {
        
        let nameRepeatTest = false
        try {
            mySchema.getDataSource("mongo2").init()
        } catch (error) {
            if(error.message.indexOf("is unique") > -1){
                nameRepeatTest = true
            }
        }
        expect(nameRepeatTest).to.equal(true)
    });

    it('name is unique use',  () => {
        mySchema.getDataSource("mongo3").init();
        let accounts3IsUndefined = true
        let accounts3 = mySchema.getObject("accounts3")
        if(accounts3){
            accounts3IsUndefined = false
        }
        expect(accounts3IsUndefined).to.equal(false)
    });
  });