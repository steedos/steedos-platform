'use strict';
// @ts-check
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const _ = require('lodash');
const Fiber = require("fibers");
const { excuteTriggers } = require('../utils/trigger');
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

        var hashData = req.body;
        const approve_from_client = hashData['Approvals'][0];

        // beforeStepSubmit
        let insId = approve_from_client.instance;
        let instanceDoc = (await objectql.getObject('instances').find({ filters: [['_id', '=', insId]], fields: ['flow'] }))[0];
        await excuteTriggers('beforeStepSubmit', userSession, instanceDoc['flow'], insId);

        Fiber(async function () {
            try {
                uuflowManager.workflow_engine(approve_from_client, userSession, userId);
                // afterStepSubmit
                await excuteTriggers('afterStepSubmit', userSession, instanceDoc['flow'], insId);
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