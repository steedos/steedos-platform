ApproveManager = {};

ApproveManager.error = {
    nextSteps: '',
    nextStepUsers: ''
}

ApproveManager.isReadOnly = function() {
    var ins = WorkflowManager.getInstance();

    if (InstanceManager.isCC(ins)) {
        return true;
    }

    if (Session.get("instancePrint")) {
        return true;
    }

    if (!ins)
        return true;
    // 系统启动时，可能flow还没获取到。
    var flow = db.flows.findOne(ins.flow);
    if (!flow)
        return true;

    if (ins.state != 'completed' && ((Session.get("box") == "draft" && flow.state == "enabled") || Session.get("box") == "inbox"))
        return false;
    else
        return true;
}

var isSkipStep = function(instance, step){
    return _.contains(instance.skip_steps, step._id)
}

ApproveManager.getNextSteps = function(instance, currentStep, judge, autoFormDoc, fields, showSkipStep) {
    ApproveManager.error.nextSteps = '';
    if (!currentStep)
        return;

    if (!instance) {
        return [];
    }

    var nextSteps = new Array();
    var lines = currentStep.lines;

    switch (currentStep.step_type) {
        case 'condition': //条件
            nextSteps = Form_formula.getNextStepsFromCondition(currentStep, autoFormDoc, fields);
            if (!nextSteps.length)
                ApproveManager.error.nextSteps = '未能根据条件找到下一步';
            break;
        case 'end': //结束
            return nextSteps;
        case 'sign': //审批
            if (judge == 'approved') { //核准
                lines.forEach(function(line) {
                    if (line.state == "approved") {
                        nextSteps.push(WorkflowManager.getInstanceStep(line.to_step));
                    }
                })
            } else if (judge == "rejected") { //驳回
                lines.forEach(function(line) {
                    if (line.state == "rejected") {
                        var rejected_step = WorkflowManager.getInstanceStep(line.to_step);
                        // 驳回时去除掉条件节点
                        if (rejected_step && rejected_step.step_type != "condition")
                            nextSteps.push(rejected_step);
                    }
                })

                var traces = instance.traces;

                traces.forEach(function(trace) {
                    if (trace.is_finished == true) {
                        var finished_step = WorkflowManager.getInstanceStep(trace.step);
                        if (finished_step.step_type != 'condition' && currentStep.id != finished_step.id)
                            nextSteps.push(finished_step);
                    }
                });


                //驳回时支持结束步骤
                var flow_steps = WorkflowManager.getInstanceSteps();
                var end_step = flow_steps.findPropertyByPK("step_type", "end");

                nextSteps.push(end_step);

            }
            break;
        default: //start：开始、submit：填写、counterSign：会签
            if (currentStep.step_type === 'counterSign' && currentStep.oneClickRejection && judge === "rejected" && Meteor.settings && Meteor.settings.public && Meteor.settings.public.is_group_company){
                lines.forEach(function(line) {
                    if (line.state == "rejected") {
                        var rejected_step = WorkflowManager.getInstanceStep(line.to_step);
                        // 驳回时去除掉条件节点
                        if (rejected_step && rejected_step.step_type != "condition")
                            nextSteps.push(rejected_step);
                    }
                })

                var traces = instance.traces;

                traces.forEach(function(trace) {
                    if (trace.is_finished == true) {
                        var finished_step = WorkflowManager.getInstanceStep(trace.step);
                        if (finished_step.step_type != 'condition' && currentStep.id != finished_step.id)
                            nextSteps.push(finished_step);
                    }
                });


                //驳回时支持结束步骤
                var flow_steps = WorkflowManager.getInstanceSteps();
                var end_step = flow_steps.findPropertyByPK("step_type", "end");

                nextSteps.push(end_step);
            } else {
                lines.forEach(function(line) {
                    if (line.state == "submitted") {
                        var submitted_step = WorkflowManager.getInstanceStep(line.to_step);
                        if (submitted_step)
                            nextSteps.push(submitted_step);
                    }
                });
            }

            break;
    }

    //去除重复
    nextSteps = nextSteps.uniqById();

    // 按照步骤名称排序(升序)
    // nextSteps.sort(function(p1, p2) {
    //     return p1.name.localeCompare(p2.name);
    // });

    var condition_next_steps = new Array();
    nextSteps.forEach(function(nextStep) {
        if (nextStep.step_type == "condition") {
            condition_next_steps = condition_next_steps.concat(ApproveManager.getNextSteps(instance, nextStep, judge, autoFormDoc, fields));
        }
    })

    nextSteps = nextSteps.concat(condition_next_steps);

    var rev_nextSteps = new Array();

    nextSteps.forEach(function(nextStep) {
        if (nextStep.step_type != "condition"){
            if(!showSkipStep && isSkipStep(instance, nextStep)){
				rev_nextSteps = rev_nextSteps.concat(ApproveManager.getNextSteps(instance, nextStep, judge, autoFormDoc, fields))
            }else{
				rev_nextSteps.push(nextStep);
            }

        }

    });

    //去除重复
    rev_nextSteps = rev_nextSteps.uniqById();

    // 会签节点，如果下一步有多个 则清空下一步
    if (currentStep.step_type == "counterSign" && rev_nextSteps.length > 1 && !currentStep.oneClickRejection) {
        rev_nextSteps = [];
    }
    return rev_nextSteps;
};

