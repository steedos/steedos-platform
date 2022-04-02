'use strict';
//@ts-check
/*
 * @Author: sunhaolin@hotoa.com 
 * @Date: 2022-03-24 16:23:04 
 * @Last Modified by: sunhaolin@hotoa.com
 * @Last Modified time: 2022-03-27 22:21:38
 * @Description 监听对象的数据操作，执行对象对应的process入口公式，调用process发起动作
 */

const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const project = require('../../../package.json');
const packageName = project.name;

module.exports = {
    listenTo: '*',
    when: ['after.insert', 'after.update'],
    handler: async function (ctx) {
        const params = ctx.params;
        const { objectName, operationType, userId, spaceId } = params;
        const processObj = objectql.getObject('process');
        const processVersionsObj = objectql.getObject('process_versions');
        const newDoc = params['new'][0];
        const processDocs = await processObj.find({ filters: [['space', '=', spaceId], ['object_name', '=', objectName]] });
        for (const pDoc of processDocs) {
            const { when, entry_criteria } = pDoc;
            const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', pDoc._id], ['is_active', '=', true]], sort: 'version desc', top: 1 });
            const lastVersion = versionDocs[0];
            // 流程已启用，且有已发布的版本才执行发起
            if (pDoc.is_active && lastVersion && ('AFTER_INSERT' == operationType && 'afterInsert' == when || 'AFTER_UPDATE' == operationType && 'afterUpdate' == when)) {
                // 执行入口公式
                const result = await objectql.computeSimpleFormula(entry_criteria, newDoc, userId, spaceId);
                if (result) {
                    const userSession = await auth.getSessionByUserId(userId, spaceId);
                    await ctx.broker.call(`${packageName}.start`, {
                        process_id: pDoc._id,
                        record_id: newDoc._id
                    }, { meta: { user: userSession } });
                }
            }
        }
    }
}