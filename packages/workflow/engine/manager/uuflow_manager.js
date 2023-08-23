'use strict';
const {
    insert_instance_tasks,
    insert_many_instance_tasks,
    update_instance_tasks,
    update_many_instance_tasks,
    remove_many_instance_tasks,
} = require('./instance_tasks_manager')
const Cookies = require("cookies");
const _eval = require('eval');
const steedosCore = require('@steedos/core');

// 定义全局变量
global.uuflowManager = {};

uuflowManager.check_authorization = function (req, res) {
    var authToken, cookies, hashedToken, query, user, userId;
    query = req.query;
    userId = query["X-User-Id"];
    authToken = query["X-Auth-Token"];
    if (!userId || !authToken) {
        cookies = new Cookies(req, res);
        userId = cookies.get("X-User-Id");
        authToken = cookies.get("X-Auth-Token");
    }
    if (!userId || !authToken) {
        throw new Meteor.Error(401, 'Unauthorized');
    }
    hashedToken = Accounts._hashLoginToken(authToken);
    user = Meteor.users.findOne({
        _id: userId,
        "services.resume.loginTokens.hashedToken": hashedToken
    });
    if (!user) {
        throw new Meteor.Error(401, 'Unauthorized');
    }
    return user;
};

uuflowManager.checkNestStepUsersIsValid = function (selected, scope, nextStep) {
    if (nextStep != null ? nextStep.allow_pick_approve_users : void 0) {
        return true;
    }
    if (_.difference(selected, scope).length > 0) {
        return false;
    }
    return true;
};

uuflowManager.getInstance = function (instance_id) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getInstance');
    }
    var ins;
    ins = db.instances.findOne(instance_id);
    if (!ins) {
        throw new Meteor.Error('error!', `申请单ID：${instance_id}有误或此申请单已经被删除`);
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getInstance');
    }
    return ins;
};

uuflowManager.getSpace = function (space_id) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getSpace');
    }
    var space;
    space = db.spaces.findOne(space_id);
    if (!space) {
        throw new Meteor.Error('error!', "space_id有误或此space已经被删除");
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getSpace');
    }
    return space;
};

uuflowManager.getSpaceUser = function (space_id, user_id, options) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getSpaceUser');
    }
    var space_user;
    space_user = db.space_users.findOne({
        space: space_id,
        user: user_id
    }, options);
    if (!space_user) {
        throw new Meteor.Error('error!', "user_id对应的用户不属于当前space");
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getSpaceUser');
    }
    return space_user;
};

uuflowManager.getFlow = function (flow_id, options) {
    if (process.env.STEEDOS_DEBUG) {
        var now = new Date().toISOString();
        console.time('uuflowManager.getFlow' + now);
    }
    var flow;
    flow = db.flows.findOne(flow_id, options);
    if (!flow) {
        throw new Meteor.Error('error!', "id有误或此流程已经被删除");
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getFlow' + now);
    }
    return flow;
};

uuflowManager.getSpaceUserOrgInfo = function (space_user) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getSpaceUserOrgInfo');
    }
    var info, org;
    info = {};
    info.organization = space_user.organization;
    org = db.organizations.findOne(space_user.organization, {
        fields: {
            name: 1,
            fullname: 1
        }
    });
    info.organization_name = org.name;
    info.organization_fullname = org.fullname;
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getSpaceUserOrgInfo');
    }
    return info;
};

uuflowManager.getTrace = function (instance, trace_id) {
    var trace;
    trace = _.find(instance.traces, function (t) {
        return t._id === trace_id;
    });
    if (!trace) {
        throw new Meteor.Error('error!', "trace_id有误");
    }
    return trace;
};

uuflowManager.getApprove = function (trace, approve_id) {
    var approve;
    approve = _.find(trace.approves, function (t) {
        return t._id === approve_id;
    });
    if (!approve) {
        throw new Meteor.Error('error!', "trace_id有误");
    }
    return approve;
};

uuflowManager.isTraceNotFinished = function (trace) {
    if (trace.is_finished !== false) {
        throw new Meteor.Error('error!', "可能已有人对此文件做了处理。请点击已审核，查看文件的最新状态");
    }
};

uuflowManager.isApproveNotFinished = function (approve) {
    if (approve.is_finished !== false) {
        throw new Meteor.Error('error!', "当前步骤不为未完成状态,不能进行此操作");
    }
};

uuflowManager.isInstancePending = function (instance, lang = "zh-CN") {
    if (instance.state !== "pending") {
        throw new Meteor.Error('error!', TAPi18n.__('instance.remindMessage.update_failed', {}, lang));
    }
};

uuflowManager.isHandlerOrAgent = function (approve, user_id) {
    if (approve.user !== user_id && approve.agent !== user_id) {
        throw new Meteor.Error('error!', "不是当前步骤对应的处理人或其代理人，不能进行此操作");
    }
};

uuflowManager.isInstanceDraft = function (instance, lang = "zh-CN") {
    if (instance.state !== "draft") {
        throw new Meteor.Error('error!', TAPi18n.__('instance.remindMessage.update_failed', {}, lang));
    }
};

uuflowManager.isInstanceSubmitter = function (instance, current_user_id) {
    if (instance.submitter !== current_user_id) {
        throw new Meteor.Error('error!', '当前用户不是申请单对应的提交人,不能进行此操作');
    }
};

uuflowManager.isInstanceSubmitterOrApplicantOrSpaceAdmin = function (instance, current_user_id, space) {
    if (instance.submitter !== current_user_id && instance.applicant !== current_user_id && !space.admins.includes(current_user_id)) {
        throw new Meteor.Error('error!', "当前用户不是申请单对应的提交人或申请人或工作区管理员");
    }
};

uuflowManager.getStep = function (instance, flow, step_id) {
    var flow_rev, isExistStep;
    flow_rev = instance.flow_version;
    isExistStep = null;
    if (flow.current._id === flow_rev) {
        isExistStep = _.find(flow.current.steps, function (step) {
            return step._id === step_id;
        });
    } else {
        _.each(flow.historys, function (history) {
            if (history._id === flow_rev) {
                return isExistStep = _.find(history.steps, function (step) {
                    return step._id === step_id;
                });
            }
        });
    }
    if (!isExistStep) {
        throw new Meteor.Error('error!', "不能获取step");
    }
    return isExistStep;
};

uuflowManager.isJudgeLegal = function (judge) {
    if (judge !== "approved" && judge !== "rejected" && judge !== "readed" && judge !== "submitted") {
        throw new Meteor.Error('error!', "judge有误");
    }
};

uuflowManager.isSpaceAdmin = function (space_id, user_id) {
    var space;
    space = db.spaces.findOne({
        _id: space_id
    }, {
        fields: {
            admins: 1
        }
    });
    if (!space.admins.includes(user_id)) {
        throw new Meteor.Error('error!', "当前用户不是工作区管理员,不能进行此操作");
    }
};

uuflowManager.getUser = function (user_id, options) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getUser');
    }
    var user;
    user = db.users.findOne(user_id, options);
    if (!user) {
        throw new Meteor.Error('error!', "用户ID有误或此用户已经被删除");
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getUser');
    }
    return user;
};

uuflowManager.getOrganization = function (orgId, options) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getOrganization');
    }
    var orgDoc = db.organizations.findOne(orgId, options);
    if (!orgDoc) {
        throw new Meteor.Error('error!', "组织ID有误或此组织已经被删除");
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getOrganization');
    }
    return orgDoc;
};

uuflowManager.getUserOrganization = function (user_id, space_id) {
    var org;
    org = db.organizations.findOne({
        space: space_id,
        users: user_id
    });
    return org;
};

uuflowManager.getUserRoles = function (user_id, space_id) {
    var positions, role_names;
    role_names = [];
    positions = db.flow_positions.find({
        space: space_id,
        users: user_id
    }, {
        fields: {
            role: 1
        }
    }).fetch();
    _.each(positions, function (position) {
        var role;
        role = db.flow_roles.findOne({
            _id: position.role
        }, {
            fields: {
                name: 1
            }
        });
        if (role) {
            return role_names.push(role.name);
        }
    });
    return role_names;
};

uuflowManager.isFlowEnabled = function (flow) {
    if (flow.state !== "enabled") {
        throw new Meteor.Error('error!', "流程未启用,操作失败");
    }
};

uuflowManager.isFlowSpaceMatched = function (flow, space_id) {
    if (flow.space !== space_id) {
        throw new Meteor.Error('error!', "流程和工作区ID不匹配");
    }
};

// 当前节点为条件节点类型时，根据条件计算出后续步骤
uuflowManager.calculateCondition = function (values, condition_str) {
    var __values, average, count, e, max, min, sum;
    try {
        __values = values;
        sum = function (subform_field) {
            var sum_field_value;
            if (!subform_field) {
                throw new Meteor.Error('error!', "参数为空");
            }
            if (!subform_field instanceof Array) {
                throw new Meteor.Error('error!', "参数不是数组类型");
            }
            sum_field_value = 0;
            _.each(subform_field, function (field_value) {
                field_value = Number(String(field_value));
                return sum_field_value += field_value;
            });
            return sum_field_value;
        };
        average = function (subform_field) {
            if (!subform_field) {
                throw new Meteor.Error('error!', "参数为空");
            }
            if (!subform_field instanceof Array) {
                throw new Meteor.Error('error!', "参数不是数组类型");
            }
            return sum(subform_field) / count(subform_field);
        };
        count = function (subform_field) {
            if (!subform_field) {
                throw new Meteor.Error('error!', "参数为空");
            }
            return subform_field.length;
        };
        max = function (subform_field) {
            var sub_field;
            if (!subform_field) {
                throw new Meteor.Error('error!', "参数为空");
            }
            if (!subform_field instanceof Array) {
                throw new Meteor.Error('error!', "参数不是数组类型");
            }
            sub_field = [];
            _.each(subform_field, function (field_value) {
                return sub_field.push(Number(String(field_value)));
            });
            return _.max(sub_field);
        };
        min = function (subform_field) {
            var sub_field;
            if (!subform_field) {
                throw new Meteor.Error('error!', "参数为空");
            }
            if (!subform_field instanceof Array) {
                throw new Meteor.Error('error!', "参数不是数组类型");
            }
            sub_field = [];
            _.each(subform_field, function (field_value) {
                return sub_field.push(Number(String(field_value)));
            });
            return _.min(sub_field);
        };
        return eval(condition_str);
    } catch (error) {
        e = error;
        console.error(e.stack);
        return false;
    }
};

// 代码结构
// 子表
//   数值
//   字符
// 选组
//   多选
//   单选
// 选人
//   多选
//   单选
// 数值
// 字符
uuflowManager.setFormFieldVariable = function (fields, __values, space_id) {
    var e;
    try {
        return _.each(fields, function (field) {
            var _subform_values, group_fullname, group_id, group_name, organization, organization_selectuser, role_selectuser, subform_fields_all, user_id, user_name, user_roles;
            if (field.type === "table") { //子表
                //得到已引用的子表字段
                subform_fields_all = field.fields;
                _subform_values = {};
                return _.each(subform_fields_all, function (current_field) {
                    var values_arr;
                    values_arr = [];
                    if (["number", "percentage", "currency"].includes(current_field["type"])) {
                        _.each(__values[field.code], function (sub_field) {
                            return values_arr.push(sub_field[current_field["code"]]);
                        });
                    } else if (current_field["type"] === "checkbox") {
                        _.each(__values[field.code], function (sub_field) {
                            if (sub_field[current_field["code"]] === "true") {
                                return values_arr.push(true);
                            } else if (sub_field[current_field["code"]] === "false") {
                                return values_arr.push(false);
                            }
                        });
                    } else {
                        _.each(__values[field.code], function (sub_field) {
                            if (sub_field[current_field["code"]]) {
                                return values_arr.push(sub_field[current_field["code"]]);
                            } else {
                                return values_arr.push("");
                            }
                        });
                    }
                    return __values[current_field["code"]] = values_arr;
                });
            } else if (field.type === "group") { //选组
                if (field.is_multiselect) {
                    if (__values[field.code] && __values[field.code].length > 0) {
                        group_id = [];
                        group_name = [];
                        group_fullname = [];
                        _.each(__values[field.code], function (group) {
                            group_id.push(group["id"]);
                            group_name.push(group["name"]);
                            return group_fullname.push(group["fullname"]);
                        });
                        __values[field.code] = {};
                        __values[field.code]["id"] = group_id;
                        __values[field.code]["name"] = group_name;
                        return __values[field.code]["fullname"] = group_fullname;
                    }
                }
            } else if (field.type === "user") { //选人
                if (field.is_multiselect) {
                    if (__values[field.code] && __values[field.code].length > 0) {
                        user_id = [];
                        user_name = [];
                        organization = {};
                        organization["user_organization_fullname"] = [];
                        organization["user_organization_name"] = [];
                        user_roles = [];
                        _.each(__values[field.code], function (select_user) {
                            var organization_selectuser, role_selectuser;
                            user_id.push(select_user["id"]);
                            user_name.push(select_user["name"]);
                            organization_selectuser = uuflowManager.getUserOrganization(select_user["id"], space_id);
                            role_selectuser = uuflowManager.getUserRoles(select_user["id"], space_id);
                            if (organization_selectuser) {
                                organization["user_organization_fullname"].push(organization_selectuser.fullname);
                                organization["user_organization_name"].push(organization_selectuser.name);
                            }
                            if (role_selectuser) {
                                return user_roles = user_roles || role_selectuser;
                            }
                        });
                        __values[field.code] = {};
                        __values[field.code]["id"] = user_id;
                        __values[field.code]["name"] = user_name;
                        __values[field.code]["organization"] = organization;
                        return __values[field.code]["roles"] = roles;
                    }
                } else {
                    if (__values[field.code]) {
                        organization_selectuser = uuflowManager.getUserOrganization(__values[field.code]["id"], space_id);
                        role_selectuser = uuflowManager.getUserRoles(__values[field.code]["id"], space_id);
                        if (organization_selectuser) {
                            __values[field.code]["organization"] = {};
                            __values[field.code]["organization"]["fullname"] = organization_selectuser.fullname;
                            __values[field.code]["organization"]["name"] = organization_selectuser.name;
                        }
                        return __values[field.code]["roles"] = role_selectuser;
                    }
                }
            } else if (["number", "percentage", "currency"].includes(field.type)) { //数值类型
                if (__values[field.code]) {
                    return __values[field.code] = Number(__values[field.code]);
                } else {
                    return __values[field.code] = 0;
                }
            } else if (field.type === "checkbox") { //勾选框
                if (__values[field.code] === "true") {
                    return __values[field.code] = true;
                } else if (__values[field.code] === "false") {
                    return __values[field.code] = false;
                }
            }
        });
    } catch (error) {
        e = error;
        return console.error(e.stack);
    }
};

function isSkipStep(instance, step) {
    return _.contains(instance.skip_steps, step._id);
};

