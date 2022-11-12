/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-11-12 17:53:55
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-11-12 21:34:32
 * @Description: 执行工作流时间触发器队列
 */

'use strict';
// @ts-check

const schedule = require('node-schedule');
const objectql = require('@steedos/objectql');

module.exports = {
    /*
        options: {
            // Controls the sending interval
            sendInterval: Match.Optional(Number),
            // Controls the sending batch size per interval
            sendBatchSize: Match.Optional(Number),
            // Allow optional keeping notifications in collection
            keepDocs: Match.Optional(Boolean)
        }
    */
    run: async function (options) {
        console.log('time_trigger_queue schedule running...')
        
        const rule = `*/10 * * * * *` // 每十秒执行一次
        let next = true;
        schedule.scheduleJob(rule, async function () {
            try {
                if (!next) {
                    return;
                }
                next = false;

                // 查找队列记录
                const queueObj = objectql.getObject('workflow_time_trigger_queue')
                const queueDocs = await queueObj.find({
                    filters: [
                        ['_excuted', '=', false],
                        ['_excuting', '=', false],
                        ['_error', '=', null]
                    ]
                })
                for (const doc of queueDocs) {
                    try {
                        await queueObj.update(doc._id, {
                            '_excuting': true
                        })

                        const { record_id, updates_field_actions, workflow_notifications_actions } = doc
                        // 字段更新
                        if (updates_field_actions) {
                            await objectql.runFieldUpdateActions(updates_field_actions, record_id);
                        }
                        // 工作流通知
                        if (workflow_notifications_actions) {
                            await objectql.runWorkflowNotifyActions(workflow_notifications_actions, record_id);
                        }
                        await queueObj.update(doc._id, {
                            '_excuted': true,
                            '_excuting': false
                        })
                    } catch (error) {
                        console.error(error)
                        await queueObj.update(doc._id, {
                            '_error': error.stack
                        })
                    }

                }

                next = true;
            } catch (error) {
                console.error(error.stack);
                console.error('time_trigger_queue schedule:', error.message);
                next = true;
            }
        });
    }
}
