dxDataGridInstance = null

### TO DO LIST
	1.支持$in操作符，实现recent视图
	$eq, $ne, $lt, $gt, $lte, $gte
###

initFilter = (list_view_id, object_name)->
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	custom_list_view = Creator.Collections.object_listviews.findOne(list_view_id)
	selector = []
	if custom_list_view
		filter_scope = custom_list_view.filter_scope
		filters = custom_list_view.filters
		if filter_scope == "mine"
			selector.push ["owner", "=", Meteor.userId()]
		else if filter_scope == "space"
			selector.push ["space", "=", Steedos.spaceId()]

		if filters and filters.length > 0
			selector.push "and"
			filters = _.map filters, (obj)->
				return [obj.field, obj.operation, obj.value]
			
			filters = Creator.formatFiltersToDev(filters)
			_.each filters, (filter)->
				selector.push filter
	else
		# TODO
		if spaceId and userId
			list_view = Creator.getListView(object_name, list_view_id)
			if list_view.filter_scope == "spacex"
				selector.push ["space", "=", null], "or", ["space", "=", space]
			else if object_name == "users"
				selector.push ["_id", "=", userId]
			else if object_name == "spaces"
				selector.push ["_id", "=", spaceId]
			else
				selector.push ["space", "=", spaceId]

			if list_view_id == "recent"
				viewed = Creator.Collections.object_recent_viewed.find({object_name: object_name}).fetch()
				record_ids = _.pluck(viewed, "record_id")
				record_ids = _.uniq(record_ids)
				record_ids = record_ids.join(",or,").split(",")
				id_selector = _.map record_ids, (_id)->
					if _id != "or"
						return ["_id", "=", _id]
					else
						return _id
				selector.push "and", id_selector

			# $eq, $ne, $lt, $gt, $lte, $gte
			# [["is_received", "$eq", true],["destroy_date","$lte",new Date()],["is_destroyed", "$eq", false]]
			if list_view.filters
				filters = Creator.formatFiltersToDev(list_view.filters)
				if filters and filters.length > 0
					selector.push "and"
					_.each filters, (filter)->
						selector.push filter

				if list_view.filter_scope == "mine"
					selector.push "and", ["owner", "=", userId]
			else
				permissions = Creator.getPermissions(object_name)
				if permissions.viewAllRecords
					if list_view.filter_scope == "mine"
						selector.push "and", ["owner", "=", userId]
				else if permissions.allowRead
					selector.push "and", ["owner", "=", userId]
	return selector

Template.creator_grid.onRendered ->
	self = this
	self.autorun (c)->
		object_name = Session.get("object_name")
		name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
		list_view_id = Session.get("list_view_id")
		if Steedos.spaceId() and Creator.subs["CreatorListViews"].ready()
			url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
			filter = initFilter(list_view_id, object_name)
			
			object = Creator.getObject(object_name)
			objectFields = object?.fields
			columns = [name_field_key]
			if object.list_views?.default?.columns
				columns = object.list_views.default.columns
			# 暂时不支持子字段，后续odata支持后要去掉并单独处理子字段相关问题
			columns = columns.map (n,i)->
				return n.split(".")[0]
			extra_columns = ["owner"]
			if object.list_views?.default?.extra_columns
				extra_columns = _.union extra_columns, object.list_views.default.extra_columns
			
			selectColumns = _.union ["_id"], columns, extra_columns
			showColumns = columns.map (n,i)->
				columnItem = 
					dataField: n
					cellTemplate: (container, options) ->
						field = object.fields[n]
						field_name = n
						if /\w+\.\$\.\w+/g.test(field_name)
							# object类型带子属性的field_name要去掉中间的美元符号，否则显示不出字段值
							field_name = n.replace(/\$\./,"")
						cellOption = {_id: options.data._id, val: options.data[n], doc: options.data, field: field, field_name: field_name, object_name:object_name}
						Blaze.renderWithData Template.creator_table_cell, cellOption, container[0]
				return columnItem
			showColumns.push
				dataField: "_id"
				width: 60
				allowSorting: false
				headerCellTemplate: (container) ->
					return ""
				cellTemplate: (container, options) ->
					container.css("overflow", "visible")
					record_permissions = Creator.getRecordPermissions object_name, options.data, Meteor.userId()
					container.html(Blaze.toHTMLWithData Template.creator_table_actions, {_id: options.data._id, object_name: object_name, record_permissions: record_permissions, is_related: false}, container)
			showColumns.splice 0, 0, 
				dataField: "_id"
				width: 80
				allowSorting: false
				headerCellTemplate: (container) ->
					container.html(Blaze.toHTMLWithData Template.creator_table_checkbox, {_id: "#", object_name: object_name}, container)
				cellTemplate: (container, options) ->
					container.html(Blaze.toHTMLWithData Template.creator_table_checkbox, {_id: options.data._id, object_name: object_name}, container)

			dxOptions = 
				dataSource: 
					store: 
						type: "odata"
						version: 4
						url: Steedos.absoluteUrl(url)
						withCredentials: false
						beforeSend: (request) ->
							request.headers['X-User-Id'] = Meteor.userId()
							request.headers['X-Space-Id'] = Steedos.spaceId()
							request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
					select: selectColumns
					filter: filter
				columns: showColumns

			dxDataGridInstance = self.$(".gridContainer").dxDataGrid(dxOptions).dxDataGrid('instance')