// 应用场景：此函数用于返回备选的所有下一步的id
uuflowManager.getNextSteps = function (instance, flow, step, judge, values) {
    var __values, applicant_name, applicant_organization_fullname, applicant_organization_name, applicant_roles, approver_name, approver_organization_fullname, approver_organization_name, approver_roles, current_approve, flowVersions, flow_steps, form, formVersion, lines, nextSteps, prefix, reg, rejectedSteps, rev_nextSteps, start_approve, step_type, submitter_name, submitter_organization_fullname, submitter_organization_name, submitter_roles, trace_steps, traces, version_steps;
    step_type = step.step_type;
    nextSteps = [];
    if (step_type === "condition") {
        //step的lines中查询出state=submitted且instance.fields满足其条件的line
        if (values !== void 0) {
            __values = values;
        } else {
            __values = uuflowManager.getUpdatedValues(instance);
        }
        current_approve = null;
        // 获取当前Approve
        traces = instance.traces;
        _.each(traces, function (trace) {
            if (trace.is_finished === false) {
                return current_approve = trace.approves[0];
            }
        });
        start_approve = null;
        // 获取开始节点Approve
        _.each(traces, function (trace) {
            if (!trace.previous_trace_ids || trace.previous_trace_ids.length === 0) {
                return start_approve = trace.approves[0];
            }
        });
        // 申请人所在组织全名称
        applicant_organization_fullname = instance.applicant_organization_fullname;
        // 申请人所在组织的名称
        applicant_organization_name = instance.applicant_organization_name;
        // 申请人的审批岗位
        applicant_roles = uuflowManager.getUserRoles(instance.applicant, instance.space);
        // 申请人的全名
        applicant_name = instance.applicant_name;
        // 填单人所在组织全名称
        submitter_organization_fullname = start_approve.handler_organization_fullname;
        // 填单人所在组织的名称
        submitter_organization_name = start_approve.handler_organization_name;
        // 填单人的审批岗位
        submitter_roles = uuflowManager.getUserRoles(start_approve.handler, instance.space);
        // 填单人的全名
        submitter_name = start_approve.handler_name;
        // 处理人所在组织全名称
        approver_organization_fullname = current_approve.handler_organization_fullname;
        // 处理人所在组织的名称
        approver_organization_name = current_approve.handler_organization_name;
        // 处理人的审批岗位
        approver_roles = uuflowManager.getUserRoles(current_approve.handler, instance.space);
        // 处理人的全名
        approver_name = current_approve.handler_name;
        // Condition中涉及的一些变量
        __values["applicant"] = {};
        __values["applicant"]["roles"] = applicant_roles;
        __values["applicant"]["name"] = applicant_name;
        __values["applicant"]["organization"] = {};
        __values["applicant"]["organization"]["fullname"] = applicant_organization_fullname;
        __values["applicant"]["organization"]["name"] = applicant_organization_name;
        __values["submitter"] = {};
        __values["submitter"]["roles"] = submitter_roles;
        __values["submitter"]["name"] = submitter_name;
        __values["submitter"]["organization"] = {};
        __values["submitter"]["organization"]["fullname"] = submitter_organization_fullname;
        __values["submitter"]["organization"]["name"] = submitter_organization_name;
        __values["approver"] = {};
        __values["approver"]["roles"] = approver_roles;
        __values["approver"]["name"] = approver_name;
        __values["approver"]["organization"] = {};
        __values["approver"]["organization"]["fullname"] = approver_organization_fullname;
        __values["approver"]["organization"]["name"] = approver_organization_name;
        // 获取申请单对应表单
        form = db.forms.findOne(instance.form);
        formVersion = null;
        if (instance.form_version === form.current._id) {
            formVersion = form.current;
        } else {
            formVersion = _.find(form.historys, function (history) {
                return instance.form_version === history._id;
            });
        }
        // 定义表单中字段
        uuflowManager.setFormFieldVariable(formVersion.fields, __values, instance.space);
        // 匹配包括花括号自身在内的所有符号
        reg = /(\{[^{}]*\})/g;
        prefix = "__values";
        _.each(step.lines, function (step_line) {
            var step_line_condition;
            step_line_condition = step_line.condition.replace(reg, function (vowel) {
                return prefix + vowel.replace(/\{\s*/, "[\"").replace(/\s*\}/, "\"]").replace(/\s*\.\s*/g, "\"][\"");
            });
            if (step_line.state === "submitted" && uuflowManager.calculateCondition(__values, step_line_condition)) {
                if (step_line.state === "submitted") {
                    return nextSteps.push(step_line.to_step);
                }
            }
        });
    } else if (step_type === "end") {
        return [];
    } else if (step_type === "submit" || step_type === "start" || step_type === "counterSign") {
        lines = _.filter(step.lines, function (line) {
            return line.state === "submitted";
        });
        if (lines.length === 0) {
            throw new Meteor.Error('error!', "流程的连线配置有误");
        } else {
            nextSteps = _.pluck(lines, 'to_step');
        }
    } else if (step_type === "sign") {
        if (judge === "approved") {
            lines = _.filter(step.lines, function (line) {
                return line.state === "approved";
            });
            if (lines.length === 0) {
                throw new Meteor.Error('error!', "流程的连线配置有误");
            } else {
                nextSteps = _.pluck(lines, 'to_step');
            }
        } else if (judge === "rejected") {
            lines = _.filter(step.lines, function (line) {
                return line.state === "rejected";
            });
            rejectedSteps = _.pluck(lines, 'to_step');
            // 取出instance的traces,取出所有历史trace中(is_finished=ture)的step_id
            trace_steps = [];
            _.each(instance.traces, function (trace) {
                var flowVersions;
                if (trace.is_finished === true) {
                    flowVersions = [];
                    flowVersions.push(flow.current);
                    if (flow.historys) {
                        flowVersions = flowVersions.concat(flow.historys);
                    }
                    return _.each(flowVersions, function (flowVer) {
                        if (flowVer._id === instance.flow_version) {
                            return _.each(flowVer.steps, function (flow_ver_step) {
                                if (flow_ver_step._id === trace.step && flow_ver_step.step_type !== "condition") {
                                    return trace_steps.push(trace.step);
                                }
                            });
                        }
                    });
                }
            });
            // 取出flow,取到instance对应的版本的开始结点和结束结点的step_id
            flow_steps = [];
            if (instance.flow_version === flow.current._id) {
                _.each(flow.current.steps, function (flow_step) {
                    if (flow_step.step_type === "start" || flow_step.step_type === "end") {
                        return flow_steps.push(flow_step._id);
                    }
                });
            } else {
                _.each(flow.historys, function (history) {
                    return _.each(history.steps, function (history_step) {
                        if (history_step.step_type === "start" || history_step.step_type === "end") {
                            return flow_steps.push(history_step._id);
                        }
                    });
                });
            }
            nextSteps = _.union(rejectedSteps, trace_steps, flow_steps);
        }
    }
    // 若下一步中包含 条件节点 则 继续取得 条件节点的 后续步骤
    version_steps = {};
    flowVersions = [];
    flowVersions.push(flow.current);
    if (flow.historys) {
        flowVersions = flowVersions.concat(flow.historys);
    }
    _.each(flowVersions, function (flowVer) {
        if (flowVer._id === instance.flow_version) {
            return _.each(flowVer.steps, function (flow_ver_step) {
                return version_steps[flow_ver_step._id] = flow_ver_step;
            });
        }
    });
    nextSteps = _.uniq(nextSteps);
    _.each(nextSteps, function (next_step_id) {
        var _next_step;
        _next_step = version_steps[next_step_id];
        if (_next_step.step_type === "condition") {
            if (_next_step.lines) {
                return _.each(_next_step.lines, function (line) {
                    if (line.to_step) {
                        return nextSteps.push(line.to_step);
                    }
                });
            }
        }
    });
    nextSteps = _.uniq(nextSteps);
    rev_nextSteps = [];
    _.each(nextSteps, function (nextStepId) {
        var _step;
        _step = uuflowManager.getStep(instance, flow, nextStepId);
        if (isSkipStep(instance, _step)) {
            if (!judge && _step.step_type === 'sign') {
                judge = 'approved';
            }
            return rev_nextSteps = rev_nextSteps.concat(uuflowManager.getNextSteps(instance, flow, _step, judge));
        } else {
            return rev_nextSteps.push(nextStepId);
        }
    });
    rev_nextSteps = _.uniq(rev_nextSteps);
    return rev_nextSteps;
};

uuflowManager.getUpdatedValues = function (instance, approve_id) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getUpdatedValues');
    }
    var newest_values, trace_approve;
    // 取得最新的approve
    trace_approve = null;
    _.each(instance.traces, function (trace) {
        if (trace.is_finished === false) {
            if (approve_id) {
                return trace_approve = _.find(trace.approves, function (approve) {
                    return approve._id === approve_id;
                });
            } else {
                return trace_approve = _.find(trace.approves, function (approve) {
                    return approve.is_finished === false && approve.type !== 'cc' && approve.type !== 'distribute';
                });
            }
        }
    });
    // 取得最新的values
    newest_values = null;
    if (!instance.values) {
        newest_values = trace_approve != null ? trace_approve.values : void 0;
    } else if (!(trace_approve != null ? trace_approve.values : void 0)) {
        newest_values = instance.values;
    } else {
        newest_values = _.extend(_.clone(instance.values), trace_approve.values);
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getUpdatedValues');
    }
    return newest_values;
};

uuflowManager.getForm = function (form_id, options) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getForm');
    }
    var form;
    form = db.forms.findOne(form_id, options);
    if (!form) {
        throw new Meteor.Error('error!', '表单ID有误或此表单已经被删除');
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getForm');
    }
    return form;
};

uuflowManager.getFormVersion = function (form, form_version) {
    var form_v;
    form_v = null;
    if (form_version === form.current._id) {
        form_v = form.current;
    } else {
        form_v = _.find(form.historys, function (form_h) {
            return form_version === form_h._id;
        });
    }
    if (!form_v) {
        throw new Meteor.Error('error!', '未找到表单对应的版本');
    }
    return form_v;
};

uuflowManager.getCategory = function (category_id, options) {
    return db.categories.findOne(category_id, options);
};

uuflowManager.getInstanceName = function (instance, vals) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getInstanceName');
    }
    var applicant, default_value, e, flow, form, form_id, form_v, form_version, func, iscript, name_forumla, rev, script, values;
    default_value = instance.flow_name + ' ' + instance.code;
    form_id = instance.form;
    form_version = instance.form_version;
    form = uuflowManager.getForm(form_id);
    form_v = uuflowManager.getFormVersion(form, form_version);
    name_forumla = form_v.name_forumla;
    if (!name_forumla) {
        if (process.env.STEEDOS_DEBUG) {
            console.time('uuflowManager.getInstanceName');
        }
        return default_value.trim();
    }
    values = _.clone(vals || instance.values) || {};
    applicant = WorkflowManager.getFormulaUserObject(instance.space, instance.applicant);
    values["applicant"] = applicant;
    values["applicant_name"] = instance.applicant_name;
    values["applicant_organization"] = instance.applicant_organization;
    values["applicant_organization_fullname"] = instance.applicant_organization_fullname;
    values["applicant_organization_name"] = instance.applicant_organization_name;
    values["submit_date"] = moment(instance.submit_date).utcOffset(0, false).format("YYYY-MM-DD");
    // 显示下拉框字段类型的label
    if (form_v.fields) {
        for (const field of form_v.fields) {
            if(["select", "multiSelect", "radio"].indexOf(field.type) > -1){
                var fieldOptions = field.options.split("\n").map(function(n){
                    var itemSplits = n.split(":")
                    return {
                        label: itemSplits[0],
                        value: itemSplits[1] || n
                    }
                });
                const value = values[field.code];
                switch (field.type) {
                    case 'select':
                    case 'radio':
                        var selectedOption = fieldOptions.find(function(item){ return item.value == value; })
                        if(selectedOption){
                            values[field.code] = selectedOption.label
                        }
                        break;
                    case 'multiSelect':
                        var splitedValues = value.split(",");
                        var selectedOptions = fieldOptions.filter(function(item){ return splitedValues.indexOf(item.value) > -1; });
                        if(selectedOptions.length){
                            values[field.code] = selectedOptions.map(function(item){ return item.label; }).join(",");
                        }
                        break;
                }
            }
        }
    }
    rev = default_value;
    if (name_forumla) {
        if (name_forumla.indexOf("{applicant.") > -1) {
            iscript = name_forumla.replace(/\{applicant./g, "(applicant.").replace(/\}/g, " || '')");
        }
        iscript = name_forumla.replace(/\{/g, "(values.").replace(/\}/g, " || '')");
        try {
            //		console.log(iscript)
            script = "module.exports = function (applicant, values, flow, form) { return " + iscript + " }";
            func = _eval(script, "getInstanceName");
            rev = func(applicant, values, flow, form) || default_value;
            //文件名中不能包含特殊字符: '? * : " < > \ / |'， 直接替换为空
            rev = rev.replace(/\?|\*|\:|\"|\<|\>|\\|\/|\|/g, "");
        } catch (error) {
            e = error;
            console.log(e);
        }
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getInstanceName');
    }
    return rev.trim();
};

uuflowManager.getApproveValues = function (approve_values, permissions, form_id, form_version) {
    if (process.env.STEEDOS_DEBUG) {
        console.time('uuflowManager.getApproveValues');
    }
    var form_v, instance_form;
    // 如果permissions为null，则approve_values为{}
    if (permissions === null) {
        approve_values = {};
    } else {
        // 获得instance中的所有字段
        instance_form = db.forms.findOne(form_id);
        form_v = null;
        if (form_version === instance_form.current._id) {
            form_v = instance_form.current;
        } else {
            form_v = _.find(instance_form.historys, function (form_h) {
                return form_version === form_h._id;
            });
        }
        _.each(form_v.fields, function (field) {
            if (field.type === "table") {

                //				_.each(field.fields, (tableField)->
                //					if approve_values[field.code] isnt null
                //						_.each(approve_values[field.code], (tableValue)->
                //							if !tableField.formula && (permissions[tableField.code] is null or permissions[tableField.code] isnt "editable")
                //								delete tableValue[tableField.code]
                //						)
                //				)
            } else if (field.type === "section") {
                return _.each(field.fields, function (sectionField) {
                    if (!sectionField.formula && (permissions[sectionField.code] === null || permissions[sectionField.code] !== "editable")) {
                        return delete approve_values[sectionField.code];
                    }
                });
            } else {
                if (!field.formula && (permissions[field.code] === null || permissions[field.code] !== "editable")) {
                    return delete approve_values[field.code];
                }
            }
        });
    }
    if (process.env.STEEDOS_DEBUG) {
        console.timeEnd('uuflowManager.getApproveValues');
    }
    return approve_values;
};

uuflowManager.workflow_engine = function (approve_from_client, current_user_info, current_user, auto_submitted) {
    var applicant_id, approve, approve_id, checkApplicant, description, flow, flow_id, form, geolocation, i, instance, instance_id, instance_trace, judge, key_str, last_step, last_step_type, last_trace, next_step, next_step_id, next_step_type, next_steps, setObj, space, space_id, space_user, space_user_org_info, step, step_type, to_users, trace, trace_approves, trace_id, updateObj, values;
    // console.log('[uuflow_manager.js]>>>>>>>>>>>>>>>>>>>>', 'uuflowManager.workflow_engine');
    instance_id = approve_from_client["instance"];
    trace_id = approve_from_client["trace"];
    approve_id = approve_from_client["_id"];
    values = approve_from_client["values"];
    if (!values) {
        values = {};
    }
    next_steps = approve_from_client["next_steps"];
    judge = approve_from_client["judge"];
    description = approve_from_client["description"];
    geolocation = approve_from_client["geolocation"];
    setObj = {};
    // 获取一个instance
    instance = uuflowManager.getInstance(instance_id);
    space_id = instance.space;
    flow_id = instance.flow;
    // 获取一个space
    space = uuflowManager.getSpace(space_id);
    applicant_id = instance.applicant;
    // 校验申请人user_accepted = true
    checkApplicant = uuflowManager.getSpaceUser(space_id, applicant_id);
    // 获取一个flow
    flow = uuflowManager.getFlow(flow_id);
    // 获取一个space下的一个user
    space_user = uuflowManager.getSpaceUser(space_id, current_user);
    // 获取space_user所在的部门信息
    space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user);
    // 获取一个trace
    trace = uuflowManager.getTrace(instance, trace_id);
    // 获取一个approve
    approve = uuflowManager.getApprove(trace, approve_id);
    // 判断一个trace是否为未完成状态
    uuflowManager.isTraceNotFinished(trace);
    // 判断一个approve是否为未完成状态
    uuflowManager.isApproveNotFinished(approve);
    // 判断一个instance是否为审核中状态
    uuflowManager.isInstancePending(instance);
    // 判断当前用户是否approve 对应的处理人或代理人
    uuflowManager.isHandlerOrAgent(approve, current_user);
    // 先执行审核状态暂存的操作
    // ================begin================
    step = uuflowManager.getStep(instance, flow, trace.step);
    step_type = step.step_type;
    instance_trace = _.find(instance.traces, function (trace) {
        return trace._id === trace_id;
    });
    trace_approves = instance_trace.approves;
    i = 0;
    while (i < trace_approves.length) {
        if (trace_approves[i]._id === approve_id) {
            key_str = "traces.$.approves." + i + ".";
            setObj[key_str + "geolocation"] = geolocation;
            if (step_type === "condition") {

            } else if (step_type === "start" || step_type === "submit") {
                setObj[key_str + "judge"] = "submitted";
                setObj[key_str + "description"] = description;
            } else if (step_type === "sign" || step_type === "counterSign") {
                // 如果是会签并且前台没有显示核准驳回已阅的radio则给judge默认submitted
                if (step_type === "counterSign" && !judge) {
                    judge = 'submitted';
                }
                // 判断前台传的judge是否合法
                uuflowManager.isJudgeLegal(judge);
                setObj[key_str + "judge"] = judge;
                setObj[key_str + "description"] = description;
            }
            setObj[key_str + "next_steps"] = next_steps;
            setObj[key_str + "is_read"] = true;
            if (!trace_approves[i].read_date) {
                setObj[key_str + "read_date"] = new Date;
            }
            // 调整approves 的values 。删除values中在当前步骤中没有编辑权限的字段值
            setObj[key_str + "values"] = uuflowManager.getApproveValues(values, step["permissions"], instance.form, instance.form_version);
            // 更新instance记录
            setObj.modified = new Date;
            setObj.modified_by = current_user;
            db.instances.update({
                _id: instance_id,
                "traces._id": trace_id
            }, {
                $set: setObj
            });
            // 更新instance_tasks
            update_instance_tasks(instance_id, trace_id, approve_id)
            break;
        }
        i++;
    }
    // ================end================
    instance = uuflowManager.getInstance(instance_id);
    // 防止此时的instance已经被处理
    // 获取一个trace
    trace = uuflowManager.getTrace(instance, trace_id);
    // 获取一个approve
    approve = uuflowManager.getApprove(trace, approve_id);
    // 判断一个trace是否为未完成状态
    uuflowManager.isTraceNotFinished(trace);
    // 判断一个approve是否为未完成状态
    uuflowManager.isApproveNotFinished(approve);
    // 判断一个instance是否为审核中状态
    uuflowManager.isInstancePending(instance);
    // 判断当前用户是否approve 对应的处理人或代理人
    uuflowManager.isHandlerOrAgent(approve, current_user);
    updateObj = {};
    if (next_steps === null || next_steps.length === 0) {
        throw new Meteor.Error('error!', '还未指定下一步和处理人，操作失败');
    } else {
        // 验证next_steps里面是否只有一个step
        if (next_steps.length > 1) {
            throw new Meteor.Error('error!', '不能指定多个后续步骤');
        } else {
            // 校验下一步处理人user_accepted = true
            _.each(next_steps[0]["users"], function (next_step_user) {
                var checkSpaceUser;
                return checkSpaceUser = uuflowManager.getSpaceUser(space_id, next_step_user);
            });
        }
        if (step_type === "start" || step_type === "submit" || step_type === "condition") {
            updateObj = uuflowManager.engine_step_type_is_start_or_submit_or_condition(instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info, auto_submitted);
        } else if (step_type === "sign") {
            updateObj = uuflowManager.engine_step_type_is_sign(instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info, description, auto_submitted);
        } else if (step_type === "counterSign") {
            updateObj = uuflowManager.engine_step_type_is_counterSign(instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info, auto_submitted);
        } else if (step_type === "end") {
            throw new Meteor.Error('error!', 'end结点出现approve，服务器错误');
        }
        form = db.forms.findOne(instance.form);
        updateObj.$set.keywords = uuflowManager.caculateKeywords(updateObj.$set.values, form, instance.form_version);
        // 计算extras
        updateObj.$set.extras = uuflowManager.caculateExtras(updateObj.$set.values, form, instance.form_version);
        db.instances.update(instance_id, updateObj);
        // 新增
        if (updateObj.$push && updateObj.$push.traces && updateObj.$push.traces.approves) {
            const newTrace = updateObj.$push.traces
            const approveIds = []
            for (const a of newTrace.approves) {
                approveIds.push(a._id)
            }
            insert_many_instance_tasks(instance_id, newTrace._id, approveIds)
        }
    }
    instance = uuflowManager.getInstance(instance_id);
    instance_trace = _.find(instance.traces, function (trace) {
        return trace._id === trace_id;
    });
    next_step_id = next_steps[0]["step"];
    next_step = uuflowManager.getStep(instance, flow, next_step_id);
    next_step_type = next_step.step_type;
    //发送消息开始
    if ("completed" === instance.state) {
        if ("approved" === instance.final_decision) {
            //通知填单人、申请人
            pushManager.send_instance_notification("approved_completed_applicant", instance, description, current_user_info);
        } else if ("rejected" === instance.final_decision) {
            //通知填单人、申请人
            pushManager.send_instance_notification("rejected_completed_applicant", instance, description, current_user_info);
        } else {
            //通知填单人、申请人
            pushManager.send_instance_notification("submit_completed_applicant", instance, description, current_user_info);
        }
    } else if ("pending" === instance.state) {
        if ("rejected" === instance_trace.judge && instance_trace.is_finished === true) {
            if ('start' === next_step_type) {
                //驳回给申请人时，发送短消息
                pushManager.send_instance_notification("submit_pending_rejected_applicant_inbox", instance, description, current_user_info);
            } else {
                //通知填单人、申请人
                pushManager.send_instance_notification("submit_pending_rejected_applicant", instance, description, current_user_info);
                // 发送消息给下一步处理人
                pushManager.send_instance_notification("submit_pending_rejected_inbox", instance, description, current_user_info);
            }
        } else if (instance_trace.is_finished === false) {

        } else {
            // 发送消息给下一步处理人
            // 会签 并且当前trace未结束
            // 发送push消息 给 inbox_users
            pushManager.send_instance_notification("submit_pending_inbox", instance, description, current_user_info);
        }
    }
    //发送消息给当前用户
    pushManager.send_message_current_user(current_user_info);
    // 如果已经配置webhook并已激活则触发
    to_users = instance.inbox_users;
    last_trace = _.last(instance.traces);
    last_step = uuflowManager.getStep(instance, flow, last_trace.step);
    last_step_type = last_step.step_type;
    if (last_step_type === "counterSign" && _.where(last_trace.approves, {
        is_finished: true
    }).length > 0) {
        to_users = [];
    }
    pushManager.triggerWebhook(flow_id, instance, approve_from_client, 'engine_submit', current_user, to_users);
    // 判断申请单是否分发，分发文件结束提醒发起人
    uuflowManager.distributedInstancesRemind(instance);
    return instance;
};

