Creator.Objects.crm_customers = 
	name: "crm_customers"
	label: "客户"
	icon: "account"
	fields:
		name: 
			label: "名称"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			sortable: true
		priority:
			label: "优先级"
			type: "select"
			sortable: true
			options: [
				{label: "Hot", value: "high"},
				{label: "Warm", value: "normal"},
				{label: "Cold", value: "low"}
			]
		phone:
			type: "text"
			label: "电话"
		fax:
			type: "text"
			label: "传真"
		website: 
			type: "text"
			label: "网址"
		owner: 
			label: "所有者"
			omit: false
		description: 
			label: "描述"
			type: "textarea"

	list_views:
		default:
			columns: ["name", "description", "modified"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "所有客户"
			filter_scope: "space"
			columns: ["name", "description", "modified", "owner"]
		mine:
			label: "我的客户"
			filter_scope: "mine"

	related_list:
		crm_contacts:
			columns: ["name", "email", "phone"]
		crm_contracts:
			columns: ["name", "amount", "company_signed_date", "company_signed_id"]

	actions: 
		export:
			label: "导出"
			visible: true
		print:
			label: "打印"
			on: "record"
			visible: true
			todo: ()->
				alert("you clicked on print button") 
