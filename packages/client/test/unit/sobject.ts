import { SteedosClient } from '../../src';
import { expect } from 'chai';

const client = new SteedosClient();

client.setUrl('http://192.168.3.2:5000/test');

client.setToken('jYgTB7xC3ScqmXYdW,36160778d34f5d5bac26109b3213f10fca853b059e5fc361813513fc5c317587de548b8bb9bc0ed5d3d0be');

// client.sobject('accounts').find(null, null, {$top: 2}).then((res)=>{
//     console.log(res);
// })


describe('Test SObject: ', () => {
    it('find', async () => {
        const results: Array<any> = await client.sobject('accounts').find(['name', '=', 'test1'], ['name'], {$top: 2, $count: true})
        // console.log('results', results);
        expect(results.length).to.gt(0);
    });
    it('findOne', async () => {
        //TODO
        expect('TODO').to.equal('TODO');
    });
});