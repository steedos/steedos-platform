InstanceManager = {};

InstanceManager.runFormula = function(fieldCode) {
	var form_version = WorkflowManager.getInstanceFormVersion();
	var formula_fields = []
	if (form_version)
		formula_fields = Form_formula.getFormulaFieldVariable("Form_formula.field_values", form_version.fields);

	Form_formula.run(fieldCode, "", formula_fields, AutoForm.getFormValues("instanceform").insertDoc, form_version.fields);

	Session.set("instance_form_values", {
		instanceId: Session.get("instanceId"),
		values: AutoForm.getFormValues("instanceform").insertDoc
	});
}

InstanceManager.isTableStyle = function(formId) {

	if (Steedos.isMobile()) {
		return false;
	}

	form = WorkflowManager.getForm(formId);
	if (form && form.instance_style == 'table')
		return true
	return false;
}

InstanceManager.getFormField = function(fieldId) {
	var instanceFields = WorkflowManager.getInstanceFields();
	var field = instanceFields.filterProperty("id", fieldId);

	if (field.length > 0) {
		return field[0];
	}

	return null;
}

/**
 * 计算下一步步骤
 * @returns {Array}
 */
InstanceManager.getNextStepOptions = function() {

	if (ApproveManager.isReadOnly())
		return []

	var instance = WorkflowManager.getInstance();
	var currentApprove = InstanceManager.getCurrentApprove();
	var current_next_steps;
	if (currentApprove) {
		current_next_steps = currentApprove.next_steps;
	}
	var judge = Session.get("judge");
	var currentStep = InstanceManager.getCurrentStep();

	var form_version = WorkflowManager.getInstanceFormVersion();
	// 待办：获取表单值
	var autoFormDoc = {};
	if (AutoForm.getFormValues("instanceform")) {
		autoFormDoc = AutoForm.getFormValues("instanceform").insertDoc;
	} else if (Session.get("instance_form_values")) {
		autoFormDoc = Session.get("instance_form_values").values
	}

	var nextSteps = ApproveManager.getNextSteps(instance, currentStep, judge, autoFormDoc, form_version.fields);

	var getSessionStepId = function () {
		return Session.get("next_step_id");
	}

	var current_session_step_id = Tracker.nonreactive(getSessionStepId);

	var next_step_options = []
	if (nextSteps && nextSteps.length > 0) {
		var next_step_id = current_session_step_id;
		var next_step_type = null;
		nextSteps.forEach(function(step) {
			var option = {
				id: step.id,
				text: step.name,
				type: step.step_type
			}
			next_step_options.push(option)
		});

		var current_session_step = _.find(next_step_options, function (step_item) {
			return step_item.id === current_session_step_id;
		});

		var isValidSessionStepId = _.isEmpty(current_session_step)? false: true;
		// 默认选中第一个
		if (next_step_options.length == 1) {
			next_step_options[0].selected = 'selected'
			next_step_id = next_step_options[0].id
			Session.set("next_step_id", next_step_id);
		} else {

			if (Session.get("judge") == 'rejected' && !isValidSessionStepId) {
				start_option = next_step_options.findPropertyByPK("type", "start");
				next_step_id = start_option.id
				Session.set("next_step_id", next_step_id);
			} else {
				//Session存储的下一步步骤是否在计算结果中，如果在，则选中
				var checkedNextStepRadio = $("[name=instance_suggestion_next_step]:checked");
				var session_next_step;
				if (checkedNextStepRadio && checkedNextStepRadio.val()) {
					session_next_step = next_step_options.findPropertyByPK("id", checkedNextStepRadio.val())
				}

				if (_.isObject(session_next_step)) {
					next_step_id = checkedNextStepRadio.val();
				}else if (current_next_steps && current_next_steps.length > 0) {
					//选中已暂存的值
					var db_next_step = next_step_options.findPropertyByPK("id", current_next_steps[0].step)
					if (_.isObject(db_next_step)) {
						next_step_id = db_next_step.id
						Session.set("next_step_id", next_step_id);
					}
				} else if (Session.get("judge") != 'rejected' && !isValidSessionStepId) {
					// next_step_options.unshift({
					// 	id: '',
					// 	selected: 'selected',
					// 	text: TAPi18n.__("Select placeholder"),
					// 	disabled: 'disabled'
					// });
					// 默认选中当前步骤的lines数组中第一个line的to_step
					next_step_id = currentStep.lines[0].to_step;
					Session.set("next_step_id", next_step_id);
				}
			}


		}

		// Session.set("next_step_id", next_step_id);

		next_step_options.forEach(function(option) {
			if (option.id == next_step_id) {
				option.selected = 'selected'
				next_step_type = option.type
			}
		});

		//触发select重新加载
		Session.set("next_step_multiple", false)
		if (next_step_id) {
			if (next_step_type == 'counterSign')
				Session.set("next_user_multiple", true)
			else
				Session.set("next_user_multiple", false)
		}
	} else {
		Session.set("next_step_id", null);
	}
	return next_step_options;
}

// InstanceManager.updateNextStepTagOptions = function(){
//   var next_step_options = InstanceManager.getNextStepOptions();
//   $("#nextSteps").empty(); // 清空选项
//   next_step_options.forEach(function(next_step_option){
//     $("#nextSteps").append("<option value='" + next_step_option.id + "'>" + next_step_option.text + "</option>");
//     if(next_step_option.selected){
//       $("#nextSteps").val(next_step_option.id);
//     }
//   });
// }

InstanceManager.nextStepUsersWillUpdate = function(changeField, nextStep) {

	'use strict';

	if (!changeField || !nextStep) {
		return false;
	}

	if (changeField.name === 'applicant' && (nextStep.deal_type === 'applicant' || nextStep.deal_type === 'applicantRole' || nextStep.deal_type === 'applicantSuperior')) {
		return true;
	} else {
		if (changeField.type === 'user' && changeField._id === nextStep.approver_user_field && (nextStep.deal_type === 'userField' || nextStep.deal_type === 'userFieldRole')) {
			return true;
		} else if (changeField.type === 'group' && changeField._id === nextStep.approver_org_field && (nextStep.deal_type === 'orgField' || nextStep.deal_type === 'orgFieldRole')) {
			return true;
		} else {
			return false;
		}
	}

	return false;
};