uuflowManager.engine_step_type_is_start_or_submit_or_condition = function (instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info, auto_submitted) {
    var approveFinishDate, h, i, instance_trace, instance_traces, newTrace, nextSteps, next_step, next_step_id, next_step_name, next_step_type, next_step_users, next_user_ids, setObj, setTraceObj, space_id, trace_approve, updateObj, updated_values;
    setObj = {};
    updateObj = {};
    setTraceObj = {};
    space_id = instance.space;
    // 验证next_steps.step是否合法
    nextSteps = uuflowManager.getNextSteps(instance, flow, step, "");
    // 判断next_steps.step是否在nextSteps中,若不在则不合法
    _.each(next_steps, function (approve_next_step) {
        if (!nextSteps.includes(approve_next_step["step"])) {
            throw new Meteor.Error('error!', "approve中next_steps.step：" + approve_next_step.step + " 不合法");
        }
    });
    // 若合法,执行流转
    next_step_id = next_steps[0]["step"];
    next_step = uuflowManager.getStep(instance, flow, next_step_id);
    next_step_type = next_step.step_type;
    next_step_name = next_step.name;
    // 判断next_step是否为结束结点
    if (next_step_type === "end") {
        // 若是结束结点
        instance_traces = instance.traces;
        i = 0;
        while (i < instance_traces.length) {
            if (instance_traces[i]._id === trace_id) {
                // 更新当前trace记录
                setTraceObj[`traces.${i}.is_finished`] = true;
                setTraceObj[`traces.${i}.finish_date`] = new Date;
                setTraceObj[`traces.${i}.judge`] = judge;
                h = 0;
                while (h < instance_traces[i].approves.length) {
                    if (instance_traces[i].approves[h]._id === approve_id) {
                        // 更新当前trace.approve记录
                        approveFinishDate = new Date;
                        setTraceObj[`traces.${i}.approves.${h}.is_finished`] = true;
                        setTraceObj[`traces.${i}.approves.${h}.handler`] = current_user;
                        setTraceObj[`traces.${i}.approves.${h}.handler_name`] = current_user_info.name;
                        setTraceObj[`traces.${i}.approves.${h}.finish_date`] = approveFinishDate;
                        setTraceObj[`traces.${i}.approves.${h}.handler_organization`] = space_user_org_info["organization"];
                        setTraceObj[`traces.${i}.approves.${h}.handler_organization_name`] = space_user_org_info["organization_name"];
                        setTraceObj[`traces.${i}.approves.${h}.handler_organization_fullname`] = space_user_org_info["organization_fullname"];
                        setTraceObj[`traces.${i}.approves.${h}.cost_time`] = approveFinishDate - instance_traces[i].approves[h].start_date;
                        setTraceObj[`traces.${i}.approves.${h}.auto_submitted`] = auto_submitted;
                    }
                    h++;
                }
            }
            i++;
        }
        // 插入下一步trace记录
        newTrace = {};
        newTrace._id = new Mongo.ObjectID()._str;
        newTrace.instance = instance_id;
        newTrace.previous_trace_ids = [trace_id];
        newTrace.is_finished = true;
        newTrace.step = next_step_id;
        newTrace.name = next_step_name;
        newTrace.start_date = new Date;
        newTrace.finish_date = new Date;
        // 更新instance记录
        setObj.state = "completed";
        setObj.modified = new Date;
        setObj.modified_by = current_user;
        setObj.values = uuflowManager.getUpdatedValues(instance);
        instance.values = setObj.values;
        setObj.name = uuflowManager.getInstanceName(instance);
        instance_trace = _.find(instance_traces, function (trace) {
            return trace._id === trace_id;
        });
        trace_approve = _.find(instance_trace.approves, function (approve) {
            return approve._id === approve_id;
        });
        updateObj.$addToSet = {
            outbox_users: {
                $each: [trace_approve.handler, trace_approve.user]
            }
        };
        updateObj.$push = {
            traces: newTrace
        };
        setObj.inbox_users = [];
        setObj.finish_date = new Date;
        setObj.current_step_name = next_step_name;
        setObj.final_decision = 'approved';
        setObj.current_step_auto_submit = false;
    } else {
        // 若不是结束结点
        // 先判断nextsteps.step.users是否为空
        next_step_users = next_steps[0]["users"];
        if (next_step_users === null || next_step_users.length === 0) {
            throw new Meteor.Error('error!', "未指定下一步处理人");
        } else {
            if (next_step_users.length > 1 && next_step.step_type !== "counterSign") {
                throw new Meteor.Error('error!', "不能指定多个处理人");
            } else {
                // 验证next_user是否合法，调用getHandlersManager.getHandlers(:instance_id,当前trace对应的step_id),判断next_user是否在其返回的结果中
                next_user_ids = getHandlersManager.getHandlers(instance_id, next_step_id, current_user);
                if (!uuflowManager.checkNestStepUsersIsValid(next_step_users, next_user_ids, next_step)) {
                    throw new Meteor.Error('error!', "指定的下一步处理人有误");
                } else {
                    // 若合法，执行流转操作
                    instance_traces = instance.traces;
                    i = 0;
                    while (i < instance_traces.length) {
                        if (instance_traces[i]._id === trace_id) {
                            // 更新当前trace记录
                            setTraceObj[`traces.${i}.is_finished`] = true;
                            setTraceObj[`traces.${i}.finish_date`] = new Date;
                            setTraceObj[`traces.${i}.judge`] = judge;
                            h = 0;
                            while (h < instance_traces[i].approves.length) {
                                if (instance_traces[i].approves[h]._id === approve_id) {
                                    // 更新当前trace.approve记录
                                    approveFinishDate = new Date;
                                    setTraceObj[`traces.${i}.approves.${h}.is_finished`] = true;
                                    setTraceObj[`traces.${i}.approves.${h}.handler`] = current_user;
                                    setTraceObj[`traces.${i}.approves.${h}.handler_name`] = current_user_info.name;
                                    setTraceObj[`traces.${i}.approves.${h}.finish_date`] = approveFinishDate;
                                    setTraceObj[`traces.${i}.approves.${h}.handler_organization`] = space_user_org_info["organization"];
                                    setTraceObj[`traces.${i}.approves.${h}.handler_organization_name`] = space_user_org_info["organization_name"];
                                    setTraceObj[`traces.${i}.approves.${h}.handler_organization_fullname`] = space_user_org_info["organization_fullname"];
                                    setTraceObj[`traces.${i}.approves.${h}.cost_time`] = approveFinishDate - instance_traces[i].approves[h].start_date;
                                    setTraceObj[`traces.${i}.approves.${h}.auto_submitted`] = auto_submitted;
                                }
                                h++;
                            }
                        }
                        i++;
                    }
                    // 插入下一步trace记录
                    newTrace = {};
                    newTrace._id = new Mongo.ObjectID()._str;
                    newTrace.instance = instance_id;
                    newTrace.previous_trace_ids = [trace_id];
                    newTrace.is_finished = false;
                    newTrace.step = next_step_id;
                    newTrace.name = next_step_name;
                    newTrace.start_date = new Date;
                    newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours, space_id);
                    newTrace.approves = [];
                    updated_values = uuflowManager.getUpdatedValues(instance);
                    _.each(next_step_users, function (next_step_user_id, idx) {
                        var agent, handler_id, handler_info, newApprove, next_step_space_user, next_step_user_org_info, user_info;
                        // 插入下一步trace.approve记录
                        newApprove = {};
                        newApprove._id = new Mongo.ObjectID()._str;
                        newApprove.instance = instance_id;
                        newApprove.trace = newTrace._id;
                        newApprove.is_finished = false;
                        newApprove.user = next_step_user_id;
                        user_info = db.users.findOne({
                            _id: next_step_user_id
                        }, {
                            fields: {
                                name: 1
                            }
                        });
                        newApprove.user_name = user_info.name;
                        handler_id = next_step_user_id;
                        handler_info = user_info;
                        agent = uuflowManager.getAgent(space_id, next_step_user_id);
                        if (agent) {
                            next_step_users[idx] = agent;
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
                        next_step_space_user = db.space_users.findOne({
                            space: space_id,
                            user: handler_id
                        });
                        // 获取next_step_user所在的部门信息
                        next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user);
                        newApprove.handler_organization = next_step_user_org_info["organization"];
                        newApprove.handler_organization_name = next_step_user_org_info["organization_name"];
                        newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"];
                        newApprove.start_date = new Date;
                        newApprove.due_date = newTrace.due_date;
                        newApprove.is_read = false;
                        newApprove.is_error = false;
                        newApprove.values = {};
                        uuflowManager.setRemindInfo(updated_values, newApprove);
                        return newTrace.approves.push(newApprove);
                    });
                    // 更新instance记录
                    setObj.state = "pending";
                    setObj.modified = new Date;
                    setObj.modified_by = current_user;
                    setObj.values = updated_values;
                    instance.values = setObj.values;
                    setObj.name = uuflowManager.getInstanceName(instance);
                    instance_trace = _.find(instance_traces, function (trace) {
                        return trace._id === trace_id;
                    });
                    trace_approve = _.find(instance_trace.approves, function (approve) {
                        return approve._id === approve_id;
                    });
                    updateObj.$addToSet = {
                        outbox_users: {
                            $each: [trace_approve.handler, trace_approve.user]
                        }
                    };
                    setObj.inbox_users = next_step_users;
                    updateObj.$push = {
                        traces: newTrace
                    };
                    setObj.current_step_name = next_step_name;
                    setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines);
                }
            }
        }
    }
    db.instances.update(instance_id, {
        $set: setTraceObj
    });
    // 更新instance_tasks
    update_instance_tasks(instance_id, trace_id, approve_id)
    updateObj.$set = setObj;
    return updateObj;
};

