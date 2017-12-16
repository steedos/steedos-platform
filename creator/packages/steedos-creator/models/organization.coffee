Creator.Objects.organizations = 
	name: "organizations"
	label: "Organizations"
	icon: "ion-ios-people-outline"
	fields:
		name: 
			label: "Name"
			type: "text"
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
			viewAllRecords: true 