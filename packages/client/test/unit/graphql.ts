import { SteedosClient } from '../../src';
import { expect } from 'chai';

const client = new SteedosClient();
//设置服务地址
client.setUrl('http://127.0.0.1:8088');

client.logToConsole = true;

before(async function () {
  let userProfile: any =  await client.login('username', 'password');
  //设置认证信息
  client.setToken(userProfile.token);
  //设置所属工作区
  client.setSpaceId("w3TT34PfeFjsoqsdx");
});

const testId = '_graphqlTestRecordId';

describe('Test Graphql: ', () => {
    it('query', async () => {
        const results: any = await client.graphql.query(`
        {
            pages:community_page{
                _id,
                name,
                path,
                title,
                schema
              }
        }
        `)
        console.log('results', results);
        expect(results.data.pages.length).to.gt(0);
    });
    it('insert', async () => {
        const results: any = await client.graphql.insert('community_page', {name: '_graphqlTestRecordId'})
        console.log('results', results);
        expect(results.data.pages.length).to.gt(0);
    });
});