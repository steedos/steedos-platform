getStepsApproves = ()->
	return WorkflowManager.getInstance()?.step_approve || {}
getStepApproves = (stepId)->
	selectedStepApproves = getStepsApproves()[stepId]
	if !_.isArray(selectedStepApproves)
		selectedStepApproves = [selectedStepApproves]
	return selectedStepApproves;
Template.instance_pick_approve_users.helpers
	instanceSteps: ()->
		return InstanceManager.pickApproveSteps();

	doc_values: ()->
		return getStepsApproves();

	schema: ()->
		steps = InstanceManager.pickApproveSteps();

		schema = {}

		_.forEach steps, (s)->
			fs = {}
			fs.autoform = {}
			fs.optional = true
#			fs.autoform.multiple = s.step_type == 'counterSign'
			fs.autoform.multiple = true

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

	canPickApprove: ()->
		return this.allow_pick_approve_users;
	canPickSkip: ()->
		return this.allow_skip;
	skipStepValue: ()->
		return !_.contains(WorkflowManager.getInstance().skip_steps, this._id)

	stepApproveUsers: ()->
		console.log('stepApproveU12121212sers1111', this);
		stepId = this._id;
		stepApproves = ApproveManager.getStepApproveUsers(WorkflowManager.getInstance(), stepId);
		selectedStepApproves = getStepApproves(stepId)

		diff = _.difference(selectedStepApproves, _.pluck(stepApproves, 'id'));
		if !_.isEmpty(diff)
			spaceUsers = WorkflowManager.remoteSpaceUsers.find({user: {$in: diff}}, {fields: {user:1, name:1}})
		console.log('diff', diff)
		console.log('spaceUsers2', spaceUsers)
		_.each spaceUsers, (spaceUser)->
			stepApproves.push {id: spaceUser.user, name: spaceUser.name};
		_.each stepApproves, (stepApprove)->
			stepApprove.stepId = stepId;
		return stepApproves

	hasSelectedUser: ()->
		selectedStepApproves = getStepApproves(this.stepId)
		return _.contains(selectedStepApproves, this.id)

Template.instance_pick_approve_users.events
	'change .selectUser': (event, template)->
		formValue = AutoForm.getFormValues("pick_approve_users").insertDoc
		Meteor.call 'set_instance_step_approve', Session.get("instanceId"), formValue, ()->
			Meteor.setTimeout ()->
				uuidv1 = require('uuid/v1');
				Session.set("instance_next_user_recalculate", uuidv1())
			, 100
	'change #stepApproveUser': (event, template)->
		console.log('change #stepApproveUser');
		userElement = $("[name='#{this.stepId}']")
		if event.currentTarget.checked
			values = userElement[0].dataset.values?.split(',') || []
			values.push(this.id);
			userElement[0].dataset.values = values.join(',');
		else
			values = userElement[0].dataset.values?.split(',') || []
			values.remove(_.indexOf(values, this.id))
			userElement[0].dataset.values = values.join(',');
		userElement.trigger('change')

	'change #skipStep': (event, template)->
		stepId = event.currentTarget.value;
		skip = !event.currentTarget.checked;
		action = 'pull';
		if skip
			action = 'push';
		Meteor.call 'set_instance_skip_steps', Session.get("instanceId"), stepId, action, ()->
			Meteor.setTimeout ()->
				uuidv1 = require('uuid/v1');
				Session.set("instance_next_user_recalculate", uuidv1())
			, 100
	'click .action-select-in-range': (event, template)->
		console.log('click .action-select-in-range');
		stepApproves = ApproveManager.getStepApproveUsers(WorkflowManager.getInstance(), this._id)
		console.log('stepApproves', stepApproves);
		userElement = $("[name='#{this._id}']")
		if !_.isEmpty(stepApproves)
			userElement[0].dataset.userOptions = stepApproves.getProperty("id")
			userElement[0].dataset.showOrg = false;
		userElement.click();

	'click .action-select-in-all': (event, template)->
		userElement = $("[name='#{this._id}']")
		delete userElement[0].dataset.userOptions
		delete userElement[0].dataset.showOrg
		userElement.click();