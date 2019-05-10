import { expect } from 'chai';
import { addSessionToCache, getSessionFromCache, addSpaceSessionToCache, getSpaceSessionFromCache } from '../../src/session';
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
    //     let s = await getSession('/bxLBHvlUcgsFrHbKbZiVDhQtko4+JA4kOPuCvFYed0=');
    //     console.log(s)
    //     expect(!!s).to.be.eq(false);
    // });


    it('test method addSessionToCache, getSessionFromCache', () => {
        let token = 'token1';
        let sessionCacheInMinutes = 10;
        let session = { name: 'name', userId: 'userId', steedos_id: 'steedos_id', email: 'email', expiredAt: new Date().getTime() + sessionCacheInMinutes * 60 * 1000 }
        addSessionToCache(token, session)
        expect(!!getSessionFromCache(token)).to.be.eq(true);
    });

    it('test session expried', () => {
        let token = 'token2';
        let sessionCacheInMinutes = 0;
        let session = { name: 'name', userId: 'userId', steedos_id: 'steedos_id', email: 'email', expiredAt: new Date().getTime() + sessionCacheInMinutes * 60 * 1000 }
        addSessionToCache(token, session)
        expect(!!getSessionFromCache(token)).to.be.eq(false);
    });

    it('test method addSpaceSessionToCache, getSpaceSessionFromCache', () => {
        let token = 'token1';
        let spaceId = 'spaceId1';
        let sessionCacheInMinutes = 10;
        let session = { roles: ['admin'], expiredAt: new Date().getTime() + sessionCacheInMinutes * 60 * 1000 }
        addSpaceSessionToCache(token, spaceId, session)
        expect(!!getSpaceSessionFromCache(token, spaceId)).to.be.eq(true);
    });

    it('test spaceSession expried', () => {
        let token = 'token2';
        let spaceId = 'spaceId2';
        let sessionCacheInMinutes = 0;
        let session = { roles: ['admin'], expiredAt: new Date().getTime() + sessionCacheInMinutes * 60 * 1000 }
        addSpaceSessionToCache(token, spaceId, session)
        expect(!!getSpaceSessionFromCache(token, spaceId)).to.be.eq(false);
    });




});