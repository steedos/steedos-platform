Template.creator_report.helpers
	reportObject: ->
		record_id = Session.get "record_id"
		return Creator.Reports[record_id] or Creator.getObjectRecord()

	actions: ()->
		obj = Creator.getObject()
		object_name = obj.name
		record_id = Session.get "record_id"
		permissions = obj.permissions.get()
		actions = _.values(obj.actions) 
		# actions = _.where(actions, {on: "record", visible: true})
		actions = _.filter actions, (action)->
			if action.on == "record"
				if action.only_list_item
					return false
				if typeof action.visible == "function"
					return action.visible(object_name, record_id, permissions)
				else
					return action.visible
			else
				return false
		return actions

	moreActions: ()->
		obj = Creator.getObject()
		object_name = obj.name
		record_id = Session.get "record_id"
		permissions = obj.permissions.get()
		actions = _.values(obj.actions) 
		actions = _.filter actions, (action)->
			if action.on == "record_more"
				if action.only_list_item
					return false
				if typeof action.visible == "function"
					return action.visible(object_name, record_id, permissions)
				else
					return action.visible
			else
				return false
		return actions

	showFilterOption: ()->
		return Session.get("show_filter_option")

	filterLeft: ()->
		return Template.instance().filter_PLeft?.get()

	filterTop: ()->
		return Template.instance().filter_PTop?.get()

	filterIndex: ()->
		return Template.instance().filter_index?.get()
	
	filterItems: ()->
		return Session.get("filter_items")

	filterItem: ()->
		index = Template.instance().filter_index?.get()
		filter_items = Session.get("filter_items")
		if index > -1 and filter_items
			return filter_items[index]

	filterScope: ()->
		scope = Session.get("filter_scope")
		if scope == "space"
			return "All"
		else if scope == "mine"
			return "My"

	isEditScope: ()->
		return Template.instance().is_edit_scope?.get()

	isFilterDirty: ()->
		return Template.instance().filter_dirty_count?.get() > 1
	
	relatedObject: ()->
		record_id = Session.get "record_id"
		reportObject = Creator.Reports[record_id] or Creator.getObjectRecord()
		objectName = reportObject.object_name
		return Creator.getObject(objectName)
	
	isFilterOpen: ()->
		return Template.instance().is_filter_open?.get()


Template.creator_report.events

	'click .record-action-custom': (event, template) ->
		id = Creator.getObjectRecord()._id
		objectName = Session.get("object_name")
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Creator.executeAction objectName, this, id

	'click .btn-filter-scope': (event, template)->
		template.is_edit_scope.set(true)

		left = $(event.currentTarget).closest(".filter-list-container").offset().left
		# top = $(event.currentTarget).closest(".slds-item").offset().top
		top = $(event.currentTarget).closest(".reportsFilterCard").offset().top

		# offsetLeft = $(event.currentTarget).closest(".slds-template__container").offset().left
		# offsetTop = $(event.currentTarget).closest(".slds-template__container").offset().top
		# contentHeight = $(event.currentTarget).closest(".slds-item").height()
		offsetLeft = $(event.currentTarget).closest(".pageBody").offset().left
		offsetTop = $(event.currentTarget).closest(".pageBody").offset().top
		contentHeight = $(event.currentTarget).closest(".reportsFilterCard").height()

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
		if index < 0
			index = 0

		left = $(event.currentTarget).closest(".filter-list-container").offset().left
		top = $(event.currentTarget).closest(".reportsFilterCard").offset().top
		contentHeight = $(event.currentTarget).closest(".reportsFilterCard").height()

		offsetLeft = $(event.currentTarget).closest(".pageBody").offset().left
		offsetTop = $(event.currentTarget).closest(".pageBody").offset().top

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
	
	'click .btn-filter-cancel': (event, template)->
		filter_items = template.filter_items_for_cancel.get()
		filter_scope = template.filter_scope_for_cancel.get()
		Session.set("filter_items", filter_items)
		Session.set("filter_scope", filter_scope)
		Meteor.defer ->
			template.filter_dirty_count.set(1)
	
	'click .btn-filter-apply': (event, template)->
		filter_items = Session.get("filter_items")
		filter_scope = Session.get("filter_scope")
		template.filter_items_for_cancel.set(filter_items)
		template.filter_scope_for_cancel.set(filter_scope)
		Meteor.defer ->
			template.filter_dirty_count.set(1)
			renderReport()

	'click .removeFilter': (event, template)->
		index = $(event.currentTarget).closest(".filter-item").index()
		if index < 0
			index = 0
		filter_items = Session.get("filter_items")
		filter_items.splice(index, 1)
		Session.set("filter_items", filter_items)

	'click .btn-toggle-filter': (event, template)->
		isFilterOpen = template.is_filter_open.get()
		template.is_filter_open.set(!isFilterOpen)

	'click .btn-settings': (event, template)->
		Modal.show("report_settings")

	'click .add-filter': (event, template)->
		filter_items = Session.get("filter_items")
		filter_items.push({})
		Session.set("filter_items", filter_items)
		Meteor.defer ->
			template.$(".filter-option-item:last").click()

	'click .remove-all-filters': (event, template)->
		Session.set("filter_items", [])



