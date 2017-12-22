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
				{label: "Warm", value: "normal"},
				{label: "Cold", value: "low"}
			]
		phone:
			type: "text"
		fax:
			type: "text"
		website: 
			type: "text"
		owner: 
			omit: false

	list_views:
		default:
			columns: ["name", "description", "modified"]
		recent:
			filter_scope: "space"
		all:
			filter_scope: "space"
			columns: ["name", "description", "modified", "owner"]
		mine:
			filter_scope: "mine"

	related_list:
		crm_contacts:
			columns: ["name", "email", "phone"]
		crm_contracts:
			columns: ["name", "amount", "company_signed_date", "company_signed_id"]

	actions: 
		export:
			visible: true
		print:
			label: "Print"
			on: "record"
			visible: true
			todo: ()->
				alert("you clicked on print button") 