InstanceManager.getNextUserOptions = function() {

	var next_user_options = []

	var next_step_id = Session.get("next_step_id");
	var next_user_multiple = Session.get("next_user_multiple")
	if (next_step_id) {

		var instance = WorkflowManager.getInstance();
		var currentApprove = InstanceManager.getCurrentApprove();
		if (!currentApprove) {
			return next_user_options
		}
		var current_next_steps = currentApprove.next_steps;

		var next_user_ids = [];
		var nextStepUsers = ApproveManager.getNextStepUsers(instance, next_step_id);

		var lastStepHandlers = TracesManager.getStepLastHandlers(next_step_id, instance)

		if (nextStepUsers) {
			var nextStep = WorkflowManager.getInstanceStep(next_step_id);
			if (nextStepUsers.length == 0) { //为指定处理人并且没有暂存处理人时

				if (nextStep.deal_type == "pickupAtRuntime") {
					if (nextStep.step_type != 'counterSign') { // 会签节点不默认选择处理人。 #1350
						nextStepUsers = WorkflowManager.getUsers(lastStepHandlers);
					}

				}

			}

			nextStepUsers.forEach(function(user) {
				var option = {
						id: user.id,
						name: user.name
					}
					// 有暂存的步骤
				if (current_next_steps && current_next_steps.length > 0) {
					if (current_next_steps[0].step == next_step_id && _.contains(current_next_steps[0].users, user.id)) {
						option.selected = true
						next_user_ids.push(user.id)
					}
				} else {


					// 如果有处理人
					if (nextStepUsers.length > 1) {
						// 会签节点不默认选择处理人。 #1350
						if (nextStep.step_type != 'counterSign') {
							// 设置下一步处理人默认值为最近一次处理人
							if (lastStepHandlers.includes(user.id)) {
								option.selected = true;
							}
						}

					}
				}

				next_user_options.push(option)
			});
		}
		//if ( next_user_options.length > 0){ //==1
		//    next_user_options[0].selected = true
		//    next_user_ids.push(next_user_options[0].id)
		//}
	}

	return next_user_options;
}

// InstanceManager.updateNextUserTagOptions = function(){
//   var next_user_options = InstanceManager.getNextUserOptions();
//   $("#nextStepUsers").empty(); // 清空选项
//   next_user_options.forEach(function(next_user_option){
//     $("#nextStepUsers").append("<option value='" + next_user_option.id + "' >" + next_user_option.text + "</option>");
//     if(next_user_option.selected){
//       $("#nextStepUsers").val(next_user_option.id);
//     }
//   });
// }


InstanceManager.getFormFieldByCode = function(fieldCode) {
	var instanceFields = WorkflowManager.getInstanceFields();
	var field = instanceFields.filterProperty("code", fieldCode);

	if (field.length > 0) {
		return field[0];
	}

	return null;
}

InstanceManager.getApplicantUserId = function() {
	var instance = WorkflowManager.getInstance();
	if (instance) {
		var ins_applicant = $("#ins_applicant");
		if (instance.state == 'draft' && ins_applicant && ins_applicant.length == 1 && ins_applicant[0] && ins_applicant[0].dataset.values) {
			return ins_applicant[0].dataset.values;
		} else {
			return instance.applicant;
		}
		return '';
	}
}

function showMessage(parent_group, message) {

	// if (parent_group.hasClass("has-error")) {
	// 	return;
	// }

	parent_group.addClass("has-error");
	$(".help-block", parent_group).html(message);
	if (message && message.length > 0) {
		toastr.error(message);
	}
}

function showMessageInblock(parent_group, message) {
	parent_group.addClass("has-error");
	$(".help-block", parent_group).html(message);
}

function removeMessage(parent_group) {
	// toastr.remove()
	parent_group.removeClass("has-error");
	$(".help-block", parent_group).html('');
}

InstanceManager.checkFormValue = function() {

	InstanceManager.checkNextStep();

	InstanceManager.checkNextStepUser();

	InstanceManager.checkSuggestion();

	//字段校验
	var fieldsPermision = WorkflowManager.getInstanceFieldPermission();

	for (var k in fieldsPermision) {
		if (fieldsPermision[k] == 'editable') {
			InstanceManager.checkFormFieldValue($("[name='" + k + "']")[0]);
		}
	}
}

//下一步步骤校验
InstanceManager.checkNextStep = function() {
	var nextSteps_parent_group = $("[name=instance_suggestion_next_step]").closest(".form-group");

	if (ApproveManager.error.nextSteps != '') {
		showMessage(nextSteps_parent_group, ApproveManager.error.nextSteps);
		ApproveManager.error.nextSteps = '';
		return;
	}
	var value = ApproveManager.getNextStepsSelectValue();
	if (value && value != '-1')
		removeMessage(nextSteps_parent_group);
	else
		showMessage(nextSteps_parent_group, TAPi18n.__("instance_select_next_step"));
}

InstanceManager._setError_next_step_users = function(error, error_type, error_cdoe) {
	var next_user = $("input[name='nextStepUsers']");

	if (next_user.length > 0) {
		next_user[0].dataset["error"] = error;
		next_user[0].dataset["error_type"] = error_type;
		next_user[0].dataset["error_code"] = error_cdoe;
	}
}

//下一步处理人校验
InstanceManager.handleErrorMessage = function() {

	if ($("input[name='nextStepUsers']").length < 1) {
		return;
	}

	var nextStepUsers_parent_group = $("#nextStepUsers").closest(".form-group");

	InstanceManager._setError_next_step_users("", "", "")

	if (ApproveManager.error.nextStepUsers != '') {
		// showMessage(nextStepUsers_parent_group, ApproveManager.error.nextStepUsers);
		nextStepUsers_parent_group.addClass("has-error");

		InstanceManager._setError_next_step_users(ApproveManager.error.nextStepUsers, ApproveManager.error.type, ApproveManager.error.code)

		ApproveManager.error.nextStepUsers = '';
		return;
	}
}

