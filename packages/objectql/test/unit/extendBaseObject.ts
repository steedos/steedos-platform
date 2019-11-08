import { expect } from 'chai';
import { SteedosSchema } from '../../src';

describe('Test MeteorMongoObject extend BaseObject', () => {
    let mySchema = new SteedosSchema({
        datasources: {
            default: {
                driver: 'mongo', 
                url: 'mongodb://127.0.0.1/steedos', 
                objectFiles: ["./test/unit/load2"]
            }
        },
        
    })

    it('extend permission_set', () => {
        mySchema.getDataSource().init()
        let object = mySchema.getObject("application_package")
        expect(object.toConfig().permission_set["none"].name).to.equal("none")
    });

  });