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
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const _ = require('lodash');
const Fiber = require("fibers");
const { excuteTriggers } = require('../utils/trigger');
const {
    remove_many_instance_tasks,
} = require('@steedos/workflow').workflowManagers.instance_tasks_manager
/**
 * 申请人取消申请
 * body {
 *   Instances: [
 *     {
 *       
 *     }
 *   ]
 * }
 */
router.post('/api/workflow/terminate', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        userSession._id = userId;
        // const isSpaceAdmin = userSession.is_space_admin;

        var hashData = req.body;
        const instance_from_client = hashData['Instances'][0];

        const insId = instance_from_client._id;
        const instanceDoc = (await objectql.getObject('instances').find({ filters: [['_id', '=', insId]], fields: ['flow'] }))[0];
        const flowId = instanceDoc.flow;
        // beforeEnd
        await excuteTriggers({ when: 'beforeEnd', userId, flowId, insId });

        Fiber(async function () {
            try {
                var flow, flow_id, flow_ver_end_step, flow_vers, h, i, ins, instance, instance_flow_ver, instance_id, instance_trace, newApprove, newTrace, now, old_cc_users, old_inbox_users, old_outbox_users, permissions, r, setObj, space, space_id, space_user, space_user_org_info, tempUsers, terminate_reason, traces;
                terminate_reason = instance_from_client["terminate_reason"];
                instance_id = instance_from_client["_id"];
                // 获取一个instance
                instance = uuflowManager.getInstance(instance_id);
                space_id = instance.space;
                flow_id = instance.flow;
                // 获取一个space
                space = uuflowManager.getSpace(space_id);
                // 获取一个flow
                flow = uuflowManager.getFlow(flow_id);
                // 判断一个instance是否为审核中状态
                uuflowManager.isInstancePending(instance);
                // 获取一个space下的一个user
                space_user = uuflowManager.getSpaceUser(space_id, userId);
                // 获取space_user所在的部门信息
                space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user);
                // 获取结束节点
                instance_flow_ver = null;
                flow_ver_end_step = null;
                flow_vers = new Array;
                flow_vers.push(flow.current);
                flow_vers = flow_vers.concat(flow.historys);
                instance_flow_ver = _.find(flow_vers, function (f_ver) {
                    return f_ver._id === instance.flow_version;
                });
                if (!instance_flow_ver) {
                    throw new Meteor.Error('error!', "未找到申请单对应流程版本");
                }
                flow_ver_end_step = _.find(instance_flow_ver.steps, function (f_step) {
                    return f_step.step_type === "end";
                });
                // 调用getFlowPermissions方法，看返回的结果中是否有admin
                permissions = permissionManager.getFlowPermissions(flow_id, userId);
                now = new Date;
                setObj = new Object;
                // space的admin, 填单人 申请人 有权限 取消申请
                if (permissions.includes("admin") || space.admins.includes(userId) || instance.submitter === userId || instance.applicant === userId) {
                    if (!terminate_reason) {
                        throw new Meteor.Error('error!', "还未填写强制结束申请单的理由，操作失败");
                    }
                    instance_trace = _.find(instance.traces, function (trace) {
                        return trace.is_finished === false;
                    });
                    traces = instance.traces;
                    const finishedApproveIds = []
                    i = 0;
                    while (i < traces.length) {
                        if (traces[i].is_finished === false) {
                            // 更新当前trace记录
                            traces[i].is_finished = true;
                            traces[i].finish_date = now;
                            h = 0;
                            while (h < traces[i].approves.length) {
                                if (traces[i].approves[h].is_finished === false) {
                                    // 更新当前trace.approve记录
                                    traces[i].approves[h].is_finished = true;
                                    traces[i].approves[h].finish_date = now;
                                    traces[i].approves[h].judge = null;
                                    traces[i].approves[h].description = null;
                                    finishedApproveIds.push(traces[i].approves[h]._id)
                                }
                                h++;
                            }
                            // 插入当前Trace trace.approve记录：当trace.type为取回、强制结束时，is_read=true且read_date为当前时间。
                            newApprove = new Object;
                            newApprove._id = new Mongo.ObjectID()._str;
                            newApprove.instance = instance_id;
                            newApprove.trace = instance_trace._id;
                            newApprove.is_finished = true;
                            newApprove.user = userId;
                            newApprove.user_name = userSession.name;
                            newApprove.handler = userId;
                            newApprove.handler_name = userSession.name;
                            newApprove.handler_organization = space_user_org_info["organization"];
                            newApprove.handler_organization_name = space_user_org_info["organization_name"];
                            newApprove.handler_organization_fullname = space_user_org_info["organization_fullname"];
                            newApprove.start_date = now;
                            newApprove.finish_date = now;
                            newApprove.due_date = instance_trace.due_date;
                            newApprove.read_date = now;
                            newApprove.judge = "terminated";
                            newApprove.is_read = true;
                            newApprove.description = terminate_reason;
                            newApprove.is_error = false;
                            newApprove.values = new Object;
                            newApprove.cost_time = newApprove.finish_date - newApprove.start_date;
                            traces[i].approves.push(newApprove);
                        }
                        i++;
                    }
                    // 插入下一步trace记录
                    newTrace = new Object;
                    newTrace._id = new Mongo.ObjectID()._str;
                    newTrace.instance = instance_id;
                    newTrace.previous_trace_ids = [instance_trace._id];
                    // type---停用
                    // newTrace.type = "terminated"
                    newTrace.is_finished = true;
                    newTrace.step = flow_ver_end_step._id;
                    newTrace.name = flow_ver_end_step.name;
                    newTrace.start_date = now;
                    newTrace.finish_date = now;
                    newTrace.judge = "terminated";
                    setObj.state = "completed";
                    setObj.final_decision = "terminated";
                    old_inbox_users = instance.inbox_users;
                    old_cc_users = instance.cc_users || [];
                    old_outbox_users = instance.outbox_users;
                    tempUsers = new Array;
                    _.each(instance_trace.approves, function (nft_approve) {
                        tempUsers.push(nft_approve.user);
                        return tempUsers.push(nft_approve.handler);
                    });
                    setObj.outbox_users = _.uniq(instance.outbox_users.concat(tempUsers));
                    setObj.inbox_users = new Array;
                    setObj.cc_users = new Array;
                    setObj.modified = now;
                    setObj.modified_by = userId;
                    traces.push(newTrace);
                    setObj.traces = traces;
                    setObj.current_step_name = flow_ver_end_step.name;
                    setObj.current_step_auto_submit = false;
                    r = db.instances.update({
                        _id: instance_id
                    }, {
                        $set: setObj
                    });
                    // 删除intance_tasks
                    remove_many_instance_tasks(finishedApproveIds)
                    if (r) {
                        ins = uuflowManager.getInstance(instance_id);
                        //通知填单人、申请人
                        pushManager.send_instance_notification("submit_terminate_applicant", ins, terminate_reason, userSession);
                        //发送给待处理人 被传阅人
                        if (old_inbox_users) {
                            _.each(_.uniq(old_inbox_users.concat(old_cc_users)), function (user_id) {
                                return pushManager.send_message_to_specifyUser("terminate_approval", user_id);
                            });
                        }
                        // 如果已经配置webhook并已激活则触发
                        pushManager.triggerWebhook(ins.flow, ins, {}, 'terminate', userId, []);
                    }
                }
                //发送消息给当前用户
                pushManager.send_message_current_user(userSession);

                // afterEnd
                await excuteTriggers({ when: 'afterEnd', userId, flowId, insId });

                res.status(200).send({});
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