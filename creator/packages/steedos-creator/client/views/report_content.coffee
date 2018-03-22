Template.creator_report_content.helpers Creator.helpers

getFieldLabel = (field, key)->
	fieldLabel = field.label
	unless fieldLabel
		fieldLabel = key.split(".")[0]
	if field.type == "lookup" or field.type == "master_detail"
		if field?.reference_to
			relate_object_Fields = Creator.getObject(field?.reference_to)?.fields
			relate_field = relate_object_Fields[key.split(".")[1]]
			if relate_field?.label
				fieldLabel += " " + relate_field.label
	return fieldLabel


renderTabularReport = (reportObject, reportData)->
	self = this
	objectName = reportObject.object_name
	objectFields = Creator.getObject(objectName)?.fields
	if _.isEmpty objectFields
		toastr.error "未找到对象#{objectName}，请确认该报表指定的对象名是否正确"
		return
	sorts = _.object(reportObject.options?.sort)
	columnWidths = _.object(reportObject.options?.column_width)
	reportColumns = reportObject.columns?.map (item, index)->
		itemFieldKey = item.replace(/\./g,"*%*")
		fieldFirstKey = item.split(".")[0]
		itemField = objectFields[fieldFirstKey]
		caption = getFieldLabel itemField, item
		field = {
			caption: caption
			dataField: itemFieldKey
		}
		if sorts[item]
			field.sortOrder = sorts[item]
		if columnWidths[item]
			field.width = columnWidths[item]
		return field
	unless reportColumns
		reportColumns = []
	
	reportSummary = {}
	totalSummaryItems = []

	totaling = reportObject.totaling
	if reportObject.totaling == undefined
		totaling = true

	if totaling and reportColumns.length

		defaultCounterSum = 
			column: reportColumns[0].dataField #这时不可以用_id，因为_id是不显示的列，只有显示的列才会出现在总计计数中
			summaryType: "count"
			displayFormat: "总计 ({0}条记录)",
		totalSummaryItems.push defaultCounterSum
	
	# 注意这里如果totalItems为空时要赋给空数组，否则第二次执行dxDataGrid函数时，原来不为空的值会保留下来
	reportSummary.totalItems = totalSummaryItems
	

	dxOptions = 
		showColumnLines: false
		columnResizingMode: "widget"
		showRowLines: true
		sorting: 
			mode: "multiple"
		columnAutoWidth: true
		"export":
			enabled: true
			fileName: reportObject.name
		dataSource: reportData
		paging: false
		columns: reportColumns
		summary: reportSummary
	
	datagrid = $('#datagrid').dxDataGrid(dxOptions).dxDataGrid('instance')

	this.dataGridInstance?.set datagrid

renderSummaryReport = (reportObject, reportData)->
	self = this
	objectName = reportObject.object_name
	objectFields = Creator.getObject(objectName)?.fields
	if _.isEmpty objectFields
		toastr.error "未找到对象#{objectName}，请确认该报表指定的对象名是否正确"
		return
	sorts = _.object(reportObject.options?.sort)
	columnWidths = _.object(reportObject.options?.column_width)
	reportColumns = reportObject.columns?.map (item, index)->
		itemFieldKey = item.replace(/\./g,"*%*")
		fieldFirstKey = item.split(".")[0]
		itemField = objectFields[fieldFirstKey]
		itemLabel = getFieldLabel itemField, item
		field = {
			caption: itemLabel
			dataField: itemFieldKey
		}
		if sorts[item]
			field.sortOrder = sorts[item]
		if columnWidths[item]
			field.width = columnWidths[item]
		return field
	unless reportColumns
		reportColumns = []
	_.each reportObject.rows, (group, index)->
		groupFieldKey = group.replace(/\./g,"*%*")
		fieldFirstKey = group.split(".")[0]
		groupField = objectFields[fieldFirstKey]
		groupLabel = getFieldLabel groupField, group
		field = {
			caption: groupLabel
			dataField: groupFieldKey
			groupIndex: index
		}
		if sorts[group]
			field.sortOrder = sorts[group]
		if columnWidths[group]
			field.width = columnWidths[group]
		reportColumns.push field

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
		if !reportObject.values or reportObject.values.indexOf("_id") < 0
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
		if value == "_id"
			if counting
				groupSummaryItems.push defaultCounterSum
				totalSummaryItems.push defaultCounterSum
		else
			valueFieldKey = value.replace(/\./g,"*%*")
			valueField = objectFields[value.split(".")[0]]
			operation = "count"
			# 数值类型就定为sum统计，否则默认为计数统计
			if valueField.type == "number" or valueField.type == "currency"
				operation = "sum"
			if valueField.type == "lookup" or valueField.type == "master_detail"
				if valueField?.reference_to
					relate_object_Fields = Creator.getObject(valueField?.reference_to)?.fields
					relate_valueField = relate_object_Fields[value.split(".")[1]]
					if relate_valueField?.type == "number" or relate_valueField?.type == "currency"
						operation = "sum"
			switch operation
				when "sum"
					caption = "总和: {0}"
					break
				when "count"
					caption = "计数: {0}"
					break
			summaryItem = 
				displayFormat: caption
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

	dxOptions = 
		columnResizingMode: "widget"
		sorting: 
			mode: "multiple"
		columnAutoWidth: true
		"export":
			enabled: true
			fileName: reportObject.name
		dataSource: reportData
		paging: false
		columns: reportColumns
		summary: reportSummary

	datagrid = $('#datagrid').dxDataGrid(dxOptions).dxDataGrid('instance')

	this.dataGridInstance?.set datagrid

