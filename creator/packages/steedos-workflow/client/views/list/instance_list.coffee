Template.instance_list.helpers

	instances: ->
		return db.instances.find({}, {sort: {modified: -1}});

	is_inbox: ->
		return Session.get("box") == "inbox"

	spaceId: ->
		return Session.get("spaceId");

	selector: ->
		unless Meteor.user()
			return {_id: -1}
		query = {space: Session.get("spaceId")}
		if !_.isEmpty Session.get('workflow_categories')
			query.category = {$in: Session.get('workflow_categories')}
		if Session.get("flowId")
			query.flow = Session.get("flowId")
		box = Session.get("box")
		if box == "inbox"
			query.$or = [{inbox_users: Meteor.userId()}, {cc_users: Meteor.userId()}]
			# query.state = {$in: ["pending", "completed"]}
			# query.inbox_users = Meteor.userId()
		else if box == "outbox"
			uid = Meteor.userId()
			query.$or = [{outbox_users: uid}, {$or: [{submitter: uid}, {applicant: uid}], state: "pending"}]
		else if box == "draft"
			query.submitter = Meteor.userId()
			query.state = "draft"
			query.$or = [{inbox_users: {$exists:false}}, {inbox_users: []}]
		else if box == "pending"
			uid = Meteor.userId()
			query.$or = [{submitter: uid}, {applicant: uid}]
			query.state = "pending"
		else if box == "completed"
			query.submitter = Meteor.userId()
			query.state = "completed"
		else if box == "monitor"
			query.state = {$in: ["pending", "completed"]}
			uid = Meteor.userId()
			space = db.spaces.findOne(Session.get("spaceId"))
			if !space
				query.state = "none"

			if !space.admins.contains(uid)
				flow_ids = Tracker.nonreactive(WorkflowManager.getMyAdminOrMonitorFlows)
				# if query.flow
				# 	if !flow_ids.includes(query.flow)
				# 		query.$or = [{submitter: uid}, {applicant: uid}, {inbox_users: uid}, {outbox_users: uid}]
				# else
				# 	query.$or = [{submitter: uid}, {applicant: uid}, {inbox_users: uid}, {outbox_users: uid},
				# 		{flow: {$in: flow_ids}}]
				if query.flow
					if !flow_ids.includes(query.flow)
						query.flow = ""
				else
					query.flow = {$in: flow_ids}

		else
			query.state = "none"

		query.is_deleted = false

		workflowCategory = Session.get("workflowCategory")

		if workflowCategory
			if workflowCategory == '-1'
				category_forms = db.forms.find({category: {
					$in: [null, ""]
				}}, {fields: {_id:1}}).fetch();

				query.form = {$in: category_forms.getProperty("_id")}
			else
				category_forms = db.forms.find({category: workflowCategory}, {fields: {_id:1}}).fetch();

				query.form = {$in: category_forms.getProperty("_id")}



		instance_more_search_selector = Session.get('instance_more_search_selector')
		if (instance_more_search_selector)
			_.keys(instance_more_search_selector).forEach (k)->
				query[k] = instance_more_search_selector[k]

#		Template.instance_list._tableColumns()

		if box isnt "monitor"
			query.is_hidden = { $ne: true }

		return query

	is_display_search_tip: ->
		if Session.get('instance_more_search_selector') or Session.get('instance_search_val') or Session.get("flowId") or Session.get("workflowCategory")
			return ""
		return "display: none;"

	is_select_bar_show: ->
		if Session.get('instance_more_search_selector') or Session.get('instance_search_val') or Session.get("flowId") or Session.get("workflowCategory")
			return "selectbar-is-show"
		else
			return "selectbar-is-hide"

	maxHeight: ->
		return Template.instance()?.maxHeight.get() + 'px'

	hasApproves: ->
		if InstanceManager.getUserInboxInstances().length > 0
			return true
		return false

	filterFlowName: ->
		rev = new Array();

		category = db.categories.findOne(Session.get("workflowCategory"))

		if category
			rev.push category.name

		if Session.get("workflowCategory") == '-1'
			rev.push TAPi18n.__("workflow_no_category")

		flow = db.flows.findOne(Session.get("flowId"))

		if flow
			rev.push flow.name

		return rev

	getInstanceListTabular: ->
		if Session.get("flowId")
			key = "instanceFlow" + Session.get("box") + Session.get("flowId")
			if TabularTables.flowInstances.get()?.name == key
				return TabularTables.flowInstances.get()
			else
				if Session.get("box") == "inbox"
					return TabularTables.inbox_instances
				else if Session.get("box") == "outbox"
					return TabularTables.outbox_instances
				else
					return TabularTables.instances
		else
			if Session.get("box") == "inbox"
				return TabularTables.inbox_instances
			else if Session.get("box") == "outbox"
				return TabularTables.outbox_instances
			else
				return TabularTables.instances

	tableauUrl: ()->
		return SteedosTableau.get_workflow_instance_by_flow_connector(Session.get("spaceId"), Session.get("flowId"))

	showBatchBtn: ()->
		return Session.get("workflow_batch_instances_count") > 0


