Creator.Objects.reports = 
	name: "reports"
	label: "报表"
	icon: "report"
	fields:
		name: 
			label: "名称"
			type: "text"
			required: true
		description: 
			label: "描述"
			type: "textarea"
			is_wide: true
		report_type:
			label: "报表类型"
			type: "select"
			defaultValue: "tabular"
			options: [
				{label: "列表", value: "tabular"},
				{label: "汇总", value: "summary"},
				{label: "矩阵", value: "matrix"}
			]
		object_name: 
			label: "对象名"
			type: "text"
			required: true
		filter_scope:
			label: "过虑范围"
			type: "select"
			defaultValue: "space"
			options: [
				{label: "所有", value: "space"},
				{label: "与我相关", value: "mine"}
			]
		filters: 
			label: "过虑条件"
			type: [Object]
		"filters.$.field": 
			label: "字段名"
			type: "text"
		"filters.$.operation": 
			label: "操作符"
			type: "select"
			defaultValue: "EQUALS"
			options: [
				{label: "equals", value: "EQUALS"},
				{label: "not equal to", value: "NOT_EQUAL"},
				{label: "less than", value: "LESS_THAN"},
				{label: "greater than", value: "GREATER_THAN"},
				{label: "less or equal", value: "LESS_OR_EQUAL"},
				{label: "greater or equal", value: "GREATER_OR_EQUAL"},
				{label: "contains", value: "CONTAINS"},
				{label: "does not contain", value: "NOT_CONTAIN"},
				{label: "starts with", value: "STARTS_WITH"},
			]
		"filters.$.value": 
			label: "字段值"
			# type: "text"
			blackbox: true
		columns:
			label: "列"
			type: "[text]"
		rows: 
			label: "行"
			type: "[text]"
		values: 
			label: "统计"
			type: "[text]"
		grouping:
			label: "显示小计"
			type: "boolean"
			defaultValue: true
		totaling:
			label: "显示总计"
			type: "boolean"
			defaultValue: true
		counting:
			label: "显示记录计数"
			type: "boolean"
			defaultValue: true

	list_views:
		default:
			columns: ["name", "report_type", "object_name"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "所有报表"
			filter_scope: "space"
		mine:
			label: "我的报表"
			filter_scope: "mine"
	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
	actions: 
		save:
			label: "保存"
			visible: (object_name, record_id, record_permissions)->
				report = Creator.Collections[object_name].findOne record_id
				if report.owner == Meteor.userId()
					return true
				else
					return Creator.isSpaceAdmin()
			on: "record"
			todo: (object_name, record_id, fields)->
				filters = Session.get("filter_items")
				filter_scope = Session.get("filter_scope")
				report_settings = Template.creator_report.getReportSettings()
				Creator.getCollection(object_name).update({_id: record_id},{$set:{
					filters: filters
					filter_scope: filter_scope
					grouping: report_settings.grouping
					totaling: report_settings.totaling
					counting: report_settings.counting
				}})