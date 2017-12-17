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
		default:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 