Creator.Objects.users = 
	name: "users"
	label: "Users"
	icon: "user"
	fields:
		name: 
			label: "Name"
			type: "text"
			required: true
	list_views:
		default:
			columns: ["name", "username"]
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