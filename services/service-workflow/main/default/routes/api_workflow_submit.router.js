'use strict';
// @ts-check
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const _ = require('lodash');
const Fiber = require("fibers");
/**
 * 草稿箱提交申请单
 * body {
 *   Instances: [
 *     {
 *       
 *     }
 *   ]
 * }
 */
router.post('/api/workflow/submit', core.requireAuthentication, async function (req, res) {
    try {
        // const userSession = req.user;
        // const spaceId = userSession.spaceId;
        // const userId = userSession.userId;
        // const isSpaceAdmin = userSession.is_space_admin;
        Fiber(function () {
            try {
                var current_user, current_user_info, hashData, result;
                current_user_info = uuflowManager.check_authorization(req);
                current_user = current_user_info._id;
                hashData = req.body;
                result = [];
                _.each(hashData['Instances'], function (instance_from_client) {
                    var current_approve, flow_id, instance, r;
                    r = uuflowManager.submit_instance(instance_from_client, current_user_info);
                    if (r.alerts) {
                        result.push(r);
                    }
                    if (!_.isEmpty(instance_from_client['inbox_users'])) {
                        // 如果是转发就需要给当前用户发送push 重新计算badge
                        pushManager.send_message_to_specifyUser("current_user", current_user);
                    }
                    if (_.isEmpty(r.alerts)) {
                        instance = db.instances.findOne(instance_from_client._id);
                        flow_id = instance.flow;
                        current_approve = instance_from_client.traces[0].approves[0];
                        // 如果已经配置webhook并已激活则触发
                        pushManager.triggerWebhook(flow_id, instance, current_approve, 'draft_submit', current_user, instance.inbox_users);
                    }
                    // 判断申请单是否分发，分发文件结束提醒发起人
                    return uuflowManager.distributedInstancesRemind(instance_from_client);
                });
                res.status(200).send({ result: result });
            } catch (error) {
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