//下一步处理人校验
InstanceManager.checkNextStepUser = function() {

	if ($("input[name='nextStepUsers']").length < 1) {
		return;
	}

	var nextStepUsers_parent_group = $("#nextStepUsers").closest(".form-group");

	if (nextStepUsers_parent_group.length < 1) {
		return;
	}

	var value = ApproveManager.getNextStepUsersSelectValue();
	var nextStepId = ApproveManager.getNextStepsSelectValue();
	var nextStep = WorkflowManager.getInstanceStep(nextStepId);

	if (value.length > 0 || (nextStep && nextStep.step_type == 'end'))
		removeMessage(nextStepUsers_parent_group);
	else
		showMessage(nextStepUsers_parent_group, TAPi18n.__("instance_next_step_user"));
}

InstanceManager.nextStepUserErrorClass = function() {

	if ($("input[name='nextStepUsers']").length < 1) {
		return;
	}

	var nextStepUsers_parent_group = $("#nextStepUsers").closest(".form-group");

	if (nextStepUsers_parent_group.length < 1) {
		return;
	}

	var value = ApproveManager.getNextStepUsersSelectValue();
	var nextStepId = ApproveManager.getNextStepsSelectValue();
	var nextStep = WorkflowManager.getInstanceStep(nextStepId);

	if (value.length > 0 || (nextStep && nextStep.step_type == 'end'))
		removeMessage(nextStepUsers_parent_group);
	else
		showMessageInblock(nextStepUsers_parent_group, TAPi18n.__("instance_next_step_user"));
}

//如果是驳回必须填写意见
InstanceManager.checkSuggestion = function(alter) {
	var judge = $("[name='judge']").filter(':checked').val();
	var suggestion_parent_group = $("#suggestion").parent();
	if (judge && judge == 'rejected') {
		if ($("#suggestion").val())
			removeMessage(suggestion_parent_group);
		else
		if (alter == 0)
			showMessageInblock(suggestion_parent_group, TAPi18n.__("instance_reasons_reject"));
		else {
			showMessage(suggestion_parent_group, TAPi18n.__("instance_reasons_reject"));
		}
	} else {
		removeMessage(suggestion_parent_group);
	}
}

InstanceManager.checkFormFieldValue = function(field) {

	if (!field)
		return;

	var reg_email = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	var parent_group = $("#" + field.id).parent();
	var message = '';

	var jquery_f = $("[name='" + field.dataset.schemaKey + "']");

	var _form_group_div = jquery_f.closest(".form-group")

	if (parent_group.hasClass("twitter-typeahead")) {
		parent_group = parent_group.parent().parent()
	}

	if (jquery_f.attr("type") != 'table' && field.parentNode.dataset.required == "true" || ((field.type == "checkbox" || field.type == "radio") && field.parentNode.parentNode.parentNode.dataset.required == "true") || (_form_group_div.length == 1 && _form_group_div[0].dataset.required == "true")) {
		var fileValue = "";
		if (field.type == "checkbox" || field.type == "radio") {
			fileValue = $("[name='" + field.name + "']:checked").val();
		} else {
			fileValue = field.value;
		}

		if (!fileValue || fileValue == '' || fileValue.length < 1) {
			var fo = InstanceManager.getFormFieldByCode(field.name);
			var titleName = field.name
			if (fo) {
				titleName = fo.name ? fo.name : fo.code;
			}
			message = showMessage(parent_group, TAPi18n.__("instance_field") + "‘" + titleName + '’' + TAPi18n.__("instance_is_required"));
		}
	}

	if (jquery_f.attr("type") == 'table' && field.parentNode.parentNode.parentNode.parentNode.dataset.required == "true") {
		var table_value = AutoForm.getFieldValue(field.dataset.schemaKey, "instanceform");
		parent_group = jquery_f.parent().parent().parent().parent();
		if (!table_value || table_value.length < 1) {
			message = showMessage(parent_group, TAPi18n.__("instance_field") + "‘" + field.dataset.label + '’' + TAPi18n.__("instance_is_required"));
		}
	}

	if (field.type == 'email' && field.value != '') {
		if (!reg_email.test(field.value))
			message = TAPi18n.__("instance_email_format_error");
	}
	if (field.type == 'url' && field.value != '') {
		var urlV = field.value;
		if (field.value.indexOf("http") != 0) {
			urlV = "http://" + encodeURI(urlV)
		}
		var u = new URI(urlV);
		if (u.username()) {
			message = TAPi18n.__("url_invalid")
		}
	}

	if (message == '') {
		removeMessage(parent_group);
		return true;
	} else {
		showMessage(parent_group, message);
		return false;
	}
}

InstanceManager.getFormFieldValue = function(fieldCode) {
	return AutoForm.getFieldValue(fieldCode, "instanceform");
}

function adjustFieldValue(field, value) {
	if (!value && value != false) {
		return value;
	}
	var adjustFieldTypes = ['number', 'multiSelect', 'radio', 'checkbox', 'dateTime', 'user', 'group'];

	if (adjustFieldTypes.includes(field.type)) {
		switch (field.type) {
			case 'number':
				value = value.toString();
				break;
			case 'multiSelect':
				value = value.toString();
				break;
			case 'radio':
				value = value.toString();
				break;
			case 'checkbox':
				value = value.toString();
				break;
			case 'dateTime':
				value = value; //$.format.date(value,"yyyy-MM-ddTHH:mm'Z");
				break;
			case 'group':
				value = CFDataManager.getFormulaOrganizations(value);
				break;
			case 'user':
				value = WorkflowManager.getFormulaUserObjects(value);
				break;
		}
	}
	return value;
}


InstanceManager.getInstanceValuesByAutoForm = function() {

	var fields = WorkflowManager.getInstanceFields();

	var instanceValue = InstanceManager.getCurrentValues();
	// var autoFormValue = AutoForm.getFormValues("instanceform").insertDoc;
	var autoFormValue = _.extend(AutoForm.getFormValues("instanceform").insertDoc, AutoForm.getFormValues("instanceform").updateDoc.$unset);

	var values = {};

	fields.forEach(function(field) {
		if (field.type == 'table') {
			t_values = new Array();
			if (field.sfields) {
				if (!autoFormValue[field.code])
					return;
				autoFormValue[field.code].forEach(function(t_row_value) {
					field.sfields.forEach(function(sfield) {
						//if(sfield.type == 'checkbox'){
						t_row_value[sfield.code] = adjustFieldValue(sfield, t_row_value[sfield.code]);
						//}
					});
					t_values.push(t_row_value);
				});
			}
			values[field.code] = t_values;
		} else {
			if (field.type != 'section') {
				values[field.code] = adjustFieldValue(field, autoFormValue[field.code]);
			}
		}
	});

	return values;
}

