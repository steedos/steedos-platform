/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 14:36:21
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 14:51:53
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
@api {put} /api/workflow/open/submit/:ins_id 提交申请单

@apiDescription 暂不支持开始节点下一节点为条件的情况

@apiName submitInstance

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
router.put('/api/workflow/open/submit/:ins_id', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        var hashData = req.body;
        Fiber(async function () {
            try {
                var current_user, current_user_info, e, flow, form, ins_id, instance, nextSteps, next_step_id, next_user_ids, r, require_but_empty_fields, result, space_id, step, submitter, values;
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
                instance = uuflowManager.getInstance(ins_id);
                // 校验申请单状态为草稿
                uuflowManager.isInstanceDraft(instance);
                if (space_id !== instance["space"]) {
                    throw new Meteor.Error('error', 'instance is not belong to this space');
                }
                // 校验申请单必填字段是否有值
                values = instance["traces"][0]["approves"][0].values;
                form = uuflowManager.getForm(instance.form);
                require_but_empty_fields = uuflowManager.checkValueFieldsRequire(values, form, instance.form_version);
                if (require_but_empty_fields.length > 0) {
                    if (require_but_empty_fields.length > 1) {
                        throw new Meteor.Error('error', 'fields <' + require_but_empty_fields.join(",") + '> are required');
                    } else if (require_but_empty_fields.length = 1) {
                        throw new Meteor.Error('error', 'field <' + require_but_empty_fields.join(",") + '> is required');
                    }
                }
                flow = uuflowManager.getFlow(instance.flow);
                step = uuflowManager.getStep(instance, flow, instance["traces"][0].step);
                // 计算下一步骤选项
                nextSteps = uuflowManager.getNextSteps(instance, flow, step, "submitted");
                if (nextSteps.length < 1) {
                    throw new Meteor.Error('error', 'can not find next steps');
                }
                if (nextSteps.length > 1) {
                    throw new Meteor.Error('error', 'next step not uniq');
                }
                next_step_id = nextSteps[0];
                // 计算下一步处理人选项
                next_user_ids = getHandlersManager.getHandlers(ins_id, next_step_id, current_user) || [];
                if (next_user_ids.length > 1) {
                    throw new Meteor.Error('error', 'next step handler not uniq');
                }
                instance["traces"][0]["approves"][0]["next_steps"] = [
                    {
                        'step': next_step_id,
                        'users': next_user_ids
                    }
                ];
                result = new Object;
                submitter = db.users.findOne(instance.submitter);
                if (!submitter) {
                    throw new Meteor.Error('error', 'can not find submitter');
                }
                r = uuflowManager.submit_instance(instance, submitter);
                if (r.alerts) {
                    result = r;
                } else {
                    result = db.instances.findOne(ins_id);
                    if (result) {
                        result.attachments = cfs.instances.find({
                            'metadata.instance': ins_id,
                            'metadata.current': true,
                            "metadata.is_private": {
                                $ne: true
                            }
                        }, {
                            fields: {
                                copies: 0
                            }
                        }).fetch();
                    }
                }
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
