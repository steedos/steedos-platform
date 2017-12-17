Creator.Objects.space_users = 
	name: "space_users"
	label: "Space Users"
	icon: "user"
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
			type: "lookup",
			reference_to: "organization"
	list_views:
		default:
			columns: ["name", "organization", "position", "mobile", "email"]
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