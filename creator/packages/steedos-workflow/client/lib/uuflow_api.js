UUflow_api = {};

// 新建instance（申请单）
UUflow_api.post_draft = function (flowId) {
	var uobj = {};
	uobj.methodOverride = "POST";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	var url = Steedos.absoluteUrl() + "api/workflow/drafts?" + $.param(uobj);
	var data = {
		"Instances": [{
			"flow": flowId,
			"applicant": Meteor.userId(),
			"space": Session.get("spaceId")
		}]
	};
	data = JSON.stringify(data);
	$(document.body).addClass("loading");

	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			$(document.body).removeClass("loading");
			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					toastr.error(e.errorMessage);
				});
				return;
			}

			var instance = responseText.inserts[0]

			Steedos.subscribeInstance(instance) //创建成功后，立即订阅新建的instance

			FlowRouter.go("/workflow/space/" + Session.get("spaceId") + "/draft/" + instance._id);

			toastr.success(TAPi18n.__('Added successfully'));
		},
		error: function (xhr, msg, ex) {
			$(document.body).removeClass("loading");
			toastr.error(msg);
		}
	})
};


// 拟稿状态下删除instance（申请单）
UUflow_api.delete_draft = function (instanceId) {
	var uobj = {};
	uobj.methodOverride = "DELETE";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	var url = Steedos.absoluteUrl() + "api/workflow/remove?" + $.param(uobj);
	var data = {
		"Instances": [{
			"_id": instanceId
		}]
	};
	data = JSON.stringify(data);
	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					toastr.error(e.errorMessage);
				});
				return;
			}

			FlowRouter.go("/workflow/space/" + Session.get("spaceId") + "/" + Session.get("box"));
			toastr.success(TAPi18n.__('Deleted successfully'));
		},
		error: function (xhr, msg, ex) {
			toastr.error(msg);
		}
	})
};

// instance（申请单）的第一次提交
UUflow_api.post_submit = function (instance) {

	if (Session.get("instance_submitting")) {
		return;
	}

	Session.set("instance_submitting", true);

	var uobj = {};
	uobj.methodOverride = "POST";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	uobj["insId"] = instance._id;
	var url = Steedos.absoluteUrl() + "api/workflow/submit/?" + $.param(uobj);
	var data = {
		"Instances": [instance]
	};
	data = JSON.stringify(data);
	$(document.body).addClass("loading");
	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			$(document.body).removeClass("loading");

			Session.set("instance_change", false);
			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					toastr.error(e.errorMessage);
				});
				return;
			}

			if (responseText.result && responseText.result.length > 0) {
				_.each(responseText.result, function (r) {
					if (r.alerts) {
						toastr.info(r.alerts);
					}
				});

				FlowRouter.go("/workflow/space/" + Session.get('spaceId') + "/draft/");
				return;
			}

			FlowRouter.go("/workflow/space/" + Session.get("spaceId") + "/" + Session.get("box"));

			toastr.success(TAPi18n.__('Submitted successfully'));

			Session.set("instance_submitting", false);
		},
		error: function (xhr, msg, ex) {
			$(document.body).removeClass("loading");
			toastr.error(msg);
			Session.set("instance_submitting", false);
		}
	})
};

// 待审核提交
UUflow_api.post_engine = function (approve) {

	if (Session.get("instance_submitting")) {
		return;
	}

	Session.set("instance_submitting", true);

	var uobj = {};
	uobj.methodOverride = "POST";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	uobj["insId"] = approve.instance;
	var url = Steedos.absoluteUrl() + "api/workflow/engine?" + $.param(uobj);
	var data = {
		"Approvals": [approve]
	};
	data = JSON.stringify(data);
	$(document.body).addClass("loading");
	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			$(document.body).removeClass("loading");

			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					toastr.error(e.errorMessage);
				});
				return;
			}
			Session.set("instance_change", false);
			FlowRouter.go("/workflow/space/" + Session.get("spaceId") + "/" + Session.get("box"));
			toastr.success(TAPi18n.__('Submitted successfully'));
			Session.set("instance_submitting", false);
		},
		error: function (xhr, msg, ex) {
			$(document.body).removeClass("loading");
			toastr.error(msg);
			Session.set("instance_submitting", false);
		}
	})
};

// 取消申请
UUflow_api.post_terminate = function (instance) {

	if (Session.get("instance_submitting")) {
		return;
	}

	Session.set("instance_submitting", true);

	var uobj = {};
	uobj.methodOverride = "POST";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	var url = Steedos.absoluteUrl() + "api/workflow/terminate?" + $.param(uobj);
	var data = {
		"Instances": [instance]
	};
	data = JSON.stringify(data);

	$(document.body).addClass("loading");
	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			$(document.body).removeClass("loading");

			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					toastr.error(e.errorMessage);
				});
				return;
			}

			FlowRouter.go("/workflow/space/" + Session.get("spaceId") + "/" + Session.get("box"));

			toastr.success(TAPi18n.__('Canceled successfully'));

			Session.set("instance_submitting", false);
		},
		error: function (xhr, msg, ex) {
			$(document.body).removeClass("loading");
			toastr.error(msg);
			Session.set("instance_submitting", false);
		}
	})
};

