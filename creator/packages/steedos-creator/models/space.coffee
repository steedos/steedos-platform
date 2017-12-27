Creator.Objects.spaces = 
	name: "spaces"
	label: "Spaces"
	icon: "groups"
	fields:
		name: 
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
		owner:
			type: "lookup"
			reference_to: "users"
			disabled: true
			omit: false
		admins: 
			type: "lookup"
			reference_to: "users"
			multiple: true
		apps: 
			label: "应用"
			type: "lookup"
			reference_to: "apps"
			multiple: true

	list_views:
		default:
			columns: ["name"]
		all:
			filter_scope: "all"
			filters: ["_id", "eq", "{spaceId}"]
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 