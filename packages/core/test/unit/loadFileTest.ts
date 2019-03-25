import { SteedosSchema } from '../../src/types';
import { expect } from 'chai';
var path = require('path')

describe('load object file', () => {
    it('should return true', () => {
        let mySchema = new SteedosSchema({objects: {}, datasource: {driver: 'mongodb', settings: {
            url: 'mongodb://127.0.0.1:27017/steedos'
        }}})
        mySchema.use(path.resolve(__dirname, "./load/meeting.object.yml"))
        var meeting = mySchema.getObject('meeting');
        // console.log('meeting', meeting.toConfig())
        expect(meeting.name).to.equal('meeting');
    });
});

describe('load field file', () => {
    it('should return true', () => {
        let mySchema = new SteedosSchema({objects: {}, datasource: {driver: 'mongodb', settings: {
            url: 'mongodb://127.0.0.1:27017/steedos'
        }}})
        mySchema.use(path.resolve(__dirname, "./load/test.object.js"))
        mySchema.use(path.resolve(__dirname, "./load/test.field.js"))
        var field = mySchema.getObject('test').getField('room')
        expect(field.name).to.equal('room') && expect(field.type).to.equal('lookup')
    });
});