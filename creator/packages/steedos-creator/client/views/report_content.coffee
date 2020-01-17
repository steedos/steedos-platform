Template.creator_report_content.helpers Creator.helpers

getODataFilterForReport = (object_name, filter_scope, filters, filter_logic)->
	unless object_name
		return ["_id", "=", -1]
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	selector = []
	if spaceId and userId
		if object_name == "users"
			selector.push ["_id", "=", userId]

		if filters and filters.length > 0
			if filter_logic
				format_logic = Creator.formatLogicFiltersToDev(filters, filter_logic)
				if selector.length
					selector.push("and", format_logic)
				else
					selector.push(format_logic)
			else
				filters = Creator.formatFiltersToDev(filters, object_name)
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
	filter_logic = Session.get("filter_logic")
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
		filter_logic: filter_logic
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
		if field?.reference_to && _.isString(field.reference_to)
			relate_object_Fields = Creator.getObject(field?.reference_to)?.fields
			relate_field = relate_object_Fields[key.split(".")[1]]
			if relate_field?.label
				fieldLabel += " " + relate_field.label
	return fieldLabel

getSelectFieldLabel = (value, options)->
	label = _.findWhere(options,{value:value})?.label
	label = if label then label else value
	return if label then label else "--"

getBooleanFieldLabel = (value, caption)->
	return "#{caption}: #{value}"

getSummaryTypeLabel = (type)->
	switch type
		when "sum"
			caption = "总和"
			break
		when "count"
			caption = "计数"
			break
		else
			caption = "计数"
			break
	return caption

