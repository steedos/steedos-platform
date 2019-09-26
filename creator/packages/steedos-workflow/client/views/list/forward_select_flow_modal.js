Template.forward_select_flow_modal.helpers({
	title: function() {
		if (this.action_type == "forward") {
			return TAPi18n.__('instance_forward_title');
		} else if (this.action_type == "distribute") {
			return TAPi18n.__('instance_distribute_title');
		}
	},

	note: function() {
		if (this.action_type == "forward") {
			return TAPi18n.__('instanceForwardNote');
		} else if (this.action_type == "distribute") {
			return TAPi18n.__('instance_distribute_note');
		}
	},

	// take_attachments: function() {
	// 	if (this.action_type == "forward") {
	// 		return TAPi18n.__('isForwardAttachments');
	// 	} else if (this.action_type == "distribute") {
	// 		return TAPi18n.__('instance_distribute_attachments');
	// 	}
	// },

	user_context: function() {
		var data = {
			dataset: {
				showOrg: true,
				multiple: true
			},
			name: 'forward_select_user',
			atts: {
				name: 'forward_select_user',
				id: 'forward_select_user',
				class: 'selectUser form-control'
			}
		}

		return data
	},


	// 判断是转发还是分发
	is_show_selectuser: function() {
		if (this.action_type == "forward") {
			return false;
		} else if (this.action_type == "distribute") {
			var curret_step = InstanceManager.getDistributeStep();
			if (curret_step && curret_step.allowDistribute == true)
				return true;
		}

		return false;
	},

	selectuser_title: function(action_type) {
		var users_title = "";
		if (this.action_type == "forward") {
			users_title = TAPi18n.__('instance_forward_users');
		} else if (this.action_type == "distribute") {
			users_title = TAPi18n.__('instance_distribute_users');
		};
		return users_title;
	},

	is_distribute: function() {
		return this.action_type == "distribute"
	},

	can_to_self: function() {
		return Session.get('distribute_to_self');
	}

})


Template.forward_select_flow_modal.events({
	'click #forward_help': function(event, template) {
		var action_type = template.data.action_type;
		if (action_type == "forward") {
			Steedos.openWindow(t("forward_help"));
		} else if (action_type == "distribute") {
			Steedos.openWindow(t("forward_help"));
		}

	},

	'click #forward_flow_ok': function(event, template) {
		var action_type = template.data.action_type;
		var flow = $("#forward_flow")[0].dataset.flow;

		if (!flow)
			return;

		var selectedUsers = [];

		var related = false;

		if (action_type == 'forward') {
			if (!Steedos.isLegalVersion('', "workflow.professional")) {
				Steedos.spaceUpgradedModal()
				return;
			}
			selectedUsers = [Meteor.userId()];
		} else if (action_type == 'distribute') {
			if (!Steedos.isLegalVersion('', "workflow.enterprise")) {
				Steedos.spaceUpgradedModal()
				return;
			}
			var values = $("#forward_select_user")[0].dataset.values;
			selectedUsers = values ? values.split(",") : [];
			if ($("#instance_distribute_to_self")[0] && $("#instance_distribute_to_self")[0].checked) {
				selectedUsers.push(Meteor.userId());
				selectedUsers = _.uniq(selectedUsers);
			}
			related = $("#instance_related").prop("checked")
		}

		if (_.isEmpty(selectedUsers)) {
			toastr.error(TAPi18n.__("instance_forward_error_users_required"));
			return;
		}
		// $("#isForwardAttachments")[0].checked 默认为true
		UUflow_api.post_forward(Session.get('instanceId'), Session.get('forward_space_id'), flow, $("#saveInstanceToAttachment")[0].checked, $("#forward_flow_text").val(), true, selectedUsers, action_type, related);
		Modal.hide(template);
	},

	'click #forward_flow': function(event, template) {
		Modal.allowMultiple = true;
		WorkflowManager.alertFlowListModel({
			title: t("Select a flow"),
			showType: template.data.action_type,
			callBack: function (options) {
				var flow = options && options.flow;
				var flow = db.flows.findOne({
					_id: flow
				}, {
					fields: {
						_id: 1,
						name: 1,
						space: 1,
						distribute_optional_users: 1,
						distribute_to_self: 1,
						distribute_end_notification: 1
					}
				});
				if (!flow) {
					return
				}
				var forward_select_user = $("#forward_select_user")[0];
				// 切换了space
				if (Session.get('forward_space_id') != flow.space) {
					Session.set('forward_space_id', flow.space);
					if (forward_select_user)
						forward_select_user.dataset.spaceId = flow.space;
				}
				// 切换了流程
				if ($("#forward_flow")[0].dataset.flow != flow._id) {
					$("#forward_flow")[0].dataset.flow = flow._id;
					$("#forward_flow").val(flow.name);
					if (forward_select_user) {
						forward_select_user.value = '';
						forward_select_user.dataset.values = '';

						var users = flow.distribute_optional_users || [];
						if (!_.isEmpty(users)) {
							user_options = _.pluck(users, "id");
							forward_select_user.dataset.userOptions = user_options;
							forward_select_user.dataset.showOrg = false;
							if (user_options.length == 1) {
								var u = WorkflowManager.getUser(user_options[0], flow.space);
								forward_select_user.value = u.name;
								forward_select_user.dataset.values = user_options[0];
							}
						} else {
							delete forward_select_user.dataset.userOptions;
							delete forward_select_user.dataset.showOrg;
						}
						$("#forward_select_user").trigger('change');
					}
				}
				// 是否可分发给自己
				if (flow.distribute_to_self) {
					Session.set('distribute_to_self', true);
				} else {
					Session.set('distribute_to_self', false);
				}
			}
		});
	}

})


Template.forward_select_flow_modal.onRendered(function() {

	var instance = WorkflowManager.getInstance();

	InstanceEvent.initEvents(instance.flow);

	InstanceEvent.run($(".instance-" + this.data.action_type + "-modal"), "onload")

	var curret_step = InstanceManager.getDistributeStep();
	if (curret_step && curret_step.allowDistribute == true && !_.isEmpty(curret_step.distribute_optional_flows)) {
		var dof = curret_step.distribute_optional_flows;
		if (dof.length == 1) {
			Meteor.subscribe('distribute_optional_flows', dof, {
				onReady: function() {
					var flow = db.flows.findOne({
						_id: dof[0]
					}, {
						fields: {
							_id: 1,
							name: 1,
							space: 1,
							distribute_optional_users: 1,
							distribute_to_self: 1
						}
					})
					if (!flow)
						return;

					var forward_select_user = $("#forward_select_user")[0];

					Session.set('forward_space_id', flow.space);
					if (forward_select_user)
						forward_select_user.dataset.spaceId = flow.space;

					$("#forward_flow")[0].dataset.flow = flow._id;
					$("#forward_flow").val(flow.name);
					if (forward_select_user) {
						var users = flow.distribute_optional_users || [];
						if (!_.isEmpty(users)) {
							user_options = _.pluck(users, "id");
							forward_select_user.dataset.userOptions = user_options;
							forward_select_user.dataset.showOrg = false;
							if (user_options.length == 1) {
								var u = WorkflowManager.getUser(user_options[0], flow.space);
								forward_select_user.value = u.name;
								forward_select_user.dataset.values = user_options[0];
							}
							$("#forward_select_user").trigger('change');
						}
					}

					// 是否可分发给自己
					if (flow.distribute_to_self) {
						Session.set('distribute_to_self', true);
					} else {
						Session.set('distribute_to_self', false);
					}
				}
			});
		}

	}

})
