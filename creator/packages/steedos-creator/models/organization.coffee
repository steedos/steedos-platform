Creator.Objects.organizations = 
	name: "organizations"
	label: "Organizations"
	icon: "groups"
	enable_search: true
	fields:
		name: 
			label: "Name"
			type: "text"
			required: true
	list_views:
		default:
			columns: ["name", "modified"]
		all:
			filter_scope: "space"

	related_list:
		space_users:
			columns: ["name", "position", "mobile", "email"]

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