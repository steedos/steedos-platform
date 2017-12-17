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
		phone:
			type: "text"
		fax:
			type: "text"
		website: 
			type: "text"

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

	related_list:
		crm_contacts:
			columns: ["name", "description", "modified"]
		crm_contracts:
			columns: ["name", "description", "modified"]