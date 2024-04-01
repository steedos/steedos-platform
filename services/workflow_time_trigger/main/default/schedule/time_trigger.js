/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-11-12 13:18:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-01 17:51:34
 * @Description: 工作流时间触发器定时任务，用于将工作流规则中配置的时间触发器放入工作流操作执行队列
 */
'use strict';
// @ts-check

const schedule = require('node-schedule');
const objectql = require('@steedos/objectql');
const moment = require('moment');
const _eval = require('eval')

module.exports = {
    run: async function () {
        const steedosConfig = objectql.getSteedosConfig() || {};
        const cron = steedosConfig.cron;
        if (!cron || 'false' == cron.enabled) {
            return;
        }

        // console.log('time_trigger schedule running...')
        const intervalMinitues = 5 // 每5分钟执行一次
        const rule = `0 */${intervalMinitues} * * * *`
        let next = true;
        schedule.scheduleJob(rule, async function () {
            try {
                if (!next) {
                    return;
                }
                next = false;
                const now = moment()
                const workflowRuleObj = objectql.getObject('workflow_rule')
                const queueObj = objectql.getObject('workflow_time_trigger_queue')
                // 遍历已启用的、时间触发器字段不为空的工作流规则表
                const workflowRuleDocs = await workflowRuleObj.find({
                    filters: [
                        ['active', '=', true],
                        ['time_triggers', '!=', null]
                    ]
                })
                /**
                 * 遍历工作流规则的时间触发器表格字段 根据配置计算出 对象记录的过滤条件
                 * 过滤条件计算方式：
                 *   首先根据时间触发器中的配置计算出 规则触发的时间点C，如 30 天 早于 合同到期日期，则时间点为 当前时间+30天；如 30天 晚于 合同签订日期，则时间点为 当前时间-30天
                 *   过滤的时间范围为 当前时间 到 当前时间+T，即 C <= 合同到期日期 <= C + T ; 意味着执行将会有最多约一个间隔的提前量
                 * 将过滤出的记录和配置的工作流操作，放到工作流操作执行队列，由单独的定时器执行
                 */
                for (const ruleDoc of workflowRuleDocs) {
                    try {
                        const { time_triggers, object_name, _id } = ruleDoc
                        const filters = _eval(`module.exports = ${ruleDoc.filters}`) || []
                        const obj = objectql.getObject(object_name)
                        if (time_triggers && obj) {
                            for (const tTrigger of time_triggers) {
                                const { number, unit, type, date_field, updates_field_actions, workflow_notifications_actions, workflow_outbound_messages_actions } = tTrigger
                                if (updates_field_actions || workflow_notifications_actions || workflow_outbound_messages_actions) { // 配置了工作流操作才处理
                                    let triggerTime;
                                    if (type == 'earlier_than') {
                                        triggerTime = moment(now).add(number, unit)
                                    }
                                    else if (type == 'later_than') {
                                        triggerTime = moment(now).add(-number, unit)
                                    }
                                    else {
                                        console.error('time_trigger schedule:', 'invalid type in time_triggers', `workflow_rule _id ${_id}`);
                                        continue
                                    }
                                    const docs = await obj.find({
                                        filters: [
                                            filters, // 首先应该查找符合过滤条件的记录
                                            [date_field, '>=', triggerTime.toDate()],
                                            [date_field, '<=', moment(triggerTime).add(intervalMinitues, 'minute').toDate()]
                                        ]
                                    })
                                    // 将过滤出的记录和配置的工作流操作，放到工作流操作执行队列，由单独的定时器执行
                                    for (const doc of docs) {
                                        await queueObj.insert({
                                            'record_id': doc._id,
                                            'object_name': object_name,
                                            'updates_field_actions': updates_field_actions,
                                            'workflow_notifications_actions': workflow_notifications_actions,
                                            'workflow_outbound_messages_actions': workflow_outbound_messages_actions,
                                            '_excuted': false,
                                            '_excuting': false,
                                        })
                                    }


                                }
                            }
                        }
                    } catch (error) {
                        console.error(error.stack);
                        console.error('time_trigger schedule:', error.message);
                        console.error('ruleDoc:', ruleDoc);
                    }

                }


                next = true;
            } catch (error) {
                console.error(error.stack);
                console.error('time_trigger schedule:', error.message);
                next = true;
            }
        });
    }
}
