import { expect } from 'chai';
import { SteedosSchema } from '../../src';
var path = require('path')

describe('Test use file', () => {
    let mySchema = new SteedosSchema({
        datasources: {
            default: {driver: 'meteor-mongo', url: 'mongodb://127.0.0.1/steedos', objectFiles: [path.resolve(__dirname, "./load")]}
        },
        appFiles: [path.resolve(__dirname, "./load")]
    })

    it('use Object file', async () => {
        let object = mySchema.getObject("test")
        // console.log('object', object.toConfig());
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

    it('test actions', async () => {
        let test = mySchema.getObject('test');
        let actions = test.actions
        expect(Object.keys(actions).length).to.gt(0)
    });

    it('test listViews', async () => {
        let test = mySchema.getObject('test');
        let listViews = test.list_views
        expect(Object.keys(listViews).length).to.eq(0)
    });

    it('test apps', ()=>{
        let meetingApp = mySchema.getApps()
        console.log('meetingApp', meetingApp['meeting'].toConfig())
        expect(Object.keys(meetingApp).length).to.gt(0)
    })

  });