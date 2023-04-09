/*
 * @Author: sunhaolin@hotoa.com 
 * @Date: 2022-03-26 10:49:56 
 * @Last Modified by: sunhaolin@hotoa.com
 * @Last Modified time: 2022-03-26 10:53:34
 */
'use strict';
// @ts-check
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const _ = require('lodash');
const Fiber = require("fibers");
const { excuteTriggers } = require('../utils/trigger');
const { getStep } = require('../uuflowManager');

/**
 * 审批中提交申请单
 * body {
    "Approvals": [
        {
            "_id": "3c9636c152d52b056ef9ccec",
            "instance": "siDye2BhC3XMGHmrK",
            "trace": "848556e079844c1c94305a63",
            "is_finished": false,
            "user": "61d425a7e9aa4c36e87ba8d1",
            "user_name": "孙浩林",
            "handler": "61d425a7e9aa4c36e87ba8d1",
            "handler_name": "孙浩林",
            "handler_organization_fullname": "s",
            "start_date": "2022-03-18T06:19:13.811Z",
            "due_date": "2022-03-25T06:19:13.765Z",
            "is_read": true,
            "values": {
                "文本": "",
                "文本1": ""
            },
            "read_date": "2022-03-18T11:40:54.469Z",
            "id": "3c9636c152d52b056ef9ccec",
            "description": "",
            "judge": "approved",
            "next_steps": [
                {
                    "step": "8c240799-753d-437e-8928-7683494688e4",
                    "users": [
                        "61d425a7e9aa4c36e87ba8d1"
                    ]
                }
            ]
        }
    ]
 * }
 */
router.post('/api/workflow/engine', core.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        userSession._id = userId;
        // const isSpaceAdmin = userSession.is_space_admin;

        var hashData = req.body;
        const approve_from_client = hashData['Approvals'][0];

        // beforeStepSubmit
        const insId = approve_from_client.instance;
        const instanceDoc = (await objectql.getObject('instances').find({ filters: [['_id', '=', insId]], fields: ['flow', 'flow_version'] }))[0];
        const flowId = instanceDoc.flow;
        await excuteTriggers({ when: 'beforeStepSubmit', userId, flowId, insId });

        // beforeEnd
        const flowDoc = await objectql.getObject('flows').findOne(flowId);
        const next_steps = approve_from_client["next_steps"];
        const next_step_id = next_steps[0]["step"];
        const next_step = getStep(instanceDoc, flowDoc, next_step_id);
        const next_step_type = next_step["step_type"];
        if (next_step_type == "end") {
            await excuteTriggers({ when: 'beforeEnd', userId, flowId, insId });
        }

        Fiber(async function () {
            try {
                const instance = uuflowManager.workflow_engine(approve_from_client, userSession, userId);
                // afterStepSubmit
                await excuteTriggers({ when: 'afterStepSubmit', userId, flowId, insId });
                // afterEnd
                if (instance.state === 'completed') {
                    await excuteTriggers({ when: 'afterEnd', userId, flowId, insId });
                }
                res.status(200).send({});
            } catch (e) {
                console.error(e);
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