ApproveManager.getStepApproveUsers = function(instance, nextStepId){

	var nextStepUsers = new Array();

	var nextStep = WorkflowManager.getInstanceStep(nextStepId);

	if (!nextStep)
		return;

	var applicantId = InstanceManager.getApplicantUserId();


	switch (nextStep.step_type) {
		case 'condition':
			break;
		case 'start': //下一步步骤类型为开始
			var applicant = WorkflowManager.getUser(applicantId);
			nextStepUsers.push(applicant);
			break;
		default:
			nextStepUsers = [];
			if (_.isEmpty(nextStepUsers)) {
				switch (nextStep.deal_type) {
					case 'pickupAtRuntime': //审批时指定人员
						nextStepUsers = [];
						break;
					case 'specifyUser': //指定人员
						var specifyUserIds = nextStep.approver_users;
						var data = {
							'specifyUserIds': specifyUserIds
						};
						nextStepUsers = UUflow_api.caculate_nextstep_users('specifyUser', Session.get('spaceId'), data);
						break;
					case 'applicantRole': //指定审批岗位
						var approveRoleIds = nextStep.approver_roles;
						var data = {
							'applicantId': applicantId,
							'approveRoleIds': approveRoleIds
						};
						nextStepUsers = UUflow_api.caculate_nextstep_users('applicantRole', Session.get('spaceId'), data);
						if (!nextStepUsers.length) {
							console.error('not find step', nextStepId, nextStepUsers);
						}
						break;
					case 'hrRole': //指定角色
						var approveHrRoleIds = nextStep.approver_hr_roles;
						var data = {
							'approveHrRoleIds': approveHrRoleIds
						};
						nextStepUsers = UUflow_api.caculate_nextstep_users('hrRole', Session.get('spaceId'), data);
						if (!nextStepUsers.length) {
							console.error('not find step approve users', nextStepId, nextStepUsers);
						}
						break;
					case 'applicantSuperior': //申请人上级
						var data = {
							'applicantId': applicantId
						};
						nextStepUsers = UUflow_api.caculate_nextstep_users('applicantSuperior', Session.get('spaceId'), data);
						if (!nextStepUsers || nextStepUsers.length == 0) {
							console.error(TAPi18n.__('next_step_users_not_found.aplicant_superior'));
						}
						break;
					case 'applicant': //申请人
						var data = {
							'applicantId': applicantId
						};
						nextStepUsers = UUflow_api.caculate_nextstep_users('applicant', Session.get('spaceId'), data);
						break;
					case 'userField': //指定人员字段
						var userFieldId = nextStep.approver_user_field;
						var userField = InstanceManager.getFormField(userFieldId);
						if (userField) {
							var userFieldValue = InstanceManager.getFormFieldValue(userField.code);
							if (userFieldValue) {

								var data = {
									'userField': userField,
									'userFieldValue': userFieldValue
								};
								nextStepUsers = UUflow_api.caculate_nextstep_users('userField', Session.get('spaceId'), data);
							}
						}
						if (!nextStepUsers.length) {
							console.error("步骤: " + nextStep.name + "fieldId is " + userFieldId);
						}
						break;
					case 'orgField': //指定部门字段
						var orgFieldId = nextStep.approver_org_field;
						var orgField = InstanceManager.getFormField(orgFieldId);
						var orgs = new Array();

						if (orgField) {
							var orgFieldValue = InstanceManager.getFormFieldValue(orgField.code);
							var orgChildrens = new Array();
							//获得orgFieldValue的所有子部门
							if (orgFieldValue) {
								var data = {
									'orgField': orgField,
									'orgFieldValue': orgFieldValue
								};

							}

							if (orgFieldValue) {
								var data = {
									'orgField': orgField,
									'orgFieldValue': orgFieldValue
								};
								caculateNextstepUsers = UUflow_api.caculateNextstepUsers('orgField', Session.get('spaceId'), data)

								nextStepUsers = caculateNextstepUsers.nextStepUsers
                                if(caculateNextstepUsers.error){
									console.error('caculateNextstepUsers.error', caculateNextstepUsers.error);
                                }
							}
						}
						if (!nextStepUsers.length) {
							if (!orgs.length) {
								console.error(t('next_step_users_not_found.field_value_empty'));
							} else {
								console.error(t('next_step_users_not_found.org_no_members', orgField.code));
							}
						}
						break;
					case 'specifyOrg': //指定部门
						var specifyOrgIds = nextStep.approver_orgs;
						var data = {
							'specifyOrgIds': specifyOrgIds
						};
						nextStepUsers = UUflow_api.caculate_nextstep_users('specifyOrg', Session.get('spaceId'), data);

						if (!nextStepUsers.length) {
							var specifyOrgs = WorkflowManager.getOrganizations(specifyOrgIds);
							var specifyOrgChildrens = WorkflowManager.getOrganizationsChildrens(instance.space, specifyOrgIds);
							console.error(TAPi18n.__('next_step_users_not_found.org_no_members', {
								step_name: nextStep.name,
								org_name: specifyOrgs.concat(specifyOrgChildrens).getProperty('fullname').toString()
							}));
						}
						break;
					case 'userFieldRole': //指定人员字段相关审批岗位
						var approverRoleIds = nextStep.approver_roles;
						var userFieldId = nextStep.approver_user_field;
						var userField = InstanceManager.getFormField(userFieldId);
						var userFieldValue;
						if (userField) {
							userFieldValue = InstanceManager.getFormFieldValue(userField.code);
							if (userFieldValue) {
								var data = {
									'userField': userField,
									'userFieldValue': userFieldValue,
									'approverRoleIds': approverRoleIds

								};
							}

							if (userFieldValue) {
								var data = {
									'userField': userField,
									'userFieldValue': userFieldValue,
									'approverRoleIds': approverRoleIds
								};
								caculateNextstepUsers = UUflow_api.caculateNextstepUsers('userFieldRole', Session.get('spaceId'), data);

								nextStepUsers = caculateNextstepUsers.nextStepUsers

								if(caculateNextstepUsers.error){
								    console.error('caculateNextstepUsers.error', caculateNextstepUsers.error);
                                }
							}
						}
						if (!nextStepUsers.length) {

							if (!userFieldValue) {
								console.error('"' + userField.code + '"字段没有值');
							} else {
								var approverRoles = WorkflowManager.getRoles(approverRoleIds);
								console.error('"' + approverRoles.getProperty("name").toString() + '"审批岗位未指定审批人');
							}
						}
						break;
					case 'orgFieldRole': //指定部门字段相关审批岗位
						var approverRoleIds = nextStep.approver_roles;
						var orgFieldId = nextStep.approver_org_field;
						var orgField = InstanceManager.getFormField(orgFieldId);
						var orgFieldValue;
						if (orgField) {
							orgFieldValue = InstanceManager.getFormFieldValue(orgField.code);
							if (orgFieldValue) {
								var data = {
									'orgField': orgField,
									'orgFieldValue': orgFieldValue,
									'approverRoleIds': approverRoleIds

								};

							}

							if (orgFieldValue) {
								var data = {
									'orgField': orgField,
									'orgFieldValue': orgFieldValue,
									'approverRoleIds': approverRoleIds
								};
								caculateNextstepUsers = UUflow_api.caculateNextstepUsers('orgFieldRole', Session.get('spaceId'), data);

								nextStepUsers = caculateNextstepUsers.nextStepUsers
                                if(caculateNextstepUsers.error){
								    console.error('caculateNextstepUsers.error', caculateNextstepUsers.error);
                                }

							}
						}
						if (nextStepUsers < 1) {
							if (!orgFieldValue) {
								console.error('"' + orgField.code + '"字段没有值');
							} else {
								var approverRoles = WorkflowManager.getRoles(approverRoleIds);
								console.error('"' + approverRoles.getProperty("name").toString() + '"审批岗位未指定审批人');
							}
						}
						break;
					default:
						break;
				}
			}

			break;
	}

	nextStepUsers = nextStepUsers.uniqById();

	//按照步骤名称排序(升序)
	nextStepUsers.sort(function(p1, p2) {
		return p1.name.localeCompare(p2.name);
	});

	return nextStepUsers;
};

