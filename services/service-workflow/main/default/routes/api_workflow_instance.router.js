/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 13:52:33
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 13:58:24
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const _ = require('underscore');
const Fiber = require('fibers');
/**
@api {get} /api/workflow/instance/:instanceId 查看申请单
@apiVersion 0.0.0
@apiName /api/workflow/instance/:instanceId
@apiGroup service-workflow
@apiParam {String} instanceId 申请单ID
@apiQuery {String} async 异步
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        "status": 302,
        "redirect": redirectTo
    }
    HTTP/1.1 302 OK
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/api/workflow/instance/:instanceId', core.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        Fiber(async function () {
            try {
                var box, current_user_id, flowId, ins, insId, permissions, redirectTo, redirectToUrl, ref, ref1, ref2, req_async, space, spaceId;
                current_user_id = userId;
                req_async = _.has(req.query, 'async');
                insId = req.params.instanceId;
                ins = db.instances.findOne(insId, {
                    fields: {
                        space: 1,
                        flow: 1,
                        state: 1,
                        inbox_users: 1,
                        cc_users: 1,
                        outbox_users: 1,
                        submitter: 1,
                        applicant: 1
                    }
                });
                if (!ins) {
                    throw new Meteor.Error('error', 'instanceId is wrong or instance not exists.');
                }
                spaceId = ins.space;
                flowId = ins.flow;
                if (db.space_users.find({
                    space: spaceId,
                    user: current_user_id
                }).count() === 0) {
                    throw new Meteor.Error('error', 'user is not belong to this space.');
                }
                box = '';
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
                    // 验证login user_id对该流程有管理申请单的权限
                    permissions = permissionManager.getFlowPermissions(flowId, current_user_id);
                    space = db.spaces.findOne(spaceId, {
                        fields: {
                            admins: 1
                        }
                    });
                    if ((!permissions.includes("admin")) && (!space.admins.includes(current_user_id))) {
                        throw new Meteor.Error('error', "no permission.");
                    }
                    box = 'monitor';
                }
                redirectTo = `workflow/space/${spaceId}/${box}/${insId}`;
                redirectToUrl = Meteor.absoluteUrl(redirectTo);
                if (req_async) { // || req.get("X-Requested-With") === 'XMLHttpRequest'
                    return res.status(200).send({
                        "status": 302,
                        "redirect": redirectTo
                    });
                } else {
                    res.setHeader("Location", redirectToUrl);
                    res.writeHead(302);
                    res.end();
                }
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
