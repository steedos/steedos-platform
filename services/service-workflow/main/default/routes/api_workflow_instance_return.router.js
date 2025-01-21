/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-14 11:22:30
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('lodash');
const Fiber = require("fibers");
const objectql = require('@steedos/objectql');
const {
    update_instance_tasks,
    insert_instance_tasks
} = require('@steedos/workflow').workflowManagers.instance_tasks_manager

router.post('/api/workflow/v2/instance/return', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { approve, reason } = req.body;

        Fiber(async function () {
            try {
                var approve_values, b, current_step, current_user, current_user_info, flow, ins, instance, instance_id, last_trace, newTrace, new_inbox_users, now, pre_step, pre_trace, r, rest_counter_users, setObj, space_id, traces;
                current_user = userSession.userId;
                instance_id = approve.instance;
                ins = uuflowManager.getInstance(instance_id);
                space_id = ins.space;
                if (ins.state !== "pending" || !ins.inbox_users.includes(current_user)) {
                    throw new Meteor.Error('error!', "不符合退回条件");
                }
                if (approve.type === "cc" && ins.cc_users.includes(current_user)) {
                    throw new Meteor.Error('error!', "不符合退回条件");
                }
                if (ins.traces.length < 2) {
                    throw new Meteor.Error('error!', "不符合退回条件");
                }
                flow = uuflowManager.getFlow(ins.flow);
                pre_trace = ins.traces[ins.traces.length - 2];
                pre_step = uuflowManager.getStep(ins, flow, pre_trace.step);
                if (pre_step.step_type === "counterSign") {
                    throw new Meteor.Error('error!', "不符合退回条件");
                }
                last_trace = _.last(ins.traces);
                current_step = uuflowManager.getStep(ins, flow, last_trace.step);
                if (current_step.step_type !== "submit" && current_step.step_type !== "sign" && current_step.step_type !== "counterSign") {
                    throw new Meteor.Error('error!', "不符合退回条件");
                }
                if (approve.trace !== last_trace._id) {
                    throw new Meteor.Error('error!', "不符合退回条件");
                }
                new_inbox_users = new Array;
                _.each(pre_trace.approves, function (a) {
                    if ((!a.type || a.type === "draft" || a.type === "reassign") && (!a.judge || a.judge === "submitted" || a.judge === "approved" || a.judge === "rejected")) {
                        return new_inbox_users.push(a.user);
                    }
                });
                if (_.isEmpty(new_inbox_users)) {
                    throw new Meteor.Error('error!', "未找到下一步处理人，退回失败");
                }
                traces = ins.traces;
                approve_values = uuflowManager.getApproveValues(approve.values || {}, current_step.permissions, ins.form, ins.form_version);
                setObj = new Object;
                now = new Date;
                rest_counter_users = new Array;
                _.each(traces, function (t) {
                    if (t._id === last_trace._id) {
                        if (!t.approves) {
                            t.approves = new Array;
                        }
                        _.each(t.approves, function (a, idx) {
                            if ((!a.type || a.type === "reassign") && (!a.judge || a.judge === "submitted" || a.judge === "approved" || a.judge === "rejected" || a.judge === "readed") && a.is_finished !== true) {
                                setObj['traces.$.approves.' + idx + '.finish_date'] = now;
                                setObj['traces.$.approves.' + idx + '.read_date'] = now;
                                setObj['traces.$.approves.' + idx + '.is_error'] = false;
                                setObj['traces.$.approves.' + idx + '.is_read'] = true;
                                setObj['traces.$.approves.' + idx + '.is_finished'] = true;
                                setObj['traces.$.approves.' + idx + '.cost_time'] = now - a.start_date;
                                setObj['traces.$.approves.' + idx + '.values'] = approve_values;
                                if (a.handler === current_user) {
                                    setObj['traces.$.approves.' + idx + '.judge'] = "returned";
                                    return setObj['traces.$.approves.' + idx + '.description'] = reason;
                                } else {
                                    return rest_counter_users.push(a.handler);
                                }
                            }
                        });
                        setObj['traces.$.is_finished'] = true;
                        setObj['traces.$.finish_date'] = true;
                        return setObj['traces.$.judge'] = "returned";
                    }
                });
                ins.values = _.extend(ins.values || {}, approve_values);
                newTrace = new Object;
                newTrace._id = new Mongo.ObjectID()._str;
                newTrace.instance = instance_id;
                newTrace.previous_trace_ids = [last_trace._id];
                newTrace.is_finished = false;
                newTrace.step = pre_trace.step;
                newTrace.name = pre_trace.name;
                newTrace.start_date = now;
                newTrace.due_date = uuflowManager.getDueDate(pre_step.timeout_hours, space_id);
                newTrace.approves = [];
                _.each(new_inbox_users, function (next_step_user_id, idx) {
                    var agent, handler_id, handler_info, newApprove, next_step_space_user, next_step_user_org_info, user_info;
                    newApprove = new Object;
                    newApprove._id = new Mongo.ObjectID()._str;
                    newApprove.instance = instance_id;
                    newApprove.trace = newTrace._id;
                    newApprove.is_finished = false;
                    newApprove.user = next_step_user_id;
                    user_info = db.users.findOne(next_step_user_id, {
                        fields: {
                            name: 1
                        }
                    });
                    newApprove.user_name = user_info.name;
                    handler_id = next_step_user_id;
                    handler_info = user_info;
                    agent = uuflowManager.getAgent(space_id, next_step_user_id);
                    if (agent) {
                        new_inbox_users[idx] = agent;
                        handler_id = agent;
                        handler_info = db.users.findOne({
                            _id: agent
                        }, {
                            fields: {
                                name: 1
                            }
                        });
                        newApprove.agent = agent;
                    }
                    newApprove.handler = handler_id;
                    newApprove.handler_name = handler_info.name;
                    next_step_space_user = uuflowManager.getSpaceUser(space_id, handler_id);
                    next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user);
                    newApprove.handler_organization = next_step_user_org_info["organization"];
                    newApprove.handler_organization_name = next_step_user_org_info["organization_name"];
                    newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"];
                    newApprove.start_date = now;
                    newApprove.is_read = false;
                    newApprove.is_error = false;
                    newApprove.values = new Object;
                    uuflowManager.setRemindInfo(ins.values, newApprove);
                    return newTrace.approves.push(newApprove);
                });
                setObj.inbox_users = new_inbox_users;
                setObj.state = "pending";
                ins.outbox_users.push(current_user);
                setObj.outbox_users = _.uniq(ins.outbox_users);
                setObj.modified = now;
                setObj.modified_by = current_user;
                setObj.values = ins.values;
                setObj.current_step_name = pre_trace.name;
                r = db.instances.update({
                    _id: instance_id,
                    'traces._id': last_trace._id
                }, {
                    $set: setObj
                });
                // 更新当前记录
                update_instance_tasks(instance_id, last_trace._id, approve._id)
                b = db.instances.update({
                    _id: instance_id
                }, {
                    $push: {
                        traces: newTrace
                    }
                });
                // 生成新记录
                insert_instance_tasks(instance_id, newTrace._id, newTrace.approves[0]._id)
                if (r && b) {
                    pushManager.send_message_to_specifyUser("current_user", current_user);
                    instance = uuflowManager.getInstance(instance_id);
                    current_user_info = db.users.findOne(current_user);
                    pushManager.send_instance_notification("return_pending_inbox", instance, reason, current_user_info);
                    _.each(rest_counter_users, function (user_id) {
                        return pushManager.send_message_to_specifyUser("current_user", user_id);
                    });
                    pushManager.triggerWebhook(instance.flow, instance, {}, 'return', current_user, instance.inbox_users);
                }
                res.status(200).send({});
            } catch (error) {
                console.error(error);
                res.status(200).send({
                    error: error.message
                });
            }

        }).run()

    } catch (error) {
        console.error(error);
        res.status(200).send({
            error: error.message
        });
    }
});
exports.default = router;