InstanceManager.getCurrentStep = function() {

	var instance = WorkflowManager.getInstance();

	if (!instance || !instance.traces)
		return;

	var currentTrace = instance.traces[instance.traces.length - 1];

	var currentStepId = currentTrace.step;

	return WorkflowManager.getInstanceStep(currentStepId);
}

InstanceManager.getStartStep = function() {

	var instance = WorkflowManager.getInstance();

	if (!instance || !instance.traces)
		return;

	return WorkflowManager.getInstanceStep(instance.traces[0].step);
}

InstanceManager.getCurrentValues = function() {
	var box = Session.get("box"),
		approve,
		instanceValue;

	var instance = WorkflowManager.getInstance();

	if (InstanceManager.isCC(instance)) {

		instanceValue = instance.values;

	} else {

		if (box == "draft") {
			approve = InstanceManager.getCurrentApprove();
			if (approve && approve.values)
				return approve.values
		} else if (box == "inbox") {
			approve = InstanceManager.getCurrentApprove();
			if (approve && approve.values) {
				if (_.isEmpty(approve.values))
					approve.values = InstanceManager.clone(WorkflowManager.getInstance().values)
				return approve.values
			}
		} else if (box == "outbox" || box == "pending" || box == "completed" || box == "monitor") {

			instanceValue = instance.values;
		} else {
			instanceValue = instance.values;
		}

	}
	return instanceValue;
}

InstanceManager.clone = function(obj) {
	if (!obj) {
		return
	}
	return JSON.parse(JSON.stringify(obj))
}

InstanceManager.getCurrentApprove = function() {
	var instance = WorkflowManager.getInstance();

	if (!instance)
		return;

	if (!instance.traces || instance.traces.length < 1)
		return;

	var currentTraces = instance.traces.filterProperty("is_finished", false);

	if (currentTraces.length) {
		var currentApproves = currentTraces[0].approves.filterProperty("is_finished", false).filterProperty("handler", Meteor.userId());

		var currentApprove = currentApproves.length > 0 ? currentApproves[0] : null;
	}

	//传阅的approve返回最新一条
	if (!currentApprove || currentApprove.type == 'cc') {
		// 当前是传阅
		_.each(instance.traces, function(t) {
			_.each(t.approves, function(a) {
				if (a.type == 'cc' && a.handler == Meteor.userId() && a.is_finished == false) {
					currentApprove = a;
				}
			})
		})
	}

	if (!currentApprove)
		return;

	if (currentApprove._id) {
		currentApprove.id = currentApprove._id;
	}

	return currentApprove;
}

InstanceManager.getMyApprove = function() {

	var currentApprove = InstanceManager.getCurrentApprove();

	if (currentApprove) {
		currentApprove.description = $("#suggestion").val();
		var judge = $("[name='judge']").filter(':checked').val();
		if (judge)
			currentApprove.judge = judge;
		var nextStepId = ApproveManager.getNextStepsSelectValue();
		if (nextStepId) {

			var selectedNextStepUsers = ApproveManager.getNextStepUsersSelectValue();
			var nextStepUsers = new Array();
			if (selectedNextStepUsers instanceof Array) {
				selectedNextStepUsers.forEach(function(su) {
					nextStepUsers.push(su);
				});
			} else if (selectedNextStepUsers) {
				nextStepUsers.push(selectedNextStepUsers);
			}

			currentApprove.next_steps = [{
				step: nextStepId,
				users: nextStepUsers
			}];
		}

		currentApprove.values = InstanceManager.getInstanceValuesByAutoForm();

		return currentApprove;
	}

	return {};
}

// 申请单暂存
InstanceManager.saveIns = function() {
	$('body').addClass("loading");
	var instance = WorkflowManager.getInstance();
	if (instance) {
		if (instance.state != 'draft') {
			InstanceManager.updateApproveSign('', $("#suggestion").val(), "update", InstanceSignText.helpers.getLastSignApprove())
		}

		if (InstanceManager.isCC(instance)) {
			var description = $("#suggestion").val();
			Meteor.call('cc_save', instance._id, description, function(error, result) {
				$('body').removeClass("loading");
				if (error) {
					toastr.error(error);
				};
				if (result == true) {
					WorkflowManager.instanceModified.set(false);
					toastr.success(TAPi18n.__('Saved successfully'));
				}
			})
			return;
		}
	}

	//如果instanceform不存在，则不执行暂存操作
	if (!AutoForm.getFormValues("instanceform"))
		return


	if (instance) {
		var state = instance.state;
		if (state == "draft") {
			instance.traces[0].approves[0] = InstanceManager.getMyApprove();
			var selected_applicant = $("input[name='ins_applicant']")[0].dataset.values;
			if (instance.applicant != selected_applicant) {
				var space_id = instance.space;

				var applicant = SteedosDataManager.spaceUserRemote.findOne({
					space: space_id,
					user: selected_applicant
				}, {
					fields: {
						organization: 1,
						name: 1
					}
				});
				var org_id = applicant.organization;
				var organization = SteedosDataManager.organizationRemote.findOne(org_id, {
					fields: {
						name: 1,
						fullname: 1
					}
				});

				instance.applicant = selected_applicant;
				instance.applicant_name = applicant.name;
				instance.applicant_organization = org_id;
				instance.applicant_organization_name = organization.name;
				instance.applicant_organization_fullname = organization.fullname;
			}
			Meteor.call("draft_save_instance", instance, function(error, result) {
				$('body').removeClass("loading");
				WorkflowManager.instanceModified.set(false);
				if (result == true) {
					toastr.success(TAPi18n.__('Saved successfully'));
				} else if (result == "upgraded") {
					toastr.info(TAPi18n.__('Flow upgraded'));
					FlowRouter.go("/workflow/space/" + Session.get('spaceId') + "/draft/" + instance._id);
					console.log("upgraded")
				} else {
					toastr.error(error.reason);
					FlowRouter.go("/workflow/space/" + Session.get('spaceId') + "/draft/");
				}

			});
		} else if (state == "pending") {
			var myApprove = InstanceManager.getMyApprove();
			myApprove.values = InstanceManager.getInstanceValuesByAutoForm();

			if (!_.isEmpty(myApprove) && !_.isEmpty(myApprove._id)) {
				Meteor.call("inbox_save_instance", myApprove, function(error, result) {
					$('body').removeClass("loading");
					WorkflowManager.instanceModified.set(false);
					if (result == true) {
						toastr.success(TAPi18n.__('Saved successfully'));
					} else {
						toastr.error(error.reason);
						FlowRouter.go("/workflow/space/" + Session.get('spaceId') + "/inbox/");
					}
				});
			} else {
				$('body').removeClass("loading");
			}
		}
	} else {
		$('body').removeClass("loading");
	}
}

