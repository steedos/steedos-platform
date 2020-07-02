Creator.Reports.company_matrix =
	name: "Customer List"
	object_name: "accounts"
	report_type: "matrix"
	filter_scope: "space"
	filters: []
	columns: ["created"]
	rows: ["priority.label"]
	values: [{
		label: '单位数量'
		field: "name"
		operation: "count"
	}]


Creator.Reports.company_summary =
	name: "Customer List"
	object_name: "accounts"
	report_type: "summary"
	filter_scope: "space"
	filters: []
	columns: ["name", "phone", "fax", "owner.name", "created"]
	groups: ["priority.label"]
	values: [{
		label: '总计数：{0}'
		field: "priority"
		operation: "count"
		grouping: true
	},{
		field: "created"
		operation: "max"
		grouping: true
	},{
		label: '汇总计数：{0}'
		field: "name"
		operation: "count"
	}]


Creator.Reports.company_tabular =
	name: "Customer List"
	object_name: "accounts"
	report_type: "tabular"
	filter_scope: "space"
	filters: []
	columns: ["name", "priority.label", "phone", "fax", "owner.name", "created"]