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
		company: 
			label: "单位"
			type: "master_detail"
			reference_to: "companies"
		birthdate: 
			label: "生日"
			type: "date"
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
		description: 
			label: "描述"
			type: "textarea"
			is_wide: true

	list_views:
		default:
			columns: ["name", "company", "email", "phone"]
		recent:
			filter_scope: "space"
		all:
			filter_scope: "space"
			columns: ["name", "description", "email", "phone", "owner"]
		mine:
			filter_scope: "mine"
