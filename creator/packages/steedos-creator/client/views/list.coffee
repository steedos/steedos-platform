Template.creator_list.onCreated ->
	Session.set("show_filter_option", true)

	this.filter_PTop = new ReactiveVar("-1000px")
	this.filter_PLeft = new ReactiveVar("-1000px")
	this.filter_index = new ReactiveVar()
	this.is_edit_scope = new ReactiveVar()

Template.creator_list.onRendered ->

Template.creator_list.helpers Creator.helpers

Template.creator_list.helpers

	tabular_table: ()->
		return Creator.getTable(Session.get("object_name"))

	hasPermission: (permissionName)->
		permissions = Creator.getPermissions()
		if permissions
			return permissions[permissionName]

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
					query = {}
					if obj.operation == "EQUALS"
						query[obj.field] = 
							$eq: obj.value
					else if obj.operation == "NOT_EQUAL"
						query[obj.field] = 
							$ne: obj.value
					else if obj.operation == "LESS_THAN"
						query[obj.field] = 
							$lt: obj.value
					else if obj.operation == "GREATER_THAN"
						query[obj.field] = 
							$gt: obj.value
					else if obj.operation == "LESS_OR_EQUAL"
						query[obj.field] = 
							$lte: obj.value
					else if obj.operation == "GREATER_OR_EQUAL"
						query[obj.field] = 
							$gte: obj.value
					else if obj.operation == "CONTAINS"
						reg = new RegExp(obj.value, "i")
						query[obj.field] = 
							$regex: reg
					else if obj.operation == "NOT_CONTAIN"
						reg = new RegExp("^((?!" + obj.value + ").)*$", "i")
						query[obj.field] = 
							$regex: reg
					else if obj.operation == "STARTS_WITH"
						reg = new RegExp("^" + obj.value, "i")
						query[obj.field] = 
							$regex: reg
					return query
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
					filters = Creator.evaluateFilters(list_view.filters)
					selector = _.extend selector, filters
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


	itemCount: ()->
		collection = Session.get("object_name")
		info = Tabular.tableRecords.findOne("creator_" + collection)
		return info?.recordsTotal

	list_view_id: ()->
		return Session.get("list_view_id")

	list_views: ()->
		return Creator.getListViews()

	custom_view: ()->
		return Creator.Collections.object_listviews.find({object_name: Session.get("object_name")})

	list_view: ()->
		list_view = Creator.getListView(Session.get("object_name"), Session.get("list_view_id"))
		if list_view?.name != Session.get("list_view_id") and !list_view?._id
			Session.set("list_view_id", list_view.name)
		return list_view

	list_view_visible: ()->
		return Session.get("list_view_visible") and Creator.subs["TabularSetting"].ready()

	doc: ()->
		return Session.get("action_record_id")

	actions: ()->
		actions = Creator.getActions()
		permissions = Creator.getPermissions()

		# 如果是在权限中设置了action，就不需要判断action的visible属性
		if permissions.actions
			return actions
		else
			actions = _.filter actions, (action)->
				if action.on == "list"
					if typeof action.visible == "function"
						return action.visible()
					else
						return action.visible
				else
					return false
			return actions

	left: ()->
		return Template.instance().filter_PLeft?.get()

	top: ()->
		return Template.instance().filter_PTop?.get()

	index: ()->
		return Template.instance().filter_index?.get()
	
	filter_items: ()->
		return Session.get("filter_items")

	filter_item: ()->
		index = Template.instance().filter_index?.get()
		filter_items = Session.get("filter_items")
		if index > -1 and filter_items
			return filter_items[index]

	list_view_scope: ()->
		scope = Session.get("filter_scope")
		if scope == "space"
			return "All"
		else if scope == "mine"
			return "My"

	is_edit_scope: ()->
		return Template.instance().is_edit_scope?.get()

	show_filter_option: ()->
		return Session.get("show_filter_option")

	is_custom_list_view: ()->
		if Creator.Collections.object_listviews.findOne(Session.get("list_view_id"))
			return true
		else
			return false

	is_filter_list_disabled: ()->
		unless Creator.Collections.object_listviews.findOne(Session.get("list_view_id"))
			return "disabled"

	is_filter_changed: ()->
		list_view_obj = Creator.Collections.object_listviews.findOne(Session.get("list_view_id"))
		if list_view_obj
			original_filter_scope = list_view_obj.filter_scope
			original_filter_items = list_view_obj.filters
			current_filter_scope = Session.get("filter_scope")
			current_filter_items = Session.get("filter_items")
			if original_filter_scope == current_filter_scope and JSON.stringify(original_filter_items) == JSON.stringify(current_filter_items)
				return false
			else
				return true