Template.instance_list._changeOrder = ()->

	table = $(".datatable-instances")?.DataTable();

	if Session.get("box") == 'draft' || Session.get("box") == 'pending' || Session.get("box") == 'completed'
		table?.order([7, 'desc']).draw();
	else if Session.get("box") == 'monitor'
		table?.order([4, 'desc']).draw();
	else if Session.get("box") == 'outbox'
		table?.order([9, 'desc']).draw();

Template.instance_list._tableColumns = ()->

	if !$(".datatable-instances") || $(".datatable-instances").length < 1
		return;

	show = false

	winWidth = $(window).width()
	# if (winWidth > 766) and (winWidth < 1441 or !$("body").hasClass("three-columns"))
	if (winWidth > 766) and (!$("body").hasClass("three-columns"))
		show = true

	if show
		$(".custom-column").hide();
		$(".field-value").hide();
	else
		$(".custom-column").show();
		$(".field-value").show();

	try
		table = $(".datatable-instances").DataTable();
		thead = $("thead", $(".datatable-instances"))

		table.column(0).visible(!show)

		table.column(2).visible(show)

		columnCount = table.columns()[0]?.length || 0

		if Session.get("flowId")
			table.column(5).visible(false)
		else
			table.column(5).visible(show)
		if Session.get("box") == "draft"
			table.column(3).visible(false)
			table.column(4).visible(false)
			table.column(6).visible(false)
			table.column(7).visible(show)
			table.column(8).visible(false)

			if columnCount > 12
				_.range(13, columnCount + 1).forEach (index)->
					table.column(index - 1)?.visible(false)
		else
			table.column(3).visible(show)
			table.column(4).visible(show)
			table.column(6).visible(show)

			if Session.get("box") == "inbox"
				table.column(8).visible(show)
				table.column(7).visible(false)
			else
				table.column(8).visible(false)
				table.column(7).visible(show)

			if columnCount > 12
				_.range(13, columnCount + 1).forEach (index)->
					table.column(index - 1)?.visible(show)

			if Session.get("box") == "outbox"
				table.column(7).visible(false)
				table.column(9).visible(show)
			else
				table.column(9).visible(false)
				table.column(7).visible(show)

		if Session.get("box") == "monitor" && show
			table.column(12).visible(true)
		else
			table.column(12).visible(false)

		if show
			thead.show()
		else
			thead.hide()
	catch e
		console.error e


Template.instance_list.onCreated ->
	self = this;

	self.maxHeight = new ReactiveVar(
		$(window).height());

	self.maxHeight?.set($(".instance-list", $(".steedos")).height());

	self.autorun ()->
		Workflow.renderListColumns()

	# 只有是企业版时，才支持批量审批
	if Steedos.isLegalVersion('',"workflow.enterprise")
		self.autorun ()->
			if Session.get("box") == 'inbox' && Session.get("flowId")

				Session.get("workflow_batch_instances_reload")

				categoryId = Session.get("workflowCategory")

				if Session.get("flowId")
					flows = [Session.get("flowId")]

				Meteor.call 'get_batch_instances_count', Session.get("spaceId"), categoryId, flows, (error, result)->
					if error
						console.error 'error',error
					else
						console.log(result)

						Session.set("workflow_batch_instances_count", result)
			else
				Session.set("workflow_batch_instances_count", 0)

Template.instance_list.onRendered ->
	self = this;

	self.maxHeight?.set($(".instance-list", $(".steedos")).height());

#	Template.instance_list._tableColumns();

	$('[data-toggle="tooltip"]').tooltip()
	if !Steedos.isMobile() && !Steedos.isPad()
		# $(".instance-list > div:eq(2)").addClass("dataTables_container")
		$(".instance-list").perfectScrollbar();
		# $(".instance-list .dataTables_container").perfectScrollbar();

#	Template.instance_list._changeOrder()

	self.autorun ()->
		if Session.get("box")
			Meteor.setTimeout(Template.instance_list._changeOrder, 300)

Template.instance_list.events

	'click tbody > tr': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget).data();
		if (!rowData)
			return;
		if Session.get("instanceId") != rowData._id
			$("body").addClass("loading")

		setTimeout ()->
			dataTable = $(event.target).closest('table').DataTable();
			row = $(event.target).closest('tr');
			rowData = dataTable.row(event.currentTarget).data();
			if (!rowData)
				return;
			box = Session.get("box");
			spaceId = Session.get("spaceId");

			# if row.hasClass('selected')
			# 	row.removeClass('selected');
			# 	FlowRouter.go("/workflow/space/" + spaceId + "/" + box);

			# else
			dataTable.$('tr.selected').removeClass('selected');
			row.addClass('selected');
			FlowRouter.go("/workflow/space/" + spaceId + "/" + box + "/" + rowData._id);
		, 1

	'click #instance_search_tip_close_btn': (event, template) ->
		Session.set("instance_more_search_selector", undefined)
		Session.set("flowId", undefined)
		Session.set("instance-search-state", undefined)
		Session.set("instance-search-name", undefined)
		Session.set("instance-search-appplicant-name", undefined)
		Session.set("instance-search-applicant-organization-name", undefined)
		Session.set("submit-date-start", undefined);
		Session.set("submit-date-end", undefined);
		Session.set("workflowCategory", undefined);
		#清空搜索框
		$('#instance_search').val('')
		$('#instance_search_button').click()

	'click .batch_instances_view > button': ()->
		Modal.show("batch_instances_modal")