uuflowManager.engine_step_type_is_sign = function (instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info, description, auto_submitted) {
    var approveFinishDate, h, i, instance_trace, instance_traces, newTrace, nextSteps, next_step, next_step_id, next_step_name, next_step_type, next_step_users, next_user_ids, setObj, setTraceObj, space_id, trace_approve, updateObj, updated_values;
    updateObj = {};
    setObj = {};
    setTraceObj = {};
    space_id = instance.space;
    // 验证approve的judge是否为空
    if (!judge) {
        throw new Meteor.Error('error!', "单签结点还未选择处理意见，操作失败");
    } else {
        if (judge === "approved") {
            // 验证next_steps.step是否合法,判断next_steps.step是否在其中
            nextSteps = uuflowManager.getNextSteps(instance, flow, step, "approved");
            // 判断next_steps.step是否在nextSteps中,若不在则不合法
            _.each(next_steps, function (approve_next_step) {
                if (!nextSteps.includes(approve_next_step["step"])) {
                    throw new Meteor.Error('error!', "指定的下一步有误");
                }
            });
            // 若合法,执行流转
            next_step_id = next_steps[0]["step"];
            next_step = uuflowManager.getStep(instance, flow, next_step_id);
            next_step_type = next_step["step_type"];
            next_step_name = next_step["name"];
            // 判断next_step是否为结束结点
            if (next_step_type === "end") {
                // 若是结束结点
                instance_traces = instance.traces;
                i = 0;
                while (i < instance_traces.length) {
                    if (instance_traces[i]._id === trace_id) {
                        // 更新当前trace记录
                        setTraceObj[`traces.${i}.is_finished`] = true;
                        setTraceObj[`traces.${i}.finish_date`] = new Date;
                        setTraceObj[`traces.${i}.judge`] = judge;
                        h = 0;
                        while (h < instance_traces[i].approves.length) {
                            if (instance_traces[i].approves[h]._id === approve_id) {
                                // 更新当前trace.approve记录
                                approveFinishDate = new Date;
                                setTraceObj[`traces.${i}.approves.${h}.is_finished`] = true;
                                setTraceObj[`traces.${i}.approves.${h}.handler`] = current_user;
                                setTraceObj[`traces.${i}.approves.${h}.handler_name`] = current_user_info.name;
                                setTraceObj[`traces.${i}.approves.${h}.finish_date`] = approveFinishDate;
                                setTraceObj[`traces.${i}.approves.${h}.handler_organization`] = space_user_org_info["organization"];
                                setTraceObj[`traces.${i}.approves.${h}.handler_organization_name`] = space_user_org_info["organization_name"];
                                setTraceObj[`traces.${i}.approves.${h}.handler_organization_fullname`] = space_user_org_info["organization_fullname"];
                                setTraceObj[`traces.${i}.approves.${h}.cost_time`] = approveFinishDate - instance_traces[i].approves[h].start_date;
                                setTraceObj[`traces.${i}.approves.${h}.auto_submitted`] = auto_submitted;
                            }
                            h++;
                        }
                    }
                    i++;
                }
                // 插入下一步trace记录
                newTrace = {};
                newTrace._id = new Mongo.ObjectID()._str;
                newTrace.instance = instance_id;
                newTrace.previous_trace_ids = [trace_id];
                newTrace.is_finished = true;
                newTrace.step = next_step_id;
                newTrace.name = next_step_name;
                newTrace.start_date = new Date;
                newTrace.finish_date = new Date;
                // 更新instance记录
                setObj.state = "completed";
                setObj.final_decision = judge;
                setObj.modified = new Date;
                setObj.modified_by = current_user;
                setObj.values = uuflowManager.getUpdatedValues(instance);
                instance.values = setObj.values;
                setObj.name = uuflowManager.getInstanceName(instance);
                instance_trace = _.find(instance_traces, function (trace) {
                    return trace._id === trace_id;
                });
                trace_approve = _.find(instance_trace.approves, function (approve) {
                    return approve._id === approve_id;
                });
                updateObj.$addToSet = {
                    outbox_users: {
                        $each: [trace_approve.handler, trace_approve.user]
                    }
                };
                updateObj.$push = {
                    traces: newTrace
                };
                setObj.inbox_users = [];
                setObj.finish_date = new Date;
                setObj.current_step_name = next_step_name;
                setObj.current_step_auto_submit = false;
            } else {
                // 若不是结束结点
                // 先判断nextsteps.step.users是否为空
                next_step_users = next_steps[0]["users"];
                if (next_step_users === null || next_step_users.length === 0) {
                    throw new Meteor.Error('error!', "未指定下一步处理人");
                } else {
                    if (next_step_users.length > 1 && next_step["step_type"] !== "counterSign") {
                        throw new Meteor.Error('error!', "不能指定多个处理人");
                    } else {
                        // 验证next_user是否合法，调用getHandlersManager.getHandlers(:instance_id,当前trace对应的step_id),判断next_user是否在其返回的结果中
                        next_user_ids = getHandlersManager.getHandlers(instance_id, next_step_id, current_user);
                        if (!uuflowManager.checkNestStepUsersIsValid(next_step_users, next_user_ids, next_step)) {
                            throw new Meteor.Error('error!', "指定的下一步处理人有误");
                        } else {
                            // 若合法，执行流转操作
                            instance_traces = instance.traces;
                            i = 0;
                            while (i < instance_traces.length) {
                                if (instance_traces[i]._id === trace_id) {
                                    // 更新当前trace记录
                                    setTraceObj[`traces.${i}.is_finished`] = true;
                                    setTraceObj[`traces.${i}.finish_date`] = new Date;
                                    setTraceObj[`traces.${i}.judge`] = judge;
                                    h = 0;
                                    while (h < instance_traces[i].approves.length) {
                                        if (instance_traces[i].approves[h]._id === approve_id) {
                                            // 更新当前trace.approve记录
                                            approveFinishDate = new Date;
                                            setTraceObj[`traces.${i}.approves.${h}.is_finished`] = true;
                                            setTraceObj[`traces.${i}.approves.${h}.handler`] = current_user;
                                            setTraceObj[`traces.${i}.approves.${h}.handler_name`] = current_user_info.name;
                                            setTraceObj[`traces.${i}.approves.${h}.finish_date`] = approveFinishDate;
                                            setTraceObj[`traces.${i}.approves.${h}.handler_organization`] = space_user_org_info["organization"];
                                            setTraceObj[`traces.${i}.approves.${h}.handler_organization_name`] = space_user_org_info["organization_name"];
                                            setTraceObj[`traces.${i}.approves.${h}.handler_organization_fullname`] = space_user_org_info["organization_fullname"];
                                            setTraceObj[`traces.${i}.approves.${h}.cost_time`] = approveFinishDate - instance_traces[i].approves[h].start_date;
                                            setTraceObj[`traces.${i}.approves.${h}.auto_submitted`] = auto_submitted;
                                        }
                                        h++;
                                    }
                                }
                                i++;
                            }
                            // 插入下一步trace记录
                            newTrace = {};
                            newTrace._id = new Mongo.ObjectID()._str;
                            newTrace.instance = instance_id;
                            newTrace.previous_trace_ids = [trace_id];
                            newTrace.is_finished = false;
                            newTrace.step = next_step_id;
                            newTrace.name = next_step_name;
                            newTrace.start_date = new Date;
                            newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours, space_id);
                            newTrace.approves = [];
                            updated_values = uuflowManager.getUpdatedValues(instance);
                            _.each(next_step_users, function (next_step_user_id, idx) {
                                var agent, handler_id, handler_info, newApprove, next_step_space_user, next_step_user_org_info, user_info;
                                // 插入下一步trace.approve记录
                                newApprove = {};
                                newApprove._id = new Mongo.ObjectID()._str;
                                newApprove.instance = instance_id;
                                newApprove.trace = newTrace._id;
                                newApprove.is_finished = false;
                                newApprove.user = next_step_user_id;
                                user_info = db.users.findOne({
                                    _id: next_step_user_id
                                }, {
                                    fields: {
                                        name: 1
                                    }
                                });
                                newApprove.user_name = user_info.name;
                                handler_id = next_step_user_id;
                                handler_info = user_info;
                                agent = uuflowManager.getAgent(space_id, next_step_user_id);
                                if (agent) {
                                    next_step_users[idx] = agent;
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
                                next_step_space_user = db.space_users.findOne({
                                    space: space_id,
                                    user: handler_id
                                });
                                // 获取next_step_user所在的部门信息
                                next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user);
                                newApprove.handler_organization = next_step_user_org_info["organization"];
                                newApprove.handler_organization_name = next_step_user_org_info["organization_name"];
                                newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"];
                                newApprove.start_date = new Date;
                                newApprove.due_date = newTrace.due_date;
                                newApprove.is_read = false;
                                newApprove.is_error = false;
                                newApprove.values = {};
                                uuflowManager.setRemindInfo(updated_values, newApprove);
                                return newTrace.approves.push(newApprove);
                            });
                            // 更新instance记录
                            setObj.final_decision = judge;
                            setObj.modified = new Date;
                            setObj.modified_by = current_user;
                            setObj.values = updated_values;
                            instance.values = setObj.values;
                            setObj.name = uuflowManager.getInstanceName(instance);
                            instance_trace = _.find(instance_traces, function (trace) {
                                return trace._id === trace_id;
                            });
                            trace_approve = _.find(instance_trace.approves, function (approve) {
                                return approve._id === approve_id;
                            });
                            setObj.inbox_users = next_step_users;
                            updateObj.$addToSet = {
                                outbox_users: {
                                    $each: [trace_approve.handler, trace_approve.user]
                                }
                            };
                            updateObj.$push = {
                                traces: newTrace
                            };
                            setObj.state = "pending";
                            setObj.current_step_name = next_step_name;
                            setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines);
                        }
                    }
                }
            }
        } else if (judge === "rejected") {
            if (!description) {
                throw new Meteor.Error('error!', "请填写驳回理由");
            } else {
                // 验证next_steps.step是否合法,判断next_steps.step是否在其中
                nextSteps = uuflowManager.getNextSteps(instance, flow, step, "rejected");
                // 判断next_steps.step是否在nextSteps中,若不在则不合法
                _.each(next_steps, function (approve_next_step) {
                    if (!nextSteps.includes(approve_next_step["step"])) {
                        throw new Meteor.Error('error!', "指定的下一步有误");
                    }
                });
                // 若合法,执行流转
                next_step_id = next_steps[0]["step"];
                next_step = uuflowManager.getStep(instance, flow, next_step_id);
                next_step_type = next_step["step_type"];
                next_step_name = next_step["name"];
                // 判断next_step是否为结束结点
                if (next_step_type === "end") {
                    // 若是结束结点
                    instance_traces = instance.traces;
                    i = 0;
                    while (i < instance_traces.length) {
                        if (instance_traces[i]._id === trace_id) {
                            // 更新当前trace记录
                            setTraceObj[`traces.${i}.is_finished`] = true;
                            setTraceObj[`traces.${i}.finish_date`] = new Date;
                            setTraceObj[`traces.${i}.judge`] = judge;
                            h = 0;
                            while (h < instance_traces[i].approves.length) {
                                if (instance_traces[i].approves[h]._id === approve_id) {
                                    // 更新当前trace.approve记录
                                    approveFinishDate = new Date;
                                    setTraceObj[`traces.${i}.approves.${h}.is_finished`] = true;
                                    setTraceObj[`traces.${i}.approves.${h}.handler`] = current_user;
                                    setTraceObj[`traces.${i}.approves.${h}.handler_name`] = current_user_info.name;
                                    setTraceObj[`traces.${i}.approves.${h}.finish_date`] = approveFinishDate;
                                    setTraceObj[`traces.${i}.approves.${h}.handler_organization`] = space_user_org_info["organization"];
                                    setTraceObj[`traces.${i}.approves.${h}.handler_organization_name`] = space_user_org_info["organization_name"];
                                    setTraceObj[`traces.${i}.approves.${h}.handler_organization_fullname`] = space_user_org_info["organization_fullname"];
                                    setTraceObj[`traces.${i}.approves.${h}.cost_time`] = approveFinishDate - instance_traces[i].approves[h].start_date;
                                    setTraceObj[`traces.${i}.approves.${h}.auto_submitted`] = auto_submitted;
                                }
                                h++;
                            }
                        }
                        i++;
                    }
                    // 插入下一步trace记录
                    newTrace = {};
                    newTrace._id = new Mongo.ObjectID()._str;
                    newTrace.instance = instance_id;
                    newTrace.previous_trace_ids = [trace_id];
                    newTrace.is_finished = true;
                    newTrace.step = next_step_id;
                    newTrace.name = next_step_name;
                    newTrace.start_date = new Date;
                    newTrace.finish_date = new Date;
                    // 更新instance记录
                    setObj.state = "completed";
                    setObj.final_decision = judge;
                    setObj.modified = new Date;
                    setObj.modified_by = current_user;
                    setObj.values = uuflowManager.getUpdatedValues(instance);
                    instance.values = setObj.values;
                    setObj.name = uuflowManager.getInstanceName(instance);
                    instance_trace = _.find(instance_traces, function (trace) {
                        return trace._id === trace_id;
                    });
                    trace_approve = _.find(instance_trace.approves, function (approve) {
                        return approve._id === approve_id;
                    });
                    updateObj.$addToSet = {
                        outbox_users: {
                            $each: [trace_approve.handler, trace_approve.user]
                        }
                    };
                    updateObj.$push = {
                        traces: newTrace
                    };
                    setObj.inbox_users = [];
                    setObj.finish_date = new Date;
                    setObj.current_step_name = next_step_name;
                    setObj.current_step_auto_submit = false;
                } else {
                    // 若不是结束结点
                    // 先判断nextsteps.step.users是否为空
                    next_step_users = next_steps[0]["users"];
                    if (next_step_users === null || next_step_users.length === 0) {
                        throw new Meteor.Error('error!', "未指定下一步处理人");
                    } else {
                        if (next_step_users.length > 1 && next_step["step_type"] !== "counterSign") {
                            throw new Meteor.Error('error!', "不能指定多个处理人");
                        } else {
                            // 验证next_user是否合法，调用getHandlersManager.getHandlers(:instance_id,当前trace对应的step_id),判断next_user是否在其返回的结果中
                            next_user_ids = getHandlersManager.getHandlers(instance_id, next_step_id, current_user);
                            if (!uuflowManager.checkNestStepUsersIsValid(next_step_users, next_user_ids, next_step)) {
                                throw new Meteor.Error('error!', "指定的下一步处理人有误");
                            } else {
                                // 若合法，执行流转操作
                                instance_traces = instance.traces;
                                i = 0;
                                while (i < instance_traces.length) {
                                    if (instance_traces[i]._id === trace_id) {
                                        // 更新当前trace记录
                                        setTraceObj[`traces.${i}.is_finished`] = true;
                                        setTraceObj[`traces.${i}.finish_date`] = new Date;
                                        setTraceObj[`traces.${i}.judge`] = judge;
                                        h = 0;
                                        while (h < instance_traces[i].approves.length) {
                                            if (instance_traces[i].approves[h]._id === approve_id) {
                                                // 更新当前trace.approve记录
                                                approveFinishDate = new Date;
                                                setTraceObj[`traces.${i}.approves.${h}.is_finished`] = true;
                                                setTraceObj[`traces.${i}.approves.${h}.handler`] = current_user;
                                                setTraceObj[`traces.${i}.approves.${h}.handler_name`] = current_user_info.name;
                                                setTraceObj[`traces.${i}.approves.${h}.finish_date`] = approveFinishDate;
                                                setTraceObj[`traces.${i}.approves.${h}.handler_organization`] = space_user_org_info["organization"];
                                                setTraceObj[`traces.${i}.approves.${h}.handler_organization_name`] = space_user_org_info["organization_name"];
                                                setTraceObj[`traces.${i}.approves.${h}.handler_organization_fullname`] = space_user_org_info["organization_fullname"];
                                                setTraceObj[`traces.${i}.approves.${h}.cost_time`] = approveFinishDate - instance_traces[i].approves[h].start_date;
                                                setTraceObj[`traces.${i}.approves.${h}.auto_submitted`] = auto_submitted;
                                            }
                                            h++;
                                        }
                                    }
                                    i++;
                                }
                                // 插入下一步trace记录
                                newTrace = {};
                                newTrace._id = new Mongo.ObjectID()._str;
                                newTrace.instance = instance_id;
                                newTrace.previous_trace_ids = [trace_id];
                                newTrace.is_finished = false;
                                newTrace.step = next_step_id;
                                newTrace.name = next_step_name;
                                newTrace.start_date = new Date;
                                newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours, space_id);
                                newTrace.approves = [];
                                updated_values = uuflowManager.getUpdatedValues(instance);
                                _.each(next_step_users, function (next_step_user_id, idx) {
                                    var agent, handler_id, handler_info, newApprove, next_step_space_user, next_step_user_org_info, user_info;
                                    // 插入下一步trace.approve记录
                                    newApprove = {};
                                    newApprove._id = new Mongo.ObjectID()._str;
                                    newApprove.instance = instance_id;
                                    newApprove.trace = newTrace._id;
                                    newApprove.is_finished = false;
                                    newApprove.user = next_step_user_id;
                                    user_info = db.users.findOne({
                                        _id: next_step_user_id
                                    }, {
                                        fields: {
                                            name: 1
                                        }
                                    });
                                    newApprove.user_name = user_info.name;
                                    handler_id = next_step_user_id;
                                    handler_info = user_info;
                                    agent = uuflowManager.getAgent(space_id, next_step_user_id);
                                    if (agent) {
                                        next_step_users[idx] = agent;
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
                                    next_step_space_user = db.space_users.findOne({
                                        space: space_id,
                                        user: handler_id
                                    });
                                    // 获取next_step_user所在的部门信息
                                    next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user);
                                    newApprove.handler_organization = next_step_user_org_info["organization"];
                                    newApprove.handler_organization_name = next_step_user_org_info["organization_name"];
                                    newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"];
                                    newApprove.start_date = new Date;
                                    newApprove.due_date = newTrace.due_date;
                                    newApprove.is_read = false;
                                    newApprove.is_error = false;
                                    newApprove.values = {};
                                    uuflowManager.setRemindInfo(updated_values, newApprove);
                                    return newTrace.approves.push(newApprove);
                                });
                                // 更新instance记录
                                setObj.final_decision = judge;
                                setObj.modified = new Date;
                                setObj.modified_by = current_user;
                                setObj.values = updated_values;
                                instance.values = setObj.values;
                                setObj.name = uuflowManager.getInstanceName(instance);
                                instance_trace = _.find(instance_traces, function (trace) {
                                    return trace._id === trace_id;
                                });
                                trace_approve = _.find(instance_trace.approves, function (approve) {
                                    return approve._id === approve_id;
                                });
                                setObj.inbox_users = next_step_users;
                                updateObj.$addToSet = {
                                    outbox_users: {
                                        $each: [trace_approve.handler, trace_approve.user]
                                    }
                                };
                                updateObj.$push = {
                                    traces: newTrace
                                };
                                setObj.state = "pending";
                                setObj.current_step_name = next_step_name;
                                setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines);
                            }
                        }
                    }
                }
            }
        }
    }
    db.instances.update(instance_id, {
        $set: setTraceObj
    });
    // 更新instance_tasks
    update_instance_tasks(instance_id, trace_id, approve_id)
    updateObj.$set = setObj;
    return updateObj;
};

uuflowManager.engine_step_type_is_counterSign = function (instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info, auto_submitted) {
    var approveFinishDate, final_decision, h, i, instance_trace, instance_traces, isAllApproveFinished, newTrace, nextSteps, next_step, next_step_id, next_step_name, next_step_type, next_step_users, next_user_ids, setObj, setTraceObj, space_id, trace_approve, updateObj, updated_values;
    setObj = {};
    updateObj = {};
    setTraceObj = {};
    space_id = instance.space;
    const finishedApproveIds = []
    // 验证approve的judge是否为空
    if (!judge) {
        throw new Meteor.Error('error!', "请选择核准或驳回。");
    } else {
        if (step.oneClickApproval && ['approved', 'readed'].includes(judge)) {
            // 验证next_steps.step是否合法,判断next_steps.step是否在其中
            nextSteps = uuflowManager.getNextSteps(instance, flow, step, "approved");
            // 判断next_steps.step是否在nextSteps中,若不在则不合法
            _.each(next_steps, function (approve_next_step) {
                if (!nextSteps.includes(approve_next_step["step"])) {
                    throw new Meteor.Error('error!', "指定的下一步有误");
                }
            });
        }
        // 若合法,执行流转
        next_step_id = next_steps[0]["step"];
        next_step = uuflowManager.getStep(instance, flow, next_step_id);
        next_step_type = next_step["step_type"];
        next_step_name = next_step["name"];
        instance_traces = instance.traces;
        isAllApproveFinished = true;
        i = 0;
        while (i < instance_traces.length) {
            if (instance_traces[i]._id === trace_id) {
                h = 0;
                while (h < instance_traces[i].approves.length) {
                    if (instance_traces[i].approves[h]._id === approve_id || ((step.oneClickApproval && ['approved', 'readed'].includes(judge)) || (step.oneClickRejection && 'rejected' === judge))) {
                        // 更新当前trace.approve记录
                        approveFinishDate = new Date;
                        setTraceObj[`traces.${i}.approves.${h}.is_finished`] = true;
                        setTraceObj[`traces.${i}.approves.${h}.finish_date`] = approveFinishDate;
                        setTraceObj[`traces.${i}.approves.${h}.cost_time`] = approveFinishDate - instance_traces[i].approves[h].start_date;
                        setTraceObj[`traces.${i}.approves.${h}.auto_submitted`] = auto_submitted;
                        finishedApproveIds.push(instance_traces[i].approves[h]._id)
                    }
                    else if (instance_traces[i].approves[h].is_finished === false && instance_traces[i].approves[h].type !== 'cc' && instance_traces[i].approves[h].type !== 'distribute') {
                        isAllApproveFinished = false;
                    }
                    h++;
                }
            }
            i++;
        }
        if (isAllApproveFinished === true) {
            i = 0;
            while (i < instance_traces.length) {
                if (instance_traces[i]._id === trace_id) {
                    // 更新当前trace记录
                    setTraceObj[`traces.${i}.is_finished`] = true;
                    setTraceObj[`traces.${i}.finish_date`] = new Date;
                    setTraceObj[`traces.${i}.judge`] = "submitted";
                }
                i++;
            }
            // 判断next_step是否为结束结点
            if (next_step_type === "end") {
                // 插入下一步trace记录
                newTrace = {};
                newTrace._id = new Mongo.ObjectID()._str;
                newTrace.instance = instance_id;
                newTrace.previous_trace_ids = [trace_id];
                newTrace.is_finished = true;
                newTrace.step = next_step_id;
                newTrace.name = next_step_name;
                newTrace.start_date = new Date;
                newTrace.finish_date = new Date;
                // 更新instance记录
                setObj.state = "completed";
                setObj.modified = new Date;
                setObj.modified_by = current_user;
                instance_trace = _.find(instance_traces, function (trace) {
                    return trace._id === trace_id;
                });
                trace_approve = _.find(instance_trace.approves, function (approve) {
                    return approve._id === approve_id;
                });
                setObj.inbox_users = [];
                updateObj.$addToSet = {
                    outbox_users: {
                        $each: [trace_approve.handler, trace_approve.user]
                    }
                };
                updateObj.$push = {
                    traces: newTrace
                };
                setObj.finish_date = new Date;
                updated_values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id), approve_id);
                setObj.values = updated_values;
                setObj.name = uuflowManager.getInstanceName(instance);
                setObj.current_step_name = next_step_name;
                final_decision = '';
                if (step.oneClickApproval && ['approved', 'readed'].includes(judge)) {
                    // 如果开启了一键核准并且选择了核准则设置final_decision为approved
                    final_decision = 'approved';
                } else if (step.oneClickRejection && 'rejected' === judge) {
                    // 如果开启了一键驳回并且选择了驳回则设置final_decision为rejected
                    final_decision = 'rejected';
                }
                setObj.final_decision = final_decision || 'approved'; // 会签到结束默认为approved
                setObj.current_step_auto_submit = false;
            } else {
                // 若不是结束结点
                // 先判断nextsteps.step.users是否为空
                next_step_users = next_steps[0]["users"];
                if (next_step_users === null || next_step_users.length === 0) {
                    throw new Meteor.Error('error!', "未指定下一步处理人");
                } else {
                    if (next_step_users.length > 1 && next_step["step_type"] !== "counterSign") {
                        throw new Meteor.Error('error!', "不能指定多个处理人");
                    } else {
                        // 验证next_user是否合法，调用getHandlersManager.getHandlers(:instance_id,当前trace对应的step_id),判断next_user是否在其返回的结果中
                        next_user_ids = getHandlersManager.getHandlers(instance_id, next_step_id, current_user);
                        if (!uuflowManager.checkNestStepUsersIsValid(next_step_users, next_user_ids, next_steps)) {
                            throw new Meteor.Error('error!', "指定的下一步处理人有误");
                        } else {
                            // 插入下一步trace记录
                            newTrace = {};
                            newTrace._id = new Mongo.ObjectID()._str;
                            newTrace.instance = instance_id;
                            newTrace.previous_trace_ids = [trace_id];
                            newTrace.is_finished = false;
                            newTrace.step = next_step_id;
                            newTrace.name = next_step_name;
                            newTrace.start_date = new Date;
                            newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours, space_id);
                            newTrace.approves = [];
                            _.each(next_step_users, function (next_step_user_id, idx) {
                                var agent, handler_id, handler_info, newApprove, next_step_space_user, next_step_user_org_info, user_info;
                                // 插入下一步trace.approve记录
                                newApprove = {};
                                newApprove._id = new Mongo.ObjectID()._str;
                                newApprove.instance = instance_id;
                                newApprove.trace = newTrace._id;
                                newApprove.is_finished = false;
                                newApprove.user = next_step_user_id;
                                user_info = db.users.findOne({
                                    _id: next_step_user_id
                                }, {
                                    fields: {
                                        name: 1
                                    }
                                });
                                newApprove.user_name = user_info.name;
                                handler_id = next_step_user_id;
                                handler_info = user_info;
                                agent = uuflowManager.getAgent(space_id, next_step_user_id);
                                if (agent) {
                                    next_step_users[idx] = agent;
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
                                next_step_space_user = db.space_users.findOne({
                                    space: space_id,
                                    user: handler_id
                                });
                                // 获取next_step_user所在的部门信息
                                next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user);
                                newApprove.handler_organization = next_step_user_org_info["organization"];
                                newApprove.handler_organization_name = next_step_user_org_info["organization_name"];
                                newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"];
                                newApprove.start_date = new Date;
                                newApprove.due_date = newTrace.due_date;
                                newApprove.is_read = false;
                                newApprove.is_error = false;
                                newApprove.values = {};
                                uuflowManager.setRemindInfo(instance.values, newApprove);
                                return newTrace.approves.push(newApprove);
                            });
                            // 更新instance记录
                            setObj.modified = new Date;
                            setObj.modified_by = current_user;
                            instance_trace = _.find(instance_traces, function (trace) {
                                return trace._id === trace_id;
                            });
                            trace_approve = _.find(instance_trace.approves, function (approve) {
                                return approve._id === approve_id;
                            });
                            setObj.inbox_users = next_step_users;
                            updateObj.$addToSet = {
                                outbox_users: {
                                    $each: [trace_approve.handler, trace_approve.user]
                                }
                            };
                            updateObj.$push = {
                                traces: newTrace
                            };
                            setObj.state = "pending";
                            updated_values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id), approve_id);
                            setObj.values = updated_values;
                            setObj.name = uuflowManager.getInstanceName(instance);
                            setObj.current_step_name = next_step_name;
                            setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines);
                        }
                    }
                }
            }
        } else {
            // 当前trace未结束
            instance_trace = _.find(instance_traces, function (trace) {
                return trace._id === trace_id;
            });
            trace_approve = _.find(instance_trace.approves, function (approve) {
                return approve._id === approve_id;
            });
            updateObj.$addToSet = {
                outbox_users: {
                    $each: [trace_approve.handler, trace_approve.user]
                }
            };
            instance.inbox_users.splice(instance.inbox_users.indexOf(trace_approve.handler), 1);
            setObj.inbox_users = instance.inbox_users;
            setObj.modified = new Date;
            setObj.modified_by = current_user;
            setObj.state = "pending";
            updated_values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id), approve_id);
            setObj.values = updated_values;
            setObj.name = uuflowManager.getInstanceName(instance);
        }
    }
    db.instances.update(instance_id, {
        $set: setTraceObj
    });
    // 更新instance_tasks
    update_many_instance_tasks(instance_id, trace_id, finishedApproveIds)
    updateObj.$set = setObj;
    return updateObj;
};

