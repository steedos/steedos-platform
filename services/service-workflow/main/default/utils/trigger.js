"use strict";
// @ts-check

const objectql = require('@steedos/objectql');
const { funEval } = require('./convert');
const { v4: uuidv4 } = require('uuid');
const PROCESS_TRIGGER = 'processTrigger';
const LISTENTO_ALL_FLOWS = 'LISTENTO_ALL_FLOWS';
module.exports = {
    excuteTriggers: async function (when, userSession, flowId, insId) {
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const flow = (await objectql.getObject('flows').find({ filters: ['_id', '=', flowId], fields: ['api_name'] }))[0];
        const flowApiName = flow.api_name;
        const instanceDoc = await objectql.getObject('instances').findOne(insId);
        const broker = objectql.getSteedosSchema().broker;
        let triggers = await objectql.registerProcessTrigger.find(broker, { pattern: `${flowApiName}.${when}.*` });
        let wildTriggers = await objectql.registerProcessTrigger.find(broker, { pattern: `${LISTENTO_ALL_FLOWS}.${when}.*` });
        let allTriggers = triggers.concat(wildTriggers);
        const event = {
            data: {
                id: insId,
                userId: userId,
                spaceId: spaceId,
                flowName: flowApiName,
                instance: instanceDoc,
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