// 申请单新建
InstanceManager.newIns = function(flowId) {
	UUflow_api.post_draft(flowId);
}

// 申请单删除
InstanceManager.deleteIns = function() {
	var instance = WorkflowManager.getInstance();
	if (!instance)
		return;

	UUflow_api.delete_draft(instance._id);
}

// 申请单提交
InstanceManager.submitIns = function() {

	if (!InstanceEvent.before.instanceSubmit())
		return;

	if (!InstanceManager.isCCMustFinished())
		return;

	var instance = WorkflowManager.getInstance();

	if (instance) {

		if (instance.state != 'draft') {
			InstanceManager.updateApproveSign('', $("#suggestion").val(), "update", InstanceSignText.helpers.getLastSignApprove())
		}

		if (InstanceManager.isCC(instance)) {

			if (Session.get("instance_submitting")) {
				return;
			}

			Session.set("instance_submitting", true);

			var description = $("#suggestion").val();
			Meteor.call('cc_submit', instance._id, description, function(error, result) {
				if (error) {
					toastr.error(error);
					Session.set("instance_submitting", false);
				};

				if (result == true) {
					WorkflowManager.instanceModified.set(false);
					toastr.success(TAPi18n.__('Submitted successfully'));
					Session.set("instance_submitting", false);
					FlowRouter.go("/workflow/space/" + Session.get("spaceId") + "/" + Session.get("box"));
				};
			});
		} else {
			var state = instance.state;
			if (state == "draft") {

				var selected_applicant = $("input[name='ins_applicant']")[0].dataset.values;
				if (instance.applicant != selected_applicant) {
					var space_id = instance.space;
					var applicant = SteedosDataManager.spaceUserRemote.findOne({
						space: space_id,
						user: selected_applicant
					}, {
						fields: {
							organization: 1,
							name: 1
						}
					});
					var org_id = applicant.organization;
					var organization = SteedosDataManager.organizationRemote.findOne(org_id, {
						fields: {
							name: 1,
							fullname: 1
						}
					});

					instance.applicant = selected_applicant;
					instance.applicant_name = applicant.name;
					instance.applicant_organization = org_id;
					instance.applicant_organization_name = organization.name;
					instance.applicant_organization_fullname = organization.fullname;
				}

				instance.traces[0].approves[0] = InstanceManager.getMyApprove();
				UUflow_api.post_submit(instance);
			} else if (state == "pending") {
				var myApprove = InstanceManager.getMyApprove();

				myApprove.values = InstanceManager.getInstanceValuesByAutoForm();
				UUflow_api.post_engine(myApprove);
			}
		}
	}
}

// 取消申请
InstanceManager.terminateIns = function(reason) {
	var instance = WorkflowManager.getInstance();
	if (instance) {
		UUflow_api.post_terminate({_id: instance._id, terminate_reason: reason});
	}
}

// 导出报表
InstanceManager.exportIns = function(type) {
	spaceId = Session.get("spaceId");
	flowId = Session.get("flowId");
	if (spaceId && flowId)
		UUflow_api.get_export(spaceId, flowId, type);
}

// 转签核
InstanceManager.reassignIns = function(user_ids, reason) {
	var instance = WorkflowManager.getInstance();
	if (instance) {
		instance.inbox_users = user_ids;
		instance.reassign_reason = reason;
		UUflow_api.put_reassign(instance);
	}
}

// 重定位
InstanceManager.relocateIns = function(step_id, user_ids, reason) {
	var instance = WorkflowManager.getInstance();
	if (instance) {
		UUflow_api.put_relocate({_id: instance._id, relocate_next_step: step_id, relocate_inbox_users: user_ids, relocate_comment: reason});
	}
}

// 归档
InstanceManager.archiveIns = function(insId) {
	var instance = WorkflowManager.getInstance();
	if (instance) {
		if (instance.is_archived == true)
			return;
		UUflow_api.post_archive(insId);
	}
}

// 添加附件
InstanceManager.addAttach = function(fileObj, isAddVersion) {
	var instance = WorkflowManager.getInstance();
	if (instance) {
		var state = instance.state;

		var curTime = new Date();
		var userId = Meteor.userId();
		var fileName = fileObj.name;
		if (!fileName)
			fileName = Session.get('filename');


		var attachs = instance.attachments || [];
		var hasRepeatedFile = false;
		var attach_id = Session.get("attach_id");
		attachs.forEach(function(a) {
			if (a.filename == fileName || (isAddVersion == true && a._id == attach_id)) {
				hasRepeatedFile = true;
				var his = a.historys;
				if (!(his instanceof Array))
					his = [];

				var my_approve_id = InstanceManager.getMyApprove().id;
				if (a.current.approve != my_approve_id) {
					his.unshift(a.current);
				}

				a.historys = his;
				a.current = {
					"_id": new Mongo.ObjectID()._str,
					"_rev": fileObj._id,
					"length": fileObj.size,
					"approve": my_approve_id,
					"created": curTime,
					"created_by": userId,
					"created_by_name": Meteor.user().name,
					"filename": fileName
				};
				a.filename = fileName;
			}
		})

		if (!hasRepeatedFile) {
			var attach = {
				"_id": new Mongo.ObjectID()._str,
				"filename": fileName,
				"contentType": fileObj.type,
				"modified": curTime,
				"modified_by": userId,
				"created": curTime,
				"created_by": userId,
				"current": {
					"_id": new Mongo.ObjectID()._str,
					"_rev": fileObj._id,
					"length": fileObj.size,
					"approve": InstanceManager.getMyApprove().id,
					"created": curTime,
					"created_by": userId,
					"created_by_name": Meteor.user().name,
					"filename": fileName
				}
			};
			if (attachs) {
				attachs.push(attach);
			} else {
				attachs = [attach];
			}
		}
		WorkflowManager.instanceModified.set(true);

		if (state == "draft") {
			instance.attachments = attachs;
			instance.traces[0].approves[0] = InstanceManager.getMyApprove();
			Meteor.call("draft_save_instance", instance, function(error, result) {
				Session.set('change_date', new Date());
				WorkflowManager.instanceModified.set(false);
				if (result == true) {

					toastr.success(TAPi18n.__('Attachment was added successfully'));
				} else {
					toastr.error(error);
				}
			});
		} else if (state == "pending") {
			if (InstanceManager.isCC(instance)) {
				toastr.success(TAPi18n.__('Attachment was added successfully'));
			} else {
				var myApprove = {};
				$.extend(myApprove, InstanceManager.getMyApprove());
				myApprove.attachments = attachs;
				myApprove.values = InstanceManager.getInstanceValuesByAutoForm();
				Meteor.call("inbox_save_instance", myApprove, function(error, result) {
					Session.set('change_date', new Date());
					WorkflowManager.instanceModified.set(false);
					if (result == true) {

						toastr.success(TAPi18n.__('Attachment was added successfully'));
					} else {
						toastr.error(error);
					}
				});
			}
		}
	}
}

