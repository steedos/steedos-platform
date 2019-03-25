// import { expect } from 'chai';
import { SteedosSchema } from '../../src';
var path = require('path')

describe('Test db', () => {
    it('should return true', async () => {
      
        let mySchema = new SteedosSchema({objects: {}, datasource: {driver: 'mongo', settings: {
            url: 'mongodb://127.0.0.1/steedos'
        }}})

        mySchema.use(path.resolve(__dirname, "./load/meeting.object.yml"))

        await mySchema.datasource.connect()
  
        let meeting = mySchema.getObject('meeting')
        console.log('==============================');
        //33LRd2KenssCqFznE
        
        let result = await meeting.findOne('33LRd2KenssCqFznE')
        // expect(result).to.be.length(0)
        console.log('res', result);

        let result2 = await meeting.findOne2('33LRd2KenssCqFznE', {fields: {name: 1}})
        console.log('result2', result2);
        // meeting.find2('4d4e4d4d4d4d', (err, data)=>{
        //     console.log('err ---->', err);
        //     if(err){
        //         throw new Error(err)
        //     }else{
        //         console.log(data)
        //     }
        // })
        console.log('===============end==============');
    });
  });