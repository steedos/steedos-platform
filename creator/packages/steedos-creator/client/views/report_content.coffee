Template.creator_report_content.helpers Creator.helpers

getODataFilterForReport = (object_name, filter_scope, filters)->
	unless object_name
		return ["_id", "=", -1]
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	selector = []
	if spaceId and userId
		if object_name == "users"
			selector.push ["_id", "=", userId]

		if filters and filters.length > 0
			filters = _.map filters, (obj)->
				return [obj.field, obj.operation, obj.value]
			filters = Creator.formatFiltersToDev(filters)
			if filters and filters.length > 0
				if selector.length > 0
					selector.push "and"
				_.each filters, (filter)->
					if object_name != 'spaces' || (filter.length > 0 && filter[0] != "_id")
						selector.push filter

			if filter_scope == "mine"
				if selector.length > 0
					selector.push "and"
				selector.push ["owner", "=", userId]
		else
			permissions = Creator.getPermissions(object_name)
			if permissions.viewAllRecords
				if filter_scope == "mine"
					if selector.length > 0
						selector.push "and"
					selector.push ["owner", "=", userId]
			else if permissions.allowRead
				if selector.length > 0
					selector.push "and"
				selector.push ["owner", "=", userId]

	if selector.length == 0
		# 不可以返回undefined，因为它不能实现清除过虑条件
		return null
	return selector

getReportContent = ()->
	self = this
	filters = Session.get("filter_items")
	filter_scope = Session.get("filter_scope")
	columns = []
	rows = []
	values = []
	sort = []
	column_width = []
	report_settings = self.report_settings.get()
	report = Creator.getObjectRecord()
	switch report.report_type
		when 'tabular'
			fields = self.dataGridInstance.get()?.getVisibleColumns()
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
			fields = self.dataGridInstance.get()?.getVisibleColumns()
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
			fields = self.pivotGridInstance.get()?.getDataSource()._fields
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
	return {
		filters: filters
		filter_scope: filter_scope
		columns: columns
		rows: rows
		values: values
		charting: self.is_chart_open.get()
		grouping: report_settings.grouping
		totaling: report_settings.totaling
		counting: report_settings.counting
		options: options
	}

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

pivotGridChart = null

renderChart = (self)->
	record_id = Session.get("record_id")
	reportObject = Creator.Reports[record_id] or Creator.getObjectRecord()
	unless reportObject
		return
	if reportObject?.report_type == "summary"
		grid = Tracker.nonreactive ()->
			return self.dataGridInstance.get()
		unless grid
			return
		objectName = reportObject.object_name
		objectFields = Creator.getObject(objectName)?.fields
		unless objectFields
			return
		groupSums = grid._options.summary.groupItems
		dataSourceItems = grid.getDataSource().items()
		chartData = []
		chartPanes = []
		chartSeries = []
		chartValueAxis = []
		keyOption = ""
		chartItem = {}
		serie = {}
		tempPaneName = ""
		tempSummaryType = ""
		tempKey = ""
		tempAxisText = ""
		_.each groupSums, (gs, index1)->
			tempSummaryType = gs.summaryType
			tempPaneName = "#{gs.column}_#{tempSummaryType}"
			chartPanes.push name: tempPaneName
			tempAxisText = if tempSummaryType == "count" then "计数" else "总和"
			unless gs.column == "_id"
				fieldName = objectFields[gs.column]?.label
				unless fieldName
					fieldName = gs.column
				tempAxisText += " #{fieldName}"
			chartValueAxis.push pane: tempPaneName, title: { text: tempAxisText }
			_.each dataSourceItems, (dsi, index2)->
				tempKey = "key#{index2 + 1}"
				chartItem = {}
				chartItem[tempKey] = dsi.key
				chartItem[tempSummaryType] = dsi.aggregates[index1]
				chartData.push chartItem
				chartSeries.push pane: tempPaneName, valueField: tempSummaryType, name: "#{dsi.key} #{tempSummaryType}", argumentField: tempKey


		pivotGridChart = $("#pivotgrid-chart").show().dxChart({
			dataSource: chartData, 
			commonSeriesSettings: {
				type: "bar"
			},
			equalBarWidth: false,
			panes: chartPanes,
			series: chartSeries,
			valueAxis: chartValueAxis
		}).dxChart('instance')
	else
		grid = Tracker.nonreactive ()->
			return self.pivotGridInstance.get()
		unless grid
			return
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
		grid.bindChart pivotGridChart,
			dataFieldsDisplayMode: 'splitPanes'
			alternateDataFields: false

