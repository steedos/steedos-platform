/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 14:34:26
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 14:51:55
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
@api {put} /api/workflow/open/save/:ins_id 暂存申请单

@apiName saveInstances

@apiGroup service-workflow

@apiPermission 工作区管理员

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
router.put('/api/workflow/open/save/:ins_id', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        var hashData = req.body;
        Fiber(async function () {
            try {
                var current_step, current_trace, current_user, current_user_info, e, flow, ins_id, instance, result, setObj, space_id, values;
                ins_id = req.params.ins_id;
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
                values = req.body;
                if (!values) {
                    throw new Meteor.Error('error', 'need values');
                }
                current_trace = null;
                setObj = new Object;
                instance = uuflowManager.getInstance(ins_id);
                flow = uuflowManager.getFlow(instance.flow);
                _.each(instance.traces, function (t) {
                    if (t.is_finished !== true) {
                        return current_trace = t;
                    }
                });
                current_step = uuflowManager.getStep(instance, flow, current_trace.step);
                if (current_step.step_type === "counterSign") {
                    throw new Meteor.Error('error', '会签步骤不能修改表单值');
                }
                _.each(current_trace.approves, function (a) {
                    if (a.is_finished !== true && a.type !== "cc") {
                        return a.values = values;
                    }
                });
                setObj.modified = new Date;
                setObj["traces.$.approves"] = current_trace.approves;
                db.instances.update({
                    _id: ins_id,
                    'traces._id': current_trace._id
                }, {
                    $set: setObj
                });
                result = new Object;
                res.status(200).send({
                    status: "success",
                    data: result
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