// 生成HTML格式只读表单和签核历程, 由于此方法生成的html数据会作为邮件内容发送，为了再邮件中样式显示正常，
// 请不要写单独的css，所有样式请写在html标签的style属性中。
uuflowManager.ins_html = function (current_user_info, ins) {
    var instanceHtml, options;
    options = {
        templateName: 'table',
        showTrace: true,
        showAttachments: false,
        tagger: 'email'
    };
    options.width = "765px"; //此处宽度不能设置为偶数，否则会引起子表与主表线条对不齐的bug
    options.styles = `body { background: #ffffff !important; }.steedos .pull-right { float: right !important; }.steedos .inline-left{ display: inline;float: left; }.steedos .inline-right{ display: inline;float: right; }.steedos .no-border{ border: 0px; }.steedos .no-border td{ border: 0px; }.steedos tr:nth-child(2) td{ border-top: 0px !important; }.steedos .ins_applicant{ display: inline; background: transparent !important; border: none; }.steedos .instance-name{ width: ${options.width} !important; }.steedos table { border-spacing: 0; border-collapse: collapse; }.steedos .box { background: #ffffff; }.steedos .form-table { width: ${options.width}; border: solid 2px #000000; border-collapse: collapse; table-layout: fixed; }.steedosTable-item-field{ padding: 5px; }.steedos td{ border: solid 1px #000000; border-collapse: collapse; }.steedos th { border: 0px; border-collapse: collapse; padding: 0px; }.steedos .td-title{ padding: 4px 12px; }.steedos .td-field { padding: 4px 12px; }.instance-view .instance-name { text-align: center; font-weight: bolder; }.td-childfield { border-top: solid 1px #000000; border-right: solid 1px #000000; border-bottom: solid 1px #000000; padding: 0px; }.panel-heading{ padding: 4px 12px; font-weight: bold; color: #333; background-color: #f5f5f5; }.table-bordered tr:last-child th { border-bottom: none; }.table-bordered tr:last-child td { border-bottom: none; }.steedos-table th:first-child{ border-left: 0px !important; }.steedos-table td:first-child { border-left: 0px !important; }.steedos-table table thead .title { min-width: 50px; }.steedos-table th:last-child{ border-right: 0px !important; }.steedos-table td:last-child { border-right: 0px !important; }.steedos-table table .number { text-align: right; }.callout-default{ border-color: #D2D6DE; color: #333; background-color: #F1F1F1; font-weight: bold; }.instance-table .callout { margin: 0px; padding: 4px 12px; border-radius: 0px; border-left: none; }.approved{ color: green; }.rejected{ color: red; }.terminated{ color: black; }.reassigned{ color: black; }.retrieved{ color: black; }.trace-approve-talbe td { text-align: left; border: none; }.traces td table { width: 100%; }.approve-item .name{ width: 40%; }.approve-item .finish-date{ width: 35%; }.td-stepname{ padding: 4px 12px; }.td-approve td{ padding: 4px 12px; }.applicant-wrapper { font-weight: bolder; }`;
    instanceHtml = InstanceReadOnlyTemplate.getInstanceHtml(current_user_info, ins.space, ins, options);
    //	处理outlook 中，对部分css不支持的处理
    instanceHtml = instanceHtml.replace('style="width: 100%;display: inline-table;"', 'style="border:0px;text-align: center;width:765px;"');
    instanceHtml = instanceHtml.replace('class="instance-table-name-td"', 'class="instance-table-name-td" style="width:' + options.width + ';border:0px"');
    //	instanceHtml = instanceHtml.replace('class="instance-table-wrapper-td"', 'class="instance-table-wrapper-td" style="width:' + options.width + ';border:0px"')
    instanceHtml = instanceHtml.replace('class="instance-name"', 'class="instance-name" style="width:' + options.width + '"');
    instanceHtml = instanceHtml.replace('class="table-page-body form-table"', 'class="table-page-body form-table" style="width:' + options.width + '"');
    instanceHtml = instanceHtml.replace('class="table table-condensed traces"', 'class="table table-condensed traces" style="width:' + options.width + ';border:solid 2.0px #000000"');
    instanceHtml = instanceHtml.replace('class="table-page-footer form-table no-border"', 'class="table-page-footer form-table no-border" style="border:0px;width:765px;"');
    instanceHtml = instanceHtml.replace(/class="td-title "/g, 'class="td-title" style="width:14%"');
    instanceHtml = instanceHtml.replace(/class="td-stepname"/g, 'class="td-stepname" style="width:' + 765 * 20 / 100 + 'px"');
    instanceHtml = instanceHtml.replace(/class="td-childfield"/g, 'class="td-childfield" style="padding:0px"');
    instanceHtml = instanceHtml.replace(/class="status approved"/g, 'class="status approved" style="color: green;"');
    instanceHtml = instanceHtml.replace(/class="status rejected"/g, 'class="status rejected" style="color: red;"');
    instanceHtml = instanceHtml.replace(/<table>/g, '<table style="width:100%;border:none">');
    instanceHtml = instanceHtml.replace(/<td class="name">/g, '<td class="name" style="width: 40%;">');
    instanceHtml = instanceHtml.replace(/<td class="finish-date">/g, '<td class="finish-date" style="width: 35%;">');
    instanceHtml = instanceHtml.replace(/inline-left'/g, "inline-left' style='display: inline;float: left;'");
    instanceHtml = instanceHtml.replace(/inline-right'/g, "inline-right' style='display: inline;float: right;'");
    instanceHtml = instanceHtml.replace(/pull-right'/g, "pull-right' style='float: right;'");
    return instanceHtml;
};

uuflowManager.getFlowCompanyId = function (flowId) {
    var ref;
    return (ref = db.flows.findOne(flowId, {
        fields: {
            company_id: 1
        }
    })) != null ? ref.company_id : void 0;
};

uuflowManager.create_instance = function (instance_from_client, user_info) {
    var appr_obj, approve_from_client, category, companyId, flow, flow_id, form, ins_obj, new_ins_id, now, permissions, space, space_id, space_user, space_user_org_info, start_step, trace_from_client, trace_obj, user_id;
    space_id = instance_from_client["space"];
    flow_id = instance_from_client["flow"];
    user_id = user_info._id;
    // 获取前台所传的trace
    trace_from_client = null;
    // 获取前台所传的approve
    approve_from_client = null;
    if (instance_from_client["traces"] && instance_from_client["traces"][0]) {
        trace_from_client = instance_from_client["traces"][0];
        if (trace_from_client["approves"] && trace_from_client["approves"][0]) {
            approve_from_client = instance_from_client["traces"][0]["approves"][0];
        }
    }
    // 获取一个space
    space = uuflowManager.getSpace(space_id);
    // 获取一个flow
    flow = uuflowManager.getFlow(flow_id, { fields: { historys: 0 } });
    // 获取一个space下的一个user
    space_user = uuflowManager.getSpaceUser(space_id, user_id);
    // 获取space_user所在的部门信息
    space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user);
    // 判断一个flow是否为启用状态
    uuflowManager.isFlowEnabled(flow);
    // 判断一个flow和space_id是否匹配
    uuflowManager.isFlowSpaceMatched(flow, space_id);
    form = uuflowManager.getForm(flow.form, { fields: { historys: 0 } });
    permissions = permissionManager.getFlowPermissions(flow_id, user_id, flow);
    if (!permissions.includes("add")) {
        throw new Meteor.Error('error!', "当前用户没有此流程的新建权限");
    }
    now = new Date;
    ins_obj = {};
    ins_obj._id = db.instances._makeNewID();
    ins_obj.space = space_id;
    ins_obj.flow = flow_id;
    ins_obj.flow_version = flow.current._id;
    ins_obj.form = flow.form;
    ins_obj.form_version = flow.current.form_version;
    ins_obj.name = flow.name;
    ins_obj.submitter = user_id;
    ins_obj.submitter_name = user_info.name;
    ins_obj.applicant = instance_from_client["applicant"] ? instance_from_client["applicant"] : user_id;
    ins_obj.applicant_name = instance_from_client["applicant_name"] ? instance_from_client["applicant_name"] : user_info.name;
    ins_obj.applicant_organization = instance_from_client["applicant_organization"] ? instance_from_client["applicant_organization"] : space_user.organization;
    ins_obj.applicant_organization_name = instance_from_client["applicant_organization_name"] ? instance_from_client["applicant_organization_name"] : space_user_org_info.organization_name;
    ins_obj.applicant_organization_fullname = instance_from_client["applicant_organization_fullname"] ? instance_from_client["applicant_organization_fullname"] : space_user_org_info.organization_fullname;
    ins_obj.applicant_company = instance_from_client["applicant_company"] ? instance_from_client["applicant_company"] : space_user.company_id;
    ins_obj.state = 'draft';
    ins_obj.code = '';
    ins_obj.is_archived = false;
    ins_obj.is_deleted = false;
    ins_obj.created = now;
    ins_obj.created_by = user_id;
    ins_obj.modified = now;
    ins_obj.modified_by = user_id;
    ins_obj.values = {};
    companyId = flow.company_id;
    if (companyId) {
        ins_obj.company_id = companyId;
    }
    // 新建Trace
    trace_obj = {};
    trace_obj._id = new Mongo.ObjectID()._str;
    trace_obj.instance = ins_obj._id;
    trace_obj.is_finished = false;
    // 当前最新版flow中开始节点
    start_step = _.find(flow.current.steps, function (step) {
        return step.step_type === 'start';
    });
    trace_obj.step = start_step._id;
    trace_obj.name = start_step.name;
    trace_obj.start_date = now;
    // 新建Approve
    appr_obj = {};
    appr_obj._id = new Mongo.ObjectID()._str;
    appr_obj.instance = ins_obj._id;
    appr_obj.trace = trace_obj._id;
    appr_obj.is_finished = false;
    appr_obj.user = instance_from_client["applicant"] ? instance_from_client["applicant"] : user_id;
    appr_obj.user_name = instance_from_client["applicant_name"] ? instance_from_client["applicant_name"] : user_info.name;
    appr_obj.handler = user_id;
    appr_obj.handler_name = user_info.name;
    appr_obj.handler_organization = space_user.organization;
    appr_obj.handler_organization_name = space_user_org_info.organization_name;
    appr_obj.handler_organization_fullname = space_user_org_info.organization_fullname;
    appr_obj.type = 'draft';
    appr_obj.start_date = now;
    appr_obj.read_date = now;
    appr_obj.is_read = true;
    appr_obj.is_error = false;
    appr_obj.description = '';
    appr_obj.values = approve_from_client && approve_from_client["values"] ? approve_from_client["values"] : {};
    trace_obj.approves = [appr_obj];
    ins_obj.traces = [trace_obj];
    ins_obj.inbox_users = instance_from_client.inbox_users || [];
    ins_obj.current_step_name = start_step.name;
    if (flow.auto_remind === true) {
        ins_obj.auto_remind = true;
    }
    // 新建申请单时，instances记录流程名称、流程分类名称 #1313
    ins_obj.flow_name = flow.name;
    if (form.category) {
        category = uuflowManager.getCategory(form.category, { fields: { _id: 1, name: 1 } });
        if (category) {
            ins_obj.category_name = category.name;
            ins_obj.category = category._id;
        }
    }
    new_ins_id = db.instances.insert(ins_obj);

    return new_ins_id;
};

uuflowManager.getCurrentStepAutoSubmit = function (timeout_auto_submit, lines) {
    var timeout_line;
    if (timeout_auto_submit && lines) {
        timeout_line = _.find(lines, function (l) {
            return l.timeout_line === true;
        });
        if (timeout_line) {
            return true;
        }
    }
    return false;
};

uuflowManager.getDueDate = function (hours, spaceId) {
    if (hours) {
        return Meteor.wrapAsync(function (start, hours, spaceId, cb) {
            return steedosCore.getTimeoutDateWithoutHolidays(start, hours, spaceId).then(function (resolve, reject) {
                return cb(reject, resolve);
            });
        })(new Date(), hours, spaceId);
    }
    return void 0;
};

uuflowManager.submit_instance = function (instance_from_client, user_info) {
    if (process.env.STEEDOS_DEBUG) {
        console.log('[submit_instance] start');
        console.time('submit_instance');
    }
    var applicant, applicant_id, applicant_org_info, approve, approve_id, attachments, checkApplicant, checkUsers, current_user, description, flow, flow_has_upgrade, flow_id, form, instance, instance_id, instance_name, instance_traces, lang, newTrace, nextSteps, nextTrace, next_step, next_step_users, next_steps, permissions, setObj, space, space_id, space_user, space_user_org_info, start_step, step, submitter_id, trace, trace_id, traces, upObj, updated_values, user, values;
    const now = new Date()
    current_user = user_info._id;
    lang = "en";
    if (user_info.locale === 'zh-cn') {
        lang = 'zh-CN';
    }
    instance_id = instance_from_client["_id"];
    trace_id = instance_from_client["traces"][0]["_id"];
    approve_id = instance_from_client["traces"][0]["approves"][0]["_id"];
    values = instance_from_client["traces"][0]["approves"][0]["values"];
    if (!values) {
        values = {};
    }
    //　验证表单上的applicant已填写
    if (!instance_from_client["applicant"]) {
        throw new Meteor.Error('error!', "请选择提交人");
    }
    applicant_id = instance_from_client["applicant"];
    submitter_id = instance_from_client["submitter"];
    next_steps = instance_from_client["traces"][0]["approves"][0]["next_steps"];
    attachments = instance_from_client["traces"][0]["approves"][0]["attachments"];
    description = instance_from_client["traces"][0]["approves"][0]["description"];
    // 获取一个instance
    instance = uuflowManager.getInstance(instance_id);
    space_id = instance.space;
    flow_id = instance.flow;
    // 获取一个space
    space = uuflowManager.getSpace(space_id);
    // 校验申请人user_accepted = true
    checkApplicant = uuflowManager.getSpaceUser(space_id, applicant_id);
    // 获取一个flow
    flow = uuflowManager.getFlow(flow_id, { historys: 0 });
    // 确定instance的name
    instance_name = instance_from_client["name"];
    // 判断一个instance是否为拟稿状态
    uuflowManager.isInstanceDraft(instance, lang);
    // 获取一个space下的一个user
    space_user = uuflowManager.getSpaceUser(space_id, current_user);
    // 获取space_user所在的部门信息
    space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user);
    // 判断一个用户是否是一个instance的提交者
    uuflowManager.isInstanceSubmitter(instance, current_user);
    // 判断一个flow是否为启用状态
    uuflowManager.isFlowEnabled(flow);
    // 验证该user_id或其所在的组有提交此申请单的权限
    permissions = permissionManager.getFlowPermissions(flow_id, current_user);
    if (!permissions.includes("add")) {
        throw new Meteor.Error('error!', "该提交人没有提交此申请单的权限。");
    }
    trace = instance_from_client["traces"][0];
    // 获取一个step
    step = uuflowManager.getStep(instance, flow, trace["step"]);
    approve = trace["approves"][0];
    // 先执行暂存的操作
    // ================begin================
    form = uuflowManager.getForm(instance.form, { fields: { historys: 0 } });
    // 获取Flow当前版本开始节点
    start_step = _.find(flow.current.steps, function (step) {
        return step.step_type === 'start';
    });
    instance_traces = instance.traces;
    instance_traces[0]["approves"][0].description = description;
    setObj = {};
    flow_has_upgrade = false;
    // 判断:applicant和原instance的applicant是否相等
    if (applicant_id !== instance.applicant) {
        // applicant和原instance的applicant不相等
        user = uuflowManager.getUser(applicant_id);
        applicant = uuflowManager.getSpaceUser(space_id, applicant_id);
        // 获取applicant所在的部门信息
        applicant_org_info = uuflowManager.getSpaceUserOrgInfo(applicant);
        // 修改instance的applicant,applicant_name，同时修改开始结点的approve的user为:applicant,user_name
        setObj.applicant = applicant_id;
        setObj.applicant_name = user.name;
        setObj.applicant_organization = applicant_org_info["organization"];
        setObj.applicant_organization_name = applicant_org_info["organization_name"];
        setObj.applicant_organization_fullname = applicant_org_info["organization_fullname"];
        setObj.applicant_company = applicant["company_id"];
        instance_traces[0]["approves"][0].user = applicant_id;
        instance_traces[0]["approves"][0].user_name = user.name;
    }
    // 判断流程是否已升级，instance["flow_version"] == flow["current"]["_id"]表示流程未升级
    if (instance.flow_version === flow.current._id) {
        // 判断next_steps是否为空,不为空则写入到当前approve的next_steps中
        if (next_steps) {
            instance_traces[0]["approves"][0].next_steps = next_steps;
        }
    } else {
        // 流程已升级
        flow_has_upgrade = true;
        // 更新instance记录
        setObj.flow_version = flow.current._id;
        setObj.form_version = flow.current.form_version;
        // 清空原来的值， 存入当前最新版flow中开始节点的step_id
        instance_traces[0].step = start_step._id;
        instance_traces[0].name = start_step.name;
    }
    // 调整approves 的values 删除values中在当前步骤中没有编辑权限的字段值
    instance_traces[0]["approves"][0].values = uuflowManager.getApproveValues(values, step.permissions, instance.form, instance.form_version); // 非odata字段从台帐将值传到审批单（开始节点此字段无编辑权限），审批单提交后，值丢失 #891
    setObj.traces = instance_traces;
    setObj.modified = now;
    setObj.modified_by = current_user;
    db.instances.direct.update({
        _id: instance_id
    }, {
        $set: setObj
    });
    if (flow_has_upgrade) {
        return {
            alerts: TAPi18n.__('flow.point_upgraded', {}, lang)
        };
    }
    // ================end================
    instance = uuflowManager.getInstance(instance_id); //使用最新的instance
    // 判断一个instance是否为拟稿状态
    uuflowManager.isInstanceDraft(instance, lang);
    traces = instance.traces;
    upObj = {};
    if ((!approve["next_steps"]) || (approve["next_steps"].length === 0)) {
        throw new Meteor.Error('error!', "还未指定下一步和处理人，提交失败");
    } else {
        // 验证next_steps里面是否只有一个step
        if (approve["next_steps"].length > 1) {
            throw new Meteor.Error('error!', "不能指定多个后续步骤");
        } else {
            nextSteps = uuflowManager.getNextSteps(instance, flow, step, "");
            _.each(approve["next_steps"], function (approve_next_step) {
                if (!nextSteps.includes(approve_next_step["step"])) {
                    throw new Meteor.Error('error!', "下一步步骤不合法");
                }
            });
        }
    }
    // 校验下一步处理人user_accepted = true
    _.each(approve["next_steps"][0]["users"], function (next_step_user) {
        return uuflowManager.getSpaceUser(space_id, next_step_user);
    });
    next_step = uuflowManager.getStep(instance, flow, approve["next_steps"][0]["step"]);
    // 判断next_step是否为结束结点
    if (next_step.step_type === "end") {
        // 更新approve
        traces[0]["approves"][0].judge = "submitted";
        traces[0]["approves"][0].is_finished = true;
        traces[0]["approves"][0].finish_date = now;
        traces[0]["approves"][0].cost_time = now - traces[0]["approves"][0].start_date;
        // 更新trace
        traces[0].is_finished = true;
        traces[0].judge = "submitted";
        traces[0].finish_date = now;
        // 插入下一步trace记录
        newTrace = {};
        newTrace._id = new Mongo.ObjectID()._str;
        newTrace.instance = instance_id;
        newTrace.previous_trace_ids = [trace["_id"]];
        newTrace.is_finished = true;
        newTrace.step = next_step._id;
        newTrace.name = next_step.name;
        newTrace.start_date = now;
        newTrace.finish_date = now;
        // 更新instance记录
        // 申请单名称按照固定规则生成申请单名称：流程名称＋' '+申请单编号
        upObj.submit_date = now;
        upObj.state = "completed";
        upObj.values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id));
        upObj.code = flow.current_no + 1 + "";
        instance.code = upObj.code;
        instance.values = upObj.values;
        upObj.name = uuflowManager.getInstanceName(instance);
        upObj.modified = now;
        upObj.modified_by = current_user;
        upObj.inbox_users = [];
        upObj.outbox_users = _.uniq([current_user, traces[0]["approves"][0]["user"]]);
        // 调整approves 的values 删除values中在当前步骤中没有编辑权限的字段值
        // traces[0]["approves"][0].values = uuflowManager.getApproveValues(traces[0]["approves"][0].values, step.permissions, instance.form, instance.form_version)
        traces.push(newTrace);
        upObj.traces = traces;
        upObj.finish_date = now;
        upObj.current_step_name = next_step.name;
        upObj.final_decision = "approved";
        upObj.current_step_auto_submit = false; // next_step不为结束节点
    } else {
        // 取得下一步处理人
        next_step_users = approve["next_steps"][0]["users"];
        // 判断nextsteps.step.users是否为空
        if ((!next_step_users) || (next_step_users.length === 0)) {
            throw new Meteor.Error('error!', "未指定下一步处理人");
        } else {
            if (next_step_users.length > 1 && next_step.step_type !== "counterSign") {
                throw new Meteor.Error('error!', "不能指定多个处理人");
            } else {
                // 验证下一步处理人next_user是否合法
                checkUsers = getHandlersManager.getHandlers(instance_id, approve["next_steps"][0]["step"], current_user);
                if (!uuflowManager.checkNestStepUsersIsValid(next_step_users, checkUsers, next_step)) {
                    throw new Meteor.Error('error!', "指定的下一步处理人有误");
                } else {
                    // 若合法，执行流转操作
                    // 更新approve
                    traces[0]["approves"][0].judge = "submitted";
                    traces[0]["approves"][0].is_finished = true;
                    traces[0]["approves"][0].finish_date = now;
                    traces[0]["approves"][0].cost_time = traces[0]["approves"][0].finish_date - traces[0]["approves"][0].start_date;
                    // 更新trace
                    traces[0].is_finished = true;
                    traces[0].finish_date = now;
                    traces[0].judge = "submitted";
                    // 插入下一步trace记录
                    nextTrace = {};
                    nextTrace._id = new Mongo.ObjectID()._str;
                    nextTrace.instance = instance_id;
                    nextTrace.previous_trace_ids = [trace["_id"]];
                    nextTrace.is_finished = false;
                    nextTrace.step = next_step._id;
                    nextTrace.name = next_step.name;
                    nextTrace.start_date = now;
                    nextTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours, space_id);
                    nextTrace.approves = [];
                    updated_values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id));
                    // 插入下一步trace.approve记录
                    _.each(next_step_users, function (next_step_user_id, idx) {
                        var agent, handler_id, handler_info, nextApprove, next_step_space_user, next_step_user_org_info;
                        nextApprove = {};
                        nextApprove._id = new Mongo.ObjectID()._str;
                        user_info = uuflowManager.getUser(next_step_user_id);
                        handler_id = next_step_user_id;
                        handler_info = user_info;
                        agent = uuflowManager.getAgent(space_id, next_step_user_id);
                        if (agent) {
                            next_step_users[idx] = agent;
                            handler_id = agent;
                            handler_info = uuflowManager.getUser(agent);
                            nextApprove.agent = agent;
                        }
                        nextApprove.instance = instance_id;
                        nextApprove.trace = nextTrace._id;
                        nextApprove.is_finished = false;
                        nextApprove.user = next_step_user_id;
                        nextApprove.user_name = user_info.name;
                        nextApprove.handler = handler_id;
                        nextApprove.handler_name = handler_info.name;
                        next_step_space_user = uuflowManager.getSpaceUser(space_id, handler_id);
                        // 获取next_step_user所在的部门信息
                        next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user);
                        nextApprove.handler_organization = next_step_user_org_info["organization"];
                        nextApprove.handler_organization_name = next_step_user_org_info["organization_name"];
                        nextApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"];
                        nextApprove.start_date = now;
                        nextApprove.due_date = nextTrace.due_date;
                        nextApprove.is_read = false;
                        nextApprove.is_error = false;
                        nextApprove.values = {};
                        uuflowManager.setRemindInfo(updated_values, nextApprove);
                        return nextTrace.approves.push(nextApprove);
                    });
                    // 更新instance记录
                    upObj.name = instance_name;
                    upObj.submit_date = now;
                    upObj.state = "pending";
                    // 重新查找暂存之后的instance
                    upObj.values = updated_values;
                    upObj.inbox_users = next_step_users;
                    upObj.modified = now;
                    upObj.modified_by = current_user;
                    // 申请单名称按照固定规则生成申请单名称：流程名称＋' '+申请单编号
                    upObj.code = flow.current_no + 1 + "";
                    instance.code = upObj.code;
                    instance.values = upObj.values;
                    upObj.name = uuflowManager.getInstanceName(instance);
                    // 调整approves 的values 删除values中在当前步骤中没有编辑权限的字段值
                    // traces[0]["approves"][0].values = uuflowManager.getApproveValues(traces[0]["approves"][0].values, step["permissions"], instance.form, instance.form_version)
                    traces.push(nextTrace);
                    upObj.traces = traces;
                    upObj.outbox_users = [];
                    upObj.current_step_name = next_step.name;
                    upObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines);
                }
            }
        }
    }
    upObj.keywords = uuflowManager.caculateKeywords(upObj.values, form, instance.form_version);
    // 计算extras
    upObj.extras = uuflowManager.caculateExtras(upObj.values, form, instance.form_version);
    db.instances.update({
        _id: instance_id
    }, {
        $set: upObj
    });
    db.flows.direct.update({
        _id: flow._id
    }, {
        $set: {
            current_no: flow.current_no + 1
        }
    });

    // 转发或分发，更新当前记录
    if (instance.forward_from_instance || instance.distribute_from_instance) {
        update_instance_tasks(instance_id, traces[0]._id, traces[0]["approves"][0]._id)
    }
    if (nextTrace) {
        // 生成新记录
        const approveIds = []
        for (const a of nextTrace.approves) {
            approveIds.push(a._id)
        }
        insert_many_instance_tasks(instance_id, nextTrace._id, approveIds)
    }

    if (next_step.step_type !== "end") {
        instance = uuflowManager.getInstance(instance_id);
        //发送短消息给申请人
        pushManager.send_instance_notification("first_submit_applicant", instance, "", user_info, null, flow);
        // 发送消息给下一步处理人
        pushManager.send_instance_notification("first_submit_inbox", instance, "", user_info, null, flow);
    }

    if (process.env.STEEDOS_DEBUG) {
        console.log('[submit_instance] end');
        console.timeEnd('submit_instance');
    }
    return {};
};

