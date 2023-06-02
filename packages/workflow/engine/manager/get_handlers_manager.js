var excuteTriggers, serviceWorkflow;

serviceWorkflow = require('@steedos/service-workflow');

global.getHandlersManager = {};

getHandlersManager.getHandlersByUsersAndRoles = function (user_ids, role_ids, space_id) {
    var approve_users;
    approve_users = new Array;
    _.each(user_ids, function (user_id) {
        var users;
        if (db.users.find({
            _id: user_id
        }).count() > 0) {
            users = getHandlersManager.getHandlersByUserAndRoles(user_id, role_ids, space_id);
            if (users.length > 0) {
                return approve_users = approve_users.concat(users);
            }
        } else {
            throw new Meteor.Error('error!', "user_id不合法不合法");
        }
    });
    approve_users = _.uniq(approve_users);
    return approve_users;
};

getHandlersManager.getHandlersByUserAndRoles = function (user_id, role_ids, space_id) {
    var user_ids;
    user_ids = new Array;
    _.each(role_ids, function (role_id) {
        var users;
        if (db.flow_roles.find({
            _id: role_id
        }).count() > 0) {
            users = getHandlersManager.getHandlersByUserAndRole(user_id, role_id, space_id);
            if (users.length > 0) {
                return user_ids = user_ids.concat(users);
            }
        } else {
            throw new Meteor.Error('error!', "role_id已经被删除");
        }
    });
    if (user_ids.length > 0) {
        user_ids = _.uniq(user_ids);
        return user_ids;
    } else {
        throw new Meteor.Error('error!', "根据user_id和role_ids没查到对应的处理人");
    }
};

getHandlersManager.getHandlersByUserAndRole = function (user_id, role_id, space_id) {
    var orgs, user_ids;
    orgs = db.organizations.find({
        space: space_id,
        users: user_id
    }, {
        fields: {
            _id: 1
        }
    }).fetch();
    user_ids = new Array;
    _.each(orgs, function (org) {
        var users;
        users = getHandlersManager.getHandlersByOrgAndRole(org._id, role_id, space_id);
        if (users.length > 0) {
            return user_ids = user_ids.concat(users);
        }
    });
    user_ids = _.uniq(user_ids);
    return user_ids;
};

getHandlersManager.getHandlersByOrgsAndRoles = function (org_ids, role_ids, space_id) {
    var user_ids;
    user_ids = new Array;
    _.each(org_ids, function (org_id) {
        var users;
        users = getHandlersManager.getHandlersByOrgAndRoles(org_id, role_ids, space_id);
        if (users.length > 0) {
            return user_ids = user_ids.concat(users);
        }
    });
    user_ids = _.uniq(user_ids);
    return user_ids;
};

getHandlersManager.getHandlersByOrgAndRoles = function (org_id, role_ids, space_id) {
    var user_ids;
    user_ids = new Array;
    _.each(role_ids, function (role_id) {
        var users;
        users = getHandlersManager.getHandlersByOrgAndRole(org_id, role_id, space_id);
        if (users.length > 0) {
            return user_ids = user_ids.concat(users);
        }
    });
    if (user_ids.length > 0) {
        user_ids = _.uniq(user_ids);
        return user_ids;
    } else {
        throw new Meteor.Error('error!', "根据org_id和role_ids没查到对应的处理人");
    }
};

getHandlersManager.getHandlersByOrgAndRole = function (org_id, role_id, space_id) {
    var org, parents, positions, user_ids;
    org = db.organizations.findOne({
        _id: org_id
    }, {
        fields: {
            parents: 1
        }
    });
    user_ids = new Array;
    positions = db.flow_positions.find({
        space: space_id,
        org: org_id,
        role: role_id
    }, {
        fields: {
            users: 1
        }
    }).fetch();
    _.each(positions, function (position) {
        return user_ids = user_ids.concat(position.users);
    });
    if (user_ids.length === 0) {
        parents = org.parents;
        _.each(parents, function (parent_id) {
            positions = db.flow_positions.find({
                space: space_id,
                org: parent_id,
                role: role_id
            }, {
                fields: {
                    users: 1
                }
            }).fetch();
            if (positions.length > 0) {
                return _.each(positions, function (position) {
                    return user_ids = user_ids.concat(position.users);
                });
            }
        });
    }
    user_ids = _.uniq(user_ids);
    return user_ids;
};

