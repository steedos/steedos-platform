Creator.Objects.space_users = 
	name: "space_users"
	label: "Space Users"
	icon: "user"
	enable_search: true
	fields:
		name: 
			label: "Name"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
		position:
			type: "text"
		mobile:
			type: "text"
		email:
			type: "text"
		organization: 
			type: "master_detail",
			reference_to: "organizations"
	list_views:
		default:
			columns: ["name", "organization", "position", "mobile", "email"]
		recent:
			filter_scope: "space"
		all:
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
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 