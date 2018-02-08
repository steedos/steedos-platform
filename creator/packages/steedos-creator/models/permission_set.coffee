Creator.Objects.permission_set = 
	name: "permission_set"
	label: "权限集"
	icon: "user"
	fields: 
		name:
			type: "text",
			searchable:true
			index:true
		users:
			type: "lookup"
			reference_to: "users"
			multiple: true
		assigned_apps:
			type: "lookup"
			reference_to: "apps"
			multiple: true

	list_views:
		default:
			columns: ["name", "users"]
		all:
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