ApproveManager.getNextStepUsers = function(instance, nextStepId) {

    console.log("ApproveManager.getNextStepUsers run...")

    ApproveManager.error.nextStepUsers = '';
    ApproveManager.error.type = '';
    ApproveManager.error.code = '';
    InstanceManager._setError_next_step_users("")
    var nextStepUsers = new Array();

    var nextStep = WorkflowManager.getInstanceStep(nextStepId);

    if (!nextStep)
        return;

    if(instance.step_approve && instance.step_approve[nextStepId]){
		Session.set("next_step_users_showOrg", false); //如果有指定处理人,则不能选择其他人
        return WorkflowManager.getUsers(instance.step_approve[nextStepId])
    }

    var applicantId = InstanceManager.getApplicantUserId();

    Session.set("next_step_users_showOrg", false);
    var error_obj = {
        deal_type: "",
        step_name: nextStep.name,
        params: {}
    };
    switch (nextStep.step_type) {
        case 'condition':
            break;
        case 'start': //下一步步骤类型为开始
            var applicant = WorkflowManager.getUser(applicantId);
            nextStepUsers.push(applicant);
            break;
        default:
            // 判断当前步骤类型是会签并且下一步是否已在申请单历史步骤中，如果在，则下一步骤处理人为历史步骤处理人
            // nextStepUsers = this.checkAndSetCounterSignNextStepUsers(nextStep._id);
            nextStepUsers = [];
            if (_.isEmpty(nextStepUsers)) {
                switch (nextStep.deal_type) {
                    case 'pickupAtRuntime': //审批时指定人员
                        Session.set("next_step_users_showOrg", true);
                        var currentApprove = InstanceManager.getCurrentApprove();
                        if (!currentApprove) break;
                        var current_next_steps = currentApprove.next_steps;
                        var userIds = current_next_steps && current_next_steps[0] ? current_next_steps[0].users : [];
                        if (!_.isEmpty(userIds)) {
                            nextStepUsers = WorkflowManager.getUsers(userIds);
                        }
                        break;
                    case 'specifyUser': //指定人员
                        var specifyUserIds = nextStep.approver_users;
                        var data = {
                            'specifyUserIds': specifyUserIds
                        };
                        nextStepUsers = UUflow_api.caculate_nextstep_users('specifyUser', Session.get('spaceId'), data);
                        break;
                    case 'applicantRole': //指定审批岗位
                        var approveRoleIds = nextStep.approver_roles;
                        var data = {
                            'applicantId': applicantId,
                            'approveRoleIds': approveRoleIds
                        };
                        nextStepUsers = UUflow_api.caculate_nextstep_users('applicantRole', Session.get('spaceId'), data);
                        if (!nextStepUsers.length) {
                            // error_obj.deal_type = nextStep.deal_type;
                            // error_obj.params = {
                            //     approver_roles: approveRoleIds
                            // };
                            var roles = WorkflowManager.remoteFlowRoles.find({
                                _id: {
                                    $in: approveRoleIds
                                }
                            }, {
                                fields: {
                                    name: 1
                                }
                            });
                            var roles_name = _.pluck(roles, 'name').toString();
                            ApproveManager.error.nextStepUsers = TAPi18n.__('next_step_users_not_found.applicant_role', {
                                step_name: nextStep.name,
                                role_name: roles_name
                            });
                        }
                        break;
					case 'hrRole': //指定角色
						var approveHrRoleIds = nextStep.approver_hr_roles;
						var data = {
							'approveHrRoleIds': approveHrRoleIds
						};
						nextStepUsers = UUflow_api.caculate_nextstep_users('hrRole', Session.get('spaceId'), data);
						if (!nextStepUsers.length) {
							var roles = WorkflowManager.remoteHrRoles.find({
								_id: {
									$in: approveHrRoleIds
								}
							}, {
								fields: {
									name: 1
								}
							});
							var hr_roles_name = _.pluck(roles, 'name').toString();
							ApproveManager.error.nextStepUsers = TAPi18n.__('next_step_users_not_found.hr_role', {
								step_name: nextStep.name,
								role_name: hr_roles_name
							});
						}
						break;
                    case 'applicantSuperior': //申请人上级
                        var data = {
                            'applicantId': applicantId
                        };
                        nextStepUsers = UUflow_api.caculate_nextstep_users('applicantSuperior', Session.get('spaceId'), data);
                        if (!nextStepUsers || nextStepUsers.length == 0) {
                            ApproveManager.error.nextStepUsers = TAPi18n.__('next_step_users_not_found.aplicant_superior');
                        }
                        break;
                    case 'applicant': //申请人
                        var data = {
                            'applicantId': applicantId
                        };
                        nextStepUsers = UUflow_api.caculate_nextstep_users('applicant', Session.get('spaceId'), data);
                        break;
                    case 'userField': //指定人员字段
                        var userFieldId = nextStep.approver_user_field;
                        var userField = InstanceManager.getFormField(userFieldId);
                        if (userField) {
                            var userFieldValue = InstanceManager.getFormFieldValue(userField.code);
                            if (userFieldValue) {

                                console.log("if ....")

                                var data = {
                                    'userField': userField,
                                    'userFieldValue': userFieldValue
                                };
                                nextStepUsers = UUflow_api.caculate_nextstep_users('userField', Session.get('spaceId'), data);
                            }
                            // else {
                            // console.log("else ....")
                            //     var fieldValue = instance.values[userField.code];
                            //     var user_field_value;
                            //     if (fieldValue instanceof Array) {
                            //         user_field_value = _.pluck(fieldValue, "id");
                            //     } else if (fieldValue instanceof Object) {
                            //         user_field_value = fieldValue.id;
                            //     }
                            //
                            //     if (user_field_value) {
                            //         var data = {
                            //             'userField': userField,
                            //             'userFieldValue': user_field_value
                            //         };
                            //         nextStepUsers = UUflow_api.caculate_nextstep_users('userField', Session.get('spaceId'), data);
                            //     }
                            //
                            // }
                        }
                        if (!nextStepUsers.length) {
                            //todo 记录记录未找到的原因，用于前台显示
                            ApproveManager.error.nextStepUsers = '"' + userField.code + '"字段没有值';
                            console.error("步骤: " + nextStep.name + "fieldId is " + userFieldId);
                        }
                        break;
                    case 'orgField': //指定部门字段
                        var orgFieldId = nextStep.approver_org_field;
                        var orgField = InstanceManager.getFormField(orgFieldId);
                        var orgs = new Array();

                        if (orgField) {
                            var orgFieldValue = InstanceManager.getFormFieldValue(orgField.code);
                            var orgChildrens = new Array();
                            //获得orgFieldValue的所有子部门
                            if (orgFieldValue) {
                                var data = {
                                    'orgField': orgField,
                                    'orgFieldValue': orgFieldValue
                                };

                            }
                            // else {
                            //     var fieldValue = instance.values[orgField.code];
                            //     if (fieldValue instanceof Array) {
                            //  orgFieldValue = _.pluck(fieldValue, "id");
                            //     } else if (fieldValue instanceof Object) {
                            //  orgFieldValue = fieldValue.id;
                            //     }
                            // }

                            if (orgFieldValue) {
                                var data = {
                                    'orgField': orgField,
                                    'orgFieldValue': orgFieldValue
                                };
                                caculateNextstepUsers = UUflow_api.caculateNextstepUsers('orgField', Session.get('spaceId'), data)

                                nextStepUsers = caculateNextstepUsers.nextStepUsers

                                ApproveManager.error.code = caculateNextstepUsers.error
                            }
                        }
                        if (!nextStepUsers.length) {
                            if (!orgs.length) {
                                ApproveManager.error.nextStepUsers = t('next_step_users_not_found.field_value_empty');
                            } else {
                                ApproveManager.error.nextStepUsers = t('next_step_users_not_found.org_no_members', orgField.code);
                            }
                        }
                        break;
                    case 'specifyOrg': //指定部门
                        var specifyOrgIds = nextStep.approver_orgs;
                        var data = {
                            'specifyOrgIds': specifyOrgIds
                        };
                        nextStepUsers = UUflow_api.caculate_nextstep_users('specifyOrg', Session.get('spaceId'), data);

                        if (!nextStepUsers.length) {
                            var specifyOrgs = WorkflowManager.getOrganizations(specifyOrgIds);
                            var specifyOrgChildrens = WorkflowManager.getOrganizationsChildrens(instance.space, specifyOrgIds);
                            ApproveManager.error.nextStepUsers = TAPi18n.__('next_step_users_not_found.org_no_members', {
                                step_name: nextStep.name,
                                org_name: specifyOrgs.concat(specifyOrgChildrens).getProperty('fullname').toString()
                            });
                            //ApproveManager.error.nextStepUsers =  '「' + specifyOrgs.concat(specifyOrgChildrens).getProperty('fullname').toString() + '」部门中没有人员';
                        }
                        break;
                    case 'userFieldRole': //指定人员字段相关审批岗位
                        var approverRoleIds = nextStep.approver_roles;
                        var userFieldId = nextStep.approver_user_field;
                        var userField = InstanceManager.getFormField(userFieldId);
                        var userFieldValue;
                        if (userField) {
                            userFieldValue = InstanceManager.getFormFieldValue(userField.code);
                            if (userFieldValue) {
                                var data = {
                                    'userField': userField,
                                    'userFieldValue': userFieldValue,
                                    'approverRoleIds': approverRoleIds

                                };
                            }
                            // else {
                            //     var fieldValue = instance.values[userField.code];
                            //     var user_field_value;
                            //     if (fieldValue instanceof Array) {
                            //  userFieldValue = _.pluck(fieldValue, "id");
                            //     } else if (fieldValue instanceof Object) {
                            //  userFieldValue = fieldValue.id;
                            //     }
                            // }

                            if (userFieldValue) {
                                var data = {
                                    'userField': userField,
                                    'userFieldValue': userFieldValue,
                                    'approverRoleIds': approverRoleIds
                                };
                                caculateNextstepUsers = UUflow_api.caculateNextstepUsers('userFieldRole', Session.get('spaceId'), data);

                                nextStepUsers = caculateNextstepUsers.nextStepUsers

                                ApproveManager.error.code = caculateNextstepUsers.error
                            }
                        }
                        if (!nextStepUsers.length) {

                            if (!userFieldValue) {
                                ApproveManager.error.nextStepUsers = '"' + userField.code + '"字段没有值';
                            } else {
                                var approverRoles = WorkflowManager.getRoles(approverRoleIds);
                                ApproveManager.error.nextStepUsers = '"' + approverRoles.getProperty("name").toString() + '"审批岗位未指定审批人';
                            }
                        }
                        break;
                    case 'orgFieldRole': //指定部门字段相关审批岗位
                        var approverRoleIds = nextStep.approver_roles;
                        var orgFieldId = nextStep.approver_org_field;
                        var orgField = InstanceManager.getFormField(orgFieldId);
                        var orgFieldValue;
                        if (orgField) {
                            orgFieldValue = InstanceManager.getFormFieldValue(orgField.code);
                            if (orgFieldValue) {
                                var data = {
                                    'orgField': orgField,
                                    'orgFieldValue': orgFieldValue,
                                    'approverRoleIds': approverRoleIds

                                };

                            }
                            // else {
                            //     var fieldValue = instance.values[orgField.code];
                            //     var org_field_value;
                            //     if (fieldValue instanceof Array) {
                            //  orgFieldValue = _.pluck(fieldValue, "id");
                            //     } else if (fieldValue instanceof Object) {
                            //  orgFieldValue = fieldValue.id;
                            //     }
                            // }

                            if (orgFieldValue) {
                                var data = {
                                    'orgField': orgField,
                                    'orgFieldValue': orgFieldValue,
                                    'approverRoleIds': approverRoleIds
                                };
                                caculateNextstepUsers = UUflow_api.caculateNextstepUsers('orgFieldRole', Session.get('spaceId'), data);

                                nextStepUsers = caculateNextstepUsers.nextStepUsers

                                ApproveManager.error.code = caculateNextstepUsers.error
                            }
                        }
                        if (nextStepUsers < 1) {
                            if (!orgFieldValue) {
                                ApproveManager.error.nextStepUsers = '"' + orgField.code + '"字段没有值';
                            } else {
                                var approverRoles = WorkflowManager.getRoles(approverRoleIds);
                                ApproveManager.error.nextStepUsers = '"' + approverRoles.getProperty("name").toString() + '"审批岗位未指定审批人';
                            }
                        }
                        break;
                    default:
                        break;
                }
            }

            break;
    }

    nextStepUsers = nextStepUsers.uniqById();

    //按照步骤名称排序(升序)
    nextStepUsers.sort(function(p1, p2) {
        return p1.name.localeCompare(p2.name);
    });

    // if (error_obj.deal_type) {
    //     Meteor.call('next_step_users_not_found', error_obj.deal_type, error_obj.step_name, error_obj.params, function(error, result) {
    //         if (result) {
    //             ApproveManager.error.nextStepUsers = result;
    //      ApproveManager.error.type = error_obj.deal_type;
    //         }
    //     })
    // }
    if (ApproveManager.error.nextStepUsers) {
        ApproveManager.error.type = nextStep.deal_type;
    }

    InstanceManager.handleErrorMessage();

    return nextStepUsers;
};