Template.creator_list.events
	# 'click .table-creator tr': (event) ->
	# 	dataTable = $(event.target).closest('table').DataTable();
	# 	rowData = dataTable.row(event.currentTarget).data()
	# 	if rowData
	# 		Session.set 'cmDoc', rowData
	# 		# $('.btn.creator-edit').click();
	# 		FlowRouter.go "/creator/app/" + FlowRouter.getParam("object_name") + "/view/" + rowData._id

	'click .list-action-custom': (event) ->
		objectName = Session.get("object_name")
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Creator.executeAction objectName, this

	'click .list-view-switch': (event)->
		Session.set("list_view_visible", false)
		list_view_id = String(this.name)
		## 强制重新加载Render Tabular，包含columns
		Tracker.afterFlush ()->
			list_view = Creator.getListView(Session.get("object_name"), list_view_id)
			Session.set("list_view_id", list_view_id)
			Session.set("list_view_visible", true)

	'click .custom-list-view-switch': (event)->
		Session.set("list_view_visible", false)
		list_view_id = String(this._id)
		Tracker.afterFlush ()->
			list_view = Creator.getListView(Session.get("object_name"), list_view_id)
			obj = Creator.Collections.object_listviews.findOne(list_view_id)
			filter_items = obj.filters || []
			filter_scope = obj.filter_scope
			Session.set("filter_items", filter_items)
			Session.set("filter_scope", filter_scope)
			Session.set("list_view_id", list_view_id)
			Session.set("list_view_visible", true)
			
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

	# 'scroll .list-table-container > div': (event, template)->
	# 	scrollLeft = $(event.currentTarget).scrollLeft()
	# 	$("table.slds-table thead th", event.currentTarget).each ->
	# 		$(".slds-th__action", this).css("transform", "translate3d(-#{scrollLeft}px, 0px, 0px)")

	# 	$(".JCLRgrips .JCLRgrip", event.currentTarget).each ->
	# 		left = parseInt $(this).data().left
	# 		$(this).data("leftOffset", scrollLeft);
	# 		$(this).css("left", "#{left - scrollLeft}px")

	'mouseenter .list-table-container': (event, template)->
		$("table.slds-table", event.currentTarget).colResizable
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

	'click .btn-filter-list': (event, template)->
		$(event.currentTarget).toggleClass("slds-is-selected")
		$(".filter-list-container").toggleClass("slds-hide")

	'click .close-filter-panel': (event, template)->
		$(".btn-filter-list").removeClass("slds-is-selected")
		$(".filter-list-container").addClass("slds-hide")

	'click .filter-scope': (event, template)->
		template.is_edit_scope.set(true)

		left = $(event.currentTarget).closest(".filter-list-container").offset().left
		top = $(event.currentTarget).closest(".slds-item").offset().top

		offsetLeft = $(event.currentTarget).closest(".slds-template__container").offset().left
		offsetTop = $(event.currentTarget).closest(".slds-template__container").offset().top
		contentHeight = $(event.currentTarget).closest(".slds-item").height()

		# 弹出框的高度和宽度写死
		left = left - offsetLeft - 400 - 6
		top = top - offsetTop - 170/2 + contentHeight/2

		Session.set("show_filter_option", false)
		Tracker.afterFlush ->
			Session.set("show_filter_option", true)
			template.filter_PLeft.set("#{left}px")
			template.filter_PTop.set("#{top}px")

	'click .filter-option-item': (event, template)->
		template.is_edit_scope.set(false)

		index = $(event.currentTarget).closest(".filter-item").index()

		left = $(event.currentTarget).closest(".filter-list-container").offset().left
		top = $(event.currentTarget).closest(".slds-item").offset().top
		contentHeight = $(event.currentTarget).closest(".slds-item").height()

		offsetLeft = $(event.currentTarget).closest(".slds-template__container").offset().left
		offsetTop = $(event.currentTarget).closest(".slds-template__container").offset().top

		# 弹出框的高度和宽度写死
		left = left - offsetLeft - 400 - 6
		top = top - offsetTop - 336/2 + contentHeight/2

		# 计算弹出框是否超出屏幕底部，导致出现滚动条，如果超出，调整top位置
		# 计算方式：屏幕高度 - 弹出框的绝对定位 - 弹出框的高度 - 弹出框父容器position:relative的offsetTop - 弹出框距离屏幕底部10px
		# 如果计算得出值小于0，则调整top，相应上调超出的高度
		windowHeight = $(window).height()
		windowOffset = $(window).height() - top - 336 - offsetTop - 10

		if windowOffset < 0
			top = top + windowOffset

		Session.set("show_filter_option", false)

		Tracker.afterFlush ->
			Session.set("show_filter_option", true)
			template.filter_index.set(index)
			template.filter_PLeft.set("#{left}px")
			template.filter_PTop.set("#{top}px")
	
	'click .add-list-view': (event, template)->
		$(".btn-add-list-view").click()

	'click .add-filter': (event, template)->
		filter_items = Session.get("filter_items")
		filter_items.push({})
		Session.set("filter_items", filter_items)
		setTimeout ->
			template.$(".filter-option-item:last").click()
		, 1

	'click .remove-all-filters': (event, template)->
		Session.set("filter_items", [])

	'click .remove-filter': (event, template)->
		index = $(event.currentTarget).closest(".filter-item").index()
		filter_items = Session.get("filter_items")
		filter_items.splice(index, 1)
		Session.set("filter_items", filter_items)

	'click .cancel-change': (event, template)->
		list_view_id = Session.get("list_view_id")
		filters = Creator.Collections.object_listviews.findOne(list_view_id).filters || []
		filter_scope = Creator.Collections.object_listviews.findOne(list_view_id).filter_scope
		Session.set("filter_items", filters)
		Session.set("filter_scope", filter_scope)

	'click .save-change': (event, template)->
		list_view_id = Session.get("list_view_id")
		filter_items = Session.get("filter_items")
		filter_scope = Session.get("filter_scope")
		filter_items = _.map filter_items, (obj) ->
			if _.isEmpty(obj)
				return false
			else
				return obj
		filter_items = _.compact(filter_items)
		Session.set "list_view_visible", false
		Meteor.call "update_filters", list_view_id, filter_items, filter_scope, (error, result) ->
			Session.set "list_view_visible", true
			if error 
				console.log "error", error 
			else if result
				Session.set("filter_items", filter_items)

	'click .filters-save-as': (event, template)->
		filter_items = Session.get("filter_items")
		filter_items = _.map filter_items, (obj) ->
			if _.isEmpty(obj)
				return false
			else
				return obj
		filter_items = _.compact(filter_items)
		console.log filter_items
		Session.set "cmDoc", {filters: filter_items}
		$(".btn-add-list-view").click()

	'click .select-fields-to-display': (event, template)->
		Modal.show("select_fields")

	'click .delete-list-view': (event, template)->
		list_view_id = Session.get("list_view_id")
		Session.set "cmDoc", {_id: list_view_id}
		$(".btn-delete-list-view").click()

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

Template.creator_list.onDestroyed ->
	object_name = Session.get("object_name")
	if object_name
		Creator.TabularSelectedIds[object_name] = []


AutoForm.hooks addListView:
	onSuccess: (formType,result)->
		list_view_id = result
		Session.set("list_view_visible", false)
		Tracker.afterFlush ()->
			list_view = Creator.getListView(Session.get("object_name"), list_view_id)
			Session.set("list_view_id", list_view_id)
			Session.set("list_view_visible", true)