// 转签核
UUflow_api.put_reassign = function (instance) {

	if (Session.get("instance_submitting")) {
		return;
	}

	Session.set("instance_submitting", true);

	var uobj = {};
	uobj.methodOverride = "PUT";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	var url = Steedos.absoluteUrl() + "api/workflow/reassign?" + $.param(uobj);
	var data = {
		"Instances": [instance]
	};
	data = JSON.stringify(data);

	$(document.body).addClass("loading");
	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			$(document.body).removeClass("loading");

			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					toastr.error(e.errorMessage);
				});
				return;
			}

			toastr.success(TAPi18n.__('Reasigned successfully'));

			Session.set("instance_submitting", false);
		},
		error: function (xhr, msg, ex) {
			$(document.body).removeClass("loading");
			toastr.error(msg);

			Session.set("instance_submitting", false);
		}
	})
};

// 重定位
UUflow_api.put_relocate = function (instance) {

	if (Session.get("instance_submitting")) {
		return;
	}

	Session.set("instance_submitting", true);

	var uobj = {};
	uobj.methodOverride = "PUT";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	var url = Steedos.absoluteUrl() + "api/workflow/relocate?" + $.param(uobj);
	var data = {
		"Instances": [instance]
	};
	data = JSON.stringify(data);

	$(document.body).addClass("loading");
	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			$(document.body).removeClass("loading");

			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					toastr.error(e.errorMessage);
				});
				return;
			}


			toastr.success(TAPi18n.__('Relocated successfully'));

			Session.set("instance_submitting", false);
		},
		error: function (xhr, msg, ex) {
			$(document.body).removeClass("loading");
			toastr.error(msg);

			Session.set("instance_submitting", false);
		}
	})
};

// 归档
UUflow_api.post_archive = function (insId) {
	var uobj = {};
	uobj.methodOverride = "POST";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	var url = Steedos.absoluteUrl() + "api/workflow/archive?" + $.param(uobj);
	var data = {
		"Instances": [{
			id: insId
		}]
	};
	data = JSON.stringify(data);
	$(document.body).addClass("loading");
	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			$(document.body).removeClass("loading");

			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					toastr.error(e.errorMessage);
				});
			}
		},
		error: function (xhr, msg, ex) {
			$(document.body).removeClass("loading");
			toastr.error(msg);
		}
	})
};

// 导出报表
UUflow_api.get_export = function (spaceId, flowId, type) {
	var uobj = {};
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	uobj.space_id = spaceId;
	uobj.flow_id = flowId;
	uobj.timezoneoffset = new Date().getTimezoneOffset();
	uobj.type = type;
	var url = Steedos.absoluteUrl() + "api/workflow/export/instances?" + $.param(uobj);
	window.open(url, '_parent', 'EnableViewPortScale=yes');
};

// 计算下一步处理人
UUflow_api.caculate_nextstep_users = function (deal_type, spaceId, body) {
	var q = {};
	q.deal_type = deal_type;
	q.spaceId = spaceId;

	var nextStepUsers = [];
	var data = JSON.stringify(body);
	$.ajax({
		url: Steedos.absoluteUrl('api/workflow/nextStepUsers') + '?' + $.param(q),
		type: 'POST',
		async: false,
		data: data,
		dataType: 'json',
		processData: false,
		contentType: "application/json",
		success: function (responseText, status) {
			if (responseText.errors) {
				toastr.error(responseText.errors);
				return;
			}

			nextStepUsers = responseText.nextStepUsers;
		},
		error: function (xhr, msg, ex) {
			toastr.error(msg);
		}
	});

	return nextStepUsers;
};

// 计算下一步处理人
UUflow_api.caculateNextstepUsers = function (deal_type, spaceId, body) {
	var q = {};
	q.deal_type = deal_type;
	q.spaceId = spaceId;

	var nextStepUsers = [],
		error = "";
	var data = JSON.stringify(body);
	$.ajax({
		url: Steedos.absoluteUrl('api/workflow/nextStepUsers') + '?' + $.param(q),
		type: 'POST',
		async: false,
		data: data,
		dataType: 'json',
		processData: false,
		contentType: "application/json",
		success: function (responseText, status) {
			if (responseText.errors) {
				toastr.error(responseText.errors);
				return;
			}

			nextStepUsers = responseText.nextStepUsers;
			error = responseText.error;
		},
		error: function (xhr, msg, ex) {
			toastr.error(msg);
		}
	});

	return {
		nextStepUsers: nextStepUsers,
		error: error
	};
};