// 移除附件
InstanceManager.removeAttach = function() {
	var instance = WorkflowManager.getInstance();
	if (instance) {
		var state = instance.state;
		var attachs = instance.attachments;
		var file_id = Session.get("file_id");
		var newAttachs = attachs.filter(function(item) {
			if (item.current._rev != file_id) {
				return item;
			} else {
				var his = item.historys;
				if (his && his.length > 0) {
					item.current = item.historys.shift();
					item.filename = item.current.filename;
					return item;
				}
			}
		})
		WorkflowManager.instanceModified.set(true);

		if (state == "draft") {
			instance.attachments = newAttachs;
			instance.traces[0].approves[0] = InstanceManager.getMyApprove();
			Meteor.call("draft_save_instance", instance, function(error, result) {
				Session.set('change_date', new Date());
				WorkflowManager.instanceModified.set(false);
				if (result == true) {

					toastr.success(TAPi18n.__('Attachment deleted successfully'));
				} else {
					toastr.error(error);
				}
			});
		} else if (state == "pending") {
			if (InstanceManager.isCC(instance)) {
				toastr.success(TAPi18n.__('Attachment deleted successfully'));
			} else {
				instance.attachments = newAttachs;
				var myApprove = {};
				$.extend(myApprove, InstanceManager.getMyApprove());
				myApprove.attachments = newAttachs;
				myApprove.values = InstanceManager.getInstanceValuesByAutoForm();
				Meteor.call("inbox_save_instance", myApprove, function(error, result) {
					Session.set('change_date', new Date());
					WorkflowManager.instanceModified.set(false);
					if (result == true) {

						toastr.success(TAPi18n.__('Attachment deleted successfully'));
					} else {
						toastr.error(error);
					}
				});
			}

		}
	}
}

// 上传附件
InstanceManager.uploadAttach = function(files, isAddVersion, isMainAttach) {
	check(isAddVersion, Boolean);
	check(isMainAttach, Boolean);

	$(document.body).addClass("loading");
	$('.loading-text').text(TAPi18n.__("workflow_attachment_uploading"));

	// 专业版文件大小不能超过100M
	// 读取settings中附件最大限制,默认100M
	var maximumFileSize = 100 * 1024 * 1024;
	var ref, ref1, ref2;
	var attachment_size_limit = ((ref = Meteor.settings) != null ? (ref1 = ref["public"]) != null ? (ref2 = ref1.workflow) != null ? ref2.attachment_size_limit : void 0 : void 0 : void 0) || 100;
	
	if (attachment_size_limit)
		maximumFileSize = attachment_size_limit * 1024 * 1024;
	
	// 免费版大小不能超过1M
	var freeMaximumFileSize = 1024 * 1024;

	var limitSize, warnStr;

	var is_paid = WorkflowManager.isPaidSpace(Session.get('spaceId'));

	if (is_paid) {
		limitSize = maximumFileSize;
		warnStr = t("workflow_attachment_paid_size_limit") + attachment_size_limit + "MB";
	} else {
		limitSize = freeMaximumFileSize;
		warnStr = t("workflow_attachment_free_size_limit");
	}

	var fd, file, fileName, i;

	i = 0;

	while (i < files.length) {
		file = files[i];

		if (file.size > limitSize) {
			$("body").removeClass("loading");
			$('.loading-text').text("");
			swal({
				title: warnStr,
				type: "warning",
				confirmButtonText: t('OK'),
				closeOnConfirm: true
			}, function() {
				$(document.body).removeClass('loading');
				$('.loading-text').text("");
			});
			return;
		}

		if (!file.name) {
			continue;
		}
		fileName = file.name;
		if (["image.jpg", "image.gif", "image.jpeg", "image.png"].includes(fileName.toLowerCase())) {
			fileName = "image-" + moment(new Date()).format('YYYYMMDDHHmmss') + "." + fileName.split('.').pop();
		}
		Session.set("filename", fileName);
		$('.loading-text').text(TAPi18n.__("workflow_attachment_uploading") + fileName + "...");
		fd = new FormData;
		fd.append('Content-Type', cfs.getContentType(fileName));
		fd.append("file", file);
		fd.append("instance", Session.get('instanceId'));
		fd.append("space", Session.get('spaceId'));
		fd.append("approve", InstanceManager.getMyApprove().id);
		fd.append("owner", Meteor.userId());
		fd.append("owner_name", Meteor.user().name);

		fd.append("is_private", file.is_private || false)

		if (isAddVersion) {
			fd.append("isAddVersion", isAddVersion);
			fd.append("parent", Session.get('attach_parent_id'));
		}

		if (isMainAttach) {
			fd.append("main", isMainAttach);
		}

		$.ajax({
			url: Steedos.absoluteUrl('api/v4/instances/s3/'),
			type: 'POST',
			async: true,
			data: fd,
			dataType: 'json',
			processData: false,
			contentType: false,
			success: function(responseText, status) {
				var fileObj;
				$(document.body).removeClass('loading');
				$('.loading-text').text("");
				if (responseText.errors) {
					responseText.errors.forEach(function(e) {
						toastr.error(e.errorMessage);
					});
					return;
				}

				toastr.success(TAPi18n.__('Attachment was added successfully'));
			},
			error: function(xhr, msg, ex) {
				$(document.body).removeClass('loading');
				$('.loading-text').text("");
				toastr.error(msg);
			}
		});
		i++;
	}
}

