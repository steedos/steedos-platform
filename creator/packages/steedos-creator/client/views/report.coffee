Template.creator_report.helpers Creator.helpers

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
	
	isChartDisabled: ()->
		return Template.instance().is_chart_disabled?.get()
	
	isSavable: ->
		report = Creator.getObjectRecord()
		unless report
			return false
		if report?.owner == Meteor.userId()
			return true
		else
			return Creator.isSpaceAdmin()
	
	isDesignerOpen: ()->
		return Template.instance().is_designer_open?.get()


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
		record_id = Session.get "record_id"
		reportObject = Creator.Reports[record_id] or Creator.getObjectRecord()
		data = {report_settings: template.report_settings}
		if reportObject.report_type == "tabular"
			# 表格模式时只显示总计选项
			data.options = ["totaling"]
		Modal.show("report_settings", data)

	'click .btn-refresh': (event, template)->
		renderReport.bind(template)()

	'click .btn-toggle-designer': (event, template)->
		isOpen = !template.is_designer_open.get()
		template.is_designer_open.set(isOpen)
		reportObject = Creator.Reports[Session.get("record_id")] or Creator.getObjectRecord()
		# 这里isOpen为false时要重写option，且每个子属性都不能省略，比如不能直接把fieldPanel设置为false，因为反复切换设计模式时会出现异常
		switch reportObject.report_type
			when 'tabular'
				if isOpen
					option = 
						allowColumnReordering: true
						allowColumnResizing: true
				else
					option = 
						allowColumnReordering: false
						allowColumnResizing: false
				template.dataGridInstance.option(option)
			when 'summary'
				if isOpen
					option = 
						allowColumnReordering: true
						allowColumnResizing: true
						groupPanel:
							visible: true
				else
					option = 
						allowColumnReordering: false
						allowColumnResizing: false
						groupPanel:
							visible: false
				template.dataGridInstance.option(option)
			when 'matrix'
				if isOpen
					option = 
						fieldPanel:
							showColumnFields: true
							showDataFields: true
							showFilterFields:false
							showRowFields: true
							allowFieldDragging: true
							visible: true
				else
					option = 
						fieldPanel:
							showColumnFields: true
							showDataFields: true
							showFilterFields:false
							showRowFields: true
							allowFieldDragging: true
							visible: false
				template.pivotGridInstance.option(option)

	'click .record-action-save': (event, template)->
		record_id = Session.get "record_id"
		objectName = Session.get("object_name")
		filters = Session.get("filter_items")
		filter_scope = Session.get("filter_scope")
		columns = []
		rows = []
		values = []
		sort = []
		column_width = []
		report_settings = template.report_settings.get()
		report = Creator.getObjectRecord()
		switch report.report_type
			when 'tabular'
				fields = template.dataGridInstance.getVisibleColumns()
				columns = _.where(fields,{"groupIndex":undefined})
				columns = _.sortBy(columns, 'visibleIndex')
				columns = _.pluck(columns,"dataField")
				# 要把*%*换回成符号.保存
				columns = columns.map (n)-> return n.replace(/\*%\*/g,".")
				# 这里rows/values在设计模式下不会有变更，所以直接取原值保存即可
				rows = report.rows
				values = report.values
				fields = _.sortBy(fields,"sortIndex")
				_.each fields, (n,i)->
					fieldKey = n.dataField.replace(/\*%\*/g,".")
					if n.sortOrder
						sort.push [fieldKey,n.sortOrder]
					if n.width
						column_width.push [fieldKey,n.width]
			when 'summary'
				fields = template.dataGridInstance.getVisibleColumns()
				columns = _.where(fields,{"groupIndex":undefined})
				columns = _.sortBy(columns, 'visibleIndex')
				columns = _.pluck(columns,"dataField")
				# 要把*%*换回成符号.保存
				columns = columns.map (n)-> return n.replace(/\*%\*/g,".")
				rows = fields.filter (n)-> return n.groupIndex > -1
				rows = _.sortBy(rows, 'groupIndex')
				rows = _.pluck(rows,"dataField")
				# 要把*%*换回成符号.保存
				rows = rows.map (n)-> return n.replace(/\*%\*/g,".")
				# 这里values在设计模式下不会有变更，所以直接取原值保存即可
				values = report.values
				fields = _.sortBy(fields,"sortIndex")
				_.each fields, (n,i)->
					fieldKey = n.dataField.replace(/\*%\*/g,".")
					if n.sortOrder
						sort.push [fieldKey,n.sortOrder]
					if n.width
						column_width.push [fieldKey,n.width]
			when 'matrix'
				fields = template.pivotGridInstance.getDataSource()._fields
				# 这里之所以要去掉带groupInterval属性的字段，是因为带这个属性的字段都是自动生成的子字段
				# 比如时间类型的字段会额外自动增加三个子字段，分别按年、季、月分组
				columns = _.where(fields,{area:"column","groupInterval":undefined})
				columns = _.sortBy(columns, 'areaIndex')
				columns = _.pluck(columns,"dataField")
				# 要把*%*换回成符号.保存
				columns = columns.map (n)-> return n.replace(/\*%\*/g,".")
				rows = _.where(fields,{area:"row","groupInterval":undefined})
				rows = _.sortBy(rows, 'areaIndex')
				rows = _.pluck(rows,"dataField")
				# 要把*%*换回成符号.保存
				rows = rows.map (n)-> return n.replace(/\*%\*/g,".")
				# _id字段虽然也是自动生成的，但是用户可能会对_id进行顺序变更，所以这里不可以去除_id
				values = _.where(fields,{area:"data"})
				values = _.sortBy(values, 'areaIndex')
				values = _.pluck(values,"dataField")
				# 要把*%*换回成符号.保存
				values = values.map (n)-> return n.replace(/\*%\*/g,".")
				fields = _.sortBy(fields,"sortIndex")
				_.each fields, (n,i)->
					fieldKey = n.dataField.replace(/\*%\*/g,".")
					if n.sortOrder
						sort.push [fieldKey,n.sortOrder]
					if n.width
						column_width.push [fieldKey,n.width]
			else
				columns = report.columns
				rows = report.rows
				values = report.values


				
		options = {}
		options.sort = sort
		options.column_width = column_width
		Creator.getCollection(objectName).update({_id: record_id},{$set:{
			filters: filters
			filter_scope: filter_scope
			columns: columns
			rows: rows
			values: values
			grouping: report_settings.grouping
			totaling: report_settings.totaling
			counting: report_settings.counting
			options: options
		}})
		if template.is_filter_open.get()
			template.is_filter_open.set(false)

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
		field = {
			caption: itemField.label
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

	this.dataGridInstance = datagrid

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
		field = {
			caption: itemField.label
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
		field = {
			caption: groupField.label
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

	this.dataGridInstance = datagrid

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
			caption = rowField.label
			unless caption
				caption = objectName + "_" + rowFieldKey
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
			caption = columnField.label
			unless caption
				caption = objectName + "_" + columnFieldKey
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

	this.pivotGridInstance = pivotGrid

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
				self.dataGridInstance?.dispose()


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
				self.is_chart_disabled.set true
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
	this.is_chart_disabled = new ReactiveVar(false)
	this.is_designer_open = new ReactiveVar(false)
	this.report_settings = new ReactiveVar()
	this.dataGridInstance = null
	this.pivotGridInstance = null

	Template.creator_report.renderReport = renderReport.bind(this)