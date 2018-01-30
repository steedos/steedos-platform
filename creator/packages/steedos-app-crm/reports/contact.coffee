Creator.Reports.contact_matrix =
	name: "Contact List"
	object_name: "contacts"
	report_type: "matrix"
	filter_scope: "space"
	filters: []
	columns: ["created"]
	rows: ["company.name"]
	values: [{
		label: '关联数量'
		field: "name"
		operation: "count"
	}]

Creator.Reports.contact_summary =
	name: "Contact List"
	object_name: "contacts"
	report_type: "summary"
	filter_scope: "space"
	filters: []
	columns: ["name", "birthdate", "department", "owner.name", "created"]
	groups: ["company.name"]
	values: [{
		field: "company"
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


Creator.Reports.contact_tabular =
	name: "Contact List"
	object_name: "contacts"
	report_type: "tabular"
	filter_scope: "space"
	filters: []
	columns: ["name", "company.name", "birthdate", "department", "owner.name", "created"]