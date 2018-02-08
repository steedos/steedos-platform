Creator.Objects.users = 
	name: "users"
	label: "Users"
	icon: "user"
	enable_api: true
	fields:
		name: 
			label: "Name"
			type: "text"
			required: true
			searchable:true
			index:true
	list_views:
		default:
			columns: ["name", "username"]
		all:
			filter_scope: "all"
			filters: [["_id", "$eq", "{userId}"]]
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 