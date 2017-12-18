Creator.Objects.crm_contracts = 
	name: "crm_contracts"
	label: "Contracts"
	icon: "contract"
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
		amount:
			type: "currency"
		start_date:
			type: "date"
		end_date: 
			type: "date"
		company_signed_id:
			type: "lookup"
			reference_to: "users"
		company_signed_date: 
			type: "date"
		customer_id:
			type: "lookup"
			reference_to: "crm_customers"
		customer_signed_date: 
			type: "date"


	list_views:
		default:
			columns: ["name", "customer_id", "company_signed_date", "company_signed_id"]
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