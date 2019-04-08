import { expect } from 'chai';
import { SteedosSchema } from '../../src';
var path = require('path')

describe('Test use file', () => {
    let mySchema = new SteedosSchema({datasources: {default: {driver: 'mongo', url: 'mongodb://127.0.0.1/steedos', objectFiles: [path.resolve(__dirname, "./load")]}}})
    it('use Object file', async () => {
        let object = mySchema.getObject("test")
        expect(object.name).to.equal("test")
    });

    it('use field file', async () => {
        let object = mySchema.getObject("test")
        let room = object.getField('room')
        expect(room.type).to.equal("lookup")

    });

    it('use trigger file', async () => {
        let meeting = mySchema.getObject('meeting');
        let triggers = meeting.triggers
        expect(Object.keys(triggers).length).to.gt(0)

    });
  });