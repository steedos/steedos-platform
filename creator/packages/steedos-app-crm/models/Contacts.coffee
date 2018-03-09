Creator.Objects.contacts = 
	name: "contacts"
	label: "联系人"
	icon: "contact"
	enable_files: true
	enable_search: true
	enable_api: true
	fields:
		name: 
			type: "text"
			label: "姓名"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			searchable:true
			index:true
		account: 
			label: "客户"
			type: "master_detail"
			reference_to: "accounts"
		title:
			label: "职务"
			type: "text"
		department:
			label: "部门"
			type: "text"
		email:
			label: "邮件"
			type: "text"
			group: "联系方式"
		phone:
			label: "工作电话"
			type: "text"
			group: "联系方式"
		home_phone:
			label: "家庭电话"
			type: "text"
			group: "联系方式"
		other_phone:
			label: "其他电话"
			type: "text"
			group: "联系方式"
		birthdate: 
			label: "生日"
			type: "date"
		description: 
			label: "描述"
			type: "textarea"
			is_wide: true

	list_views:
		default:
			columns: ["name", "account", "email", "phone"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "所有联系人"
			filter_scope: "space"
			columns: ["name", "account", "email", "phone", "owner"]
		mine:
			label: "我的联系人"
			filter_scope: "mine"
