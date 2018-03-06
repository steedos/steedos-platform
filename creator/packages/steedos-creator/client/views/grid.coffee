dxDataGridInstance = null

_itemClick = (e, curObjectName)->
	record = e.data
	record_permissions = Creator.getRecordPermissions curObjectName, record, Meteor.userId()
	actions = _actionItems(curObjectName, record._id, record_permissions)

	actionSheetItems = _.map actions, (action)->
		return {text: action.label, record: record, action: action, object_name: curObjectName}

	actionSheet = $(".action-sheet").dxActionSheet({
		dataSource: actionSheetItems
		showTitle: false
		usePopover: true
		onItemClick: (value)->
			action = value.itemData.action
			recordId = value.itemData.record._id
			objectName = value.itemData.object_name
			object = Creator.getObject(objectName)
			collectionName = object.label
			name_field_key = object.NAME_FIELD_KEY
			if action.todo == "standard_delete"
				console.log value.itemData
				action_record_title = value.itemData.record[name_field_key]
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
				Session.set("action_collection_name", collectionName)
				Session.set("action_save_and_insert", true)
				Creator.executeAction objectName, action, recordId
				console.log("actionSheet.onItemClick", value)
	}).dxActionSheet("instance");
	
	actionSheet.option("target", e.event.target);
	actionSheet.option("visible", true);

_actionItems = (object_name, record_id, record_permissions)->
	obj = Creator.getObject(object_name)
	actions = Creator.getActions(object_name)
	actions = _.filter actions, (action)->
		if action.on == "record" or action.on == "record_more"
			if action.only_detail
				return false
			if typeof action.visible == "function"
				return action.visible(object_name, record_id, record_permissions)
			else
				return action.visible
		else
			return false
	# if _.isEmpty(actions)
	# 	Meteor.defer ()->
	# 		objectColName = "tabular-col-#{object_name.replace(/\./g,'_')}"
	# 		$(".tabular-col-actions.#{objectColName}").hide()
	return actions

_fields = (object_name, list_view_id)->
	object = Creator.getObject(object_name)
	name_field_key = object.NAME_FIELD_KEY
	fields = [name_field_key]
	if object.list_views
		if object.list_views[list_view_id]?.columns
			fields = object.list_views[list_view_id].columns
		else
			if object.list_views?.default?.columns
				fields = object.list_views.default.columns

	fields = fields.map (n)->
		if object.fields[n]?.type and !object.fields[n].hidden
			return n.split(".")[0]
		else
			return undefined
	
	fields = _.compact(fields)
	return fields

_expandFields = (object_name, columns)->
	expand_fields = []
	fields = Creator.getObject(object_name).fields
	_.each columns, (n)->
		if fields[n].type == "master_detail" || fields[n].type == "lookup"
			ref = fields[n].reference_to
			if !_.isArray(ref)
				ref = [ref]
				
			ref = _.map ref, (o)->
				return Creator.getObject(o).NAME_FIELD_KEY
			
			ref = ref.join(",")
			expand_fields.push(n + "($select=" + ref + ")")
			# expand_fields.push n + "($select=name)"
	return expand_fields

_columns = (object_name, columns, list_view_id, is_related)->
	object = Creator.getObject(object_name)
	grid_settings = Creator.Collections.settings.findOne({object_name: object_name, record_id: "object_gridviews"})
	defaultWidth = _defaultWidth(columns)
	return columns.map (n,i)->
		field = object.fields[n]
		columnItem = 
			cssClass: "slds-cell-edit"
			caption: field.label || TAPi18n.__(object.schema.label(n))
			dataField: n
			alignment: "left"
			cellTemplate: (container, options) ->
				field_name = n
				if /\w+\.\$\.\w+/g.test(field_name)
					# object类型带子属性的field_name要去掉中间的美元符号，否则显示不出字段值
					field_name = n.replace(/\$\./,"")
				cellOption = {_id: options.data._id, val: options.data[n], doc: options.data, field: field, field_name: field_name, object_name:object_name, agreement: "odata"}
				Blaze.renderWithData Template.creator_table_cell, cellOption, container[0]
		
		if grid_settings and grid_settings.settings
			column_width_settings = grid_settings.settings[list_view_id]?.column_width
			column_sort_settings = grid_settings.settings[list_view_id]?.sort
		
		if column_width_settings
			width = column_width_settings[n]
			if width
				columnItem.width = width
			else
				columnItem.width = defaultWidth
		else
			columnItem.width = defaultWidth

		if column_sort_settings and column_sort_settings.length > 0
			_.each column_sort_settings, (sort)->
				if sort[0] == n
					columnItem.sortOrder = sort[1]
		
		unless field.sortable
			columnItem.allowSorting = false
		return columnItem