renderTabularReport = (reportObject, spaceId)->
	objectName = reportObject.object_name
	objectFields = Creator.getObject(objectName)?.fields
	if _.isEmpty objectFields
		return
	filterFields = reportObject.columns
	filter_scope = reportObject.filter_scope || "space"
	filters = reportObject.filters
	Meteor.call "report_data",{object_name: objectName, space: spaceId, filter_scope: filter_scope, filters: filters, fields: filterFields}, (error, result)->
		if error
			console.error('report_data method error:', error)
			return
		
		reportColumns = reportObject.columns?.map (item, index)->
			itemFieldKey = item.replace(/\./g,"_")
			itemField = objectFields[item.split(".")[0]]
			return {
				caption: itemField.label
				dataField: itemFieldKey
			}
		unless reportColumns
			reportColumns = []
		reportData = result
		pivotGrid = $('#pivotgrid').dxDataGrid(
			dataSource: reportData
			paging: false
			columns: reportColumns).dxDataGrid('instance')
		return

renderSummaryReport = (reportObject, spaceId)->
	objectName = reportObject.object_name
	objectFields = Creator.getObject(objectName)?.fields
	if _.isEmpty objectFields
		return
	filterValueFields = reportObject.values
	filterFields = _.union reportObject.columns, reportObject.rows, filterValueFields
	filterFields = _.without filterFields, null, undefined
	filter_scope = reportObject.filter_scope || "space"
	filters = reportObject.filters
	Meteor.call "report_data",{object_name: objectName, space: spaceId, filter_scope: filter_scope, filters: filters, fields: filterFields}, (error, result)->
		if error
			console.error('report_data method error:', error)
			return
		
		reportColumns = reportObject.columns?.map (item, index)->
			itemFieldKey = item.replace(/\./g,"_")
			itemField = objectFields[item.split(".")[0]]
			return {
				caption: itemField.label
				dataField: itemFieldKey
			}
		unless reportColumns
			reportColumns = []
		reportData = result
		_.each reportObject.rows, (group, index)->
			groupFieldKey = group.replace(/\./g,"_")
			groupField = objectFields[group.split(".")[0]]
			reportColumns.push 
				caption: groupField.label
				dataField: groupFieldKey
				groupIndex: index

		reportSummary = {}
		totalSummaryItems = []
		groupSummaryItems = []
		
		counting = reportObject.counting
		if reportObject.counting == undefined
			counting = true

		if counting
			defaultCounterSum = 
				column: "_id"
				summaryType: "count"
			groupSummaryItems.push defaultCounterSum
			totalSummaryItems.push defaultCounterSum
		
		grouping = reportObject.grouping
		if reportObject.grouping == undefined
			grouping = true
		totaling = reportObject.totaling
		if reportObject.totaling == undefined
			totaling = true

		grouping = if grouping then reportObject.rows?.length else false
		_.each reportObject.values, (value)->
			# unless value.field
			# 	return
			# unless value.operation
			# 	return
			valueFieldKey = value.replace(/\./g,"_")
			valueField = objectFields[value.split(".")[0]]
			operation = "count"
			# 数值类型就定为sum统计，否则默认为计数统计
			if valueField.type == "number"
				operation = "sum"
			summaryItem = 
				column: valueFieldKey
				summaryType: operation
				# displayFormat: value.label
			# sum统计统一设置为在分组统计中按列对齐，其他比如计数统计向左对齐
			if ["sum"].indexOf(operation) > -1
				summaryItem.alignByColumn = true
			if grouping
				groupSummaryItems.push summaryItem
			if totaling
				totalSummaryItems.push summaryItem
		
		# 注意这里如果totalItems/groupItems为空时要赋给空数组，否则第二次执行dxDataGrid函数时，原来不为空的值会保留下来
		reportSummary.totalItems = totalSummaryItems
		reportSummary.groupItems = groupSummaryItems

		console.log "renderSummaryReport.reportSummary:", reportSummary
		pivotGrid = $('#pivotgrid').dxDataGrid(
			dataSource: reportData
			paging: false
			columns: reportColumns
			summary: reportSummary).dxDataGrid('instance')
		return

