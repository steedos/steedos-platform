import { expect } from 'chai';
import { utils } from '../../src/utils';

describe('test utils', () => {

    // it('test method _insertHashedLoginToken', async () => {
    //     let objectql = require("@steedos/objectql")
    //     // let path = require('path')
    //     let schema = objectql.getSteedosSchema()
    //     // let filePath = path.resolve(__dirname + "../../../../standard-objects")

    //     schema.addDataSource('default', {
    //         driver: "mongo",
    //         url: 'mongodb://127.0.0.1:27017/steedos',
    //         // objectFiles: [filePath],
    //         objects: {
    //             users: {
    //                 fields: {
    //                     services: {
    //                         type: "object"
    //                     }
    //                 }
    //             }
    //         }
    //     })

    //     let stampedToken = utils._generateStampedLoginToken();
    //     let hashedTokenObj = utils._hashStampedToken(stampedToken)
    //     let r = await utils._insertHashedLoginToken('hwJJbdc2WmFriMzb6', hashedTokenObj)

    //     expect(!!r).to.be.eq(true);
    // });


    it('test method _generateStampedLoginToken, _hashStampedToken, _hashLoginToken', () => {
        let stampedToken = utils._generateStampedLoginToken();
        let hashedTokenObj = utils._hashStampedToken(stampedToken)
        let hashedToken = utils._hashLoginToken(stampedToken.token)
        expect(hashedTokenObj.hashedToken).to.be.eq(hashedToken);
    });






});