uuflowManager.get_SpaceChangeSet = function (formids, is_admin, sync_token) {
    var changeSet, formids_ary;
    sync_token = new Date(Number(sync_token) * 1000);
    changeSet = {};
    changeSet.sync_token = new Date().getTime() / 1000;
    changeSet.inserts = {
        Spaces: [],
        Users: [],
        SpaceUsers: [],
        Organizations: [],
        Roles: [],
        Positions: [],
        Forms: [],
        Flows: [],
        Instances: []
    };
    changeSet.updates = {
        Spaces: [],
        Users: [],
        SpaceUsers: [],
        Organizations: [],
        Roles: [],
        Positions: [],
        Forms: [],
        Flows: [],
        Instances: []
    };
    changeSet.deletes = {
        Spaces: [],
        Users: [],
        SpaceUsers: [],
        Organizations: [],
        Roles: [],
        Positions: [],
        Forms: [],
        Flows: [],
        Instances: []
    };
    if (formids && formids.trim()) {
        formids_ary = formids.split(",");
        changeSet.inserts.Instances = db.instances.find({
            form: {
                $in: formids_ary
            },
            created: {
                $gt: sync_token
            }
        }).fetch();
        changeSet.updates.Instances = db.instances.find({
            form: {
                $in: formids_ary
            },
            created: {
                $lte: sync_token
            },
            modified: {
                $gt: sync_token
            }
        }).fetch();
        changeSet.deletes.Instances = db.deleted_instances.find({
            form: {
                $in: formids_ary
            },
            deleted: {
                $gt: sync_token
            }
        }, {
            fields: {
                _id: 1
            }
        }).fetch();
    } else if (is_admin && is_admin.trim()) {
        changeSet.inserts.Instances = db.instances.find({
            created: {
                $gt: sync_token
            }
        }).fetch();
        changeSet.updates.Instances = db.instances.find({
            created: {
                $lte: sync_token
            },
            modified: {
                $gt: sync_token
            }
        }).fetch();
        changeSet.deletes.Instances = db.deleted_instances.find({
            deleted: {
                $gt: sync_token
            }
        }, {
            fields: {
                _id: 1
            }
        }).fetch();
    }
    // 查询提交人和申请人steedos_id
    _.each(changeSet.inserts.Instances, function (ins) {
        var applicant, submitter;
        submitter = db.users.findOne({
            _id: ins.submitter
        }, {
            fields: {
                steedos_id: 1
            }
        });
        applicant = db.users.findOne({
            _id: ins.applicant
        }, {
            fields: {
                steedos_id: 1
            }
        });
        if (submitter) {
            ins.submitter_steedos_id = submitter.steedos_id;
        }
        if (applicant) {
            return ins.applicant_steedos_id = applicant.steedos_id;
        }
    });
    _.each(changeSet.updates.Instances, function (ins) {
        var applicant, submitter;
        submitter = db.users.findOne({
            _id: ins.submitter
        }, {
            fields: {
                steedos_id: 1
            }
        });
        applicant = db.users.findOne({
            _id: ins.applicant
        }, {
            fields: {
                steedos_id: 1
            }
        });
        if (submitter) {
            ins.submitter_steedos_id = submitter.steedos_id;
        }
        if (applicant) {
            return ins.applicant_steedos_id = applicant.steedos_id;
        }
    });
    return {
        ChangeSet: changeSet
    };
};

/* 文件催办
根据instance.values.priority和instance.values.deadline给approve增加remind相关信息
{
    deadline: Date,
    remind_date: Date,
    reminded_count: Number
}
*/
uuflowManager.setRemindInfo = function (values, approve) {
    var caculate_date, deadline, flow, ins, priority, remind_date, start_date;
    check(values, Object);
    check(approve, Object);
    check(approve.start_date, Date);
    remind_date = null;
    deadline = null;
    start_date = approve.start_date;
    if (values.priority && values.deadline) {
        check(values.priority, Match.OneOf("普通", "办文", "紧急", "特急"));
        // 由于values中的date字段的值为String，故作如下校验
        deadline = new Date(values.deadline);
        if (deadline.toString() === "Invalid Date") {
            return;
        }
        priority = values.priority;
        if (priority === "普通") {
            remind_date = Steedos.caculateWorkingTime(start_date, 3);
        } else if (priority === "办文") {
            if (Steedos.caculatePlusHalfWorkingDay(start_date) > deadline) { // 超过了办结时限或者距离办结时限半日内
                remind_date = Steedos.caculatePlusHalfWorkingDay(start_date, true);
            } else if (Steedos.caculateWorkingTime(start_date, 1) > deadline) {
                caculate_date = function (base_date) {
                    var plus_halfday_date;
                    plus_halfday_date = Steedos.caculatePlusHalfWorkingDay(base_date);
                    if (plus_halfday_date > deadline) {
                        remind_date = base_date;
                    } else {
                        caculate_date(Steedos.caculatePlusHalfWorkingDay(base_date, true));
                    }
                };
                caculate_date(start_date);
            } else {
                remind_date = Steedos.caculateWorkingTime(start_date, 1);
            }
        } else if (priority === "紧急" || priority === "特急") {
            if (Steedos.caculatePlusHalfWorkingDay(start_date) > deadline) { // 超过了办结时限或者距离办结时限半日内
                remind_date = Steedos.caculatePlusHalfWorkingDay(start_date, true);
            } else if (Steedos.caculateWorkingTime(start_date, 1) > deadline) {
                caculate_date = function (base_date) {
                    var plus_halfday_date;
                    plus_halfday_date = Steedos.caculatePlusHalfWorkingDay(base_date);
                    if (plus_halfday_date > deadline) {
                        remind_date = base_date;
                    } else {
                        caculate_date(Steedos.caculatePlusHalfWorkingDay(base_date, true));
                    }
                };
                caculate_date(start_date);
            } else {
                remind_date = Steedos.caculatePlusHalfWorkingDay(start_date);
            }
            ins = db.instances.findOne(approve.instance);
            if (ins.state === 'draft') {
                flow = db.flows.findOne({
                    _id: ins.flow
                }, {
                    fields: {
                        current_no: 1
                    }
                });
                ins.code = flow.current_no + 1 + '';
            }
            ins.values = values;
            uuflowManager.sendRemindSMS(uuflowManager.getInstanceName(ins), deadline, [approve.user], ins.space, ins._id);
        }
    } else {
        // 如果没有配置 紧急程度 和办结时限 则按照 '普通' 规则催办
        remind_date = Steedos.caculateWorkingTime(start_date, 3);
    }
    approve.deadline = deadline;
    approve.remind_date = remind_date;
    approve.reminded_count = 0;
};