// 获取space_users
UUflow_api.getSpaceUsers = function (spaceId, userIds) {
	var q = {};
	q.spaceId = spaceId;
	var data = {
		'userIds': userIds
	};
	var spaceUsers;
	data = JSON.stringify(data);
	$.ajax({
		url: Steedos.absoluteUrl('api/workflow/getSpaceUsers') + '?' + $.param(q),
		type: 'POST',
		async: false,
		data: data,
		dataType: 'json',
		processData: false,
		contentType: "application/json",
		success: function (responseText, status) {
			if (responseText.errors) {
				toastr.error(responseText.errors);
				return;
			}

			spaceUsers = responseText.spaceUsers;
		},
		error: function (xhr, msg, ex) {
			toastr.error(msg);
		}
	});

	return spaceUsers;
};

// 取回
UUflow_api.post_retrieve = function (instance) {

	if (Session.get("instance_submitting")) {
		return;
	}

	Session.set("instance_submitting", true);

	var uobj = {};
	uobj.methodOverride = "POST";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	var url = Steedos.absoluteUrl() + "api/workflow/retrieve?" + $.param(uobj);
	var data = {
		"Instances": [{
			_id: instance._id,
			retrieve_comment: instance.retrieve_comment
		}]
	};
	data = JSON.stringify(data);

	$(document.body).addClass("loading");
	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			$(document.body).removeClass("loading");

			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					toastr.error(e.errorMessage);
				});
				return;
			}

			FlowRouter.go("/workflow/space/" + Session.get("spaceId") + "/inbox");

			toastr.success(TAPi18n.__('Retrieved successfully'));

			Session.set("instance_submitting", false);
		},
		error: function (xhr, msg, ex) {
			$(document.body).removeClass("loading");
			toastr.error(msg);
			Session.set("instance_submitting", false);
		}
	})
};

// 获取user.name
UUflow_api.getNameForUser = function (userId) {
	var q = {};
	var data = {
		'userId': userId
	};
	var user;
	data = JSON.stringify(data);
	$.ajax({
		url: Steedos.absoluteUrl('api/workflow/getNameForUser') + '?' + $.param(q),
		type: 'POST',
		async: false,
		data: data,
		dataType: 'json',
		processData: false,
		contentType: "application/json",
		success: function (responseText, status) {
			if (responseText.errors) {
				toastr.error(responseText.errors);
				return;
			}

			user = responseText.user;
		},
		error: function (xhr, msg, ex) {
			toastr.error(msg);
		}
	});

	return user;
};

// 转发/分发
UUflow_api.post_forward = function (instance_id, space_id, flow_id, hasSaveInstanceToAttachment, description, isForwardAttachments, selectedUsers, action_type, related) {

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

	var uobj = {};
	uobj.methodOverride = "POST";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();
	var url = Steedos.absoluteUrl() + "api/workflow/forward?" + $.param(uobj);
	var data = {
		"instance_id": instance_id,
		"space_id": space_id,
		"flow_id": flow_id,
		"hasSaveInstanceToAttachment": hasSaveInstanceToAttachment,
		"description": description,
		"isForwardAttachments": isForwardAttachments,
		"selectedUsers": selectedUsers,
		"action_type": action_type,
		"related": related,
		"from_approve_id": approve_id
	};
	data = JSON.stringify(data);

	$.ajax({
		url: url,
		type: "POST",
		async: true,
		data: data,
		dataType: "json",
		processData: false,
		contentType: "application/json",

		success: function (responseText, status) {
			$(document.body).removeClass("loading");

			if (responseText.errors) {
				responseText.errors.forEach(function (e) {
					if (e.error == 'no_permission') {
						if (action_type == 'forward') {
							toastr.error(TAPi18n.__('instance_no_add_permission', {
								actiontype: TAPi18n.__("instance_forward_title"),
								usernames: e.details
							}));
						} else if (action_type == 'distribute') {
							toastr.error(TAPi18n.__('instance_no_add_permission', {
								actiontype: TAPi18n.__("instance_distribute_title"),
								usernames: e.details
							}));
						}

					} else {
						toastr.error(e.reason);
					}
				});
				return;
			}

			if (action_type == "forward") {
				toastr.success(TAPi18n.__("forward_instance_success"));
			} else if (action_type == "distribute") {
				toastr.success(TAPi18n.__("instance_distribute_success"));
			}

			Session.set("instance_submitting", false);
		},
		error: function (xhr, msg, ex) {
			$(document.body).removeClass("loading");
			toastr.error(msg);
			Session.set("instance_submitting", false);
		}
	})
};