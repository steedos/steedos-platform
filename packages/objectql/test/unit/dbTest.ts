import { expect } from 'chai';
import { SteedosSchema } from '../../src';
var path = require('path')

describe('Test db', () => {
    it('should return true', async () => {
        let mySchema = new SteedosSchema({objects: {}, datasource: {driver: 'mongo', url: 'mongodb://127.0.0.1/steedos'}})
        mySchema.use(path.resolve(__dirname, "../../../standard-objects"))

        //await mySchema.connect()
  
        let users = mySchema.getObject('users')

        await users.insert({_id: "test_users", name: "test"}, "-1")
        
        let result = await users.findOne('test_users', {fields: ['_id']}, "-1")
        expect(result._id).to.equal('test_users')

        await users.delete("test_users", "-1")

    });
  });