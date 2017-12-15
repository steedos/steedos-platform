Creator.Objects.flow_roles = 
	name: "flow_roles"
	label: "Flow Roles"
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
			columns: ["name", "description", "modified"]
	permissions:
		default:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 