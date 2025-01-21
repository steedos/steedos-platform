/*
 * @Author: sunhaolin@hotoa.com 
 * @Date: 2022-03-26 10:49:51 
 * @Last Modified by: sunhaolin@hotoa.com
 * @Last Modified time: 2022-03-26 10:53:33
 */
'use strict';
// @ts-check
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const Fiber = require("fibers");
const { excuteTriggers } = require('../utils/trigger');
const { getStep } = require('../uuflowManager');
/**
 * 重定位申请单
 * body {
 *   Instances: [
 *     {
 *       
 *     }
 *   ]
 * }
 */
router.post('/api/workflow/relocate', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        userSession._id = userId;
        // const isSpaceAdmin = userSession.is_space_admin;

        var hashData = req.body;
        const instance_from_client = hashData['Instances'][0];
        // beforeEnd
        const insId = instance_from_client._id;
        const instanceDoc = (await objectql.getObject('instances').find({ filters: [['_id', '=', insId]], fields: ['flow', 'flow_version'] }))[0];
        const flowId = instanceDoc.flow;
        const flowDoc = await objectql.getObject('flows').findOne(flowId);
        const next_step_id = instance_from_client["relocate_next_step"];
        const next_step = getStep(instanceDoc, flowDoc, next_step_id);
        const next_step_type = next_step["step_type"];
        if (next_step_type == "end") {
            await excuteTriggers({ when: 'beforeEnd', userId, flowId, insId });
        }

        Fiber(async function () {
            try {
                uuflowManager.relocate(instance_from_client, userSession)
                // afterEnd
                if (next_step_type === 'end') {
                    await excuteTriggers({ when: 'afterEnd', userId, flowId, insId });
                }
                res.status(200).send({});
            } catch (error) {
                console.error(error);
                res.status(200).send({
                    errors: [{ errorMessage: error.message }]
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