Creator.Objects.reports = 
	name: "reports"
	label: "reports"
	icon: "report"
	fields:
		name: 
			type: "text"
			required: true
		description: 
			type: "textarea"
			is_wide: true
		report_type:
			type: "text"
			allowedValues: ["tabular", "summary", "matrix"]
		object_name: 
			type: "text"
			required: true
		filters: 
			type: [Object]
		"filters.$.field": 
			type: "text"
		"filters.$.operation": 
			type: "text"
		"filters.$.value": 
			type: "text"
		columns:
			type: "[text]"
		rows: 
			type: "[text]"
		values: 
			type: [Object]
			blackbox: true
		"values.$.label":
			type: "text"
		"values.$.field":
			type: "text"
		"values.$.operation":
			type: "text"

	list_views:
		default:
			columns: ["name"]
		all:
			filter_scope: "space"
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