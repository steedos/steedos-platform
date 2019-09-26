Template.reassign_modal.helpers({

	fields: function() {

		var userOptions = null;

		var showOrg = true;

		var instance = WorkflowManager.getInstance();

		var space = db.spaces.findOne(instance.space);

		var flow = db.flows.findOne({
			'_id': instance.flow
		});

		var curSpaceUser = db.space_users.findOne({
			space: instance.space,
			'user': Meteor.userId()
		});

		var organizations = db.organizations.find({
			_id: {
				$in: curSpaceUser.organizations
			}
		}).fetch();
		if (space.admins.contains(Meteor.userId())) {

		} else if (WorkflowManager.canAdmin(flow, curSpaceUser, organizations)) {
			var currentStep = InstanceManager.getCurrentStep()

			userOptions = ApproveManager.getNextStepUsers(instance, currentStep._id).getProperty("id").join(",")

			showOrg = Session.get("next_step_users_showOrg")
		} else {
			userOptions = "0"
			showOrg = false
		}

		var multi = false;
		var c = InstanceManager.getCurrentStep();
		if (c && c.step_type == "counterSign") {
			multi = true;
		}

		return new SimpleSchema({
			reassign_users: {
				autoform: {
					type: "selectuser",
					userOptions: userOptions,
					showOrg: showOrg,
					multiple: multi
				},
				optional: true,
				type: String,
				label: TAPi18n.__("instance_reassign_user")
			}
		});
	},

	values: function() {
		return {};
	},

	current_step_name: function() {
		var s = InstanceManager.getCurrentStep();
		var name;
		if (s) {
			name = s.name;
		}
		return name || '';
	}
})



Template.reassign_modal.events({

	'show.bs.modal #reassign_modal': function(event) {

		var reassign_users = $("input[name='reassign_users']")[0];

		reassign_users.value = "";
		reassign_users.dataset.values = '';

		$(reassign_users).change();
	},

	'click #reassign_help': function(event, template) {
		Steedos.openWindow(t("reassign_help"));
	},

	'click #reassign_modal_ok': function(event, template) {
		var val = AutoForm.getFieldValue("reassign_users", "reassign");
		if (!val) {
			toastr.error(TAPi18n.__("instance_reassign_error_users_required"));
			return;
		}

		var reason = $("#reassign_modal_text").val();


		var user_ids = val.split(",");

		InstanceManager.reassignIns(user_ids, reason);

		Modal.hide(template);
	},


})