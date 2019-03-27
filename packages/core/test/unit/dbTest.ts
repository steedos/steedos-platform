import { expect } from 'chai';
import { SteedosSchema } from '../../src';
var path = require('path')

describe('Test db', () => {
    it('should return true', async () => {
        let mySchema = new SteedosSchema({objects: {}, datasource: {driver: 'mongo', url: 'mongodb://127.0.0.1/steedos'}, permission_sets: []})
        mySchema.use(path.resolve(__dirname, "../../../standard-objects"))

        mySchema.use(path.resolve(__dirname, "./load/meeting.object.yml"))

        await mySchema.connect()

        await mySchema.loadPermissionsFromDB()
  
        let meeting = mySchema.getObject('meeting')

        console.log('meeting', meeting.getPermissions());

        await meeting.insert({_id: "test_meeting", name: "test"})
        
        let result = await meeting.findOne('test_meeting', {fields: ['_id']})
        expect(result._id).to.equal('test_meeting')

        await meeting.delete("test_meeting")

    });
  });