_defaultWidth = (columns)->
	column_counts = columns.length
	content_width = $(".gridContainer").width() - 46 - 60
	return content_width/column_counts

Template.creator_grid.onRendered ->
	self = this
	self.autorun (c)->
		is_related = self.data.is_related
		object_name = Session.get("object_name")
		creator_obj = Creator.getObject(object_name)

		if !creator_obj
			return

		related_object_name = Session.get("related_object_name")
		name_field_key = creator_obj.NAME_FIELD_KEY
		record_id = Session.get("record_id")
		if is_related
			list_view_id = "recent"
		else
			list_view_id = Session.get("list_view_id")

		if Steedos.spaceId() and (is_related or Creator.subs["CreatorListViews"].ready()) and Creator.subs["TabularSetting"].ready()
			if is_related
				url = "/api/odata/v4/#{Steedos.spaceId()}/#{related_object_name}"
				filter = Creator.getODataRelatedFilter(object_name, related_object_name, record_id)
			else
				url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
				filter = Creator.getODataFilter(list_view_id, object_name)
			
			curObjectName = if is_related then related_object_name else object_name

			selectColumns = Tracker.nonreactive ()->
				grid_settings = Creator.Collections.settings.findOne({object_name: curObjectName, record_id: "object_gridviews"})
				if grid_settings and grid_settings.settings and grid_settings.settings[list_view_id] and grid_settings.settings[list_view_id].column_width
					settingColumns = _.keys(grid_settings.settings[list_view_id].column_width)

				if settingColumns
					defaultColumns = _fields(curObjectName, list_view_id)
					selectColumns = _.intersection(settingColumns, defaultColumns)
					selectColumns = _.union(selectColumns, defaultColumns)
				else
					selectColumns = _fields(curObjectName)
				return selectColumns

			extra_columns = ["owner"]
			object = Creator.getObject(curObjectName)
			if object.list_views?.default?.extra_columns
				extra_columns = _.union extra_columns, object.list_views.default.extra_columns
			
			# 这里如果不加nonreactive，会因为后面customSave函数插入数据造成表Creator.Collections.settings数据变化进入死循环
			showColumns = Tracker.nonreactive ()-> return _columns(curObjectName, selectColumns, list_view_id, is_related)

			# extra_columns不需要显示在表格上，因此不做_columns函数处理
			selectColumns = _.union(selectColumns, extra_columns)
			
			expand_fields = _expandFields(curObjectName, selectColumns)
			showColumns.push
				dataField: "_id_actions"
				width: 46
				allowSorting: false
				allowReordering: false
				headerCellTemplate: (container) ->
					return ""
				cellTemplate: (container, options) ->
					htmlText = """
						<span class="slds-grid slds-grid--align-spread creator-table-actions">
							<div class="forceVirtualActionMarker forceVirtualAction">
								<a class="rowActionsPlaceHolder slds-button slds-button--icon-x-small slds-button--icon-border-filled keyboardMode--trigger" aria-haspopup="true" role="button" title="" href="javascript:void(0);" data-toggle="dropdown">
									<span class="slds-icon_container slds-icon-utility-down">
										<span class="lightningPrimitiveIcon">
											<svg class="slds-icon slds-icon-text-default slds-icon--xx-small" focusable="false" aria-hidden="true" data-key="down">
												<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/packages/steedos_lightning-design-system/client/icons/utility-sprite/symbols.svg#down">
												</use>
											</svg>
										</span>
										<span class="slds-assistive-text" data-aura-rendered-by="15534:0">显示更多信息</span>
									</span>
								</a>
							</div>
						</span>
					"""
					$("<div>").append(htmlText).appendTo(container);
			showColumns.splice 0, 0, 
				dataField: "_id_checkbox"
				width: 60
				allowSorting: false
				allowReordering: false
				headerCellTemplate: (container) ->
					Blaze.renderWithData Template.creator_table_checkbox, {_id: "#", object_name: curObjectName}, container[0]
				cellTemplate: (container, options) ->
					Blaze.renderWithData Template.creator_table_checkbox, {_id: options.data._id, object_name: curObjectName}, container[0]
			
			dxOptions = 
				paging: 
					pageSize: 50
				pager: 
					showPageSizeSelector: true,
					allowedPageSizes: [25, 50, 100],
					showInfo: false,
					showNavigationButtons: true
				showColumnLines: false
				allowColumnReordering: true
				allowColumnResizing: true
				columnResizingMode: "widget"
				showRowLines: true
				savingTimeout: 1000
				stateStoring:{
		   			type: "custom"
					enabled: true
					customSave: (gridState)->
						columns = gridState.columns
						column_width = {}
						sort = []
						columns = _.sortBy(_.values(columns), "visibleIndex")
						_.each columns, (column_obj)->
							if column_obj.width
								column_width[column_obj.dataField] = column_obj.width
							if column_obj.sortOrder
								sort.push [column_obj.dataField, column_obj.sortOrder]
						
						Meteor.call 'grid_settings', curObjectName, list_view_id, column_width, sort,
							(error, result)->
								if error
									console.log error
								else
									console.log "grid_settings success"
				}
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
					expand: expand_fields
				columns: showColumns
				onCellClick: (e)->
					console.log "curObjectName", curObjectName
					if e.column?.dataField ==  "_id_actions"
						_itemClick(e, curObjectName)

				onContentReady: (e)->
					self.data.total.set dxDataGridInstance.totalCount()

			dxDataGridInstance = self.$(".gridContainer").dxDataGrid(dxOptions).dxDataGrid('instance')

