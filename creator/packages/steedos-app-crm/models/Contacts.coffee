Creator.Objects.contacts = 
	name: "contacts"
	label: "联系人"
	icon: "contact"
	enable_files: true
	enable_search: true
	enable_notes: true
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
			label: "单位"
			type: "master_detail"
			reference_to: "accounts"
			sortable: true
		title:
			label: "职务"
			type: "text"
			sortable: true
		department:
			label: "部门"
			type: "text"
			sortable: true
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
			sortable: true
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

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true