renderMatrixReport = (reportObject, spaceId)->
	objectName = reportObject.object_name
	objectFields = Creator.getObject(objectName)?.fields
	if _.isEmpty objectFields
		return
	filterValueFields = reportObject.values
	filterFields = _.union reportObject.columns, reportObject.rows, filterValueFields
	filterFields = _.without filterFields, null, undefined
	filter_scope = reportObject.filter_scope || "space"
	filters = reportObject.filters
	Meteor.call "report_data",{object_name: objectName, space: spaceId, filter_scope: filter_scope, filters: filters, fields: filterFields}, (error, result)->
		if error
			console.error('report_data method error:', error)
			return
		
		reportFields = []
		reportData = result
		_.each reportObject.rows, (row)->
			rowFieldKey = row.replace(/\./g,"_")
			rowField = objectFields[row.split(".")[0]]
			caption = rowField.label
			unless caption
				caption = objectName + "_" + rowFieldKey
			reportFields.push 
				caption: caption
				width: 100
				dataField: rowFieldKey
				area: 'row'
		_.each reportObject.columns, (column)->
			columnFieldKey = column.replace(/\./g,"_")
			columnField = objectFields[column.split(".")[0]]
			caption = columnField.label
			unless caption
				caption = objectName + "_" + columnFieldKey
			reportFields.push 
				caption: caption
				width: 100
				dataField: columnFieldKey
				area: 'column'
		
		counting = reportObject.counting
		if reportObject.counting == undefined
			counting = true

		if counting
			defaultCounterSum = 
				caption: "计数"
				dataField: "_id"
				summaryType: "count"
				area: 'data'
			reportFields.push defaultCounterSum
		
		_.each reportObject.values, (value)->
			# unless value.field
			# 	return
			# unless value.operation
			# 	return
			valueFieldKey = value.replace(/\./g,"_")
			valueField = objectFields[value.split(".")[0]]
			operation = "count"
			# 数值类型就定为sum统计，否则默认为计数统计
			if valueField.type == "number"
				operation = "sum"
			caption = valueField.label
			unless caption
				caption = objectName + "_" + valueFieldKey
			switch operation
				when "sum"
					caption = "总和 #{caption}"
					break
				when "count"
					caption = "计数 #{caption}"
					break
			reportFields.push 
				caption: caption
				dataField: valueFieldKey
				# dataType: valueField.type
				summaryType: operation
				area: 'data'

		grouping = reportObject.grouping
		if reportObject.grouping == undefined
			grouping = true
		totaling = reportObject.totaling
		if reportObject.totaling == undefined
			totaling = true

		pivotGridChart = $('#pivotgrid-chart').dxChart(
			commonSeriesSettings: type: 'bar'
			tooltip:
				enabled: true
			size: height: 300
			adaptiveLayout: width: 450).dxChart('instance')
		pivotGrid = $('#pivotgrid').dxPivotGrid(
			paging: false
			allowSortingBySummary: true
			allowFiltering: true
			showBorders: true
			showColumnGrandTotals: totaling
			showRowGrandTotals: totaling
			showRowTotals: grouping
			showColumnTotals: grouping
			fieldChooser: false
			dataSource:
				fields: reportFields
				store: reportData).dxPivotGrid('instance')
		pivotGrid.bindChart pivotGridChart,
			dataFieldsDisplayMode: 'splitPanes'
			alternateDataFields: false
		return

