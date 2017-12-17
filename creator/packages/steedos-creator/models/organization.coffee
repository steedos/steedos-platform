Creator.Objects.organizations = 
	name: "organizations"
	label: "Organizations"
	icon: "groups"
	fields:
		name: 
			label: "Name"
			type: "text"
			required: true
	list_views:
		default:
			columns: ["name", "modified"]
		all:
			filter_scope: "all"
	permissions:
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