// ApproveManager.updateNextStepOptions = function(steps, judge){
//     console.log("updateNextStepOptions");
//     var lastSelected = ApproveManager.getNextStepsSelectValue();

//     $("#nextSteps").empty();

//     $("#nextSteps").select2().val(null).trigger("change");

//     if(!steps)
//         return;

//     steps.forEach(function(step){
//         $("#nextSteps").append("<option value='" + step.id + "'> " + step.name + " </option>");
//     });

//     if(steps.length > 1)
//         $("#nextSteps").prepend("<option value='-1'> 请选择 </option>");

//     $("#nextSteps").select2().val();

//     ApproveManager.setNextStepsSelectValue(steps, lastSelected);
// };

ApproveManager.getNextStepsSelectValue = function() {
    return $("[name=instance_suggestion_next_step]:checked").val();
}

// ApproveManager.setNextStepsSelectValue = function(steps, value){
//     console.log("setNextStepsSelectValue");
//     var lastStep = steps.filterProperty("_id", value);

//     if(lastStep.length > 0){
//         console.log("lastStep.length > 0");
//         $("#nextSteps").select2().val(value).trigger("change");
//     } else if(steps.length > 0){
//         console.log("steps.length > 0");
//         $("#nextSteps").select2().val(steps[0]._id).trigger("change");
//     }
// }