// 发送催办短信
uuflowManager.sendRemindSMS = function (ins_name, deadline, users_id, space_id, ins_id) {
    var name, ref, send_users, skip_users;
    check(ins_name, String);
    check(deadline, Date);
    check(users_id, Array);
    check(space_id, String);
    check(ins_id, String);
    skip_users = ((ref = Meteor.settings.remind) != null ? ref.skip_users : void 0) || [];
    send_users = [];
    _.each(users_id, function (uid) {
        if (!skip_users.includes(uid)) {
            return send_users.push(uid);
        }
    });
    name = ins_name.length > 15 ? ins_name.substr(0, 12) + '...' : ins_name;
    return db.users.find({
        _id: {
            $in: _.uniq(send_users)
        },
        mobile: {
            $exists: true
        },
        mobile_verified: true
    }, {
        fields: {
            mobile: 1,
            utcOffset: 1,
            locale: 1,
            name: 1
        }
    }).forEach(function (user) {
        var lang, notification, params, payload, utcOffset;
        utcOffset = user.hasOwnProperty('utcOffset') ? user.utcOffset : 8;
        params = {
            instance_name: name,
            deadline: moment(deadline).utcOffset(utcOffset).format('MM-DD HH:mm')
        };
        //设置当前语言环境
        lang = 'en';
        if (user.locale === 'zh-cn') {
            lang = 'zh-CN';
        }
        // 发送手机短信
        SMSQueue.send({
            Format: 'JSON',
            Action: 'SingleSendSms',
            ParamString: JSON.stringify(params),
            RecNum: user.mobile,
            SignName: 'OA系统',
            TemplateCode: 'SMS_67200967',
            msg: TAPi18n.__('sms.remind.template', {
                instance_name: ins_name,
                deadline: params.deadline,
                open_app_url: Meteor.absoluteUrl() + `workflow.html?space_id=${space_id}&ins_id=${ins_id}`
            }, lang)
        });
        // 发推送消息
        notification = {};
        notification["createdAt"] = new Date;
        notification["createdBy"] = '<SERVER>';
        notification["from"] = 'workflow';
        notification['title'] = user.name;
        notification['text'] = TAPi18n.__('instance.push.body.remind', {
            instance_name: ins_name,
            deadline: params.deadline
        }, lang);
        payload = {};
        payload["space"] = space_id;
        payload["instance"] = ins_id;
        payload["host"] = Meteor.absoluteUrl().substr(0, Meteor.absoluteUrl().length - 1);
        payload["requireInteraction"] = true;
        notification["payload"] = payload;
        notification['query'] = {
            userId: user._id,
            appName: 'workflow'
        };
        return Push.send(notification);
    });
};

// 如果申请单的名字变了，正文的名字要跟申请单名字保持同步
uuflowManager.checkMainAttach = function (instance_id, name) {
    var file_name, ins, main, main_name_split, new_ins_name;
    main = cfs.instances.findOne({
        'metadata.instance': instance_id,
        'metadata.main': true,
        'metadata.current': true
    });
    if (main) {
        ins = db.instances.findOne({
            _id: instance_id
        }, {
            fields: {
                name: 1
            }
        });
        new_ins_name = name || ins.name;
        new_ins_name = new_ins_name.replace(/\r/g, "").replace(/\n/g, "");
        //文件名中不能包含特殊字符: '? * : " < > \ / |'， 直接替换为空
        new_ins_name = new_ins_name.replace(/\?|\*|\:|\"|\<|\>|\\|\/|\|/g, "");
        main_name_split = main.name().split('.');
        main_name_split.pop();
        if (new_ins_name !== main_name_split.join("")) {
            file_name = new_ins_name + "." + main.extension();
            return main.update({
                $set: {
                    'original.name': file_name,
                    'copies.instances.name': file_name
                }
            });
        }
    }
};

uuflowManager.caculateKeywords = function (values, form, form_version) {
    var form_v, keywords;
    if (_.isEmpty(values)) {
        return "";
    }
    keywords = [];
    form_v = null;
    if (form_version === form.current._id) {
        form_v = form.current;
    } else {
        form_v = _.find(form.historys, function (form_h) {
            return form_version === form_h._id;
        });
    }
    _.each(form_v.fields, function (field) {
        var multiValue;
        if (field.is_searchable) {
            if (field.type === 'input' || field.type === 'email' || field.type === 'url' || field.type === 'number' || field.type === 'select' || field.type === 'radio') {
                if (values[field.code]) {
                    return keywords.push(values[field.code]);
                }
                // multiSelect
            } else if (field.type === 'multiSelect') {
                if (values[field.code]) {
                    return keywords.push(values[field.code]);
                }
                // 选人选组控件 取name
            } else if (field.type === 'user' || field.type === 'group') {
                // 多选
                if (field.is_multiselect === true) {
                    multiValue = values[field.code];
                    if (_.isArray(multiValue)) {
                        return _.each(multiValue, function (singleV) {
                            if (singleV && singleV['name']) {
                                return keywords.push(singleV['name']);
                            }
                        });
                    }
                } else {
                    // 单选
                    if (values[field.code] && values[field.code]['name']) {
                        return keywords.push(values[field.code]['name']);
                    }
                }
            }
            // 子表
        } else if (field.type === 'table') {
            if (values[field.code]) {
                return _.each(values[field.code], function (s_value) {
                    return _.each(field.fields, function (s_field) {
                        if (s_field.is_searchable) {
                            if (s_field.type === 'input' || s_field.type === 'email' || s_field.type === 'url' || s_field.type === 'number' || s_field.type === 'select' || s_field.type === 'radio') {
                                if (s_value[s_field.code]) {
                                    return keywords.push(s_value[s_field.code]);
                                }
                                // multiSelect
                            } else if (s_field.type === 'multiSelect') {
                                if (s_value[s_field.code]) {
                                    return keywords.push(s_value[s_field.code]);
                                }
                                // 选人选组控件 取name
                            } else if (s_field.type === 'user' || s_field.type === 'group') {
                                // 多选
                                if (s_field.is_multiselect === true) {
                                    multiValue = s_value[s_field.code];
                                    if (_.isArray(multiValue)) {
                                        return _.each(multiValue, function (singleV) {
                                            if (singleV && singleV['name']) {
                                                return keywords.push(singleV['name']);
                                            }
                                        });
                                    }
                                } else {
                                    // 单选
                                    if (s_value[s_field.code] && s_value[s_field.code]['name']) {
                                        return keywords.push(s_value[s_field.code]['name']);
                                    }
                                }
                            }
                        }
                    });
                });
            }
            // 分组
        } else if (field.type === 'section') {
            return _.each(field.fields, function (s_field) {
                if (s_field.is_searchable) {
                    if (s_field.type === 'input' || s_field.type === 'email' || s_field.type === 'url' || s_field.type === 'number' || s_field.type === 'select' || s_field.type === 'radio') {
                        if (values[s_field.code]) {
                            return keywords.push(values[s_field.code]);
                        }
                        // multiSelect
                    } else if (s_field.type === 'multiSelect') {
                        if (values[s_field.code]) {
                            return keywords.push(values[s_field.code]);
                        }
                        // 选人选组控件 取name
                    } else if (s_field.type === 'user' || s_field.type === 'group') {
                        // 多选
                        if (s_field.is_multiselect === true) {
                            multiValue = values[s_field.code];
                            if (_.isArray(multiValue)) {
                                return _.each(multiValue, function (singleV) {
                                    if (singleV && singleV['name']) {
                                        return keywords.push(singleV['name']);
                                    }
                                });
                            }
                        } else {
                            // 单选
                            if (values[s_field.code] && values[s_field.code]['name']) {
                                return keywords.push(values[s_field.code]['name']);
                            }
                        }
                    }
                }
            });
        }
    });
    return keywords.join(" ");
};

uuflowManager.checkValueFieldsRequire = function (values, form, form_version) {
    var form_v, require_but_empty_fields;
    values = values || {};
    require_but_empty_fields = [];
    form_v = null;
    if (form_version === form.current._id) {
        form_v = form.current;
    } else {
        form_v = _.find(form.historys, function (form_h) {
            return form_version === form_h._id;
        });
    }
    _.each(form_v.fields, function (field) {
        if (field.type !== 'table') {
            if (field.is_required && _.isEmpty(values[field.code])) {
                return require_but_empty_fields.push(field.name || field.code);
            }
            // 子表
        } else if (field.type === 'table') {
            if (_.isEmpty(values[field.code])) {
                return _.each(field.fields, function (s_field) {
                    if (s_field.is_required) {
                        return require_but_empty_fields.push(s_field.name || s_field.code);
                    }
                });
            } else {
                return _.each(values[field.code], function (s_value) {
                    return _.each(field.fields, function (s_field) {
                        if (s_field.is_required && _.isEmpty(s_value[s_field.code])) {
                            return require_but_empty_fields.push(s_field.name || s_field.code);
                        }
                    });
                });
            }
        }
    });
    return require_but_empty_fields;
};

uuflowManager.triggerRecordInstanceQueue = function (ins_id, record_ids, step_name, flow_id, ins_state) {
    var newObj, owDoc, syncType;
    owDoc = Creator.getCollection('object_workflows').findOne({
        flow_id: flow_id
    }, {
        fields: { sync_type: 1 }
    });
    if (owDoc) {
        syncType = owDoc.sync_type;
        if ((!syncType || syncType === 'every_step') || (syncType === 'final_step' && ins_state === 'completed')) {
            newObj = {
                info: {
                    instance_id: ins_id,
                    records: record_ids,
                    step_name: step_name,
                    instance_finish_date: new Date()
                },
                sent: false,
                sending: 0,
                createdAt: new Date(),
                createdBy: '<SERVER>'
            };
            db.instance_record_queue.insert(newObj);
        }
    }
};

uuflowManager.distributedInstancesRemind = function (instance) {
    var current_trace, e, flow, lang, next_approves, next_step, next_step_id, notification, original_flow, original_instacne, original_instacne_id, original_user, payload, ref, ref1, ref2;
    // 确定是分发过来的
    if ((instance != null ? (ref = instance.distribute_from_instances) != null ? ref.length : void 0 : void 0) > 0) {
        flow = db.flows.findOne({
            _id: instance != null ? instance.flow : void 0
        });
        current_trace = instance["traces"].pop();
        if ((instance != null ? instance.state : void 0) === "draft") {
            next_approves = current_trace != null ? current_trace.approves : void 0;
            if ((next_approves != null ? next_approves.length : void 0) === 1) {
                next_step = (ref1 = next_approves[0]) != null ? ref1.next_steps[0] : void 0;
                next_step_id = next_step != null ? next_step.step : void 0;
            }
        } else {
            next_step_id = current_trace != null ? current_trace.step : void 0;
        }
        if (next_step_id) {
            next_step = uuflowManager.getStep(instance, flow, next_step_id);
            if ((next_step != null ? next_step.step_type : void 0) === "end") {
                // 查原申请单
                original_instacne_id = instance != null ? (ref2 = instance.distribute_from_instances) != null ? ref2.pop() : void 0 : void 0;
                // original_instacne_id = "X6whjGMLNvxDnFwSe" # 定死
                original_instacne = db.instances.findOne({
                    _id: original_instacne_id
                }, {
                    fields: {
                        flow: 1,
                        name: 1,
                        space: 1,
                        created_by: 1
                    }
                });
                // 根据原申请单查流程
                original_flow = db.flows.findOne({
                    _id: original_instacne != null ? original_instacne.flow : void 0
                }, {
                    fields: {
                        distribute_end_notification: 1
                    }
                });
                if ((original_flow != null ? original_flow.distribute_end_notification : void 0) === true) {
                    try {
                        // 分发提醒，这个表单的created_by
                        original_user = db.users.findOne({
                            _id: instance != null ? instance.created_by : void 0
                        });
                        //设置当前语言环境
                        lang = 'en';
                        if ((original_user != null ? original_user.locale : void 0) === 'zh-cn') {
                            lang = 'zh-CN';
                        }
                        // 发推送消息
                        notification = {};
                        notification["createdAt"] = new Date;
                        notification["createdBy"] = '<SERVER>';
                        notification["from"] = 'workflow';
                        notification['title'] = original_user.name;
                        notification['text'] = TAPi18n.__('instance.push.body.distribute_remind', {
                            instance_name: instance != null ? instance.name : void 0
                        }, lang);
                        payload = {};
                        payload["space"] = original_instacne != null ? original_instacne.space : void 0;
                        payload["instance"] = original_instacne != null ? original_instacne._id : void 0;
                        payload["host"] = Meteor.absoluteUrl().substr(0, Meteor.absoluteUrl().length - 1);
                        payload["requireInteraction"] = true;
                        notification["payload"] = payload;
                        notification['query'] = {
                            userId: original_user._id,
                            appName: 'workflow'
                        };
                        Push.send(notification);
                    } catch (error) {
                        e = error;
                        console.error(e.stack);
                    }
                }
            }
        }
    }
};

uuflowManager.getAgent = function (spaceId, fromId) {
    var now, r;
    now = new Date();
    r = db.process_delegation_rules.findOne({
        space: spaceId,
        from: fromId,
        enabled: true,
        start_time: {
            $lte: now
        },
        end_time: {
            $gte: now
        }
    });
    return r != null ? r.to : void 0;
};

uuflowManager.cancelProcessDelegation = function (spaceId, toId) {
    var ccQuery, query;
    query = {
        space: spaceId,
        inbox_users: toId
    };
    query.traces = {
        $elemMatch: {
            is_finished: false,
            approves: {
                $elemMatch: {
                    is_finished: false,
                    agent: toId
                }
            }
        }
    };
    db.instances.find(query, {
        fields: {
            inbox_users: 1,
            traces: 1,
            state: 1
        }
    }).forEach(function (ins) {
        var trace;
        trace = _.find(ins.traces, function (t) {
            return t.is_finished === false;
        });
        return _.each(trace.approves, function (a, idx) {
            var idxStr, next_step_space_user, next_step_user_org_info, setObj;
            if (a.is_finished === false) {
                if (a.agent === toId) {
                    next_step_space_user = uuflowManager.getSpaceUser(spaceId, a.user);
                    // 获取next_step_user所在的部门信息
                    next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user);
                    idxStr = `traces.$.approves.${idx}.`;
                    setObj = {};
                    setObj[idxStr + 'handler'] = a.user;
                    setObj[idxStr + 'handler_name'] = a.user_name;
                    setObj[idxStr + 'handler_organization'] = next_step_user_org_info["organization"];
                    setObj[idxStr + 'handler_organization_name'] = next_step_user_org_info["organization_name"];
                    setObj[idxStr + 'handler_organization_fullname'] = next_step_user_org_info["organization_fullname"];
                    setObj[idxStr + 'agent'] = null;
                    ins.inbox_users.splice(ins.inbox_users.indexOf(toId), 1, a.user);
                    setObj.inbox_users = ins.inbox_users;
                    // 如果是分发还需要修改提交人信息
                    if (ins.state === 'draft') {
                        setObj.submitter = a.user;
                        setObj.submitter_name = a.user_name;
                    }
                    db.instances.update({
                        _id: ins._id,
                        inbox_users: toId,
                        'traces._id': a.trace
                    }, {
                        $set: setObj
                    });
                    // 更新instance_tasks
                    update_instance_tasks(ins._id, a.trace, a._id);
                    pushManager.send_message_to_specifyUser('current_user', a.user);
                    return pushManager.send_message_to_specifyUser('current_user', toId);
                } else if (a.user === toId) {
                    return db.instances.update({
                        _id: ins._id
                    }, {
                        $addToSet: {
                            inbox_users: toId
                        }
                    });
                }
            }
        });
    });
    ccQuery = {
        space: spaceId,
        cc_users: toId
    };
    ccQuery['traces.approves'] = {
        $elemMatch: {
            is_finished: false,
            agent: toId,
            type: 'cc'
        }
    };
    return db.instances.find(ccQuery, {
        fields: {
            cc_users: 1,
            traces: 1
        }
    }).forEach(function (ins) {
        return _.each(ins.traces, function (t) {
            return _.each(t.approves, function (a, idx) {
                var idxStr, next_step_space_user, next_step_user_org_info, setObj;
                if (a.is_finished === false && a.type === 'cc') {
                    if (a.agent === toId) {
                        next_step_space_user = uuflowManager.getSpaceUser(spaceId, a.user);
                        // 获取next_step_user所在的部门信息
                        next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user);
                        idxStr = `traces.$.approves.${idx}.`;
                        setObj = {};
                        setObj[idxStr + 'handler'] = a.user;
                        setObj[idxStr + 'handler_name'] = a.user_name;
                        setObj[idxStr + 'handler_organization'] = next_step_user_org_info["organization"];
                        setObj[idxStr + 'handler_organization_name'] = next_step_user_org_info["organization_name"];
                        setObj[idxStr + 'handler_organization_fullname'] = next_step_user_org_info["organization_fullname"];
                        setObj[idxStr + 'agent'] = null;
                        ins.cc_users.splice(ins.cc_users.indexOf(toId), 1, a.user);
                        setObj.cc_users = ins.cc_users;
                        db.instances.update({
                            _id: ins._id,
                            cc_users: toId,
                            'traces._id': a.trace
                        }, {
                            $set: setObj
                        });
                        // 更新instance_tasks
                        update_instance_tasks(ins._id, a.trace, a._id);
                        pushManager.send_message_to_specifyUser('current_user', a.user);
                        return pushManager.send_message_to_specifyUser('current_user', toId);
                    } else if (a.user === toId) {
                        return db.instances.update({
                            _id: ins._id
                        }, {
                            $addToSet: {
                                cc_users: toId
                            }
                        });
                    }
                    uuflowManager.updateCCcount(ins._id)
                }
            });
        });
    });
};

