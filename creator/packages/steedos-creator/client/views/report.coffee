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
	
	report_content_params: ()->
		return {
			is_chart_open: Template.instance().is_chart_open
			is_chart_disabled: Template.instance().is_chart_disabled
			report_settings: Template.instance().report_settings
			dataGridInstance: Template.instance().dataGridInstance
			pivotGridInstance: Template.instance().pivotGridInstance
		}

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
			Template.creator_report_content.renderReport()

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
		Template.creator_report_content.renderReport()

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
				template.dataGridInstance.get()?.option(option)
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
				template.dataGridInstance.get()?.option(option)
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
				template.pivotGridInstance.get()?.option(option)

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
				fields = template.dataGridInstance.get()?.getVisibleColumns()
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
				fields = template.dataGridInstance.get()?.getVisibleColumns()
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
				fields = template.pivotGridInstance.get()?.getDataSource()._fields
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

Template.creator_report.onRendered ->
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
	this.is_designer_open = new ReactiveVar(false)

	this.is_chart_open = new ReactiveVar(true)
	this.is_chart_disabled = new ReactiveVar(false)
	this.report_settings = new ReactiveVar()
	this.dataGridInstance = new ReactiveVar()
	this.pivotGridInstance = new ReactiveVar()