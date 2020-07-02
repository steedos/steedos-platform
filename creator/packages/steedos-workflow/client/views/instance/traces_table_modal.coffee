Template.traces_table_modal.helpers
	instance: ->
		Session.get("change_date")
		if (Session.get("instanceId"))
			steedos_instance = WorkflowManager.getInstance();
			return steedos_instance;

	maxHeight: ->
		return Template.instance()?.maxHeight.get() - 200 + 'px'

	traces_list_template: ->
		steedos_instance = WorkflowManager.getInstance();
		if InstanceManager.isTableStyle(steedos_instance.form)
			return 'instance_traces_table'
		else
			return 'instance_traces'

	traces_modal_calss: ->
		steedos_instance = WorkflowManager.getInstance();
		if InstanceManager.isTableStyle(steedos_instance.form)
			return 'traces_table_modal'
		else
			return 'traces_modal'

	tracesListData: (instance)->
		return db.instance_traces.findOne({_id:Session.get("instanceId")})?.traces || instance.traces


Template.traces_table_modal.onCreated ->

	$("body").addClass("loading")

	Steedos.subs["instance_traces"].subscribe("instance_traces", Session.get("instanceId"))

	Tracker.autorun () ->
		if Steedos.subs["instance_traces"].ready()
			$("body").removeClass("loading")

	self = this;
#
#	self.tracesData = new ReactiveVar()

#	Meteor.call "get_instance_traces", Session.get("instanceId"), (error, result)->
#		if error
#			toastr.error error
#		else
#			self.tracesData.set(result)
#
#		$("body").removeClass("loading")

	self.maxHeight = new ReactiveVar(
		$(window).height());

	$(window).resize ->
		self.maxHeight?.set($(window).height());

Template.traces_table_modal.onRendered ->

	Modal.allowMultiple = true

	self = this;

	self.maxHeight?.set($(window).height());


Template.traces_table_modal.onDestroyed ->
	console.log("Template.traces_table_modal.onDestroyed...")
	Modal.allowMultiple = false
#	this.tracesData = null
	Steedos.subs["instance_traces"].clear()


Template.traces_table_modal.events

	'click .btn-view-chart-traces': (event, template)->
		if Steedos.isIE()
			toastr.warning t("instance_workflow_chart_ie_warning")
			return
		ins = WorkflowManager.getInstance()
		Steedos.openWindow(Steedos.absoluteUrl("/packages/steedos_workflow-chart/assets/index.html?instance_id=#{ins._id}&type=traces&title=#{encodeURIComponent(encodeURIComponent(ins.name))}"),'workflow_traces_chart')