ApproveManager.getNextStepUsersSelectValue = function() {
    //return $("#nextStepUsers").val();
    var values = $("input[name='nextStepUsers']")[0].dataset.values;
    return values ? values.split(",") : [];
}

// ApproveManager.setNextStepUsersSelectValue = function(value){
//     console.log("setNextStepUsersSelectValue:");
//     console.log(value);
//     var n = [];
//     if(value && value.length > 0){
//         n = value;
//     } else {
//         console.log("setNextStepUsersSelectValue value is []");
//         var c = InstanceManager.getCurrentApprove();
//         if (c && c.next_steps && c.next_steps[0] && c.next_steps[0].users) {
//             n = c.next_steps[0].users;
//         }
//     }
//     if (n.length == 1) {
//         $("#nextStepUsers").select2().val(n[0]).trigger("change");
//     } else if (n.length > 1) {
//         $("#nextStepUsers").select2().val(n).trigger("change");
//     } else {
//         $("#nextStepUsers").select2().val(null).trigger("change");
//     }

//     $("#nextStepUsers").select2().val();
// }

// ApproveManager.updateNextStepUsersOptions = function(nextStep, users){
//     console.log("updateNextStepUsersOptions");
//     var lastSelected = new Array();
//     var selectedNextStepUsers = ApproveManager.getNextStepUsersSelectValue();

