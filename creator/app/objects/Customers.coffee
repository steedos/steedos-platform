Creator.Objects.crm_customers = 
	name: "crm_customers"
	label: "Customers"
	icon: "account"
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
		recent:
			filter_scope: "all"
		all:
			filter_scope: "all"
			columns: ["name", "description", "modified", "owner"]
		mine:
			filter_scope: "mine"
	permissions:
		default:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
	related_list:
		crm_contacts:
			columns: ["name", "description", "modified"]