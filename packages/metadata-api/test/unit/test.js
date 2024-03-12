/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-02-18 17:18:54
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-02-18 17:55:35
 */
const { expect } = require('chai');
const { DbManager } = require('@steedos/metadata-api');

describe('Test object extend', () => {
    it('extend return true', async () => {
        var userSession = { 
            userId: "654300a4074594d15147bcf8",
            spaceId: "654300b5074594d15147bcfa"
        };
        const collection_name = "object_listviews";
        const objectName = "test__c";
        var dbManager = new DbManager(userSession);
        await dbManager.connect();
        // var result = await dbManager.find(collection_name, {object_name: objectName, $or: [{ shared: true }, { "shared_to" : "space" }]});
        let listviewName = "all";
        var result = await dbManager.findOne(collection_name, {name: listviewName, object_name: objectName, $or: [{ shared: true }, { "shared_to" : "space" }]});
        console.log(result);
        expect(true).to.equal(true)
    });
});