//     if(selectedNextStepUsers instanceof Array){
//         selectedNextStepUsers.forEach(function(su){
//           lastSelected.push(su.value);
//         });
//     }else{
//         if (selectedNextStepUsers) {
//             lastSelected.push(selectedNextStepUsers);
//         }
//     }
//     $("#nextStepUsers").empty();
//     $("#nextStepUsers").select2().val(null).trigger("change");
//     if(!users)
//         return;

//     if(nextStep.step_type == 'end'){
//         $("#nextStepUsers_div").hide();
//         return ;
//     }else{
//         $("#nextStepUsers_div").show();
//     }

//     if(nextStep.step_type == 'counterSign'){
//         $("#nextStepUsers").prop('multiple','multiple');
//         $("#nextStepUsers").select2();
//     }else{
//         $("#nextStepUsers").removeAttr('multiple');
//         $("#nextStepUsers").select2();
//     }

//     users.forEach(function(user){
//         $("#nextStepUsers").append("<option value='" + user.id + "'> " + user.name + " </option>");
//     });

//     /*
//     var u_ops = $("#nextStepUsers option").toArray();


//     u_ops.forEach(function(u_op){
//         if (lastSelected.includes(u_op.value))
//             u_op.selected = true;
//     });
//     */

//     if(users.length > 1 ){
//         $("#nextStepUsers").prepend("<option value='-1'> 请选择 </option>");
//     }

