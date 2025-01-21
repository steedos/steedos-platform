/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 14:29:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 14:52:00
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
@api {get} /api/workflow/open/get/:ins_id 查看申请单详情

@apiName getInstance

@apiGroup service-workflow

@apiPermission 工作区的管理员

@apiParam {String} ins_id 申请单Id
@apiParam {String} access_token User API Token

@apiHeader {String} X-Space-Id	工作区Id

@apiHeaderExample {json} Header-Example:
{
    "X-Space-Id": "wsw1re12TdeP223sC"
}

@apiSuccessExample {json} Success-Response:
{
    "status": "success",
    "data": {instance}
}
 */
router.get('/api/workflow/open/get/:ins_id', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        var hashData = req.body;
        Fiber(async function () {
            try {
                var current_user, e, ins_id, instance, perm_users, permissions, space, space_id;
                ins_id = req.params.ins_id;
                current_user = userId;
                space_id = req.headers['x-space-id'];
                if (!space_id) {
                    throw new Meteor.Error('error', 'need header X_Space_Id');
                }
                // 校验space是否存在
                uuflowManager.getSpace(space_id);
                // 校验当前登录用户是否是space的管理员
                uuflowManager.isSpaceAdmin(space_id, current_user);
                instance = db.instances.findOne(ins_id);
                if (!instance) {
                    throw new Meteor.Error('error', 'can not find instance');
                }
                if (db.space_users.find({
                    space: instance.space,
                    user: current_user
                }).count() === 0) {
                    throw new Meteor.Error('error', 'auth_token is wrong');
                }
                // 权限：仅以下人员可以查看申请单详情：提交者、申请者、经手者、本流程的管理员、本流程的观察员、本工作区的管理员、本工作区的所有者。
                perm_users = new Array;
                perm_users.push(instance.submitter);
                perm_users.push(instance.applicant);
                if (instance.outbox_users) {
                    perm_users = perm_users.concat(instance.outbox_users);
                }
                if (instance.inbox_users) {
                    perm_users = perm_users.concat(instance.inbox_users);
                }
                space = db.spaces.findOne({
                    _id: instance.space
                }, {
                    fields: {
                        admins: 1
                    }
                });
                perm_users = perm_users.concat(space.admins);
                permissions = permissionManager.getFlowPermissions(instance.flow, current_user);
                if ((!perm_users.includes(current_user)) && (!permissions.includes("monitor")) && (!permissions.includes("admin"))) {
                    throw new Meteor.Error('error', 'no permission');
                }
                instance.attachments = cfs.instances.find({
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

                res.status(200).send({
                    status: "success",
                    data: instance
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