InstanceManager.lockAttach = function(file_id) {
	Meteor.call('cfs_instances_lock', file_id, Meteor.userId(), Meteor.user().name)
}

InstanceManager.isInbox = function() {
	var instance = WorkflowManager.getInstance();
	var currentUser = Meteor.userId();

	if (instance && currentUser && Session.get("box") == 'inbox') {

		if (instance.inbox_users && instance.inbox_users.includes(currentUser)) {
			return true;
		}

		if (InstanceManager.isCC(instance)) {
			return true;
		}

	}

	return false;
}

InstanceManager.isCC = function(instance) {
	if (!instance)
		return false;

	var currentUser = Meteor.userId();
	var approve = InstanceManager.getCurrentApprove();

	if (approve && approve.type != "cc") {
		return false;
	}

	if (instance.cc_users && instance.cc_users.includes(currentUser))
		return true;

	return false;
}

InstanceManager.getCCApprove = function(userId, is_finished) {

	var instance = WorkflowManager.getInstance();

	var traces = instance.traces;

	var rev = {};

	traces.forEach(function(t) {
		if (t.approves) {
			t.approves.forEach(function(approve) {
				if (approve.handler == userId && approve.type == 'cc' && approve.is_finished == is_finished) {
					rev = approve
				}
			});
		}
	})

	return rev;
}

InstanceManager.unlockAttach = function(file_id) {
	Meteor.call('cfs_instances_unlock', file_id);
}

// 申请单转发/分发
InstanceManager.forwardIns = function(instance_id, space_id, flow_id, hasSaveInstanceToAttachment, description, isForwardAttachments, selectedUsers, action_type, related) {

	if (Session.get("instance_submitting")) {
		return;
	}

	Session.set("instance_submitting", true);

	$('body').addClass("loading");
	var ins = WorkflowManager.getInstance();
	var approve_id = null;
	if (InstanceManager.isInbox() && ins.state == "pending") {
		if (InstanceManager.getCurrentApprove()) {
			approve_id = InstanceManager.getCurrentApprove()._id;
		}
	} else if (Session.get("box") == 'outbox' && ins.state == "pending") {
		if (InstanceManager.getLastCCApprove(ins.traces)) {
			approve_id = InstanceManager.getLastCCApprove(ins.traces)._id;
		}
	}

	Meteor.call('forward_instance', instance_id, space_id, flow_id, hasSaveInstanceToAttachment, description, isForwardAttachments, selectedUsers, action_type, related, approve_id, function(error, result) {
		$('body').removeClass("loading");

		Session.set("instance_submitting", false);

		if (error) {
			if (error.error == 'no_permission') {
				if (action_type == 'forward') {
					toastr.error(TAPi18n.__('instance_no_add_permission', {
						actiontype: TAPi18n.__("instance_forward_title"),
						usernames: error.details
					}));
				} else if (action_type == 'distribute') {
					toastr.error(TAPi18n.__('instance_no_add_permission', {
						actiontype: TAPi18n.__("instance_distribute_title"),
						usernames: error.details
					}));
				}

			} else {
				toastr.error(error.message);
			}

		}

		if (!_.isEmpty(result)) {
			if (action_type == "forward") {
				toastr.success(TAPi18n.__("forward_instance_success"));
			} else if (action_type == "distribute") {
				toastr.success(TAPi18n.__("instance_distribute_success"));
			}
		}

	})
}


InstanceManager.getUserInboxInstances = function() {
	var query = {}
	query.$or = [{
		inbox_users: Meteor.userId()
	}, {
		cc_users: Meteor.userId()
	}]

	return db.instances.find(query).fetch();
}

// 取回申请单
InstanceManager.retrieveIns = function(reason) {
	var instance = WorkflowManager.getInstance();
	if (instance) {
		instance.retrieve_comment = reason;
		UUflow_api.post_retrieve(instance);
	}
}

InstanceManager.fixInstancePosition = function(isNeedToScrollTop) {
	if ($(".instance-wrapper .instance-view").hasClass("suggestion-active")) {
		var suggestionBoxH = $(".instance-wrapper .instance-suggestion").height();
		$(".instance-wrapper .instance").css("bottom", suggestionBoxH + 2);
	} else {
		$(".instance-wrapper .instance").css("bottom", 0);
	}
	if (isNeedToScrollTop) {
		setTimeout(function() {
			$('.instance').scrollTop($('.instance .instance-form').height() + $('.instance-traces').height());
		}, 1);
	}
}


InstanceManager.setApproveHaveRead = function(instanceId) {
	var ins = WorkflowManager.getInstance()
	if (!ins.is_read) {
		var myApprove = InstanceManager.getCurrentApprove()
		if (myApprove) {
			Meteor.call("set_approve_have_read", ins._id, myApprove.trace, myApprove.id, function(error, result) {});
		} else {
			var ccApprove = InstanceManager.getCCApprove(Meteor.userId(), false);
			if (!_.isEmpty(ccApprove)) {
				Meteor.call("cc_read", ccApprove, function(error, result) {
					console.log('set read')
				});
			}

		}
	}
}

InstanceManager.instanceformChangeEvent = function(event) {
	var code, error, step, type, v;

	if (ApproveManager.isReadOnly()) {
		return;
	}

	code = event.target.name;

	type = event.target.type;

	if (type === 'number') {
		v = event.target.value;
		try {
			if (!v) {
				v = 0.00;
			}
			if (typeof v === 'string') {
				v = parseFloat(v);
			}
			step = event.target.step;
			if (step) {
				v = v.toFixed(step.length - 2);
			} else {
				v = v.toFixed(0);
			}
			event.target.value = v;
		} catch (_error) {
			error = _error;
			console.log(v + error);
		}
	}


	InstanceManager.checkFormFieldValue(event.target);

	InstanceManager.runFormula(code);

	if (code === 'ins_applicant') {
		Session.set("ins_applicant", InstanceManager.getApplicantUserId());

		if (InstanceManager.nextStepUsersWillUpdate({
				name: 'applicant'
			}, WorkflowManager.getInstanceStep(Session.get("next_step_id")))) {
			Session.set("instance_next_user_recalculate", Random.id())
		}

	} else {
		var instanceFields = WorkflowManager.getInstanceFields();
		var field = instanceFields.filterProperty("code", code);
		if (field.length > 0) {
			if (InstanceManager.nextStepUsersWillUpdate(field[0], WorkflowManager.getInstanceStep(Session.get("next_step_id")))) {
				Session.set("instance_next_user_recalculate", Random.id())
			}
		}

	}
}

