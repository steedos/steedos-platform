import { SteedosSchema } from '../../src/types';
import { expect } from 'chai';
var path = require('path')

describe('load object file', () => {
    it('should return true', () => {
        var mySchema = new SteedosSchema({objects: {}, datasource: {url: 'mongo://xxxx'}})
        var isSuccess = mySchema.use(path.resolve(__dirname, "../../../../apps/app-meeting/src/meeting.object.yml"))
        expect(isSuccess).to.equal(true);
        var meeting = mySchema.getObject('meeting');
        expect(meeting.name).to.equal('meeting');
    });
});

describe('load field file', () => {
    it('should return true', () => {
        var mySchema = new SteedosSchema({objects: {}, datasource: {url: 'mongo://xxxx'}})
        mySchema.use(path.resolve(__dirname, "../../../../test/apps/app-meeting/src/test.object.js"))
        mySchema.use(path.resolve(__dirname, "../../../../test/apps/app-meeting/src/test.field.js"))
        var field = mySchema.getObject('test').getField('room')
        expect(field.name).to.equal('room') && expect(field.type).to.equal('lookup')
    });
});