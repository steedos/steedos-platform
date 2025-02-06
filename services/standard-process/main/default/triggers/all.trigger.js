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
        const { objectName, when: tWhen, userId, spaceId } = params;
        if (!userId) {
            return;
        }
        const processObj = objectql.getObject('process');
        const processVersionsObj = objectql.getObject('process_versions');
        const newDoc = doc;
        const userSession = await auth.getSessionByUserId(userId, spaceId);
        const processDocs = await processObj.find({ filters: [['space', '=', spaceId], ['object_name', '=', objectName], ['is_active', '=', true]] }, userSession);
        for (const pDoc of processDocs) {
            const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', pDoc._id], ['is_active', '=', true]], sort: 'version desc', top: 1 }, userSession);
            const lastVersion = versionDocs[0];
            // 流程已启用，且有已发布的版本才执行发起
            if (lastVersion) {
                const { when, entry_criteria } = lastVersion;
                if (('after.insert' == tWhen && 'afterInsert' == when || 'after.update' == tWhen && 'afterUpdate' == when || (['after.insert', 'after.update'].includes(tWhen) && 'afterInsertOrUpdate' == when))) {
                    // 执行入口公式
                    const result = await objectql.computeSimpleFormula(entry_criteria, newDoc, userSession);
                    if (result) {
                        await ctx.broker.call(`${packageName}.start`, {
                            process_id: pDoc._id,
                            record_id: newDoc._id
                        }, { meta: { user: userSession } });
                    }
                }
            }

        }
    }
}