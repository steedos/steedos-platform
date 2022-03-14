'use strict';
// @ts-check
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const _ = require('lodash');
const Fiber = require("fibers");
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
        // const userSession = req.user;
        // const spaceId = userSession.spaceId;
        // const userId = userSession.userId;
        // const isSpaceAdmin = userSession.is_space_admin;
        Fiber(function () {
            try {
                var current_user, current_user_info, hashData;
                current_user_info = uuflowManager.check_authorization(req);
                current_user = current_user_info._id;
                hashData = req.body;
                _.each(hashData['Approvals'], function (approve_from_client) {
                    return uuflowManager.workflow_engine(approve_from_client, current_user_info, current_user);
                });
                res.status(200).send({ });
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