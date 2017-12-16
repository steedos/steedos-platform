Creator.Objects.crm_contacts = 
	name: "crm_contacts"
	label: "Contacts"
	icon: "ion-ios-people-outline"
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
		customer_id: 
			label: "Customer"
			type: "master_detail"
			reference_to: "crm_customers"
			
	list_views:
		default:
			columns: ["name", "customer_id", "last_viewed"]
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