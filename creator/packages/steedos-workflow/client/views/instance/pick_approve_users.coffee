Template.instance_pick_approve_users.helpers
	instanceSteps: ()->
		return InstanceManager.pickApproveSteps();

	doc_values: ()->
		return WorkflowManager.getInstance()?.step_approve || {}

	schema: ()->
		steps = InstanceManager.pickApproveSteps();

		schema = {}

		_.forEach steps, (s)->
			fs = {}
			fs.autoform = {}
			fs.optional = true
			fs.autoform.multiple = s.step_type == 'counterSign'


			fs.type = String

			if fs.autoform.multiple
				fs.type = [String]

			fs.autoform.type = "selectuser"

			fs.beforeOpenFunction = (event, template)->
				company_id = WorkflowManager.getInstance()?.company_id
				if company_id
					company = Creator.odata.get("company", company_id, "organization")
					if company.organization
						event.currentTarget.dataset.rootOrg = company.organization

			schema[s._id] = fs;

		return new SimpleSchema(schema)

Template.instance_pick_approve_users.events
	'change .selectUser': (event, template)->
		formValue = AutoForm.getFormValues("pick_approve_users").insertDoc

		console.log("change .selectUser............................", formValue);

		Meteor.call 'set_instance_step_approve', Session.get("instanceId"), formValue, ()->
			Meteor.setTimeout ()->
				uuidv1 = require('uuid/v1');
				Session.set("instance_next_user_recalculate", uuidv1())
			, 100

