'use strict';
// @ts-check
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const _ = require('lodash');
const Fiber = require("fibers");
const { funEval } = require('../utils/convert');
const { v4: uuidv4 } = require('uuid');
/**
 * 审批中提交申请单
 * body {
 *  Approvals: [
 *   {
 *     
 *   }
 * ]
 * }
 */
router.post('/api/workflow/engine', core.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        userSession._id = userId;
        // const isSpaceAdmin = userSession.is_space_admin;
        const broker = objectql.getSteedosSchema().broker;

        var hashData = req.body;
        const approve_from_client = hashData['Approvals'][0];

        // beforeStepSubmit
        let insId = approve_from_client.instance;
        let instanceDoc = await objectql.getObject('instances').findOne(insId);
        let flow = (await objectql.getObject('flows').find({ filters: ['_id', '=', instanceDoc['flow']], fields: ['api_name'] }))[0];
        let flowApiName = flow.api_name;
        if (flowApiName) {
            let triggers = await objectql.registerProcessTrigger.find(objectql.getSteedosSchema().broker, { pattern: `${flowApiName}.beforeStepSubmit.*` });
            let event = {
                data: {
                    id: insId,
                    userId: userId,
                    spaceId: spaceId,
                    flowName: flowApiName,
                    instance: instanceDoc,
                    broker: broker
                }
            }
            let context = {
                id: uuidv4()
            }
            for (const t of triggers) {
                await funEval(t.metadata.handler)(event, context)
            }
        }

        Fiber(async function () {
            try {
                uuflowManager.workflow_engine(approve_from_client, userSession, userId);
                // afterStepSubmit
                let insId = approve_from_client.instance;
                let instanceDoc = await objectql.getObject('instances').findOne(insId);
                if (flowApiName) {
                    let triggers = await objectql.registerProcessTrigger.find(objectql.getSteedosSchema().broker, { pattern: `${flowApiName}.afterStepSubmit.*` });
                    let event = {
                        data: {
                            id: insId,
                            userId: userId,
                            spaceId: spaceId,
                            flowName: flowApiName,
                            instance: instanceDoc,
                            broker: broker
                        }
                    }
                    let context = {
                        id: uuidv4()
                    }
                    for (const t of triggers) {
                        await funEval(t.metadata.handler)(event, context)
                    }
                }
                res.status(200).send({});
            } catch (e) {
                res.status(200).send({
                    errors: [{ errorMessage: e.message }]
                });
            }
        }).run()

    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
});
exports.default = router;