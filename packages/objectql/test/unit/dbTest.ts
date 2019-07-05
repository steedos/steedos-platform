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
                    objectFiles: [path.resolve(__dirname, "./load")]
                }
            }
        })

        let users = mySchema.getObject('users')
        let random = new Date().getTime();
        let id = `test_users_${random}`;
        await users.insert({ _id: id, name: "test", steedos_id: `${id}@test.com`})
        let result = await users.findOne(id, {fields: ['_id']})
        await users.delete(id)

        // let apps = mySchema.getObject("apps")
        // console.log('apps', typeof apps.getField('objects').optionsFunction, typeof function(a,b){console.log('1111')});

        expect(result._id).to.equal(id)

    });
  });