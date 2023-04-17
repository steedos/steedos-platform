/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-04-17 11:19:59
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-04-17 13:23:20
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
/**
@api {post} /api/workflow/view/:instanceId 查看审批单
@apiVersion 0.0.0
@apiName /api/workflow/view/:instanceId
@apiGroup service-workflow
@apiQuery string instanceId 申请单ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        redirect_url: redirect_url
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.post('/api/workflow/view/:instanceId', core.requireAuthentication, async function (req, res) {
    try {
        const userSession = req.user;
        Fiber(async function () {
            var box, current_user_id, flowId, hashData, ins, insId, object_name, permissions, record_id, redirect_url, ref, ref1, ref2, ref3, ref4, space, spaceId, space_id, workflowUrl, x_auth_token, x_user_id;
            try {
                current_user_id = userSession.userId;
                hashData = req.body;
                object_name = hashData.object_name;
                record_id = hashData.record_id;
                space_id = hashData.space_id;
                check(object_name, String);
                check(record_id, String);
                check(space_id, String);
                insId = req.params.instanceId;
                x_user_id = req.query['X-User-Id'];
                x_auth_token = req.query['X-Auth-Token'];
                redirect_url = "/";
                ins = Creator.getCollection('instances').findOne(insId);
                // - 我的草稿就跳转至草稿箱
                // - 我的待审核就跳转至待审核
                // - 不是我的申请单则跳转至打印页面
                // - 如申请单不存在则提示用户申请单已删除，并且更新record的状态，使用户可以重新发起审批
                if (ins) {
                    box = '';
                    spaceId = ins.space;
                    flowId = ins.flow;
                    if (((ref = ins.inbox_users) != null ? ref.includes(current_user_id) : void 0) || ((ref1 = ins.cc_users) != null ? ref1.includes(current_user_id) : void 0)) {
                        box = 'inbox';
                    } else if ((ref2 = ins.outbox_users) != null ? ref2.includes(current_user_id) : void 0) {
                        box = 'outbox';
                    } else if (ins.state === 'draft' && ins.submitter === current_user_id) {
                        box = 'draft';
                    } else if (ins.state === 'pending' && (ins.submitter === current_user_id || ins.applicant === current_user_id)) {
                        box = 'pending';
                    } else if (ins.state === 'completed' && ins.submitter === current_user_id) {
                        box = 'completed';
                    } else {
                        // 验证login user_id对该流程有管理、观察申请单的权限
                        permissions = permissionManager.getFlowPermissions(flowId, current_user_id);
                        space = db.spaces.findOne(spaceId, {
                            fields: {
                                admins: 1
                            }
                        });
                        if (permissions.includes("admin") || permissions.includes("monitor") || space.admins.includes(current_user_id)) {
                            box = 'monitor';
                        }
                    }
                    workflowUrl = (ref3 = Meteor.settings.public.webservices) != null ? (ref4 = ref3.workflow) != null ? ref4.url : void 0 : void 0;
                    if (box) {
                        redirect_url = (workflowUrl || '') + `workflow/space/${spaceId}/${box}/${insId}?X-User-Id=${x_user_id}&X-Auth-Token=${x_auth_token}`;
                    } else {
                        redirect_url = (workflowUrl || '') + `workflow/space/${spaceId}/print/${insId}?box=monitor&print_is_show_traces=1&print_is_show_attachments=1&X-User-Id=${x_user_id}&X-Auth-Token=${x_auth_token}`;
                    }
                    res.status(200).send({
                        redirect_url: redirect_url
                    });
                } else {
                    objectql.getObject(object_name).directUpdate(record_id, {
                        'instances': null,
                        'instance_state': null,
                        'locked': null
                    })
                    throw new Error('未找到申请单，可能已被删除，请重新发起审批。');
                }
            } catch (e) {
                res.status(200).send({
                    errors: [
                        {
                            errorMessage: e.reason || e.message
                        }
                    ]
                });
            }
        }).run();
    } catch (e) {
        res.status(200).send({
            errors: [
                {
                    errorMessage: e.reason || e.message
                }
            ]
        });
    }
});
exports.default = router;
