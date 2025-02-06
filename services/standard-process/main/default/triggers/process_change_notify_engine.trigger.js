/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-30 15:52:08
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-04-08 19:56:08
 * @Description: 
 */

'use strict';
//@ts-check

const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const project = require('../../../package.json');
const packageName = project.name;

module.exports = {
    listenTo: 'process',

    afterInsert: async function () {
        const { object_name, doc, spaceId, id, userId } = this;
        if (userId) {
            const userSession = await auth.getSessionByUserId(userId, spaceId);
            const broker = objectql.getSteedosSchema().broker;
            // 最新文档告知引擎
            await broker.call(`${packageName}.save`, { process: doc }, { meta: { user: userSession } });
        }
    },

    afterUpdate: async function () {
        const { object_name, doc, spaceId, id, userId } = this;
        let processDoc = await this.getObject(object_name).findOne(id);
        if (userId) {
            const userSession = await auth.getSessionByUserId(userId, spaceId);
            const broker = objectql.getSteedosSchema().broker;
            const processVersionsObj = objectql.getObject('process_versions');
            const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', id]], sort: 'version desc', top: 1 }, userSession);
            const lastVersion = versionDocs[0];
            if (lastVersion) {
                processDoc = {
                    ...processDoc,
                    schema: lastVersion.schema,
                }
            }
            // 最新文档告知引擎
            await broker.call(`${packageName}.save`, { process: processDoc }, { meta: { user: userSession } });
        }
    }
}