renderMatrixReport = (reportObject, reportData, isOnlyForChart)->
	self = this
	objectName = reportObject.object_name
	objectFields = Creator.getObject(objectName)?.fields
	if _.isEmpty objectFields
		toastr.error "未找到对象#{objectName}，请确认该报表指定的对象名是否正确"
		return
	sorts = _.object(reportObject.options?.sort)
	columnWidths = _.object(reportObject.options?.column_width)
	reportFields = []
	_.each reportObject.rows, (row)->
		if row != "_id"
			rowFieldKey = row.replace(/\./g,"*%*")
			fieldFirstKey = row.split(".")[0]
			rowField = objectFields[fieldFirstKey]
			caption = getFieldLabel rowField, row
			field = {
				expanded: isOnlyForChart
				caption: caption
				width: 100
				dataField: rowFieldKey
				area: 'row'
			}
			if sorts[row]
				field.sortOrder = sorts[row]
			if columnWidths[row]
				field.width = columnWidths[row]
			reportFields.push field
	# 如果是为摘要等其他类型报表加载Chart，则统计是以行为准，列只用来显示
	columns = if isOnlyForChart then reportObject.rows else reportObject.columns
	_.each columns, (column)->
		if column != "_id"
			columnFieldKey = column.replace(/\./g,"*%*")
			fieldFirstKey = column.split(".")[0]
			columnField = objectFields[fieldFirstKey]
			caption = getFieldLabel columnField, column
			field = {
				caption: caption
				width: 100
				dataField: columnFieldKey
				area: 'column'
			}
			if sorts[column]
				field.sortOrder = sorts[column]
			if columnWidths[column]
				field.width = columnWidths[column]
			reportFields.push field
	
	counting = reportObject.counting
	if reportObject.counting == undefined
		counting = true

	if counting
		defaultCounterSum = 
			caption: "计数"
			dataField: "_id"
			summaryType: "count"
			area: 'data'
		if !reportObject.values or reportObject.values.indexOf("_id") < 0
			reportFields.push defaultCounterSum
	
	_.each reportObject.values, (value)->
		if value == "_id"
			if counting
				reportFields.push defaultCounterSum
		else
			valueFieldKey = value.replace(/\./g,"*%*")
			valueField = objectFields[value.split(".")[0]]
			operation = "count"
			# 数值类型就定为sum统计，否则默认为计数统计
			if valueField.type == "number" or valueField.type == "currency"
				operation = "sum"
			if valueField.type == "lookup" or valueField.type == "master_detail"
				if valueField?.reference_to
					relate_object_Fields = Creator.getObject(valueField?.reference_to)?.fields
					relate_valueField = relate_object_Fields[value.split(".")[1]]
					if relate_valueField?.type == "number" or relate_valueField?.type == "currency"
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
	
	pivotGridChart = $('#pivotgrid-chart').show().dxChart(
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
	dxOptions = 
		columnResizingMode: "widget"
		sorting: 
			mode: "multiple"
		paging: false
		allowSortingBySummary: true
		allowSorting: true
		allowFiltering: false
		showColumnGrandTotals: totaling
		showRowGrandTotals: totaling
		showRowTotals: grouping
		showColumnTotals: grouping
		fieldChooser: false
		"export":
			enabled: true
			fileName: reportObject.name
		dataSource:
			fields: reportFields
			store: reportData
	pivotGrid = $('#pivotgrid').show().dxPivotGrid(dxOptions).dxPivotGrid('instance')
	pivotGrid.bindChart pivotGridChart,
		dataFieldsDisplayMode: 'splitPanes'
		alternateDataFields: false

	if isOnlyForChart
		$('#pivotgrid').hide()
	
	
	if _.where(reportFields,{area:"data"}).length
		self.is_chart_open.set(true)
		self.is_chart_disabled.set(false)
	else
		self.is_chart_open.set(false)
		self.is_chart_disabled.set(true)
		$('#pivotgrid-chart').hide()

	this.pivotGridInstance?.set pivotGrid

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
	
	objectName = reportObject.object_name
	filterFields = _.union reportObject.columns, reportObject.rows, reportObject.values
	filterFields = _.without filterFields, null, undefined
	filter_scope = reportObject.filter_scope || "space"
	filters = reportObject.filters
	object = Creator.getObject(objectName)
	unless object
		toastr.error "未找到对象#{objectName}，请确认该报表指定的对象名是否正确"
		return
	if filters and filters.length > 0
		filters = _.map filters, (obj)->
			return [obj.field, obj.operation, obj.value]
		
		filters = Creator.formatFiltersToMongo(filters)
	Meteor.call "report_data",{object_name: objectName, space: spaceId, filter_scope: filter_scope, filters: filters, fields: filterFields}, (error, result)->
		if error
			console.error('report_data method error:', error)
			return
		switch reportObject.report_type
			when 'tabular'
				renderTabularReport.bind(self)(reportObject, result)
			when 'summary'
				renderMatrixReport.bind(self)(reportObject, result, true)
				renderSummaryReport.bind(self)(reportObject, result)
			when 'matrix'
				renderMatrixReport.bind(self)(reportObject, result)
				# 报表类型从summary转变成matrix时，需要把原来summary报表清除
				self.dataGridInstance?.get()?.dispose()


Template.creator_report_content.onRendered ->
	DevExpress.localization.locale("zh")
	self = this.data
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
				self.is_chart_disabled.set true
			renderReport.bind(self)(reportObject)

Template.creator_report_content.onCreated ->
	Template.creator_report_content.renderReport = renderReport.bind(this.data)