getHandlersManager.getHandlers = function (instance_id, step_id, login_user_id) {
    var _approve, _space_user, _trace, applicant, applicantSuperiors, approveHrRoleIds, approve_users, approver_org_field, approver_org_ids, approver_step, approver_user_field, approver_user_ids, current, current_flow, current_flow_version, current_form, current_step, current_steps, deal_type, field_code, finished_traces, flow_id, flow_rev, form, form_fields, form_id, form_rev, handlers, instance, max_startDate_trace, new_approver_user_ids, new_org_user_ids, newest_values, next_step_users, org_ids, org_ids_names, org_user_ids, space_id, space_user_count, submitter, submitter_user_count, unfinished_trace, user_ids, user_ids_names, users, valid_approver_org_ids;
    instance = db.instances.findOne(instance_id);
    // 拟稿时, 可以设定后续每个步骤的处理人 #1926
    if (instance.step_approve && !_.isEmpty(instance.step_approve[`${step_id}_options`])) {
        return instance.step_approve[`${step_id}_options`];
    }
    approve_users = new Array;
    space_id = instance.space;
    flow_id = instance.flow;
    flow_rev = instance.flow_version;
    current_flow = db.flows.findOne(flow_id, { fields: { _id: 1, form: 1, 'current._id': 1, 'current.steps': 1, 'current.form_version': 1, 'historys._id': 1, 'historys.steps': 1, 'historys.form_version': 1 }});
    current_step = null;
    current_steps = new Array;
    if (current_flow.current._id === flow_rev) {
        current_steps = current_flow.current.steps;
    } else {
        current = _.find(current_flow.historys, function (history) {
            return history._id === flow_rev;
        });
        current_steps = current.steps;
    }
    // 从获取的steps中根据:step_id提取对应的step对象
    current_step = _.find(current_steps, function (step) {
        return step._id === step_id;
    });
    // 判断step_type
    if (current_step.step_type === "condition") {
        unfinished_trace = _.find(instance.traces, function (trace) {
            return trace.is_finished === false;
        });
        return new Array(unfinished_trace.approves[0].user);
    }
    if (current_step.step_type === "start") {
        handlers = new Array;
        handlers.push(instance.applicant);
        handlers.push(instance.submitter);
        handlers = _.uniq(handlers);
        return handlers;
    }
    // 得到step的"deal_type"，并进行逻辑判断找到对应的处理人
    deal_type = current_step.deal_type;
    users = new Array;
    if (deal_type === "applicantRole") {
        // 1.***********申请人所属组织中的审批岗位***********
        applicant = instance.applicant;
        if (applicant) {
            space_user_count = db.space_users.find({
                space: space_id,
                user: applicant
            }).count();
            if (space_user_count === 0) {
                throw new Meteor.Error('error!', "提交人已经被删除或不属于当前space");
            }
            if (current_step.approver_roles && current_step.approver_roles.length > 0) {
                _.each(current_step.approver_roles, function (approver_role) {
                    var role_count;
                    role_count = db.flow_roles.find({
                        _id: approver_role
                    }).count();
                    if (role_count === 0) {
                        throw new Meteor.Error('error!', "角色已经被删除");
                    }
                });
                users = getHandlersManager.getHandlersByUserAndRoles(applicant, current_step.approver_roles, space_id);
            } else {
                throw new Meteor.Error('error!', "审批岗位未指定");
            }
        } else {
            throw new Meteor.Error('error!', "Instance的提交人为空");
        }
    } else if (deal_type === "hrRole") {
        approveHrRoleIds = current_step.approver_hr_roles;
        if (approveHrRoleIds) {
            users = _.pluck(WorkflowManager.getHrRolesUsers(space_id, approveHrRoleIds), 'user');
        } else {
            throw new Meteor.Error('error!', "角色未指定");
        }
    } else if (deal_type === "applicant") {
        // 2.***********申请人***********
        users = new Array(instance.applicant);
    } else if (deal_type === "orgFieldRole") {
        // 3.***********部门字段所属组织中的审批岗位***********
        form_id = current_flow.form;
        form_rev = null;
        if (flow_rev === current_flow.current._id) {
            form_rev = current_flow.current.form_version;
        } else {
            current_flow_version = _.find(current_flow.historys, function (current_flow_history) {
                return current_flow_history._id === flow_rev;
            });
            if (current_flow_version) {
                form_rev = current_flow_version.form_version;
            }
        }
        form = db.forms.findOne(form_id);
        current_form = null;
        if (form_rev === form.current._id) {
            current_form = form.current;
        } else {
            current_form = _.find(form.historys, function (form_history) {
                return form_history._id === form_rev;
            });
        }
        approver_org_field = current_step.approver_org_field;
        form_fields = current_form.fields;
        field_code = null;
        _.each(form_fields, function (form_field) {
            if (form_field._id === approver_org_field) {
                return field_code = form_field.code;
            }
        });
        // 取得最新的values
        newest_values = uuflowManager.getUpdatedValues(instance);
        org_ids = new Array;
        org_ids_names = new Array;
        if (newest_values[field_code]) {
            if (newest_values[field_code] instanceof Array) {
                org_ids_names = newest_values[field_code];
            } else {
                org_ids_names.push(newest_values[field_code]);
            }
        }
        // 校验org_id数组中org_id是否合法
        _.each(org_ids_names, function (org) {
            var check_org_count;
            check_org_count = db.organizations.find({
                _id: org["id"]
            }).count();
            if (check_org_count === 0) {
                throw new Meteor.Error('error!', "组织ID不合法");
            }
            return org_ids.push(org["id"]);
        });
        if (current_step.approver_roles && current_step.approver_roles.length > 0) {
            // 检查approver_roles中role是否不存在或已经被删除
            _.each(current_step.approver_roles, function (approver_role) {
                var role_count;
                role_count = db.flow_roles.find({
                    _id: approver_role
                }).count();
                if (role_count === 0) {
                    throw new Meteor.Error('error!', approver_role + "已经被删除");
                }
            });
            users = getHandlersManager.getHandlersByOrgsAndRoles(org_ids, current_step.approver_roles, instance.space);
        } else {
            throw new Meteor.Error('error!', "流程步骤" + current_step.name + "审批岗位未指定");
        }
    } else if (deal_type === "orgField") {
        // 4.***********部门字段所属组织中的人员***********
        form_id = current_flow.form;
        form_rev = null;
        if (flow_rev === current_flow.current._id) {
            form_rev = current_flow.current.form_version;
        } else {
            current_flow_version = _.find(current_flow.historys, function (current_flow_history) {
                return current_flow_history._id === flow_rev;
            });
            if (current_flow_version) {
                form_rev = current_flow_version.form_version;
            }
        }
        form = db.forms.findOne(form_id);
        current_form = null;
        if (form_rev === form.current._id) {
            current_form = form.current;
        } else {
            current_form = _.find(form.historys, function (form_history) {
                return form_history._id === form_rev;
            });
        }
        approver_org_field = current_step.approver_org_field;
        form_fields = current_form.fields;
        field_code = null;
        _.each(form_fields, function (form_field) {
            if (form_field._id === approver_org_field) {
                return field_code = form_field.code;
            }
        });
        // 取得最新的values
        newest_values = uuflowManager.getUpdatedValues(instance);
        org_ids = new Array;
        org_ids_names = new Array;
        if (newest_values[field_code]) {
            if (newest_values[field_code] instanceof Array) {
                org_ids_names = newest_values[field_code];
            } else {
                org_ids_names.push(newest_values[field_code]);
            }
        }
        // 校验org_id数组中org_id是否合法
        _.each(org_ids_names, function (org) {
            var check_org_count;
            check_org_count = db.organizations.find({
                _id: org["id"]
            }).count();
            if (check_org_count === 0) {
                throw new Meteor.Error('error!', "组织ID不合法");
            }
            return org_ids.push(org["id"]);
        });
        // 校验org下存在处理人
        user_ids = new Array;
        _.each(org_ids, function (org_id) {
            var check_orgs, org, org_children, org_users;
            org = db.organizations.findOne({
                _id: org_id
            }, {
                fields: {
                    users: 1
                }
            });
            org_children = db.organizations.find({
                space: space_id,
                parents: org_id
            }, {
                fields: {
                    users: 1
                }
            }).fetch();
            org_children.unshift(org);
            check_orgs = org_children;
            org_users = new Array;
            _.each(check_orgs, function (check_org_user) {
                if (check_org_user.users) {
                    _.each(check_org_user.users, function (org_user) {
                        if (db.space_users.find({
                            space: space_id,
                            user: org_user
                        }).count() === 0) {
                            throw new Meteor.Error('error!', "space下不存在此user");
                        }
                    });
                }
                user_ids = user_ids.concat(check_org_user.users);
                return org_users = org_users.concat(check_org_user.users);
            });
            if (org_users.length === 0) {
                throw new Meteor.Error('error!', "组织" + org_id + "不存在处理人");
            }
        });
        users = _.uniq(user_ids);
    } else if (deal_type === "userFieldRole") {
        // 5.***********人员字段所属组织中的审批岗位***********
        form_id = current_flow.form;
        form_rev = null;
        if (flow_rev === current_flow.current._id) {
            form_rev = current_flow.current.form_version;
        } else {
            current_flow_version = _.find(current_flow.historys, function (current_flow_history) {
                return current_flow_history._id === flow_rev;
            });
            if (current_flow_version) {
                form_rev = current_flow_version.form_version;
            }
        }
        form = db.forms.findOne(form_id);
        current_form = null;
        if (form_rev === form.current._id) {
            current_form = form.current;
        } else {
            current_form = _.find(form.historys, function (form_history) {
                return form_history._id === form_rev;
            });
        }
        approver_user_field = current_step.approver_user_field;
        form_fields = current_form.fields;
        field_code = null;
        _.each(form_fields, function (form_field) {
            if (form_field._id === approver_user_field) {
                return field_code = form_field.code;
            }
        });
        // 取得最新的values
        newest_values = uuflowManager.getUpdatedValues(instance);
        // 获取user_id数组
        user_ids_names = new Array;
        if (newest_values[field_code]) {
            if (newest_values[field_code] instanceof Array) {
                user_ids_names = newest_values[field_code];
            } else {
                user_ids_names.push(newest_values[field_code]);
            }
        }
        // 校验user_id数组中user_id是否合法
        user_ids = new Array;
        _.each(user_ids_names, function (user) {
            var check_user_count;
            check_user_count = db.space_users.find({
                space: space_id,
                user: user["id"]
            }).count();
            if (check_user_count === 0) {
                throw new Meteor.Error('error!', "人员ID不合法");
            }
            return user_ids.push(user["id"]);
        });
        user_ids = _.uniq(user_ids);
        if (current_step.approver_roles && current_step.approver_roles.length > 0) {
            // 检查approver_roles中role是否不存在或已经被删除
            _.each(current_step.approver_roles, function (approver_role) {
                var role_count;
                role_count = db.flow_roles.find({
                    _id: approver_role
                }).count();
                if (role_count === 0) {
                    throw new Meteor.Error('error!', approver_role + "已经被删除");
                }
            });
            users = getHandlersManager.getHandlersByUsersAndRoles(user_ids, current_step.approver_roles, instance.space);
        } else {
            throw new Meteor.Error('error!', "流程步骤" + current_step.name + "审批岗位未指定");
        }
    } else if (deal_type === "userField") {
        // 6.***********表单人员字段***********
        form_id = current_flow.form;
        form_rev = null;
        if (flow_rev === current_flow.current._id) {
            form_rev = current_flow.current.form_version;
        } else {
            current_flow_version = _.find(current_flow.historys, function (current_flow_history) {
                return current_flow_history._id === flow_rev;
            });
            if (current_flow_version) {
                form_rev = current_flow_version.form_version;
            }
        }
        form = db.forms.findOne(form_id);
        current_form = null;
        if (form_rev === form.current._id) {
            current_form = form.current;
        } else {
            current_form = _.find(form.historys, function (form_history) {
                return form_history._id === form_rev;
            });
        }
        approver_user_field = current_step.approver_user_field;
        form_fields = current_form.fields;
        field_code = null;
        _.each(form_fields, function (form_field) {
            if (form_field._id === approver_user_field) {
                return field_code = form_field.code;
            }
        });
        // 取得最新的values
        newest_values = uuflowManager.getUpdatedValues(instance);
        // 获取user_id数组
        user_ids_names = new Array;
        if (newest_values[field_code]) {
            if (newest_values[field_code] instanceof Array) {
                user_ids_names = newest_values[field_code];
            } else {
                user_ids_names.push(newest_values[field_code]);
            }
        }
        // 校验user_id数组中user_id是否合法
        user_ids = new Array;
        _.each(user_ids_names, function (user) {
            var check_user_count;
            check_user_count = db.space_users.find({
                space: space_id,
                user: user["id"]
            }).count();
            if (check_user_count === 0) {
                throw new Meteor.Error('error!', "人员ID不合法");
            }
            return user_ids.push(user["id"]);
        });
        users = _.uniq(user_ids);
    } else if (deal_type === "specifyStepRole") {
        // 7.***********指定步骤处理审批岗位***********
        approver_step = current_step.approver_step;
        finished_traces = new Array;
        _.each(instance.traces, function (trace) {
            if (trace.step === approver_step) {
                return finished_traces.push(trace);
            }
        });
        // 根据start_date取最新的trace
        max_startDate_trace = _.max(finished_traces, function (t) {
            return t.start_date;
        });
        approve_users = _.pluck(max_startDate_trace.approves, "user");
        if (current_step.approver_roles) {
            _.each(current_step.approver_roles, function (approver_role) {
                var role_count;
                role_count = db.flow_roles.find({
                    _id: approver_role
                }).count();
                if (role_count === 0) {
                    throw new Meteor.Error('error!', "角色已经被删除");
                }
            });
        }
        // 验证查到的user是否都合法
        _.each(approve_users, function (approve_user) {
            if (db.space_users.find({
                space: space_id,
                user: approve_user
            }).count() === 0) {
                throw new Meteor.Error('error!', "指定步骤的处理人已经变更");
            }
        });
        users = getHandlersManager.getHandlersByUsersAndRoles(approve_users, current_step.approver_roles, space_id);
    } else if (deal_type === "specifyStepUser") {
        // 8.***********指定步骤处理人***********
        approver_step = current_step.approver_step;
        finished_traces = new Array;
        _.each(instance.traces, function (trace) {
            if (trace.step === approver_step) {
                return finished_traces.push(trace);
            }
        });
        // 根据start_date取最新的trace
        max_startDate_trace = _.max(finished_traces, function (t) {
            return t.start_date;
        });
        approve_users = _.pluck(max_startDate_trace.approves, "user");
        // 验证查到的user是否都合法
        _.each(approve_users, function (approve_user) {
            var check_approve_user_count;
            check_approve_user_count = db.space_users.find({
                space: space_id,
                user: approve_user
            }).count();
            if (check_approve_user_count === 0) {
                throw new Meteor.Error('error!', "指定步骤的处理人已经变更");
            }
        });
        users = _.uniq(approve_users);
    } else if (deal_type === "submitterRole") {
        // 9.***********填单人所属组织中的审批岗位***********
        submitter = instance.submitter;
        if (!submitter) {
            // 判断提交人是否已经被删除
            submitter_user_count = db.space_users.find({
                space: space_id,
                user: submitter
            }).count();
            if (submitter_user_count === 0) {
                throw new Meteor.Error('error!', "提交人已经被删除或不属于当前工作区");
            } else {
                if (current_step.approver_roles && current_step.approver_roles.length > 0) {
                    // 检查approver_roles中role是否不存在或已经被删除
                    _.each(current_step.approver_roles, function (approver_role) {
                        var role_count;
                        role_count = db.flow_roles.find({
                            _id: approver_role
                        }).count();
                        if (role_count === 0) {
                            throw new Meteor.Error('error!', approver_role + "已经被删除");
                        }
                    });
                    users = getHandlersManager.getHandlersByUserAndRoles(submitter, current_step.approver_roles, space_id);
                } else {
                    throw new Meteor.Error('error!', "流程步骤" + current_step.name + "审批岗位未指定");
                }
            }
        } else {
            throw new Meteor.Error('error!', "申请单的提交人为空");
        }
    } else if (deal_type === "submitter") {
        // 10.***********提交人***********
        submitter = instance.submitter;
        // 判断提交人是否已经被删除
        submitter_user_count = db.space_users.find({
            space: space_id,
            user: submitter
        }).count();
        if (submitter_user_count === 0) {
            throw new Meteor.Error('error!', "提交人已经被删除或不属于当前工作区");
        } else {
            users = new Array(submitter);
        }
    } else if (deal_type === "specifyOrg") {
        // 11.***********某部门内的所有人***********
        approver_org_ids = current_step.approver_orgs;
        if (!approver_org_ids || approver_org_ids.length === 0) {
            throw new Meteor.Error('error!', "未定义用于查找下一步处理人的部门，请联系管理员调查流程图的配置是否正确");
        }
        // 验证所指定的organization_id都存在
        valid_approver_org_ids = new Array;
        _.each(approver_org_ids, function (approver_org_id) {
            if (db.organizations.find({
                _id: approver_org_id
            }).count() > 0) {
                return valid_approver_org_ids.unshift(approver_org_id);
            }
        });
        org_user_ids = new Array;
        _.each(valid_approver_org_ids, function (valid_approver_org_id) {
            var child_orgs, valid_approver_org;
            valid_approver_org = db.organizations.findOne({
                _id: valid_approver_org_id
            }, {
                fields: {
                    users: 1
                }
            });
            if (valid_approver_org.users) {
                org_user_ids = org_user_ids.concat(valid_approver_org.users);
            }
            child_orgs = db.organizations.find({
                space: space_id,
                parents: valid_approver_org_id
            }, {
                fields: {
                    users: 1
                }
            }).fetch();
            return _.each(child_orgs, function (child_org) {
                if (child_org.users) {
                    return org_user_ids = org_user_ids.concat(child_org.users);
                }
            });
        });
        org_user_ids = _.uniq(org_user_ids);
        new_org_user_ids = new Array;
        _.each(org_user_ids, function (org_user_id) {
            var space_user_info_count;
            space_user_info_count = db.space_users.find({
                space: space_id,
                user: org_user_id
            }).count();
            if (space_user_info_count > 0) {
                return new_org_user_ids.push(org_user_id);
            }
        });
        users = new_org_user_ids;
    } else if (deal_type === "specifyUser") {
        // 12.***********指定的人员***********
        approver_user_ids = current_step.approver_users;
        approver_user_ids = _.uniq(approver_user_ids);
        new_approver_user_ids = new Array;
        _.each(approver_user_ids, function (approver_user_id) {
            var space_user_info_count;
            space_user_info_count = db.space_users.find({
                space: space_id,
                user: approver_user_id
            }).count();
            if (space_user_info_count > 0) {
                return new_approver_user_ids.push(approver_user_id);
            }
        });
        users = new_approver_user_ids;
    } else if (deal_type === "pickupAtRuntime") {
        // 13.***********审批时指定***********
        next_step_users = new Array;
        _trace = _.find(instance.traces, function (_tr) {
            return _tr.is_finished === false;
        });
        _approve = _.find(_trace.approves, function (_app) {
            return _app.is_finished === false && _app.type !== 'cc';
        });
        if (_approve.next_steps) {
            if (_approve.next_steps[0]["users"]) {
                next_step_users = _approve.next_steps[0]["users"];
            }
        }
        users = next_step_users;
    } else if (deal_type === "applicantSuperior") {
        // 14.***********申请人上级主管***********
        applicantSuperiors = new Array;
        _space_user = db.space_users.findOne({
            space: space_id,
            user: instance.applicant
        }, {
            fields: {
                manager: 1
            }
        });
        if (_space_user.manager) {
            applicantSuperiors.push(_space_user.manager);
        }
        users = applicantSuperiors;
    }

    // cacluateNextStepUsers
    if (serviceWorkflow) {
        excuteTriggers(login_user_id, flow_id, instance_id, current_step, users);
    }
    return users;
};

excuteTriggers = function (userId, flowId, insId, nextStep, nextUserIds) {
    return Meteor.wrapAsync(function (userId, flowId, insId, nextStep, nextUserIds, cb) {
        return serviceWorkflow.settings.excuteTriggers({
            when: 'cacluateNextStepUsers',
            userId: userId,
            flowId: flowId,
            insId: insId,
            nextStep: nextStep,
            nextUserIds: nextUserIds
        }).then(function (resolve, reject) {
            return cb(reject, resolve);
        });
    })(userId, flowId, insId, nextStep, nextUserIds);
};