uuflowManager.updateCCcount = function (insId) {
    // 更新cc_count
    const insDoc = db.instances.findOne(insId, {
        fields: {
            cc_users: 1
        }
    });
    db.instances.update({
        _id: insId,
    }, {
        $set: {
            cc_count: insDoc.cc_users.length
        }
    })
};

uuflowManager.timeoutAutoSubmit = function (ins_id) {
    var query;
    query = {};
    if (ins_id) {
        check(ins_id, String);
        query._id = ins_id;
    }
    query.state = 'pending';
    query.current_step_auto_submit = true;
    query.traces = {
        $elemMatch: {
            is_finished: false,
            due_date: {
                $lte: new Date
            }
        }
    };
    db.instances.find(query).forEach(function (ins) {
        var approve_from_client, e, flow, flow_id, instance_id, judge, nextStep, nextStepId, nextSteps, nextUserIds, step, step_type, toLine, trace;
        try {
            flow_id = ins.flow;
            instance_id = ins._id;
            trace = _.last(ins.traces);
            flow = uuflowManager.getFlow(flow_id);
            step = uuflowManager.getStep(ins, flow, trace.step);
            step_type = step.step_type;
            toLine = _.find(step.lines, function (l) {
                return l.timeout_line === true;
            });
            nextStepId = toLine.to_step;
            nextStep = uuflowManager.getStep(ins, flow, nextStepId);
            if (nextStep.step_type === 'condition') {
                nextSteps = uuflowManager.getNextSteps(ins, flow, nextStep, "");
                console.error(nextSteps);
                nextStepId = nextSteps[0];
            }
            nextUserIds = getHandlersManager.getHandlers(instance_id, nextStepId);
            judge = "submitted";
            if (step_type === "sign") {
                judge = "approved";
            }
            approve_from_client = {
                'instance': instance_id,
                'trace': trace._id,
                'judge': judge,
                'next_steps': [
                    {
                        'step': nextStepId,
                        'users': nextUserIds
                    }
                ]
            };
            return _.each(trace.approves, function (a) {
                var current_user_info, updatedInstance;
                approve_from_client._id = a._id;
                current_user_info = db.users.findOne(a.handler, {
                    services: 0
                });
                updatedInstance = uuflowManager.workflow_engine(approve_from_client, current_user_info, current_user_info._id, true);
                // 满足超时自动提交条件后，则将申请单提交至下一步骤，并发送提示给当前步骤处理人
                return pushManager.send_instance_notification("auto_submit_pending_inbox", updatedInstance, "", current_user_info);
            });
        } catch (error) {
            e = error;
            console.error('AUTO TIMEOUT_AUTO_SUBMIT ERROR: ');
            return console.error(e.stack);
        }
    });
    return true;
};

/* 申请单重定位
instance_from_client: {
    _id: 申请单_id,
    relocate_inbox_users: 新处理人,
    relocate_comment: 备注,
    relocate_next_step: 新步骤
}
current_user_info: User记录
*/
uuflowManager.relocate = function (instance_from_client, current_user_info) {
    var _users, ah, approve_users, current_setp, current_setp_type, current_space_user, current_user, current_user_organization, flow, h, i, inbox_users, ins, instance, instance_id, l, last_trace, newTrace, new_inbox_users, next_step, next_step_name, next_step_type, not_in_inbox_users, now, permissions, r, relocate_appr, relocate_comment, relocate_inbox_users, relocate_next_step, sameTraces, setObj, signShowApproveId, space, space_id, ta, ti, traces;
    current_user = current_user_info._id;
    instance = uuflowManager.getInstance(instance_from_client["_id"]);
    last_trace = _.last(instance.traces);
    // 验证login user_id对该流程有管理申请单的权限
    permissions = permissionManager.getFlowPermissions(instance.flow, current_user);
    space = db.spaces.findOne(instance.space, {
        fields: {
            admins: 1
        }
    });
    if ((!permissions.includes("admin")) && (!space.admins.includes(current_user))) {
        throw new Meteor.Error('error!', "用户没有对当前流程的管理权限");
    }
    space_id = instance.space;
    instance_id = last_trace.instance;
    inbox_users = instance.inbox_users;
    relocate_inbox_users = instance_from_client["relocate_inbox_users"];
    relocate_comment = instance_from_client["relocate_comment"];
    relocate_next_step = instance_from_client["relocate_next_step"];
    not_in_inbox_users = _.difference(inbox_users, relocate_inbox_users);
    new_inbox_users = _.difference(relocate_inbox_users, inbox_users);
    approve_users = [];
    // 获取一个flow
    flow = uuflowManager.getFlow(instance.flow);
    next_step = uuflowManager.getStep(instance, flow, relocate_next_step);
    next_step_type = next_step.step_type;
    next_step_name = next_step.name;
    current_setp = uuflowManager.getStep(instance, flow, last_trace.step);
    current_setp_type = current_setp.step_type;
    traces = instance.traces;
    setObj = {};
    // 重定位的时候使用approve.values合并 instance.values生成新的instance.values #1328
    setObj.values = uuflowManager.getUpdatedValues(instance);
    now = new Date;
    const finishedApproveIds = []
    i = 0;
    while (i < traces.length) {
        if (traces[i]._id === last_trace._id) {
            if (!traces[i].approves) {
                traces[i].approves = [];
            }
            // 更新当前trace.approve记录
            h = 0;
            while (h < traces[i].approves.length) {
                if (traces[i].approves[h].is_finished === false && traces[i].approves[h].type !== "cc" && traces[i].approves[h].type !== "distribute") {
                    traces[i].approves[h].start_date = now;
                    traces[i].approves[h].finish_date = now;
                    traces[i].approves[h].read_date = now;
                    traces[i].approves[h].is_error = false;
                    traces[i].approves[h].is_read = true;
                    traces[i].approves[h].is_finished = true;
                    traces[i].approves[h].judge = "terminated";
                    traces[i].approves[h].cost_time = traces[i].approves[h].finish_date - traces[i].approves[h].start_date;
                    approve_users.push(traces[i].approves[h].user);
                    // begin 被重定位给A，再被重定位走，之前A的意见在意见栏中显示不出来了。 #1921
                    if (traces[i].approves[h].sign_show === true) {
                        ta = traces[i].approves[h];
                        sameTraces = _.filter(traces, function (t) {
                            return t.step === traces[i].step;
                        });
                        l = sameTraces.length - 1;
                        signShowApproveId = null;
                        while (l > -1) {
                            _.each(sameTraces[l].approves, function (a) {
                                if (a.user === ta.user && a.judge !== "terminated" && a.description && !signShowApproveId) {
                                    return signShowApproveId = a._id;
                                }
                            });
                            l--;
                        }
                        if (signShowApproveId) {
                            ti = 0;
                            while (ti < traces.length) {
                                ah = 0;
                                while (ah < traces[ti].approves.length) {
                                    if (traces[ti].approves[ah]._id === signShowApproveId) {
                                        traces[ti].approves[ah].sign_show = true;
                                        traces[i].approves[h].sign_show = false;
                                    }
                                    ah++;
                                }
                                ti++;
                            }
                        }
                    }
                    // end 被重定位给A，再被重定位走，之前A的意见在意见栏中显示不出来了。 #1921
                    finishedApproveIds.push(traces[i].approves[h]._id)
                }
                h++;
            }
            // 在同一trace下插入重定位操作者的approve记录
            current_space_user = uuflowManager.getSpaceUser(space_id, current_user);
            current_user_organization = db.organizations.findOne(current_space_user.organization, {
                fields: {
                    name: 1,
                    fullname: 1
                }
            });
            relocate_appr = {};
            relocate_appr._id = new Mongo.ObjectID()._str;
            relocate_appr.instance = instance_id;
            relocate_appr.trace = traces[i]._id;
            relocate_appr.is_finished = true;
            relocate_appr.user = current_user;
            relocate_appr.user_name = current_user_info.name;
            relocate_appr.handler = current_user;
            relocate_appr.handler_name = current_user_info.name;
            relocate_appr.handler_organization = current_space_user.organization;
            relocate_appr.handler_organization_name = current_user_organization.name;
            relocate_appr.handler_organization_fullname = current_user_organization.fullname;
            relocate_appr.start_date = now;
            relocate_appr.finish_date = now;
            relocate_appr.due_date = traces[i].due_date;
            relocate_appr.read_date = now;
            relocate_appr.judge = "relocated";
            relocate_appr.is_read = true;
            relocate_appr.description = relocate_comment;
            relocate_appr.is_error = false;
            relocate_appr.values = {};
            relocate_appr.cost_time = relocate_appr.finish_date - relocate_appr.start_date;
            traces[i].approves.push(relocate_appr);
            // 更新当前trace记录
            traces[i].is_finished = true;
            traces[i].finish_date = now;
            traces[i].judge = "relocated";
        }
        i++;
    }
    if (next_step_type === "end") {
        // 插入下一步trace记录
        newTrace = {};
        newTrace._id = new Mongo.ObjectID()._str;
        newTrace.instance = instance_id;
        newTrace.previous_trace_ids = [last_trace._id];
        newTrace.is_finished = true;
        newTrace.step = relocate_next_step;
        newTrace.name = next_step_name;
        newTrace.start_date = now;
        newTrace.finish_date = now;
        newTrace.approves = [];
        // 更新instance记录
        setObj.state = "completed";
        setObj.inbox_users = [];
        setObj.final_decision = "terminated";
        setObj.finish_date = new Date;
        setObj.current_step_name = next_step_name;
        setObj.current_step_auto_submit = false;
    } else {
        // 插入下一步trace记录
        newTrace = {};
        newTrace._id = new Mongo.ObjectID()._str;
        newTrace.instance = instance_id;
        newTrace.previous_trace_ids = [last_trace._id];
        newTrace.is_finished = false;
        newTrace.step = relocate_next_step;
        newTrace.name = next_step_name;
        newTrace.start_date = now;
        newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours, space_id);
        newTrace.approves = [];
        _.each(relocate_inbox_users, function (next_step_user_id, idx) {
            var agent, handler_id, handler_info, newApprove, next_step_space_user, next_step_user_org_info, user_info;
            // 插入下一步trace.approve记录
            newApprove = {};
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
                relocate_inbox_users[idx] = agent;
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
            // 获取next_step_user所在的部门信息
            next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user);
            newApprove.handler_organization = next_step_user_org_info["organization"];
            newApprove.handler_organization_name = next_step_user_org_info["organization_name"];
            newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"];
            newApprove.start_date = now;
            newApprove.due_date = newTrace.due_date;
            newApprove.is_read = false;
            newApprove.is_error = false;
            newApprove.values = {};
            uuflowManager.setRemindInfo(instance.values, newApprove);
            return newTrace.approves.push(newApprove);
        });
        setObj.inbox_users = relocate_inbox_users;
        setObj.state = "pending";
        setObj.current_step_name = next_step_name;
        setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines);
    }
    instance.outbox_users.push(current_user);
    instance.outbox_users = instance.outbox_users.concat(inbox_users).concat(approve_users);
    setObj.outbox_users = _.uniq(instance.outbox_users);
    setObj.modified = now;
    setObj.modified_by = current_user;
    setObj.is_archived = false;
    traces.push(newTrace);
    setObj.traces = traces;
    if (setObj.state === 'completed') {
        r = db.instances.update({
            _id: instance_id
        }, {
            $set: setObj
        });
    } else {
        r = db.instances.update({
            _id: instance_id
        }, {
            $set: setObj,
            $unset: {
                finish_date: 1
            }
        });
    }
    // 删除当前结束的approve
    remove_many_instance_tasks(finishedApproveIds)
    // 生成新待审核的approve
    if (newTrace.approves) {
        insert_many_instance_tasks(instance_id, newTrace._id, _.pluck(newTrace.approves, '_id'))
    }

    if (r) {
        ins = uuflowManager.getInstance(instance_id);
        // 给被删除的inbox_users 和 当前用户 发送push
        pushManager.send_message_current_user(current_user_info);
        _.each(not_in_inbox_users, function (user_id) {
            if (user_id !== current_user) {
                return pushManager.send_message_to_specifyUser("current_user", user_id);
            }
        });
        // 提取instances.outbox_users数组和填单人、申请人
        _users = [];
        _users.push(ins.applicant);
        _users.push(ins.submitter);
        _users = _.uniq(_users.concat(ins.outbox_users));
        _.each(_users, function (user_id) {
            return pushManager.send_message_to_specifyUser("current_user", user_id);
        });
        // 给新加入的inbox_users发送push message
        pushManager.send_instance_notification("reassign_new_inbox_users", ins, relocate_comment, current_user_info);
        // 如果已经配置webhook并已激活则触发
        return pushManager.triggerWebhook(ins.flow, ins, {}, 'relocate', current_user, ins.inbox_users);
    }
};

uuflowManager.draft_save_instance = function (ins, userId) {
    var applicant, applicant_id, approve_id, current_trace, current_user, description, flow, flow_id, form, form_id, index, ins_id, instance, key_str, lang, name_forumla, next_steps, org_id, organization, result, setObj, space_id, start_step, trace_id, traces, user, values;
    result = true;
    setObj = {};
    index = 0;
    ins_id = ins._id;
    trace_id = ins.traces[0]._id;
    approve_id = ins.traces[0].approves[0]._id;
    description = ins.traces[0].approves[0].description;
    next_steps = ins.traces[0].approves[0].next_steps;
    values = ins.traces[0].approves[0].values || {};
    applicant_id = ins.applicant;
    instance = db.instances.findOne(ins_id, {
        fields: {
            applicant: 1,
            state: 1,
            submitter: 1,
            traces: 1,
            form: 1,
            flow_version: 1,
            space: 1,
            flow: 1
        }
    });
    space_id = instance.space;
    flow_id = instance.flow;
    form_id = instance.form;
    traces = instance.traces;
    current_trace = _.find(traces, function (t) {
        return t._id === trace_id;
    });
    current_trace.approves.forEach(function (a, idx) {
        if (a._id === approve_id) {
            index = idx;
        }
    });
    key_str = 'traces.$.approves.' + index + '.';
    // 判断一个instance是否为拟稿状态
    current_user = db.users.findOne({
        _id: userId
    }, {
        fields: {
            locale: 1
        }
    });
    lang = current_user.locale === 'zh-cn' ? 'zh-CN' : 'en';
    uuflowManager.isInstanceDraft(instance, lang);
    // 判断一个用户是否是一个instance的提交者
    uuflowManager.isInstanceSubmitter(instance, userId);
    flow = db.flows.findOne(flow_id, {
        fields: {
            'current._id': 1,
            'current.form_version': 1,
            'name': 1,
            'current.steps': 1
        }
    });
    setObj.modified = new Date;
    setObj.modified_by = userId;
    if (flow.current._id !== instance.flow_version) {
        result = 'upgraded';
        start_step = _.find(flow.current.steps, function (s) {
            return s.step_type === 'start';
        });
        // 流程已升级
        setObj.flow_version = flow.current._id;
        setObj.form_version = flow.current.form_version;
        // 存入当前最新版flow中开始节点的step_id
        setObj['traces.$.step'] = start_step._id;
        setObj['traces.$.name'] = start_step.name;
    }
    if (instance.applicant !== applicant_id) {
        // 申请人已变换
        user = db.users.findOne(applicant_id, {
            fields: {
                name: 1
            }
        });
        applicant = db.space_users.find({
            space: space_id,
            user: applicant_id
        }, {
            fields: {
                organization: 1
            }
        });
        org_id = applicant.fetch()[0].organization;
        organization = db.organizations.findOne(org_id, {
            fields: {
                name: 1,
                fullname: 1
            }
        });
        setObj.applicant = applicant_id;
        setObj.applicant_name = user.name;
        setObj.applicant_organization = org_id;
        setObj.applicant_organization_name = organization.name;
        setObj.applicant_organization_fullname = organization.fullname;
        setObj[key_str + 'user'] = applicant_id;
        setObj[key_str + 'user_name'] = user.name;
    }
    setObj[key_str + 'values'] = values;
    setObj[key_str + 'description'] = description;
    setObj[key_str + 'judge'] = 'submitted';
    setObj[key_str + 'read_date'] = new Date;
    if (result !== 'upgraded' && next_steps) {
        setObj[key_str + 'next_steps'] = next_steps;
    }
    // 计算申请单标题
    form = db.forms.findOne({
        _id: form_id
    }, {
        fields: {
            'current.name_forumla': 1
        }
    });
    name_forumla = form.current.name_forumla;
    if (name_forumla) {
        // var iscript = name_forumla.replace(/\{/g, "(values['").replace(/\}/g, "'] || '')");
        // var rev = eval(iscript);
        setObj.name = uuflowManager.getInstanceName(ins, values);
    }
    db.instances.update({
        _id: ins_id,
        'traces._id': trace_id
    }, {
        $set: setObj
    });
    update_instance_tasks(ins_id, trace_id, approve_id)
    return result;
};

// 计算出在表单字段中选择了列表显示的字段
uuflowManager.caculateExtras = function (values, formDoc, formVersionId) {
    if (_.isEmpty(values)) {
        return
    }
    
    const extras = {}
    const formVersion = uuflowManager.getFormVersion(formDoc, formVersionId)
    _.each(formVersion.fields, function (field) {
        if (field.is_list_display) {
            extras[field.code] = values[field.code]
        } else if (field.type === 'table') {
            // 表格
            if (values[field.code]) {
                const tableExtras = []
                _.each(values[field.code], function (s_value) {
                    const rowValues = {}
                    _.each(field.fields, function (s_field) {
                        if (s_field.is_list_display) {
                            rowValues[s_field.code] = s_value[s_field.code]
                        }
                    });
                    if (!_.isEmpty(rowValues)) {
                        tableExtras.push(rowValues)
                    }
                });
                if (!_.isEmpty(tableExtras)) {
                    extras[field.code] = tableExtras
                }
            }
        } else if (field.type === 'section') {
            // 分组
            _.each(field.fields, function (s_field) {
                if (s_field.is_list_display) {
                    extras[s_field.code] = values[s_field.code]
                }
            });
        }
    });

    if (_.isEmpty(extras)) {
        return
    }

    return extras
}