Template.creator_grid.helpers Creator.helpers

Template.creator_grid.helpers

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

Template.creator_grid.events
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
			
	'click .list-item-action': (event, template) ->
		actionKey = event.currentTarget.dataset.actionKey
		objectName = event.currentTarget.dataset.objectName
		recordId = event.currentTarget.dataset.recordId
		object = Creator.getObject(objectName)
		action = object.actions[actionKey]
		collection_name = object.label
		if action.todo == "standard_delete"
			action_record_title = template.$(".grid-item-link-"+ recordId).attr("title")
			swal
				title: "删除#{object.label}"
				text: "<div class='delete-creator-warning'>是否确定要删除此#{object.label}？</div>"
				html: true
				showCancelButton:true
				confirmButtonText: t('Delete')
				cancelButtonText: t('Cancel')
				(option) ->
					if option
						Creator.Collections[objectName].remove {_id: recordId}, (error, result) ->
							if error
								toastr.error error.reason
							else
								info = object.label + "\"#{action_record_title}\"" + "已删除"
								toastr.success info
								dxDataGridInstance.refresh()
		else
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
		rowData = this.doc

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
		else
			Creator.TabularSelectedIds[currentObjectName] = []
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
	
	'click .add-list-view': (event, template)->
		$(".btn-add-list-view").click()

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


remainCheckboxState = ()->
	self = dxDataGridInstance.$element()
	# 当数据库数据变化时会重新生成datatable，需要重新把勾选框状态保持住
	checkboxAll = self.find(".select-all")
	unless checkboxAll.length
		return
	currentDataset = checkboxAll[0]?.dataset
	currentObjectName = currentDataset.objectName

	selectedIds = Creator.TabularSelectedIds[currentObjectName]
	unless selectedIds
		return

	checkboxs = self.find(".select-one")
	checkboxs.each (index,item)->
		checked = selectedIds.indexOf(item.dataset.id) > -1
		$(item).prop("checked",checked)

	selectedLength = selectedIds.length
	if selectedLength > 0 and checkboxs.length != selectedLength
		checkboxAll.prop("indeterminate",true)
	else
		checkboxAll.prop("indeterminate",false)
		if selectedLength == 0
			checkboxAll.prop("checked",false)
		else if selectedLength == checkboxs.length
			checkboxAll.prop("checked",true)

Template.creator_grid.onCreated ->
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			# 在最近查看列表中添加记录会重新执行onRendered中的autorun，所以不需要再次刷新数据
			if Session.get("list_view_id") != "recent"
				dxDataGridInstance.refresh().done (result)->
					remainCheckboxState()
	,true
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh().done (result)->
				remainCheckboxState()
	,true
	AutoForm.hooks creatorCellEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh().done (result)->
				remainCheckboxState()
	,true

Template.creator_grid.onDestroyed ->
	object_name = Session.get("object_name")
	if object_name
		Creator.TabularSelectedIds[object_name] = []
	
	#离开界面时，清除hooks为空函数
	AutoForm.hooks creatorAddForm:
		onSuccess: undefined
	,true
	AutoForm.hooks creatorEditForm:
		onSuccess: undefined
	,true
	AutoForm.hooks creatorCellEditForm:
		onSuccess: undefined
	,true
