/*
 * @Author: sunhaolin@hotoa.com 
 * @Date: 2022-03-27 16:48:38 
 * @Last Modified by: sunhaolin@hotoa.com
 * @Last Modified time: 2022-03-27 18:52:18
 */
'use strict';
//@ts-check

const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const _ = require('lodash');


module.exports = {
    listenTo: 'process',

    beforeUpdate: async function () {
        const { object_name, doc, spaceId, id, userId } = this;
        if (_.has(doc, 'is_active') && userId) {
            const processDoc = await this.getObject(object_name).findOne(id);
            if (doc.is_active != processDoc.is_active) {
                const userSession = await auth.getSessionByUserId(userId, spaceId);
                const broker = objectql.getSteedosSchema().broker;
                const newDoc = {
                    ...processDoc,
                    ...doc
                };
                if (doc.is_active) {
                    // 启用流程
                    await broker.call(`${newDoc.engine}.enable`, { process: newDoc }, { meta: { user: userSession } });
                } else {
                    // 禁用流程
                    await broker.call(`${newDoc.engine}.disable`, { process: newDoc }, { meta: { user: userSession } });
                }
            }
        }
    }
}