Template.creator_grid.helpers Creator.helpers

Template.creator_grid.events
	
	'click .list-item-action': (event, template) ->
		actionKey = event.currentTarget.dataset.actionKey
		objectName = event.currentTarget.dataset.objectName
		recordId = event.currentTarget.dataset.recordId
		object = Creator.getObject(objectName)
		action = object.actions[actionKey]
		collection_name = object.label
		if action.todo == "standard_delete"
			action_record_title = template.$(".list-item-link-"+ recordId).attr("title")
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
		is_related = template.data.is_related
		field = this.field_name

		if this.field.depend_on && _.isArray(this.field.depend_on)
			field = _.clone(this.field.depend_on)
			field.push(this.field_name)
			field = field.join(",")

		objectName = if is_related then Session.get("related_object_name") else Session.get("object_name")
		collection_name = Creator.getObject(objectName).label
		# rowData = this.doc

		Meteor.call "object_record", objectName, this._id, (error, result)->
			if result
				Session.set 'cmDoc', result
				Session.set("action_fields", field)
				Session.set("action_collection", "Creator.Collections.#{objectName}")
				Session.set("action_collection_name", collection_name)
				Session.set("action_save_and_insert", false)
				Session.set 'cmIsMultipleUpdate', true
				Session.set 'cmTargetIds', Creator.TabularSelectedIds?[objectName]
				Meteor.defer ()->
					$(".btn.creator-cell-edit").click()

	'dblclick td': (event) ->
		$(".table-cell-edit", event.currentTarget).click()

	'click td': (event, template)->
		if $(event.currentTarget).find(".slds-checkbox input").length
			# 左侧勾选框不要focus样式功能
			return
		if $(event.currentTarget).parent().hasClass("dx-freespace-row")
			# 最底下的空白td不要focus样式功能
			return
		template.$("td").removeClass("slds-has-focus")
		$(event.currentTarget).addClass("slds-has-focus")

Template.creator_grid.onCreated ->
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(dxDataGridInstance.$element())
	,false
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(dxDataGridInstance.$element())
	,false
	AutoForm.hooks creatorCellEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(dxDataGridInstance.$element())
	,false

Template.creator_grid.onDestroyed ->
	#离开界面时，清除hooks为空函数
	AutoForm.hooks creatorAddForm:
		onSuccess: ()->
			$('#afModal').modal 'hide'
	,true
	AutoForm.hooks creatorEditForm:
		onSuccess: ()->
			$('#afModal').modal 'hide'
	,true
	AutoForm.hooks creatorCellEditForm:
		onSuccess: ()->
			$('#afModal').modal 'hide'
	,true


Template.creator_grid.refresh = ->
	dxDataGridInstance.refresh().done (result)->
		Creator.remainCheckboxState(dxDataGridInstance.$element())