renderReport = (reportObject)->
	console.log "renderReport.reportObject:", reportObject
	unless reportObject
		reportObject = Creator.Reports[Session.get("record_id")] or Creator.getObjectRecord()
	spaceId = Session.get("spaceId")
	filter_items = Tracker.nonreactive ()->
		return Session.get("filter_items")
	filter_scope = Tracker.nonreactive ()->
		return Session.get("filter_scope")
	reportObject.filters = filter_items
	reportObject.filter_scope = filter_scope
	report_settings = Tracker.nonreactive ()->
		return Session.get("report_settings")
	reportObject.grouping = report_settings.grouping
	reportObject.totaling = report_settings.totaling
	reportObject.counting = report_settings.counting
	switch reportObject.report_type
		when 'tabular'
			renderTabularReport(reportObject, spaceId)
		when 'summary'
			renderSummaryReport(reportObject, spaceId)
		when 'matrix'
			renderMatrixReport(reportObject, spaceId)

Template.creator_report.renderReport = renderReport

Template.creator_report.onRendered ->
	DevExpress.localization.locale("zh")
	this.autorun (c)->
		spaceId = Session.get("spaceId")
		unless spaceId
			return
		record_id = Session.get "record_id"
		unless record_id
			return
		if Creator.subs["CreatorRecord"].ready()
			# c.stop()
			reportObject = Creator.Reports[record_id] or Creator.getObjectRecord()
			unless reportObject
				return
			filter_items = reportObject.filters || []
			filter_scope = reportObject.filter_scope
			Session.set("filter_items", filter_items)
			Session.set("filter_scope", filter_scope)
			Session.set("report_settings", {grouping: reportObject.grouping, totaling:reportObject.totaling, counting:reportObject.counting})
			renderReport(reportObject) 

	this.autorun (c)->
		if Creator.subs["CreatorRecord"].ready()
			filter_items = Session.get("filter_items")
			filter_scope = Session.get("filter_scope")
			if filter_items and filter_scope
				filter_dirty_count = Tracker.nonreactive ()->
					return Template.instance().filter_dirty_count.get()
				if filter_dirty_count == 0
					Template.instance().filter_items_for_cancel.set(filter_items)
					Template.instance().filter_scope_for_cancel.set(filter_scope)
				Template.instance().filter_dirty_count.set(filter_dirty_count+1)

Template.creator_report.onCreated ->
	Session.set("show_filter_option", true)

	this.filter_PTop = new ReactiveVar("-1000px")
	this.filter_PLeft = new ReactiveVar("-1000px")
	this.filter_index = new ReactiveVar()
	this.is_edit_scope = new ReactiveVar()
	this.filter_dirty_count = new ReactiveVar(0)
	this.filter_items_for_cancel = new ReactiveVar()
	this.filter_scope_for_cancel = new ReactiveVar()
	this.is_filter_open = new ReactiveVar(false)
