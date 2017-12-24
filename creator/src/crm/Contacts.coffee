Creator.Objects.crm_contacts = 
	name: "crm_contacts"
	label: "Contacts"
	icon: "contact"
	fields:
		name: 
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
		description: 
			type: "textarea"
		customer_id: 
			type: "master_detail"
			reference_to: "crm_customers"
		birthdate: 
			type: "date"
		title:
			type: "text"
		department:
			type: "text"
		email:
			type: "text"
		phone:
			type: "text"
		home_phone:
			type: "text"
		other_phone:
			type: "text"

	list_views:
		default:
			columns: ["name", "customer_id", "email", "phone"]
		recent:
			filter_scope: "space"
		all:
			filter_scope: "space"
			columns: ["name", "description", "email", "phone", "owner"]
		mine:
			filter_scope: "mine"
