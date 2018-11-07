_standardQuery = (curObjectName)->
	standard_query = Session.get("standard_query")
	object_fields = Creator.getObject(curObjectName).fields
	if !standard_query or !standard_query.query or !_.size(standard_query.query) or standard_query.object_name != curObjectName
		delete Session.keys["standard_query"]
		return;
	else
		object_name = standard_query.object_name
		query = standard_query.query
		query_arr = []
		if standard_query.is_mini
			_.each query, (val, key)->
				if object_fields[key]
					if ["currency", "number"].includes(object_fields[key].type)
						query_arr.push([key, "=", val])
					else if ["text", "textarea", "html", "select"].includes(object_fields[key].type)
						vals = val.trim().split(" ")
						vals.forEach (val_item)->
							# 特殊字符编码
							val_item = encodeURIComponent(Creator.convertSpecialCharacter(val_item))
							query_arr.push([key, "contains", val_item])
		else
			_.each query, (val, key)->
				if object_fields[key]
					if ["date", "datetime", "currency", "number"].includes(object_fields[key].type)
						query_arr.push([key, ">=", val])
					else if ["text", "textarea", "html"].includes(object_fields[key].type)
						# 特殊字符编码
						val = encodeURIComponent(Creator.convertSpecialCharacter(val))
						query_arr.push([key, "contains", val])
					else if ["boolean"].includes(object_fields[key].type)
						query_arr.push([key, "=", JSON.parse(val)])
					else
						query_arr.push([key, "=", val])
				else
					key = key.replace(/(_endLine)$/, "")
					if object_fields[key] and ["date", "datetime", "currency", "number"].includes(object_fields[key].type)
						query_arr.push([key, "<=", val])

		is_logic_or = if standard_query.is_mini then true else false
		options = is_logic_or: is_logic_or
		return Creator.formatFiltersToDev(query_arr, options)
	
_itemClick = (e, curObjectName, list_view_id)->
	self = this
	record = e.data
	if !record
		return

	if _.isObject(record._id)
		record._id = record._id._value

	record_permissions = Creator.getRecordPermissions curObjectName, record, Meteor.userId()
	actions = _actionItems(curObjectName, record._id, record_permissions)

	if actions.length
		actionSheetItems = _.map actions, (action)->
			return {text: action.label, record: record, action: action, object_name: curObjectName}
	else
		actionSheetItems = [{text: t("creator_list_no_actions_tip")}]
	
	actionSheetOption = 
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
			Session.set("action_fields", undefined)
			Session.set("action_collection", "Creator.Collections.#{objectName}")
			Session.set("action_collection_name", collectionName)
			Session.set("action_save_and_insert", true)
			if action.todo == "standard_delete"
				action_record_title = value.itemData.record[name_field_key]
				Creator.executeAction objectName, action, recordId, action_record_title, list_view_id, ()->
					self.dxDataGridInstance.refresh()
			else
				Creator.executeAction objectName, action, recordId, value.itemElement
	unless actions.length
		actionSheetOption.itemTemplate = (itemData, itemIndex, itemElement)->
			itemElement.html "<span class='text-muted'>#{itemData.text}</span>"

	actionSheet = $(".action-sheet").dxActionSheet(actionSheetOption).dxActionSheet("instance")
	
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
				console.log "action.visible,function:", object_name, record_id, record_permissions
				return action.visible(object_name, record_id, record_permissions)
			else
				return action.visible
		else
			return false
	return actions

_fields = (object_name, list_view_id)->
	object = Creator.getObject(object_name)
	name_field_key = object.NAME_FIELD_KEY
	fields = [name_field_key]
	if Creator.getCollection("object_listviews").findOne(list_view_id)
		fields = Creator.getCollection("object_listviews").findOne(list_view_id).columns
	else if object.list_views
		if object.list_views[list_view_id]?.columns
			fields = object.list_views[list_view_id].columns
		else
			defaultColumns = Creator.getObjectDefaultColumns(object_name)
			if defaultColumns
				fields = defaultColumns

	fields = fields.map (n)->
		if object.fields[n]?.type and !object.fields[n].hidden
			return n.split(".")[0]
		else
			return undefined

	if Creator.isCommonSpace(Session.get("spaceId")) && fields.indexOf("space") < 0
		fields.push('space')

	fields = _.compact(fields)
	fieldsName = Creator.getObjectFieldsName(object_name)
	return _.intersection(fieldsName, fields)

