import { expect } from 'chai';
import { SteedosSchema, SteedosDatabaseDriverType } from '../../src';
var path = require('path')

describe('Test db', () => {
    it('should return true', async () => {
        let mySchema = new SteedosSchema({
            datasources: {
                default: {
                    driver: SteedosDatabaseDriverType.Mongo, 
                    url: 'mongodb://127.0.0.1/steedos',
                    objectFiles: [path.resolve(__dirname, "../../../standard-objects")]
                }
            }
        })

        let users = mySchema.getObject('users')
        await users.insert({_id: "test_users", name: "test", steedos_id: 'test_users@test.com'})
        let result = await users.findOne('test_users', {fields: ['_id']})
        await users.delete("test_users")

        // let apps = mySchema.getObject("apps")
        // console.log('apps', typeof apps.getField('objects').optionsFunction, typeof function(a,b){console.log('1111')});

        expect(result._id).to.equal('test_users')

    });
  });