renderTabularReport = (reportObject)->
	self = this
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	selectColumns = []
	expandFields = []
	objectName = reportObject.object_name
	objectFields = Creator.getObject(objectName)?.fields
	if _.isEmpty objectFields
		toastr.error "未找到对象#{objectName}，请确认该报表指定的对象名是否正确"
		return
	sorts = _.object(reportObject.options?.sort)
	columnWidths = _.object(reportObject.options?.column_width)
	reportColumns = reportObject.columns?.map (item, index)->
		# itemFieldKey = item.replace(/\./g,"*%*")
		fieldKeys = item.split(".")
		selectColumns.push(fieldKeys[0])
		if fieldKeys.length > 1
			expandFields.push("#{fieldKeys[0]}($select=#{fieldKeys[1]})")
		itemField = objectFields[fieldKeys[0]]
		caption = getFieldLabel itemField, item
		field = {
			caption: caption
			dataField: item
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
	
	_.every reportColumns, (n)->
		n.sortingMethod = Creator.sortingMethod

	pageSize = 10000
	url = "/api/odata/v4/#{spaceId}/#{objectName}?$top=#{pageSize}&$count=true"
	selectColumns = _.uniq selectColumns
	expandFields = _.uniq expandFields
	filter = getODataFilterForReport reportObject.object_name, reportObject.filter_scope, reportObject.filters
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
		dataSource: 
			select: selectColumns
			filter: filter
			expand: expandFields
			store: 
				type: "odata",
				version: 4,
				url: Steedos.absoluteUrl(url)
				withCredentials: false,
				beforeSend: (request) ->
					request.headers['X-User-Id'] = userId
					request.headers['X-Space-Id'] = spaceId
					request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
				onLoaded: (loadOptions)->
					self.is_chart_open.set(false)
					self.is_chart_disabled.set(true)
					$('#pivotgrid-chart').hide()
					return
				errorHandler: (error) ->
					if error.httpStatus == 404 || error.httpStatus == 400
						error.message = t "creator_odata_api_not_found"
		paging: false
		scrolling: 
			mode: "virtual"
		columns: reportColumns
		summary: reportSummary
	
	
	datagrid = $('#datagrid').dxDataGrid(dxOptions).dxDataGrid('instance')

	self.dataGridInstance?.set datagrid

renderSummaryReport = (reportObject)->
	self = this
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	selectColumns = []
	expandFields = []
	objectName = reportObject.object_name
	objectFields = Creator.getObject(objectName)?.fields
	if _.isEmpty objectFields
		toastr.error "未找到对象#{objectName}，请确认该报表指定的对象名是否正确"
		return
	sorts = _.object(reportObject.options?.sort)
	columnWidths = _.object(reportObject.options?.column_width)
	reportColumns = reportObject.columns?.map (item, index)->
		# itemFieldKey = item.replace(/\./g,"*%*")
		fieldKeys = item.split(".")
		selectColumns.push(fieldKeys[0])
		if fieldKeys.length > 1
			expandFields.push("#{fieldKeys[0]}($select=#{fieldKeys[1]})")
		itemField = objectFields[fieldKeys[0]]
		itemLabel = getFieldLabel itemField, item
		field = {
			caption: itemLabel
			dataField: item
		}
		if sorts[item]
			field.sortOrder = sorts[item]
		if columnWidths[item]
			field.width = columnWidths[item]
		return field
	unless reportColumns
		reportColumns = []
	_.each reportObject.rows, (group, index)->
		# groupFieldKey = group.replace(/\./g,"*%*")
		fieldKeys = group.split(".")
		selectColumns.push(fieldKeys[0])
		if fieldKeys.length > 1
			expandFields.push("#{fieldKeys[0]}($select=#{fieldKeys[1]})")
		groupField = objectFields[fieldKeys[0]]
		groupLabel = getFieldLabel groupField, group
		field = {
			caption: groupLabel
			dataField: group
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
			# valueFieldKey = value.replace(/\./g,"*%*")
			fieldKeys = value.split(".")
			selectColumns.push(fieldKeys[0])
			if fieldKeys.length > 1
				expandFields.push("#{fieldKeys[0]}($select=#{fieldKeys[1]})")
			valueField = objectFields[fieldKeys[0]]
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
				column: value
				summaryType: operation
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

	_.every reportColumns, (n)->
		n.sortingMethod = Creator.sortingMethod

	pageSize = 10000
	url = "/api/odata/v4/#{spaceId}/#{objectName}?$top=#{pageSize}&$count=true"
	selectColumns = _.uniq selectColumns
	expandFields = _.uniq expandFields
	filter = getODataFilterForReport reportObject.object_name, reportObject.filter_scope, reportObject.filters
	dxOptions = 
		columnResizingMode: "widget"
		sorting: 
			mode: "multiple"
		columnAutoWidth: true
		"export":
			enabled: true
			fileName: reportObject.name
		dataSource: 
			select: selectColumns
			filter: filter
			expand: expandFields
			store: 
				type: "odata",
				version: 4,
				url: Steedos.absoluteUrl(url)
				withCredentials: false,
				beforeSend: (request) ->
					request.headers['X-User-Id'] = userId
					request.headers['X-Space-Id'] = spaceId
					request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
				onLoaded: (loadOptions)->
					if groupSummaryItems.length
						if reportObject.charting
							self.is_chart_open.set(true)
							self.is_chart_open.dep.changed()
						else
							self.is_chart_open.set(false)
						self.is_chart_disabled.set(false)
					else
						self.is_chart_open.set(false)
						self.is_chart_disabled.set(true)
						$('#pivotgrid-chart').hide()
					return
				errorHandler: (error) ->
					if error.httpStatus == 404 || error.httpStatus == 400
						error.message = t "creator_odata_api_not_found"
		scrolling: 
			mode: "virtual"
		columns: reportColumns
		summary: reportSummary
	datagrid = $('#datagrid').dxDataGrid(dxOptions).dxDataGrid('instance')

	this.dataGridInstance?.set datagrid

renderMatrixReport = (reportObject)->
	self = this
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	selectColumns = []
	expandFields = []
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
			# rowFieldKey = row.replace(/\./g,"*%*")
			fieldKeys = row.split(".")
			selectColumns.push(fieldKeys[0])
			if fieldKeys.length > 1
				expandFields.push("#{fieldKeys[0]}($select=#{fieldKeys[1]})")
			rowField = objectFields[fieldKeys[0]]
			caption = getFieldLabel rowField, row
			field = {
				caption: caption
				width: 100
				dataField: row
				area: 'row'
			}
			if sorts[row]
				field.sortOrder = sorts[row]
			if columnWidths[row]
				field.width = columnWidths[row]
			reportFields.push field
	_.each reportObject.columns, (column)->
		if column != "_id"
			# columnFieldKey = column.replace(/\./g,"*%*")
			fieldKeys = column.split(".")
			selectColumns.push(fieldKeys[0])
			if fieldKeys.length > 1
				expandFields.push("#{fieldKeys[0]}($select=#{fieldKeys[1]})")
			columnField = objectFields[fieldKeys[0]]
			caption = getFieldLabel columnField, column
			field = {
				caption: caption
				width: 100
				dataField: column
				area: 'column'
				customizeText: (data)->
					if columnField.type == "select"
						valueOption = _.findWhere(columnField.options,{value:data.value})
						if valueOption
							return valueOption.label
						else
							return data.value
					else
						return data.value
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
			# valueFieldKey = value.replace(/\./g,"*%*")
			fieldKeys = value.split(".")
			selectColumns.push(fieldKeys[0])
			if fieldKeys.length > 1
				expandFields.push("#{fieldKeys[0]}($select=#{fieldKeys[1]})")
			valueField = objectFields[fieldKeys[0]]
			operation = "count"
			# 数值类型就定为sum统计，否则默认为计数统计
			if valueField.type == "number" or valueField.type == "currency"
				operation = "sum"
			if valueField.type == "lookup" or valueField.type == "master_detail"
				if valueField?.reference_to
					relate_object_Fields = Creator.getObject(valueField?.reference_to)?.fields
					relate_valueField = relate_object_Fields[fieldKeys[1]]
					if relate_valueField?.type == "number" or relate_valueField?.type == "currency"
						operation = "sum"	
			caption = valueField.label
			unless caption
				caption = objectName + "_" + value
			switch operation
				when "sum"
					caption = "总和 #{caption}"
					break
				when "count"
					caption = "计数 #{caption}"
					break
			reportFields.push 
				caption: caption
				dataField: value
				# dataType: valueField.type
				summaryType: operation
				area: 'data'
	_.each reportObject.fields, (item)->
		# itemFieldKey = item.replace(/\./g,"*%*")
		if item != "_id" and !_.findWhere(reportFields,{dataField: item})
			fieldKeys = item.split(".")
			selectColumns.push(fieldKeys[0])
			if fieldKeys.length > 1
				expandFields.push("#{fieldKeys[0]}($select=#{fieldKeys[1]})")
			itemField = objectFields[fieldKeys[0]]
			caption = getFieldLabel itemField, item
			field = {
				caption: caption
				dataField: item
			}
			reportFields.push field

	grouping = reportObject.grouping
	if reportObject.grouping == undefined
		grouping = true
	totaling = reportObject.totaling
	if reportObject.totaling == undefined
		totaling = true
	
	_.every reportFields, (n)->
		n.sortingMethod = Creator.sortingMethod.bind({key:"value"})
	
	pageSize = 10000
	url = "/api/odata/v4/#{spaceId}/#{objectName}?$top=#{pageSize}&$count=true"
	selectColumns = _.uniq selectColumns
	expandFields = _.uniq expandFields
	filter = getODataFilterForReport reportObject.object_name, reportObject.filter_scope, reportObject.filters
	dxOptions = 
		columnResizingMode: "widget"
		sorting: 
			mode: "multiple"
		paging: false
		scrolling: 
			mode: "virtual"
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
			select: selectColumns
			filter: filter
			expand: expandFields
			store: 
				type: "odata",
				version: 4,
				url: Steedos.absoluteUrl(url)
				withCredentials: false,
				beforeSend: (request) ->
					request.headers['X-User-Id'] = userId
					request.headers['X-Space-Id'] = spaceId
					request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
				onLoaded: (loadOptions)->
					if _.where(reportFields,{area:"data"}).length
						if reportObject.charting
							self.is_chart_open.set(true)
							self.is_chart_open.dep.changed()
						else
							self.is_chart_open.set(false)
						self.is_chart_disabled.set(false)
					else
						self.is_chart_open.set(false)
						self.is_chart_disabled.set(true)
						$('#pivotgrid-chart').hide()
					return
				errorHandler: (error) ->
					if error.httpStatus == 404 || error.httpStatus == 400
						error.message = t "creator_odata_api_not_found"

	drillDownDataSource = {}
	salesPopup = $('#drill-down-popup').dxPopup(
		width: 600
		height: 400
		contentTemplate: (contentElement) ->
			drillDownFields = _.union reportObject.rows, reportObject.columns, reportObject.values, reportObject.fields
			drillDownFields = _.without drillDownFields, null, undefined
			drillDownColumns = []
			gridFields = self.pivotGridInstance.get().getDataSource()._fields
			drillDownFields.forEach (n)->
				if n == "_id"
					return
				# gridFieldItem = _.findWhere(gridFields,{dataField:n.replace(/\./g,"*%*")})
				gridFieldItem = _.findWhere(gridFields,{dataField:n})
				drillDownColumns.push {
					dataField: gridFieldItem.dataField
					caption: gridFieldItem.caption
					sortingMethod: Creator.sortingMethod
				}
			$('<div />').addClass('drill-down-content').dxDataGrid(
				width: 560
				height: 300
				columns: drillDownColumns).appendTo contentElement
		onShowing: ->
			$('.drill-down-content').dxDataGrid('instance').option 'dataSource', drillDownDataSource
	).dxPopup('instance')
	dxOptions.onCellClick = (e)->
		if e.area == 'data'
			pivotGridDataSource = e.component.getDataSource()
			rowPathLength = e.cell.rowPath.length
			rowPathName = e.cell.rowPath[rowPathLength - 1]
			popupTitle = (if rowPathName then rowPathName else t('creator_report_drill_down_total_label')) + t('creator_report_drill_down_label')
			drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell)
			salesPopup.option 'title', popupTitle
			salesPopup.show()
	pivotGrid = $('#pivotgrid').show().dxPivotGrid(dxOptions).dxPivotGrid('instance')

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
	object = Creator.getObject(objectName)
	unless object
		toastr.error "未找到对象#{objectName}，请确认该报表指定的对象名是否正确"
		return
	if pivotGridChart
		pivotGridChart.dispose()
	switch reportObject.report_type
		when 'tabular'
			# 报表类型从matrix转变成tabular时，需要把原来matrix报表清除
			self.pivotGridInstance?.get()?.dispose()
			renderTabularReport.bind(self)(reportObject)
		when 'summary'
			# 报表类型从matrix转变成summary时，需要把原来matrix报表清除
			self.pivotGridInstance?.get()?.dispose()
			renderSummaryReport.bind(self)(reportObject)
		when 'matrix'
			# 报表类型从summary转变成matrix时，需要把原来summary报表清除
			self.dataGridInstance?.get()?.dispose()
			renderMatrixReport.bind(self)(reportObject)


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
	
	this.autorun (c)->
		is_chart_open = self.is_chart_open.get()
		if is_chart_open
			Tracker.nonreactive ()->
				renderChart self
		else
			$('#pivotgrid-chart').hide()


Template.creator_report_content.onCreated ->
	self = this.data
	Tracker.nonreactive ()->
		self.is_chart_open.set(false)
	Template.creator_report_content.getReportContent = getReportContent.bind(this.data)
	Template.creator_report_content.renderReport = renderReport.bind(this.data)