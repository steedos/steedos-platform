Template.creator_list.onCreated ->
	total = Template.instance().data.total
	this.autorun (c)->
		collection = Session.get("object_name")
		info = Tabular.tableRecords.findOne("creator_" + collection)
		if info and total
			total.set info.recordsTotal

Template.creator_list.onRendered ->

Template.creator_list.helpers Creator.helpers

Template.creator_list.helpers

	tabular_table: ()->
		return Creator.getTable(Session.get("object_name"))

	selector: ()->
		object_name = Session.get("object_name")
		list_view = Creator.getListView(object_name, Session.get("list_view_id"))
		selector = {}
		custom_list_view = Creator.Collections.object_listviews.findOne(Session.get("list_view_id"))
		if custom_list_view
			filters = custom_list_view.filters
			filter_scope = custom_list_view.filter_scope
			if filter_scope == "space"
				selector.space = Session.get("spaceId")
			else if filter_scope == "mine"
				selector.space = Session.get("spaceId")
				selector.owner = Meteor.userId()

			if filters and filters.length > 0
				filters = _.map filters, (obj)->
					return [obj.field, obj.operation, obj.value]
				
				filters = Creator.formatFiltersToMongo(filters)
				selector["$and"] = filters
			return selector
		if Session.get("spaceId") and Meteor.userId()
			if list_view.filter_scope == "spacex"
				selector.space = 
					$in: [null,Session.get("spaceId")]
			else if object_name == "users"
				selector._id = Meteor.userId()
			else if object_name == "spaces"
				selector._id = Session.get("spaceId")
			else
				selector.space = Session.get("spaceId")
			if Session.get("list_view_id") == "recent"
				viewed = Creator.Collections.object_recent_viewed.find({object_name: object_name}).fetch()
				record_ids = _.pluck(viewed, "record_id")
				if record_ids.length == 0
					record_ids = ["nothing"]
				selector._id = 
					"$in": record_ids
			if list_view.filters
				try 
					filters = Creator.formatFiltersToMongo(list_view.filters)
					_.each filters, (filter)->
						selector = _.extend selector, filter
					
					console.log "filters", selector
					if list_view.filter_scope == "mine"
						selector.owner = Meteor.userId()
					return selector
				catch e
					console.log e
					return
			else
				permissions = Creator.getPermissions()
				if permissions.viewAllRecords 
					if list_view.filter_scope == "mine"
						selector.owner = Meteor.userId()
					return selector
				else if permissions.allowRead
					selector.owner = Meteor.userId()
					return selector
		return {_id: "nothing"}

	list_view_visible: ()->
		return Session.get("list_view_visible") and Creator.subs["TabularSetting"].ready()

Template.creator_list.events
			
	'click .list-item-action': (event) ->
		actionKey = event.currentTarget.dataset.actionKey
		objectName = event.currentTarget.dataset.objectName
		recordId = event.currentTarget.dataset.recordId
		object = Creator.getObject(objectName)
		action = object.actions[actionKey]
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Creator.executeAction objectName, action, recordId

	'click .table-cell-edit': (event, template) ->
		field = this.field_name

		if this.field.depend_on && _.isArray(this.field.depend_on)
			field = _.clone(this.field.depend_on)
			field.push(this.field_name)
			field = field.join(",")

		objectName = Session.get("object_name")
		collection_name = Creator.getObject(objectName).label
		dataTable = $(event.currentTarget).closest('table').DataTable()
		tr = $(event.currentTarget).closest("tr")
		rowData = dataTable.row(tr).data()

		if rowData
			Session.set("action_fields", field)
			Session.set("action_collection", "Creator.Collections.#{objectName}")
			Session.set("action_collection_name", collection_name)
			Session.set("action_save_and_insert", false)
			Session.set 'cmDoc', rowData
			Session.set 'cmIsMultipleUpdate', true
			Session.set 'cmTargetIds', Creator.TabularSelectedIds?[objectName]
			Meteor.defer ()->
				$(".btn.creator-cell-edit").click()

	'dblclick .slds-table td': (event) ->
		$(".table-cell-edit", event.currentTarget).click()

	'click .slds-table td': (event, template)->
		$(".slds-table td").removeClass("slds-has-focus")
		$(event.currentTarget).addClass("slds-has-focus")

	# 'scroll .list-table-container > div': (event, template)->
	# 	scrollLeft = $(event.currentTarget).scrollLeft()
	# 	$("table.slds-table thead th", event.currentTarget).each ->
	# 		$(".slds-th__action", this).css("transform", "translate3d(-#{scrollLeft}px, 0px, 0px)")

	# 	$(".JCLRgrips .JCLRgrip", event.currentTarget).each ->
	# 		left = parseInt $(this).data().left
	# 		$(this).data("leftOffset", scrollLeft);
	# 		$(this).css("left", "#{left - scrollLeft}px")

	'mouseenter table.slds-table_resizable-cols': (event, template)->
		template.$("table.slds-table").colResizable
			liveDrag: false
			gripInnerHtml: "<div class='grip' style='width: .25rem;height: 2rem;cursor: col-resize;background: #0070d2;top: 0px;right: 2px;position:  relative;opacity: 0;'></div>"
			resizeMode:'overflow'
			draggingClass: "dragging"
			disabledColumns: [0]
			onResize: ()->
				column_width = {}
				$(".list-table-container table.slds-table thead th").each ->
					field = $("> a", $(this)).attr("aria-label");
					width = $(this).css("width")
					if field
						column_width[field] = width
				object_name = Session.get("object_name")
				list_view_id = Session.get("list_view_id")

				Meteor.call "tabular_column_width_settings", object_name, list_view_id, column_width, (error, result) -> 
					if error 
						console.log "error", error 
					if result
						return

	'click th.slds-is-sortable': (event, template)->
		order = $(event.currentTarget).attr("aria-sort")
		if order == "descending"
			order = "asc"
		else if order == "ascending" 
			order = "desc"
		else
			order = "asc"

		field_name = $("> a", event.currentTarget).attr("aria-label");
		sort = [[field_name, order]]
		object_name = Session.get("object_name")
		list_view_id = Session.get("list_view_id")

		Meteor.call "tabular_sort_settings", object_name, list_view_id, sort, (error, result) -> 
			if error 
				console.log "error", error 
			if result
				return

AutoForm.hooks addListView:
	onSuccess: (formType,result)->
		list_view_id = result
		Session.set("list_view_visible", false)
		Tracker.afterFlush ()->
			list_view = Creator.getListView(Session.get("object_name"), list_view_id)
			Session.set("list_view_id", list_view_id)
			Session.set("list_view_visible", true)