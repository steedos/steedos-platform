Creator.Objects.crm_customers = 
	name: "crm_customers"
	label: "Customers"
	icon: "ion-ios-world-outline"
	fields:
		name: 
			label: "Name"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
		description: 
			label: "Description"
			type: "textarea"
		priority:
			label: "Priority"
			type: "select"
			options: [
				{label: "Hot", value: "high"},
				{label: "Warm", value: "nomal"},
				{label: "Cold", value: "low"}
			]

	list_views:
		default:
			columns: ["name", "description", "modified"]
	permissions:
		default:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
	related_list:
		contacts:
			columns: ["name", "description", "modified"]