_removeCurrentRelatedFields = (curObjectName, columns, object_name, is_related)->
	# 移除主键字段，即columns中的reference_to等于object_name的字段
	unless object_name
		return columns
	fields = Creator.getObject(curObjectName).fields
	if is_related
		columns = columns.filter (n)->
			if fields[n]?.type == "master_detail"
				if fields[n].multiple
					# 多选字段不移除
					return true
				if fields[n].reference_to
					ref = fields[n].reference_to
					if _.isFunction(ref)
						ref = ref()
				else
					ref = fields[n].optionsFunction({}).getProperty("value")
				if _.isArray(ref)
					return true
				else
					return ref != object_name
			else
				return true
	return columns

_expandFields = (object_name, columns)->
	expand_fields = []
	fields = Creator.getObject(object_name).fields
	_.each columns, (n)->
		if fields[n]?.type == "master_detail" || fields[n]?.type == "lookup"
			if fields[n].reference_to
				ref = fields[n].reference_to
				if _.isFunction(ref)
					ref = ref()
			else
				ref = fields[n].optionsFunction({}).getProperty("value")

			if !_.isArray(ref)
				ref = [ref]
				
			ref = _.map ref, (o)->
				key = Creator.getObject(o)?.NAME_FIELD_KEY || "name"
				return key

			ref = _.compact(ref)

			ref = _.uniq(ref)
			
			ref = ref.join(",")

			if ref
				expand_fields.push(n + "($select=" + ref + ")")
			# expand_fields.push n + "($select=name)"
	return expand_fields

_columns = (object_name, columns, list_view_id, is_related)->
	object = Creator.getObject(object_name)
	grid_settings = Creator.getCollection("settings").findOne({object_name: object_name, record_id: "object_gridviews"})
	defaultWidth = _defaultWidth(columns, object.enable_tree)
	column_default_sort = Creator.transformSortToDX(Creator.getObjectDefaultSort(object_name))
	if grid_settings and grid_settings.settings
		column_width_settings = grid_settings.settings[list_view_id]?.column_width
		column_sort_settings = Creator.transformSortToDX(grid_settings.settings[list_view_id]?.sort)
	list_view = Creator.getListView(object_name, list_view_id)
	list_view_sort = Creator.transformSortToDX(list_view?.sort)
	if column_sort_settings and column_sort_settings.length > 0
		list_view_sort = column_sort_settings
	else if !_.isEmpty(list_view_sort)
		list_view_sort = list_view_sort
	else
		console.log("default sort...")
		#默认读取default view的sort配置
		list_view_sort = column_default_sort
	
	result = columns.map (n,i)->
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
				if field.type is "markdown"
					cellOption["full_screen"] = true
				Blaze.renderWithData Template.creator_table_cell, cellOption, container[0]
		
		if !is_related
			if column_width_settings
				width = column_width_settings[n]
				if width
					columnItem.width = width
				else
					columnItem.width = defaultWidth
			else
				columnItem.width = defaultWidth
		
		unless field.sortable
			columnItem.allowSorting = false
		return columnItem
	
	
	_.each list_view_sort, (sort,index)->
		sortColumn = _.findWhere(result,{dataField:sort[0]})
		if sortColumn
			sortColumn.sortOrder = sort[1]
			sortColumn.sortIndex = index
	
	return result

_defaultWidth = (columns, isTree)->
	column_counts = columns.length
	subWidth = if isTree then 46 else 46 + 60 + 60
	content_width = $(".gridContainer").width() - subWidth
	return content_width/column_counts

_depandOnFields = (object_name, columns)->
	fields = Creator.getObject(object_name).fields
	depandOnFields = []
	_.each columns, (column)->
		if fields[column]?.depend_on
			depandOnFields = _.union(fields[column].depend_on)
	return depandOnFields

