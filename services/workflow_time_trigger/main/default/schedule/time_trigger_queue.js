/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-11-12 17:53:55
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-03-29 16:09:20
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
            excuteBatchSize: Match.Optional(Number),
            // Allow optional keeping notifications in collection
            keepDocs: Match.Optional(Boolean)
        }
    */
    run: async function (options = {}) {
        // STEEDOS_CRON_WORKFLOW_RULE='*/10 * * * * *'
        const rule = process.env.STEEDOS_CRON_WORKFLOW_RULE
        if (!rule) {
            return;
        }

        console.log('time_trigger_queue schedule running...')
        const opt = {
            excuteBatchSize: 10,
            keepDocs: true,
            ...options
        }
        // const rule = `*/10 * * * * *` // 每十秒执行一次
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
                    ],
                    limit: opt.excuteBatchSize
                })
                for (const doc of queueDocs) {
                    try {
                        await queueObj.update(doc._id, {
                            '_excuting': true // 正在执行，防止重复执行
                        })

                        const { record_id, updates_field_actions, workflow_notifications_actions, workflow_outbound_messages_actions } = doc
                        // 字段更新
                        if (updates_field_actions) {
                            await objectql.runFieldUpdateActions(updates_field_actions, record_id);
                        }
                        // 工作流通知
                        if (workflow_notifications_actions) {
                            await objectql.runWorkflowNotifyActions(workflow_notifications_actions, record_id);
                        }
                        // 出站消息
                        if (workflow_outbound_messages_actions) {
                            await objectql.runWorkflowOutboundMessageActions(workflow_outbound_messages_actions, record_id);
                        }

                        if (opt.keepDocs) {
                            await queueObj.update(doc._id, {
                                '_excuted': true, // 执行结束
                                '_excuting': false
                            })
                        }
                        else {
                            await queueObj.delete(doc._id)
                        }

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
