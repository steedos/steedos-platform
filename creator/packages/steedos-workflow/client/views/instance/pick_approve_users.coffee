getStepsApproves = ()->
	return WorkflowManager.getInstance()?.step_approve || {}
getStepApproves = (stepId)->
	selectedStepApproves = getStepsApproves()[stepId]
	if selectedStepApproves && !_.isArray(selectedStepApproves)
		selectedStepApproves = [selectedStepApproves]
	return selectedStepApproves;
getStepApproveOptions = (stepId)->
	selectedStepApproveOptions = getStepsApproves()[stepId + '_options'] || []
	if selectedStepApproveOptions && !_.isArray(selectedStepApproveOptions)
		selectedStepApproveOptions = [selectedStepApproveOptions]
	return selectedStepApproveOptions;


Template.instance_pick_approve_users.validate = ()->
	isValid = true
	if $("#pick_approve_users").length > 0
		steps = InstanceManager.pickApproveSteps();
		_.each steps, (step)->
			if step.step_type != "start" && step.step_type != "end" && step.allow_pick_approve_users
				$skipStep = $("[name='skipStep_#{step._id}']");
				hasSkip = false;
				if step.allow_skip && $skipStep.length > 0 && !$($skipStep[0]).prop('checked')
					hasSkip = true
				if !hasSkip
					stepApproves = AutoForm.getFieldValue(step._id, "pick_approve_users");
					if _.isEmpty(stepApproves)
						isValid = false;
						toastr.error("请选择「#{step.name}」步骤的处理人");
	return isValid;

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
			fs.optional = false
			fs.autoform.multiple = s.step_type == 'counterSign'

			fs.type = String

			if fs.autoform.multiple
				fs.type = [String]

			fs.autoform.type = "selectuser"

			schema[s._id] = fs;

		return new SimpleSchema(schema)

	canPickApprove: ()->
		return this.allow_pick_approve_users;
	canPickSkip: ()->
		return this.allow_skip;
	skipStepValue: ()->
		return !_.contains(WorkflowManager.getInstance().skip_steps, this._id)

	stepApproveUsers: ()->
		stepId = this._id;
		stepApproves = ApproveManager.getStepApproveUsers(WorkflowManager.getInstance(), stepId);
		selectedStepApproves = getStepApproves(stepId)
		stepApprovesOptions = getStepApproveOptions(stepId);
		diff = _.difference(_.uniq(stepApprovesOptions), _.pluck(stepApproves, 'id'));
		if !_.isEmpty(diff)
			spaceUsers = WorkflowManager.remoteSpaceUsers.find({user: {$in: diff}}, {fields: {user:1, name:1}})
		# 此段代码用于解决user排序问题
		_.each spaceUsers, (spaceUser)->
			stepApproves.push {id: spaceUser.user, name: spaceUser.name};
		_.each stepApproves, (stepApprove)->
			stepApprove.stepId = stepId;
		rvalue = [];
		orderRvalueIds = stepApprovesOptions;
		if _.isEmpty(orderRvalueIds)
			orderRvalueIds = _.pluck(stepApproves, 'id')
		_.each orderRvalueIds, (uid)->
			stepApprove = _.find stepApproves, (su)->
				return su.id == uid;
			if stepApprove
				rvalue.push(stepApprove)
		return rvalue

	hasSelectedUser: ()->
		selectedStepApproves = getStepApproves(this.stepId)
		return _.contains(selectedStepApproves, this.id)

	inputType: (step)->
		if step.step_type == 'counterSign'
			return 'checkbox';
		else
			return 'radio';

	onlyOne: (array)->
		return array?.length == 1

	showStepApproves: ()->
		return !_.include(['start', 'end'], this.step_type);

getStepsApprovesOptions = ()->
	stepsApprovesOptions = {}
	pickApproveSteps = InstanceManager.pickApproveSteps()
	_.each pickApproveSteps, (step)->
		approvesOptions = []
		$("[id='#{step._id}']").each ()->
			approvesOptions.push(this.value)
		stepsApprovesOptions[step._id] = approvesOptions
	return stepsApprovesOptions;

Template.instance_pick_approve_users.events
	'change .selectUser': (event, template)->
		formValue = AutoForm.getFormValues("pick_approve_users").insertDoc
		stepsApprovesOptions = getStepsApprovesOptions();
		Meteor.call 'set_instance_step_approve', Session.get("instanceId"), formValue, stepsApprovesOptions, ()->
			Meteor.setTimeout ()->
				uuidv1 = require('uuid/v1');
				Session.set("instance_next_user_recalculate", uuidv1())
			, 100
	'change .stepApproveUser': (event, template)->
		userElement = $("[name='#{this.stepId}']")
		if event.currentTarget.checked
			if event.target.type == 'radio'
				values = [this.id]
			else
				values = userElement[0].dataset.values?.split(',') || []
				values.push(this.id);
			userElement[0].dataset.values = values.join(',');
		else
			if event.target.type == 'radio'
				values = []
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
		stepApproves = ApproveManager.getStepApproveUsers(WorkflowManager.getInstance(), this._id)
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

#Template.instance_pick_approve_users.onRendered ()->
#	console.debug('Template.instance_pick_approve_users.onRendered...');
#	this.autorun ()->
#		pickApproveSteps = InstanceManager.pickApproveSteps()
#		Meteor.defer ()->
#			_.each pickApproveSteps, (step)->
#				if($("[id='#{step._id}']").length == 1)
#					console.debug('step._id', step._id);
#					if !$("[id='#{step._id}']")[0].checked
#						$("[id='#{step._id}']").trigger('click')