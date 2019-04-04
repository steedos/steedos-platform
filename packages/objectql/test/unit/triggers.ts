import { expect } from 'chai';
import { SteedosSchema } from '../../src';
var path = require('path')

describe.only('Test object triggers', () => {
    let mySchema = new SteedosSchema({datasources: {default: {driver: 'mongo', url: 'mongodb://127.0.0.1/steedos', objectFiles: [path.resolve(__dirname, "./load")]}}})
    it('beforeInsert', async () => {
        let meeting = mySchema.getObject('meeting');
        let beforeInsert = false
        let beforeInsertSetValue = false

        let doc = await meeting.insert({_id: 'test20190402', name: 'test', start: '2019-03-23T01:00:00.000Z', end: '2019-03-23T08:00:00.000Z'})
        if(doc.created){
            beforeInsertSetValue = true
        }
        try {
            await meeting.insert({_id: 'test20190403', name: 'test2', start: '2019-03-23T01:00:00.000Z', end: '2019-03-23T08:00:00.000Z'})
        } catch (error) {
            if(error.message === '该时间段的此会议室已被占用'){
                beforeInsert = true
            }
        }
        await meeting.delete("test20190402")
        await meeting.delete("test20190403")
        expect(beforeInsert).to.equal(true)  && expect(beforeInsertSetValue).to.equal(true) 
    });

    it('beforeUpdate', async ()=>{

        let beforeUpdate = false
        let beforeUpdateSetValue = false

        let meeting = mySchema.getObject('meeting');

        await meeting.insert({_id: 'test20190404', name: 'test4', start: '2019-03-23T01:00:00.000Z', end: '2019-03-23T08:00:00.000Z'})
        await meeting.insert({_id: 'test20190405', name: 'test5', start: '2019-03-23T09:00:00.000Z', end: '2019-03-23T10:00:00.000Z'})
        
        await meeting.update('test20190405', {start: '2019-03-23T11:00:00.000Z', end: '2019-03-23T12:00:00.000Z'})
        
        let doc = await meeting.findOne("test20190405", {fields: ['modified', 'created']})
        if(doc.modified != doc.created){
            beforeUpdateSetValue = true
        }

        try {
            await meeting.update('test20190405', {start: '2019-03-23T06:00:00.000Z', end: '2019-03-23T15:00:00.000Z'})
        } catch (error) {
            if(error.message === '该时间段的此会议室已被占用'){
                beforeUpdate = true
            }
        }

        await meeting.delete("test20190404")
        await meeting.delete("test20190405")
        expect(beforeUpdate).to.equal(true)  && expect(beforeUpdateSetValue).to.equal(true) 
      })
  });
