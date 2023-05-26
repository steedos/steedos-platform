/*
 * @Author: sunhaolin@hotoa.com 
 * @Date: 2022-03-26 12:05:37 
 * @Last Modified by: sunhaolin@hotoa.com
 * @Last Modified time: 2022-03-26 12:08:45
 */
"use strict";
// @ts-check

const objectql = require('@steedos/objectql');
const { funEval } = require('./convert');
const { v4: uuidv4 } = require('uuid');
const PROCESS_TRIGGER = 'processTrigger';
const LISTENTO_ALL_FLOWS = 'LISTENTO_ALL_FLOWS';
module.exports = {
    excuteTriggers: async function ({ when, userId, flowId, insId, nextStep, nextUserIds }) {
        if ('true' !== process.env.STEEDOS_ENABLE_PROCESS_TRIGGER) {
            return // 未开启流程触发器，直接返回
        };

        const flow = (await objectql.getObject('flows').directFind({ filters: ['_id', '=', flowId], fields: ['api_name', 'space'] }))[0];
        const flowApiName = flow.api_name;
        const broker = objectql.getSteedosSchema().broker;

        let triggers = await objectql.registerProcessTrigger.find(broker, { pattern: `${flowApiName}.${when}.*` });
        let wildTriggers = await objectql.registerProcessTrigger.find(broker, { pattern: `${LISTENTO_ALL_FLOWS}.${when}.*` });

        if (triggers.length === 0 && wildTriggers.length === 0) {
            return; // 没有触发器，直接返回
        }

        const spaceId = flow.space;
        const instanceDoc = await objectql.getObject('instances').findOne(insId);
        let allTriggers = triggers.concat(wildTriggers);
        const event = {
            data: {
                id: insId, // 审批单的唯一标识 string
                userId: userId, // 当前用户唯一标识 string
                spaceId: spaceId, // 当前工作区唯一标识 string
                flowName: flowApiName, // 当前流程API名称 string
                instance: instanceDoc, // 当前审批单 json
                // step: ,// 当前步骤 json
                nextStep: nextStep, // 下一步骤 json
                // traceId: ,
                // values:  ,// 当前审批单表单值 json
                nextUserIds: nextUserIds, // 下一步骤处理人选项清单 [string]
                // nextUserId: , // 当前步骤已选下一步骤处理人 string
                // instanceState: , // 审批单状态 draft/pending/completed/approved/rejected/terminated
                // traceState: , // 审核状态 pending/approved/rejected
                // approveState: , // 审核状态 pending/approved/rejected
                broker: broker
            }
        }
        const context = {
            id: uuidv4()
        }
        for (const t of allTriggers) {
            await funEval(t.metadata.handler)(event, context)
        }
        // 发送事件
        broker.emit(`${PROCESS_TRIGGER}.${when}`, { id: insId, userId: userId });
    }
}