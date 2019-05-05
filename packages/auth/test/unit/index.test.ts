import { expect } from 'chai';
import { addSessionToCache } from '../../src/session';
import { getSessionFromCache } from '../../src/session';
// import { getSession } from '../../src/session';

describe('test session', () => {

    // it('test method getSession', async () => {
    //     let objectql = require("@steedos/objectql")
    //     let path = require('path')
    //     let schema = objectql.getSteedosSchema()
    //     let filePath = path.resolve(__dirname + "../../../../standard-objects")

    //     schema.addDataSource('default', {
    //         driver: "mongo",
    //         url: 'mongodb://127.0.0.1:27017/steedos',
    //         objectFiles: [filePath]
    //     })

    //     expect(!!(await getSession('xxxx'))).to.be.eq(false);
    // });


    it('test method addSessionToCache getSessionFromCache', () => {
        let token = 'token1';
        let sessionCacheInMinutes = 10;
        let session = { name: 'name', userId: 'userId', steedos_id: 'steedos_id', email: 'email', token: token, expiredAt: new Date().getTime() + sessionCacheInMinutes * 60 * 1000 }
        addSessionToCache(token, session)
        expect(!!getSessionFromCache(token)).to.be.eq(true);
    });

    it('test session expried', () => {
        let token = 'token2';
        let sessionCacheInMinutes = 0;
        let session = { name: 'name', userId: 'userId', steedos_id: 'steedos_id', email: 'email', token: token, expiredAt: new Date().getTime() + sessionCacheInMinutes * 60 * 1000 }
        addSessionToCache(token, session)
        expect(!!getSessionFromCache(token)).to.be.eq(false);
    });




});