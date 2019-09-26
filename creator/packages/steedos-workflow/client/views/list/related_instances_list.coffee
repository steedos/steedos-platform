Template.related_instances_list.helpers
	selector: ()->
		unless Meteor.user()
			return {_id: -1}
		query = {space: Session.get("spaceId"), state: {$in: ["pending", "completed"]}}

		flowId = Session.get("related_instances_filter_flow")

		if flowId
			query.flow = flowId

		state = Session.get("related_instances_filter_state")

		if state
			query.state = state

		instance_more_search_selector = Session.get('instance_more_search_selector')
		if (instance_more_search_selector)
			_.keys(instance_more_search_selector).forEach (k)->
				query[k] = instance_more_search_selector[k]

		return query

	filter_flow: ()->
		flowId = Session.get("related_instances_filter_flow")
		if flowId
			return db.flows.findOne(flowId, {name: 1})?.name
		else
			return TAPi18n.__("All flows")



Template.related_instances_list.events
	'click #related_instances_list_search_btn': (event, template) ->
		if $("#related_instances_list_search_key").val() && $("#related_instances_list_search_key").val().length > 1
			dataTable = $(".related-instances-table").DataTable();
			dataTable.search(
				$("#related_instances_list_search_key").val(),
			).draw();
		else if _.isEmpty($("#related_instances_list_search_key").val()?.trim())
			dataTable = $(".related-instances-table").DataTable();
			dataTable.search(
				"",
			).draw();

	'click th.flow-filter,.tabular-filter-by-flow': ()->
		Modal.allowMultiple = true
		WorkflowManager.alertFlowListModel
			title: t("workflow_export_filter")
			showType: "show"
			helpUrl: t("export_filter_help")
			categorie: Session.get("related_instances_filter_categorie")
			flow: Session.get("related_instances_filter_flow")
			clearable: true
			callBack: (options)->
				Session.set("related_instances_filter_flow", options.flow)
				Session.set("related_instances_filter_categorie", options.categorie)

	'click .instance-state': (event, template)->
		console.log "click instance-state"
		Session.set("related_instances_filter_state", event.currentTarget.value)

Template.related_instances_list.onDestroyed ->
	Session.set("related_instances_filter_state", undefined)
	TabularTables.related_instances_tabular.related_instances = []