//     ApproveManager.setNextStepUsersSelectValue(lastSelected);

// }

ApproveManager.checkAndSetCounterSignNextStepUsers = function(nextStepId) {
    var nextStepUsers = new Array();
    var currentStep = InstanceManager.getCurrentStep();
    if (currentStep && currentStep.step_type == "counterSign") {
        var ins = WorkflowManager.getInstance();
        // var his_trace = _.find(ins.traces, function(t) {
        //     return t.is_finished == true && t.step == nextStepId;
        // });
        // if (his_trace) {
        //     nextStepUsers = WorkflowManager.getUsers([his_trace.approves[0].user]);
        // }

        var lastStepHandlers = TracesManager.getStepLastHandlers(nextStepId, ins)

        nextStepUsers = WorkflowManager.getUsers(lastStepHandlers);
    }

    return nextStepUsers;
}


ApproveManager.getRelatedInstancesFromDescription = function(description) {
    var instanceIds = new Array();

    if (description) {

        var foo1 = description.split(")");

        foo1.forEach(function(f) {

            foo2 = f.indexOf(Meteor.absoluteUrl("workflow/space/"));

            if (foo2 > -1) {

                foo3 = f.substring(foo2, f.length);

                foo4 = foo3.split("/view/readonly/");

                if (foo4.length == 2) {

                    instanceIds.push(foo4[1])

                }
            }
        })
    }
    return instanceIds
}