import { SteedosSchema } from '../../src/types';
import { expect } from 'chai';
var path = require('path')

describe('test permission', () => {
    it('should return true', () => {
        let mySchema = new SteedosSchema({objects: {}, datasource: {driver: 'mongo', url: 'mongodb://127.0.0.1/steedos'}, permission_sets:["admin"]})
        mySchema.use(path.resolve(__dirname, "./load/meeting.object.yml"))
        var meeting = mySchema.getObject('meeting');
        
        // var userMeeting = mySchema.getUserObject('1', 'meeting')

        // userMeeting.find({name: '1111'});

        expect(meeting.name).to.equal('meeting');
    });
});