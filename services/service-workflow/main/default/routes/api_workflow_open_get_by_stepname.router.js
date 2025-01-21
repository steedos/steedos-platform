/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 14:27:19
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 14:52:04
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');
/**
@api {post} /api/workflow/open/getbystepname 根据步骤名称获取申请单

@apiName getInstanceByStepName

@apiGroup service-workflow

@apiPermission 工作区管理员

@apiParam {String} access_token User API Token

@apiHeader {String} X-Space-Id	工作区Id

@apiHeaderExample {json} Header-Example:
{
    "X-Space-Id": "wsw1re12TdeP223sC"
}

@apiParamExample {json} Request Payload:
{
    "flow": 流程Id,
    "stepname": 步骤名称
}

@apiSuccessExample {json} Success-Response:
{
    "status": "success",
    "data": [
        {
            instance
        },
        {
            instance
        }
    ]
}
 */
router.post('/api/workflow/open/getbystepname', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        var hashData = req.body;
        Fiber(async function () {
            try {
                var current_user, current_user_info, e, flow, hashData, instances, space_id, stepname;
                current_user = userId;
                space_id = req.headers['x-space-id'];
                if (!space_id) {
                    throw new Meteor.Error('error', 'need header X_Space_Id');
                }
                current_user_info = db.users.findOne(current_user);
                if (!current_user_info) {
                    throw new Meteor.Error('error', 'can not find user');
                }
                // 校验space是否存在
                uuflowManager.getSpace(space_id);
                // 校验当前登录用户是否是space的管理员
                uuflowManager.isSpaceAdmin(space_id, current_user);
                hashData = req.body;
                stepname = hashData["stepname"];
                flow = hashData["flow"];
                if (!stepname) {
                    throw new Meteor.Error('error', 'need stepname');
                }
                if (!flow) {
                    throw new Meteor.Error('error', 'need flow');
                }
                // 去掉{fields: {inbox_uers: 0, cc_users: 0, outbox_users: 0, traces: 0, attachments: 0}
                instances = db.instances.find({
                    space: space_id,
                    flow: flow,
                    state: 'pending',
                    traces: {
                        $elemMatch: {
                            is_finished: false,
                            name: stepname
                        }
                    }
                }, {
                    fields: {
                        inbox_uers: 0,
                        cc_users: 0,
                        outbox_users: 0,
                        attachments: 0,
                        traces: 0
                    }
                }).fetch();
                instances.forEach(function (instance) {
                    return instance.attachments = cfs.instances.find({
                        'metadata.instance': instance._id,
                        'metadata.current': true,
                        "metadata.is_private": {
                            $ne: true
                        }
                    }, {
                        fields: {
                            copies: 0
                        }
                    }).fetch();
                });

                res.status(200).send({
                    status: "success",
                    data: instances
                });
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
