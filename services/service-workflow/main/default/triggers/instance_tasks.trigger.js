/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-08 15:16:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-02-27 15:18:55
 * @Description: 
 */
'use strict';
// @ts-check
const { getObject } = require('@steedos/objectql');

module.exports = {
    listenTo: 'instance_tasks',

    afterUpdate: async function () {
        // console.log('[trigger][instance_tasks]', 'afterUpdate')
        const { doc, previousDoc } = this
        // 未完成到已完成
        if (!previousDoc.is_finished && doc.is_finished) {
            const instanceTasksObj = getObject('instance_tasks')
            const { _id, instance, handler } = previousDoc
            // 更新当前记录is_latest_approve为true
            await instanceTasksObj.directUpdate(_id, {
                is_latest_approve: true
            })
            // 更新其他记录is_latest_approve为false
            await instanceTasksObj.directUpdateMany([
                ['instance', '=', instance],
                ['handler', '=', handler],
                ['_id', '!=', _id]
            ], {
                is_latest_approve: false
            })
        }
    },

}