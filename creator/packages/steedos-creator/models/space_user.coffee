Creator.Objects.space_users = 
	name: "space_users"
	label: "人员"
	icon: "user"
	enable_search: true
	fields:
		name: 
			label: "名称"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			searchable:true
			index:true
		email:
			type: "text"
		user:
			type: "master_detail"
			reference_to: "users"
			required: true
			omit: true
		position:
			type: "text"
		organization: 
			type: "master_detail"
			reference_to: "organizations"
			omit: true
		organizations:
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			defaultValue: []
		manager:
			type: "lookup"
			reference_to: "users"
		sort_no:
			type: "number"
		user_accepted:
			type: "boolean"
			defaultValue: true
		invite_state:
			type: "text"
			omit: true
		mobile:
			type: "text"
		work_phone:
			type: "text"
		position:
			type: "text"
		company:
			type: "text"
	list_views:
		default:
			columns: ["name", "organization", "position", "mobile", "email", "sort_no"]
		all:
			label: "所有人员"
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
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