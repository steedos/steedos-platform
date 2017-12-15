Creator.Objects.space_users = 
	name: "space_users"
	label: "Space Users"
	icon: "ion-ios-people-outline"
	fields:
		name: 
			label: "Name"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
	list_views:
		default:
			columns: ["name", "modified"]
	permissions:
		default:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 