pivotGridChart = null
gridLoadedArray = null
maxLoadCount = 10000

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
		unless gridLoadedArray
			return
		groupSums = grid._options.summary.groupItems
		# dataSourceItems = grid.getDataSource().items()
		firstRowField = _.findWhere(grid._options.columns, {groupIndex:0})
		unless firstRowField
			return
		dataSourceItems = DevExpress.data.query(gridLoadedArray).groupBy(firstRowField.dataField).toArray()
		objectGroupField = objectFields[firstRowField.dataField]
		unless objectGroupField
			toastr.error "未找到对象#{objectName}的字段#{firstRowField.dataField}，请确认该报表中指定的字段名是否正确"
			return
		isSelectType = objectGroupField?.type == "select"
		isDateType = objectGroupField?.type == "date"
		isDatetimeType = objectGroupField?.type == "datetime"
		if isSelectType or isDateType or isDatetimeType
			_.each dataSourceItems, (dsi)->
				if isSelectType
					dsi.key = getSelectFieldLabel dsi.key, objectGroupField.options
				else if isDateType
					# 如果不加这个转换语句，则显示出的格式就不对，会显示成：Fri Feb 08 2019 10:05:00 GMT+0800 (中国标准时间)
					dsi.key = DevExpress.localization.formatDate(dsi.key, 'yyyy-MM-dd')
				else if isDatetimeType
					# 如果不加这个转换语句，则显示出的格式就不对，会显示成：Fri Feb 08 2019 10:05:00 GMT+0800 (中国标准时间)
					dsi.key = DevExpress.localization.formatDate(dsi.key, 'yyyy-MM-dd hh:mm:ss')
		dataSourceItems = dataSourceItems.sort(Creator.sortingMethod.bind({key:"key"}))
		aggregateSeeds = []
		aggregateKeys = []
		_.each groupSums, (gs, index)->
			aggregateSeeds.push(0)
			aggregateKeys.push({type:gs.summaryType, column:gs.column ,value:0})
		_.each dataSourceItems, (dsi) ->
			_.each aggregateKeys, (ak)->
				ak.value = 0
			DevExpress.data.query(dsi.items).aggregate(aggregateSeeds, (total, itemData) ->
				_.each aggregateKeys, (ak)->
					if ak.type == "count"
						ak.value++
					else if ak.type == "sum"
						ak.value += itemData[ak.column]
				return _.map aggregateKeys, (ak)->
					return ak.value
			).done (result) ->
				dsi.aggregates = result
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
			tempSummaryTypeLabel = getSummaryTypeLabel tempSummaryType
			tempAxisText = tempSummaryTypeLabel
			unless gs.column == "_id"
				fieldName = objectFields[gs.column]?.label
				unless fieldName
					fieldName = gs.column
				tempAxisText += " #{fieldName}"
			chartValueAxis.push pane: tempPaneName, title: { text: tempAxisText }
			_.each dataSourceItems, (dsi, index2)->
				tempKey = "key#{index2 + 1}"
				chartItem = {}
				chartItem[tempKey] = if dsi.key then dsi.key else "--"
				chartItem[tempSummaryType] = dsi.aggregates[index1]
				chartData.push chartItem
				chartSeries.push pane: tempPaneName, valueField: tempSummaryType, name: "#{dsi.key} #{tempSummaryTypeLabel}", argumentField: tempKey
		dxOptions = 
			dataSource: chartData, 
			commonSeriesSettings: {
				type: "bar"
			},
			equalBarWidth: false,
			panes: chartPanes,
			series: chartSeries,
			valueAxis: chartValueAxis
		module.dynamicImport("devextreme/viz/chart").then (dxChart)->
			DevExpress.viz.dxChart = dxChart;
			pivotGridChart =  $("#pivotgrid-chart").show().dxChart(dxOptions).dxChart("instance")
	else
		grid = Tracker.nonreactive ()->
			return self.pivotGridInstance.get()
		unless grid
			return
		module.dynamicImport("devextreme/viz/chart").then (dxChart)->
			DevExpress.viz.dxChart = dxChart;
			pivotGridChart =  $("#pivotgrid-chart").show().dxChart(
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
	expandFields = {}
	objectName = reportObject.object_name
	object = Creator.getObject(objectName)
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
			unless expandFields[fieldKeys[0]]
				expandFields[fieldKeys[0]] = []
			expandFields[fieldKeys[0]].push fieldKeys[1]
		itemField = objectFields[fieldKeys[0]]
		unless itemField
			toastr.error "未找到对象#{objectName}的字段#{fieldKeys[0]}，请确认该报表中指定的字段名是否正确"
			return
		caption = getFieldLabel itemField, item
		field = {
			caption: caption
			dataField: item
		}
		if itemField.type == "select"
			field.calculateDisplayValue = (rowData)->
				return getSelectFieldLabel rowData[item], itemField.options
		else if itemField.type == "date"
			# 如果不加这个转换语句，则datetime会显示为2019年 2月 28日这种格式，未显示时间值
			field.dataType = "date"
		else if itemField.type == "datetime"
			# 如果不加这个转换语句，则datetime会显示为2019年 2月 28日这种格式，未显示时间值
			field.dataType = "datetime"
		
		if ["date", "datetime"].includes(field.dataType)
			field.format = {
				formatter: (date)->
					formattedDate = new Date(date.getTime())
					formattedDate.setHours(formattedDate.getHours() - formattedDate.getTimezoneOffset() / 60 )  # 处理grid中的datetime 偏移
					return DevExpress.localization.formatDate(formattedDate, 'yyyy-MM-dd HH:mm')
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

	url = "#{Creator.getObjectODataRouterPrefix(object)}/#{spaceId}/#{objectName}?$top=#{maxLoadCount}&$count=true"
	selectColumns = _.uniq selectColumns
	expands = []
	_.each expandFields, (v,k)->
		expands.push "#{k}($select=#{_.uniq(v).join(',')})"
	filter = getODataFilterForReport reportObject.object_name, reportObject.filter_scope, reportObject.filters, reportObject.filter_logic
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
			expand: expands
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
					
					Meteor.defer ()->
						totalCount = datagrid.getDataSource()._store._dataSource?._totalCount
						if totalCount > maxLoadCount
							toastr.warning("统计数据达#{totalCount}条记录，已超出限制，以下统计结果基于前#{maxLoadCount}条记录")
				errorHandler: (error) ->
					if error.httpStatus == 404 || error.httpStatus == 400
						error.message = t "creator_odata_api_not_found"
		paging: false
		scrolling: 
			mode: "virtual"
		columns: reportColumns
		summary: reportSummary
	if Steedos.isMobile()
		# 手机上不需要导出按钮
		delete dxOptions.export
	datagrid = null
	module.dynamicImport('devextreme/ui/data_grid').then (dxDataGrid)->
		DevExpress.ui.dxDataGrid = dxDataGrid;
		datagrid= $('#datagrid').dxDataGrid(dxOptions).dxDataGrid('instance')
		self.dataGridInstance?.set datagrid

renderSummaryReport = (reportObject)->
	self = this
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	selectColumns = []
	expandFields = {}
	objectName = reportObject.object_name
	object = Creator.getObject(objectName)
	objectFields = object?.fields
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
			unless expandFields[fieldKeys[0]]
				expandFields[fieldKeys[0]] = []
			expandFields[fieldKeys[0]].push fieldKeys[1]
		itemField = objectFields[fieldKeys[0]]
		unless itemField
			toastr.error "未找到对象#{objectName}的字段#{fieldKeys[0]}，请确认该报表中指定的字段名是否正确"
			return
		itemLabel = getFieldLabel itemField, item
		field = {
			caption: itemLabel
			dataField: item
		}
		if itemField.type == "select"
			field.calculateDisplayValue = (rowData)->
				return getSelectFieldLabel rowData[item], itemField.options
		else if itemField.type == "date"
			# 不加dataType，则显示出的格式就不对，会显示成：Fri Feb 08 2019 10:05:00 GMT+0800 (中国标准时间)
			field.dataType = "date"
		else if itemField.type == "datetime"
			# 不加dataType，则显示出的格式就不对，会显示成：Fri Feb 08 2019 10:05:00 GMT+0800 (中国标准时间)
			field.dataType = "datetime"
		
		if ["date", "datetime"].includes(field.dataType)
			field.format = {
				formatter: (date)->
					formattedDate = new Date(date.getTime())
					formattedDate.setHours(formattedDate.getHours() - formattedDate.getTimezoneOffset() / 60 )  # 处理grid中的datetime 偏移
					return DevExpress.localization.formatDate(formattedDate, 'yyyy-MM-dd HH:mm')
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
			unless expandFields[fieldKeys[0]]
				expandFields[fieldKeys[0]] = []
			expandFields[fieldKeys[0]].push fieldKeys[1]
		groupField = objectFields[fieldKeys[0]]
		unless groupField
			toastr.error "未找到对象#{objectName}的字段#{fieldKeys[0]}，请确认该报表中指定的字段名是否正确"
			return
		groupLabel = getFieldLabel groupField, group
		field = {
			caption: groupLabel
			dataField: group
			groupIndex: index
		}
		if groupField.type == "select"
			field.calculateDisplayValue = (rowData)->
				return getSelectFieldLabel rowData[group], groupField.options
		else if groupField.type == "date"
			# 不加dataType，则显示出的格式就不对，会显示成：Fri Feb 08 2019 10:05:00 GMT+0800 (中国标准时间)
			field.dataType = "date"
		else if groupField.type == "datetime"
			# 不加dataType，则显示出的格式就不对，会显示成：Fri Feb 08 2019 10:05:00 GMT+0800 (中国标准时间)
			field.dataType = "datetime"
		
		if ["date", "datetime"].includes(field.dataType)
			field.format = {
				formatter: (date)->
					formattedDate = new Date(date.getTime())
					formattedDate.setHours(formattedDate.getHours() - formattedDate.getTimezoneOffset() / 60 )  # 处理grid中的datetime 偏移
					return DevExpress.localization.formatDate(formattedDate, 'yyyy-MM-dd HH:mm')
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
				unless expandFields[fieldKeys[0]]
					expandFields[fieldKeys[0]] = []
				expandFields[fieldKeys[0]].push fieldKeys[1]
			valueField = objectFields[fieldKeys[0]]
			unless valueField
				toastr.error "未找到对象#{objectName}的字段#{fieldKeys[0]}，请确认该报表中指定的字段名是否正确"
				return
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
			caption = "#{getSummaryTypeLabel operation}: {0}"
			if operation != "count"
				format = 
					type: "fixedPoint"
					precision: 2
			summaryItem = 
				displayFormat: caption
				column: value
				summaryType: operation
				valueFormat: format
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

	url = "#{Creator.getObjectODataRouterPrefix(object)}/#{spaceId}/#{objectName}?$top=#{maxLoadCount}&$count=true"
	selectColumns = _.uniq selectColumns
	expands = []
	_.each expandFields, (v,k)->
		expands.push "#{k}($select=#{_.uniq(v).join(',')})"
	filter = getODataFilterForReport reportObject.object_name, reportObject.filter_scope, reportObject.filters, reportObject.filter_logic
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
			expand: expands
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
					gridLoadedArray = loadOptions
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
						
					Meteor.defer ()->
						totalCount = datagrid.getDataSource()._store._dataSource?._totalCount
						if totalCount > maxLoadCount
							toastr.warning("统计数据达#{totalCount}条记录，已超出限制，以下统计结果基于前#{maxLoadCount}条记录")
				errorHandler: (error) ->
					if error.httpStatus == 404 || error.httpStatus == 400
						error.message = t "creator_odata_api_not_found"
		paging: false
		scrolling: 
			mode: "virtual"
		columns: reportColumns
		summary: reportSummary
	if Steedos.isMobile()
		# 手机上不需要导出按钮
		delete dxOptions.export
	datagrid = null
	module.dynamicImport('devextreme/ui/data_grid').then (dxDataGrid)->
		DevExpress.ui.dxDataGrid = dxDataGrid;
		datagrid= $('#datagrid').dxDataGrid(dxOptions).dxDataGrid('instance')
		self.dataGridInstance?.set datagrid

transformValue = (object_name, fields, result)->

	fieldNames = _.compact(_.pluck(fields,"dataField"))

	objectFields = Creator.getObject(object_name).fields

	booleanFields = []

	_.forEach fieldNames, (fn)->
		field = objectFields[fn]
		if field?.type == 'boolean'
			booleanFields.push fn

	if booleanFields.length > 0
		_.forEach result, (r)->
			_.forEach booleanFields, (fn)->
				if _.isBoolean(r[fn]) && r[fn]
					r[fn] = TAPi18n.__("true")
				else
					r[fn] = TAPi18n.__("false")
	return result

renderMatrixReport = (reportObject)->
	self = this
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	selectColumns = []
	expandFields = {}
	objectName = reportObject.object_name
	object = Creator.getObject(objectName)
	objectFields = object?.fields
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
				unless expandFields[fieldKeys[0]]
					expandFields[fieldKeys[0]] = []
				expandFields[fieldKeys[0]].push fieldKeys[1]
			rowField = objectFields[fieldKeys[0]]
			unless rowField
				toastr.error "未找到对象#{objectName}的字段#{fieldKeys[0]}，请确认该报表中指定的字段名是否正确"
				return
			caption = getFieldLabel rowField, row
			field = {
				caption: caption
				width: 100
				dataField: row
				area: 'row'
			}
			if rowField.type == "select"
				field.customizeText = (data)->
					return getSelectFieldLabel data.value, rowField.options
			if rowField.type == 'boolean'
				field.customizeText = (data)->
					return getBooleanFieldLabel(data.value, caption)

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
				unless expandFields[fieldKeys[0]]
					expandFields[fieldKeys[0]] = []
				expandFields[fieldKeys[0]].push fieldKeys[1]
			columnField = objectFields[fieldKeys[0]]
			unless columnField
				toastr.error "未找到对象#{objectName}的字段#{fieldKeys[0]}，请确认该报表中指定的字段名是否正确"
				return
			caption = getFieldLabel columnField, column
			field = {
				caption: caption
				width: 100
				dataField: column
				area: 'column'
			}
			if columnField.type == "select"
				field.customizeText = (data)->
					return getSelectFieldLabel data.value, columnField.options
			if columnField.type == 'boolean'
				field.customizeText = (data)->
					return getBooleanFieldLabel(data.value, caption)
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
				unless expandFields[fieldKeys[0]]
					expandFields[fieldKeys[0]] = []
				expandFields[fieldKeys[0]].push fieldKeys[1]
			valueField = objectFields[fieldKeys[0]]
			unless valueField
				toastr.error "未找到对象#{objectName}的字段#{fieldKeys[0]}，请确认该报表中指定的字段名是否正确"
				return
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
			caption = "#{getSummaryTypeLabel operation} #{caption}"
			if operation != "count"
				format = 
					type: "fixedPoint"
					precision: 2
			reportFields.push 
				caption: caption
				dataField: value
				# dataType: valueField.type
				summaryType: operation
				format: format
				area: 'data'
	_.each reportObject.fields, (item)->
		# itemFieldKey = item.replace(/\./g,"*%*")
		if item != "_id" and !_.findWhere(reportFields,{dataField: item})
			fieldKeys = item.split(".")
			selectColumns.push(fieldKeys[0])
			if fieldKeys.length > 1
				unless expandFields[fieldKeys[0]]
					expandFields[fieldKeys[0]] = []
				expandFields[fieldKeys[0]].push fieldKeys[1]
			itemField = objectFields[fieldKeys[0]]
			unless itemField
				toastr.error "未找到对象#{objectName}的字段#{fieldKeys[0]}，请确认该报表中指定的字段名是否正确"
				return
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
	
	url = "#{Creator.getObjectODataRouterPrefix(object)}/#{spaceId}/#{objectName}?$top=#{maxLoadCount}&$count=true"
	selectColumns = _.uniq selectColumns
	expands = []
	_.each expandFields, (v,k)->
		expands.push "#{k}($select=#{_.uniq(v).join(',')})"
	filter = getODataFilterForReport reportObject.object_name, reportObject.filter_scope, reportObject.filters, reportObject.filter_logic
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
			expand: expands
			store: 
				type: "odata",
				version: 4,
				url: Steedos.absoluteUrl(url)
				withCredentials: false,
				beforeSend: (request) ->
					request.headers['X-User-Id'] = userId
					request.headers['X-Space-Id'] = spaceId
					request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
				onLoaded: (result)->
					result = transformValue(reportObject.object_name, reportFields, result)
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
					
					Meteor.defer ()->
						totalCount = pivotGrid.getDataSource()._store._dataSource._totalCount
						if totalCount > maxLoadCount
							toastr.warning("统计数据达#{totalCount}条记录，已超出限制，以下统计结果基于前#{maxLoadCount}条记录")
				errorHandler: (error) ->
					if error.httpStatus == 404 || error.httpStatus == 400
						error.message = t "creator_odata_api_not_found"

	drillDownDataSource = {}
	salesPopup = null
	pivotGrid = null
	if Steedos.isMobile()
		# 手机上不需要导出按钮
		delete dxOptions.export
	module.dynamicImport('devextreme/ui/popup').then (dxPopup)->
		DevExpress.ui.dxPopup = dxPopup;
		salesPopup = $('#drill-down-popup').dxPopup(
			width: "60%"
			height: 400
			contentTemplate: (contentElement) ->
				drillDownFields = _.union reportObject.rows, reportObject.columns, reportObject.values, reportObject.fields
				drillDownFields = _.without drillDownFields, null, undefined
				drillDownColumns = []
				gridFields = self.pivotGridInstance.get().getDataSource()._fields
				object = Creator.getObject(reportObject.object_name)
				drillDownFields.forEach (n)->
					if n == "_id"
						return
					# gridFieldItem = _.findWhere(gridFields,{dataField:n.replace(/\./g,"*%*")})
					gridFieldItem = _.findWhere(gridFields,{dataField:n})
					drillDownColumns.push {
						cssClass: "cell-wrap"
						dataField: gridFieldItem.dataField
						caption: gridFieldItem.caption
						sortingMethod: Creator.sortingMethod
						minWidth: 100
						cellTemplate: (container, options) ->
							object_name = object.name
							doc = options.data
							column = n
							field_name = column
							if /\w+\.\$\.\w+/g.test(field_name)
								# object类型带子属性的field_name要去掉中间的美元符号，否则显示不出字段值
								field_name = column.replace(/\$\./,"")
							fieldLevels = field_name.split(".");
							fieldFirstLevelKey = fieldLevels[0]
							fieldFirstLevelValue = doc[fieldFirstLevelKey]
							field = object.fields[fieldFirstLevelKey]
							# 需要考虑field_name为 a.b 这种格式，不需要考虑a.b.c这种格式
							if fieldFirstLevelValue
								# fieldFirstLevelValue为空时，eval会报错
								field_val = eval("doc." + field_name)
							else
								field_val = fieldFirstLevelValue
							if fieldLevels.length > 1
								# 报表只支持fieldLevels.length最多为2层
								if field?.reference_to and _.isString(field.reference_to)
									referenceObject = Creator.getObject(field.reference_to)
									if referenceObject
										if referenceObject.NAME_FIELD_KEY == fieldLevels[1]
											# name字段则显示为lookup、master_detail类型，带链接
											field_val = fieldFirstLevelValue
											field_name = fieldFirstLevelKey
										else
											# 否则按referenceObject对应的类型来显示
											field_val = if fieldFirstLevelValue then fieldFirstLevelValue[fieldLevels[1]] else fieldFirstLevelValue
											doc = fieldFirstLevelValue
											field_name = fieldLevels[1]
											object_name = referenceObject.name
											field = referenceObject.fields[field_name]
							if _.isArray doc
								cellDocs = doc
							else
								cellDocs = [doc]
							
							cellDocs.forEach (docItem, docIndex)->
								# 因为fieldFirstLevelValue可能是数组，所以需要分别对每项调用Template.creator_table_cell来加载
								if _.isArray doc
									# 值为数组时，从指定索引中分别取出对应项的值
									field_val = fieldFirstLevelValue[docIndex]
									field_val = if field_val then field_val[field_name] else field_val
								unless docItem
									return
								cellOption = {
									_id: docItem._id, val: field_val, doc: docItem, 
									field: field, field_name: field_name, 
									object_name: object_name, agreement: "odata", 
									is_related: false, open_window: true, hideIcon: true
								}
								if field.type is "markdown"
									cellOption["full_screen"] = true
								
								if docIndex > 0
									# lookup、master_detail类型数组，显示为一行
									cellContainer = $(container[0]).find(".creator_table_cell .cell-container")[0]
								else
									cellContainer = container[0]
								Blaze.renderWithData Template.creator_table_cell, cellOption, cellContainer
					}
				if drillDownFields.length
					$('<div />').addClass('drill-down-content').dxDataGrid(
						width: "100%"
						height: "100%"
						allowColumnResizing: true
						columnResizingMode: "widget"
						columnAutoWidth: true
						columns: drillDownColumns).appendTo contentElement
			onShowing: ->
				$('.drill-down-content').dxDataGrid('instance').pageIndex(0)
				$('.drill-down-content').dxDataGrid('instance').option 'dataSource', drillDownDataSource
		).dxPopup('instance')
		dxOptions.onCellClick = (e)->
			if e.area == 'data'
				pivotGridDataSource = e.component.getDataSource()
				rowPathLength = e.cell.rowPath.length
				rowPathName = e.cell.rowPath[rowPathLength - 1]
				popupTitle = (if rowPathName then rowPathName else t('creator_report_drill_down_total_label')) + t('creator_report_drill_down_label')
				drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell)
				module.dynamicImport('devextreme/ui/data_grid').then (dxDataGrid)->
					DevExpress.ui.dxDataGrid = dxDataGrid;
					salesPopup.option 'title', popupTitle
					salesPopup.content().addClass("dx-popup-content-report")
					salesPopup.show()

		module.dynamicImport('devextreme/ui/pivot_grid').then (dxPivotGrid)->
			DevExpress.ui.dxPivotGrid = dxPivotGrid;
			self.pivotGridInstance?.get()?.dispose()
			pivotGrid = $('#pivotgrid').show().dxPivotGrid(dxOptions).dxPivotGrid('instance')
			self.pivotGridInstance?.set pivotGrid

renderJsReport = (reportObject)->
	url = Creator.getJsReportViewUrl(reportObject._id)
	$('#jsreport').html("<iframe src=\"#{url}\"></iframe>");

renderReport = (reportObject)->
	unless reportObject
		reportObject = Creator.Reports[Session.get("record_id")] or Creator.getObjectRecord()
	self = this
	spaceId = Session.get("spaceId")
	filter_items = Tracker.nonreactive ()->
		return Session.get("filter_items")
	filter_scope = Tracker.nonreactive ()->
		return Session.get("filter_scope")
	filter_logic = Tracker.nonreactive ()->
		return Session.get("filter_logic")
	reportObject.filters = filter_items
	reportObject.filter_scope = filter_scope
	reportObject.filter_logic = filter_logic
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
	innerStackingBox = $(".filter-list-wraper .innerStacking") #tabular/summary/matrix三种dx控件报表容器
	jsreportBox = $(".filter-list-wraper #jsreport") #jsreport报表容器
	emptyBox = $(".filter-list-wraper .creator-report-empty")
	if filter_items and filter_items.length and filter_items.find((n)-> return n.is_required && Creator.isFilterValueEmpty(n.value))
		# 存在未填写的必要过滤条件则显示提示
		innerStackingBox.hide();
		jsreportBox.hide()
		emptyBox.show()
		Session.set("is_filter_open", true)
		return;
	emptyBox.hide()
	switch reportObject.report_type
		when 'tabular'
			# 报表类型从matrix转变成tabular时，需要把原来matrix报表清除
			gridLoadedArray = null
			self.pivotGridInstance?.get()?.dispose()
			jsreportBox.hide()
			innerStackingBox.show();
			renderTabularReport.bind(self)(reportObject)
		when 'summary'
			# 报表类型从matrix转变成summary时，需要把原来matrix报表清除
			self.pivotGridInstance?.get()?.dispose()
			jsreportBox.hide()
			innerStackingBox.show();
			renderSummaryReport.bind(self)(reportObject)
		when 'matrix'
			# 报表类型从summary转变成matrix时，需要把原来summary报表清除
			gridLoadedArray = null
			self.dataGridInstance?.get()?.dispose()
			jsreportBox.hide()
			innerStackingBox.show();
			renderMatrixReport.bind(self)(reportObject)
		when 'jsreport'
			# 报表类型从dx控件报表转变成jsreport时，需要把原来报表相关内容清除
			gridLoadedArray = null
			self.dataGridInstance?.get()?.dispose()
			self.pivotGridInstance?.get()?.dispose()
			innerStackingBox.hide();
			jsreportBox.show()
			renderJsReport.bind(self)(reportObject)


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
			filter_logic = reportObject.filter_logic
			object_fields = Creator.getObject(reportObject.object_name)?.fields
			if object_fields
				filter_items = Creator.getFiltersWithFilterFields(filter_items, object_fields, reportObject.filter_fields)

			Session.set("filter_items", filter_items)
			Session.set("filter_scope", filter_scope)
			Session.set("filter_logic", filter_logic)
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

Template.creator_report_content.onDestroyed ->
	# 离开报表详细界面时清除过滤条件，以防止返回列表后条件不变
	Session.set("filter_scope", null)
	Session.set("filter_items", null)