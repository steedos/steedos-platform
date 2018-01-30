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

	isFilterDirty: ()->
		return Template.instance().filter_dirty_count?.get() > 1
	
	isFilterOpen: ()->
		return Template.instance().is_filter_open?.get()
	
	isChartOpen: ()->
		return Template.instance().is_chart_open?.get()
	
	isChartDisabled: ->
		record_id = Session.get "record_id"
		report = Creator.Reports[record_id] or Creator.getObjectRecord()
		return report?.report_type == "tabular"


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
			renderReport.bind(template)()

	'click .btn-toggle-filter': (event, template)->
		isFilterOpen = template.is_filter_open.get()
		template.is_filter_open.set(!isFilterOpen)

	'click .btn-toggle-chart': (event, template)->
		isChartOpen = !template.is_chart_open.get()
		template.is_chart_open.set(isChartOpen)
		if isChartOpen
			$('#pivotgrid-chart').show()
		else
			$('#pivotgrid-chart').hide()

	'click .btn-settings': (event, template)->
		Modal.show("report_settings", {report_settings: template.report_settings})


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
		datagrid = $('#datagrid').dxDataGrid(
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
		datagrid = $('#datagrid').dxDataGrid(
			dataSource: reportData
			paging: false
			columns: reportColumns
			summary: reportSummary).dxDataGrid('instance')
		return

renderMatrixReport = (reportObject, spaceId)->
	self = this
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
			equalBarWidth: false
			commonSeriesSettings: 
				type: 'bar'
			tooltip:
				enabled: true
			size: 
				height: 300
			adaptiveLayout: 
				width: 450
		).dxChart('instance')
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
	unless reportObject
		reportObject = Creator.Reports[Session.get("record_id")] or Creator.getObjectRecord()
	self = this
	spaceId = Session.get("spaceId")
	filter_items = Tracker.nonreactive ()->
		return Session.get("filter_items")
	filter_scope = Tracker.nonreactive ()->
		return Session.get("filter_scope")
	reportObject.filters = filter_items
	reportObject.filter_scope = filter_scope
	report_settings = Tracker.nonreactive ()->
		return self.report_settings.get()
	reportObject.grouping = report_settings.grouping
	reportObject.totaling = report_settings.totaling
	reportObject.counting = report_settings.counting
	switch reportObject.report_type
		when 'tabular'
			renderTabularReport.bind(self)(reportObject, spaceId)
		when 'summary'
			renderSummaryReport.bind(self)(reportObject, spaceId)
			# renderMatrixReport.bind(self)(reportObject, spaceId)
		when 'matrix'
			renderMatrixReport.bind(self)(reportObject, spaceId)

Template.creator_report.onRendered ->
	DevExpress.localization.locale("zh")
	self = this
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
			self.report_settings.set {grouping: reportObject.grouping, totaling:reportObject.totaling, counting:reportObject.counting}
			if reportObject.report_type == "tabular"
				self.is_chart_open.set false
			renderReport.bind(self)(reportObject)

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
	this.filter_dirty_count = new ReactiveVar(0)
	this.filter_items_for_cancel = new ReactiveVar()
	this.filter_scope_for_cancel = new ReactiveVar()
	this.is_filter_open = new ReactiveVar(false)
	this.is_chart_open = new ReactiveVar(true)
	this.report_settings = new ReactiveVar()

	Template.creator_report.renderReport = renderReport.bind(this)
	
	Template.creator_report.getReportSettings = (->
		return this.report_settings.get()
	).bind(this)