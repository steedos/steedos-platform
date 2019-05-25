import { expect } from 'chai';
import { SteedosSchema } from '../../src';
var path = require('path')

describe('Test MeteorMongoObject extend BaseObject', () => {
    let mySchema = new SteedosSchema({
        datasources: {
            default: {
                driver: 'meteor-mongo', 
                url: 'mongodb://127.0.0.1/steedos', 
                objectFiles: [path.resolve(__dirname, "./load2")]
            }
        },
        
    })

    it('extend permission_set', async () => {
        let object = mySchema.getObject("application_package")
        expect(object.toConfig().permission_set["none"].name).to.equal("none")
    });

  });