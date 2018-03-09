Creator.Objects.accounts = 
	name: "accounts"
	label: "客户"
	icon: "account"
	enable_files: true
	enable_search: true
	enable_tasks: true
	enable_notes: true
	enable_api: true
	fields:
		owner:
			label: "客户所有人"
			omit: false
			disabled: true
		priority:
			label: "优先级"
			type: "select"
			sortable: true
			options: [
				{label: "Hot", value: "high"},
				{label: "Warm", value: "normal"},
				{label: "Cold", value: "low"}
			]
		name: 
			label: "客户名"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			sortable: true
		website: 
			type: "text"
			label: "网址"
		phone:
			type: "text"
			label: "电话"
			defaultValue: ""
		fax:
			type: "text"
			label: "传真"
		description: 
			label: "描述"
			type: "textarea"
			is_wide: true

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

	actions: 
		export:
			label: "导出"
			visible: false
		print:
			label: "打印"
			on: "record"
			only_detail: true
			visible: false
			todo: ()->
				alert("you clicked on print button") 
