Template.creator_list.onCreated ->
	this.edit_fields = new ReactiveVar()

Template.creator_list.helpers Creator.helpers

Template.creator_list.helpers

	collection: ()->
		return "Creator.Collections." + Session.get("object_name")

	collectionName: ()->
		if Session.get("object_name")
			return Creator.getObject(Session.get("object_name")).label

	tabular_table: ()->
		return Creator.getTable(Session.get("object_name"))

	hasPermission: (permissionName)->
		permissions = Creator.getPermissions()
		if permissions
			return permissions[permissionName]


	fields: ->
		return Template.instance()?.edit_fields.get()


	selector: ()->
		object_name = Session.get("object_name")
		list_view = Creator.getListView(object_name, Session.get("list_view_id"))
		selector = {}
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
					filters = Creator.evaluateFilters(list_view.filters)
					selector = _.extend selector, filters
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


	itemCount: ()->
		collection = Session.get("object_name")
		info = Tabular.tableRecords.findOne("creator_" + collection)
		return info?.recordsTotal

	list_view_id: ()->
		return Session.get("list_view_id")

	list_views: ()->
		return Creator.getListViews()

	list_view: ()->
		list_view = Creator.getListView(Session.get("object_name"), Session.get("list_view_id"))
		if list_view?.name != Session.get("list_view_id")
			Session.set("list_view_id", list_view.name)
		return list_view

	list_view_visible: ()->
		return Session.get("list_view_visible")

	doc: ()->
		return Session.get("editing_record_id")

	actions: ()->
		obj = Creator.getObject()
		actions = _.values(obj.actions) 
		# actions = _.where(actions, {on: "list", visible: true})
		actions = _.filter actions, (action)->
			if action.on == "list"
				if typeof action.visible == "function"
					return action.visible()
				else
					return action.visible
			else
				return false
		return actions

Template.creator_list.events
	# 'click .table-creator tr': (event) ->
	# 	dataTable = $(event.target).closest('table').DataTable();
	# 	rowData = dataTable.row(event.currentTarget).data()
	# 	if rowData
	# 		Session.set 'cmDoc', rowData
	# 		# $('.btn.creator-edit').click();
	# 		FlowRouter.go "/creator/app/" + FlowRouter.getParam("object_name") + "/view/" + rowData._id

	'click .list-action-custom': (event) ->
		Creator.executeAction Session.get("object_name"), this

	'click .list-view-switch': (event)->
		Session.set("list_view_visible", false)
		list_view_id = String(this.name)
		## 强制重新加载Render Tabular，包含columns
		Tracker.afterFlush ()->
			list_view = Creator.getListView(Session.get("object_name"), list_view_id)
			Session.set("list_view_id", list_view_id)
			Session.set("list_view_visible", true)

	'click .list-item-action': (event) ->
		actionKey = event.currentTarget.dataset.actionKey
		objectName = event.currentTarget.dataset.objectName
		id = event.currentTarget.dataset.id
		action = Creator.getObject(objectName).actions[actionKey]
		Creator.executeAction objectName, action, id

	'click .table-cell-edit': (event, template) ->
		field = this.field_name

		dataTable = $(event.currentTarget).closest('table').DataTable()
		tr = $(event.currentTarget).closest("tr")
		rowData = dataTable.row(tr).data()

		if rowData
			template.edit_fields.set(field)
			Session.set 'cmDoc', rowData
			Session.set 'cmIsMultipleUpdate', true
			Session.set 'cmTargetIds', Creator.TabularSelectedIds?[Session.get("object_name")]

			setTimeout ()->
				$(".edit-list-table-cell").click()
			, 1

	'dblclick .slds-table td': (event) ->
		$(".table-cell-edit", event.currentTarget).click()

	'change .slds-table .select-one': (event, template)->
		currentDataset = event.currentTarget.dataset
		currentId = currentDataset.id
		currentObjectName = currentDataset.objectName
		
		currentIndex = Creator.TabularSelectedIds[currentObjectName].indexOf currentId
		if $(event.currentTarget).is(":checked")
			if currentIndex < 0
				Creator.TabularSelectedIds[currentObjectName].push currentId
		else
			unless currentIndex < 0
				Creator.TabularSelectedIds[currentObjectName].splice(currentIndex, 1)

		checkboxs = template.$(".select-one")
		checkboxAll = template.$(".select-all")
		selectedLength = Creator.TabularSelectedIds[currentObjectName].length
		if selectedLength > 0 and checkboxs.length != selectedLength
			checkboxAll.prop("indeterminate",true)
		else
			checkboxAll.prop("indeterminate",false)
			if selectedLength == 0
				checkboxAll.prop("checked",false)
			else if selectedLength == checkboxs.length
				checkboxAll.prop("checked",true)

	'change .slds-table .select-all': (event, template)->
		currentDataset = event.currentTarget.dataset
		currentObjectName = currentDataset.objectName
		isSelectedAll = $(event.currentTarget).is(":checked")
		checkboxs = template.$(".select-one")
		if isSelectedAll
			checkboxs.each (i,n)->
				Creator.TabularSelectedIds[currentObjectName].push n.dataset.id
		checkboxs.prop("checked",isSelectedAll)

	'click .slds-table td': (event, template)->
		$(".slds-table td").removeClass("slds-has-focus")
		$(event.currentTarget).addClass("slds-has-focus")

	'scroll .list-table-container > div': (event, template)->
		scrollLeft = $(event.currentTarget).scrollLeft()
		$("table.slds-table thead th", event.currentTarget).each ->
			$(".slds-th__action", this).css("transform", "translate3d(-#{scrollLeft}px, 0px, 0px)")

	# 'mouseenter .list-table-container': (event, template)->
	# 	$("table.slds-table", event.currentTarget).colResizable({
	# 		liveDrag: false,
	# 		gripInnerHtml: "<div class='grip' style='width: .25rem;height: 2rem;cursor: col-resize;background: #0070d2;top: 1px;position:  relative;opacity: 0;'></div>",
	# 		draggingClass: "dragging",
	# 		resizeMode: 'fit',
	# 		disabledColumns: [0],
	# 		onResize: ()->
	# 			$("table.slds-table thead th", event.currentTarget).each ->
	# 				width = $(this).outerWidth()
	# 				$(".slds-th__action", this).css("width", "#{width}px")
	# 	});

Template.creator_list.onDestroyed ->
	object_name = Session.get("object_name")
	if object_name
		Creator.TabularSelectedIds[object_name] = []