Template.creator_grid.onRendered ->
	self = this
	self.autorun (c)->
		is_related = self.data.is_related
		if is_related
			list_view_id = "all"
		else
			list_view_id = Session.get("list_view_id")
		unless list_view_id
			toastr.error t("creator_list_view_permissions_lost")
			return

		object_name = self.data.object_name
		creator_obj = Creator.getObject(object_name)

		if !creator_obj
			return

		related_object_name = self.data.related_object_name
		name_field_key = creator_obj.NAME_FIELD_KEY
		record_id = Session.get("record_id")

		listTreeCompany = Session.get('listTreeCompany')

		if Steedos.spaceId() and (is_related or Creator.subs["CreatorListViews"].ready()) and Creator.subs["TabularSetting"].ready()
			if is_related
				if Creator.getListViewIsRecent(object_name, list_view_id)
					url = "/api/odata/v4/#{Steedos.spaceId()}/#{related_object_name}/recent"
					filter = undefined
				else
					url = "/api/odata/v4/#{Steedos.spaceId()}/#{related_object_name}"
					filter = Creator.getODataRelatedFilter(object_name, related_object_name, record_id)
			else
				if Creator.getListViewIsRecent(object_name, list_view_id)
					url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}/recent"
					filter = undefined
				else
					url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
					filter = Creator.getODataFilter(list_view_id, object_name)

				standardQuery = _standardQuery(object_name)
				console.log "standardQuery", standardQuery
				if standardQuery and standardQuery.length
					if filter
						filter = [filter, "and", standardQuery]
					else
						filter = standardQuery

				if !filter
					filter = ["_id", "<>", -1]

				if listTreeCompany and  listTreeCompany!='undefined' and creator_obj?.filter_company==true
					listTreeFilter = [ "company", "=" , listTreeCompany ]
					filter = [ filter, "and", listTreeFilter ]


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

			pageIndex = Tracker.nonreactive ()->
				if Session.get("page_index")
					if Session.get("page_index").object_name == curObjectName
						page_index = Session.get("page_index").page_index
						return page_index
					else
						delete Session.keys["page_index"]
				else
					return 0

			extra_columns = ["owner"]
			if creator_obj.enable_tree
				extra_columns.push("parent")
			object = Creator.getObject(curObjectName)
			defaultExtraColumns = Creator.getObjectDefaultExtraColumns(object_name)
			if defaultExtraColumns
				extra_columns = _.union extra_columns, defaultExtraColumns
			
			selectColumns = _removeCurrentRelatedFields(curObjectName, selectColumns, object_name, is_related)
			
			# 这里如果不加nonreactive，会因为后面customSave函数插入数据造成表Creator.Collections.settings数据变化进入死循环
			showColumns = Tracker.nonreactive ()-> return _columns(curObjectName, selectColumns, list_view_id, is_related)
			# extra_columns不需要显示在表格上，因此不做_columns函数处理
			selectColumns = _.union(selectColumns, extra_columns)
			selectColumns = _.union(selectColumns, _depandOnFields(curObjectName, selectColumns))
			expand_fields = _expandFields(curObjectName, selectColumns)
			actions = Creator.getActions(curObjectName)
			if actions.length
				showColumns.push
					dataField: "_id_actions"
					width: 46
					allowExporting: false
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
												#{Blaze.toHTMLWithData Template.steedos_button_icon, {class: "slds-icon slds-icon-text-default slds-icon--xx-small", source: "utility-sprite", name:"down"}}
											</span>
											<span class="slds-assistive-text" data-aura-rendered-by="15534:0">显示更多信息</span>
										</span>
									</a>
								</div>
							</span>
						"""
						$("<div>").append(htmlText).appendTo(container);
			
			unless creator_obj.enable_tree
				nameFieldKey = Creator.getObject(curObjectName).NAME_FIELD_KEY
				needToShowLinkForIndexColumn = false
				if selectColumns.indexOf(nameFieldKey) < 0
					needToShowLinkForIndexColumn = true
				showColumns.splice 0, 0, 
					dataField: "_id_checkbox"
					width: 60
					allowExporting: false
					allowSorting: false
					allowReordering: false
					headerCellTemplate: (container) ->
						Blaze.renderWithData Template.creator_table_checkbox, {_id: "#", object_name: curObjectName}, container[0]
					cellTemplate: (container, options) ->
						# console.log('[container]', container)
						# console.log('[options]', options)
						Blaze.renderWithData Template.creator_table_checkbox, {_id: options.data._id, object_name: curObjectName}, container[0]
		
				showColumns.splice 0, 0,
					dataField: "_index"
					width: 60
					allowExporting: true
					allowSorting: false
					allowReordering: false
					caption: ""
					cellTemplate: (container, options) ->
						pageSize = self.dxDataGridInstance.pageSize()
						pageIndex = self.dxDataGridInstance.pageIndex()
						htmlText = options.rowIndex + 1 + pageSize * pageIndex
						if needToShowLinkForIndexColumn
							href = Creator.getObjectUrl(curObjectName, options.data._id)
							htmlText = "<a href=\"#{href}\" class=\"grid-index-link\">#{htmlText}</a>"
							$("<div>").append(htmlText).appendTo(container)
						else
							$("<div>").append(htmlText).appendTo(container)
						
			# console.log "selectColumns", selectColumns
			console.log "filter", filter
			# console.log "expand_fields", expand_fields
			localPageSize = localStorage.getItem("creator_pageSize:"+Meteor.userId())
			if !is_related and localPageSize
				pageSize = localPageSize
			else
				pageSize = 10
				# localStorage.setItem("creator_pageSize:"+Meteor.userId(),10)

			fileName = Creator.getObject(curObjectName).label + "-" + Creator.getListView(curObjectName, list_view_id)?.label
			dxOptions = 
				paging: 
					pageSize: pageSize
				pager: 
					showPageSizeSelector: true,
					allowedPageSizes: [10, 50, 100, 200],
					showInfo: false,
					showNavigationButtons: true
				export:
					enabled: true
					fileName: fileName
					allowExportSelectedData: false
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
						if self.data.is_related
							return
						columns = gridState.columns
						column_width = {}
						sort = []
						if columns and columns.length
							columns = _.sortBy(_.values(columns), "visibleIndex")
							_.each columns, (column_obj)->
								if column_obj.width
									column_width[column_obj.dataField] = column_obj.width
							columns = _.sortBy(_.values(columns), "sortIndex")
							_.each columns, (column_obj)->
								if column_obj.sortOrder
									sort.push {field_name: column_obj.dataField, order: column_obj.sortOrder}
							console.log "==========stateStoring====column_width======", column_width
							console.log "==========stateStoring====sort======", sort
							Meteor.call 'grid_settings', curObjectName, list_view_id, column_width, sort,
								(error, result)->
									if error
										console.log error
									else
										console.log "grid_settings success"
					customLoad: ->
						return {pageIndex: pageIndex}
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
						errorHandler: (error) ->
							if error.httpStatus == 404 || error.httpStatus == 400
								error.message = t "creator_odata_api_not_found"
							else if error.httpStatus == 401
								error.message = t "creator_odata_unexpected_character"
							else if error.httpStatus == 403
								error.message = t "creator_odata_user_privileges"
							else if error.httpStatus == 500
								if error.message == "Unexpected character at 106" or error.message == 'Unexpected character at 374'
									error.message = t "creator_odata_unexpected_character"
							toastr.error(error.message)
						fieldTypes: {
							'_id': 'String'
						}
					select: selectColumns
					filter: filter
					expand: expand_fields
				columns: showColumns
				sorting: 
					mode: "multiple"
				customizeExportData: (col, row)->
					fields = creator_obj.fields
					_.each row, (r)->
						_.each r.values, (val, index)->
							if val
								if val.constructor == Object
									r.values[index] = val.name
								else if val.constructor == Array
									_val = [];
									_.each val, (_v)->
										if _.isString(_v)
											_val.push _v
										else if _.isObject(_v)
											_val.push(_v.name)
									r.values[index] = _val.join(",")
								else if val.constructor == Date
									dataField = col[index]?.dataField
									if fields and fields[dataField]?.type == "date"
										val = moment(val).format('YYYY-MM-DD')
										r.values[index] = val
									else
										utcOffset = moment().utcOffset() / 60
										val = moment(val).add(utcOffset, "hours").format('YYYY-MM-DD H:mm')
										r.values[index] = val
				onCellClick: (e)->
					console.log "curObjectName", curObjectName
					if e.column?.dataField ==  "_id_actions"
						_itemClick.call(self, e, curObjectName)

				onContentReady: (e)->
					if self.data.total
						self.data.total.set self.dxDataGridInstance.totalCount()
					else if self.data.recordsTotal
						recordsTotal = self.data.recordsTotal.get()
						recordsTotal[curObjectName] = self.dxDataGridInstance.totalCount()
						self.data.recordsTotal.set recordsTotal
					unless is_related
						unless creator_obj.enable_tree
							# 不支持tree格式的翻页
							current_pagesize = self.$(".gridContainer").dxDataGrid().dxDataGrid('instance').pageSize()
							self.$(".gridContainer").dxDataGrid().dxDataGrid('instance').pageSize(current_pagesize)
							localStorage.setItem("creator_pageSize:"+Meteor.userId(),current_pagesize)
				onNodesInitialized: (e)->
					if creator_obj.enable_tree
						# 默认展开第一个节点
						rootNode = e.component.getRootNode()
						firstNodeKey = rootNode?.children[0]?.key
						if firstNodeKey
							e.component.expandRow(firstNodeKey)
			if is_related
				dxOptions.pager.showPageSizeSelector = false
			if creator_obj.enable_tree
				dxOptions.keyExpr = "_id"
				dxOptions.parentIdExpr = "parent._id"
				dxOptions.expandNodesOnFiltering = false
				dxOptions.remoteOperations = false
				# dxOptions.expandedRowKeys = ["9b7maW3W2sXdg8fKq"]
				# dxOptions.autoExpandAll = true
				# 不支持tree格式的翻页，因为OData模式下，每次翻页都请求了完整数据，没有意义
				dxOptions.pager = null 
				dxOptions.paging = null 
				console.log "==========dxOptions=======x=========", dxOptions
				self.dxDataGridInstance = self.$(".gridContainer").dxTreeList(dxOptions).dxTreeList('instance')
			else
				console.log "==========dxOptions=======y=========", dxOptions
				self.dxDataGridInstance = self.$(".gridContainer").dxDataGrid(dxOptions).dxDataGrid('instance')
				self.dxDataGridInstance.pageSize(pageSize)
			
Template.creator_grid.helpers Creator.helpers

Template.creator_grid.helpers 
	hideGridContent: ()->
		is_related = Template.instance().data.is_related
		recordsTotal = Template.instance().data.recordsTotal
		related_object_name = Template.instance().data.related_object_name
		if is_related and recordsTotal
			total = recordsTotal.get()?[related_object_name]
			return !total
		else
			return false

Template.creator_grid.events

	'click .table-cell-edit': (event, template) ->
		is_related = template.data.is_related
		field = this.field_name
		full_screen = this.full_screen

		if this.field.depend_on && _.isArray(this.field.depend_on)
			field = _.clone(this.field.depend_on)
			field.push(this.field_name)
			field = field.join(",")

		objectName = if is_related then (template.data?.related_object_name || Session.get("related_object_name")) else Session.get("object_name")
		collection_name = Creator.getObject(objectName).label
		# rowData = this.doc

		Meteor.call "object_record", Session.get("spaceId"), objectName, this._id, (error, result)->
			if result
				Session.set("cmFullScreen", full_screen)
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

	'click .link-detail': (event, template)->
		page_index = Template.instance().dxDataGridInstance.pageIndex()
		object_name = Session.get("object_name")
		Session.set 'page_index', {object_name: object_name, page_index: page_index}

Template.creator_grid.onCreated ->
	self = this
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			self.dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(self.dxDataGridInstance.$element())
	,false
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			self.dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(self.dxDataGridInstance.$element())
	,false
	AutoForm.hooks creatorCellEditForm:
		onSuccess: (formType,result)->
			self.dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(self.dxDataGridInstance.$element())
	,false
	
	AutoForm.hooks creatorAddRelatedForm:
		onSuccess: (formType,result)->
			self.dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(self.dxDataGridInstance.$element())

# Template.creator_grid.onDestroyed ->
# 	#离开界面时，清除hooks为空函数
# 	AutoForm.hooks creatorAddForm:
# 		onSuccess: (formType, result)->
# 			$('#afModal').modal 'hide'
# 			if result.type == "post"
# 				app_id = Session.get("app_id")
# 				object_name = result.object_name
# 				record_id = result._id
# 				url = "/app/#{app_id}/#{object_name}/view/#{record_id}"
# 				FlowRouter.go url
# 	,true
# 	AutoForm.hooks creatorEditForm:
# 		onSuccess: (formType, result)->
# 			$('#afModal').modal 'hide'
# 			if result.type == "post"
# 				app_id = Session.get("app_id")
# 				object_name = result.object_name
# 				record_id = result._id
# 				url = "/app/#{app_id}/#{object_name}/view/#{record_id}"
# 				FlowRouter.go url
# 	,true
# 	AutoForm.hooks creatorCellEditForm:
# 		onSuccess: ()->
# 			$('#afModal').modal 'hide'
# 	,true


Template.creator_grid.refresh = (dxDataGridInstance)->
	dxDataGridInstance.refresh().done (result)->
		Creator.remainCheckboxState(dxDataGridInstance.$element())