InstanceManager.isCCMustFinished = function() {
	var c = InstanceManager.getCurrentStep();
	if (c && c.cc_must_finished == true) {
		var ins = WorkflowManager.getInstance();
		if (ins) {
			var trace = _.find(ins.traces, function(t) {
				return t.step == c._id;
			});
			var not_finished_users_name = new Array(),
				user_id = Meteor.userId();
			if (InstanceManager.isCC(ins)) {
				_.each(trace.approves, function(a) {
					if (a.type == 'cc' && a.from_user == user_id && a.is_finished != true && a.handler != user_id) {
						not_finished_users_name.push(a.handler_name);
					}
				})
			} else {
				_.each(trace.approves, function(a) {
					if (a.type == 'cc' && a.from_user == user_id && a.is_finished != true) {
						not_finished_users_name.push(a.handler_name);
					}
				})
			}
			if (!_.isEmpty(not_finished_users_name)) {
				toastr.error(TAPi18n.__('instance_cc_must_finished', {
					not_finished_users_name: not_finished_users_name.toString()
				}));
				return false;
			}
		}
	}

	return true;
}

InstanceManager.getLastApprove = function(traces) {

	var currentApprove, i, user_id;

	user_id = Meteor.userId();

	currentApprove = null;

	i = traces.length - 1;

	while (i >= 0) {
		if (!currentApprove && traces[i].is_finished) {
			_.each(traces[i].approves, function(ap) {
				if (!currentApprove) {
					if (ap.is_finished && ap.user === user_id && (!ap.type || ap.type == 'reassign') && ['approved', 'submitted', 'rejected'].includes(ap.judge)) {
						currentApprove = ap;
					}
				}
			});
		}
		i--;
	}

	return currentApprove;
}

InstanceManager.getLastTraceStepId = function(traces) {

	var i, step_id, trace_id, user_id;

	user_id = Meteor.userId();

	trace_id = null;

	step_id = null;

	i = traces.length - 1;

	while (i >= 0) {
		if (!trace_id && traces[i].is_finished) {
			_.each(traces[i].approves, function(ap) {
				if (!trace_id) {
					if (ap.is_finished && ap.user === user_id && (!ap.type || ap.type == 'reassign') && ['approved', 'submitted', 'rejected'].includes(ap.judge)) {
						trace_id = ap.trace;
					}
					if (trace_id) {
						step_id = traces[i].step;
					}
				}
			});
		}
		i--;
	}

	return step_id;
}

InstanceManager.getLastCCTraceStepId = function(traces) {

	var i, step_id, trace_id, user_id;

	user_id = Meteor.userId();

	trace_id = null;

	step_id = null;

	i = traces.length - 1;

	while (i >= 0) {
		if (!trace_id && traces[i].is_finished) {
			_.each(traces[i].approves, function(ap) {
				if (!trace_id) {
					if (ap.is_finished && ap.user === user_id && (!ap.type || ap.type == 'cc') && ['approved', 'submitted', 'rejected'].includes(ap.judge)) {
						trace_id = ap.trace;
					}
					if (trace_id) {
						step_id = traces[i].step;
					}
				}
			});
		}
		i--;
	}

	return step_id;
}

InstanceManager.getLastCCApprove = function(traces) {

	var currentApprove, i, user_id;

	user_id = Meteor.userId();

	currentApprove = null;

	i = traces.length - 1;

	while (i >= 0) {
		if (!currentApprove && traces[i].is_finished) {
			_.each(traces[i].approves, function(ap) {
				if (!currentApprove) {
					if (ap.is_finished && ap.handler === user_id && (!ap.type || ap.type == 'cc') && ['approved', 'submitted', 'rejected'].includes(ap.judge)) {
						currentApprove = ap;
					}
				}
			});
		}
		i--;
	}

	return currentApprove;
}

InstanceManager.isAttachLocked = function(instance_id, user_id) {
	return !!cfs.instances.find({
		'metadata.instance': instance_id,
		'metadata.current': true,
		'metadata.locked_by': user_id
	}).count()
}

InstanceManager.getCCStep = function() {
	var currentApprove = InstanceManager.getCurrentApprove();
	if (!currentApprove)
		return false;
	var ins = WorkflowManager.getInstance();
	if (!ins)
		return false;
	var step;
	var trace = _.find(ins.traces, function(t) {
		return t._id == currentApprove.trace;
	})
	if (trace) {
		step = WorkflowManager.getInstanceStep(trace.step);
	}
	return step;
}

InstanceManager.updateApproveSign = function(sign_field_code, description, sign_type, lastSignApprove) {
	myApprove = InstanceManager.getCurrentApprove()
	if (myApprove && myApprove.sign_show != true) {
		Meteor.call('update_approve_sign', myApprove.instance, myApprove.trace, myApprove._id, sign_field_code, description, sign_type || "update", lastSignApprove)
	}
}

InstanceManager.getDistributeStep = function() {
	var step;
	if (InstanceManager.isInbox()) {
		step = InstanceManager.getCurrentStep();
	} else if (Session.get("box") == 'outbox') {
		var ins = WorkflowManager.getInstance();
		if (ins && ins.state == "pending") {
			var step_id = InstanceManager.getLastTraceStepId(ins.traces)
			if (step_id) {
				step = WorkflowManager.getInstanceStep(step_id)
			}
		}
	}
	return step;
}
InstanceManager.pickApproveSteps = function () {
	var steps = WorkflowManager.getInstanceSteps()

	var apporve_stesp = _.filter(steps, function(s){
			return s.allow_pick_approve_users && ["sign", "submit", "counterSign"].includes(s.step_type)
		}
	);

	return apporve_stesp;
}

InstanceManager.ccHasEditPermission = function () {
	var ccStep = InstanceManager.getCCStep();
	return ccStep.cc_has_edit_permission;
}
