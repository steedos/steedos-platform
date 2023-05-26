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
const core = require('@steedos/core');
const _ = require('lodash');
const Fiber = require("fibers");
const { excuteTriggers } = require('../utils/trigger');
/**
 * 草稿箱提交申请单
 * body {
 *   Instances: [
 *     {
 *       _id: 申请单Id
        flow: 流程Id
        inbox_users: 不懂啊 TODO 待确认此属性功能
        applicant:
        submitter:
        traces: [
            {
                _id: 
                step: 
                approves: [
                    {
                        _id:
                        next_steps: [{ "step": "步骤id", "users": [步骤处理人] }]
                        description: 意见,
                        values: {}
                    }
                ]
            }
        ]
 *     }
 *   ]
 * }
 */
router.post('/api/workflow/submit', core.requireAuthentication, async function (req, res) {
    try {
        if (process.env.STEEDOS_DEBUG) {
            console.time('/api/workflow/submit')
        }

        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        userSession._id = userId;
        // const isSpaceAdmin = userSession.is_space_admin;

        var hashData = req.body;
        var result = [];
        const instance_from_client = hashData['Instances'][0];
        // beforeDraftSubmit
        const insId = instance_from_client._id;
        await excuteTriggers({ when: 'beforeDraftSubmit', userId: userId, flowId: instance_from_client['flow'], insId: insId });

        Fiber(function () {
            try {
                var r = uuflowManager.submit_instance(instance_from_client, userSession);
                if (r.alerts) {
                    result.push(r);
                }
                if (!_.isEmpty(instance_from_client['inbox_users'])) {
                    // 如果是转发就需要给当前用户发送push 重新计算badge
                    pushManager.send_message_to_specifyUser("current_user", userId);
                }
                if (_.isEmpty(r.alerts)) {
                    if (pushManager.hasWebhooks(instance_from_client.flow)) {
                        var instance = db.instances.findOne(instance_from_client._id);
                        var flow_id = instance.flow;
                        var current_approve = instance_from_client.traces[0].approves[0];
                        // 如果已经配置webhook并已激活则触发
                        pushManager.triggerWebhook(flow_id, instance, current_approve, 'draft_submit', userId, instance.inbox_users);
                    }
                }
                // 判断申请单是否分发，分发文件结束提醒发起人
                uuflowManager.distributedInstancesRemind(instance_from_client);

                if (process.env.STEEDOS_DEBUG) {
                    console.timeEnd('/api/workflow/submit')
                }
                res.status(200).send({ result: result });
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